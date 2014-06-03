#!/usr/bin/env bash
#

OEUR="../../examples/otherEurope/otherEurope.xml"
TEMPL="../../TEI/DescTemplate.xml"

java net.sf.saxon.Transform -s:"$OEUR"  -xsl:../../xsl/openbibl.boot.xsl  -o:otherEurope.boot.html
java net.sf.saxon.Transform -s:"$OEUR"  -xsl:../../xsl/openbibl.xsl       -o:otherEurope.bibl.html
java net.sf.saxon.Transform -s:"$OEUR"  -xsl:../../xsl/openbibl.query.xsl -o:otherEurope.query.json
java net.sf.saxon.Transform -s:"$TEMPL" -xsl:../../xsl/openbibl.lod.xsl   -o:DescTemplate.lod.xml
