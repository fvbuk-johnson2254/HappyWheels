import ICipher from "@/com/hurlant/crypto/symmetric/ICipher";
import IMode from "@/com/hurlant/crypto/symmetric/IMode";
import IVMode from "@/com/hurlant/crypto/symmetric/IVMode";
import Memory from "@/com/hurlant/util/Memory";
import { boundClass } from 'autobind-decorator';
import ByteArray from "flash/utils/ByteArray";

@boundClass
export default class SimpleIVMode implements IMode, ICipher {
    protected mode: IVMode;
    protected cipher: ICipher;

    constructor(param1: IVMode) {
        this.mode = param1;
        // @ts-expect-error
        this.cipher = param1 as ICipher;
    }

    public getBlockSize(): number {
        return this.mode.getBlockSize();
    }

    public dispose() {
        this.mode.dispose();
        this.mode = null;
        this.cipher = null;
        Memory.gc();
    }

    public encrypt(param1: ByteArray) {
        this.cipher.encrypt(param1);
        var _loc2_ = new ByteArray();
        _loc2_.writeBytes(this.mode.IV);
        _loc2_.writeBytes(param1);
        param1.position = 0;
        param1.writeBytes(_loc2_);
    }

    public decrypt(param1: ByteArray) {
        var _loc2_ = new ByteArray();
        _loc2_.writeBytes(param1, 0, this.getBlockSize());
        this.mode.IV = _loc2_;
        _loc2_ = new ByteArray();
        _loc2_.writeBytes(param1, this.getBlockSize());
        this.cipher.decrypt(_loc2_);
        param1.length = 0;
        param1.writeBytes(_loc2_);
    }

    public toString(): string {
        return "simple-" + this.cipher.toString();
    }
}