import TweenPlugin from "@/gs/plugins/TweenPlugin";
import TweenLite from "@/gs/TweenLite";
import ArrayTweenInfo from "@/gs/utils/tween/ArrayTweenInfo";
import { boundClass } from 'autobind-decorator';

@boundClass
export default class EndArrayPlugin extends TweenPlugin {
    public static VERSION: number;
    public static API: number = 1;
    protected _a: any[];
    protected _info: any[] = [];

    constructor() {
        super();
        this.propName = "endArray";
        this.overwriteProps = ["endArray"];
    }

    public override onInitTween(
        param1: {},
        param2,
        param3: TweenLite,
    ): boolean {
        if (!Array.isArray(param1) || !Array.isArray(param2)) {
            return false;
        }
        this.init(param1 as any[], param2);
        return true;
    }

    public init(param1: any[], param2: any[]) {
        this._a = param1;
        var _loc3_ = int(param2.length - 1);
        while (_loc3_ > -1) {
            if (param1[_loc3_] != param2[_loc3_] && param1[_loc3_] != null) {
                this._info[this._info.length] = new ArrayTweenInfo(
                    _loc3_,
                    this._a[_loc3_],
                    param2[_loc3_] - this._a[_loc3_],
                );
            }
            _loc3_--;
        }
    }

    public override set changeFactor(param1: number) {
        var _loc2_: number = 0;
        var _loc3_: ArrayTweenInfo = null;
        var _loc4_: number = NaN;
        var _loc5_: number = 0;
        if (this.round) {
            _loc2_ = int(this._info.length - 1);
            while (_loc2_ > -1) {
                _loc3_ = this._info[_loc2_];
                _loc4_ = _loc3_.start + _loc3_.change * param1;
                _loc5_ = _loc4_ < 0 ? -1 : 1;
                this._a[_loc3_.index] =
                    (_loc4_ % 1) * _loc5_ > 0.5
                        ? int(_loc4_) + _loc5_
                        : int(_loc4_);
                _loc2_--;
            }
        } else {
            _loc2_ = int(this._info.length - 1);
            while (_loc2_ > -1) {
                _loc3_ = this._info[_loc2_];
                this._a[_loc3_.index] = _loc3_.start + _loc3_.change * param1;
                _loc2_--;
            }
        }
    }
}