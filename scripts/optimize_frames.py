#!/usr/bin/env python3
"""
Script to optimize 4K frames for web use by resizing them to a smaller resolution
while maintaining aspect ratio and transparency.
"""

import os
import sys
from PIL import Image
import argparse

def optimize_frames(input_dir, output_dir, max_width=800, quality=85):
    """
    Optimize frames by resizing them for web use.
    
    Args:
        input_dir: Directory containing original 4K frames
        output_dir: Directory to save optimized frames
        max_width: Maximum width for optimized frames (default: 800px)
        quality: JPEG quality for compression (default: 85)
    """
    
    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)
    
    # Get all PNG files from input directory
    frame_files = [f for f in os.listdir(input_dir) if f.lower().endswith('.png')]
    frame_files.sort()  # Ensure proper order
    
    if not frame_files:
        print(f"No PNG files found in {input_dir}")
        return
    
    print(f"Found {len(frame_files)} frames to optimize")
    print(f"Resizing to max width: {max_width}px")
    print(f"Output directory: {output_dir}")
    
    for i, filename in enumerate(frame_files):
        input_path = os.path.join(input_dir, filename)
        output_path = os.path.join(output_dir, filename)
        
        try:
            # Open the image
            with Image.open(input_path) as img:
                # Get original dimensions
                original_width, original_height = img.size
                
                # Calculate new dimensions maintaining aspect ratio
                if original_width > max_width:
                    ratio = max_width / original_width
                    new_width = max_width
                    new_height = int(original_height * ratio)
                else:
                    new_width, new_height = original_width, original_height
                
                # Resize the image using high-quality resampling
                resized_img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
                
                # Save as PNG to preserve transparency
                resized_img.save(output_path, 'PNG', optimize=True)
                
                # Progress indicator
                if (i + 1) % 10 == 0 or i == len(frame_files) - 1:
                    print(f"Processed {i + 1}/{len(frame_files)} frames")
                    
        except Exception as e:
            print(f"Error processing {filename}: {e}")
            continue
    
    print(f"\nOptimization complete!")
    print(f"Optimized frames saved to: {output_dir}")

def main():
    parser = argparse.ArgumentParser(description='Optimize 4K frames for web use')
    parser.add_argument('--input', '-i', default='public/v4_frames', 
                       help='Input directory containing 4K frames (default: public/v4_frames)')
    parser.add_argument('--output', '-o', default='public/v4_frames_optimized',
                       help='Output directory for optimized frames (default: public/v4_frames_optimized)')
    parser.add_argument('--width', '-w', type=int, default=800,
                       help='Maximum width for optimized frames (default: 800)')
    parser.add_argument('--quality', '-q', type=int, default=85,
                       help='Quality for compression (default: 85)')
    
    args = parser.parse_args()
    
    # Check if input directory exists
    if not os.path.exists(args.input):
        print(f"Error: Input directory '{args.input}' does not exist")
        sys.exit(1)
    
    # Run optimization
    optimize_frames(args.input, args.output, args.width, args.quality)

if __name__ == '__main__':
    main()
