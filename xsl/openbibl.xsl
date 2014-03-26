<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
    xmlns:obp="http://openbibl.github.io"
    xmlns:tei="http://www.tei-c.org/ns/1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema" 
    exclude-result-prefixes="xs" version="2.0">

    <xsl:import href="openbibl.shared.xsl"/>
    <xsl:import href="openbibl.date.xsl"/>

    <!-- TODO: fix json-formatted parsing of a list of ints here -->
    <xsl:param name="div-ids" as="xs:string" select="''"/>
    <xsl:variable name="div-ids-seq" as="xs:integer*">
        <xsl:choose>
            <xsl:when test="string-length($div-ids) = 0">
                <xsl:sequence select="()"/>
            </xsl:when>
            <xsl:otherwise>
                <xsl:sequence select="for $str in tokenize($div-ids, '\D+'),
                                          $int in $str[matches(.,'^\d+$')]
                                          return xs:integer($int)"/>                
            </xsl:otherwise>
        </xsl:choose>
    </xsl:variable>

    <xsl:template match="/">
        <div id="result">
            <xsl:apply-templates/>
        </div>
    </xsl:template>
    
    <xsl:template match="//tei:titleStmt/tei:title"/>
        
    <xsl:template match="//tei:fileDesc/tei:publicationStmt/descendant-or-self::*"/>
    <xsl:template match="//tei:fileDesc/tei:publicationStmt" mode="web"/>
    
    <!--  -->
    <xsl:function name="obp:handle-div" as="xs:boolean">
        <xsl:param name="index" as="xs:integer"/>
        <xsl:choose>
            <xsl:when test="empty($div-ids-seq)">
                <xsl:sequence select="true()"/>
            </xsl:when>
            <xsl:otherwise>
                <xsl:sequence select="exists(index-of($index, $div-ids-seq))"/>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:function>
    
    <xsl:template match="//tei:text/tei:body/tei:div[@type='entry']">

        <xsl:variable name="div-index" select="count(preceding-sibling::tei:div[@type='entry'])"/>
        <xsl:variable name="handle" select="obp:handle-div($div-index)" as="xs:boolean"/>
        
        <xsl:if test="$handle">
    
            <!-- add data-* attributes to simplify sorting -->
            <xsl:variable name="sort-date">
                <xsl:call-template name="date-sort-key">
                    <xsl:with-param name="date-elt" select="tei:biblStruct/tei:monogr/tei:imprint/tei:date"/>
                </xsl:call-template>
            </xsl:variable>
            <xsl:variable name="sort-author" select="normalize-space(tei:biblStruct/tei:monogr/tei:author/tei:persName)"/>
            
            <div class="entry" data-date="{$sort-date}" data-author="{$sort-author}" data-src-index="{$div-index}">
                
                <!-- expand -->
                <h2 class="bibliography">
                    <xsl:value-of select="tei:head"/>
                </h2>
                
                <p class="bibliography">
                    <xsl:apply-templates select="tei:biblStruct/tei:monogr/tei:author" mode="web"/>
                    <xsl:value-of select="tei:biblStruct/tei:monogr/tei:title"/>.&#x0020;
                    <i>
                        <xsl:apply-templates select="tei:biblStruct/tei:monogr/tei:imprint/tei:pubPlace" mode="web"/>,&#x0020; 
                        <xsl:value-of select="tei:biblStruct/tei:monogr/tei:imprint/tei:publisher"/>,&#x0020;
                        <xsl:apply-templates select="tei:biblStruct/tei:monogr/tei:imprint/tei:date" mode="web"/>
                    </i>
                </p>
                
        
                <p class="bibliography">
                    <xsl:apply-templates select="tei:msDesc/tei:physDesc/tei:objectDesc" mode="web"/>.&#x0020;
                    <xsl:apply-templates select="tei:msDesc/tei:history" mode="web"/>.&#x0020;
                    <xsl:apply-templates select="tei:msDesc/tei:physDesc/tei:bindingDesc" mode="web"/>.
                </p>
                
                <p class="bibliography">
                    <xsl:apply-templates select="tei:note" mode="web"/>
                </p>
        
                <p class="bibliography">
                    References: <xsl:apply-templates select="tei:listBibl/tei:bibl" mode="web"/>
                </p>
                
                <p class="bibliography">
                    <xsl:apply-templates select="tei:msDesc/tei:msIdentifier" mode="web"/>
                </p>
    
            </div>

        </xsl:if>

    </xsl:template>
    
    <xsl:template match="//tei:msDesc"/>
    <xsl:template match="//tei:msDesc" mode="web">
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

    <xsl:template match="tei:msDesc/tei:msIdentifier"/>
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

    <xsl:key name="tooltip-note" match="*[@xml:id]" use="@xml:id"/>

    <!-- -->
    <xsl:template match="*[@ref]" mode="web">
        <xsl:variable name="tooltip-text" select="key('tooltip-note',substring-after(@ref,'#'))/tei:note"/>
        <xsl:choose>
            <xsl:when test="string-length($tooltip-text) &gt; 0">
                <a href="#" data-toggle="tooltip" title="{$tooltip-text}">
                    <span data-ed-ref="{substring-after(@ref,'#')}">
                        <xsl:apply-templates mode="web"/>
                    </span>
                </a>
            </xsl:when>
            <xsl:otherwise>
                <span data-ed-ref="{substring-after(@ref,'#')}">
                    <xsl:apply-templates mode="web"/>
                </span>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>

</xsl:stylesheet>
