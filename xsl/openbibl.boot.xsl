<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:tei="http://www.tei-c.org/ns/1.0"
    xmlns:obp="http://openbibl.github.io"
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

        <!-- TODO: parameterize IE js -->
        <xsl:text disable-output-escaping="yes"><![CDATA[
                <!--[if lt IE 9]>
        ]]></xsl:text>
        <script type="text/javascript" language="javascript" src="{$html5shiv-js}"></script>
        <script type="text/javascript" language="javascript" src="{$respond-js}"></script>
        <xsl:text disable-output-escaping="yes"><![CDATA[
                <![endif]-->
        ]]></xsl:text>
        <script type="text/javascript" language="javascript" src="{$jquery-js}"></script>
        <script type="text/javascript" language="javascript" src="{$bootstrap-js}"></script>
        <script type="text/javascript" language="javascript" src="{$offcanvas-js}"></script>
        <script type="text/javascript" language="javascript" src="{$typeahead-js}"></script>
        <script type="text/javascript" language="javascript" src="{$cookie-js}"></script>
        <script type="text/javascript" language="javascript" src="{$underscore-js}"></script>
        <script type="text/javascript" language="javascript" src="{$handlebars-js}"></script>

        <!-- TODO: xsl:if on debug state -->
        <script type="text/javascript" language="javascript" src="{$openbibl-js-cls}"></script>
        <script type="text/javascript" language="javascript" src="{$openbibl-js-saxon}"></script>

        <script type="text/javascript" language="javascript" src="{$openbibl-js-sort}"></script>
        <script type="text/javascript" language="javascript" src="{$openbibl-js-theme}"></script>
        <script type="text/javascript" language="javascript" src="{$openbibl-js-util}"></script>
        <script type="text/javascript" language="javascript" src="{$openbibl-js-filter}"></script>
        <script type="text/javascript" language="javascript" src="{$openbibl-js-storage}"></script>
        <script type="text/javascript" language="javascript" src="{$openbibl-js-highlight}"></script>
        <script type="text/javascript" language="javascript" src="{$openbibl-js-search}"></script>
        <script type="text/javascript" language="javascript" src="{$openbibl-js-browse}"></script>
        <script type="text/javascript" language="javascript" src="{$openbibl-js-query}"></script>

        <link rel="stylesheet" type="text/css" id="theme-css" href="{$openbibl-default-theme-css}" />

        <!-- load Saxon; declare onload callback for Saxon-CE,
            which loads openbibl xsl-2.0 stylesheet and re-loads XML file -->
        <script type="text/javascript" language="javascript" src="{$saxon-nocache}"></script>
        <script type="text/javascript" language="javascript">
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

        <!-- page title, from TEI document -->
        <title>
            <xsl:value-of select="/tei:TEI/tei:teiHeader/tei:fileDesc/tei:titleStmt/tei:title"/>
        </title>

    </xsl:template>

    <!-- /html/body -->
    <xsl:template name="body-content">
        <nav class="navbar navbar-default navbar-collapse navbar-fixed-top">

            <!-- toggle button for small screen menu -->
            <button id="navbar-navmenu-toggle" type="button" class="navbar-toggle visible-sm visible-xs" data-toggle="offcanvas" data-target="#obp-navbar-small">
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
        </nav>

        <div class="container">
            <div class="visible-md visible-lg">
                <nav class="navmenu navmenu-default navmenu-fixed-left" role="navigation">
                    <xsl:call-template name="make-navmenu">
                        <xsl:with-param name="menu" select="'l'"/>
                    </xsl:call-template>
                </nav>
            </div>
            <div class="visible-sm visible-xs">
                <nav id="obp-navbar-small" class="navmenu navmenu-default navmenu-fixed-left offcanvas" role="navigation">
                    <xsl:call-template name="make-navmenu">
                        <xsl:with-param name="menu" select="'s'"/>
                    </xsl:call-template>
                </nav>
            </div>
            <xsl:call-template name="bibliographies"/>
        </div>
    </xsl:template>

    <!-- suppress <back>, which is handled later -->
    <xsl:template match="//tei:back//*"/>

    <!-- make navmenu for all size screens -->
    <xsl:template name="make-navmenu">
        <xsl:param name="menu"/>
        <ul class="nav navmenu-nav">
            <li><a class="brand" href="#">Openbibl</a></li>
            <xsl:call-template name="make-theme-menu"/>
            <xsl:call-template name="make-sort-menu"/>
            <xsl:call-template name="make-search-results">
                <xsl:with-param name="menu" select="$menu"/>
            </xsl:call-template>
            <xsl:call-template name="make-browse-results">
                <xsl:with-param name="menu" select="$menu"/>
            </xsl:call-template>
        </ul>
    </xsl:template>

    <!-- primary content container for bibliography entries -->
    <xsl:template name="bibliographies">

        <!-- target for div[@entry] items-->
        <div id="bibliographies" class="bibliographies">
            <h1 class="bibliographies">
                <xsl:value-of select="//tei:titleStmt/tei:title"/>
            </h1>
            <hr id="asterism-rule" />
            <div id="asterism"></div>

            <!-- content placeholder -->
            <div id="bibliography-placeholder"></div>
        </div>

       <!-- publication statement -->
       <xsl:call-template name="make-footer"/>

    </xsl:template>

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
        <li>
            <a href="#" class="dropdown-toggle" data-toggle="dropdown">Theme <b class="caret"></b></a>
            <ul class="dropdown-menu">

                <!-- TODO: make into external parameters -->
                <xsl:for-each select="document('')/*/obp:css-themes/option">
                    <li>
                        <a href="#" onclick="javascript:window.obp.change_theme('{@value}')">
                            <xsl:value-of select="@label"/>
                        </a>
                    </li>
                </xsl:for-each>
            </ul>
        </li>
    </xsl:template>

    <!-- make sort-by options -->
    <xsl:template name="make-sort-menu">
        <li>
            <a href="#" class="dropdown-toggle" data-toggle="dropdown">Sort<b class="caret"></b></a>
            <ul class="dropdown-menu">
                <li>
                    <a href="#" class="obp-sort-anchor" data-sort-key="data-author">Author</a>
                </li>
                <li>
                    <a href="#" class="obp-sort-anchor" data-sort-key="data-date">Date</a>
                </li>

            </ul>
        </li>

    </xsl:template>

    <!-- collapsable panel containing the search-term input and results -->
    <xsl:template name="make-search-results">
        <xsl:param name="menu"/>
        <xsl:variable name="panel-id" select="concat($menu,generate-id())"/>
        <li>
            <!-- search results -->
            <div class="panel panel-default obp-search-panel">
                <div class="panel-heading">
                    <a data-toggle="collapse" href="#{$panel-id}">
                        Search<b class="caret"></b>
                    </a>
                </div>
                <div id="{$panel-id}" class="panel-collapse collapse obp-search">
                    <div class="panel-body">

                        <!-- filter any/ filter all -->
                        <xsl:call-template name="filter-options"/>

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
                    </div>
                </div>
            </div>
        </li>
    </xsl:template>

    <xsl:template name="make-browse-results">
        <xsl:param name="menu"/>
        <xsl:for-each select="//tei:back/tei:div[@type='editorial']/*">

            <!-- @id to use for toggling the panel retraction -->
            <xsl:variable name="id" select="concat($menu,generate-id(.))"/>
            <li>
                <div class="panel panel-default obp-browse-list" data-ed-list="{name(.)}">
                    <div class="panel-heading">
                        <a data-toggle="collapse" href="#{$id}">
                            <xsl:value-of select="tei:head"/>
                            <b class="caret"></b>
                        </a>
                    </div>

                    <div id="{$id}" class="panel-collapse collapse">
                        <div class="panel-body">

                            <!-- filter any/ filter all -->
                            <xsl:call-template name="filter-options"/>

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
                    </div>
                </div>
            </li>
        </xsl:for-each>
    </xsl:template>

    <xsl:template name="filter-options">
        <form>
            <label>
                <input
                    class="obp-filter-mode"
                    type="radio"
                    name="generate-id()"
                    value="obp-filter-intersection"
                    checked="checked"></input>
                all of
            </label>
            <xsl:text>&#x00A0;</xsl:text>
            <label>
                <input
                    class="obp-filter-mode"
                    type="radio"
                    name="generate-id()"
                    value="obp-filter-union"></input>
                any of
            </label>
            <xsl:text>&#x00A0;</xsl:text>
            <button class="obp-filter-clear">clear</button>
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
