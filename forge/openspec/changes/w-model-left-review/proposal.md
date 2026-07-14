# W-Model 左辺レビュー導入 提案書

## 意図（Intent）

Forge の現行ワークフローは逐次構造（brainstorm → spec → implement → review → test → compound）であり、各フェーズの出力品質チェックが不十分である。W-Model に基づき、各設計フェーズに並行した検証活動を追加することで、欠陥の早期発見と手戻りコスト削減を実現する。Phase 1（トレーサビリティ基盤）と Phase 2（V-Model テスト多層化）の上に構築する。

## スコープ（Scope）

### ユーザーストーリー

- Forge ユーザーとして、/brainstorm 段階でユーザーストーリーが「どう検証するか」の観点を含んでいてほしい。なぜなら検証不可能な要件が後工程で問題になるから。
- Forge ユーザーとして、各フェーズ間のエントリー/エグジット基準が明確であってほしい。なぜなら不十分な成果物のまま次フェーズに進むと手戻りが大きくなるから。
- Forge ユーザーとして、/implement の途中で設計適合性チェックが行われてほしい。なぜなら実装完了後に大きな設計逸脱が見つかると修正コストが高いから。
- Forge ユーザーとして、各フェーズの品質ゲートが構造化されたチェックリストで運用されてほしい。なぜなら属人的な判断ではなく再現可能な基準で品質を担保したいから。

### 対象領域

- `commands/brainstorm.md` -- テスタビリティレビュー（軽量チェック）の追加
- `commands/spec.md` -- フェーズゲート参照の追加
- `commands/implement.md` -- 中間レビューポイント（タスク数50%完了時）の追加
- `reference/core-rules.md` -- フェーズゲート（エントリー/エグジット基準）の集約定義
- `agents/spec/spec-validator.md` -- エントリー基準チェック（proposal.md 必須項目検証）の追加

## スコープ外（Out of Scope）

- /review コマンド自体の変更: 既に並列レビュー構造があり十分 -- YAGNI
- W-Model の右辺（テスト側）の変更: Phase 2 で多層テスト導入済み -- YAGNI
- 自動化されたゲート強制（CI/CD 的なブロッキング）: 宣言的なチェックリストで十分 -- YAGNI
- story-quality-gate スキル自体の改修: brainstorm.md 側の記述追加で対応可能 -- YAGNI

## 未解決の疑問点（Open Questions）

- なし（ユーザー確認で全て解決済み）
  - 中間レビュートリガー: タスク数50%完了時
  - テスタビリティレビュー深度: 軽量チェック（story-quality-gate の Testable 強化）
  - ゲート定義先: reference/core-rules.md に集約
