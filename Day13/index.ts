import { inputData } from './data';

console.log(`Puzzle A answer: ${puzzleA()}`);
console.log(`Puzzle B answer: ${puzzleB()}`);

function puzzleA() {
    const [coords, folds] = splitInput(inputData),
        graph: string[][] = [];

        coords.forEach(([x, y]) => {
            if (!graph[y]) { graph[y] = []; }
            graph[y][x] = '#';
        });

    // Do first fold only
    doFold(graph, folds[0]);
    return graph.flat().filter(x => !!x).length;
}

function puzzleB() {
    const [coords, folds] = splitInput(inputData),
        graph: string[][] = [];

    coords.forEach(([x, y]) => {
        if (!graph[y]) { graph[y] = []; }
        graph[y][x] = '#';
    });

    folds.forEach(fold => {
        doFold(graph, fold);
    });

    return '\n' + graph.filter(line => line.some(x => !!x))
        .map(line => {
            for (let x = 0; x < line.length; x++) {
                if (!line[x]) { line[x] = ' '; };
            }
            return line.join('').trim();
        })
        .join('\n');
}

function splitInput(data: string): [number[][], [string, number][]] {
    const lines = data.split('\n'),
        coords: number[][] = [],
        folds: [string, number][] = [];
    
    while (true) {
        const line = lines.shift();
        if (!line) break;
        coords.push(line.split(',').map(x => Number(x)));
    }

    while (lines.length) {
        const line = lines.shift().replace('fold along ', ''),
            lineData = line.split('=')
        folds.push([lineData[0], Number(lineData[1])]);
    }

    return [coords, folds];
}

function doFold(graph: string[][], fold: [string, number]): void {
    const [axis, foldPos] = fold;
    if (axis === 'x') {
        doFoldAtXPos(graph, foldPos);
    } else {
        doFoldAtYPos(graph, foldPos);
    }
}

function doFoldAtXPos(graph: string[][], foldPos: number): void {
    graph.forEach((_, y) => {
        graph[y].forEach((_, x) => {
            if (x <= foldPos) return;
            const newX = foldPos - (x - foldPos);
            graph[y][newX] = '#';
            delete graph[y][x];
        });
    });
}

function doFoldAtYPos(graph: string[][], foldPos: number): void {
    graph.forEach((_, y) => {
        if (y <= foldPos) { return; }

        const newY = foldPos - (y - foldPos);
        graph[y].forEach((_, x) => {
            if (!graph[newY]) { graph[newY] = []; }
            graph[newY][x] = '#';
            delete graph[y][x];
        });
    });
}
