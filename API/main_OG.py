from typing import List

import databases
import sqlalchemy
import uvicorn
from fastapi import FastAPI
from pydantic import BaseModel

# SQLAlchemy specific code, as with any other app
DATABASE_URL = "mysql://root:root@localhost/bug_tracker"

database = databases.Database(DATABASE_URL)

metadata = sqlalchemy.MetaData()

tbl_users = sqlalchemy.Table(
    "users",
    metadata,
    sqlalchemy.Column("id", sqlalchemy.Integer, primary_key=True),
    sqlalchemy.Column("username", sqlalchemy.String),
    sqlalchemy.Column("email", sqlalchemy.String),
    sqlalchemy.Column("password", sqlalchemy.String)
)


engine = sqlalchemy.create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}
)
metadata.create_all(engine)


class NoteIn(BaseModel):
    text: str
    completed: bool


class User(BaseModel):
    username: str
    email: str
    password: str
    active: bool | None = None #This means that the parameter could be null

app = FastAPI()

@app.on_event("startup")
async def startup():
    await database.connect()


@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()


@app.get("/users/", response_model=List[User])
async def read_notes():
    query = tbl_users.select()
    return await database.fetch_all(query)


@app.post("/notes/", response_model=User)
async def create_note(note: NoteIn):
    query = tbl_users.insert().values(text=note.text, completed=note.completed)
    last_record_id = await database.execute(query)
    return {**note.dict(), "id": last_record_id}



@app.get("/items/{item_id}")
async def read_item(item_id):
    return {"item_id": item_id}

@app.post("/items/")
async def create_item(item: User):
    print("This is the user:" + item.username)
    return item

#this will be usefull at the moment to make the update
@app.put("/items/{username}")
async def create_item_2(username: str, item: User):
    print("Entro a esta" + username)
    return {"username": username, **item.dict()}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)