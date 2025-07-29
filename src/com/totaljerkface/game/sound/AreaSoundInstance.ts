import b2Body from "@/Box2D/Dynamics/b2Body";
import AreaSoundLoop from "@/com/totaljerkface/game/sound/AreaSoundLoop";
import { boundClass } from 'autobind-decorator';
import Event from "flash/events/Event";
import Point from "flash/geom/Point";
import Sound from "flash/media/Sound";
import SoundTransform from "flash/media/SoundTransform";

@boundClass
export default class AreaSoundInstance extends AreaSoundLoop {
    public static AREA_SOUND_STOP: string;

    constructor(
        param1: Sound,
        param2: b2Body,
        param3: number,
        param4: number,
        param5: Point,
    ) {
        super(param1, param2, param3, param4);
        var _loc6_: SoundTransform = this.calculateSoundTransform(param5);
        if (_loc6_) {
            this._soundChannel = this._sound.play(this._startTime, 0, _loc6_);
            if (this._soundChannel) {
                this._soundChannel.addEventListener(
                    Event.SOUND_COMPLETE,
                    this.soundComplete,
                );
            }
        } else {
            this.dispatchEvent(new Event(AreaSoundInstance.AREA_SOUND_STOP));
        }
    }

    public override areaCheck(param1: Point) {
        var _loc2_: SoundTransform = this.calculateSoundTransform(param1);
        if (!_loc2_) {
            this.stopSound();
            return;
        }
        this._soundChannel.soundTransform = _loc2_;
    }

    private soundComplete(param1: Event) {
        this._soundChannel.removeEventListener(
            Event.SOUND_COMPLETE,
            this.soundComplete,
        );
        this._soundChannel = null;
        this._remove = true;
        this.dispatchEvent(new Event(AreaSoundInstance.AREA_SOUND_STOP));
    }

    public override stopSound(param1: boolean = true) {
        if (this._soundChannel) {
            this._soundChannel.removeEventListener(
                Event.SOUND_COMPLETE,
                this.soundComplete,
            );
            this._soundChannel.stop();
            this._soundChannel = null;
            if (param1) {
                this._remove = true;
            }
            this.dispatchEvent(new Event(AreaSoundInstance.AREA_SOUND_STOP));
        }
    }
}