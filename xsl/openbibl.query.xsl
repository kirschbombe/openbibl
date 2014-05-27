<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    xmlns:tei="http://www.tei-c.org/ns/1.0"
    xmlns:obp="http://openbibl.github.io"
    xmlns:saxon="http://saxon.sf.net/"
    exclude-result-prefixes="#all"
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

    <!-- loop over the search-term list and term/index table, and generate
         a json pairwise list of search-term and index values, e.g.:
         [["also"],[1,5,8],["Although,"although"],[2,6], ... ]
    -->
    <xsl:template name="make-search-table">
        <!-- stqrt of wrapping json array -->
        <xsl:text>[</xsl:text>

        <!-- make a sequence of token elements to assemble into json below -->
        <xsl:variable name="tokens" as="element(token)*">
            <xsl:for-each select="//tei:div[@type='entry']">
                <xsl:variable name="entry" select="."/>
                <xsl:variable name="pos" select="count($entry/preceding-sibling::tei:div[@type='entry'])"/>
                <xsl:for-each select="distinct-values(
                    for $text in $entry//text(),
                        $tok in tokenize($text, '[\s\W]+')[matches(.,'\S+')]
                    return $tok
                )">
                    <token norm="{upper-case(.)}" val="{.}" pos="{$pos}"/>
                </xsl:for-each>
            </xsl:for-each>
        </xsl:variable>

        <!-- group tokens by normalized (upper-case) value -->
        <xsl:for-each-group select="$tokens" group-by="@norm">
            <xsl:text>[</xsl:text>
            <!-- search terms -->
            <xsl:value-of select="string-join(
                for $str in distinct-values(current-group()/@val)
                    return obp:json-quote($str),
                ',')
            "/>
            <xsl:text>]</xsl:text>
            <xsl:text>,[</xsl:text>
            <!-- entry indices -->
            <xsl:value-of select="string-join(distinct-values(current-group()/@pos),',')"/>
            <xsl:text>]</xsl:text>
            <xsl:if test="position() != last()">
                <xsl:text>,</xsl:text>
            </xsl:if>
        </xsl:for-each-group>

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
