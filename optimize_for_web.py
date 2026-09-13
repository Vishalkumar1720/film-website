import os
from PIL import Image

input_dir = r"c:\New_PC\an\optimized_photos"
web_dir = r"c:\New_PC\an\public\photos"
os.makedirs(web_dir, exist_ok=True)

files = [f for f in os.listdir(input_dir) if f.lower().endswith(('.jpg', '.jpeg'))]

print(f"Resizing and optimizing {len(files)} files to {web_dir}...")

for f in files:
    base = os.path.splitext(f)[0]
    in_path = os.path.join(input_dir, f)
    
    with Image.open(in_path) as img:
        w, h = img.size
        max_dim = 1920
        if max(w, h) > max_dim:
            scale = max_dim / max(w, h)
            new_w, new_h = int(w * scale), int(h * scale)
            resized = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
        else:
            resized = img.copy()
            new_w, new_h = w, h
            
        webp_out = os.path.join(web_dir, f"{base}.webp")
        jpg_out = os.path.join(web_dir, f"{base}.jpg")
        
        resized.save(webp_out, "WEBP", quality=85, method=6)
        resized.save(jpg_out, "JPEG", quality=85, optimize=True)
        
        s_webp = os.path.getsize(webp_out) / 1024
        s_jpg = os.path.getsize(jpg_out) / 1024
        print(f"Optimized {base:12}: {new_w}x{new_h} -> WebP: {s_webp:.1f}KB, JPG: {s_jpg:.1f}KB")

print("All photos optimized for high-speed mobile loading!")
