import os
import sys

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.append(BASE_DIR)

import joblib
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from xgboost import XGBRegressor
from preprocessing import load_and_preprocess_data
from feature_engineering import create_features
from evaluate import evaluate_model

MODEL_DIR = os.path.join(BASE_DIR, 'model')
DATASET_PATH = os.path.abspath(os.path.join(BASE_DIR, '..', 'data', 'market_prices.csv'))

FEATURE_COLUMNS = [
    'arrival_quantity', 'min_price', 'max_price',
    'price_lag_1', 'price_lag_2', 'price_lag_3', 'price_lag_7', 'price_lag_14', 'price_lag_30',
    'rolling_mean_3', 'rolling_mean_7', 'rolling_mean_14', 'rolling_mean_30', 'rolling_std_7',
    'day', 'month', 'year', 'day_of_week', 'week_of_year'
]

def train_and_save_model():
    os.makedirs(MODEL_DIR, exist_ok=True)
    
    if not os.path.exists(DATASET_PATH):
        raise FileNotFoundError(f"Dataset not found at {DATASET_PATH}")
        
    df = load_and_preprocess_data(DATASET_PATH)
    df_featured = create_features(df)
    
    split_idx = int(len(df_featured) * 0.8)
    train_df = df_featured.iloc[:split_idx]
    test_df = df_featured.iloc[split_idx:]
    
    X_train = train_df[FEATURE_COLUMNS]
    y_train = train_df['modal_price']
    X_test = test_df[FEATURE_COLUMNS]
    y_test = test_df['modal_price']
    
    rf = RandomForestRegressor(n_estimators=100, random_state=42)
    rf.fit(X_train, y_train)
    rf_pred = rf.predict(X_test)
    rf_metrics = evaluate_model(y_test, rf_pred)
    
    xgb = XGBRegressor(n_estimators=100, learning_rate=0.05, max_depth=5, random_state=42)
    xgb.fit(X_train, y_train)
    xgb_pred = xgb.predict(X_test)
    xgb_metrics = evaluate_model(y_test, xgb_pred)
    
    if xgb_metrics['mae'] <= rf_metrics['mae']:
        best_model = xgb
        best_name = 'XGBoost'
        best_metrics = xgb_metrics
    else:
        best_model = rf
        best_name = 'RandomForest'
        best_metrics = rf_metrics
        
    model_path = os.path.join(MODEL_DIR, 'price_model.pkl')
    meta_path = os.path.join(MODEL_DIR, 'model_meta.pkl')
    
    joblib.dump(best_model, model_path)
    joblib.dump({
        'model_name': best_name,
        'metrics': best_metrics,
        'feature_columns': FEATURE_COLUMNS
    }, meta_path)
    
    print(f"Model Training Complete! Selected: {best_name} | MAE: Rs.{best_metrics['mae']} | R2: {best_metrics['r2']}")
    return best_name, best_metrics

if __name__ == '__main__':
    train_and_save_model()
