# W-Model 左辺レビュー導入 技術設計

## 概要

Forge ワークフローに W-Model の左辺レビュー（設計フェーズでの並行検証活動）を導入する。具体的には、(1) /brainstorm にテスタビリティレビュー（軽量チェック）を追加、(2) reference/core-rules.md にフェーズゲート（エントリー/エグジット基準）を集約定義、(3) /spec と /implement からフェーズゲートを参照、(4) /implement に中間レビューポイント（タスク数50%完了時）を追加、(5) spec-validator にエントリー基準プレチェックを追加する。

本変更は Markdown ファイルへの記述追加が主体であり、プログラムコードの実装は含まない。

## リサーチサマリー

### 公式ドキュメントからの知見

（stack-docs-researcher 未起動 -- Forge 固有のワークフロー変更であり、外部ライブラリのドキュメント参照は不要）

### Web検索からの知見

- **W-Model 左辺レビューの本質**: 各開発フェーズで、対応するテスト設計を同時進行させること。要件レビュー時にテスト担当者が「この要件はどうテストするか」を問う（Andreas Spillner, 2002; ISTQB v4.0）
- **軽量フェーズゲート設計**: 小規模プロジェクトでは Risk-Based Gating が推奨。自動化可能な条件は CI/CD に組み込み、人的判断を承認ポイントに集中させる。ゲート条件は「前フェーズの主要成果物が存在する」「未解決のブロッキング課題がない」程度の軽量さが適切
- **中間レビューの設定指針**: タスク完了率ベースはシンプルで判定明確だが、タスクの粒度が不均一だと歪む。Forge ではタスクが2-5分の均質サイズに設計されるため、タスク数ベースの50%が適切
- **テスタビリティレビュー**: 要件段階での最小チェックは「各要件に合格/不合格を判定できる具体的条件が定義されているか」。過度な構造化は brainstorm の軽量性を損なう
- **ゲートオーバーヘッドの落とし穴**: 全フェーズ均一ゲート、形式主義化（Checkbox Syndrome）、ゲート渋滞が主なリスク。ゲート関連オーバーヘッドが全体リードタイムの15%を超えたら見直し推奨

### コードベース分析（既存スペックとの関連含む）

**直接変更対象ファイル（5箇所）:**

1. `commands/brainstorm.md` -- ステップ5.7（story-quality-gate）の直後にステップ5.8（テスタビリティレビュー）を追加
2. `reference/core-rules.md` -- Verification Gates セクション（行55-83）の直後に Phase Gates セクションを新設
3. `commands/spec.md` -- Phase 1 冒頭にエントリー基準参照を追加、Phase 5 にエグジット基準参照を追加
4. `commands/implement.md` -- Step 4a/4b に中間レビューチェックポイントを追加
5. `agents/spec/spec-validator.md` -- Step 1 の前に Step 0（エントリー基準プレチェック）を追加

**間接的に影響を受けるファイル: なし**

以下は意図的に変更しない:

- `agents/implementation/spec-compliance-reviewer.md` -- 既存の「事後検証モード」をそのまま中間レビューに使用する。新モード追加は不要（完了済みタスク分のみを対象にすることは呼び出し元のプロンプトで指定可能）
- `agents/orchestration/implement-orchestrator.md` -- 既存の「3タスクごとの回帰テスト」（Phase 4, 行126-129）は回帰確認が目的。中間レビューは設計適合性チェックが目的。補完的な関係であり変更不要
- `commands/test.md` -- テストレベルの Entry/Exit Criteria（行21-28）はテスト実行固有のゲート。Phase Gates はワークフローフェーズ間のゲートであり概念が異なる。重複なし
- `commands/ship.md` -- /ship は各コマンドを連鎖実行するだけで、ゲートは各コマンド内で処理される
- `CLAUDE.md` -- ワークフロー図への変更は YAGNI。Phase Gates は reference/core-rules.md で十分

**既存スペックとの関連:**

