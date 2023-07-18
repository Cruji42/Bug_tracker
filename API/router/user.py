from fastapi import APIRouter, status, Request
from fastapi.responses import JSONResponse
from starlette.status import HTTP_201_CREATED, HTTP_204_NO_CONTENT, HTTP_401_UNAUTHORIZED
from schema.user_schema import UserSchema
from config.db import engine
from typing import List
from model.persistence import users
from sqlalchemy.exc import IntegrityError

user = APIRouter(prefix="/user")

@user.get("/", response_model=List[UserSchema], tags=["user"])
def getUser():
    with engine.connect() as conn:
        result = conn.execute(users.select()).fetchall()
        return result

@user.get("/{idUser}", response_model=None, tags=["user"])
def getSingleUser(idUser: str):
    import pdb
    pdb.set_trace()
    with engine.connect() as conn:
            result = conn.execute(users.select().where(users.c.id == idUser)).first()
            
            print("Result from DB", result)
            if result != None:
                return result
            _status = status.HTTP_500_INTERNAL_SERVER_ERROR
            result =  {"error":True, "message":"User not found"}
                
            return JSONResponse(status_code=_status, content=result)

        
@user.post("/",response_model=UserSchema, tags=["user"])
def addUser(data_user: UserSchema):
    with engine.connect() as conn: 
        try:
            new_user = data_user.dict()
            
            #METADATA
            conn.execute(users.insert().values(new_user))
            #return Response(status_code=HTTP_201_CREATED)
            _status = status.HTTP_201_CREATED
            result =  {"error":False, "message":"User created successfully"}
                
            return JSONResponse(status_code=_status, content=result)
        except IntegrityError as exc:
            _status = status.HTTP_500_INTERNAL_SERVER_ERROR
            result =  {"error":True, "code":exc.orig.args[0], "message":"Error at create user: " + exc.orig.args[1]}
                
            return JSONResponse(status_code=_status, content=result)
        
@user.put("/user/{idUser}", status_code=200, tags=['user'])
def update_user(data_user: UserSchema, idUser: str):
    with engine.connect() as conn:
        try:
            conn.execute(users.update().values(username=data_user.username, email=data_user.email,password=data_user.password).where(users.c.id == idUser))
            
            result = conn.execute(users.select().where(users.c.id == idUser)).first() 
    
            if result != None:
                data = {"error":False, "message":"User updated."}
                _status = status.HTTP_200_OK
            else:
                data = {"error":True, "message":"Error in update user. User not found with this ID: " + idUser}
                _status = status.HTTP_400_BAD_REQUEST
                
            
            return JSONResponse(status_code=_status, content=data)
        except IntegrityError as exc:

            result = {"error":True,  "codigo":exc.orig.args[0], "message":"Something went wrong with the DB. "  +  exc.orig.args[1]}
            _status = status.HTTP_400_BAD_REQUEST
            return JSONResponse(status_code=_status, content=result)
        
@user.delete("/user/{idUser}", status_code=200, tags=["user"])
def deleteUser(idUser: str):
    with engine.connect() as conn:
        try:
            conn.execute(users.delete().where(users.c.id == idUser))
            
            result = {"error":False, "message":"User deleted"}
            _status = status.HTTP_200_OK
            return JSONResponse(status_code=_status, content=result)
            
        except IntegrityError as exc:

            result = {"error":True, "codigo":exc.orig.args[0], "message":"Something went wrong with the DB. " +  exc.orig.args[1]}
            _status = status.HTTP_400_BAD_REQUEST
            return JSONResponse(status_code=_status, content=result)