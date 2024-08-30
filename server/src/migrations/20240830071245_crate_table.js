/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
    .createTable('users', function(table) {
      table.increments('user_id').primary();
      table.string('name').notNullable();
      table.string('email').notNullable();
      table.string('password').notNullable();
      table.integer('points').notNullable().defaultTo(0);
      table.string('rank').notNullable().defaultTo(JSON.stringify(['unrank']));
      table.string('prof_image_url').notNullable().defaultTo('https://static.vecteezy.com/system/resources/previews/009/734/564/original/default-avatar-profile-icon-of-social-media-user-vector.jpg');
      table.boolean('email_verified').notNullable().defaultTo(false);
      table.timestamp('last_login').notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());    
    })
    .createTable('quiz', function(table) {
      table.increments('quiz_id').primary();
      table.string('problem').notNullable();
      table.string('answer').notNullable();
      table.string('category').notNullable().defaultTo(JSON.stringify(['general']));
      table.string('difficulty').notNullable().defaultTo(JSON.stringify(['easy']));
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    })
    .createTable('singleplay_history', function(table) {
      table.increments('id').primary();
      table.integer('user_id').unsigned().notNullable();
      table.foreign('user_id').references('users.user_id');
      table.integer('quiz_id').unsigned().notNullable();
      table.foreign('quiz_id').references('quiz.quiz_id');
      table.boolean('did_correct').notNullable().defaultTo(false);
      table.timestamp('timestamp').notNullable();
    })
    .createTable('multiplay_history', function(table) {
      table.increments('session_id').primary();
      table.integer('user_id').unsigned().notNullable();
      table.foreign('user_id').references('users.user_id');
      table.integer('quiz_id').unsigned().notNullable();
      table.foreign('quiz_id').references('quiz.quiz_id');
      table.integer('opponent_user_id').unsigned().notNullable();
      table.foreign('opponent_user_id').references('users.user_id');
      table.boolean('did_win').notNullable().defaultTo(false);
      table.integer('points_awarded').notNullable();
      table.timestamp('timestamp').notNullable();
    });
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down = function(knex) {
    return knex.schema
      .dropTable('multiplay_history')
      .dropTable('singleplay_history')
      .dropTable('quiz')
      .dropTable('users');
  };
  