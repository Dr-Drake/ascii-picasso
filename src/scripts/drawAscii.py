# Import the required libraries
import sys
# import base64
# from io import BytesIO
from PIL import Image
import numpy as np
from ascii_magic import from_image
from ascii_magic import from_pillow_image

# Get the filename of the input image from the command-line arguments
if len(sys.argv) < 2:
    print("Usage: python ascii_art.py <filePath>")
    sys.exit(1)

filePath = sys.argv[1]

def create_ascii_art(filePath, max_dim=100):
    with Image.open(filePath) as image:
        w, h = image.size
        if w > h:
            new_w = max_dim
            new_h = int(h * (max_dim / w))
        else:
            new_h = max_dim
            new_w = int(w * (max_dim / h))
        image = image.resize((new_w, new_h))
        ascii_art = from_pillow_image(image)
        return ascii_art
# base64Image = sys.argv[1]
# imageData = base64.b64decode(base64Image.split(',')[1])

# Load the image
# image = Image.open(BytesIO(imageData))
# image = Image.open(filePath)

# Convert the image to grayscale
# gray_image = image.convert("L")

# # Resize the image to a smaller size
# size = (int(gray_image.size[0]/10), int(gray_image.size[1]/10))
# small_image = gray_image.resize(size)

# # Convert the image to a numpy array
# image_array = np.array(small_image)

# # Define the ASCII characters to use
# ascii_chars = [" ", ".", "*", ":", "o", "&", "8", "#", "@"]
# ascii_range = 255/len(ascii_chars)

# # Map each brightness value to a corresponding ASCII character
# ascii_art = ""
# for row in image_array:
#     for pixel in row:
#         index = int(pixel/ascii_range)
#         ascii_art += ascii_chars[index]
#     ascii_art += "\n"

# # Print the ASCII art to console
# print(ascii_art)

# Convert the image to ASCII art
ascii_art = from_image(filePath)
# ascii_art = create_ascii_art(filePath, max_dim=100)
ascii_art.to_terminal()
# Print the ASCII art
# print(ascii_art)

