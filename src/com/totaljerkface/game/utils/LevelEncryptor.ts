import ButtHoleKey from "@/com/hurlant/crypto/symmetric/ButtHoleKey";
import CBCMode from "@/com/hurlant/crypto/symmetric/CBCMode";
import ICipher from "@/com/hurlant/crypto/symmetric/ICipher";
import IPad from "@/com/hurlant/crypto/symmetric/IPad";
import PKCS5 from "@/com/hurlant/crypto/symmetric/PKCS5";
import Base64 from "@/com/hurlant/util/Base64";
import { boundClass } from 'autobind-decorator';
import ByteArray from "flash/utils/ByteArray";

@boundClass
export default class LevelEncryptor {

    public static encryptString(param1: string, param2: string = ""): string {
        var _loc3_ = new ByteArray();
        _loc3_.writeUTFBytes(param1);
        var _loc4_: IPad = new PKCS5();
        var _loc5_: ICipher = LevelEncryptor.getCipher(param2, _loc4_);
        _loc4_.setBlockSize(_loc5_.getBlockSize());
        _loc5_.encrypt(_loc3_);
        _loc5_.dispose();
        return Base64.encodeByteArray(_loc3_);
    }

    public static decryptString(param1: string, param2: string = ""): string {
        var _loc3_: ByteArray = Base64.decodeToByteArray(param1);
        var _loc4_: IPad = new PKCS5();
        var _loc5_: ICipher = LevelEncryptor.getCipher(param2, _loc4_);
        _loc4_.setBlockSize(_loc5_.getBlockSize());
        _loc5_.decrypt(_loc3_);
        _loc5_.dispose();
        _loc3_.position = 0;
        return _loc3_.readUTFBytes(_loc3_.length);
    }

    public static encryptByteArray(param1: ByteArray, param2: string = "") {
        var _loc3_: IPad = new PKCS5();
        var _loc4_: ICipher = LevelEncryptor.getCipher(param2, _loc3_);
        _loc3_.setBlockSize(_loc4_.getBlockSize());
        _loc4_.encrypt(param1);
        param1.position = 0;
    }

    public static decryptByteArray(param1: ByteArray, param2: string = "") {
        var _loc3_: IPad = new PKCS5();
        var _loc4_: ICipher = LevelEncryptor.getCipher(param2, _loc3_);
        _loc3_.setBlockSize(_loc4_.getBlockSize());
        _loc4_.decrypt(param1);
        param1.position = 0;
    }

    private static getCipher(param1: string, param2: IPad): ICipher {
        var _loc3_ = new ByteArray();
        _loc3_.writeUTFBytes(param1);
        var _loc4_ = new CBCMode(new ButtHoleKey(_loc3_), param2);
        var _loc5_ = new ByteArray();
        _loc5_.writeUTFBytes("abcd1234");
        _loc4_.IV = _loc5_;
        return _loc4_;
    }
}