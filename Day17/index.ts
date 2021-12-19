import { inputData } from './data';

console.log(`Puzzle A answer: ${puzzleA()}`);
console.log(`Puzzle B answer: ${puzzleB()}`);

function puzzleA() {
    const [_minX, _maxX, minY, _maxY] = splitInput(inputData);

    return sumOfNumbers(-minY - 1);
}

function puzzleB() {
    const [minX, maxX, minY, maxY] = splitInput(inputData);
    let goodVelocities = new Set<string>();
    
    for (let x = minX; x <= maxX; x++) {
        for (let y = minY; y <= maxY; y++) {
            goodVelocities.add(`${x},${y}`);
        }
    }

    // Find minimum value that lands in the target
    let minN = 0,
        maxN = Math.ceil(maxX / 2);
    do {
        minN++
    } while (sumOfNumbers(minN) < minX);

    for (let n = minN; n <= maxN; n++) {
        let curSteps = 0,
            distance = 0,
            stepSize = n,
            minSteps,
            maxSteps;
        
        while (distance < maxX) {
            distance += stepSize;
            curSteps++;
            if (distance >= minX) { minSteps = minSteps ?? curSteps; }
            if (distance >= minX && distance <= maxX) { maxSteps = curSteps; }
            stepSize--;

            if (stepSize === 0) {
                // We're never going to go past maxX because we've stalled out
                maxSteps = -(minY * 2);
                break;
            }
        }

        for (let s = minSteps; s <= maxSteps; s++) {
            for (let y = minY; y <= maxY; y++) {
                if (!isValidCombo(y, s)) { continue; }

                const avgVel = y / s;
                let initVel: number;
                if (isEven(s)) {
                    initVel = Math.floor(avgVel) + (s / 2);
                } else {
                    initVel = avgVel + Math.floor(s / 2);
                }
                goodVelocities.add(`${n},${initVel}`);
            }
        }
    }
    

    return goodVelocities.size;
}

function splitInput(data: string): number[] {
    return data.split(', ')
        .map(val => val.substring(2)
                        .split('..')
                        .map(x => Number(x))
        )
        .flat();
}

function sumOfNumbers(num: number) {
    return num * (num + 1) / 2;
}

function isValidCombo(yVal: number, steps: number): boolean {
    if (isEven(steps)) {
        return (yVal / steps) - Math.floor(yVal / steps) === .5;
    } else {
        return (yVal / steps) === Math.floor(yVal / steps);
    }
}

function isEven(num: number) {
    return num / 2 === Math.floor(num / 2);
}
