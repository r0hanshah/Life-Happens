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


from dotenv import load_dotenv
import os
from typing import List

load_dotenv()
OPENAI_APIKEY = os.getenv("OPENAI_API_KEY")


class Task(BaseModel):
    """Sub tasks for user."""

    title: str = Field(description="the name of the subtask to help the user finish their task.")
    notes: str = Field(description="notes expanding on how the user can achieve this sub task.")

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

    def generate_tasks(self, context_text, start_date_iso_string, end_date_iso_string):
        # Find and load the observed documents in firebase firestore
        loader = WebBaseLoader("https://docs.smith.langchain.com/user_guide") #TODO: Have this be an array of links from storage

        docs = loader.load()
        embeddings = OpenAIEmbeddings()

        # Read those documents with langchain as context
        text_splitter = RecursiveCharacterTextSplitter()
        documents = text_splitter.split_documents(docs)
        vector = FAISS.from_documents(documents, embeddings)


        # Bind function calls to llm chain (https://python.langchain.com/docs/modules/model_io/chat/function_calling/ , https://python.langchain.com/docs/modules/model_io/output_parsers/types/openai_tools/)
        


        # Pass your context prompt as context

        # Pass the name and dates of the pre existing subtasks as context

        prompt = ChatPromptTemplate.from_template("""Help the user make sub tasks to finish their task based on the information available:

        <context>
        {context}
        </context>

        Task: {input}""")

        document_chain = create_stuff_documents_chain(self.llm, prompt)

        retriever = vector.as_retriever()
        retrieval_chain = create_retrieval_chain(retriever, document_chain)

        parser = JsonKeyOutputFunctionsParser(key_name="task")

        doc_response = retrieval_chain.invoke({"input": "I need to build an AI that can scan documents and summarize them."})
        
        parser_prompt = ChatPromptTemplate.from_template("Help the user make sub tasks to finish their task based on the information available:\n\n<context>\n"+doc_response['answer']+"\n</context>\n\nTask: {input}")

        chain = parser_prompt | self.llm.bind(functions=openai_functions) | parser

        response = chain.invoke({"input": "I need to build an AI that can scan documents and summarize them."})
        return response
    
    def ___convert_files_to_txt(self):
        pass

    def display_tools(self):
        print(self.llm.kwargs["tools"])

if __name__ == "__main__":
    obj = AIFunctions()
    print(obj.generate_tasks("", "", ""))