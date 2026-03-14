import re
from pathlib import Path

MAX_ID = 7765

# Matches one full item card block
ITEM_PATTERN = re.compile(
    r'<div class="item-card">.*?<p class="item-id">\[(\d+)\]</p>.*?</div>',
    re.DOTALL | re.IGNORECASE
)

def clean_html(file_path: Path):
    html = file_path.read_text(encoding="utf-8", errors="ignore")

    def replacer(match):
        item_id = int(match.group(1))
        if item_id <= MAX_ID:
            return match.group(0)   # keep item
        else:
            return ""               # remove item

    cleaned = ITEM_PATTERN.sub(replacer, html)
    file_path.write_text(cleaned, encoding="utf-8")

# Process all HTML files in the folder
for html_file in Path(".").glob("*.html"):
    print(f"Processing {html_file.name}")
    clean_html(html_file)

print("Done. Items with ID > 7765 have been removed.")
