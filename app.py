from flask import Flask, render_template, request, jsonify
from utils import gemini, diffusion, translate_keywords, transcribe_audio
import os
import tempfile

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/transcribe-api', methods=['POST'])
def transcribe_api():
    # We take the uploaded file and extract its name and type.
    uploaded_file = request.files['file']
    original_filename = uploaded_file.filename
    _, file_extension = os.path.splitext(original_filename)
    # We open a temporary file with the same extension as the uploaded file and keep it locally for transcription.
    with tempfile.NamedTemporaryFile(suffix=file_extension, delete=False) as temp_file:
        temp_path = temp_file.name
        uploaded_file.save(temp_path)
        transcription = transcribe_audio(temp_path)
        temp_file.close()
    os.remove(temp_path)
    return transcription

@app.route('/sd-api', methods=['POST'])
def sd_api():
    try:
        # We get the prompt first and then translate it.
        prompt = request.json.get('prompt')
        
        if not prompt:
            return jsonify({'error': 'No prompt provided'}), 400
        
        # We translate the keywords to English.
        translated_prompt = translate_keywords(prompt)
        
        base64_image, error = diffusion(translated_prompt)
        
        if error:
            return jsonify({'error': error}), 500
        
        return jsonify({
            'imageUrl': f"data:image/png;base64,{base64_image}"
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/gemini-api', methods=['POST'])
def gemini_api():
    system_settings = request.json.get('systemSettings')
    user_input = request.json.get('userInput')
    # Default to streaming
    stream = request.json.get('stream', True)
    return gemini(user_input, system_settings, stream)

@app.route('/create-article')
def create_article():
    return render_template('create-article.html')
    
@app.route('/summarize-article')
def summarize_article():
    return render_template('summarize-article.html')

@app.route('/transcribe')
def transcribe():
    return render_template('transcribe.html')

@app.route('/chatbot')
def chatbot():
    return render_template('chatbot.html')

if __name__ == "__main__":
    app.run(debug=True)
