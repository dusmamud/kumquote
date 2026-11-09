#!/usr/bin/env python3
"""Bulk-import quotes from JSON into one .md file per quote.

Input: a JSON array, one object per quote:
  {"slug": "dream-before-dreams-apj-abdul-kalam",
   "text": "You have to dream before your dreams can come true.",
   "author": "A. P. J. Abdul Kalam",
   "authorRole": "Former President of India",
   "category": "motivation",
   "tags": ["dreams", "morning"],
   "source": "Wings of Fire",
   "pubDate": "2026-11-09",
   "featured": false,
   "meaning": "80-150 words of meaning / context, goes in the body."}

Rules (same as the plan):
- category must be one of the 12 canonical values, else the row is rejected;
- slug must be unique — existing files are never overwritten;
- text 10-500 chars, body (meaning) required — a quote page with an
  empty body is thin content and will not rank.

Usage:
  python3 scripts/quotes_from_json.py quotes.json
  python3 scripts/quotes_from_json.py quotes.json --date 2026-11-10
"""
import datetime
import json
import pathlib
import re
import sys

BASE = pathlib.Path(__file__).resolve().parent.parent
QUOTES_DIR = BASE / "src" / "content" / "quotes"

CATEGORIES = {
    "motivation", "success", "life", "love", "friendship", "discipline",
    "happiness", "wisdom", "leadership", "time", "courage", "gratitude",
}

SLUG_RE = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")


def yaml_str(value):
    return '"' + str(value).replace("\\", "\\\\").replace('"', '\\"') + '"'


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(2)
    rows = json.loads(pathlib.Path(sys.argv[1]).read_text(encoding="utf-8"))
    date = sys.argv[sys.argv.index("--date") + 1] if "--date" in sys.argv else datetime.date.today().isoformat()
    made, skipped = 0, 0
    for row in rows:
        slug = row.get("slug", "")
        problems = []
        if not SLUG_RE.match(slug):
            problems.append("bad slug")
        if row.get("category") not in CATEGORIES:
            problems.append(f"bad category {row.get('category')!r}")
        text = (row.get("text") or "").strip()
        if not 10 <= len(text) <= 500:
            problems.append("text must be 10-500 chars")
        if not (row.get("author") or "").strip():
            problems.append("missing author")
        meaning = (row.get("meaning") or "").strip()
        if len(meaning.split()) < 40:
            problems.append("meaning too short (aim for 80-150 words)")
        out = QUOTES_DIR / (row.get("category") or "misc") / f"{slug}.md"
        if out.exists():
            problems.append("slug already exists")
        if problems:
            print(f"SKIP {slug}: {', '.join(problems)}")
            skipped += 1
            continue
        lines = ["---"]
        lines.append(f"text: {yaml_str(text)}")
        lines.append(f"author: {yaml_str(row['author'])}")
        if row.get("authorRole"):
            lines.append(f"authorRole: {yaml_str(row['authorRole'])}")
        lines.append(f"category: {yaml_str(row['category'])}")
        tags = row.get("tags") or []
        lines.append("tags: [" + ", ".join(yaml_str(t) for t in tags[:5]) + "]")
        if row.get("source"):
            lines.append(f"source: {yaml_str(row['source'])}")
        lines.append(f"pubDate: {row.get('pubDate') or date}")
        lines.append(f"featured: {'true' if row.get('featured') else 'false'}")
        lines.append("draft: false")
        lines.append("---")
        lines.append("")
        lines.append(meaning)
        lines.append("")
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text("\n".join(lines), encoding="utf-8")
        print(f"made {out.relative_to(BASE)}")
        made += 1
    print(f"done: {made} made, {skipped} skipped")


if __name__ == "__main__":
    main()
