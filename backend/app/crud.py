from sqlalchemy.orm import Session
from . import models

def get_emissoes(db: Session):
    data = db.query(models.Emissao).all()
    return data

def get_emissao_id(db: Session, emissao_id: int):
    data = db.query(models.Emissao).filter(models.Emissao.id == emissao_id).first()
    return data