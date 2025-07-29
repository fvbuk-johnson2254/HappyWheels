import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import b2Body from "@/Box2D/Dynamics/b2Body";
import Settings from "@/com/totaljerkface/game/Settings";
import AreaSoundInstance from "@/com/totaljerkface/game/sound/AreaSoundInstance";
import AreaSoundLoop from "@/com/totaljerkface/game/sound/AreaSoundLoop";
import AreaSoundLoopStatic from "@/com/totaljerkface/game/sound/AreaSoundLoopStatic";
import PointSoundInstance from "@/com/totaljerkface/game/sound/PointSoundInstance";
import SoundItem from "@/com/totaljerkface/game/sound/SoundItem";
import { boundClass } from 'autobind-decorator';
import EventDispatcher from "flash/events/EventDispatcher";
import Point from "flash/geom/Point";
import Sound from "flash/media/Sound";
import SoundChannel from "flash/media/SoundChannel";
import SoundMixer from "flash/media/SoundMixer";
import SoundTransform from "flash/media/SoundTransform";
import URLRequest from "flash/net/URLRequest";

@boundClass
export default class SoundController extends EventDispatcher {
    private static _instance: SoundController;
    public static SOUND_PATH: string = "com.totaljerkface.game.sound.";
    private _soundList = new Object();
    private _areaSounds: Vector<AreaSoundLoop> = new Vector<AreaSoundLoop>();
    private _center = new Point();
    private _soundOff: boolean;
    private _muted: boolean = false;
    private _systemMuted: boolean = false;

    constructor() {
        super();
        if (Settings.sharedObject.data["muted"] == true) {
            this.mute();
        }
    }

    public static get instance(): SoundController {
        if (SoundController._instance == null) {
            SoundController._instance = new SoundController();
        }
        return SoundController._instance;
    }

    public playSoundItem(
        param1: string,
        param2: number = 0,
        param3: number = 0,
        param4: SoundTransform = null,
    ): SoundItem {
        var _loc5_ = getDefinitionByName(SoundController.SOUND_PATH + param1);
        var stream = new URLRequest(`assets/sounds/${param1}.mp3`);
        var _loc6_: Sound = new Sound(stream);
        return new SoundItem(_loc6_, param2, param3, param4);
    }

    public playSoundLoop(
        param1: string,
        param2: number = 0,
        param3: number = 10000,
        param4: SoundTransform = null,
    ): SoundChannel {
        var _loc5_ = getDefinitionByName(SoundController.SOUND_PATH + param1);
        var stream = new URLRequest(`assets/sounds/${param1}.mp3`);
        var _loc6_: Sound = new Sound(stream);
        return _loc6_.play(param2, param3, param4);
    }

    public playSoundInstance(
        param1: string,
        param2: number = 0,
        param3: number = 0,
        param4: SoundTransform = null,
    ): SoundChannel {
        var _loc5_ = getDefinitionByName(SoundController.SOUND_PATH + param1);
        // @ts-expect-error
        var _loc6_: Sound = new _loc5_();
        return _loc6_.play(param2, param3, param4);
    }

    public playPointSoundInstance(
        param1: string,
        param2: b2Vec2,
        param3: number = 1,
        param4: number = 0,
    ): PointSoundInstance {
        var _loc5_ = getDefinitionByName(SoundController.SOUND_PATH + param1);
        // @ts-expect-error
        var _loc6_: Sound = new _loc5_();
        var _loc7_ = new PointSoundInstance(
            _loc6_,
            param2,
            param3,
            param4,
            this._center,
        );
        if (_loc7_.soundChannel) {
            this._areaSounds.push(_loc7_);
            return _loc7_;
        }
        return null;
    }

    public playAreaSoundInstance(
        param1: string,
        param2: b2Body,
        param3: number = 1,
        param4: number = 0,
    ): AreaSoundInstance {
        var _loc5_ = getDefinitionByName(SoundController.SOUND_PATH + param1);
        // @ts-expect-error
        var _loc6_: Sound = new _loc5_();
        var _loc7_ = new AreaSoundInstance(
            _loc6_,
            param2,
            param3,
            param4,
            this._center,
        );
        if (_loc7_.soundChannel) {
            this._areaSounds.push(_loc7_);
            return _loc7_;
        }
        return null;
    }

    public playAreaSoundLoop(
        param1: string,
        param2: b2Body,
        param3: number = 1,
        param4: number = 0,
    ): AreaSoundLoop {
        var _loc5_ = getDefinitionByName(SoundController.SOUND_PATH + param1);
        // @ts-expect-error
        var _loc6_: Sound = new _loc5_();
        var _loc7_ = new AreaSoundLoop(_loc6_, param2, param3, param4);
        this._areaSounds.push(_loc7_);
        return _loc7_;
    }

    public playAreaSoundLoopStatic(
        param1: string,
        param2: Point,
        param3: number = 1,
        param4: number = 0,
    ): AreaSoundLoopStatic {
        var _loc5_ = getDefinitionByName(SoundController.SOUND_PATH + param1);
        // @ts-expect-error
        var _loc6_: Sound = new _loc5_();
        var _loc7_ = new AreaSoundLoopStatic(_loc6_, param2, param3, param4);
        this._areaSounds.push(_loc7_);
        return _loc7_;
    }

    public step() {
        var _loc2_: AreaSoundLoop = null;
        this._center = Settings.currentSession.camera.midScreenPoint;
        var _loc1_: number = 0;
        while (_loc1_ < this._areaSounds.length) {
            _loc2_ = this._areaSounds[_loc1_];
            if (_loc2_.remove) {
                _loc2_.stopSound();
                this._areaSounds.splice(_loc1_, 1);
                _loc1_--;
            } else {
                _loc2_.areaCheck(this._center);
            }
            _loc1_++;
        }
    }

    public getSound(param1: string): SoundChannel {
        return this._soundList[param1];
    }

    public systemMute() {
        trace("system mute");
        this._systemMuted = true;
        var _loc1_ = new SoundTransform(0, 0);
        SoundMixer.soundTransform = _loc1_;
    }

    public systemUnMute() {
        var _loc1_: SoundTransform = null;
        trace("system unmute");
        this._systemMuted = false;
        if (!this._muted) {
            _loc1_ = new SoundTransform(1, 0);
            SoundMixer.soundTransform = _loc1_;
        }
    }

    public mute() {
        trace("USER mute");
        this._muted = Settings.sharedObject.data["muted"] = true;
        var _loc1_ = new SoundTransform(0, 0);
        SoundMixer.soundTransform = _loc1_;
    }

    public unMute() {
        var _loc1_: SoundTransform = null;
        trace("USER unmute");
        this._muted = Settings.sharedObject.data["muted"] = false;
        if (!this._systemMuted) {
            _loc1_ = new SoundTransform(1, 0);
            SoundMixer.soundTransform = _loc1_;
        }
    }

    public get isMuted(): boolean {
        return this._muted;
    }

    public stopAllSounds() {
        var _loc2_: AreaSoundLoop = null;
        var _loc1_: number = 0;
        while (_loc1_ < this._areaSounds.length) {
            _loc2_ = this._areaSounds[_loc1_];
            _loc2_.stopSound();
            _loc1_++;
        }
        this._areaSounds = new Vector<AreaSoundLoop>();
        SoundMixer.stopAll();
    }
}