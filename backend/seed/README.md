# Seed Data

Development-only, version-controlled seed data for this project's modules.

## Professor Directory

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

## Lost & Found Demo Data

**⚠️ Fictional demo data.** Every name, roll number, contact number and item
in this dataset is made up for demonstration purposes. It does not describe
any real student, real lost item, or real report. Do not treat it as real
data and do not add real reports here.

### Purpose

Gives the Lost & Found module 10 realistic-looking demo reports (with a mix
of statuses, types and photos) to demo or develop against, without needing to
file reports through the UI one at a time.

### Files

- `lost_found_reports.json` — the 10 fictional demo records.
- `seed_lost_found.py` — the idempotent loader.
- `demo_photos/` — a handful of small, generic placeholder images referenced
  by some of the demo records. **Gitignored** — never committed. If this
  directory is missing or a referenced file isn't in it, the seed script
  fails with a clear error rather than silently skipping the photo.

### Fields

| Field            | Required | Notes                                                     |
|-------------------|----------|-------------------------------------------------------------|
| `demo_key`        | yes      | Human-readable, unique identifier for this JSON record. Not stored in the database — see "Idempotency" below. |
| `type`            | yes      | `LOST` or `FOUND`                                          |
| `item_name`       | yes      |                                                             |
| `description`     | yes      |                                                             |
| `location`        | yes      |                                                             |
| `date`            | yes      | ISO date, e.g. `2026-09-02`                                 |
| `photo`           | no       | Filename of an image in `demo_photos/`, or `null`           |
| `reporter_name`   | yes      | Fictional                                                   |
| `roll_number`     | yes      | Fictional, always `DEMO-...` — see "Idempotency" below      |
| `contact_number`  | yes      | Fictional                                                   |
| `status`          | yes      | `OPEN` or `RESOLVED`                                         |

### Running the seed

Requires the Docker stack to be up and migrations applied.

```bash
docker compose exec backend python -m seed.seed_lost_found
```

### Photo handling

A referenced photo is copied from `demo_photos/<filename>` on the host into
the running backend's upload volume at `/data/uploads/<filename>` (the same
`uploads_data` Docker volume the app already serves uploads from), and the
database row's `photo` field is set to `/uploads/<filename>` — identical in
shape to a photo path produced by a real multipart upload, so it renders
through the existing `/uploads` static route with no API or model changes.

### Idempotency

`LostFoundReport` has no natural unique field, and this seed intentionally
does **not** add one to the schema just to support seeding. Instead, every
demo record's `roll_number` is a deterministic, obviously-fake value derived
from its `demo_key` (e.g. `demo-lost-wallet-001` → `DEMO-LOST-WALLET-001`),
and the loader rejects any record whose `roll_number` doesn't start with
`DEMO-`. The script matches existing rows by `roll_number`:

- Running it repeatedly updates the same 10 rows in place if a field changed,
  and never creates duplicates.
- Rows already in the database that aren't part of this demo set (i.e. every
  real report, which will never have a `DEMO-...` roll number) are always
  left untouched — the script never deletes anything.
