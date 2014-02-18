<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
    xmlns:tei="http://www.tei-c.org/ns/1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema" 
    exclude-result-prefixes="xs" version="2.0">

    <xsl:import href="openbibl.shared.xsl"/>

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
        
    <xsl:template match="//tei:fileDesc/tei:publicationStmt/descendant-or-self::*"/>
    <xsl:template match="//tei:fileDesc/tei:publicationStmt" mode="web"/>
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
        
        <div class="bibliography expand">
            <xsl:apply-templates select="tei:biblStruct/tei:monogr/tei:author" mode="web"/>
            <xsl:value-of select="tei:biblStruct/tei:monogr/tei:title"/>.&#x0020;
            <i>
                <xsl:apply-templates select="tei:biblStruct/tei:monogr/tei:imprint/tei:pubPlace" mode="web"/>,&#x0020; 
                <xsl:value-of select="tei:biblStruct/tei:monogr/tei:imprint/tei:publisher"/>,&#x0020;
                <xsl:apply-templates select="tei:biblStruct/tei:monogr/tei:imprint/tei:date" mode="web"/>
            </i>
        </div>
        

        <div class="bibliography collapse">
            <xsl:apply-templates select="tei:msDesc/tei:physDesc/tei:objectDesc" mode="web"/>.&#x0020;
            <xsl:apply-templates select="tei:msDesc/tei:history" mode="web"/>.&#x0020;
            <xsl:apply-templates select="tei:msDesc/tei:physDesc/tei:bindingDesc" mode="web"/>.
        </div>
        
        <div class="bibliography collapse">
            <xsl:apply-templates select="tei:note" mode="web"/>
        </div>

        <div class="bibliography collapse">
            References: <xsl:apply-templates select="tei:listBibl/tei:bibl" mode="web"/>
        </div>
        
        <div class="bibliography collapse">
            <xsl:apply-templates select="tei:msDesc/tei:msIdentifier" mode="web"/>
        </div>

    </xsl:template>
    
    <xsl:template match="//tei:msDesc/descendant-or-self::*"/>
    <xsl:template match="//tei:msDesc/descendant-or-self::*" mode="web">
        <xsl:apply-templates mode="web"/>
    </xsl:template>

    <xsl:template match="//tei:div[@type='entry']/tei:note"/>
    <xsl:template match="//tei:div[@type='entry']/tei:note" mode="web">
        <xsl:apply-templates mode="web"/>
    </xsl:template>
    
    <xsl:template match="//tei:div[@type='entry']/tei:listBibl/descendant-or-self::*"/>
    <xsl:template match="//tei:div[@type='entry']/tei:listBibl/tei:bibl" mode="web">
        <xsl:value-of select="."/>
        <xsl:if test="following-sibling::tei:bibl">
            <xsl:text>; </xsl:text>
        </xsl:if>
    </xsl:template>

    <xsl:template match="tei:msDesc/tei:msIdentifier/descendant-or-self::*"/>
    <xsl:template match="tei:msDesc/tei:msIdentifier" mode="web">
        <xsl:value-of select="tei:idno"/>
        <xsl:if test="tei:collection != ''">
            <xsl:text>&#x2003;&#x2003;&#x2003;</xsl:text>
            <xsl:value-of select="count(parent::tei:msIdentifier/preceding-sibling::tei:msIdentifier) + 1"/>
            <xsl:text>) </xsl:text>
            <xsl:value-of select="tei:collection"/>
        </xsl:if>
    </xsl:template>
    
    <xsl:template match="tei:date[parent::tei:imprint|parent::tei:publicationStatement]" mode="web">
        <span itemscope="itemscope" itemtype="http://schema.org/CreativeWork">
            <span itemprop="datePublished"><xsl:value-of select="."/></span>
        </span>
    </xsl:template>
    
    <xsl:template match="tei:pubPlace[parent::tei:imprint]" mode="web">
        <!--
        <span itemscope="itemscope" itemtype="http://schema.org/Place">
            <span itemprop="location"><xsl:value-of select="."/></span>
        </span>
        -->
        <xsl:apply-templates select="@*|node" mode="web"/>
    </xsl:template>

    <xsl:template match="//tei:titleStmt/tei:author"/>
    <xsl:template match="tei:biblStruct/tei:monogr/tei:author" mode="web">
        <xsl:if test=". != ''">
            <xsl:apply-templates select="@*|node()" mode="web"/>
            <!--
            <span itemscope="itemscope" itemtype="http://schema.org/Person">
                <span itemprop="name"><xsl:value-of select="."/></span>
            </span>
            -->
            <!-- config: author-following punct -->
            <xsl:text>. </xsl:text>
        </xsl:if>
    </xsl:template>

    <xsl:template match="//tei:back"/>

    <!-- -->
    <xsl:template match="*[@ref]" mode="web">
        <span>
        <xsl:attribute name="id">
            <xsl:call-template name="global-ref-id">
                <xsl:with-param name="ref-elt" select="."/>
            </xsl:call-template>
        </xsl:attribute>
        <xsl:apply-templates mode="web"/>
        </span>
    </xsl:template>

</xsl:stylesheet>
