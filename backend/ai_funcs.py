from langchain.text_splitter import TokenTextSplitter,  RecursiveCharacterTextSplitter
from langchain_openai import ChatOpenAI
from langchain_community.document_loaders import WebBaseLoader
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate

from langchain.chains import create_retrieval_chain

from langchain_core.pydantic_v1 import BaseModel, Field, validator

from langchain_community.utils.openai_functions import (
    convert_pydantic_to_openai_function,
)

from langchain.output_parsers.openai_functions import JsonKeyOutputFunctionsParser
from langchain_core.documents import Document


from dotenv import load_dotenv
import os
from typing import List

import firebase_admin
from firebase_admin import credentials, storage

from file_extract_tools import extract_text_from_pdf_byte_content, extract_text_from_excel, extract_file_type

load_dotenv()
OPENAI_APIKEY = os.getenv("OPENAI_API_KEY")

CRED = credentials.Certificate('./serviceAccountKey.json')
firebase_admin.initialize_app(CRED, {
    'storageBucket': 'lifehappens-293da.appspot.com'
})

def get_file_content_from_fb(fb_path):
    try:
       bucket = storage.bucket()
       blob = bucket.blob(fb_path)
       content = blob.download_as_string()
       return content
    except Exception as e:
       print(f"Error: {e}")
       return None


class Task(BaseModel):
    """Sub task for user."""

    title: str = Field(description="the name of the subtask to help the user finish their task.")
    notes: str = Field(description="notes expanding on how the user can achieve this sub task.")
    startDateISO: str = Field(description="The ISO date string of when to start the task")
    endDateISO: str = Field(description="The ISO date string of when to end the task. The difference between the start and end date should be a reasonable duration for the task")

class Tasks(BaseModel):
    """Sub tasks to help user complete their main task."""

    task: List[Task]

openai_functions = [convert_pydantic_to_openai_function(Tasks)]

class AIFunctions:
    """
    Holds all the AI functions to be called from app.py
    """
    def __init__(self) -> None:
        self.llm = ChatOpenAI(api_key=OPENAI_APIKEY)

    def generate_tasks(self, context_text, start_date_iso_string, end_date_iso_string, pre_existing_subtasks=[], file_paths=[]): 
        #TODO: Pass pre existing sub tasks and their durations
        #TODO: Limit the number of tasks that can be produced by the AI based on user's membership

        # Find and load the observed documents in firebase firestore
        docs = []

        for file_path in file_paths:
            file_type = extract_file_type(file_path)
            file_content = get_file_content_from_fb(file_path)
            if file_content is None:
                continue
            if file_type == "pdf":
                docs.append(Document(page_content=extract_text_from_pdf_byte_content(file_content)))
            elif file_type == "xlsx":
                docs.append(Document(page_content=extract_text_from_excel(file_content)))

        embeddings = OpenAIEmbeddings()

        # Read those documents with langchain as context
        text_splitter = TokenTextSplitter(chunk_size=3800, chunk_overlap=0)
        documents = text_splitter.split_documents(docs)
        vector = FAISS.from_documents(documents, embeddings)


        # Bind function calls to llm chain (https://python.langchain.com/docs/modules/model_io/chat/function_calling/ , https://python.langchain.com/docs/modules/model_io/output_parsers/types/openai_tools/)

        # Pass the name and dates of the pre existing subtasks as context

        prompt = ChatPromptTemplate.from_template("""The user needs to complete their task from """+start_date_iso_string+" to "+end_date_iso_string+"."+"""Help the user make 3 new sub tasks to finish their task based on the information available:

        <context>
        {context}
        </context>

        Task: {input}"""+"\nUser Provided Context:"+context_text + "\nPre-Existing Subtasks:\n" + self.__stringify_subtasks(pre_existing_subtasks))

        document_chain = create_stuff_documents_chain(self.llm, prompt)

        retriever = vector.as_retriever()
        retrieval_chain = create_retrieval_chain(retriever, document_chain)

        parser = JsonKeyOutputFunctionsParser(key_name="task")

        doc_response = retrieval_chain.invoke({"input": "What are the next steps to complete the app?"})

        parser_prompt = ChatPromptTemplate.from_template("""The user needs to completer their task from """+start_date_iso_string+" to "+end_date_iso_string+"."+"""Help the user make 3 new sub tasks to finish their task based on the information available:

        <context>
        """+doc_response['answer']+"""
        </context>

        Task: {input}"""+"\nUser Provided Context:"+context_text + "\nPre-Existing Subtasks:\n" + self.__stringify_subtasks(pre_existing_subtasks))

        document_chain = create_stuff_documents_chain(self.llm, prompt)

        chain = parser_prompt | self.llm.bind(functions=openai_functions) | parser

        response = chain.invoke({"input": "I need to build an AI that can scan documents and summarize them."})
        return response
    
    def __convert_files_to_txt(self):
        pass

    def __stringify_subtasks(self, pre_existing_subtasks=[]):
        text = ""
        for task in pre_existing_subtasks:
            text += "title: " + task["title"] + '\n'
            text += "ISO_start_date: " + task["start"] + '\n'
            text += "ISO_end_date: " + task["end"] + '\n\n'
        return text


    def display_tools(self):
        print(self.llm.kwargs["tools"])



if __name__ == "__main__":
   # Initialize Firebase Admin SDK
    obj = AIFunctions()
    print(obj.generate_tasks("", "2024-04-22T19:54:02+0000", "2024-04-24T20:54:02+0000", [{
        "title":"Collect documents",
        "start":"2024-04-22T19:54:02+0000",
        "end":"2024-04-22T20:54:02+0000"
    }], ["Users/user-1/task-1/DailyScrum 4_3.xlsx", "Users/user-1/task-1/Sprint 1 Presentation.pdf"]))