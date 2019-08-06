import { equal } from 'assert';
import GraphNode from '../js/GraphNode.js';
import { sym, graph, parse } from 'ext-rdflib';

function dc(suffix) {
    return sym("http://dublincore.org/2012/06/14/dcelements#" + suffix);
}



describe('GraphNode', function () {
    
    describe('#out()', function () {
        it('Getting property value from local graph', function (done) {
            let dataTurtle = '@prefix dc: <http://dublincore.org/2012/06/14/dcelements#>. \n\
                <http://example.org/> dc:title "An example".';
            let data = graph();
            parse(dataTurtle, data, "http://example.org/data", "text/turtle").then(
                () => {
                    let gn = GraphNode(sym("http://example.org/"), data);
                    let title = gn.out(dc("title")).value;
                    equal("An example", title);
                    done();
                }
            )
        });
    });

    describe('#in()', function () {
        it('Getting property value from local graph', function (done) {
            let dataTurtle = '@prefix dc: <http://dublincore.org/2012/06/14/dcelements#>. \n\
                <http://example.org/> dc:title <http://example.org/title>.\n\
                <http://example.org/sommething> dc:creator <http://example.org/title>.';
            let data = graph();
            parse(dataTurtle, data, "http://example.org/data", "text/turtle").then(
                () => {
                    let gn = GraphNode(sym("http://example.org/title"), data);
                    let subj = gn.in(dc("title")).value;
                    equal("http://example.org/", subj);
                    done();
                }
            )
        });
    });

    describe('Remote data', function () {
        var express = require('express');
        var app = express();
        var server = null;
        var http = require('http');
        express.static.mime.define({'application/n-triples': ['nt']});

        before(function(done) {  
            var path = require('path');
            app.set('port', process.env.PORT || 3123);
            app.use(express.static(path.join(__dirname, './served')));
            server = http.createServer((request, reponse) => {
                return app(request, reponse);
            });
            server.listen(app.get('port'));
            done();
        });
        it('Fetching turtle', function (done) {
            let gn = GraphNode(sym("http://localhost:"+app.get('port')+"/example.ttl"));
            gn.fetch().then(gn => 
                {
                    let title = gn.out(dc("title")).value;
                    equal("Another example", title);
                }).then(done);
        });
        it('Fetching RDFa', function (done) {
            let gn = GraphNode(sym("http://localhost:"+app.get('port')+"/example.html"));
            gn.fetch().then(gn => 
                {
                    let title = gn.out(dc("title")).value;
                    equal("Another example", title);
                }).then(done);
        });
        /* Depends on support in rdflib.js such as by https://github.com/linkeddata/rdflib.js/pull/220 */
        it('Fetching n-triples', function (done) {
            let gn = GraphNode(sym("http://localhost:"+app.get('port')+"/example.nt"));
            gn.fetch().then(gn => 
                {
                    let title = gn.out(dc("title")).value;
                    equal("Another example", title);
                }).then(done);
        });
        after(function(done) {
            server.close();
            done();
        });
    });
});