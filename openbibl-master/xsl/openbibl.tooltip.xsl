<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    xmlns:obp="http://openbibl.github.io"
    xmlns:tei="http://www.tei-c.org/ns/1.0"
    xmlns:ixsl="http://saxonica.com/ns/interactiveXSLT"
    xmlns:js="http://saxonica.com/ns/globalJS"
    exclude-result-prefixes="#all"
    version="2.0">

    <xsl:output method="xhtml" indent="yes"/>

    <!-- list title -->
    <xsl:param name="related-entries-title" select="'Related Entries'"/>

    <!-- vars and function for handling quotes, for literal JS -->
    <xsl:variable name="q"  select="''''"/>
    <xsl:variable name="qq" select="''"/>
    <xsl:function name="obp:quote-escape" as="xs:string">
        <xsl:param name="str"   as="xs:string?"/>
        <xsl:param name="quote" as="xs:string"/>
        <xsl:value-of select="concat($quote, replace($str, $quote, concat('\\', $quote)), $quote)"/>
    </xsl:function>

    <xsl:template match="/">
        <xsl:apply-templates select="//*[@ref]"/>
    </xsl:template>

    <!-- generate data on tooltips, including popover text and related-entry listing
         TODO: factor this with openbibl.xsl once FF base-uri issues have been sorted
    -->
    <xsl:key name="tooltip-note" match="*[@xml:id]" use="@xml:id"/>
    <xsl:template match="*[@ref]">
        <xsl:variable name="this"         as="element()" select="."/>
        <xsl:variable name="ref"          as="xs:string" select="string(@ref)" />
        <xsl:variable name="span-id"      as="xs:string" select="generate-id(.)"/>
        <xsl:variable name="anchor-id"    as="xs:string" select="concat($span-id,'-a')"/>
        <xsl:variable name="script-id"    as="xs:string" select="concat($span-id,'-s')"/>
        <xsl:variable name="tooltip-id"   as="xs:string" select="concat($span-id,'-tt')"/>
        <xsl:variable name="note-text"    as="xs:string" select="normalize-space(string(key('tooltip-note',substring-after($ref,'#'))/tei:note))"/>

        <!-- add a tooltip anchor only for the first occurrence of the mention within a tei:div -->

        <!-- add an @id attribute to the first occurrence per tei:div, for tooltipping -->
        <xsl:if test="string-length($note-text) &gt; 0
                  and generate-id((ancestor-or-self::tei:div[@type='entry']//@ref[.=$ref])[1]) = generate-id(./@ref)
         ">
            <!-- replace a -->
            <xsl:result-document href="#{$span-id}" method="ixsl:replace-content">
                <a id="{$anchor-id}" href="#" data-toggle="tooltip">
                    <xsl:value-of select="."/>
                </a>
                <script id="{$script-id}" type="text/javascript" language="javascript">
                    require(['tooltip'], function(tooltip) {
                        <xsl:value-of select="obp:js-method-call-string('tooltip','register_title', 
                            ($anchor-id,$script-id,$tooltip-id)
                        )"/>
                    });
                </script>
                <!-- output the populated HTML template for the tooltip popover -->
                <xsl:call-template name="make-tooltip-html">
                    <xsl:with-param name="ref"        select="$ref"/>
                    <xsl:with-param name="tooltip-id" select="$tooltip-id"/>
                    <xsl:with-param name="note-text"  select="$note-text"/>
                    <xsl:with-param name="related"    select="//tei:div[descendant::*[@ref=$ref]] except $this/ancestor-or-self::tei:div" as="element(tei:div)*"/>
                </xsl:call-template>
            </xsl:result-document>
        </xsl:if>        
    </xsl:template>
    
    <!-- generate HTML for the tooltip overlay (i.e., construct HTML partial-view) -->
    <xsl:template name="make-tooltip-html">
        <xsl:param name="ref"        as="xs:string"/>
        <xsl:param name="tooltip-id" as="xs:string"/>
        <xsl:param name="note-text"  as="xs:string"/>
        <xsl:param name="related"    as="element(tei:div)*"/>
        
        <!-- outer div here is a wrapper, inner div is for the tooltip -->
        <div class="obp-tt-wrapper" id="{$tooltip-id}">
            <div>
                <xsl:value-of select="$note-text"/>
                <xsl:if test="count($related) &gt; 0">
                    <xsl:if test="string-length($related-entries-title) &gt; 0">
                        <h3><xsl:value-of select="$related-entries-title"/></h3>                                
                    </xsl:if>
                    <ul>
                        <xsl:for-each select="$related">
                            <xsl:variable name="title" select="string(./tei:head)"/>
                            <xsl:variable name="ind" select="count(./preceding-sibling::tei:div[@type='entry'])"/>
                            <li>
                                <a class="toc-click" data-src-index="{$ind}">
                                    <xsl:value-of select="$title"/>
                                </a>
                            </li>
                        </xsl:for-each>
                    </ul>
                </xsl:if>
            </div>
        </div>        
    </xsl:template>

    <!-- utility to hide syntax of JS function call -->
    <xsl:function name="obp:js-method-call-string">
        <xsl:param name="object" as="xs:string"/>
        <xsl:param name="method" as="xs:string"/>
        <xsl:param name="params" as="xs:string*"/>
        <xsl:value-of select="concat(
              $object
            , '.'
            , $method
            , '('
            , string-join( for $p in $params return obp:quote-escape($p,$q), ',')
            , ');'
        )"/>
    </xsl:function>

</xsl:stylesheet>