- `openspec/specs/test-multilayer/spec.md`: REQ-009（spec-validator 検証項目数を10→11に更新）。今回のエントリー基準プレチェックは「検証項目」ではなく「前提条件チェック」として Step 0 に配置するため、検証項目数は 11 のまま維持。矛盾なし
- `openspec/specs/traceability/spec.md`: REQ-004（spec-validator のトレーサビリティ検証）。Step 0 は Step 1 の前に実行されるため、既存フローに影響なし
- `openspec/specs/workflow-redesign/spec.md`: /implement のモード分岐。中間レビューは Teams モード・Sub Agents モードの両方に追加する

### 過去の学び

1. **ファイル間整合性テーブルを仕様に含める**（add-traceability, v-model-test-multilayer で3回成功）→ delta-spec に整合性テーブルを含める
2. **検証項目数の記述更新漏れに注意**（add-traceability 教訓）→ 今回はエントリー基準プレチェックを「検証項目」ではなく「Step 0」として分離し、11 の検証項目の数値を変更しない設計で回避
3. **横断チェックタスクは必須**（remove-domain-skills で3回ルール発動）→ 最終タスクに横断チェックを配置
4. **概念変更は横断 grep で残存確認が必要**（change-commit-timing 教訓）→ 新用語「Phase Gates」「テスタビリティレビュー」「中間レビュー」の全ファイル確認を横断チェックに含める
5. **spec-validator への検証項目追加時は検証レベルを明記**（v-model-test-multilayer 教訓）→ 今回は検証項目追加なし（Step 0 として分離）のため直接適用外だが、エントリー基準プレチェックの結果が「ブロッキング」であることを明記する

## 技術的アプローチ

### 1. テスタビリティレビュー（commands/brainstorm.md）

ステップ5.7（story-quality-gate）の直後にステップ5.8「テスタビリティレビュー」を追加する。story-quality-gate の Testable チェックを補完する形で、各ユーザーストーリーに「検証観点」を1行追記する。

追加内容:
- 各ユーザーストーリーに対して「このストーリーはどう検証しますか？」と問いかける
- ユーザーの回答をストーリーの下に「検証観点: [回答]」として追記する
- 検証観点が曖昧な場合（「動作確認する」等）、より具体的な検証方法を質問する
- このチェックは非ブロッキング: ユーザーが「このまま進める」と判断すれば許可する
- 検証観点は proposal.md のユーザーストーリー直下に記載する

### 2. フェーズゲート定義（reference/core-rules.md）

Verification Gates セクションの直後に「Phase Gates」セクションを新設する。既存の Verification Gates（Quick/Standard/Full）はコミット前・フェーズ遷移前のテスト実行レベルの定義であり、Phase Gates はワークフローフェーズ間の品質ゲートの定義である。概念を明確に分離する。

定義するゲート:

| 遷移 | Entry Criteria | Exit Criteria |
|---|---|---|
| → brainstorm | なし | proposal.md が存在し、必須セクション（Intent, User Stories, Scope, Out of Scope）を含む |
| brainstorm → spec | proposal.md の必須セクション完備、ユーザー承認済み | spec-validator PASS、ユーザー承認済み |
| spec → implement | design.md + tasks.md + delta-spec.md + traceability.md が存在 | 全タスク完了、テスト合格 |
| implement → review | 全テスト合格、型チェック合格 | レビュー指摘の P1/P2 が解消済み |

各ゲートは宣言的なチェックリストであり、CI/CD 的な自動ブロッキングではない。コマンド定義からの参照リンクで運用する。

### 3. フェーズゲート参照（commands/spec.md）

- Phase 1a/1b の冒頭に「Phase Gate: brainstorm → spec のエントリー基準を確認する（reference/core-rules.md 参照）」を追記
- Phase 5 のユーザー確認に「Phase Gate: spec → implement のエグジット基準を満たしていることを確認する（reference/core-rules.md 参照）」を追記

### 4. 中間レビューポイント（commands/implement.md）

Step 4a（Teams モード）と Step 4b（Sub Agents モード）に中間レビューチェックポイントを追加する。

**トリガー条件**: tasks.md のタスク総数の50%（切り上げ）が完了した時点。タスク総数が4以下の場合はスキップ（中間レビューのオーバーヘッドが実装コストに対して大きすぎるため）。

