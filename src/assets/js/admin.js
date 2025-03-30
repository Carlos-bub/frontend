// Verificar autenticação
function verificarAutenticacao() {
    const token = localStorage.getItem('token'); 
    if (!token) {
        window.location.href = '../auth/login.html';
    }
}

// Constantes
const API_URL = 'https://backend-production-9519.up.railway.app';

document.addEventListener('DOMContentLoaded', () => {
    verificarAutenticacao();
    carregarAgendamentos();
    carregarServicos();

    // Event listeners para filtros
    ['date-filter', 'time-filter', 'status-filter'].forEach(filterId => {
        const elemento = document.getElementById(filterId);
        if (elemento) {
            elemento.addEventListener('change', () => carregarAgendamentos());
        }
    });

    // Adicionar listener para o formulário de serviços
    const serviceForm = document.getElementById('add-service-form');
    if (serviceForm) {
        serviceForm.addEventListener('submit', criarServico);
    }
});

async function carregarAgendamentos() {
    try {
        const token = localStorage.getItem('token'); 
        if (!token) {
            throw new Error('Token não encontrado');
        }

        const response = await fetch(`${API_URL}/agendamentos`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            if (response.status === 401) {
                logout();
                return;
            }
            throw new Error('Erro ao carregar agendamentos');
        }

        const agendamentos = await response.json();
        exibirAgendamentos(agendamentos);
        atualizarContadores(agendamentos);
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao carregar agendamentos: ' + error.message);
    }
}

function exibirAgendamentos(agendamentos) {
    const container = document.getElementById('appointments-list');
    const dateFilter = document.getElementById('date-filter')?.value || '';
    const timeFilter = document.getElementById('time-filter')?.value || '';
    const statusFilter = document.getElementById('status-filter')?.value || '';

    // Filtrar agendamentos
    let agendamentosFiltrados = agendamentos.filter(agendamento => {
        // Filtro por data - ajustando para timezone local
        const dataAgendamento = new Date(agendamento.data);
        const dataAgendamentoStr = dataAgendamento.toISOString().split('T')[0];
        const dataMatch = !dateFilter || dataAgendamentoStr === dateFilter;
        
        // Filtro por hora - usando timezone Brasil
        const horaAgendamento = new Date(agendamento.hora).toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
            timeZone: 'America/Sao_Paulo'
        });
        const horaMatch = !timeFilter || horaAgendamento === timeFilter;
        
        // Filtro por status
        const statusMatch = !statusFilter || agendamento.status.toLowerCase() === statusFilter.toLowerCase();
        
        return dataMatch && horaMatch && statusMatch;
    });

    // Ordenar por data e hora
    agendamentosFiltrados.sort((a, b) => {
        const dataA = new Date(a.data);
        const dataB = new Date(b.data);
        if (dataA.getTime() !== dataB.getTime()) {
            return dataA - dataB;
        }
        return new Date(a.hora) - new Date(b.hora);
    });

    let html = '';
    
    if (agendamentosFiltrados.length === 0) {
        html = `
            <div class="no-appointments">
                <i class="fas fa-calendar-times"></i>
                <p>Nenhum agendamento encontrado</p>
            </div>
        `;
    } else {
        html += `
            <div class="appointments-header">
                <div>Data</div>
                <div>Hora</div>
                <div>Cliente</div>
                <div>Status</div>
                <div>Serviço</div>
                <div>Ações</div>
            </div>
        `;

        html += agendamentosFiltrados.map(agendamento => {
            const data = new Date(agendamento.data).toLocaleDateString('pt-BR');
            const hora = new Date(agendamento.hora).toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'America/Sao_Paulo'
            });
            
            const statusCapitalizado = agendamento.status.charAt(0).toUpperCase() + agendamento.status.slice(1);
            
            return `
                <div class="appointment-row ${agendamento.status.toLowerCase()}">
                    <div>${data}</div>
                    <div>${hora}</div>
                    <div>
                        <strong>${agendamento.nome}</strong><br>
                        <small>${agendamento.telefone}</small>
                    </div>
                    <div>
                        <span class="status status-${agendamento.status.toLowerCase()}">${statusCapitalizado}</span>
                    </div>
                    <div>${agendamento.servico}</div>
                    <div class="actions">
                        ${agendamento.status !== 'cancelado' ? `
                            ${agendamento.status !== 'confirmado' ? `
                                <button onclick="atualizarStatus(${agendamento.id}, 'confirmado')" class="action-btn confirm" title="Confirmar Agendamento">
                                    <i class="fas fa-check"></i>
                                </button>
                            ` : ''}
                            ${agendamento.status !== 'cancelado' ? `
                                <button onclick="atualizarStatus(${agendamento.id}, 'cancelado')" class="action-btn cancel" title="Cancelar Agendamento">
                                    <i class="fas fa-times"></i>
                                </button>
                            ` : ''}
                        ` : ''}
                    </div>
                </div>
            `;
        }).join('');
    }

    container.innerHTML = html;
    atualizarContadores(agendamentosFiltrados);
}

