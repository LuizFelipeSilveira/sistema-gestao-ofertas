from pydantic import BaseModel, field_validator
from datetime import date, datetime
from typing import List, Optional

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
    @field_validator('valor')
    def valor_positivo(cls, v):
        if v <= 0:
            raise ValueError('O valor deve ser maior que zero')
        return v
    
    @field_validator('emissor')
    def emissor_nao_vazio(cls, v):
        if not v or v.strip() == "":
            raise ValueError('O nome do emissor é obrigatório')
        return v

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

