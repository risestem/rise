import os
import json
import subprocess

directory = 'news_updates'
updates_file = 'updates.json'

updates_dict = {}

for file in os.listdir(directory):
    if file.endswith('.md'):
        path = os.path.join(directory, file)

        # Get the real last commit that changed this file's content
        result = subprocess.run(
            ['git', 'log', '--format=%H', '--', path],
            capture_output=True, text=True
        )
        commits = result.stdout.strip().split('\n')
        real_commit = commits[0]  # first one is the last commit that changed this file's content

        # Get the date of that real commit
        date_result = subprocess.run(
            ['git', 'show', '-s', '--format=%cI', real_commit],
            capture_output=True, text=True
        )
        git_date = date_result.stdout.strip()

        updates_dict[path] = {
            'file': path,
            'datetime': git_date
        }

# Convert to list, sort by datetime (newest first)
updates_list = list(updates_dict.values())
updates_list.sort(key=lambda x: x['datetime'], reverse=True)

with open(updates_file, 'w') as f:
    json.dump(updates_list, f, indent=2)

print("updates.json updated with real last modification times!")
