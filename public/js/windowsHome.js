//Funcionalidades das janelas modais da home page
const windowExternal = document.getElementById('windowExternal')
function openModal(){
    windowExternal.classList.add('ativeWindow')
}
//Funcionalidade de fechamento de janela
windowExternal.addEventListener('click', (element) => {
    if(element.target.id === 'windowInternal' || element.target.id === 'closeWindow'){
        windowExternal.classList.remove('ativeWindow')
    }
    console.log(element.target.id)
})