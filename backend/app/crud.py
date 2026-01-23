from sqlalchemy.orm import Session
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