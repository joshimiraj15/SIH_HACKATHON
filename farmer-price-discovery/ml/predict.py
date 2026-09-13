import os
import sys

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.append(BASE_DIR)

import joblib
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from preprocessing import load_and_preprocess_data
from feature_engineering import create_features

MODEL_DIR = os.path.join(BASE_DIR, 'model')
DATASET_PATH = os.path.abspath(os.path.join(BASE_DIR, '..', 'data', 'market_prices.csv'))

def generate_3day_prediction(commodity, market):
    """
    Multi-step recursive 3-day forecasting algorithm.
    """
    model_path = os.path.join(MODEL_DIR, 'price_model.pkl')
    meta_path = os.path.join(MODEL_DIR, 'model_meta.pkl')
    
    if not os.path.exists(model_path) or not os.path.exists(meta_path):
        return None, "Model artifacts not trained yet"
        
    model = joblib.load(model_path)
    meta = joblib.load(meta_path)
    feature_cols = meta['feature_columns']
    rmse = meta['metrics']['rmse']
    
    df = load_and_preprocess_data(DATASET_PATH)
    filtered = df[(df['commodity'].str.lower() == commodity.lower()) & (df['market'].str.lower() == market.lower())]
    
    if len(filtered) < 5:
        filtered = df[df['commodity'].str.lower() == commodity.lower()]
        
    if len(filtered) == 0:
        filtered = df
        
    df_feat = create_features(filtered)

    last_row = df_feat.iloc[-1].copy()
    last_date = last_row['date']
    current_price = float(last_row['modal_price'])
    
    predictions = []
    current_lag_prices = list(df_feat['modal_price'].tail(30).values)
    
    for day_offset in range(1, 4):
        next_date = last_date + timedelta(days=day_offset)
        
        feats = {
            'arrival_quantity': float(last_row['arrival_quantity']),
            'min_price': float(current_price * 0.9),
            'max_price': float(current_price * 1.1),
            'price_lag_1': float(current_lag_prices[-1]),
            'price_lag_2': float(current_lag_prices[-2] if len(current_lag_prices) >= 2 else current_lag_prices[-1]),
            'price_lag_3': float(current_lag_prices[-3] if len(current_lag_prices) >= 3 else current_lag_prices[-1]),
            'price_lag_7': float(current_lag_prices[-7] if len(current_lag_prices) >= 7 else current_lag_prices[-1]),
            'price_lag_14': float(current_lag_prices[-14] if len(current_lag_prices) >= 14 else current_lag_prices[-1]),
            'price_lag_30': float(current_lag_prices[-30] if len(current_lag_prices) >= 30 else current_lag_prices[-1]),
            'rolling_mean_3': float(np.mean(current_lag_prices[-3:])),
            'rolling_mean_7': float(np.mean(current_lag_prices[-7:])),
            'rolling_mean_14': float(np.mean(current_lag_prices[-14:])),
            'rolling_mean_30': float(np.mean(current_lag_prices[-30:])),
            'rolling_std_7': float(np.std(current_lag_prices[-7:]) if len(current_lag_prices) >= 7 else 0),
            'day': next_date.day,
            'month': next_date.month,
            'year': next_date.year,
            'day_of_week': next_date.dayofweek,
            'week_of_year': int(next_date.isocalendar().week)
        }
        
        input_df = pd.DataFrame([feats])[feature_cols]
        pred_val = float(model.predict(input_df)[0])
        pred_val = max(100.0, round(pred_val, 2))
        
        lower_bound = max(100.0, round(pred_val - (1.96 * rmse), 2))
        upper_bound = round(pred_val + (1.96 * rmse), 2)
        
        predictions.append({
            'date': next_date.strftime('%Y-%m-%d'),
            'predicted_price': pred_val,
            'lower_bound': lower_bound,
            'upper_bound': upper_bound
        })
        
        current_lag_prices.append(pred_val)
        
    day1_pred = predictions[0]['predicted_price']
    price_diff_pct = ((day1_pred - current_price) / current_price) * 100
    
    if price_diff_pct > 1.5:
        trend = "Increasing"
        recommendation = "Prices are expected to increase over the next 3 days. Consider waiting 2-3 days if storage is available."
    elif price_diff_pct < -1.5:
        trend = "Decreasing"
        recommendation = "Prices are expected to decrease. Consider selling earlier to avoid market drop."
    else:
        trend = "Stable"
        recommendation = "Prices are expected to remain relatively stable. Compare nearby markets before selling."
        
    best_pred = max(predictions, key=lambda x: x['predicted_price'])
    
    return {
        "commodity": commodity,
        "market": market,
        "current_price": current_price,
        "predictions": predictions,
        "trend": trend,
        "recommended_day": best_pred['date'],
        "recommendation": recommendation,
        "reliability": "High" if meta['metrics']['mape'] < 10 else "Medium",
        "model_name": meta['model_name'],
        "metrics": meta['metrics']
    }, None
