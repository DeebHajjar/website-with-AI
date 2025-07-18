# Website Without AI

This project is a basic web application built using Python (Flask) and JavaScript. It provides a simple website structure in Arabic and uses artificial intelligence to summarize articles, write and expand them, or transcribe audio files and convert them to text. It then suggests keywords related to the article, all of which is done via Gemini AI. After suggesting keywords, it creates an image related to the article using the keywords using Dream Studio.

## Features
- Python Flask backend (`app.py`)
- Static assets (JavaScript, CSS, images) in the `static` directory
- HTML templates in the `templates` directory
- Example environment configuration (`.env.example`)
- Utility functions in `utils.py`

## Project Structure
```
website-without-AI/
├── app.py
├── utils.py
├── .env
├── .env.example
├── requirements.txt
├── .gitignore
├── static/
│   └── js/
│       ├── chatbot.js
│       ├── chatbotUse.js
│       ├── common.js
│       ├── create.js
│       ├── summarize.js
│       └── transcribe.js
├── templates/
│   └── ... (HTML files)
└── README.md
```

## Getting Started

### Prerequisites
- Python 3.x
- pip (Python package manager)

### Installation
1. Clone this repository:
   ```bash
   git clone https://github.com/DeebHajjar/website-with-AI.git
   cd website-with-AI
   ```
2. Create a virtual environment and activate it:
   ```bash
   python -m venv venv
   # For Windows
   venv\Scripts\activate
   # For Linux/Mac
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Copy `.env.example` to `.env` and update environment variables as needed.

### Running the App
```bash
python app.py
```
The app will start on `http://127.0.0.1:5000/` by default.

## Customization
- Add or modify HTML files in the `templates` directory.
- Add or update JavaScript/CSS in the `static` directory.
- Extend backend logic in `app.py` or `utils.py`.
