async function sendMessage() {
    // We extract the inputs and clear the input yard.
    const userInput = document.getElementById('humanInput').value;
    document.getElementById('humanInput').value = '';
  
    // We add the user's message to the message history.
    const newMessage = document.createElement("div");
    newMessage.classList.add('humanMessage')
    newMessage.innerHTML = userInput;
  

    const messageList = document.getElementById('messageList');
    messageList.appendChild(newMessage);
  
    // We are adding a new element to the bot message.  
    const replyMessage = document.createElement("div");
    replyMessage.classList.add('botMessage')
    messageList.appendChild(replyMessage);
    // We specify the system message
    const systemSettings = 'You are a chat bot. Please reply in Arabic.';
  
    // We make a request for the model
    await geminiCall(systemSettings, userInput, replyMessage);
  }
  
