<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:tei="http://www.tei-c.org/ns/1.0"
    xmlns:obp="http://openbibl.github.io"
    xmlns:schema="http://schema.org"
    exclude-result-prefixes="tei obp"
    version="1.0">

    <xsl:output
        doctype-public="html"
        doctype-system="about:legacy-compat"
        method="html"
        encoding="utf-8"
        indent="yes"/>
    <xsl:preserve-space elements="*"/>

    <xsl:include href="openbibl.params.xsl"/>
    <xsl:include href="openbibl.date.xsl"/>

    <!-- TODO: debug "document('openbibl.params.xsl)/*/obp:css-themes" issue
        unless it is resolved by externalizing params (probably
               not due to node-set portability issues in XSLT 1.0)
    -->
    <obp:css-themes>
        <option value="clean.css"   label="Clean">Clean</option>
        <option value="bookish.css" label="Bookish">Bookish</option>
        <option value="fiche.css"   label="Fiche">Fiche</option>
    </obp:css-themes>

    <xsl:template match="/">
        <html lang="en">
            <head>
                <xsl:call-template name="head-content"/>
            </head>
            <body>
                <xsl:call-template name="body-content"/>
                <xsl:call-template name="script-content"/>
            </body>
        </html>
    </xsl:template>

    <!-- /html/head -->
    <xsl:template name="head-content">
        <meta charset="utf-8"></meta>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"></meta>
        <meta name="description" content="openbibl bibliography"></meta>
        <meta name="author" content="TEI author"></meta>
        <!-- TODO: icon -->
        <link rel="shortcut icon" href="assets/ico/favicon.png"></link>
        <link rel="stylesheet" type="text/css" id="theme-css" href="{$openbibl-default-theme-css}" />

        <!-- page title, from TEI document -->
        <xsl:apply-templates select="/tei:TEI/tei:teiHeader/tei:fileDesc/tei:titleStmt/tei:title"/>
    </xsl:template>

    <xsl:template name="script-content">

        <!-- html5 for IE -->
        <xsl:comment>
            <xsl:text>[if lt IE 9]&lt;</xsl:text>
            <script type="text/javascript" language="javascript" src="{$html5shiv-js}"></script>
            <script type="text/javascript" language="javascript" src="{$respond-js}"></script>
            <xsl:text>&gt;![endif]</xsl:text>
        </xsl:comment>

        <!-- load jQuery before OBP javascript, all other after -->
        <script type="text/javascript" language="javascript" src="{$jquery-js}"></script>

        <!-- TODO: xsl:if on debug state to use minified or maxified -->
        <xsl:choose>
            <xsl:when test="false()">
                <script type="text/javascript" language="javascript" src="{$openbibl-js-min}"></script>
            </xsl:when>
            <xsl:otherwise>
                <script type="text/javascript" language="javascript" src="{$openbibl-js-cls}"></script>
                <script type="text/javascript" language="javascript" src="{$openbibl-js-sort}"></script>
                <script type="text/javascript" language="javascript" src="{$openbibl-js-theme}"></script>
                <script type="text/javascript" language="javascript" src="{$openbibl-js-util}"></script>
                <script type="text/javascript" language="javascript" src="{$openbibl-js-filter}"></script>
                <script type="text/javascript" language="javascript" src="{$openbibl-js-storage}"></script>
                <script type="text/javascript" language="javascript" src="{$openbibl-js-highlight}"></script>
                <script type="text/javascript" language="javascript" src="{$openbibl-js-search}"></script>
                <script type="text/javascript" language="javascript" src="{$openbibl-js-browse}"></script>
                <script type="text/javascript" language="javascript" src="{$openbibl-js-query}"></script>
                <script type="text/javascript" language="javascript" src="{$openbibl-js-download}"></script>
                <script type="text/javascript" language="javascript" src="{$openbibl-js-toc}"></script>
            </xsl:otherwise>
        </xsl:choose>

        <script id="obp-saxonce-lib" type="text/javascript" language="javascript" src="{$openbibl-js-saxon}"></script>
        <!-- load Saxon; declare onload callback for Saxon-CE,
            which loads openbibl xsl-2.0 stylesheet and re-loads XML file -->
        <script id="obp-saxonce-nocache" type="text/javascript" language="javascript" src="{$saxon-nocache}"></script>
        <script id="obp-saxonce-onload" type="text/javascript" language="javascript">
            var onSaxonLoad = function() {
                window.obp.bibliographies.xml = document.location.href;
                window.obp.bibliographies.xsl ='<xsl:value-of select="$openbibl-xsl"/>';
                window.obp.SaxonCE.onSaxonLoad(
                    Saxon,                          // pass reference to Saxon object to avoid scoping issues
                    window.obp.bibliographies.xsl,  // openbibl.xsl stylesheet path
                    window.obp.bibliographies.xml,  // TEI XML document path
                    {}                              // openbibl.xsl stylesheet parameters
                );
            }
        </script>
        <script type="text/javascript" language="javascript" src="{$bootstrap-js}"></script>
        <script type="text/javascript" language="javascript" src="{$offcanvas-js}"></script>
        <script type="text/javascript" language="javascript" src="{$cookie-js}"></script>
        <script type="text/javascript" language="javascript" src="{$typeahead-js}"></script>
        <script type="text/javascript" language="javascript" src="{$underscore-js}"></script>
        <script type="text/javascript" language="javascript" src="{$handlebars-js}"></script>
        <script type="text/javascript" language="javascript" src="{$filesaver-js}"></script>
    </xsl:template>

    <!-- /html/body -->
    <xsl:template name="body-content">

        <div id="obp-sidebar-offcanvas-sm" class="navmenu navmenu-default navmenu-fixed-left-offcanvas">
            <xsl:call-template name="make-navmenu"/>
        </div>

        <div class="container">
            <nav class="navbar navbar-default navbar-collapse navbar-fixed-top">
                <div class="visible-sm visible-xs">
                    <button type="button"
                            class="navbar-toggle"
                            data-autohide="true"
                            data-canvas="body"
                            data-recalc="true"
                            data-target="#obp-sidebar-offcanvas-sm"
                            data-toggle="offcanvas">
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                    </button>
                </div>
            </nav>

            <div class="visible-md visible-lg">
                <nav class="navmenu navmenu-default navmenu-fixed-left" role="navigation">
                    <xsl:call-template name="make-navmenu"/>
                </nav>
            </div>

            <div itemscope="itemscope" itemtype="http://schema.org/CreativeWork">
                <xsl:call-template name="bibliographies"/>
            </div>

        </div>

    </xsl:template>

    <xsl:template name="make-navmenu">
        <ul class="nav navmenu-nav">
            <li><a class="brand" href="#">Openbibl</a></li>
            <!-- save button -->
            <li>
                <a href="#" class="obp-download-page">Download</a>
            </li>
            <!-- theme menu -->
            <li>
                <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                    Theme <b class="caret"></b>
                </a>
                <ul class="dropdown-menu">
                    <xsl:call-template name="make-theme-menu"/>
                </ul>
            </li>
            <!-- sort manu -->
            <li>
                <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                    Sort<b class="caret"></b>
                </a>
                <ul class="dropdown-menu">
                    <xsl:call-template name="make-sort-menu"/>
                </ul>
            </li>
            <!-- search menu -->
            <li>
                <div class="panel panel-default obp-search-panel">
                    <div class="panel-heading">
                        <a data-toggle="collapse" data-target=".obp-search-toggle">
                            Search<b class="caret"></b>
                        </a>
                    </div>
                    <div class="panel-collapse collapse obp-search-toggle">
                        <div class="panel-body">
                            <xsl:call-template name="make-search-results"/>
                        </div>
                    </div>
                </div>
            </li>
            <!-- browse menus -->
            <xsl:for-each select="//tei:back/tei:div[@type='editorial']/*">
                <!-- @id to use for toggling the panel retraction -->
                <xsl:variable name="toggle-class" select="generate-id(.)"/>
                <li>
                    <div class="panel panel-default obp-browse-list" data-ed-list="{name(.)}">
                        <div class="panel-heading">
                            <a data-toggle="collapse" data-target=".{$toggle-class}">
                                <xsl:value-of select="tei:head"/>
                                <b class="caret"></b>
                            </a>
                        </div>
                        <div class="panel-collapse collapse {$toggle-class}">
                            <div class="panel-body">
                                <xsl:call-template name="make-browse-results"/>
                            </div>
                        </div>
                    </div>
                </li>
            </xsl:for-each>
        </ul>
    </xsl:template>

    <!-- pass schema.org attributes through -->
    <xsl:template match="@*[namespace-uri() = 'http://schema.org']">
        <xsl:attribute name="{local-name(.)}">
            <xsl:value-of select="."/>
        </xsl:attribute>
    </xsl:template>

    <!-- default handler for element nodes, which enables @schema:* atts
         to be processed
    -->
    <xsl:template match="*">
        <span>
            <xsl:apply-templates select="@*|node()"/>
        </span>
    </xsl:template>

    <xsl:template match="/tei:TEI/tei:teiHeader/tei:fileDesc/tei:titleStmt/tei:title">
        <title>
            <xsl:apply-templates select="@*|node()"/>
        </title>
    </xsl:template>

    <!-- suppress <back>, which is handled later -->
    <xsl:template match="//tei:back//*"/>

    <!-- primary content container for bibliography entries -->
    <xsl:template name="bibliographies">

        <!-- target for div[@entry] items-->
        <div id="bibliographies" class="bibliographies">
            <h1 class="bibliographies">
                <xsl:value-of select="//tei:titleStmt/tei:title"/>
            </h1>
            <hr id="asterism-rule" />
            <div id="asterism"></div>

            <!-- TOC -->
            <ul id="toc" class="toc">
                <xsl:apply-templates select="//*" mode="toc"/>
            </ul>
        </div>

       <!-- publication statement -->
       <xsl:call-template name="make-footer"/>

    </xsl:template>

    <!-- handle a tei:div[@type='entry']/tei:head element for the TOC -->
    <xsl:template match="tei:head[parent::tei:div[@type='entry']]" mode="toc" priority="1">

        <xsl:variable name="div-index" select="count(preceding::tei:div[@type='entry'])"/>

        <li class="toc" data-src-index="{$div-index}">
            <span class="leader">
                <a class="toc-click" data-src-index="{$div-index}">
                    <xsl:value-of select="."/>
                </a>
            </span>
            <span>
                <xsl:choose>
                    <xsl:when test="string-length(parent::tei:div/tei:biblStruct/tei:monogr/tei:author) != 0">
                        <xsl:value-of select="parent::tei:div/tei:biblStruct/tei:monogr/tei:author"/>
                    </xsl:when>
                    <xsl:otherwise>
                        <!-- TODO: externalize/localize string -->
                        <xsl:value-of select="'[UNKNOWN]'"/>
                    </xsl:otherwise>
                </xsl:choose>
            </span>
        </li>
    </xsl:template>
    <xsl:template match="node()" mode="toc" priority="0"/>

    <!-- publication statement following bibliographies -->
    <xsl:template name="make-footer">

        <xsl:variable name="author" select="//tei:teiHeader//tei:titleStmt/tei:author/tei:persName"/>
        <xsl:variable name="date"   select="//tei:teiHeader/tei:fileDesc/tei:publicationStmt/tei:date"/>
        <xsl:variable name="place"  select="//tei:teiHeader/tei:fileDesc/tei:publicationStmt/tei:pubPlace"/>

        <div id="footer">
            <span>
                <!-- output publication info in this order, and follow any non-empty item with a comma -->
                <xsl:for-each select="$author | $date | $place">
                    <xsl:if test="string-length(.) &gt; 0 ">
                        <xsl:value-of select="."/>
                        <xsl:if test="not(position() = last())">
                            <xsl:text>, </xsl:text>
                        </xsl:if>
                    </xsl:if>
                </xsl:for-each>
            </span>
            <xsl:text> | </xsl:text>
            <span>Published using the Open &lt;bibl&gt; Project</span>
        </div>
    </xsl:template>

    <!-- make the dropdown menu containing options for visual styles -->
    <xsl:template name="make-theme-menu">
        <!-- TODO: make into external parameters -->
        <xsl:for-each select="document('')/*/obp:css-themes/option">
            <li>
                <a href="#" onclick="javascript:window.obp.change_theme('{@value}')">
                    <xsl:value-of select="@label"/>
                </a>
            </li>
        </xsl:for-each>
    </xsl:template>

    <!-- make sort-by options -->
    <xsl:template name="make-sort-menu">
        <li>
            <a href="#" class="obp-sort-anchor" data-sort-key="data-author">Author</a>
        </li>
        <li>
            <a href="#" class="obp-sort-anchor" data-sort-key="data-date">Date</a>
        </li>
    </xsl:template>

    <!-- collapsable panel containing the search-term input and results -->
    <xsl:template name="make-search-results">

        <!-- filter any/ filter all -->
        <xsl:call-template name="filter-options">
            <xsl:with-param name="button-class" select="'obp-search-clear'"/>
        </xsl:call-template>

        <div class="nav-form">
            <form class="obp-search-form">
                <input
                    autocomplete="off"
                    class="search-input typeahead obp-search-panel-input"
                    data-provide="typeahead"
                    placeholder="Search"
                    spellcheck="false"
                    type="text"></input>
            </form>
        </div>
        <ul class="list-group obp-search-results-list"></ul>
    </xsl:template>

    <xsl:template name="make-browse-results">
        <!-- filter any/ filter all -->
        <xsl:call-template name="filter-options">
            <xsl:with-param name="button-class" select="'obp-browse-clear'"/>
        </xsl:call-template>

        <div class="obp-browse-panel-body">

        <xsl:for-each select="tei:head/following-sibling::*">

            <!-- NOTE: arbitrary @xml:id depth -->
            <xsl:variable name="xml-id" select=".//@xml:id"/>
            <xsl:variable name="ref-count" select="count(//@ref[.=concat('#',$xml-id)])"/>

            <div class="checkbox">
                <label>
                    <input type="checkbox" class="obp-browse-checkbox" data-browse-item="{$xml-id}">
                        <xsl:if test="$ref-count = 0">
                            <xsl:attribute name="disabled">disabled</xsl:attribute>
                        </xsl:if>
                    </input>
                    <xsl:text>&#x00A0;</xsl:text>
                    <span class="obp-browse-item">
                        <xsl:apply-templates select="." mode="browse-title"/>
                    </span>
                </label>
            </div>
        </xsl:for-each>
        </div>
    </xsl:template>

    <xsl:template name="filter-options">
        <xsl:param name="button-class"/>
        <form>
            <label>
                <input
                    class="obp-filter-mode"
                    type="radio"
                    name="{generate-id()}"
                    value="obp-filter-intersection"
                    checked="checked"></input>
                all of
            </label>
            <xsl:text>&#x00A0;</xsl:text>
            <label>
                <input
                    class="obp-filter-mode"
                    type="radio"
                    name="{generate-id()}"
                    value="obp-filter-union"></input>
                any of
            </label>
            <xsl:text>&#x00A0;</xsl:text>
            <button class="{$button-class}">clear</button>
        </form>
    </xsl:template>

    <xsl:template match="tei:person" mode="browse-title">
        <xsl:value-of select="tei:persName"/>
        <xsl:if test="tei:birth | tei:death">
            <xsl:text> (</xsl:text>
            <xsl:apply-templates select="tei:birth" mode="browse-title"/>
            <xsl:text>&#x2013;</xsl:text>
            <xsl:apply-templates select="tei:death" mode="browse-title"/>
            <xsl:text>)</xsl:text>
        </xsl:if>
    </xsl:template>

    <xsl:template match="tei:birth|tei:death" mode="browse-title">
        <xsl:variable name="date">
            <xsl:value-of select="substring(@when,1,4)"/>
        </xsl:variable>
        <xsl:value-of select="$date"/>
    </xsl:template>

    <xsl:template match="tei:place" mode="browse-title">
        <xsl:value-of select="tei:placeName"/>
    </xsl:template>

</xsl:stylesheet>
