#!/usr/bin/env python3
import argparse
import subprocess
import sys
from pathlib import Path
from typing import Any


try:
    import yaml
except ImportError:
    print("Error! You need to do `pip install pyyaml` or `poetry add pyyaml`.")
    sys.exit(1)


MAX_LENGTH = 120
cwd = Path(__file__).parent


def dump(d: dict, indent: int = 0) -> list[str]:
    rows: list[str] = []
    string_items: dict[str, str] = {
        k: v for k, v in sorted(d.items()) if isinstance(v, str)
    }
    dict_items: dict[str, dict] = {
        k: v for k, v in sorted(d.items()) if isinstance(v, dict)
    }

    for key, string in string_items.items():
        string = string.replace('"', '\\"')
        row = (" " * indent) + f'{key}: "{string}"'
        rows.extend(split_row(row, overflow_indent=indent + 2))

    for key, dct in dict_items.items():
        rows.append((" " * indent) + f"{key}:")
        rows.extend(dump(d=dct, indent=indent + 2))

    return rows


def ensure_keys(
    from_dict: dict, to_dict: Any, parent_keys: list[str] | None = None
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
        return yaml.load(stream=f, Loader=yaml.BaseLoader)


def split_row(row: str, overflow_indent: int = 2, accumulated: list[str] | None = None):
    accumulated = accumulated or []
    assert overflow_indent < MAX_LENGTH

    if len(row) > MAX_LENGTH:
        cutoff_pos = MAX_LENGTH
        while row[cutoff_pos - 1] != " " and cutoff_pos > overflow_indent:
            cutoff_pos -= 1
        if cutoff_pos == overflow_indent:
            cutoff_pos = MAX_LENGTH
        accumulated.append(row[:cutoff_pos])

        return split_row(
            row=(" " * overflow_indent) + row[cutoff_pos:],
            overflow_indent=overflow_indent,
            accumulated=accumulated,
        )

    accumulated.append(row)
    return accumulated


def format_cmd(locale: str, **kwargs):
    file = cwd / f"translations/{locale}.yaml"
    dct = load(file)
    rows = [f"{row}\n" for row in dump(dct)]

    with open(file, encoding="utf8", mode="w") as f:
        f.writelines(rows)

    print(f"Sorted {file}.")


def orphans_cmd(locale: str, **kwargs):
    dct = load(cwd / f"translations/{locale}.yaml")
    keys = list_composite_keys(dct)
    app_dir = cwd / "app"
    not_found = []

    for key in keys:
        encoded_key = key.replace(".", "\\.")
        cmd = f"grep --include='*.ts' --include='*.hbs' -Irn \"['\\\"]{encoded_key}['\\\"]\" {app_dir}/"
        out = subprocess.run(cmd, capture_output=True, shell=True, check=False)
        if out.returncode == 1:
            not_found.append(key)

    print("Found orphans:")
    print()
    print("\n".join(not_found))
    print()
    print(
        "*** NOTE! Don't trust this blindly! It will miss translation keys that were dynamically produced. ***"
    )


def trans_cmd(from_locale: str, to_locale: str, stdout: bool, **kwargs):
    from_file = cwd / f"translations/{from_locale}.yaml"
    to_file = cwd / f"translations/{to_locale}.yaml"
    from_dict = load(from_file)
    to_dict = load(to_file)

    to_dict = ensure_keys(from_dict, to_dict)
    to_rows = [f"{row}\n" for row in dump(d=to_dict)]

    if stdout:
        print("".join(to_rows))
    else:
        with open(to_file, encoding="utf8", mode="w") as f:
            f.writelines(to_rows)
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
