<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    xmlns:ixsl="http://saxonica.com/ns/interactiveXSLT"
    exclude-result-prefixes="xs"
    version="2.0">

    <xsl:param name="list-path"/>
    <xsl:param name="class"/>
    <xsl:param name="term"/>

    <xsl:template name="main">
        <xsl:result-document href="?select={$list-path}" method="ixsl:append-content">
            <li class="list-group-item">
                <a class="{$class}" href="#" data-selection="{$term}">
                    <span class="glyphicon glyphicon-remove-sign"></span>
                </a> 
                &#x00A0;<xsl:value-of select="$term"/>
            </li>
        </xsl:result-document>
    </xsl:template>

</xsl:stylesheet>