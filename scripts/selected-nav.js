function findSelectedNav() {
  var id;
  if (window.location.hash && window.location.hash.length) {
    id = window.location.hash.substring(1);
  } else {
    id = 'hbp';
  }
  return $('#'+id).get(0);
}
module.exports = findSelectedNav;
