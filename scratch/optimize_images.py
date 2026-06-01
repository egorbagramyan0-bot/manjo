import os
from PIL import Image

public_dir = r"c:\Users\User\Desktop\manjo pro\public"

images_to_process = [
    "dish_salad.png",
    "dish_grill.png",
    "dish_cocktail.png",
    "gallery_table.png",
    "gallery_evening.png",
    "gallery_fireplace.png",
    "gallery_hall.png",
    "gallery_veranda.png",
    "gallery_cuisine.png",
    "gallery_bar.png",
    "gallery_grill.png",
    "hero_conservatory.png"
]

def save_image(img, base_path, format_name, quality=80):
    try:
        img.save(base_path, format=format_name, quality=quality)
        print(f"Saved: {base_path} ({format_name})")
    except Exception as e:
        print(f"Failed to save {base_path} in {format_name}: {e}")

# Process Hero 2 (Desktop Hero)
hero2_path = os.path.join(public_dir, "hero2.png")
if os.path.exists(hero2_path):
    print("Processing hero2.png (Desktop Hero)...")
    with Image.open(hero2_path) as img:
        # Original is 1672x941
        # Save as WebP
        save_image(img, os.path.join(public_dir, "hero2.webp"), "WEBP", 82)
        save_image(img, os.path.join(public_dir, "hero2_desktop_2x.webp"), "WEBP", 82)
        # 1x width 1200px
        img_1x = img.resize((1200, int(1200 * img.height / img.width)), Image.Resampling.LANCZOS)
        save_image(img_1x, os.path.join(public_dir, "hero2_desktop.webp"), "WEBP", 80)
        
        # Try AVIF
        save_image(img, os.path.join(public_dir, "hero2.avif"), "AVIF", 82)
        save_image(img, os.path.join(public_dir, "hero2_desktop_2x.avif"), "AVIF", 82)
        save_image(img_1x, os.path.join(public_dir, "hero2_desktop.avif"), "AVIF", 80)

# Process heromob.png (Mobile Hero)
heromob_path = os.path.join(public_dir, "heromob.png")
if os.path.exists(heromob_path):
    print("Processing heromob.png (Mobile Hero)...")
    with Image.open(heromob_path) as img:
        # Original is 941x1672
        # Save as WebP
        save_image(img, os.path.join(public_dir, "heromob.webp"), "WEBP", 82)
        save_image(img, os.path.join(public_dir, "heromob_mobile_2x.webp"), "WEBP", 82)
        # 1x width 470px
        img_1x = img.resize((470, int(470 * img.height / img.width)), Image.Resampling.LANCZOS)
        save_image(img_1x, os.path.join(public_dir, "heromob_mobile.webp"), "WEBP", 80)
        
        # Try AVIF
        save_image(img, os.path.join(public_dir, "heromob.avif"), "AVIF", 82)
        save_image(img, os.path.join(public_dir, "heromob_mobile_2x.avif"), "AVIF", 82)
        save_image(img_1x, os.path.join(public_dir, "heromob_mobile.avif"), "AVIF", 80)

# Process all other images
for img_name in images_to_process:
    path = os.path.join(public_dir, img_name)
    if not os.path.exists(path):
        print(f"Skipping {img_name} - not found.")
        continue
    print(f"Processing {img_name}...")
    base_name = os.path.splitext(img_name)[0]
    
    with Image.open(path) as img:
        # Save Full WebP
        save_image(img, os.path.join(public_dir, f"{base_name}.webp"), "WEBP", 82)
        save_image(img, os.path.join(public_dir, f"{base_name}_full.webp"), "WEBP", 82)
        
        # Save Thumb WebP (512x512)
        img_thumb = img.resize((512, 512), Image.Resampling.LANCZOS)
        save_image(img_thumb, os.path.join(public_dir, f"{base_name}_thumb.webp"), "WEBP", 80)
        
        # Try AVIF
        save_image(img, os.path.join(public_dir, f"{base_name}.avif"), "AVIF", 80)
        save_image(img, os.path.join(public_dir, f"{base_name}_full.avif"), "AVIF", 80)
        save_image(img_thumb, os.path.join(public_dir, f"{base_name}_thumb.avif"), "AVIF", 78)

print("Optimization complete!")
