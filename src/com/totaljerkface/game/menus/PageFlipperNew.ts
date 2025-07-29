import { boundClass } from 'autobind-decorator';
import Sprite from "flash/display/Sprite";
import Event from "flash/events/Event";
import MouseEvent from "flash/events/MouseEvent";
import TextField from "flash/text/TextField";
import TextFieldAutoSize from "flash/text/TextFieldAutoSize";

/* [Embed(source="/_assets/assets.swf", symbol="symbol2990")] */
@boundClass
export default class PageFlipperNew extends Sprite {
    public static FLIP_PAGE: string;
    public textField: TextField;
    public leftArrow: Sprite;
    public rightArrow: Sprite;
    private spacing: number = 5;
    private _currentPage: number;
    private _nextPage: boolean;
    private _prevPage: boolean;
    private _totalItems: number;
    private _pageLength: number;
    private showTotal: boolean;

    constructor(
        param1: number,
        param2: number,
        param3: number,
        param4: boolean,
    ) {
        super();
        this._currentPage = param1;
        this._pageLength = param2;
        this._totalItems = param3;
        this.showTotal = param4;
        trace("showTotal " + param4);
        this._prevPage = this._currentPage == 1 ? false : true;
        if (
            !param4 ||
            this._totalItems > this._currentPage * this._pageLength
        ) {
            this._nextPage = true;
        }
        this.textField.autoSize = TextFieldAutoSize.LEFT;
        this.textField.wordWrap = false;
        this.textField.multiline = false;
        this.setTextItems();
        this.leftArrow.buttonMode = this.rightArrow.buttonMode = true;
        this.addEventListener(MouseEvent.MOUSE_UP, this.mouseUpHandler);
    }

    private setTextItems() {
        var _loc3_: number = 0;
        var _loc1_: number = (this._currentPage - 1) * this._pageLength + 1;
        var _loc2_: string = this.showTotal
            ? this._totalItems.toString()
            : "many";
        if (this._nextPage) {
            _loc3_ = this._currentPage * this._pageLength;
            this.textField.text = "" + _loc1_ + " - " + _loc3_ + " of " + _loc2_;
        } else {
            _loc3_ =
                (this._currentPage - 1) * this._pageLength +
                1 +
                this._totalItems;
            _loc3_ = this._totalItems;
            this.textField.text = "" + _loc1_ + " - " + _loc3_ + " of " + _loc2_;
        }
        this.organize();
    }

    private organize() {
        this.leftArrow.x = this.rightArrow.x - this.spacing;
        this.textField.x =
            this.leftArrow.x - this.leftArrow.width - this.textField.width;
        if (!this._prevPage) {
            this.leftArrow.alpha = 0.3;
            this.leftArrow.mouseEnabled = false;
        } else {
            this.leftArrow.alpha = 1;
            this.leftArrow.mouseEnabled = true;
        }
        if (!this._nextPage) {
            this.rightArrow.alpha = 0.3;
            this.rightArrow.mouseEnabled = false;
        } else {
            this.rightArrow.alpha = 1;
            this.rightArrow.mouseEnabled = true;
        }
    }

    private mouseUpHandler(param1: MouseEvent) {
        switch (param1.target) {
            case this.leftArrow:
                this.flipPage(-1);
                break;
            case this.rightArrow:
                this.flipPage(1);
        }
    }

    private flipPage(param1: number) {
        var _loc2_: number = this._currentPage + param1;
        this._currentPage = _loc2_;
        this.dispatchEvent(new Event(PageFlipperNew.FLIP_PAGE));
    }

    public get currentPage(): number {
        return this._currentPage;
    }

    public die() {
        this.removeEventListener(MouseEvent.MOUSE_UP, this.mouseUpHandler);
    }
}