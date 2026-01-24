const API_URL = 'http://127.0.0.1:8000';

function navegar(tela) {
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('emissoes').style.display = 'none';

const viewAlvo = document.getElementById(tela);
    if (viewAlvo) {
        viewAlvo.style.display = 'block';
    }

    if (tela === 'emissoes') {
        carregarTabela(); 
    }
}

async function carregarStats() {
    try {
        const response = await fetch(`${API_URL}/stats`);
        const data = await response.json();

        const fmt = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

        document.getElementById('quantidade').innerText = data.quantidade;
        document.getElementById('valor_total').innerText = fmt.format(data.valor_total);
        document.getElementById('ticket_medio').innerText = fmt.format(data.ticket_medio);

    } catch (error) {
        console.error("Erro stats:", error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    carregarStats();
    navegar('emissoes');
});