import IMode from "@/com/hurlant/crypto/symmetric/IMode";
import IPad from "@/com/hurlant/crypto/symmetric/IPad";
import ISymmetricKey from "@/com/hurlant/crypto/symmetric/ISymmetricKey";
import IVMode from "@/com/hurlant/crypto/symmetric/IVMode";
import { boundClass } from 'autobind-decorator';
import ByteArray from "flash/utils/ByteArray";

@boundClass
export default class CBCMode extends IVMode implements IMode {
    constructor(param1: ISymmetricKey, param2: IPad = null) {
        super(param1, param2);
    }

    public encrypt(param1: ByteArray) {
        var _loc4_: number = 0;
        this.padding.pad(param1);
        var _loc2_: ByteArray = this.getIV4e();
        var _loc3_ = 0;
        while (_loc3_ < param1.length) {
            _loc4_ = 0;
            while (_loc4_ < this.blockSize) {
                param1[_loc3_ + _loc4_] ^= _loc2_[_loc4_];
                _loc4_++;
            }
            this.key.encrypt(param1, _loc3_);
            _loc2_.position = 0;
            _loc2_.writeBytes(param1, _loc3_, this.blockSize);
            _loc3_ += this.blockSize;
        }
    }

    public decrypt(param1: ByteArray) {
        var _loc5_: number = 0;
        var _loc2_: ByteArray = this.getIV4d();
        var _loc3_ = new ByteArray();
        var _loc4_ = 0;
        while (_loc4_ < param1.length) {
            _loc3_.position = 0;
            _loc3_.writeBytes(param1, _loc4_, this.blockSize);
            this.key.decrypt(param1, _loc4_);
            _loc5_ = 0;
            while (_loc5_ < this.blockSize) {
                param1[_loc4_ + _loc5_] ^= _loc2_[_loc5_];
                _loc5_++;
            }
            _loc2_.position = 0;
            _loc2_.writeBytes(_loc3_, 0, this.blockSize);
            _loc4_ += this.blockSize;
        }
        this.padding.unpad(param1);
    }

    public toString(): string {
        return this.key.toString() + "-cbc";
    }
}