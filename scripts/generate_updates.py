import os
import json
import subprocess
from datetime import datetime

directory = 'news_updates'
updates_file = 'updates.json'

# Load existing updates
if os.path.exists(updates_file):
    with open(updates_file, 'r') as f:
        updates = json.load(f)
else:
    updates = []

# Convert to dict for easier updates
updates_dict = {entry['file']: entry for entry in updates}

# Check each .md file in the directory
for file in os.listdir(directory):
    if file.endswith('.md'):
        path = os.path.join(directory, file)

        # Get last commit date from Git
        result = subprocess.run(
            ['git', 'log', '-1', '--format=%cI', '--', path],
            capture_output=True, text=True
        )
        git_date = result.stdout.strip()

        # If file is new or the commit date has changed, update it
        if path not in updates_dict or updates_dict[path]['datetime'] != git_date:
            updates_dict[path] = {
                'file': path,
                'datetime': git_date
            }

# Convert back to list, sorted by datetime (newest first)
updates_list = list(updates_dict.values())
updates_list.sort(key=lambda x: x['datetime'], reverse=True)

# Write updates to file
with open(updates_file, 'w') as f:
    json.dump(updates_list, f, indent=2)

print("updates.json updated based on Git commit history!")
