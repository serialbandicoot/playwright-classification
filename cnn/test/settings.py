import os
from keras.preprocessing import image
import numpy as np

ROOT_PATH = os.path.join(os.getcwd())
IMAGE_PATH = os.path.join(ROOT_PATH, "test", "images")


def _get_image_tensor(img):
    img_file = os.path.join(IMAGE_PATH, img)

    # Load and preprocess the image
    test_image = image.load_img(img_file, target_size=(28, 28))
    test_image = image.img_to_array(test_image)
    test_image = np.expand_dims(test_image, axis=0)
    return test_image
