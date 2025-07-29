import IPad from "@/com/hurlant/crypto/symmetric/IPad";
import { boundClass } from 'autobind-decorator';
import ByteArray from "flash/utils/ByteArray";

@boundClass
export default class PKCS5 implements IPad {
    private blockSize: number;

    constructor(param1: number = 0) {
        this.blockSize = param1;
    }

    public pad(param1: ByteArray) {
        var _loc2_: number = this.blockSize - (param1.length % this.blockSize);
        var _loc3_: number = 0;
        while (_loc3_ < _loc2_) {
            param1[param1.length] = _loc2_;
            _loc3_++;
        }
    }

    public unpad(param1: ByteArray) {
        var _loc4_ = 0;
        var _loc2_: number = param1.length % this.blockSize;
        if (_loc2_ != 0) {
            throw new Error(
                "PKCS#5::unpad: ByteArray.length isn\'t a multiple of the blockSize",
            );
        }
        _loc2_ = uint(param1[param1.length - 1]);
        var _loc3_: number = _loc2_;
        while (_loc3_ > 0) {
            _loc4_ = uint(param1[param1.length - 1]);
            --param1.length;
            if (_loc2_ != _loc4_) {
                throw new Error(
                    "PKCS#5:unpad: Invalid padding value. expected [" +
                    _loc2_ +
                    "], found [" +
                    _loc4_ +
                    "]",
                );
            }
            _loc3_--;
        }
    }

    public setBlockSize(param1: number) {
        this.blockSize = param1;
    }
}