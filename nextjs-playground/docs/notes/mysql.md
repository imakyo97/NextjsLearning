# MySQL構築（Docker Compose）

## Docker ComposeでMySQLを構築する理由

- MySQLはNode.jsのライブラリのように`npm install`でプロジェクトに組み込めるものではなく、どこかで稼働している「サーバー」にPrisma（ORM/クライアント）が接続する形
- ローカルに直接インストールすると常駐サービスとして残り続け、複数プロジェクトで設定が絡み合いやすい
- Dockerなら`docker-compose.yml`を1つ用意するだけで、ローカルマシンを汚さずに起動・破棄でき、`docker compose down -v`で状態をリセットできるので学習用途と相性が良い

## docker-compose.ymlの内容

```yaml
services:
  mysql:
    image: mysql:9.7
    container_name: nextjs-playground-mysql
    restart: unless-stopped
    env_file:
      - .env
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
      MYSQL_DATABASE: ${MYSQL_DATABASE}
      MYSQL_USER: ${MYSQL_USER}
      MYSQL_PASSWORD: ${MYSQL_PASSWORD}
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql

volumes:
  mysql_data:
```

- `services.mysql` — 起動するコンテナ（アプリ）を1つ定義するブロック。名前は任意
- `image: mysql:9.7` — Docker Hubから取得するMySQL公式イメージとバージョン
- `container_name: nextjs-playground-mysql` — 実際に付くコンテナ名。省略した場合は`<プロジェクト名>-<サービス名>-<番号>`が自動生成される（例: `nextjs-playground-mysql-1`）。明示指定すると`docker ps`/`docker logs`/`docker compose exec <名前>`で分かりやすい。同名のコンテナは同時に1つしか存在できない
- `restart: unless-stopped` — コンテナが落ちた（クラッシュした、Docker自体が再起動した等）ときの再起動ポリシー。主な選択肢:
  - `no`（デフォルト） — 再起動しない
  - `always` — 常に再起動する。`docker stop`で手動停止しても、Docker自体を再起動すると再度立ち上がる
  - `on-failure` — 異常終了（終了コードが0以外）したときだけ再起動する
  - `unless-stopped` — `always`に近いが、自分で`docker stop`した場合は再起動しない。手動停止の意図を尊重しつつ、クラッシュやPC再起動時は自動復旧してほしいので、学習用DBコンテナでもこの設定が扱いやすい
- `env_file: .env` — コンテナ内に渡す環境変数を`.env`ファイルから読み込む指定
- `environment` — 実際にコンテナに渡す環境変数（MySQL公式イメージが起動時にこれらを見て初期DB・ユーザーを自動作成する）。必須・任意は変数ごとに異なる:
  - `MYSQL_ROOT_PASSWORD` — 必須。rootユーザーのパスワード。無いと起動時エラーになる（代替として`MYSQL_ALLOW_EMPTY_PASSWORD=yes`で空パスワード許可、`MYSQL_RANDOM_ROOT_PASSWORD=yes`でランダム生成も可能だが学習用途でも非推奨）
  - `MYSQL_DATABASE` — 任意。指定すると初期化時にそのデータベースを自動作成する。この初期化処理は**コンテナの初回起動時（データディレクトリが空のとき）だけ**実行される。起動済みのコンテナに後から`MYSQL_DATABASE`を変更しても既存データには反映されない（別DBを追加したい場合は手動で`CREATE DATABASE`するか、ボリュームを削除して再初期化する必要がある）
  - `MYSQL_USER` / `MYSQL_PASSWORD` — 任意だがセットで指定する必要がある（片方だけだとエラー）。指定するとroot以外の一般ユーザーが作られ、`MYSQL_DATABASE`で指定したDBへの権限が付与される。`MYSQL_USER`に`root`を指定するのはエラー（既に存在するため）
  - アプリからは一般ユーザー（`MYSQL_USER`）で接続し、rootパスワードは初期化用としてのみ保持するのが定番
- `ports: "3306:3306"` — `ホスト:コンテナ`のポート対応。ローカルPCの3306番からコンテナ内MySQLの3306番へ転送
- `volumes: mysql_data:/var/lib/mysql` — コンテナを削除してもデータが消えないように、MySQLのデータディレクトリをDocker管理の名前付きボリュームに永続化

## まっさらな状態からdocker-compose.ymlを書く場合の調べ方

「イメージ側のREADME」で何を設定すべきかを知り、「Compose公式リファレンス」で書き方の文法を確認する、という2段構えで調べる。

