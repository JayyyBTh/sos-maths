<?php
$globalVariables = array();
global $globalVariables;

$globalVariables['section'] = array(
	'ar' => array('AR', '(AR) Architecture'),
	'cgc' => array('CGC', '(CGC) Chimie et Génie Chimique'),
	'cms' => array('CMS', '(CMS) Cours de Mathématiques Spéciales'),
	'el' => array('EL', '(EL) Génie Électrique et Électronique'),
	'gc' => array('GC', '(GC) Génie Civil'),
	'gm' => array('GM', '(GM) Génie Mécanique'),
	'ic' => array('IC', '(IC) Informatique ou Systèmes de Communication'),
	'ma' => array('MA', '(MA) Mathématiques'),
	'mi' => array('MT', '(MT) Microtechnique'),
	'mx' => array('MX', '(MX) Science et Génie des Matériaux'),
	'ph' => array('PH', '(PH) Physique'),
	'sie' => array('SIE', '(SIE) Science et Ingénierie de l\'Environnement'),
	'sv' => array('SV', '(SV) Sciences de la Vie'));


$globalVariables['levelStudies'] = array(
	'0' => array('CMS', 'CMS'),
	'1' => array('BA1', 'Première de Bachelor'),
	'2' => array('BA2', 'Deuxième de Bachelor'),
	'3' => array('BA3', 'Troisième de Bachelor'),
	'4' => array('MA1', 'Première année de Master'),
	'5' => array('MA2', 'Deuxième année de Master'),
	'6' => array('MA', 'Master obtenu'),
	'7' => array('PHD', 'Doctorat obtenu'));

$globalVariables['fee'] = array('<25' => array(0, 24, 1), '25 - 35' => array(25, 35, 2), '36 - 45' => array(36, 45, 3), '>45' => array(45, 255, 4));

$globalVariables['place'] = array('dom' => 'Domicile de l\'élève', 'epfl' => 'A l\'EPFL', 'autre' => 'Autre');

$globalVariables['language'] = array('de' => 'Allemand', 'en' => 'Anglais', 'fr' => 'Français', 'it' => 'Italien');

$globalVariables['day'] = array(0 => array('lu', 'Lundi'),
				1 => array('ma', 'Mardi'),
				2 => array('me', 'Mercredi'),
				3 => array('je', 'Jeudi'),
				4 => array('ve', 'Vendredi'),
				5 => array('sa', 'Samedi'),
				6 => array('di', 'Dimanche'));

$globalVariables['teachingsubject1'] = array('1app' => 'Application des maths',
	'1bio' => 'Biologie',
	'1ch' => 'Chimie',
	'1ma' => 'Maths',
	'1ph' => 'Physique');

$globalVariables['teachingsubject2'] = array('2alg' => 'Algèbre abstraite',
	'2alglin' => 'Algèbre linéaire',
	'2anman' => 'Analyse (Niveau MAN/CMS)',
	'2an1' => 'Analyse (Propédeutique)',
	'2anmulti' => 'Analyse (Multivariable/Fourier)',
	'2an2' => 'Analyse complexe',
	'2anum' => 'Analyse numérique',
	'2bio' => 'Biologie',
	'2chim' => 'Chimie',
	'2geom' => 'Géométrie',
	'2geodiff' => 'Géométrie Différentielle',
	'2inf' => 'Informatique',
	'2madis' => 'Mathématiques discrètes',
	'2opt' => 'Optimisation',
	'2phys' => 'Physique (Mécanique)',
	'2physfluid' => 'Physique (Fluides et/ou Thermodynamique)',
	'2physem' => 'Physique (Electromag)',
	'2prob' => 'Probabilités',
	'2progcpp' => 'Programmation (C++)',
	'2progjava' => 'Programmation (Java)',
	'2progpy' => 'Programmation (Python)',
	'2stat' => 'Statistiques',
	'2topo' => 'Topologie');
?>
