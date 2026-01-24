const API_URL = 'http://127.0.0.1:8000';

function navegar(tela) {
    document.getElementById(dashboard).style.display = 'none';
    document.getElementById(emissoes).style.display = 'none';

    document.getElementById(`view-${tela}`).style.display = 'block';
}

async function carregarStats() {
    try {
        const response = await fetch(`${API_URL}/stats`);
        const data = await response.json();

        const fmt = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

        document.getElementById('qtd').innerText = data.qtd;
        document.getElementById('valor_total').innerText = fmt.format(data.valor_total);
        document.getElementById('ticket_medio').innerText = fmt.format(data.ticket_medio);
        document.getElementById('valor_maximo').innerText = fmt.format(data.valor_maximo);
        document.getElementById('ticket_minimo').innerText = fmt.format(data.ticket_minimo);

    } catch (error) {
        console.error("Erro stats:", error);
    }
}