/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("multiplay_quiz_history").del();
  await knex("singleplay_quiz_history").del();
  await knex("multiplay_history").del();
  await knex("singleplay_history").del();
  await knex("user_quiz_history").del();
  await knex("users").del();

  // Insert users
  const users = await knex("users")
    .insert([
      {
        name: "Alice",
        email: "alice@example.com",
        password:
          "$2b$10$MjeganBCwmwKWBsFGg77DOnzFjL58paZA9PpLTwuXo1qi46zknWxe",
        points: 100,
        rank: "Bronze",
        email_verified: true,
        verification_code: 123456,
        created_at: knex.fn.now(),
        updated_at: knex.fn.now(),
        last_login: knex.fn.now(),
      },
      {
        name: "Bob",
        email: "bob@example.com",
        password:
          "$2b$10$667/L.3Ldtz/55CCNsL0vuGpHBsAxUhO0.6zZgvpyFMFyun9jpCMG",
        points: 150,
        rank: "Silver",
        email_verified: true,
        verification_code: 654321,
        created_at: knex.fn.now(),
        updated_at: knex.fn.now(),
        last_login: knex.fn.now(),
      },
    ])
    .returning("user_id");

  const userId1 = users[0].user_id; // Alice's user_id
  const userId2 = users[1].user_id; // Bob's user_id


    // Insert user quiz history
    await knex("user_quiz_history").insert([
      {
        user_id: userId1,
        quiz_id: 400000,
        question: "2+2は何ですか?",
        correct_answer: "4",
        choices: JSON.stringify(["1", "2", "3", "4"]),
        category: "数学",
        difficulty: "簡単",
        explanation: "2+2=4です",
        user_choices: "4",
        is_correct: true,
        answered_at: knex.fn.now(),
        search_word: "2+2",
      },
      {
        user_id: userId1,
        quiz_id: 4000001,
        question: "フランスの首都はどこですか？",
        correct_answer: "パリ",
        choices: JSON.stringify(["London", "Berlin", "Paris", "Rome"]),
        category: "地理",
        difficulty: "簡単",
        explanation: "フランスの首都はパリです",
        user_choices: "London",
        is_correct: false,
        answered_at: knex.fn.now(),
        search_word: "フランスの首都",
      },
      {
        user_id: userId2,
        quiz_id: 4000002,
        question: "水の沸点は何度ですか？",
        correct_answer: "100°C",
        choices: JSON.stringify(["0°C", "50°C", "100°C", "200°C"]),
        category: "科学",
        difficulty: "簡単",
        explanation: "水の沸点は100°Cです",
        user_choices: "100°C",
        is_correct: true,
        answered_at: knex.fn.now(),
        search_word: "水の沸点",
      },
    ]);

  const singleplayHistory = await knex("singleplay_history")
    .insert({
      user_id: userId1,
      category: "数学",
      difficulty: "簡単",
      question_num: 5,
      correct_num: 2,
      duration: 120,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    })
    .returning("id");

  const singleplayId1 = singleplayHistory[0].id;

  await knex("singleplay_quiz_history").insert([
    { singleplay_id: singleplayId1, quiz_id: 4000001 },
    { singleplay_id: singleplayId1, quiz_id: 4000002 },
  ]);

  const multiplayHistory = await knex("multiplay_history")
    .insert({
      user_id: userId1,
      opponent_user_id: userId2,
      opponent_name: "Bob",
      who_win: userId1, // User 1 won
      points_awarded: 50,
      question_num: 5,
      match_duration: 300,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    })
    .returning("session_id");

  const multiplaySessionId1 = multiplayHistory[0].session_id;

  await knex("multiplay_quiz_history").insert([
    { session_id: multiplaySessionId1, quiz_id: 400000 },
  ]);
};
