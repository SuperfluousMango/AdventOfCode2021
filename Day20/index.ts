import { inputData } from './data';

console.log(`Puzzle A answer: ${puzzleA()}`);
console.log(`Puzzle B answer: ${puzzleB()}`);

function puzzleA() {
    let [algo, image] = splitInput(inputData, 0),
        min = 0,
        max = Math.sqrt(image.size),
        chars = algo[0] === '.' ? ['.', '.'] : ['.', '#'], // Will the infinite dark pixels on the outside stay dark or toggle?
        defaultCharIndex = 0;

    for (let i = 0; i < 2; i++) {
        image = enhanceImage(image, min, max, algo, chars[defaultCharIndex]);
        min--;
        max++;
        defaultCharIndex = 1 - defaultCharIndex;
    }

    return Array.from(image.values()).filter(x => x === '#').length;
}

function puzzleB() {
    let [algo, image] = splitInput(inputData, 0),
        min = 0,
        max = Math.sqrt(image.size),
        chars = algo[0] === '.' ? ['.', '.'] : ['.', '#'], // Will the infinite dark pixels on the outside stay dark or toggle?
        defaultCharIndex = 0;

    for (let i = 0; i < 50; i++) {
        image = enhanceImage(image, min, max, algo, chars[defaultCharIndex]);
        min--;
        max++;
        defaultCharIndex = 1 - defaultCharIndex;
    }

    return Array.from(image.values()).filter(x => x === '#').length;
}

function splitInput(data: string, margin: number): [string, Map<string, string>] {
    const stuff = data.split('\n'),
        algo = stuff.shift(),
        image = new Map<string, string>();
    
    stuff.shift(); // skip empty line

    for (let y = 0; y < stuff.length; y++) {
        for (let x = 0; x < stuff[y].length; x++) {
            image.set(`${x},${y}`, stuff[y][x]);
        }
    }

    return [algo, image];
}

function enhanceImage(image: Map<string, string>, min: number, max: number, algo: string, defaultChar: string): Map<string, string> {
    const newImage = new Map<string, string>();

    for (let y = min - 1; y <= max + 1; y++) {
        for (let x = min - 1; x <= max + 1; x++) {
            let bitsStr = '';
            for (let yDelta = -1; yDelta <= 1; yDelta++) {
                for (let xDelta = -1; xDelta <= 1; xDelta++) {
                    const nx = x + xDelta,
                        ny = y + yDelta;
                    bitsStr += image.get(`${nx},${ny}`) ?? defaultChar;
                }
            }
            bitsStr = bitsStr.replace(/#/g, '1')
                    .replace(/\./g, '0');
            const num = parseInt(bitsStr, 2),
                pixelVal = algo[num];
            newImage.set(`${x},${y}`, pixelVal);
        }
    }
    
    return newImage;
}
