---
name: my-site-stream-post
description: Create or revise a trilingual my-site Stream post, including requests beginning with `Stream:`.
---

# Stream posts

Use this skill for `data/stream` publishing work in this repository. The source text, short-request syntax, and defaults are in [AI content workflow](../../../docs/AI-content-workflow.md). Repo-wide translation and Git rules are in [AGENTS.md](../../../AGENTS.md); do not duplicate them here.

For a new post, use a recent trilingual Stream post as the frontmatter and Markdown example. Treat the supplied title, description, and body as the author's Traditional Chinese source. Create one directory with `zh-TW.md`, `en.md`, and `ja.md`. Apply the available `multilingual-blog-translation` skill for translation and review, with AGENTS.md taking precedence for this site's voice and Japanese form. Keep the same publication date and internal links across locales, translate reader-facing frontmatter, and mark new translations `review-by-me: false`. Preserve the supplied Chinese prose. If the user requests copyediting, make only those requested changes.

Check the generated files and links, run `pnpm check:translations` when applicable, and run a build when page behavior or routing changed. Review the diff so only this post and directly required files are included. Leave changes uncommitted unless the user asks to stage, commit, or push; never include unrelated worktree changes.
