from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base

engine = create_engine("sqlite:///./jgp.db", connect_args={"check_same_thread":False})

Base = declarative_base()