import { inputData } from './data';

console.log(`Puzzle A answer: ${puzzleA()}`);
console.log(`Puzzle B answer: ${puzzleB()}`);

function puzzleA() {
    const data = splitInput(inputData);

    let riskLevelSum = 0;
    for (let y = 0; y < data.length; y++) {
        for (let x = 0; x < data[y].length; x++) {
            const val = data[y][x];
            if (y > 0 && data[y - 1][x] <= val) continue;
            if (y < data.length - 1 && data[y + 1][x] <= val) continue;
            if (x > 0 && data[y][x - 1] <= val) continue;
            if (x < data[y].length - 1 && data[y][x + 1] <= val) continue;

            riskLevelSum += val + 1;
        }
    }
    
    return riskLevelSum;
}

function puzzleB() {
    const data = splitInput(inputData),
        basins: number[] = [];
    
    for (let y = 0; y < data.length; y++) {
        for (let x = 0; x < data[y].length; x++) {
            const val = data[y][x];
            if (val === 9 || val === null) continue;
            if (y > 0 && data[y - 1][x] <= val) continue;
            if (y < data.length - 1 && data[y + 1][x] <= val) continue;
            if (x > 0 && data[y][x - 1] <= val) continue;
            if (x < data[y].length - 1 && data[y][x + 1] <= val) continue;

            basins.push(getBasinSize(data, x, y));
        }
    }

    return basins.sort((a, b) => a - b)
        .reverse()
        .slice(0, 3)
        .reduce((acc, val) => val * acc, 1);
}

function splitInput(data: string): number[][] {
    return data.split('\n')
        .map(x => x.split('')
            .map(y => Number(y))
        );
}

function getBasinSize(data: number[][], x: number, y: number): number {
    const queue = [{x , y}];
    let size = 0;

    while (queue.length) {
        const {x, y} = queue.shift(),
            val = data[y][x];
        if (val === 9 || val === null) continue;
        size++;
        data[y][x] = null;
        const neighbors = getNeighbors(x, y, data[0].length - 1, data.length - 1).filter(({x, y}) => data[y][x] !== 9 && data[y][x] !== null);
        queue.push(...neighbors);
    }

    return size;
}

function getNeighbors(x: number, y: number, maxX: number, maxY: number): {x: number, y: number}[] {
    const neighbors: {x: number, y: number}[] = [];
    if (x > 0) neighbors.push({x: x - 1, y});
    if (x < maxX) neighbors.push({x: x + 1, y});
    if (y > 0) neighbors.push({x, y: y - 1});
    if (y < maxY) neighbors.push({x, y: y + 1});
    
    return neighbors;
}
