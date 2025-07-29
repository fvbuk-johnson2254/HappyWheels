import AutoAlphaPlugin from "@/gs/plugins/AutoAlphaPlugin";
import EndArrayPlugin from "@/gs/plugins/EndArrayPlugin";
import FramePlugin from "@/gs/plugins/FramePlugin";
import RemoveTintPlugin from "@/gs/plugins/RemoveTintPlugin";
import TintPlugin from "@/gs/plugins/TintPlugin";
import TweenPlugin from "@/gs/plugins/TweenPlugin";
import VisiblePlugin from "@/gs/plugins/VisiblePlugin";
import VolumePlugin from "@/gs/plugins/VolumePlugin";
import TweenInfo from "@/gs/utils/tween/TweenInfo";
import { boundClass } from 'autobind-decorator';
import DisplayObject from "flash/display/DisplayObject";
import Sprite from "flash/display/Sprite";
import Event from "flash/events/Event";
import TimerEvent from "flash/events/TimerEvent";
import Timer from "flash/utils/Timer";

@boundClass
export default class TweenLite {
    public static overwriteManager: any;
    public static currentTime: number;
    private static _tlInitted: boolean;
    public static version: number = 10.092;
    public static plugins = {};
    public static killDelayedCallsTo: Function = TweenLite.killTweensOf;
    public static defaultEase: Function = TweenLite.easeOut;
    public static masterList = new Dictionary(false);
    public static timingSprite = new Sprite();
    private static _timer = new Timer(2000);
    protected static _reservedProps = {
        ease: 1,
        delay: 1,
        overwrite: 1,
        onComplete: 1,
        onCompleteParams: 1,
        runBackwards: 1,
        startAt: 1,
        onUpdate: 1,
        onUpdateParams: 1,
        roundProps: 1,
        onStart: 1,
        onStartParams: 1,
        persist: 1,
        renderOnStart: 1,
        proxiedEase: 1,
        easeParams: 1,
        yoyo: 1,
        loop: 1,
        onCompleteListener: 1,
        onUpdateListener: 1,
        onStartListener: 1,
        orientToBezier: 1,
        timeScale: 1,
    };
    public duration: number;
    public vars: any;
    public delay: number;
    public startTime: number;
    public initTime: number;
    public tweens: any[];
    public target: any;
    public active: boolean;
    public ease: Function;
    public initted: boolean;
    public combinedTimeScale: number;
    public gc: boolean;
    public started: boolean;
    public exposedVars: any;
    protected _hasPlugins: boolean;
    protected _hasUpdate: boolean;

    constructor(target: any, duration: number, vars: any) {
        if (target == null) {
            return;
        }
        if (!TweenLite._tlInitted) {
            TweenPlugin.activate([
                TintPlugin,
                RemoveTintPlugin,
                FramePlugin,
                AutoAlphaPlugin,
                VisiblePlugin,
                VolumePlugin,
                EndArrayPlugin,
            ]);
            TweenLite.currentTime = getTimer();
            TweenLite.timingSprite.addEventListener(
                Event.ENTER_FRAME,
                TweenLite.updateAll,
                false,
                0,
                true,
            );
            if (TweenLite.overwriteManager == null) {
                TweenLite.overwriteManager = {
                    mode: 1,
                    enabled: false,
                };
            }
            TweenLite._timer.addEventListener(
                "timer",
                TweenLite.killGarbage,
                false,
                0,
                true,
            );
            TweenLite._timer.start();
            TweenLite._tlInitted = true;
        }
        this.vars = vars;
        this.duration = duration || 1;
        this.delay = Number(vars.delay) || 0;
        this.combinedTimeScale = Number(vars.timeScale) || 1;
        this.active = !!(duration == 0 && this.delay == 0);
        this.target = target;
        if (typeof this.vars.ease != "function") {
            this.vars.ease = TweenLite.defaultEase;
        }
        if (this.vars.easeParams != null) {
            this.vars.proxiedEase = this.vars.ease;
            this.vars.ease = this.easeProxy;
        }
        this.ease = this.vars.ease;
        this.exposedVars =
            this.vars.isTV == true ? this.vars.exposedVars : this.vars;
        this.tweens = [];
        this.initTime = TweenLite.currentTime;
        this.startTime = this.initTime + this.delay * 1000;
        var _loc4_: number =
            vars.overwrite == undefined ||
                (!TweenLite.overwriteManager.enabled && vars.overwrite > 1)
                ? int(TweenLite.overwriteManager.mode)
                : int(vars.overwrite);
        if (!(TweenLite.masterList.has(target)) || _loc4_ == 1) {
            TweenLite.masterList.set(target, [this]);
        } else {
            TweenLite.masterList.set(target, [...(TweenLite.masterList.get(target) as any[]), this]);
        }
        if (
            (this.vars.runBackwards == true &&
                this.vars.renderOnStart != true) ||
            this.active
        ) {
            this.initTweenVals();
            if (this.active) {
                this.render(this.startTime + 1);
            } else {
                this.render(this.startTime);
            }
            if (
                this.exposedVars.visible != null &&
                this.vars.runBackwards == true &&
                this.target instanceof DisplayObject
            ) {
                this.target.visible = this.exposedVars.visible;
            }
        }
    }

