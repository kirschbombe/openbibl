<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    xmlns:obp="http://openbibl.github.io"
    exclude-result-prefixes="xs"
    version="1.0">

    <xsl:variable name="pi-quote"           select="substring(substring-after(processing-instruction('xml-stylesheet'), 'href='),1,1)"/>
    <xsl:variable name="obp-boot-rel-path"  select="'xsl/openbibl.boot.xsl'"/>
    <xsl:variable name="obp-boot-root"      select="substring-before(substring-before(substring-after(processing-instruction('xml-stylesheet'), concat('href=', $pi-quote)), $pi-quote), $obp-boot-rel-path)"/>
    
    <!-- try to use the stylesheet's uri for the path, otherwise fall back to
         a relative url, since unparsed-entity-uri is not implemented in FireFox
    -->
    <xsl:variable name="obp-root">
        <xsl:choose>
            <xsl:when test="function-available('unparsed-entity-uri')">
                <xsl:value-of select="concat(unparsed-entity-uri(''),$obp-boot-root)"/>
            </xsl:when>
            <xsl:otherwise>
                <xsl:value-of select="$obp-boot-root"/>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:variable>

    <xsl:variable name="saxon-nocache-prod"  select="'js/lib/saxon-ce/1.1/Saxonce.nocache.js'"/>
    <xsl:variable name="saxon-nocache-debug" select="'js/lib/saxon-ce/1.1/debug/Saxonce.nocache.js'"/>
    <xsl:variable name="saxon-nocache"       select="concat($obp-root, $saxon-nocache-prod)"/>

    <xsl:variable name="jquery-js"         select="concat($obp-root, 'js/lib/jquery-2.1.0.js')"/>

    <xsl:variable name="bootstrap-js"      select="concat($obp-root, 'js/lib/bootstrap-3.1.1.min.js')"/>

    <xsl:variable name="offcanvas-js"      select="concat($obp-root, 'js/lib/bootstrap-offcanvas-3.1.0.js')"/>
    <xsl:variable name="typeahead-js"      select="concat($obp-root, 'js/lib/bootstrap-typeahead-2.3.2.js')"/>
    <xsl:variable name="cookie-js"         select="concat($obp-root, 'js/lib/jquery.cookie.js')"/>
    <xsl:variable name="underscore-js"     select="concat($obp-root, 'js/lib/underscore-1.6.0.min.js')"/>
    <xsl:variable name="html5shiv-js"      select="concat($obp-root, 'js/lib/html5shiv-3.7.0.min.js')"/>
    <xsl:variable name="respond-js"        select="concat($obp-root, 'js/lib/respond-1.4.2.min.js')"/>
    <xsl:variable name="handlebars-js"     select="concat($obp-root, 'js/lib/handlebars-1.3.0.min.js')"/>
    <xsl:variable name="filesaver-js"     select="concat($obp-root, 'js/lib/FileSaver.js')"/>

    <xsl:variable name="bootstrap-css"     select="concat($obp-root, 'css/lib/bootstrap.css')"/>
    <xsl:variable name="navmenu-css"       select="concat($obp-root, 'css/lib/navmenu.css')"/>

    <xsl:variable name="openbibl-js-min"       select="concat($obp-root, 'js/openbibl.min.js')"/>
    <xsl:variable name="openbibl-js-cls"       select="concat($obp-root, 'js/openbibl.js')"/>
    <xsl:variable name="openbibl-js-saxon"     select="concat($obp-root, 'js/openbibl.saxon.js')"/>
    <xsl:variable name="openbibl-js-sort"      select="concat($obp-root, 'js/openbibl.sort.js')"/>
    <xsl:variable name="openbibl-js-theme"     select="concat($obp-root, 'js/openbibl.theme.js')"/>
    <xsl:variable name="openbibl-js-util"      select="concat($obp-root, 'js/openbibl.util.js')"/>
    <xsl:variable name="openbibl-js-filter"    select="concat($obp-root, 'js/openbibl.filter.js')"/>
    <xsl:variable name="openbibl-js-highlight" select="concat($obp-root, 'js/openbibl.highlight.js')"/>
    <xsl:variable name="openbibl-js-search"    select="concat($obp-root, 'js/openbibl.search.js')"/>
    <xsl:variable name="openbibl-js-browse"    select="concat($obp-root, 'js/openbibl.browse.js')"/>
    <xsl:variable name="openbibl-js-query"     select="concat($obp-root, 'js/openbibl.query.js')"/>
    <xsl:variable name="openbibl-js-download"  select="concat($obp-root, 'js/openbibl.download.js')"/>
    <xsl:variable name="openbibl-js-toc"       select="concat($obp-root, 'js/openbibl.toc.js')"/>
    <xsl:variable name="openbibl-js-tooltip"   select="concat($obp-root, 'js/openbibl.tooltip.js')"/>

    <xsl:variable name="openbibl-xsl"                 select="concat($obp-root, 'xsl/openbibl.xsl')"/>
    <xsl:variable name="openbibl-css"                 select="concat($obp-root, 'css/openbibl.css')"/>
    <xsl:variable name="openbibl-default-theme-css"   select="concat($obp-root, 'css/theme/clean.css')"/>
    <obp:css-themes>
        <option value="clean.css"   label="Clean">Clean</option>
        <option value="bookish.css" label="Bookish">Bookish</option>
        <option value="fiche.css"   label="Fiche">Fiche</option>
    </obp:css-themes>
    <!-- TODO: parameters; values to be externalized -->

</xsl:stylesheet>