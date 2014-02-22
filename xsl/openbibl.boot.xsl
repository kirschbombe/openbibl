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
        
        <!-- TODO: remove once done debugging .less integration
        <link href="{$bootstrap-css}" rel="stylesheet"></link>
        <link href="{$navmenu-css}" rel="stylesheet"></link>
        -->
        
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
                <li><a class="brand" href="#">Openbibl</a></li>
                <xsl:call-template name="make-theme-menu"/>
                <xsl:call-template name="make-browse-menu"/>
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
                    <xsl:call-template name="make-browse-menu"/>
                    <li>
                        <form class="navbar-form">
                            <input class="search-input" type="text" data-items="2" data-provide="typeahead" autocomplete="off" placeholder="Search" />
                        </form>
                    </li> 
                </ul>
            </nav>
        </div>
        
        <!-- make modal dialogs -->
        <xsl:apply-templates select="//tei:back/tei:div[@type='editorial']/*"/>
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
    
    <xsl:template name="make-theme-menu">
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
        
    </xsl:template>
    
    <!-- browse list -->
    <xsl:template name="make-browse-menu">
        <li class="dropdown">
            <a href="#" class="dropdown-toggle" data-toggle="dropdown">Browse<b class="caret"></b></a>
            <ul class="dropdown-menu">
                <xsl:for-each select="//tei:back/tei:div[@type='editorial']/*[contains(local-name(.),'list')]">
                    <xsl:variable name="modal-dialog-id" select="generate-id(.)"/>
                    <li>
                        <a href="#" data-toggle="modal" data-target="{concat('#',$modal-dialog-id)}">
                            <xsl:value-of select="tei:head"/>
                        </a>
                    </li>
                </xsl:for-each>
            </ul>
        </li>
    </xsl:template>
    
    <!-- make modal dialog from listPerson/listPlace/etc -->
    <xsl:template match="//tei:back/tei:div[@type='editorial']/*">
        <xsl:variable name="modal-dialog-id" select="generate-id(.)"/>
        <div class="modal fade" id="{$modal-dialog-id}">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&#x00D7;</button>
                        <h4 class="modal-title" id=""><xsl:value-of select="tei:head"/></h4>
                    </div>
                    
                    <xsl:for-each select="tei:head/following-sibling::*">
                        <xsl:variable name="modal-entry-id" select="concat('modal-',@xml:id)"/>
                        <div class="modal-body">
                            <h4><xsl:apply-templates select="." mode="modal-title"/></h4>
                            <div class="panel-group" id="{$modal-entry-id}">
                                <div class="panel panel-default">
                                    <xsl:call-template name="make-panel-entry">
                                        <xsl:with-param name="dialog-id" select="$modal-dialog-id"/>
                                    </xsl:call-template>
                                </div>
                            </div>
                        </div>
                    </xsl:for-each>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                    </div>

                </div>
            </div>
        </div>
    </xsl:template>
    
    <xsl:template match="tei:person" mode="modal-title">
        <xsl:value-of select="concat(
            tei:persName, ' (', tei:birth/@when, '&#x2013;', tei:death/@when, ')'
           )"/>
    </xsl:template>
    <xsl:template match="tei:place" mode="modal-title">
        <xsl:value-of select="tei:placeName"/>
    </xsl:template>

    <xsl:template name="make-panel-entry">
        <xsl:param name="dialog-id"/>
        <xsl:variable name="xml-id" select="@xml:id"/>
        <xsl:variable name="xml-id-ref" select="concat('#',$xml-id)"/>
        <xsl:for-each select="//tei:div[@type='entry'][descendant::*[@ref=$xml-id-ref]]">
            <xsl:variable name="modal-entry-collapse-id" select="concat(generate-id(tei:head), '-', $xml-id)"/>
            <div class="panel-heading">
                <h5>
                    <a data-toggle="collapse" data-parent="#people-accordion" href="{concat('#',$modal-entry-collapse-id)}">
                        <xsl:value-of select="tei:head"/>
                    </a>
                </h5>
            </div>
            <div id="{$modal-entry-collapse-id}" class="panel-collapse collapse">
                <div class="panel-body">
                    <xsl:variable name="entry-ref-id" select="generate-id(.)"/>
                    <xsl:attribute name="id">
                        <xsl:value-of select="$entry-ref-id"/>
                    </xsl:attribute>
                    <xsl:for-each select="descendant::*[@ref=$xml-id-ref]">
                        <xsl:variable name="elt-with-ref" select="."/>
                        
                        <!-- @id value generated for the target in div@entry -->
                        <xsl:variable name="scroll-target-id">
                            <xsl:call-template name="global-ref-id">
                                <xsl:with-param name="ref-elt" select="."/>
                            </xsl:call-template>
                        </xsl:variable>
                        
                        <!-- list item -->
                        <xsl:element name="p">
                            <!-- context before link -->
                            <xsl:variable name="text-before" select="normalize-space($elt-with-ref/preceding-sibling::node()[1][self::text()])"/>
                            <xsl:variable name="text-after" select="normalize-space($elt-with-ref/following-sibling::node()[1][self::text()])"/>

                            <span class="fade-left">
                                <xsl:value-of select="substring(
                                    $text-before, string-length($text-before)- $context-text-length +1, $context-text-length
                                )"/>
                            </span>
                            
                            <!-- link -->
                            <xsl:element name="a">
                                <!-- onclick handler -->
                                <xsl:attribute name="onclick">
                                    <xsl:text>javascript:window.obp.scroll_to_id('</xsl:text>
                                    <xsl:value-of select="$scroll-target-id"/>
                                    <xsl:text>','</xsl:text>
                                    <xsl:value-of select="$dialog-id"/>
                                    <xsl:text>')</xsl:text>
                                </xsl:attribute>
                                <span class="ref-match"><xsl:value-of select="."/></span>
                            </xsl:element>
                            
                            <!-- context after link -->
                            <span class="fade-right">
                                <xsl:value-of select="substring(
                                    $text-after, 1, $context-text-length
                                )"/>
                            </span>
                            
                        </xsl:element>
                    </xsl:for-each>
                </div>
            </div>
        </xsl:for-each>
    </xsl:template>
    

</xsl:stylesheet>
