from sqlalchemy import Column, Integer, Float, String, Date
from .database import Base

class Emissao(Base):
    __tablename__= "emissoes"

    id = Column(Integer, primary_key=True, index=True)
    data = Column(Date)
    tipo = Column(String)
    emissor = Column(String)
    valor = Column(Float)
    link = Column(String)