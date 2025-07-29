import ICipher from "@/com/hurlant/crypto/symmetric/ICipher";
import IMode from "@/com/hurlant/crypto/symmetric/IMode";
import IPad from "@/com/hurlant/crypto/symmetric/IPad";
import ISymmetricKey from "@/com/hurlant/crypto/symmetric/ISymmetricKey";
import PKCS5 from "@/com/hurlant/crypto/symmetric/PKCS5";
import Memory from "@/com/hurlant/util/Memory";
import { boundClass } from 'autobind-decorator';
import ByteArray from "flash/utils/ByteArray";

@boundClass
export default class ECBMode implements IMode, ICipher {
    private key: ISymmetricKey;
    private padding: IPad;

    constructor(param1: ISymmetricKey, param2: IPad = null) {
        this.key = param1;
        if (param2 == null) {
            param2 = new PKCS5(param1.getBlockSize());
        } else {
            param2.setBlockSize(param1.getBlockSize());
        }
        this.padding = param2;
    }

    public getBlockSize(): number {
        return this.key.getBlockSize();
    }

    public encrypt(param1: ByteArray) {
        this.padding.pad(param1);
        param1.position = 0;
        var _loc2_: number = this.key.getBlockSize();
        var _loc3_ = new ByteArray();
        var _loc4_ = new ByteArray();
        var _loc5_ = 0;
        while (_loc5_ < param1.length) {
            _loc3_.length = 0;
            param1.readBytes(_loc3_, 0, _loc2_);
            this.key.encrypt(_loc3_);
            _loc4_.writeBytes(_loc3_);
            _loc5_ += _loc2_;
        }
        param1.length = 0;
        param1.writeBytes(_loc4_);
    }

    public decrypt(param1: ByteArray) {
        param1.position = 0;
        var _loc2_: number = this.key.getBlockSize();
        if (param1.length % _loc2_ != 0) {
            throw new Error(
                "ECB mode cipher length must be a multiple of blocksize " +
                _loc2_,
            );
        }
        var _loc3_ = new ByteArray();
        var _loc4_ = new ByteArray();
        var _loc5_ = 0;
        while (_loc5_ < param1.length) {
            _loc3_.length = 0;
            param1.readBytes(_loc3_, 0, _loc2_);
            this.key.decrypt(_loc3_);
            _loc4_.writeBytes(_loc3_);
            _loc5_ += _loc2_;
        }
        this.padding.unpad(_loc4_);
        param1.length = 0;
        param1.writeBytes(_loc4_);
    }

    public dispose() {
        this.key.dispose();
        this.key = null;
        this.padding = null;
        Memory.gc();
    }

    public toString(): string {
        return this.key.toString() + "-ecb";
    }
}