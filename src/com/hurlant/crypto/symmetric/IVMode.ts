import Random from "@/com/hurlant/crypto/prng/Random";
import IPad from "@/com/hurlant/crypto/symmetric/IPad";
import ISymmetricKey from "@/com/hurlant/crypto/symmetric/ISymmetricKey";
import PKCS5 from "@/com/hurlant/crypto/symmetric/PKCS5";
import Memory from "@/com/hurlant/util/Memory";
import { boundClass } from 'autobind-decorator';
import ByteArray from "flash/utils/ByteArray";

@boundClass
export default class IVMode {
    protected key: ISymmetricKey;
    protected padding: IPad;
    protected prng: Random;
    protected iv: ByteArray;
    protected lastIV: ByteArray;
    protected blockSize: number;

    constructor(param1: ISymmetricKey, param2: IPad = null) {
        this.key = param1;
        this.blockSize = param1.getBlockSize();
        if (param2 == null) {
            param2 = new PKCS5(this.blockSize);
        } else {
            param2.setBlockSize(this.blockSize);
        }
        this.padding = param2;
        this.prng = new Random();
        this.iv = null;
        this.lastIV = new ByteArray();
    }

    public getBlockSize(): number {
        return this.key.getBlockSize();
    }

    public dispose() {
        var _loc1_: number = 0;
        if (this.iv != null) {
            _loc1_ = 0;
            while (_loc1_ < this.iv.length) {
                this.iv[_loc1_] = this.prng.nextByte();
                _loc1_++;
            }
            this.iv.length = 0;
            this.iv = null;
        }
        if (this.lastIV != null) {
            _loc1_ = 0;
            while (_loc1_ < this.iv.length) {
                this.lastIV[_loc1_] = this.prng.nextByte();
                _loc1_++;
            }
            this.lastIV.length = 0;
            this.lastIV = null;
        }
        this.key.dispose();
        this.key = null;
        this.padding = null;
        this.prng.dispose();
        this.prng = null;
        Memory.gc();
    }

    public set IV(param1: ByteArray) {
        this.iv = param1;
        this.lastIV.length = 0;
        this.lastIV.writeBytes(this.iv);
    }

    public get IV(): ByteArray {
        return this.lastIV;
    }

    protected getIV4e(): ByteArray {
        var _loc1_ = new ByteArray();
        if (this.iv) {
            _loc1_.writeBytes(this.iv);
        } else {
            this.prng.nextBytes(_loc1_, this.blockSize);
        }
        this.lastIV.length = 0;
        this.lastIV.writeBytes(_loc1_);
        return _loc1_;
    }

    protected getIV4d(): ByteArray {
        var _loc1_ = new ByteArray();
        if (this.iv) {
            _loc1_.writeBytes(this.iv);
            return _loc1_;
        }
        throw new Error("an IV must be set before calling decrypt()");
    }
}