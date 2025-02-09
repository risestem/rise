#!/bin/bash
cd "$(dirname "$0")"

bun install
bunx tailwindcss -i ../site/static/.tailwind.css -o ../site/static/compiled.css
bunx cleancss ../site/static/compiled.css -o ../site/static/compiled.min.css
