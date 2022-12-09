const wsUri = "wss://echo-ws-service.herokuapp.com";

const btn = document.querySelector(".j-btn");
const infoOutput = document.querySelector(".info_output");
const chatOutput = document.querySelector(".chat_output");
const input = document.querySelector("input");
const geolocationOutput = document.querySelector(".geolocation");

function pageLoaded() {

let socket = new WebSocket(wsUri);

  socket.onopen = () => {
    infoOutput.innerText = "Соединение установлено";
  }
  
  socket.onmessage = (event) => {
    writeToChat('<span style="color: black">WCC: ' + event.data + '</span>', true
    );
  }

  socket.onerror = () => {
    infoOutput.innerText = "При передаче данных произошла ошибка";
  }
  
  const error = () => {
  writeToChat('Невозможно получить ваше местоположение');
}

const success = (position) => {
  console.log('position', position);
  const latitude  = position.coords.latitude;
  const longitude = position.coords.longitude;
  writeToChat(`Широта: ${latitude} °, Долгота: ${longitude} °`);
  writeToChat(`<a href="https://www.openstreetmap.org/#map=18/${latitude}/${longitude}" target="_blank">Ссылка на карту</a>`);
}

 geolocationOutput.addEventListener("click", () => {
  
  if (!navigator.geolocation) {
    writeToChat('Geolocation не поддерживается вашим браузером');
  } else {
    writeToChat('Определение местоположения…');
    navigator.geolocation.getCurrentPosition(success, error);
  }
});
  
btn.addEventListener("click", sendMessage);
  
  function sendMessage() {
    if (!input.value) return;
    socket.send(input.value);
    writeToChat(input.value, false);
    input.value === "";
  }
  
  function writeToChat(message, isRecieved) {
    let messageHTML = `<div class="${isRecieved? "recieved" : "sent"}">${message}</div>`;
    chatOutput.innerHTML += messageHTML;
  }
}

document.addEventListener("DOMContentLoaded", pageLoaded);
