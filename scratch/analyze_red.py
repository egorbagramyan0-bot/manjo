from PIL import Image
import os

path = r"C:\Users\User\.gemini\antigravity-ide\brain\ff6f077d-c976-4cc7-90ac-a2482bfc8a7e\test_red_header.png"
if not os.path.exists(path):
    print("test_red_header.png not found")
else:
    img = Image.open(path)
    print(f"Image size: {img.size}")
    w, h = img.size
    mid_x = w // 2
    for y in range(0, 100):
        pixel = img.getpixel((mid_x, y))
        print(f"y={y:2d}: RGB={pixel}")
