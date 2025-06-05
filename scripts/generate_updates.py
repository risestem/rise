import os
import json

files = [
    f for f in os.listdir('news_updates')
    if f.endswith('.md')
]

files.sort(
    key=lambda x: os.path.getmtime(f'news_updates/{x}'),
    reverse=True
)

latest = files[0] if files else ''
data = {'latest_update': f'news_updates/{latest}'}

with open('updates.json', 'w') as f:
    json.dump(data, f, indent=2)

print('Generated updates.json:', data)
