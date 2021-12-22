import { inputData } from './data';

type Coords = [number[], number[], number[]];

console.log(`Puzzle A answer: ${puzzleA()}`);
console.log(`Puzzle B answer: ${puzzleB()}`);

function puzzleA() {
    const data = splitInput(inputData),
        cube = new Set<string>();
    
    data.forEach(row => {
        const [state, coords] = splitCoords(row);
        if (!checkCoordBoundaries(coords)) { return; }
        
        const [xCoords, yCoords, zCoords] = coords,
            xMin = Math.min(Math.max(xCoords[0], -50), 50),
            xMax = Math.max(Math.min(xCoords[1], 50), -50),
            yMin = Math.min(Math.max(yCoords[0], -50), 50),
            yMax = Math.max(Math.min(yCoords[1], 50), -50),
            zMin = Math.min(Math.max(zCoords[0], -50), 50),
            zMax = Math.max(Math.min(zCoords[1], 50), -50);

        for (let x = xMin; x <= xMax; x++) {
            for (let y = yMin; y <= yMax; y++) {
                for (let z = zMin; z <= zMax; z++) {
                    const key = `${x},${y},${z}`;
                    if (state === 'on') {
                        cube.add(key);
                    } else {
                        cube.delete(key);
                    }
                }
            }
        }
    });

    return cube.size;
}

function puzzleB() {
    const data = splitInput(inputData);
    let cubes = new Set<string>();

    data.forEach(row => {
        const state = row.startsWith('on') ? 'on' : 'off';
        
        if (state === 'on') {
            // We're trying to turn on cubes - make sure none of them are already turned on
            const queue = [ row ];

            while (queue.length) {
                const item = queue.shift(),
                    [_, coords] = splitCoords(item),
                    cubesToCheckForOverlap = Array.from(cubes);

                let didOverlap = false;
                for (let i = 0; i < cubesToCheckForOverlap.length; i++) {
                    const [_, testCoords] = splitCoords(cubesToCheckForOverlap[i]),
                        [overlapSize, overlapCoords] = checkForOverlap(coords, testCoords);
                    if (overlapSize === 0) {
                        // We didn't overlap with this one, so check the next
                        continue;
                    }

                    // Remove the overlap from our new geometry and stick it at the end of the queue to try again
                    // That means we need to break out of this loop and start over, because we could overlap with more than one
                    // Notice that we're removing from the new geomeetry, i.e., the `coords` variable
                    didOverlap = true;
                    const newItems = removeOverlapFromCoords(coords, overlapCoords);
                    queue.push(...newItems);
                    break;
                }

                if (!didOverlap) {
                    cubes.add(item);
                }
            }

        } else {
            // We're trying to turn off cubes - check out which ones are already on, and update those geometries
            const [_, coords] = splitCoords(row);

            cubes.forEach(testRow => {
                const [_, testCoords] = splitCoords(testRow),
                    [overlapSize, overlapCoords] = checkForOverlap(coords, testCoords);
                if (overlapSize === 0) { return; }

                // We found an overlap - remove the old geometry from the set and add the new ones
                // Notice that we're removing from the old geometry, i.e., the `testCoords` variable
                cubes.delete(testRow);
                removeOverlapFromCoords(testCoords, overlapCoords)
                    .forEach(newGeometry => cubes.add(newGeometry));
            });
        }
    });

    let activeCubeCnt = 0;
    cubes.forEach(row => {
        const [_, coords] = splitCoords(row);
        activeCubeCnt += getSizeFromCoords(coords);
    });

    return activeCubeCnt;
}

function splitInput(data: string): string[] {
    return data.split('\n');
}

function splitCoords(row: string): [string, Coords] {
    let [state, coords] = row.split(' ');
    coords = coords.replace(/[xyz]=/g, '');
    const [xCoords, yCoords, zCoords] = coords.split(',')
                                            .map(val => val.split('..')
                                                            .map(Number)
                                            );

    return [state, [xCoords, yCoords, zCoords]];
}

function checkCoordBoundaries(coords: Coords): boolean {
    const [xCoords, yCoords, zCoords] = coords;
    if (xCoords[0] < -50 && xCoords[1] < -50) { return false; }
    if (xCoords[0] > 50 && xCoords[1] > 50) { return false; }
    if (yCoords[0] < -50 && yCoords[1] < -50) { return false; }
    if (yCoords[0] > 50 && yCoords[1] > 50) { return false; }
    if (zCoords[0] < -50 && zCoords[1] < -50) { return false; }
    if (zCoords[0] > 50 && zCoords[1] > 50) { return false; }

    return true;
}

