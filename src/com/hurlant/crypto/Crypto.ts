import HMAC from "@/com/hurlant/crypto/hash/HMAC";
import IHash from "@/com/hurlant/crypto/hash/IHash";
import MD2 from "@/com/hurlant/crypto/hash/MD2";
import MD5 from "@/com/hurlant/crypto/hash/MD5";
import SHA1 from "@/com/hurlant/crypto/hash/SHA1";
import SHA224 from "@/com/hurlant/crypto/hash/SHA224";
import SHA256 from "@/com/hurlant/crypto/hash/SHA256";
import ARC4 from "@/com/hurlant/crypto/prng/ARC4";
import RSAKey from "@/com/hurlant/crypto/rsa/RSAKey";
import AESKey from "@/com/hurlant/crypto/symmetric/AESKey";
import BlowFishKey from "@/com/hurlant/crypto/symmetric/BlowFishKey";
import CBCMode from "@/com/hurlant/crypto/symmetric/CBCMode";
import CFB8Mode from "@/com/hurlant/crypto/symmetric/CFB8Mode";
import CFBMode from "@/com/hurlant/crypto/symmetric/CFBMode";
import CTRMode from "@/com/hurlant/crypto/symmetric/CTRMode";
import DESKey from "@/com/hurlant/crypto/symmetric/DESKey";
import ECBMode from "@/com/hurlant/crypto/symmetric/ECBMode";
import ICipher from "@/com/hurlant/crypto/symmetric/ICipher";
import IMode from "@/com/hurlant/crypto/symmetric/IMode";
import IPad from "@/com/hurlant/crypto/symmetric/IPad";
import ISymmetricKey from "@/com/hurlant/crypto/symmetric/ISymmetricKey";
import IVMode from "@/com/hurlant/crypto/symmetric/IVMode";
import NullPad from "@/com/hurlant/crypto/symmetric/NullPad";
import OFBMode from "@/com/hurlant/crypto/symmetric/OFBMode";
import PKCS5 from "@/com/hurlant/crypto/symmetric/PKCS5";
import SimpleIVMode from "@/com/hurlant/crypto/symmetric/SimpleIVMode";
import TripleDESKey from "@/com/hurlant/crypto/symmetric/TripleDESKey";
import XTeaKey from "@/com/hurlant/crypto/symmetric/XTeaKey";
import Base64 from "@/com/hurlant/util/Base64";
import { boundClass } from 'autobind-decorator';
import ByteArray from "flash/utils/ByteArray";

@boundClass
export default class Crypto {
    private b64: Base64;

    public static getCipher(
        param1: string,
        param2: ByteArray,
        param3: IPad = null,
    ): ICipher {
        var _loc5_: ICipher = null;
        var _loc4_: any[] = param1.split("-");
        switch (_loc4_[0]) {
            case "simple":
                _loc4_.shift();
                param1 = _loc4_.join("-");
                _loc5_ = Crypto.getCipher(param1, param2, param3);
                if (_loc5_ instanceof IVMode) {
                    return new SimpleIVMode(_loc5_ as IVMode);
                }
                return _loc5_;
                break;
            case "aes":
            case "aes128":
            case "aes192":
            case "aes256":
                _loc4_.shift();
                if (param2.length * 8 == _loc4_[0]) {
                    _loc4_.shift();
                }
                return Crypto.getMode(_loc4_[0], new AESKey(param2), param3);
            case "bf":
            case "blowfish":
                _loc4_.shift();
                return Crypto.getMode(
                    _loc4_[0],
                    new BlowFishKey(param2),
                    param3,
                );
            case "des":
                _loc4_.shift();
                if (_loc4_[0] != "ede" && _loc4_[0] != "ede3") {
                    return Crypto.getMode(
                        _loc4_[0],
                        new DESKey(param2),
                        param3,
                    );
                }
                if (_loc4_.length == 1) {
                    _loc4_.push("ecb");
                }
                break;
            case "3des":
            case "des3":
                break;
            case "xtea":
                _loc4_.shift();
                return Crypto.getMode(_loc4_[0], new XTeaKey(param2), param3);
            case "rc4":
                _loc4_.shift();
                return new ARC4(param2);
            default:
                return null;
        }
        _loc4_.shift();
        return Crypto.getMode(_loc4_[0], new TripleDESKey(param2), param3);
    }

    public static getKeySize(param1: string): number {
        var _loc2_: any[] = param1.split("-");
        switch (_loc2_[0]) {
            case "simple":
                _loc2_.shift();
                return Crypto.getKeySize(_loc2_.join("-"));
            case "aes128":
                return 16;
            case "aes192":
                return 24;
            case "aes256":
                return 32;
            case "aes":
                _loc2_.shift();
                return parseInt(_loc2_[0]) / 8;
            case "bf":
            case "blowfish":
                return 16;
            case "des":
                _loc2_.shift();
                switch (_loc2_[0]) {
                    case "ede":
                        return 16;
                    case "ede3":
                        return 24;
                    default:
                        return 8;
                }
                break;
            case "3des":
            case "des3":
                return 24;
            case "xtea":
                return 8;
            case "rc4":
                if (parseInt(_loc2_[1]) > 0) {
                    return parseInt(_loc2_[1]) / 8;
                }
                return 16;
                break;
            default:
                return 0;
        }
    }

    private static getMode(
        param1: string,
        param2: ISymmetricKey,
        param3: IPad = null,
    ): IMode {
        switch (param1) {
            case "ecb":
                return new ECBMode(param2, param3);
            case "cfb":
                return new CFBMode(param2, param3);
            case "cfb8":
                return new CFB8Mode(param2, param3);
            case "ofb":
                return new OFBMode(param2, param3);
            case "ctr":
                return new CTRMode(param2, param3);
            case "cbc":
        }
        return new CBCMode(param2, param3);
    }

    public static getHash(param1: string): IHash {
        switch (param1) {
            case "md2":
                return new MD2();
            case "md5":
                return new MD5();
            case "sha":
            case "sha1":
                return new SHA1();
            case "sha224":
                return new SHA224();
            case "sha256":
                return new SHA256();
            default:
                return null;
        }
    }

    public static getHMAC(param1: string): HMAC {
        var _loc2_: any[] = param1.split("-");
        if (_loc2_[0] == "hmac") {
            _loc2_.shift();
        }
        var _loc3_ = 0;
        if (_loc2_.length > 1) {
            _loc3_ = parseInt(_loc2_[1]);
        }
        return new HMAC(Crypto.getHash(_loc2_[0]), _loc3_);
    }

    public static getPad(param1: string): IPad {
        switch (param1) {
            case "null":
                return new NullPad();
            case "pkcs5":
        }
        return new PKCS5();
    }

    public static getRSA(param1: string, param2: string): RSAKey {
        return RSAKey.parsePublicKey(param2, param1);
    }
}