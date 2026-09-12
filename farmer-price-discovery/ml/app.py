import os
import sys

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.append(BASE_DIR)

from flask import Flask, request, jsonify
from flask_cors import CORS
from predict import generate_3day_prediction
from train import train_and_save_model

app = Flask(__name__)
CORS(app)

@app.route('/', methods=['GET'])
def health_check():
    return jsonify({"status": "success", "message": "ML Price Forecasting Service is running"}), 200

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json() or {}
    commodity = data.get('commodity', 'Tomato')
    market = data.get('market', 'Rajkot Mandi')
    
    result, error = generate_3day_prediction(commodity, market)
    
    if error:
        return jsonify({"success": False, "message": error}), 400
        
    return jsonify({"success": True, "data": result}), 200

@app.route('/train', methods=['POST'])
def train():
    try:
        model_name, metrics = train_and_save_model()
        return jsonify({
            "success": True,
            "message": "Model retrained successfully",
            "model": model_name,
            "metrics": metrics
        }), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
