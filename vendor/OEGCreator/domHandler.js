// thanks to http://www.randomsnippets.com/2008/02/12/how-to-hide-and-show-your-div/
function toggleAdvanced() {
  var element = document.getElementById('advanced');
  if (element.style.display == 'inherit') {
    element.style.display = 'none';
	document.getElementById('advancedLink').innerHTML = 'Advanced';
  }
  else {
    element.style.display = 'inherit';
    document.getElementById('advancedLink').innerHTML = 'Hide Advanced';
  }
}