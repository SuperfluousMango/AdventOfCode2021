import { inputData } from './data';

console.log(`Puzzle A answer: ${puzzleA()}`);
console.log(`Puzzle B answer: ${puzzleB()}`);

function puzzleA() {
    const data = splitInput(inputData);

    let [gammaRate, epsilonRate] = getRates(data);

    return parseInt(gammaRate.join(''), 2) * parseInt(epsilonRate.join(''), 2);
}

function puzzleB() {
    const data = splitInput(inputData);

    let oxyData = [...data],
        [mostCommonBits, leastCommonBits] = getRates(data),
        curBit = 0;
    while (oxyData.length > 1) {
        oxyData = oxyData.filter(x => x[curBit] === mostCommonBits[curBit]);
        [mostCommonBits, leastCommonBits] = getRates(oxyData);
        curBit++;
    }

    let co2Data = [...data];
    [mostCommonBits, leastCommonBits] = getRates(data),
    curBit = 0;
    while (co2Data.length > 1) {
        co2Data = co2Data.filter(x => x[curBit] === leastCommonBits[curBit]);
        [mostCommonBits, leastCommonBits] = getRates(co2Data);
        curBit++;
    }

    const oxyGenRating = oxyData[0].join(''),
        co2GenRating = co2Data[0].join('');

    return parseInt(oxyGenRating, 2) * parseInt(co2GenRating, 2);
}

function splitInput(data: string): string[][] {
    return data.split('\n')
        .map(x => x.split(''));
}

function getRates(data: string[][]): [string[], string[]] {
    const onesCount = new Array(data[0].length).fill(0),
        middle = data.length / 2;
    
    data.forEach(entry => {
        entry.forEach((val, idx) => {
            if (val === '1') onesCount[idx]++;
        });
    });

    let gammaRate = [],
        epsilonRate = [];
    onesCount.forEach(x => {
        if (x >= middle) {
            gammaRate.push('1');
            epsilonRate.push('0');
        } else {
            gammaRate.push('0');
            epsilonRate.push('1');
        }
    });

    return [gammaRate, epsilonRate];
}
