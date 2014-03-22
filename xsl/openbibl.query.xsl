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

    <!-- construct json to use for search and browse interface -->
    <xsl:template match="/">
        <xsl:text>{ "search" : </xsl:text>
        <xsl:call-template name="make-search-table"/>
        <xsl:text>, "browse" : </xsl:text>
        <xsl:call-template name="make-browse-table"/>
        <xsl:text>}</xsl:text>
    </xsl:template>

    <!-- poor man's tuple: sequence of search terms
        (tokens) zipped/interleaved with index of
        tei:div[type="entry"] in which the term
        occurred, e.g.:
        ("Foo", 1, "bar", 1, "QUUX", 1, "foo", 2, "QUUX", 2, "Bar" 3)
        * Note that this presumes case-insensitive
        indexing of term to tei:div[@entry].
    -->
    <xsl:variable name="token-table" as="item()*">
        <xsl:sequence select="
            for $entry in //tei:div[@type='entry'],
                $tok in obp:tokenize-entry($entry)
            return ($tok, count($entry/preceding-sibling::tei:div[@type='entry']))
        "/>
    </xsl:variable>

    <!-- deduped list of unmodified search terms/tokens across
        all tei:div[@type='entry'] elements
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

    <!-- list of deduped, normalized (upper-cased) search terms -->
    <xsl:variable name="normalized-tokens" as="xs:string*">
        <xsl:sequence select="distinct-values(
            for $tok in $tokens return upper-case($tok)
        )"/>
    </xsl:variable>

    <!-- Return a sequence of mixed case words/terms/tokens from an element's
         text() node descendents, where the boundary between tokens is defined
         by the pattern [\s\W]+
         The returned sequence contains no whitespace-only strings
    -->
    <xsl:function name="obp:tokenize-entry" as="xs:string*">
        <xsl:param name="entry" as="element()"/>
        <xsl:sequence select="distinct-values(
            tokenize(
                normalize-space(
                    string-join($entry//text(), ' ')
                ),
                '[\s\W]+'
            )[matches(.,'\S+')]
        )"/>
    </xsl:function>

    <!-- loop over the search-term list and term/index table, and generate
         a json pairwise list of search-term and index values, e.g.:
         [["also"],[1,5,8],["Although,"although"],[2,6], ... ]
    -->
    <xsl:template name="make-search-table">
        <!-- stqrt of wrapping json array -->
        <xsl:text>[</xsl:text>

        <!-- loop over normalized search terms -->
        <xsl:for-each select="$normalized-tokens">
            <xsl:sort/>
            <xsl:variable name="ntok" as="xs:string" select="." />
            
            <!-- construct a sequnce of match terms mixed with indices; this
                 is messy, but sequences cannot be constructed in parallel 
                 without additional looping over search terms; terms and indices 
                 are distinguished below by pattern (all digits or not)
            -->
            <xsl:variable name="matches" as="xs:string*">
                <xsl:sequence select="distinct-values(
                    for $i in 1 to count($token-table)
                    return (
                        if ($i mod 2 = 1)
                        then
                            if (upper-case($token-table[$i]) = $ntok)
                            then (obp:json-quote($token-table[$i]),
                                  string($token-table[$i + 1]))
                            else ()
                        else ()
                    )
                )"/>
            </xsl:variable>
            <!-- group the items in $matches by whether or not they're numeric,
                 which here means matching the pattern \d+
            -->
            <xsl:for-each-group select="$matches" group-by="matches(.,'^\d+$')">
                <xsl:text>[</xsl:text>
                <xsl:value-of select="string-join(current-group(),',')"/>
                <xsl:text>]</xsl:text>
                <xsl:if test="position() != last()">
                    <xsl:text>,</xsl:text>
                </xsl:if>
            </xsl:for-each-group>

            <xsl:if test="position() != last()">
                <xsl:text>,</xsl:text>
            </xsl:if>
        </xsl:for-each>

        <!-- end of wrapping json array -->
        <xsl:text>]</xsl:text>
    </xsl:template>

    <!-- TODO: avoid xsl:text -->
    <xsl:template name="make-browse-table">
        <xsl:text>{</xsl:text>
        
        <xsl:for-each select="//tei:back/tei:div[@type='editorial']/*">
            <!-- "listPeople" : { -->
            <xsl:value-of select="obp:json-quote(name(.))"/>
            <xsl:text>: {</xsl:text>
            
            <!-- NOTE: this uses the first @xml:id found -->
            <xsl:for-each select="tei:head/following-sibling::*">
                <xsl:variable name="id" select=".//@xml:id"/>
                <xsl:variable name="ref" select="concat('#',$id)"/>
                <xsl:value-of select="obp:json-quote($id)"></xsl:value-of>
                <xsl:text>: [</xsl:text>
                
                <!-- -->
                <xsl:variable name="ids" as="xs:string*">
                    <xsl:sequence select="distinct-values(
                        for $div in //tei:div[@type='entry'][./descendant::*[@ref=$ref]]
                        return string(count($div/preceding-sibling::tei:div[@type='entry']))
                    )"/>
                </xsl:variable>
                <xsl:value-of select="string-join($ids,',')"/>
                <xsl:text>]</xsl:text>
                <xsl:if test="position()!=last()">
                    <xsl:text>, </xsl:text>
                </xsl:if>
            </xsl:for-each>
            <xsl:text>}</xsl:text>
            <xsl:if test="position()!=last()">
                <xsl:text>,</xsl:text>
            </xsl:if>
        </xsl:for-each>
        <xsl:text>}</xsl:text>
    </xsl:template>


    <!-- wrap a string in double-quotes -->
    <xsl:function name="obp:json-quote" as="xs:string">
        <xsl:param name="str" as="xs:string"/>
        <xsl:value-of select="concat($quot, $str, $quot)"/>
    </xsl:function>

</xsl:stylesheet>
