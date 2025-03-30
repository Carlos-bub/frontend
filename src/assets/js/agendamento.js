document.addEventListener('DOMContentLoaded', () => {
    const appointmentForm = document.getElementById('appointment-form');
    const dateInput = document.getElementById('date');
    const serviceSelect = document.getElementById('service');
    const timeSelect = document.getElementById('time');

    // Set minimum date to today and maximum date to 30 days from now
    const today = new Date();
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 30);
    
    dateInput.min = today.toISOString().split('T')[0];
    dateInput.max = maxDate.toISOString().split('T')[0];

    // Load services
    async function loadServices() {
        try {
            const response = await fetch('https://backend-production-9519.up.railway.app/servicos');
            const services = await response.json();
            
            console.log('Serviços carregados:', services); // Log para debug
            
            // Limpar opções existentes
            serviceSelect.innerHTML = '<option value="">Selecione um serviço</option>';
            
            services.forEach(service => {
                const option = document.createElement('option');
                option.value = service.id; // Voltando a usar ID pois parece que o backend espera isso
                option.textContent = `${service.nome} - R$ ${service.preco?.toFixed(2) || '0.00'}`;
                serviceSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Erro ao carregar serviços:', error);
        }
    }

    // Carregar horários disponíveis quando a data é alterada
    dateInput.addEventListener('change', async () => {
        const selectedDate = dateInput.value;
        if (!selectedDate) return;

        try {
            const response = await fetch(`https://backend-production-9519.up.railway.app/agendamentos/disponibilidade?data=${selectedDate}`);
            const horariosDisponiveis = await response.json();
            
            // Limpar opções atuais
            timeSelect.innerHTML = '<option value="">Selecione um horário</option>';
            
            // Converter os horários disponíveis para formato legível
            horariosDisponiveis.forEach(horario => {
                const date = new Date(horario);
                const timeStr = date.toLocaleTimeString('pt-BR', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: false,
                    timeZone: 'America/Sao_Paulo'
                });
                
                const option = document.createElement('option');
                option.value = horario; // Mantém o valor ISO original
                option.textContent = timeStr; // Mostra hora formatada
                timeSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Erro ao verificar disponibilidade:', error);
            alert('Erro ao carregar horários disponíveis. Por favor, tente novamente.');
        }
    });

    loadServices();

    appointmentForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nome = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const telefone = document.getElementById('telefone').value;
        const servicoSelect = document.getElementById('service');
        const servicoOption = servicoSelect.options[servicoSelect.selectedIndex];
        const servico = servicoOption.textContent.split('-')[0].trim(); // Pega só o nome do serviço
        const data = document.getElementById('date').value;
        const horaCompleta = document.getElementById('time').value;

        if (!nome || !email || !telefone || !servico || !data || !horaCompleta) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        const formData = {
            nome,
            email,
            telefone,
            servico,
            data,
            hora: horaCompleta
        };

        try {
            const response = await fetch('https://backend-production-9519.up.railway.app/agendamentos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const responseData = await response.json();

            if (response.ok) {
                alert('Agendamento realizado com sucesso!');
                appointmentForm.reset();
                dateInput.dispatchEvent(new Event('change'));
            } else {
                alert(responseData.error || 'Erro ao realizar agendamento. Por favor, tente novamente.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Erro ao conectar com o servidor. Por favor, tente novamente mais tarde.');
        }
    });

    // Formato do telefone
    const telefoneInput = document.getElementById('telefone');
    telefoneInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length <= 11) {
            value = value.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
            e.target.value = value;
        }
    });
});
