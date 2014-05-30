<?xml version="1.0" encoding="UTF-8"?>
<!--
    * Openbibl Framework v0.1.0
    * Copyright 2014, Dawn Childress
    * Contact: https://github.com/kirschbombe/openbibl
    * License: GNU AGPL v3 (https://github.com/kirschbombe/openbibl/LICENSE)
-->
<xsl:stylesheet
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    xmlns:obp="http://openbibl.github.io"
    exclude-result-prefixes="xs"
    version="1.0">

    <!-- Path to use for the root of the Openbibl framework files, i.e., the
         'openbibl' directory containing the xsl/, js/, etc subdirectories.

         Try to use the stylesheet's uri for the path, otherwise fall back to
         a relative url, since unparsed-entity-uri is not implemented in FireFox
    -->
    <xsl:variable name="obp-boot-rel-path"  select="'xsl/openbibl.boot.xsl'"/>
    <xsl:variable name="obp-root">
        <xsl:variable name="pi-quote"           select="substring(substring-after(processing-instruction('xml-stylesheet'), 'href='),1,1)"/>
        <xsl:variable name="obp-boot-root"      select="substring-before(substring-before(substring-after(processing-instruction('xml-stylesheet'), concat('href=', $pi-quote)), $pi-quote), $obp-boot-rel-path)"/>
        <xsl:choose>
            <xsl:when test="function-available('unparsed-entity-uri')">
                <xsl:value-of select="concat(unparsed-entity-uri(''),$obp-boot-root)"/>
            </xsl:when>
            <xsl:otherwise>
                <xsl:value-of select="$obp-boot-root"/>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:variable>
    <xsl:variable name="obp-root-js"    select="concat($obp-root, 'js/')"/>
    <xsl:variable name="obp-js-main"    select="concat($obp-root-js, 'main.js')"/>
    <xsl:variable name="require-js"     select="concat($obp-root-js, 'lib/require-2.1.11.js')"/>

    <xsl:variable name="jquery-js"      select="concat($obp-root-js, 'lib/jquery-2.1.0.min.js')"/>
    <xsl:variable name="bootstrap-js"   select="concat($obp-root-js, 'lib/bootstrap-3.1.1.min.js')"/>
    <xsl:variable name="offcanvas-js"   select="concat($obp-root-js, 'lib/bootstrap-offcanvas-3.1.0.js')"/>

    <xsl:variable name="saxon-nocache-prod"  select="'js/lib/saxon-ce/1.1/Saxonce.nocache.js'"/>
    <xsl:variable name="saxon-nocache-debug" select="'js/lib/saxon-ce/1.1/debug/Saxonce.nocache.js'"/>

    <!-- IE-only dependencies -->
    <xsl:variable name="html5shiv-js"      select="concat($obp-root, 'js/lib/html5shiv-3.7.0.min.js')"/>
    <xsl:variable name="respond-js"        select="concat($obp-root, 'js/lib/respond-1.4.2.min.js')"/>

    <xsl:variable name="openbibl-js"       select="concat($obp-root, 'js/openbibl/main.js')"/>

    <!-- TODO: parameterize debug status -->
    <xsl:variable name="saxon-nocache"         select="concat($obp-root, $saxon-nocache-prod)"/>
    <!-- /TODO -->

    <!-- TODO: parameters; values to be externalized -->
    <xsl:variable name="openbibl-default-theme-css"   select="concat($obp-root, 'css/theme/clean.css')"/>
    <obp:css-themes>
        <option value="clean.css"   label="Clean">Clean</option>
        <option value="bookish.css" label="Bookish">Bookish</option>
        <option value="fiche.css"   label="Fiche">Fiche</option>
    </obp:css-themes>
    <!-- /TODO -->

    <!-- TODO: parameterise in config file -->
    <xsl:variable name="openbibl-xsl"                 select="concat($obp-root, 'xsl/openbibl.xsl')"/>
    <xsl:variable name="openbibl-css"                 select="concat($obp-root, 'css/openbibl.css')"/>
    <xsl:variable name="bootstrap-css"     select="concat($obp-root, 'css/lib/bootstrap.css')"/>
    <xsl:variable name="navmenu-css"       select="concat($obp-root, 'css/lib/navmenu.css')"/>
    <!-- /TODO -->




</xsl:stylesheet>