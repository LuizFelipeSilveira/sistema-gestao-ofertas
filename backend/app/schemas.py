from pydantic import BaseModel
from datetime import date, datetime

class EmissaoBase(BaseModel):
    data: date
    tipo: str
    emissor: str
    valor: float
    link: str

class Emissao(EmissaoBase):
    id: int

    class Config:
        from_attributes = True

class EmissaoCreate(EmissaoBase):
    pass

class HistoricoBase(BaseModel):
    campo_alterado: str
    valor_antigo: str
    valor_novo: str
    data_modificacao: datetime

class Historico(HistoricoBase):
    id: int
    emissoes_id: int

    class Config:
        from_attributes = True

