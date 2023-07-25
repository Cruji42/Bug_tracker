from fastapi import APIRouter, status, Request
from fastapi.responses import JSONResponse
from starlette.status import HTTP_201_CREATED, HTTP_204_NO_CONTENT, HTTP_401_UNAUTHORIZED
from schema.ticket_schema import TicketSchema
from config.db import engine
from typing import List
from model.persistence import tickets
from sqlalchemy.exc import IntegrityError
import requests
import jwt

ticket = APIRouter(prefix="/ticket")

@ticket.get("/", response_model=List[TicketSchema], tags=["ticket"])
def getTicket():
    import pdb
    pdb.set_trace()
    session = requests.session()
    encoded_jwt = session.cookies.get("token")
    validator = jwt.decode(encoded_jwt, algorithms=['HS256',], key='$126K4600a')
    if validator:
        with engine.connect() as conn:
            result = conn.execute(tickets.select()).fetchall()
            return result
    else:
        result = {"error":True, "message":"Not authentication"}
        return result

    

@ticket.get("/{idTicket}", response_model=None, tags=["ticket"])
def getSingleTicket(idTicket: str):
    with engine.connect() as conn:
            result = conn.execute(tickets.select().where(tickets.c.id == idTicket)).first()
            
            print("Result from DB", result)
            if result != None:
                return result
            _status = status.HTTP_500_INTERNAL_SERVER_ERROR
            result =  {"error":True, "message":"Ticket not found"}
                
            return JSONResponse(status_code=_status, content=result)

        
@ticket.post("/",response_model=TicketSchema, tags=["ticket"])
def addTicket(data_ticket: TicketSchema):
    with engine.connect() as conn: 
        try:
            new_ticket = data_ticket.dict()
            
            #METADATA
            conn.execute(tickets.insert().values(new_ticket))
            #return Response(status_code=HTTP_201_CREATED)
            _status = status.HTTP_201_CREATED
            result =  {"error":False, "message":"Ticket created successfully"}
                
            return JSONResponse(status_code=_status, content=result)
        except IntegrityError as exc:
            _status = status.HTTP_500_INTERNAL_SERVER_ERROR
            result =  {"error":True, "code":exc.orig.args[0], "message":"Error at create ticket: " + exc.orig.args[1]}
                
            return JSONResponse(status_code=_status, content=result)
        
@ticket.put("/{idTicket}", status_code=200, tags=['ticket'])
def update_ticket(data_ticket: TicketSchema, idTicket: str):
    with engine.connect() as conn:
        try:
            conn.execute(tickets.update().values(name=data_ticket.name, description=data_ticket.description,priority=data_ticket.priority,status=data_ticket.status,assignee=data_ticket.assignee,creation_date=data_ticket.creation_date,deadline=data_ticket.deadline, archived=data_ticket.archived).where(tickets.c.id == idTicket))  
            result = conn.execute(tickets.select().where(tickets.c.id == idTicket)).first() 
    
            if result != None:
                data = {"error":False, "message":"Ticket updated."}
                _status = status.HTTP_200_OK
            else:
                data = {"error":True, "message":"Error in update ticket. Ticket not found with this ID: " + idTicket}
                _status = status.HTTP_400_BAD_REQUEST
                
            
            return JSONResponse(status_code=_status, content=data)
        except IntegrityError as exc:

            result = {"error":True,  "codigo":exc.orig.args[0], "message":"Something went wrong with the DB. "  +  exc.orig.args[1]}
            _status = status.HTTP_400_BAD_REQUEST
            return JSONResponse(status_code=_status, content=result)
        
@ticket.delete("/{idTicket}", status_code=200, tags=["ticket"])
def deleteTicket(idTicket: str):
    with engine.connect() as conn:
        try:
            conn.execute(tickets.delete().where(tickets.c.id == idTicket))
            
            result = {"error":False, "message":"Ticket deleted"}
            _status = status.HTTP_200_OK
            return JSONResponse(status_code=_status, content=result)
            
        except IntegrityError as exc:

            result = {"error":True, "codigo":exc.orig.args[0], "message":"Something went wrong with the DB. " +  exc.orig.args[1]}
            _status = status.HTTP_400_BAD_REQUEST
            return JSONResponse(status_code=_status, content=result)