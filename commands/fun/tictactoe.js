const discord = require('discord.js');
const embed = require('../../util/embed.js');
const {prefix} = require("../../config.json");
module.exports = {
    name:"tictactoe",
    aliases:["ttt"],
    usage: "tictactoe",
    category:"games",
    description:"TTT Ai game",
    run: (client, message, args) =>{
        if(!args[0]){
            let embed = new discord.MessageEmbed().setAuthor("Tic Tac Toe")
            .addField(prefix+"tictactoe tutorial or "+prefix+"ttt tut","Tutorial on how to play")
            .addField(prefix+"tictactoe newgame or "+prefix+"ttt ng","Creates new game")
            .addField(prefix+"tictactoe play A1 or "+prefix+"ttt p A1","Playes")
            return message.channel.send(embed)
        }
        if(args[0].toLowerCase() == "tutorial" || args[0].toLowerCase() == "tut"){

        }
        if(args[0].toLowerCase() == "newgame" || args[0].toLowerCase() == "ng"){
            newGame(client,message,args);
            
        }
    }
}
let ai = "X";
let human = "O";

function newGame(client,message,args){
    console.log("New ttt game "+max(69,3))
    let isEnd = false;
    let board = [
        ["","",""],
        ["","",""],
        ["","",""]
    ];
    
    const filter = m => {
        return (m.content.startsWith(prefix+'play')&&m.author.id == message.author.id);
    }
    message.channel.send("Game begins! Type wdnf play <move>  Example: wdnf play A1");
    message.channel.send(printBoard(board)).then(() => {
        const collector = message.channel.createMessageCollector(filter, { time: 300000 });
        collector.on("collect",async m=>{
            let playMsg = getCommand(m)
            if(!playMsg.startsWith("A") && !playMsg.startsWith("B") && !playMsg.startsWith("C")){
                message.reply("Invalid move, example move: `A1`")
            }
            console.log("MSg"+playMsg)
            let pm1 = playMsg.charAt(0).toUpperCase();
            console.log(pm1);
            console.log(board)
            let px = 0;
            if(pm1 == "A") px = 0;
            else if(pm1 == "B") px = 1;
            else if(pm1 == "C") px = 2;
            let py = parseInt(playMsg.substr(1));
            if(py != 1 && py != 2 && py != 3) return message.reply("Invalid move, example move: `A1`");
            let playerMove = {x:px,y:py-1};
            if(board[playerMove.x][playerMove.y] == ""){
                board[px][py-1] = human;
            }
            else{
                return message.reply("This field is already occupied!")
            }
            if(winCheck(message,board)){
                return
            }
            let oldBoard = [
                ["","",""],
                ["","",""],
                ["","",""]
            ];
            for(let x = 0; x < 3 ; x++){
                for(let y = 0; y < 3 ; y++){
                    oldBoard[x][y] = board[x][y]
                }
            }
            let AiNextMove = await AiMove([...board]);
            oldBoard[AiNextMove.x][AiNextMove.y] = "X";
            board = oldBoard;
            console.log(board);
            
            if(winCheck(message,board)){
                return
            }
            message.channel.send(printBoard(board,"YOUR TURN"))
        })
        collector.on("end",()=>{
            message.channel.send("End")
        });
    });
}
function winCheck(message,board){
    let win = checkWin(board);
    if(win == "X"){
        message.channel.send(printBoard(board,"-YOU LOSE!"))
        return true
    }
    else if(win == "O"){
        message.channel.send(printBoard(board,"+YOU WIN!"))
        return true
    }
    else if(win == "tie"){
        message.channel.send(printBoard(board,"IT'S A TIE!"))
        return true
    }
    else{
        return false
    }
}
async function AiMove(eboard){
    console.log("AI move ")
    let board = [...eboard];
    return new Promise(async function(resolve, reject) {
        let ai = "X";
        let human = "O";
        let bestScore = -Infinity;
        let bestMove={x:2,y:0};
        for(let x = 0; x < 3 ; x++){
            for(let y = 0; y < 3 ; y++){
                if(board[x][y] == ""){
                    board[x][y] = "X"
                    let score = await minamex(board,0,true);
                    console.log(score);
                    if(score > bestScore){
                        console.log("found better score")
                        bestScore = score;
                        bestMove = {x,y}
                    } 
                }
            }
        }
        resolve(bestMove); 
    });
    
}
let scores = {
    X:100,
    Y:-100,
    tie:0
}
async function minamex(board, depth, isMaximizing) {
    return new Promise(async function(resolve, reject) {
    let result = checkWin(board);
    if (result !== null) {
        resolve(scores[result]);
        
    }
    console.log("depth "+depth)
    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          // Is the spot available?
          if (board[i][j] == '') {
            board[i][j] = "X"
            let score = await minamax(board, depth + 1, false);
            bestScore = max(score, bestScore);
          }
        }
      }
      console.log("returned")
      resolve(bestScore-depth);
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          // Is the spot available?
          if (board[i][j] == '') {
            board[i][j] = "O"
            let score = await minamax(board, depth + 1, true);
            bestScore = min(score, bestScore);
          }
        }
      }
      console.log("returned")
      resolve(bestScore+depth);
    }
});
}
async function minamax(board, depth, isMaximizing) {
    return new Promise(async function(resolve, reject) {
    let result = checkWin(board);
    if (result !== null) {
        resolve(scores[result]);
        
    }
    console.log("depth "+depth)
    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          // Is the spot available?
          if (board[i][j] == '') {
            board[i][j] = "X"
            let score = await minamax(board, depth + 1, false);
            bestScore = max(score, bestScore);
          }
        }
      }
      console.log("returned")
      resolve(bestScore);
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          // Is the spot available?
          if (board[i][j] == '') {
            board[i][j] = "O"
            let score = await minamax(board, depth + 1, true);
            bestScore = min(score, bestScore);
          }
        }
      }
      console.log("returned")
      resolve(bestScore);
    }
});
}
function minimax(board,depth,isMax){
    console.log(depth)
    let res = checkWin(board)
    if(res!=null){
        let score = scores[res];
        return score;
    }
    if(isMax){
        let bestScore = 0;
        let bestMove;
        for(let x = 0; x < 3 ; x++){
            for(let y = 0; y < 3 ; y++){
                if(board[x][y] == ""){
                    board[x][y] == ai;
                    let score = minimax(board,depth+1,false)
                    board[x][y] == "";
                    if(score > bestScore){
                        bestScore = score;
                    } 
                }
            }
        }
        return bestScore;
    }
    else{
        let bestScore = 0;
        for(let x = 0; x < 3 ; x++){
            for(let y = 0; y < 3 ; y++){
                if(board[x][y] == ""){
                    board[x][y] == human;
                    let score = minimax(board,depth+1,true)
                    board[x][y] == "";
                    if(score < bestScore){
                        bestScore = score;
                    } 
                }
            }
        }
        return bestScore;
    }
}
function equals3(a, b, c) {
    return a == b && b == c && a != '';
  }
  
  function checkWin(board) {
    let winner = null;
  
    // horizontal
    for (let i = 0; i < 3; i++) {
      if (equals3(board[i][0], board[i][1], board[i][2])) {
        winner = board[i][0];
      }
    }
  
    // Vertical
    for (let i = 0; i < 3; i++) {
      if (equals3(board[0][i], board[1][i], board[2][i])) {
        winner = board[0][i];
      }
    }
  
    // Diagonal
    if (equals3(board[0][0], board[1][1], board[2][2])) {
      winner = board[0][0];
    }
    if (equals3(board[2][0], board[1][1], board[0][2])) {
      winner = board[2][0];
    }
  
    let openSpots = 0;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] == '') {
          openSpots++;
        }
      }
    }
  
    if (winner == null && openSpots == 0) {
      return 'tie';
    } else {
      return winner;
    }
  }
function printBoard(board, message){
    if(message == null || message == undefined) message == "";
    let print = "```";
    for(let x = 0; x < 3 ; x++){
        if(x==0) print += "     1   2   3\n    ___________\n"
        if(x == 0) print +="A  |"
        else if(x == 1) print +="B  |"
        else if(x == 2) print +="C  |"
        for(let y = 0; y < 3 ; y++){
            if(board[x][y] == ai ||board[x][y] == human){
                print+=" "+board[x][y]+" |";
            }
            else {
                print+="   |"
            }
            
            
        }
        
        if(x == 1) print +="    "+message;
        if(x != 2) print += "\n   | --------- |\n"
    }
    print += "\n    ‾‾‾‾‾‾‾‾‾‾‾"
    return print+"```";
}
function getCommand(message){
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();
    if(args[0]){
        return args[0]
    }
    else{
        return false
    }
}

function max(number1,number2){
    if(number1 > number2) return number1
    else return number2
}
function min(number1,number2){
    if(number1 > number2) return number2
    else return number1
}