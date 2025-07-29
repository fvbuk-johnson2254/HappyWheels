import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import b2Body from "@/Box2D/Dynamics/b2Body";
import TweenLite from "@/gs/TweenLite";
import { boundClass } from 'autobind-decorator';
import EventDispatcher from "flash/events/EventDispatcher";
import Point from "flash/geom/Point";
import Sound from "flash/media/Sound";
import SoundChannel from "flash/media/SoundChannel";
import SoundTransform from "flash/media/SoundTransform";

@boundClass
export default class AreaSoundLoop extends EventDispatcher {
    protected static xCutoff: number;
    protected static yCutoff: number = 8;
    protected _sourceObject: b2Body;
    protected _sound: Sound;
    protected _soundChannel: SoundChannel;
    protected _maxVolume: number = 1;
    protected _startTime: number = 0;
    protected _remove: boolean;

    constructor(param1: Sound, param2: b2Body, param3: number, param4: number) {
        super();
        this._sourceObject = param2;
        this._sound = param1;
        this._maxVolume = param3;
        this._startTime = param4;
    }

    public areaCheck(param1: Point) {
        var _loc2_: SoundTransform = this.calculateSoundTransform(param1);
        if (!_loc2_) {
            this.stopSound(false);
            return;
        }
        if (!this._soundChannel) {
            this._soundChannel = this._sound.play(
                this._startTime,
                10000,
                _loc2_,
            );
        } else {
            this._soundChannel.soundTransform = _loc2_;
        }
    }

    protected calculateSoundTransform(param1: Point): SoundTransform {
        var _loc2_: b2Vec2 = this._sourceObject.GetWorldCenter();
        var _loc3_: number = _loc2_.x - param1.x;
        var _loc4_: number = _loc2_.y - param1.y;
        var _loc5_: number = Math.abs(_loc3_);
        var _loc6_: number = Math.abs(_loc4_);
        if (
            _loc5_ > AreaSoundLoop.xCutoff ||
            _loc6_ > AreaSoundLoop.yCutoff ||
            this._maxVolume == 0
        ) {
            return null;
        }
        var _loc7_: number =
            (1 - _loc5_ / AreaSoundLoop.xCutoff) * this._maxVolume;
        var _loc8_: number =
            (1 - _loc6_ / AreaSoundLoop.yCutoff) * this._maxVolume;
        var _loc9_: number = Math.min(_loc7_, _loc8_);
        var _loc10_: number = _loc3_ / AreaSoundLoop.xCutoff;
        return new SoundTransform(_loc9_, _loc10_);
    }

    public stopSound(param1: boolean = true) {
        if (this._soundChannel) {
            this._soundChannel.stop();
            this._soundChannel = null;
            if (param1) {
                this._remove = true;
            }
        } else if (param1) {
            this._remove = true;
        }
    }

    public fadeIn(param1: number) {
        TweenLite.killTweensOf(this);
        this._remove = false;
        TweenLite.to(this, param1, {
            maxVolume: 1,
            onComplete: this.fadeInComplete,
        });
    }

    private fadeInComplete() { }

    public fadeOut(param1: number) {
        TweenLite.killTweensOf(this);
        TweenLite.to(this, param1, {
            maxVolume: 0,
            onComplete: this.fadeOutComplete,
        });
    }

    private fadeOutComplete() {
        this._remove = true;
    }

    public fadeTo(param1: number, param2: number) {
        TweenLite.killTweensOf(this);
        this._remove = false;
        TweenLite.to(this, param2, { maxVolume: param1 });
    }

    public get soundChannel(): SoundChannel {
        return this._soundChannel;
    }

    public get sound(): Sound {
        return this._sound;
    }

    public get maxVolume(): number {
        return this._maxVolume;
    }

    public set maxVolume(param1: number) {
        this._maxVolume = param1;
    }

    public get remove(): boolean {
        return this._remove;
    }
}