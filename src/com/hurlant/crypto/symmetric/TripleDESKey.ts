import DESKey from "@/com/hurlant/crypto/symmetric/DESKey";
import Memory from "@/com/hurlant/util/Memory";
import { boundClass } from 'autobind-decorator';
import ByteArray from "flash/utils/ByteArray";

@boundClass
export default class TripleDESKey extends DESKey {
    protected encKey2: any[];
    protected encKey3: any[];
    protected decKey2: any[];
    protected decKey3: any[];

    constructor(param1: ByteArray) {
        super(param1);
        this.encKey2 = this.generateWorkingKey(false, param1, 8);
        this.decKey2 = this.generateWorkingKey(true, param1, 8);
        if (param1.length > 16) {
            this.encKey3 = this.generateWorkingKey(true, param1, 16);
            this.decKey3 = this.generateWorkingKey(false, param1, 16);
        } else {
            this.encKey3 = this.encKey;
            this.decKey3 = this.decKey;
        }
    }

    public override dispose() {
        super.dispose();
        var _loc1_: number = 0;
        if (this.encKey2 != null) {
            _loc1_ = 0;
            while (_loc1_ < this.encKey2.length) {
                this.encKey2[_loc1_] = 0;
                _loc1_++;
            }
            this.encKey2 = null;
        }
        if (this.encKey3 != null) {
            _loc1_ = 0;
            while (_loc1_ < this.encKey3.length) {
                this.encKey3[_loc1_] = 0;
                _loc1_++;
            }
            this.encKey3 = null;
        }
        if (this.decKey2 != null) {
            _loc1_ = 0;
            while (_loc1_ < this.decKey2.length) {
                this.decKey2[_loc1_] = 0;
                _loc1_++;
            }
            this.decKey2 = null;
        }
        if (this.decKey3 != null) {
            _loc1_ = 0;
            while (_loc1_ < this.decKey3.length) {
                this.decKey3[_loc1_] = 0;
                _loc1_++;
            }
            this.decKey3 = null;
        }
        Memory.gc();
    }

    public override encrypt(param1: ByteArray, param2: number = 0) {
        this.desFunc(this.encKey, param1, param2, param1, param2);
        this.desFunc(this.encKey2, param1, param2, param1, param2);
        this.desFunc(this.encKey3, param1, param2, param1, param2);
    }

    public override decrypt(param1: ByteArray, param2: number = 0) {
        this.desFunc(this.decKey3, param1, param2, param1, param2);
        this.desFunc(this.decKey2, param1, param2, param1, param2);
        this.desFunc(this.decKey, param1, param2, param1, param2);
    }

    public override toString(): string {
        return "3des";
    }
}