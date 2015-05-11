#!/usr/bin/env bash

DOCS_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "Removing old documentation"
for f in `ls "$DOCS_DIR" | grep -v docs.sh | grep -v conf.json`; do rm -rf "$f"; done;

echo "Generating new documentation"
jsdoc -r -c $DOCS_DIR/conf.json

echo "Documentation done"
