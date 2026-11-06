"""Build the news index from stable, explicit publication dates.

Dates belong to the article, never to its latest Git commit or the build clock.
"""
import json
import re
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def generate(root=ROOT):
    updates = []
    for path in sorted((root / 'news_updates').glob('*.md')):
        match = re.search(r'^<!-- published: (\d{4}-\d{2}-\d{2}) -->$', path.read_text(), re.M)
        if not match:
            raise ValueError(f'{path.name}: add <!-- published: YYYY-MM-DD -->')
        published = date.fromisoformat(match[1]).isoformat()
        updates.append({'file': path.relative_to(root).as_posix(), 'datetime': published})
    updates.sort(key=lambda item: (item['datetime'], item['file']), reverse=True)
    (root / 'updates.json').write_text(json.dumps(updates, indent=2) + '\n')
    return updates


if __name__ == '__main__':
    generate()
