import pandas as pd
import numpy as np

def create_features(df):
    """
    Engineers Lag features, Rolling window statistics, and Date breakdown features.
    """
    df = df.copy()
    
    grouped = df.groupby(['commodity', 'market'])
    
    for lag in [1, 2, 3, 7, 14, 30]:
        df[f'price_lag_{lag}'] = grouped['modal_price'].shift(lag)
        
    for window in [3, 7, 14, 30]:
        df[f'rolling_mean_{window}'] = grouped['modal_price'].transform(lambda x: x.shift(1).rolling(window, min_periods=1).mean())
        
    df['rolling_std_7'] = grouped['modal_price'].transform(lambda x: x.shift(1).rolling(7, min_periods=1).std()).fillna(0)
    
    df['day'] = df['date'].dt.day
    df['month'] = df['date'].dt.month
    df['year'] = df['date'].dt.year
    df['day_of_week'] = df['date'].dt.dayofweek
    df['week_of_year'] = df['date'].dt.isocalendar().week.astype(int)
    
    feature_cols = [c for c in df.columns if c.startswith(('price_lag_', 'rolling_'))]
    for col in feature_cols:
        df[col] = df.groupby(['commodity', 'market'])[col].bfill().fillna(df['modal_price'].median())
        
    return df
