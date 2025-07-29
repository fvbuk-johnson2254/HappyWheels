import { boundClass } from 'autobind-decorator';
import DisplayObject from "flash/display/DisplayObject";
import Sprite from "flash/display/Sprite";
import Event from "flash/events/Event";
import MouseEvent from "flash/events/MouseEvent";
import DropShadowFilter from "flash/filters/DropShadowFilter";
import AntiAliasType from "flash/text/AntiAliasType";
import TextField from "flash/text/TextField";
import TextFieldAutoSize from "flash/text/TextFieldAutoSize";
import TextFormat from "flash/text/TextFormat";
import TextFormatAlign from "flash/text/TextFormatAlign";

@boundClass
export default class MouseHelper extends Sprite {
    private static _instance: MouseHelper;
    private textField: TextField;
    private bg: Sprite;
    private wMax: number = 200;
    private delayDefault: number = 10;
    private _delay: number;
    private _counter: number = 0;
    private _resetCounter: number;
    private _target: DisplayObject;

    constructor() {
        super();
        if (MouseHelper._instance) {
            throw new Error("mouse helper already exists");
        }
        MouseHelper._instance = this;
        this.init();
    }

    public static get instance(): MouseHelper {
        return MouseHelper._instance;
    }

    private init() {
        this.visible = false;
        var _loc1_ = new DropShadowFilter(10, 90, 0, 1, 7, 7, 0.2, 3);
        this.filters = [_loc1_];
        this.mouseEnabled = false;
        this.mouseChildren = false;
        var _loc2_ = new TextFormat(
            "HelveticaNeueLT Std Med",
            10,
            6710886,
            null,
            null,
            null,
            null,
            null,
            TextFormatAlign.JUSTIFY,
        );
        this.textField = new TextField();
        this.textField.defaultTextFormat = _loc2_;
        this.textField.wordWrap = true;
        this.textField.width = 20;
        this.textField.height = 20;
        this.textField.x = 3;
        this.textField.y = 2;
        this.textField.multiline = true;
        this.textField.selectable = false;
        this.textField.embedFonts = true;
        // @ts-expect-error
        this.textField.antiAliasType = AntiAliasType.ADVANCED;
        this.bg = new Sprite();
        this.addChild(this.bg);
        this.addChild(this.textField);
    }

    private drawBg() {
        this.bg.graphics.clear();
        this.bg.graphics.beginFill(16776805, 1);
        this.bg.graphics.drawRect(
            0,
            0,
            Math.ceil(this.textField.width) + 8,
            Math.ceil(this.textField.height) + 4,
        );
        this.bg.graphics.endFill();
    }

    public show(param1: string, param2: DisplayObject, param3: number = 10) {
        this.textField.htmlText = param1;
        this.textField.width = 10;
        this.textField.autoSize = TextFieldAutoSize.LEFT;
        this.textField.wordWrap = false;
        if (this.textField.width > this.wMax) {
            this.textField.wordWrap = true;
            this.textField.width = this.wMax;
        }
        this.drawBg();
        if (this._target) {
            this._target.removeEventListener(
                MouseEvent.ROLL_OUT,
                this.rollOutTarget,
            );
        }
        this._target = param2;
        this._delay = param3;
        if (this.stage) {
            this.stage.addChild(this);
        }
        this.followMouse();
        this.addEventListener(Event.ENTER_FRAME, this.followMouse);
        this._target.addEventListener(MouseEvent.ROLL_OUT, this.rollOutTarget);
        this.removeEventListener(Event.ENTER_FRAME, this.resetCounter);
    }

    public hide() {
        this.visible = false;
        this._resetCounter = 0;
        this.removeEventListener(Event.ENTER_FRAME, this.followMouse);
        this._target.removeEventListener(
            MouseEvent.ROLL_OUT,
            this.rollOutTarget,
        );
        this._target = null;
        this.addEventListener(Event.ENTER_FRAME, this.resetCounter);
    }

    private followMouse(param1: Event = null) {
        if (!this.visible) {
            if (this._counter >= this._delay) {
                this.visible = true;
            }
            this._counter += 1;
        }
        this.x = this.parent.mouseX + 20;
        this.y = this.parent.mouseY + 10;
        if (this.y + this.height > 500) {
            this.y = Math.max(500 - this.height);
        }
        if (this.x + this.width > 900) {
            this.x = Math.max(900 - this.width);
        }
    }

    private resetCounter(param1: Event) {
        if (this._resetCounter == this._delay) {
            this._counter = 0;
            this.removeEventListener(Event.ENTER_FRAME, this.resetCounter);
        }
        this._resetCounter += 1;
    }

    private rollOutTarget(param1: MouseEvent) {
        this.hide();
    }

    public die() {
        MouseHelper._instance = null;
        this.removeEventListener(Event.ENTER_FRAME, this.resetCounter);
        this.removeEventListener(Event.ENTER_FRAME, this.followMouse);
    }
}