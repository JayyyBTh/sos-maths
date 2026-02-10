/* Vanilla JS shim replacing Prototype.js $() */
function $(id) { return document.getElementById(id); }

function expandReduce(id)
{
	var el = $(id);
	var img = $(id + 'Img');
	if (el.classList.contains('collapsed'))
	{
		el.classList.remove('collapsed');
		img.src = 'images/reduce.gif';
	}
	else
	{
		el.classList.add('collapsed');
		img.src = 'images/expand.gif';
	}
}

function displayError(text)
{
	$('infos').innerHTML = text;
	$('infos').className = 'errorBox';
}

/* Hamburger menu toggle */
document.addEventListener('DOMContentLoaded', function() {
	var toggle = document.getElementById('menuToggle');
	var menu = document.getElementById('menu');
	if (toggle && menu) {
		toggle.addEventListener('click', function() {
			menu.classList.toggle('menu-open');
			var expanded = toggle.getAttribute('aria-expanded') === 'true';
			toggle.setAttribute('aria-expanded', !expanded);
		});
	}
});
