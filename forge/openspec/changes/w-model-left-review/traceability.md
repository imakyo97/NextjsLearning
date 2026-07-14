# W-Model 左辺レビュー導入 トレーサビリティマトリクス

## Forward Traceability

| US | DD | T | TP | impl | test |
|---|---|---|---|---|---|
| US-001 | DD-1 (テスタビリティレビュー) | T-2 | TP-001 (REQ-001 Happy Path) | `commands/brainstorm.md` | - |
| US-001 | DD-1 (テスタビリティレビュー) | T-2 | TP-002 (REQ-001 Error) | `commands/brainstorm.md` | - |
| US-002 | DD-2 (フェーズゲート定義) | T-1 | TP-003 (REQ-002 Happy Path) | `reference/core-rules.md` | - |
| US-002 | DD-2 (フェーズゲート定義) | T-1 | TP-004 (REQ-002 Error) | `reference/core-rules.md` | - |
| US-002 | DD-3 (フェーズゲート参照) | T-3 | TP-005 (REQ-003 Happy Path) | `commands/spec.md` | - |
| US-002 | DD-3 (フェーズゲート参照) | T-3 | TP-006 (REQ-003 Error) | `commands/spec.md` | - |
| US-003 | DD-4 (中間レビューポイント) | T-4 | TP-007 (REQ-004 Happy Path) | `commands/implement.md` | - |
| US-003 | DD-4 (中間レビューポイント) | T-4 | TP-008 (REQ-004 Error) | `commands/implement.md` | - |
| US-003 | DD-4 (中間レビューポイント) | T-4 | TP-009 (REQ-004 Boundary) | `commands/implement.md` | - |
| US-004 | DD-5 (エントリー基準プレチェック) | T-5 | TP-010 (REQ-005 Happy Path) | `agents/spec/spec-validator.md` | - |
| US-004 | DD-5 (エントリー基準プレチェック) | T-5 | TP-011 (REQ-005 Error) | `agents/spec/spec-validator.md` | - |

## Backward Traceability

| impl | test | T | TP | DD | US |
|---|---|---|---|---|---|
| `reference/core-rules.md` (Phase Gates セクション追加) | - | T-1 | TP-003, TP-004 | DD-2 | US-002 |
| `commands/brainstorm.md` (ステップ5.8 + 提案書テンプレート検証観点追加) | - | T-2 | TP-001, TP-002 | DD-1 | US-001 |
| `commands/spec.md` (Phase Gate エントリー/エグジット基準参照追加) | - | T-3 | TP-005, TP-006 | DD-3 | US-002 |
| `commands/implement.md` (Step 4a/4b に中間レビューチェックポイント追加) | - | T-4 | TP-007, TP-008, TP-009 | DD-4 | US-003 |
| `agents/spec/spec-validator.md` (Step 0 エントリー基準プレチェック追加) | - | T-5 | TP-010, TP-011 | DD-5 | US-004 |

## Coverage Summary

| カテゴリ | 総数 | カバー済み | 未カバー |
|---|---|---|---|
| ユーザーストーリー (US) | 4 | 4 | 0 |
| 設計決定 (DD) | 5 | 5 | 0 |
| タスク (T) | 6 | 5 | 1 (T-6 横断チェック = 全US対応) |
| テスト観点 (TP) | 11 | 11 | 0 |
