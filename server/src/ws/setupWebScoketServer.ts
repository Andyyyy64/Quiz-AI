import { WebSocketServer, WebSocket } from "ws";
import { QuizType } from "../type/quizType";
import { generateQuiz } from "../controllers/quizController";

interface Player {
  id: number;
  name: string;
  prof_image_url?: string;
  ws: WebSocket;
}

interface Session {
  sessionId: number;
  players: Player[];
  quiz: QuizType | undefined;
  correctCount: { [playerId: number]: number };
  matchEnded: boolean;
  category?: string;
  difficulty?: string;
  timeLimit?: number;
  questionCount?: number;
}
// session_idをキーにしてセッションを格納するマップ
const sessions: Map<number, Session> = new Map();
const customSessions: Map<number, Session> = new Map();

export const setupWebSocketServer = (server: any) => {
  const wss = new WebSocketServer({ server });

  wss.on("connection", (ws: WebSocket) => {
    let currentPlayer: Player | null = null;
    let currentSession: Session | null = null;

    ws.on("message", async (message: string) => {
      const data = JSON.parse(message);
      const {
        id,
        name,
        prof_image_url,
        action,
        winner,
        selectedAnswer,
        sessionId,
        category,
        difficulty,
        timeLimit,
        questionCount,
      } = data;
      console.log(data);
      // プレイヤーの接続・マッチメイキング処理
      if (!currentPlayer) {
        currentPlayer = { id, name, prof_image_url, ws };
        // if player have session id
        if (action === "join_session" && sessionId != undefined) {
          currentSession = sessions.get(sessionId) || null;
          console.log(currentSession);
          if (currentSession && currentSession.players.length < 2) {
            currentSession.players.push(currentPlayer);
            currentSession.players.forEach((player) => {
              player.ws.send(
                JSON.stringify({
                  success: true,
                  message: "prefetch",
                }),
              );
            });
            try {
              currentSession.quiz = await generateQuiz(
                currentSession.category || "ランダム",
                currentSession.difficulty || "ランダム",
                currentSession.players[0].id,
                currentSession.players[1].id,
              );
            } catch (error) {
              console.error("クイズの取得に失敗しました:", error);
              currentSession.players.forEach((player) => {
                player.ws.send(
                  JSON.stringify({
                    success: false,
                    message: "failed_quiz_gen",
                  }),
                );
              });
              throw error;
            }
            // send matched noti to both players
            currentSession.players.forEach((player) => {
              player.ws.send(
                JSON.stringify({
                  success: true,
                  message: "matched",
                  quiz: currentSession?.quiz,
                  session_id: currentSession?.sessionId,
                  opponent: {
                    id: currentSession?.players.find((p) => p.id !== player.id)
                      ?.id,
                    name: currentSession?.players.find(
                      (p) => p.id !== player.id,
                    )?.name,
                    prof_image_url: currentSession?.players.find(
                      (p) => p.id !== player.id,
                    )?.prof_image_url,
                  },
                }),
              );
            });
          } else {
            // if session is full or not exist
            ws.send(
              JSON.stringify({
                success: false,
                message: "セッションが存在しないか、既に満員です。",
              }),
            );
          }
        } else if (action === "join_matchmaking" && sessionId == undefined) {
          console.log("Player is waiting for a match.");
          // if player didnt provide session id find a session
          // if doesnt exist create a new session
          let foundSession: Session | null = null;
          // find a existing session
          for (const [sid, session] of sessions.entries()) {
            if (session.players.length < 2 && !session.matchEnded) {
              foundSession = session;
              break;
            }
          }
          if (foundSession) {
            if (foundSession.players.length == 1) {
              currentSession = foundSession;
              currentSession.players.push(currentPlayer);
              ws.send(
                JSON.stringify({
                  success: true,
                  message: "joined_session",
                  sessionId: foundSession.sessionId,
                }),
              );
              try {
                currentSession.quiz = await generateQuiz(
                  currentSession.category || "ランダム",
                  currentSession.difficulty || "ランダム",
                  currentSession.players[0].id,
                  currentSession.players[1].id,
                );
                console.log(currentSession.quiz);
              } catch (error) {
                console.error("クイズの取得に失敗しました:", error);
                currentSession.players.forEach((player) => {
                  player.ws.send(
                    JSON.stringify({
                      success: false,
                      message: "failed_quiz_gen",
                    }),
                  );
                });
                throw error;
              }
              // 両方のプレイヤーにマッチ成功を通知
              currentSession.players.forEach((player) => {
                player.ws.send(
                  JSON.stringify({
                    success: true,
                    message: "matched",
                    quiz: currentSession?.quiz,
                    sessionId: currentSession?.sessionId,
                    opponent: {
                      id: currentSession?.players.find(
                        (p) => p.id !== player.id,
                      )?.id,
                      name: currentSession?.players.find(
                        (p) => p.id !== player.id,
                      )?.name,
                      prof_image_url: currentSession?.players.find(
                        (p) => p.id !== player.id,
                      )?.prof_image_url,
                    },
                  }),
                );
              });
              // session is found but no player
            } else if (foundSession.players.length == 0) {
              ws.send(
                JSON.stringify({
                  success: true,
                  message: "waiting",
                  sessionId: foundSession.sessionId,
                }),
              );
              // session is found but player is full
            } else if (foundSession.players.length == 2) {
              ws.send(
                JSON.stringify({
                  success: false,
                  message: "セッションが存在しないか、既に満員です。",
                }),
              );
            }
            // if there is no existing session, create a new session
          } else {
            const newSessionId = Math.floor(Math.random() * 1000000);
            ws.send(
              JSON.stringify({
                success: true,
                message: "create_new_session",
                sessionId: newSessionId,
                category: category,
                difficulty: difficulty,
              }),
            );
            console.log("Creating new session with id:", newSessionId);
            currentSession = {
              sessionId: newSessionId,
              players: [currentPlayer],
              category: category,
              difficulty: difficulty,
              quiz: undefined,
              correctCount: {},
              matchEnded: false,
            };
            sessions.set(newSessionId, currentSession);
          }
        } else if (action === "create_custom_session") {
          const newSessionId = Math.floor(Math.random() * 1000000);
          ws.send(
            JSON.stringify({
              success: true,
              message: "create_new_custom_session",
              sessionId: newSessionId,
              timeLimit: timeLimit,
              questionCount: questionCount,
              category: category,
              difficulty: difficulty,
            }),
          );
          console.log("Creating new session with id:", newSessionId);
          currentSession = {
            sessionId: newSessionId,
            players: [currentPlayer],
            category: category,
            difficulty: difficulty,
            timeLimit: timeLimit,
            questionCount: questionCount,
            quiz: undefined,
            correctCount: {},
            matchEnded: false,
          };
          customSessions.set(newSessionId, currentSession);
        } else if (action === "join_custom_session" && sessionId != undefined) {
          currentSession = customSessions.get(sessionId) || null;
          if (currentSession && currentSession.players.length < 2) {
            currentSession.players.push(currentPlayer);
            console.log(currentSession);
            currentSession.players.forEach((player) => {
              player.ws.send(
                JSON.stringify({
                  success: true,
                  message: "prefetch",
                  timeLimit: currentSession?.timeLimit,
                  questionCount: currentSession?.questionCount,
                }),
              );
            });
            try {
              currentSession.quiz = await generateQuiz(
                currentSession.category || "ランダム",
                currentSession.difficulty || "ランダム",
                currentSession.players[0]?.id,
                currentSession.players[1]?.id,
              );
            } catch (error) {
              console.error("クイズの取得に失敗しました:", error);
              currentSession.players.forEach((player) => {
                player.ws.send(
                  JSON.stringify({
                    message: "failed_quiz_gen",
                  }),
                );
              });
              throw error;
            }
            // send matched noti to both players
            currentSession.players.forEach((player) => {
              player.ws.send(
                JSON.stringify({
                  success: true,
                  message: "matched",
                  quiz: currentSession?.quiz,
                  timeLimit: currentSession?.timeLimit,
                  questionCount: currentSession?.questionCount,
                  session_id: currentSession?.sessionId,
                  opponent: {
                    id: currentSession?.players.find((p) => p.id !== player.id)
                      ?.id,
                    name: currentSession?.players.find(
                      (p) => p.id !== player.id,
                    )?.name,
                    prof_image_url: currentSession?.players.find(
                      (p) => p.id !== player.id,
                    )?.prof_image_url,
                  },
                }),
              );
            });
          } else {
            // if session is full or not exist
            ws.send(
              JSON.stringify({
                success: false,
                message:
                  "セッションが存在しないか、既に満員です。トップに戻ります",
              }),
            );
          }
        }
      }

      // if currentSession exists, execute the action
      if (currentSession) {
        if (action == "answerd") {
          const opponent = currentSession.players.find(
            (p) => p.id !== currentPlayer?.id,
          );
          if (!opponent) return;
          if (selectedAnswer === currentSession.quiz?.correct_answer) {
            currentSession.correctCount[currentPlayer.id] =
              (currentSession.correctCount[currentPlayer.id] || 0) + 1;
            opponent.ws.send(
              JSON.stringify({
                message: "opponent_answerd",
                is_correct: true,
                quiz: currentSession.quiz,
              }),
            );
          } else {
            console.log("wrong answer");
            opponent.ws.send(
              JSON.stringify({
                message: "opponent_answerd",
                is_correct: false,
                opponent_selected_answer: selectedAnswer,
              }),
            );
          }
        } else if (action === "fetch_next_quiz") {
          console.log("fetching next quiz");
          try {
            currentSession.quiz = await generateQuiz(
              currentSession.category || "ランダム",
              currentSession.difficulty || "ランダム",
              currentSession.players[0].id,
              currentSession.players[1].id,
            );
            console.log(currentSession.quiz);
          } catch (error) {
            console.error("クイズの取得に失敗しました:", error);
            currentSession.players.forEach((player) => {
              player.ws.send(
                JSON.stringify({
                  success: false,
                  message: "failed_quiz_gen",
                }),
              );
            });
            throw error;
          }
          currentSession.players.forEach((player) => {
            player.ws.send(
              JSON.stringify({
                quiz: currentSession?.quiz,
                message: "next_quiz",
              }),
            );
          });
        } else if (action === "victory") {
          currentSession.matchEnded = true;
          currentSession.players.forEach((player) => {
            const opponent = currentSession?.players.find(
              (p) => p.id !== player.id,
            );
            player.ws.send(
              JSON.stringify({
                winner: winner,
                opponent: {
                  id: opponent?.id,
                  name: opponent?.name,
                  correctCount:
                    currentSession?.correctCount[opponent?.id || 0] || 0,
                },
              }),
            );
            player.ws.close();
          });

          // セッションを削除
          sessions.delete(currentSession.sessionId);
        }
      }
    });

    ws.on("close", () => {
      console.log("A player has disconnected.");

      if (currentSession && currentPlayer) {
        // 接続が切れたプレイヤーをセッションのプレイヤー配列から削除
        currentSession.players = currentSession.players.filter(
          (player) => player?.id !== currentPlayer?.id,
        );

        // 対戦相手を取得
        const opponent = currentSession.players.find(
          (p) => p.id !== currentPlayer?.id,
        );

        if (opponent) {
          // 相手に対してプレイヤーが切断されたことを通知
          opponent.ws.send(
            JSON.stringify({
              success: false,
              message: "Opponent has disconnected.",
            }),
          );

          // 3秒後に相手の接続を閉じ、セッションから削除
          setTimeout(() => {
            opponent.ws.close();
            if (currentSession) {
              currentSession.players = currentSession.players.filter(
                (player) => player?.id !== opponent.id,
              );
              // セッションが空の場合、セッションを削除
              if (currentSession?.players.length === 0) {
                sessions.delete(currentSession.sessionId);
              }
            }
          }, 3000);
        } else {
          // セッションが空の場合、セッションを削除
          if (currentSession?.players.length === 0) {
            sessions.delete(currentSession.sessionId);
          }
        }
      }
    });
  });
};
