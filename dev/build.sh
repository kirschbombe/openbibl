#!/usr/bin/env bash
#

DEV_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
LESS_DIR="$DEV_DIR/openbibl-less"
JS_DIR="$DEV_DIR/../js"

# compile less
echo Compiling LESS files
"$LESS_DIR/openbibl.less.sh" -c -v

# minify javascript
echo MINIFYING JS FILES
JS_MIN="$JS_DIR/openbibl.min.js"
JS_ROOT="$JS_DIR/openbibl.js"

if [ -e "JS_MIN" ]; then
    rm "$JS_MIN"
fi
cat $JS_ROOT | uglifyjs - >> "$JS_MIN"

for f in `find "$JS_DIR" -maxdepth 1 -name "*.js" | grep -v "$JS_ROOT"`; do
    cat $f | uglifyjs - >> "$JS_MIN"
done

