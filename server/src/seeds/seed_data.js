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
      name: "Alice",
      email: "alice@example.com",
      password: "$2b$10$MjeganBCwmwKWBsFGg77DOnzFjL58paZA9PpLTwuXo1qi46zknWxe",
      points: 100,
      rank: "Bronze",
      email_verified: true,
      verification_code: 123456,
      last_login: knex.fn.now(),
    },
    {
      name: "Bob",
      email: "bob@example.com",
      password: "$2b$10$667/L.3Ldtz/55CCNsL0vuGpHBsAxUhO0.6zZgvpyFMFyun9jpCMG",
      points: 150,
      rank: "Silver",
      email_verified: true,
      verification_code: 654321,
      last_login: knex.fn.now(),
    },
  ]);

  await knex("quiz").insert([
    {
      question: "What is the capital of France?",
      correct_answer: "Paris",
      choices: JSON.stringify(["Paris", "London", "Berlin", "Rome"]),
      category: "Geography",
      difficulty: "Medium",
    },
    {
      question: "What is 2 + 2?",
      correct_answer: "4",
      choices: JSON.stringify(["2", "3", "4", "5"]),
      category: "Math",
      difficulty: "Easy",
    },
  ]);

  await knex("singleplay_history").insert([
    {
      user_id: 1,
      quiz_id: JSON.stringify([1, 2]),
      correct_num: 1,
      duration: 30,
    },
    {
      user_id: 2,
      quiz_id: JSON.stringify([2]),
      correct_num: 1,
      duration: 40,
    },
  ]);

  await knex("multiplay_history").insert([
    {
      user_id: 1,
      quiz_id: JSON.stringify([1, 2]),
      opponent_user_id: 2,
      who_win: 1,
      points_awarded: 50,
      match_duration: 300,
    },
    {
      user_id: 2,
      quiz_id: JSON.stringify([2]),
      opponent_user_id: 1,
      who_win: 2,
      points_awarded: 50,
      match_duration: 320,
    },
  ]);
};
