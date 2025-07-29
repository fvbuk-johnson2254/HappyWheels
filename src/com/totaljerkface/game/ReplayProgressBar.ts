import MouseHelper from "@/com/totaljerkface/game/editor/MouseHelper";
import { boundClass } from 'autobind-decorator';
import Sprite from "flash/display/Sprite";
import MouseEvent from "flash/events/MouseEvent";
import Rectangle from "flash/geom/Rectangle";

@boundClass
export default class ReplayProgressBar extends Sprite {
    private bgBar: Sprite;
    private progBar: Sprite;
    private rightArrows: Sprite;
    private leftArrows: Sprite;
    private barWidth: number = 600;
    private barHeight: number = 6;
    private border: number = 2;
    private minWidth: number = 10;
    private remainder: number = 590;
    private speedArray: any[] = [5, 15, 30, 60, 100];
    private speedIndex: number = 2;

    constructor() {
        super();
        this.drawShapes();
        this.addEventListener(MouseEvent.MOUSE_UP, this.mouseUpHandler);
        this.addEventListener(MouseEvent.MOUSE_OVER, this.mouseOverHandler);
    }

    private drawShapes() {
        this.bgBar = new Sprite();
        this.addChild(this.bgBar);
        this.bgBar.graphics.beginFill(13421772);
        this.bgBar.graphics.drawRoundRect(
            -this.border,
            -this.border,
            this.barWidth + this.border * 2,
            this.barHeight + this.border * 2,
            this.border * 2,
            this.border * 2,
        );
        this.bgBar.graphics.endFill();
        this.progBar = new Sprite();
        this.addChild(this.progBar);
        this.progBar.graphics.beginFill(16613761);
        this.progBar.graphics.drawRoundRect(
            0,
            0,
            this.barWidth,
            this.barHeight,
            this.border,
            this.border,
        );
        this.progBar.graphics.endFill();
        this.progBar.scale9Grid = new Rectangle(this.border, this.border, 5, 2);
        this.updateProgress(0, 1);
        var _loc1_ = this.barHeight + this.border * 2;
        var _loc2_: number = _loc1_ / 2;
        this.rightArrows = new Sprite();
        this.addChild(this.rightArrows);
        this.rightArrows.graphics.beginFill(13421772);
        this.rightArrows.graphics.lineTo(_loc1_, _loc2_);
        this.rightArrows.graphics.lineTo(0, _loc1_);
        this.rightArrows.graphics.lineTo(0, 0);
        this.rightArrows.graphics.endFill();
        this.rightArrows.graphics.beginFill(13421772);
        this.rightArrows.graphics.moveTo(_loc2_, 0);
        this.rightArrows.graphics.lineTo(_loc1_ + _loc2_, _loc2_);
        this.rightArrows.graphics.lineTo(_loc2_, _loc1_);
        this.rightArrows.graphics.lineTo(_loc2_, 0);
        this.rightArrows.graphics.endFill();
        this.rightArrows.x = this.barWidth + 15;
        this.rightArrows.y = -this.border;
        this.leftArrows = new Sprite();
        this.addChild(this.leftArrows);
        this.leftArrows.graphics.beginFill(13421772);
        this.leftArrows.graphics.lineTo(0, _loc1_);
        this.leftArrows.graphics.lineTo(-_loc1_, _loc2_);
        this.leftArrows.graphics.lineTo(0, 0);
        this.leftArrows.graphics.endFill();
        this.leftArrows.graphics.beginFill(13421772);
        this.leftArrows.graphics.moveTo(-_loc2_, 0);
        this.leftArrows.graphics.lineTo(-_loc2_, _loc1_);
        this.leftArrows.graphics.lineTo(-(_loc1_ + _loc2_), _loc2_);
        this.leftArrows.graphics.lineTo(-_loc2_, 0);
        this.leftArrows.graphics.endFill();
        this.leftArrows.x = -15;
        this.leftArrows.y = -this.border;
        this.leftArrows.buttonMode = this.rightArrows.buttonMode = true;
        this.tabChildren = false;
    }

    public updateProgress(param1: number, param2: number) {
        var _loc3_: number = param1 / param2;
        this.progBar.width =
            this.minWidth + Math.min(_loc3_ * this.remainder, this.remainder);
    }

    private mouseUpHandler(param1: MouseEvent) {
        switch (param1.target) {
            case this.leftArrows:
                this.decreaseSpeed();
                break;
            case this.rightArrows:
                this.increaseSpeed();
        }
    }

    private mouseOverHandler(param1: MouseEvent) {
        switch (param1.target) {
            case this.leftArrows:
                MouseHelper.instance.show("slower", this.leftArrows);
                break;
            case this.rightArrows:
                MouseHelper.instance.show("faster", this.rightArrows);
        }
    }

    private increaseSpeed() {
        this.speedIndex = Math.min(
            this.speedArray.length - 1,
            this.speedIndex + 1,
        );
        this.stage.frameRate = this.speedArray[this.speedIndex];
    }

    private decreaseSpeed() {
        this.speedIndex = Math.max(0, this.speedIndex - 1);
        this.stage.frameRate = this.speedArray[this.speedIndex];
    }

    public die() {
        this.removeEventListener(MouseEvent.MOUSE_UP, this.mouseUpHandler);
        this.removeEventListener(MouseEvent.MOUSE_OVER, this.mouseOverHandler);
        this.stage.frameRate = 30;
    }
}