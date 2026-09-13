import os
import sys

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BASE_DIR not in sys.path:
    sys.path.append(BASE_DIR)

from predict import generate_3day_prediction

def test_generate_3day_prediction():
    res, err = generate_3day_prediction('Onion', 'Laxmi-Sopan APMC')
    assert err is None, f"Expected no error, got {err}"
    assert res is not None, "Expected prediction output dictionary"
    assert res['commodity'].lower() == 'onion'
    assert len(res['predictions']) == 3
    for pred in res['predictions']:
        assert 'predicted_price' in pred
        assert pred['predicted_price'] > 0

if __name__ == '__main__':
    test_generate_3day_prediction()
    print("All ML tests passed successfully!")
