import pandas as pd
import numpy as np

def load_and_preprocess_data(file_path):
    """
    Load dataset, parse date, remove duplicates, handle missing values, and sort chronologically.
    """
    df = pd.read_csv(file_path)
    
    df = df.drop_duplicates()
    
    df['modal_price'] = df['modal_price'].fillna(df['modal_price'].median())
    df['min_price'] = df['min_price'].fillna(df['modal_price'] * 0.9)
    df['max_price'] = df['max_price'].fillna(df['modal_price'] * 1.1)
    df['arrival_quantity'] = df['arrival_quantity'].fillna(0)
    
    df['date'] = pd.to_datetime(df['date'])
    df = df.sort_values(by=['commodity', 'market', 'date']).reset_index(drop=True)
    
    return df
