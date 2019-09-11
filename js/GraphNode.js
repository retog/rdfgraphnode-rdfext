import $rdf from "ext-rdflib";
import fetch, { Headers as _Headers } from "node-fetch";

/**
 * Node Status:
 * 
 * Locally undetermined: There are multiple local nodes satisfying the criteria specified for this object 
 * Blank: The object represents a blank node in a graph that is locally available
 * Unresolved: This node is identified by a URI that has not yet been derefernced
 * 
 * @type type
 */

let Headers = ((h) => h ? h : window.Headers)(fetch.Headers);

function GraphNode() {
    return new GraphNode.Impl(...arguments);
}

GraphNode.Impl = class {
        
        constructor(nodes, graph, sources) {
            this._graph = graph;
            if (Array.isArray(nodes)) {
                this.nodes = nodes;
                /*if (this.nodes.length === 0) {
                    throw "Can't represent empty set of nodes";
                }*/
            } else {
                this.nodes = [nodes];
            }
            this.sources = sources;
        }
        
        get graph() {
            if (!this._graph) {
                throw Error("Operation not possible as no Graph is available, try fetching first");
            }
            return this._graph;
        }
        
        get node() {
            if (this.nodes.length !== 1) {
                throw Error("Operation not possible as this GraphNode is underdetermined");
            }
            return this.nodes[0];
        }
        
        get termType() {
            return this.node.termType;
        }
        
        get value() {;
            return this.node.value;
        }
        
        fetch() {
            if ((this.termType !== "NamedNode") || 
                        (this.sources && this.sources.indexOf(this.value.split("#")[0]) > -1)) {
                return Promise.resolve(this);
            } else {
                //TODO extend existing graph?
                var uri = this.value.split("#")[0];
                return GraphNode.rdfFetch(uri).then(response => response.graph()).then(graph => GraphNode(this.node, graph, [uri]));
            }
        }
        
        /*
         * 
         * @param {type} f
         * @returns {unresolved} a promise that is satisfied when all promises returned by f are resolved
         */
        each(f) {
            var results = this.nodes.map(node => f(GraphNode([node], this.graph, this.sources)));
            return Promise.all(results);
        }
        
        fetchEach(f) {
            var results = this.nodes.map(node => GraphNode([node], this.graph, this.sources).fetch().then(f));
            return Promise.all(results);
        }

        /**
         * Returns a GraphNode for each node represented by this GraphNode
         */
        split() {
            return this.nodes.map(node => GraphNode([node], this.graph, this.sources));
        }
        
        out(predicate) {
            var nodes = this.graph.each(this.node, predicate);
            /*if (nodes.length === 0) {
                throw "No property "+predicate+" on "+this.node;
            }*/
            return GraphNode(nodes, this.graph, this.sources);
        }
        
        in(predicate) {
            var statements = this.graph.statementsMatching(undefined, predicate, this.node);
            /*if (statements.length === 0) {
                throw "No property "+predicate+" pointing to "+this.node;
            }*/
            return GraphNode(statements.map(statement => statement.subject), this.graph, this.sources);
        }
    }

/**
 * 
 * Fetches an RDF graph. If the server return 401 the login process will be 
 * started upon which the fetch will be retried.
 *
 * @param uri {string} The URI to be fetched
 * @param options passed to $rdf.Fetcher
 * @param login {boolean} The login function to be called, optional
 *
 * @return {Promise<Response>} Response has a `graph`property with the rertived graph
 */
GraphNode.rdfFetch = $rdf.rdfFetch;

export default GraphNode;
