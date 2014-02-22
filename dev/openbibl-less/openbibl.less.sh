#!/usr/bin/env bash
#

LESS_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
LESS_DIST_DIR="$LESS_DIR/dist"
LESS_DIST_CSS="$LESS_DIST_DIR/openbibl.css"
LESS_MASTER="$LESS_DIR/openbibl.less"
LESS_THEME_TEMPLATE="$LESS_DIR/openbibl-theme-template.less"
LESS_THEME_DIR="$LESS_DIR/themes"
LESS_THEME_DIST_DIR="$LESS_DIST_DIR/themes"

INC="$LESS_DIR:$LESS_DIR/../bootstrap-3.1.1/less"

COMPRESS=""
VERBOSE=""
while getopts ":cv:" opt; do
case $opt in
    c)
        COMPRESS="--compress"
        ;;
    v)
        VERBOSE="--verbose"
        ;;
esac
done

# compile main style file
lessc -O2 --include-path="$INC" "$LESS_MASTER" "$LESS_DIST_CSS" "$VERBOSE" "$COMPRESS"
if [ -e  "$LESS_DIR/../../css/openbibl.css" ]; then
    rm "$LESS_DIR/../../css/openbibl.css"
fi
mv "$LESS_DIST_CSS" "$LESS_DIR/../../css/"

# compile theme files
for f in `find "$LESS_THEME_DIR" -name "*.less"`; do
    LESS=`basename $f`
    BASE=`basename -s ".less" $f`
    lessc "$VERBOSE" "$COMPRESS" -O2 --global-var="themeFile=$LESS" "$LESS_THEME_TEMPLATE" "$LESS_THEME_DIST_DIR/${BASE}.css"
    if [ -e "../../css/theme/${BASE}.css" ]; then
        rm "../../css/theme/${BASE}.css"
    fi
    mv "$LESS_THEME_DIST_DIR/${BASE}.css" "$LESS_DIR/../../css/theme/"
done

