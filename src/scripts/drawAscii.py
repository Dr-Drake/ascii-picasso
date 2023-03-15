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

# Convert the image to ASCII art
ascii_art = from_image(filePath)

# Print the ASCII art
ascii_art.to_terminal()
