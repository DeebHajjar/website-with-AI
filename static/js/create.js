async function writeArticle() {
    // We disable the continue button while the article is being written
    const continueButton = document.getElementById('continue-button');
    continueButton.setAttribute('disabled', '');
    // We refer to the input and output elements and set the system message, then send them to the model
    const chatDiv = document.getElementById('maqal');
    const systemSettings = 'The user will enter a title. Your task is to use the title to write an article in Arabic. Make the output only in Arabic and do not output anything other than the article.';
    const userInput = document.getElementById('articleTitle').value;
    
    await geminiCall(systemSettings, userInput, chatDiv);
    // We remove the disabled attribute and call the next function
    continueButton.removeAttribute('disabled');
    writeKeywords();
}

async function extendArticle() {
    // We disable the continue button while the article is being extended
    const continueButton = document.getElementById('continue-button');
    continueButton.setAttribute('disabled', '');
    // We refer to the input and output elements and set the system message, then send them to the model
    const chatDiv = document.getElementById('maqal');
    const systemSettings = 'The user will input an article. Your job is to extend the article in Arabic. Only give the extension.';
    const userInput = document.getElementById('maqal').value;
    await geminiCall(systemSettings, userInput, chatDiv);
    // We remove the disabled attribute and call the next function
    continueButton.removeAttribute('disabled');
  }

async function writeKeywords() {
  // We refer to the input and output elements and set the system message, then send them to the model and call the next function
  const chatDiv = document.getElementById('keywords');
  const systemSettings = 'You must write keywords/tags based on the user input. These keywords/tags must be in Arabic, separated by commas.';
  const userInput = document.getElementById('articleTitle').value;
  await geminiCall(systemSettings, userInput, chatDiv);
  generateImage();
}
