from sqlalchemy.orm import Session
from sqlalchemy import func, extract, desc
from datetime import datetime
from . import models, schemas


def get_emissoes(db: Session):
    data = db.query(models.Emissao).all()
    return data

def get_emissao_id(db: Session, emissao_id: int):
    data = db.query(models.Emissao).filter(models.Emissao.id == emissao_id).first()
    return data

def update_emissao(db: Session, emissao_id: int, dados_novos: schemas.EmissaoCreate):

    data = db.query(models.Emissao).filter(models.Emissao.id == emissao_id).first()
    if not data:
        return None
    
    dados_dict = dados_novos.model_dump()
    campos_para_monitorar = ['emissor', 'valor', 'tipo', 'link']
    
    for campo in campos_para_monitorar:
        valor_antigo = getattr(data, campo)
        valor_novo = dados_dict.get(campo)

        if str(valor_antigo) != str(valor_novo):
            log = models.Historico(
                emissoes_id=data.id,
                campo_alterado=campo,
                valor_antigo=str(valor_antigo),
                valor_novo=str(valor_novo),
                data_modificacao=datetime.now()
            )
            db.add(log)
    
    for key, value in dados_dict.items():
        setattr(data, key, value)

    db.commit()
    db.refresh(data)
    return data

def get_stats(db: Session):
    qtd = db.query(func.count(models.Emissao.id)).scalar()
    
    valor_total = db.query(func.sum(models.Emissao.valor)).scalar()
    if valor_total is None:
        valor_total = 0.0

    ticket_medio = 0
    if qtd > 0:
        ticket_medio = valor_total/qtd

    valor_maximo = db.query(func.max(models.Emissao.valor)).scalar()

    valor_minimo = db.query(func.min(models.Emissao.valor)).scalar()

    return {"quantidade" : qtd,
            "valor_total" : valor_total,
            "ticket_medio" : ticket_medio,
            "valor_maximo" : valor_maximo,
            "valor_minimo" : valor_minimo}

def get_dados_dashboard(db: Session):
    evolucao_query = db.query(
        extract('month', models.Emissao.data).label('mes'),
        func.sum(models.Emissao.valor)
    ).group_by('mes').order_by('mes').all()

    nomes_meses = ["", "Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]
    
    meses_labels = [nomes_meses[int(x[0])] for x in evolucao_query]
    meses_valores = [x[1] for x in evolucao_query]
    
    media_evolutiva = []
    soma_atual = 0
    for i, valor in enumerate(meses_valores):
        soma_atual += valor
        qtd_meses = i + 1
        media_evolutiva.append(soma_atual / qtd_meses)

    qtd_tipo_query = db.query(
        models.Emissao.tipo,
        func.count(models.Emissao.id)
    ).group_by(models.Emissao.tipo).all()

    valor_tipo_query = db.query(
        models.Emissao.tipo,
        func.sum(models.Emissao.valor)
    ).group_by(models.Emissao.tipo).order_by(desc(func.sum(models.Emissao.valor))).all()

    top_emissores_query = db.query(
        models.Emissao.emissor,
        func.sum(models.Emissao.valor)
    ).group_by(models.Emissao.emissor).order_by(desc(func.sum(models.Emissao.valor))).limit(5).all()

    top_names = [x[0] for x in top_emissores_query]

    detalhe_query = db.query(
            models.Emissao.emissor,
            models.Emissao.tipo,
            func.count(models.Emissao.id),
            func.sum(models.Emissao.valor)
        ).filter(models.Emissao.emissor.in_(top_names)).group_by(models.Emissao.emissor, models.Emissao.tipo).order_by(models.Emissao.emissor).all()
    
    return {
            "evolucao": {
                "labels": meses_labels,
                "valores": meses_valores,
                "media": media_evolutiva
            },
            "qtd_por_tipo": [{"label": x[0], "value": x[1]} for x in qtd_tipo_query],
            "valor_por_tipo": [{"label": x[0], "value": x[1]} for x in valor_tipo_query],
            "top_emissores": [{"label": x[0], "value": x[1]} for x in top_emissores_query],
            "tabela_cruzada": [
                {"emissor": x[0], "tipo": x[1], "qtd": x[2], "valor": x[3]} 
                for x in detalhe_query
            ]
        }

def get_historico(db: Session, emissao_id: int):
    return db.query(models.Historico).filter(models.Historico.emissoes_id == emissao_id).order_by(models.Historico.data_modificacao.desc()).all()