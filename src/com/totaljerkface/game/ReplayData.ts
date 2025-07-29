import MouseData from "@/com/totaljerkface/game/level/MouseData";
import { boundClass } from 'autobind-decorator';
import EventDispatcher from "flash/events/EventDispatcher";
import ByteArray from "flash/utils/ByteArray";

@boundClass
export default class ReplayData extends EventDispatcher {
    public static REPLAY_LOADED: string;
    private _keyByteArray: ByteArray;
    private _mouseByteArray: ByteArray;
    private _completed: boolean;

    constructor() {
        super();
        this._keyByteArray = new ByteArray();
        this._mouseByteArray = new ByteArray();
    }

    public get byteArray(): ByteArray {
        var _loc1_ = new ByteArray();
        _loc1_.writeBytes(this._keyByteArray, 0, this._keyByteArray.length);
        if (this._mouseByteArray.length > 0) {
            _loc1_.writeByte(255);
            _loc1_.writeBytes(
                this._mouseByteArray,
                0,
                this._mouseByteArray.length,
            );
        }
        return _loc1_;
    }

    public set byteArray(param1: ByteArray) {
        this.parseByteArray(param1);
    }

    private parseByteArray(param1: ByteArray) {
        var _loc2_: number = 0;
        var _loc4_ = 0;
        var _loc3_: number = 0;
        while (_loc3_ < param1.length) {
            _loc4_ = uint(param1[_loc3_]);
            if (_loc4_ == 255) {
                _loc2_ = int(_loc3_);
                break;
            }
            _loc3_++;
        }
        if (!_loc2_) {
            this._keyByteArray = param1;
            this._mouseByteArray = new ByteArray();
        } else {
            this._keyByteArray = new ByteArray();
            this._keyByteArray.writeBytes(param1, 0, _loc2_);
            this._mouseByteArray = new ByteArray();
            this._mouseByteArray.writeBytes(
                param1,
                _loc2_ + 1,
                param1.length - (_loc2_ + 1),
            );
        }
    }

    public addKeyEntry(param1: string, param2: number) {
        var _loc3_: number = parseInt(param1, 2);
        this._keyByteArray.writeByte(_loc3_);
    }

    public getKeyEntry(param1: number): string {
        var _loc2_ = int(this._keyByteArray[param1]);
        var _loc3_: string = _loc2_.toString(2);
        return this.completeByte(_loc3_);
    }

    public addMouseEntry(param1: number, param2: number, param3: number = 0) {
        var _loc4_: string = param1.toString(2);
        if (param1 > 32767) {
            param1 = 32767;
        }
        if (param2 > 65535) {
            param2 = 65535;
        }
        if (param3 > 0) {
            param1 += 32768;
            _loc4_ = param1.toString(2);
        }
        this._mouseByteArray.writeShort(param1);
        this._mouseByteArray.writeShort(param2);
    }

    public getMouseClickMap(): {} {
        var _loc3_: number = 0;
        var _loc4_: number = 0;
        var _loc5_: boolean = false;
        var _loc6_: boolean = false;
        var _loc7_: string = null;
        var _loc8_: MouseData = null;
        var _loc1_ = new Object();
        this._mouseByteArray.position = 0;
        var _loc2_ = int(this._mouseByteArray.length);
        while (this._mouseByteArray.position < _loc2_) {
            _loc3_ = int(this._mouseByteArray.readUnsignedShort());
            _loc4_ = int(this._mouseByteArray.readUnsignedShort());
            trace(_loc3_.toString(2));
            _loc5_ = false;
            _loc6_ = false;
            if (_loc3_ > 32767) {
                _loc3_ -= 32768;
                _loc6_ = true;
            } else {
                _loc5_ = true;
            }
            _loc7_ = _loc3_.toString();
            if (_loc1_[_loc7_]) {
                _loc8_ = _loc1_[_loc7_];
            } else {
                _loc8_ = new MouseData();
                if (_loc6_) {
                    _loc8_.first = 1;
                }
            }
            if (_loc5_) {
                _loc8_.click = _loc5_;
                _loc8_.clickTriggerIndex = _loc4_;
            } else if (_loc6_) {
                _loc8_.rollOut = _loc6_;
                _loc8_.rollOutTriggerIndex = _loc4_;
            }
            _loc1_[_loc7_] = _loc8_;
        }
        this._mouseByteArray.position = 0;
        return _loc1_;
    }

    private completeByte(param1: string, param2: number = 8): string {
        while (param1.length < param2) {
            param1 = "0" + param1;
        }
        return param1;
    }

    public resetPosition() {
        this._keyByteArray.position = 0;
        this._mouseByteArray.position = 0;
    }

    public reset() {
        this._keyByteArray = new ByteArray();
        this._mouseByteArray = new ByteArray();
        this.resetPosition();
    }

    public getLength(): number {
        return this._keyByteArray.length;
    }

    public get completed(): boolean {
        return this._completed;
    }

    public set completed(param1: boolean) {
        this._completed = param1;
    }
}