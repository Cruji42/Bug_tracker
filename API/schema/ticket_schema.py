from datetime import datetime
from pydantic import BaseModel
from typing import Optional
import datetime

class TicketSchema(BaseModel):
    id: Optional[int]
    name: str
    description: str
    priority: str
    status: str
    assignee: int
    creation_date: Optional[datetime.datetime]
    deadline: datetime.datetime
    archived: int