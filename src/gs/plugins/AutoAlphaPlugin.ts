import TweenLite from "@/gs/TweenLite";
import TweenPlugin from "@/gs/plugins/TweenPlugin";
import { boundClass } from 'autobind-decorator';

@boundClass
export default class AutoAlphaPlugin extends TweenPlugin {
    public static VERSION: number;
    public static API: number = 1;
    protected _tweenVisible: boolean;
    protected _visible: boolean;
    protected _tween: TweenLite;
    protected _target: any;

    constructor() {
        super();
        this.propName = "autoAlpha";
        this.overwriteProps = ["alpha", "visible"];
        this.onComplete = this.onCompleteTween;
    }

    public override onInitTween(
        param1: any,
        param2,
        param3: TweenLite,
    ): boolean {
        this._target = param1;
        this._tween = param3;
        this._visible = !!(param2 != 0);
        this._tweenVisible = true;
        this.addTween(param1, "alpha", param1.alpha, param2, "alpha");
        return true;
    }

    public override killProps(param1: {}) {
        super.killProps(param1);
        this._tweenVisible = !Boolean("visible" in param1);
    }

    public onCompleteTween() {
        if (
            this._tweenVisible &&
            this._tween.vars.runBackwards != true &&
            this._tween.ease == this._tween.vars.ease
        ) {
            this._target.visible = this._visible;
        }
    }

    public override set changeFactor(param1: number) {
        this.updateTweens(param1);
        if (this._target.visible != true && this._tweenVisible) {
            this._target.visible = true;
        }
    }
}