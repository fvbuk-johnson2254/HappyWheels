import SpecialListItem from "@/com/totaljerkface/game/editor/ui/SpecialListItem";
import { boundClass } from 'autobind-decorator';
import Sprite from "flash/display/Sprite";

@boundClass
export default class SpecialExpandItem extends SpecialListItem {
    private holder: Sprite;
    private symbol = new Sprite();
    private _expanded: boolean;

    constructor(param1: string, param2: number = 0, param3: number = 100) {
        super(param1, "", param2, param3);
        this._downBgColor = 8825545;
        this.addChild(this.symbol);
        this.symbol.y = 7;
        this.symbol.x = 5 + param2 * 13;
        this.symbol.mouseEnabled = false;
        this.textField.x = this.symbol.x + 12;
        this.holder = new Sprite();
        this.holder.y = this._bgHeight;
    }

    public addChildItem(param1: SpecialListItem) {
        this.holder.addChild(param1);
        param1.x = 0;
        param1.y = (this.holder.numChildren - 1) * this._bgHeight;
        param1.parentItem = this;
    }

    public get expanded(): boolean {
        return this._expanded;
    }

    public set expanded(param1: boolean) {
        if (param1 == this._expanded) {
            return;
        }
        this._expanded = param1;
        if (this._expanded) {
            this.addChild(this.holder);
        } else if (this.holder.parent) {
            this.removeChild(this.holder);
        }
        this.drawSymbol();
    }

    protected override drawSymbol() {
        this.symbol.graphics.clear();
        var _loc1_: number = this.textField.textColor;
        if (this._expanded) {
            this.symbol.graphics.beginFill(_loc1_);
            this.symbol.graphics.drawRect(0, 4, 9, 1);
            this.symbol.graphics.endFill();
        } else {
            this.symbol.graphics.beginFill(_loc1_);
            this.symbol.graphics.drawRect(0, 4, 9, 1);
            this.symbol.graphics.endFill();
            this.symbol.graphics.beginFill(_loc1_);
            this.symbol.graphics.drawRect(4, 0, 1, 9);
            this.symbol.graphics.endFill();
        }
    }

    public override get height(): number {
        var _loc1_: number = NaN;
        var _loc2_: number = 0;
        var _loc3_: SpecialListItem = null;
        if (this._expanded) {
            _loc1_ = this._bgHeight;
            _loc2_ = 0;
            while (_loc2_ < this.holder.numChildren) {
                _loc3_ = this.holder.getChildAt(_loc2_) as SpecialListItem;
                _loc1_ += _loc3_.height;
                _loc2_++;
            }
            return _loc1_;
        }
        return this._bgHeight;
    }

    public organizeChildren() {
        var _loc1_: number = NaN;
        var _loc3_: SpecialListItem = null;
        _loc1_ = 0;
        var _loc2_: number = 0;
        while (_loc2_ < this.holder.numChildren) {
            _loc3_ = this.holder.getChildAt(_loc2_) as SpecialListItem;
            _loc3_.y = _loc1_;
            _loc1_ += _loc3_.height;
            _loc2_++;
        }
    }
}