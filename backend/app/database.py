from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
import os

DIR_ATUAL = os.path.dirname(os.path.abspath(__file__))
DIR_RAIZ_BACKEND = os.path.dirname(DIR_ATUAL)
SQLALCHEMY_DATABASE_URL = f"sqlite:///{os.path.join(DIR_RAIZ_BACKEND, 'jgp.db')}"

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()