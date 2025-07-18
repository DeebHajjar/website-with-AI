async function geminiCall(systemSettings, userInput, chatDiv) {
    const response = await fetch('/gemini-api', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({
        userInput: userInput,
        systemSettings: systemSettings,
        stream: true // Enable streaming for summary
        })
    });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    
    if (done) break;
    
    const chunk = decoder.decode(value);
    const lines = chunk.split('\n');
    
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        try {
          const data = JSON.parse(line.slice(6));
          
          if (data.text) {
            chatDiv.innerHTML += data.text;
          } else if (data.error) {
            chatDiv.innerHTML += `<div style="color: red;">خطأ: ${data.error}</div>`;
          }
        } catch (e) {
          // Skip invalid JSON
          continue;
        }
      }
    }
  }
}

function generateImage() {
  // We get the keywords from the div
  const keywordsDiv = document.getElementById('keywords');
  const drawButton = document.getElementById('drawButton');
  const outputImage = document.getElementById('outputImage');
  
  // We change the button state
  drawButton.style.backgroundColor = '#99d1ff';
  drawButton.style.borderColor = '#99d1ff';
  drawButton.innerHTML = 'جاري التحميل...';

  // We extract the text from the keywords div
  const prompt = keywordsDiv.textContent || keywordsDiv.innerText;

  // We check if there is a prompt
  if (!prompt || prompt.trim() === '') {
    console.error('No keywords found for image generation');
    drawButton.style.backgroundColor = '';
    drawButton.style.borderColor = '';
    drawButton.innerHTML = 'إعادة رسم';
    return;
  }

  // We send the image creation request
  fetch('/sd-api', {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt: prompt.trim() })
  })
  .then(response => response.json())
  .then(data => {
      if (data.error) {
        console.error('Error generating image:', data.error);
        alert('خطأ في إنشاء الصورة: ' + data.error);
      } else if (data.imageUrl) {
        outputImage.src = data.imageUrl;
        outputImage.style.display = 'block';
      }
      
      // We reset the button
      drawButton.style.backgroundColor = '';
      drawButton.style.borderColor = '';
      drawButton.innerHTML = 'إعادة رسم';
  })
  .catch(error => {
      console.error('Error fetching data:', error);
      alert('خطأ في الاتصال: ' + error.message);
      
      // We reset the button
      drawButton.style.backgroundColor = '';
      drawButton.style.borderColor = '';
      drawButton.innerHTML = 'إعادة رسم';
  });
}

function downloadImage() {
  // We refer to the image field and create an element with its data to allow downloading it
  const outputImage = document.getElementById('outputImage');
  const downloadLink = document.createElement('a');
  downloadLink.href = outputImage.src;
  downloadLink.download = 'downloaded_image.jpg';
  document.body.appendChild(downloadLink);
  // We simulate a click to download the image, then remove the element
  downloadLink.click();
  document.body.removeChild(downloadLink);
}