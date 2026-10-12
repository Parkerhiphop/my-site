---
name: my-site-database-add
description: Add or update works in Parker's my-site database, including compact `DB Add:` requests with inferred form and genres.
metadata:
  short-description: Add works to my-site database
---

# My Site Database Add

## Scope

Use this skill in this repository when adding or updating works in `data/database/*.json`.
After successfully adding or touching database entries, update `data/database/metadata.json` so the website's database page shows the current last-updated date.

Assumptions:

- The user may specify the target form, such as `film`, `series`, `anime`, `manga`, `webtoon`, or `novel`. Infer it from the work when omitted; ask if the title or form remains ambiguous.
- Check for an existing match by title, alias, or key in the likely target collection and `planned.json` before insertion. Move or update a planned entry instead of creating a duplicate.
- Verification should be targeted to newly added or touched entries.

Supported forms:

- `film` -> `data/database/film.json`
- `series` -> `data/database/series.json`
- `anime` -> `data/database/anime.json`
- `manga` -> `data/database/manga.json`
- `webtoon` -> `data/database/webtoon.json`
- `novel` -> `data/database/novel.json`

Use `data/database/planned.json` (grouped by form) for `planned` entries. When a work changes from `planned` to another status, move it to the matching main collection; when it changes to `planned`, move it back. Preserve existing metadata during the move.

For requests beginning `DB Add:`, parse each following line as `<date> <status> <name> <rating>`, using `-` for an omitted date or rating. Treat the final token as the required rating field, so work names can contain spaces and end in numbers. Follow this repository's `docs/AI-content-workflow.md` for date and status meanings. Infer genres from researched metadata, then use only keys allowed by `data/database/maps.json`.

## Workflow

1. Inspect local schema first:

   - Do not read the full target JSON just to check for duplicates.
   - Read only the local context needed to preserve field order, such as the first entry or nearby insertion point in the target file.
   - Read `data/database/maps.json` for allowed `genres`, `status`, and `form`.
   - Read `data/database/publishers.json` before assigning publisher keys.
   - Read `data/database/metadata.json` before editing, because it must be updated after successful database changes.
   - Check `scripts/database.mjs` if validation or field expectations are unclear.

2. Resolve requested works:

   - Treat user input as aliases, not canonical data.
   - Search the likely target collection and `planned.json` for the title, known aliases, and generated key. If found, update or move the existing entry instead of adding another copy. Broaden the duplicate search only when the form is uncertain or a conflict appears.
   - For franchises or bundled requests, split only when the user clearly means multiple works, such as "Top Gun 1+2".
   - Preserve user edits and unrelated dirty worktree changes.

3. Research metadata:

   - Browse when titles are recent, ambiguous, or likely to have changed.
   - Prefer official sites, distributors, studios, streaming pages, Wikidata, Bangumi, or Wikipedia only for stable cross-checks.
   - Use Traditional Chinese for `title.zh` and `creator.zh`.
   - Use official Japanese title for `title.ja` when available; otherwise use the local release title or original title.
   - Use official English/international title for `title.en`.
   - Record conservative metadata when uncertain; do not invent exact dates.

4. Entry fields:

   - Keep field order consistent with nearby entries in the target collection. Current main collections commonly use:
     `key`, `title`, `creator`, `form`, `genres`, `publisher`, `release_dates`, `my_completed_date`, `my_status`, `my_score`, `note`, `has_article`, `check`.
   - `planned.json` groups entries by form and may omit main-collection-only fields. Preserve its local shape when adding or moving a planned entry.
   - `key`: lowercase kebab-case English/international title.
   - `title`: `{ "zh": "...", "ja": "...", "en": "..." }`.
   - `creator`: same locale shape. For films, use director or original creator + director if local style already does so. For series, use creator/screenwriter/original author as appropriate.
   - `genres`: only use keys from `maps.json`.
   - `publisher`: use an existing key when possible; add to `publishers.json` only when needed.
   - `release_dates`: use `YYYY/MM`. Multiple dates are allowed only when the database pattern already uses regional or release variants.
   - `end_date`: include only when the target collection's local schema uses it; use `YYYY/MM` when known.
   - `my_completed_date`: default `null` unless the user gives a completion date. Preserve `YYYY/MM/DD` when supplied; `YYYY/MM` is also accepted.
   - `my_status`: default `completed` unless the user says otherwise.
   - `my_score`: default `null`.
   - `note`: use for disambiguation, aliases, live-action/remake notes, or uncertainty.
   - `has_article`: default `false` unless an article already exists.
   - `check`: use `pending` for newly researched entries unless the user's existing data or explicit instruction establishes `approved`.

5. Edit method:

   - Use `apply_patch` for hand edits inside the repo.
   - For large JSON mechanical rewrites, a small Node script is acceptable, then inspect the diff.
   - Do not reformat unrelated files.
   - When one or more entries are added or touched, set `data/database/metadata.json` `lastUpdated` to today's date in the user's `Asia/Tokyo` timezone using `YYYY-MM-DD`.

6. Verification:
   - Parse every edited JSON file with Node.
   - Include `data/database/metadata.json` in the parsed files when it was updated.
   - Run a targeted check for:
     - missing `title.zh`, `title.ja`, `title.en` on newly touched entries
     - unknown genres
     - unknown publisher keys
     - duplicate keys only among newly added entries or when a generated key conflict is suspected
   - Run `git diff --check` on edited files.
   - Do not run full `node scripts/database.mjs validate` unless the user asks.

## Default User-Facing Shortcut

When the user writes something like:

> 用 database-add 幫我加入：作品 A、作品 B

Treat it as:

> Research these works, infer the form when omitted, add or update the matching `data/database` JSON file, fill Traditional Chinese/Japanese/English title and creator metadata, add missing publishers if needed, and run targeted verification on the edited entries.
