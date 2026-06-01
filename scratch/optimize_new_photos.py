import os
from PIL import Image

photo_dir = r"c:\Users\User\Desktop\manjo pro\public\manjo photo"
files = [f for f in os.listdir(photo_dir) if f.lower().endswith('.webp')]

def save_image(img, base_path, format_name, quality=80):
    try:
        img.save(base_path, format=format_name, quality=quality)
        print(f"Saved: {base_path} ({format_name})")
    except Exception as e:
        print(f"Failed to save {base_path} in {format_name}: {e}")

print("Optimizing new photos for the carousel...")
for f in files:
    if "_thumb" in f:
        continue
    path = os.path.join(photo_dir, f)
    base_name = os.path.splitext(f)[0]
    
    with Image.open(path) as img:
        # Resize to 512x512 square thumbnail for WebGL plane
        img_thumb = img.resize((512, 512), Image.Resampling.LANCZOS)
        
        # Save WebP thumbnail
        save_image(img_thumb, os.path.join(photo_dir, f"{base_name}_thumb.webp"), "WEBP", 80)
        # Save AVIF thumbnail
        save_image(img_thumb, os.path.join(photo_dir, f"{base_name}_thumb.avif"), "AVIF", 78)

print("New photos optimization complete!")
