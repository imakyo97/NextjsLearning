# セットアップ・環境まわりのメモ

## pnpmのインストール

公式ドキュメント: https://pnpm.io/ja/installation

Homebrew経由でインストール。

```bash
brew install pnpm
```

## pnpm: ERR_PNPM_IGNORED_BUILDS

`pnpm install` 時に以下のエラーで停止することがある。

```
[ERR_PNPM_IGNORED_BUILDS] Ignored build scripts: sharp@0.34.5, unrs-resolver@1.12.2

Run "pnpm approve-builds" to pick which dependencies should be allowed to run scripts.
```

pnpmはセキュリティ上、依存パッケージのビルドスクリプト（ネイティブモジュールのビルドなど）をデフォルトでブロックする。
`sharp`（Next.jsの画像最適化用）、`unrs-resolver`（ESLintの依存）はNext.js公式パッケージが利用する定番のネイティブビルドなので、許可して問題ない。

### 対応

```bash
pnpm approve-builds
```

インタラクティブなプロンプトが出るので、対象パッケージを選択（スペースキー）して Enter で確定する。
