<?php
if (!defined('IN_SITE'))
	die('Vous ne pouvez accéder a ce fichier directement');

if (!isset($_SESSION['m_level']) || $_SESSION['m_level'] < $listePages[$page['current']]['level'])
	die('Accès refusé.');

main();

function main()
{
	$dos = array('main', 'search');
	$do = isset($_GET['do']) ? $_GET['do'] : 'main';

	if (!in_array($do, $dos))
		$do = 'main';
	$do .= 'Main';

	return $do();
}

function mainMain()
{
	global $tpl, $pdo;

	$tpl->set_filenames(array('moderation' => 'moderation.tpl'));
	$tpl->assign_var('SEARCH_QUERY', '');

	// Last 50 activity log entries
	$q = $pdo->prepare(
		'SELECT created_at, event_type, user_id, details
		 FROM activity_log
		 ORDER BY created_at DESC
		 LIMIT 50'
	);
	$q->execute();
	$rows = $q->fetchAll(PDO::FETCH_ASSOC);

	foreach ($rows as $row)
	{
		$tpl->assign_block_vars('logRow', array(
			'DATE'    => date('d.m.Y H:i', $row['created_at']),
			'TYPE'    => htmlspecialchars($row['event_type'], ENT_QUOTES | ENT_HTML5, 'UTF-8'),
			'USER_ID' => $row['user_id'] !== null ? $row['user_id'] : '—',
			'DETAILS' => htmlspecialchars($row['details'] ?? '', ENT_QUOTES | ENT_HTML5, 'UTF-8'),
		));
	}

	$tpl->assign_var_from_handle('MAIN_CONTENT', 'moderation');
}

function searchMain()
{
	global $tpl, $pdo;

	$q_raw = isset($_GET['q']) ? trim($_GET['q']) : '';

	$tpl->set_filenames(array('moderation' => 'moderation.tpl'));
	$tpl->assign_var('SEARCH_QUERY', htmlspecialchars($q_raw, ENT_QUOTES | ENT_HTML5, 'UTF-8'));

	if ($q_raw !== '')
	{
		$term = '%' . $q_raw . '%';
		$q = $pdo->prepare(
			'SELECT id, pseudo, name, forename, email, section, active, timeregistered
			 FROM users
			 WHERE pseudo    ILIKE ?
			    OR email     ILIKE ?
			    OR name      ILIKE ?
			    OR forename  ILIKE ?
			 ORDER BY name, forename
			 LIMIT 100'
		);
		$q->execute(array($term, $term, $term, $term));
		$rows = $q->fetchAll(PDO::FETCH_ASSOC);

		if (count($rows))
		{
			$tpl->assign_block_vars('userTableHeader', array());
			foreach ($rows as $row)
			{
				$tpl->assign_block_vars('userRow', array(
					'ID'       => $row['id'],
					'PSEUDO'   => htmlspecialchars($row['pseudo'],   ENT_QUOTES | ENT_HTML5, 'UTF-8'),
					'NAME'     => htmlspecialchars($row['name'],     ENT_QUOTES | ENT_HTML5, 'UTF-8'),
					'FORENAME' => htmlspecialchars($row['forename'], ENT_QUOTES | ENT_HTML5, 'UTF-8'),
					'EMAIL'    => htmlspecialchars($row['email'],    ENT_QUOTES | ENT_HTML5, 'UTF-8'),
					'SECTION'  => htmlspecialchars($row['section'],  ENT_QUOTES | ENT_HTML5, 'UTF-8'),
					'ACTIVE'   => $row['active'] ? 'oui' : 'non',
					'REGDATE'  => $row['timeregistered'] ? date('d.m.Y', $row['timeregistered']) : '—',
				));
			}
			$tpl->assign_block_vars('userTableFooter', array());
		}
	}

	// Always show log below search results
	$q2 = $pdo->prepare(
		'SELECT created_at, event_type, user_id, details
		 FROM activity_log
		 ORDER BY created_at DESC
		 LIMIT 50'
	);
	$q2->execute();
	$logRows = $q2->fetchAll(PDO::FETCH_ASSOC);

	foreach ($logRows as $row)
	{
		$tpl->assign_block_vars('logRow', array(
			'DATE'    => date('d.m.Y H:i', $row['created_at']),
			'TYPE'    => htmlspecialchars($row['event_type'], ENT_QUOTES | ENT_HTML5, 'UTF-8'),
			'USER_ID' => $row['user_id'] !== null ? $row['user_id'] : '—',
			'DETAILS' => htmlspecialchars($row['details'] ?? '', ENT_QUOTES | ENT_HTML5, 'UTF-8'),
		));
	}

	$tpl->assign_var_from_handle('MAIN_CONTENT', 'moderation');
}
?>
