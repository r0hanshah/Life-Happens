# Life-Happens

# Overview
Life Happens is a cutting-edge productivity application designed to revolutionize the way students and employees manage their tasks and schedules. Utilizing the advanced capabilities of generative AI with GPT-3.5, Life Happens offers a unique approach to task management. Our solution aims to keep users accountable, dynamically adjust their calendars, and generate subtasks to ensure tasks are completed on time. In the face of life's unpredictable events, Life Happens provides a reliable tool for planning and staying on track without stress.

# Features
AI-Driven Task Management: Automatically divides workloads into manageable tasks over a specified timeframe.
Dynamic Calendar Adjustments: Adapts to life’s inconveniences, ensuring that you remain productive.
Subtask Generation: Breaks down tasks into smaller, actionable steps for easier management.
Student and Employee Focus: Tailored features to enhance productivity, timeliness, and study habits.
Appealing Workflow Presentation: Delivers automated workflows in a visually appealing format.
For Whom?
Life Happens is for students and employees seeking a simple yet efficient method to manage their workloads. It's perfect for those who need assistance in breaking down their goals and deadlines into manageable chunks.

# Technology Stack
Frontend: Typescript, React JS, React Native
Backend: Python with Flask
Database: Firebase
APIs: OpenAI API, Google Calendar

# Getting Started
To get started with Life Happens, follow these steps:

Clone the repository to your local machine.
Install the necessary dependencies for both frontend and backend.
Follow the setup instructions for Firebase and the OpenAI API plug-in.
Run the backend server and frontend application as per the documentation.


# Installation

To set up the Life Happens application on your local machine, you'll need to install the dependencies for both the frontend and the backend. Below are step-by-step instructions to get you up and running.

## Frontend Installation

1. Open your terminal and change the directory to the frontend folder of the cloned repository:

    ```
    cd /path/to/Life-Happens/frontend
    ```

2. Run the following command to install all the necessary frontend dependencies:

    ```
    npm install
    ```

3. Once the installation is complete, you can start the frontend server with:

    ```
    npm start
    ```

    This command will launch the Life Happens application in your default web browser.

## Backend Installation

1. Now, open a new terminal window or tab and navigate to the backend directory:

    ```
    cd /path/to/Life-Happens/backend
    ```

2. Create a Python virtual environment in the backend directory:

    ```
    python -m venv venv
    ```

    On Windows, you might need to use `python3` or the specific path to the Python executable.

3. Activate the virtual environment. The command depends on your operating system:

    - On macOS and Linux:

    ```
    source venv/bin/activate
    ```

    - On Windows:

    ```
    .\venv\Scripts\activate
    ```

4. With the virtual environment activated, install the backend dependencies:

    ```
    pip install -r requirements.txt
    ```



5. Before running the server, set up the required environment variables:

    - Create a `.env` file in the `backend` directory:

    ```plaintext
    OPENAI_API_KEY=your_openai_api_key_here
    ```

    Replace `your_openai_api_key_here` with the API key you obtained from the OpenAI website.

    - Obtain the `serviceAccountKey.json` file for your Firebase project and place it in the `backend` directory.


6. Finally, start the backend server. You can use Flask's command or directly run the app:

    - Using Flask's command:

    ```
    flask run
    ```

    - Running the script directly:

    ```
    python app.py
    ```

    Make sure the `FLASK_APP` environment variable is set if you use `flask run`.

You should now have both the frontend and backend servers running. The backend API will be available for the frontend to make requests to, and you can begin using the Life Happens application to manage tasks effectively.
