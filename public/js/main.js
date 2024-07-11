document.addEventListener('DOMContentLoaded', (event) => {
  // Benötigte HTML-Elemente
  const inputField = document.querySelector(".inputfield");
  const button = document.querySelector(".input-button");
  const chatBox = document.querySelector(".chatbox");

  const url = "wss://pizza-chatbot.azurewebsites.net:443"   

  const ws = new WebSocket(url);

  ws.onopen = () => {
      console.log("open web socket");
  };

  ws.onmessage = (event) => {
      const message = JSON.parse(event.data)

      console.log('Message from Server:', event.data);

      if (Array.isArray(message)) {
          message.forEach(msg => {
              chatBox.innerHTML += msg.content;
              scrollToBottom
          })
      } else {
          chatBox.innerHTML += message.content;
          scrollToBottom
      }
  };

  ws.onclose = () => {
      console.log('Disconnected from server');
  };

  ws.onerror = function (event) {
      console.log("error");
  };

  // EventListeners for Button and Input-Field
  button.addEventListener("click", OnInputEnter);
  inputField.addEventListener('keypress', function (event) {
      if (event.key === 'Enter') {
          OnInputEnter();
      }
  });

  function OnInputEnter() {
      const content = inputField.value;
      if (content === "") {
          return;
      }
      inputField.value = '';
      chatBox.innerHTML +=  `<li class="message" style="width:100%">
                              <div class="msj macro">
                                  <div class="avatar"><img class="img-circle" style="width:100%;" src="https://img.freepik.com/vektoren-premium/symbol-anonymer-schueler-cartoon-des-vektorsymbols-anonymer-schueler-fuer-webdesign-isoliert-auf-weissem-hintergrund_98402-52899.jpg?w=1380"/></div>
                                  <div class="text text-l">
                                      <p>${content}</p>
                                      <p><small>${currenDate()}</small></p>
                                  </div> 
                                </div>
                            </li>`;  
      sendInput(content);
      scrollToBottom();
  }

  // Auto-Scroll to Bottom of Page
  function scrollToBottom() {
      setTimeout(() => {
        const scrollingElement = (document.scrollingElement || document.body);
        scrollingElement.scrollTop = scrollingElement.scrollHeight;
      }, 500);
  }

  // Auto-focus Input-Field when website loaded
  window.onload = function () {
      inputField.focus();
  }

  // Give current Date in Format hh:mm
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
});
