#!/usr/bin/env bash
#

DEV_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
LESS_DIR="$DEV_DIR/openbibl-less"
JS_DIR="$DEV_DIR/../js"
DOCS_DIR="$DEV_DIR/../docs"

# compile LESS/CSS files
echo Compiling LESS files
"$LESS_DIR/openbibl.less.sh" -c -v
if ["$?" ne "0"]; then
    echo "Error compiling LESS files. Exiting."
    exit 1
fi

# lint js files
for f in $(find "$JS_DIR" -name *.js -d 1 && find "$JS_DIR/openbibl" -name *.js ); do
    jslint $f
done

# update JS documentation
$DOCS_DIR/docs.sh

# minify javascript
#echo MINIFYING JS FILES
