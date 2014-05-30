#!/usr/bin/env bash

DOCS_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
jsdoc -r -c $DOCS_DIR/conf.json
