import os
from PIL import Image, ImageOps
import pillow_heif

# Register HEIF opener with Pillow
pillow_heif.register_heif_opener()

photos_dir = r"c:\New_PC\an\photos"
output_dir = r"c:\New_PC\an\optimized_photos"
os.makedirs(output_dir, exist_ok=True)

files = sorted(os.listdir(photos_dir))
print(f"Found files in {photos_dir}:")

for f in files:
    if f.lower().endswith(('.jpg', '.jpeg', '.png', '.heic', '.heif')):
        input_path = os.path.join(photos_dir, f)
        base_name = os.path.splitext(f)[0]
        
        try:
            with Image.open(input_path) as img:
                # Transpose according to EXIF orientation so mobile photos aren't rotated
                transposed = ImageOps.exif_transpose(img)
                width, height = transposed.size
                mode = transposed.mode
                aspect = width / height
                
                print(f"File: {f:16} | Size: {width:4}x{height:4} | Mode: {mode:5} | Aspect: {aspect:.2f} ({'Portrait' if aspect < 0.9 else 'Landscape' if aspect > 1.1 else 'Square'})")
                
                # Convert to RGB if needed
                if transposed.mode in ("RGBA", "P", "LA"):
                    rgb_img = transposed.convert("RGB")
                else:
                    rgb_img = transposed
                
                # Save as optimized WebP
                webp_path = os.path.join(output_dir, f"{base_name}.webp")
                rgb_img.save(webp_path, "WEBP", quality=90, method=6)
                
                # Save as standard high quality JPG
                jpg_path = os.path.join(output_dir, f"{base_name}.jpg")
                rgb_img.save(jpg_path, "JPEG", quality=92, optimize=True)
                
        except Exception as e:
            print(f"Error processing {f}: {e}")

print("Processing complete!")
