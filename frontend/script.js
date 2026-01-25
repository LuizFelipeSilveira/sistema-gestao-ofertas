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

async function abrirModalEdicao(id) {
    try {
        const response = await fetch(`${API_URL}/emissoes/${id}`);
        if (!response.ok) throw new Error("Erro ao buscar dados");
        const dados = await response.json();

        document.getElementById('edit-id').value = dados.id;
        document.getElementById('edit-emissor').value = dados.emissor;
        document.getElementById('edit-tipo').value = dados.tipo;
        document.getElementById('edit-valor').value = dados.valor;
        document.getElementById('edit-link').value = dados.link || "";

        const dataFormatada = dados.data.split('T')[0];
        document.getElementById('edit-data').value = dataFormatada;

        document.getElementById('modal-edicao').style.display = 'flex';

    } catch (error) {
        alert("Erro ao carregar dados para edição.");
        console.error(error);
    }
}

function fecharModal() {
    document.getElementById('modal-edicao').style.display = 'none';
}

document.getElementById('form-edicao').addEventListener('submit', async function(event) {
    event.preventDefault(); 

    const id = document.getElementById('edit-id').value;
    const dadosAtualizados = {
        data: document.getElementById('edit-data').value,
        emissor: document.getElementById('edit-emissor').value,
        tipo: document.getElementById('edit-tipo').value,
        valor: parseFloat(document.getElementById('edit-valor').value),
        link: document.getElementById('edit-link').value
    };

    try {
        const response = await fetch(`${API_URL}/emissoes/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosAtualizados)
        });

        if (response.ok) {
            alert("Emissão atualizada.");
            fecharModal();
            carregarTabela(); 
            carregarStats();  
        } else {
            alert("Erro ao salvar alterações.");
        }

    } catch (error) {
        console.error("Erro na requisição:", error);
        alert("Erro de conexão com o servidor.");
    }
});

let charts = {}; 

async function carregarDashboard() {
    try {
        const response = await fetch(`${API_URL}/analytics`);
        const dados = await response.json();

        const paletaCores = [
            '#30ba09', 
            '#9f9a90', 
            '#0b0805', 
            '#744a24',
        ];

        let mapaCores = {};
        let corIndex = 0;

        const todosTipos = new Set([
            ...dados.qtd_por_tipo.map(d => d.label),
            ...dados.valor_por_tipo.map(d => d.label)
        ]);

        todosTipos.forEach(tipo => {
            mapaCores[tipo] = paletaCores[corIndex % paletaCores.length];
            corIndex++;
        });

        const getCoresParaDados = (listaDados) => {
            return listaDados.map(item => mapaCores[item.label]);
        };

        const ctxEvolucao = document.getElementById('chartEvolucao').getContext('2d');
        if (charts['evolucao']) charts['evolucao'].destroy();

        charts['evolucao'] = new Chart(ctxEvolucao, {
            type: 'bar',
            data: {
                labels: dados.evolucao.labels,
                datasets: [
                    {
                        label: 'Volume Mensal',
                        data: dados.evolucao.valores,
                        backgroundColor: '#30ba09',
                        order: 2
                    },
                    {
                        label: 'Média Acumulada', 
                        data: dados.evolucao.media, 
                        type: 'line',
                        borderColor: '#000',
                        borderWidth: 2,
                        pointRadius: 2, 
                        tension: 0.3,
                        order: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: true } }
            }
        });

        const coresQtd = getCoresParaDados(dados.qtd_por_tipo);
        criarGraficoPizza('chartQtdTipo', 'doughnut', dados.qtd_por_tipo, coresQtd);

        const ctxValor = document.getElementById('chartValorTipo').getContext('2d');
        if (charts['valorTipo']) charts['valorTipo'].destroy();

        const coresValor = getCoresParaDados(dados.valor_por_tipo);
        charts['valorTipo'] = new Chart(ctxValor, {
            type: 'bar',
            data: {
                labels: dados.valor_por_tipo.map(d => d.label),
                datasets: [{
                    label: 'Volume Total',
                    data: dados.valor_por_tipo.map(d => d.value),
                    backgroundColor: coresValor,
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true } }
            }
        });

        const ctxTop5 = document.getElementById('chartTopEmissores').getContext('2d');
        if (charts['top5']) charts['top5'].destroy();
        charts['top5'] = new Chart(ctxTop5, {
            type: 'bar',
            data: {
                labels: dados.top_emissores.map(d => d.label),
                datasets: [{
                    label: 'Volume Total',
                    data: dados.top_emissores.map(d => d.value),
                    backgroundColor: '#30ba09',
                    borderRadius: 4,
                    indexAxis: 'y' 
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y', 
                plugins: { legend: { display: false } }
            }
        });

        const tbody = document.getElementById('tabela-detalhe-top5');
        tbody.innerHTML = '';
        const fmt = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
        
        let ultimoEmissor = "";
        dados.tabela_cruzada.forEach(item => {
            let estiloBorda = "";
            let nomeEmissorVisual = item.emissor;
            let estiloNome = "font-weight: bold; color: #000;";
            
            if (item.emissor !== ultimoEmissor) {
                estiloBorda = "border-top: 2px solid #000;";
                ultimoEmissor = item.emissor; 
            } else {
                estiloBorda = "border-top: none;"; 
                nomeEmissorVisual = "";
            }
            
            tbody.innerHTML += `
                <tr style="${estiloBorda}">
                    <td style="padding: 10px; ${estiloNome}">${nomeEmissorVisual}</td>
                    <td style="padding: 10px; border-left: 1px solid #eee;">${item.tipo}</td>
                    <td style="text-align: center; padding: 10px; border-left: 1px solid #eee;">${item.qtd}</td>
                    <td style="text-align: right; color: #30ba09; padding: 10px; border-left: 1px solid #eee;">${fmt.format(item.valor)}</td>
                </tr>
            `;
        });

    } catch (error) {
        console.error("Erro dashboard:", error);
    }
}

function criarGraficoPizza(idCanvas, tipo, dadosArray, cores) {
    const ctx = document.getElementById(idCanvas).getContext('2d');
    if (charts[idCanvas]) charts[idCanvas].destroy();

    charts[idCanvas] = new Chart(ctx, {
        type: tipo,
        data: {
            labels: dadosArray.map(d => d.label),
            datasets: [{
                data: dadosArray.map(d => d.value),
                backgroundColor: cores,
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { 
                legend: { position: 'right', labels: { boxWidth: 10, font: {size: 10} } } 
            }
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    carregarStats();
    carregarDashboard();
    navegar('dashboard');
});