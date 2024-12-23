//Funcionalidades de mensagens da tela inicial

const msg = document.getElementById('messege')
const img = document.createElement('img')
let hour = new Date()
let localHour = hour.getHours()
if(localHour >= 18){
    msg.innerHTML = "<h4>Tenha uma Boa noite!</h4>"
    img.style.height = '90px'
    img.src = '/assets/images/noite.png'
    msg.appendChild(img)
}
else if(localHour >= 0 && localHour < 5){
    msg.innerHTML = "<h4>Tenha uma Boa Madrugada!</h4>"
    img.style.height = '90px'
    img.src = '/assets/images/madrugada.png'
    msg.appendChild(img)
}
else if(localHour >= 5 && localHour < 12){
    msg.innerHTML = "<h4>Tenha um Bom Dia!</h4>"
    img.style.height = '90px'
    img.src = '/assets/images/dia.png'
    msg.appendChild(img)
}
else if(localHour >= 12 && localHour <= 17){
    msg.innerHTML = '<h4>Tenha uma Boa Tarde!</h4>'
    img.style.height = '90px'
    img.src = '/assets/images/tarde.png'
    msg.appendChild(img)
}