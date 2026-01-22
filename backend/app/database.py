from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

engine = create_engine("sqlite:///./jgp.db", connect_args={"check_same_thread":False})

SessionLocal = sessionmaker(engine,
                            autoflush=False,
                            autocommit=False)

Base = declarative_base()