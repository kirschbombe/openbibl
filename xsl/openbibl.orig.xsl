<?xml version="1.0" encoding="UTF-8"?>
<!--
    * Openbibl Framework v0.1.0
    * Copyright 2014, Dawn Childress
    * Contact: https://github.com/kirschbombe/openbibl
    * License: GNU AGPL v3 (https://github.com/kirschbombe/openbibl/LICENSE)
-->
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:tei="http://www.tei-c.org/ns/1.0"
    exclude-result-prefixes="xs"
    version="2.0">
    
    <xsl:output method="html" indent="yes"/>
    
    <xsl:strip-space elements="*"/>
    
    <xsl:template match="/">
        <xsl:apply-templates select="tei:TEI"/>
    </xsl:template>
    
    <xsl:template match="tei:TEI">
        <html>
            <head>
                <title>open bibl test page</title>
            </head>
            <body>
                <div itemscope="" itemtype="http://schema.org/CreativeWork">
                    <xsl:apply-templates select="tei:teiHeader"/>
                    <hr/>
                    <xsl:apply-templates select="tei:text/tei:body"/>
                </div>
            </body>
        </html>
    </xsl:template>
    
    <xsl:template match="tei:teiHeader">
        <h1 itemprop="name"><xsl:value-of select="tei:fileDesc/tei:titleStmt/tei:title"/></h1>
        <h2><xsl:value-of select="tei:fileDesc/tei:publicationStmt/tei:p"/></h2>
        <h2><xsl:value-of select="tei:fileDesc/tei:sourceDesc/tei:p"/></h2>
    </xsl:template>
    
    <xsl:template match="tei:text/tei:body">
    	<xsl:choose>
    		<xsl:when test="tei:div">
    			<xsl:for-each select="tei:div">
    				<xsl:apply-templates select="."/>
    			</xsl:for-each>
    		</xsl:when>
    		<xsl:when test="tei:listBibl">
    			<xsl:apply-templates select="tei:listBibl"/>
    		</xsl:when>
    		<xsl:when test="tei:biblFull">
    			<xsl:for-each select="tei:biblFull">
    				<xsl:apply-templates select="."/>
    			</xsl:for-each>
    		</xsl:when>
    	</xsl:choose>
   	</xsl:template>
   	
   	<xsl:template match="tei:listBibl">
   		<xsl:if test="tei:biblFull">
   			<xsl:for-each select="tei:biblFull">
   				<xsl:apply-templates select="."/>
   			</xsl:for-each>
   		</xsl:if>
   	</xsl:template>
   	
   	<xsl:template match="tei:biblFull">
   		<h3>
   			<div itemprop="author" itemscope="" itemtype="http://schema.org/Person">
   			<span itemprop="name">
   				<xsl:if test="tei:titleStmt/tei:author">
   					<xsl:for-each select="tei:titleStmt/tei:author">
   						<xsl:if test=". != ''">
   						<xsl:choose>
   							<xsl:when test="tei:forename">
   								<xsl:value-of select="concat(tei:surname,', ',tei:forename)"/>
   							</xsl:when>
   							<xsl:otherwise>
   								<xsl:value-of select="."/>
   							</xsl:otherwise>
   						</xsl:choose>
   						</xsl:if>
   					</xsl:for-each>
   				</xsl:if>
   			</span></div>
   			<span itemprop="title"><xsl:value-of select="tei:titleStmt/tei:title"/></span>
   			<div itemscope="" itemtype="http://schema.org/Place"><xsl:value-of select="tei:publicationStmt/tei:pubPlace"/></div>
   			<div itemprop="publisher" itemscope="" itemtype="http://schema.org/Organization">
   			<span itemprop="name"><xsl:value-of select="tei:publicationStmt/tei:publisher"/></span></div>
   			<span itemprop="datePublished"><xsl:value-of select="tei:publicationStmt/tei:date"/></span>
   		</h3>
   	</xsl:template>
   	
   	<xsl:template match="tei:div">
   		<h2><xsl:value-of select="tei:head"/></h2>
   		<xsl:for-each select="tei:biblStruct/tei:monogr">
   			<h3>
   				<div itemprop="author" itemscope="" itemtype="http://schema.org/Person">
   				<span itemprop="name"><xsl:value-of select="concat(tei:author,'.')"/></span></div>
   				<span itemprop="title"><xsl:value-of select="tei:title"/></span>
   				<div itemscope="" itemtype="http://schema.org/Place"><xsl:value-of select="tei:imprint/tei:pubPlace"/></div>
   				<div itemprop="publisher" itemscope="" itemtype="http://schema.org/Organization">
   				<span itemprop="name"><xsl:value-of select="tei:imprint/tei:publisher"/></span></div>
   				<span itemprop="datePublished"><xsl:value-of select="tei:imprint/tei:date"/></span>
   			</h3>
   		</xsl:for-each>
   		<xsl:for-each select="tei:msDesc">
   			<h3>
   				<span itemprop="contentLocation">
   					<xsl:for-each select="tei:msIdentifier/*">
   						<xsl:value-of select="."/>
   						<xsl:if test="position() != last()">
   							<xsl:text>, </xsl:text>
   						</xsl:if>
   					</xsl:for-each>
   				</span>
   			</h3>
   			<h3>
   				<span itemprop="description">
   					<xsl:value-of select="tei:msContents/tei:summary"/>
   				</span>
   			</h3>
   			<h3>
   				<xsl:for-each select="tei:physDesc/*">
   					<p><xsl:choose>
   						<xsl:when test="local-name(.) = 'objectDesc'">
   							<xsl:text>Object description: </xsl:text>
   						</xsl:when>
   						<xsl:when test="local-name(.) = 'bindingDesc'">
   							<xsl:text>Binding description: </xsl:text>
   						</xsl:when>
   					</xsl:choose>
   					<xsl:value-of select="tei:p"/></p>
   				</xsl:for-each>
   			</h3>
   			<h3>
   				<xsl:value-of select="concat('Provenance: ',tei:history/tei:provenance)"/>
   			</h3>
   			<xsl:if test="tei:additional">
   				<h3>
   					<xsl:if test="tei:additional/tei:listBibl/@type='refs'">
   						<xsl:text>References: </xsl:text>
   						<xsl:for-each select="tei:additional/tei:listBibl/tei:bibl">
   							<xsl:value-of select="."/>
   							<xsl:if test="position() != last()">
   								<xsl:text>, </xsl:text>
   							</xsl:if>
   						</xsl:for-each>
   					</xsl:if>
   				</h3>
   			</xsl:if>
   		</xsl:for-each>
   			
   	</xsl:template>
    	
    		
    		
</xsl:stylesheet>