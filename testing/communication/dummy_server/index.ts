const express = require('express');

const app = express();

let gameStarted = false;

let currentUserName = "";
let currentStateString = 'Lobby';
let currentState = 0;
let currentStateTime = ~~(+new Date() / 1000);
let currentStateEnd = currentStateTime + 5;
app.use(express.json());

let states = ['Selection', 'Voting', 'DayEnding', 'Night', 'NightEnding'];

app.post("/lobbies", (req : any, res : any) => {
    currentUserName = req.body.userId;
    res.status(200).json({
        ok: true
    })
})

app.post("/lobbies/:lobbyId/start_game", (req: any, res: any) => {
    gameStarted = true;
    res.status(200).json({
        ok: true
    })
})

app.get("/state/:id", (req: any, res: any) => {
    currentStateTime = ~~(+new Date() / 1000 );
    if ( gameStarted ) {
        if ( currentStateTime >= currentStateEnd ) {
            currentStateEnd = currentStateTime + 10;
            currentState = ( currentState + 1 ) % states.length;
            currentStateString = states[currentState];
        }
    }
    res.set(
        'Access-Control-Allow-Origin',
        '*'
    );
    res.set(
        'Access-Control-Allow-Methods',
        'GET, POST, OPTIONS, PUT, PATCH, DELETE'
    );
    res.status(200).json(
        {
            currentUser : {
                userName : currentUserName,
                roleName : "mafioso",
                actionText : "KILL",
                nrOfSelection : 1,
                isAlive : true,
                nightResults: [
                    "You died",
                    "Your role was blocked"
                ]
            },

            state: currentStateString,

            timeEndState: currentStateEnd,

            judgedCharacter: "Rares",

            users : [
                {
                    userName : "Casu",
                    isAlive : true,
                    nrVotes : 0
                },
                {
                    userName : "Rares",
                    isAlive : false,
                    nrVotes : 0
                }
            ]
        }
    );
})

app.listen(4000, () => console.log("started listening"));