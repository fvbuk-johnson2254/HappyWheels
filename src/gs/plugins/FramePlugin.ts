import TweenLite from "@/gs/TweenLite";
import TweenPlugin from "@/gs/plugins/TweenPlugin";
import { boundClass } from 'autobind-decorator';
import MovieClip from "flash/display/MovieClip";

@boundClass
export default class FramePlugin extends TweenPlugin {
    public static VERSION: number;
    public static API: number = 1;
    public frame: number;
    protected _target: MovieClip;

    constructor() {
        super();
        this.propName = "frame";
        this.overwriteProps = ["frame"];
        this.round = true;
    }

    public override onInitTween(
        param1: {},
        param2,
        param3: TweenLite,
    ): boolean {
        if (!(param1 instanceof MovieClip) || isNaN(param2)) {
            return false;
        }
        this._target = param1 as MovieClip;
        this.frame = this._target.currentFrame;
        this.addTween(this, "frame", this.frame, param2, "frame");
        return true;
    }

    public override set changeFactor(param1: number) {
        this.updateTweens(param1);
        this._target.gotoAndStop(this.frame);
    }
}