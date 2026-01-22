from pydantic import BaseModel
from datetime import date

class EmissaoBase(BaseModel):
    data: date
    tipo: str
    emissor: str
    valor: float
    link: str

class EmissaoResponse(EmissaoBase):
    id: int

    class Config:
        from_attributes = True

