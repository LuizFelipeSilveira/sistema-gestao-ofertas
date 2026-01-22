import pandas as pd
import os
from app.database import engine
from app.models import Emissao


BASE_DIR = os.path.dirname(os.path.abspath(__file__)) # Pasta backend/
DATA_DIR = os.path.join(os.path.dirname(BASE_DIR), 'data') # Pasta data/
ARQUIVO_EXCEL = os.path.join(DATA_DIR, 'Primario 2025.xlsx')

try:
    df = pd.read_excel(ARQUIVO_EXCEL)
    df.columns = df.columns.str.lower()
    df['data'] = pd.to_datetime(df['data']).dt.date

    df.to_sql(name='emissoes',
            con=engine,
            if_exists='append',
            index=False,
            chunksize=1000
            )
    print('Dados inseridos com sucesso.')

except:
    print('Falha na inserção de dados.')