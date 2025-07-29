import Random from "@/com/hurlant/crypto/prng/Random";
import BigInteger from "@/com/hurlant/math/BigInteger";
import Memory from "@/com/hurlant/util/Memory";
import { boundClass } from 'autobind-decorator';
import ByteArray from "flash/utils/ByteArray";

@boundClass
export default class RSAKey {
    public e: number;
    public n: BigInteger;
    public d: BigInteger;
    public p: BigInteger;
    public q: BigInteger;
    public dmp1: BigInteger;
    public dmq1: BigInteger;
    public coeff: BigInteger;
    protected canDecrypt: boolean;
    protected canEncrypt: boolean;

    constructor(
        param1: BigInteger,
        param2: number,
        param3: BigInteger = null,
        param4: BigInteger = null,
        param5: BigInteger = null,
        param6: BigInteger = null,
        param7: BigInteger = null,
        param8: BigInteger = null,
    ) {
        this.n = param1;
        this.e = param2;
        this.d = param3;
        this.p = param4;
        this.q = param5;
        this.dmp1 = param6;
        this.dmq1 = param7;
        this.coeff = param8;
        this.canEncrypt = this.n != null && this.e != 0;
        this.canDecrypt = this.canEncrypt && this.d != null;
    }

    public static parsePublicKey(param1: string, param2: string): RSAKey {
        return new RSAKey(new BigInteger(param1, 16), parseInt(param2, 16));
    }

    public static parsePrivateKey(
        param1: string,
        param2: string,
        param3: string,
        param4: string = null,
        param5: string = null,
        param6: string = null,
        param7: string = null,
        param8: string = null,
    ): RSAKey {
        if (param4 == null) {
            return new RSAKey(
                new BigInteger(param1, 16),
                parseInt(param2, 16),
                new BigInteger(param3, 16),
            );
        }
        return new RSAKey(
            new BigInteger(param1, 16),
            parseInt(param2, 16),
            new BigInteger(param3, 16),
            new BigInteger(param4, 16),
            new BigInteger(param5, 16),
            new BigInteger(param6, 16),
            new BigInteger(param7),
            new BigInteger(param8),
        );
    }

    public static generate(param1: number, param2: string): RSAKey {
        var _loc7_: BigInteger = null;
        var _loc8_: BigInteger = null;
        var _loc9_: BigInteger = null;
        var _loc10_: BigInteger = null;
        var _loc3_ = new Random();
        var _loc4_ = uint(param1 >> 1);
        var _loc5_ = new RSAKey(null, 0, null);
        _loc5_.e = parseInt(param2, 16);
        var _loc6_ = new BigInteger(param2, 16);
        do {
            do {
                _loc5_.p = RSAKey.bigRandom(param1 - _loc4_, _loc3_);
            } while (
                !(
                    _loc5_.p
                        .subtract(BigInteger.ONE)
                        .gcd(_loc6_)
                        .compareTo(BigInteger.ONE) == 0 &&
                    _loc5_.p.isProbablePrime(10)
                )
            );

            do {
                _loc5_.q = RSAKey.bigRandom(_loc4_, _loc3_);
            } while (
                !(
                    _loc5_.q
                        .subtract(BigInteger.ONE)
                        .gcd(_loc6_)
                        .compareTo(BigInteger.ONE) == 0 &&
                    _loc5_.q.isProbablePrime(10)
                )
            );

            if (_loc5_.p.compareTo(_loc5_.q) <= 0) {
                _loc10_ = _loc5_.p;
                _loc5_.p = _loc5_.q;
                _loc5_.q = _loc10_;
            }
            _loc7_ = _loc5_.p.subtract(BigInteger.ONE);
            _loc8_ = _loc5_.q.subtract(BigInteger.ONE);
        } while (
            ((_loc9_ = _loc7_.multiply(_loc8_)),
                _loc9_.gcd(_loc6_).compareTo(BigInteger.ONE) != 0)
        );

        _loc5_.n = _loc5_.p.multiply(_loc5_.q);
        _loc5_.d = _loc6_.modInverse(_loc9_);
        _loc5_.dmp1 = _loc5_.d.mod(_loc7_);
        _loc5_.dmq1 = _loc5_.d.mod(_loc8_);
        _loc5_.coeff = _loc5_.q.modInverse(_loc5_.p);
        return _loc5_;
    }

