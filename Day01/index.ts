import { inputData } from './data';

console.log(`Puzzle A answer: ${puzzleA()}`);
console.log(`Puzzle B answer: ${puzzleB()}`);

function puzzleA() {
    const data = splitInput(inputData);

    let incCnt = 0;
    for (let i = 1; i < data.length; i++) {
        if (data[i] > data[i - 1]) incCnt++;
    }

    return incCnt;
}

function puzzleB() {
    const data = splitInput(inputData);

    let incCnt = 0;
    for (let i = 3; i < data.length; i++) {
        if (data[i] > data[i - 3]) incCnt++; // data[i - 1] and data[i - 2] overlap between this window and the previous one
    }

    return incCnt;
}

function splitInput(data: string): number[] {
    return data.split('\n')
        .map(x => Number(x));
}
