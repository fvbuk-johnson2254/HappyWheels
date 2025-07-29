import TweenLite from "@/gs/TweenLite";
import TweenInfo from "@/gs/utils/tween/TweenInfo";
import { boundClass } from 'autobind-decorator';

@boundClass
export default class TweenPlugin {
    public static VERSION: number;
    public static API: number = 1;
    public propName: string;
    public overwriteProps: any[];
    public round: boolean;
    public onComplete: Function;
    protected _tweens: any[] = [];
    protected _changeFactor: number = 0;

    public static activate(param1: any[]): boolean {
        var _loc2_: number = 0;
        var _loc3_ = null;
        _loc2_ = int(param1.length - 1);
        while (_loc2_ > -1) {
            _loc3_ = new param1[_loc2_]();
            TweenLite.plugins[_loc3_.propName] = param1[_loc2_];
            _loc2_--;
        }
        return true;
    }

    public onInitTween(param1: {}, param2, param3: TweenLite): boolean {
        this.addTween(
            param1,
            this.propName,
            param1[this.propName],
            param2,
            this.propName,
        );
        return true;
    }

    protected addTween(
        param1: {},
        param2: string,
        param3: number,
        param4,
        param5: string = null,
    ) {
        var _loc6_: number = NaN;
        if (param4 != null) {
            _loc6_ =
                typeof param4 == "number" ? param4 - param3 : Number(param4);
            if (_loc6_ != 0) {
                this._tweens[this._tweens.length] = new TweenInfo(
                    param1,
                    param2,
                    param3,
                    _loc6_,
                    param5 || param2,
                    false,
                );
            }
        }
    }

    protected updateTweens(param1: number) {
        var _loc2_: number = 0;
        var _loc3_: TweenInfo = null;
        var _loc4_: number = NaN;
        var _loc5_: number = 0;
        if (this.round) {
            _loc2_ = int(this._tweens.length - 1);
            while (_loc2_ > -1) {
                _loc3_ = this._tweens[_loc2_];
                _loc4_ = _loc3_.start + _loc3_.change * param1;
                _loc5_ = _loc4_ < 0 ? -1 : 1;
                _loc3_.target[_loc3_.property] =
                    (_loc4_ % 1) * _loc5_ > 0.5
                        ? int(_loc4_) + _loc5_
                        : int(_loc4_);
                _loc2_--;
            }
        } else {
            _loc2_ = int(this._tweens.length - 1);
            while (_loc2_ > -1) {
                _loc3_ = this._tweens[_loc2_];
                _loc3_.target[_loc3_.property] =
                    _loc3_.start + _loc3_.change * param1;
                _loc2_--;
            }
        }
    }

    public set changeFactor(param1: number) {
        this.updateTweens(param1);
        this._changeFactor = param1;
    }

    public get changeFactor(): number {
        return this._changeFactor;
    }

    public killProps(param1: {}) {
        var _loc2_: number = 0;
        _loc2_ = int(this.overwriteProps.length - 1);
        while (_loc2_ > -1) {
            if (this.overwriteProps[_loc2_] in param1) {
                this.overwriteProps.splice(_loc2_, 1);
            }
            _loc2_--;
        }
        _loc2_ = int(this._tweens.length - 1);
        while (_loc2_ > -1) {
            if (this._tweens[_loc2_].name in param1) {
                this._tweens.splice(_loc2_, 1);
            }
            _loc2_--;
        }
    }
}