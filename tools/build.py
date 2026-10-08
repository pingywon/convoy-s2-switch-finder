#!/usr/bin/env python3
"""Rebuild everything that is generated from core.js + app.js.

  1. stamp VERSION into core.js (the one place the version number lives)
  2. paste core.js + app.js into the three storefront page bodies
  3. write the public demo site into _site/ (landing page + the three takes)

Run from anywhere:  python3 tools/build.py
"""
import pathlib, re, shutil, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "site-src"
OUT = ROOT / "_site"

TAKES = [
    # storefront file, demo page, short name, one-line description
    ("storefront-v1-console.html", "console.html", "Console",
     "Compact. Finishes grouped by material, every step on one page."),
    ("storefront-v2-guided.html", "guided.html", "Guided",
     "The same steps with bigger type and bigger buttons."),
    ("storefront-v3-board.html", "board.html", "Board",
     "Finishes sorted into two columns by what they can take."),
]


def fill(text, **kw):
    for k, v in kw.items():
        text = text.replace("{{" + k + "}}", v)
    left = re.findall(r"\{\{[A-Z_]+\}\}", text)
    if left:
        sys.exit("unfilled placeholders: %s" % sorted(set(left)))
    return text


def main():
    version = (ROOT / "VERSION").read_text().strip()
    if not re.fullmatch(r"\d+\.\d+\.\d+", version):
        sys.exit("VERSION must look like 1.2.3")

    core_path = ROOT / "core.js"
    core, n = re.subn(r'var VER="[^"]*";', 'var VER="%s";' % version, core_path.read_text())
    if n != 1:
        sys.exit('core.js must contain exactly one  var VER="...";  line')
    core_path.write_text(core)
    script = core + (ROOT / "app.js").read_text()

    fragments = {}
    for store_file, _, _, _ in TAKES:
        path = ROOT / store_file
        text = path.read_text()
        m = re.search(r'var ROOT="[^"]+";var SKIN="[^"]+";\n', text)
        if not m:
            sys.exit("%s: setup line not found" % store_file)
        text = text[:m.end()] + script + "\n</script>\n"
        path.write_text(text)
        fragments[store_file] = text

    if OUT.exists():
        shutil.rmtree(OUT)
    OUT.mkdir()
    shell = (SRC / "shell.html").read_text()
    favicon = (SRC / "favicon.txt").read_text().strip()
    for store_file, page, name, blurb in TAKES:
        # a store page body is <style>..</style> then markup; a real page wants the style in <head>
        style, body = fragments[store_file].split("</style>\n", 1)
        (OUT / page).write_text(fill(
            shell, NAME=name, BLURB=blurb, FAVICON=favicon,
            STYLE=style + "</style>", BODY=body.rstrip("\n")))
    (OUT / "index.html").write_text(fill(
        (SRC / "index.html").read_text(), FAVICON=favicon, VERSION=version))
    if (SRC / "img").is_dir():
        shutil.copytree(SRC / "img", OUT / "img")
    (OUT / "VERSION").write_text(version + "\n")
    (OUT / ".nojekyll").write_text("")
    print("built v%s -> %s" % (version, OUT))
    for p in sorted(OUT.rglob("*")):
        if p.is_file():
            print("  %-28s %7d bytes" % (p.relative_to(OUT), p.stat().st_size))


if __name__ == "__main__":
    main()
