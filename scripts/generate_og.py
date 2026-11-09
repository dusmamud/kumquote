#!/usr/bin/env python3
"""Generate missing KumQuote OG images (1200x630), missing-only.

Cards (v2 — Ink & Gold Poster): deep navy background, gold eyebrow
bar + KUMQUOTE, the quote text in ivory serif, author in light gold,
footer line. Titles/text come from each quote's own frontmatter, so
nothing is invented.

Fonts: DejaVu Serif (Bold + regular), present on Ubuntu by default
(fonts-dejavu-core) and on the GitHub Actions ubuntu-latest runner.

Usage:
  python3 scripts/generate_og.py samples   # 4 sample cards into ./samples/
  python3 scripts/generate_og.py all       # missing-only: every quote
                                            # without ogImage gets a card
                                            # in public/og/ + an ogImage
                                            # frontmatter line (checkout
                                            # only; nothing is committed)
"""
import pathlib
import re
import sys
import textwrap

from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 630
BASE = pathlib.Path(__file__).resolve().parent.parent
OG_DIR = BASE / "public" / "og"
QUOTES_DIR = BASE / "src" / "content" / "quotes"

NAVY = (16, 28, 54)
IVORY = (242, 234, 217)
GOLD = (193, 154, 75)
GOLD_LIGHT = (216, 181, 110)
CREAM_DIM = (168, 162, 148)
HAIRLINE = (36, 52, 79)


def find_font(bold=False):
    candidates = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    ]
    for path in candidates:
        if pathlib.Path(path).exists():
            return path
    raise FileNotFoundError("No usable font found: " + ", ".join(candidates))


def wrap(draw, text, font, max_width):
    words = text.split()
    lines, current = [], ""
    for word in words:
        trial = f"{current} {word}".strip()
        if draw.textlength(trial, font=font) <= max_width:
            current = trial
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def render_card(text, author, out_path):
    img = Image.new("RGB", (W, H), NAVY)
    draw = ImageDraw.Draw(img)
    # Eyebrow bar + wordmark.
    draw.rectangle([80, 64, 140, 72], fill=GOLD)
    eyebrow = ImageFont.truetype(find_font(bold=True), 30)
    draw.text((160, 48), "KUMQUOTE", font=eyebrow, fill=GOLD)
    # Quote text, wrapped, max 5 lines.
    quote_font = ImageFont.truetype(find_font(bold=True), 54)
    lines = wrap(draw, f"\u201c{text}\u201d", quote_font, W - 160)
    lines = lines[:5]
    y = 150
    for line in lines:
        draw.text((80, y), line, font=quote_font, fill=IVORY)
        y += 68
    # Author + hairline footer.
    author_font = ImageFont.truetype(find_font(bold=False), 34)
    draw.text((80, y + 16), f"\u2014 {author}", font=author_font, fill=GOLD_LIGHT)
    draw.line([(80, H - 80), (W - 80, H - 80)], fill=HAIRLINE, width=2)
    foot_font = ImageFont.truetype(find_font(bold=False), 26)
    draw.text((80, H - 64), "kumquote.pages.dev", font=foot_font, fill=CREAM_DIM)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    img.save(out_path, "PNG")
    return out_path


FRONTMATTER = re.compile(r"^---\n(.*?)\n---\n", re.S)


def parse_quote(path):
    raw = path.read_text(encoding="utf-8")
    m = FRONTMATTER.match(raw)
    if not m:
        return None
    fields = {}
    for line in m.group(1).splitlines():
        if ":" in line:
            key, value = line.split(":", 1)
            fields[key.strip()] = value.strip().strip('"').strip("'")
    return fields


def quote_files():
    return sorted(QUOTES_DIR.rglob("*.md")) + sorted(QUOTES_DIR.rglob("*.mdx"))


def generate_missing():
    made = 0
    for path in quote_files():
        fields = parse_quote(path)
        if not fields or not fields.get("text") or not fields.get("author"):
            continue
        if fields.get("ogImage"):
            continue
        slug = path.stem
        out = OG_DIR / f"{slug}-en.png"
        if out.exists():
            continue
        render_card(fields["text"], fields["author"], out)
        # Patch frontmatter (checkout only; the deploy job does not commit):
        # insert the ogImage line right after the opening ---.
        raw = path.read_text(encoding="utf-8")
        if "ogImage:" not in raw.split("---", 2)[1]:
            raw = raw.replace("---\n", f"---\nogImage: '/og/{slug}-en.png'\n", 1)
            path.write_text(raw, encoding="utf-8")
        made += 1
        print(f"made {out.relative_to(BASE)} for {slug}")
    # Site-wide fallback card.
    fallback = BASE / "public" / "og.png"
    if not fallback.exists():
        render_card("Quotes worth remembering.", "KumQuote", fallback)
        print(f"made {fallback.relative_to(BASE)}")
    print(f"done: {made} quote card(s) generated")


def samples():
    out_dir = BASE / "samples"
    out_dir.mkdir(exist_ok=True)
    for i, path in enumerate(quote_files()[:4]):
        fields = parse_quote(path)
        if not fields:
            continue
        render_card(fields["text"], fields["author"], out_dir / f"sample-{i+1}-{path.stem}.png")
        print(f"sample {i+1}: {path.stem}")
    print("done")


if __name__ == "__main__":
    mode = sys.argv[1] if len(sys.argv) > 1 else "all"
    if mode == "samples":
        samples()
    elif mode == "all":
        generate_missing()
    else:
        print("usage: generate_og.py [samples|all]")
        sys.exit(2)
