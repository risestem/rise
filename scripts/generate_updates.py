import os
import json
from datetime import datetime

# Directory containing your markdown files
directory = 'news_updates'

# Get a list of markdown files and their last modification times
updates = []
for file in os.listdir(directory):
    if file.endswith('.md'):
        path = os.path.join(directory, file)
        mtime = os.path.getmtime(path)
        # Convert mtime to ISO format
        dt_str = datetime.fromtimestamp(mtime).isoformat()
        updates.append({
            'file': os.path.join(directory, file),
            'datetime': dt_str
        })

# Sort the updates by datetime (newest first)
updates.sort(key=lambda x: x['datetime'], reverse=True)

# Write to updates.json
with open('updates.json', 'w') as f:
    json.dump(updates, f, indent=2)

print("updates.json generated with datetimes!")
