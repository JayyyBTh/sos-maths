function formOnChange()
{
	sendFormValues(getFormValues());
}

function getFormValues()
{
	var queryPost = '';
	var queryPostTemp = '';

	// ---------------------------------------------
	// sujets d'enseignement
	teachingSubject = new Array();
	var divs = $('teachingSubjects').getElementsByTagName('input');
	var divsCount = divs.length;
	queryPostTemp = '';
	for (var i = 0; i < divsCount; i++)
	{
		if (divs[i].checked)
		{
			teachingSubject.push(divs[i].value);
			queryPostTemp += (queryPostTemp == '' ? '' : ',') + divs[i].value;
		}
	}
	queryPost += 'teachingSubjects=' + queryPostTemp;
	$('subjectInfo').innerHTML = teachingSubject.length == 0 ? 'Choisissez au moins un cours' : ('Cours choisis: ' + teachingSubject.length);

	// ---------------------------------------------
	// langue
	languages = new Array();
	var divs = $('languages').getElementsByTagName('input');
	var divsCount = divs.length;
	queryPostTemp = '';
	for (var i = 0; i < divsCount; i++)
	{
		if (divs[i].checked)
		{
			languages.push(divs[i].value);
			queryPostTemp += (queryPostTemp == '' ? '' : ',') + divs[i].value;
		}
	}
	queryPost += '&language=' + queryPostTemp;
	$('languageInfo').innerHTML = languages.length == 0 ? 'Choisissez au moins une langue' : languages.join(', ');

	// ---------------------------------------------
	// dispos
	availabilities = new Array();
	var divs = $('availabilities').getElementsByTagName('input');
	var divsCount = divs.length;
	queryPostTemp = '';
	for (var i = 0; i < divsCount; i++)
	{
		if (divs[i].checked)
		{
			availabilities.push(divs[i].value);
			queryPostTemp += (queryPostTemp == '' ? '' : ',') + divs[i].name;
		}
	}
	queryPost += '&availibilityDay=' + queryPostTemp;
	$('availabilitiesInfo').innerHTML = availabilities.length == 0 ? 'Choisissez au moins une p\u00e9riode' : availabilities.length;

	// ---------------------------------------------
	// levelStudies
	levelStudies = new Array();
	var divs = $('levelStudies').getElementsByTagName('input');
	var divsCount = divs.length;
	queryPostTemp = '';
	for (var i = 0; i < divsCount; i++)
	{
		if (divs[i].checked)
		{
			levelStudies.push(divs[i].value);
			queryPostTemp += (queryPostTemp == '' ? '' : ',') + divs[i].value;
		}
	}
	queryPost += '&levelStudies=' + queryPostTemp;

	// ---------------------------------------------
	// section
	section = new Array();
	var divs = $('section').getElementsByTagName('input');
	var divsCount = divs.length;
	queryPostTemp = '';
	for (var i = 0; i < divsCount; i++)
	{
		if (divs[i].checked)
		{
			section.push(divs[i].value);
			queryPostTemp += (queryPostTemp == '' ? '' : ',') + divs[i].value;
		}
	}
	queryPost += '&section=' + queryPostTemp;

	// ---------------------------------------------
	// semestre
	$('termInfo').innerHTML = $('term').options[$('term').selectedIndex].innerHTML;
	queryPost += '&termText=' + $('term').options[$('term').selectedIndex].value;

	return queryPost;
}

function sendFormValues(queryPost)
{
	fetch('resources/ajax/get.php?rdm=' + Math.random() + '&do=repetiteurTermCount', {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: queryPost
	})
	.then(function(response) { return response.text(); })
	.then(function(text) {
		var parser = new DOMParser();
		var xml = parser.parseFromString(text, 'text/xml');
		var error = xml.getElementsByTagName('error');
		if (error.length)
		{
			$('countInfos').innerHTML = '?';
			return displayError(error[0].firstChild.data);
		}

		var count = xml.getElementsByTagName('count');
		if (count.length)
			$('countInfos').innerHTML = count[0].firstChild.data;
		else
			$('countInfos').innerHTML = '?';
	})
	.catch(function() {
		$('countInfos').innerHTML = '?';
		displayError('Erreur lors de la r\u00e9cup\u00e9ration des donn\u00e9es.<br />');
	});
}
