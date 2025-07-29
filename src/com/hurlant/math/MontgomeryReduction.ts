import BigInteger from "@/com/hurlant/math/BigInteger";
import IReduction from "@/com/hurlant/math/IReduction";
import { boundClass } from 'autobind-decorator';

@boundClass
export default class MontgomeryReduction implements IReduction {
    private m: BigInteger;
    private mp: number;
    private mpl: number;
    private mph: number;
    private um: number;
    private mt2: number;

    constructor(param1: BigInteger) {
        this.m = param1;
        this.mp = param1.invDigit();
        this.mpl = this.mp & 32767;
        this.mph = this.mp >> 15;
        this.um = (1 << BigInteger.DB - 15) - 1;
        this.mt2 = 2 * param1.t;
    }

    public convert(param1: BigInteger): BigInteger {
        var _loc2_ = new BigInteger();
        param1.abs().dlShiftTo(this.m.t, _loc2_);
        _loc2_.divRemTo(this.m, null, _loc2_);
        if (param1.s < 0 && _loc2_.compareTo(BigInteger.ZERO) > 0) {
            this.m.subTo(_loc2_, _loc2_);
        }
        return _loc2_;
    }

    public revert(param1: BigInteger): BigInteger {
        var _loc2_ = new BigInteger();
        param1.copyTo(_loc2_);
        this.reduce(_loc2_);
        return _loc2_;
    }

    public reduce(param1: BigInteger) {
        var _loc3_ = 0;
        var _loc4_ = 0;
        while (param1.t <= this.mt2) {
            var _loc5_;
            param1.a[_loc5_ = param1.t++] = 0;
        }
        var _loc2_: number = 0;
        while (_loc2_ < this.m.t) {
            _loc3_ = param1.a[_loc2_] & 32767;
            _loc4_ = _loc3_ * this.mpl + ((_loc3_ * this.mph + (param1.a[_loc2_] >> 15) * this.mpl & this.um) << 15) & BigInteger.DM;
            _loc3_ = _loc2_ + this.m.t;
            param1.a[_loc3_] += this.m.am(0, _loc4_, param1, _loc2_, 0, this.m.t);
            while (param1.a[_loc3_] >= BigInteger.DV) {
                param1.a[_loc3_] -= BigInteger.DV;
                ++param1.a[++_loc3_];
            }
            _loc2_++;
        }
        param1.clamp();
        param1.drShiftTo(this.m.t, param1);
        if (param1.compareTo(this.m) >= 0) {
            param1.subTo(this.m, param1);
        }
    }

    public sqrTo(param1: BigInteger, param2: BigInteger) {
        param1.squareTo(param2);
        this.reduce(param2);
    }

    public mulTo(param1: BigInteger, param2: BigInteger, param3: BigInteger) {
        param1.multiplyTo(param2, param3);
        this.reduce(param3);
    }
}