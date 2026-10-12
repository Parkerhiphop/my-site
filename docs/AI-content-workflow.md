# Codex 內容工作流

日常新增文章和作品資料，可以直接用口語交辦；以下短格式只是省字的選項，不需要記住。本站的翻譯慣例放在 [AGENTS.md](../AGENTS.md)，流程細節放在相關 skill。

## 新增 Stream

```text
Stream: 文章標題
一小段描述
---
文章正文，可保留段落、連結與 Markdown。
```

標題、描述和正文都是繁中原文。`---` 只用來分隔描述與正文。Codex 保留原文，新增同一個 `data/stream/<slug>/` 下的 `zh-TW.md`、`en.md`、`ja.md`，並翻譯標題、描述與正文。未提供日期時，用東京當日日期；英文 slug 由標題與內容推定，先確認沒有撞名。描述寫入各語系 frontmatter 的 `description`；新的英、日文標記 `review-by-me: false`。完成後檢查連結、翻譯和變更範圍。

## 新增作品資料

```text
DB Add:
2026/10/12 completed 作品名稱 3
- planned 另一部作品 -
```

每行格式為 `<日期> <狀態> <作品名稱> <評分>`。名稱可包含空格；最後一欄一定要填評分或 `-`，避免作品名稱尾端的數字被誤認成評分。日期可用 `YYYY/MM/DD`、`YYYY/MM`，沒有日期就填 `-`。評分可填 `1`、`2`、`3`、`5` 或 `-`。狀態可填 `completed`、`ongoing`、`planned`、`on_hold`、`dropped`，也接受「看完」「正在看」「想看」「暫停」「棄坑」。

`completed` 的日期代表你的完成日期，會原樣存入 `my_completed_date`。其他狀態通常填 `-`；若提供日期但未說明意義，Codex 會先確認，不會擅自當成作品發行日。Codex 根據作品資料判斷電影、影集、動畫、漫畫、網漫或小說，並從 `data/database/maps.json` 的允許值挑選 genres。遇到同名作品或類型無法判定時才詢問。`planned` 存在 `planned.json`；改為其他狀態時，移到對應資料檔，避免重複。完成後更新資料庫的最後更新日期，檢查本次改動。

## 提交與 chat

兩種短格式預設只修改本機檔案，**不自動 stage、commit 或 push**。要發布時，在訊息最後加「commit & push」即可；Codex 只應提交本次相關檔案。

資料庫與近期文章可以各用一個批次 chat；同一篇文章的後續修改留在原 chat。換月份、換功能，或舊脈絡開始干擾時再開新 chat。規則保存在專案檔案與 skill，不依賴舊 chat。

## 查看 skill

在 Codex 輸入 `/skills` 可看目前可用的 skill，也可以用 `$skill-name` 明確指定。此專案的 [Stream skill](../.agents/skills/my-site-stream-post/SKILL.md) 和 [資料庫 skill](../.agents/skills/my-site-database-add/SKILL.md) 位於 `.agents/skills/`；跨專案的翻譯與 Git skill 位於 `~/.codex/skills/`。新建的 skill 可能需要開一個新 chat 才會出現在清單。
