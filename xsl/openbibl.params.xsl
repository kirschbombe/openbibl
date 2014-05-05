<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    xmlns:obp="http://openbibl.github.io"
    exclude-result-prefixes="xs"
    version="2.0">

    <!-- TODO: parameters; values to be externalized to config file -->
    <xsl:param name="obp-root"            select="'../../'"/>
    <xsl:param name="saxon-nocache-prod"  select="'js/lib/saxon-ce/1.1/Saxonce.nocache.js'"/>
    <xsl:param name="saxon-nocache-debug" select="'js/lib/saxon-ce/1.1/debug/Saxonce.nocache.js'"/>
    <xsl:param name="saxon-nocache"       select="concat($obp-root, $saxon-nocache-prod)"/>

    <xsl:param name="jquery-js"         select="concat($obp-root, 'js/lib/jquery-2.1.0.js')"/>
    
    <xsl:param name="bootstrap-js"      select="concat($obp-root, 'js/lib/bootstrap-3.1.1.min.js')"/>
        
    <xsl:param name="offcanvas-js"      select="concat($obp-root, 'js/lib/bootstrap-offcanvas-3.1.0.js')"/>
    <xsl:param name="typeahead-js"      select="concat($obp-root, 'js/lib/bootstrap-typeahead-2.3.2.js')"/>
    <xsl:param name="cookie-js"         select="concat($obp-root, 'js/lib/jquery.cookie.js')"/>
    <xsl:param name="underscore-js"     select="concat($obp-root, 'js/lib/underscore-1.6.0.min.js')"/>
    <xsl:param name="html5shiv-js"      select="concat($obp-root, 'js/lib/html5shiv-3.7.0.min.js')"/>
    <xsl:param name="respond-js"        select="concat($obp-root, 'js/lib/respond-1.4.2.min.js')"/>
    <xsl:param name="handlebars-js"     select="concat($obp-root, 'js/lib/handlebars-1.3.0.min.js')"/>
    <xsl:param name="filesaver-js"     select="concat($obp-root, 'js/lib/FileSaver.js')"/>

    <xsl:param name="bootstrap-css"     select="concat($obp-root, 'css/lib/bootstrap.css')"/>
    <xsl:param name="navmenu-css"       select="concat($obp-root, 'css/lib/navmenu.css')"/>

    <xsl:param name="openbibl-js-min"       select="concat($obp-root, 'js/openbibl.min.js')"/>
    <xsl:param name="openbibl-js-cls"       select="concat($obp-root, 'js/openbibl.js')"/>
    <xsl:param name="openbibl-js-saxon"     select="concat($obp-root, 'js/openbibl.saxon.js')"/>
    <xsl:param name="openbibl-js-sort"      select="concat($obp-root, 'js/openbibl.sort.js')"/>
    <xsl:param name="openbibl-js-theme"     select="concat($obp-root, 'js/openbibl.theme.js')"/>
    <xsl:param name="openbibl-js-util"      select="concat($obp-root, 'js/openbibl.util.js')"/>
    <xsl:param name="openbibl-js-filter"    select="concat($obp-root, 'js/openbibl.filter.js')"/>
    <xsl:param name="openbibl-js-storage"   select="concat($obp-root, 'js/openbibl.storage.js')"/>
    <xsl:param name="openbibl-js-highlight" select="concat($obp-root, 'js/openbibl.highlight.js')"/>
    <xsl:param name="openbibl-js-search"    select="concat($obp-root, 'js/openbibl.search.js')"/>
    <xsl:param name="openbibl-js-browse"    select="concat($obp-root, 'js/openbibl.browse.js')"/>
    <xsl:param name="openbibl-js-query"     select="concat($obp-root, 'js/openbibl.query.js')"/>
    <xsl:param name="openbibl-js-download"  select="concat($obp-root, 'js/openbibl.download.js')"/>
    <xsl:param name="openbibl-js-toc"       select="concat($obp-root, 'js/openbibl.toc.js')"/>
    <xsl:param name="openbibl-js-tooltip"   select="concat($obp-root, 'js/openbibl.tooltip.js')"/>

    <xsl:param name="openbibl-xsl"                 select="concat($obp-root, 'xsl/openbibl.xsl')"/>
    <xsl:param name="openbibl-css"                 select="concat($obp-root, 'css/openbibl.css')"/>
    <xsl:param name="openbibl-default-theme-css"   select="concat($obp-root, 'css/theme/clean.css')"/>
    <obp:css-themes>
        <option value="clean.css"   label="Clean">Clean</option>
        <option value="bookish.css" label="Bookish">Bookish</option>
        <option value="fiche.css"   label="Fiche">Fiche</option>
    </obp:css-themes>
    <xsl:param name="context-text-length" select="30"/>
    <xsl:variable name="nbsp" select="'&#x00A0;'"/>
    <!-- TODO: parameters; values to be externalized -->

</xsl:stylesheet>