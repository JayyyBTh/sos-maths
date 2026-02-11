# SOS-Maths

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

PostgreSQL with 8 tables. Core tables: `users` (tutor profiles), `repetiteur_term` (semester offerings), plus detail tables for availability days, languages, locations, and subjects. Full schema in `install/database.sql`.

## Configuration

Configuration lives in `resources/conf.inc.php` (excluded from version control). Use `resources/conf.inc.php.example` as a template. Key settings:

- Database host, name, user, password
- SMTP server, port, credentials
- Base URL

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
