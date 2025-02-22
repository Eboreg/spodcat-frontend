#!/usr/bin/env python3

import re
from dataclasses import dataclass
from pathlib import Path

import requests

SYMBOLS = [
    "download",
    "link",
    "pause",
    "play_arrow",
    "rss_feed",
]


@dataclass
class Response:
    css: str | None = None
    path: Path | None = None
    font_format: str | None = None

    @property
    def src(self):
        if not self.path or not self.font_format:
            return None
        return f"url(/{self.path.name}) format('{self.font_format}')"


def get_font_extension(content_type: str):
    if content_type.startswith("font/"):
        return content_type[5:]
    raise ValueError


def get_font_file(headers: dict | None = None) -> Response | None:
    headers = headers or {}
    symbols = ",".join(sorted(SYMBOLS))
    css_url = f"https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,1,0&icon_names={symbols}"
    css = requests.get(css_url, headers=headers).text
    match = re.match(r".*src: *url\((.*?)\) *format\(['\"](.*?)['\"]\).*", css, flags=re.DOTALL)

    if match:
        font_url = match.group(1)
        resp = requests.get(font_url)

        if resp.status_code == 200:
            extension = get_font_extension(resp.headers.get("Content-Type", ""))
            path = Path(__file__).parent / "public" / f"material-symbols.{extension}"

            with path.open("wb") as f:
                f.write(resp.content)

            return Response(css=css, path=path, font_format=extension)

    return Response()


def main():
    ttf = get_font_file()
    woff2 = get_font_file({"User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:135.0) Gecko/20100101 Firefox/135.0"})
    css = ttf.css or woff2.css
    srcs = [r.src for r in [ttf, woff2] if r.src]

    if css and srcs:
        css = re.sub(r"src: *url\(.*?\) *format\(.*?\)", "src: " + ", ".join(srcs), css)
        path = Path(__file__).parent / "app/styles/material-symbols.scss"

        with path.open("wt") as f:
            f.write(css)


if __name__ == "__main__":
    main()
