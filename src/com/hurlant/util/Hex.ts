import { boundClass } from 'autobind-decorator';
import ByteArray from "flash/utils/ByteArray";

@boundClass
export default class Hex {

    public static toArray(param1: string): ByteArray {
        param1 = param1.replace(/\s|:/gm, "");
        var _loc2_ = new ByteArray();
        if (param1.length & 1) {
            param1 = "0" + param1;
        }
        var _loc3_ = 0;
        while (_loc3_ < param1.length) {
            _loc2_[_loc3_ / 2] = parseInt(param1.substr(_loc3_, 2), 16);
            _loc3_ += 2;
        }
        return _loc2_;
    }

    public static fromArray(
        param1: ByteArray,
        param2: boolean = false,
    ): string {
        var _loc3_ = "";
        var _loc4_: number = 0;
        while (_loc4_ < param1.length) {
            _loc3_ += ("0" + param1[_loc4_].toString(16)).substr(-2, 2);
            if (param2) {
                if (_loc4_ < param1.length - 1) {
                    _loc3_ += ":";
                }
            }
            _loc4_++;
        }
        return _loc3_;
    }

    public static toString(param1: string): string {
        var _loc2_: ByteArray = Hex.toArray(param1);
        return _loc2_.readUTFBytes(_loc2_.length);
    }

    public static fromString(param1: string, param2: boolean = false): string {
        var _loc3_ = new ByteArray();
        _loc3_.writeUTFBytes(param1);
        return Hex.fromArray(_loc3_, param2);
    }
}