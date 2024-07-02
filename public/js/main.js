//Benötigte HTML-Elemente
const inputField = document.querySelector(".input-field");
const button = document.querySelector(".input-button");
const chatBox = document.querySelector(".chat-container");

const url = "wss://pizza-chatbot.azurewebsites.net:443"

const ws = new WebSocket(url);

ws.onopen = () => {
  console.log("open web socket");
};

ws.onmessage = (event) => {
  const message = JSON.parse(event.data)

  console.log('Message from Server:', event.data);

  if (Array.isArray(message)) {
    message.forEach(message => {
      chatBox.innerHTML += message.content
    })
  } else {
    chatBox.innerHTML += message.content
  }

};

ws.onclose = () => {
  console.log('Disconnected from server');
};

ws.onerror = function (event) {
  console.log("error");
};

//EventListeners for Button and Input-Field
button.addEventListener("click", OnInputEnter);
inputField.addEventListener('keypress', function (event) {
  if (event.key === 'Enter') {
    OnInputEnter();
  }
});

function OnInputEnter() {
  const content = inputField.value;
  if (content == "") {
    return;
  }
  inputField.value = '';
  chatBox.innerHTML += `<div class="message-container">
                          <div class="icon-user">&#128100;</div>
                          <div class="message user">${content}</div>
                          <div class="time">${currenDate()}</div>
                        </div>`
  sendInput(content);
  scrollToBottom();
}

//Auto-Scroll to Bottom of Page
function scrollToBottom() {
  setTimeout(() => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth"
    });
  }, 100);
}

//Auto-focus Input-Field when website loaded
window.onload = function () {
  inputField.focus();
}

//Give current Date in Format hh:mm
function currenDate() {
  return new Date().toLocaleTimeString().substring(0, 5);
}

function sendInput(content) {
  const message = {
    type: 'chat',
    content: content
  };
  ws.send(JSON.stringify(message));
}
