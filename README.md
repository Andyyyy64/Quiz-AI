# AI-Quiz-Battle
[hackmd]()
## 環境構築

1. clone

    `git clone git@github.com:MoRpH0gEN/AI-Quiz-Battle.git`

    `cd AI-Quiz-Battle/server`

2. 環境変数を変更

    `cp .env.example .env`

    ```
    #jwt
    JWT_SECRET_KEY=secret

    #nodemailer
    GMAIL_USER=
    GMAIL_PASSWORD=

    #db
    DB_USER=postgres
    DB_HOST=db
    DB_NAME=quizbattledev
    DB_PASSWORD=riz7
    ```
3. dockerを実行

    `docker-compose up`

4. migrationとseedsを実行

    `docker-compose exec app sh`

    `npx knex migrate:latest`

    `npx knex seed:run`

    エラーが出る場合は

    `npx knex migrate:rollback --all`

    を実行してから上の二つのmigrateとseedを実行すると治るかも？

5. server is running on port 3000


6. フロント起動
    
    `cd ../client`

    `cp .env.example .env`
    
    `npm i`

    `npm run dev`

7. ログイン