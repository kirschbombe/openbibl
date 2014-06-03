#!/usr/bin/env bash
#
java net.sf.saxon.Transform -s:otherEurope.xml -xsl:../../xsl/openbibl.boot.xsl  -o:otherEurope.boot.html
java net.sf.saxon.Transform -s:otherEurope.xml -xsl:../../xsl/openbibl.xsl       -o:otherEurope.bibl.html
java net.sf.saxon.Transform -s:otherEurope.xml -xsl:../../xsl/openbibl.query.xsl -o:otherEurope.query.json
git diff .
