import { inputData } from './data';

console.log(`Puzzle A answer: ${puzzleA()}`);
console.log(`Puzzle B answer: ${puzzleB()}`);

function puzzleA() {
    const dataArr = splitInput(inputData),
        data = buildMap(dataArr);
    
    // O(N^2)...meh
    return Array.from(data.keys()).reduce((lowestFuel, matchPos) => {
        const totalFuel = Array.from(data.keys()).reduce((acc, pos) => {
            acc += Math.abs(pos - matchPos) * data.get(pos);
            return acc;
        }, 0);
        return Math.min(totalFuel, lowestFuel);
    }, Number.MAX_SAFE_INTEGER);
}

function puzzleB() {
    const dataArr = splitInput(inputData),
        min = dataArr[0],
        max = dataArr[dataArr.length - 1],
        data = buildMap(dataArr);
    
    // Slightly worse than O(N^2)...meh-er
    let lowestFuel = Number.MAX_SAFE_INTEGER;
    for (let matchPos = min; matchPos <= max; matchPos++) {
        const totalFuel = Array.from(data.keys()).reduce((acc, pos) => {
            acc += getSeriesSum(Math.abs(pos - matchPos)) * data.get(pos);
            return acc;
        }, 0);

        lowestFuel = Math.min(totalFuel, lowestFuel);
    }

    return lowestFuel;
}

function splitInput(data: string): number[] {
    return data.split(',')
        .map(x => Number(x))
        .sort();
}

function buildMap(data: number[]) {
    const map = new Map<number, number>();
    data.forEach(pos => {
        const cnt = map.get(pos) ?? 0;
        map.set(pos, cnt + 1);
    });

    return map;
}

function getSeriesSum(n: number) {
    // Get sum of 1...N
    return n * (n + 1) / 2;
}
