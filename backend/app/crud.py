from sqlalchemy.orm import Session
from sqlalchemy import func
from . import models
from . import schemas


def get_emissoes(db: Session):
    data = db.query(models.Emissao).all()
    return data

def get_emissao_id(db: Session, emissao_id: int):
    data = db.query(models.Emissao).filter(models.Emissao.id == emissao_id).first()
    return data

def update_emissao(db: Session, emissao_id: int, schema: schemas.EmissaoBase):
    data = db.query(models.Emissao).filter(models.Emissao.id == emissao_id).first()
    if not data:
        return None
    
    data.data = schema.data
    data.tipo = schema.tipo
    data.emissor = schema.emissor
    data.valor = schema.valor
    data.link = schema.link

    db.commit()
    db.refresh(data)

    return data

def get_stats(db: Session):
    qtd = db.query(func.count(models.Emissao.id)).scalar()
    
    valor_total = db.query(func.sum(models.Emissao.valor)).scalar()
    if valor_total is None:
        valor_total = 0.0

    ticket_medio = 0
    if qtd > 0:
        ticket_medio = valor_total/qtd
    
    media = db.query(func.avg(models.Emissao.valor)).scalar()

    valor_maximo = db.query(func.max(models.Emissao.valor)).scalar()

    valor_minimo = db.query(func.min(models.Emissao.valor)).scalar()

    return {"quantidade" : qtd,
            "valor_total" : valor_total,
            "ticket_medio" : ticket_medio,
            "media" : media,
            "valor_maximo" : valor_maximo,
            "valor_minimo" : valor_minimo}