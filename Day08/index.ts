import { inputData } from './data';

console.log(`Puzzle A answer: ${puzzleA()}`);
console.log(`Puzzle B answer: ${puzzleB()}`);

function puzzleA() {
    const data = splitInput(inputData)
        .map(x => x[1]); // Take only the output data
    
    return data.reduce((acc, output) => output.filter(x => [2, 4, 3, 7].includes(x.length)).length + acc, 0);
}

function puzzleB() {
    const data = splitInput(inputData);

    return data.reduce((acc, row) => acc + decodeRow(row), 0);
}

function splitInput(data: string): string[][][] {
    return data.split('\n')
        .map(x => x.split(' | ')
            .map(y => y.split(' ')
                .map(z => z.split('').sort().join(''))
            )
        )
}

function decodeRow(row: string[][]): number {
    const [input, output] = row;
    const one = input.filter(x => x.length === 2)[0],
        four = input.filter(x => x.length === 4)[0],
        seven = input.filter(x => x.length === 3)[0],
        eight = input.filter(x => x.length === 7)[0],
        twoOrThreeOrFive = input.filter(x => x.length === 5),
        zeroOrSixOrNine = input.filter(x => x.length === 6);

    const threeIndex = twoOrThreeOrFive.findIndex(x => x.split('').filter(y => seven.split('').includes(y)).length === 3),
        three = twoOrThreeOrFive.splice(threeIndex, 1)[0]; // Removes three from twoOrThreeOrFive as a side effect
        
    const fiveIndex = twoOrThreeOrFive.findIndex(x => x.split('').filter(y => four.split('').includes(y)).length === 3),
        five = twoOrThreeOrFive.splice(fiveIndex, 1)[0], // Removes five from twoOrThreeOrFive as a side effect
        two = twoOrThreeOrFive[0];
    
    const nineIndex = zeroOrSixOrNine.findIndex(x => x.split('').filter(y => four.split('').includes(y)).length === 4),
        nine = zeroOrSixOrNine.splice(nineIndex, 1)[0]; // Removes nine from zeroOrSixOrNine as a side effect
    
    const zeroIndex = zeroOrSixOrNine.findIndex(x => x.split('').filter(y => seven.split('').includes(y)).length === 3),
        zero = zeroOrSixOrNine.splice(zeroIndex, 1)[0], // Removes zero from zeroOrSixOrNine as a side effect
        six = zeroOrSixOrNine[0];
    
    const digits = [zero, one, two, three, four, five, six, seven, eight, nine];
    let mult = 1000;
    return output.reduce((acc, val) => {
        const result = acc + digits.findIndex(x => x === val) * mult;
        mult /= 10;
        return result;
    }, 0);
}
