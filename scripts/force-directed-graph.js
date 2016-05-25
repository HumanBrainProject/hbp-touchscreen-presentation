var d3 = require('d3');
var selectedNav = require('./selected-nav');

module.exports = forceDirectedGraph;

function forceDirectedGraph(source, options) {
  var width = options.width || 960;
  var height = options.height || 500;
  var selector = options.element || 'body';
  var radius = options.radius || 5;
  var started;
  var internalSize = 500;
  var color = d3.scale.category20();
  var selectedNode;


  var force = d3.layout.force()
  .charge(-120)
  .linkDistance(200)
  .friction(0.3)
  .size([internalSize, internalSize]);

  var svg = d3.select(selector).append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr('viewBox', '0 0 ' + internalSize + ' ' + internalSize)
  .attr('preserveAspectRatio', 'xMidYMid meet');

  d3.json(source, render)

  $(window).on('hashchange', renderNav)

  function renderNav() {
    var id = selectedNav().id;
    var node = svg.selectAll('.' + id.toLowerCase());
    if (node.empty()) {
      if (selectedNode) {
        selectedNode.fixed = false;
        force.resume();
      } else {
        force.start();
      }
    } else {
      moveToCenter(node);
    }

  }

  function moveToCenter(nodes) {
    moveTo(nodes, internalSize/2, internalSize/2, 'lock');
    if (selectedNode) {
      moveTo(d3.select('.node.' + selectedNode.class), internalSize/2, internalSize/2 + 100);
    }
  }

  function moveTo(nodes, x, y, lock) {
    nodes.selectAll('circle')
    .transition()
    .attr('cx', function(d) {
      return x;
    })
    .attr('cy', function(d) {
      return y;
    })
    .each('end', function(d) {
      d.px = d.x = x;
      d.py = d.y = y;
      if (lock) {
        d.fixed = true;
        if (selectedNode) {
          selectedNode.fixed = false;
        }
        selectedNode = d;
      }
      if (started){
        force.resume();
      } else {
        started = true;
        force.start();
      }
    });
    nodes.selectAll('text')
    .transition()
    .attr('x', function(d) {
      return x;
    })
    .attr('y', function(d) {
      return y;
    })
  }

  function render(error, graph) {
    if (error) {
      return;
    }

    var link = svg.selectAll(".link")
      .data(graph.links)
      .enter().append("line")
      .attr("class", "link")
      .style("stroke-width", function(d) { return Math.sqrt(d.value); });

    var node = svg.selectAll(".node")
      .data(graph.nodes)
      .enter().append("a")
        .attr('xlink:href', function(d) { return d.href })
        .attr('class', function(d) { return 'node ' + d.class; });
    var circle = node.append("circle")
      .attr("r", radius)
      .attr('cx', internalSize/2)
      .attr('cy', internalSize/2);
    var label = node.append("text")
      .text(function(d) { return d.name; })
      .attr('class', 'label')
      .attr('alignment-baseline', 'middle')
      .attr('text-anchor', 'middle')
      .attr('height', 2 * radius)
      .attr('x', internalSize/2)
      .attr('y', internalSize/2);

    force.nodes(graph.nodes)
    .links(graph.links);

    renderNav();

    force.on("tick", function() {
      link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

      circle.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
      label
        .attr("x", function(d) { return d.x })
        .attr("y", function(d) { return d.y });
    });
  }
}
