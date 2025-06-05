import os
import json
import subprocess

directory = 'news_updates'
updates_file = 'updates.json'

# Prepare updates dictionary
updates_dict = {}

# For each .md file in the directory, get last commit timestamp
for file in os.listdir(directory):
    if file.endswith('.md'):
        path = os.path.join(directory, file)

        # Get last commit date of the file
        result = subprocess.run(
            ['git', 'log', '-1', '--format=%cI', '--', path],
            capture_output=True, text=True
        )
        git_date = result.stdout.strip()

        updates_dict[path] = {
            'file': path,
            'datetime': git_date
        }

# Convert to list, sort by datetime (newest first)
updates_list = list(updates_dict.values())
updates_list.sort(key=lambda x: x['datetime'], reverse=True)

# Write to updates.json
with open(updates_file, 'w') as f:
    json.dump(updates_list, f, indent=2)

print("updates.json fully rebuilt from Git commit history!")
