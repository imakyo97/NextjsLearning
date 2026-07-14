# W-Model 左辺レビュー導入 タスクリスト

## テスト戦略

### L1: Unit テスト
- ユニットテスト: Markdown ファイルの変更のみのためユニットテスト対象なし
- 静的解析: 各 Markdown ファイルの構造が既存パターンに準拠していることを手動確認
- ビルド検証: ビルド対象なし

### L2: Integration テスト
- L2 対象なし（Markdown ファイルの変更のみ）

### L3: Acceptance テスト
- 受入テスト: design.md の受入テスト計画に基づき、各 US の構造的検証を実施

## タスク

### Task 1: reference/core-rules.md に Phase Gates セクションを追加（推定: 3分）
- **対象ファイル**: `reference/core-rules.md`（既存）
- **やること**: Verification Gates セクション（行83）の直後に Phase Gates セクションを新設。brainstorm→spec, spec→implement, implement→review の各遷移のエントリー/エグジット基準をテーブル形式で定義する。既存の Verification Gates との概念的区別を説明文で明記する
- **修正対象セクション見出し**: 新規セクション「## Phase Gates」を「## Verification Gates」の直後に追加
- **検証方法**: ファイルを Read して (1) Phase Gates セクションが存在する (2) 3つの遷移全てに Entry/Exit Criteria がある (3) Verification Gates が変更されていない ことを確認
- **関連要件**: REQ-002
- **関連スペック**: `specs/w-model-left-review/delta-spec.md#REQ-002`
- **依存**: なし

### Task 2: commands/brainstorm.md にテスタビリティレビューを追加（推定: 3分）
- **対象ファイル**: `commands/brainstorm.md`（既存）
- **やること**: ステップ5.7（story-quality-gate）の直後にステップ5.8「テスタビリティレビュー」を追加する。proposal.md のテンプレート（行80-101）の「ユーザーストーリー」セクションに検証観点の追記形式を反映する
- **修正対象セクション見出し**: 行47 の直後に「5.8. **テスタビリティレビュー**:」を追加、行88 のテンプレートにも反映
- **検証方法**: ファイルを Read して (1) ステップ5.8 が5.7 の直後にある (2) 各ストーリーへの検証観点問いかけが記述されている (3) 非ブロッキングが明記されている (4) 提案書テンプレートに検証観点の記載形式がある ことを確認
- **関連要件**: REQ-001
- **関連スペック**: `specs/w-model-left-review/delta-spec.md#REQ-001`
- **依存**: なし

### Task 3: commands/spec.md にフェーズゲート参照を追加（推定: 2分）
- **対象ファイル**: `commands/spec.md`（既存）
- **やること**: (1) Phase 1a/1b の前（Step 0 の後、行30付近）にエントリー基準参照を追記。(2) Phase 5（行165-176）にエグジット基準参照を追記。既存の Phase 番号体系は維持する
- **修正対象セクション見出し**: 「### Phase 1a」の前に Phase Gate 参照を追加、「### Phase 5: ユーザー確認」内に追記
- **検証方法**: ファイルを Read して (1) エントリー基準参照が Phase 1 の前にある (2) エグジット基準参照が Phase 5 にある (3) Phase 番号体系が維持されている ことを確認
- **関連要件**: REQ-003
- **関連スペック**: `specs/w-model-left-review/delta-spec.md#REQ-003`
- **依存**: Task 1（参照先の Phase Gates 定義が必要）

### Task 4: commands/implement.md に中間レビューポイントを追加（推定: 4分）
- **対象ファイル**: `commands/implement.md`（既存）
- **やること**: (1) Step 4b（行105-116）に中間レビューチェックポイントを追加。50%完了時トリガー、4以下スキップ条件、spec-compliance-reviewer 事後検証モード起動、結果処理（逸脱なし/あり/エスカレーション）を記述。(2) Step 4a（行88-103）にも同等の中間レビューロジックを追加。(3) implementer プロンプト構造（行149-178）に中間レビューの呼び出し方を追記する必要はない（Main Agent が直接 spec-compliance-reviewer を起動するため）
- **修正対象セクション見出し**: 「### Step 4a: Teams モードの実行」内に中間レビューサブセクションを追加、「### Step 4b: Sub Agents モードの実行」内に中間レビューサブセクションを追加
- **検証方法**: ファイルを Read して (1) Step 4a と Step 4b の両方に中間レビューが定義されている (2) 50%トリガーが明記されている (3) 4以下スキップ条件がある (4) spec-compliance-reviewer 事後検証モードの使用が指定されている (5) 結果処理3パターンが記述されている ことを確認
- **関連要件**: REQ-004
- **関連スペック**: `specs/w-model-left-review/delta-spec.md#REQ-004`
- **依存**: なし

### Task 5: agents/spec/spec-validator.md にエントリー基準プレチェックを追加（推定: 3分）
- **対象ファイル**: `agents/spec/spec-validator.md`（既存）
- **やること**: Step 1（行220-227）の前に Step 0「エントリー基準プレチェック」を追加。proposal.md の存在チェック、必須セクション（Intent, User Stories/Scope, Out of Scope）の存在チェック、ユーザーストーリーの最低1つ存在チェックを記述。PASS 時は Step 1 に進む。FAIL 時はエラー出力して中止（ブロッキング）。既存の Step 番号を繰り下げる（Step 1→Step 1 のまま維持し、Step 0 を新規追加する形）。「11 の検証項目」の記述は変更しない
- **修正対象セクション見出し**: 「## ワークフロー」内に「### Step 0: エントリー基準プレチェック」を新設、既存の「### Step 3: 11 の検証項目の実行」の記述を維持
- **検証方法**: ファイルを Read して (1) Step 0 が Step 1 の前にある (2) proposal.md の存在チェックがある (3) 必須セクションのチェックがある (4) FAIL 時のブロッキング動作が記述されている (5) 「11 の検証項目」の数値が変更されていない ことを確認
- **関連要件**: REQ-005
- **関連スペック**: `specs/w-model-left-review/delta-spec.md#REQ-005`
- **依存**: Task 1（エントリー基準の定義が参照先として必要）

### Task 6: 横断整合性チェック（推定: 3分）
- **対象ファイル**: 全変更対象ファイル
- **やること**: (1) delta-spec のファイル間整合性テーブルに基づき、全ファイル間の整合性を検証。(2) 「Phase Gates」「テスタビリティレビュー」「中間レビュー」の用語で全ファイルを Grep し、意図しない残存や不整合がないか確認。(3) 「11 の検証項目」が spec-validator.md と spec.md で変更されていないことを確認。(4) プロジェクト/グローバル同期: 変更ファイルに `~/.claude/` 配下のファイルが含まれる場合、リポジトリ内ファイルとの同期を確認
- **検証方法**: Grep で用語検索、各ファイルを Read して整合性テーブルの全項目を目視確認
- **関連要件**: REQ-001, REQ-002, REQ-003, REQ-004, REQ-005
- **関連スペック**: `specs/w-model-left-review/delta-spec.md#ファイル間整合性テーブル`
- **依存**: Task 1, Task 2, Task 3, Task 4, Task 5
