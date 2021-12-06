import { inputData } from './data';

console.log(`Puzzle A answer: ${puzzleA()}`);
console.log(`Puzzle B answer: ${puzzleB()}`);

function puzzleA() {
    const data = splitInput(inputData);

    return processFish(data, 80);
}

function puzzleB() {
    const data = splitInput(inputData);

    return processFish(data, 256);
}

function splitInput(data: string): number[] {
    return data.split(',')
        .map(x => Number(x));
}

function processFish(origFishList: number[], daysToBreed: number): number {
    const newFishOnDayX = new Array(daysToBreed).fill(0);

    let totalFish = origFishList.length;
    
    // Figure out how many fish our original fish will make
    origFishList.forEach(x => {
        let day = x;
        while (day < daysToBreed) {
            newFishOnDayX[day]++;
            totalFish++;
            day += 7;
        };
    });

    // Figure out how many fish our new fish will make
    newFishOnDayX.forEach((cnt, idx) => {
        let day = idx + 9; // 9 days for the first child fish from a new fish
        while (day < daysToBreed) {
            newFishOnDayX[day] += cnt; // one new fish for each fish in our group
            totalFish += cnt;
            day += 7;
        };
    });

    return totalFish;
}
