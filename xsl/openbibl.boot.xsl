<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:tei="http://www.tei-c.org/ns/1.0"
    exclude-result-prefixes="tei"
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

    <xsl:param name="obp-root"            select="'../..'"/>    
    <xsl:param name="saxon-nocache-prod"  select="'js/saxon-ce/1.1/Saxonce.nocache.js'"/>
    <xsl:param name="saxon-nocache-debug" select="'js/saxon-ce/1.1/debug/Saxonce.nocache.js'"/>
    <xsl:param name="saxon-nocache"       select="$saxon-nocache-prod"/>
    
    <xsl:param name="jquery-js-src" select="'../../js/jquery/1.10.2/jquery.min.js'"/>
    <xsl:param name="openbibl-js-src" select="'../../js/openbibl.js'"/>

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

    <xsl:template name="head-content">
        <meta charset="UTF-8" />
        <link rel="stylesheet" type="text/css" href="../../css/openbibl.css" />
        <link rel="stylesheet" type="text/css" id="theme-css" href="../../css/theme/default.css" />
        
        <title>
            <xsl:value-of select="/tei:TEI/tei:teiHeader/tei:fileDesc/tei:titleStmt/tei:title"/>
        </title>

        <xsl:call-template name="js-script-elt">
            <xsl:with-param name="source" select="concat($obp-root,'/',$saxon-nocache)"/>
        </xsl:call-template>

        <!-- onload callback for Saxon-CE, which loads openbibl xsl-2.0 stylesheet and re-loads XML file -->
        <xsl:text disable-output-escaping="yes" xml:space="preserve">
        <![CDATA[
        <script type="text/javascript" language="javascript">
        
            function handle_hover() {
                // add event handler for 'hover' for the <head>
                // and <biblStruct> elements, to unhide/expand 
                // the content for the following elements
                $(document).find('div.expand').each(function() {
                    var $expanded = $(this);
                    var $collapsed = $expanded.next('.collapse');
                    /*
                    if ( $collapsed.length ) {
                        var collapsed_height = $collapsed.height();
                        $expanded.hover(
                            function (e) {
                                $collapsed.animate({
                                    height: "100%"
                                }, 150, "swing"
                           )},
                           function(e) {
                                $collapsed.animate({
                                    height: collapsed_height
                                }, 150, "swing"
                           )}
                       );
                    }
                    */
                });
            }
        
            var xml_dir = document.location.href.replace(/[^\/]+$/, ""); // directory containing xml file, with trailing /
            function onSaxonLoad() {
            debugger;
                var xsl = Saxon.requestXML(xml_dir + "../../xsl/openbibl.xsl");   // openbibl.xsl 2.0 stylesheet
                var xml = Saxon.requestXML(document.location.href);               // reload the XML file being handled here
                var proc = Saxon.newXSLT20Processor(xsl);
                proc.setSuccess(function(data) {
                    var children = data.getResultDocument().querySelector("#result").childNodes;
                    var bibliographies_wrapper = document.getElementById("bibliographies");
                    var footer = document.getElementById("footer");
                    for (var i = 0; i < children.length; i++)
                        bibliographies_wrapper.insertBefore(children[i].cloneNode(true),footer);
                    //handle_hover();
                });
                proc.transformToDocument(xml);
            }
        </script>
        ]]>
        </xsl:text>
    </xsl:template>

    <xsl:template name="body-content">
        
        <!-- header 
        <header id="#header">
            <xsl:value-of select="//tei:"/>
        </header>
        -->

        <!-- search/browse menu (left of bibl) -->
        <div id="control">

            <!-- theme -->
            <form id="theme-form" class="theme">
                <label class="theme">Theme</label>
                <select id="theme-form-select">
                    <option value="default.css" label="Default">Default</option>
                    <option value="lightOnDark.css" label="Light on Dark">Light on Dark</option>
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
            
            <!--
            <div id="save">
                <button name="save" id="save-button">Save</button>
                <select id="">
                    <option value="TXT" label="TXT">HTML</option>
                    <option value="PDF" label="PDF">PDF</option>
                    <option value="TXT" label="TXT">TXT</option>
                </select>
            </div>
            -->
        </div>

        <!-- bibliographies -->
        <div id="bibliographies" class="bibliographies">

            <!-- footer: <publicationStmt> -->
            <div id="footer">
                <span>
                    <xsl:value-of select="//tei:publicationStmt/tei:date"/>,&#x0020;
                    <xsl:value-of select="//tei:publicationStmt/tei:authority"/>,&#x0020;
                    <xsl:value-of select="//tei:publicationStmt/tei:pubPlace"/>
                </span>
                |
                <span>Published using the Open &lt;bibl&gt; Project</span>
            </div>

        </div>

                
        <xsl:call-template name="js-script-elt">
            <xsl:with-param name="source" select="$jquery-js-src"/>
        </xsl:call-template>
        <xsl:call-template name="js-script-elt">
            <xsl:with-param name="source" select="$openbibl-js-src"/>
        </xsl:call-template>
        
    </xsl:template>

    <xsl:template name="js-script-elt">
        <xsl:param name="source"/>
        <xsl:element name="script">
            <xsl:attribute name="type">text/javascript</xsl:attribute>
            <xsl:attribute name="language">javascript</xsl:attribute>
            <xsl:attribute name="src">
                <xsl:value-of select="$source"/>
            </xsl:attribute>
        </xsl:element>
    </xsl:template>

</xsl:stylesheet>
