<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:tei="http://www.tei-c.org/ns/1.0"
    exclude-result-prefixes="tei"
    version="1.0">

    <xsl:output 
        method="html"
        doctype-public="html"
        doctype-system="about:legacy-compat"
        encoding="utf-8"
        indent="yes"/>

    <xsl:preserve-space elements="*"/>

    <xsl:param name="obp-root"            select="'../..'"/>    
    <xsl:param name="saxon-nocache-prod"  select="'js/saxon-ce/1.1/Saxonce.nocache.js'"/>
    <xsl:param name="saxon-nocache-debug" select="'js/saxon-ce/1.1/debug/Saxonce.nocache.js'"/>
    <xsl:param name="saxon-nocache"       select="$saxon-nocache-prod"/>

    <xsl:template match="/">
        <html>
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
        <title><xsl:value-of select="/tei:TEI/tei:teiHeader/tei:fileDesc/tei:titleStmt/tei:title"/></title>

        <xsl:element name="script">
            <xsl:attribute name="type">text/javascript</xsl:attribute>
            <xsl:attribute name="language">javascript</xsl:attribute>
            <xsl:attribute name="src">
                <xsl:value-of select="concat($obp-root,'/',$saxon-nocache)"/>
            </xsl:attribute>
        </xsl:element>

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
                var xsl = Saxon.requestXML(xml_dir + "../../xsl/openbibl.xsl");   // openbibl.xsl 2.0 stylesheet
                var xml = Saxon.requestXML(document.location.href);               // reload the XML file being handled here
                var proc = Saxon.newXSLT20Processor(xsl);
                proc.setSuccess(function(data) {
                    var children = data.getResultDocument().querySelector("#result").childNodes;
                    var bibliographies_wrapper = document.getElementById("bibliographies");
                    for (var i = 0; i < children.length; i++)
                        bibliographies_wrapper.appendChild(children[i].cloneNode(true));
                    //handle_hover();
                });
                proc.transformToDocument(xml);
            }
        </script>
        ]]>
        </xsl:text>
    </xsl:template>

    <xsl:template name="body-content">
        <!--
        <header></header>
        -->
        <!-- about box (left of bibl) -->
        <menu type="toolbar" id="about"></menu>
        
        <!-- search/browse menu (right of bibl) -->
        <menu type="toolbar" id="control">

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
        </menu>

        <!-- bibliographies -->
        <div id="bibliographies" class="bibliographies"></div>

        <!--
        <footer></footer>
        -->
        <script src="../../js/jquery/1.10.2/jquery.min.js"></script>
        <script type="application/javascript" src="../../js/openbibl.js"></script>

    </xsl:template>

</xsl:stylesheet>