    public static to(target: any, duration: number, vars: any): TweenLite {
        return new TweenLite(target, duration, vars);
    }

    public static from(param1: any, param2: number, param3: any): TweenLite {
        param3.runBackwards = true;
        return new TweenLite(param1, param2, param3);
    }

    public static delayedCall(
        param1: number,
        param2: Function,
        param3: any[] = null,
    ): TweenLite {
        return new TweenLite(param2, 0, {
            delay: param1,
            onComplete: param2,
            onCompleteParams: param3,
            overwrite: 0,
        });
    }

    public static updateAll(param1: Event = null) {
        var _loc4_: any[] = null;
        var index: number = 0;
        var tween: TweenLite = null;
        var currentTime = uint((TweenLite.currentTime = getTimer()));
        var masterList: Dictionary<any, any> = TweenLite.masterList;
        for (let _loc4_ of masterList.values()) {
            index = _loc4_.length - 1;
            while (index > -1) {
                tween = _loc4_[index];
                if (tween.active) {
                    tween.render(currentTime);
                } else if (tween.gc) {
                    _loc4_.splice(index, 1);
                } else if (currentTime >= tween.startTime) {
                    tween.activate();
                    tween.render(currentTime);
                }
                index--;
            }
        }
    }

    public static removeTween(param1: TweenLite, param2: boolean = true) {
        if (param1 != null) {
            if (param2) {
                param1.clear();
            }
            param1.enabled = false;
        }
    }

    public static killTweensOf(param1: any = null, param2: boolean = false) {
        var _loc3_: any[] = null;
        var _loc4_: number = 0;
        var _loc5_: TweenLite = null;
        if (param1 != null && TweenLite.masterList.has(param1)) {
            // @ts-expect-error
            _loc3_ = TweenLite.masterList.get(param1);
            _loc4_ = int(_loc3_.length - 1);
            while (_loc4_ > -1) {
                _loc5_ = _loc3_[_loc4_];
                if (param2 && !_loc5_.gc) {
                    _loc5_.complete(false);
                }
                _loc5_.clear();
                _loc4_--;
            }
            TweenLite.masterList.delete(param1);
        }
    }

    protected static killGarbage(param1: TimerEvent) {
        var key: any = null;
        var masterList: Dictionary<any, any> = TweenLite.masterList;
        for (key of masterList.keys()) {
            if (!masterList.get(key)?.length) {
                masterList.delete(key);
            }
        }
    }

    public static easeOut(
        param1: number,
        param2: number,
        param3: number,
        param4: number,
    ): number {
        return -param3 * (param1 = param1 / param4) * (param1 - 2) + param2;
    }

    public initTweenVals() {
        var _loc1_: string = null;
        var _loc2_: number = 0;
        var _loc3_ = undefined;
        var _loc4_: TweenInfo = null;
        if (
            this.exposedVars.timeScale != undefined &&
            Boolean(this.target.hasOwnProperty("timeScale"))
        ) {
            this.tweens[this.tweens.length] = new TweenInfo(
                this.target,
                "timeScale",
                this.target.timeScale,
                this.exposedVars.timeScale - this.target.timeScale,
                "timeScale",
                false,
            );
        }
        for (_loc1_ in this.exposedVars) {
            if (!(_loc1_ in TweenLite._reservedProps)) {
                if (_loc1_ in TweenLite.plugins) {
                    _loc3_ = new TweenLite.plugins[_loc1_]();
                    if (
                        _loc3_.onInitTween(
                            this.target,
                            this.exposedVars[_loc1_],
                            this,
                        ) == false
                    ) {
                        this.tweens[this.tweens.length] = new TweenInfo(
                            this.target,
                            _loc1_,
                            this.target[_loc1_],
                            typeof this.exposedVars[_loc1_] == "number"
                                ? this.exposedVars[_loc1_] - this.target[_loc1_]
                                : Number(this.exposedVars[_loc1_]),
                            _loc1_,
                            false,
                        );
                    } else {
                        this.tweens[this.tweens.length] = new TweenInfo(
                            _loc3_,
                            "changeFactor",
                            0,
                            1,
                            _loc3_.overwriteProps.length == 1
                                ? _loc3_.overwriteProps[0]
                                : "_MULTIPLE_",
                            true,
                        );
                        this._hasPlugins = true;
                    }
                } else {
                    this.tweens[this.tweens.length] = new TweenInfo(
                        this.target,
                        _loc1_,
                        this.target[_loc1_],
                        typeof this.exposedVars[_loc1_] == "number"
                            ? this.exposedVars[_loc1_] - this.target[_loc1_]
                            : Number(this.exposedVars[_loc1_]),
                        _loc1_,
                        false,
                    );
                }
            }
        }
        if (this.vars.runBackwards == true) {
            _loc2_ = int(this.tweens.length - 1);
            while (_loc2_ > -1) {
                _loc4_ = this.tweens[_loc2_];
                _loc4_.start += _loc4_.change;
                _loc4_.change = -_loc4_.change;
                _loc2_--;
            }
        }
        if (this.vars.onUpdate != null) {
            this._hasUpdate = true;
        }
        if (
            Boolean(TweenLite.overwriteManager.enabled) &&
            TweenLite.masterList.has(this.target)
        ) {
            TweenLite.overwriteManager.manageOverwrites(
                this,
                TweenLite.masterList.get(this.target),
            );
        }
        this.initted = true;
    }