function checkForOverlap([xCoords, yCoords, zCoords]: Coords, [testXCoords, testYCoords, testZCoords]: Coords): [number, Coords] {
    const overlapXCoords: number[] = [],
        overlapYCoords: number[] = [],
        overlapZCoords: number[] = [],
        overlapCoords: [number[], number[], number[]] = [overlapXCoords, overlapYCoords, overlapZCoords];

    if (xCoords[0] < testXCoords[0] && xCoords[1] < testXCoords[0]) { return [0, overlapCoords]; }
    if (xCoords[0] > testXCoords[1] && xCoords[1] > testXCoords[1]) { return [0, overlapCoords]; }
    if (yCoords[0] < testYCoords[0] && yCoords[1] < testYCoords[0]) { return [0, overlapCoords]; }
    if (yCoords[0] > testYCoords[1] && yCoords[1] > testYCoords[1]) { return [0, overlapCoords]; }
    if (zCoords[0] < testZCoords[0] && zCoords[1] < testZCoords[0]) { return [0, overlapCoords]; }
    if (zCoords[0] > testZCoords[1] && zCoords[1] > testZCoords[1]) { return [0, overlapCoords]; }

    overlapXCoords[0] = Math.max(xCoords[0], testXCoords[0]);
    overlapXCoords[1] = Math.min(xCoords[1], testXCoords[1]);
    overlapYCoords[0] = Math.max(yCoords[0], testYCoords[0]);
    overlapYCoords[1] = Math.min(yCoords[1], testYCoords[1]);
    overlapZCoords[0] = Math.max(zCoords[0], testZCoords[0]);
    overlapZCoords[1] = Math.min(zCoords[1], testZCoords[1]);

    return [getSizeFromCoords(overlapCoords), overlapCoords];
}

function getSizeFromCoords(coords: Coords): number {
    const [xCoords, yCoords, zCoords] = coords,
        xLen = xCoords[1] - xCoords[0] + 1,
        yLen = yCoords[1] - yCoords[0] + 1,
        zLen = zCoords[1] - zCoords[0] + 1;
    
    return xLen * yLen * zLen;
}

function removeOverlapFromCoords(target: Coords, overlapper: Coords): string[] {
    const newGeometry: string[] = [],
        [txC, tyC, tzC] = target,
        [oxC, oyC, ozC] = overlapper;

    // Find top - fully extend horizontally
    if (tzC[1] > ozC[1]) {
        let zMin = ozC[1] + 1,
            zMax = tzC[1],
            xMin = txC[0],
            xMax = txC[1],
            yMin = tyC[0],
            yMax = tyC[1],
            topCoords: Coords = [ [xMin, xMax], [yMin, yMax], [zMin, zMax] ];
        newGeometry.push(buildCoordsKeyFromCoords(topCoords));
    }

    // Find left side - extend all the way to front and back, but not top and bottom
    if (txC[0] < oxC[0]) {
        let xMin = txC[0],
            xMax = oxC[0] - 1,
            yMin = tyC[0],
            yMax = tyC[1],
            zMin = ozC[0],
            zMax = ozC[1],
            leftCoords: Coords = [ [xMin, xMax], [yMin, yMax], [zMin, zMax] ];
            newGeometry.push(buildCoordsKeyFromCoords(leftCoords));
    }

    // Find right side - extend all the way to front and back, but not top and bottom
    if (txC[1] > oxC[1]) {
        let xMin = oxC[1] + 1,
            xMax = txC[1],
            yMin = tyC[0],
            yMax = tyC[1],
            zMin = ozC[0],
            zMax = ozC[1],
            rightCoords: Coords = [ [xMin, xMax], [yMin, yMax], [zMin, zMax] ];
            newGeometry.push(buildCoordsKeyFromCoords(rightCoords));
    }

    // Find front side - limit at top/bototm/left/right of overlap
    if (tyC[0] < oyC[0]) {
        let yMin = tyC[0],
            yMax = oyC[0] - 1,
            xMin = oxC[0],
            xMax = oxC[1],
            zMin = ozC[0],
            zMax = ozC[1],
            frontCoords: Coords = [ [xMin, xMax], [yMin, yMax], [zMin, zMax] ];
            newGeometry.push(buildCoordsKeyFromCoords(frontCoords));
    }

    // Find back side - limit at top/bottom/left/right of overlap
    if (tyC[1] > oyC[1]) {
        let yMin = oyC[1] + 1,
            yMax = tyC[1],
            xMin = oxC[0],
            xMax = oxC[1],
            zMin = ozC[0],
            zMax = ozC[1],
            backCoords: Coords = [ [xMin, xMax], [yMin, yMax], [zMin, zMax] ];
            newGeometry.push(buildCoordsKeyFromCoords(backCoords));
    }

    // Find bottom - fully extend horizontally
    if (tzC[0] < ozC[0]) {
        let zMin = tzC[0],
            zMax = ozC[0] - 1,
            xMin = txC[0],
            xMax = txC[1],
            yMin = tyC[0],
            yMax = tyC[1],
            bottomCoords: Coords = [ [xMin, xMax], [yMin, yMax], [zMin, zMax] ];
        newGeometry.push(buildCoordsKeyFromCoords(bottomCoords));
    }

    return newGeometry;
}

function buildCoordsKeyFromCoords(coords: Coords): string {
    const [xC, yC, zC] = coords;
    return `on x=${xC[0]}..${xC[1]},y=${yC[0]}..${yC[1]},z=${zC[0]}..${zC[1]}`;
}
