from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from . import schemas, crud
from typing import List
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

origins = [
    "http://localhost:5500",
    "http://127.0.0.1:5500",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

Base.metadata.create_all(engine)

@app.get("/emissoes", response_model=list[schemas.Emissao])
def list_emissoes(db:Session = Depends(get_db)):
    try:
        emissoes = crud.get_emissoes(db)
        return emissoes
    except Exception as e:
        print(f'Erro:{e}')

@app.get("/emissoes/{id}", response_model=schemas.Emissao)
def list_emissao(id:int, db:Session = Depends(get_db)):
    emissao = crud.get_emissao_id(db, id)
    if emissao is None:
        raise HTTPException(404, detail="Erro: Emissão não encontrada...")
    return emissao

@app.put("/emissoes/{emissao_id}", response_model=schemas.Emissao)
def update_emissao(emissao_id: int, emissao: schemas.EmissaoCreate, db: Session = Depends(get_db)):
    db_emissao = crud.update_emissao(db, emissao_id=emissao_id, dados_novos=emissao)
    if db_emissao is None:
        raise HTTPException(status_code=404, detail="Emissão não encontrada")
    return db_emissao

@app.get("/emissoes/{emissao_id}/historico", response_model=List[schemas.Historico])
def read_historico(emissao_id: int, db: Session = Depends(get_db)):
    return crud.get_historico(db, emissao_id=emissao_id)
    
@app.get("/stats")
def get_stats(db:Session = Depends(get_db)):
    stats = crud.get_stats(db)
    return stats

@app.get("/analytics")
def get_analytics(db: Session = Depends(get_db)):
    return crud.get_dados_dashboard(db)