#!/usr/bin/env python3
"""
Agus Finance Logo Update Tool
Convert image to PWA icon sizes and update application
"""

import os
import sys
import shutil
from PIL import Image

# Get the project root assuming script is in scripts/ folder
PROJECT_PATH = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUBLIC_PATH = os.path.join(PROJECT_PATH, "public")

def convert_to_pwa_icons(input_file):
    """Convert image to PWA icon sizes with proper formatting"""
    if not os.path.exists(input_file):
        print(f"❌ Error: File not found: {input_file}")
        return False
    
    try:
        # Open original image
        img = Image.open(input_file)
        print(f"✓ Opened image: {input_file}")
        print(f"  Original size: {img.width}×{img.height}")
        print(f"  Format: {img.format}, Mode: {img.mode}")
        
        # Convert to RGBA if needed (preserve transparency)
        if img.mode not in ['RGBA', 'LA', 'P']:
            img = img.convert('RGBA')
        elif img.mode == 'P':
            img = img.convert('RGBA')
        
        # Create 192x192 icon
        print("\n📐 Creating 192×192 icon...")
        img_192 = img.copy()
        img_192.thumbnail((192, 192), Image.Resampling.LANCZOS)
        
        # Center on transparent or white background
        canvas_192 = Image.new('RGBA', (192, 192), (255, 255, 255, 0))
        offset_x = (192 - img_192.width) // 2
        offset_y = (192 - img_192.height) // 2
        canvas_192.paste(img_192, (offset_x, offset_y), img_192)
        canvas_192.save(f"{PUBLIC_PATH}/pwa-192x192.png", "PNG", quality=95)
        print(f"✓ Saved: pwa-192x192.png")
        
        # Create 512x512 icon
        print("\n📐 Creating 512×512 icon...")
        img_512 = img.copy()
        img_512.thumbnail((512, 512), Image.Resampling.LANCZOS)
        
        canvas_512 = Image.new('RGBA', (512, 512), (255, 255, 255, 0))
        offset_x = (512 - img_512.width) // 2
        offset_y = (512 - img_512.height) // 2
        canvas_512.paste(img_512, (offset_x, offset_y), img_512)
        canvas_512.save(f"{PUBLIC_PATH}/pwa-512x512.png", "PNG", quality=95)
        print(f"✓ Saved: pwa-512x512.png")
        
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return False

def main():
    print("=" * 60)
    print("🎨 Agus Finance Logo Update Tool")
    print("=" * 60)
    
    image_file = None
    
    # Method 1: Check if argument provided
    if len(sys.argv) > 1:
        image_file = sys.argv[1]
        # Expand ~ if needed
        image_file = os.path.expanduser(image_file)
    
    # Method 2: Check for recent images in Downloads
    if not image_file or not os.path.exists(image_file):
        print("\n🔍 Searching for recent images...")
        for folder in [os.path.expanduser("~/Downloads"), "/tmp"]:
            if os.path.exists(folder):
                for fname in sorted(os.listdir(folder), reverse=True):
                    if fname.lower().endswith(('.png', '.jpg', '.jpeg')):
                        fpath = os.path.join(folder, fname)
                        if os.path.isfile(fpath):
                            # Check if it's reasonably sized (logo files)
                            size = os.path.getsize(fpath)
                            if 1024 < size < 10 * 1024 * 1024:  # 1KB to 10MB
                                print(f"Found: {fpath} ({size:,} bytes)")
                                image_file = fpath
                                break
            if image_file:
                break
    
    if not image_file or not os.path.exists(image_file):
        print("\n❌ No image file found!")
        print("\nUsage:")
        print("  python3 scripts/update_logo.py /path/to/logo.png")
        print("\nOR:")
        print("  1. Save the logo to ~/Downloads/")
        print("  2. Run: python3 scripts/update_logo.py")
        print("\nOR:")
        print("  Copy PNG directly to:")
        print(f"    {PUBLIC_PATH}/pwa-192x192.png")
        print(f"    {PUBLIC_PATH}/pwa-512x512.png")
        sys.exit(1)
    
    print(f"\n📁 Using image: {image_file}\n")
    
    if convert_to_pwa_icons(image_file):
        print("\n" + "=" * 60)
        print("✅ Logo icons created successfully!")
        print("=" * 60)
        print("\n🚀 Next steps:")
        print(f"   cd '{PROJECT_PATH}'")
        print("   npm run build")
        print("   firebase deploy --only hosting")
        print("\n✨ Your app logo will update!")
        sys.exit(0)
    else:
        print("\n❌ Failed to create logo icons")
        sys.exit(1)

if __name__ == "__main__":
    main()
