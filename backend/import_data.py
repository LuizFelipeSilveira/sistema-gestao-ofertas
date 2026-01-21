import pandas as pd
from app.database import engine
from app.models import Emissao

df = pd.read_excel('D:/00_DATA_SCIENCE/08_JGP/data/Primario 2025.xlsx')
df.columns = df.columns.str.lower()

try:
    df.to_sql(name='emissoes',
            con=engine,
            if_exists='append',
            index=False,
            chunksize=1000
            )
    print('Dados inseridos com sucesso.')

except:
    print('Falha na inserção de dados.')