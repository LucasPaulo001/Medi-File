// Função de verificação de campos (médicos e enfermeiros/tec. enfermagem)
function verificar(role){
    const crm = document.getElementById('crm')
    const corem = document.getElementById('corem')
    if(role === 'medico'){
        crm.classList.remove('d-none')
    } else {
        crm.classList.add('d-none')
    }

    if(role === 'enfermeiro' || role === 'tecEnfermagem'){
        corem.classList.remove('d-none')
    } else {
        corem.classList.add('d-none')
    }
    console.log(role);
}

window.onload = function() {
    const role = document.getElementById('role').value;
    verificar(role);
}

// Verificar se os campos CRM e COREM estão vazios ou não ao tentar enviar o formulário
document.querySelector('form').addEventListener('submit', (event) => {
    const role = document.getElementById('role').value;
    const crmField = document.getElementById('crm');
    const coremField = document.getElementById('corem');

    // Verifique se o campo crm está visível e vazio
    if(role === 'medico' && crmField.classList.contains('d-none') === false && (!crmField.value || crmField.value.trim() === '')){
        event.preventDefault(); // Impede o envio do formulário
        alert('Por favor insira um CRM válido antes de se cadastrar!');
    }
    // Verifique se o campo corem está visível e vazio
    else if((role === 'enfermeiro' || role === 'tecEnfermagem') && coremField.classList.contains('d-none') === false && (!coremField.value || coremField.value.trim() === '')){
        event.preventDefault(); // Impede o envio do formulário
        alert('Por favor insira um COREM válido antes de se cadastrar');
    }
});
