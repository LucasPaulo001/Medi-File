//Função de verificação de campos (médicos e enfermeiros/tec. enfermagem)
console.log('ola')
function verificar(role){
    const crm = document.getElementById('crm')
    const corem = document.getElementById('corem')
    if(role == 'medico'){
        crm.classList.remove('d-none')
    }
    else{
        crm.classList.add('d-none')
    }
    if(role == 'enfermeiro' || role == 'tec. enfermagem'){
        corem.classList.remove('d-none')
    }
    else{
        corem.classList.add('d-none')
    }
    console.log(role)
}
//Verificar se os campos CRM e COREM estão vazios ou não
document.querySelector('form').addEventListener('submit', (event) => {
    const role = document.getElementById('role').value
    const Valcrm = document.getElementById('crm')
    const Valcorem = document.getElementById('corem')
    if(role == 'medico' && (!Valcrm.value || Valcrm.value.trim() === '')){
        event.preventDefault()
        alert('Por favor insira um CRM válido antes de se cadastrar!')
    }
    else if(role == 'enfermeiro' && (!Valcorem.value || Valcorem.value.trim() === '')){
        event.preventDefault()
        alert('Por favor insira um COREM válido antes de se cadastrar')
    }
})