    protected static bigRandom(param1: number, param2: Random): BigInteger {
        if (param1 < 2) {
            return BigInteger.nbv(1);
        }
        var _loc3_ = new ByteArray();
        param2.nextBytes(_loc3_, param1 >> 3);
        _loc3_.position = 0;
        var _loc4_ = new BigInteger(_loc3_);
        _loc4_.primify(param1, 1);
        return _loc4_;
    }

    public getBlockSize(): number {
        return (this.n.bitLength() + 7) / 8;
    }

    public dispose() {
        this.e = 0;
        this.n.dispose();
        this.n = null;
        Memory.gc();
    }

    public encrypt(
        param1: ByteArray,
        param2: ByteArray,
        param3: number,
        param4: Function = null,
    ) {
        this._encrypt(this.doPublic, param1, param2, param3, param4, 2);
    }

    public decrypt(
        param1: ByteArray,
        param2: ByteArray,
        param3: number,
        param4: Function = null,
    ) {
        this._decrypt(this.doPrivate2, param1, param2, param3, param4, 2);
    }

    public sign(
        param1: ByteArray,
        param2: ByteArray,
        param3: number,
        param4: Function = null,
    ) {
        this._encrypt(this.doPrivate2, param1, param2, param3, param4, 1);
    }

    public verify(
        param1: ByteArray,
        param2: ByteArray,
        param3: number,
        param4: Function = null,
    ) {
        this._decrypt(this.doPublic, param1, param2, param3, param4, 1);
    }

    private _encrypt(
        param1: Function,
        param2: ByteArray,
        param3: ByteArray,
        param4: number,
        param5: Function,
        param6: number,
    ) {
        var _loc9_: BigInteger = null;
        var _loc10_: BigInteger = null;
        if (param5 == null) {
            param5 = this.pkcs1pad;
        }
        if (param2.position >= param2.length) {
            param2.position = 0;
        }
        var _loc7_: number = this.getBlockSize();
        var _loc8_ = int(param2.position + param4);
        while (param2.position < _loc8_) {
            _loc9_ = new BigInteger(
                param5(param2, _loc8_, _loc7_, param6),
                _loc7_,
            );
            _loc10_ = param1(_loc9_);
            _loc10_.toArray(param3);
        }
    }

    private _decrypt(
        param1: Function,
        param2: ByteArray,
        param3: ByteArray,
        param4: number,
        param5: Function,
        param6: number,
    ) {
        var _loc9_: BigInteger = null;
        var _loc10_: BigInteger = null;
        var _loc11_: ByteArray = null;
        if (param5 == null) {
            param5 = this.pkcs1unpad;
        }
        if (param2.position >= param2.length) {
            param2.position = 0;
        }
        var _loc7_: number = this.getBlockSize();
        var _loc8_ = int(param2.position + param4);
        while (param2.position < _loc8_) {
            _loc9_ = new BigInteger(param2, param4);
            _loc10_ = param1(_loc9_);
            _loc11_ = param5(_loc10_, _loc7_);
            param3.writeBytes(_loc11_);
        }
    }

    private pkcs1pad(
        param1: ByteArray,
        param2: number,
        param3: number,
        param4: number = 2,
    ): ByteArray {
        var _loc9_: number = 0;
        var _loc5_ = new ByteArray();
        var _loc6_: number = param1.position;
        param2 = Math.min(param2, param1.length, _loc6_ + param3 - 11);
        param1.position = param2;
        var _loc7_: number = param2 - 1;
        while (_loc7_ >= _loc6_ && param3 > 11) {
            var _loc10_;
            _loc5_[(_loc10_ = --param3)] = param1[_loc7_--];
        }
        _loc5_[(_loc10_ = --param3)] = 0;
        var _loc8_ = new Random();
        while (param3 > 2) {
            _loc9_ = 0;
            while (_loc9_ == 0) {
                _loc9_ = param4 == 2 ? _loc8_.nextByte() : 255;
            }
            var _loc11_;
            _loc5_[(_loc11_ = --param3)] = _loc9_;
        }
        _loc5_[(_loc11_ = --param3)] = param4;
        var _loc12_;
        _loc5_[(_loc12_ = --param3)] = 0;
        return _loc5_;
    }

