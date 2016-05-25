require("./style/hbp.scss");
var nav = require("./scripts/sequential-nav.js");
var graph = require("./scripts/force-directed-graph.js");
var $ = require("jquery");

$(document).ready(nav);
$(document).ready(function() {
  graph('subproject-relations.json', {
    element: '#graph',
    width: $('body').width()/2,
    height: $('body').height(),
    radius: 20
  });
});
