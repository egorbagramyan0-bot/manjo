import os

public_dir = r"c:\Users\User\Desktop\manjo pro\public"
pngs_to_delete = [
    "hero2.png",
    "heromob.png",
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

print("Starting PNG assets cleanup...")
freed_bytes = 0
for f in pngs_to_delete:
    path = os.path.join(public_dir, f)
    if os.path.exists(path):
        size = os.path.getsize(path)
        freed_bytes += size
        os.remove(path)
        print(f"Deleted: {f} ({size / 1024:.1f} KB)")
    else:
        print(f"Already deleted/missing: {f}")

print(f"Cleanup complete! Freed {freed_bytes / (1024 * 1024):.2f} MB of space.")
