import { inputData } from './data';

type Connections = Map<string, string[]>;
type QueueEntry = string[];

console.log(`Puzzle A answer: ${puzzleA()}`);
console.log(`Puzzle B answer: ${puzzleB()}`);

function puzzleA() {
    const connections = splitInput(inputData),
        queue: QueueEntry[] = [ ['start'] ];

    let pathCnt = 0;
    
    while (queue.length) {
        const curEntry = queue.shift(),
            curNode = curEntry[curEntry.length - 1],
            nextCaves = connections.get(curNode)
                .filter(node => isBigCave(node) || !curEntry.includes(node));
        nextCaves.forEach(node => {
            if (node === 'end') {
                pathCnt++;
            } else {
                queue.push([...curEntry, node]);
            }
        });
    }

    return pathCnt;
}

function puzzleB() {
    const connections = splitInput(inputData),
        queue: QueueEntry[] = [ ['start'] ],
        DID_DOUBLE_VISIT = 'xyz123';

    let pathCnt = 0;
    
    while (queue.length) {
        const curEntry = queue.shift(),
            curNode = curEntry[curEntry.length - 1],
            nextCaves = connections.get(curNode)
                .filter(node => isBigCave(node) || !curEntry.includes(node) || !curEntry.includes(DID_DOUBLE_VISIT));
        nextCaves.forEach(node => {
            if (node === 'end') {
                pathCnt++;
            } else if (node === 'start') {
                return;
            } else if (!isBigCave(node) && curEntry.includes(node)) {
                queue.push([...curEntry, DID_DOUBLE_VISIT, node]);
            } else {
                queue.push([...curEntry, node]);
            }
        });
    }

    return pathCnt;
}

function splitInput(data: string): Connections {
    const connections = new Map<string, string[]>();
    data.split('\n')
        .forEach(line => {
            const [node1, node2] = line.split('-');
            if (!connections.has(node1)) { connections.set(node1, []); }
            if (!connections.has(node2)) { connections.set(node2, []); }
            connections.get(node1).push(node2);
            connections.get(node2).push(node1);
            connections.get(node1).sort();
            connections.get(node2).sort();
        });
    return connections;
}

function isBigCave(node: string): boolean {
    return node === node.toUpperCase();
}
