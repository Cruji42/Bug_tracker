from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
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

origins = [
    "http://localhost/*",
    "http://localhost:8000/*",
    "http://127.0.0.1:8000/*",
    "http://127.0.0.1:8000/ticket",
    "http://127.0.0.1:8000/user/login"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ticket)
app.include_router(user)

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000)