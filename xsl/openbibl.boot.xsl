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

    <!-- TODO: parameters; values to be externalized -->
    <xsl:param name="obp-root"            select="'../../'"/>
    <xsl:param name="saxon-nocache-prod"  select="'js/lib/saxon-ce/1.1/Saxonce.nocache.js'"/>
    <xsl:param name="saxon-nocache-debug" select="'js/lib/saxon-ce/1.1/debug/Saxonce.nocache.js'"/>
    <xsl:param name="saxon-nocache"       select="concat($obp-root, $saxon-nocache-prod)"/>

    <xsl:param name="jquery-js"         select="concat($obp-root, 'js/lib/jquery-1.10.2.min.js')"/>
    <xsl:param name="bootstrap-js"      select="concat($obp-root, 'js/lib/bootstrap-3.0.1.min.js')"/>
    <xsl:param name="offcanvas-js"      select="concat($obp-root, 'js/lib/bootstrap-offcanvas-3.0.0.js')"/>
    <xsl:param name="typeahead-js"      select="concat($obp-root, 'js/lib/bootstrap-typeahead-2.3.2.js')"/>
    
    <xsl:param name="bootstrap-css"     select="concat($obp-root, 'css/lib/bootstrap.css')"/>
    <xsl:param name="navmenu-css"       select="concat($obp-root, 'css/lib/navmenu.css')"/>
    
    <xsl:param name="openbibl-js-cls"      select="concat($obp-root, 'js/openbibl.js')"/>
    <xsl:param name="openbibl-js-dr"       select="concat($obp-root, 'js/openbibl.docready.js')"/>
    <xsl:param name="openbibl-js-saxon"    select="concat($obp-root, 'js/openbibl.saxon.js')"/>

    <xsl:param name="openbibl-xsl"                 select="concat($obp-root, 'xsl/openbibl.xsl')"/>
    <xsl:param name="openbibl-css"                 select="concat($obp-root, 'css/openbibl.css')"/>
    <xsl:param name="openbibl-default-theme-css"   select="concat($obp-root, 'css/theme/clean.css')"/>
    <xsl:param name="openbibl-default-theme-label" select="concat($obp-root, 'Clean')"/>
    <obp:css-themes>
        <option value="clean.css"   label="Clean">Clean</option>
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
        <meta charset="utf-8"></meta>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
        <meta name="description" content="openbibl bibliography"></meta>
        <meta name="author" content="TEI author"></meta>
        <!-- TODO: icon -->
        <link rel="shortcut icon" href="assets/ico/favicon.png"></link>
        
        <link href="{$bootstrap-css}" rel="stylesheet"></link>
        <link href="{$navmenu-css}" rel="stylesheet"></link>
        <xsl:text disable-output-escaping="yes">
            <![CDATA[
                <!--[if lt IE 9]>
            ]]>
        </xsl:text>
                <script src="js/lib/html5shiv.js"></script>
                <script src="js/lib/respond.min.js"></script>
        <xsl:text disable-output-escaping="yes">
            <![CDATA[
                <![endif]-->
            ]]>
        </xsl:text>
        <script type="text/javascript" language="javascript" src="{$jquery-js}"></script>
        <script type="text/javascript" language="javascript" src="{$bootstrap-js}"></script>
        <script type="text/javascript" language="javascript" src="{$offcanvas-js}"></script>
        <script type="text/javascript" language="javascript" src="{$typeahead-js}"></script>


        <script type="text/javascript" language="javascript" src="{$openbibl-js-cls}"></script>
        <script type="text/javascript" language="javascript" src="{$openbibl-js-dr}"></script>
        
        <link rel="stylesheet" type="text/css" href="{$openbibl-css}" />
        <link rel="stylesheet" type="text/css" id="theme-css" href="{$openbibl-default-theme-css}" />

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
        <body>
            <xsl:call-template name="menu"/>
            <xsl:call-template name="bibliographies"/>
        </body>
    </xsl:template>

    <!-- sidebar menu -->
    <xsl:template name="menu">
        
        <!-- sidebar menu -->
        <nav id="sidebar-menu" class="navmenu navmenu-default navmenu-fixed-left offcanvas" role="navigation">
            <a class="navmenu-brand" href="#"></a>
            <ul class="nav navmenu-nav">
                <li><a href="#">Openbibl</a></li>
                <li class="dropdown">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown">Theme <b class="caret"></b></a>
                    <ul class="dropdown-menu navmenu-nav">
                        <xsl:for-each select="document('')/*/obp:css-themes/option">
                            <li>
                                <a href="#" onclick="javascript:window.obp.changetheme('{@value}')">
                                    <xsl:value-of select="@label"/>
                                </a>
                            </li>
                        </xsl:for-each>
                    </ul>
                </li>
                <li class="dropdown">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown">Browse <b class="caret"></b></a>
                    <ul class="dropdown-menu navmenu-nav">
                        <li><a href="#">People</a></li>
                        <li><a href="#">Places</a></li>
                        <li><a href="#">Dates</a></li>
                    </ul>
                </li>
                <li class="dropdown">
                    <form class="navbar-form">
                        <input class="search-input" type="text" data-items="2" data-provide="typeahead" autocomplete="off" placeholder="Search" />
                    </form>
                </li> 
            </ul>
        </nav>
        
        <!-- button for sidebar menu -->
        <div class="navbar navbar-default navbar-collapse navbar-fixed-top visible-sm visible-xs visible-md visible-lg">
            <button id="offcanvas-toggle" type="button" class="navbar-toggle visible-md visible-lg" data-toggle="offcanvas" data-target="#sidebar-menu">
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
            <!-- header menu -->
            <nav class="visible-sm visible-xs" role="navigation">
                <ul class="nav navbar-nav">
                    <li><a href="#">Openbibl</a></li>
                    <li class="dropdown">
                        <a href="#" class="dropdown-toggle" data-toggle="dropdown">Theme <b class="caret"></b></a>
                        <ul class="dropdown-menu">
                            <xsl:for-each select="document('')/*/obp:css-themes/option">
                                <li>
                                    <a href="#" onclick="javascript:window.obp.changetheme('{@value}')">
                                    <xsl:value-of select="@label"/>
                                    </a>
                                </li>
                            </xsl:for-each>
                        </ul>
                    </li>
                    <li class="dropdown">
                        <a href="#" class="dropdown-toggle" data-toggle="dropdown">Browse <b class="caret"></b></a>
                        <ul class="dropdown-menu navmenu-nav">
                            <li><a href="#">People</a></li>
                            <li><a href="#">Places</a></li>
                            <li><a href="#">Dates</a></li>
                        </ul>
                    </li>
                    <li>
                        <form class="navbar-form">
                            <input class="search-input" type="text" data-items="2" data-provide="typeahead" autocomplete="off" placeholder="Search" />
                        </form>
                    </li> 
                </ul>
            </nav>
        </div>
    </xsl:template>

    <xsl:template name="bibliographies">
        <div class="container">
            <div id="bibliographies" class="bibliographies">
                <!-- -->
                <div id="footer">
                    <span>2014, University Park, PA</span> | <span>Published using the Open
                        &lt;bibl&gt; Project</span>
                </div>
            </div>
        </div>        
    </xsl:template>

</xsl:stylesheet>
