# Spec Interpretation: Task 1 - reference/core-rules.md に Phase Gates セクションを追加

## 対象要件
- Requirement: REQ-002 フェーズゲートの定義
  - **仕様の記述**:
    - GIVEN core-rules.md に Phase Gates セクションが存在する WHEN セクションの構造を確認する THEN Verification Gates の直後に配置され、独立したセクションとして定義されている
    - GIVEN Phase Gates に brainstorm->spec の遷移が定義されている WHEN エントリー基準を確認する THEN 「proposal.md の必須セクション（Intent, User Stories, Scope, Out of Scope）完備」「ユーザー承認済み」が含まれている
    - GIVEN Phase Gates に brainstorm->spec の遷移が定義されている WHEN エグジット基準を確認する THEN 「spec-validator PASS」「ユーザー承認済み」が含まれている
    - GIVEN Phase Gates に spec->implement の遷移が定義されている WHEN エントリー基準を確認する THEN 「design.md + tasks.md + delta-spec.md + traceability.md が存在」が含まれている
    - GIVEN Phase Gates に spec->implement の遷移が定義されている WHEN エグジット基準を確認する THEN 「全タスク完了」「テスト合格」が含まれている
    - GIVEN Phase Gates に implement->review の遷移が定義されている WHEN エントリー基準を確認する THEN 「全テスト合格」「型チェック合格」が含まれている
    - GIVEN Phase Gates に implement->review の遷移が定義されている WHEN エグジット基準を確認する THEN 「レビュー指摘の P1/P2 が解消済み」が含まれている
    - Error: GIVEN Phase Gates が定義されている WHEN Verification Gates セクションの内容を確認する THEN Verification Gates の内容は変更されておらず、Phase Gates とは独立したセクションとして維持されている
  - **私の解釈**: Verification Gates セクション末尾（行83の `---` セパレータ）の直後に、新しい `## Phase Gates` セクションを挿入する。タスクの TASK 説明で指定された Markdown テキストをそのまま挿入する。既存の `## Git Workflow` セクション以降はそのまま維持する
  - **前提（仕様に未記載だが私が仮定すること）**: 行83の `---` は Verification Gates セクションの終端セパレータ。新セクションはこの `---` の後、`## Git Workflow` の前に挿入する。新セクション末尾にも `---` セパレータを追加して既存のスタイルに揃える
  - **仕様でカバーされないエッジケース**: なし。追加する内容は TASK 説明で完全に指定されている

## 実装判断

| 判断項目 | 選択肢 | 採用 | 根拠 | 却下理由 |
|---|---|---|---|---|
| 挿入位置 | A: 行83の `---` の後、`## Git Workflow` の前 | A | delta-spec に「Verification Gates の直後」と明記。行84の `---` と行86の `## Git Workflow` の間が該当 | 代替案なし -- 仕様が一意に指定 |
| セクションセパレータ | A: Phase Gates の後に `---` を追加 | A | 既存の全セクションが `---` で区切られているパターンに準拠 | 代替案なし -- 既存パターンへの準拠 |

## 必須チェック項目
- [x] 入力の有効値/無効値は何か？ -> 該当なし（Markdown 追記のみ）
- [x] エラー時の振る舞いは？ -> 該当なし（Markdown 追記のみ）
- [x] 外部依存が失敗した場合は？ -> 該当なし
- [x] 非同期処理の場合、競合状態への対処は？ -> 該当なし

## ギャップ検出（エスカレーション候補）
- なし

---

## Phase B: 実装完了後の追記

### 変更ファイル一覧

#### 作成したファイル
- なし

#### 修正したファイル
- `reference/core-rules.md`: Verification Gates セクション（行83）の直後に Phase Gates セクション（行86-106）を新設。4つの遷移の Entry/Exit Criteria テーブル、Verification Gates との概念的区別の説明文、運用ルールを追加
- `openspec/changes/w-model-left-review/traceability.md`: Backward Traceability テーブルに Task 1 の実装ファイルパスを追記、Forward Traceability の T-1 行の impl 列を更新

#### 削除したファイル
- なし

### 実装の振り返り
- 仕様の曖昧性への対処: 仕様は一意に指定されており、曖昧性はなかった。TASK 説明で挿入する Markdown テキストが完全に提供されていた
- 却下した代替案: なし。挿入位置・内容ともに仕様で一意に決定されていた
- 想定外の発見: なし
