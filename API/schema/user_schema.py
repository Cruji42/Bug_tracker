from pydantic import BaseModel, EmailStr
from typing import Optional

class UserSchema(BaseModel):
    id: Optional[int]
    username: str
    password: str
    email: EmailStr | None
