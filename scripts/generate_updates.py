import os
import json
import subprocess
import sys

directory = 'news_updates'
updates_file = 'updates.json'

# Get changed files from args
changed_files = sys.argv[1:]
print(f"Processing changed files: {changed_files}")

# Load existing updates
if os.path.exists(updates_file):
    with open(updates_file, 'r') as f:
        updates = json.load(f)
else:
    updates = []

# Convert to dict for easier updates
updates_dict = {entry['file']: entry for entry in updates}

# For each changed file, get its last commit date
for path in changed_files:
    if path.endswith('.md'):
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

# Write updates
with open(updates_file, 'w') as f:
    json.dump(updates_list, f, indent=2)

print("updates.json updated with only actually changed entries!")