1. **使いたいイメージの公式ページを見る** — 例えば https://hub.docker.com/_/mysql の「How to use this image」セクションに、必須/任意の環境変数、ポート、ボリュームの使い方が一通り書かれている。多くの公式イメージはこのセクションに`docker run`や`docker-compose.yml`のサンプルも載っている
2. **docker-compose.ymlの書き方自体はDocker Compose公式のファイルリファレンスを見る** — https://docs.docker.com/reference/compose-file/ に`services`/`ports`/`volumes`/`environment`/`restart`などの項目ごとの正式な仕様が載っている
3. **わからない項目が出たら都度リファレンスで検索する** — 一度に全部覚える必要はなく、知らない項目（例: `depends_on`）が出てきたときに公式リファレンスで該当項目を調べれば十分

別のイメージ（Redis、PostgreSQLなど）を使うときも同じ手順で調べられる。

### 「environmentが必要」「volumesで永続化が必要」といった判断はどこから来るか

判断の元になる知識は2種類に分かれる。

- **「そもそも永続化が必要か」は一般的なDockerの知識** — コンテナは削除・再作成すると中に書き込んだファイルは全部消える、という前提知識。MySQL固有ではなく全コンテナに共通する話なので、Docker公式の「Persisting container data」を一度学べば、以降は「このコンテナは状態（データ）を保持する必要があるか？」と自問するだけで判断できる — https://docs.docker.com/get-started/docker-concepts/running-containers/persisting-container-data/
- **「具体的にどの環境変数が必要か」「どのディレクトリを永続化すべきか」はイメージ固有の知識** — 使うイメージごとに毎回、そのイメージのDocker Hubページを見て確認する。MySQL公式イメージの場合、READMEの「Where to Store Data」セクションに`/var/lib/mysql`を永続化すべきと明記されており、「Environment Variables」セクションに`MYSQL_ROOT_PASSWORD`などが必要と書かれている

つまり「永続化やenvironmentという仕組み自体が必要になる場面」は一度覚えれば毎回使える一般知識、「具体的に何を書くか」はイメージが変わるたびにそのイメージのドキュメントを見て確認する、という切り分けになる。

## .envのDATABASE_URL

```
DATABASE_URL="mysql://prisma_user:prisma_password@localhost:3306/prisma_learning"
```

PrismaやNext.jsが接続先を判断するための接続文字列（Connection URL）。フォーマットは`mysql://ユーザー:パスワード@ホスト:ポート/データベース名`という決まった形式。

- `mysql://` — 使用するDBの種類（プロトコル）。PostgreSQLなら`postgresql://`になる
- `prisma_user:prisma_password` — `MYSQL_USER`/`MYSQL_PASSWORD`と同じ値。このユーザーでログインする
- `@localhost:3306` — 接続先ホストとポート。`docker-compose.yml`の`ports: "3306:3306"`でホスト側に公開したポートに一致
- `/prisma_learning` — 接続先データベース名。`MYSQL_DATABASE`と同じ値

Prisma CLIやPrisma Clientはこの1本のURLだけを見て接続するため、`schema.prisma`側では`env("DATABASE_URL")`という形でこの値を参照する。

## MySQLのバージョン選定

- MySQLは8.0以降、リリース方式が「LTS（長期サポート）」と「Innovation（短命だが新機能が先に入る）」の2系統に分かれている
- LTS版はセキュリティ・バグ修正が長期間提供され、バージョンを固定しても安心して使える。学習用途では頻繁にバージョンを追いかける必要がないLTS版が基本の選択肢
- 最新イメージの確認先: Docker Hub公式MySQLリポジトリのTagsページ https://hub.docker.com/_/mysql/tags （リリース日は分かるが、どれがLTSかは載っていない）
- LTSかどうかの判断はMySQL公式ドキュメント(https://www.mysql.com/)で確認する
- 2026年7月時点の最新LTSは`9.7`（2026年4月リリース、前LTSの`8.4`を引き継ぐ）。このため`docker-compose.yml`は`mysql:9.7`を採用

## 参考

- MySQL公式イメージ（Docker Hub）: https://hub.docker.com/_/mysql
- Docker Compose ファイルリファレンス: https://docs.docker.com/reference/compose-file/
- Docker Compose公式ドキュメント: https://docs.docker.com/compose/
- Persisting container data: https://docs.docker.com/get-started/docker-concepts/running-containers/persisting-container-data/
- Prisma公式ドキュメント: https://www.prisma.io/docs
