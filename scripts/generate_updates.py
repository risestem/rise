import os
import json

# Get list of .md files in news_updates/
files = [
    f for f in os.listdir('news_updates')
    if f.endswith('.md')
]

# Sort by modification time (most recent first)
files.sort(
    key=lambda x: os.path.getmtime(f'news_updates/{x}'),
    reverse=True
)

# Prepare data
latest = files[0] if files else ''
data = {'latest_update': f'news_updates/{latest}'}

# Write to updates.json
with open('updates.json', 'w') as f:
    json.dump(data, f, indent=2)

print('Generated updates.json:', data)
