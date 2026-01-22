from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from . import schemas, crud
from .database import SessionLocal, engine, Base

def get_db():
    session = SessionLocal()
    try:
        yield session
        session.commit()

    except:
        session.rollback()
        raise

    finally:
        session.close()

app = FastAPI()

Base.metadata.create_all(engine)

@app.get("/emissoes", response_model=list[schemas.EmissaoResponse])
def list_emissoes(db:Session = Depends(get_db)):
    try:
        emissoes = crud.get_emissoes(db)
        return emissoes
    except Exception as e:
        print(f'Erro:{e}')