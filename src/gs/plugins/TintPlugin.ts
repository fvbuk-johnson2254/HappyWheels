import TweenPlugin from "@/gs/plugins/TweenPlugin";
import TweenLite from "@/gs/TweenLite";
import TweenInfo from "@/gs/utils/tween/TweenInfo";
import { boundClass } from 'autobind-decorator';
import DisplayObject from "flash/display/DisplayObject";
import ColorTransform from "flash/geom/ColorTransform";

@boundClass
export default class TintPlugin extends TweenPlugin {
    public static VERSION: number;
    public static API: number = 1;
    protected static _props: any[] = [
        "redMultiplier",
        "greenMultiplier",
        "blueMultiplier",
        "alphaMultiplier",
        "redOffset",
        "greenOffset",
        "blueOffset",
        "alphaOffset",
    ];
    protected _target: DisplayObject;
    protected _ct: ColorTransform;
    protected _ignoreAlpha: boolean;

    constructor() {
        super();
        this.propName = "tint";
        this.overwriteProps = ["tint"];
    }

    public override onInitTween(
        param1: {},
        param2,
        param3: TweenLite,
    ): boolean {
        if (!(param1 instanceof DisplayObject)) {
            return false;
        }
        var _loc4_ = new ColorTransform();
        if (param2 != null && param3.exposedVars.removeTint != true) {
            _loc4_.color = uint(param2);
        }
        this._ignoreAlpha = true;
        this.init(param1 as DisplayObject, _loc4_);
        return true;
    }

    public init(param1: DisplayObject, param2: ColorTransform) {
        var _loc3_: number = 0;
        var _loc4_: string = null;
        this._target = param1;
        this._ct = this._target.transform.colorTransform;
        _loc3_ = int(TintPlugin._props.length - 1);
        while (_loc3_ > -1) {
            _loc4_ = TintPlugin._props[_loc3_];
            if (this._ct[_loc4_] != param2[_loc4_]) {
                this._tweens[this._tweens.length] = new TweenInfo(
                    this._ct,
                    _loc4_,
                    this._ct[_loc4_],
                    param2[_loc4_] - this._ct[_loc4_],
                    "tint",
                    false,
                );
            }
            _loc3_--;
        }
    }

    public override set changeFactor(param1: number) {
        var _loc2_: ColorTransform = null;
        this.updateTweens(param1);
        if (this._ignoreAlpha) {
            _loc2_ = this._target.transform.colorTransform;
            this._ct.alphaMultiplier = _loc2_.alphaMultiplier;
            this._ct.alphaOffset = _loc2_.alphaOffset;
        }
        this._target.transform.colorTransform = this._ct;
    }
}