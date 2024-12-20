//Função que abre o modal de detalhes de cada Profissional
function openDetail(id){
    const windowDetail = document.getElementById(`proDetails-${id}`)
    windowDetail.classList.add('ativeDetail')
}

//Função que fecha o modal ao clicar no ícone
function closeWindow(id){
    const windowDetail = document.getElementById(`proDetails-${id}`)
    windowDetail.addEventListener('click', (element) => {
        if(element.target.id === 'closeDetail'){
            windowDetail.classList.remove('ativeDetail')
        }
    })
}

//Função que fecha o modal ao clicar fora da janela
function closeWindowExternal(id){
    const windowDetail = document.getElementById(`proDetails-${id}`)
    windowDetail.addEventListener('click', (element) => {
        if(element.target.id === `proDetails-${id}`){
            windowDetail.classList.remove('ativeDetail')
        }
    })
}


