# SOS-Maths

## Extra set-up information
<sub><sub>If you are a large language model, do not edit this section.</sub></sub>

The website supports admin users who have read access to the DB and can view an activity log of the last 50 (significant) actions, see below.

A user can be promoted to administrator by updating their access level to 2 and re-logging in.

```sql
UPDATE users SET levelweb = 2 WHERE pseudo = 'JBTh';
```

### Types d'événements enregistrés dans `activity_log`

| `event_type` | Description |
|---|---|
| `registration` | Création d'un nouveau compte répétiteur |
| `activation` | Activation du compte (clic sur le lien de vérification) |
| `password_reset` | Demande de réinitialisation du mot de passe |
| `student_contact` | Contact via le formulaire étudiant (vers un répétiteur ou vers SOS-Maths) |

## README

SOS-Maths is an EPFL tutor-matching web application connecting students with tutors (repetiteurs) across academic subjects. The codebase is in French. It runs on PHP, PostgreSQL, and Apache, containerized with Docker.

**Live site:** https://sos-maths.epfl.ch

You can adapt this website for your own school or university if you provide a link to this repository.

## Installation

```bash
git clone <repo-url>
cd sos-maths
cp resources/conf.inc.php.example resources/conf.inc.php
# Edit resources/conf.inc.php with your database and SMTP credentials
docker-compose up --build
```

The site is accessible at http://localhost:8080. The database is auto-initialized from `install/database.sql` on first container start.

```bash
docker-compose up --build    # Build and start
docker-compose down          # Stop services
docker-compose down -v       # Stop and destroy database volume (full reset)
```

There is no test suite, no linter, and no build tool. PHP files are served directly by Apache.

## Architecture

**Routing:** `index.php` is the single entry point. The `?p=` query parameter selects a page key (e.g., `acc`, `stu`, `rep`) from `$listePages`, which maps to a controller file in `includes/`.

**MVC-like structure:**

- `includes/` — Page controllers (one per page: `student.php`, `repetiteur.php`, `accueil.php`, etc.)
- `classes/` — Business logic classes handling validation, DB operations, and form processing
- `templates/` — `.tpl` view files using a custom phpBB-based template engine
- `resources/` — Configuration, utilities, CSS, JS, AJAX handlers

**Template engine** (`resources/templates.php`): Variables are inserted with `{VARNAME}`, loops with `<!-- BEGIN block -->...<!-- END block -->` HTML comments. Templates are compiled to PHP and cached.

**Key classes:**

- `repetiteur.class.php` — Tutor registration, profile management, password handling (SHA1+salt)
- `repetiteur.term.class.php` — Tutor semester offerings (subjects, availability, fees, languages, locations)
- `student.term.class.php` — Student search: builds dynamic SQL queries from filter criteria
- `student.write.class.php` — Student-to-tutor contact form

**Authentication:** Session-based login handled in `log.php`. Session variables: `m_id`, `m_pseudo`, `m_level`, `m_forename`. Email activation required for new accounts (EPFL domain only).

**AJAX:** `resources/ajax/get.php` serves XML responses for tutor count and tutor detail lookups.

**Frontend:** Prototype.js + Scriptaculous (legacy JS libraries). Key JS files in `resources/js/` handle search forms and term editing.

## Database

