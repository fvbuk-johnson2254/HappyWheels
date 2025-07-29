import IMode from "@/com/hurlant/crypto/symmetric/IMode";
import IPad from "@/com/hurlant/crypto/symmetric/IPad";
import ISymmetricKey from "@/com/hurlant/crypto/symmetric/ISymmetricKey";
import IVMode from "@/com/hurlant/crypto/symmetric/IVMode";
import { boundClass } from 'autobind-decorator';
import ByteArray from "flash/utils/ByteArray";

@boundClass
export default class CTRMode extends IVMode implements IMode {
    constructor(param1: ISymmetricKey, param2: IPad = null) {
        super(param1, param2);
    }

    public encrypt(param1: ByteArray) {
        this.padding.pad(param1);
        var _loc2_: ByteArray = this.getIV4e();
        this.core(param1, _loc2_);
    }

    public decrypt(param1: ByteArray) {
        var _loc2_: ByteArray = this.getIV4d();
        this.core(param1, _loc2_);
        this.padding.unpad(param1);
    }

    private core(param1: ByteArray, param2: ByteArray) {
        var _loc6_ = 0;
        var _loc3_ = new ByteArray();
        var _loc4_ = new ByteArray();
        _loc3_.writeBytes(param2);
        var _loc5_ = 0;
        while (_loc5_ < param1.length) {
            _loc4_.position = 0;
            _loc4_.writeBytes(_loc3_);
            this.key.encrypt(_loc4_);
            _loc6_ = 0;
            while (_loc6_ < this.blockSize) {
                param1[_loc5_ + _loc6_] ^= _loc4_[_loc6_];
                _loc6_++;
            }
            _loc6_ = this.blockSize - 1;
            while (_loc6_ >= 0) {
                ++_loc3_[_loc6_];
                if (_loc3_[_loc6_] != 0) {
                    break;
                }
                _loc6_--;
            }
            _loc5_ += this.blockSize;
        }
    }

    public toString(): string {
        return this.key.toString() + "-ctr";
    }
}