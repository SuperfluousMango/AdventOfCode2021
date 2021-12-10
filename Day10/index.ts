import { inputData } from './data';

console.log(`Puzzle A answer: ${puzzleA()}`);
console.log(`Puzzle B answer: ${puzzleB()}`);

function puzzleA() {
    const data = splitInput(inputData),
        matches = new Map<string, string>([['(', ')'], ['[', ']'], ['{', '}'], ['<', '>']]),
        points = new Map<string, number>([[')', 3], [']', 57], ['}', 1197], ['>', 25137]]);
    let score = 0;

    data.forEach(line => {
        const pairs: string[] = [];
        let pos = 0,
            isCorrupted = false;

        while (pos < line.length && !isCorrupted) {
            const char = line[pos];
            switch (char) {
                case '(':
                case '[':
                case '{':
                case '<':
                    pairs.push(char);
                    break;
                default:
                    const lastStart = pairs.pop();
                    if (matches.get(lastStart) !== char) {
                        score += points.get(char);
                        isCorrupted = true;
                    }
            }
            pos++;
        }
    });

    return score;
}

function puzzleB() {
    const data = splitInput(inputData),
        matches = new Map<string, string>([['(', ')'], ['[', ']'], ['{', '}'], ['<', '>']]),
        points = new Map<string, number>([['(', 1], ['[', 2], ['{', 3], ['<', 4]]),
        scores: number[] = [];

    data.forEach(line => {
        const pairs: string[] = [];
        let pos = 0,
            isCorrupted = false;

        while (pos < line.length && !isCorrupted) {
            const char = line[pos];
            switch (char) {
                case '(':
                case '[':
                case '{':
                case '<':
                    pairs.push(char);
                    break;
                default:
                    const lastStart = pairs.pop();
                    if (matches.get(lastStart) !== char) {
                        isCorrupted = true;
                    }
            }
            pos++;
        }

        if (!isCorrupted) {
            let lineScore = 0;
            pairs.reverse().forEach(char => lineScore = lineScore * 5 + points.get(char));
            scores.push(lineScore);
        }
    });

    return scores.sort((a, b) => a - b).slice((scores.length - 1) / 2)[0];
}

function splitInput(data: string): string[] {
    return data.split('\n');
}
