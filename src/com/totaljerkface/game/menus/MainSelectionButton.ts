import SoundController from "@/com/totaljerkface/game/sound/SoundController";
import TweenLite from "@/gs/TweenLite";
import Strong from "@/gs/easing/Strong";
import BigArrow from "@/top/BigArrow";
import { boundClass } from 'autobind-decorator';
import Sprite from "flash/display/Sprite";
import MouseEvent from "flash/events/MouseEvent";
import DropShadowFilter from "flash/filters/DropShadowFilter";
import AntiAliasType from "flash/text/AntiAliasType";
import TextField from "flash/text/TextField";
import TextFieldAutoSize from "flash/text/TextFieldAutoSize";
import TextFormat from "flash/text/TextFormat";
import TextFormatAlign from "flash/text/TextFormatAlign";

@boundClass
export default class MainSelectionButton extends Sprite {
    private textField: TextField;
    private hitBox: Sprite;
    private tweenTime: number = 0.4;
    private maxScale: number = 1.5;

    constructor(text: string, size: number, color: number) {
        super();
        this.buttonMode = true;
        this.tabEnabled = false;
        this.createTextField(size, color);
        this.textField.htmlText = text;
        this.createHitBox();
        var _loc4_ = new DropShadowFilter(3, 90, 0, 1, 5, 5, 0.25, 1);
        this.textField.filters = [_loc4_];
        this.addEventListener(
            MouseEvent.ROLL_OVER,
            this.rollOverHandler,
            false,
            0,
            true,
        );
        this.addEventListener(
            MouseEvent.ROLL_OUT,
            this.rollOutHandler,
            false,
            0,
            true,
        );
        this.addEventListener(
            MouseEvent.ROLL_OVER,
            () => console.log('test'),
            false,
            0,
            true,
        );
    }

    private rollOverHandler(param1: MouseEvent) {
        console.log('rollOverHandler', param1);
        TweenLite.to(this, this.tweenTime, {
            scaleX: this.maxScale,
            scaleY: this.maxScale,
            ease: Strong.easeInOut,
        });
        SoundController.instance.playSoundItem("SwishUp");
    }

    private rollOutHandler(param1: MouseEvent) {
        TweenLite.to(this, this.tweenTime, {
            scaleX: 1,
            scaleY: 1,
            ease: Strong.easeInOut,
        });
    }

    private createTextField(size: number, color: number) {
        var _loc3_ = new TextFormat(
            "Clarendon LT Std",
            size,
            color,
            true,
            null,
            null,
            null,
            null,
            TextFormatAlign.RIGHT,
        );
        this.textField = new TextField();
        this.textField.defaultTextFormat = _loc3_;
        this.textField.width = 0;
        this.textField.height = 20;
        this.textField.autoSize = TextFieldAutoSize.RIGHT;
        this.textField.x = 0;
        this.textField.y = 0;
        this.textField.multiline = true;
        this.textField.wordWrap = false;
        this.textField.selectable = false;
        this.textField.embedFonts = true;
        // @ts-expect-error
        this.textField.antiAliasType = AntiAliasType.NORMAL;
        this.textField.mouseEnabled = false;
        this.addChild(this.textField);
    }

    private createHitBox() {
        var _loc3_: number = NaN;
        var _loc1_: number = this.textField.height;
        var _loc2_: number = _loc1_ * 0.55;
        _loc3_ = (_loc1_ - _loc2_) / 2;
        this.hitBox = new Sprite();
        this.hitBox.graphics.beginFill(16711680);
        this.hitBox.graphics.drawRect(0, 0, this.textField.width, _loc2_);
        this.hitBox.graphics.endFill();
        this.hitBox.x = -this.hitBox.width;
        this.textField.y = -_loc3_;
        this.addChild(this.hitBox);
        this.hitArea = this.hitBox;
        this.hitBox.visible = false;
    }

    // @ts-expect-error
    public override get height(): number {
        return this.hitBox.height * this.scaleX;
    }

    public addArrow() {
        var _loc1_: Sprite = null;
        _loc1_ = new BigArrow();
        _loc1_.x = -this.textField.width - 5;
        _loc1_.y = 8;
        this.addChild(_loc1_);
    }

    public die() {
        this.removeEventListener(MouseEvent.ROLL_OVER, this.rollOverHandler);
        this.removeEventListener(MouseEvent.ROLL_OUT, this.rollOutHandler);
    }
}