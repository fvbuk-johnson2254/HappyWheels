import BigInteger from "@/com/hurlant/math/BigInteger";
import IReduction from "@/com/hurlant/math/IReduction";
import { boundClass } from 'autobind-decorator';

@boundClass
export default class NullReduction implements IReduction {
    public revert(param1: BigInteger): BigInteger {
        return param1;
    }

    public mulTo(param1: BigInteger, param2: BigInteger, param3: BigInteger) {
        param1.multiplyTo(param2, param3);
    }

    public sqrTo(param1: BigInteger, param2: BigInteger) {
        param1.squareTo(param2);
    }

    public convert(param1: BigInteger): BigInteger {
        return param1;
    }

    public reduce(param1: BigInteger) {

    }
}