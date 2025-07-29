import ARC4 from "@/com/hurlant/crypto/prng/ARC4";
import IPRNG from "@/com/hurlant/crypto/prng/IPRNG";
import Memory from "@/com/hurlant/util/Memory";
import { boundClass } from 'autobind-decorator';
import Capabilities from "flash/system/Capabilities";
import System from "flash/system/System";
import Font from "flash/text/Font";
import ByteArray from "flash/utils/ByteArray";

@boundClass
export default class Random {
    private state: IPRNG;
    private ready: boolean = false;
    private pool: ByteArray;
    private psize: number;
    private pptr: number;
    private seeded: boolean = false;

    constructor(param1 = null) {
        var _loc2_ = 0;

        if (param1 == null) {
            param1 = ARC4;
        }
        this.state = new param1() as IPRNG;
        this.psize = this.state.getPoolSize();
        this.pool = new ByteArray();
        this.pptr = 0;
        while (this.pptr < this.psize) {
            _loc2_ = 65536 * Math.random();
            var _loc3_ = this.pptr++;
            this.pool[_loc3_] = _loc2_ >>> 8;
            var _loc4_;
            this.pool[(_loc4_ = this.pptr++)] = _loc2_ & 255;
        }
        this.pptr = 0;
        this.seed();
    }

    public seed(param1: number = 0) {
        if (param1 == 0) {
            param1 = int(new Date().getTime());
        }
        var _loc2_ = this.pptr++;
        this.pool[_loc2_] ^= param1 & 255;
        var _loc3_ = this.pptr++;
        this.pool[_loc3_] ^= (param1 >> 8) & 255;
        var _loc4_;
        this.pool[(_loc4_ = this.pptr++)] =
            this.pool[_loc4_] ^ ((param1 >> 16) & 255);
        var _loc5_;
        this.pool[(_loc5_ = this.pptr++)] =
            this.pool[_loc5_] ^ ((param1 >> 24) & 255);
        this.pptr %= this.psize;
        this.seeded = true;
    }

    public autoSeed() {
        var _loc3_: Font = null;
        var _loc1_ = new ByteArray();
        _loc1_.writeUnsignedInt(System.totalMemory);
        _loc1_.writeUTF(Capabilities.serverString);
        _loc1_.writeUnsignedInt(getTimer());
        _loc1_.writeUnsignedInt(new Date().getTime());
        var _loc2_: any[] = Font.enumerateFonts(true);
        for (let _loc3_ of _loc2_) {
            _loc1_.writeUTF(_loc3_.fontName);
            _loc1_.writeUTF(_loc3_.fontStyle);
            _loc1_.writeUTF(_loc3_.fontType);
        }
        _loc1_.position = 0;
        while (_loc1_.bytesAvailable >= 4) {
            this.seed(_loc1_.readUnsignedInt());
        }
    }

    public nextBytes(param1: ByteArray, param2: number) {
        while (param2--) {
            param1.writeByte(this.nextByte());
        }
    }

    public nextByte(): number {
        if (!this.ready) {
            if (!this.seeded) {
                this.autoSeed();
            }
            this.state.init(this.pool);
            this.pool.length = 0;
            this.pptr = 0;
            this.ready = true;
        }
        return this.state.next();
    }

    public dispose() {
        var _loc1_: number = 0;
        while (_loc1_ < this.pool.length) {
            this.pool[_loc1_] = Math.random() * 256;
            _loc1_++;
        }
        this.pool.length = 0;
        this.pool = null;
        this.state.dispose();
        this.state = null;
        this.psize = 0;
        this.pptr = 0;
        Memory.gc();
    }

    public toString(): string {
        return "random-" + this.state.toString();
    }
}