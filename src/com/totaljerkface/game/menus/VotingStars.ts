import { boundClass } from 'autobind-decorator';
import Sprite from "flash/display/Sprite";
import Event from "flash/events/Event";
import MouseEvent from "flash/events/MouseEvent";
import DropShadowFilter from "flash/filters/DropShadowFilter";
import AntiAliasType from "flash/text/AntiAliasType";
import TextField from "flash/text/TextField";
import TextFieldAutoSize from "flash/text/TextFieldAutoSize";
import TextFormat from "flash/text/TextFormat";
import TextFormatAlign from "flash/text/TextFormatAlign";

/* [Embed(source="/_assets/assets.swf", symbol="symbol97")] */
@boundClass
export default class VotingStars extends Sprite {
    public static RATING_SELECTED: string;
    public starMask: Sprite;
    public publicFiller: Sprite;
    private filler: Sprite;
    private hitBox: Sprite;
    private textField: TextField;
    private textBg: Sprite;
    private textBox: Sprite;
    private _publicRating: number;
    private _rating: number;
    private maxRating: number = 5;
    private starWidth: number = 30;
    private fullWidth: number = 150;
    private levelRatings: any[] = [
        "0 - godawful",
        "1 - shitty",
        "2 - meh",
        "3 - good",
        "4 - pretty great",
        "5 - superb!",
    ];

    constructor(
        param1: number = 0,
        param2: any[] = null,
        param3: number = 16777062,
    ) {
        super();
        this.publicRating = param1;
        if (param2) {
            this.levelRatings = param2;
        }
        this.buildHitBox();
        this.createFiller(param3);
        this.rollOutHandler();
        this.mouseChildren = false;
        this.buttonMode = true;
        this.tabEnabled = false;
        this.addEventListener(MouseEvent.ROLL_OUT, this.rollOutHandler);
        this.addEventListener(MouseEvent.ROLL_OVER, this.rollOverHandler);
        this.addEventListener(MouseEvent.MOUSE_MOVE, this.mouseMoveHandler);
        this.addEventListener(MouseEvent.MOUSE_UP, this.mouseUpHandler);
    }

    private createFiller(param1: number) {
        this.filler = new Sprite();
        this.addChild(this.filler);
        this.filler.graphics.beginFill(param1, 1);
        this.filler.graphics.drawRect(0, 0, 150, 30);
        this.filler.graphics.endFill();
        this.filler.mask = this.starMask;
    }

    private addTextBox() {
        var _loc1_ = new TextFormat(
            "HelveticaNeueLT Std Med",
            12,
            16777215,
            null,
            null,
            null,
            null,
            null,
            TextFormatAlign.LEFT,
        );
        this.textField = new TextField();
        this.textField.defaultTextFormat = _loc1_;
        this.textField.autoSize = TextFieldAutoSize.LEFT;
        this.textField.width = 20;
        this.textField.height = 20;
        this.textField.x = 3;
        this.textField.y = 3;
        this.textField.multiline = false;
        this.textField.selectable = false;
        this.textField.embedFonts = true;
        // @ts-expect-error
        this.textField.antiAliasType = AntiAliasType.ADVANCED;
        this.textBg = new Sprite();
        this.textBox = new Sprite();
        this.addChild(this.textBox);
        this.textBox.addChild(this.textBg);
        this.textBox.addChild(this.textField);
        var _loc2_ = new DropShadowFilter(10, 90, 0, 1, 7, 7, 0.2, 3);
        this.textBox.filters = [_loc2_];
    }

    private removeTextBox() {
        this.removeChild(this.textBox);
        this.textBox = null;
    }

    private drawBg() {
        this.textBg.graphics.clear();
        this.textBg.graphics.lineStyle(1, 10066329, 1, true);
        this.textBg.graphics.beginFill(13421772, 1);
        this.textBg.graphics.drawRect(
            0,
            0,
            Math.ceil(this.textField.width) + 5,
            Math.ceil(this.textField.height) + 5,
        );
        this.textBg.graphics.endFill();
    }

    public setText() {
        this.textField.htmlText = this.levelRatings[this._rating];
        this.textField.width = 10;
        this.textField.autoSize = TextFieldAutoSize.LEFT;
        this.textField.wordWrap = false;
        this.drawBg();
    }

    private buildHitBox() {
        this.hitBox = new Sprite();
        this.hitBox.graphics.beginFill(0);
        this.hitBox.graphics.drawRect(-20, 0, 190, 29);
        this.hitBox.graphics.endFill();
        this.addChild(this.hitBox);
        this.hitArea = this.hitBox;
        this.hitBox.visible = false;
    }

    private mouseMoveHandler(param1: MouseEvent) {
        var _loc2_: number = Math.max(
            Math.min(Math.ceil(this.mouseX / this.starWidth), 5),
            0,
        );
        this.rating = _loc2_;
        if (this.textBox) {
            this.setText();
            this.drawBg();
            this.textBox.x = this.mouseX + 20;
            this.textBox.y = this.mouseY + 10;
        }
    }

    private rollOutHandler(param1: MouseEvent = null) {
        this._rating = -1;
        this.filler.scaleX = 0;
        if (this.textBox) {
            this.removeTextBox();
        }
    }

    private rollOverHandler(param1: MouseEvent) {
        if (!this.textBox) {
            this.addTextBox();
        }
    }

    private mouseUpHandler(param1: MouseEvent) {
        this.buttonMode = false;
        if (this.textBox) {
            this.removeTextBox();
        }
        this.removeEventListener(MouseEvent.ROLL_OUT, this.rollOutHandler);
        this.removeEventListener(MouseEvent.ROLL_OVER, this.rollOverHandler);
        this.removeEventListener(MouseEvent.MOUSE_MOVE, this.mouseMoveHandler);
        this.removeEventListener(MouseEvent.MOUSE_UP, this.mouseUpHandler);
        this.dispatchEvent(new Event(VotingStars.RATING_SELECTED));
    }

    public get publicRating(): number {
        return this._publicRating;
    }

    public set publicRating(param1: number) {
        this._publicRating = param1;
        this.publicFiller.scaleX = param1 / this.maxRating;
    }

    public get rating(): number {
        return this._rating;
    }

    public set rating(param1: number) {
        this._rating = param1;
        this.filler.scaleX = Math.max(0, this._rating) / this.maxRating;
    }

    private setCaption() {
        if (this._rating > -1) {
            this.textField.text = this.levelRatings[this._rating];
        }
    }

    public die() {
        this.removeEventListener(MouseEvent.ROLL_OUT, this.rollOutHandler);
        this.removeEventListener(MouseEvent.ROLL_OVER, this.rollOverHandler);
        this.removeEventListener(MouseEvent.MOUSE_MOVE, this.mouseMoveHandler);
        this.removeEventListener(MouseEvent.MOUSE_UP, this.mouseUpHandler);
    }
}