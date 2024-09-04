import { WebSocketServer, WebSocket } from 'ws';

interface Player {
    id: string;
    name: string;
    ws: WebSocket;
    opponent?: Player; // マッチング相手を保持
}

// 待機中のプレイヤーを格納するキュー
const waitingPlayers: Player[] = [];

export const setupWebSocketServer = (server: any) => {
    const wss = new WebSocketServer({ server });

    wss.on('connection', (ws: WebSocket) => {
        let currentPlayer: Player | null = null;

        ws.on('message', (message: string) => {
            const data = JSON.parse(message);
            const { id, name } = data;
            currentPlayer = { id, name, ws };
            console.log(waitingPlayers);            
            // 待機プレイヤーがいる場合はマッチング
            if (waitingPlayers.length > 0) {
                const matchedPlayer = waitingPlayers.shift() as Player; // 先頭のプレイヤーを取得

                // 両方のプレイヤーをお互いに参照させる
                matchedPlayer.opponent = currentPlayer;
                currentPlayer.opponent = matchedPlayer;

                // 両方のプレイヤーにマッチ成功を通知
                matchedPlayer.ws.send(
                    JSON.stringify({
                        success: true,
                        message: 'Match found!',
                        opponent: { id: currentPlayer.id, name: currentPlayer.name },
                    })
                );                
                currentPlayer.ws.send(
                    JSON.stringify({
                        success: true,
                        message: 'Match found!',
                        opponent: { id: matchedPlayer.id, name: matchedPlayer.name },
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
