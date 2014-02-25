#!/usr/bin/env bash
#

LESS_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
LESS_DIST_DIR="$LESS_DIR/dist"
LESS_DIST_CSS="$LESS_DIST_DIR/openbibl.css"
LESS_MASTER="$LESS_DIR/openbibl.less"
LESS_THEME_DIR="$LESS_DIR/themes"
LESS_THEME_DIST_DIR="$LESS_DIST_DIR/themes"
OBP_CSS_THEME_DIR="$LESS_DIR/../../css/theme"

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

# compile theme files
for f in `find "$LESS_THEME_DIR" -name "*.less"`; do
    LESS=`basename $f`
    CSS=`basename -s ".less" $f`.css
    lessc -O2 --include-path="$INC" --global-var="themeFile=$LESS" "$LESS_MASTER" "$LESS_THEME_DIST_DIR/$CSS" "$COMPRESS" "$VERBOSE"
    if [ -e "$OBP_CSS_THEME_DIR/$CSS" ]; then
        rm "$OBP_CSS_THEME_DIR/$CSS"
    fi
    mv "$LESS_THEME_DIST_DIR/$CSS" "$OBP_CSS_THEME_DIR"
done