**実行内容**: spec-compliance-reviewer を「事後検証モード」で起動し、完了済みタスクの実装結果を検証する。プロンプトで「中間レビュー: 完了済みタスクのみを対象に検証してください」と指定する。

**実行回数**: 中間レビューは変更セッションあたり1回のみ実行する。50%到達時に1回実行し、以降の追加タスク完了では再実行しない。

**結果処理**:
- 逸脱なし: 残タスクの実装を継続
- 逸脱あり: 逸脱を修正してから残タスクの実装を継続
- 仕様エスカレーション: AskUserQuestion でユーザーに確認

### 5. エントリー基準プレチェック（agents/spec/spec-validator.md）

既存の Step 1（対象ファイルの読み込み）の前に Step 0「エントリー基準プレチェック」を追加する。これは「11 の検証項目」とは独立した前提条件チェックであり、検証項目数には含めない。

**チェック内容**:
- proposal.md が存在するか
- 必須セクションが存在するか（Intent, User Stories/Scope, Out of Scope）
- ユーザーストーリーが最低1つ存在するか

**結果**:
- 全条件 PASS: Step 1 に進む
- いずれか FAIL: 「エントリー基準未達: [不足項目]。/brainstorm で補完してください」とエラーを出力し、検証を中止する（ブロッキング）

## 受入テスト計画

### US-001: /brainstorm 段階でテスタビリティの観点が確認される
- **テストレベル**: L1
- **GIVEN** commands/brainstorm.md にステップ5.8（テスタビリティレビュー）が定義されている **WHEN** ステップ5.8 の内容を検証する **THEN** 各ユーザーストーリーに「検証観点」を問いかけるワークフローが記述されており、非ブロッキングであることが明記されている

### US-002: 各フェーズ間のエントリー/エグジット基準が定義される
- **テストレベル**: L1
- **GIVEN** reference/core-rules.md に Phase Gates セクションが存在する **WHEN** Phase Gates の内容を検証する **THEN** brainstorm→spec, spec→implement, implement→review の各遷移に Entry Criteria と Exit Criteria が定義されている

### US-003: /implement で中間レビューが実行される
- **テストレベル**: L1
- **GIVEN** commands/implement.md に中間レビューチェックポイントが定義されている **WHEN** Step 4a と Step 4b の内容を検証する **THEN** タスク数50%完了時に spec-compliance-reviewer を起動するワークフローが記述されており、タスク数4以下の場合のスキップ条件が明記されている

### US-004: 品質ゲートが構造化されたチェックリストで運用される
- **テストレベル**: L1
- **GIVEN** reference/core-rules.md の Phase Gates と agents/spec/spec-validator.md の Step 0 が定義されている **WHEN** 両ファイルの整合性を検証する **THEN** spec-validator の Step 0 が core-rules.md の「brainstorm → spec」エントリー基準と同じ条件をチェックしている

## リスクと注意点

### Verification Gates と Phase Gates の混同

reference/core-rules.md に2種類のゲートが併存する。Verification Gates（テスト実行レベル）と Phase Gates（ワークフロー遷移基準）の概念を明確に分離し、セクション見出しと説明文で区別する。

### spec-validator の検証項目数の同期

エントリー基準プレチェックを「Step 0」として検証項目とは独立させることで、「11 の検証項目」の数値を変更しない設計としている。commands/spec.md（行151）と spec-validator.md（行49）の記述は変更不要。

### 中間レビューのオーバーヘッド

タスク数4以下のスキップ条件で軽微な変更への過剰適用を防ぐ。また、spec-compliance-reviewer は既存の事後検証モードをそのまま使用するため、新モード追加のコストが発生しない。

### implement-orchestrator との関係

implement-orchestrator の「3タスクごとの回帰テスト」は回帰確認（テスト実行）が目的であり、中間レビューは設計適合性確認（スペック準拠）が目的である。補完的な関係であり、タイミングが重なった場合は中間レビューを先に実行し、その後回帰テストを実行する。
