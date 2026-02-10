<!DOCTYPE html>
<!--
Design by Free CSS Templates
http://www.freecsstemplates.org
Released for free under a Creative Commons Attribution 2.5 License

Name       : Breakeven 
Description: A two-column, fixed-width design with dark color scheme.
Version    : 1.0
Released   : 20130509

-->
<html lang="fr">
<head>
<meta name="keywords" content="" />
<meta name="description" content="" />
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />

<title>SOS-Maths</title>
<link href="https://fonts.googleapis.com/css?family=Open+Sans:400,300,600" rel="stylesheet" type="text/css" />
<link href='https://fonts.googleapis.com/css?family=Abel|Satisfy' rel='stylesheet' type='text/css'>
<link href="resources/css/theme.css" rel="stylesheet" type="text/css" media="screen" />
<link href="resources/css/style.css" rel="stylesheet" type="text/css" media="screen" />
{css}

<script src="resources/js/lib.js" type="text/javascript"></script>
{javascript}

</head>
<body>
<div id="wrapper">
	<div id="header-wrapper">
		<div id="header" class="container">
			<div id="logo">
				<h1><a href="index.php">SOS-Maths</a></h1>
			</div>
			<button id="menuToggle" class="menu-toggle" aria-label="Menu" aria-expanded="false">
				<span class="menu-toggle-bar"></span>
				<span class="menu-toggle-bar"></span>
				<span class="menu-toggle-bar"></span>
			</button>
			<div id="menu">
				<ul>
					<!-- BEGIN menuItem -->
					<li {menuItem.class}><a href="index.php?p={menuItem.link}">{menuItem.libelle}</a></li>
					<!-- END menuItem -->
				</ul>
				{LOGINOUTBOX}
			</div>
		</div>
	</div>
	<!-- end #header -->
	<div id="page">
		<div id="content">			
			{MAIN_CONTENT}
		</div>
		<!-- end #content -->
	</div>
	<!-- end #page --> 
</div>
<div id="footer">
	<p>SOS-Maths<br />Images by <a href="https://fotogrph.com/" target="_blank">Fotogrph</a>. Design by <a href="https://www.freecsstemplates.org/" rel="nofollow" target="_blank">FreeCSSTemplates.org</a>.</p>
</div>
</body>
</html>
