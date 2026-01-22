from sqlalchemy.orm import Session
from . import models

def get_emissoes(db: Session):
    data = db.query(models.Emissao).all()
    return data