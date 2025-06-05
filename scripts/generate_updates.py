import os
import json
from datetime import datetime

# Directory containing your markdown files
directory = 'news_updates'

# Load the current updates.json if it exists
updates_file = 'updates.json'
if os.path.exists(updates_file):
    with open(updates_file, 'r') as f:
        updates = json.load(f)
else:
    updates = []

# Convert to dict for easier lookup
updates_dict = {entry['file']: entry for entry in updates}

# Check each .md file in the directory
for file in os.listdir(directory):
    if file.endswith('.md'):
        path = os.path.join(directory, file)
        mtime = os.path.getmtime(path)
        dt_str = datetime.fromtimestamp(mtime).isoformat()

        # If file is new or modified, update it in the dict
        if path not in updates_dict or updates_dict[path]['datetime'] != dt_str:
            updates_dict[path] = {
                'file': path,
                'datetime': dt_str
            }

# Convert back to list, sorted by datetime (newest first)
updates_list = list(updates_dict.values())
updates_list.sort(key=lambda x: x['datetime'], reverse=True)

# Write to updates.json
with open(updates_file, 'w') as f:
    json.dump(updates_list, f, indent=2)

print("updates.json updated with only changed/new entries!")
