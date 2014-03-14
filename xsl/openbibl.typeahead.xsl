<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    xmlns:tei="http://www.tei-c.org/ns/1.0"
    xmlns:obp="http://openbibl.github.io"
    xmlns:saxon="http://saxon.sf.net/"
    version="2.0">

    <xsl:output
        method="text"
        encoding="UTF-8"/>

    <!-- double-quote char for json strings -->
    <xsl:variable name="quot" select="'&quot;'"/>

    <!-- poor man's tuple: sequence of search terms
        (tokens) zipped/interleaved with index of
        tei:div[type="entry"] in which the term
        occurred, e.g.:
        ("foo", 1, "bar", 1, "quux", 1, "foo", 2, "quux", 2, "bar" 3)
    -->
    <xsl:variable name="token-table" as="item()*">
        <xsl:sequence select="
            for $entry in //tei:div[@type='entry'],
                $tok in obp:tokenize-entry($entry)
            return ($tok, count($entry/preceding-sibling::tei:div[@type='entry']) + 1)
        "/>
    </xsl:variable>

    <!-- deduped list of search terms/tokens across all
         tei:div[@type='entry'] elements
    -->
    <xsl:variable name="tokens" as="xs:string*">
        <xsl:sequence select="distinct-values(
            for $i in 1 to count($token-table)
            return (
                if ($i mod 2 = 1)
                then $token-table[$i]
                else ()
            )
        )"/>
    </xsl:variable>

    <!-- Return a sequence of UPPERCASE words/terms/tokens from an element's
         text() node descendents, where the boundary between tokens is defined
         by the pattern [\s\W]+
         The returned sequence contains no whitespace-only strings
    -->
    <xsl:function name="obp:tokenize-entry" as="xs:string*">
        <xsl:param name="entry" as="element()"/>
        <xsl:sequence select="
            for $tok in
                distinct-values(
                    tokenize(
                        normalize-space(
                            string-join($entry//text(), ' ')
                        ),
                        '[\s\W]+'
                    )[matches(.,'\S+')]
                ) return upper-case($tok)
            "/>
    </xsl:function>

    <!-- loop over the search-term list and term/index table, and generate
         a json pairwise list of search-term and index values, e.g.:
         ["ALSO",[1,5,8],"ALTHOUGH",[2,6],"AMENDED",[4],"AMONG",[8], ... ]
    -->
    <xsl:template match="/">
        <xsl:variable name="term-data" as="xs:string*">
            <xsl:for-each select="$tokens">
                <xsl:sort/>
                <xsl:variable name="tok"     as="xs:string" select="." />
                <xsl:variable name="indices" as="xs:integer*">
                    <xsl:sequence select="distinct-values(
                        for $i in 1 to count($token-table)
                        return (
                            if ($i mod 2 = 1)
                            then
                                if ($token-table[$i] = $tok)
                                then $token-table[$i + 1]
                                else ()
                            else ()
                        )
                    )"/>
                </xsl:variable>
                <!-- a single search term entry, e.g.,
                    "ALSO",[1,5,8]
                -->
                <xsl:value-of select="concat(
                    obp:json-quote($tok),
                    ',',
                    '[',
                        string-join(for $i in $indices return string($i), ','),
                    ']'
                )"/>
            </xsl:for-each>
        </xsl:variable>
        <xsl:value-of select="concat(
            '[',
            string-join($term-data,','),
            ']'
        )"/>
    </xsl:template>

    <!-- wrap a string in double-quotes -->
    <xsl:function name="obp:json-quote" as="xs:string">
        <xsl:param name="str" as="xs:string"/>
        <xsl:value-of select="concat($quot, $str, $quot)"/>
    </xsl:function>

</xsl:stylesheet>
