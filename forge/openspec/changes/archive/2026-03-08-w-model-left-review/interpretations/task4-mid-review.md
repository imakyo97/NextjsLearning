# Spec Interpretation: Task 4 - commands/implement.md に中間レビューポイントを追加

## 対象要件
- Requirement: REQ-004 /implement の中間レビューポイント
  - **仕様の記述**:
    - GIVEN implement.md の Step 4b に中間レビューが定義されている WHEN トリガー条件を確認する THEN 「tasks.md のタスク総数の50%（切り上げ）が完了した時点」と記述されている
    - GIVEN 中間レビューが定義されている WHEN 実行内容を確認する THEN spec-compliance-reviewer を「事後検証モード」で起動し、完了済みタスクのみを対象とすることが記述されている
    - GIVEN 中間レビューの結果処理が定義されている WHEN 逸脱なしの場合を確認する THEN 残タスクの実装を継続する
    - GIVEN 中間レビューの結果処理が定義されている WHEN 逸脱ありの場合を確認する THEN 逸脱を修正してから残タスクの実装を継続する
    - GIVEN implement.md の Step 4a に中間レビューが定義されている WHEN Teams モードの記述を確認する THEN Sub Agents モードと同等の中間レビューロジックが記述されている
    - GIVEN 中間レビューが定義されている WHEN タスク総数が4以下の場合を確認する THEN 「タスク総数が4以下の場合は中間レビューをスキップする」と明記されている
    - GIVEN 中間レビューで仕様エスカレーションが発生した WHEN 結果処理を確認する THEN AskUserQuestion でユーザーに確認する旨が記述されている
    - GIVEN タスク総数が5の場合 WHEN 中間レビューのトリガーを確認する THEN 3タスク完了時（ceil(5/2) = 3）に中間レビューが実行される
    - GIVEN タスク総数が4の場合 WHEN スキップ条件を確認する THEN 中間レビューはスキップされる
    - GIVEN 中間レビューが1回実行済みの状態 WHEN 追加タスクが完了する THEN 2回目の中間レビューは実行されない（変更セッションあたり1回のみ）
  - **私の解釈**: implement.md の Step 4a（Teams モード、行88-103）と Step 4b（Sub Agents モード、行105-116）の番号付きリスト内に中間レビューチェックポイントの項目を挿入する。Step 4a では項目3として挿入し既存の3を4、4を5に繰り下げ。Step 4b では項目2として挿入し既存の2を3に繰り下げ。Teams モードでは SendMessage 経由のエスカレーション、Sub Agents モードでは直接 AskUserQuestion を使用する。
  - **前提（仕様に未記載だが私が仮定すること）**: タスク指示で Teams モードと Sub Agents モードで spec-compliance-reviewer の起動方法が異なる（Teams: SendMessage/直接起動、Sub Agents: Task()）ことが明確に指示されている。これに従う。
  - **仕様でカバーされないエッジケース**: 中間レビュー中に implementer が並列で作業を継続するかどうかは仕様に未記載だが、本タスクはワークフロー記述の追加であり、実行時の細かい挙動は運用に委ねる。

## 実装判断

| 判断項目 | 選択肢 | 採用 | 根拠 | 却下理由 |
|---|---|---|---|---|
| Step 4a での挿入位置 | A: 項目3として挿入（既存3,4を繰り下げ）, B: 項目4の前に挿入 | A | タスク指示で「Teams 内エスカレーションフローの前に挿入」と明記 | B: タスク指示に反する |
| Step 4b での挿入位置 | A: 項目2として挿入（既存2を繰り下げ）, B: 項目2の後に追加 | A | タスク指示で「implementer 完了後の検証の前に挿入」と明記 | B: タスク指示に反する |
| Teams モードのエスカレーション経路 | A: SendMessage で Main Agent 経由, B: 直接 AskUserQuestion | A | タスク指示で Teams モードは「SendMessage で Main Agent にエスカレーション -> AskUserQuestion でユーザーに確認」と指定 | B: Teams モードでは Team Member が直接 AskUserQuestion を使えない |

## 必須チェック項目
- [x] 入力の有効値/無効値は何か？ -> タスク総数が5以上で中間レビュー実行、4以下でスキップ。仕様に明記済み
- [x] エラー時の振る舞いは？ -> 逸脱あり: 修正してから継続。仕様エスカレーション: ユーザーに確認。仕様に明記済み
- [x] 外部依存が失敗した場合は？ -> spec-compliance-reviewer の起動失敗は本タスク（Markdown 記述追加）のスコープ外
- [x] 非同期処理の場合、競合状態への対処は？ -> 該当なし（Markdown ファイル編集のみ）

## ギャップ検出（エスカレーション候補）
- なし

---

## Phase B: 実装完了後の追記

### 変更ファイル一覧

#### 作成したファイル
- `openspec/changes/w-model-left-review/interpretations/task4-mid-review.md`: Spec Interpretation Log

#### 修正したファイル
- `commands/implement.md`: Step 4a に中間レビューチェックポイント（項目3）を挿入し既存項目を繰り下げ（3->4, 4->5）。Step 4b に中間レビューチェックポイント（項目2）を挿入し既存項目を繰り下げ（2->3）
- `openspec/changes/w-model-left-review/traceability.md`: Forward Traceability の T-4 行に impl パスを追記、Backward Traceability に T-4 行を追加

#### 削除したファイル
- なし

### 実装の振り返り
- 仕様の曖昧性への対処: 仕様は明確であり、曖昧な箇所はなかった。Teams モードと Sub Agents モードで spec-compliance-reviewer の起動方法（直接起動 vs Task()）とエスカレーション経路（SendMessage 経由 vs 直接 AskUserQuestion）が異なる点はタスク指示に明記されていた
- 却下した代替案: 中間レビューを既存項目の後に追加する案を却下。タスク指示で明確に「前に挿入」と指定されていたため
- 想定外の発見: なし。Markdown 記述の追加のみで、既存構造への影響は番号の繰り下げのみ
