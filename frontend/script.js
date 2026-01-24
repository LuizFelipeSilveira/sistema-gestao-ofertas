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

function filtrarTabela() {
    const termo = document.getElementById('input-busca').value.toLowerCase();
    const linhas = document.querySelectorAll('#tabela-corpo tr');

    linhas.forEach(linha => {
        const textoDaLinha = linha.innerText.toLowerCase();
        if (textoDaLinha.includes(termo)) {
            linha.style.display = '';
        } else {
            linha.style.display = 'none';
        }
    });
}

async function carregarTabela() {
    const tbody = document.getElementById('tabela-corpo');
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding: 20px;">Atualizando...</td></tr>';

    try {
        const response = await fetch(`${API_URL}/emissoes`);
        const listaEmissoes = await response.json();

        tbody.innerHTML = '';
        const fmtMoeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
        
        listaEmissoes.forEach(emissao => {
            const linkIcon = emissao.link 
                ? `<a href="${emissao.link}" target="_blank" title="Ver Documento" style="color: #555; font-size: 1.1rem;">
                     <i class="fa-solid fa-arrow-up-right-from-square"></i>
                   </a>` 
                : `<span style="color: #ccc;">-</span>`;

            const tr = document.createElement('tr');
            tr.style.borderBottom = "1px solid #eee";
            
            const dataFormatada = new Date(emissao.data).toLocaleDateString('pt-BR', {timeZone: 'UTC'});

            tr.innerHTML = `
                <td style="padding: 15px; color: #555;">${dataFormatada}</td>
                <td style="padding: 15px; font-weight: bold;">${emissao.emissor}</td>
                <td style="padding: 15px;">${emissao.tipo}</td>
                <td style="padding: 15px; color: #30ba09; font-weight: bold;">${fmtMoeda.format(emissao.valor)}</td>
                <td style="padding: 15px; text-align: center;">${linkIcon}</td>
                <td style="padding: 15px; text-align: center;">
                    <button onclick="abrirModalEdicao(${emissao.id})" style="cursor: pointer; background: none; border: none; font-size: 1.1rem; color: #555;" title="Editar">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });

    } catch (error) {
        console.error("Erro tabela:", error);
        tbody.innerHTML = '<tr><td colspan="6" style="color: red; text-align: center;">Erro ao carregar dados.</td></tr>';
    }
}

function filtrarTabela() {
    const termoData = document.getElementById('filtro-data').value.toLowerCase();
    const termoEmissor = document.getElementById('filtro-emissor').value.toLowerCase();
    const termoTipo = document.getElementById('filtro-tipo').value.toLowerCase();

    const linhas = document.querySelectorAll('#tabela-corpo tr');

    linhas.forEach(linha => {
        const colunas = linha.getElementsByTagName('td');

        if (colunas.length < 4) return;

        const textoData = colunas[0].innerText.toLowerCase();
        const textoEmissor = colunas[1].innerText.toLowerCase();
        const textoTipo = colunas[2].innerText.toLowerCase();

        const bateuData = textoData.includes(termoData);
        const bateuEmissor = textoEmissor.includes(termoEmissor);
        const bateuTipo = textoTipo.includes(termoTipo);

        if (bateuData && bateuEmissor && bateuTipo) {
            linha.style.display = '';
        } else {
            linha.style.display = 'none';
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    carregarStats();
    navegar('emissoes');
});