#!/usr/bin/env python3
"""Create bounded WebP copies of referenced photos and update site references.

Requires Pillow. Run from the repository root; originals are retained.
"""
from pathlib import Path
import re
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
TEXT_FILES = (
    list(ROOT.glob('*.html')) + [ROOT / 'turtle3']
    + list((ROOT / 'scripts').glob('*.js'))
    + list((ROOT / 'profiles').glob('*.md'))
    + list((ROOT / 'news_updates').glob('*.md'))
    + [ROOT / 'curriculum.json']
)

def optimize():
    texts = {path: path.read_text() for path in TEXT_FILES}
    output = ROOT / 'public' / 'optimized'
    output.mkdir(exist_ok=True)
    before = after = count = 0
    for source in sorted((ROOT / 'public').iterdir()):
        if source.suffix.lower() not in {'.jpg', '.jpeg', '.png'}:
            continue
        # Include names referenced inside HTML, CSS backgrounds and JS data.
        old = f'/{source.name}'
        pattern = re.compile(r'(?<![\w/])' + re.escape(old) + r'(?![\w.])')
        remote = f'https://raw.githubusercontent.com/risestem/rise/main/public{old}'
        if not any(pattern.search(text) or remote in text for text in texts.values()):
            continue
        if source.stat().st_size < 50_000:
            continue
        # Include original extension to avoid collisions such as photo.jpg/photo.png.
        target = output / f'{source.name}.webp'
        with Image.open(source) as image:
            image = ImageOps.exif_transpose(image)
            image.thumbnail((1600, 1600), Image.Resampling.LANCZOS)
            image = image.convert('RGBA' if 'A' in image.getbands() else 'RGB')
            image.save(target, 'WEBP', quality=80, method=6)
        before += source.stat().st_size
        after += target.stat().st_size
        count += 1
        new = f'/optimized/{target.name}'
        for path, text in texts.items():
            # News images should use the same site assets instead of raw GitHub.
            text = text.replace(remote, new)
            texts[path] = pattern.sub(lambda _match: new, text)
    for path, text in texts.items():
        if text != path.read_text():
            path.write_text(text)
    print(f'{count} images: {before:,} -> {after:,} bytes ({(1-after/before)*100:.1f}% smaller)' if before else 'All referenced images are already optimized.')

if __name__ == '__main__':
    optimize()
