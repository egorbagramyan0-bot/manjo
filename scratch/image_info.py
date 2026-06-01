import os
from PIL import Image

public_dir = r"c:\Users\User\Desktop\manjo pro\public"
files = [f for f in os.listdir(public_dir) if f.lower().endswith(('.png', '.jpg', '.jpeg', '.svg'))]

print(f"{'Filename':<30} | {'Format':<6} | {'Dimensions':<12} | {'Size (KB)':<10}")
print("-" * 68)
for f in files:
    path = os.path.join(public_dir, f)
    size_kb = os.path.getsize(path) / 1024
    if f.lower().endswith('.svg'):
        print(f"{f:<30} | SVG    | {'N/A':<12} | {size_kb:.1f}")
        continue
    try:
        with Image.open(path) as img:
            print(f"{f:<30} | {img.format:<6} | {f'{img.width}x{img.height}':<12} | {size_kb:.1f}")
    except Exception as e:
        print(f"{f:<30} | ERROR  | {'N/A':<12} | {size_kb:.1f} - {e}")
