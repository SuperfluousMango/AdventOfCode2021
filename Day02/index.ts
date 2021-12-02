import { inputData } from './data';

console.log(`Puzzle A answer: ${puzzleA()}`);
console.log(`Puzzle B answer: ${puzzleB()}`);

function puzzleA() {
    const data = splitInput(inputData);
    
    let horiz = 0,
        depth = 0;
    data.forEach(([dir, amt]) => {
        switch (dir) {
            case 'forward':
                horiz += Number(amt);
                break;
            case 'down':
                depth += Number(amt);
                break;
            case 'up':
                depth -= Number(amt);
                break;
        }
    });

    return horiz * depth;
}

function puzzleB() {
    const data = splitInput(inputData);

    let aim = 0,
        horiz = 0,
        depth = 0;
    data.forEach(([dir, amt]) => {
        switch (dir) {
            case 'down':
                aim += Number(amt);
                break;
            case 'up':
                aim -= Number(amt);
                break;
            case 'forward':
                horiz += Number(amt);
                depth += Number(amt) * aim;
                break;
        }
    });

    return horiz * depth;
}

function splitInput(data: string): string[][] {
    return data.split('\n')
        .map(x => x.split(' '));
}
