import DropMenuItem from "@/com/totaljerkface/game/menus/DropMenuItem";
import { boundClass } from 'autobind-decorator';
import Sprite from "flash/display/Sprite";
import Event from "flash/events/Event";
import MouseEvent from "flash/events/MouseEvent";
import DropShadowFilter from "flash/filters/DropShadowFilter";
import TextField from "flash/text/TextField";
import TextFieldAutoSize from "flash/text/TextFieldAutoSize";

/* [Embed(source="/_assets/assets.swf", symbol="symbol3035")] */
@boundClass
export default class DropMenu extends Sprite {
    public static ITEM_SELECTED: string;
    public bg: Sprite;
    public currText: TextField;
    public labelText: TextField;
    public arrow: Sprite;
    private displayList: any[];
    private valueList: any[];
    private open: boolean;
    private holder: Sprite;
    private menuSprite: Sprite;
    private menuItems: any[];
    private itemHeight: number = 22;
    private _currentIndex: number;
    private _value;
    private _display: string;

    constructor(
        param1: string,
        param2: any[],
        param3: any[],
        param4: number = -1,
        param5: number = 13421772,
    ) {
        super();
        this.displayList = param2;
        this.valueList = param3;
        this.mouseEnabled = false;
        this.currText.mouseEnabled = false;
        this.arrow.mouseEnabled = false;
        this.bg.alpha = 0;
        this.labelText.autoSize = TextFieldAutoSize.RIGHT;
        this.currText.autoSize = TextFieldAutoSize.LEFT;
        this.currText.wordWrap = this.labelText.wordWrap = false;
        this.currText.embedFonts = this.labelText.embedFonts = true;
        this.currText.selectable = this.labelText.selectable = false;
        this.currText.multiline = this.labelText.multiline = false;
        var _loc6_: number =
            param4 != -1 ? param4 : int(this.displayList.length - 1);
        this.currentIndex = _loc6_;
        this.labelText.text = param1;
        this.labelText.textColor = param5;
        this.holder = new Sprite();
        this.addChildAt(this.holder, 0);
        this.menuSprite = new Sprite();
        this.holder.addChild(this.bg);
        this.holder.addChild(this.menuSprite);
        var _loc7_ = new DropShadowFilter(3, 45, 0, 0.25, 8, 8, 1, 3);
        this.menuSprite.filters = [_loc7_];
        this.holder.addEventListener(
            MouseEvent.ROLL_OVER,
            this.rollOverHandler,
        );
        this.holder.addEventListener(MouseEvent.ROLL_OUT, this.rollOutHandler);
        this.holder.addEventListener(
            MouseEvent.MOUSE_OVER,
            this.mouseOverHandler,
        );
        this.holder.addEventListener(
            MouseEvent.MOUSE_DOWN,
            this.mouseDownHandler,
        );
        this.holder.addEventListener(MouseEvent.MOUSE_UP, this.mouseUpHandler);
    }

    private rollOverHandler(param1: MouseEvent) {
        if (!this.open) {
            this.open = true;
            this.createMenu();
        }
    }

    private rollOutHandler(param1: MouseEvent) {
        if (this.open) {
            this.open = false;
            this.removeAll();
        }
    }

    private mouseOverHandler(param1: MouseEvent) {
        var _loc2_: DropMenuItem = null;
        this.deselectAll();
        if (param1.target instanceof DropMenuItem) {
            _loc2_ = param1.target as DropMenuItem;
            if (!param1.buttonDown) {
                _loc2_.rollOver();
            } else {
                _loc2_.mouseDown();
            }
        }
    }

    private mouseDownHandler(param1: MouseEvent) {
        var _loc2_: DropMenuItem = null;
        if (param1.target instanceof DropMenuItem) {
            _loc2_ = param1.target as DropMenuItem;
            _loc2_.mouseDown();
        }
    }

    private mouseUpHandler(param1: MouseEvent) {
        var _loc2_: DropMenuItem = null;
        if (param1.target instanceof DropMenuItem) {
            this.removeAll();
            _loc2_ = param1.target as DropMenuItem;
            if (this.currentIndex != _loc2_.index) {
                this.currentIndex = _loc2_.index;
                this.dispatchEvent(new Event(DropMenu.ITEM_SELECTED));
            }
        }
    }

    private deselectAll() {
        var _loc2_: DropMenuItem = null;
        var _loc1_: number = 0;
        while (_loc1_ < this.menuItems.length) {
            _loc2_ = this.menuItems[_loc1_];
            _loc2_.rollOut();
            _loc1_++;
        }
    }

    private removeAll() {
        var _loc2_: DropMenuItem = null;
        var _loc1_: number = 0;
        while (_loc1_ < this.menuItems.length) {
            _loc2_ = this.menuItems[_loc1_];
            this.menuSprite.removeChild(_loc2_);
            _loc1_++;
        }
        this.menuItems = new Array();
    }

    private createMenu() {
        var _loc4_: string = null;
        var _loc5_: DropMenuItem = null;
        this.menuItems = new Array();
        var _loc1_: number = this.bg.height;
        var _loc2_: number = 0;
        var _loc3_: number = 0;
        while (_loc3_ < this.displayList.length) {
            _loc4_ = this.displayList[_loc3_];
            _loc5_ = new DropMenuItem(_loc4_, _loc3_);
            this.menuSprite.addChild(_loc5_);
            _loc5_.y = _loc1_;
            this.menuItems.push(_loc5_);
            _loc2_ = Math.max(_loc2_, _loc5_.textWidth);
            _loc1_ += this.itemHeight;
            _loc3_++;
        }
        _loc3_ = 0;
        while (_loc3_ < this.menuItems.length) {
            _loc5_ = this.menuItems[_loc3_];
            _loc5_.bgWidth = _loc2_ + 20;
            _loc3_++;
        }
    }

    public get display(): string {
        return this._display;
    }

    public set display(param1: string) {
        this._display = param1;
        this.currText.text = param1;
        this.arrow.x = this.currText.textWidth + 7;
        this.bg.width = this.arrow.x + this.arrow.width;
        this._currentIndex = this.displayList.indexOf(param1);
    }

    public get value() {
        return this._value;
    }

    public get currentIndex(): number {
        return this._currentIndex;
    }

    public set currentIndex(param1: number) {
        this._currentIndex = param1;
        this.display = this.displayList[param1];
        this._value = this.valueList[param1];
    }

    public valueIndex(param1): number {
        return this.valueList.indexOf(param1);
    }

    public get xLeft(): number {
        return this.x - this.labelText.width;
    }

    public set xLeft(param1: number) {
        this.x = param1 + this.labelText.width;
    }

    public containsValue(param1): boolean {
        var _loc2_ = int(this.valueList.indexOf(param1));
        if (_loc2_ == -1) {
            return false;
        }
        return true;
    }

    public addValue(param1: string, param2) {
        if (this.containsValue(param2)) {
            return;
        }
        this.displayList.push(param1);
        this.valueList.push(param2);
    }

    public die() {
        this.holder.removeEventListener(
            MouseEvent.ROLL_OVER,
            this.rollOverHandler,
        );
        this.holder.removeEventListener(
            MouseEvent.ROLL_OUT,
            this.rollOutHandler,
        );
        this.holder.removeEventListener(
            MouseEvent.MOUSE_OVER,
            this.mouseOverHandler,
        );
        this.holder.removeEventListener(
            MouseEvent.MOUSE_DOWN,
            this.mouseDownHandler,
        );
        this.holder.removeEventListener(
            MouseEvent.MOUSE_UP,
            this.mouseUpHandler,
        );
    }
}