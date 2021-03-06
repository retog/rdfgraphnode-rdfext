# rdfgraphnode [![Build Status](https://travis-ci.org/retog/rdfgraphnode-rdfext.svg?branch=master)](https://travis-ci.org/retog/rdfgraphnode-rdfext)
Graph Traversal on top of [rdf-ext](https://github.com/rdf-ext/rdf-ext) Using [ext-rdflib](https://github.com/retog/ext-rdflib)

This is a fork of the original [rdfgraphnode](https://github.com/retog/rdfgraphnode) that is based on [rdflib.js](https://github.com/linkeddata/rdflib.js). The functionality should be identical.

## Usage

rdfgraphnode can be used in the browser both with `rdflib.js` as well as `ext-rdflib`. The respective library must be loaded before rdfgraphnode.

        <script src="https://retog.github.io/rdfgraphnode-rdfext/latest/GraphNode.js"></script>

You may replace `latest` with the version of rdfgraphnode you want to use.


## API

A GraphNode represents an arbitrary number of nodes in a graph. 

A GraphNode has the following properties:

- value
- termType
- node
- nodes
- graph

The first three properties are available only if the GraphNode represents 
exactly one node.

A GraphNode has the following methods:

- out(predicate)
- in(predicate)
- fetch()
- each(f)
- fetchEach(f)
- split()

The first three methods return a Promise for a GraphNode.The `each(f)`method invokes `f` once for every represented node with a GrahphNode representing that node as argument and returns a promise that is satisfied when all promises returned by f are resolved. The method `fetchEach(f)` is identical to `each(f)` but every node is fetched before being passed to `f`. The method `split` returns a GraphNode for every node in `nodes` 

## Example

```
GraphNode($rdf.sym("https://reto.solid.factsmission.com:8443/public/")).fetch().then(folder =>
    { folder.out($rdf.sym("http://www.w3.org/ns/ldp#contains")).each(contained =>
        { console.log(contained.value) });
    });
```
