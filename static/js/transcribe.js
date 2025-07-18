async function transcribeFunction() {
    // We refer to some elements and change the button state
    const transcribeButton = document.querySelector('#transcribeAudio');
    const textarea = document.getElementById('toSummarize');
    const fileInput = document.getElementById('file');
    transcribeButton.innerHTML = 'جاري التفريغ...'
    transcribeButton.style.background = '#99d1ff';
    transcribeButton.style.borderColor = '#99d1ff';

    // We prepare the file for sending
    const formData = new FormData();
    formData.append('file', fileInput.files[0]);

    // We make a request to the endpoint
    const response = await fetch('/transcribe-api', {
      method: 'POST',
      body: formData,
    });

    // We make sure there was no error
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    // We put the response in the output area
    const transcription = await response.text();
    textarea.value = transcription;

    // We return the button to its original state and call the next function
    transcribeButton.innerHTML = 'اكتب'
    transcribeButton.style.background = '';
    transcribeButton.style.borderColor = '';
    writeKeywords();
};

async function writeKeywords() {
  const userInput = document.getElementById('toSummarize').value;
  const chatDiv = document.getElementById('keywords');
  const systemSettings = 'You must write keywords/tags based on the user input. These keywords/tags must be in Arabic, separated by commas.';
  
  // Clear previous content
  chatDiv.innerHTML = '';

  await geminiCall(systemSettings, userInput, chatDiv);

  // We automatically create the image after the keywords are finished
  generateImage();
};
