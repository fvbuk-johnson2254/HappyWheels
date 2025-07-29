import Random from "@/com/hurlant/crypto/prng/Random";
import ISymmetricKey from "@/com/hurlant/crypto/symmetric/ISymmetricKey";
import Memory from "@/com/hurlant/util/Memory";
import { boundClass } from 'autobind-decorator';
import ByteArray from "flash/utils/ByteArray";

@boundClass
export default class XTeaKey implements ISymmetricKey {
    public NUM_ROUNDS: number;
    private k: any[];

    constructor(param1: ByteArray) {
        param1.position = 0;
        this.k = [
            param1.readUnsignedInt(),
            param1.readUnsignedInt(),
            param1.readUnsignedInt(),
            param1.readUnsignedInt(),
        ];
    }

    public static parseKey(param1: string): XTeaKey {
        var _loc2_ = new ByteArray();
        _loc2_.writeUnsignedInt(parseInt(param1.substr(0, 8), 16));
        _loc2_.writeUnsignedInt(parseInt(param1.substr(8, 8), 16));
        _loc2_.writeUnsignedInt(parseInt(param1.substr(16, 8), 16));
        _loc2_.writeUnsignedInt(parseInt(param1.substr(24, 8), 16));
        _loc2_.position = 0;
        return new XTeaKey(_loc2_);
    }

    public getBlockSize(): number {
        return 8;
    }

    public encrypt(param1: ByteArray, param2: number = 0) {
        var _loc5_: number = 0;
        param1.position = param2;
        var _loc3_: number = param1.readUnsignedInt();
        var _loc4_: number = param1.readUnsignedInt();
        var _loc6_ = 0;
        var _loc7_: number = 2654435769;
        _loc5_ = 0;
        while (_loc5_ < this.NUM_ROUNDS) {
            _loc3_ +=
                (((_loc4_ << 4) ^ (_loc4_ >> 5)) + _loc4_) ^
                (_loc6_ + this.k[_loc6_ & 3]);
            _loc6_ += _loc7_;
            _loc4_ +=
                (((_loc3_ << 4) ^ (_loc3_ >> 5)) + _loc3_) ^
                (_loc6_ + this.k[(_loc6_ >> 11) & 3]);
            _loc5_++;
        }
        param1.position -= 8;
        param1.writeUnsignedInt(_loc3_);
        param1.writeUnsignedInt(_loc4_);
    }

    public decrypt(param1: ByteArray, param2: number = 0) {
        var _loc5_: number = 0;
        param1.position = param2;
        var _loc3_: number = param1.readUnsignedInt();
        var _loc4_: number = param1.readUnsignedInt();
        var _loc6_: number = 2654435769;
        var _loc7_: number = _loc6_ * this.NUM_ROUNDS;
        _loc5_ = 0;
        while (_loc5_ < this.NUM_ROUNDS) {
            _loc4_ -=
                (((_loc3_ << 4) ^ (_loc3_ >> 5)) + _loc3_) ^
                (_loc7_ + this.k[(_loc7_ >> 11) & 3]);
            _loc7_ -= _loc6_;
            _loc3_ -=
                (((_loc4_ << 4) ^ (_loc4_ >> 5)) + _loc4_) ^
                (_loc7_ + this.k[_loc7_ & 3]);
            _loc5_++;
        }
        param1.position -= 8;
        param1.writeUnsignedInt(_loc3_);
        param1.writeUnsignedInt(_loc4_);
    }

    public dispose() {
        var _loc1_ = new Random();
        var _loc2_: number = 0;
        while (_loc2_ < this.k.length) {
            this.k[_loc2_] = _loc1_.nextByte();
            delete this.k[_loc2_];
            _loc2_++;
        }
        this.k = null;
        Memory.gc();
    }

    public toString(): string {
        return "xtea";
    }
}