    private pkcs1unpad(
        param1: BigInteger,
        param2: number,
        param3: number = 2,
    ): ByteArray {
        var _loc4_: ByteArray = param1.toByteArray();
        var _loc5_ = new ByteArray();
        var _loc6_: number = 0;
        while (_loc6_ < _loc4_.length && _loc4_[_loc6_] == 0) {
            _loc6_++;
        }
        if (_loc4_.length - _loc6_ != param2 - 1 || _loc4_[_loc6_] > 2) {
            trace(
                "PKCS#1 unpad: i=" +
                _loc6_ +
                ", expected b[i]==[0,1,2], got b[i]=" +
                _loc4_[_loc6_].toString(16),
            );
            return null;
        }
        _loc6_++;
        while (_loc4_[_loc6_] != 0) {
            if (++_loc6_ >= _loc4_.length) {
                trace(
                    "PKCS#1 unpad: i=" +
                    _loc6_ +
                    ", b[i-1]!=0 (=" +
                    _loc4_[_loc6_ - 1].toString(16) +
                    ")",
                );
                return null;
            }
        }
        while (++_loc6_ < _loc4_.length) {
            _loc5_.writeByte(_loc4_[_loc6_]);
        }
        _loc5_.position = 0;
        return _loc5_;
    }

    private rawpad(
        param1: ByteArray,
        param2: number,
        param3: number,
    ): ByteArray {
        return param1;
    }

    public toString(): string {
        return "rsa";
    }

    public dump(): string {
        var _loc1_ = "N=" +
            // @ts-expect-error
            this.n.toString(16) +
            "\n" +
            "E=" +
            this.e.toString(16) +
            "\n";
        if (this.canDecrypt) {
            // @ts-expect-error
            _loc1_ += "D=" + this.d.toString(16) + "\n";
            if (this.p != null && this.q != null) {
                // @ts-expect-error
                _loc1_ += "P=" + this.p.toString(16) + "\n";
                // @ts-expect-error
                _loc1_ += "Q=" + this.q.toString(16) + "\n";
                // @ts-expect-error
                _loc1_ += "DMP1=" + this.dmp1.toString(16) + "\n";
                // @ts-expect-error
                _loc1_ += "DMQ1=" + this.dmq1.toString(16) + "\n";
                // @ts-expect-error
                _loc1_ += "IQMP=" + this.coeff.toString(16) + "\n";
            }
        }
        return _loc1_;
    }

    protected doPublic(param1: BigInteger): BigInteger {
        return param1.modPowInt(this.e, this.n);
    }

    protected doPrivate2(param1: BigInteger): BigInteger {
        if (this.p == null && this.q == null) {
            return param1.modPow(this.d, this.n);
        }
        var _loc2_: BigInteger = param1.mod(this.p).modPow(this.dmp1, this.p);
        var _loc3_: BigInteger = param1.mod(this.q).modPow(this.dmq1, this.q);
        while (_loc2_.compareTo(_loc3_) < 0) {
            _loc2_ = _loc2_.add(this.p);
        }
        return _loc2_
            .subtract(_loc3_)
            .multiply(this.coeff)
            .mod(this.p)
            .multiply(this.q)
            .add(_loc3_);
    }

    protected doPrivate(param1: BigInteger): BigInteger {
        if (this.p == null || this.q == null) {
            return param1.modPow(this.d, this.n);
        }
        var _loc2_: BigInteger = param1.mod(this.p).modPow(this.dmp1, this.p);
        var _loc3_: BigInteger = param1.mod(this.q).modPow(this.dmq1, this.q);
        while (_loc2_.compareTo(_loc3_) < 0) {
            _loc2_ = _loc2_.add(this.p);
        }
        return _loc2_
            .subtract(_loc3_)
            .multiply(this.coeff)
            .mod(this.p)
            .multiply(this.q)
            .add(_loc3_);
    }
}