import os
import json
import subprocess
from datetime import datetime

directory = '/news_updates'
updates_file = 'updates.json'
updates_dict = {}

for file in os.listdir(directory):
    if file.endswith('.md'):
        path = os.path.join(directory, file)
        
        try:
            result = subprocess.run(
                ['git', 'log', '-1', '--format=%H', '--', path],
                capture_output=True, text=True, check=True
            )
            
            if result.stdout.strip():
                commit_hash = result.stdout.strip()
                
                date_result = subprocess.run(
                    ['git', 'show', '-s', '--format=%cI', commit_hash],
                    capture_output=True, text=True, check=True
                )
                git_date = date_result.stdout.strip()
                
            else:
                git_date = datetime.now().astimezone().isoformat()
                
        except subprocess.CalledProcessError as e:
            print(f"Error getting git info for {path}: {e}")
            git_date = datetime.now().astimezone().isoformat()
        
        updates_dict[path] = {
            'file': path,
            'datetime': git_date
        }

updates_list = list(updates_dict.values())
updates_list.sort(key=lambda x: x['datetime'], reverse=True)

with open(updates_file, 'w') as f:
    json.dump(updates_list, f, indent=2)

print("updates.json updated with real last modification times!")
print(f"Found {len(updates_list)} files:")
for update in updates_list:
    print(f"  {update['file']}: {update['datetime']}")
