#!/usr/bin/env python3
import argparse
import json
import subprocess
from pathlib import Path
from typing import Any


CWD = Path(__file__).parent
LOCALE_DIR = CWD / "locales"
APP_DIR = CWD.parent / "app"


def dump(d: dict) -> str:
    return json.dumps(d, indent=2, ensure_ascii=False, sort_keys=True) + "\n"


def ensure_keys(
    from_dict: dict,
    to_dict: Any,
    parent_keys: list[str] | None = None,
) -> dict:
    parent_keys = parent_keys or []
    out_dict: dict = {}

    if not isinstance(to_dict, dict):
        to_dict = {}

    for key, value in from_dict.items():
        if isinstance(value, str):
            if key not in to_dict or not isinstance(to_dict[key], str):
                keys = ".".join((parent_keys + [key]))
                print(f"Key:         {keys}")
                print(f"Source:      {value}")
                out_str = input("Translation: ").strip()
                if out_str:
                    out_dict[key] = out_str
                else:
                    print("> Empty string, will not be included.")
                print()
            else:
                out_dict[key] = to_dict[key]
        elif isinstance(value, dict):
            out_dict[key] = ensure_keys(
                value, to_dict.get(key, {}), parent_keys + [key]
            )

    return out_dict


def list_composite_keys(dct: dict, prefix: str = "") -> list[str]:
    keys = []

    for key, value in dct.items():
        if isinstance(value, str):
            keys.append(f"{prefix}{key}")
        elif isinstance(value, dict):
            keys.extend(list_composite_keys(value, f"{prefix}{key}."))

    return keys


def load(file: Path) -> dict[str, str | dict]:
    with open(file, encoding="utf8") as f:
        return json.load(f)


def format_cmd(locale: str, **kwargs):
    file = LOCALE_DIR / f"{locale}.json"
    dct = load(file)

    with open(file, encoding="utf8", mode="w") as f:
        f.write(dump(dct))

    print(f"Sorted {file}.")


def orphans_cmd(locale: str, **kwargs):
    not_found = []

    for key in list_composite_keys(load(LOCALE_DIR / f"{locale}.json")):
        encoded_key = key.replace(".", "\\.")
        cmd = f"grep --include='*.ts' --include='*.vue' -Irn \"t(['\\\"]{encoded_key}['\\\"]\" {APP_DIR}/"
        out = subprocess.run(cmd, capture_output=True, shell=True, check=False)

        if out.returncode == 1:
            not_found.append(key)

    if not_found:
        print("Found orphans:", end="\n\n")
        print("\n".join(not_found), end="\n\n")
        print(
            "*** NOTE! Don't trust this blindly! It will miss translation keys that were dynamically produced. ***"
        )
    else:
        print("No orphans found.")


def trans_cmd(from_locale: str, to_locale: str, stdout: bool, **kwargs):
    to_file = LOCALE_DIR / f"{to_locale}.json"
    to_dict = load(to_file)

    to_dict = ensure_keys(load(LOCALE_DIR / f"{from_locale}.json"), to_dict)
    to_string = dump(to_dict)

    if stdout:
        print(to_string)
    else:
        with open(to_file, encoding="utf8", mode="w") as f:
            f.write(to_string)
        format_cmd(from_locale)
        print(f"Wrote to {to_file}.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    subs = parser.add_subparsers(dest="parser", title="Subcommands")

    format_parser = subs.add_parser(
        name="format", description="Just sort and format a translation file."
    )
    format_parser.add_argument("locale")

    orphans_parser = subs.add_parser(
        name="orphans", description="Try to find unused translation strings."
    )
    orphans_parser.add_argument("--locale", "-l", default="sv")

    trans_parser = subs.add_parser(
        name="trans",
        description=(
            "Checks for strings from the source language file that are missing in the destination language file, asks "
            "for translations of them, and overwrites the destination file (or writes to stdout). If an empty string "
            "is given, the translation will not be included in the destination file."
        ),
    )
    trans_parser.add_argument(
        "--from", type=str, default="sv", dest="from_locale", help="Default: `sv`"
    )
    trans_parser.add_argument(
        "--to", type=str, default="en", dest="to_locale", help="Default: `en`"
    )
    trans_parser.add_argument(
        "--stdout",
        action="store_true",
        help="Output to stdout instead of overwriting file.",
    )

    arguments = parser.parse_args()

    if arguments.parser == "trans":
        trans_cmd(**arguments.__dict__)
    elif arguments.parser == "format":
        format_cmd(**arguments.__dict__)
    elif arguments.parser == "orphans":
        orphans_cmd(**arguments.__dict__)
    else:
        parser.print_help()
