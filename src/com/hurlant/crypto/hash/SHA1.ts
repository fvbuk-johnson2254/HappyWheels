import IHash from "@/com/hurlant/crypto/hash/IHash";
import SHABase from "@/com/hurlant/crypto/hash/SHABase";
import { boundClass } from 'autobind-decorator';

@boundClass
export default class SHA1 extends SHABase implements IHash {
    public static HASH_SIZE: number;

    public override getHashSize(): number {
        return SHA1.HASH_SIZE;
    }

    protected override core(param1: any[], param2: number): any[] {
        var _loc10_ = 0;
        var _loc11_ = 0;
        var _loc12_ = 0;
        var _loc13_ = 0;
        var _loc14_ = 0;
        var _loc15_: number = 0;
        var _loc16_ = 0;
        param1[param2 >> 5] |= 128 << (24 - (param2 % 32));
        param1[(((param2 + 64) >> 9) << 4) + 15] = param2;
        var _loc3_: any[] = [];
        var _loc4_ = 1732584193;
        var _loc5_ = 4023233417;
        var _loc6_ = 2562383102;
        var _loc7_ = 271733878;
        var _loc8_ = 3285377520;
        var _loc9_ = 0;
        while (_loc9_ < param1.length) {
            _loc10_ = _loc4_;
            _loc11_ = _loc5_;
            _loc12_ = _loc6_;
            _loc13_ = _loc7_;
            _loc14_ = _loc8_;
            _loc15_ = 0;
            while (_loc15_ < 80) {
                if (_loc15_ < 16) {
                    _loc3_[_loc15_] = param1[_loc9_ + _loc15_] || 0;
                } else {
                    _loc3_[_loc15_] = this.rol(
                        _loc3_[_loc15_ - 3] ^
                        _loc3_[_loc15_ - 8] ^
                        _loc3_[_loc15_ - 14] ^
                        _loc3_[_loc15_ - 16],
                        1,
                    );
                }
                _loc16_ =
                    this.rol(_loc4_, 5) +
                    this.ft(_loc15_, _loc5_, _loc6_, _loc7_) +
                    _loc8_ +
                    _loc3_[_loc15_] +
                    this.kt(_loc15_);
                _loc8_ = _loc7_;
                _loc7_ = _loc6_;
                _loc6_ = this.rol(_loc5_, 30);
                _loc5_ = _loc4_;
                _loc4_ = _loc16_;
                _loc15_++;
            }
            _loc4_ += _loc10_;
            _loc5_ += _loc11_;
            _loc6_ += _loc12_;
            _loc7_ += _loc13_;
            _loc8_ += _loc14_;
            _loc9_ += 16;
        }
        return [_loc4_, _loc5_, _loc6_, _loc7_, _loc8_];
    }

    private rol(param1: number, param2: number): number {
        return (param1 << param2) | (param1 >>> (32 - param2));
    }

    private ft(
        param1: number,
        param2: number,
        param3: number,
        param4: number,
    ): number {
        if (param1 < 20) {
            return (param2 & param3) | (~param2 & param4);
        }
        if (param1 < 40) {
            return param2 ^ param3 ^ param4;
        }
        if (param1 < 60) {
            return (param2 & param3) | (param2 & param4) | (param3 & param4);
        }
        return param2 ^ param3 ^ param4;
    }

    private kt(param1: number): number {
        return param1 < 20
            ? 1518500249
            : param1 < 40
                ? 1859775393
                : param1 < 60
                    ? 2400959708
                    : uint(3395469782);
    }

    public override toString(): string {
        return "sha1";
    }
}