function buildNode(tag, attrs, content)
{
	var el = document.createElement(tag);
	if (attrs)
	{
		for (var key in attrs)
		{
			if (key === 'style') el.setAttribute('style', attrs[key]);
			else if (key === 'className') el.className = attrs[key];
			else if (key === 'href') el.setAttribute('href', attrs[key]);
			else if (key === 'target') el.setAttribute('target', attrs[key]);
			else el[key] = attrs[key];
		}
	}
	if (content !== undefined && content !== null)
	{
		if (typeof content === 'string')
		{
			el.appendChild(document.createTextNode(content));
		}
		else if (Array.isArray(content))
		{
			for (var i = 0; i < content.length; i++)
			{
				if (typeof content[i] === 'string')
					el.appendChild(document.createTextNode(content[i]));
				else
					el.appendChild(content[i]);
			}
		}
	}
	return el;
}

function repetiteurGetInfos(userId)
{
	fetch('resources/ajax/get.php?rdm=' + Math.random() + '&do=repetiteurInfos&userId=' + userId + '&y=' + year + '&t=' + term, {
		method: 'GET'
	})
	.then(function(response) { return response.text(); })
	.then(function(text) {
		var parser = new DOMParser();
		var responseXML = parser.parseFromString(text, 'text/xml');

		var error = responseXML.getElementsByTagName('error');
		if (error.length)
		{
			$('studentFixed').innerHTML = error[0].firstChild.data;
			return;
		}

		$('studentFixed').innerHTML = '';

		// ------------------------------------------------
		// pas d'erreurs ici, on traite
		var userName = responseXML.getElementsByTagName('name')[0].firstChild.data;
		var repId = responseXML.getElementsByTagName('id')[0].firstChild.data;

		// nom du r\u00e9p\u00e9titeur
		$('studentFixed').appendChild(buildNode('div', { style: 'font-weight: bold;' }, userName));

		// --------------------------------------------------------
		// cours enseign\u00e9s
		$('studentFixed').appendChild(buildNode('div', { style: 'font-weight: bold; margin-top: 10px;' }, 'Cours enseign\u00e9s'));

		var levels = responseXML.getElementsByTagName('level');
		var levelsCount = levels.length;

		var div = buildNode('div', { style: 'overflow: auto; max-height: 200px;' });

		for (var i = 0; i < levelsCount; i++)
		{
			div.appendChild(buildNode('span', {}, levels[i].getElementsByTagName('title')[0].firstChild.data));

			var subjects = levels[i].getElementsByTagName('subject');
			var subjectsCount = subjects.length;

			var ul = buildNode('ul');
			for (var j = 0; j < subjectsCount; j++)
				ul.appendChild(buildNode('li', {}, subjects[j].firstChild.data));

			div.appendChild(ul);
		}
		$('studentFixed').appendChild(div);

		// --------------------------------------------------------
		// endroits
		var places = responseXML.getElementsByTagName('place');
		var placesCount = places.length;

		if (placesCount == 1)
		{
			$('studentFixed').appendChild(buildNode('div', { style: 'font-weight: bold; margin-top: 20px;' }, ['Lieu d\'enseignement: ', buildNode('span', { style: 'font-weight: normal;' }, places[0].firstChild.data)]));
		}
		else
		{
			$('studentFixed').appendChild(buildNode('div', { style: 'font-weight: bold; margin-top: 20px;' }, 'Lieux d\'enseignement'));

			var ul = buildNode('ul');
			for (var j = 0; j < placesCount; j++)
				ul.appendChild(buildNode('li', {}, places[j].firstChild.data));
			$('studentFixed').appendChild(ul);
		}

		// lien pour \u00e9crire
		$('studentFixed').appendChild(buildNode('a', { href: 'index.php?p=stu&do=write&id=' + repId, target: '_blank' }, 'Ecrire \u00e0 ' + userName));

		// Mark as active for mobile modal + add close button
		$('studentFixed').classList.add('detail-active');
		var closeBtn = buildNode('button', { className: 'detail-close' }, 'Fermer');
		closeBtn.addEventListener('click', function() {
			$('studentFixed').classList.remove('detail-active');
		});
		$('studentFixed').appendChild(closeBtn);
	})
	.catch(function() {
		$('studentFixed').innerHTML = 'Erreur lors de la r\u00e9cup\u00e9ration des donn\u00e9es.';
	});
}
