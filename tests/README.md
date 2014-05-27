
./xsl
====
 
Current testing scheme for the XSLT 1.0 and 2.0 styelsheets is the
bash script and output located in the ./xsl directory. It requires
an XSLT 2.0 processor and is currently tested using Saxon-HE 9.5.1.5J.

./js
====

The Jasmine 2.0 behavior-driven testing framework is used for testing
the Openbibl Javascript code. The test runner is located in the ./js
directory: SpecRunner.html. Once loaded in a browser, the test runner
will execute the tests specified at ./js/spec/openbibl/*. The listing
below indicates the current level of testing coverage.

Documentation for the Jasmine framework and for the Jasmine/jQuery
plug-in used to test browser events may be found at:

[Jasmine](http://jasmine.github.io/2.0/introduction.html)

[jasmine-jquery](https://github.com/velesin/jasmine-jquery)

Current level of coverage:

```
        js/ 
        ├── main.js
        ├── openbibl
   x    │   ├── browse
        │   │   ├── model.js
        │   │   └── view.js
        │   ├── browse.js
   x    │   ├── config.js
   /    │   ├── download.js
   x    │   ├── event.js
        │   ├── filter.js
        │   ├── highlight.js
        │   ├── query.js
        │   ├── saxon.js
        │   ├── search
        │   │   ├── model.js
        │   │   └── view.js
        │   ├── search.js
        │   ├── sort.js
        │   ├── state.js
        │   ├── theme.js
        │   ├── toc.js
        │   └── tooltip.js
```

Results of the Jasmine test runner against the Openbibl specs are
viewable by navigating to the ./openbibl/tests/js/SpecRunner.html
file, e.g.:

[SpecRunner.html](http://rnathanday.github.io/openbibl/tests/js/SpecRunner.html)

