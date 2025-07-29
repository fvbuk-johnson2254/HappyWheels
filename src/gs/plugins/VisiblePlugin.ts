import TweenLite from "@/gs/TweenLite";
import TweenPlugin from "@/gs/plugins/TweenPlugin";
import { boundClass } from 'autobind-decorator';

@boundClass
export default class VisiblePlugin extends TweenPlugin {
    public static VERSION: number;
    public static API: number = 1;
    protected _target: any;
    protected _tween: TweenLite;
    protected _visible: boolean;

    constructor() {
        super();
        this.propName = "visible";
        this.overwriteProps = ["visible"];
        this.onComplete = this.onCompleteTween;
    }

    public override onInitTween(
        param1: {},
        param2,
        param3: TweenLite,
    ): boolean {
        this._target = param1;
        this._tween = param3;
        this._visible = !!param2;
        return true;
    }

    public onCompleteTween() {
        if (
            this._tween.vars.runBackwards != true &&
            this._tween.ease == this._tween.vars.ease
        ) {
            this._target.visible = this._visible;
        }
    }

    public override set changeFactor(param1: number) {
        if (this._target.visible != true) {
            this._target.visible = true;
        }
    }
}