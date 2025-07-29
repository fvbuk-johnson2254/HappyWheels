import TweenLite from "@/gs/TweenLite";
import { boundClass } from 'autobind-decorator';
import EventDispatcher from "flash/events/EventDispatcher";
import Sound from "flash/media/Sound";
import SoundChannel from "flash/media/SoundChannel";
import SoundTransform from "flash/media/SoundTransform";

@boundClass
export default class SoundItem extends EventDispatcher {
    protected _sound: Sound;
    protected _soundChannel: SoundChannel;
    protected _volume: number = 1;

    constructor(
        param1: Sound,
        param2: number = 0,
        param3: number = 0,
        param4: SoundTransform = null,
    ) {
        super();
        this._sound = param1;
        this._soundChannel = this._sound.play(param2, param3, param4);
    }

    public stopSound() {
        this._soundChannel.stop();
    }

    public fadeIn(param1: number) {
        TweenLite.killTweensOf(this);
        TweenLite.to(this, param1, {
            volume: 1,
            onComplete: this.fadeInComplete,
        });
    }

    private fadeInComplete() { }

    public fadeOut(param1: number) {
        TweenLite.killTweensOf(this);
        TweenLite.to(this, param1, {
            volume: 0,
            onComplete: this.fadeOutComplete,
        });
    }

    private fadeOutComplete() { }

    public get soundChannel(): SoundChannel {
        return this._soundChannel;
    }

    public get sound(): Sound {
        return this._sound;
    }

    public get volume(): number {
        return this._volume;
    }

    public set volume(param1: number) {
        this._volume = param1;
        this._soundChannel.soundTransform = new SoundTransform(this._volume, 0);
    }
}