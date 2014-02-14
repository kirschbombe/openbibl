<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    xmlns:tei="http://www.tei-c.org/ns/1.0"
    xmlns:obp="http://openbibl.github.io"
    version="2.0">
    
    <xsl:output method="text"/>
    
    <xsl:variable name="quot" select="'&quot;'"/>
    <xsl:template match="/">
        <xsl:text>{ </xsl:text>
        <xsl:text></xsl:text>
        <xsl:for-each select="for $tok in distinct-values(tokenize(normalize-space(string-join(//text(),' ')),'[\s\W]')),
                                  $word in $tok[matches(.,'\S+')] (: filter out whitespace-only :)
                                  return obp:json-entry($word,/)">
                <xsl:sort/>
                <xsl:value-of select="."/>
            <xsl:if test="position() != last()">
                <xsl:text>,</xsl:text>
            </xsl:if>
        </xsl:for-each>
        <xsl:text>}</xsl:text>
    </xsl:template>

<!-- need to make sure we are producing valid json -->
    <xsl:function name="obp:json-entry" as="xs:string">
        <xsl:param name="word" as="xs:string"/>
        <xsl:param name="root" as="document-node()"/>
        <xsl:variable name="ids" as="xs:integer*"
                select="for $bib in $root//tei:div[@type='entry'][contains(.,$word)]
                            return count($bib/preceding-sibling::tei:div[@type='entry']) + 1
                        "/>
        <!-- "word":[0,1,2,3]  -->
        <xsl:value-of select="concat($quot, $word, $quot, ':[', 
                                     string-join(for $i in $ids return string($i), ',')
                                     ,']'
                                    )"/>
    </xsl:function>
    
</xsl:stylesheet>