import BigInteger from "@/com/hurlant/math/BigInteger";
import IReduction from "@/com/hurlant/math/IReduction";
import { boundClass } from 'autobind-decorator';

@boundClass
export default class ClassicReduction implements IReduction {
    private m: BigInteger;

    constructor(param1: BigInteger) {
        this.m = param1;
    }

    public convert(param1: BigInteger): BigInteger {
        if (param1.s < 0 || param1.compareTo(this.m) >= 0) {
            return param1.mod(this.m);
        }
        return param1;
    }

    public revert(param1: BigInteger): BigInteger {
        return param1;
    }

    public reduce(param1: BigInteger) {
        param1.divRemTo(this.m, null, param1);
    }

    public mulTo(param1: BigInteger, param2: BigInteger, param3: BigInteger) {
        param1.multiplyTo(param2, param3);
        this.reduce(param3);
    }

    public sqrTo(param1: BigInteger, param2: BigInteger) {
        param1.squareTo(param2);
        this.reduce(param2);
    }
}