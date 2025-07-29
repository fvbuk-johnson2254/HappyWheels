import BigInteger from "@/com/hurlant/math/BigInteger";
import IReduction from "@/com/hurlant/math/IReduction";
import { boundClass } from 'autobind-decorator';

@boundClass
export default class BarrettReduction implements IReduction {
    private m: BigInteger;
    private r2: BigInteger;
    private q3: BigInteger;
    private mu: BigInteger;

    constructor(param1: BigInteger) {

        this.r2 = new BigInteger();
        this.q3 = new BigInteger();
        BigInteger.ONE.dlShiftTo(2 * param1.t, this.r2);
        this.mu = this.r2.divide(param1);
        this.m = param1;
    }

    public revert(param1: BigInteger): BigInteger {
        return param1;
    }

    public mulTo(param1: BigInteger, param2: BigInteger, param3: BigInteger) {
        param1.multiplyTo(param2, param3);
        this.reduce(param3);
    }

    public sqrTo(param1: BigInteger, param2: BigInteger) {
        param1.squareTo(param2);
        this.reduce(param2);
    }

    public convert(param1: BigInteger): BigInteger {
        var _loc2_: BigInteger = null;
        if (param1.s < 0 || param1.t > 2 * this.m.t) {
            return param1.mod(this.m);
        }
        if (param1.compareTo(this.m) < 0) {
            return param1;
        }
        _loc2_ = new BigInteger();
        param1.copyTo(_loc2_);
        this.reduce(_loc2_);
        return _loc2_;
    }

    public reduce(param1: BigInteger) {
        var _loc2_: BigInteger = param1 as BigInteger;
        _loc2_.drShiftTo(this.m.t - 1, this.r2);
        if (_loc2_.t > this.m.t + 1) {
            _loc2_.t = this.m.t + 1;
            _loc2_.clamp();
        }
        this.mu.multiplyUpperTo(this.r2, this.m.t + 1, this.q3);
        this.m.multiplyLowerTo(this.q3, this.m.t + 1, this.r2);
        while (_loc2_.compareTo(this.r2) < 0) {
            _loc2_.dAddOffset(1, this.m.t + 1);
        }
        _loc2_.subTo(this.r2, _loc2_);
        while (_loc2_.compareTo(this.m) >= 0) {
            _loc2_.subTo(this.m, _loc2_);
        }
    }
}