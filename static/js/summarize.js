async function summarizeArticle() {
  const userInput = document.getElementById('toSummarize').value;
  const chatDiv = document.getElementById('summarized');
  const systemSettings = 'You are a text summarization assistant. Your task is to read and summarize the text provided by the user.The summary should be approximately 25% (one-quarter) of the original text. Focus onthe main ideas and important points. Avoid adding new information not found in the original text. Write the summary in clear, fluent Arabic.';
  
  // Clear previous content
  chatDiv.innerHTML = '';
  

  await geminiCall(systemSettings, userInput, chatDiv);
  
  // Generate title after summary is complete
  writeTitle();
}

async function writeTitle() {
  const userInput = document.getElementById('toSummarize').value;
  const chatDiv = document.getElementById('title');
  const systemSettings = 'Suggest one title for the article in Arabic. Do not add other words in the response, just the title.';
  
  const response = await fetch('/gemini-api', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      userInput: userInput,
      systemSettings: systemSettings,
      stream: false // Disable streaming for title (faster)
    })
  });

  const data = await response.json();
  chatDiv.innerHTML = data.response;

  writeKeywords();
}

async function writeKeywords() {
  const userInput = document.getElementById('toSummarize').value;
  const chatDiv = document.getElementById('keywords');
  const systemSettings = 'You must write keywords/tags based on the user input. These keywords/tags must be in Arabic, separated by commas.';
  
  // Clear previous content
  chatDiv.innerHTML = '';

  await geminiCall(systemSettings, userInput, chatDiv);

  // We automatically create the image after the keywords are finished
  generateImage();
}
