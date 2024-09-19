from flask import Flask, request, jsonify, send_file
import requests
from io import BytesIO
from zipfile import ZipFile
from flask_cors import CORS
import base64

app = Flask(__name__, static_folder='../static')
CORS(app, resources={r"/*": {"origins": "*"}})

API_TOKEN = 'pst-dU43fXS55eDi9VhInoA8wPDV3Fw76KvyhyvHPspjZhDjcqUod5fHxcNSm4CHHQni'  # 替换为你的持久API令牌

@app.route('/generate-image', methods=['POST'])
def generate_image():
    data = request.json
    # Data validation
    if data['parameters']['steps'] > 28:
        return jsonify({'error': 'Steps cannot be greater than 28'}), 400
    if data['parameters']['width'] * data['parameters']['height'] > 1048576:
        return jsonify({'error': 'Width and Height product exceeds 1048576'}), 400

    if 'image' in data['parameters'] and data['parameters']['image']:
        data['action'] = 'img2img'
        image_data = base64.b64decode(data['parameters']['image'])
        # Further processing if necessary

    headers = {
        'Authorization': f'Bearer {API_TOKEN}',
        'Content-Type': 'application/json'
    }
    response = requests.post('https://image.novelai.net/ai/generate-image', json=data, headers=headers)
    if response.status_code == 200:
        zip_file = ZipFile(BytesIO(response.content))
        image_data = zip_file.read(zip_file.namelist()[0])
        return send_file(BytesIO(image_data), mimetype='image/png')
    else:
        return jsonify({'error': 'Failed to generate image', 'status_code': response.status_code, 'response': response.text}), response.status_code

@app.route('/test', methods=['GET'])
def test():
    return jsonify({"message": "Hello from Flask!"})

if __name__ == '__main__':
    app.run(debug=True)