    public activate() {
        this.started = this.active = true;
        if (!this.initted) {
            this.initTweenVals();
        }
        if (this.vars.onStart != null) {
            this.vars.onStart.apply(null, this.vars.onStartParams);
        }
        if (this.duration == 0.001) {
            --this.startTime;
        }
    }

    public render(param1: number) {
        var _loc3_: number = NaN;
        var _loc4_: TweenInfo = null;
        var _loc5_: number = 0;
        var _loc2_: number = (param1 - this.startTime) * 0.001;
        if (_loc2_ >= this.duration) {
            _loc2_ = this.duration;
            _loc3_ =
                this.ease == this.vars.ease || this.duration == 0.001 ? 1 : 0;
        } else {
            _loc3_ = this.ease(_loc2_, 0, 1, this.duration);
        }
        _loc5_ = int(this.tweens.length - 1);
        while (_loc5_ > -1) {
            _loc4_ = this.tweens[_loc5_];
            _loc4_.target[_loc4_.property] =
                _loc4_.start + _loc3_ * _loc4_.change;
            _loc5_--;
        }
        if (this._hasUpdate) {
            this.vars.onUpdate.apply(null, this.vars.onUpdateParams);
        }
        if (_loc2_ == this.duration) {
            this.complete(true);
        }
    }

    public complete(param1: boolean = false) {
        var _loc2_: number = 0;
        if (!param1) {
            if (!this.initted) {
                this.initTweenVals();
            }
            this.startTime =
                TweenLite.currentTime -
                (this.duration * 1000) / this.combinedTimeScale;
            this.render(TweenLite.currentTime);
            return;
        }
        if (this._hasPlugins) {
            _loc2_ = int(this.tweens.length - 1);
            while (_loc2_ > -1) {
                if (
                    Boolean(this.tweens[_loc2_].isPlugin) &&
                    this.tweens[_loc2_].target.onComplete != null
                ) {
                    this.tweens[_loc2_].target.onComplete();
                }
                _loc2_--;
            }
        }
        if (this.vars.persist != true) {
            this.enabled = false;
        }
        if (this.vars.onComplete != null) {
            this.vars.onComplete.apply(null, this.vars.onCompleteParams);
        }
    }

    public clear() {
        this.tweens = [];
        this.vars = this.exposedVars = { ease: this.vars.ease };
        this._hasUpdate = false;
    }

    public killVars(param1: any) {
        if (TweenLite.overwriteManager.enabled) {
            TweenLite.overwriteManager.killVars(
                param1,
                this.exposedVars,
                this.tweens,
            );
        }
    }

    protected easeProxy(
        param1: number,
        param2: number,
        param3: number,
        param4: number,
    ): number {
        return this.vars.proxiedEase.apply(
            null,
            // @ts-expect-error
            arguments.concat(this.vars.easeParams),
        );
    }

    public get enabled(): boolean {
        return this.gc ? false : true;
    }

    public set enabled(param1: boolean) {
        var _loc2_: any[] = null;
        var _loc3_: boolean = false;
        var _loc4_: number = 0;
        if (param1) {
            if (!(TweenLite.masterList.has(this.target))) {
                TweenLite.masterList.set(this.target, [this]);
            } else {
                // @ts-expect-error
                _loc2_ = TweenLite.masterList.get(this.target);
                _loc4_ = int(_loc2_.length - 1);
                while (_loc4_ > -1) {
                    if (_loc2_[_loc4_] == this) {
                        _loc3_ = true;
                        break;
                    }
                    _loc4_--;
                }
                if (!_loc3_) {
                    _loc2_[_loc2_.length] = this;
                }
            }
        }
        this.gc = param1 ? false : true;
        if (this.gc) {
            this.active = false;
        } else {
            this.active = this.started;
        }
    }
}