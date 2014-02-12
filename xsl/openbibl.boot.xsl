<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:tei="http://www.tei-c.org/ns/1.0"
    xmlns:obp="http://openbibl.github.io"
    exclude-result-prefixes="tei obp"
    version="1.0">

    <!-- for HTML5:
        doctype-public="html"
        doctype-system="about:legacy-compat"
    -->
    <xsl:output
        method="html"
        encoding="utf-8"
        indent="yes"/>

    <xsl:preserve-space elements="*"/>

    <!-- TODO: parameters; values to be externalized -->
    <xsl:param name="obp-root"            select="'../../'"/>
    <xsl:param name="saxon-nocache-prod"  select="'js/lib/saxon-ce/1.1/Saxonce.nocache.js'"/>
    <xsl:param name="saxon-nocache-debug" select="'js/lib/saxon-ce/1.1/debug/Saxonce.nocache.js'"/>
    <xsl:param name="saxon-nocache"       select="concat($obp-root, $saxon-nocache-prod)"/>

    <xsl:param name="jquery-js-src"        select="concat($obp-root, 'js/lib/jquery/1.10.2/jquery.min.js')"/>
    <xsl:param name="openbibl-js-src"      select="concat($obp-root, 'js/openbibl.js')"/>
    <xsl:param name="openbibl-js-saxon"    select="concat($obp-root, 'js/openbibl.saxon.js')"/>

    <xsl:param name="openbibl-xsl"                 select="concat($obp-root, 'xsl/openbibl.xsl')"/>
    <xsl:param name="openbibl-css"                 select="concat($obp-root, 'css/openbibl.css')"/>
    <xsl:param name="openbibl-default-theme-css"   select="concat($obp-root, 'css/theme/clean.css')"/>
    <xsl:param name="openbibl-default-theme-label" select="concat($obp-root, 'Clean')"/>
    <obp:css-themes>
        <option value="clean.css"   label="Clean" selected="selected">Clean</option>
        <option value="bookish.css" label="Bookish">Bookish</option>
        <option value="fiche.css"   label="Fiche">Fiche</option>
    </obp:css-themes>

    <xsl:template match="/">
        <html xmlns="http://www.w3.org/1999/xhtml">
            <head>
               <xsl:call-template name="head-content"/>
            </head>
            <body>
                <xsl:call-template name="body-content"/>
            </body>
        </html>
    </xsl:template>

    <!-- /html/head -->
    <xsl:template name="head-content">
        <meta charset="UTF-8" />
        <link rel="stylesheet" type="text/css" href="{$openbibl-css}" />
        <link rel="stylesheet" type="text/css" id="theme-css" href="{$openbibl-default-theme-css}" />

        <!-- load jquery and obp libs -->
        <script type="text/javascript" language="javascript" src="{$jquery-js-src}"></script>
        <script type="text/javascript" language="javascript" src="{$openbibl-js-src}"></script>

        <!-- load Saxon; declare onload callback for Saxon-CE,
            which loads openbibl xsl-2.0 stylesheet and re-loads XML file -->
        <script type="text/javascript" language="javascript" src="{$saxon-nocache}"></script>
        <script type="text/javascript" language="javascript">
            var onSaxonLoad = function() {
                window.obp.onSaxonLoad(
                    Saxon,                                      // pass reference to avoid scoping issues
                    '<xsl:value-of select="$openbibl-xsl"/>',   // openbibl.xsl stylesheet path
                    document.location.href,                     // TEI XML document path
                    {}                                          // openbibl.xsl stylesheet parameters
                );
            }
        </script>

        <!-- page title, from TEI document -->
        <title>
            <xsl:value-of select="/tei:TEI/tei:teiHeader/tei:fileDesc/tei:titleStmt/tei:title"/>
        </title>
    </xsl:template>

    <!-- /html/body -->
    <xsl:template name="body-content">

        <!-- search/browse menu (left of bibl) -->
        <div id="control">

            <!-- theme -->
            <form id="theme-form" class="theme">
                <label class="theme">Theme</label>
                <select id="theme-form-select">
                    <xsl:for-each select="document('')/*/obp:css-themes/option">
                        <xsl:element name="option">
                            <xsl:attribute name="value"><xsl:value-of select="@value"/></xsl:attribute>
                            <xsl:attribute name="label"><xsl:value-of select="@label"/></xsl:attribute>
                            <xsl:if test="@selected = 'selected'">
                                <xsl:attribute name="selected">
                                    <xsl:text>selected</xsl:text>
                                </xsl:attribute>
                            </xsl:if>
                            <xsl:value-of select="@label"/>
                        </xsl:element>
                    </xsl:for-each>
                </select>
            </form>

            <!-- search -->
            <form id="search-form" class="search">
                <input id="search-input" type="search" class="search" placeholder="Search" />
            </form>

            <!-- browse -->
            <div id="browse" class="browse">
                <header class="browse">Browse</header>
                <ul class="browse">
                    <li class="browse" id="browse-people">People</li>
                    <li class="browse" id="browse-places">Places</li>
                    <li class="browse" id="browse-dates">Dates</li>
                </ul>
            </div>

        </div>

        <!-- bibliographies -->
        <div id="bibliographies" class="bibliographies">

            <!-- footer: <publicationStmt> -->
            <div id="footer">
                <span>
                    <xsl:value-of select="//tei:publicationStmt/tei:date"/>,&#x0020;
                    <xsl:if test="//tei:publicationStmt/tei:authority != ''">
                        <xsl:value-of select="//tei:publicationStmt/tei:authority"/>,&#x0020;
                    </xsl:if>
                    <xsl:value-of select="//tei:publicationStmt/tei:pubPlace"/>
                </span>
                |
                <span>Published using the Open &lt;bibl&gt; Project</span>
            </div>

        </div>

    </xsl:template>

</xsl:stylesheet>