function atualizarContadores(agendamentos) {
    document.getElementById('total-appointments').textContent = agendamentos.length;
    document.getElementById('pending-appointments').textContent = 
        agendamentos.filter(a => a.status.toLowerCase() === 'pendente').length;
    document.getElementById('confirmed-appointments').textContent = 
        agendamentos.filter(a => a.status.toLowerCase() === 'confirmado').length;
    document.getElementById('canceled-appointments').textContent = 
        agendamentos.filter(a => a.status.toLowerCase() === 'cancelado').length;
}

async function atualizarStatus(id, novoStatus) {
    try {
        const token = localStorage.getItem('token'); 
        if (!token) {
            throw new Error('Token não encontrado');
        }

        const response = await fetch(`${API_URL}/agendamentos/${id}/status`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: novoStatus })
        });

        if (!response.ok) {
            if (response.status === 401) {
                logout();
                return;
            }
            throw new Error('Erro ao atualizar status');
        }

        carregarAgendamentos();
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao atualizar status: ' + error.message);
    }
}

function logout() {
    localStorage.removeItem('token'); 
    window.location.href = '../auth/login.html';
}

function limparFiltros() {
    document.getElementById('date-filter').value = '';
    document.getElementById('time-filter').value = '';
    document.getElementById('status-filter').value = '';
    carregarAgendamentos();
}

// Funções para gerenciar serviços
async function carregarServicos() {
    try {
        const response = await fetch('https://backend-production-9519.up.railway.app/servicos');
        if (!response.ok) throw new Error('Erro ao carregar serviços');
        
        const servicos = await response.json();
        exibirServicos(servicos);
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao carregar serviços: ' + error.message);
    }
}

function exibirServicos(servicos) {
    const container = document.getElementById('services-list');
    
    if (servicos.length === 0) {
        container.innerHTML = '<p class="text-center">Nenhum serviço cadastrado</p>';
        return;
    }

    const html = servicos.map(servico => `
        <div class="service-card">
            <h4>${servico.nome}</h4>
            <p>${servico.descricao}</p>
            <div class="service-info">
                <span class="service-price">R$ ${servico.preco.toFixed(2)}</span>
                <span class="service-duration">${servico.duracao} min</span>
            </div>
            <div class="service-actions">
                <button class="btn-edit" onclick="editarServico(${servico.id})">
                    <i class="fas fa-edit"></i>
                    Editar
                </button>
                <button class="btn-delete" onclick="deletarServico(${servico.id})">
                    <i class="fas fa-trash"></i>
                    Excluir
                </button>
            </div>
        </div>
    `).join('');

    container.innerHTML = html;
}

async function criarServico(event) {
    event.preventDefault();
    
    const nome = document.getElementById('service-name').value;
    const codigo = document.getElementById('service-code').value;
    const descricao = document.getElementById('service-description').value;
    const preco = parseFloat(document.getElementById('service-price').value);
    const duracao = parseInt(document.getElementById('service-duration').value);

    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token não encontrado');

        const response = await fetch('https://backend-production-9519.up.railway.app/servicos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ nome, codigo, descricao, preco, duracao })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Erro ao criar serviço');
        }

        // Limpar formulário e recarregar serviços
        document.getElementById('add-service-form').reset();
        await carregarServicos();
        alert('Serviço criado com sucesso!');
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao criar serviço: ' + error.message);
    }
}

async function editarServico(id) {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token não encontrado');

        const preco = parseFloat(prompt('Digite o novo preço:'));
        if (isNaN(preco) || preco < 0) {
            alert('Por favor, digite um preço válido');
            return;
        }

        const response = await fetch(`https://backend-production-9519.up.railway.app/servicos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ preco })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Erro ao atualizar preço');
        }

        await carregarServicos();
        alert('Preço atualizado com sucesso!');
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao atualizar preço: ' + error.message);
    }
}

async function deletarServico(id) {
    if (!confirm('Tem certeza que deseja excluir este serviço?')) return;

    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token não encontrado');

        const response = await fetch(`https://backend-production-9519.up.railway.app/servicos/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Erro ao deletar serviço');
        }

        await carregarServicos();
        alert('Serviço excluído com sucesso!');
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao deletar serviço: ' + error.message);
    }
}
