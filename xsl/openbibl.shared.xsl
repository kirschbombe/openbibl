<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    version="1.0">
    
    <xsl:template name="global-ref-id">
        <xsl:param name="ref-elt"/>
        <xsl:variable name="attr" select="@ref"/>
        <xsl:variable name="val" select="concat(substring-before($attr,'#'),substring-after($attr,'#'))"/>
        <xsl:value-of select="concat(string(count($ref-elt/preceding::*)),$val)"/>
    </xsl:template>
    
    <!-- generates an @id value meant to be processor independent, since generate-id()
         is not implementation-independent and will differ between saxon-ce and libxslt 
    -->
    <xsl:template name="generate-independent-id">
        <xsl:number count="*" level="any" from="/*" format="1"/>
    </xsl:template>
    
</xsl:stylesheet>