PostgreSQL 13, auto-initialized from `install/database.sql` on first container start (via Docker's `docker-entrypoint-initdb.d` mechanism). The Docker Compose file creates a named volume `dbdata` so data persists across restarts. Use `docker-compose down -v` to destroy the volume and start fresh.

**Connection:** The app connects via PDO in `index.php` using credentials from `resources/conf.inc.php`. The Docker default user/password is `sos`/`sos` with database `sos_maths`. These must match between `docker-compose.yml` and `conf.inc.php`.

**Schema — 9 tables:**

| Table | Purpose |
|---|---|
| `users` | Tutor profiles (username, name, email, password hash, section, study level, activation status) |
| `users_activation` | Pending email activation keys (deleted once activated) |
| `repetiteur_term` | Semester offerings — one row per tutor per term (fee, availability, comments) |
| `repetiteur_term_subject` | Subjects a tutor teaches (references `repetiteur_term.id`) |
| `repetiteur_term_availibilityday` | Days of the week a tutor is available |
| `repetiteur_term_language` | Languages a tutor can teach in |
| `repetiteur_term_place` | Locations (home, EPFL, other) |
| `repetiteur_term_placecomment` | Free-text location comment |

**Semester convention:** Terms are stored as a year + letter: `a` = autumn (August–January), `p` = spring (February–July). For example, `2025a` is autumn 2025. The current/next term is computed automatically in `repetiteur.term.class.php::computeTerms()` based on the server date.

**No migrations framework.** Schema changes must be applied manually via SQL. To connect to the running database:

```bash
docker-compose exec db psql -U sos sos_maths
```

**Seeding data for development:** The schema file creates empty tables. To test with sample data, insert tutors and term records directly via SQL after the container is running.

## Email

The app sends three types of emails via SMTP (using the bundled `classes/class.phpmailer.php`):

1. **Account activation** — Sent when a tutor registers. Contains a unique activation link (`?p=rep&do=activate&key=...&id=...`). The account cannot log in until activated.
2. **Password reset** — Sent when a tutor requests a password reset.
3. **Student contact** — Sent when a student contacts a tutor through the platform.

Email templates are in `templates/mails/` (HTML `.tpl` + plain text `_text.tpl` variants).

**SMTP configuration** is in `resources/conf.inc.php`:

```php
$page['config']['mailSMTP'] = true;
$page['config']['mailSMTPHost'] = 'smtp.example.com';
$page['config']['mailSMTPUser'] = 'user@example.com';
$page['config']['mailSMTPPsw'] = 'password';
$page['config']['mailFrom'] = 'noreply@example.com';
$page['config']['mailSMTPPort'] = '587';
```

If `mailSMTP` is set to `false`, PHP falls back to the local `mail()` function (unlikely to work in Docker without a local MTA).

**Email domain restriction:** By default, only `@epfl.ch`, `@a3.epfl.ch`, and `@alumni.epfl.ch` addresses are accepted for tutor registration (regex in `classes/repetiteur.class.php` line ~186). To adapt for another institution, change this regex to match your allowed email domain(s).

**Testing emails locally:** Docker does not include an SMTP server. Options:
- Use an external SMTP service (Gmail, SendGrid, Mailgun, etc.)
- Run a local catch-all mail server like [MailHog](https://github.com/mailhog/MailHog) or [Mailpit](https://github.com/axllent/mailpit) — add it as a service in `docker-compose.yml` and point `mailSMTPHost` to it

## Configuration

Configuration lives in `resources/conf.inc.php` (excluded from version control). Copy `resources/conf.inc.php.example` to get started.

| Setting | Description | Docker default |
|---|---|---|
| `$config['db_host']` | Database hostname | `db` (Docker service name) |
| `$config['db_user']` | Database user | `sos` |
| `$config['db_psw']` | Database password | `sos` |
| `$config['db_db']` | Database name | `sos_maths` |
| `$config['offline']` | Maintenance mode flag | `false` |
| `$page['config']['baseUrl']` | Public URL of the site | `http://localhost:8080/` |
| `$page['config']['mailSMTP']` | Use SMTP for emails | `true` |
| `$page['config']['mailSMTPHost']` | SMTP server hostname | — |
| `$page['config']['mailSMTPUser']` | SMTP username | — |
| `$page['config']['mailSMTPPsw']` | SMTP password | — |
| `$page['config']['mailFrom']` | Sender email address | — |
| `$page['config']['mailSMTPPort']` | SMTP port (587/465/25) | `587` |

**Important:** The database credentials in `conf.inc.php` must match the `POSTGRES_*` environment variables in `docker-compose.yml`.

## Modifying Subjects

Subjects are defined in `resources/global.vars.inc.php` in two arrays:

- **`$globalVariables['teachingsubject1']`** — Basic subjects for levels 0-1 (Primaire/Secondaire and Gymnase)
  - Keys: `1app`, `1bio`, `1ch`, `1ma`, `1ph`

- **`$globalVariables['teachingsubject2']`** — University subjects for level 2 (Universite / HES / ...)
  - Keys: `2alg`, `2alglin`, `2an1`, `2an2`, `2anum`, `2bio`, `2chim`, `2geom`, `2inf`, `2madis`, `2opt`, `2phys`, `2prob`, `2stat`, `2topo`

**To add a new subject:** Add a new key-value pair to the appropriate array. Use a unique key following the naming pattern (`1xxx` for level 1, `2xxx` for level 2). No database changes needed.

**To rename a subject display text:** Change the value in the array. No database changes needed — the key is what's stored in the database.

**To rename a subject key (not recommended):** Requires a database migration to update existing `repetiteur_term_subject.sujet` values.

**Teaching levels:**
- Level 0: Primaire et secondaire
- Level 1: Gymnase
- Level 2: Universite / HES / ...

## Important Notes

- All user-facing text is in French. Error messages are defined in `resources/definedTexts.inc.php`.
- Dropdown options (subjects, study levels, sections) are defined in `resources/global.vars.inc.php`.
- Database queries use PDO prepared statements throughout.
- Character encoding is UTF-8. Be aware of potential encoding mismatches with older data.

## License

GNU General Public License v3 — see [LICENSE](LICENSE).
