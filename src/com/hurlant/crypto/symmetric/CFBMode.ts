import IMode from "@/com/hurlant/crypto/symmetric/IMode";
import IPad from "@/com/hurlant/crypto/symmetric/IPad";
import ISymmetricKey from "@/com/hurlant/crypto/symmetric/ISymmetricKey";
import IVMode from "@/com/hurlant/crypto/symmetric/IVMode";
import { boundClass } from 'autobind-decorator';
import ByteArray from "flash/utils/ByteArray";

@boundClass
export default class CFBMode extends IVMode implements IMode {
    constructor(param1: ISymmetricKey, param2: IPad = null) {
        super(param1, null);
    }

    public encrypt(param1: ByteArray) {
        var _loc5_ = 0;
        var _loc6_: number = 0;
        var _loc2_: number = param1.length;
        var _loc3_: ByteArray = this.getIV4e();
        var _loc4_ = 0;
        while (_loc4_ < param1.length) {
            this.key.encrypt(_loc3_);
            _loc5_ =
                _loc4_ + this.blockSize < _loc2_
                    ? this.blockSize
                    : uint(_loc2_ - _loc4_);
            _loc6_ = 0;
            while (_loc6_ < _loc5_) {
                param1[_loc4_ + _loc6_] ^= _loc3_[_loc6_];
                _loc6_++;
            }
            _loc3_.position = 0;
            _loc3_.writeBytes(param1, _loc4_, _loc5_);
            _loc4_ += this.blockSize;
        }
    }

    public decrypt(param1: ByteArray) {
        var _loc6_ = 0;
        var _loc7_: number = 0;
        var _loc2_: number = param1.length;
        var _loc3_: ByteArray = this.getIV4d();
        var _loc4_ = new ByteArray();
        var _loc5_ = 0;
        while (_loc5_ < param1.length) {
            this.key.encrypt(_loc3_);
            _loc6_ =
                _loc5_ + this.blockSize < _loc2_
                    ? this.blockSize
                    : uint(_loc2_ - _loc5_);
            _loc4_.position = 0;
            _loc4_.writeBytes(param1, _loc5_, _loc6_);
            _loc7_ = 0;
            while (_loc7_ < _loc6_) {
                param1[_loc5_ + _loc7_] ^= _loc3_[_loc7_];
                _loc7_++;
            }
            _loc3_.position = 0;
            _loc3_.writeBytes(_loc4_);
            _loc5_ += this.blockSize;
        }
    }

    public toString(): string {
        return this.key.toString() + "-cfb";
    }
}