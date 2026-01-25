from sqlalchemy import Column, Integer, Float, String, Date, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from .database import Base

class Emissao(Base):
    __tablename__= "emissoes"

    id = Column(Integer, primary_key=True, index=True)
    data = Column(Date)
    tipo = Column(String)
    emissor = Column(String)
    valor = Column(Float)
    link = Column(String)

    historico_logs = relationship("Historico", back_populates="emissao")

class Historico(Base):
    __tablename__ = "historico"

    id = Column(Integer, primary_key=True, index=True)
    emissoes_id = Column(Integer, ForeignKey('emissoes.id'))
    data_modificacao = Column(DateTime)
    campo_alterado = Column(String)
    valor_antigo = Column(String)
    valor_novo = Column(String)

    emissao = relationship("Emissao", back_populates="historico_logs")

    