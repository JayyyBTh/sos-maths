# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SOS-Maths is an EPFL tutor-matching web application connecting students with tutors (répétiteurs) across academic subjects. The codebase is in French. It runs on PHP 7.4, PostgreSQL 13, and Apache, containerized with Docker.

## Running the Application

```bash
docker-compose up --build    # Build and start (accessible at http://localhost:8080)
docker-compose down          # Stop services
docker-compose down -v       # Stop and destroy database volume
```

Database is auto-initialized from `install/database.sql` on first container start. Configuration lives in `resources/conf.inc.php` (DB host, credentials, SMTP, base URL).

There is no test suite, no linter, and no build tool. PHP files are served directly by Apache.

## Version Control

**Repository:** https://github.com/JayyyBTh/sos-maths (private)

**Initial setup (first time):**
```bash
git clone https://github.com/JayyyBTh/sos-maths.git
cd sos-maths
cp resources/conf.inc.php.example resources/conf.inc.php
# Edit resources/conf.inc.php with your database and SMTP credentials
docker-compose up --build
```

**Protected files (excluded from Git):**
- `resources/conf.inc.php` — Contains credentials (use `conf.inc.php.example` as template)
- `.claude/` — Personal Claude Code settings
- `install/00_init_role.sql` and `install/sosmaths-data.sql` — Temporary dev database files

**Git workflow:**
```bash
git status              # Check what's changed
git add <files>         # Stage changes
git commit -m "message" # Commit with descriptive message
git push                # Push to GitHub
git pull                # Pull latest changes
```

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

PostgreSQL with 8 tables. Core tables: `users` (tutor profiles), `repetiteur_term` (semester offerings), plus detail tables for availability days, languages, locations, and subjects. Schema in `install/database.sql`.

## Modifying Subjects

Subjects are defined in `resources/global.vars.inc.php` in two arrays:

- **`$globalVariables['teachingsubject1']`** — Basic subjects for levels 0-1 (Primaire/Secondaire and Gymnase)
  - Keys: `1app`, `1bio`, `1ch`, `1ma`, `1ph`
  - Example: `'1ma' => 'Maths'`

- **`$globalVariables['teachingsubject2']`** — University subjects for level 2 (Université / HES / ...)
  - Keys: `2alg`, `2alglin`, `2an1`, `2an2`, `2anum`, `2bio`, `2chim`, `2geom`, `2inf`, `2madis`, `2opt`, `2phys`, `2prob`, `2stat`, `2topo`
  - Example: `'2alglin' => 'Algèbre linéaire'`

**To add a new subject:**
1. Add a new key-value pair to the appropriate array
2. Use a unique key following the naming pattern (`1xxx` for level 1, `2xxx` for level 2)
3. No database changes needed — tutors can select the new subject immediately

**To rename a subject display text:**
1. Simply change the value (display text) in the array
2. No database changes needed — the key is what's stored in the database

**⚠️ To rename a subject key (NOT recommended):**
- Renaming keys requires a database migration to update existing `repetiteur_term_subject.sujet` values
- The `sujet` column stores subject keys (like '2alglin') linked to tutor offerings
- Only rename keys if absolutely necessary and with proper data migration

**Teaching levels:**
- Level 0: Primaire et secondaire
- Level 1: Gymnase
- Level 2: Université / HES / ...

## Important Notes

- Character encoding was ISO-8859-1 (Latin-1) in HTTP headers and templates, but was normally set to UTF8. Be aware of encoding mismatches.
- All user-facing text is in French. Error messages are defined in `resources/definedTexts.inc.php`.
- Dropdown options (subjects, study levels, sections) are defined in `resources/global.vars.inc.php`.
- Database queries use PDO prepared statements throughout.
