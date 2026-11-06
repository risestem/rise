import importlib.util
from pathlib import Path
import tempfile
import unittest

spec = importlib.util.spec_from_file_location('generate_updates', Path(__file__).resolve().parents[1] / 'scripts/generate_updates.py')
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


class NewsDates(unittest.TestCase):
    def test_edits_do_not_change_publication_date(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / 'news_updates').mkdir()
            article = root / 'news_updates/camp.md'
            article.write_text('<!-- published: 2025-07-05 -->\n# Camp\nOriginal copy')
            first = module.generate(root)
            article.write_text(article.read_text().replace('Original copy', 'New photo and edited copy'))
            self.assertEqual(module.generate(root), first)
            self.assertEqual(first[0]['datetime'], '2025-07-05')

    def test_missing_or_invalid_dates_fail_instead_of_using_today(self):
        for content in ['# Undated', '<!-- published: 2025-02-30 -->']:
            with self.subTest(content=content), tempfile.TemporaryDirectory() as directory:
                root = Path(directory)
                (root / 'news_updates').mkdir()
                (root / 'news_updates/camp.md').write_text(content)
                with self.assertRaises(ValueError):
                    module.generate(root)

    def test_newest_first(self):
        updates = module.generate()
        self.assertEqual(updates[0]['file'], 'news_updates/RISEcampjune2025.md')
        self.assertEqual(updates[-1]['datetime'], '2025-06-04')
