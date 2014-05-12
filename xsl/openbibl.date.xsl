<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
    xmlns:tei="http://www.tei-c.org/ns/1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    exclude-result-prefixes="xs"
    version="1.0">

    <!-- handle common date -->
    <xsl:template name="date-sort-key">
        <xsl:param name="date-elt"/>

        <xsl:choose>

            <!-- use @when-iso, padding as necessary -->
            <xsl:when test="$date-elt/@when-iso">
                <xsl:call-template name="str-to-yyyymmdd">
                    <xsl:with-param name="str" select="$date-elt/@when-iso"/>
                </xsl:call-template>
            </xsl:when>

            <!--  use @notBefore, padding as necessary -->
            <xsl:when test="$date-elt/@notBefore">
                <xsl:call-template name="str-to-yyyymmdd">
                    <xsl:with-param name="str" select="$date-elt/@notBefore"/>
                </xsl:call-template>
            </xsl:when>

        </xsl:choose>

    </xsl:template>

    <!-- pad a date out to yyyy-mm-dd with 01s as necessary -->
    <xsl:template name="str-to-yyyymmdd">
        <xsl:param name="str"/>
        <xsl:choose>
            <xsl:when test="matches($str,'\d{4}-\d{2}-\d{2}')">
                <xsl:value-of select="$str"/>
            </xsl:when>
            <xsl:when test="matches($str,'\d{4}-\d{2}')">
                <xsl:value-of select="concat($str,'-01')"/>
            </xsl:when>
            <xsl:when test="matches($str,'\d{4}')">
                <xsl:value-of select="concat($str,'-01-01')"/>
            </xsl:when>
        </xsl:choose>
    </xsl:template>

</xsl:stylesheet>