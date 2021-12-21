import { inputData } from './data';

// Figure out how common each total is
const rollProbabilities = new Map<number, number>();
for (let i = 1; i <= 3; i++) {
    for (let j = 1; j <= 3; j++) {
        for (let k = 1; k <= 3; k++) {
            const sum = i + j + k,
                curTotal = rollProbabilities.get(sum) ?? 0;
            rollProbabilities.set(sum, curTotal + 1);
        }
    }
}

console.log(`Puzzle A answer: ${puzzleA()}`);
console.log(`Puzzle B answer: ${puzzleB()}`);

function puzzleA() {
    const playerPos = splitInput(inputData),
        scores = [0, 0];
    let player = 1,
        diceRolls = 0,
        firstDie = 1;

    do {
        player = 1 - player;

        let diceTotal: number;
        switch (firstDie) {
            case 100:
                diceTotal = 100 + 1 + 2;
                firstDie = 3;
                break;
            case 99:
                diceTotal = 99 + 100 + 1;
                firstDie = 2;
                break;
            case 98:
                diceTotal = 98 + 99 + 100;
                firstDie = 1;
                break;
            default:
                diceTotal = (firstDie + 1) * 3;
                firstDie += 3;
        }
        diceRolls += 3;
        playerPos[player] = (playerPos[player] + diceTotal) % 10;
        if (playerPos[player] === 0) { playerPos[player] = 10; }
        scores[player] += playerPos[player];
    } while (scores.every(x => x < 1000));

    return scores.filter(x => x < 1000)[0] * diceRolls;
}

function puzzleB() {
    const playerPos = splitInput(inputData),
        initialKey = `${playerPos[0]},0,${playerPos[1]},0`;
    
    let gameData = new Map<string, number>([[initialKey, 1]]),
        totalGames = 0,
        wins = [0, 0],
        player = 1;
    do {
        let unwonGames, newWins;
        player = 1 - player;
        [gameData, unwonGames, newWins] = takeDiracTurn(player, gameData);
        wins[player] += newWins;
        totalGames = unwonGames + wins[0] + wins[1];

        if (player < 0) { logNum(totalGames, wins[0] + wins[1], wins[0], wins[1], gameData.size, Array.from(gameData.values()).reduce((acc, val) => val + acc, 0)); }
    } while (totalGames > wins[0] + wins[1]);

    return Math.max(...wins);
}

function splitInput(data: string): number[] {
    return data.split('\n')
        .map(x => x.slice(-1))
        .map(x => Number(x));
}

function takeDiracTurn(player: number, gameData: Map<string, number>): [Map<string, number>, number, number] {
    const newGameData = new Map<string, number>();
    let newWins = 0;

    gameData.forEach((games, key) => {
        const vals = key.split(',').map(x => Number(x)),
            curPos = player === 0 ? vals[0] : vals[2],
            curScore = player === 0 ? vals[1] : vals[3];

        rollProbabilities.forEach((numRolls, diceTotal) => {
            let pos = curPos + diceTotal;
            if (pos > 10) { pos -= 10; }
            const score = curScore + pos;
            if (score >= 21) {
                newWins += (games * numRolls);
            } else {
                const newKey = player === 0
                        ? `${pos},${score},${vals[2]},${vals[3]}`
                        : `${vals[0]},${vals[1]},${pos},${score}`,
                    existingStateMatches = newGameData.get(newKey) ?? 0,
                    totalGamesForKey = existingStateMatches + (games * numRolls);
                newGameData.set(newKey, totalGamesForKey);
            }
        });
    });

    const totalUnwonGames = Array.from(newGameData.values()).reduce((acc, val) => acc + val, 0)

    return [newGameData, totalUnwonGames, newWins];
}



function play_dirac(p1, p2) {
    let all_games = {};
    all_games[p1 + "," + 0 + "," + p2 + "," + 0] = 1;
  
    let current_games = 1;
  
    let p1_wins = 0;
    let p2_wins = 0;
  
    let step = () => {
      // p1 turn
      let p1_state = {};
      for (let state in all_games) {
        let games = all_games[state];
  
        current_games -= games;
    
        let [pos, val, enemy_pos, enemy_val] = state.split(",").map(Number);
    
        for (let roll_1 of [1,2,3])
        for (let roll_2 of [1,2,3])
        for (let roll_3 of [1,2,3]) {
          let sum = roll_1 + roll_2 + roll_3;
          let new_pos = pos + sum;
          while (new_pos > 10) new_pos -= 10;
    
          let new_val = val + new_pos;
          if (new_val >= 21) {
            p1_wins += games;
          } else {
            p1_state[new_pos + "," + new_val + "," + enemy_pos + "," + enemy_val] = (p1_state[new_pos + "," + new_val + "," + enemy_pos + "," + enemy_val] || 0) + games;
  
            current_games += games;
          }
        }
      }
      all_games = p1_state;
      logNum(current_games + p1_wins + p2_wins, p1_wins + p2_wins, p1_wins, p2_wins, Object.keys(all_games).length, current_games);
      
      // p2 turn
      let p2_state = {};
      for (let state in all_games) {
        let games = all_games[state];
  
        current_games -= games;
    
        let [enemy_pos, enemy_val, pos, val] = state.split(",").map(Number);
    
        for (let roll_1 of [1,2,3])
        for (let roll_2 of [1,2,3])
        for (let roll_3 of [1,2,3]) {
          let sum = roll_1 + roll_2 + roll_3;
          let new_pos = pos + sum;
          while (new_pos > 10) new_pos -= 10;
          let new_val = val + new_pos;
  
          if (new_val >= 21) {
            p2_wins += games;
          } else {
            p2_state[enemy_pos + "," + enemy_val + "," + new_pos + "," + new_val ] = (p2_state[enemy_pos + "," + enemy_val + "," + new_pos + "," + new_val ] || 0) + games;
            current_games += games;
          }
        }
      }
      all_games = p2_state;
      logNum(current_games + p1_wins + p2_wins, p1_wins + p2_wins, p1_wins, p2_wins, Object.keys(all_games).length, current_games);
    }
   
    while (current_games > 0) {
      step();
    }
  
    logNum(p1_wins + p2_wins);
    console.log("p1 wins", p1_wins);
    console.log("p2 wins", p2_wins);
  }
  
  //play_game(4,8);
  //play_dirac(4,8);
  //play_game(7,3);
  //play_dirac(7,3);

function logNum(...nums: number[]) {
    let str = '';
    nums.forEach(x => str += x.toLocaleString(undefined, { maximumFractionDigits: 0 }).padStart(20, ' '));
    console.log(str);
}
