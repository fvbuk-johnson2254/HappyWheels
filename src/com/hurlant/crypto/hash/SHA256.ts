import IHash from "@/com/hurlant/crypto/hash/IHash";
import SHABase from "@/com/hurlant/crypto/hash/SHABase";
import { boundClass } from 'autobind-decorator';

@boundClass
export default class SHA256 extends SHABase implements IHash {
    protected static k: any[];
    protected h: any[] = [
        1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924,
        528734635, 1541459225,
    ];

    public override getHashSize(): number {
        return 32;
    }

    protected override core(param1: any[], param2: number): any[] {
        var _loc13_ = 0;
        var _loc14_ = 0;
        var _loc15_ = 0;
        var _loc16_ = 0;
        var _loc17_ = 0;
        var _loc18_ = 0;
        var _loc19_ = 0;
        var _loc20_ = 0;
        var _loc21_: number = 0;
        var _loc22_ = 0;
        var _loc23_ = 0;
        var _loc24_ = 0;
        var _loc25_ = 0;
        param1[param2 >> 5] |= 128 << (24 - (param2 % 32));
        param1[(((param2 + 64) >> 9) << 4) + 15] = param2;
        var _loc3_: any[] = [];
        var _loc4_ = uint(this.h[0]);
        var _loc5_ = uint(this.h[1]);
        var _loc6_ = uint(this.h[2]);
        var _loc7_ = uint(this.h[3]);
        var _loc8_ = uint(this.h[4]);
        var _loc9_ = uint(this.h[5]);
        var _loc10_ = uint(this.h[6]);
        var _loc11_ = uint(this.h[7]);
        var _loc12_ = 0;
        while (_loc12_ < param1.length) {
            _loc13_ = _loc4_;
            _loc14_ = _loc5_;
            _loc15_ = _loc6_;
            _loc16_ = _loc7_;
            _loc17_ = _loc8_;
            _loc18_ = _loc9_;
            _loc19_ = _loc10_;
            _loc20_ = _loc11_;
            _loc21_ = 0;
            while (_loc21_ < 64) {
                if (_loc21_ < 16) {
                    _loc3_[_loc21_] = param1[_loc12_ + _loc21_] || 0;
                } else {
                    _loc24_ = uint(
                        this.rrol(_loc3_[_loc21_ - 15], 7) ^
                        this.rrol(_loc3_[_loc21_ - 15], 18) ^
                        (_loc3_[_loc21_ - 15] >>> 3),
                    );
                    _loc25_ = uint(
                        this.rrol(_loc3_[_loc21_ - 2], 17) ^
                        this.rrol(_loc3_[_loc21_ - 2], 19) ^
                        (_loc3_[_loc21_ - 2] >>> 10),
                    );
                    _loc3_[_loc21_] =
                        _loc3_[_loc21_ - 16] +
                        _loc24_ +
                        _loc3_[_loc21_ - 7] +
                        _loc25_;
                }
                _loc22_ = uint(
                    (this.rrol(_loc4_, 2) ^
                        this.rrol(_loc4_, 13) ^
                        this.rrol(_loc4_, 22)) +
                    ((_loc4_ & _loc5_) ^
                        (_loc4_ & _loc6_) ^
                        (_loc5_ & _loc6_)),
                );
                _loc23_ =
                    _loc11_ +
                    (this.rrol(_loc8_, 6) ^
                        this.rrol(_loc8_, 11) ^
                        this.rrol(_loc8_, 25)) +
                    ((_loc8_ & _loc9_) ^ (_loc10_ & ~_loc8_)) +
                    SHA256.k[_loc21_] +
                    _loc3_[_loc21_];
                _loc11_ = _loc10_;
                _loc10_ = _loc9_;
                _loc9_ = _loc8_;
                _loc8_ = _loc7_ + _loc23_;
                _loc7_ = _loc6_;
                _loc6_ = _loc5_;
                _loc5_ = _loc4_;
                _loc4_ = _loc23_ + _loc22_;
                _loc21_++;
            }
            _loc4_ += _loc13_;
            _loc5_ += _loc14_;
            _loc6_ += _loc15_;
            _loc7_ += _loc16_;
            _loc8_ += _loc17_;
            _loc9_ += _loc18_;
            _loc10_ += _loc19_;
            _loc11_ += _loc20_;
            _loc12_ += 16;
        }
        return [
            _loc4_,
            _loc5_,
            _loc6_,
            _loc7_,
            _loc8_,
            _loc9_,
            _loc10_,
            _loc11_,
        ];
    }

    protected rrol(param1: number, param2: number): number {
        return (param1 << (32 - param2)) | (param1 >>> param2);
    }

    public override toString(): string {
        return "sha256";
    }
}