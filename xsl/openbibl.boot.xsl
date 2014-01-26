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

    <xsl:param name="obp-root" select="'../..'"/>    
    <xsl:param name="saxon-nocache" select="'js/saxon-ce/1.1/Saxonce.nocache.js'"/>

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
        <link rel="stylesheet" type="text/css" href="../../css/reset.css" />
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
            var xml_dir = document.location.href.replace(/[^\/]+$/, ""); // directory containing xml file, with trailing /
            function onSaxonLoad() {
                var xsl = Saxon.requestXML(xml_dir + "../../xsl/openbibl.xsl");   // openbibl.xsl 2.0 stylesheet
                var xml = Saxon.requestXML(document.location.href);               // reload the XML file being handled here
                var proc = Saxon.newXSLT20Processor(xsl);
                proc.setSuccess(function(data) {
console.log(data.getResultDocument());
                    var children = data.getResultDocument().querySelector("#result").childNodes;
console.log(children);
                    var bibliographies_wrapper = document.getElementById("bibliographies");
                    console.log("length: " + children.length);
                    for (var i = 0; i < children.length; i++) {
console.log(children.item(i).cloneNode(true));
                        bibliographies_wrapper.appendChild(children[i].cloneNode(true));
                    }
                    console.log(bibliographies_wrapper);
                });
                proc.transformToFragment(xml);
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
        <menu type="toolbar" class="about"></menu>
        <!-- search/browse menu (right of bibl) -->
        <menu type="toolbar" class="search" id="control">

            <!-- theme -->
            <form class="theme">
                <label class="theme">Theme</label>
                <select id="theme-form">
                    <option value="default.css" label="Default"></option>
                    <option value="lightOnDark.css" label="Light on Dark"></option>
                </select>
            </form>

            <!-- search -->
            <form id="search-form" class="search">
                <input id="search-input" type="search" class="search" placeholder="Search" />
            </form>

            <!-- browse -->
            <section class="browse">
                <header>Browse</header>
                <ul class="browse">
                    <li class="browse" id="browse-people">People</li>
                    <li class="browse" id="browse-places">Places</li>
                    <li class="browse" id="browse-dates">Dates</li>
                </ul>
            </section>
        </menu>

        <!-- bibliographies -->
        <section id="bibliographies"></section>

        <!--
        <footer></footer>
        -->
        <script src="../../js/jquery/1.10.2/jquery.min.js"></script>
        <script type="application/javascript" src="../../js/openbibl.js"></script>

    </xsl:template>

</xsl:stylesheet>