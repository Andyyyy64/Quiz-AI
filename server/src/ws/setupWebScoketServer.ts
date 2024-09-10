import { WebSocketServer, WebSocket } from 'ws';
import { QuizType } from '../type/quizType';
import { generateQuiz } from '../controllers/quizController';

interface Player {
    id: number;
    name: string;
    rank: string;
    prof_image_url?: string;
    ws: WebSocket;
    opponent?: Player; // マッチング相手を保持
    correctCount: number;
}

// 待機中のプレイヤーを格納するキュー
const waitingPlayers: Player[] = [];

let quiz: QuizType;

export const setupWebSocketServer = (server: any) => {
    const wss = new WebSocketServer({ server });

    wss.on('connection', (ws: WebSocket) => {
        let currentPlayer: Player | null = null;

        ws.on('message', async (message: string) => {
            const data = JSON.parse(message);
            const { id, name, rank, prof_image_url, action, winner, selectedAnswer } = data;

            // プレイヤーの接続・マッチメイキング処理
            if (!currentPlayer) {
                currentPlayer = { id, name, rank, prof_image_url, ws, correctCount: 0 };
                // 待機プレイヤーがいる場合はマッチング
                if (waitingPlayers.length > 0) {
                    const matchedPlayer = waitingPlayers.shift() as Player; // 先頭のプレイヤーを取得

                    // 両方のプレイヤーをお互いに参照させる
                    matchedPlayer.opponent = currentPlayer;
                    currentPlayer.opponent = matchedPlayer;

                    // クイズを生成してプレイヤーに送信
                    try {
                        quiz = await generateQuiz("ランダム", "ランダム", currentPlayer.id, currentPlayer.opponent.id);
                    } catch (error) {
                        console.error('クイズの取得に失敗しました:', error);
                        throw error;
                    }
                    // 両方のプレイヤーにマッチ成功を通知
                    matchedPlayer.ws.send(
                        JSON.stringify({
                            success: true,
                            message: 'matched',
                            quiz: quiz,
                            opponent: {
                                id: currentPlayer.id,
                                name: currentPlayer.name,
                                rank: currentPlayer.rank,
                                prof_image_url: currentPlayer.prof_image_url
                            },
                        })
                    );
                    currentPlayer.ws.send(
                        JSON.stringify({
                            success: true,
                            message: 'matched',
                            quiz: quiz,
                            opponent: {
                                id: matchedPlayer.id,
                                name: matchedPlayer.name,
                                rank: matchedPlayer.rank,
                                prof_image_url: matchedPlayer.prof_image_url
                            },
                        })
                    );
                } else {
                    // マッチング相手がいない場合、このプレイヤーを待機キューに追加
                    waitingPlayers.push(currentPlayer);
                    console.log('Player added to queue.');
                    console.log(waitingPlayers);
                    ws.send(
                        JSON.stringify({
                            success: true,
                            message: 'Waiting for an opponent...',
                        })
                    );
                }
            }

            // アクション処理
            if (action === 'answerd' && currentPlayer.opponent) {
                // 正解の場合
                if (selectedAnswer === quiz.correct_answer) {
                    currentPlayer.correctCount += 1;
                    currentPlayer.opponent.ws.send(JSON.stringify({ message: 'opponent_answerd', is_correct: true, quiz: quiz }));
                } else {
                    console.log('Wrong answer');
                    currentPlayer.opponent.ws.send(JSON.stringify({
                        message: 'opponent_answerd',
                        is_correct: false,
                        opponent_selected_answer: selectedAnswer
                    }));
                }
            } else if (action === 'wrong_answer' && currentPlayer.opponent) {
                currentPlayer.opponent.ws.send(
                    JSON.stringify({ message: 'opponent_wrong_answer' })
                )

                // 次のクイズを生成して送信
            } else if (action === 'fetch_next_quiz' && currentPlayer.opponent) {
                console.log('Fetching next quiz...');
                // クイズを生成してプレイヤーに送信
                quiz = await generateQuiz("ランダム", "ランダム", currentPlayer.id, currentPlayer.opponent.id);
                ws.send(JSON.stringify({ quiz, message: 'next_quiz' }));

                // 相手プレイヤーにも送信
                if (currentPlayer.opponent.ws.readyState === WebSocket.OPEN) {
                    currentPlayer.opponent.ws.send(JSON.stringify({ quiz, message: 'next_quiz' }));
                } else {
                    throw new Error('Opponent WebSocket is not open.');
                }

            } else if (action === 'time_up' && currentPlayer.opponent) {
                currentPlayer.ws.send(
                    JSON.stringify({ message: 'time_up_refetch' })
                )
            } else if (action === 'victory' && currentPlayer.opponent) {
                console.log('Victory:', winner);

                currentPlayer.ws.send(
                    JSON.stringify({
                        winner: winner,
                        opponent: {
                            id: currentPlayer.opponent.id,
                            name: currentPlayer.opponent.name,
                            correctCount: currentPlayer.opponent.correctCount,
                        }
                    })
                )

                currentPlayer.opponent.ws.send(
                    JSON.stringify({
                        winner: winner,
                        opponent: {
                            id: currentPlayer.id,
                            name: currentPlayer.name,
                            correctCount: currentPlayer.correctCount,
                        }
                    })
                )
            }
        });

        ws.on('close', () => {
            console.log('A player has disconnected.');

        // 現在のプレイヤーが接続を切った場合
            if (currentPlayer?.opponent) {
                const opponent = currentPlayer.opponent;

                // 相手プレイヤーに「接続が切れました」という通知を送信
                opponent.ws.send(
                    JSON.stringify({
                        success: false,
                        message: 'Opponent has disconnected.',
                    })
                );

                // 相手プレイヤーの相手をクリア
                opponent.opponent = undefined;
            }

            // 待機中のプレイヤーが接続を切った場合、キューから削除
            const index = waitingPlayers.indexOf(currentPlayer as Player);
            if (index > -1) {
                waitingPlayers.splice(index, 1); // プレイヤーをキューから削除
            }
        });
    });
};
