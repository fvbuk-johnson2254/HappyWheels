import RefShape from "@/com/totaljerkface/game/editor/RefShape";
import { boundClass } from 'autobind-decorator';
import Sprite from "flash/display/Sprite";

@boundClass
export default class RectangleShape extends RefShape {
    constructor(
        param1: boolean = true,
        param2: boolean = true,
        param3: boolean = false,
        param4: number = 1,
        param5: number = 4032711,
        param6: number = -1,
        param7: number = 100,
        param8: number = 1,
    ) {
        super(param1, param2, param3, param4, param5, param6, param7, param8);
        this.name = "rectangle shape";
    }

    protected override drawShape() {
        this.graphics.clear();
        if (this.outlineColor >= 0) {
            this.graphics.lineStyle(0, this._outlineColor, this._opacity, true);
        }
        this.graphics.beginFill(this._color, this._opacity);
        this.graphics.drawRect(-50, -50, 100, 100);
        this.graphics.endFill();
    }

    public override getFlatSprite(): Sprite {
        var _loc1_ = new Sprite();
        if (this._opacity == 0 || (this._outlineColor < 0 && this._color < 0)) {
            _loc1_.visible = false;
        }
        if (this.outlineColor >= 0) {
            _loc1_.graphics.lineStyle(0, this._outlineColor, 1, true);
        }
        if (this.color >= 0) {
            _loc1_.graphics.beginFill(this._color, 1);
        }
        _loc1_.graphics.drawRect(-50, -50, 100, 100);
        _loc1_.graphics.endFill();
        _loc1_.x = this.x;
        _loc1_.y = this.y;
        _loc1_.scaleX = this.scaleX;
        _loc1_.scaleY = this.scaleY;
        _loc1_.rotation = this.rotation;
        _loc1_.alpha = this._opacity;
        return _loc1_;
    }
}