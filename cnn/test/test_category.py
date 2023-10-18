import os
from keras.preprocessing import image
from tensorflow import keras

from .settings import _get_image_tensor

ROOT_PATH = os.path.join(os.getcwd())
H5_MODEL = os.path.abspath(
    os.path.join(ROOT_PATH, "model_output", "category", "mnist_category.h5")
)
CLASSES = {"four": 0, "nine": 1, "two": 2}
MODEL = keras.models.load_model(H5_MODEL)


def test_category_four():
    images_five = ["4-0.jpg", "4-1.jpg", "4-2.jpg", "4-3.jpg"]
    for img in images_five:
        test_image = _get_image_tensor(img)

        result = MODEL.predict(test_image)
        assert result[0][CLASSES["four"]] == 1


def test_category_nine():
    images_five = ["9-0.jpg", "9-1.jpg", "9-2.jpg", "9-3.jpg"]
    for img in images_five:
        test_image = _get_image_tensor(img)

        result = MODEL.predict(test_image)
        assert result[0][CLASSES["nine"]] == 1


def test_category_two():
    images_five = ["2-0.jpg", "2-1.jpg", "2-2.jpg", "2-3.jpg"]
    for img in images_five:
        test_image = _get_image_tensor(img)

        result = MODEL.predict(test_image)
        assert result[0][CLASSES["two"]] == 1
