exports.up = function (knex) {
  return knex.schema
    .createTable("users", function (table) {
      table.increments("user_id").primary();
      table.string("name").notNullable();
      table.string("email").notNullable();
      table.string("password").notNullable();
      table.integer("points").notNullable().defaultTo(0);
      table.string("rank").notNullable().defaultTo("ランクなし");
      table
        .string("prof_image_url")
        .notNullable()
        .defaultTo(
          "https://icon-library.com/images/professor-icon/professor-icon-16.jpg"
        );
      table.boolean("email_verified").notNullable().defaultTo(false);
      table.integer("verification_code").notNullable();
      table.timestamp("last_login").notNullable();
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
    })
    .createTable("quiz", function (table) {
      table.increments("quiz_id").primary();
      table.string("question").notNullable();
      table.string("correct_answer").notNullable();
      table.json("choices").notNullable(); // 選択肢をJSONで格納
      table.string("category").notNullable().defaultTo("カテゴリなし");
      table.string("difficulty").notNullable().defaultTo("簡単");
      table.string("explanation").notNullable().defaultTo("説明なし");
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
    })
    .createTable("singleplay_history", function (table) {
      table.increments("id").primary();
      table.integer("user_id").unsigned().notNullable();
      table.foreign("user_id").references("users.user_id");
      table.string("category").notNullable().defaultTo("カテゴリなし");
      table.string("difficulty").notNullable().defaultTo("簡単");
      table.integer("question_num").notNullable();
      table.integer("correct_num").notNullable().defaultTo(0);
      table.integer("duration").notNullable();
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
    })
    .createTable("singleplay_quiz_history", function (table) {
      table.integer("singleplay_id").unsigned().notNullable();
      table.foreign("singleplay_id").references("singleplay_history.id");
      table.integer("quiz_id").unsigned().notNullable();
      table.foreign("quiz_id").references("quiz.quiz_id");
      table.primary(["singleplay_id", "quiz_id"]);
    })
    .createTable("multiplay_history", function (table) {
      table.increments("session_id").primary();
      table.integer("user_id").unsigned().notNullable();
      table.foreign("user_id").references("users.user_id");
      table.integer("opponent_user_id").unsigned().notNullable();
      table.foreign("opponent_user_id").references("users.user_id");
      table.string("opponent_name").notNullable();
      table.integer("who_win").unsigned().notNullable();
      table.foreign("who_win").references("users.user_id");
      table.integer("question_num").notNullable();
      table.integer("points_awarded").notNullable();
      table.integer("match_duration").notNullable();
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
    })
    .createTable("multiplay_quiz_history", function (table) {
      table.integer("session_id").unsigned().notNullable();
      table.foreign("session_id").references("multiplay_history.session_id");
      table.integer("quiz_id").unsigned().notNullable();
      table.foreign("quiz_id").references("quiz.quiz_id");
      table.primary(["session_id", "quiz_id"]);
    })
    .createTable("user_quiz_history", function (table) {
      table.increments("quiz_id").primary();
      table.integer("user_id").unsigned().notNullable();
      table.foreign("user_id").references("users.user_id");
      table.string("question").notNullable();
      table.string("correct_answer").notNullable();
      table.json("choices").notNullable(); // 選択肢をJSONで格納
      table.string("user_choices").notNullable();
      table.string("category").notNullable().defaultTo("カテゴリなし");
      table.string("difficulty").notNullable().defaultTo("簡単");
      table.string("explanation").notNullable().defaultTo("説明なし");
            
      table.boolean("is_correct")
      table.timestamp("answered_at").notNullable().defaultTo(knex.fn.now());
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .dropTable("user_quiz_history")
    .dropTable("multiplay_quiz_history")
    .dropTable("singleplay_quiz_history")
    .dropTable("multiplay_history")
    .dropTable("singleplay_history")
    .dropTable("quiz")
    .dropTable("users");
};
