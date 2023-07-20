from fastapi import FastAPI
from router.user import user
import uvicorn
from router.ticket import ticket

app = FastAPI(
    title="Bug Tracker",
    description="API for Bug Tracker Project",
    version="1.0"
    '''docs_url="/docsapi",
    redoc_url=None'''
)

app.include_router(ticket)
app.include_router(user)

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000)