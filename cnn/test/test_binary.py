import os
from keras.preprocessing import image
from tensorflow import keras

from .settings import _get_image_tensor

ROOT_PATH = os.path.join(os.getcwd())
H5_MODEL = os.path.abspath(
    os.path.join(ROOT_PATH, "model_output", "binary", "mnist_binary.h5")
)
CLASSES = {"five": 0, "not_five": 1}
MODEL = keras.models.load_model(H5_MODEL)


def test_binary_model_positive():
    images_five = ["5-0.jpg", "5-1.jpg", "5-2.jpg", "5-3.jpg"]
    for img in images_five:
        test_image = _get_image_tensor(img)

        result = MODEL.predict(test_image)
        assert result[0][0] == CLASSES["five"]


def test_binary_model_negative():
    images_five = [
        "not_5-0.jpg",
        "not_5-1.jpg",
        "not_5-2.jpg",
        "not_5-3.jpg",
        "not_5-4.jpg",
    ]
    for img in images_five:
        test_image = _get_image_tensor(img)

        result = MODEL.predict(test_image)
        assert result[0][0] == CLASSES["not_five"]
