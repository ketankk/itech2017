! function(e) {
    if ("object" == typeof exports && "undefined" != typeof module) module.exports = e();
    else if ("function" == typeof define && define.amd) define([], e);
    else {
        var f;
        "undefined" != typeof window ? f = window : "undefined" != typeof global ? f = global : "undefined" != typeof self && (f = self), f.dagre = e()
    }
}(function() {
    var define, module, exports;
    return function e(t, n, r) {
        function s(o, u) {
            if (!n[o]) {
                if (!t[o]) {
                    var a = typeof require == "function" && require;
                    if (!u && a) return a(o, !0);
                    if (i) return i(o, !0);
                    var f = new Error("Cannot find module '" + o + "'");
                    throw f.code = "MODULE_NOT_FOUND", f
                }
                var l = n[o] = {
                    exports: {}
                };
                t[o][0].call(l.exports, function(e) {
                    var n = t[o][1][e];
                    return s(n ? n : e)
                }, l, l.exports, e, t, n, r)
            }
            return n[o].exports
        }
        var i = typeof require == "function" && require;
        for (var o = 0; o < r.length; o++) s(r[o]);
        return s
    }({
        1: [function(require, module, exports) {
            module.exports = {
                graphlib: require("./lib/graphlib"),
                layout: require("./lib/layout"),
                debug: require("./lib/debug"),
                util: {
                    time: require("./lib/util").time,
                    notime: require("./lib/util").notime
                },
                version: require("./lib/version")
            }
        }, {
            "./lib/debug": 6,
            "./lib/graphlib": 7,
            "./lib/layout": 9,
            "./lib/util": 29,
            "./lib/version": 30
        }],
        2: [function(require, module, exports) {
            "use strict";
            var _ = require("./lodash"),
                greedyFAS = require("./greedy-fas");
            module.exports = {
                run: run,
                undo: undo
            };

            function run(g) {
                var fas = g.graph().acyclicer === "greedy" ? greedyFAS(g, weightFn(g)) : dfsFAS(g);
                _.each(fas, function(e) {
                    var label = g.edge(e);
                    g.removeEdge(e);
                    label.forwardName = e.name;
                    label.reversed = true;
                    g.setEdge(e.w, e.v, label, _.uniqueId("rev"))
                });

                function weightFn(g) {
                    return function(e) {
                        return g.edge(e).weight
                    }
                }
            }

            function dfsFAS(g) {
                var fas = [],
                    stack = {},
                    visited = {};

                function dfs(v) {
                    if (_.has(visited, v)) {
                        return
                    }
                    visited[v] = true;
                    stack[v] = true;
                    _.each(g.outEdges(v), function(e) {
                        if (_.has(stack, e.w)) {
                            fas.push(e)
                        } else {
                            dfs(e.w)
                        }
                    });
                    delete stack[v]
                }
                _.each(g.nodes(), dfs);
                return fas
            }

            function undo(g) {
                _.each(g.edges(), function(e) {
                    var label = g.edge(e);
                    if (label.reversed) {
                        g.removeEdge(e);
                        var forwardName = label.forwardName;
                        delete label.reversed;
                        delete label.forwardName;
                        g.setEdge(e.w, e.v, label, forwardName)
                    }
                })
            }
        }, {
            "./greedy-fas": 8,
            "./lodash": 10
        }],
        3: [function(require, module, exports) {
            var _ = require("./lodash"),
                util = require("./util");
            module.exports = addBorderSegments;

            function addBorderSegments(g) {
                function dfs(v) {
                    var children = g.children(v),
                        node = g.node(v);
                    if (children.length) {
                        _.each(children, dfs)
                    }
                    if (_.has(node, "minRank")) {
                        node.borderLeft = [];
                        node.borderRight = [];
                        for (var rank = node.minRank, maxRank = node.maxRank + 1; rank < maxRank; ++rank) {
                            addBorderNode(g, "borderLeft", "_bl", v, node, rank);
                            addBorderNode(g, "borderRight", "_br", v, node, rank)
                        }
                    }
                }
                _.each(g.children(), dfs)
            }

            function addBorderNode(g, prop, prefix, sg, sgNode, rank) {
                var label = {
                        width: 0,
                        height: 0,
                        rank: rank,
                        borderType: prop
                    },
                    prev = sgNode[prop][rank - 1],
                    curr = util.addDummyNode(g, "border", label, prefix);
                sgNode[prop][rank] = curr;
                g.setParent(curr, sg);
                if (prev) {
                    g.setEdge(prev, curr, {
                        weight: 1
                    })
                }
            }
        }, {
            "./lodash": 10,
            "./util": 29
        }],
        4: [function(require, module, exports) {
            "use strict";
            var _ = require("./lodash");
            module.exports = {
                adjust: adjust,
                undo: undo
            };

            function adjust(g) {
                var rankDir = g.graph().rankdir.toLowerCase();
                if (rankDir === "lr" || rankDir === "rl") {
                    swapWidthHeight(g)
                }
            }

            function undo(g) {
                var rankDir = g.graph().rankdir.toLowerCase();
                if (rankDir === "bt" || rankDir === "rl") {
                    reverseY(g)
                }
                if (rankDir === "lr" || rankDir === "rl") {
                    swapXY(g);
                    swapWidthHeight(g)
                }
            }

            function swapWidthHeight(g) {
                _.each(g.nodes(), function(v) {
                    swapWidthHeightOne(g.node(v))
                });
                _.each(g.edges(), function(e) {
                    swapWidthHeightOne(g.edge(e))
                })
            }

            function swapWidthHeightOne(attrs) {
                var w = attrs.width;
                attrs.width = attrs.height;
                attrs.height = w
            }

            function reverseY(g) {
                _.each(g.nodes(), function(v) {
                    reverseYOne(g.node(v))
                });
                _.each(g.edges(), function(e) {
                    var edge = g.edge(e);
                    _.each(edge.points, reverseYOne);
                    if (_.has(edge, "y")) {
                        reverseYOne(edge)
                    }
                })
            }

            function reverseYOne(attrs) {
                attrs.y = -attrs.y
            }

            function swapXY(g) {
                _.each(g.nodes(), function(v) {
                    swapXYOne(g.node(v))
                });
                _.each(g.edges(), function(e) {
                    var edge = g.edge(e);
                    _.each(edge.points, swapXYOne);
                    if (_.has(edge, "x")) {
                        swapXYOne(edge)
                    }
                })
            }

            function swapXYOne(attrs) {
                var x = attrs.x;
                attrs.x = attrs.y;
                attrs.y = x
            }
        }, {
            "./lodash": 10
        }],
        5: [function(require, module, exports) {
            module.exports = List;

            function List() {
                var sentinel = {};
                sentinel._next = sentinel._prev = sentinel;
                this._sentinel = sentinel
            }
            List.prototype.dequeue = function() {
                var sentinel = this._sentinel,
                    entry = sentinel._prev;
                if (entry !== sentinel) {
                    unlink(entry);
                    return entry
                }
            };
            List.prototype.enqueue = function(entry) {
                var sentinel = this._sentinel;
                if (entry._prev && entry._next) {
                    unlink(entry)
                }
                entry._next = sentinel._next;
                sentinel._next._prev = entry;
                sentinel._next = entry;
                entry._prev = sentinel
            };
            List.prototype.toString = function() {
                var strs = [],
                    sentinel = this._sentinel,
                    curr = sentinel._prev;
                while (curr !== sentinel) {
                    strs.push(JSON.stringify(curr, filterOutLinks));
                    curr = curr._prev
                }
                return "[" + strs.join(", ") + "]"
            };

            function unlink(entry) {
                entry._prev._next = entry._next;
                entry._next._prev = entry._prev;
                delete entry._next;
                delete entry._prev
            }

            function filterOutLinks(k, v) {
                if (k !== "_next" && k !== "_prev") {
                    return v
                }
            }
        }, {}],
        6: [function(require, module, exports) {
            var _ = require("./lodash"),
                util = require("./util"),
                Graph = require("./graphlib").Graph;
            module.exports = {
                debugOrdering: debugOrdering
            };

            function debugOrdering(g) {
                var layerMatrix = util.buildLayerMatrix(g);
                var h = new Graph({
                    compound: true,
                    multigraph: true
                }).setGraph({});
                _.each(g.nodes(), function(v) {
                    h.setNode(v, {
                        label: v
                    });
                    h.setParent(v, "layer" + g.node(v).rank)
                });
                _.each(g.edges(), function(e) {
                    h.setEdge(e.v, e.w, {}, e.name)
                });
                _.each(layerMatrix, function(layer, i) {
                    var layerV = "layer" + i;
                    h.setNode(layerV, {
                        rank: "same"
                    });
                    _.reduce(layer, function(u, v) {
                        h.setEdge(u, v, {
                            style: "invis"
                        });
                        return v
                    })
                });
                return h
            }
        }, {
            "./graphlib": 7,
            "./lodash": 10,
            "./util": 29
        }],
        7: [function(require, module, exports) {
            var graphlib;
            if (typeof require === "function") {
                try {
                    graphlib = require("graphlib")
                } catch (e) {}
            }
            if (!graphlib) {
                graphlib = window.graphlib
            }
            module.exports = graphlib
        }, {
            graphlib: 31
        }],
        8: [function(require, module, exports) {
            var _ = require("./lodash"),
                Graph = require("./graphlib").Graph,
                List = require("./data/list");
            module.exports = greedyFAS;
            var DEFAULT_WEIGHT_FN = _.constant(1);

            function greedyFAS(g, weightFn) {
                if (g.nodeCount() <= 1) {
                    return []
                }
                var state = buildState(g, weightFn || DEFAULT_WEIGHT_FN);
                var results = doGreedyFAS(state.graph, state.buckets, state.zeroIdx);
                return _.flatten(_.map(results, function(e) {
                    return g.outEdges(e.v, e.w)
                }), true)
            }

            function doGreedyFAS(g, buckets, zeroIdx) {
                var results = [],
                    sources = buckets[buckets.length - 1],
                    sinks = buckets[0];
                var entry;
                while (g.nodeCount()) {
                    while (entry = sinks.dequeue()) {
                        removeNode(g, buckets, zeroIdx, entry)
                    }
                    while (entry = sources.dequeue()) {
                        removeNode(g, buckets, zeroIdx, entry)
                    }
                    if (g.nodeCount()) {
                        for (var i = buckets.length - 2; i > 0; --i) {
                            entry = buckets[i].dequeue();
                            if (entry) {
                                results = results.concat(removeNode(g, buckets, zeroIdx, entry, true));
                                break
                            }
                        }
                    }
                }
                return results
            }

            function removeNode(g, buckets, zeroIdx, entry, collectPredecessors) {
                var results = collectPredecessors ? [] : undefined;
                _.each(g.inEdges(entry.v), function(edge) {
                    var weight = g.edge(edge),
                        uEntry = g.node(edge.v);
                    if (collectPredecessors) {
                        results.push({
                            v: edge.v,
                            w: edge.w
                        })
                    }
                    uEntry.out -= weight;
                    assignBucket(buckets, zeroIdx, uEntry)
                });
                _.each(g.outEdges(entry.v), function(edge) {
                    var weight = g.edge(edge),
                        w = edge.w,
                        wEntry = g.node(w);
                    wEntry["in"] -= weight;
                    assignBucket(buckets, zeroIdx, wEntry)
                });
                g.removeNode(entry.v);
                return results
            }

            function buildState(g, weightFn) {
                var fasGraph = new Graph,
                    maxIn = 0,
                    maxOut = 0;
                _.each(g.nodes(), function(v) {
                    fasGraph.setNode(v, {
                        v: v,
                        "in": 0,
                        out: 0
                    })
                });
                _.each(g.edges(), function(e) {
                    var prevWeight = fasGraph.edge(e.v, e.w) || 0,
                        weight = weightFn(e),
                        edgeWeight = prevWeight + weight;
                    fasGraph.setEdge(e.v, e.w, edgeWeight);
                    maxOut = Math.max(maxOut, fasGraph.node(e.v).out += weight);
                    maxIn = Math.max(maxIn, fasGraph.node(e.w)["in"] += weight)
                });
                var buckets = _.range(maxOut + maxIn + 3).map(function() {
                    return new List
                });
                var zeroIdx = maxIn + 1;
                _.each(fasGraph.nodes(), function(v) {
                    assignBucket(buckets, zeroIdx, fasGraph.node(v))
                });
                return {
                    graph: fasGraph,
                    buckets: buckets,
                    zeroIdx: zeroIdx
                }
            }

            function assignBucket(buckets, zeroIdx, entry) {
                if (!entry.out) {
                    buckets[0].enqueue(entry)
                } else if (!entry["in"]) {
                    buckets[buckets.length - 1].enqueue(entry)
                } else {
                    buckets[entry.out - entry["in"] + zeroIdx].enqueue(entry)
                }
            }
        }, {
            "./data/list": 5,
            "./graphlib": 7,
            "./lodash": 10
        }],
        9: [function(require, module, exports) {
            "use strict";
            var _ = require("./lodash"),
                acyclic = require("./acyclic"),
                normalize = require("./normalize"),
                rank = require("./rank"),
                normalizeRanks = require("./util").normalizeRanks,
                parentDummyChains = require("./parent-dummy-chains"),
                removeEmptyRanks = require("./util").removeEmptyRanks,
                nestingGraph = require("./nesting-graph"),
                addBorderSegments = require("./add-border-segments"),
                coordinateSystem = require("./coordinate-system"),
                order = require("./order"),
                position = require("./position"),
                util = require("./util"),
                Graph = require("./graphlib").Graph;
            module.exports = layout;

            function layout(g, opts) {
                var time = opts && opts.debugTiming ? util.time : util.notime;
                time("layout", function() {
                    var layoutGraph = time("  buildLayoutGraph", function() {
                        return buildLayoutGraph(g)
                    });
                    time("  runLayout", function() {
                        runLayout(layoutGraph, time)
                    });
                    time("  updateInputGraph", function() {
                        updateInputGraph(g, layoutGraph)
                    })
                })
            }

            function runLayout(g, time) {
                time("    makeSpaceForEdgeLabels", function() {
                    makeSpaceForEdgeLabels(g)
                });
                time("    removeSelfEdges", function() {
                    removeSelfEdges(g)
                });
                time("    acyclic", function() {
                    acyclic.run(g)
                });
                time("    nestingGraph.run", function() {
                    nestingGraph.run(g)
                });
                time("    rank", function() {
                    rank(util.asNonCompoundGraph(g))
                });
                time("    injectEdgeLabelProxies", function() {
                    injectEdgeLabelProxies(g)
                });
                time("    removeEmptyRanks", function() {
                    removeEmptyRanks(g)
                });
                time("    nestingGraph.cleanup", function() {
                    nestingGraph.cleanup(g)
                });
                time("    normalizeRanks", function() {
                    normalizeRanks(g)
                });
                time("    assignRankMinMax", function() {
                    assignRankMinMax(g)
                });
                time("    removeEdgeLabelProxies", function() {
                    removeEdgeLabelProxies(g)
                });
                time("    normalize.run", function() {
                    normalize.run(g)
                });
                time("    parentDummyChains", function() {
                    parentDummyChains(g)
                });
                time("    addBorderSegments", function() {
                    addBorderSegments(g)
                });
                time("    order", function() {
                    order(g)
                });
                time("    insertSelfEdges", function() {
                    insertSelfEdges(g)
                });
                time("    adjustCoordinateSystem", function() {
                    coordinateSystem.adjust(g)
                });
                time("    position", function() {
                    position(g)
                });
                time("    positionSelfEdges", function() {
                    positionSelfEdges(g)
                });
                time("    removeBorderNodes", function() {
                    removeBorderNodes(g)
                });
                time("    normalize.undo", function() {
                    normalize.undo(g)
                });
                time("    fixupEdgeLabelCoords", function() {
                    fixupEdgeLabelCoords(g)
                });
                time("    undoCoordinateSystem", function() {
                    coordinateSystem.undo(g)
                });
                time("    translateGraph", function() {
                    translateGraph(g)
                });
                time("    assignNodeIntersects", function() {
                    assignNodeIntersects(g)
                });
                time("    reversePoints", function() {
                    reversePointsForReversedEdges(g)
                });
                time("    acyclic.undo", function() {
                    acyclic.undo(g)
                })
            }

            function updateInputGraph(inputGraph, layoutGraph) {
                _.each(inputGraph.nodes(), function(v) {
                    var inputLabel = inputGraph.node(v),
                        layoutLabel = layoutGraph.node(v);
                    if (inputLabel) {
                        inputLabel.x = layoutLabel.x;
                        inputLabel.y = layoutLabel.y;
                        if (layoutGraph.children(v).length) {
                            inputLabel.width = layoutLabel.width;
                            inputLabel.height = layoutLabel.height
                        }
                    }
                });
                _.each(inputGraph.edges(), function(e) {
                    var inputLabel = inputGraph.edge(e),
                        layoutLabel = layoutGraph.edge(e);
                    inputLabel.points = layoutLabel.points;
                    if (_.has(layoutLabel, "x")) {
                        inputLabel.x = layoutLabel.x;
                        inputLabel.y = layoutLabel.y
                    }
                });
                inputGraph.graph().width = layoutGraph.graph().width;
                inputGraph.graph().height = layoutGraph.graph().height
            }
            var graphNumAttrs = ["nodesep", "edgesep", "ranksep", "marginx", "marginy"],
                graphDefaults = {
                    ranksep: 50,
                    edgesep: 20,
                    nodesep: 50,
                    rankdir: "tb"
                },
                graphAttrs = ["acyclicer", "ranker", "rankdir", "align"],
                nodeNumAttrs = ["width", "height"],
                nodeDefaults = {
                    width: 0,
                    height: 0
                },
                edgeNumAttrs = ["minlen", "weight", "width", "height", "labeloffset"],
                edgeDefaults = {
                    minlen: 1,
                    weight: 1,
                    width: 0,
                    height: 0,
                    labeloffset: 10,
                    labelpos: "r"
                },
                edgeAttrs = ["labelpos"];

            function buildLayoutGraph(inputGraph) {
                var g = new Graph({
                        multigraph: true,
                        compound: true
                    }),
                    graph = canonicalize(inputGraph.graph());
                g.setGraph(_.merge({}, graphDefaults, selectNumberAttrs(graph, graphNumAttrs), _.pick(graph, graphAttrs)));
                _.each(inputGraph.nodes(), function(v) {
                    var node = canonicalize(inputGraph.node(v));
                    g.setNode(v, _.defaults(selectNumberAttrs(node, nodeNumAttrs), nodeDefaults));
                    g.setParent(v, inputGraph.parent(v))
                });
                _.each(inputGraph.edges(), function(e) {
                    var edge = canonicalize(inputGraph.edge(e));
                    g.setEdge(e, _.merge({}, edgeDefaults, selectNumberAttrs(edge, edgeNumAttrs), _.pick(edge, edgeAttrs)))
                });
                return g
            }

            function makeSpaceForEdgeLabels(g) {
                var graph = g.graph();
                graph.ranksep /= 2;
                _.each(g.edges(), function(e) {
                    var edge = g.edge(e);
                    edge.minlen *= 2;
                    if (edge.labelpos.toLowerCase() !== "c") {
                        if (graph.rankdir === "TB" || graph.rankdir === "BT") {
                            edge.width += edge.labeloffset
                        } else {
                            edge.height += edge.labeloffset
                        }
                    }
                })
            }

            function injectEdgeLabelProxies(g) {
                _.each(g.edges(), function(e) {
                    var edge = g.edge(e);
                    if (edge.width && edge.height) {
                        var v = g.node(e.v),
                            w = g.node(e.w),
                            label = {
                                rank: (w.rank - v.rank) / 2 + v.rank,
                                e: e
                            };
                        util.addDummyNode(g, "edge-proxy", label, "_ep")
                    }
                })
            }

            function assignRankMinMax(g) {
                var maxRank = 0;
                _.each(g.nodes(), function(v) {
                    var node = g.node(v);
                    if (node.borderTop) {
                        node.minRank = g.node(node.borderTop).rank;
                        node.maxRank = g.node(node.borderBottom).rank;
                        maxRank = _.max(maxRank, node.maxRank)
                    }
                });
                g.graph().maxRank = maxRank
            }

            function removeEdgeLabelProxies(g) {
                _.each(g.nodes(), function(v) {
                    var node = g.node(v);
                    if (node.dummy === "edge-proxy") {
                        g.edge(node.e).labelRank = node.rank;
                        g.removeNode(v)
                    }
                })
            }

            function translateGraph(g) {
                var minX = Number.POSITIVE_INFINITY,
                    maxX = 0,
                    minY = Number.POSITIVE_INFINITY,
                    maxY = 0,
                    graphLabel = g.graph(),
                    marginX = graphLabel.marginx || 0,
                    marginY = graphLabel.marginy || 0;

                function getExtremes(attrs) {
                    var x = attrs.x,
                        y = attrs.y,
                        w = attrs.width,
                        h = attrs.height;
                    minX = Math.min(minX, x - w / 2);
                    maxX = Math.max(maxX, x + w / 2);
                    minY = Math.min(minY, y - h / 2);
                    maxY = Math.max(maxY, y + h / 2)
                }
                _.each(g.nodes(), function(v) {
                    getExtremes(g.node(v))
                });
                _.each(g.edges(), function(e) {
                    var edge = g.edge(e);
                    if (_.has(edge, "x")) {
                        getExtremes(edge)
                    }
                });
                minX -= marginX;
                minY -= marginY;
                _.each(g.nodes(), function(v) {
                    var node = g.node(v);
                    node.x -= minX;
                    node.y -= minY
                });
                _.each(g.edges(), function(e) {
                    var edge = g.edge(e);
                    _.each(edge.points, function(p) {
                        p.x -= minX;
                        p.y -= minY
                    });
                    if (_.has(edge, "x")) {
                        edge.x -= minX
                    }
                    if (_.has(edge, "y")) {
                        edge.y -= minY
                    }
                });
                graphLabel.width = maxX - minX + marginX;
                graphLabel.height = maxY - minY + marginY
            }

            function assignNodeIntersects(g) {
                _.each(g.edges(), function(e) {
                    var edge = g.edge(e),
                        nodeV = g.node(e.v),
                        nodeW = g.node(e.w),
                        p1, p2;
                    if (!edge.points) {
                        edge.points = [];
                        p1 = nodeW;
                        p2 = nodeV
                    } else {
                        p1 = edge.points[0];
                        p2 = edge.points[edge.points.length - 1]
                    }
                    edge.points.unshift(util.intersectRect(nodeV, p1));
                    edge.points.push(util.intersectRect(nodeW, p2))
                })
            }

            function fixupEdgeLabelCoords(g) {
                _.each(g.edges(), function(e) {
                    var edge = g.edge(e);
                    if (_.has(edge, "x")) {
                        if (edge.labelpos === "l" || edge.labelpos === "r") {
                            edge.width -= edge.labeloffset
                        }
                        switch (edge.labelpos) {
                            case "l":
                                edge.x -= edge.width / 2 + edge.labeloffset;
                                break;
                            case "r":
                                edge.x += edge.width / 2 + edge.labeloffset;
                                break
                        }
                    }
                })
            }

            function reversePointsForReversedEdges(g) {
                _.each(g.edges(), function(e) {
                    var edge = g.edge(e);
                    if (edge.reversed) {
                        edge.points.reverse()
                    }
                })
            }

            function removeBorderNodes(g) {
                _.each(g.nodes(), function(v) {
                    if (g.children(v).length) {
                        var node = g.node(v),
                            t = g.node(node.borderTop),
                            b = g.node(node.borderBottom),
                            l = g.node(_.last(node.borderLeft)),
                            r = g.node(_.last(node.borderRight));
                        node.width = Math.abs(r.x - l.x);
                        node.height = Math.abs(b.y - t.y);
                        node.x = l.x + node.width / 2;
                        node.y = t.y + node.height / 2
                    }
                });
                _.each(g.nodes(), function(v) {
                    if (g.node(v).dummy === "border") {
                        g.removeNode(v)
                    }
                })
            }

            function removeSelfEdges(g) {
                _.each(g.edges(), function(e) {
                    if (e.v === e.w) {
                        var node = g.node(e.v);
                        if (!node.selfEdges) {
                            node.selfEdges = []
                        }
                        node.selfEdges.push({
                            e: e,
                            label: g.edge(e)
                        });
                        g.removeEdge(e)
                    }
                })
            }

            function insertSelfEdges(g) {
                var layers = util.buildLayerMatrix(g);
                _.each(layers, function(layer) {
                    var orderShift = 0;
                    _.each(layer, function(v, i) {
                        var node = g.node(v);
                        node.order = i + orderShift;
                        _.each(node.selfEdges, function(selfEdge) {
                            util.addDummyNode(g, "selfedge", {
                                width: selfEdge.label.width,
                                height: selfEdge.label.height,
                                rank: node.rank,
                                order: i + ++orderShift,
                                e: selfEdge.e,
                                label: selfEdge.label
                            }, "_se")
                        });
                        delete node.selfEdges
                    })
                })
            }

            function positionSelfEdges(g) {
                _.each(g.nodes(), function(v) {
                    var node = g.node(v);
                    if (node.dummy === "selfedge") {
                        var selfNode = g.node(node.e.v),
                            x = selfNode.x + selfNode.width / 2,
                            y = selfNode.y,
                            dx = node.x - x,
                            dy = selfNode.height / 2;
                        g.setEdge(node.e, node.label);
                        g.removeNode(v);
                        node.label.points = [{
                            x: x + 2 * dx / 3,
                            y: y - dy
                        }, {
                            x: x + 5 * dx / 6,
                            y: y - dy
                        }, {
                            x: x + dx,
                            y: y
                        }, {
                            x: x + 5 * dx / 6,
                            y: y + dy
                        }, {
                            x: x + 2 * dx / 3,
                            y: y + dy
                        }];
                        node.label.x = node.x;
                        node.label.y = node.y
                    }
                })
            }

            function selectNumberAttrs(obj, attrs) {
                return _.mapValues(_.pick(obj, attrs), Number)
            }

            function canonicalize(attrs) {
                var newAttrs = {};
                _.each(attrs, function(v, k) {
                    newAttrs[k.toLowerCase()] = v
                });
                return newAttrs
            }
        }, {
            "./acyclic": 2,
            "./add-border-segments": 3,
            "./coordinate-system": 4,
            "./graphlib": 7,
            "./lodash": 10,
            "./nesting-graph": 11,
            "./normalize": 12,
            "./order": 17,
            "./parent-dummy-chains": 22,
            "./position": 24,
            "./rank": 26,
            "./util": 29
        }],
        10: [function(require, module, exports) {
            var lodash;
            if (typeof require === "function") {
                try {
                    lodash = require("lodash")
                } catch (e) {}
            }
            if (!lodash) {
                lodash = window._
            }
            module.exports = lodash
        }, {
            lodash: 51
        }],
        11: [function(require, module, exports) {
            var _ = require("./lodash"),
                util = require("./util");
            module.exports = {
                run: run,
                cleanup: cleanup
            };

            function run(g) {
                var root = util.addDummyNode(g, "root", {}, "_root"),
                    depths = treeDepths(g),
                    height = _.max(depths) - 1,
                    nodeSep = 2 * height + 1;
                g.graph().nestingRoot = root;
                _.each(g.edges(), function(e) {
                    g.edge(e).minlen *= nodeSep
                });
                var weight = sumWeights(g) + 1;
                _.each(g.children(), function(child) {
                    dfs(g, root, nodeSep, weight, height, depths, child)
                });
                g.graph().nodeRankFactor = nodeSep
            }

            function dfs(g, root, nodeSep, weight, height, depths, v) {
                var children = g.children(v);
                if (!children.length) {
                    if (v !== root) {
                        g.setEdge(root, v, {
                            weight: 0,
                            minlen: nodeSep
                        })
                    }
                    return
                }
                var top = util.addBorderNode(g, "_bt"),
                    bottom = util.addBorderNode(g, "_bb"),
                    label = g.node(v);
                g.setParent(top, v);
                label.borderTop = top;
                g.setParent(bottom, v);
                label.borderBottom = bottom;
                _.each(children, function(child) {
                    dfs(g, root, nodeSep, weight, height, depths, child);
                    var childNode = g.node(child),
                        childTop = childNode.borderTop ? childNode.borderTop : child,
                        childBottom = childNode.borderBottom ? childNode.borderBottom : child,
                        thisWeight = childNode.borderTop ? weight : 2 * weight,
                        minlen = childTop !== childBottom ? 1 : height - depths[v] + 1;
                    g.setEdge(top, childTop, {
                        weight: thisWeight,
                        minlen: minlen,
                        nestingEdge: true
                    });
                    g.setEdge(childBottom, bottom, {
                        weight: thisWeight,
                        minlen: minlen,
                        nestingEdge: true
                    })
                });
                if (!g.parent(v)) {
                    g.setEdge(root, top, {
                        weight: 0,
                        minlen: height + depths[v]
                    })
                }
            }

            function treeDepths(g) {
                var depths = {};

                function dfs(v, depth) {
                    var children = g.children(v);
                    if (children && children.length) {
                        _.each(children, function(child) {
                            dfs(child, depth + 1)
                        })
                    }
                    depths[v] = depth
                }
                _.each(g.children(), function(v) {
                    dfs(v, 1)
                });
                return depths
            }

            function sumWeights(g) {
                return _.reduce(g.edges(), function(acc, e) {
                    return acc + g.edge(e).weight
                }, 0)
            }

            function cleanup(g) {
                var graphLabel = g.graph();
                g.removeNode(graphLabel.nestingRoot);
                delete graphLabel.nestingRoot;
                _.each(g.edges(), function(e) {
                    var edge = g.edge(e);
                    if (edge.nestingEdge) {
                        g.removeEdge(e)
                    }
                })
            }
        }, {
            "./lodash": 10,
            "./util": 29
        }],
        12: [function(require, module, exports) {
            "use strict";
            var _ = require("./lodash"),
                util = require("./util");
            module.exports = {
                run: run,
                undo: undo
            };

            function run(g) {
                g.graph().dummyChains = [];
                _.each(g.edges(), function(edge) {
                    normalizeEdge(g, edge)
                })
            }

            function normalizeEdge(g, e) {
                var v = e.v,
                    vRank = g.node(v).rank,
                    w = e.w,
                    wRank = g.node(w).rank,
                    name = e.name,
                    edgeLabel = g.edge(e),
                    labelRank = edgeLabel.labelRank;
                if (wRank === vRank + 1) return;
                g.removeEdge(e);
                var dummy, attrs, i;
                for (i = 0, ++vRank; vRank < wRank; ++i, ++vRank) {
                    edgeLabel.points = [];
                    attrs = {
                        width: 0,
                        height: 0,
                        edgeLabel: edgeLabel,
                        edgeObj: e,
                        rank: vRank
                    };
                    dummy = util.addDummyNode(g, "edge", attrs, "_d");
                    if (vRank === labelRank) {
                        attrs.width = edgeLabel.width;
                        attrs.height = edgeLabel.height;
                        attrs.dummy = "edge-label";
                        attrs.labelpos = edgeLabel.labelpos
                    }
                    g.setEdge(v, dummy, {
                        weight: edgeLabel.weight
                    }, name);
                    if (i === 0) {
                        g.graph().dummyChains.push(dummy)
                    }
                    v = dummy
                }
                g.setEdge(v, w, {
                    weight: edgeLabel.weight
                }, name)
            }

            function undo(g) {
                _.each(g.graph().dummyChains, function(v) {
                    var node = g.node(v),
                        origLabel = node.edgeLabel,
                        w;
                    g.setEdge(node.edgeObj, origLabel);
                    while (node.dummy) {
                        w = g.successors(v)[0];
                        g.removeNode(v);
                        origLabel.points.push({
                            x: node.x,
                            y: node.y
                        });
                        if (node.dummy === "edge-label") {
                            origLabel.x = node.x;
                            origLabel.y = node.y;
                            origLabel.width = node.width;
                            origLabel.height = node.height
                        }
                        v = w;
                        node = g.node(v)
                    }
                })
            }
        }, {
            "./lodash": 10,
            "./util": 29
        }],
        13: [function(require, module, exports) {
            var _ = require("../lodash");
            module.exports = addSubgraphConstraints;

            function addSubgraphConstraints(g, cg, vs) {
                var prev = {},
                    rootPrev;
                _.each(vs, function(v) {
                    var child = g.parent(v),
                        parent, prevChild;
                    while (child) {
                        parent = g.parent(child);
                        if (parent) {
                            prevChild = prev[parent];
                            prev[parent] = child
                        } else {
                            prevChild = rootPrev;
                            rootPrev = child
                        }
                        if (prevChild && prevChild !== child) {
                            cg.setEdge(prevChild, child);
                            return
                        }
                        child = parent
                    }
                })
            }
        }, {
            "../lodash": 10
        }],
        14: [function(require, module, exports) {
            var _ = require("../lodash");
            module.exports = barycenter;

            function barycenter(g, movable) {
                return _.map(movable, function(v) {
                    var inV = g.inEdges(v);
                    if (!inV.length) {
                        return {
                            v: v
                        }
                    } else {
                        var result = _.reduce(inV, function(acc, e) {
                            var edge = g.edge(e),
                                nodeU = g.node(e.v);
                            return {
                                sum: acc.sum + edge.weight * nodeU.order,
                                weight: acc.weight + edge.weight
                            }
                        }, {
                            sum: 0,
                            weight: 0
                        });
                        return {
                            v: v,
                            barycenter: result.sum / result.weight,
                            weight: result.weight
                        }
                    }
                })
            }
        }, {
            "../lodash": 10
        }],
        15: [function(require, module, exports) {
            var _ = require("../lodash"),
                Graph = require("../graphlib").Graph;
            module.exports = buildLayerGraph;

            function buildLayerGraph(g, rank, relationship) {
                var root = createRootNode(g),
                    result = new Graph({
                        compound: true
                    }).setGraph({
                        root: root
                    }).setDefaultNodeLabel(function(v) {
                        return g.node(v)
                    });
                _.each(g.nodes(), function(v) {
                    var node = g.node(v),
                        parent = g.parent(v);
                    if (node.rank === rank || node.minRank <= rank && rank <= node.maxRank) {
                        result.setNode(v);
                        result.setParent(v, parent || root);
                        _.each(g[relationship](v), function(e) {
                            var u = e.v === v ? e.w : e.v,
                                edge = result.edge(u, v),
                                weight = !_.isUndefined(edge) ? edge.weight : 0;
                            result.setEdge(u, v, {
                                weight: g.edge(e).weight + weight
                            })
                        });
                        if (_.has(node, "minRank")) {
                            result.setNode(v, {
                                borderLeft: node.borderLeft[rank],
                                borderRight: node.borderRight[rank]
                            })
                        }
                    }
                });
                return result
            }

            function createRootNode(g) {
                var v;
                while (g.hasNode(v = _.uniqueId("_root")));
                return v
            }
        }, {
            "../graphlib": 7,
            "../lodash": 10
        }],
        16: [function(require, module, exports) {
            "use strict";
            var _ = require("../lodash");
            module.exports = crossCount;

            function crossCount(g, layering) {
                var cc = 0;
                for (var i = 1; i < layering.length; ++i) {
                    cc += twoLayerCrossCount(g, layering[i - 1], layering[i])
                }
                return cc
            }

            function twoLayerCrossCount(g, northLayer, southLayer) {
                var southPos = _.zipObject(southLayer, _.map(southLayer, function(v, i) {
                    return i
                }));
                var southEntries = _.flatten(_.map(northLayer, function(v) {
                    return _.chain(g.outEdges(v)).map(function(e) {
                        return {
                            pos: southPos[e.w],
                            weight: g.edge(e).weight
                        }
                    }).sortBy("pos").value()
                }), true);
                var firstIndex = 1;
                while (firstIndex < southLayer.length) firstIndex <<= 1;
                var treeSize = 2 * firstIndex - 1;
                firstIndex -= 1;
                var tree = _.map(new Array(treeSize), function() {
                    return 0
                });
                var cc = 0;
                _.each(southEntries.forEach(function(entry) {
                    var index = entry.pos + firstIndex;
                    tree[index] += entry.weight;
                    var weightSum = 0;
                    while (index > 0) {
                        if (index % 2) {
                            weightSum += tree[index + 1]
                        }
                        index = index - 1 >> 1;
                        tree[index] += entry.weight
                    }
                    cc += entry.weight * weightSum
                }));
                return cc
            }
        }, {
            "../lodash": 10
        }],
        17: [function(require, module, exports) {
            "use strict";
            var _ = require("../lodash"),
                initOrder = require("./init-order"),
                crossCount = require("./cross-count"),
                sortSubgraph = require("./sort-subgraph"),
                buildLayerGraph = require("./build-layer-graph"),
                addSubgraphConstraints = require("./add-subgraph-constraints"),
                Graph = require("../graphlib").Graph,
                util = require("../util");
            module.exports = order;

            function order(g) {
                var maxRank = util.maxRank(g),
                    downLayerGraphs = buildLayerGraphs(g, _.range(1, maxRank + 1), "inEdges"),
                    upLayerGraphs = buildLayerGraphs(g, _.range(maxRank - 1, -1, -1), "outEdges");
                var layering = initOrder(g);
                assignOrder(g, layering);
                var bestCC = Number.POSITIVE_INFINITY,
                    best;
                for (var i = 0, lastBest = 0; lastBest < 4; ++i, ++lastBest) {
                    sweepLayerGraphs(i % 2 ? downLayerGraphs : upLayerGraphs, i % 4 >= 2);
                    layering = util.buildLayerMatrix(g);
                    var cc = crossCount(g, layering);
                    if (cc < bestCC) {
                        lastBest = 0;
                        best = _.cloneDeep(layering);
                        bestCC = cc
                    }
                }
                assignOrder(g, best)
            }

            function buildLayerGraphs(g, ranks, relationship) {
                return _.map(ranks, function(rank) {
                    return buildLayerGraph(g, rank, relationship)
                })
            }

            function sweepLayerGraphs(layerGraphs, biasRight) {
                var cg = new Graph;
                _.each(layerGraphs, function(lg) {
                    var root = lg.graph().root;
                    var sorted = sortSubgraph(lg, root, cg, biasRight);
                    _.each(sorted.vs, function(v, i) {
                        lg.node(v).order = i
                    });
                    addSubgraphConstraints(lg, cg, sorted.vs)
                })
            }

            function assignOrder(g, layering) {
                _.each(layering, function(layer) {
                    _.each(layer, function(v, i) {
                        g.node(v).order = i
                    })
                })
            }
        }, {
            "../graphlib": 7,
            "../lodash": 10,
            "../util": 29,
            "./add-subgraph-constraints": 13,
            "./build-layer-graph": 15,
            "./cross-count": 16,
            "./init-order": 18,
            "./sort-subgraph": 20
        }],
        18: [function(require, module, exports) {
            "use strict";
            var _ = require("../lodash");
            module.exports = initOrder;

            function initOrder(g) {
                var visited = {},
                    simpleNodes = _.filter(g.nodes(), function(v) {
                        return !g.children(v).length
                    }),
                    maxRank = _.max(_.map(simpleNodes, function(v) {
                        return g.node(v).rank
                    })),
                    layers = _.map(_.range(maxRank + 1), function() {
                        return []
                    });

                function dfs(v) {
                    if (_.has(visited, v)) return;
                    visited[v] = true;
                    var node = g.node(v);
                    layers[node.rank].push(v);
                    _.each(g.successors(v), dfs)
                }
                var orderedVs = _.sortBy(simpleNodes, function(v) {
                    return g.node(v).rank
                });
                _.each(orderedVs, dfs);
                return layers
            }
        }, {
            "../lodash": 10
        }],
        19: [function(require, module, exports) {
            "use strict";
            var _ = require("../lodash");
            module.exports = resolveConflicts;

            function resolveConflicts(entries, cg) {
                var mappedEntries = {};
                _.each(entries, function(entry, i) {
                    var tmp = mappedEntries[entry.v] = {
                        indegree: 0,
                        "in": [],
                        out: [],
                        vs: [entry.v],
                        i: i
                    };
                    if (!_.isUndefined(entry.barycenter)) {
                        tmp.barycenter = entry.barycenter;
                        tmp.weight = entry.weight
                    }
                });
                _.each(cg.edges(), function(e) {
                    var entryV = mappedEntries[e.v],
                        entryW = mappedEntries[e.w];
                    if (!_.isUndefined(entryV) && !_.isUndefined(entryW)) {
                        entryW.indegree++;
                        entryV.out.push(mappedEntries[e.w])
                    }
                });
                var sourceSet = _.filter(mappedEntries, function(entry) {
                    return !entry.indegree
                });
                return doResolveConflicts(sourceSet)
            }

            function doResolveConflicts(sourceSet) {
                var entries = [];

                function handleIn(vEntry) {
                    return function(uEntry) {
                        if (uEntry.merged) {
                            return
                        }
                        if (_.isUndefined(uEntry.barycenter) || _.isUndefined(vEntry.barycenter) || uEntry.barycenter >= vEntry.barycenter) {
                            mergeEntries(vEntry, uEntry)
                        }
                    }
                }

                function handleOut(vEntry) {
                    return function(wEntry) {
                        wEntry["in"].push(vEntry);
                        if (--wEntry.indegree === 0) {
                            sourceSet.push(wEntry)
                        }
                    }
                }
                while (sourceSet.length) {
                    var entry = sourceSet.pop();
                    entries.push(entry);
                    _.each(entry["in"].reverse(), handleIn(entry));
                    _.each(entry.out, handleOut(entry))
                }
                return _.chain(entries).filter(function(entry) {
                    return !entry.merged
                }).map(function(entry) {
                    return _.pick(entry, ["vs", "i", "barycenter", "weight"])
                }).value()
            }

            function mergeEntries(target, source) {
                var sum = 0,
                    weight = 0;
                if (target.weight) {
                    sum += target.barycenter * target.weight;
                    weight += target.weight
                }
                if (source.weight) {
                    sum += source.barycenter * source.weight;
                    weight += source.weight
                }
                target.vs = source.vs.concat(target.vs);
                target.barycenter = sum / weight;
                target.weight = weight;
                target.i = Math.min(source.i, target.i);
                source.merged = true
            }
        }, {
            "../lodash": 10
        }],
        20: [function(require, module, exports) {
            var _ = require("../lodash"),
                barycenter = require("./barycenter"),
                resolveConflicts = require("./resolve-conflicts"),
                sort = require("./sort");
            module.exports = sortSubgraph;

            function sortSubgraph(g, v, cg, biasRight) {
                var movable = g.children(v),
                    node = g.node(v),
                    bl = node ? node.borderLeft : undefined,
                    br = node ? node.borderRight : undefined,
                    subgraphs = {};
                if (bl) {
                    movable = _.filter(movable, function(w) {
                        return w !== bl && w !== br
                    })
                }
                var barycenters = barycenter(g, movable);
                _.each(barycenters, function(entry) {
                    if (g.children(entry.v).length) {
                        var subgraphResult = sortSubgraph(g, entry.v, cg, biasRight);
                        subgraphs[entry.v] = subgraphResult;
                        if (_.has(subgraphResult, "barycenter")) {
                            mergeBarycenters(entry, subgraphResult)
                        }
                    }
                });
                var entries = resolveConflicts(barycenters, cg);
                expandSubgraphs(entries, subgraphs);
                var result = sort(entries, biasRight);
                if (bl) {
                    result.vs = _.flatten([bl, result.vs, br], true);
                    if (g.predecessors(bl).length) {
                        var blPred = g.node(g.predecessors(bl)[0]),
                            brPred = g.node(g.predecessors(br)[0]);
                        if (!_.has(result, "barycenter")) {
                            result.barycenter = 0;
                            result.weight = 0
                        }
                        result.barycenter = (result.barycenter * result.weight + blPred.order + brPred.order) / (result.weight + 2);
                        result.weight += 2
                    }
                }
                return result
            }

            function expandSubgraphs(entries, subgraphs) {
                _.each(entries, function(entry) {
                    entry.vs = _.flatten(entry.vs.map(function(v) {
                        if (subgraphs[v]) {
                            return subgraphs[v].vs
                        }
                        return v
                    }), true)
                })
            }

            function mergeBarycenters(target, other) {
                if (!_.isUndefined(target.barycenter)) {
                    target.barycenter = (target.barycenter * target.weight + other.barycenter * other.weight) / (target.weight + other.weight);
                    target.weight += other.weight
                } else {
                    target.barycenter = other.barycenter;
                    target.weight = other.weight
                }
            }
        }, {
            "../lodash": 10,
            "./barycenter": 14,
            "./resolve-conflicts": 19,
            "./sort": 21
        }],
        21: [function(require, module, exports) {
            var _ = require("../lodash"),
                util = require("../util");
            module.exports = sort;

            function sort(entries, biasRight) {
                var parts = util.partition(entries, function(entry) {
                    return _.has(entry, "barycenter")
                });
                var sortable = parts.lhs,
                    unsortable = _.sortBy(parts.rhs, function(entry) {
                        return -entry.i
                    }),
                    vs = [],
                    sum = 0,
                    weight = 0,
                    vsIndex = 0;
                sortable.sort(compareWithBias(!!biasRight));
                vsIndex = consumeUnsortable(vs, unsortable, vsIndex);
                _.each(sortable, function(entry) {
                    vsIndex += entry.vs.length;
                    vs.push(entry.vs);
                    sum += entry.barycenter * entry.weight;
                    weight += entry.weight;
                    vsIndex = consumeUnsortable(vs, unsortable, vsIndex)
                });
                var result = {
                    vs: _.flatten(vs, true)
                };
                if (weight) {
                    result.barycenter = sum / weight;
                    result.weight = weight
                }
                return result
            }

            function consumeUnsortable(vs, unsortable, index) {
                var last;
                while (unsortable.length && (last = _.last(unsortable)).i <= index) {
                    unsortable.pop();
                    vs.push(last.vs);
                    index++
                }
                return index
            }

            function compareWithBias(bias) {
                return function(entryV, entryW) {
                    if (entryV.barycenter < entryW.barycenter) {
                        return -1
                    } else if (entryV.barycenter > entryW.barycenter) {
                        return 1
                    }
                    return !bias ? entryV.i - entryW.i : entryW.i - entryV.i
                }
            }
        }, {
            "../lodash": 10,
            "../util": 29
        }],
        22: [function(require, module, exports) {
            var _ = require("./lodash");
            module.exports = parentDummyChains;

            function parentDummyChains(g) {
                var postorderNums = postorder(g);
                _.each(g.graph().dummyChains, function(v) {
                    var node = g.node(v),
                        edgeObj = node.edgeObj,
                        pathData = findPath(g, postorderNums, edgeObj.v, edgeObj.w),
                        path = pathData.path,
                        lca = pathData.lca,
                        pathIdx = 0,
                        pathV = path[pathIdx],
                        ascending = true;
                    while (v !== edgeObj.w) {
                        node = g.node(v);
                        if (ascending) {
                            while ((pathV = path[pathIdx]) !== lca && g.node(pathV).maxRank < node.rank) {
                                pathIdx++
                            }
                            if (pathV === lca) {
                                ascending = false
                            }
                        }
                        if (!ascending) {
                            while (pathIdx < path.length - 1 && g.node(pathV = path[pathIdx + 1]).minRank <= node.rank) {
                                pathIdx++
                            }
                            pathV = path[pathIdx]
                        }
                        g.setParent(v, pathV);
                        v = g.successors(v)[0]
                    }
                })
            }

            function findPath(g, postorderNums, v, w) {
                var vPath = [],
                    wPath = [],
                    low = Math.min(postorderNums[v].low, postorderNums[w].low),
                    lim = Math.max(postorderNums[v].lim, postorderNums[w].lim),
                    parent, lca;
                parent = v;
                do {
                    parent = g.parent(parent);
                    vPath.push(parent)
                } while (parent && (postorderNums[parent].low > low || lim > postorderNums[parent].lim));
                lca = parent;
                parent = w;
                while ((parent = g.parent(parent)) !== lca) {
                    wPath.push(parent)
                }
                return {
                    path: vPath.concat(wPath.reverse()),
                    lca: lca
                }
            }

            function postorder(g) {
                var result = {},
                    lim = 0;

                function dfs(v) {
                    var low = lim;
                    _.each(g.children(v), dfs);
                    result[v] = {
                        low: low,
                        lim: lim++
                    }
                }
                _.each(g.children(), dfs);
                return result
            }
        }, {
            "./lodash": 10
        }],
        23: [function(require, module, exports) {
            "use strict";
            var _ = require("../lodash"),
                Graph = require("../graphlib").Graph,
                util = require("../util");
            module.exports = {
                positionX: positionX,
                findType1Conflicts: findType1Conflicts,
                findType2Conflicts: findType2Conflicts,
                addConflict: addConflict,
                hasConflict: hasConflict,
                verticalAlignment: verticalAlignment,
                horizontalCompaction: horizontalCompaction,
                alignCoordinates: alignCoordinates,
                findSmallestWidthAlignment: findSmallestWidthAlignment,
                balance: balance
            };

            function findType1Conflicts(g, layering) {
                var conflicts = {};

                function visitLayer(prevLayer, layer) {
                    var k0 = 0,
                        scanPos = 0,
                        prevLayerLength = prevLayer.length,
                        lastNode = _.last(layer);
                    _.each(layer, function(v, i) {
                        var w = findOtherInnerSegmentNode(g, v),
                            k1 = w ? g.node(w).order : prevLayerLength;
                        if (w || v === lastNode) {
                            _.each(layer.slice(scanPos, i + 1), function(scanNode) {
                                _.each(g.predecessors(scanNode), function(u) {
                                    var uLabel = g.node(u),
                                        uPos = uLabel.order;
                                    if ((uPos < k0 || k1 < uPos) && !(uLabel.dummy && g.node(scanNode).dummy)) {
                                        addConflict(conflicts, u, scanNode)
                                    }
                                })
                            });
                            scanPos = i + 1;
                            k0 = k1
                        }
                    });
                    return layer
                }
                _.reduce(layering, visitLayer);
                return conflicts
            }

            function findType2Conflicts(g, layering) {
                var conflicts = {};

                function scan(south, southPos, southEnd, prevNorthBorder, nextNorthBorder) {
                    var v;
                    _.each(_.range(southPos, southEnd), function(i) {
                        v = south[i];
                        if (g.node(v).dummy) {
                            _.each(g.predecessors(v), function(u) {
                                var uNode = g.node(u);
                                if (uNode.dummy && (uNode.order < prevNorthBorder || uNode.order > nextNorthBorder)) {
                                    addConflict(conflicts, u, v)
                                }
                            })
                        }
                    })
                }

                function visitLayer(north, south) {
                    var prevNorthPos = -1,
                        nextNorthPos, southPos = 0;
                    _.each(south, function(v, southLookahead) {
                        if (g.node(v).dummy === "border") {
                            var predecessors = g.predecessors(v);
                            if (predecessors.length) {
                                nextNorthPos = g.node(predecessors[0]).order;
                                scan(south, southPos, southLookahead, prevNorthPos, nextNorthPos);
                                southPos = southLookahead;
                                prevNorthPos = nextNorthPos
                            }
                        }
                        scan(south, southPos, south.length, nextNorthPos, north.length)
                    });
                    return south
                }
                _.reduce(layering, visitLayer);
                return conflicts
            }

            function findOtherInnerSegmentNode(g, v) {
                if (g.node(v).dummy) {
                    return _.find(g.predecessors(v), function(u) {
                        return g.node(u).dummy
                    })
                }
            }

            function addConflict(conflicts, v, w) {
                if (v > w) {
                    var tmp = v;
                    v = w;
                    w = tmp
                }
                var conflictsV = conflicts[v];
                if (!conflictsV) {
                    conflicts[v] = conflictsV = {}
                }
                conflictsV[w] = true
            }

            function hasConflict(conflicts, v, w) {
                if (v > w) {
                    var tmp = v;
                    v = w;
                    w = tmp
                }
                return _.has(conflicts[v], w)
            }

            function verticalAlignment(g, layering, conflicts, neighborFn) {
                var root = {},
                    align = {},
                    pos = {};
                _.each(layering, function(layer) {
                    _.each(layer, function(v, order) {
                        root[v] = v;
                        align[v] = v;
                        pos[v] = order
                    })
                });
                _.each(layering, function(layer) {
                    var prevIdx = -1;
                    _.each(layer, function(v) {
                        var ws = neighborFn(v);
                        if (ws.length) {
                            ws = _.sortBy(ws, function(w) {
                                return pos[w]
                            });
                            var mp = (ws.length - 1) / 2;
                            for (var i = Math.floor(mp), il = Math.ceil(mp); i <= il; ++i) {
                                var w = ws[i];
                                if (align[v] === v && prevIdx < pos[w] && !hasConflict(conflicts, v, w)) {
                                    align[w] = v;
                                    align[v] = root[v] = root[w];
                                    prevIdx = pos[w]
                                }
                            }
                        }
                    })
                });
                return {
                    root: root,
                    align: align
                }
            }

            function horizontalCompaction(g, layering, root, align, reverseSep) {
                var xs = {},
                    blockG = buildBlockGraph(g, layering, root, reverseSep);
                var visited = {};

                function pass1(v) {
                    if (!_.has(visited, v)) {
                        visited[v] = true;
                        xs[v] = _.reduce(blockG.inEdges(v), function(max, e) {
                            pass1(e.v);
                            return Math.max(max, xs[e.v] + blockG.edge(e))
                        }, 0)
                    }
                }
                _.each(blockG.nodes(), pass1);
                var borderType = reverseSep ? "borderLeft" : "borderRight";

                function pass2(v) {
                    if (visited[v] !== 2) {
                        visited[v]++;
                        var node = g.node(v);
                        var min = _.reduce(blockG.outEdges(v), function(min, e) {
                            pass2(e.w);
                            return Math.min(min, xs[e.w] - blockG.edge(e))
                        }, Number.POSITIVE_INFINITY);
                        if (min !== Number.POSITIVE_INFINITY && node.borderType !== borderType) {
                            xs[v] = Math.max(xs[v], min)
                        }
                    }
                }
                _.each(blockG.nodes(), pass2);
                _.each(align, function(v) {
                    xs[v] = xs[root[v]]
                });
                return xs
            }

            function buildBlockGraph(g, layering, root, reverseSep) {
                var blockGraph = new Graph,
                    graphLabel = g.graph(),
                    sepFn = sep(graphLabel.nodesep, graphLabel.edgesep, reverseSep);
                _.each(layering, function(layer) {
                    var u;
                    _.each(layer, function(v) {
                        var vRoot = root[v];
                        blockGraph.setNode(vRoot);
                        if (u) {
                            var uRoot = root[u],
                                prevMax = blockGraph.edge(uRoot, vRoot);
                            blockGraph.setEdge(uRoot, vRoot, Math.max(sepFn(g, v, u), prevMax || 0))
                        }
                        u = v
                    })
                });
                return blockGraph
            }

            function findSmallestWidthAlignment(g, xss) {
                return _.min(xss, function(xs) {
                    var min = _.min(xs, function(x, v) {
                            return x - width(g, v) / 2
                        }),
                        max = _.max(xs, function(x, v) {
                            return x + width(g, v) / 2
                        });
                    return max - min
                })
            }

            function alignCoordinates(xss, alignTo) {
                var alignToMin = _.min(alignTo),
                    alignToMax = _.max(alignTo);
                _.each(["u", "d"], function(vert) {
                    _.each(["l", "r"], function(horiz) {
                        var alignment = vert + horiz,
                            xs = xss[alignment],
                            delta;
                        if (xs === alignTo) return;
                        delta = horiz === "l" ? alignToMin - _.min(xs) : alignToMax - _.max(xs);
                        if (delta) {
                            xss[alignment] = _.mapValues(xs, function(x) {
                                return x + delta
                            })
                        }
                    })
                })
            }

            function balance(xss, align) {
                return _.mapValues(xss.ul, function(ignore, v) {
                    if (align) {
                        return xss[align.toLowerCase()][v]
                    } else {
                        var xs = _.sortBy(_.pluck(xss, v));
                        return (xs[1] + xs[2]) / 2
                    }
                })
            }

            function positionX(g) {
                var layering = util.buildLayerMatrix(g),
                    conflicts = _.merge(findType1Conflicts(g, layering), findType2Conflicts(g, layering));
                var xss = {},
                    adjustedLayering;
                _.each(["u", "d"], function(vert) {
                    adjustedLayering = vert === "u" ? layering : _.values(layering).reverse();
                    _.each(["l", "r"], function(horiz) {
                        if (horiz === "r") {
                            adjustedLayering = _.map(adjustedLayering, function(inner) {
                                return _.values(inner).reverse()
                            })
                        }
                        var neighborFn = _.bind(vert === "u" ? g.predecessors : g.successors, g);
                        var align = verticalAlignment(g, adjustedLayering, conflicts, neighborFn);
                        var xs = horizontalCompaction(g, adjustedLayering, align.root, align.align, horiz === "r");
                        if (horiz === "r") {
                            xs = _.mapValues(xs, function(x) {
                                return -x
                            })
                        }
                        xss[vert + horiz] = xs
                    })
                });
                var smallestWidth = findSmallestWidthAlignment(g, xss);
                alignCoordinates(xss, smallestWidth);
                return balance(xss, g.graph().align)
            }

            function sep(nodeSep, edgeSep, reverseSep) {
                return function(g, v, w) {
                    var vLabel = g.node(v),
                        wLabel = g.node(w),
                        sum = 0,
                        delta;
                    sum += vLabel.width / 2;
                    if (_.has(vLabel, "labelpos")) {
                        switch (vLabel.labelpos.toLowerCase()) {
                            case "l":
                                delta = -vLabel.width / 2;
                                break;
                            case "r":
                                delta = vLabel.width / 2;
                                break
                        }
                    }
                    if (delta) {
                        sum += reverseSep ? delta : -delta
                    }
                    delta = 0;
                    sum += (vLabel.dummy ? edgeSep : nodeSep) / 2;
                    sum += (wLabel.dummy ? edgeSep : nodeSep) / 2;
                    sum += wLabel.width / 2;
                    if (_.has(wLabel, "labelpos")) {
                        switch (wLabel.labelpos.toLowerCase()) {
                            case "l":
                                delta = wLabel.width / 2;
                                break;
                            case "r":
                                delta = -wLabel.width / 2;
                                break
                        }
                    }
                    if (delta) {
                        sum += reverseSep ? delta : -delta
                    }
                    delta = 0;
                    return sum
                }
            }

            function width(g, v) {
                return g.node(v).width
            }
        }, {
            "../graphlib": 7,
            "../lodash": 10,
            "../util": 29
        }],
        24: [function(require, module, exports) {
            "use strict";
            var _ = require("../lodash"),
                util = require("../util"),
                positionX = require("./bk").positionX;
            module.exports = position;

            function position(g) {
                g = util.asNonCompoundGraph(g);
                positionY(g);
                _.each(positionX(g), function(x, v) {
                    g.node(v).x = x
                })
            }

            function positionY(g) {
                var layering = util.buildLayerMatrix(g),
                    rankSep = g.graph().ranksep,
                    prevY = 0;
                _.each(layering, function(layer) {
                    var maxHeight = _.max(_.map(layer, function(v) {
                        return g.node(v).height
                    }));
                    _.each(layer, function(v) {
                        g.node(v).y = prevY + maxHeight / 2
                    });
                    prevY += maxHeight + rankSep
                })
            }
        }, {
            "../lodash": 10,
            "../util": 29,
            "./bk": 23
        }],
        25: [function(require, module, exports) {
            "use strict";
            var _ = require("../lodash"),
                Graph = require("../graphlib").Graph,
                slack = require("./util").slack;
            module.exports = feasibleTree;

            function feasibleTree(g) {
                var t = new Graph({
                    directed: false
                });
                var start = g.nodes()[0],
                    size = g.nodeCount();
                t.setNode(start, {});
                var edge, delta;
                while (tightTree(t, g) < size) {
                    edge = findMinSlackEdge(t, g);
                    delta = t.hasNode(edge.v) ? slack(g, edge) : -slack(g, edge);
                    shiftRanks(t, g, delta)
                }
                return t
            }

            function tightTree(t, g) {
                function dfs(v) {
                    _.each(g.nodeEdges(v), function(e) {
                        var edgeV = e.v,
                            w = v === edgeV ? e.w : edgeV;
                        if (!t.hasNode(w) && !slack(g, e)) {
                            t.setNode(w, {});
                            t.setEdge(v, w, {});
                            dfs(w)
                        }
                    })
                }
                _.each(t.nodes(), dfs);
                return t.nodeCount()
            }

            function findMinSlackEdge(t, g) {
                return _.min(g.edges(), function(e) {
                    if (t.hasNode(e.v) !== t.hasNode(e.w)) {
                        return slack(g, e)
                    }
                })
            }

            function shiftRanks(t, g, delta) {
                _.each(t.nodes(), function(v) {
                    g.node(v).rank += delta
                })
            }
        }, {
            "../graphlib": 7,
            "../lodash": 10,
            "./util": 28
        }],
        26: [function(require, module, exports) {
            "use strict";
            var rankUtil = require("./util"),
                longestPath = rankUtil.longestPath,
                feasibleTree = require("./feasible-tree"),
                networkSimplex = require("./network-simplex");
            module.exports = rank;

            function rank(g) {
                switch (g.graph().ranker) {
                    case "network-simplex":
                        networkSimplexRanker(g);
                        break;
                    case "tight-tree":
                        tightTreeRanker(g);
                        break;
                    case "longest-path":
                        longestPathRanker(g);
                        break;
                    default:
                        networkSimplexRanker(g)
                }
            }
            var longestPathRanker = longestPath;

            function tightTreeRanker(g) {
                longestPath(g);
                feasibleTree(g)
            }

            function networkSimplexRanker(g) {
                networkSimplex(g)
            }
        }, {
            "./feasible-tree": 25,
            "./network-simplex": 27,
            "./util": 28
        }],
        27: [function(require, module, exports) {
            "use strict";
            var _ = require("../lodash"),
                feasibleTree = require("./feasible-tree"),
                slack = require("./util").slack,
                initRank = require("./util").longestPath,
                preorder = require("../graphlib").alg.preorder,
                postorder = require("../graphlib").alg.postorder,
                simplify = require("../util").simplify;
            module.exports = networkSimplex;
            networkSimplex.initLowLimValues = initLowLimValues;
            networkSimplex.initCutValues = initCutValues;
            networkSimplex.calcCutValue = calcCutValue;
            networkSimplex.leaveEdge = leaveEdge;
            networkSimplex.enterEdge = enterEdge;
            networkSimplex.exchangeEdges = exchangeEdges;

            function networkSimplex(g) {
                g = simplify(g);
                initRank(g);
                var t = feasibleTree(g);
                initLowLimValues(t);
                initCutValues(t, g);
                var e, f;
                while (e = leaveEdge(t)) {
                    f = enterEdge(t, g, e);
                    exchangeEdges(t, g, e, f)
                }
            }

            function initCutValues(t, g) {
                var vs = postorder(t, t.nodes());
                vs = vs.slice(0, vs.length - 1);
                _.each(vs, function(v) {
                    assignCutValue(t, g, v)
                })
            }

            function assignCutValue(t, g, child) {
                var childLab = t.node(child),
                    parent = childLab.parent;
                t.edge(child, parent).cutvalue = calcCutValue(t, g, child)
            }

            function calcCutValue(t, g, child) {
                var childLab = t.node(child),
                    parent = childLab.parent,
                    childIsTail = true,
                    graphEdge = g.edge(child, parent),
                    cutValue = 0;
                if (!graphEdge) {
                    childIsTail = false;
                    graphEdge = g.edge(parent, child)
                }
                cutValue = graphEdge.weight;
                _.each(g.nodeEdges(child), function(e) {
                    var isOutEdge = e.v === child,
                        other = isOutEdge ? e.w : e.v;
                    if (other !== parent) {
                        var pointsToHead = isOutEdge === childIsTail,
                            otherWeight = g.edge(e).weight;
                        cutValue += pointsToHead ? otherWeight : -otherWeight;
                        if (isTreeEdge(t, child, other)) {
                            var otherCutValue = t.edge(child, other).cutvalue;
                            cutValue += pointsToHead ? -otherCutValue : otherCutValue
                        }
                    }
                });
                return cutValue
            }

            function initLowLimValues(tree, root) {
                if (arguments.length < 2) {
                    root = tree.nodes()[0]
                }
                dfsAssignLowLim(tree, {}, 1, root)
            }

            function dfsAssignLowLim(tree, visited, nextLim, v, parent) {
                var low = nextLim,
                    label = tree.node(v);
                visited[v] = true;
                _.each(tree.neighbors(v), function(w) {
                    if (!_.has(visited, w)) {
                        nextLim = dfsAssignLowLim(tree, visited, nextLim, w, v)
                    }
                });
                label.low = low;
                label.lim = nextLim++;
                if (parent) {
                    label.parent = parent
                } else {
                    delete label.parent
                }
                return nextLim
            }

            function leaveEdge(tree) {
                return _.find(tree.edges(), function(e) {
                    return tree.edge(e).cutvalue < 0
                })
            }

            function enterEdge(t, g, edge) {
                var v = edge.v,
                    w = edge.w;
                if (!g.hasEdge(v, w)) {
                    v = edge.w;
                    w = edge.v
                }
                var vLabel = t.node(v),
                    wLabel = t.node(w),
                    tailLabel = vLabel,
                    flip = false;
                if (vLabel.lim > wLabel.lim) {
                    tailLabel = wLabel;
                    flip = true
                }
                var candidates = _.filter(g.edges(), function(edge) {
                    return flip === isDescendant(t, t.node(edge.v), tailLabel) && flip !== isDescendant(t, t.node(edge.w), tailLabel)
                });
                return _.min(candidates, function(edge) {
                    return slack(g, edge)
                })
            }

            function exchangeEdges(t, g, e, f) {
                var v = e.v,
                    w = e.w;
                t.removeEdge(v, w);
                t.setEdge(f.v, f.w, {});
                initLowLimValues(t);
                initCutValues(t, g);
                updateRanks(t, g)
            }

            function updateRanks(t, g) {
                var root = _.find(t.nodes(), function(v) {
                        return !g.node(v).parent
                    }),
                    vs = preorder(t, root);
                vs = vs.slice(1);
                _.each(vs, function(v) {
                    var parent = t.node(v).parent,
                        edge = g.edge(v, parent),
                        flipped = false;
                    if (!edge) {
                        edge = g.edge(parent, v);
                        flipped = true
                    }
                    g.node(v).rank = g.node(parent).rank + (flipped ? edge.minlen : -edge.minlen)
                })
            }

            function isTreeEdge(tree, u, v) {
                return tree.hasEdge(u, v)
            }

            function isDescendant(tree, vLabel, rootLabel) {
                return rootLabel.low <= vLabel.lim && vLabel.lim <= rootLabel.lim
            }
        }, {
            "../graphlib": 7,
            "../lodash": 10,
            "../util": 29,
            "./feasible-tree": 25,
            "./util": 28
        }],
        28: [function(require, module, exports) {
            "use strict";
            var _ = require("../lodash");
            module.exports = {
                longestPath: longestPath,
                slack: slack
            };

            function longestPath(g) {
                var visited = {};

                function dfs(v) {
                    var label = g.node(v);
                    if (_.has(visited, v)) {
                        return label.rank
                    }
                    visited[v] = true;
                    var rank = _.min(_.map(g.outEdges(v), function(e) {
                        return dfs(e.w) - g.edge(e).minlen
                    }));
                    if (rank === Number.POSITIVE_INFINITY) {
                        rank = 0
                    }
                    return label.rank = rank
                }
                _.each(g.sources(), dfs)
            }

            function slack(g, e) {
                return g.node(e.w).rank - g.node(e.v).rank - g.edge(e).minlen
            }
        }, {
            "../lodash": 10
        }],
        29: [function(require, module, exports) {
            "use strict";
            var _ = require("./lodash"),
                Graph = require("./graphlib").Graph;
            module.exports = {
                addDummyNode: addDummyNode,
                simplify: simplify,
                asNonCompoundGraph: asNonCompoundGraph,
                successorWeights: successorWeights,
                predecessorWeights: predecessorWeights,
                intersectRect: intersectRect,
                buildLayerMatrix: buildLayerMatrix,
                normalizeRanks: normalizeRanks,
                removeEmptyRanks: removeEmptyRanks,
                addBorderNode: addBorderNode,
                maxRank: maxRank,
                partition: partition,
                time: time,
                notime: notime
            };

            function addDummyNode(g, type, attrs, name) {
                var v;
                do {
                    v = _.uniqueId(name)
                } while (g.hasNode(v));
                attrs.dummy = type;
                g.setNode(v, attrs);
                return v
            }

            function simplify(g) {
                var simplified = (new Graph).setGraph(g.graph());
                _.each(g.nodes(), function(v) {
                    simplified.setNode(v, g.node(v))
                });
                _.each(g.edges(), function(e) {
                    var simpleLabel = simplified.edge(e.v, e.w) || {
                            weight: 0,
                            minlen: 1
                        },
                        label = g.edge(e);
                    simplified.setEdge(e.v, e.w, {
                        weight: simpleLabel.weight + label.weight,
                        minlen: Math.max(simpleLabel.minlen, label.minlen)
                    })
                });
                return simplified
            }

            function asNonCompoundGraph(g) {
                var simplified = new Graph({
                    multigraph: g.isMultigraph()
                }).setGraph(g.graph());
                _.each(g.nodes(), function(v) {
                    if (!g.children(v).length) {
                        simplified.setNode(v, g.node(v))
                    }
                });
                _.each(g.edges(), function(e) {
                    simplified.setEdge(e, g.edge(e))
                });
                return simplified
            }

            function successorWeights(g) {
                var weightMap = _.map(g.nodes(), function(v) {
                    var sucs = {};
                    _.each(g.outEdges(v), function(e) {
                        sucs[e.w] = (sucs[e.w] || 0) + g.edge(e).weight
                    });
                    return sucs
                });
                return _.zipObject(g.nodes(), weightMap)
            }

            function predecessorWeights(g) {
                var weightMap = _.map(g.nodes(), function(v) {
                    var preds = {};
                    _.each(g.inEdges(v), function(e) {
                        preds[e.v] = (preds[e.v] || 0) + g.edge(e).weight
                    });
                    return preds
                });
                return _.zipObject(g.nodes(), weightMap)
            }

            function intersectRect(rect, point) {
                var x = rect.x;
                var y = rect.y;
                var dx = point.x - x;
                var dy = point.y - y;
                var w = rect.width / 2;
                var h = rect.height / 2;
                if (!dx && !dy) {
                    throw new Error("Not possible to find intersection inside of the rectangle")
                }
                var sx, sy;
                if (Math.abs(dy) * w > Math.abs(dx) * h) {
                    if (dy < 0) {
                        h = -h
                    }
                    sx = h * dx / dy;
                    sy = h
                } else {
                    if (dx < 0) {
                        w = -w
                    }
                    sx = w;
                    sy = w * dy / dx
                }
                return {
                    x: x + sx,
                    y: y + sy
                }
            }

            function buildLayerMatrix(g) {
                var layering = _.map(_.range(maxRank(g) + 1), function() {
                    return []
                });
                _.each(g.nodes(), function(v) {
                    var node = g.node(v),
                        rank = node.rank;
                    if (!_.isUndefined(rank)) {
                        layering[rank][node.order] = v
                    }
                });
                return layering
            }

            function normalizeRanks(g) {
                var min = _.min(_.map(g.nodes(), function(v) {
                    return g.node(v).rank
                }));
                _.each(g.nodes(), function(v) {
                    var node = g.node(v);
                    if (_.has(node, "rank")) {
                        node.rank -= min
                    }
                })
            }

            function removeEmptyRanks(g) {
                var offset = _.min(_.map(g.nodes(), function(v) {
                    return g.node(v).rank
                }));
                var layers = [];
                _.each(g.nodes(), function(v) {
                    var rank = g.node(v).rank - offset;
                    if (!layers[rank]) {
                        layers[rank] = []
                    }
                    layers[rank].push(v)
                });
                var delta = 0,
                    nodeRankFactor = g.graph().nodeRankFactor;
                _.each(layers, function(vs, i) {
                    if (_.isUndefined(vs) && i % nodeRankFactor !== 0) {
                        --delta
                    } else if (delta) {
                        _.each(vs, function(v) {
                            g.node(v).rank += delta
                        })
                    }
                })
            }

            function addBorderNode(g, prefix, rank, order) {
                var node = {
                    width: 0,
                    height: 0
                };
                if (arguments.length >= 4) {
                    node.rank = rank;
                    node.order = order
                }
                return addDummyNode(g, "border", node, prefix)
            }

            function maxRank(g) {
                return _.max(_.map(g.nodes(), function(v) {
                    var rank = g.node(v).rank;
                    if (!_.isUndefined(rank)) {
                        return rank
                    }
                }))
            }

            function partition(collection, fn) {
                var result = {
                    lhs: [],
                    rhs: []
                };
                _.each(collection, function(value) {
                    if (fn(value)) {
                        result.lhs.push(value)
                    } else {
                        result.rhs.push(value)
                    }
                });
                return result
            }

            function time(name, fn) {
                var start = _.now();
                try {
                    return fn()
                } finally {
                    console.log(name + " time: " + (_.now() - start) + "ms")
                }
            }

            function notime(name, fn) {
                return fn()
            }
        }, {
            "./graphlib": 7,
            "./lodash": 10
        }],
        30: [function(require, module, exports) {
            module.exports = "0.7.4"
        }, {}],
        31: [function(require, module, exports) {
            var lib = require("./lib");
            module.exports = {
                Graph: lib.Graph,
                json: require("./lib/json"),
                alg: require("./lib/alg"),
                version: lib.version
            }
        }, {
            "./lib": 47,
            "./lib/alg": 38,
            "./lib/json": 48
        }],
        32: [function(require, module, exports) {
            var _ = require("../lodash");
            module.exports = components;

            function components(g) {
                var visited = {},
                    cmpts = [],
                    cmpt;

                function dfs(v) {
                    if (_.has(visited, v)) return;
                    visited[v] = true;
                    cmpt.push(v);
                    _.each(g.successors(v), dfs);
                    _.each(g.predecessors(v), dfs)
                }
                _.each(g.nodes(), function(v) {
                    cmpt = [];
                    dfs(v);
                    if (cmpt.length) {
                        cmpts.push(cmpt)
                    }
                });
                return cmpts
            }
        }, {
            "../lodash": 49
        }],
        33: [function(require, module, exports) {
            var _ = require("../lodash");
            module.exports = dfs;

            function dfs(g, vs, order) {
                if (!_.isArray(vs)) {
                    vs = [vs]
                }
                var acc = [],
                    visited = {};
                _.each(vs, function(v) {
                    if (!g.hasNode(v)) {
                        throw new Error("Graph does not have node: " + v)
                    }
                    doDfs(g, v, order === "post", visited, acc)
                });
                return acc
            }

            function doDfs(g, v, postorder, visited, acc) {
                if (!_.has(visited, v)) {
                    visited[v] = true;
                    if (!postorder) {
                        acc.push(v)
                    }
                    _.each(g.neighbors(v), function(w) {
                        doDfs(g, w, postorder, visited, acc)
                    });
                    if (postorder) {
                        acc.push(v)
                    }
                }
            }
        }, {
            "../lodash": 49
        }],
        34: [function(require, module, exports) {
            var dijkstra = require("./dijkstra"),
                _ = require("../lodash");
            module.exports = dijkstraAll;

            function dijkstraAll(g, weightFunc, edgeFunc) {
                return _.transform(g.nodes(), function(acc, v) {
                    acc[v] = dijkstra(g, v, weightFunc, edgeFunc)
                }, {})
            }
        }, {
            "../lodash": 49,
            "./dijkstra": 35
        }],
        35: [function(require, module, exports) {
            var _ = require("../lodash"),
                PriorityQueue = require("../data/priority-queue");
            module.exports = dijkstra;
            var DEFAULT_WEIGHT_FUNC = _.constant(1);

            function dijkstra(g, source, weightFn, edgeFn) {
                return runDijkstra(g, String(source), weightFn || DEFAULT_WEIGHT_FUNC, edgeFn || function(v) {
                    return g.outEdges(v)
                })
            }

            function runDijkstra(g, source, weightFn, edgeFn) {
                var results = {},
                    pq = new PriorityQueue,
                    v, vEntry;
                var updateNeighbors = function(edge) {
                    var w = edge.v !== v ? edge.v : edge.w,
                        wEntry = results[w],
                        weight = weightFn(edge),
                        distance = vEntry.distance + weight;
                    if (weight < 0) {
                        throw new Error("dijkstra does not allow negative edge weights. " + "Bad edge: " + edge + " Weight: " + weight)
                    }
                    if (distance < wEntry.distance) {
                        wEntry.distance = distance;
                        wEntry.predecessor = v;
                        pq.decrease(w, distance)
                    }
                };
                g.nodes().forEach(function(v) {
                    var distance = v === source ? 0 : Number.POSITIVE_INFINITY;
                    results[v] = {
                        distance: distance
                    };
                    pq.add(v, distance)
                });
                while (pq.size() > 0) {
                    v = pq.removeMin();
                    vEntry = results[v];
                    if (vEntry.distance === Number.POSITIVE_INFINITY) {
                        break
                    }
                    edgeFn(v).forEach(updateNeighbors)
                }
                return results
            }
        }, {
            "../data/priority-queue": 45,
            "../lodash": 49
        }],
        36: [function(require, module, exports) {
            var _ = require("../lodash"),
                tarjan = require("./tarjan");
            module.exports = findCycles;

            function findCycles(g) {
                return _.filter(tarjan(g), function(cmpt) {
                    return cmpt.length > 1 || cmpt.length === 1 && g.hasEdge(cmpt[0], cmpt[0])
                })
            }
        }, {
            "../lodash": 49,
            "./tarjan": 43
        }],
        37: [function(require, module, exports) {
            var _ = require("../lodash");
            module.exports = floydWarshall;
            var DEFAULT_WEIGHT_FUNC = _.constant(1);

            function floydWarshall(g, weightFn, edgeFn) {
                return runFloydWarshall(g, weightFn || DEFAULT_WEIGHT_FUNC, edgeFn || function(v) {
                    return g.outEdges(v)
                })
            }

            function runFloydWarshall(g, weightFn, edgeFn) {
                var results = {},
                    nodes = g.nodes();
                nodes.forEach(function(v) {
                    results[v] = {};
                    results[v][v] = {
                        distance: 0
                    };
                    nodes.forEach(function(w) {
                        if (v !== w) {
                            results[v][w] = {
                                distance: Number.POSITIVE_INFINITY
                            }
                        }
                    });
                    edgeFn(v).forEach(function(edge) {
                        var w = edge.v === v ? edge.w : edge.v,
                            d = weightFn(edge);
                        results[v][w] = {
                            distance: d,
                            predecessor: v
                        }
                    })
                });
                nodes.forEach(function(k) {
                    var rowK = results[k];
                    nodes.forEach(function(i) {
                        var rowI = results[i];
                        nodes.forEach(function(j) {
                            var ik = rowI[k];
                            var kj = rowK[j];
                            var ij = rowI[j];
                            var altDistance = ik.distance + kj.distance;
                            if (altDistance < ij.distance) {
                                ij.distance = altDistance;
                                ij.predecessor = kj.predecessor
                            }
                        })
                    })
                });
                return results
            }
        }, {
            "../lodash": 49
        }],
        38: [function(require, module, exports) {
            module.exports = {
                components: require("./components"),
                dijkstra: require("./dijkstra"),
                dijkstraAll: require("./dijkstra-all"),
                findCycles: require("./find-cycles"),
                floydWarshall: require("./floyd-warshall"),
                isAcyclic: require("./is-acyclic"),
                postorder: require("./postorder"),
                preorder: require("./preorder"),
                prim: require("./prim"),
                tarjan: require("./tarjan"),
                topsort: require("./topsort")
            }
        }, {
            "./components": 32,
            "./dijkstra": 35,
            "./dijkstra-all": 34,
            "./find-cycles": 36,
            "./floyd-warshall": 37,
            "./is-acyclic": 39,
            "./postorder": 40,
            "./preorder": 41,
            "./prim": 42,
            "./tarjan": 43,
            "./topsort": 44
        }],
        39: [function(require, module, exports) {
            var topsort = require("./topsort");
            module.exports = isAcyclic;

            function isAcyclic(g) {
                try {
                    topsort(g)
                } catch (e) {
                    if (e instanceof topsort.CycleException) {
                        return false
                    }
                    throw e
                }
                return true
            }
        }, {
            "./topsort": 44
        }],
        40: [function(require, module, exports) {
            var dfs = require("./dfs");
            module.exports = postorder;

            function postorder(g, vs) {
                return dfs(g, vs, "post")
            }
        }, {
            "./dfs": 33
        }],
        41: [function(require, module, exports) {
            var dfs = require("./dfs");
            module.exports = preorder;

            function preorder(g, vs) {
                return dfs(g, vs, "pre")
            }
        }, {
            "./dfs": 33
        }],
        42: [function(require, module, exports) {
            var _ = require("../lodash"),
                Graph = require("../graph"),
                PriorityQueue = require("../data/priority-queue");
            module.exports = prim;

            function prim(g, weightFunc) {
                var result = new Graph,
                    parents = {},
                    pq = new PriorityQueue,
                    v;

                function updateNeighbors(edge) {
                    var w = edge.v === v ? edge.w : edge.v,
                        pri = pq.priority(w);
                    if (pri !== undefined) {
                        var edgeWeight = weightFunc(edge);
                        if (edgeWeight < pri) {
                            parents[w] = v;
                            pq.decrease(w, edgeWeight)
                        }
                    }
                }
                if (g.nodeCount() === 0) {
                    return result
                }
                _.each(g.nodes(), function(v) {
                    pq.add(v, Number.POSITIVE_INFINITY);
                    result.setNode(v)
                });
                pq.decrease(g.nodes()[0], 0);
                var init = false;
                while (pq.size() > 0) {
                    v = pq.removeMin();
                    if (_.has(parents, v)) {
                        result.setEdge(v, parents[v])
                    } else if (init) {
                        throw new Error("Input graph is not connected: " + g)
                    } else {
                        init = true
                    }
                    g.nodeEdges(v).forEach(updateNeighbors)
                }
                return result
            }
        }, {
            "../data/priority-queue": 45,
            "../graph": 46,
            "../lodash": 49
        }],
        43: [function(require, module, exports) {
            var _ = require("../lodash");
            module.exports = tarjan;

            function tarjan(g) {
                var index = 0,
                    stack = [],
                    visited = {},
                    results = [];

                function dfs(v) {
                    var entry = visited[v] = {
                        onStack: true,
                        lowlink: index,
                        index: index++
                    };
                    stack.push(v);
                    g.successors(v).forEach(function(w) {
                        if (!_.has(visited, w)) {
                            dfs(w);
                            entry.lowlink = Math.min(entry.lowlink, visited[w].lowlink)
                        } else if (visited[w].onStack) {
                            entry.lowlink = Math.min(entry.lowlink, visited[w].index)
                        }
                    });
                    if (entry.lowlink === entry.index) {
                        var cmpt = [],
                            w;
                        do {
                            w = stack.pop();
                            visited[w].onStack = false;
                            cmpt.push(w)
                        } while (v !== w);
                        results.push(cmpt)
                    }
                }
                g.nodes().forEach(function(v) {
                    if (!_.has(visited, v)) {
                        dfs(v)
                    }
                });
                return results
            }
        }, {
            "../lodash": 49
        }],
        44: [function(require, module, exports) {
            var _ = require("../lodash");
            module.exports = topsort;
            topsort.CycleException = CycleException;

            function topsort(g) {
                var visited = {},
                    stack = {},
                    results = [];

                function visit(node) {
                    if (_.has(stack, node)) {
                        throw new CycleException
                    }
                    if (!_.has(visited, node)) {
                        stack[node] = true;
                        visited[node] = true;
                        _.each(g.predecessors(node), visit);
                        delete stack[node];
                        results.push(node)
                    }
                }
                _.each(g.sinks(), visit);
                if (_.size(visited) !== g.nodeCount()) {
                    throw new CycleException
                }
                return results
            }

            function CycleException() {}
        }, {
            "../lodash": 49
        }],
        45: [function(require, module, exports) {
            var _ = require("../lodash");
            module.exports = PriorityQueue;

            function PriorityQueue() {
                this._arr = [];
                this._keyIndices = {}
            }
            PriorityQueue.prototype.size = function() {
                return this._arr.length
            };
            PriorityQueue.prototype.keys = function() {
                return this._arr.map(function(x) {
                    return x.key
                })
            };
            PriorityQueue.prototype.has = function(key) {
                return _.has(this._keyIndices, key)
            };
            PriorityQueue.prototype.priority = function(key) {
                var index = this._keyIndices[key];
                if (index !== undefined) {
                    return this._arr[index].priority
                }
            };
            PriorityQueue.prototype.min = function() {
                if (this.size() === 0) {
                    throw new Error("Queue underflow")
                }
                return this._arr[0].key
            };
            PriorityQueue.prototype.add = function(key, priority) {
                var keyIndices = this._keyIndices;
                key = String(key);
                if (!_.has(keyIndices, key)) {
                    var arr = this._arr;
                    var index = arr.length;
                    keyIndices[key] = index;
                    arr.push({
                        key: key,
                        priority: priority
                    });
                    this._decrease(index);
                    return true
                }
                return false
            };
            PriorityQueue.prototype.removeMin = function() {
                this._swap(0, this._arr.length - 1);
                var min = this._arr.pop();
                delete this._keyIndices[min.key];
                this._heapify(0);
                return min.key
            };
            PriorityQueue.prototype.decrease = function(key, priority) {
                var index = this._keyIndices[key];
                if (priority > this._arr[index].priority) {
                    throw new Error("New priority is greater than current priority. " + "Key: " + key + " Old: " + this._arr[index].priority + " New: " + priority)
                }
                this._arr[index].priority = priority;
                this._decrease(index)
            };
            PriorityQueue.prototype._heapify = function(i) {
                var arr = this._arr;
                var l = 2 * i,
                    r = l + 1,
                    largest = i;
                if (l < arr.length) {
                    largest = arr[l].priority < arr[largest].priority ? l : largest;
                    if (r < arr.length) {
                        largest = arr[r].priority < arr[largest].priority ? r : largest
                    }
                    if (largest !== i) {
                        this._swap(i, largest);
                        this._heapify(largest)
                    }
                }
            };
            PriorityQueue.prototype._decrease = function(index) {
                var arr = this._arr;
                var priority = arr[index].priority;
                var parent;
                while (index !== 0) {
                    parent = index >> 1;
                    if (arr[parent].priority < priority) {
                        break
                    }
                    this._swap(index, parent);
                    index = parent
                }
            };
            PriorityQueue.prototype._swap = function(i, j) {
                var arr = this._arr;
                var keyIndices = this._keyIndices;
                var origArrI = arr[i];
                var origArrJ = arr[j];
                arr[i] = origArrJ;
                arr[j] = origArrI;
                keyIndices[origArrJ.key] = i;
                keyIndices[origArrI.key] = j
            }
        }, {
            "../lodash": 49
        }],
        46: [function(require, module, exports) {
            "use strict";
            var _ = require("./lodash");
            module.exports = Graph;
            var DEFAULT_EDGE_NAME = "\x00",
                GRAPH_NODE = "\x00",
                EDGE_KEY_DELIM = "";

            function Graph(opts) {
                this._isDirected = _.has(opts, "directed") ? opts.directed : true;
                this._isMultigraph = _.has(opts, "multigraph") ? opts.multigraph : false;
                this._isCompound = _.has(opts, "compound") ? opts.compound : false;
                this._label = undefined;
                this._defaultNodeLabelFn = _.constant(undefined);
                this._defaultEdgeLabelFn = _.constant(undefined);
                this._nodes = {};
                if (this._isCompound) {
                    this._parent = {};
                    this._children = {};
                    this._children[GRAPH_NODE] = {}
                }
                this._in = {};
                this._preds = {};
                this._out = {};
                this._sucs = {};
                this._edgeObjs = {};
                this._edgeLabels = {}
            }
            Graph.prototype._nodeCount = 0;
            Graph.prototype._edgeCount = 0;
            Graph.prototype.isDirected = function() {
                return this._isDirected
            };
            Graph.prototype.isMultigraph = function() {
                return this._isMultigraph
            };
            Graph.prototype.isCompound = function() {
                return this._isCompound
            };
            Graph.prototype.setGraph = function(label) {
                this._label = label;
                return this
            };
            Graph.prototype.graph = function() {
                return this._label
            };
            Graph.prototype.setDefaultNodeLabel = function(newDefault) {
                if (!_.isFunction(newDefault)) {
                    newDefault = _.constant(newDefault)
                }
                this._defaultNodeLabelFn = newDefault;
                return this
            };
            Graph.prototype.nodeCount = function() {
                return this._nodeCount
            };
            Graph.prototype.nodes = function() {
                return _.keys(this._nodes)
            };
            Graph.prototype.sources = function() {
                return _.filter(this.nodes(), function(v) {
                    return _.isEmpty(this._in[v])
                }, this)
            };
            Graph.prototype.sinks = function() {
                return _.filter(this.nodes(), function(v) {
                    return _.isEmpty(this._out[v])
                }, this)
            };
            Graph.prototype.setNodes = function(vs, value) {
                var args = arguments;
                _.each(vs, function(v) {
                    if (args.length > 1) {
                        this.setNode(v, value)
                    } else {
                        this.setNode(v)
                    }
                }, this);
                return this
            };
            Graph.prototype.setNode = function(v, value) {
                if (_.has(this._nodes, v)) {
                    if (arguments.length > 1) {
                        this._nodes[v] = value
                    }
                    return this
                }
                this._nodes[v] = arguments.length > 1 ? value : this._defaultNodeLabelFn(v);
                if (this._isCompound) {
                    this._parent[v] = GRAPH_NODE;
                    this._children[v] = {};
                    this._children[GRAPH_NODE][v] = true
                }
                this._in[v] = {};
                this._preds[v] = {};
                this._out[v] = {};
                this._sucs[v] = {};
                ++this._nodeCount;
                return this
            };
            Graph.prototype.node = function(v) {
                return this._nodes[v]
            };
            Graph.prototype.hasNode = function(v) {
                return _.has(this._nodes, v)
            };
            Graph.prototype.removeNode = function(v) {
                var self = this;
                if (_.has(this._nodes, v)) {
                    var removeEdge = function(e) {
                        self.removeEdge(self._edgeObjs[e])
                    };
                    delete this._nodes[v];
                    if (this._isCompound) {
                        this._removeFromParentsChildList(v);
                        delete this._parent[v];
                        _.each(this.children(v), function(child) {
                            this.setParent(child)
                        }, this);
                        delete this._children[v]
                    }
                    _.each(_.keys(this._in[v]), removeEdge);
                    delete this._in[v];
                    delete this._preds[v];
                    _.each(_.keys(this._out[v]), removeEdge);
                    delete this._out[v];
                    delete this._sucs[v];
                    --this._nodeCount
                }
                return this
            };
            Graph.prototype.setParent = function(v, parent) {
                if (!this._isCompound) {
                    throw new Error("Cannot set parent in a non-compound graph")
                }
                if (_.isUndefined(parent)) {
                    parent = GRAPH_NODE
                } else {
                    parent += "";
                    for (var ancestor = parent; !_.isUndefined(ancestor); ancestor = this.parent(ancestor)) {
                        if (ancestor === v) {
                            throw new Error("Setting " + parent + " as parent of " + v + " would create create a cycle")
                        }
                    }
                    this.setNode(parent)
                }
                this.setNode(v);
                this._removeFromParentsChildList(v);
                this._parent[v] = parent;
                this._children[parent][v] = true;
                return this
            };
            Graph.prototype._removeFromParentsChildList = function(v) {
                delete this._children[this._parent[v]][v]
            };
            Graph.prototype.parent = function(v) {
                if (this._isCompound) {
                    var parent = this._parent[v];
                    if (parent !== GRAPH_NODE) {
                        return parent
                    }
                }
            };
            Graph.prototype.children = function(v) {
                if (_.isUndefined(v)) {
                    v = GRAPH_NODE
                }
                if (this._isCompound) {
                    var children = this._children[v];
                    if (children) {
                        return _.keys(children)
                    }
                } else if (v === GRAPH_NODE) {
                    return this.nodes()
                } else if (this.hasNode(v)) {
                    return []
                }
            };
            Graph.prototype.predecessors = function(v) {
                var predsV = this._preds[v];
                if (predsV) {
                    return _.keys(predsV)
                }
            };
            Graph.prototype.successors = function(v) {
                var sucsV = this._sucs[v];
                if (sucsV) {
                    return _.keys(sucsV)
                }
            };
            Graph.prototype.neighbors = function(v) {
                var preds = this.predecessors(v);
                if (preds) {
                    return _.union(preds, this.successors(v))
                }
            };
            Graph.prototype.setDefaultEdgeLabel = function(newDefault) {
                if (!_.isFunction(newDefault)) {
                    newDefault = _.constant(newDefault)
                }
                this._defaultEdgeLabelFn = newDefault;
                return this
            };
            Graph.prototype.edgeCount = function() {
                return this._edgeCount
            };
            Graph.prototype.edges = function() {
                return _.values(this._edgeObjs)
            };
            Graph.prototype.setPath = function(vs, value) {
                var self = this,
                    args = arguments;
                _.reduce(vs, function(v, w) {
                    if (args.length > 1) {
                        self.setEdge(v, w, value)
                    } else {
                        self.setEdge(v, w)
                    }
                    return w
                });
                return this
            };
            Graph.prototype.setEdge = function() {
                var v, w, name, value, valueSpecified = false;
                if (_.isPlainObject(arguments[0])) {
                    v = arguments[0].v;
                    w = arguments[0].w;
                    name = arguments[0].name;
                    if (arguments.length === 2) {
                        value = arguments[1];
                        valueSpecified = true
                    }
                } else {
                    v = arguments[0];
                    w = arguments[1];
                    name = arguments[3];
                    if (arguments.length > 2) {
                        value = arguments[2];
                        valueSpecified = true
                    }
                }
                v = "" + v;
                w = "" + w;
                if (!_.isUndefined(name)) {
                    name = "" + name
                }
                var e = edgeArgsToId(this._isDirected, v, w, name);
                if (_.has(this._edgeLabels, e)) {
                    if (valueSpecified) {
                        this._edgeLabels[e] = value
                    }
                    return this
                }
                if (!_.isUndefined(name) && !this._isMultigraph) {
                    throw new Error("Cannot set a named edge when isMultigraph = false")
                }
                this.setNode(v);
                this.setNode(w);
                this._edgeLabels[e] = valueSpecified ? value : this._defaultEdgeLabelFn(v, w, name);
                var edgeObj = edgeArgsToObj(this._isDirected, v, w, name);
                v = edgeObj.v;
                w = edgeObj.w;
                Object.freeze(edgeObj);
                this._edgeObjs[e] = edgeObj;
                incrementOrInitEntry(this._preds[w], v);
                incrementOrInitEntry(this._sucs[v], w);
                this._in[w][e] = edgeObj;
                this._out[v][e] = edgeObj;
                this._edgeCount++;
                return this
            };
            Graph.prototype.edge = function(v, w, name) {
                var e = arguments.length === 1 ? edgeObjToId(this._isDirected, arguments[0]) : edgeArgsToId(this._isDirected, v, w, name);
                return this._edgeLabels[e]
            };
            Graph.prototype.hasEdge = function(v, w, name) {
                var e = arguments.length === 1 ? edgeObjToId(this._isDirected, arguments[0]) : edgeArgsToId(this._isDirected, v, w, name);
                return _.has(this._edgeLabels, e)
            };
            Graph.prototype.removeEdge = function(v, w, name) {
                var e = arguments.length === 1 ? edgeObjToId(this._isDirected, arguments[0]) : edgeArgsToId(this._isDirected, v, w, name),
                    edge = this._edgeObjs[e];
                if (edge) {
                    v = edge.v;
                    w = edge.w;
                    delete this._edgeLabels[e];
                    delete this._edgeObjs[e];
                    decrementOrRemoveEntry(this._preds[w], v);
                    decrementOrRemoveEntry(this._sucs[v], w);
                    delete this._in[w][e];
                    delete this._out[v][e];
                    this._edgeCount--
                }
                return this
            };
            Graph.prototype.inEdges = function(v, u) {
                var inV = this._in[v];
                if (inV) {
                    var edges = _.values(inV);
                    if (!u) {
                        return edges
                    }
                    return _.filter(edges, function(edge) {
                        return edge.v === u
                    })
                }
            };
            Graph.prototype.outEdges = function(v, w) {
                var outV = this._out[v];
                if (outV) {
                    var edges = _.values(outV);
                    if (!w) {
                        return edges
                    }
                    return _.filter(edges, function(edge) {
                        return edge.w === w
                    })
                }
            };
            Graph.prototype.nodeEdges = function(v, w) {
                var inEdges = this.inEdges(v, w);
                if (inEdges) {
                    return inEdges.concat(this.outEdges(v, w))
                }
            };

            function incrementOrInitEntry(map, k) {
                if (_.has(map, k)) {
                    map[k]++
                } else {
                    map[k] = 1
                }
            }

            function decrementOrRemoveEntry(map, k) {
                if (!--map[k]) {
                    delete map[k]
                }
            }

            function edgeArgsToId(isDirected, v, w, name) {
                if (!isDirected && v > w) {
                    var tmp = v;
                    v = w;
                    w = tmp
                }
                return v + EDGE_KEY_DELIM + w + EDGE_KEY_DELIM + (_.isUndefined(name) ? DEFAULT_EDGE_NAME : name)
            }

            function edgeArgsToObj(isDirected, v, w, name) {
                if (!isDirected && v > w) {
                    var tmp = v;
                    v = w;
                    w = tmp
                }
                var edgeObj = {
                    v: v,
                    w: w
                };
                if (name) {
                    edgeObj.name = name
                }
                return edgeObj
            }

            function edgeObjToId(isDirected, edgeObj) {
                return edgeArgsToId(isDirected, edgeObj.v, edgeObj.w, edgeObj.name)
            }
        }, {
            "./lodash": 49
        }],
        47: [function(require, module, exports) {
            module.exports = {
                Graph: require("./graph"),
                version: require("./version")
            }
        }, {
            "./graph": 46,
            "./version": 50
        }],
        48: [function(require, module, exports) {
            var _ = require("./lodash"),
                Graph = require("./graph");
            module.exports = {
                write: write,
                read: read
            };

            function write(g) {
                var json = {
                    options: {
                        directed: g.isDirected(),
                        multigraph: g.isMultigraph(),
                        compound: g.isCompound()
                    },
                    nodes: writeNodes(g),
                    edges: writeEdges(g)
                };
                if (!_.isUndefined(g.graph())) {
                    json.value = _.clone(g.graph())
                }
                return json
            }

            function writeNodes(g) {
                return _.map(g.nodes(), function(v) {
                    var nodeValue = g.node(v),
                        parent = g.parent(v),
                        node = {
                            v: v
                        };
                    if (!_.isUndefined(nodeValue)) {
                        node.value = nodeValue
                    }
                    if (!_.isUndefined(parent)) {
                        node.parent = parent
                    }
                    return node
                })
            }

            function writeEdges(g) {
                return _.map(g.edges(), function(e) {
                    var edgeValue = g.edge(e),
                        edge = {
                            v: e.v,
                            w: e.w
                        };
                    if (!_.isUndefined(e.name)) {
                        edge.name = e.name
                    }
                    if (!_.isUndefined(edgeValue)) {
                        edge.value = edgeValue
                    }
                    return edge
                })
            }

            function read(json) {
                var g = new Graph(json.options).setGraph(json.value);
                _.each(json.nodes, function(entry) {
                    g.setNode(entry.v, entry.value);
                    if (entry.parent) {
                        g.setParent(entry.v, entry.parent)
                    }
                });
                _.each(json.edges, function(entry) {
                    g.setEdge({
                        v: entry.v,
                        w: entry.w,
                        name: entry.name
                    }, entry.value)
                });
                return g
            }
        }, {
            "./graph": 46,
            "./lodash": 49
        }],
        49: [function(require, module, exports) {
            module.exports = require(10)
        }, {
            "/Users/cpettitt/projects/dagre/lib/lodash.js": 10,
            lodash: 51
        }],
        50: [function(require, module, exports) {
            module.exports = "1.0.5"
        }, {}],
        51: [function(require, module, exports) {
            (function(global) {
                (function() {
                    var undefined;
                    var VERSION = "3.10.0";
                    var BIND_FLAG = 1,
                        BIND_KEY_FLAG = 2,
                        CURRY_BOUND_FLAG = 4,
                        CURRY_FLAG = 8,
                        CURRY_RIGHT_FLAG = 16,
                        PARTIAL_FLAG = 32,
                        PARTIAL_RIGHT_FLAG = 64,
                        ARY_FLAG = 128,
                        REARG_FLAG = 256;
                    var DEFAULT_TRUNC_LENGTH = 30,
                        DEFAULT_TRUNC_OMISSION = "...";
                    var HOT_COUNT = 150,
                        HOT_SPAN = 16;
                    var LARGE_ARRAY_SIZE = 200;
                    var LAZY_FILTER_FLAG = 1,
                        LAZY_MAP_FLAG = 2;
                    var FUNC_ERROR_TEXT = "Expected a function";
                    var PLACEHOLDER = "__lodash_placeholder__";
                    var argsTag = "[object Arguments]",
                        arrayTag = "[object Array]",
                        boolTag = "[object Boolean]",
                        dateTag = "[object Date]",
                        errorTag = "[object Error]",
                        funcTag = "[object Function]",
                        mapTag = "[object Map]",
                        numberTag = "[object Number]",
                        objectTag = "[object Object]",
                        regexpTag = "[object RegExp]",
                        setTag = "[object Set]",
                        stringTag = "[object String]",
                        weakMapTag = "[object WeakMap]";
                    var arrayBufferTag = "[object ArrayBuffer]",
                        float32Tag = "[object Float32Array]",
                        float64Tag = "[object Float64Array]",
                        int8Tag = "[object Int8Array]",
                        int16Tag = "[object Int16Array]",
                        int32Tag = "[object Int32Array]",
                        uint8Tag = "[object Uint8Array]",
                        uint8ClampedTag = "[object Uint8ClampedArray]",
                        uint16Tag = "[object Uint16Array]",
                        uint32Tag = "[object Uint32Array]";
                    var reEmptyStringLeading = /\b__p \+= '';/g,
                        reEmptyStringMiddle = /\b(__p \+=) '' \+/g,
                        reEmptyStringTrailing = /(__e\(.*?\)|\b__t\)) \+\n'';/g;
                    var reEscapedHtml = /&(?:amp|lt|gt|quot|#39|#96);/g,
                        reUnescapedHtml = /[&<>"'`]/g,
                        reHasEscapedHtml = RegExp(reEscapedHtml.source),
                        reHasUnescapedHtml = RegExp(reUnescapedHtml.source);
                    var reEscape = /<%-([\s\S]+?)%>/g,
                        reEvaluate = /<%([\s\S]+?)%>/g,
                        reInterpolate = /<%=([\s\S]+?)%>/g;
                    var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\n\\]|\\.)*?\1)\]/,
                        reIsPlainProp = /^\w*$/,
                        rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\n\\]|\\.)*?)\2)\]/g;
                    var reRegExpChars = /^[:!,]|[\\^$.*+?()[\]{}|\/]|(^[0-9a-fA-Fnrtuvx])|([\n\r\u2028\u2029])/g,
                        reHasRegExpChars = RegExp(reRegExpChars.source);
                    var reComboMark = /[\u0300-\u036f\ufe20-\ufe23]/g;
                    var reEscapeChar = /\\(\\)?/g;
                    var reEsTemplate = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g;
                    var reFlags = /\w*$/;
                    var reHasHexPrefix = /^0[xX]/;
                    var reIsHostCtor = /^\[object .+?Constructor\]$/;
                    var reIsUint = /^\d+$/;
                    var reLatin1 = /[\xc0-\xd6\xd8-\xde\xdf-\xf6\xf8-\xff]/g;
                    var reNoMatch = /($^)/;
                    var reUnescapedString = /['\n\r\u2028\u2029\\]/g;
                    var reWords = function() {
                        var upper = "[A-Z\\xc0-\\xd6\\xd8-\\xde]",
                            lower = "[a-z\\xdf-\\xf6\\xf8-\\xff]+";
                        return RegExp(upper + "+(?=" + upper + lower + ")|" + upper + "?" + lower + "|" + upper + "+|[0-9]+", "g")
                    }();
                    var contextProps = ["Array", "ArrayBuffer", "Date", "Error", "Float32Array", "Float64Array", "Function", "Int8Array", "Int16Array", "Int32Array", "Math", "Number", "Object", "RegExp", "Set", "String", "_", "clearTimeout", "isFinite", "parseFloat", "parseInt", "setTimeout", "TypeError", "Uint8Array", "Uint8ClampedArray", "Uint16Array", "Uint32Array", "WeakMap"];
                    var templateCounter = -1;
                    var typedArrayTags = {};
                    typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
                    typedArrayTags[argsTag] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;
                    var cloneableTags = {};
                    cloneableTags[argsTag] = cloneableTags[arrayTag] = cloneableTags[arrayBufferTag] = cloneableTags[boolTag] = cloneableTags[dateTag] = cloneableTags[float32Tag] = cloneableTags[float64Tag] = cloneableTags[int8Tag] = cloneableTags[int16Tag] = cloneableTags[int32Tag] = cloneableTags[numberTag] = cloneableTags[objectTag] = cloneableTags[regexpTag] = cloneableTags[stringTag] = cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] = cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
                    cloneableTags[errorTag] = cloneableTags[funcTag] = cloneableTags[mapTag] = cloneableTags[setTag] = cloneableTags[weakMapTag] = false;
                    var deburredLetters = {
                        "À": "A",
                        "Á": "A",
                        "Â": "A",
                        "Ã": "A",
                        "Ä": "A",
                        "Å": "A",
                        "à": "a",
                        "á": "a",
                        "â": "a",
                        "ã": "a",
                        "ä": "a",
                        "å": "a",
                        "Ç": "C",
                        "ç": "c",
                        "Ð": "D",
                        "ð": "d",
                        "È": "E",
                        "É": "E",
                        "Ê": "E",
                        "Ë": "E",
                        "è": "e",
                        "é": "e",
                        "ê": "e",
                        "ë": "e",
                        "Ì": "I",
                        "Í": "I",
                        "Î": "I",
                        "Ï": "I",
                        "ì": "i",
                        "í": "i",
                        "î": "i",
                        "ï": "i",
                        "Ñ": "N",
                        "ñ": "n",
                        "Ò": "O",
                        "Ó": "O",
                        "Ô": "O",
                        "Õ": "O",
                        "Ö": "O",
                        "Ø": "O",
                        "ò": "o",
                        "ó": "o",
                        "ô": "o",
                        "õ": "o",
                        "ö": "o",
                        "ø": "o",
                        "Ù": "U",
                        "Ú": "U",
                        "Û": "U",
                        "Ü": "U",
                        "ù": "u",
                        "ú": "u",
                        "û": "u",
                        "ü": "u",
                        "Ý": "Y",
                        "ý": "y",
                        "ÿ": "y",
                        "Æ": "Ae",
                        "æ": "ae",
                        "Þ": "Th",
                        "þ": "th",
                        "ß": "ss"
                    };
                    var htmlEscapes = {
                        "&": "&amp;",
                        "<": "&lt;",
                        ">": "&gt;",
                        '"': "&quot;",
                        "'": "&#39;",
                        "`": "&#96;"
                    };
                    var htmlUnescapes = {
                        "&amp;": "&",
                        "&lt;": "<",
                        "&gt;": ">",
                        "&quot;": '"',
                        "&#39;": "'",
                        "&#96;": "`"
                    };
                    var objectTypes = {
                        "function": true,
                        object: true
                    };
                    var regexpEscapes = {
                        0: "x30",
                        1: "x31",
                        2: "x32",
                        3: "x33",
                        4: "x34",
                        5: "x35",
                        6: "x36",
                        7: "x37",
                        8: "x38",
                        9: "x39",
                        A: "x41",
                        B: "x42",
                        C: "x43",
                        D: "x44",
                        E: "x45",
                        F: "x46",
                        a: "x61",
                        b: "x62",
                        c: "x63",
                        d: "x64",
                        e: "x65",
                        f: "x66",
                        n: "x6e",
                        r: "x72",
                        t: "x74",
                        u: "x75",
                        v: "x76",
                        x: "x78"
                    };
                    var stringEscapes = {
                        "\\": "\\",
                        "'": "'",
                        "\n": "n",
                        "\r": "r",
                        "\u2028": "u2028",
                        "\u2029": "u2029"
                    };
                    var freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports;
                    var freeModule = objectTypes[typeof module] && module && !module.nodeType && module;
                    var freeGlobal = freeExports && freeModule && typeof global == "object" && global && global.Object && global;
                    var freeSelf = objectTypes[typeof self] && self && self.Object && self;
                    var freeWindow = objectTypes[typeof window] && window && window.Object && window;
                    var moduleExports = freeModule && freeModule.exports === freeExports && freeExports;
                    var root = freeGlobal || freeWindow !== (this && this.window) && freeWindow || freeSelf || this;

                    function baseCompareAscending(value, other) {
                        if (value !== other) {
                            var valIsNull = value === null,
                                valIsUndef = value === undefined,
                                valIsReflexive = value === value;
                            var othIsNull = other === null,
                                othIsUndef = other === undefined,
                                othIsReflexive = other === other;
                            if (value > other && !othIsNull || !valIsReflexive || valIsNull && !othIsUndef && othIsReflexive || valIsUndef && othIsReflexive) {
                                return 1
                            }
                            if (value < other && !valIsNull || !othIsReflexive || othIsNull && !valIsUndef && valIsReflexive || othIsUndef && valIsReflexive) {
                                return -1
                            }
                        }
                        return 0
                    }

                    function baseFindIndex(array, predicate, fromRight) {
                        var length = array.length,
                            index = fromRight ? length : -1;
                        while (fromRight ? index-- : ++index < length) {
                            if (predicate(array[index], index, array)) {
                                return index
                            }
                        }
                        return -1
                    }

                    function baseIndexOf(array, value, fromIndex) {
                        if (value !== value) {
                            return indexOfNaN(array, fromIndex)
                        }
                        var index = fromIndex - 1,
                            length = array.length;
                        while (++index < length) {
                            if (array[index] === value) {
                                return index
                            }
                        }
                        return -1
                    }

                    function baseIsFunction(value) {
                        return typeof value == "function" || false
                    }

                    function baseToString(value) {
                        return value == null ? "" : value + ""
                    }

                    function charsLeftIndex(string, chars) {
                        var index = -1,
                            length = string.length;
                        while (++index < length && chars.indexOf(string.charAt(index)) > -1) {}
                        return index
                    }

                    function charsRightIndex(string, chars) {
                        var index = string.length;
                        while (index-- && chars.indexOf(string.charAt(index)) > -1) {}
                        return index
                    }

                    function compareAscending(object, other) {
                        return baseCompareAscending(object.criteria, other.criteria) || object.index - other.index
                    }

                    function compareMultiple(object, other, orders) {
                        var index = -1,
                            objCriteria = object.criteria,
                            othCriteria = other.criteria,
                            length = objCriteria.length,
                            ordersLength = orders.length;
                        while (++index < length) {
                            var result = baseCompareAscending(objCriteria[index], othCriteria[index]);
                            if (result) {
                                if (index >= ordersLength) {
                                    return result
                                }
                                var order = orders[index];
                                return result * (order === "asc" || order === true ? 1 : -1)
                            }
                        }
                        return object.index - other.index
                    }

                    function deburrLetter(letter) {
                        return deburredLetters[letter]
                    }

                    function escapeHtmlChar(chr) {
                        return htmlEscapes[chr]
                    }

                    function escapeRegExpChar(chr, leadingChar, whitespaceChar) {
                        if (leadingChar) {
                            chr = regexpEscapes[chr]
                        } else if (whitespaceChar) {
                            chr = stringEscapes[chr]
                        }
                        return "\\" + chr
                    }

                    function escapeStringChar(chr) {
                        return "\\" + stringEscapes[chr]
                    }

                    function indexOfNaN(array, fromIndex, fromRight) {
                        var length = array.length,
                            index = fromIndex + (fromRight ? 0 : -1);
                        while (fromRight ? index-- : ++index < length) {
                            var other = array[index];
                            if (other !== other) {
                                return index
                            }
                        }
                        return -1
                    }

                    function isObjectLike(value) {
                        return !!value && typeof value == "object"
                    }

                    function isSpace(charCode) {
                        return charCode <= 160 && (charCode >= 9 && charCode <= 13) || charCode == 32 || charCode == 160 || charCode == 5760 || charCode == 6158 || charCode >= 8192 && (charCode <= 8202 || charCode == 8232 || charCode == 8233 || charCode == 8239 || charCode == 8287 || charCode == 12288 || charCode == 65279)
                    }

                    function replaceHolders(array, placeholder) {
                        var index = -1,
                            length = array.length,
                            resIndex = -1,
                            result = [];
                        while (++index < length) {
                            if (array[index] === placeholder) {
                                array[index] = PLACEHOLDER;
                                result[++resIndex] = index
                            }
                        }
                        return result
                    }

                    function sortedUniq(array, iteratee) {
                        var seen, index = -1,
                            length = array.length,
                            resIndex = -1,
                            result = [];
                        while (++index < length) {
                            var value = array[index],
                                computed = iteratee ? iteratee(value, index, array) : value;
                            if (!index || seen !== computed) {
                                seen = computed;
                                result[++resIndex] = value
                            }
                        }
                        return result
                    }

                    function trimmedLeftIndex(string) {
                        var index = -1,
                            length = string.length;
                        while (++index < length && isSpace(string.charCodeAt(index))) {}
                        return index
                    }

                    function trimmedRightIndex(string) {
                        var index = string.length;
                        while (index-- && isSpace(string.charCodeAt(index))) {}
                        return index
                    }

                    function unescapeHtmlChar(chr) {
                        return htmlUnescapes[chr]
                    }

                    function runInContext(context) {
                        context = context ? _.defaults(root.Object(), context, _.pick(root, contextProps)) : root;
                        var Array = context.Array,
                            Date = context.Date,
                            Error = context.Error,
                            Function = context.Function,
                            Math = context.Math,
                            Number = context.Number,
                            Object = context.Object,
                            RegExp = context.RegExp,
                            String = context.String,
                            TypeError = context.TypeError;
                        var arrayProto = Array.prototype,
                            objectProto = Object.prototype,
                            stringProto = String.prototype;
                        var fnToString = Function.prototype.toString;
                        var hasOwnProperty = objectProto.hasOwnProperty;
                        var idCounter = 0;
                        var objToString = objectProto.toString;
                        var oldDash = root._;
                        var reIsNative = RegExp("^" + fnToString.call(hasOwnProperty).replace(/[\\^$.*+?()[\]{}|]/g, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$");
                        var ArrayBuffer = context.ArrayBuffer,
                            clearTimeout = context.clearTimeout,
                            parseFloat = context.parseFloat,
                            pow = Math.pow,
                            propertyIsEnumerable = objectProto.propertyIsEnumerable,
                            Set = getNative(context, "Set"),
                            setTimeout = context.setTimeout,
                            splice = arrayProto.splice,
                            Uint8Array = context.Uint8Array,
                            WeakMap = getNative(context, "WeakMap");
                        var nativeCeil = Math.ceil,
                            nativeCreate = getNative(Object, "create"),
                            nativeFloor = Math.floor,
                            nativeIsArray = getNative(Array, "isArray"),
                            nativeIsFinite = context.isFinite,
                            nativeKeys = getNative(Object, "keys"),
                            nativeMax = Math.max,
                            nativeMin = Math.min,
                            nativeNow = getNative(Date, "now"),
                            nativeParseInt = context.parseInt,
                            nativeRandom = Math.random;
                        var NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY,
                            POSITIVE_INFINITY = Number.POSITIVE_INFINITY;
                        var MAX_ARRAY_LENGTH = 4294967295,
                            MAX_ARRAY_INDEX = MAX_ARRAY_LENGTH - 1,
                            HALF_MAX_ARRAY_LENGTH = MAX_ARRAY_LENGTH >>> 1;
                        var MAX_SAFE_INTEGER = 9007199254740991;
                        var metaMap = WeakMap && new WeakMap;
                        var realNames = {};

                        function lodash(value) {
                            if (isObjectLike(value) && !isArray(value) && !(value instanceof LazyWrapper)) {
                                if (value instanceof LodashWrapper) {
                                    return value
                                }
                                if (hasOwnProperty.call(value, "__chain__") && hasOwnProperty.call(value, "__wrapped__")) {
                                    return wrapperClone(value)
                                }
                            }
                            return new LodashWrapper(value)
                        }

                        function baseLodash() {}

                        function LodashWrapper(value, chainAll, actions) {
                            this.__wrapped__ = value;
                            this.__actions__ = actions || [];
                            this.__chain__ = !!chainAll
                        }
                        var support = lodash.support = {};
                        lodash.templateSettings = {
                            escape: reEscape,
                            evaluate: reEvaluate,
                            interpolate: reInterpolate,
                            variable: "",
                            imports: {
                                _: lodash
                            }
                        };

                        function LazyWrapper(value) {
                            this.__wrapped__ = value;
                            this.__actions__ = [];
                            this.__dir__ = 1;
                            this.__filtered__ = false;
                            this.__iteratees__ = [];
                            this.__takeCount__ = POSITIVE_INFINITY;
                            this.__views__ = []
                        }

                        function lazyClone() {
                            var result = new LazyWrapper(this.__wrapped__);
                            result.__actions__ = arrayCopy(this.__actions__);
                            result.__dir__ = this.__dir__;
                            result.__filtered__ = this.__filtered__;
                            result.__iteratees__ = arrayCopy(this.__iteratees__);
                            result.__takeCount__ = this.__takeCount__;
                            result.__views__ = arrayCopy(this.__views__);
                            return result
                        }

                        function lazyReverse() {
                            if (this.__filtered__) {
                                var result = new LazyWrapper(this);
                                result.__dir__ = -1;
                                result.__filtered__ = true
                            } else {
                                result = this.clone();
                                result.__dir__ *= -1
                            }
                            return result
                        }

                        function lazyValue() {
                            var array = this.__wrapped__.value(),
                                dir = this.__dir__,
                                isArr = isArray(array),
                                isRight = dir < 0,
                                arrLength = isArr ? array.length : 0,
                                view = getView(0, arrLength, this.__views__),
                                start = view.start,
                                end = view.end,
                                length = end - start,
                                index = isRight ? end : start - 1,
                                iteratees = this.__iteratees__,
                                iterLength = iteratees.length,
                                resIndex = 0,
                                takeCount = nativeMin(length, this.__takeCount__);
                            if (!isArr || arrLength < LARGE_ARRAY_SIZE || arrLength == length && takeCount == length) {
                                return baseWrapperValue(isRight && isArr ? array.reverse() : array, this.__actions__)
                            }
                            var result = [];
                            outer: while (length-- && resIndex < takeCount) {
                                index += dir;
                                var iterIndex = -1,
                                    value = array[index];
                                while (++iterIndex < iterLength) {
                                    var data = iteratees[iterIndex],
                                        iteratee = data.iteratee,
                                        type = data.type,
                                        computed = iteratee(value);
                                    if (type == LAZY_MAP_FLAG) {
                                        value = computed
                                    } else if (!computed) {
                                        if (type == LAZY_FILTER_FLAG) {
                                            continue outer
                                        } else {
                                            break outer
                                        }
                                    }
                                }
                                result[resIndex++] = value
                            }
                            return result
                        }

                        function MapCache() {
                            this.__data__ = {}
                        }

                        function mapDelete(key) {
                            return this.has(key) && delete this.__data__[key]
                        }

                        function mapGet(key) {
                            return key == "__proto__" ? undefined : this.__data__[key]
                        }

                        function mapHas(key) {
                            return key != "__proto__" && hasOwnProperty.call(this.__data__, key)
                        }

                        function mapSet(key, value) {
                            if (key != "__proto__") {
                                this.__data__[key] = value
                            }
                            return this
                        }

                        function SetCache(values) {
                            var length = values ? values.length : 0;
                            this.data = {
                                hash: nativeCreate(null),
                                set: new Set
                            };
                            while (length--) {
                                this.push(values[length])
                            }
                        }

                        function cacheIndexOf(cache, value) {
                            var data = cache.data,
                                result = typeof value == "string" || isObject(value) ? data.set.has(value) : data.hash[value];
                            return result ? 0 : -1
                        }

                        function cachePush(value) {
                            var data = this.data;
                            if (typeof value == "string" || isObject(value)) {
                                data.set.add(value)
                            } else {
                                data.hash[value] = true
                            }
                        }

                        function arrayConcat(array, other) {
                            var index = -1,
                                length = array.length,
                                othIndex = -1,
                                othLength = other.length,
                                result = Array(length + othLength);
                            while (++index < length) {
                                result[index] = array[index]
                            }
                            while (++othIndex < othLength) {
                                result[index++] = other[othIndex]
                            }
                            return result
                        }

                        function arrayCopy(source, array) {
                            var index = -1,
                                length = source.length;
                            array || (array = Array(length));
                            while (++index < length) {
                                array[index] = source[index]
                            }
                            return array
                        }

                        function arrayEach(array, iteratee) {
                            var index = -1,
                                length = array.length;
                            while (++index < length) {
                                if (iteratee(array[index], index, array) === false) {
                                    break
                                }
                            }
                            return array
                        }

                        function arrayEachRight(array, iteratee) {
                            var length = array.length;
                            while (length--) {
                                if (iteratee(array[length], length, array) === false) {
                                    break
                                }
                            }
                            return array
                        }

                        function arrayEvery(array, predicate) {
                            var index = -1,
                                length = array.length;
                            while (++index < length) {
                                if (!predicate(array[index], index, array)) {
                                    return false
                                }
                            }
                            return true
                        }

                        function arrayExtremum(array, iteratee, comparator, exValue) {
                            var index = -1,
                                length = array.length,
                                computed = exValue,
                                result = computed;
                            while (++index < length) {
                                var value = array[index],
                                    current = +iteratee(value);
                                if (comparator(current, computed)) {
                                    computed = current;
                                    result = value
                                }
                            }
                            return result
                        }

                        function arrayFilter(array, predicate) {
                            var index = -1,
                                length = array.length,
                                resIndex = -1,
                                result = [];
                            while (++index < length) {
                                var value = array[index];
                                if (predicate(value, index, array)) {
                                    result[++resIndex] = value
                                }
                            }
                            return result
                        }

                        function arrayMap(array, iteratee) {
                            var index = -1,
                                length = array.length,
                                result = Array(length);
                            while (++index < length) {
                                result[index] = iteratee(array[index], index, array)
                            }
                            return result
                        }

                        function arrayPush(array, values) {
                            var index = -1,
                                length = values.length,
                                offset = array.length;
                            while (++index < length) {
                                array[offset + index] = values[index]
                            }
                            return array
                        }

                        function arrayReduce(array, iteratee, accumulator, initFromArray) {
                            var index = -1,
                                length = array.length;
                            if (initFromArray && length) {
                                accumulator = array[++index]
                            }
                            while (++index < length) {
                                accumulator = iteratee(accumulator, array[index], index, array)
                            }
                            return accumulator
                        }

                        function arrayReduceRight(array, iteratee, accumulator, initFromArray) {
                            var length = array.length;
                            if (initFromArray && length) {
                                accumulator = array[--length]
                            }
                            while (length--) {
                                accumulator = iteratee(accumulator, array[length], length, array)
                            }
                            return accumulator
                        }

                        function arraySome(array, predicate) {
                            var index = -1,
                                length = array.length;
                            while (++index < length) {
                                if (predicate(array[index], index, array)) {
                                    return true
                                }
                            }
                            return false
                        }

                        function arraySum(array, iteratee) {
                            var length = array.length,
                                result = 0;
                            while (length--) {
                                result += +iteratee(array[length]) || 0
                            }
                            return result
                        }

                        function assignDefaults(objectValue, sourceValue) {
                            return objectValue === undefined ? sourceValue : objectValue
                        }

                        function assignOwnDefaults(objectValue, sourceValue, key, object) {
                            return objectValue === undefined || !hasOwnProperty.call(object, key) ? sourceValue : objectValue
                        }

                        function assignWith(object, source, customizer) {
                            var index = -1,
                                props = keys(source),
                                length = props.length;
                            while (++index < length) {
                                var key = props[index],
                                    value = object[key],
                                    result = customizer(value, source[key], key, object, source);
                                if ((result === result ? result !== value : value === value) || value === undefined && !(key in object)) {
                                    object[key] = result
                                }
                            }
                            return object
                        }

                        function baseAssign(object, source) {
                            return source == null ? object : baseCopy(source, keys(source), object)
                        }

                        function baseAt(collection, props) {
                            var index = -1,
                                isNil = collection == null,
                                isArr = !isNil && isArrayLike(collection),
                                length = isArr ? collection.length : 0,
                                propsLength = props.length,
                                result = Array(propsLength);
                            while (++index < propsLength) {
                                var key = props[index];
                                if (isArr) {
                                    result[index] = isIndex(key, length) ? collection[key] : undefined
                                } else {
                                    result[index] = isNil ? undefined : collection[key]
                                }
                            }
                            return result
                        }

                        function baseCopy(source, props, object) {
                            object || (object = {});
                            var index = -1,
                                length = props.length;
                            while (++index < length) {
                                var key = props[index];
                                object[key] = source[key]
                            }
                            return object
                        }

                        function baseCallback(func, thisArg, argCount) {
                            var type = typeof func;
                            if (type == "function") {
                                return thisArg === undefined ? func : bindCallback(func, thisArg, argCount)
                            }
                            if (func == null) {
                                return identity
                            }
                            if (type == "object") {
                                return baseMatches(func)
                            }
                            return thisArg === undefined ? property(func) : baseMatchesProperty(func, thisArg)
                        }

                        function baseClone(value, isDeep, customizer, key, object, stackA, stackB) {
                            var result;
                            if (customizer) {
                                result = object ? customizer(value, key, object) : customizer(value)
                            }
                            if (result !== undefined) {
                                return result
                            }
                            if (!isObject(value)) {
                                return value
                            }
                            var isArr = isArray(value);
                            if (isArr) {
                                result = initCloneArray(value);
                                if (!isDeep) {
                                    return arrayCopy(value, result)
                                }
                            } else {
                                var tag = objToString.call(value),
                                    isFunc = tag == funcTag;
                                if (tag == objectTag || tag == argsTag || isFunc && !object) {
                                    result = initCloneObject(isFunc ? {} : value);
                                    if (!isDeep) {
                                        return baseAssign(result, value)
                                    }
                                } else {
                                    return cloneableTags[tag] ? initCloneByTag(value, tag, isDeep) : object ? value : {}
                                }
                            }
                            stackA || (stackA = []);
                            stackB || (stackB = []);
                            var length = stackA.length;
                            while (length--) {
                                if (stackA[length] == value) {
                                    return stackB[length]
                                }
                            }
                            stackA.push(value);
                            stackB.push(result);
                            (isArr ? arrayEach : baseForOwn)(value, function(subValue, key) {
                                result[key] = baseClone(subValue, isDeep, customizer, key, value, stackA, stackB)
                            });
                            return result
                        }
                        var baseCreate = function() {
                            function object() {}
                            return function(prototype) {
                                if (isObject(prototype)) {
                                    object.prototype = prototype;
                                    var result = new object;
                                    object.prototype = undefined
                                }
                                return result || {}
                            }
                        }();

                        function baseDelay(func, wait, args) {
                            if (typeof func != "function") {
                                throw new TypeError(FUNC_ERROR_TEXT)
                            }
                            return setTimeout(function() {
                                func.apply(undefined, args)
                            }, wait)
                        }

                        function baseDifference(array, values) {
                            var length = array ? array.length : 0,
                                result = [];
                            if (!length) {
                                return result
                            }
                            var index = -1,
                                indexOf = getIndexOf(),
                                isCommon = indexOf == baseIndexOf,
                                cache = isCommon && values.length >= LARGE_ARRAY_SIZE ? createCache(values) : null,
                                valuesLength = values.length;
                            if (cache) {
                                indexOf = cacheIndexOf;
                                isCommon = false;
                                values = cache
                            }
                            outer: while (++index < length) {
                                var value = array[index];
                                if (isCommon && value === value) {
                                    var valuesIndex = valuesLength;
                                    while (valuesIndex--) {
                                        if (values[valuesIndex] === value) {
                                            continue outer
                                        }
                                    }
                                    result.push(value)
                                } else if (indexOf(values, value, 0) < 0) {
                                    result.push(value)
                                }
                            }
                            return result
                        }
                        var baseEach = createBaseEach(baseForOwn);
                        var baseEachRight = createBaseEach(baseForOwnRight, true);

                        function baseEvery(collection, predicate) {
                            var result = true;
                            baseEach(collection, function(value, index, collection) {
                                result = !!predicate(value, index, collection);
                                return result
                            });
                            return result
                        }

                        function baseExtremum(collection, iteratee, comparator, exValue) {
                            var computed = exValue,
                                result = computed;
                            baseEach(collection, function(value, index, collection) {
                                var current = +iteratee(value, index, collection);
                                if (comparator(current, computed) || current === exValue && current === result) {
                                    computed = current;
                                    result = value
                                }
                            });
                            return result
                        }

                        function baseFill(array, value, start, end) {
                            var length = array.length;
                            start = start == null ? 0 : +start || 0;
                            if (start < 0) {
                                start = -start > length ? 0 : length + start
                            }
                            end = end === undefined || end > length ? length : +end || 0;
                            if (end < 0) {
                                end += length
                            }
                            length = start > end ? 0 : end >>> 0;
                            start >>>= 0;
                            while (start < length) {
                                array[start++] = value
                            }
                            return array
                        }

                        function baseFilter(collection, predicate) {
                            var result = [];
                            baseEach(collection, function(value, index, collection) {
                                if (predicate(value, index, collection)) {
                                    result.push(value)
                                }
                            });
                            return result
                        }

                        function baseFind(collection, predicate, eachFunc, retKey) {
                            var result;
                            eachFunc(collection, function(value, key, collection) {
                                if (predicate(value, key, collection)) {
                                    result = retKey ? key : value;
                                    return false
                                }
                            });
                            return result
                        }

                        function baseFlatten(array, isDeep, isStrict, result) {
                            result || (result = []);
                            var index = -1,
                                length = array.length;
                            while (++index < length) {
                                var value = array[index];
                                if (isObjectLike(value) && isArrayLike(value) && (isStrict || isArray(value) || isArguments(value))) {
                                    if (isDeep) {
                                        baseFlatten(value, isDeep, isStrict, result)
                                    } else {
                                        arrayPush(result, value)
                                    }
                                } else if (!isStrict) {
                                    result[result.length] = value
                                }
                            }
                            return result
                        }
                        var baseFor = createBaseFor();
                        var baseForRight = createBaseFor(true);

                        function baseForIn(object, iteratee) {
                            return baseFor(object, iteratee, keysIn)
                        }

                        function baseForOwn(object, iteratee) {
                            return baseFor(object, iteratee, keys)
                        }

                        function baseForOwnRight(object, iteratee) {
                            return baseForRight(object, iteratee, keys)
                        }

                        function baseFunctions(object, props) {
                            var index = -1,
                                length = props.length,
                                resIndex = -1,
                                result = [];
                            while (++index < length) {
                                var key = props[index];
                                if (isFunction(object[key])) {
                                    result[++resIndex] = key
                                }
                            }
                            return result
                        }

                        function baseGet(object, path, pathKey) {
                            if (object == null) {
                                return
                            }
                            if (pathKey !== undefined && pathKey in toObject(object)) {
                                path = [pathKey]
                            }
                            var index = 0,
                                length = path.length;
                            while (object != null && index < length) {
                                object = object[path[index++]]
                            }
                            return index && index == length ? object : undefined
                        }

                        function baseIsEqual(value, other, customizer, isLoose, stackA, stackB) {
                            if (value === other) {
                                return true
                            }
                            if (value == null || other == null || !isObject(value) && !isObjectLike(other)) {
                                return value !== value && other !== other
                            }
                            return baseIsEqualDeep(value, other, baseIsEqual, customizer, isLoose, stackA, stackB)
                        }

                        function baseIsEqualDeep(object, other, equalFunc, customizer, isLoose, stackA, stackB) {
                            var objIsArr = isArray(object),
                                othIsArr = isArray(other),
                                objTag = arrayTag,
                                othTag = arrayTag;
                            if (!objIsArr) {
                                objTag = objToString.call(object);
                                if (objTag == argsTag) {
                                    objTag = objectTag
                                } else if (objTag != objectTag) {
                                    objIsArr = isTypedArray(object)
                                }
                            }
                            if (!othIsArr) {
                                othTag = objToString.call(other);
                                if (othTag == argsTag) {
                                    othTag = objectTag
                                } else if (othTag != objectTag) {
                                    othIsArr = isTypedArray(other)
                                }
                            }
                            var objIsObj = objTag == objectTag,
                                othIsObj = othTag == objectTag,
                                isSameTag = objTag == othTag;
                            if (isSameTag && !(objIsArr || objIsObj)) {
                                return equalByTag(object, other, objTag)
                            }
                            if (!isLoose) {
                                var objIsWrapped = objIsObj && hasOwnProperty.call(object, "__wrapped__"),
                                    othIsWrapped = othIsObj && hasOwnProperty.call(other, "__wrapped__");
                                if (objIsWrapped || othIsWrapped) {
                                    return equalFunc(objIsWrapped ? object.value() : object, othIsWrapped ? other.value() : other, customizer, isLoose, stackA, stackB)
                                }
                            }
                            if (!isSameTag) {
                                return false
                            }
                            stackA || (stackA = []);
                            stackB || (stackB = []);
                            var length = stackA.length;
                            while (length--) {
                                if (stackA[length] == object) {
                                    return stackB[length] == other
                                }
                            }
                            stackA.push(object);
                            stackB.push(other);
                            var result = (objIsArr ? equalArrays : equalObjects)(object, other, equalFunc, customizer, isLoose, stackA, stackB);
                            stackA.pop();
                            stackB.pop();
                            return result
                        }

                        function baseIsMatch(object, matchData, customizer) {
                            var index = matchData.length,
                                length = index,
                                noCustomizer = !customizer;
                            if (object == null) {
                                return !length
                            }
                            object = toObject(object);
                            while (index--) {
                                var data = matchData[index];
                                if (noCustomizer && data[2] ? data[1] !== object[data[0]] : !(data[0] in object)) {
                                    return false
                                }
                            }
                            while (++index < length) {
                                data = matchData[index];
                                var key = data[0],
                                    objValue = object[key],
                                    srcValue = data[1];
                                if (noCustomizer && data[2]) {
                                    if (objValue === undefined && !(key in object)) {
                                        return false
                                    }
                                } else {
                                    var result = customizer ? customizer(objValue, srcValue, key) : undefined;
                                    if (!(result === undefined ? baseIsEqual(srcValue, objValue, customizer, true) : result)) {
                                        return false
                                    }
                                }
                            }
                            return true
                        }

                        function baseMap(collection, iteratee) {
                            var index = -1,
                                result = isArrayLike(collection) ? Array(collection.length) : [];
                            baseEach(collection, function(value, key, collection) {
                                result[++index] = iteratee(value, key, collection)
                            });
                            return result
                        }

                        function baseMatches(source) {
                            var matchData = getMatchData(source);
                            if (matchData.length == 1 && matchData[0][2]) {
                                var key = matchData[0][0],
                                    value = matchData[0][1];
                                return function(object) {
                                    if (object == null) {
                                        return false
                                    }
                                    return object[key] === value && (value !== undefined || key in toObject(object))
                                }
                            }
                            return function(object) {
                                return baseIsMatch(object, matchData)
                            }
                        }

                        function baseMatchesProperty(path, srcValue) {
                            var isArr = isArray(path),
                                isCommon = isKey(path) && isStrictComparable(srcValue),
                                pathKey = path + "";
                            path = toPath(path);
                            return function(object) {
                                if (object == null) {
                                    return false
                                }
                                var key = pathKey;
                                object = toObject(object);
                                if ((isArr || !isCommon) && !(key in object)) {
                                    object = path.length == 1 ? object : baseGet(object, baseSlice(path, 0, -1));
                                    if (object == null) {
                                        return false
                                    }
                                    key = last(path);
                                    object = toObject(object)
                                }
                                return object[key] === srcValue ? srcValue !== undefined || key in object : baseIsEqual(srcValue, object[key], undefined, true)
                            }
                        }

                        function baseMerge(object, source, customizer, stackA, stackB) {
                            if (!isObject(object)) {
                                return object
                            }
                            var isSrcArr = isArrayLike(source) && (isArray(source) || isTypedArray(source)),
                                props = isSrcArr ? undefined : keys(source);
                            arrayEach(props || source, function(srcValue, key) {
                                if (props) {
                                    key = srcValue;
                                    srcValue = source[key]
                                }
                                if (isObjectLike(srcValue)) {
                                    stackA || (stackA = []);
                                    stackB || (stackB = []);
                                    baseMergeDeep(object, source, key, baseMerge, customizer, stackA, stackB)
                                } else {
                                    var value = object[key],
                                        result = customizer ? customizer(value, srcValue, key, object, source) : undefined,
                                        isCommon = result === undefined;
                                    if (isCommon) {
                                        result = srcValue
                                    }
                                    if ((result !== undefined || isSrcArr && !(key in object)) && (isCommon || (result === result ? result !== value : value === value))) {
                                        object[key] = result
                                    }
                                }
                            });
                            return object
                        }

                        function baseMergeDeep(object, source, key, mergeFunc, customizer, stackA, stackB) {
                            var length = stackA.length,
                                srcValue = source[key];
                            while (length--) {
                                if (stackA[length] == srcValue) {
                                    object[key] = stackB[length];
                                    return
                                }
                            }
                            var value = object[key],
                                result = customizer ? customizer(value, srcValue, key, object, source) : undefined,
                                isCommon = result === undefined;
                            if (isCommon) {
                                result = srcValue;
                                if (isArrayLike(srcValue) && (isArray(srcValue) || isTypedArray(srcValue))) {
                                    result = isArray(value) ? value : isArrayLike(value) ? arrayCopy(value) : []
                                } else if (isPlainObject(srcValue) || isArguments(srcValue)) {
                                    result = isArguments(value) ? toPlainObject(value) : isPlainObject(value) ? value : {}
                                } else {
                                    isCommon = false
                                }
                            }
                            stackA.push(srcValue);
                            stackB.push(result);
                            if (isCommon) {
                                object[key] = mergeFunc(result, srcValue, customizer, stackA, stackB)
                            } else if (result === result ? result !== value : value === value) {
                                object[key] = result
                            }
                        }

                        function baseProperty(key) {
                            return function(object) {
                                return object == null ? undefined : object[key]
                            }
                        }

                        function basePropertyDeep(path) {
                            var pathKey = path + "";
                            path = toPath(path);
                            return function(object) {
                                return baseGet(object, path, pathKey)
                            }
                        }

                        function basePullAt(array, indexes) {
                            var length = array ? indexes.length : 0;
                            while (length--) {
                                var index = indexes[length];
                                if (index != previous && isIndex(index)) {
                                    var previous = index;
                                    splice.call(array, index, 1)
                                }
                            }
                            return array
                        }

                        function baseRandom(min, max) {
                            return min + nativeFloor(nativeRandom() * (max - min + 1))
                        }

                        function baseReduce(collection, iteratee, accumulator, initFromCollection, eachFunc) {
                            eachFunc(collection, function(value, index, collection) {
                                accumulator = initFromCollection ? (initFromCollection = false, value) : iteratee(accumulator, value, index, collection)
                            });
                            return accumulator
                        }
                        var baseSetData = !metaMap ? identity : function(func, data) {
                            metaMap.set(func, data);
                            return func
                        };

                        function baseSlice(array, start, end) {
                            var index = -1,
                                length = array.length;
                            start = start == null ? 0 : +start || 0;
                            if (start < 0) {
                                start = -start > length ? 0 : length + start
                            }
                            end = end === undefined || end > length ? length : +end || 0;
                            if (end < 0) {
                                end += length
                            }
                            length = start > end ? 0 : end - start >>> 0;
                            start >>>= 0;
                            var result = Array(length);
                            while (++index < length) {
                                result[index] = array[index + start]
                            }
                            return result
                        }

                        function baseSome(collection, predicate) {
                            var result;
                            baseEach(collection, function(value, index, collection) {
                                result = predicate(value, index, collection);
                                return !result
                            });
                            return !!result
                        }

                        function baseSortBy(array, comparer) {
                            var length = array.length;
                            array.sort(comparer);
                            while (length--) {
                                array[length] = array[length].value
                            }
                            return array
                        }

                        function baseSortByOrder(collection, iteratees, orders) {
                            var callback = getCallback(),
                                index = -1;
                            iteratees = arrayMap(iteratees, function(iteratee) {
                                return callback(iteratee)
                            });
                            var result = baseMap(collection, function(value) {
                                var criteria = arrayMap(iteratees, function(iteratee) {
                                    return iteratee(value)
                                });
                                return {
                                    criteria: criteria,
                                    index: ++index,
                                    value: value
                                }
                            });
                            return baseSortBy(result, function(object, other) {
                                return compareMultiple(object, other, orders)
                            })
                        }

                        function baseSum(collection, iteratee) {
                            var result = 0;
                            baseEach(collection, function(value, index, collection) {
                                result += +iteratee(value, index, collection) || 0
                            });
                            return result
                        }

                        function baseUniq(array, iteratee) {
                            var index = -1,
                                indexOf = getIndexOf(),
                                length = array.length,
                                isCommon = indexOf == baseIndexOf,
                                isLarge = isCommon && length >= LARGE_ARRAY_SIZE,
                                seen = isLarge ? createCache() : null,
                                result = [];
                            if (seen) {
                                indexOf = cacheIndexOf;
                                isCommon = false
                            } else {
                                isLarge = false;
                                seen = iteratee ? [] : result
                            }
                            outer: while (++index < length) {
                                var value = array[index],
                                    computed = iteratee ? iteratee(value, index, array) : value;
                                if (isCommon && value === value) {
                                    var seenIndex = seen.length;
                                    while (seenIndex--) {
                                        if (seen[seenIndex] === computed) {
                                            continue outer
                                        }
                                    }
                                    if (iteratee) {
                                        seen.push(computed)
                                    }
                                    result.push(value)
                                } else if (indexOf(seen, computed, 0) < 0) {
                                    if (iteratee || isLarge) {
                                        seen.push(computed)
                                    }
                                    result.push(value)
                                }
                            }
                            return result
                        }

                        function baseValues(object, props) {
                            var index = -1,
                                length = props.length,
                                result = Array(length);
                            while (++index < length) {
                                result[index] = object[props[index]]
                            }
                            return result
                        }

                        function baseWhile(array, predicate, isDrop, fromRight) {
                            var length = array.length,
                                index = fromRight ? length : -1;
                            while ((fromRight ? index-- : ++index < length) && predicate(array[index], index, array)) {}
                            return isDrop ? baseSlice(array, fromRight ? 0 : index, fromRight ? index + 1 : length) : baseSlice(array, fromRight ? index + 1 : 0, fromRight ? length : index)
                        }

                        function baseWrapperValue(value, actions) {
                            var result = value;
                            if (result instanceof LazyWrapper) {
                                result = result.value()
                            }
                            var index = -1,
                                length = actions.length;
                            while (++index < length) {
                                var action = actions[index];
                                result = action.func.apply(action.thisArg, arrayPush([result], action.args))
                            }
                            return result
                        }

                        function binaryIndex(array, value, retHighest) {
                            var low = 0,
                                high = array ? array.length : low;
                            if (typeof value == "number" && value === value && high <= HALF_MAX_ARRAY_LENGTH) {
                                while (low < high) {
                                    var mid = low + high >>> 1,
                                        computed = array[mid];
                                    if ((retHighest ? computed <= value : computed < value) && computed !== null) {
                                        low = mid + 1
                                    } else {
                                        high = mid
                                    }
                                }
                                return high
                            }
                            return binaryIndexBy(array, value, identity, retHighest)
                        }

                        function binaryIndexBy(array, value, iteratee, retHighest) {
                            value = iteratee(value);
                            var low = 0,
                                high = array ? array.length : 0,
                                valIsNaN = value !== value,
                                valIsNull = value === null,
                                valIsUndef = value === undefined;
                            while (low < high) {
                                var mid = nativeFloor((low + high) / 2),
                                    computed = iteratee(array[mid]),
                                    isDef = computed !== undefined,
                                    isReflexive = computed === computed;
                                if (valIsNaN) {
                                    var setLow = isReflexive || retHighest
                                } else if (valIsNull) {
                                    setLow = isReflexive && isDef && (retHighest || computed != null)
                                } else if (valIsUndef) {
                                    setLow = isReflexive && (retHighest || isDef)
                                } else if (computed == null) {
                                    setLow = false
                                } else {
                                    setLow = retHighest ? computed <= value : computed < value
                                }
                                if (setLow) {
                                    low = mid + 1
                                } else {
                                    high = mid
                                }
                            }
                            return nativeMin(high, MAX_ARRAY_INDEX)
                        }

                        function bindCallback(func, thisArg, argCount) {
                            if (typeof func != "function") {
                                return identity
                            }
                            if (thisArg === undefined) {
                                return func
                            }
                            switch (argCount) {
                                case 1:
                                    return function(value) {
                                        return func.call(thisArg, value)
                                    };
                                case 3:
                                    return function(value, index, collection) {
                                        return func.call(thisArg, value, index, collection)
                                    };
                                case 4:
                                    return function(accumulator, value, index, collection) {
                                        return func.call(thisArg, accumulator, value, index, collection)
                                    };
                                case 5:
                                    return function(value, other, key, object, source) {
                                        return func.call(thisArg, value, other, key, object, source)
                                    }
                            }
                            return function() {
                                return func.apply(thisArg, arguments)
                            }
                        }

                        function bufferClone(buffer) {
                            var result = new ArrayBuffer(buffer.byteLength),
                                view = new Uint8Array(result);
                            view.set(new Uint8Array(buffer));
                            return result
                        }

                        function composeArgs(args, partials, holders) {
                            var holdersLength = holders.length,
                                argsIndex = -1,
                                argsLength = nativeMax(args.length - holdersLength, 0),
                                leftIndex = -1,
                                leftLength = partials.length,
                                result = Array(leftLength + argsLength);
                            while (++leftIndex < leftLength) {
                                result[leftIndex] = partials[leftIndex]
                            }
                            while (++argsIndex < holdersLength) {
                                result[holders[argsIndex]] = args[argsIndex]
                            }
                            while (argsLength--) {
                                result[leftIndex++] = args[argsIndex++]
                            }
                            return result
                        }

                        function composeArgsRight(args, partials, holders) {
                            var holdersIndex = -1,
                                holdersLength = holders.length,
                                argsIndex = -1,
                                argsLength = nativeMax(args.length - holdersLength, 0),
                                rightIndex = -1,
                                rightLength = partials.length,
                                result = Array(argsLength + rightLength);
                            while (++argsIndex < argsLength) {
                                result[argsIndex] = args[argsIndex]
                            }
                            var offset = argsIndex;
                            while (++rightIndex < rightLength) {
                                result[offset + rightIndex] = partials[rightIndex]
                            }
                            while (++holdersIndex < holdersLength) {
                                result[offset + holders[holdersIndex]] = args[argsIndex++]
                            }
                            return result
                        }

                        function createAggregator(setter, initializer) {
                            return function(collection, iteratee, thisArg) {
                                var result = initializer ? initializer() : {};
                                iteratee = getCallback(iteratee, thisArg, 3);
                                if (isArray(collection)) {
                                    var index = -1,
                                        length = collection.length;
                                    while (++index < length) {
                                        var value = collection[index];
                                        setter(result, value, iteratee(value, index, collection), collection)
                                    }
                                } else {
                                    baseEach(collection, function(value, key, collection) {
                                        setter(result, value, iteratee(value, key, collection), collection)
                                    })
                                }
                                return result
                            }
                        }

                        function createAssigner(assigner) {
                            return restParam(function(object, sources) {
                                var index = -1,
                                    length = object == null ? 0 : sources.length,
                                    customizer = length > 2 ? sources[length - 2] : undefined,
                                    guard = length > 2 ? sources[2] : undefined,
                                    thisArg = length > 1 ? sources[length - 1] : undefined;
                                if (typeof customizer == "function") {
                                    customizer = bindCallback(customizer, thisArg, 5);
                                    length -= 2
                                } else {
                                    customizer = typeof thisArg == "function" ? thisArg : undefined;
                                    length -= customizer ? 1 : 0
                                }
                                if (guard && isIterateeCall(sources[0], sources[1], guard)) {
                                    customizer = length < 3 ? undefined : customizer;
                                    length = 1
                                }
                                while (++index < length) {
                                    var source = sources[index];
                                    if (source) {
                                        assigner(object, source, customizer)
                                    }
                                }
                                return object
                            })
                        }

                        function createBaseEach(eachFunc, fromRight) {
                            return function(collection, iteratee) {
                                var length = collection ? getLength(collection) : 0;
                                if (!isLength(length)) {
                                    return eachFunc(collection, iteratee)
                                }
                                var index = fromRight ? length : -1,
                                    iterable = toObject(collection);
                                while (fromRight ? index-- : ++index < length) {
                                    if (iteratee(iterable[index], index, iterable) === false) {
                                        break
                                    }
                                }
                                return collection
                            }
                        }

                        function createBaseFor(fromRight) {
                            return function(object, iteratee, keysFunc) {
                                var iterable = toObject(object),
                                    props = keysFunc(object),
                                    length = props.length,
                                    index = fromRight ? length : -1;
                                while (fromRight ? index-- : ++index < length) {
                                    var key = props[index];
                                    if (iteratee(iterable[key], key, iterable) === false) {
                                        break
                                    }
                                }
                                return object
                            }
                        }

                        function createBindWrapper(func, thisArg) {
                            var Ctor = createCtorWrapper(func);

                            function wrapper() {
                                var fn = this && this !== root && this instanceof wrapper ? Ctor : func;
                                return fn.apply(thisArg, arguments)
                            }
                            return wrapper
                        }

                        function createCache(values) {
                            return nativeCreate && Set ? new SetCache(values) : null
                        }

                        function createCompounder(callback) {
                            return function(string) {
                                var index = -1,
                                    array = words(deburr(string)),
                                    length = array.length,
                                    result = "";
                                while (++index < length) {
                                    result = callback(result, array[index], index)
                                }
                                return result
                            }
                        }

                        function createCtorWrapper(Ctor) {
                            return function() {
                                var args = arguments;
                                switch (args.length) {
                                    case 0:
                                        return new Ctor;
                                    case 1:
                                        return new Ctor(args[0]);
                                    case 2:
                                        return new Ctor(args[0], args[1]);
                                    case 3:
                                        return new Ctor(args[0], args[1], args[2]);
                                    case 4:
                                        return new Ctor(args[0], args[1], args[2], args[3]);
                                    case 5:
                                        return new Ctor(args[0], args[1], args[2], args[3], args[4]);
                                    case 6:
                                        return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5]);
                                    case 7:
                                        return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5], args[6])
                                }
                                var thisBinding = baseCreate(Ctor.prototype),
                                    result = Ctor.apply(thisBinding, args);
                                return isObject(result) ? result : thisBinding
                            }
                        }

                        function createCurry(flag) {
                            function curryFunc(func, arity, guard) {
                                if (guard && isIterateeCall(func, arity, guard)) {
                                    arity = undefined
                                }
                                var result = createWrapper(func, flag, undefined, undefined, undefined, undefined, undefined, arity);
                                result.placeholder = curryFunc.placeholder;
                                return result
                            }
                            return curryFunc
                        }

                        function createDefaults(assigner, customizer) {
                            return restParam(function(args) {
                                var object = args[0];
                                if (object == null) {
                                    return object
                                }
                                args.push(customizer);
                                return assigner.apply(undefined, args)
                            })
                        }

                        function createExtremum(comparator, exValue) {
                            return function(collection, iteratee, thisArg) {
                                if (thisArg && isIterateeCall(collection, iteratee, thisArg)) {
                                    iteratee = undefined
                                }
                                iteratee = getCallback(iteratee, thisArg, 3);
                                if (iteratee.length == 1) {
                                    collection = isArray(collection) ? collection : toIterable(collection);
                                    var result = arrayExtremum(collection, iteratee, comparator, exValue);
                                    if (!(collection.length && result === exValue)) {
                                        return result
                                    }
                                }
                                return baseExtremum(collection, iteratee, comparator, exValue)
                            }
                        }

                        function createFind(eachFunc, fromRight) {
                            return function(collection, predicate, thisArg) {
                                predicate = getCallback(predicate, thisArg, 3);
                                if (isArray(collection)) {
                                    var index = baseFindIndex(collection, predicate, fromRight);
                                    return index > -1 ? collection[index] : undefined
                                }
                                return baseFind(collection, predicate, eachFunc)
                            }
                        }

                        function createFindIndex(fromRight) {
                            return function(array, predicate, thisArg) {
                                if (!(array && array.length)) {
                                    return -1
                                }
                                predicate = getCallback(predicate, thisArg, 3);
                                return baseFindIndex(array, predicate, fromRight)
                            }
                        }

                        function createFindKey(objectFunc) {
                            return function(object, predicate, thisArg) {
                                predicate = getCallback(predicate, thisArg, 3);
                                return baseFind(object, predicate, objectFunc, true)
                            }
                        }

                        function createFlow(fromRight) {
                            return function() {
                                var wrapper, length = arguments.length,
                                    index = fromRight ? length : -1,
                                    leftIndex = 0,
                                    funcs = Array(length);
                                while (fromRight ? index-- : ++index < length) {
                                    var func = funcs[leftIndex++] = arguments[index];
                                    if (typeof func != "function") {
                                        throw new TypeError(FUNC_ERROR_TEXT)
                                    }
                                    if (!wrapper && LodashWrapper.prototype.thru && getFuncName(func) == "wrapper") {
                                        wrapper = new LodashWrapper([], true)
                                    }
                                }
                                index = wrapper ? -1 : length;
                                while (++index < length) {
                                    func = funcs[index];
                                    var funcName = getFuncName(func),
                                        data = funcName == "wrapper" ? getData(func) : undefined;
                                    if (data && isLaziable(data[0]) && data[1] == (ARY_FLAG | CURRY_FLAG | PARTIAL_FLAG | REARG_FLAG) && !data[4].length && data[9] == 1) {
                                        wrapper = wrapper[getFuncName(data[0])].apply(wrapper, data[3])
                                    } else {
                                        wrapper = func.length == 1 && isLaziable(func) ? wrapper[funcName]() : wrapper.thru(func)
                                    }
                                }
                                return function() {
                                    var args = arguments,
                                        value = args[0];
                                    if (wrapper && args.length == 1 && isArray(value) && value.length >= LARGE_ARRAY_SIZE) {
                                        return wrapper.plant(value).value()
                                    }
                                    var index = 0,
                                        result = length ? funcs[index].apply(this, args) : value;
                                    while (++index < length) {
                                        result = funcs[index].call(this, result)
                                    }
                                    return result
                                }
                            }
                        }

                        function createForEach(arrayFunc, eachFunc) {
                            return function(collection, iteratee, thisArg) {
                                return typeof iteratee == "function" && thisArg === undefined && isArray(collection) ? arrayFunc(collection, iteratee) : eachFunc(collection, bindCallback(iteratee, thisArg, 3))
                            }
                        }

                        function createForIn(objectFunc) {
                            return function(object, iteratee, thisArg) {
                                if (typeof iteratee != "function" || thisArg !== undefined) {
                                    iteratee = bindCallback(iteratee, thisArg, 3)
                                }
                                return objectFunc(object, iteratee, keysIn)
                            }
                        }

                        function createForOwn(objectFunc) {
                            return function(object, iteratee, thisArg) {
                                if (typeof iteratee != "function" || thisArg !== undefined) {
                                    iteratee = bindCallback(iteratee, thisArg, 3)
                                }
                                return objectFunc(object, iteratee)
                            }
                        }

                        function createObjectMapper(isMapKeys) {
                            return function(object, iteratee, thisArg) {
                                var result = {};
                                iteratee = getCallback(iteratee, thisArg, 3);
                                baseForOwn(object, function(value, key, object) {
                                    var mapped = iteratee(value, key, object);
                                    key = isMapKeys ? mapped : key;
                                    value = isMapKeys ? value : mapped;
                                    result[key] = value
                                });
                                return result
                            }
                        }

                        function createPadDir(fromRight) {
                            return function(string, length, chars) {
                                string = baseToString(string);
                                return (fromRight ? string : "") + createPadding(string, length, chars) + (fromRight ? "" : string)
                            }
                        }

                        function createPartial(flag) {
                            var partialFunc = restParam(function(func, partials) {
                                var holders = replaceHolders(partials, partialFunc.placeholder);
                                return createWrapper(func, flag, undefined, partials, holders)
                            });
                            return partialFunc
                        }

                        function createReduce(arrayFunc, eachFunc) {
                            return function(collection, iteratee, accumulator, thisArg) {
                                var initFromArray = arguments.length < 3;
                                return typeof iteratee == "function" && thisArg === undefined && isArray(collection) ? arrayFunc(collection, iteratee, accumulator, initFromArray) : baseReduce(collection, getCallback(iteratee, thisArg, 4), accumulator, initFromArray, eachFunc)
                            }
                        }

                        function createHybridWrapper(func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary, arity) {
                            var isAry = bitmask & ARY_FLAG,
                                isBind = bitmask & BIND_FLAG,
                                isBindKey = bitmask & BIND_KEY_FLAG,
                                isCurry = bitmask & CURRY_FLAG,
                                isCurryBound = bitmask & CURRY_BOUND_FLAG,
                                isCurryRight = bitmask & CURRY_RIGHT_FLAG,
                                Ctor = isBindKey ? undefined : createCtorWrapper(func);

                            function wrapper() {
                                var length = arguments.length,
                                    index = length,
                                    args = Array(length);
                                while (index--) {
                                    args[index] = arguments[index]
                                }
                                if (partials) {
                                    args = composeArgs(args, partials, holders)
                                }
                                if (partialsRight) {
                                    args = composeArgsRight(args, partialsRight, holdersRight)
                                }
                                if (isCurry || isCurryRight) {
                                    var placeholder = wrapper.placeholder,
                                        argsHolders = replaceHolders(args, placeholder);
                                    length -= argsHolders.length;
                                    if (length < arity) {
                                        var newArgPos = argPos ? arrayCopy(argPos) : undefined,
                                            newArity = nativeMax(arity - length, 0),
                                            newsHolders = isCurry ? argsHolders : undefined,
                                            newHoldersRight = isCurry ? undefined : argsHolders,
                                            newPartials = isCurry ? args : undefined,
                                            newPartialsRight = isCurry ? undefined : args;
                                        bitmask |= isCurry ? PARTIAL_FLAG : PARTIAL_RIGHT_FLAG;
                                        bitmask &= ~(isCurry ? PARTIAL_RIGHT_FLAG : PARTIAL_FLAG);
                                        if (!isCurryBound) {
                                            bitmask &= ~(BIND_FLAG | BIND_KEY_FLAG)
                                        }
                                        var newData = [func, bitmask, thisArg, newPartials, newsHolders, newPartialsRight, newHoldersRight, newArgPos, ary, newArity],
                                            result = createHybridWrapper.apply(undefined, newData);
                                        if (isLaziable(func)) {
                                            setData(result, newData)
                                        }
                                        result.placeholder = placeholder;
                                        return result
                                    }
                                }
                                var thisBinding = isBind ? thisArg : this,
                                    fn = isBindKey ? thisBinding[func] : func;
                                if (argPos) {
                                    args = reorder(args, argPos)
                                }
                                if (isAry && ary < args.length) {
                                    args.length = ary
                                }
                                if (this && this !== root && this instanceof wrapper) {
                                    fn = Ctor || createCtorWrapper(func)
                                }
                                return fn.apply(thisBinding, args)
                            }
                            return wrapper
                        }

                        function createPadding(string, length, chars) {
                            var strLength = string.length;
                            length = +length;
                            if (strLength >= length || !nativeIsFinite(length)) {
                                return ""
                            }
                            var padLength = length - strLength;
                            chars = chars == null ? " " : chars + "";
                            return repeat(chars, nativeCeil(padLength / chars.length)).slice(0, padLength)
                        }

                        function createPartialWrapper(func, bitmask, thisArg, partials) {
                            var isBind = bitmask & BIND_FLAG,
                                Ctor = createCtorWrapper(func);

                            function wrapper() {
                                var argsIndex = -1,
                                    argsLength = arguments.length,
                                    leftIndex = -1,
                                    leftLength = partials.length,
                                    args = Array(leftLength + argsLength);
                                while (++leftIndex < leftLength) {
                                    args[leftIndex] = partials[leftIndex]
                                }
                                while (argsLength--) {
                                    args[leftIndex++] = arguments[++argsIndex]
                                }
                                var fn = this && this !== root && this instanceof wrapper ? Ctor : func;
                                return fn.apply(isBind ? thisArg : this, args)
                            }
                            return wrapper
                        }

                        function createRound(methodName) {
                            var func = Math[methodName];
                            return function(number, precision) {
                                precision = precision === undefined ? 0 : +precision || 0;
                                if (precision) {
                                    precision = pow(10, precision);
                                    return func(number * precision) / precision
                                }
                                return func(number)
                            }
                        }

                        function createSortedIndex(retHighest) {
                            return function(array, value, iteratee, thisArg) {
                                var callback = getCallback(iteratee);
                                return iteratee == null && callback === baseCallback ? binaryIndex(array, value, retHighest) : binaryIndexBy(array, value, callback(iteratee, thisArg, 1), retHighest)
                            }
                        }

                        function createWrapper(func, bitmask, thisArg, partials, holders, argPos, ary, arity) {
                            var isBindKey = bitmask & BIND_KEY_FLAG;
                            if (!isBindKey && typeof func != "function") {
                                throw new TypeError(FUNC_ERROR_TEXT)
                            }
                            var length = partials ? partials.length : 0;
                            if (!length) {
                                bitmask &= ~(PARTIAL_FLAG | PARTIAL_RIGHT_FLAG);
                                partials = holders = undefined
                            }
                            length -= holders ? holders.length : 0;
                            if (bitmask & PARTIAL_RIGHT_FLAG) {
                                var partialsRight = partials,
                                    holdersRight = holders;
                                partials = holders = undefined
                            }
                            var data = isBindKey ? undefined : getData(func),
                                newData = [func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary, arity];
                            if (data) {
                                mergeData(newData, data);
                                bitmask = newData[1];
                                arity = newData[9]
                            }
                            newData[9] = arity == null ? isBindKey ? 0 : func.length : nativeMax(arity - length, 0) || 0;
                            if (bitmask == BIND_FLAG) {
                                var result = createBindWrapper(newData[0], newData[2])
                            } else if ((bitmask == PARTIAL_FLAG || bitmask == (BIND_FLAG | PARTIAL_FLAG)) && !newData[4].length) {
                                result = createPartialWrapper.apply(undefined, newData)
                            } else {
                                result = createHybridWrapper.apply(undefined, newData)
                            }
                            var setter = data ? baseSetData : setData;
                            return setter(result, newData)
                        }

                        function equalArrays(array, other, equalFunc, customizer, isLoose, stackA, stackB) {
                            var index = -1,
                                arrLength = array.length,
                                othLength = other.length;
                            if (arrLength != othLength && !(isLoose && othLength > arrLength)) {
                                return false
                            }
                            while (++index < arrLength) {
                                var arrValue = array[index],
                                    othValue = other[index],
                                    result = customizer ? customizer(isLoose ? othValue : arrValue, isLoose ? arrValue : othValue, index) : undefined;
                                if (result !== undefined) {
                                    if (result) {
                                        continue
                                    }
                                    return false
                                }
                                if (isLoose) {
                                    if (!arraySome(other, function(othValue) {
                                            return arrValue === othValue || equalFunc(arrValue, othValue, customizer, isLoose, stackA, stackB)
                                        })) {
                                        return false
                                    }
                                } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, customizer, isLoose, stackA, stackB))) {
                                    return false
                                }
                            }
                            return true
                        }

                        function equalByTag(object, other, tag) {
                            switch (tag) {
                                case boolTag:
                                case dateTag:
                                    return +object == +other;
                                case errorTag:
                                    return object.name == other.name && object.message == other.message;
                                case numberTag:
                                    return object != +object ? other != +other : object == +other;
                                case regexpTag:
                                case stringTag:
                                    return object == other + ""
                            }
                            return false
                        }

                        function equalObjects(object, other, equalFunc, customizer, isLoose, stackA, stackB) {
                            var objProps = keys(object),
                                objLength = objProps.length,
                                othProps = keys(other),
                                othLength = othProps.length;
                            if (objLength != othLength && !isLoose) {
                                return false
                            }
                            var index = objLength;
                            while (index--) {
                                var key = objProps[index];
                                if (!(isLoose ? key in other : hasOwnProperty.call(other, key))) {
                                    return false
                                }
                            }
                            var skipCtor = isLoose;
                            while (++index < objLength) {
                                key = objProps[index];
                                var objValue = object[key],
                                    othValue = other[key],
                                    result = customizer ? customizer(isLoose ? othValue : objValue, isLoose ? objValue : othValue, key) : undefined;
                                if (!(result === undefined ? equalFunc(objValue, othValue, customizer, isLoose, stackA, stackB) : result)) {
                                    return false
                                }
                                skipCtor || (skipCtor = key == "constructor")
                            }
                            if (!skipCtor) {
                                var objCtor = object.constructor,
                                    othCtor = other.constructor;
                                if (objCtor != othCtor && ("constructor" in object && "constructor" in other) && !(typeof objCtor == "function" && objCtor instanceof objCtor && typeof othCtor == "function" && othCtor instanceof othCtor)) {
                                    return false
                                }
                            }
                            return true
                        }

                        function getCallback(func, thisArg, argCount) {
                            var result = lodash.callback || callback;
                            result = result === callback ? baseCallback : result;
                            return argCount ? result(func, thisArg, argCount) : result
                        }
                        var getData = !metaMap ? noop : function(func) {
                            return metaMap.get(func)
                        };

                        function getFuncName(func) {
                            var result = func.name,
                                array = realNames[result],
                                length = array ? array.length : 0;
                            while (length--) {
                                var data = array[length],
                                    otherFunc = data.func;
                                if (otherFunc == null || otherFunc == func) {
                                    return data.name
                                }
                            }
                            return result
                        }

                        function getIndexOf(collection, target, fromIndex) {
                            var result = lodash.indexOf || indexOf;
                            result = result === indexOf ? baseIndexOf : result;
                            return collection ? result(collection, target, fromIndex) : result
                        }
                        var getLength = baseProperty("length");

                        function getMatchData(object) {
                            var result = pairs(object),
                                length = result.length;
                            while (length--) {
                                result[length][2] = isStrictComparable(result[length][1])
                            }
                            return result
                        }

                        function getNative(object, key) {
                            var value = object == null ? undefined : object[key];
                            return isNative(value) ? value : undefined
                        }

                        function getView(start, end, transforms) {
                            var index = -1,
                                length = transforms.length;
                            while (++index < length) {
                                var data = transforms[index],
                                    size = data.size;
                                switch (data.type) {
                                    case "drop":
                                        start += size;
                                        break;
                                    case "dropRight":
                                        end -= size;
                                        break;
                                    case "take":
                                        end = nativeMin(end, start + size);
                                        break;
                                    case "takeRight":
                                        start = nativeMax(start, end - size);
                                        break
                                }
                            }
                            return {
                                start: start,
                                end: end
                            }
                        }

                        function initCloneArray(array) {
                            var length = array.length,
                                result = new array.constructor(length);
                            if (length && typeof array[0] == "string" && hasOwnProperty.call(array, "index")) {
                                result.index = array.index;
                                result.input = array.input
                            }
                            return result
                        }

                        function initCloneObject(object) {
                            var Ctor = object.constructor;
                            if (!(typeof Ctor == "function" && Ctor instanceof Ctor)) {
                                Ctor = Object
                            }
                            return new Ctor
                        }

                        function initCloneByTag(object, tag, isDeep) {
                            var Ctor = object.constructor;
                            switch (tag) {
                                case arrayBufferTag:
                                    return bufferClone(object);
                                case boolTag:
                                case dateTag:
                                    return new Ctor(+object);
                                case float32Tag:
                                case float64Tag:
                                case int8Tag:
                                case int16Tag:
                                case int32Tag:
                                case uint8Tag:
                                case uint8ClampedTag:
                                case uint16Tag:
                                case uint32Tag:
                                    var buffer = object.buffer;
                                    return new Ctor(isDeep ? bufferClone(buffer) : buffer, object.byteOffset, object.length);
                                case numberTag:
                                case stringTag:
                                    return new Ctor(object);
                                case regexpTag:
                                    var result = new Ctor(object.source, reFlags.exec(object));
                                    result.lastIndex = object.lastIndex
                            }
                            return result
                        }

                        function invokePath(object, path, args) {
                            if (object != null && !isKey(path, object)) {
                                path = toPath(path);
                                object = path.length == 1 ? object : baseGet(object, baseSlice(path, 0, -1));
                                path = last(path)
                            }
                            var func = object == null ? object : object[path];
                            return func == null ? undefined : func.apply(object, args)
                        }

                        function isArrayLike(value) {
                            return value != null && isLength(getLength(value))
                        }

                        function isIndex(value, length) {
                            value = typeof value == "number" || reIsUint.test(value) ? +value : -1;
                            length = length == null ? MAX_SAFE_INTEGER : length;
                            return value > -1 && value % 1 == 0 && value < length
                        }

                        function isIterateeCall(value, index, object) {
                            if (!isObject(object)) {
                                return false
                            }
                            var type = typeof index;
                            if (type == "number" ? isArrayLike(object) && isIndex(index, object.length) : type == "string" && index in object) {
                                var other = object[index];
                                return value === value ? value === other : other !== other
                            }
                            return false
                        }

                        function isKey(value, object) {
                            var type = typeof value;
                            if (type == "string" && reIsPlainProp.test(value) || type == "number") {
                                return true
                            }
                            if (isArray(value)) {
                                return false
                            }
                            var result = !reIsDeepProp.test(value);
                            return result || object != null && value in toObject(object)
                        }

                        function isLaziable(func) {
                            var funcName = getFuncName(func);
                            if (!(funcName in LazyWrapper.prototype)) {
                                return false
                            }
                            var other = lodash[funcName];
                            if (func === other) {
                                return true
                            }
                            var data = getData(other);
                            return !!data && func === data[0]
                        }

                        function isLength(value) {
                            return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER
                        }

                        function isStrictComparable(value) {
                            return value === value && !isObject(value)
                        }

                        function mergeData(data, source) {
                            var bitmask = data[1],
                                srcBitmask = source[1],
                                newBitmask = bitmask | srcBitmask,
                                isCommon = newBitmask < ARY_FLAG;
                            var isCombo = srcBitmask == ARY_FLAG && bitmask == CURRY_FLAG || srcBitmask == ARY_FLAG && bitmask == REARG_FLAG && data[7].length <= source[8] || srcBitmask == (ARY_FLAG | REARG_FLAG) && bitmask == CURRY_FLAG;
                            if (!(isCommon || isCombo)) {
                                return data
                            }
                            if (srcBitmask & BIND_FLAG) {
                                data[2] = source[2];
                                newBitmask |= bitmask & BIND_FLAG ? 0 : CURRY_BOUND_FLAG
                            }
                            var value = source[3];
                            if (value) {
                                var partials = data[3];
                                data[3] = partials ? composeArgs(partials, value, source[4]) : arrayCopy(value);
                                data[4] = partials ? replaceHolders(data[3], PLACEHOLDER) : arrayCopy(source[4])
                            }
                            value = source[5];
                            if (value) {
                                partials = data[5];
                                data[5] = partials ? composeArgsRight(partials, value, source[6]) : arrayCopy(value);
                                data[6] = partials ? replaceHolders(data[5], PLACEHOLDER) : arrayCopy(source[6])
                            }
                            value = source[7];
                            if (value) {
                                data[7] = arrayCopy(value)
                            }
                            if (srcBitmask & ARY_FLAG) {
                                data[8] = data[8] == null ? source[8] : nativeMin(data[8], source[8])
                            }
                            if (data[9] == null) {
                                data[9] = source[9]
                            }
                            data[0] = source[0];
                            data[1] = newBitmask;
                            return data
                        }

                        function mergeDefaults(objectValue, sourceValue) {
                            return objectValue === undefined ? sourceValue : merge(objectValue, sourceValue, mergeDefaults)
                        }

                        function pickByArray(object, props) {
                            object = toObject(object);
                            var index = -1,
                                length = props.length,
                                result = {};
                            while (++index < length) {
                                var key = props[index];
                                if (key in object) {
                                    result[key] = object[key]
                                }
                            }
                            return result
                        }

                        function pickByCallback(object, predicate) {
                            var result = {};
                            baseForIn(object, function(value, key, object) {
                                if (predicate(value, key, object)) {
                                    result[key] = value
                                }
                            });
                            return result
                        }

                        function reorder(array, indexes) {
                            var arrLength = array.length,
                                length = nativeMin(indexes.length, arrLength),
                                oldArray = arrayCopy(array);
                            while (length--) {
                                var index = indexes[length];
                                array[length] = isIndex(index, arrLength) ? oldArray[index] : undefined
                            }
                            return array
                        }
                        var setData = function() {
                            var count = 0,
                                lastCalled = 0;
                            return function(key, value) {
                                var stamp = now(),
                                    remaining = HOT_SPAN - (stamp - lastCalled);
                                lastCalled = stamp;
                                if (remaining > 0) {
                                    if (++count >= HOT_COUNT) {
                                        return key
                                    }
                                } else {
                                    count = 0
                                }
                                return baseSetData(key, value)
                            }
                        }();

                        function shimKeys(object) {
                            var props = keysIn(object),
                                propsLength = props.length,
                                length = propsLength && object.length;
                            var allowIndexes = !!length && isLength(length) && (isArray(object) || isArguments(object));
                            var index = -1,
                                result = [];
                            while (++index < propsLength) {
                                var key = props[index];
                                if (allowIndexes && isIndex(key, length) || hasOwnProperty.call(object, key)) {
                                    result.push(key)
                                }
                            }
                            return result
                        }

                        function toIterable(value) {
                            if (value == null) {
                                return []
                            }
                            if (!isArrayLike(value)) {
                                return values(value)
                            }
                            return isObject(value) ? value : Object(value)
                        }

                        function toObject(value) {
                            return isObject(value) ? value : Object(value)
                        }

                        function toPath(value) {
                            if (isArray(value)) {
                                return value
                            }
                            var result = [];
                            baseToString(value).replace(rePropName, function(match, number, quote, string) {
                                result.push(quote ? string.replace(reEscapeChar, "$1") : number || match)
                            });
                            return result
                        }

                        function wrapperClone(wrapper) {
                            return wrapper instanceof LazyWrapper ? wrapper.clone() : new LodashWrapper(wrapper.__wrapped__, wrapper.__chain__, arrayCopy(wrapper.__actions__))
                        }

                        function chunk(array, size, guard) {
                            if (guard ? isIterateeCall(array, size, guard) : size == null) {
                                size = 1
                            } else {
                                size = nativeMax(nativeFloor(size) || 1, 1)
                            }
                            var index = 0,
                                length = array ? array.length : 0,
                                resIndex = -1,
                                result = Array(nativeCeil(length / size));
                            while (index < length) {
                                result[++resIndex] = baseSlice(array, index, index += size)
                            }
                            return result
                        }

                        function compact(array) {
                            var index = -1,
                                length = array ? array.length : 0,
                                resIndex = -1,
                                result = [];
                            while (++index < length) {
                                var value = array[index];
                                if (value) {
                                    result[++resIndex] = value
                                }
                            }
                            return result
                        }
                        var difference = restParam(function(array, values) {
                            return isObjectLike(array) && isArrayLike(array) ? baseDifference(array, baseFlatten(values, false, true)) : []
                        });

                        function drop(array, n, guard) {
                            var length = array ? array.length : 0;
                            if (!length) {
                                return []
                            }
                            if (guard ? isIterateeCall(array, n, guard) : n == null) {
                                n = 1
                            }
                            return baseSlice(array, n < 0 ? 0 : n)
                        }

                        function dropRight(array, n, guard) {
                            var length = array ? array.length : 0;
                            if (!length) {
                                return []
                            }
                            if (guard ? isIterateeCall(array, n, guard) : n == null) {
                                n = 1
                            }
                            n = length - (+n || 0);
                            return baseSlice(array, 0, n < 0 ? 0 : n)
                        }

                        function dropRightWhile(array, predicate, thisArg) {
                            return array && array.length ? baseWhile(array, getCallback(predicate, thisArg, 3), true, true) : []
                        }

                        function dropWhile(array, predicate, thisArg) {
                            return array && array.length ? baseWhile(array, getCallback(predicate, thisArg, 3), true) : []
                        }

                        function fill(array, value, start, end) {
                            var length = array ? array.length : 0;
                            if (!length) {
                                return []
                            }
                            if (start && typeof start != "number" && isIterateeCall(array, value, start)) {
                                start = 0;
                                end = length
                            }
                            return baseFill(array, value, start, end)
                        }
                        var findIndex = createFindIndex();
                        var findLastIndex = createFindIndex(true);

                        function first(array) {
                            return array ? array[0] : undefined
                        }

                        function flatten(array, isDeep, guard) {
                            var length = array ? array.length : 0;
                            if (guard && isIterateeCall(array, isDeep, guard)) {
                                isDeep = false
                            }
                            return length ? baseFlatten(array, isDeep) : []
                        }

                        function flattenDeep(array) {
                            var length = array ? array.length : 0;
                            return length ? baseFlatten(array, true) : []
                        }

                        function indexOf(array, value, fromIndex) {
                            var length = array ? array.length : 0;
                            if (!length) {
                                return -1
                            }
                            if (typeof fromIndex == "number") {
                                fromIndex = fromIndex < 0 ? nativeMax(length + fromIndex, 0) : fromIndex
                            } else if (fromIndex) {
                                var index = binaryIndex(array, value);
                                if (index < length && (value === value ? value === array[index] : array[index] !== array[index])) {
                                    return index
                                }
                                return -1
                            }
                            return baseIndexOf(array, value, fromIndex || 0)
                        }

                        function initial(array) {
                            return dropRight(array, 1)
                        }
                        var intersection = restParam(function(arrays) {
                            var othLength = arrays.length,
                                othIndex = othLength,
                                caches = Array(length),
                                indexOf = getIndexOf(),
                                isCommon = indexOf == baseIndexOf,
                                result = [];
                            while (othIndex--) {
                                var value = arrays[othIndex] = isArrayLike(value = arrays[othIndex]) ? value : [];
                                caches[othIndex] = isCommon && value.length >= 120 ? createCache(othIndex && value) : null
                            }
                            var array = arrays[0],
                                index = -1,
                                length = array ? array.length : 0,
                                seen = caches[0];
                            outer: while (++index < length) {
                                value = array[index];
                                if ((seen ? cacheIndexOf(seen, value) : indexOf(result, value, 0)) < 0) {
                                    var othIndex = othLength;
                                    while (--othIndex) {
                                        var cache = caches[othIndex];
                                        if ((cache ? cacheIndexOf(cache, value) : indexOf(arrays[othIndex], value, 0)) < 0) {
                                            continue outer
                                        }
                                    }
                                    if (seen) {
                                        seen.push(value)
                                    }
                                    result.push(value)
                                }
                            }
                            return result
                        });

                        function last(array) {
                            var length = array ? array.length : 0;
                            return length ? array[length - 1] : undefined
                        }

                        function lastIndexOf(array, value, fromIndex) {
                            var length = array ? array.length : 0;
                            if (!length) {
                                return -1
                            }
                            var index = length;
                            if (typeof fromIndex == "number") {
                                index = (fromIndex < 0 ? nativeMax(length + fromIndex, 0) : nativeMin(fromIndex || 0, length - 1)) + 1
                            } else if (fromIndex) {
                                index = binaryIndex(array, value, true) - 1;
                                var other = array[index];
                                if (value === value ? value === other : other !== other) {
                                    return index
                                }
                                return -1
                            }
                            if (value !== value) {
                                return indexOfNaN(array, index, true)
                            }
                            while (index--) {
                                if (array[index] === value) {
                                    return index
                                }
                            }
                            return -1
                        }

                        function pull() {
                            var args = arguments,
                                array = args[0];
                            if (!(array && array.length)) {
                                return array
                            }
                            var index = 0,
                                indexOf = getIndexOf(),
                                length = args.length;
                            while (++index < length) {
                                var fromIndex = 0,
                                    value = args[index];
                                while ((fromIndex = indexOf(array, value, fromIndex)) > -1) {
                                    splice.call(array, fromIndex, 1)
                                }
                            }
                            return array
                        }
                        var pullAt = restParam(function(array, indexes) {
                            indexes = baseFlatten(indexes);
                            var result = baseAt(array, indexes);
                            basePullAt(array, indexes.sort(baseCompareAscending));
                            return result
                        });

                        function remove(array, predicate, thisArg) {
                            var result = [];
                            if (!(array && array.length)) {
                                return result
                            }
                            var index = -1,
                                indexes = [],
                                length = array.length;
                            predicate = getCallback(predicate, thisArg, 3);
                            while (++index < length) {
                                var value = array[index];
                                if (predicate(value, index, array)) {
                                    result.push(value);
                                    indexes.push(index)
                                }
                            }
                            basePullAt(array, indexes);
                            return result
                        }

                        function rest(array) {
                            return drop(array, 1)
                        }

                        function slice(array, start, end) {
                            var length = array ? array.length : 0;
                            if (!length) {
                                return []
                            }
                            if (end && typeof end != "number" && isIterateeCall(array, start, end)) {
                                start = 0;
                                end = length
                            }
                            return baseSlice(array, start, end)
                        }
                        var sortedIndex = createSortedIndex();
                        var sortedLastIndex = createSortedIndex(true);

                        function take(array, n, guard) {
                            var length = array ? array.length : 0;
                            if (!length) {
                                return []
                            }
                            if (guard ? isIterateeCall(array, n, guard) : n == null) {
                                n = 1
                            }
                            return baseSlice(array, 0, n < 0 ? 0 : n)
                        }

                        function takeRight(array, n, guard) {
                            var length = array ? array.length : 0;
                            if (!length) {
                                return []
                            }
                            if (guard ? isIterateeCall(array, n, guard) : n == null) {
                                n = 1
                            }
                            n = length - (+n || 0);
                            return baseSlice(array, n < 0 ? 0 : n)
                        }

                        function takeRightWhile(array, predicate, thisArg) {
                            return array && array.length ? baseWhile(array, getCallback(predicate, thisArg, 3), false, true) : []
                        }

                        function takeWhile(array, predicate, thisArg) {
                            return array && array.length ? baseWhile(array, getCallback(predicate, thisArg, 3)) : []
                        }
                        var union = restParam(function(arrays) {
                            return baseUniq(baseFlatten(arrays, false, true))
                        });

                        function uniq(array, isSorted, iteratee, thisArg) {
                            var length = array ? array.length : 0;
                            if (!length) {
                                return []
                            }
                            if (isSorted != null && typeof isSorted != "boolean") {
                                thisArg = iteratee;
                                iteratee = isIterateeCall(array, isSorted, thisArg) ? undefined : isSorted;
                                isSorted = false
                            }
                            var callback = getCallback();
                            if (!(iteratee == null && callback === baseCallback)) {
                                iteratee = callback(iteratee, thisArg, 3)
                            }
                            return isSorted && getIndexOf() == baseIndexOf ? sortedUniq(array, iteratee) : baseUniq(array, iteratee)
                        }

                        function unzip(array) {
                            if (!(array && array.length)) {
                                return []
                            }
                            var index = -1,
                                length = 0;
                            array = arrayFilter(array, function(group) {
                                if (isArrayLike(group)) {
                                    length = nativeMax(group.length, length);
                                    return true
                                }
                            });
                            var result = Array(length);
                            while (++index < length) {
                                result[index] = arrayMap(array, baseProperty(index))
                            }
                            return result
                        }

                        function unzipWith(array, iteratee, thisArg) {
                            var length = array ? array.length : 0;
                            if (!length) {
                                return []
                            }
                            var result = unzip(array);
                            if (iteratee == null) {
                                return result
                            }
                            iteratee = bindCallback(iteratee, thisArg, 4);
                            return arrayMap(result, function(group) {
                                return arrayReduce(group, iteratee, undefined, true)
                            })
                        }
                        var without = restParam(function(array, values) {
                            return isArrayLike(array) ? baseDifference(array, values) : []
                        });

                        function xor() {
                            var index = -1,
                                length = arguments.length;
                            while (++index < length) {
                                var array = arguments[index];
                                if (isArrayLike(array)) {
                                    var result = result ? arrayPush(baseDifference(result, array), baseDifference(array, result)) : array
                                }
                            }
                            return result ? baseUniq(result) : []
                        }
                        var zip = restParam(unzip);

                        function zipObject(props, values) {
                            var index = -1,
                                length = props ? props.length : 0,
                                result = {};
                            if (length && !values && !isArray(props[0])) {
                                values = []
                            }
                            while (++index < length) {
                                var key = props[index];
                                if (values) {
                                    result[key] = values[index]
                                } else if (key) {
                                    result[key[0]] = key[1]
                                }
                            }
                            return result
                        }
                        var zipWith = restParam(function(arrays) {
                            var length = arrays.length,
                                iteratee = length > 2 ? arrays[length - 2] : undefined,
                                thisArg = length > 1 ? arrays[length - 1] : undefined;
                            if (length > 2 && typeof iteratee == "function") {
                                length -= 2
                            } else {
                                iteratee = length > 1 && typeof thisArg == "function" ? (--length, thisArg) : undefined;
                                thisArg = undefined
                            }
                            arrays.length = length;
                            return unzipWith(arrays, iteratee, thisArg)
                        });

                        function chain(value) {
                            var result = lodash(value);
                            result.__chain__ = true;
                            return result
                        }

                        function tap(value, interceptor, thisArg) {
                            interceptor.call(thisArg, value);
                            return value
                        }

                        function thru(value, interceptor, thisArg) {
                            return interceptor.call(thisArg, value)
                        }

                        function wrapperChain() {
                            return chain(this)
                        }

                        function wrapperCommit() {
                            return new LodashWrapper(this.value(), this.__chain__)
                        }
                        var wrapperConcat = restParam(function(values) {
                            values = baseFlatten(values);
                            return this.thru(function(array) {
                                return arrayConcat(isArray(array) ? array : [toObject(array)], values)
                            })
                        });

                        function wrapperPlant(value) {
                            var result, parent = this;
                            while (parent instanceof baseLodash) {
                                var clone = wrapperClone(parent);
                                if (result) {
                                    previous.__wrapped__ = clone
                                } else {
                                    result = clone
                                }
                                var previous = clone;
                                parent = parent.__wrapped__
                            }
                            previous.__wrapped__ = value;
                            return result
                        }

                        function wrapperReverse() {
                            var value = this.__wrapped__;
                            var interceptor = function(value) {
                                return wrapped && wrapped.__dir__ < 0 ? value : value.reverse()
                            };
                            if (value instanceof LazyWrapper) {
                                var wrapped = value;
                                if (this.__actions__.length) {
                                    wrapped = new LazyWrapper(this)
                                }
                                wrapped = wrapped.reverse();
                                wrapped.__actions__.push({
                                    func: thru,
                                    args: [interceptor],
                                    thisArg: undefined
                                });
                                return new LodashWrapper(wrapped, this.__chain__)
                            }
                            return this.thru(interceptor)
                        }

                        function wrapperToString() {
                            return this.value() + ""
                        }

                        function wrapperValue() {
                            return baseWrapperValue(this.__wrapped__, this.__actions__)
                        }
                        var at = restParam(function(collection, props) {
                            return baseAt(collection, baseFlatten(props))
                        });
                        var countBy = createAggregator(function(result, value, key) {
                            hasOwnProperty.call(result, key) ? ++result[key] : result[key] = 1
                        });

                        function every(collection, predicate, thisArg) {
                            var func = isArray(collection) ? arrayEvery : baseEvery;
                            if (thisArg && isIterateeCall(collection, predicate, thisArg)) {
                                predicate = undefined
                            }
                            if (typeof predicate != "function" || thisArg !== undefined) {
                                predicate = getCallback(predicate, thisArg, 3)
                            }
                            return func(collection, predicate)
                        }

                        function filter(collection, predicate, thisArg) {
                            var func = isArray(collection) ? arrayFilter : baseFilter;
                            predicate = getCallback(predicate, thisArg, 3);
                            return func(collection, predicate)
                        }
                        var find = createFind(baseEach);
                        var findLast = createFind(baseEachRight, true);

                        function findWhere(collection, source) {
                            return find(collection, baseMatches(source))
                        }
                        var forEach = createForEach(arrayEach, baseEach);
                        var forEachRight = createForEach(arrayEachRight, baseEachRight);
                        var groupBy = createAggregator(function(result, value, key) {
                            if (hasOwnProperty.call(result, key)) {
                                result[key].push(value)
                            } else {
                                result[key] = [value]
                            }
                        });

                        function includes(collection, target, fromIndex, guard) {
                            var length = collection ? getLength(collection) : 0;
                            if (!isLength(length)) {
                                collection = values(collection);
                                length = collection.length
                            }
                            if (typeof fromIndex != "number" || guard && isIterateeCall(target, fromIndex, guard)) {
                                fromIndex = 0
                            } else {
                                fromIndex = fromIndex < 0 ? nativeMax(length + fromIndex, 0) : fromIndex || 0
                            }
                            return typeof collection == "string" || !isArray(collection) && isString(collection) ? fromIndex <= length && collection.indexOf(target, fromIndex) > -1 : !!length && getIndexOf(collection, target, fromIndex) > -1
                        }
                        var indexBy = createAggregator(function(result, value, key) {
                            result[key] = value
                        });
                        var invoke = restParam(function(collection, path, args) {
                            var index = -1,
                                isFunc = typeof path == "function",
                                isProp = isKey(path),
                                result = isArrayLike(collection) ? Array(collection.length) : [];
                            baseEach(collection, function(value) {
                                var func = isFunc ? path : isProp && value != null ? value[path] : undefined;
                                result[++index] = func ? func.apply(value, args) : invokePath(value, path, args)
                            });
                            return result
                        });

                        function map(collection, iteratee, thisArg) {
                            var func = isArray(collection) ? arrayMap : baseMap;
                            iteratee = getCallback(iteratee, thisArg, 3);
                            return func(collection, iteratee)
                        }
                        var partition = createAggregator(function(result, value, key) {
                            result[key ? 0 : 1].push(value)
                        }, function() {
                            return [
                                [],
                                []
                            ]
                        });

                        function pluck(collection, path) {
                            return map(collection, property(path))
                        }
                        var reduce = createReduce(arrayReduce, baseEach);
                        var reduceRight = createReduce(arrayReduceRight, baseEachRight);

                        function reject(collection, predicate, thisArg) {
                            var func = isArray(collection) ? arrayFilter : baseFilter;
                            predicate = getCallback(predicate, thisArg, 3);
                            return func(collection, function(value, index, collection) {
                                return !predicate(value, index, collection)
                            })
                        }

                        function sample(collection, n, guard) {
                            if (guard ? isIterateeCall(collection, n, guard) : n == null) {
                                collection = toIterable(collection);
                                var length = collection.length;
                                return length > 0 ? collection[baseRandom(0, length - 1)] : undefined
                            }
                            var index = -1,
                                result = toArray(collection),
                                length = result.length,
                                lastIndex = length - 1;
                            n = nativeMin(n < 0 ? 0 : +n || 0, length);
                            while (++index < n) {
                                var rand = baseRandom(index, lastIndex),
                                    value = result[rand];
                                result[rand] = result[index];
                                result[index] = value
                            }
                            result.length = n;
                            return result
                        }

                        function shuffle(collection) {
                            return sample(collection, POSITIVE_INFINITY)
                        }

                        function size(collection) {
                            var length = collection ? getLength(collection) : 0;
                            return isLength(length) ? length : keys(collection).length
                        }

                        function some(collection, predicate, thisArg) {
                            var func = isArray(collection) ? arraySome : baseSome;
                            if (thisArg && isIterateeCall(collection, predicate, thisArg)) {
                                predicate = undefined
                            }
                            if (typeof predicate != "function" || thisArg !== undefined) {
                                predicate = getCallback(predicate, thisArg, 3)
                            }
                            return func(collection, predicate)
                        }

                        function sortBy(collection, iteratee, thisArg) {
                            if (collection == null) {
                                return []
                            }
                            if (thisArg && isIterateeCall(collection, iteratee, thisArg)) {
                                iteratee = undefined
                            }
                            var index = -1;
                            iteratee = getCallback(iteratee, thisArg, 3);
                            var result = baseMap(collection, function(value, key, collection) {
                                return {
                                    criteria: iteratee(value, key, collection),
                                    index: ++index,
                                    value: value
                                }
                            });
                            return baseSortBy(result, compareAscending)
                        }
                        var sortByAll = restParam(function(collection, iteratees) {
                            if (collection == null) {
                                return []
                            }
                            var guard = iteratees[2];
                            if (guard && isIterateeCall(iteratees[0], iteratees[1], guard)) {
                                iteratees.length = 1
                            }
                            return baseSortByOrder(collection, baseFlatten(iteratees), [])
                        });

                        function sortByOrder(collection, iteratees, orders, guard) {
                            if (collection == null) {
                                return []
                            }
                            if (guard && isIterateeCall(iteratees, orders, guard)) {
                                orders = undefined
                            }
                            if (!isArray(iteratees)) {
                                iteratees = iteratees == null ? [] : [iteratees]
                            }
                            if (!isArray(orders)) {
                                orders = orders == null ? [] : [orders]
                            }
                            return baseSortByOrder(collection, iteratees, orders)
                        }

                        function where(collection, source) {
                            return filter(collection, baseMatches(source))
                        }
                        var now = nativeNow || function() {
                            return (new Date).getTime()
                        };

                        function after(n, func) {
                            if (typeof func != "function") {
                                if (typeof n == "function") {
                                    var temp = n;
                                    n = func;
                                    func = temp
                                } else {
                                    throw new TypeError(FUNC_ERROR_TEXT)
                                }
                            }
                            n = nativeIsFinite(n = +n) ? n : 0;
                            return function() {
                                if (--n < 1) {
                                    return func.apply(this, arguments)
                                }
                            }
                        }

                        function ary(func, n, guard) {
                            if (guard && isIterateeCall(func, n, guard)) {
                                n = undefined
                            }
                            n = func && n == null ? func.length : nativeMax(+n || 0, 0);
                            return createWrapper(func, ARY_FLAG, undefined, undefined, undefined, undefined, n)
                        }

                        function before(n, func) {
                            var result;
                            if (typeof func != "function") {
                                if (typeof n == "function") {
                                    var temp = n;
                                    n = func;
                                    func = temp
                                } else {
                                    throw new TypeError(FUNC_ERROR_TEXT)
                                }
                            }
                            return function() {
                                if (--n > 0) {
                                    result = func.apply(this, arguments)
                                }
                                if (n <= 1) {
                                    func = undefined
                                }
                                return result
                            }
                        }
                        var bind = restParam(function(func, thisArg, partials) {
                            var bitmask = BIND_FLAG;
                            if (partials.length) {
                                var holders = replaceHolders(partials, bind.placeholder);
                                bitmask |= PARTIAL_FLAG
                            }
                            return createWrapper(func, bitmask, thisArg, partials, holders)
                        });
                        var bindAll = restParam(function(object, methodNames) {
                            methodNames = methodNames.length ? baseFlatten(methodNames) : functions(object);
                            var index = -1,
                                length = methodNames.length;
                            while (++index < length) {
                                var key = methodNames[index];
                                object[key] = createWrapper(object[key], BIND_FLAG, object)
                            }
                            return object
                        });
                        var bindKey = restParam(function(object, key, partials) {
                            var bitmask = BIND_FLAG | BIND_KEY_FLAG;
                            if (partials.length) {
                                var holders = replaceHolders(partials, bindKey.placeholder);
                                bitmask |= PARTIAL_FLAG
                            }
                            return createWrapper(key, bitmask, object, partials, holders)
                        });
                        var curry = createCurry(CURRY_FLAG);
                        var curryRight = createCurry(CURRY_RIGHT_FLAG);

                        function debounce(func, wait, options) {
                            var args, maxTimeoutId, result, stamp, thisArg, timeoutId, trailingCall, lastCalled = 0,
                                maxWait = false,
                                trailing = true;
                            if (typeof func != "function") {
                                throw new TypeError(FUNC_ERROR_TEXT)
                            }
                            wait = wait < 0 ? 0 : +wait || 0;
                            if (options === true) {
                                var leading = true;
                                trailing = false
                            } else if (isObject(options)) {
                                leading = !!options.leading;
                                maxWait = "maxWait" in options && nativeMax(+options.maxWait || 0, wait);
                                trailing = "trailing" in options ? !!options.trailing : trailing
                            }

                            function cancel() {
                                if (timeoutId) {
                                    clearTimeout(timeoutId)
                                }
                                if (maxTimeoutId) {
                                    clearTimeout(maxTimeoutId)
                                }
                                lastCalled = 0;
                                maxTimeoutId = timeoutId = trailingCall = undefined
                            }

                            function complete(isCalled, id) {
                                if (id) {
                                    clearTimeout(id)
                                }
                                maxTimeoutId = timeoutId = trailingCall = undefined;
                                if (isCalled) {
                                    lastCalled = now();
                                    result = func.apply(thisArg, args);
                                    if (!timeoutId && !maxTimeoutId) {
                                        args = thisArg = undefined
                                    }
                                }
                            }

                            function delayed() {
                                var remaining = wait - (now() - stamp);
                                if (remaining <= 0 || remaining > wait) {
                                    complete(trailingCall, maxTimeoutId)
                                } else {
                                    timeoutId = setTimeout(delayed, remaining)
                                }
                            }

                            function maxDelayed() {
                                complete(trailing, timeoutId)
                            }

                            function debounced() {
                                args = arguments;
                                stamp = now();
                                thisArg = this;
                                trailingCall = trailing && (timeoutId || !leading);
                                if (maxWait === false) {
                                    var leadingCall = leading && !timeoutId
                                } else {
                                    if (!maxTimeoutId && !leading) {
                                        lastCalled = stamp
                                    }
                                    var remaining = maxWait - (stamp - lastCalled),
                                        isCalled = remaining <= 0 || remaining > maxWait;
                                    if (isCalled) {
                                        if (maxTimeoutId) {
                                            maxTimeoutId = clearTimeout(maxTimeoutId)
                                        }
                                        lastCalled = stamp;
                                        result = func.apply(thisArg, args)
                                    } else if (!maxTimeoutId) {
                                        maxTimeoutId = setTimeout(maxDelayed, remaining)
                                    }
                                }
                                if (isCalled && timeoutId) {
                                    timeoutId = clearTimeout(timeoutId)
                                } else if (!timeoutId && wait !== maxWait) {
                                    timeoutId = setTimeout(delayed, wait)
                                }
                                if (leadingCall) {
                                    isCalled = true;
                                    result = func.apply(thisArg, args)
                                }
                                if (isCalled && !timeoutId && !maxTimeoutId) {
                                    args = thisArg = undefined
                                }
                                return result
                            }
                            debounced.cancel = cancel;
                            return debounced
                        }
                        var defer = restParam(function(func, args) {
                            return baseDelay(func, 1, args)
                        });
                        var delay = restParam(function(func, wait, args) {
                            return baseDelay(func, wait, args)
                        });
                        var flow = createFlow();
                        var flowRight = createFlow(true);

                        function memoize(func, resolver) {
                            if (typeof func != "function" || resolver && typeof resolver != "function") {
                                throw new TypeError(FUNC_ERROR_TEXT)
                            }
                            var memoized = function() {
                                var args = arguments,
                                    key = resolver ? resolver.apply(this, args) : args[0],
                                    cache = memoized.cache;
                                if (cache.has(key)) {
                                    return cache.get(key)
                                }
                                var result = func.apply(this, args);
                                memoized.cache = cache.set(key, result);
                                return result
                            };
                            memoized.cache = new memoize.Cache;
                            return memoized
                        }
                        var modArgs = restParam(function(func, transforms) {
                            transforms = baseFlatten(transforms);
                            if (typeof func != "function" || !arrayEvery(transforms, baseIsFunction)) {
                                throw new TypeError(FUNC_ERROR_TEXT)
                            }
                            var length = transforms.length;
                            return restParam(function(args) {
                                var index = nativeMin(args.length, length);
                                while (index--) {
                                    args[index] = transforms[index](args[index])
                                }
                                return func.apply(this, args)
                            })
                        });

                        function negate(predicate) {
                            if (typeof predicate != "function") {
                                throw new TypeError(FUNC_ERROR_TEXT)
                            }
                            return function() {
                                return !predicate.apply(this, arguments)
                            }
                        }

                        function once(func) {
                            return before(2, func)
                        }
                        var partial = createPartial(PARTIAL_FLAG);
                        var partialRight = createPartial(PARTIAL_RIGHT_FLAG);
                        var rearg = restParam(function(func, indexes) {
                            return createWrapper(func, REARG_FLAG, undefined, undefined, undefined, baseFlatten(indexes))
                        });

                        function restParam(func, start) {
                            if (typeof func != "function") {
                                throw new TypeError(FUNC_ERROR_TEXT)
                            }
                            start = nativeMax(start === undefined ? func.length - 1 : +start || 0, 0);
                            return function() {
                                var args = arguments,
                                    index = -1,
                                    length = nativeMax(args.length - start, 0),
                                    rest = Array(length);
                                while (++index < length) {
                                    rest[index] = args[start + index]
                                }
                                switch (start) {
                                    case 0:
                                        return func.call(this, rest);
                                    case 1:
                                        return func.call(this, args[0], rest);
                                    case 2:
                                        return func.call(this, args[0], args[1], rest)
                                }
                                var otherArgs = Array(start + 1);
                                index = -1;
                                while (++index < start) {
                                    otherArgs[index] = args[index]
                                }
                                otherArgs[start] = rest;
                                return func.apply(this, otherArgs)
                            }
                        }

                        function spread(func) {
                            if (typeof func != "function") {
                                throw new TypeError(FUNC_ERROR_TEXT)
                            }
                            return function(array) {
                                return func.apply(this, array)
                            }
                        }

                        function throttle(func, wait, options) {
                            var leading = true,
                                trailing = true;
                            if (typeof func != "function") {
                                throw new TypeError(FUNC_ERROR_TEXT)
                            }
                            if (options === false) {
                                leading = false
                            } else if (isObject(options)) {
                                leading = "leading" in options ? !!options.leading : leading;
                                trailing = "trailing" in options ? !!options.trailing : trailing
                            }
                            return debounce(func, wait, {
                                leading: leading,
                                maxWait: +wait,
                                trailing: trailing
                            })
                        }

                        function wrap(value, wrapper) {
                            wrapper = wrapper == null ? identity : wrapper;
                            return createWrapper(wrapper, PARTIAL_FLAG, undefined, [value], [])
                        }

                        function clone(value, isDeep, customizer, thisArg) {
                            if (isDeep && typeof isDeep != "boolean" && isIterateeCall(value, isDeep, customizer)) {
                                isDeep = false
                            } else if (typeof isDeep == "function") {
                                thisArg = customizer;
                                customizer = isDeep;
                                isDeep = false
                            }
                            return typeof customizer == "function" ? baseClone(value, isDeep, bindCallback(customizer, thisArg, 1)) : baseClone(value, isDeep)
                        }

                        function cloneDeep(value, customizer, thisArg) {
                            return typeof customizer == "function" ? baseClone(value, true, bindCallback(customizer, thisArg, 1)) : baseClone(value, true)
                        }

                        function gt(value, other) {
                            return value > other
                        }

                        function gte(value, other) {
                            return value >= other
                        }

                        function isArguments(value) {
                            return isObjectLike(value) && isArrayLike(value) && hasOwnProperty.call(value, "callee") && !propertyIsEnumerable.call(value, "callee")
                        }
                        var isArray = nativeIsArray || function(value) {
                            return isObjectLike(value) && isLength(value.length) && objToString.call(value) == arrayTag
                        };

                        function isBoolean(value) {
                            return value === true || value === false || isObjectLike(value) && objToString.call(value) == boolTag
                        }

                        function isDate(value) {
                            return isObjectLike(value) && objToString.call(value) == dateTag
                        }

                        function isElement(value) {
                            return !!value && value.nodeType === 1 && isObjectLike(value) && !isPlainObject(value)
                        }

                        function isEmpty(value) {
                            if (value == null) {
                                return true
                            }
                            if (isArrayLike(value) && (isArray(value) || isString(value) || isArguments(value) || isObjectLike(value) && isFunction(value.splice))) {
                                return !value.length
                            }
                            return !keys(value).length
                        }

                        function isEqual(value, other, customizer, thisArg) {
                            customizer = typeof customizer == "function" ? bindCallback(customizer, thisArg, 3) : undefined;
                            var result = customizer ? customizer(value, other) : undefined;
                            return result === undefined ? baseIsEqual(value, other, customizer) : !!result
                        }

                        function isError(value) {
                            return isObjectLike(value) && typeof value.message == "string" && objToString.call(value) == errorTag
                        }

                        function isFinite(value) {
                            return typeof value == "number" && nativeIsFinite(value)
                        }

                        function isFunction(value) {
                            return isObject(value) && objToString.call(value) == funcTag
                        }

                        function isObject(value) {
                            var type = typeof value;
                            return !!value && (type == "object" || type == "function")
                        }

                        function isMatch(object, source, customizer, thisArg) {
                            customizer = typeof customizer == "function" ? bindCallback(customizer, thisArg, 3) : undefined;
                            return baseIsMatch(object, getMatchData(source), customizer)
                        }

                        function isNaN(value) {
                            return isNumber(value) && value != +value
                        }

                        function isNative(value) {
                            if (value == null) {
                                return false
                            }
                            if (isFunction(value)) {
                                return reIsNative.test(fnToString.call(value))
                            }
                            return isObjectLike(value) && reIsHostCtor.test(value)
                        }

                        function isNull(value) {
                            return value === null
                        }

                        function isNumber(value) {
                            return typeof value == "number" || isObjectLike(value) && objToString.call(value) == numberTag
                        }

                        function isPlainObject(value) {
                            var Ctor;
                            if (!(isObjectLike(value) && objToString.call(value) == objectTag && !isArguments(value)) || !hasOwnProperty.call(value, "constructor") && (Ctor = value.constructor, typeof Ctor == "function" && !(Ctor instanceof Ctor))) {
                                return false
                            }
                            var result;
                            baseForIn(value, function(subValue, key) {
                                result = key
                            });
                            return result === undefined || hasOwnProperty.call(value, result)
                        }

                        function isRegExp(value) {
                            return isObject(value) && objToString.call(value) == regexpTag
                        }

                        function isString(value) {
                            return typeof value == "string" || isObjectLike(value) && objToString.call(value) == stringTag
                        }

                        function isTypedArray(value) {
                            return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[objToString.call(value)]
                        }

                        function isUndefined(value) {
                            return value === undefined
                        }

                        function lt(value, other) {
                            return value < other
                        }

                        function lte(value, other) {
                            return value <= other
                        }

                        function toArray(value) {
                            var length = value ? getLength(value) : 0;
                            if (!isLength(length)) {
                                return values(value)
                            }
                            if (!length) {
                                return []
                            }
                            return arrayCopy(value)
                        }

                        function toPlainObject(value) {
                            return baseCopy(value, keysIn(value))
                        }
                        var merge = createAssigner(baseMerge);
                        var assign = createAssigner(function(object, source, customizer) {
                            return customizer ? assignWith(object, source, customizer) : baseAssign(object, source)
                        });

                        function create(prototype, properties, guard) {
                            var result = baseCreate(prototype);
                            if (guard && isIterateeCall(prototype, properties, guard)) {
                                properties = undefined
                            }
                            return properties ? baseAssign(result, properties) : result
                        }
                        var defaults = createDefaults(assign, assignDefaults);
                        var defaultsDeep = createDefaults(merge, mergeDefaults);
                        var findKey = createFindKey(baseForOwn);
                        var findLastKey = createFindKey(baseForOwnRight);
                        var forIn = createForIn(baseFor);
                        var forInRight = createForIn(baseForRight);
                        var forOwn = createForOwn(baseForOwn);
                        var forOwnRight = createForOwn(baseForOwnRight);

                        function functions(object) {
                            return baseFunctions(object, keysIn(object))
                        }

                        function get(object, path, defaultValue) {
                            var result = object == null ? undefined : baseGet(object, toPath(path), path + "");
                            return result === undefined ? defaultValue : result
                        }

                        function has(object, path) {
                            if (object == null) {
                                return false
                            }
                            var result = hasOwnProperty.call(object, path);
                            if (!result && !isKey(path)) {
                                path = toPath(path);
                                object = path.length == 1 ? object : baseGet(object, baseSlice(path, 0, -1));
                                if (object == null) {
                                    return false
                                }
                                path = last(path);
                                result = hasOwnProperty.call(object, path)
                            }
                            return result || isLength(object.length) && isIndex(path, object.length) && (isArray(object) || isArguments(object))
                        }

                        function invert(object, multiValue, guard) {
                            if (guard && isIterateeCall(object, multiValue, guard)) {
                                multiValue = undefined
                            }
                            var index = -1,
                                props = keys(object),
                                length = props.length,
                                result = {};
                            while (++index < length) {
                                var key = props[index],
                                    value = object[key];
                                if (multiValue) {
                                    if (hasOwnProperty.call(result, value)) {
                                        result[value].push(key)
                                    } else {
                                        result[value] = [key]
                                    }
                                } else {
                                    result[value] = key
                                }
                            }
                            return result
                        }
                        var keys = !nativeKeys ? shimKeys : function(object) {
                            var Ctor = object == null ? undefined : object.constructor;
                            if (typeof Ctor == "function" && Ctor.prototype === object || typeof object != "function" && isArrayLike(object)) {
                                return shimKeys(object)
                            }
                            return isObject(object) ? nativeKeys(object) : []
                        };

                        function keysIn(object) {
                            if (object == null) {
                                return []
                            }
                            if (!isObject(object)) {
                                object = Object(object)
                            }
                            var length = object.length;
                            length = length && isLength(length) && (isArray(object) || isArguments(object)) && length || 0;
                            var Ctor = object.constructor,
                                index = -1,
                                isProto = typeof Ctor == "function" && Ctor.prototype === object,
                                result = Array(length),
                                skipIndexes = length > 0;
                            while (++index < length) {
                                result[index] = index + ""
                            }
                            for (var key in object) {
                                if (!(skipIndexes && isIndex(key, length)) && !(key == "constructor" && (isProto || !hasOwnProperty.call(object, key)))) {
                                    result.push(key)
                                }
                            }
                            return result
                        }
                        var mapKeys = createObjectMapper(true);
                        var mapValues = createObjectMapper();
                        var omit = restParam(function(object, props) {
                            if (object == null) {
                                return {}
                            }
                            if (typeof props[0] != "function") {
                                var props = arrayMap(baseFlatten(props), String);
                                return pickByArray(object, baseDifference(keysIn(object), props))
                            }
                            var predicate = bindCallback(props[0], props[1], 3);
                            return pickByCallback(object, function(value, key, object) {
                                return !predicate(value, key, object)
                            })
                        });

                        function pairs(object) {
                            object = toObject(object);
                            var index = -1,
                                props = keys(object),
                                length = props.length,
                                result = Array(length);
                            while (++index < length) {
                                var key = props[index];
                                result[index] = [key, object[key]]
                            }
                            return result
                        }
                        var pick = restParam(function(object, props) {
                            if (object == null) {
                                return {}
                            }
                            return typeof props[0] == "function" ? pickByCallback(object, bindCallback(props[0], props[1], 3)) : pickByArray(object, baseFlatten(props))
                        });

                        function result(object, path, defaultValue) {
                            var result = object == null ? undefined : object[path];
                            if (result === undefined) {
                                if (object != null && !isKey(path, object)) {
                                    path = toPath(path);
                                    object = path.length == 1 ? object : baseGet(object, baseSlice(path, 0, -1));
                                    result = object == null ? undefined : object[last(path)]
                                }
                                result = result === undefined ? defaultValue : result
                            }
                            return isFunction(result) ? result.call(object) : result
                        }

                        function set(object, path, value) {
                            if (object == null) {
                                return object
                            }
                            var pathKey = path + "";
                            path = object[pathKey] != null || isKey(path, object) ? [pathKey] : toPath(path);
                            var index = -1,
                                length = path.length,
                                lastIndex = length - 1,
                                nested = object;
                            while (nested != null && ++index < length) {
                                var key = path[index];
                                if (isObject(nested)) {
                                    if (index == lastIndex) {
                                        nested[key] = value
                                    } else if (nested[key] == null) {
                                        nested[key] = isIndex(path[index + 1]) ? [] : {}
                                    }
                                }
                                nested = nested[key]
                            }
                            return object
                        }

                        function transform(object, iteratee, accumulator, thisArg) {
                            var isArr = isArray(object) || isTypedArray(object);
                            iteratee = getCallback(iteratee, thisArg, 4);
                            if (accumulator == null) {
                                if (isArr || isObject(object)) {
                                    var Ctor = object.constructor;
                                    if (isArr) {
                                        accumulator = isArray(object) ? new Ctor : []
                                    } else {
                                        accumulator = baseCreate(isFunction(Ctor) ? Ctor.prototype : undefined)
                                    }
                                } else {
                                    accumulator = {}
                                }
                            }(isArr ? arrayEach : baseForOwn)(object, function(value, index, object) {
                                return iteratee(accumulator, value, index, object)
                            });
                            return accumulator
                        }

                        function values(object) {
                            return baseValues(object, keys(object))
                        }

                        function valuesIn(object) {
                            return baseValues(object, keysIn(object))
                        }

                        function inRange(value, start, end) {
                            start = +start || 0;
                            if (end === undefined) {
                                end = start;
                                start = 0
                            } else {
                                end = +end || 0
                            }
                            return value >= nativeMin(start, end) && value < nativeMax(start, end)
                        }

                        function random(min, max, floating) {
                            if (floating && isIterateeCall(min, max, floating)) {
                                max = floating = undefined
                            }
                            var noMin = min == null,
                                noMax = max == null;
                            if (floating == null) {
                                if (noMax && typeof min == "boolean") {
                                    floating = min;
                                    min = 1
                                } else if (typeof max == "boolean") {
                                    floating = max;
                                    noMax = true
                                }
                            }
                            if (noMin && noMax) {
                                max = 1;
                                noMax = false
                            }
                            min = +min || 0;
                            if (noMax) {
                                max = min;
                                min = 0
                            } else {
                                max = +max || 0
                            }
                            if (floating || min % 1 || max % 1) {
                                var rand = nativeRandom();
                                return nativeMin(min + rand * (max - min + parseFloat("1e-" + ((rand + "").length - 1))), max)
                            }
                            return baseRandom(min, max)
                        }
                        var camelCase = createCompounder(function(result, word, index) {
                            word = word.toLowerCase();
                            return result + (index ? word.charAt(0).toUpperCase() + word.slice(1) : word)
                        });

                        function capitalize(string) {
                            string = baseToString(string);
                            return string && string.charAt(0).toUpperCase() + string.slice(1)
                        }

                        function deburr(string) {
                            string = baseToString(string);
                            return string && string.replace(reLatin1, deburrLetter).replace(reComboMark, "")
                        }

                        function endsWith(string, target, position) {
                            string = baseToString(string);
                            target = target + "";
                            var length = string.length;
                            position = position === undefined ? length : nativeMin(position < 0 ? 0 : +position || 0, length);
                            position -= target.length;
                            return position >= 0 && string.indexOf(target, position) == position
                        }

                        function escape(string) {
                            string = baseToString(string);
                            return string && reHasUnescapedHtml.test(string) ? string.replace(reUnescapedHtml, escapeHtmlChar) : string
                        }

                        function escapeRegExp(string) {
                            string = baseToString(string);
                            return string && reHasRegExpChars.test(string) ? string.replace(reRegExpChars, escapeRegExpChar) : string || "(?:)"
                        }
                        var kebabCase = createCompounder(function(result, word, index) {
                            return result + (index ? "-" : "") + word.toLowerCase()
                        });

                        function pad(string, length, chars) {
                            string = baseToString(string);
                            length = +length;
                            var strLength = string.length;
                            if (strLength >= length || !nativeIsFinite(length)) {
                                return string
                            }
                            var mid = (length - strLength) / 2,
                                leftLength = nativeFloor(mid),
                                rightLength = nativeCeil(mid);
                            chars = createPadding("", rightLength, chars);
                            return chars.slice(0, leftLength) + string + chars
                        }
                        var padLeft = createPadDir();
                        var padRight = createPadDir(true);

                        function parseInt(string, radix, guard) {
                            if (guard ? isIterateeCall(string, radix, guard) : radix == null) {
                                radix = 0
                            } else if (radix) {
                                radix = +radix
                            }
                            string = trim(string);
                            return nativeParseInt(string, radix || (reHasHexPrefix.test(string) ? 16 : 10))
                        }

                        function repeat(string, n) {
                            var result = "";
                            string = baseToString(string);
                            n = +n;
                            if (n < 1 || !string || !nativeIsFinite(n)) {
                                return result
                            }
                            do {
                                if (n % 2) {
                                    result += string
                                }
                                n = nativeFloor(n / 2);
                                string += string
                            } while (n);
                            return result
                        }
                        var snakeCase = createCompounder(function(result, word, index) {
                            return result + (index ? "_" : "") + word.toLowerCase()
                        });
                        var startCase = createCompounder(function(result, word, index) {
                            return result + (index ? " " : "") + (word.charAt(0).toUpperCase() + word.slice(1))
                        });

                        function startsWith(string, target, position) {
                            string = baseToString(string);
                            position = position == null ? 0 : nativeMin(position < 0 ? 0 : +position || 0, string.length);
                            return string.lastIndexOf(target, position) == position
                        }

                        function template(string, options, otherOptions) {
                            var settings = lodash.templateSettings;
                            if (otherOptions && isIterateeCall(string, options, otherOptions)) {
                                options = otherOptions = undefined
                            }
                            string = baseToString(string);
                            options = assignWith(baseAssign({}, otherOptions || options), settings, assignOwnDefaults);
                            var imports = assignWith(baseAssign({}, options.imports), settings.imports, assignOwnDefaults),
                                importsKeys = keys(imports),
                                importsValues = baseValues(imports, importsKeys);
                            var isEscaping, isEvaluating, index = 0,
                                interpolate = options.interpolate || reNoMatch,
                                source = "__p += '";
                            var reDelimiters = RegExp((options.escape || reNoMatch).source + "|" + interpolate.source + "|" + (interpolate === reInterpolate ? reEsTemplate : reNoMatch).source + "|" + (options.evaluate || reNoMatch).source + "|$", "g");
                            var sourceURL = "//# sourceURL=" + ("sourceURL" in options ? options.sourceURL : "lodash.templateSources[" + ++templateCounter + "]") + "\n";
                            string.replace(reDelimiters, function(match, escapeValue, interpolateValue, esTemplateValue, evaluateValue, offset) {
                                interpolateValue || (interpolateValue = esTemplateValue);
                                source += string.slice(index, offset).replace(reUnescapedString, escapeStringChar);
                                if (escapeValue) {
                                    isEscaping = true;
                                    source += "' +\n__e(" + escapeValue + ") +\n'"
                                }
                                if (evaluateValue) {
                                    isEvaluating = true;
                                    source += "';\n" + evaluateValue + ";\n__p += '"
                                }
                                if (interpolateValue) {
                                    source += "' +\n((__t = (" + interpolateValue + ")) == null ? '' : __t) +\n'"
                                }
                                index = offset + match.length;
                                return match
                            });
                            source += "';\n";
                            var variable = options.variable;
                            if (!variable) {
                                source = "with (obj) {\n" + source + "\n}\n"
                            }
                            source = (isEvaluating ? source.replace(reEmptyStringLeading, "") : source).replace(reEmptyStringMiddle, "$1").replace(reEmptyStringTrailing, "$1;");
                            source = "function(" + (variable || "obj") + ") {\n" + (variable ? "" : "obj || (obj = {});\n") + "var __t, __p = ''" + (isEscaping ? ", __e = _.escape" : "") + (isEvaluating ? ", __j = Array.prototype.join;\n" + "function print() { __p += __j.call(arguments, '') }\n" : ";\n") + source + "return __p\n}";
                            var result = attempt(function() {
                                return Function(importsKeys, sourceURL + "return " + source).apply(undefined, importsValues)
                            });
                            result.source = source;
                            if (isError(result)) {
                                throw result
                            }
                            return result
                        }

                        function trim(string, chars, guard) {
                            var value = string;
                            string = baseToString(string);
                            if (!string) {
                                return string
                            }
                            if (guard ? isIterateeCall(value, chars, guard) : chars == null) {
                                return string.slice(trimmedLeftIndex(string), trimmedRightIndex(string) + 1)
                            }
                            chars = chars + "";
                            return string.slice(charsLeftIndex(string, chars), charsRightIndex(string, chars) + 1)
                        }

                        function trimLeft(string, chars, guard) {
                            var value = string;
                            string = baseToString(string);
                            if (!string) {
                                return string
                            }
                            if (guard ? isIterateeCall(value, chars, guard) : chars == null) {
                                return string.slice(trimmedLeftIndex(string))
                            }
                            return string.slice(charsLeftIndex(string, chars + ""))
                        }

                        function trimRight(string, chars, guard) {
                            var value = string;
                            string = baseToString(string);
                            if (!string) {
                                return string
                            }
                            if (guard ? isIterateeCall(value, chars, guard) : chars == null) {
                                return string.slice(0, trimmedRightIndex(string) + 1)
                            }
                            return string.slice(0, charsRightIndex(string, chars + "") + 1)
                        }

                        function trunc(string, options, guard) {
                            if (guard && isIterateeCall(string, options, guard)) {
                                options = undefined
                            }
                            var length = DEFAULT_TRUNC_LENGTH,
                                omission = DEFAULT_TRUNC_OMISSION;
                            if (options != null) {
                                if (isObject(options)) {
                                    var separator = "separator" in options ? options.separator : separator;
                                    length = "length" in options ? +options.length || 0 : length;
                                    omission = "omission" in options ? baseToString(options.omission) : omission
                                } else {
                                    length = +options || 0
                                }
                            }
                            string = baseToString(string);
                            if (length >= string.length) {
                                return string
                            }
                            var end = length - omission.length;
                            if (end < 1) {
                                return omission
                            }
                            var result = string.slice(0, end);
                            if (separator == null) {
                                return result + omission
                            }
                            if (isRegExp(separator)) {
                                if (string.slice(end).search(separator)) {
                                    var match, newEnd, substring = string.slice(0, end);
                                    if (!separator.global) {
                                        separator = RegExp(separator.source, (reFlags.exec(separator) || "") + "g")
                                    }
                                    separator.lastIndex = 0;
                                    while (match = separator.exec(substring)) {
                                        newEnd = match.index
                                    }
                                    result = result.slice(0, newEnd == null ? end : newEnd)
                                }
                            } else if (string.indexOf(separator, end) != end) {
                                var index = result.lastIndexOf(separator);
                                if (index > -1) {
                                    result = result.slice(0, index)
                                }
                            }
                            return result + omission
                        }

                        function unescape(string) {
                            string = baseToString(string);
                            return string && reHasEscapedHtml.test(string) ? string.replace(reEscapedHtml, unescapeHtmlChar) : string
                        }

                        function words(string, pattern, guard) {
                            if (guard && isIterateeCall(string, pattern, guard)) {
                                pattern = undefined
                            }
                            string = baseToString(string);
                            return string.match(pattern || reWords) || []
                        }
                        var attempt = restParam(function(func, args) {
                            try {
                                return func.apply(undefined, args)
                            } catch (e) {
                                return isError(e) ? e : new Error(e)
                            }
                        });

                        function callback(func, thisArg, guard) {
                            if (guard && isIterateeCall(func, thisArg, guard)) {
                                thisArg = undefined
                            }
                            return isObjectLike(func) ? matches(func) : baseCallback(func, thisArg)
                        }

                        function constant(value) {
                            return function() {
                                return value
                            }
                        }

                        function identity(value) {
                            return value
                        }

                        function matches(source) {
                            return baseMatches(baseClone(source, true))
                        }

                        function matchesProperty(path, srcValue) {
                            return baseMatchesProperty(path, baseClone(srcValue, true))
                        }
                        var method = restParam(function(path, args) {
                            return function(object) {
                                return invokePath(object, path, args)
                            }
                        });
                        var methodOf = restParam(function(object, args) {
                            return function(path) {
                                return invokePath(object, path, args)
                            }
                        });

                        function mixin(object, source, options) {
                            if (options == null) {
                                var isObj = isObject(source),
                                    props = isObj ? keys(source) : undefined,
                                    methodNames = props && props.length ? baseFunctions(source, props) : undefined;
                                if (!(methodNames ? methodNames.length : isObj)) {
                                    methodNames = false;
                                    options = source;
                                    source = object;
                                    object = this
                                }
                            }
                            if (!methodNames) {
                                methodNames = baseFunctions(source, keys(source))
                            }
                            var chain = true,
                                index = -1,
                                isFunc = isFunction(object),
                                length = methodNames.length;
                            if (options === false) {
                                chain = false
                            } else if (isObject(options) && "chain" in options) {
                                chain = options.chain
                            }
                            while (++index < length) {
                                var methodName = methodNames[index],
                                    func = source[methodName];
                                object[methodName] = func;
                                if (isFunc) {
                                    object.prototype[methodName] = function(func) {
                                        return function() {
                                            var chainAll = this.__chain__;
                                            if (chain || chainAll) {
                                                var result = object(this.__wrapped__),
                                                    actions = result.__actions__ = arrayCopy(this.__actions__);
                                                actions.push({
                                                    func: func,
                                                    args: arguments,
                                                    thisArg: object
                                                });
                                                result.__chain__ = chainAll;
                                                return result
                                            }
                                            return func.apply(object, arrayPush([this.value()], arguments))
                                        }
                                    }(func)
                                }
                            }
                            return object
                        }

                        function noConflict() {
                            root._ = oldDash;
                            return this
                        }

                        function noop() {}

                        function property(path) {
                            return isKey(path) ? baseProperty(path) : basePropertyDeep(path)
                        }

                        function propertyOf(object) {
                            return function(path) {
                                return baseGet(object, toPath(path), path + "")
                            }
                        }

                        function range(start, end, step) {
                            if (step && isIterateeCall(start, end, step)) {
                                end = step = undefined
                            }
                            start = +start || 0;
                            step = step == null ? 1 : +step || 0;
                            if (end == null) {
                                end = start;
                                start = 0
                            } else {
                                end = +end || 0
                            }
                            var index = -1,
                                length = nativeMax(nativeCeil((end - start) / (step || 1)), 0),
                                result = Array(length);
                            while (++index < length) {
                                result[index] = start;
                                start += step
                            }
                            return result
                        }

                        function times(n, iteratee, thisArg) {
                            n = nativeFloor(n);
                            if (n < 1 || !nativeIsFinite(n)) {
                                return []
                            }
                            var index = -1,
                                result = Array(nativeMin(n, MAX_ARRAY_LENGTH));
                            iteratee = bindCallback(iteratee, thisArg, 1);
                            while (++index < n) {
                                if (index < MAX_ARRAY_LENGTH) {
                                    result[index] = iteratee(index)
                                } else {
                                    iteratee(index)
                                }
                            }
                            return result
                        }

                        function uniqueId(prefix) {
                            var id = ++idCounter;
                            return baseToString(prefix) + id
                        }

                        function add(augend, addend) {
                            return (+augend || 0) + (+addend || 0)
                        }
                        var ceil = createRound("ceil");
                        var floor = createRound("floor");
                        var max = createExtremum(gt, NEGATIVE_INFINITY);
                        var min = createExtremum(lt, POSITIVE_INFINITY);
                        var round = createRound("round");

                        function sum(collection, iteratee, thisArg) {
                            if (thisArg && isIterateeCall(collection, iteratee, thisArg)) {
                                iteratee = undefined
                            }
                            iteratee = getCallback(iteratee, thisArg, 3);
                            return iteratee.length == 1 ? arraySum(isArray(collection) ? collection : toIterable(collection), iteratee) : baseSum(collection, iteratee)
                        }
                        lodash.prototype = baseLodash.prototype;
                        LodashWrapper.prototype = baseCreate(baseLodash.prototype);
                        LodashWrapper.prototype.constructor = LodashWrapper;
                        LazyWrapper.prototype = baseCreate(baseLodash.prototype);
                        LazyWrapper.prototype.constructor = LazyWrapper;
                        MapCache.prototype["delete"] = mapDelete;
                        MapCache.prototype.get = mapGet;
                        MapCache.prototype.has = mapHas;
                        MapCache.prototype.set = mapSet;
                        SetCache.prototype.push = cachePush;
                        memoize.Cache = MapCache;
                        lodash.after = after;
                        lodash.ary = ary;
                        lodash.assign = assign;
                        lodash.at = at;
                        lodash.before = before;
                        lodash.bind = bind;
                        lodash.bindAll = bindAll;
                        lodash.bindKey = bindKey;
                        lodash.callback = callback;
                        lodash.chain = chain;
                        lodash.chunk = chunk;
                        lodash.compact = compact;
                        lodash.constant = constant;
                        lodash.countBy = countBy;
                        lodash.create = create;
                        lodash.curry = curry;
                        lodash.curryRight = curryRight;
                        lodash.debounce = debounce;
                        lodash.defaults = defaults;
                        lodash.defaultsDeep = defaultsDeep;
                        lodash.defer = defer;
                        lodash.delay = delay;
                        lodash.difference = difference;
                        lodash.drop = drop;
                        lodash.dropRight = dropRight;
                        lodash.dropRightWhile = dropRightWhile;
                        lodash.dropWhile = dropWhile;
                        lodash.fill = fill;
                        lodash.filter = filter;
                        lodash.flatten = flatten;
                        lodash.flattenDeep = flattenDeep;
                        lodash.flow = flow;
                        lodash.flowRight = flowRight;
                        lodash.forEach = forEach;
                        lodash.forEachRight = forEachRight;
                        lodash.forIn = forIn;
                        lodash.forInRight = forInRight;
                        lodash.forOwn = forOwn;
                        lodash.forOwnRight = forOwnRight;
                        lodash.functions = functions;
                        lodash.groupBy = groupBy;
                        lodash.indexBy = indexBy;
                        lodash.initial = initial;
                        lodash.intersection = intersection;
                        lodash.invert = invert;
                        lodash.invoke = invoke;
                        lodash.keys = keys;
                        lodash.keysIn = keysIn;
                        lodash.map = map;
                        lodash.mapKeys = mapKeys;
                        lodash.mapValues = mapValues;
                        lodash.matches = matches;
                        lodash.matchesProperty = matchesProperty;
                        lodash.memoize = memoize;
                        lodash.merge = merge;
                        lodash.method = method;
                        lodash.methodOf = methodOf;
                        lodash.mixin = mixin;
                        lodash.modArgs = modArgs;
                        lodash.negate = negate;
                        lodash.omit = omit;
                        lodash.once = once;
                        lodash.pairs = pairs;
                        lodash.partial = partial;
                        lodash.partialRight = partialRight;
                        lodash.partition = partition;
                        lodash.pick = pick;
                        lodash.pluck = pluck;
                        lodash.property = property;
                        lodash.propertyOf = propertyOf;
                        lodash.pull = pull;
                        lodash.pullAt = pullAt;
                        lodash.range = range;
                        lodash.rearg = rearg;
                        lodash.reject = reject;
                        lodash.remove = remove;
                        lodash.rest = rest;
                        lodash.restParam = restParam;
                        lodash.set = set;
                        lodash.shuffle = shuffle;
                        lodash.slice = slice;
                        lodash.sortBy = sortBy;
                        lodash.sortByAll = sortByAll;
                        lodash.sortByOrder = sortByOrder;
                        lodash.spread = spread;
                        lodash.take = take;
                        lodash.takeRight = takeRight;
                        lodash.takeRightWhile = takeRightWhile;
                        lodash.takeWhile = takeWhile;
                        lodash.tap = tap;
                        lodash.throttle = throttle;
                        lodash.thru = thru;
                        lodash.times = times;
                        lodash.toArray = toArray;
                        lodash.toPlainObject = toPlainObject;
                        lodash.transform = transform;
                        lodash.union = union;
                        lodash.uniq = uniq;
                        lodash.unzip = unzip;
                        lodash.unzipWith = unzipWith;
                        lodash.values = values;
                        lodash.valuesIn = valuesIn;
                        lodash.where = where;
                        lodash.without = without;
                        lodash.wrap = wrap;
                        lodash.xor = xor;
                        lodash.zip = zip;
                        lodash.zipObject = zipObject;
                        lodash.zipWith = zipWith;
                        lodash.backflow = flowRight;
                        lodash.collect = map;
                        lodash.compose = flowRight;
                        lodash.each = forEach;
                        lodash.eachRight = forEachRight;
                        lodash.extend = assign;
                        lodash.iteratee = callback;
                        lodash.methods = functions;
                        lodash.object = zipObject;
                        lodash.select = filter;
                        lodash.tail = rest;
                        lodash.unique = uniq;
                        mixin(lodash, lodash);
                        lodash.add = add;
                        lodash.attempt = attempt;
                        lodash.camelCase = camelCase;
                        lodash.capitalize = capitalize;
                        lodash.ceil = ceil;
                        lodash.clone = clone;
                        lodash.cloneDeep = cloneDeep;
                        lodash.deburr = deburr;
                        lodash.endsWith = endsWith;
                        lodash.escape = escape;
                        lodash.escapeRegExp = escapeRegExp;
                        lodash.every = every;
                        lodash.find = find;
                        lodash.findIndex = findIndex;
                        lodash.findKey = findKey;
                        lodash.findLast = findLast;
                        lodash.findLastIndex = findLastIndex;
                        lodash.findLastKey = findLastKey;
                        lodash.findWhere = findWhere;
                        lodash.first = first;
                        lodash.floor = floor;
                        lodash.get = get;
                        lodash.gt = gt;
                        lodash.gte = gte;
                        lodash.has = has;
                        lodash.identity = identity;
                        lodash.includes = includes;
                        lodash.indexOf = indexOf;
                        lodash.inRange = inRange;
                        lodash.isArguments = isArguments;
                        lodash.isArray = isArray;
                        lodash.isBoolean = isBoolean;
                        lodash.isDate = isDate;
                        lodash.isElement = isElement;
                        lodash.isEmpty = isEmpty;
                        lodash.isEqual = isEqual;
                        lodash.isError = isError;
                        lodash.isFinite = isFinite;
                        lodash.isFunction = isFunction;
                        lodash.isMatch = isMatch;
                        lodash.isNaN = isNaN;
                        lodash.isNative = isNative;
                        lodash.isNull = isNull;
                        lodash.isNumber = isNumber;
                        lodash.isObject = isObject;
                        lodash.isPlainObject = isPlainObject;
                        lodash.isRegExp = isRegExp;
                        lodash.isString = isString;
                        lodash.isTypedArray = isTypedArray;
                        lodash.isUndefined = isUndefined;
                        lodash.kebabCase = kebabCase;
                        lodash.last = last;
                        lodash.lastIndexOf = lastIndexOf;
                        lodash.lt = lt;
                        lodash.lte = lte;
                        lodash.max = max;
                        lodash.min = min;
                        lodash.noConflict = noConflict;
                        lodash.noop = noop;
                        lodash.now = now;
                        lodash.pad = pad;
                        lodash.padLeft = padLeft;
                        lodash.padRight = padRight;
                        lodash.parseInt = parseInt;
                        lodash.random = random;
                        lodash.reduce = reduce;
                        lodash.reduceRight = reduceRight;
                        lodash.repeat = repeat;
                        lodash.result = result;
                        lodash.round = round;
                        lodash.runInContext = runInContext;
                        lodash.size = size;
                        lodash.snakeCase = snakeCase;
                        lodash.some = some;
                        lodash.sortedIndex = sortedIndex;
                        lodash.sortedLastIndex = sortedLastIndex;
                        lodash.startCase = startCase;
                        lodash.startsWith = startsWith;
                        lodash.sum = sum;
                        lodash.template = template;
                        lodash.trim = trim;
                        lodash.trimLeft = trimLeft;
                        lodash.trimRight = trimRight;
                        lodash.trunc = trunc;
                        lodash.unescape = unescape;
                        lodash.uniqueId = uniqueId;
                        lodash.words = words;
                        lodash.all = every;
                        lodash.any = some;
                        lodash.contains = includes;
                        lodash.eq = isEqual;
                        lodash.detect = find;
                        lodash.foldl = reduce;
                        lodash.foldr = reduceRight;
                        lodash.head = first;
                        lodash.include = includes;
                        lodash.inject = reduce;
                        mixin(lodash, function() {
                            var source = {};
                            baseForOwn(lodash, function(func, methodName) {
                                if (!lodash.prototype[methodName]) {
                                    source[methodName] = func
                                }
                            });
                            return source
                        }(), false);
                        lodash.sample = sample;
                        lodash.prototype.sample = function(n) {
                            if (!this.__chain__ && n == null) {
                                return sample(this.value())
                            }
                            return this.thru(function(value) {
                                return sample(value, n)
                            })
                        };
                        lodash.VERSION = VERSION;
                        arrayEach(["bind", "bindKey", "curry", "curryRight", "partial", "partialRight"], function(methodName) {
                            lodash[methodName].placeholder = lodash
                        });
                        arrayEach(["drop", "take"], function(methodName, index) {
                            LazyWrapper.prototype[methodName] = function(n) {
                                var filtered = this.__filtered__;
                                if (filtered && !index) {
                                    return new LazyWrapper(this)
                                }
                                n = n == null ? 1 : nativeMax(nativeFloor(n) || 0, 0);
                                var result = this.clone();
                                if (filtered) {
                                    result.__takeCount__ = nativeMin(result.__takeCount__, n)
                                } else {
                                    result.__views__.push({
                                        size: n,
                                        type: methodName + (result.__dir__ < 0 ? "Right" : "")
                                    })
                                }
                                return result
                            };
                            LazyWrapper.prototype[methodName + "Right"] = function(n) {
                                return this.reverse()[methodName](n).reverse()
                            }
                        });
                        arrayEach(["filter", "map", "takeWhile"], function(methodName, index) {
                            var type = index + 1,
                                isFilter = type != LAZY_MAP_FLAG;
                            LazyWrapper.prototype[methodName] = function(iteratee, thisArg) {
                                var result = this.clone();
                                result.__iteratees__.push({
                                    iteratee: getCallback(iteratee, thisArg, 1),
                                    type: type
                                });
                                result.__filtered__ = result.__filtered__ || isFilter;
                                return result
                            }
                        });
                        arrayEach(["first", "last"], function(methodName, index) {
                            var takeName = "take" + (index ? "Right" : "");
                            LazyWrapper.prototype[methodName] = function() {
                                return this[takeName](1).value()[0]
                            }
                        });
                        arrayEach(["initial", "rest"], function(methodName, index) {
                            var dropName = "drop" + (index ? "" : "Right");
                            LazyWrapper.prototype[methodName] = function() {
                                return this.__filtered__ ? new LazyWrapper(this) : this[dropName](1)
                            }
                        });
                        arrayEach(["pluck", "where"], function(methodName, index) {
                            var operationName = index ? "filter" : "map",
                                createCallback = index ? baseMatches : property;
                            LazyWrapper.prototype[methodName] = function(value) {
                                return this[operationName](createCallback(value))
                            }
                        });
                        LazyWrapper.prototype.compact = function() {
                            return this.filter(identity)
                        };
                        LazyWrapper.prototype.reject = function(predicate, thisArg) {
                            predicate = getCallback(predicate, thisArg, 1);
                            return this.filter(function(value) {
                                return !predicate(value)
                            })
                        };
                        LazyWrapper.prototype.slice = function(start, end) {
                            start = start == null ? 0 : +start || 0;
                            var result = this;
                            if (result.__filtered__ && (start > 0 || end < 0)) {
                                return new LazyWrapper(result)
                            }
                            if (start < 0) {
                                result = result.takeRight(-start)
                            } else if (start) {
                                result = result.drop(start)
                            }
                            if (end !== undefined) {
                                end = +end || 0;
                                result = end < 0 ? result.dropRight(-end) : result.take(end - start)
                            }
                            return result
                        };
                        LazyWrapper.prototype.takeRightWhile = function(predicate, thisArg) {
                            return this.reverse().takeWhile(predicate, thisArg).reverse()
                        };
                        LazyWrapper.prototype.toArray = function() {
                            return this.take(POSITIVE_INFINITY)
                        };
                        baseForOwn(LazyWrapper.prototype, function(func, methodName) {
                            var checkIteratee = /^(?:filter|map|reject)|While$/.test(methodName),
                                retUnwrapped = /^(?:first|last)$/.test(methodName),
                                lodashFunc = lodash[retUnwrapped ? "take" + (methodName == "last" ? "Right" : "") : methodName];
                            if (!lodashFunc) {
                                return
                            }
                            lodash.prototype[methodName] = function() {
                                var args = retUnwrapped ? [1] : arguments,
                                    chainAll = this.__chain__,
                                    value = this.__wrapped__,
                                    isHybrid = !!this.__actions__.length,
                                    isLazy = value instanceof LazyWrapper,
                                    iteratee = args[0],
                                    useLazy = isLazy || isArray(value);
                                if (useLazy && checkIteratee && typeof iteratee == "function" && iteratee.length != 1) {
                                    isLazy = useLazy = false
                                }
                                var interceptor = function(value) {
                                    return retUnwrapped && chainAll ? lodashFunc(value, 1)[0] : lodashFunc.apply(undefined, arrayPush([value], args))
                                };
                                var action = {
                                        func: thru,
                                        args: [interceptor],
                                        thisArg: undefined
                                    },
                                    onlyLazy = isLazy && !isHybrid;
                                if (retUnwrapped && !chainAll) {
                                    if (onlyLazy) {
                                        value = value.clone();
                                        value.__actions__.push(action);
                                        return func.call(value)
                                    }
                                    return lodashFunc.call(undefined, this.value())[0]
                                }
                                if (!retUnwrapped && useLazy) {
                                    value = onlyLazy ? value : new LazyWrapper(this);
                                    var result = func.apply(value, args);
                                    result.__actions__.push(action);
                                    return new LodashWrapper(result, chainAll)
                                }
                                return this.thru(interceptor)
                            }
                        });
                        arrayEach(["join", "pop", "push", "replace", "shift", "sort", "splice", "split", "unshift"], function(methodName) {
                            var func = (/^(?:replace|split)$/.test(methodName) ? stringProto : arrayProto)[methodName],
                                chainName = /^(?:push|sort|unshift)$/.test(methodName) ? "tap" : "thru",
                                retUnwrapped = /^(?:join|pop|replace|shift)$/.test(methodName);
                            lodash.prototype[methodName] = function() {
                                var args = arguments;
                                if (retUnwrapped && !this.__chain__) {
                                    return func.apply(this.value(), args)
                                }
                                return this[chainName](function(value) {
                                    return func.apply(value, args)
                                })
                            }
                        });
                        baseForOwn(LazyWrapper.prototype, function(func, methodName) {
                            var lodashFunc = lodash[methodName];
                            if (lodashFunc) {
                                var key = lodashFunc.name,
                                    names = realNames[key] || (realNames[key] = []);
                                names.push({
                                    name: methodName,
                                    func: lodashFunc
                                })
                            }
                        });
                        realNames[createHybridWrapper(undefined, BIND_KEY_FLAG).name] = [{
                            name: "wrapper",
                            func: undefined
                        }];
                        LazyWrapper.prototype.clone = lazyClone;
                        LazyWrapper.prototype.reverse = lazyReverse;
                        LazyWrapper.prototype.value = lazyValue;
                        lodash.prototype.chain = wrapperChain;
                        lodash.prototype.commit = wrapperCommit;
                        lodash.prototype.concat = wrapperConcat;
                        lodash.prototype.plant = wrapperPlant;
                        lodash.prototype.reverse = wrapperReverse;
                        lodash.prototype.toString = wrapperToString;
                        lodash.prototype.run = lodash.prototype.toJSON = lodash.prototype.valueOf = lodash.prototype.value = wrapperValue;
                        lodash.prototype.collect = lodash.prototype.map;
                        lodash.prototype.head = lodash.prototype.first;
                        lodash.prototype.select = lodash.prototype.filter;
                        lodash.prototype.tail = lodash.prototype.rest;
                        return lodash
                    }
                    var _ = runInContext();
                    if (typeof define == "function" && typeof define.amd == "object" && define.amd) {
                        root._ = _;
                        define(function() {
                            return _
                        })
                    } else if (freeExports && freeModule) {
                        if (moduleExports) {
                            (freeModule.exports = _)._ = _
                        } else {
                            freeExports._ = _
                        }
                    } else {
                        root._ = _
                    }
                }).call(this)
            }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
        }, {}]
    }, {}, [1])(1)
});

//====== OK, read from here on: