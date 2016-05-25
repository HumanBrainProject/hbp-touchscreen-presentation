var $ = require("jquery");
var findSelectedNav = require('./selected-nav');

var sections;
var nav;

function activate() {
  var next = $('#next');
  var previous = $('#previous');
  next.on('click', nextSection);
  previous.on('click', previousSection);
  nav = $('.nav-sequential');
  sections = $('main section');
  if (!window.location.hash) {
    window.location = '#hbp';
  }
}

function nextSection(event) {
  event.preventDefault();
  var idx = findCurrentSectionIndex();
  navigateToSectionIdx(idx + 1);
}

function previousSection(event) {
  event.preventDefault();
  var idx = findCurrentSectionIndex();
  navigateToSectionIdx(idx - 1);
}

function navigateToSectionIdx(idx) {
  var section = sections.get(idx);
  if (!section) {
    section = sections.get(0)
  }
  window.location = '#' + section.id;
}

function findCurrentSectionIndex() {
  section = findSelectedNav();
  console.log(section);
  for (var i = 0; i < sections.length; i++) {
    var s = sections.get(i);
    if (s === section) {
      return i;
    }
  }
  return -1;
}

module.exports = activate;
