<?xml version="1.0" encoding="UTF-8"?>
<!--
    * Openbibl Framework v0.1.0
    * Copyright 2014, Dawn Childress
    * Contact: https://github.com/kirschbombe/openbibl
    * License: GNU AGPL v3 (https://github.com/kirschbombe/openbibl/LICENSE)
-->
<xsl:stylesheet 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:tei="http://www.tei-c.org/ns/1.0"
    xmlns:obp="http://openbibl.github.io"
    version="1.0">
    
    <!-- 
        TODO: - convert to 2.0 to simplify text handling below
              - call from openbibl.js separately on content
                so that the browse dialog content can be populated
                asynchronously
    -->
    
    <xsl:template match="tei:person" mode="modal-title">
        <xsl:value-of select="concat(
            tei:persName, ' (', tei:birth/@when, '&#x2013;', tei:death/@when, ')'
            )"/>
    </xsl:template>
    
    <xsl:template match="tei:place" mode="modal-title">
        <xsl:value-of select="tei:placeName"/>
    </xsl:template>
    
    <!-- make modal dialog from listPerson/listPlace/etc -->
    <xsl:template match="//tei:back/tei:div[@type='editorial']/*" mode="browse">
        
        <!--
        <xsl:variable name="modal-dialog-id">
            <xsl:call-template name="generate-independent-id"/>
        </xsl:variable>
        
        <div class="modal fade" id="{$modal-dialog-id}">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&#x00D7;</button>
                        <h4 class="modal-title" id=""><xsl:value-of select="tei:head"/></h4>
                    </div>
                    
                    <xsl:for-each select="tei:head/following-sibling::*">
                        <xsl:variable name="modal-entry-id" select="concat('modal-',@xml:id)"/>
                        <div class="modal-body">
                            <h4><xsl:apply-templates select="." mode="modal-title"/></h4>
                            <div class="panel-group" id="{$modal-entry-id}">
                                <div class="panel panel-default">
                                    <xsl:call-template name="make-panel-entry">
                                        <xsl:with-param name="dialog-id" select="$modal-dialog-id"/>
                                    </xsl:call-template>
                                </div>
                            </div>
                        </div>
                    </xsl:for-each>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                    </div>
                    
                </div>
            </div>
        </div>
        -->
    </xsl:template>
    
    <xsl:template name="make-panel-entry">
        <xsl:param name="dialog-id"/>
        <xsl:variable name="xml-id" select="@xml:id"/>
        <xsl:variable name="xml-id-ref" select="concat('#',$xml-id)"/>
        <xsl:for-each select="//tei:div[@type='entry'][descendant::*[@ref=$xml-id-ref]]">
            <xsl:variable name="modal-entry-collapse-id" select="concat(generate-id(tei:head), '-', $xml-id)"/>
            <div class="panel-heading">
                <h5>
                    <a data-toggle="collapse" data-parent="#people-accordion" href="{concat('#',$modal-entry-collapse-id)}">
                        <xsl:value-of select="tei:head"/>
                    </a>
                </h5>
            </div>
            <div id="{$modal-entry-collapse-id}" class="panel-collapse collapse">
                <div class="panel-body">
                    <xsl:variable name="entry-ref-id" select="generate-id(.)"/>
                    <xsl:attribute name="id">
                        <xsl:value-of select="$entry-ref-id"/>
                    </xsl:attribute>
                    <xsl:for-each select="descendant::*[@ref=$xml-id-ref]">
                        <xsl:variable name="elt-with-ref" select="."/>
                        
                        <!-- @id value generated for the target in div@entry -->
                        <xsl:variable name="scroll-target-id">
                            <xsl:call-template name="global-ref-id">
                                <xsl:with-param name="ref-elt" select="."/>
                            </xsl:call-template>
                        </xsl:variable>
                        
                        <!-- list item -->
                        <xsl:element name="p">
                            <xsl:variable name="text-before">
                                <xsl:variable name="unnormalized">
                                    <xsl:call-template name="preceding-text">
                                        <xsl:with-param name="accumulated-string" select="''"/>
                                        <xsl:with-param name="current-node" select="./preceding-sibling::node()[1]"/>
                                        <xsl:with-param name="remaining-length" select="$context-text-length"/>
                                    </xsl:call-template>
                                </xsl:variable>
                                <xsl:value-of select="normalize-space($unnormalized)"/>
                            </xsl:variable>
                            <xsl:variable name="text-after">
                                <xsl:variable name="unnormalized">
                                    <xsl:call-template name="following-text">
                                        <xsl:with-param name="accumulated-string" select="''"/>
                                        <xsl:with-param name="current-node" select="./following-sibling::node()[1]"/>
                                        <xsl:with-param name="remaining-length" select="$context-text-length"/>
                                    </xsl:call-template>
                                </xsl:variable>
                                <xsl:value-of select="normalize-space($unnormalized)"/>
                            </xsl:variable>
                            
                            <span class="fade-left">
                                <xsl:value-of select="substring(
                                    $text-before, string-length($text-before) - $context-text-length +1, $context-text-length
                                    )"/>
                            </span>
                            
                            <!-- link -->
                            <xsl:element name="a">
                                <!-- onclick handler -->
                                <xsl:attribute name="onclick">
                                    <xsl:text>javascript:window.obp.scroll_to_id('</xsl:text>
                                    <xsl:value-of select="$scroll-target-id"/>
                                    <xsl:text>','</xsl:text>
                                    <xsl:value-of select="$dialog-id"/>
                                    <xsl:text>')</xsl:text>
                                </xsl:attribute>
                                <span class="ref-match"><xsl:value-of select="."/></span>
                            </xsl:element>
                            
                            <!-- context after link -->
                            <span class="fade-right">
                                <xsl:value-of select="substring(
                                    $text-after, 1, $context-text-length
                                    )"/>
                            </span>
                            
                        </xsl:element>
                    </xsl:for-each>
                </div>
            </div>
        </xsl:for-each>
    </xsl:template>
    
    
    <!-- build string from string values of the preceding sibling nodes, up to a given length -->
    <xsl:template name="preceding-text">
        <xsl:param name="current-node"/>
        <xsl:param name="accumulated-string"/>
        <xsl:param name="remaining-length"/>
        
        <xsl:variable name="current-string" select="normalize-space(string($current-node))"/>
        <xsl:variable name="current-string-length" select="string-length($current-string)"/>
        
        <xsl:choose>
            
            <!-- when the string value of the current node is sufficient -->
            <xsl:when test="$current-string-length &gt;= $remaining-length">
                <xsl:value-of select="concat(
                    substring(
                    $current-string,
                    $current-string-length - $remaining-length + 1,
                    $remaining-length
                    ),
                    ' ',
                    $accumulated-string
                    )"/>
            </xsl:when>
            
            <!-- when the string value of the preceding node must be used -->
            <xsl:when test="$current-node/preceding-sibling::node()">
                <xsl:call-template name="preceding-text">
                    <xsl:with-param name="current-node" select="$current-node/preceding-sibling::node()"/>
                    <xsl:with-param name="remaining-length" select="$remaining-length - $current-string-length"/>
                    <xsl:with-param name="accumulated-string" select="concat($current-string, ' ', $accumulated-string)"/>
                </xsl:call-template>
            </xsl:when>
            
            <!-- when there are no preceding siblings -->
            <xsl:otherwise>
                <xsl:value-of select="$accumulated-string"/>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>
    
    <!-- build string from string values of the folling sibling nodes, up to a given length -->
    <xsl:template name="following-text">
        <xsl:param name="current-node"/>
        <xsl:param name="accumulated-string"/>
        <xsl:param name="remaining-length"/>
        
        <xsl:variable name="current-string" select="normalize-space(string($current-node))"/>
        <xsl:variable name="current-string-length" select="string-length($current-string)"/>
        
        <xsl:choose>
            
            <!-- when the string value of the current node is sufficient -->
            <xsl:when test="$current-string-length &gt;= $remaining-length">
                <xsl:value-of select="concat(
                    $accumulated-string,
                    ' ',
                    substring(
                    $current-string,
                    1,
                    $remaining-length
                    )
                    )"/>
            </xsl:when>
            
            <!-- when the string value of the preceding node must be used -->
            <xsl:when test="$current-node/following-sibling::node()">
                <xsl:call-template name="following-text">
                    <xsl:with-param name="current-node" select="$current-node/following-sibling::node()"/>
                    <xsl:with-param name="remaining-length" select="$remaining-length - $current-string-length"/>
                    <xsl:with-param name="accumulated-string" select="concat($current-string, ' ', $accumulated-string)"/>
                </xsl:call-template>
            </xsl:when>
            
            <!-- when there are no preceding siblings -->
            <xsl:otherwise>
                <xsl:value-of select="$accumulated-string"/>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>
    
    
</xsl:stylesheet>