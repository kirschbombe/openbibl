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
    
    <xsl:include href="openbibl.shared.xsl"/>
    <xsl:include href="openbibl.params.xsl"/>
    <xsl:include href="openbibl.browse.xsl"/>
    
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
        
        <xsl:text disable-output-escaping="yes"><![CDATA[
                <!--[if lt IE 9]>
        ]]></xsl:text>
        <script src="js/lib/html5shiv.js"></script>
        <script src="js/lib/respond.min.js"></script>
        <xsl:text disable-output-escaping="yes"><![CDATA[
                <![endif]-->
        ]]></xsl:text>
        <script type="text/javascript" language="javascript" src="{$jquery-js}"></script>
        <script type="text/javascript" language="javascript" src="{$bootstrap-js}"></script>
        <script type="text/javascript" language="javascript" src="{$offcanvas-js}"></script>
        <script type="text/javascript" language="javascript" src="{$typeahead-js}"></script>
        <script type="text/javascript" language="javascript" src="{$cookie-js}"></script>
        
        <script type="text/javascript" language="javascript" src="{$openbibl-js-cls}"></script>
                
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
            <xsl:call-template name="make-navigation"/>
            <xsl:call-template name="bibliographies"/>
        </body>
    </xsl:template>
    
    <!-- suppress <back>, which is handled later -->
    <xsl:template match="//tei:back//*"/>
    
    <!-- wrapper for responsive navigation framework -->
    <xsl:template name="make-navigation">
        
        <!-- call template to make large sidebar nav -->
        <xsl:call-template name="make-large-nav"/>
        
        <!-- button for sidebar menu -->
        <nav class="navbar navbar-default navbar-collapse navbar-fixed-top visible-sm visible-xs visible-md visible-lg">
            <xsl:call-template name="make-menu-buttons"/>
            <xsl:call-template name="make-small-nav"/>
        </nav>
        
        <!-- make modal dialogs -->
        <xsl:apply-templates select="//tei:back/tei:div[@type='editorial']/*" mode="browse"/>

    </xsl:template>

    <!-- toggle button for nav menus -->
    <xsl:template name="make-menu-buttons">
        <!-- large (offscreen sidebar menu)-->
        <button id="offcanvas-toggle" type="button" class="navbar-toggle visible-md visible-lg" data-toggle="offcanvas" data-target="#sidebar-menu">
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
        </button>
        
        <!-- toggle button for small screen menu -->
        <button id="navbar-navmenu-toggle" type="button" class="navbar-toggle collapsed visible-sm visible-xs" data-toggle="collapse" data-target="#obp-navbar-small">
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
        </button>        
    </xsl:template>

    <!-- make offscreen navmenu -->
    <xsl:template name="make-large-nav">
        <nav id="sidebar-menu" class="navmenu navmenu-default navmenu-fixed-left offcanvas" role="navigation">
            <a class="navmenu-brand" href="#"></a>
            <ul class="nav navmenu-nav">
                <li><a class="brand" href="#">Openbibl</a></li>
                <xsl:call-template name="make-theme-menu"/>
                <xsl:call-template name="make-browse-menu"/>
                <xsl:call-template name="make-search-field"/>
            </ul>
        </nav>
    </xsl:template>

    <!-- navbar <nav>igation for small screens -->
    <xsl:template name="make-small-nav">
        <div class="visible-sm visible-xs">
            <nav id="obp-navbar-small" class="navbar-default navbar-collapse collapse" role="navigation">
                <ul class="nav navbar-nav">
                    <li><a class="brand" href="#">Openbibl</a></li>
                    <xsl:call-template name="make-theme-menu"/>
                    <xsl:call-template name="make-browse-menu"/>
                    <xsl:call-template name="make-search-field"/>
                </ul>
            </nav>
        </div>
    </xsl:template>

    <!-- search input field -->
    <xsl:template name="make-search-field">
        <li>
            <form class="navbar-form navbar-left">
                <input class="search-input" type="text" data-items="2" data-provide="typeahead" autocomplete="off" placeholder="Search">
                    <i class="glyphicon glyphicon-search"></i>
                </input>
            </form>
        </li> 
    </xsl:template>

    <!-- primary content container for bibliography entries -->
    <xsl:template name="bibliographies">
        <div class="container">
            
            <!-- target for div[@entry] items-->
            <div id="bibliographies" class="bibliographies">
                <h1 class="bibliographies">
                    <xsl:value-of select="//tei:titleStmt/tei:title"/>
                </h1>
                <hr id="asterism-rule" />
                <div id="asterism"></div>
            </div>
            
            <!-- publication statement following bibliographies -->
            <!-- 
            <span>2014, University Park, PA</span> | <span>Published using the Open
            &lt;bibl&gt; Project</span>
            -->
            <div id="footer">
                <span>2014, University Park, PA</span> | <span>Published using the Open
                    &lt;bibl&gt; Project</span>
            </div>
        </div> 
    </xsl:template>
    
    <!-- make the dropdown menu containing options for visual styles -->
    <xsl:template name="make-theme-menu">
        <li class="dropdown">
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
    
    <!-- make dropdown menu containing items to browse (e.g., people, places) -->
    <xsl:template name="make-browse-menu">
        <li class="dropdown">
            <a href="#" class="dropdown-toggle" data-toggle="dropdown">Browse<b class="caret"></b></a>
            <ul class="dropdown-menu">
                
                <!-- one entry in the browse dropdown menu for each list* in div[@editorial] --> 
                <xsl:for-each select="//tei:back/tei:div[@type='editorial']/*[contains(local-name(.),'list')]">
                    <xsl:variable name="id">
                        <xsl:call-template name="generate-independent-id"/>
                    </xsl:variable>
                    <li>
                        <a href="#" data-toggle="modal" data-target="#{$id}">
                            <xsl:value-of select="tei:head"/>
                        </a>
                    </li>
                </xsl:for-each>
            </ul>
        </li>
    </xsl:template>

</xsl:stylesheet>
