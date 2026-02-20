## Mise à jour SOS-Maths — Module de modération

### Fichiers modifiés
- `index.php`
- `resources/funcs.inc.php`
- `classes/repetiteur.class.php`
- `classes/student.write.class.php`
- `includes/repetiteur.php`
- `includes/student.php`

### Fichiers ajoutés
- `includes/moderation.php`
- `templates/moderation.tpl`
- `install/migration_activity_log.sql` (à ne pas monter dans Docker, à exécuter manuellement)

### Procédure (dans cet ordre)

1. **Exécuter la migration SQL** sur la base de données de production :
   ```
   psql -U <db_user> -d <db_name> -f install/migration_activity_log.sql
   ```
   Cette commande crée uniquement une nouvelle table `activity_log`. Elle ne touche à aucune table existante.

2. **Déployer les fichiers** (git pull ou copie des 6 fichiers ci-dessus).

3. **Créer le compte administrateur** — exécuter sur la base de production :
   ```sql
   UPDATE users SET levelweb = 2 WHERE pseudo = 'JBTh';
   ```
   Se déconnecter puis se reconnecter — l'onglet « Modération » apparaîtra.

**L'ordre est important :** la migration doit être exécutée **avant** le déploiement du code, pour que la table existe au moment où les premiers événements sont enregistrés. Cela dit, même si le code est déployé en premier, le site continue de fonctionner normalement — les appels à `logActivity()` échouent silencieusement si la table n'existe pas encore.

**Aucun redémarrage nécessaire.** Pas de changement de configuration serveur, pas de nouveau service, pas de modification du schéma des tables existantes.

### Types d'événements enregistrés dans `activity_log`

| `event_type` | Description |
|---|---|
| `registration` | Création d'un nouveau compte répétiteur |
| `activation` | Activation du compte (clic sur le lien de vérification) |
| `password_reset` | Demande de réinitialisation du mot de passe |
| `student_contact` | Contact via le formulaire étudiant (vers un répétiteur ou vers SOS-Maths) |
