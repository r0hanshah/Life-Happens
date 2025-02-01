import asyncio
from celery import Celery

app = Celery('tasks', broker='redis://localhost:6379/0')

@app.task
def my_async_task(arg1, arg2):

    # Perform your asynchronous work here
    print("here")

    return "hello"

async def call_task_async():

    result = my_async_task.apply_async(args=[1, 2])

    print(result)


if __name__ == "__main__":
    asyncio.run(call_task_async())