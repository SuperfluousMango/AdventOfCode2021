import { inputData } from './data';

console.log(`Puzzle A answer: ${puzzleA()}`);
console.log(`Puzzle B answer: ${puzzleB()}`);

function puzzleA() {
    let data = splitInput(inputData),
        versionTotal = 0;
    
    do {
        let version, _;
        [version, _, data] = parsePacket(data);
        versionTotal += version;
    } while (data.length > 6)

    return versionTotal;
}

function puzzleB() {
    let data = splitInput(inputData),
        numberTotal = 0;
    
    do {
        let number, _;
        [_, number, data] = parsePacket(data);
        numberTotal += number;
    } while (data.length > 6)

    return numberTotal;
}

function splitInput(data: string): string {
    return data.split('')
        .map(x => parseInt(x, 16)
                    .toString(2)
                    .padStart(4, '0')
            )
        .join('');
}

function parsePacket(packet: string): [number, number, string] {
    let version = parseInt(packet.substring(0, 3), 2);
    const type = parseInt(packet.substring(3, 6), 2);
        
    let restOfPacket = packet.substring(6);

    switch (type) {
        case 4:
            // literal packet
            return [version, ...parseType4Packet(restOfPacket)];
        default:
            // operator packet
            const results = parseTypeXPacket(restOfPacket);
            version += results[0];
            restOfPacket = results[2];

            let number: number;
            switch (type) {
                case 0:
                    number = results[1].reduce((acc, val) => val + acc, 0);
                    break;
                case 1:
                    number = results[1].reduce((acc, val) => val * acc, 1);
                    break;
                case 2:
                    number = Math.min(...results[1]);
                    break;
                case 3:
                    number = Math.max(...results[1]);
                    break;
                // type ID 4 was already processed as a literal packet
                case 5:
                    number = results[1][0] > results[1][1] ? 1 : 0;
                    break;
                case 6:
                    number = results[1][0] < results[1][1] ? 1 : 0;
                    break;
                case 7:
                    number = results[1][0] === results[1][1] ? 1 : 0;
                    break;
            }
            return [version, number, restOfPacket];
    }
}

function parseType4Packet(restOfPacket: string): [number, string] {
    let firstDigit: string,
        numberStr = '';
    
    while (restOfPacket.length && firstDigit !== '0') {
        firstDigit = restOfPacket.substring(0, 1);
        numberStr += restOfPacket.substring(1, 5);

        restOfPacket = restOfPacket.substring(5);
    }

    return [parseInt(numberStr, 2), restOfPacket];
}

function parseTypeXPacket(restOfPacket: string): [number, number[], string] {
    const lengthTypeID = restOfPacket.substring(0, 1);

    let bitsToProcess = 0,
        packetsToProcess = 0,
        bitsProcessed = 0,
        packetsProcessed = 0;
    if (lengthTypeID === '0') {
        bitsToProcess = parseInt(restOfPacket.substring(1, 16), 2); // Bits 1 through 15
        restOfPacket = restOfPacket.substring(16);
    } else {
        packetsToProcess = parseInt(restOfPacket.substring(1, 12), 2); // Bits 1 through 11
        restOfPacket = restOfPacket.substring(12);
    }


    let versionTotal = 0,
        numbers: number[] = [];
    while(bitsToProcess > bitsProcessed || packetsToProcess > packetsProcessed) {
        let origLength = restOfPacket.length,
            version, number;
        [version, number, restOfPacket] = parsePacket(restOfPacket);
        versionTotal += version;
        numbers.push(number);
        bitsProcessed += origLength - restOfPacket.length;
        packetsProcessed++;
    }

    return [versionTotal, numbers, restOfPacket];
}
