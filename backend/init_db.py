from app.database import Base, engine
from app.models import Emissao

Base.metadata.create_all(engine)