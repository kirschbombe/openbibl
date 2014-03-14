<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    xmlns:tei="http://www.tei-c.org/ns/1.0"
    xmlns:obp="http://openbibl.github.io"
    xmlns:saxon="http://saxon.sf.net/"
    version="2.0">

    <!-- TODO: this stylesheet is glacial (quadratic), and
         can almost certainly be optimized by not having the
         tei:div[@type='entry'] elements tokenized for each
         term in the document
         Currenlty uses the saxon:memo-function option on
         xsl:function[@name="obp:tokenize-entry"], but it
         is not clear how that will work with large documents
         Also uses @saxon:threads="3", which isn't tested in
         the browser yet.
    -->

    <xsl:output method="text"/>

    <xsl:variable name="quot" select="'&quot;'"/>

    <!-- [ { term: "foo", entries: [1,2] } ] -->
    <xsl:variable name="kTerm" select="'term'"/>
    <xsl:variable name="kEntries" select="'entries'"/>

    <xsl:variable name="entries" as="element()*">
        <xsl:sequence select="//tei:div[@type='entry']"/>
    </xsl:variable>

    <xsl:variable name="normalized-tokens" as="xs:string*">
        <xsl:sequence select="
            for $entry in $entries
            return obp:tokenize-entry($entry)
        "/>
    </xsl:variable>

    <!-- Return a sequence of UPPERCASE words/terms/tokens from an element's
         text() node descendents, where the boundary between tokens is defined
         by the pattern [\s\W]+
         The returned sequence contains no whitespace-only strings
    -->
    <xsl:function name="obp:tokenize-entry" as="xs:string*" saxon:memo-function="yes">
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

    <xsl:template match="/">
        <!-- $term-obj is like:
             { term: "foo", entries: [1,2] }
        -->
        <xsl:variable name="term-obj" as="xs:string*">
            <xsl:for-each select="$normalized-tokens" saxon:threads="5">
                <xsl:sort/>
                <xsl:variable name="ntok" select="."/>
                <xsl:variable name="matched-entries" as="xs:integer*">
                    <xsl:sequence select="distinct-values(
                        for $entry in $entries,
                            $etok  in obp:tokenize-entry($entry)
                         return
                             if ($ntok = $etok)
                             then count($entry/preceding-sibling::tei:div[@type='entry']) + 1
                             else ()
                    )"/>
                </xsl:variable>
                <xsl:value-of select="obp:json-obj(
                    $kTerm,   $ntok,
                    $kEntries,$matched-entries
                )"/>
            </xsl:for-each>
        </xsl:variable>
        <xsl:value-of select="obp:json-list($term-obj)"/>
    </xsl:template>

    <!-- return true() if item()s in $seq can all be castable
         to a numeric data type
    -->
    <xsl:function name="obp:seq-is-numeric" as="xs:boolean">
        <xsl:param name="seq" as="item()*"/>
        <xsl:sequence select="
            every $i in $seq satisfies
                ($i castable as xs:integer or
                 $i castable as xs:double or
                 $i castable as xs:float)
        "/>
    </xsl:function>

    <!-- return a string with list-formatted sequence of items, e.g.:
         [1,2,3], or ["foo", "bar", "quux"]
         Assumes the list is homogenous type-wise
    -->
    <xsl:function name="obp:json-list" as="xs:string">
        <xsl:param name="values"/>
        <xsl:variable name="comma-separated">
            <xsl:choose>
                <!-- numeric values: don't quote -->
                <xsl:when test="obp:seq-is-numeric($values)">
                    <xsl:value-of select="string-join( for $i in $values return string($i), ',')"/>
                </xsl:when>
                <!-- object/array values: don't quote -->
                <xsl:when test="every $v in $values satisfies matches($v, '^\{.*?\}$')">
                    <xsl:value-of select="string-join($values,',')"/>
                </xsl:when>
                <!-- string values: quote -->
                <xsl:otherwise>
                    <xsl:value-of select="string-join(
                        for $s in $values return obp:json-quote($s),
                        ','
                    )"/>
                </xsl:otherwise>
            </xsl:choose>
        </xsl:variable>
        <xsl:value-of select="concat('[', $comma-separated, ']')"/>
    </xsl:function>

    <!-- returns a string for the json object used for the
        current search serialization format, e.g.,
        obp:json-obj("term","foo","entries", (1,2)) yields:
        [ { "term": "foo", "entries": [1,2] } ]
    -->
    <xsl:function name="obp:json-obj" as="xs:string">
        <xsl:param name="key-key" as="xs:string"/>
        <xsl:param name="key-val" as="xs:string"/>
        <xsl:param name="val-key" as="xs:string"/>
        <xsl:param name="val-val" as="item()*"/>

        <xsl:value-of select="concat(
            '{',
            obp:json-quote($key-key),
            ':',
            obp:json-quote($key-val),
            ',',
            obp:json-quote($val-key),
            ':',
            obp:json-list($val-val),
            '}'
        )"/>
    </xsl:function>

    <!-- wrap a string in double-quotes -->
    <xsl:function name="obp:json-quote" as="xs:string">
        <xsl:param name="str"/>
        <xsl:value-of select="concat($quot, $str, $quot)"/>
    </xsl:function>

</xsl:stylesheet>
