import AreaSoundLoop from "@/com/totaljerkface/game/sound/AreaSoundLoop";
import { boundClass } from 'autobind-decorator';
import Point from "flash/geom/Point";
import Sound from "flash/media/Sound";
import SoundTransform from "flash/media/SoundTransform";

@boundClass
export default class AreaSoundLoopStatic extends AreaSoundLoop {
    protected _coordinates: Point;

    constructor(param1: Sound, param2: Point, param3: number, param4: number) {
        super(param1, null, param3, param4);
        this._coordinates = param2;
    }

    protected override calculateSoundTransform(param1: Point): SoundTransform {
        var _loc2_: number = this._coordinates.x - param1.x;
        var _loc3_: number = this._coordinates.y - param1.y;
        var _loc4_: number = Math.abs(_loc2_);
        var _loc5_: number = Math.abs(_loc3_);
        if (
            _loc4_ > AreaSoundLoop.xCutoff ||
            _loc5_ > AreaSoundLoop.yCutoff ||
            this._maxVolume == 0
        ) {
            return null;
        }
        var _loc6_: number =
            (1 - _loc4_ / AreaSoundLoop.xCutoff) * this._maxVolume;
        var _loc7_: number =
            (1 - _loc5_ / AreaSoundLoop.yCutoff) * this._maxVolume;
        var _loc8_: number = Math.min(_loc6_, _loc7_);
        var _loc9_: number = _loc2_ / AreaSoundLoop.xCutoff;
        return new SoundTransform(_loc8_, _loc9_);
    }
}