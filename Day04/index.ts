import { inputData } from './data';

type DrawList = number[];
type BingoCard = number[][];

console.log(`Puzzle A answer: ${puzzleA()}`);
console.log(`Puzzle B answer: ${puzzleB()}`);

function puzzleA() {
    const [drawList, cards] = splitInput(inputData);
    let curNum: number,
        winningCard: BingoCard;

    while (drawList.length && !winningCard) {
        curNum = drawList.shift();
        for (let x = 0; x < cards.length; x++) {
            markNumber(cards[x], curNum);
            if (cardIsWinner(cards[x])) {
                winningCard = cards[x];
                break;
            }
        }
    }

    const cardSum = winningCard.flat().reduce((acc, x) => acc + (x ?? 0), 0);
    return cardSum * curNum;
}

function puzzleB() {
    const [drawList, cards] = splitInput(inputData);
    let curNum: number,
        winningCards = new Set<number>(),
        lastCard: BingoCard;

    do {
        curNum = drawList.shift();
        for (let x = 0; x < cards.length; x++) {
            if (winningCards.has(x)) continue;

            markNumber(cards[x], curNum);
            if (cardIsWinner(cards[x])) {
                winningCards.add(x);
                if (winningCards.size === cards.length) {
                    lastCard = cards[x];
                    break;
                }
            }
        }
    } while (!lastCard);

    const cardSum = lastCard.flat().reduce((acc, x) => acc + (x ?? 0), 0);
    return cardSum * curNum;
}

function splitInput(data: string): [DrawList, BingoCard[]] {
    const rows = data.split('\n');

    const drawList: DrawList = rows.shift().split(',').map(x => Number(x));

    const bingoCards: BingoCard[] = [];
    while (rows.length) {
        const card: BingoCard = [];

        rows.shift(); // empty line
        for (let x = 0; x < 5; x++) {
            const lineStr = rows.shift(),
                line = [];
            let pos = 0;
            while (pos < lineStr.length) {
                line.push(Number(lineStr.slice(pos, pos + 3).trim()));
                pos += 3;
            }
            card.push(line);
        }
        bingoCards.push(card);
    }

    return [drawList, bingoCards];
}

function markNumber(card: BingoCard, num: number) {
    card.forEach(row => row.forEach((cell, idx) => {
        if (cell === num) row[idx] = null;
    }));
}

function cardIsWinner(card: BingoCard): boolean {
    // rows
    if (card.some(x => x.every(y => !y))) return true;

    // columns
    for (let x = 0; x < 5; x++) {
        if (card.every(y => !y[x])) return true;
    }

    return false;
}
