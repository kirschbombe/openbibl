<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
    xmlns:obp="http://openbibl.github.io"
    xmlns:tei="http://www.tei-c.org/ns/1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    exclude-result-prefixes="xs obp tei"
    version="2.0">

    <xsl:import href="openbibl.shared.xsl"/>
    <xsl:import href="openbibl.date.xsl"/>

    <xsl:strip-space elements="*"/>
    <xsl:output method="xhtml" indent="yes"/>

    <!-- #result is the wrapper element used in the JS -->
    <xsl:template match="/">
        <html>
            <head/>
            <body>
                <div id="result">
                    <xsl:apply-templates select="//tei:div"/>
                </div>
            </body>
        </html>
    </xsl:template>

    <!-- header info used in the booting XSLT 1.0 stylesheet -->
    <xsl:template match="//teiHeader"/>

    <!-- handle each bibliography entry -->
    <xsl:template match="//tei:text/tei:body/tei:div[@type='entry']">

        <!-- add data-* attributes to simplify sorting -->
        <xsl:variable name="div-index" select="count(preceding-sibling::tei:div[@type='entry'])"/>
        <xsl:variable name="sort-date">
            <xsl:call-template name="date-sort-key">
                <xsl:with-param name="date-elt" select="tei:biblStruct/tei:monogr/tei:imprint/tei:date"/>
            </xsl:call-template>
        </xsl:variable>
        <xsl:variable name="sort-author" select="normalize-space(tei:biblStruct/tei:monogr/tei:author/tei:persName)"/>

        <div class="entry" data-date="{$sort-date}" data-author="{$sort-author}" data-src-index="{$div-index}">
            <h2 class="bibliography">
                <xsl:value-of select="tei:head"/>
            </h2>
            <p class="bibliography">
                <xsl:apply-templates select="tei:biblStruct" mode="web"/>
            </p>
            <p class="bibliography">
                <xsl:apply-templates select="tei:msDesc" mode="web"/>
            </p>
            <p class="bibliography">
                <xsl:apply-templates select="tei:note" mode="web"/>
            </p>
            <p class="bibliography">
                <xsl:apply-templates select="tei:listBibl" mode="web"/>
            </p>
            <p class="bibliography">
                <xsl:apply-templates select="tei:msDesc/tei:msIdentifier" mode="web"/>
            </p>
        </div>
    </xsl:template>

    <!-- suppress all nodes by default, as they are handled in a mode -->
    <xsl:template match="node()"/>

    <xsl:template match="tei:title[parent::tei:monogr]" mode="web">
        <span itemprop="title">
            <xsl:apply-templates mode="web"/>
        </span>
        <!-- TODO: externalize punctuation -->
        <span>.&#x0020;</span>
    </xsl:template>

    <xsl:template match="tei:imprint" mode="web">
        <i><xsl:apply-templates mode="web"/></i>
    </xsl:template>

    <xsl:template match="tei:msDesc" mode="web">
        <span>
            <xsl:for-each select="*[not(self::tei:msIdentifier)]">
                <xsl:apply-templates select="." mode="web"/>
            </xsl:for-each>
        </span>
    </xsl:template>

    <xsl:template match="tei:condition|tei:decoNote|tei:accMat|tei:provenance|tei:acquisition" mode="web">
        <xsl:if test="string-length(normalize-space(string(.))) != 0">
            <span>
                <xsl:apply-templates mode="web"/>
            </span>
            <xsl:if test="not(matches(normalize-space(string(.)), '\.$'))">
                <span>.&#x0020;</span>
            </xsl:if>
        </xsl:if>
    </xsl:template>

    <xsl:template match="tei:listBibl" mode="web">
        <!-- TODO: externalize/localize strings -->
        <span>References: </span>
        <xsl:apply-templates mode="web"/>
    </xsl:template>

    <xsl:template match="tei:bibl" mode="web">
        <xsl:apply-templates mode="web"/>
        <xsl:if test="following-sibling::tei:bibl">
            <span>;&#x0020;</span>
        </xsl:if>
    </xsl:template>

    <xsl:template match="tei:msIdentifier" mode="web">
        <span itemprop="contentLocation">
            <xsl:value-of select="tei:idno"/>
            <xsl:if test="tei:collection != ''">
                <span>&#x2003;&#x2003;&#x2003;</span>
                <span>
                    <xsl:value-of select="concat(
                        count(parent::tei:msIdentifier/preceding-sibling::tei:msIdentifier) + 1,
                        ')',
                        '&#x0020;',
                        string(tei:collection)
                    )"/>
                </span>
            </xsl:if>
        </span>
    </xsl:template>

    <xsl:template match="tei:date[parent::tei:imprint|parent::tei:publicationStatement]" mode="web">
        <span itemscope="itemscope" itemtype="http://schema.org/CreativeWork">
            <span itemprop="datePublished">
                <xsl:value-of select="."/>
            </span>
        </span>
    </xsl:template>

    <xsl:template match="tei:pubPlace[parent::tei:imprint]" mode="web">
        <span itemscope="itemscope" itemtype="http://schema.org/Place">
            <span itemprop="location">
                <xsl:apply-templates mode="web"/>
            </span>
        </span>
        <!-- TODO: external cofig for punctuation -->
        <span>,&#x0020;</span>
    </xsl:template>

    <xsl:template match="tei:biblStruct/tei:monogr/tei:imprint/tei:publisher" mode="web">
       <xsl:apply-templates mode="web"/>
        <!-- TODO: external cofig for punctuation -->
        <span>,&#x0020;</span>
    </xsl:template>

    <xsl:template match="tei:persName[parent::tei:publisher]" mode="web">
        <span itemprop="publisher" itemscope="itemscope" itemtype="http://schema.org/Organization">
            <span itemprop="name">
                <xsl:apply-templates mode="web"/>
            </span>
        </span>
    </xsl:template>

    <xsl:template match="tei:biblStruct/tei:monogr/tei:author" mode="web">
        <xsl:if test=". != ''">
            <span itemprop="author" itemscope="itemscope" itemtype="http://schema.org/Person">
                <span itemprop="name">
                    <xsl:apply-templates mode="web"/>
                </span>
            </span>
            <!-- config: author-following punct -->
            <span>.&#x0020;</span>
        </xsl:if>
    </xsl:template>

    <!-- make tooltip text -->
    <xsl:key name="tooltip-note" match="*[@xml:id]" use="@xml:id"/>
    <xsl:template match="text()[parent::*[@ref]]" mode="web">
        <xsl:variable name="ref" select="substring-after(parent::*/@ref,'#')"/>
        <xsl:variable name="tooltip-text" select="string(key('tooltip-note',$ref)/tei:note)"/>
        <xsl:choose>
            <xsl:when test="string-length($tooltip-text) &gt; 0">
                <a href="#" data-toggle="tooltip" title="{$tooltip-text}">
                    <span data-ed-ref="{$ref}">
                        <xsl:value-of select="."/>
                    </span>
                </a>
            </xsl:when>
            <xsl:otherwise>
                <span data-ed-ref="{$ref}">
                    <xsl:value-of select="."/>
                </span>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>

    <!-- suppress attribute text() nodes; this template is required for the previous
         template not to write, e.g., ref="..." attributes
    -->
    <xsl:template match="@*" mode="web"/>

    <xsl:template match="*" mode="web">
        <xsl:apply-templates mode="web"/>
    </xsl:template>

    <!-- wrap text nodes in a <span>, to help control whitepsace -->
    <xsl:template match="text()" mode="web">
        <xsl:if test="string-length(normalize-space(.)) != 0">
            <span><xsl:value-of select="."/></span>
        </xsl:if>
    </xsl:template>

    <!-- output <tei:p> elements in a <span>, adding a trailing period if
         one was not provided in the original
    -->
    <xsl:template match="tei:p" mode="web">
        <xsl:apply-templates mode="web"/>
        <xsl:variable name="text" select="normalize-space(string(.))"/>
        <xsl:if test="string-length($text) &gt; 0">
            <xsl:if test="not(matches($text, '\.$'))">
                <span>
                    <xsl:text>.</xsl:text>
                </span>
            </xsl:if>
            <xsl:if test="not(position() = last())">
                <span>
                <xsl:text>&#x0020;</xsl:text>
                </span>
            </xsl:if>
        </xsl:if>
    </xsl:template>

</xsl:stylesheet>
