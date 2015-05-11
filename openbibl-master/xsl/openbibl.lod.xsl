<?xml version="1.0" encoding="UTF-8"?>
<!--
    * Openbibl Framework v0.1.0
    * Copyright 2014, Dawn Childress
    * Contact: https://github.com/kirschbombe/openbibl
    * License: GNU AGPL v3 (https://github.com/kirschbombe/openbibl/LICENSE)
-->
<xsl:stylesheet
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    xmlns:obp="http://openbibl.github.io"
    xmlns:schema="http://schema.org"
    xmlns:saxon="http://saxon.sf.net/"
    xmlns:tei="http://www.tei-c.org/ns/1.0"
    exclude-result-prefixes="xs saxon"
    version="2.0">

    <xsl:output standalone="yes"/>

    <xsl:param name="schema-file" select=" '../lod/schema.org.xml' " as="xs:string"/>

    <!--
        For this stylesheet function obp:schema-match-data():

        Provided an xpath from the lod/schema mapping file and the element nodes in
        the current TEI document that are matched by that xpath, return an element
        with all of the matching ids and all of the open-data mapping data.

        For example, for the two mappings for CreativeWork (from the data file $schema-file):

            <schema-mapping>
                <xpath>//tei:teiHeader</xpath>
                <itemdata>
                    <schema:itemtype>CreativeWork</schema:itemtype>
                </itemdata>
            </schema-mapping>

            <schema-mapping>
                <xpath>//tei:text/tei:body/tei:div[@type='entry']</xpath>
                <itemdata>
                    <schema:itemtype>http://schema.org/CreativeWork</schema:itemtype>
                </itemdata>
            </schema-mapping>

        and the two hypothetical matched nodes (from the TEI file)

            <TEI xmlns="http://www.tei-c.org/ns/1.0">
                <teiHeader>
            ...
                <text>
                    <body>
                    <div type="entry">
                    ...

        return a single <match> element containing the values produced by the
        generate-id() xslt function:

            <match>
                <id>asdf123<id>
                <id>sdfg234</id>
                <schema:itemtype>CreativeWork</schema:itemtype>
            </match>

        The result is used in the lookup table $mapping-matches, then for lookups
        and possible application of linked open data attributes in the template
        'apply-schmea-mappings' below.
    -->
    <xsl:function name="obp:schema-match-data" as="element(match)">
        <xsl:param name="schema-data" as="element()*"/>
        <xsl:param name="xpath"       as="xs:string"/>
        <xsl:param name="matches"     as="element()*"/>
        <match>
            <xsl:for-each select="$matches">
                <id><xsl:value-of select="generate-id(.)"/></id>
            </xsl:for-each>
            <xsl:copy-of select="$schema-data/schema-mapping[xpath=$xpath]/itemdata/*"/>
        </match>
    </xsl:function>

    <!--
        Cache the element node id's (from generate-id) that correspond to the xpaths
        provided in the lod/schema mapping file, along with the schema.org mapping
        data.
    -->
    <xsl:variable name="mapping-matches" as="element()">
        <xsl:variable name="schema-data" select="document($schema-file)/schema-mappings" as="element()*"/>
        <xsl:variable name="xpaths" select="$schema-data/schema-mapping/xpath" as="xs:string*"/>
        <matches>
            <xsl:sequence select="
                for $xpath in $xpaths
                return obp:schema-match-data($schema-data, $xpath, saxon:evaluate($xpath))
            "/>
        </matches>
    </xsl:variable>

    <!--
        Override default template for element nodes by doing
            - a shallow copy of the original node
            - an application of any matched linked open data attributes
              by calling apply-schema-mappings() below
            - template handling for the element's content
    -->
    <xsl:template match="*">
        <xsl:copy>
            <!-- output attribute nodes as needed on this element node -->
            <xsl:call-template name="apply-schmea-mappings">
                <xsl:with-param name="current-id" select="generate-id(.)" as="xs:string"/>
            </xsl:call-template>
            <xsl:copy-of select="@*"/>
            <xsl:apply-templates/>
        </xsl:copy>
    </xsl:template>

    <!--
        Include comment/pi nodes.
    -->
    <xsl:template match="processing-instruction()|comment()">
        <xsl:copy-of select="."/>
    </xsl:template>

    <!--
        Provided a generate-id() value generated from an element node,
        determine which linked open data values to apply to the element
        (using the values generated in $mapping-matches above)
        and generate an attribute node that will be attached to the element.
    -->
    <xsl:template name="apply-schmea-mappings">
        <xsl:param name="current-id" as="xs:string"/>
        <xsl:for-each-group select="$mapping-matches/match[id=$current-id]/*[local-name() != 'id']" group-by="name()">
            <!-- the distinct-values() should be replaced with a fix to the for-each-group grouping -->
            <xsl:variable name="att-vals" select="string-join(distinct-values(current-group()), ' ')"/>
            <xsl:variable name="att-name" select="current-grouping-key()"/>
            <xsl:attribute name="{$att-name}">
                <xsl:value-of select="$att-vals"/>
            </xsl:attribute>
            <xsl:if test="$att-name = 'schema:itemtype'">
                <xsl:attribute name="itemscope">itemscope</xsl:attribute>
            </xsl:if>
        </xsl:for-each-group>
    </xsl:template>

</xsl:stylesheet>
