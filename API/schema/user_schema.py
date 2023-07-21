from pydantic import BaseModel, EmailStr
from typing import Optional

class UserSchema(BaseModel):
    id: Optional[int]
    username: Optional[str]
    password: Optional[str]
    email: Optional[str]