import { inputData } from './data';
import { SnailfishPair } from './snailfish-pair';

console.log(`Puzzle A answer: ${puzzleA()}`);
console.log(`Puzzle B answer: ${puzzleB()}`);

function puzzleA() {
    const data = splitInput(inputData);

    let str = data.shift();
    while (data.length) {
        str = '[' + str + ',' + data.shift() + ']';

        let didChange: boolean;
        do {
            const res = processStr(str);
            [str, didChange] = res;
            // console.log(str);
        } while (didChange);
    }

    const pair = new SnailfishPair(str);
    return pair.getMagnitude();
}

function puzzleB() {
    const data = splitInput(inputData);

    let maxMagnitude = Number.MIN_SAFE_INTEGER;
    for (let x = 0; x < data.length; x++) {
        for (let y = 0; y < data.length; y++) {
            if (x === y) { continue; }
            maxMagnitude = Math.max(maxMagnitude, addSnailfishNumbers(data[x], data[y]));
        }
    }

    return maxMagnitude;
}

function splitInput(data: string): string[] {
    return data.split('\n');
}

function processStr(str: string): [string, boolean] {
    let result: boolean;
    
    [str, result] = processExplodes(str);

    if (!result) {
        [str, result] = processSplits(str);
    }

    return [str, result];
}

function processExplodes(str: string): [string, boolean] {
    let pos = 0,
        pairStarts: number[] = [];

    while (pos < str.length) {
        switch (str[pos]) {
            case '[':
                pairStarts.push(pos);
                if (pairStarts.length > 4) {
                    return [explodePairAtPos(pos, str), true];
                }
                break;
            case ']':
                pairStarts.pop();
                break;
        }

        pos++;
    }

    return [str, false];
}

function processSplits(str: string): [string, boolean] {
    let pos = 0;

    while (pos < str.length) {
        switch (str[pos]) {
            case '[':
            case ']':
            case ',':
                break;
            default:
                // is numeric
                let p = pos;
                do {
                    p++;
                } while (!isNaN(Number(str[p])));
                const numVal = Number(str.substring(pos, p));
                if (numVal >= 10) {
                    return [splitNumberAtPos(pos, p - pos,str), true];
                }
                pos = p - 1;
        }

        pos++;
    }

    return [str, false];
}

function explodePairAtPos(pos: number, str: string): string {
    const endPos = str.indexOf(']', pos),
        pairStr = str.substring(pos + 1, endPos),
        [leftVal, rightVal] = pairStr.split(',').map(x => Number(x));
    
    // Replace pair with 0
    str = str.substring(0, pos) + '0' + str.substring(endPos + 1);

    // Find number to right of pair
    let p = pos,
        numStr = '',
        numStart;
    do {
        p++;
        if (!isNaN(Number(str[p]))) {
            numStr += str[p];
            numStart = numStart ?? p;
        }
    } while (p < str.length - 1 && (!numStr || !isNaN(Number(str[p]))));
    if (numStr) {
        const newNumVal = Number(numStr) + rightVal;
        str = str.substring(0, numStart) + newNumVal.toString() + str.substring(p);
    }

    // Find number to left of pair
    p = pos;
    numStr = '';
    let numEnd;
    do {
        p--;
        if (!isNaN(Number(str[p]))) {
            numStr = str[p] + numStr;
            numEnd = numEnd ?? p;
        }
    } while (p > 0 && (!numStr || !isNaN(Number(str[p]))));
    if (numStr) {
        const newNumVal = Number(numStr) + leftVal;
        str = str.substring(0, p + 1) + newNumVal.toString() + str.substring(numEnd + 1);
    }

    return str;
}

function splitNumberAtPos(pos: number, len: number, str: string): string {
    const num = Number(str.substring(pos, pos + len)),
        newLeft = Math.floor(num / 2),
        newRight = Math.ceil(num / 2),
        newStr = `[${newLeft},${newRight}]`;
    
    return str.substring(0, pos) + newStr + str.substring(pos + len);
}

function addSnailfishNumbers(str1: string, str2: string): number {
    let str = `[${str1},${str2}]`,
        didChange: boolean;
    do {
        [str, didChange] = processStr(str);
    } while (didChange);

    const pair = new SnailfishPair(str);
    return pair.getMagnitude();
}
