import os
import json

# List markdown files
files = [f for f in os.listdir('news_updates') if f.endswith('.md')]

# Sort by last modified time, most recent first
files = sorted(files, key=lambda x: os.path.getmtime(f'news_updates/{x}'), reverse=True)

# Create a list of full file paths (or just file names if preferred)
updates = [f'news_updates/{f}' for f in files]

# Write to JSON
with open('updates.json', 'w') as f:
    json.dump({'updates': updates}, f, indent=4)

print("Updated updates.json with all updates (most recent first).")
