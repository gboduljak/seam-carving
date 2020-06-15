from numpy import array, rot90
from PIL import Image


def transpose_image(image: Image) -> Image:
    image_bytes = array(image)
    img = rot90(image_bytes, 1, (0, 1))
    img = crop_c(img, scale_r)
    img = rot90(image_bytes, 3, (0, 1))
