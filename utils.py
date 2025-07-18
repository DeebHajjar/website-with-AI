import google.generativeai as genai
from flask import Response, jsonify
from dotenv import load_dotenv
import os
import json
import requests

load_dotenv()
genai.configure(api_key=os.getenv('GOOGLE_API_KEY'))

stablediffusion_api_key = os.getenv('DREAMSTUDIO_KEY')
ENGINE_ID = 'stable-diffusion-xl-1024-v1-0'
API_HOST = 'https://api.stability.ai'

def diffusion(prompt):
    try:
        # طلب إلى Stability AI API
        response = requests.post(
            f"{API_HOST}/v1/generation/{ENGINE_ID}/text-to-image",
            headers={
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": f"Bearer {stablediffusion_api_key}"
            },
            json={
                "text_prompts": [
                    {
                        "text": prompt
                    }
                ],
                "cfg_scale": 7,
                "height": 1024,
                "width": 1024,
                "samples": 1,
                "steps": 30,
            },
        )
        
        # التحقق من نجاح الطلب
        if response.status_code != 200:
            return None, f"HTTP Error: {response.status_code} - {response.text}"
        
        data = response.json()
        
        # التحقق من وجود الصور
        if 'artifacts' in data and len(data['artifacts']) > 0:
            return data["artifacts"][0]['base64'], None
        else:
            return None, "No image generated"
            
    except Exception as e:
        return None, str(e)


def gemini(user_input, system_settings, stream=True):
    try:
        # Initialize the model
        model = genai.GenerativeModel('gemini-2.0-flash')
        
        # Create the prompt combining system settings and user input
        prompt = f"{system_settings}\n\nUser input: {user_input}"
        
        if stream:
            # Streaming response
            def generate():
                try:
                    response = model.generate_content(prompt, stream=True)
                    
                    for chunk in response:
                        if chunk.text:
                            yield f"data: {json.dumps({'text': chunk.text})}\n\n"
                            
                except Exception as e:
                    yield f"data: {json.dumps({'error': str(e)})}\n\n"
            
            return Response(
                generate(),
                mimetype='text/plain',
                headers={
                    'Cache-Control': 'no-cache',
                    'Connection': 'keep-alive',
                }
            )
        else:
            # Regular JSON response
            response = model.generate_content(prompt)
            return jsonify({'response': response.text})
        
    except Exception as e:
        if stream:
            return Response(
                f"data: {json.dumps({'error': str(e)})}\n\n",
                mimetype='text/plain'
            )
        else:
            return jsonify({'error': str(e)})

def translate_keywords(user_input):
    """
    ترجمة الكلمات المفتاحية من العربية إلى الإنجليزية باستخدام Gemini
    """
    try:
        model = genai.GenerativeModel('gemini-2.0-flash')
        
        prompt = f"""
        You are a translation assistant. Translate the following Arabic keywords/text to English for use in image generation.
        Make the translation suitable for AI image generation (descriptive and clear).
        
        Arabic text: {user_input}
        
        Respond with only the English translation:
        """
        
        response = model.generate_content(prompt)
        return response.text.strip()
        
    except Exception as e:
        print(f"Translation error: {e}")
        # في حالة فشل الترجمة، نعيد النص الأصلي
        return user_input

def transcribe_audio(path):
    # التأكد من وجود الملف
    if not os.path.exists(path):
        raise FileNotFoundError(f"الملف غير موجود: {path}")
    
    # رفع الملف الصوتي إلى Gemini
    audio_file = genai.upload_file(path)
    
    # إنشاء النموذج
    model = genai.GenerativeModel("gemini-2.0-flash")
    
    # طلب تفريغ الملف الصوتي
    prompt = "قم بتفريغ هذا الملف الصوتي وإرجاع النص فقط بدون أي تعليقات إضافية"
    
    response = model.generate_content([prompt, audio_file])
    
    # حذف الملف من خادم Gemini (اختياري)
    genai.delete_file(audio_file.name)
    
    return response.text
