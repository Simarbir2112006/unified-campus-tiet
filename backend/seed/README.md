# Professor Seed Data

Development-only, version-controlled seed data for the Professor Directory.

## Files

- `professors.json` — the real seed data loaded into the database. Starts empty
  (`[]`). Add verified professor records here as they become available.
- `professors.example.json` — a template showing the JSON shape for one record.
  **Never loaded by the script** — reference only.
- `seed_professors.py` — the idempotent loader.

## Fields

| Field                   | Required | Notes                                  |
|--------------------------|----------|-----------------------------------------|
| `name`                   | yes      |                                         |
| `department`              | yes      |                                         |
| `designation`             | yes      |                                         |
| `official_email`          | yes      | Unique key — used to detect duplicates |
| `phone`                   | no       |                                         |
| `cabin`                   | no       |                                         |
| `subjects`                | no       |                                         |
| `google_scholar_url`      | no       |                                         |
| `personal_website_url`    | no       |                                         |
| `linkedin_url`            | no       |                                         |
| `other_links`             | no       | List of `{"label": ..., "url": ...}`   |

## Adding real records

Append verified professor objects to `professors.json`, following the shape in
`professors.example.json`. Only add records you can personally verify — do not
invent or scrape data.

## Running the seed

Requires the Docker stack to be up and migrations applied (see the main
[README](../../README.md)).

```bash
docker compose exec backend python -m seed.seed_professors
```

Safe to run repeatedly: records are matched by `official_email`. Existing rows
are updated in place if their fields changed, new rows are inserted, and rows
already in the database that aren't in `professors.json` are left untouched
(never deleted).
