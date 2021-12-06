import { inputData } from './data';

type LineEndpoints = number[][];

console.log(`Puzzle A answer: ${puzzleA()}`);
console.log(`Puzzle B answer: ${puzzleB()}`);

function puzzleA() {
    const lineEndpoints = splitInput(inputData);
    
    return processLines(lineEndpoints);
}

function puzzleB() {
    const lineEndpoints = splitInput(inputData);

    return processLines(lineEndpoints, true);
}

function splitInput(data: string): LineEndpoints[] {
    return data.split('\n')
        .map(row => row.split(' -> ')
            .map(x => x.split(',')
                .map(x => Number(x))
            )
        );
}

function processLines(lineEndpoints: LineEndpoints[], includeDiagonals = false): number {
    const mappedPoints = new Map<string, number>();
    
    lineEndpoints.forEach(endpoints => {
        const [[x1, y1], [x2, y2]] = endpoints;

        if (x1 !== x2 && y1 !== y2 && !includeDiagonals) return;
        
        const xDelta = Math.sign(x2 - x1),
            yDelta = Math.sign(y2 - y1),
            xEnd = x2 + xDelta,
            yEnd = y2 + yDelta;

        let x = x1,
            y = y1;
        do {
            const coords = `${x},${y}`,
                curVal = mappedPoints.get(coords) ?? 0;
            mappedPoints.set(coords, curVal + 1);
            x += xDelta;
            y += yDelta;
        } while (x !== xEnd || y !== yEnd);
    });

    return Array.from(mappedPoints.values()).filter(x => x > 1).length;
}
