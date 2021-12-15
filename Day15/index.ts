import { inputData } from './data';

console.log(`Puzzle A answer: ${puzzleA()}`);
console.log(`Puzzle B answer: ${puzzleB()}`);

function puzzleA() {
    const grid = splitInput(inputData),
        distances = new Map<string, number>(),
        maxY = grid.length - 1,
        maxX = grid[0].length - 1;

    distances.set('0,0', 0);
    let hasChanges = false;
    // This took 17 iterations
    do {
        hasChanges = false;
        for (let y = 0; y <= maxY; y++) {
            for (let x = 0; x <= maxX; x++) {
                if (x === 0 && y === 0) { continue; }
                const neigbors = getNeighbors(x, y, maxY, maxY)
                                    .filter(([nx, ny]) => distances.has(`${nx},${ny}`)),
                    minNeighbor = Math.min(...neigbors.map(([nx, ny]) => distances.get(`${nx},${ny}`))),
                    dist = minNeighbor + grid[y][x];
                if (distances.has(`${x},${y}`) && distances.get(`${x},${y}`) <= dist) { continue; }
                hasChanges = true;
                distances.set(`${x},${y}`, dist);
            }
        }
    } while (hasChanges);

    return distances.get(`${maxX},${maxY}`);
}

function puzzleB() {
    const data = splitInput(inputData),
        grid = repeatMap(data),
        distances = new Map<string, number>(),
        maxY = grid.length - 1,
        maxX = grid[0].length - 1;

    distances.set('0,0', 0);
    let hasChanges = false;
    // This took 53 iterations on a grid 25x larger, or roughly 75x the duration. Definitely doesn't scale linearly.
    do {
        hasChanges = false;
        for (let y = 0; y <= maxY; y++) {
            for (let x = 0; x <= maxX; x++) {
                if (x === 0 && y === 0) { continue; }
                const neigbors = getNeighbors(x, y, maxY, maxY)
                                    .filter(([nx, ny]) => distances.has(`${nx},${ny}`)),
                    minNeighbor = Math.min(...neigbors.map(([nx, ny]) => distances.get(`${nx},${ny}`))),
                    dist = minNeighbor + grid[y][x];
                if (distances.has(`${x},${y}`) && distances.get(`${x},${y}`) <= dist) { continue; }
                hasChanges = true;
                distances.set(`${x},${y}`, dist);
            }
        }
    } while (hasChanges);

    return distances.get(`${maxX},${maxY}`);
}

function splitInput(data: string): number[][] {
    return data.split('\n')
        .map(x => x.split('')
            .map(y => Number(y))
        );
}

function getNeighbors(x: number, y: number, maxX: number, maxY: number): [number, number][] {
    const neighbors: [number, number][] = [];
    
    if (x > 0) { neighbors.push([x - 1, y]); }
    if (x < maxX) { neighbors.push([x + 1, y]); }
    if (y > 0) { neighbors.push([x, y - 1]); }
    if (y < maxY) { neighbors.push([x, y + 1]); }

    return neighbors;
}

function repeatMap(grid: number[][]): number[][] {
    const ySize = grid.length,
        xSize = grid[0].length,
        newGrid: number[][] = Array(ySize * 5);
    for (let y = 0; y < newGrid.length; y++) {
        newGrid[y] = Array(xSize * 5);
    }
    
    for (let y = 0; y < newGrid.length; y++) {
        for (let x = 0; x < newGrid[y].length; x++) {
            const yOffset = Math.floor(y / ySize),
                xOffset = Math.floor(x / xSize),
                adj = yOffset + xOffset,
                origY = y % ySize,
                origX = x % xSize,
                origVal = grid[origY][origX],
                newVal = origVal + adj;
            newGrid[y][x] = newVal <= 9 ? newVal : newVal - 9;
        }
    }

    return newGrid;
}
