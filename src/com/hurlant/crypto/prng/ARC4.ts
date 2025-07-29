import IPRNG from "@/com/hurlant/crypto/prng/IPRNG";
import IStreamCipher from "@/com/hurlant/crypto/symmetric/IStreamCipher";
import Memory from "@/com/hurlant/util/Memory";
import { boundClass } from 'autobind-decorator';
import ByteArray from "flash/utils/ByteArray";

@boundClass
export default class ARC4 implements IPRNG, IStreamCipher {
    private i: number;
    private j: number = 0;
    private S: ByteArray;
    private psize: number = 256;

    constructor(param1: ByteArray = null) {
        this.S = new ByteArray();
        if (param1) {
            this.init(param1);
        }
    }

    public getPoolSize(): number {
        return this.psize;
    }

    public init(param1: ByteArray) {
        var _loc2_: number = 0;
        var _loc3_ = 0;
        var _loc4_: number = 0;
        _loc2_ = 0;
        while (_loc2_ < 256) {
            this.S[_loc2_] = _loc2_;
            _loc2_++;
        }
        _loc3_ = 0;
        _loc2_ = 0;
        while (_loc2_ < 256) {
            _loc3_ =
                (_loc3_ + this.S[_loc2_] + param1[_loc2_ % param1.length]) &
                255;
            _loc4_ = int(this.S[_loc2_]);
            this.S[_loc2_] = this.S[_loc3_];
            this.S[_loc3_] = _loc4_;
            _loc2_++;
        }
        this.i = 0;
        this.j = 0;
    }

    public next(): number {
        var _loc1_: number = 0;
        this.i = (this.i + 1) & 255;
        this.j = (this.j + this.S[this.i]) & 255;
        _loc1_ = int(this.S[this.i]);
        this.S[this.i] = this.S[this.j];
        this.S[this.j] = _loc1_;
        return this.S[(_loc1_ + this.S[this.i]) & 255];
    }

    public getBlockSize(): number {
        return 1;
    }

    public encrypt(param1: ByteArray) {
        var _loc2_: number = 0;
        while (_loc2_ < param1.length) {
            var _loc3_ = _loc2_++;
            param1[_loc3_] ^= this.next();
        }
    }

    public decrypt(param1: ByteArray) {
        this.encrypt(param1);
    }

    public dispose() {
        var _loc1_: number = 0;
        if (this.S != null) {
            _loc1_ = 0;
            while (_loc1_ < this.S.length) {
                this.S[_loc1_] = Math.random() * 256;
                _loc1_++;
            }
            this.S.length = 0;
            this.S = null;
        }
        this.i = 0;
        this.j = 0;
        Memory.gc();
    }

    public toString(): string {
        return "rc4";
    }
}