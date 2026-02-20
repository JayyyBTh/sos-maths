<h1>Modération</h1><br />

<form method="get" action="index.php">
	<input type="hidden" name="p" value="mod" />
	<input type="hidden" name="do" value="search" />
	<input type="text" name="q" value="{SEARCH_QUERY}" placeholder="pseudo, email, nom, prénom…" size="40" />
	<input type="submit" value="Rechercher" />
</form>

<!-- BEGIN userTableHeader -->
<br />
<table border="1" cellpadding="4" cellspacing="0" style="border-collapse:collapse; width:100%;">
	<thead>
		<tr>
			<th>id</th>
			<th>pseudo</th>
			<th>nom</th>
			<th>prénom</th>
			<th>email</th>
			<th>section</th>
			<th>actif</th>
			<th>inscrit le</th>
		</tr>
	</thead>
<!-- END userTableHeader -->
<!-- BEGIN userRow -->
	<tr>
		<td>{userRow.ID}</td>
		<td>{userRow.PSEUDO}</td>
		<td>{userRow.NAME}</td>
		<td>{userRow.FORENAME}</td>
		<td>{userRow.EMAIL}</td>
		<td>{userRow.SECTION}</td>
		<td>{userRow.ACTIVE}</td>
		<td>{userRow.REGDATE}</td>
	</tr>
<!-- END userRow -->
<!-- BEGIN userTableFooter -->
</table>
<!-- END userTableFooter -->

<br /><br />
<h2>Journal d'activité (50 dernières entrées)</h2>

<table border="1" cellpadding="4" cellspacing="0" style="border-collapse:collapse; width:100%;">
	<thead>
		<tr>
			<th>date</th>
			<th>type</th>
			<th>utilisateur (id)</th>
			<th>détails</th>
		</tr>
	</thead>
	<!-- BEGIN logRow -->
	<tr>
		<td>{logRow.DATE}</td>
		<td>{logRow.TYPE}</td>
		<td>{logRow.USER_ID}</td>
		<td>{logRow.DETAILS}</td>
	</tr>
	<!-- END logRow -->
</table>
