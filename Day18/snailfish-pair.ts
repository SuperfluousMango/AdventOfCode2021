export enum ResultType {
    None = 0,
    Explode = 1,
    Split = 2,
    CompletedExplode = 3
};

export class SnailfishPair {
    left: number | SnailfishPair;
    right: number | SnailfishPair;

    constructor(str: string) {
        str = str.substring(1, str.length - 1); // strip off the outer brackets

        let leftLen;
        if (str[0] === '[') {
            // it's a SnailfishPair
            leftLen = this.getPairStrLen(str);
            const leftPair = str.substring(0, leftLen);
            this.left = new SnailfishPair(leftPair);
        } else {
            leftLen = str.indexOf(',');
            this.left = Number(str.substring(0, leftLen));
        }

        const rightStartPos = leftLen + 1; // One spot past the comma
        if (str[rightStartPos] === '[') {
            this.right = new SnailfishPair(str.substring(rightStartPos));
        } else {
            this.right = Number(str.substring(rightStartPos));
        }
    }

    getMagnitude(): number {
        const leftMag = this.left instanceof SnailfishPair
                ? this.left.getMagnitude()
                : this.left,
            rightMag = this.right instanceof SnailfishPair
                ? this.right.getMagnitude()
                : this.right;

        return leftMag * 3 + rightMag * 2;
    }

    toString(): string {
        return `[${this.left.toString()},${this.right.toString()}]`;
    }

    private getPairStrLen(str: string): number {
        let bracketLevel = 0,
            pos = 0;
        
        do {
            switch (str[pos]) {
                case '[':
                    bracketLevel++;
                    break;
                case ']':
                    bracketLevel--;
                    break;
            }
            pos++;
        } while (bracketLevel > 0); // Final increment gives us the comma position

        return pos;
    }
}
