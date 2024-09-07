# AI-Quiz-Battle
[hackmd](https://hackmd.io/N2i3zSxpRruENr3rBgRNDA)
## 環境構築

1. clone

    `git clone git@github.com:MoRpH0gEN/AI-Quiz-Battle.git`

    `cd AI-Quiz-Battle/server`

2. 環境変数を変更

    `cp .env.example .env`

    ```
    PORT=3000

    #db
    DB_USER=postgres
    DB_HOST=db
    DB_NAME=quizbattledev
    DB_PASSWORD=riz7

    #nodemailer
    GMAIL_USER=andyrossi64@gmail.com
    GMAIL_PASSWORD=nnrz ebzx chog zass

    #jwt
    JWT_SECRET=secret

    #gcp
    GCP_PROJECT_ID=global-road-432819-e3
    GCP_BUCKET_NAME=quiz_user_prof

    #openai
    OPENAI_API_KEY=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
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

    alice@example.com
    diamondchair87
