from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
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

origins = [
    "http://localhost:5500",
    "http://127.0.0.1:5500",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(engine)

@app.get("/emissoes", response_model=list[schemas.EmissaoResponse])
def list_emissoes(db:Session = Depends(get_db)):
    try:
        emissoes = crud.get_emissoes(db)
        return emissoes
    except Exception as e:
        print(f'Erro:{e}')

@app.get("/emissoes/{id}", response_model=schemas.EmissaoResponse)
def list_emissao(id:int, db:Session = Depends(get_db)):
    emissao = crud.get_emissao_id(db, id)
    if emissao is None:
        raise HTTPException(404, detail="Erro: Emissão não encontrada...")
    return emissao

@app.put("/emissoes/{id}", response_model=schemas.EmissaoResponse)
def update_emissao(id:int, schema: schemas.EmissaoBase, db:Session = Depends(get_db)):
    emissao = crud.update_emissao(db, id, schema)
    if emissao is None:
        raise HTTPException(404, detail="Erro: Emissão não encontrada...")
    
    return emissao
    
@app.get("/stats")
def get_stats(db:Session = Depends(get_db)):
    stats = crud.get_stats(db)
    return stats

@app.get("/analytics")
def get_analytics(db: Session = Depends(get_db)):
    return crud.get_dados_dashboard(db)