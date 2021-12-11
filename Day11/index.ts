import { inputData } from './data';

console.log(`Puzzle A answer: ${puzzleA()}`);
console.log(`Puzzle B answer: ${puzzleB()}`);

function puzzleA() {
    const data = splitInput(inputData),
        maxX = data[0].length - 1,
        maxY = data.length - 1,
        FLASH_THRESHOLD = 10;

    let flashCnt = 0;
    for (let stepCnt = 0; stepCnt < 100; stepCnt++) {
        // increase energy
        for (let y = 0; y <= maxY; y++) {
            for (let x = 0; x <= maxX; x++) {
                data[y][x]++;
            }
        }

        // Check for eligible-to-flash octopi
        const neighborsToIncrease: {x: number, y: number}[] = [];
        for (let y = 0; y <= maxY; y++) {
            for (let x = 0; x <= maxX; x++) {
                if (data[y][x] >= FLASH_THRESHOLD) {
                    neighborsToIncrease.push(...getNeighbors(x, y, maxX, maxY));
                }
            }
        }
        while (neighborsToIncrease.length) {
            const {x, y} = neighborsToIncrease.shift();
            data[y][x]++;
            if (data[y][x] === FLASH_THRESHOLD) {
                neighborsToIncrease.push(...getNeighbors(x, y, maxX, maxY));
            }
        }

        // Reset flashing octopi to 0
        for (let y = 0; y <= maxY; y++) {
            for (let x = 0; x <= maxX; x++) {
                if (data[y][x] >= FLASH_THRESHOLD) {
                    data[y][x] = 0;
                    flashCnt++;
                }
            }
        }
    }

    return flashCnt;
}

function puzzleB() {
    const data = splitInput(inputData),
        maxX = data[0].length - 1,
        maxY = data.length - 1,
        FLASH_THRESHOLD = 10;

    for (let stepCnt = 0; stepCnt < 1000; stepCnt++) {
        // increase energy
        for (let y = 0; y <= maxY; y++) {
            for (let x = 0; x <= maxX; x++) {
                data[y][x]++;
            }
        }

        // Check for eligible-to-flash octopi
        const neighborsToIncrease: {x: number, y: number}[] = [];
        for (let y = 0; y <= maxY; y++) {
            for (let x = 0; x <= maxX; x++) {
                if (data[y][x] >= FLASH_THRESHOLD) {
                    neighborsToIncrease.push(...getNeighbors(x, y, maxX, maxY));
                }
            }
        }
        while (neighborsToIncrease.length) {
            const {x, y} = neighborsToIncrease.shift();
            data[y][x]++;
            if (data[y][x] === FLASH_THRESHOLD) {
                neighborsToIncrease.push(...getNeighbors(x, y, maxX, maxY));
            }
        }

        // Reset flashing octopi to 0
        for (let y = 0; y <= maxY; y++) {
            for (let x = 0; x <= maxX; x++) {
                if (data[y][x] >= FLASH_THRESHOLD) {
                    data[y][x] = 0;
                }
            }
        }

        if (data.every(row => row.every(val => val === 0))) { return stepCnt + 1; }
    }
}

function splitInput(data: string): number[][] {
    return data.split('\n')
        .map(x => x.split('')
            .map(y => Number(y))
        );
}

function getNeighbors(x: number, y: number, maxX: number, maxY: number): {x: number, y: number}[] {
    const neighbors: {x: number, y: number}[] = [];

    for (let xDelta = -1; xDelta <= 1; xDelta++) {
        for (let yDelta = -1; yDelta <= 1; yDelta++) {
            const newX = x + xDelta,
                newY = y + yDelta;
            if (newX < 0 || newX > maxX || newY < 0 || newY > maxY || (newX === x && newY ===y)) { continue; }
            neighbors.push({ x: newX, y: newY });
        }
    }

    return neighbors;
}
