<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
    xmlns:tei="http://www.tei-c.org/ns/1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema" 
    exclude-result-prefixes="xs" version="2.0">

    <xsl:template match="/">
        <div id="result">
            <xsl:apply-templates/>            
        </div>
    </xsl:template>
    
    <xsl:template match="//tei:titleStmt/tei:title">
        <h1 class="bibliographies">
            <xsl:value-of select="."/>
        </h1>
        <hr id="asterism-rule" />
        <!-- pull asterism from config file? -->
        <div id="asterism">&#x2766;</div>
    </xsl:template>
    
    <xsl:template match="//tei:titleStmt/tei:author"/>
    
    <xsl:template match="//tei:fileDesc/tei:publicationStmt/descendant-or-self::*"/>
    <xsl:template match="//tei:fileDesc/tei:publicationStmt" mode="footer"/>
    
<!--
    <xsl:template match="" mode="footer">
        
    </xsl:template>
-->
    
    <xsl:template match="//tei:fileDesc/tei:publicationStmt">
        <footer>
            <xsl:apply-templates/>
        </footer>
    </xsl:template>
    
    <xsl:template match="//tei:text/tei:body/tei:div[@type='entry']">
        
        <!-- expand -->
        <h2 class="bibliography expand">
            <xsl:value-of select="tei:head"/>
        </h2>
        
        <div class="bibliography expand" xml:space="collapse">
            <xsl:value-of select="tei:biblStruct/tei:monogr/tei:author"/>.
            <xsl:value-of select="tei:biblStruct/tei:monogr/tei:title"/>.&#x0020;
            <i>
                <xsl:value-of select="tei:biblStruct/tei:monogr/tei:imprint/tei:pubPlace"/>,&#x0020; 
                <xsl:value-of select="tei:biblStruct/tei:monogr/tei:imprint/tei:publisher"/>,&#x0020;
                <xsl:value-of select="tei:biblStruct/tei:monogr/tei:imprint/tei:date"/>
            </i>
        </div>
        

        <div class="bibliography collapse" xml:space="collapse">
            <xsl:apply-templates select="tei:msDesc/tei:physDesc/tei:objectDesc" mode="physDesc"/>.&#x0020;
            <xsl:apply-templates select="tei:msDesc/tei:history" mode="physDesc"/>.&#x0020;
            <xsl:apply-templates select="tei:msDesc/tei:physDesc/tei:bindingDesc" mode="physDesc"/>.
        </div>
        
        <div class="bibliography collapse" xml:space="collapse">
            <xsl:apply-templates select="tei:note" mode="note"/>
        </div>

        <div class="bibliography collapse" xml:space="collapse">
            References: <xsl:apply-templates select="tei:listBibl/tei:bibl" mode="note"/>
        </div>
        
        <div class="bibliography collapse">
            <xsl:apply-templates select="tei:msDesc/tei:msIdentifier" mode="msIdentifier"/>
        </div>

    </xsl:template>
    
    <xsl:template match="//tei:msDesc/descendant-or-self::*"/>
    <xsl:template match="//tei:msDesc/descendant-or-self::*" mode="physDesc">
        <xsl:value-of select="normalize-space(.)"/>
    </xsl:template>

    <xsl:template match="//tei:div[@type='entry']/tei:note"/>
    <xsl:template match="//tei:div[@type='entry']/tei:note" mode="note">
        <xsl:value-of select="normalize-space(.)"/>
    </xsl:template>
    
    <xsl:template match="//tei:div[@type='entry']/tei:listBibl/descendant-or-self::*"/>
    <xsl:template match="//tei:div[@type='entry']/tei:listBibl/tei:bibl" mode="note">
        <xsl:value-of select="."/>
        <xsl:if test="following-sibling::tei:bibl">
            <xsl:text>; </xsl:text>
        </xsl:if>
    </xsl:template>

    <xsl:template match="tei:msDesc/tei:msIdentifier/descendant-or-self::*"/>
    <xsl:template match="tei:msDesc/tei:msIdentifier" mode="msIdentifier">
        <xsl:value-of select="tei:idno"/>
        <xsl:text>&#x2003;&#x2003;&#x2003;</xsl:text>
        <xsl:value-of select="count(parent::tei:msIdentifier/preceding-sibling::tei:msIdentifier) + 1"/>
        <xsl:text>) </xsl:text>
        <xsl:value-of select="tei:collection"/>        
    </xsl:template>
    

</xsl:stylesheet>
