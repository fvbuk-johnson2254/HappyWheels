import { boundClass } from 'autobind-decorator';
import Bitmap from "flash/display/Bitmap";
import BitmapData from "flash/display/BitmapData";
import Sprite from "flash/display/Sprite";
import BlurFilter from "flash/filters/BlurFilter";
import Matrix from "flash/geom/Matrix";

@boundClass
export default class BackDrop extends Sprite {
    protected _visual: Sprite;
    protected _multiplier: number;
    protected blur: number;
    protected quality: number;
    protected transparent: boolean;

    constructor(
        param1: Sprite,
        param2: number,
        param3: boolean,
        param4: number = 0,
        param5: number = 3,
    ) {
        super();
        this._visual = param1;
        this._multiplier = param2;
        this.blur = param4;
        this.quality = param5;
        this.transparent = param3;
        this.createBitmaps();
    }

    public get visual(): Sprite {
        return this._visual;
    }

    public get multiplier(): number {
        return this._multiplier;
    }

    protected createBitmaps() {
        var _loc2_: Sprite = null;
        var _loc1_: number = 0;
        while (_loc1_ < this.visual.numChildren) {
            _loc2_ = this.visual.getChildAt(_loc1_) as Sprite;
            this.drawBitmap(_loc2_);
            _loc1_++;
        }
        this._visual = null;
    }

    protected drawBitmap(
        param1: Sprite,
        param2: boolean = false,
        param3: number = 5000,
    ) {
        var _loc7_: BlurFilter = null;
        if (this.blur > 0) {
            _loc7_ = new BlurFilter(this.blur, this.blur, this.quality);
            param1.filters = [_loc7_];
        }
        var _loc4_ = new BitmapData(
            param1.width + this.blur * 2,
            param1.height + this.blur * 2,
            this.transparent,
            16777215,
        );
        var _loc5_ = new Matrix();
        _loc5_.translate(this.blur, this.blur);
        _loc4_.draw(param1, _loc5_);
        var _loc6_ = new Bitmap(_loc4_);
        this.addChild(_loc6_);
        _loc6_.x = param1.x - this.blur;
        _loc6_.y = param1.y - this.blur;
        if (param2) {
            _loc6_ = new Bitmap(_loc4_);
            this.addChild(_loc6_);
            _loc6_.x = param1.x + param3 - this.blur;
            _loc6_.y = param1.y - this.blur;
        }
    }

    protected drawBuilding(
        param1: Sprite,
        param2: number,
        param3: number,
        param4: boolean = false,
        param5: number = 5000,
    ) {
        var _loc6_: BitmapData = null;
        var _loc7_: Bitmap = null;
        var _loc8_: Matrix = null;
        var _loc9_: number = NaN;
        var _loc10_: number = NaN;
        var _loc11_: number = NaN;
        var _loc12_: number =
            10000 * this._multiplier + 500 * (1 - this._multiplier);
        var _loc13_ = new BlurFilter(this.blur, this.blur, this.quality);
        param1.filters = [_loc13_];
        var _loc14_: number = param1.x - this.blur;
        var _loc15_: number = param1.y - this.blur;
        _loc9_ = param1.width + this.blur * 2;
        _loc10_ = param2 + this.blur;
        _loc6_ = new BitmapData(_loc9_, _loc10_, this.transparent, 0);
        _loc8_ = new Matrix(1, 0, 0, 1, this.blur, this.blur);
        _loc6_.draw(param1, _loc8_);
        _loc8_ = new Matrix(1, 0, 0, 1, _loc14_, _loc15_);
        this.graphics.beginBitmapFill(_loc6_, _loc8_, false, false);
        this.graphics.drawRect(_loc14_, _loc15_, _loc9_, _loc10_);
        this.graphics.endFill();
        if (param4) {
            _loc8_ = new Matrix(1, 0, 0, 1, _loc14_ + param5, _loc15_);
            this.graphics.beginBitmapFill(_loc6_, _loc8_, false, false);
            this.graphics.drawRect(_loc14_ + param5, _loc15_, _loc9_, _loc10_);
            this.graphics.endFill();
        }
        _loc10_ = param3;
        _loc15_ = _loc15_ + param2 + this.blur;
        _loc6_ = new BitmapData(_loc9_, _loc10_, this.transparent, 0);
        _loc8_ = new Matrix(1, 0, 0, 1, this.blur, -param2);
        _loc6_.draw(param1, _loc8_);
        _loc8_ = new Matrix(1, 0, 0, 1, _loc14_, _loc15_);
        _loc11_ = _loc12_ - _loc15_;
        this.graphics.beginBitmapFill(_loc6_, _loc8_, true, false);
        this.graphics.drawRect(_loc14_, _loc15_, _loc9_, _loc11_);
        this.graphics.endFill();
        if (param4) {
            _loc8_ = new Matrix(1, 0, 0, 1, _loc14_ + param5, _loc15_);
            this.graphics.beginBitmapFill(_loc6_, _loc8_, true, false);
            this.graphics.drawRect(_loc14_ + param5, _loc15_, _loc9_, _loc11_);
            this.graphics.endFill();
        }
    }
}