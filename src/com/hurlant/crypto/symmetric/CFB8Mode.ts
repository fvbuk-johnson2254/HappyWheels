import IMode from "@/com/hurlant/crypto/symmetric/IMode";
import IPad from "@/com/hurlant/crypto/symmetric/IPad";
import ISymmetricKey from "@/com/hurlant/crypto/symmetric/ISymmetricKey";
import IVMode from "@/com/hurlant/crypto/symmetric/IVMode";
import { boundClass } from 'autobind-decorator';
import ByteArray from "flash/utils/ByteArray";

@boundClass
export default class CFB8Mode extends IVMode implements IMode {
    constructor(param1: ISymmetricKey, param2: IPad = null) {
        super(param1, null);
    }

    public encrypt(param1: ByteArray) {
        var _loc5_: number = 0;
        var _loc2_: ByteArray = this.getIV4e();
        var _loc3_ = new ByteArray();
        var _loc4_: number = 0;
        while (_loc4_ < param1.length) {
            _loc3_.position = 0;
            _loc3_.writeBytes(_loc2_);
            this.key.encrypt(_loc2_);
            param1[_loc4_] ^= _loc2_[0];
            _loc5_ = 0;
            while (_loc5_ < this.blockSize - 1) {
                _loc2_[_loc5_] = _loc3_[_loc5_ + 1];
                _loc5_++;
            }
            _loc2_[this.blockSize - 1] = param1[_loc4_];
            _loc4_++;
        }
    }

    public decrypt(param1: ByteArray) {
        var _loc5_ = 0;
        var _loc6_: number = 0;
        var _loc2_: ByteArray = this.getIV4d();
        var _loc3_ = new ByteArray();
        var _loc4_: number = 0;
        while (_loc4_ < param1.length) {
            _loc5_ = uint(param1[_loc4_]);
            _loc3_.position = 0;
            _loc3_.writeBytes(_loc2_);
            this.key.encrypt(_loc2_);
            param1[_loc4_] ^= _loc2_[0];
            _loc6_ = 0;
            while (_loc6_ < this.blockSize - 1) {
                _loc2_[_loc6_] = _loc3_[_loc6_ + 1];
                _loc6_++;
            }
            _loc2_[this.blockSize - 1] = _loc5_;
            _loc4_++;
        }
    }

    public toString(): string {
        return this.key.toString() + "-cfb8";
    }
}