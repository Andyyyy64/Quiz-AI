/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("multiplay_history").del();
  await knex("singleplay_history").del();
  await knex("quiz").del();
  await knex("users").del();

  await knex("users").insert([
    {
      user_id: 100,
      name: "Alice",
      email: "alice@example.com",
      password: "hashed_password_1",
      points: 100,
      rank: "ルーキー",
      prof_image_url: "https://example.com/avatar1.png",
      last_login: knex.fn.now(),
      email_verified: true,
      verification_code: 123456,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      user_id: 200,
      name: "Bob",
      email: "bob@example.com",
      password: "hashed_password_2",
      points: 200,
      rank: "ランクなし",
      prof_image_url: "https://example.com/avatar2.png",
      last_login: knex.fn.now(),
      email_verified: true,
      verification_code: 123456,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
  ]);

  await knex("quiz").insert([
    {
      quiz_id: 1,
      problem: "What is the capital of France?",
      answer: "Paris",
      category: "地理",
      difficulty: "簡単",
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      quiz_id: 2,
      problem: "What is the square root of 64?",
      answer: "8",
      category: "数学",
      difficulty: "簡単",
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
  ]);

  await knex("singleplay_history").insert([
    {
      id: 1,
      user_id: 100,
      quiz_id: 1,
      did_correct: true,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      id: 2,
      user_id: 200,
      quiz_id: 2,
      did_correct: false,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
  ]);

  await knex("multiplay_history").insert([
    {
      session_id: 1,
      user_id: 100,
      quiz_id: 1,
      opponent_user_id: 200,
      did_win: true,
      points_awarded: 10,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      session_id: 2,
      user_id: 200,
      quiz_id: 2,
      opponent_user_id: 100,
      did_win: false,
      points_awarded: 5,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
  ]);
};
