import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import AreaSoundInstance from "@/com/totaljerkface/game/sound/AreaSoundInstance";
import AreaSoundLoop from "@/com/totaljerkface/game/sound/AreaSoundLoop";
import { boundClass } from 'autobind-decorator';
import Point from "flash/geom/Point";
import Sound from "flash/media/Sound";
import SoundTransform from "flash/media/SoundTransform";

@boundClass
export default class PointSoundInstance extends AreaSoundInstance {
    protected _point: b2Vec2;

    constructor(
        param1: Sound,
        param2: b2Vec2,
        param3: number,
        param4: number,
        param5: Point,
    ) {
        super(param1, null, param3, param4, param5);
        this._point = param2.Copy();
    }

    protected override calculateSoundTransform(param1: Point): SoundTransform {
        var _loc2_: number = this._point.x - param1.x;
        var _loc3_: number = this._point.y - param1.y;
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