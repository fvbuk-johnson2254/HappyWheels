import SHA256 from "@/com/hurlant/crypto/hash/SHA256";
import { boundClass } from 'autobind-decorator';

@boundClass
export default class SHA224 extends SHA256 {
    constructor() {
        super();
        this.h = [
            3238371032, 914150663, 812702999, 4144912697, 4290775857,
            1750603025, 1694076839, 3204075428,
        ];
    }

    public override getHashSize(): number {
        return 28;
    }

    public override toString(): string {
        return "sha224";
    }
}