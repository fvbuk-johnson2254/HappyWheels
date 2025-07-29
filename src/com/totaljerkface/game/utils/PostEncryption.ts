import Crypto from "@/com/hurlant/crypto/Crypto";
import Random from "@/com/hurlant/crypto/prng/Random";
import ICipher from "@/com/hurlant/crypto/symmetric/ICipher";
import IPad from "@/com/hurlant/crypto/symmetric/IPad";
import IVMode from "@/com/hurlant/crypto/symmetric/IVMode";
import PKCS5 from "@/com/hurlant/crypto/symmetric/PKCS5";
import Base64 from "@/com/hurlant/util/Base64";
import Hex from "@/com/hurlant/util/Hex";
import { boundClass } from 'autobind-decorator';
import ByteArray from "flash/utils/ByteArray";

@boundClass
export default class PostEncryption {
    private ALGORITHM: string;
    private PADDING: IPad = new PKCS5();
    private keyData: ByteArray;
    private IV: string;

    constructor(param1: string) {
        this.keyData = Hex.toArray(param1);
    }

    public encrypt(param1: string): string {
        var _loc2_: ByteArray = Hex.toArray(Hex.fromString(param1));
        var _loc3_: IPad = this.PADDING;
        var _loc4_: ICipher = Crypto.getCipher(
            this.ALGORITHM,
            this.keyData,
            _loc3_,
        );
        _loc3_.setBlockSize(_loc4_.getBlockSize());
        _loc4_.encrypt(_loc2_);
        // @ts-expect-error
        var _loc5_: IVMode = _loc4_ as IVMode;
        this.IV = Hex.fromArray(_loc5_.IV);
        return Base64.encodeByteArray(_loc2_);
    }

    public getIV(): string {
        return this.IV;
    }

    private genKey(param1: number): string {
        var _loc2_ = new Random();
        var _loc3_ = new ByteArray();
        _loc2_.nextBytes(_loc3_, param1 / 8);
        return Hex.fromArray(_loc3_);
    }
}