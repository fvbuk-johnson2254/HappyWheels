import IMode from "@/com/hurlant/crypto/symmetric/IMode";
import IPad from "@/com/hurlant/crypto/symmetric/IPad";
import ISymmetricKey from "@/com/hurlant/crypto/symmetric/ISymmetricKey";
import IVMode from "@/com/hurlant/crypto/symmetric/IVMode";
import { boundClass } from 'autobind-decorator';
import ByteArray from "flash/utils/ByteArray";

@boundClass
export default class OFBMode extends IVMode implements IMode {
    constructor(param1: ISymmetricKey, param2: IPad = null) {
        super(param1, null);
    }

    public encrypt(param1: ByteArray) {
        var _loc2_: ByteArray = this.getIV4e();
        this.core(param1, _loc2_);
    }

    public decrypt(param1: ByteArray) {
        var _loc2_: ByteArray = this.getIV4d();
        this.core(param1, _loc2_);
    }

    private core(param1: ByteArray, param2: ByteArray) {
        var _loc6_ = 0;
        var _loc7_: number = 0;
        var _loc3_: number = param1.length;
        var _loc4_ = new ByteArray();
        var _loc5_ = 0;
        while (_loc5_ < param1.length) {
            this.key.encrypt(param2);
            _loc4_.position = 0;
            _loc4_.writeBytes(param2);
            _loc6_ =
                _loc5_ + this.blockSize < _loc3_
                    ? this.blockSize
                    : uint(_loc3_ - _loc5_);
            _loc7_ = 0;
            while (_loc7_ < _loc6_) {
                param1[_loc5_ + _loc7_] ^= param2[_loc7_];
                _loc7_++;
            }
            param2.position = 0;
            param2.writeBytes(_loc4_);
            _loc5_ += this.blockSize;
        }
    }

    public toString(): string {
        return this.key.toString() + "-ofb";
    }
}