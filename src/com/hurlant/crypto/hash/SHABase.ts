import IHash from "@/com/hurlant/crypto/hash/IHash";
import { boundClass } from 'autobind-decorator';
import ByteArray from "flash/utils/ByteArray";
import Endian from "flash/utils/Endian";

@boundClass
export default class SHABase implements IHash {

    public getInputSize(): number {
        return 64;
    }

    public getHashSize(): number {
        return 0;
    }

    public hash(param1: ByteArray): ByteArray {
        var _loc2_: number = param1.length;
        var _loc3_: string = param1.endian;
        param1.endian = Endian.BIG_ENDIAN;
        var _loc4_: number = _loc2_ * 8;
        while (param1.length % 4 != 0) {
            param1[param1.length] = 0;
        }
        param1.position = 0;
        var _loc5_: any[] = [];
        var _loc6_ = 0;
        while (_loc6_ < param1.length) {
            _loc5_.push(param1.readUnsignedInt());
            _loc6_ += 4;
        }
        var _loc7_: any[] = this.core(_loc5_, _loc4_);
        var _loc8_ = new ByteArray();
        var _loc9_: number = this.getHashSize() / 4;
        _loc6_ = 0;
        while (_loc6_ < _loc9_) {
            _loc8_.writeUnsignedInt(_loc7_[_loc6_]);
            _loc6_++;
        }
        param1.length = _loc2_;
        // @ts-expect-error
        param1.endian = _loc3_;
        return _loc8_;
    }

    protected core(param1: any[], param2: number): any[] {
        return null;
    }

    public toString(): string {
        return "sha";
    }
}