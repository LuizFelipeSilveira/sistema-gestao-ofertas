# 📊 Sistema de gestão de emissão de ofertas

A aplicação tem como objetivo a visualização, e gerenciamento de ofertas emitidas. O projeto inclui importação dos dados em Excel, CRUD, dashboard analítico e edição de efertas com registro em histórico. 

## Tecnologias utilizadas

### Backend
- **Python 3.12** e **FastAPI**: Ferramentas escolhidas pelo alto desempenho e documentação automática (Swagger).
- **SQLAlchemy**: ORM que permite parametrização e maior nível de segurança em operações no banco de dados.
- **Pydantic**: Validação de dados e integração entre API e banco de dados.
- **SQLite**: Banco de dados leve e serverless.

### Frontend
- **HTML5/CSS3/Vanilla JS**: Implementação leve para manipulação direta do DOM.
- **Chart.js**: Utilizado para criação de gráficos do dashboard.
- **Nginx**: Servidor web performático para servir arquivos no ambiente Docker.

## Instruções de uso

### Pré-requisito
- Docker
- Python para execução de script de inserção de dados

### Etapa 1

Com o repositório clonado, subir os containers no Docker no terminal com o comando: 


**docker-compose up -d --build**


### Etapa 2

Em seguida, na pasta raiz do projeto, digite os comandos para inserir os dados no banco:


**cd backend**

**pip install -r requirements.txt**

**python import_data.py**


### Etapa 3

Acesse a aplicação pelo link **http://localhost**

## Atributos da aplicação

- **Validação dos dados**: A aplicação conta com validação visual no Frontend, que retorna feedback ao usuários em casos de inserção de dados não permitidas, assim como validação no backend com o Pydantic que impede que dados inválidos cheguem ao banco.
- **Histórico de Alterações**: Todas as alterações das ofertas são registradas em uma tabela Historico, registrando a data e valores "antes e depois" de cada alteração, garantindo rastreabilidade.

## Melhorias futuras

- **Banco de dados mais robusto**: Migrar para banco mais robustos como o PostgreSQL para suportar dados mais complexos e alta concorrência.
- **Filtragem de dados no backend**: Atualmente a filtragem é feita no frontend, mas poderia ser implemntada na API para evitar sobrecargas na transferência.
- **Testes automatizados**: Implementar testes com Pytest para os endpoints da API.



