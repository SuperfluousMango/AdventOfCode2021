import { inputData } from './data';

console.log(`Puzzle A answer: ${puzzleA()}`);
console.log(`Puzzle B answer: ${puzzleB()}`);

function puzzleA() {
    const [template, rules] = splitInput(inputData);

    let curTemplate = template,
        nextTemplate;
    for (let i = 0; i < 10; i++) {
        nextTemplate = curTemplate[0];
        for (let x = 0; x < curTemplate.length - 1; x++) {
            const pair = curTemplate.substring(x, x + 2);
            nextTemplate += rules.get(pair) + curTemplate[x + 1];
        }

        curTemplate = nextTemplate;
    }

    const elCnt = new Map<string, number>();
    for (let i = 0; i < curTemplate.length; i++) {
        elCnt.set(curTemplate[i], (elCnt.get(curTemplate[i]) ?? 0) + 1);
    }

    const elCounts = Array.from(elCnt.values()).sort((a, b) => a - b);
    return elCounts[elCounts.length - 1] - elCounts[0];
}

function puzzleB() {
    const [template, rules] = splitInput(inputData);

    let pairCnts = new Map<string, number>();
    for (let x = 0; x < template.length - 1; x++) {
        const pair = template.substring(x, x + 2);
        pairCnts.set(pair, (pairCnts.get(pair) ?? 0) + 1);
    }

    for (let i = 0; i < 40; i++) {
        const newPairCnts = new Map<string, number>();
        Array.from(pairCnts.entries()).forEach(([pair, cnt]) => {
            const newEl = rules.get(pair),
                pair1 = pair[0] + newEl,
                pair2 = newEl + pair[1]
            
            newPairCnts.set(pair1, (newPairCnts.get(pair1) ?? 0) + cnt);
            newPairCnts.set(pair2, (newPairCnts.get(pair2) ?? 0) + cnt);
        });

        pairCnts = newPairCnts;
    }

    const elCnt = new Map<string, number>();
    Array.from(pairCnts.entries()).forEach(([pair, cnt]) => {
        const el1 = pair[0],
            el2 = pair[1];
        
        elCnt.set(el1, (elCnt.get(el1) ?? 0) + cnt);
        elCnt.set(el2, (elCnt.get(el2) ?? 0) + cnt);
    });

    Array.from(elCnt.keys()).forEach(key => {
        elCnt.set(key, Math.ceil(elCnt.get(key) / 2));
    })

    const elCounts = Array.from(elCnt.values()).sort((a, b) => a - b);
    return elCounts[elCounts.length - 1] - elCounts[0];
}

function splitInput(data: string): [string, Map<string, string>] {
    const rows = data.split('\n'),
        template = rows.shift(),
        rules = new Map<string, string>();
    
    rows.shift(); // Remove empty row
    while (rows.length) {
        const row = rows.shift(),
            [pair, newElement] = row.split(' -> ');
        rules.set(pair, newElement);
    }

    return [template, rules];
}
