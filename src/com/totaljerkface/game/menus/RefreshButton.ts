import MouseHelper from "@/com/totaljerkface/game/editor/MouseHelper";
import RefreshShape from "@/top/RefreshShape";
import Sprite from "flash/display/Sprite";
import Event from "flash/events/Event";
import MouseEvent from "flash/events/MouseEvent";
// import BevelFilter from "flash/filters/BevelFilter";
import { boundClass } from 'autobind-decorator';
import DropShadowFilter from "flash/filters/DropShadowFilter";
import GlowFilter from "flash/filters/GlowFilter";

@boundClass
export default class RefreshButton extends Sprite {
    protected shapeSprite: Sprite;
    protected areaSprite: Sprite;
    protected bevelFilter: /*BevelFilter*/ any;
    protected shadowFilter: DropShadowFilter;
    protected glowFilter: GlowFilter;
    protected glowStrength: number = 0;
    protected glowCounter: number = 0;
    protected glowStep: number = 0.1;
    protected shakeCounter: number = 0;
    protected shakeStep: number = 1;
    protected shakeMaxAngle: number = 15;
    protected maxGlowStrength: number = 3;
    protected mouseContact: boolean;
    protected spinActive: boolean;
    protected shakeActive: boolean;
    protected glowActive: boolean;
    protected _disableSpin: boolean;

    constructor() {
        super();
        this.mouseChildren = false;
        this.buttonMode = true;
        this.tabEnabled = false;
        this.areaSprite = new Sprite();
        this.addChild(this.areaSprite);
        this.areaSprite.graphics.beginFill(0);
        this.areaSprite.graphics.drawRect(0, 0, 20, 20);
        this.areaSprite.graphics.endFill();
        this.areaSprite.visible = false;
        this.hitArea = this.areaSprite;
        this.shapeSprite = new RefreshShape();
        this.addChild(this.shapeSprite);
        this.shapeSprite.x = 10;
        this.shapeSprite.y = 10;
        // this.bevelFilter = new BevelFilter(
        //     2,
        //     90,
        //     16777215,
        //     0.3,
        //     0,
        //     0.3,
        //     3,
        //     3,
        //     1,
        //     3,
        // );
        this.shadowFilter = new DropShadowFilter(2, 90, 0, 1, 4, 4, 0.25, 3);
        this.glowFilter = new GlowFilter(4032711, 1, 5, 5, 0, 3, false, false);
        this.alpha = 0.2;
        this.mouseEnabled = false;
        this.filters = [/*this.bevelFilter,*/ this.shadowFilter];
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
        this.addEventListener(Event.ENTER_FRAME, this.step, false, 0, true);
    }

    private rollOverHandler(param1: MouseEvent = null) {
        this.mouseContact = true;
        this.shakeActive = true;
        MouseHelper.instance.show("refresh results", this);
    }

    private rollOutHandler(param1: MouseEvent = null) {
        this.mouseContact = false;
    }

    private step(param1: Event) {
        var _loc2_: number = NaN;
        if (this.spinActive) {
            this.shapeSprite.rotation = (this.shapeSprite.rotation + 15) % 360;
            if (this.shapeSprite.rotation == 0 && this._disableSpin) {
                this.spinActive = false;
                this._disableSpin = false;
            }
        } else if (this.shakeActive) {
            _loc2_ = (Math.PI * this.shakeCounter) / 10;
            this.shapeSprite.rotation = Math.round(Math.sin(_loc2_) * 20);
            this.shakeCounter += this.shakeStep;
            if (this.shapeSprite.rotation == 0 && !this.mouseContact) {
                this.shakeActive = false;
            }
        }
        if (this.glowActive) {
            this.glowFilter.strength =
                (-Math.cos(this.glowCounter) * 0.5 + 0.5) *
                this.maxGlowStrength;
            this.glowCounter += this.glowStep;
            this.filters = [
                /*this.bevelFilter,*/
                this.glowFilter,
                this.shadowFilter,
            ];
        }
    }

    public setGlow(param1: boolean) {
        if (param1 && !this.glowActive) {
            this.alpha = 1;
            this.mouseEnabled = true;
            this.glowActive = true;
            this.glowStrength = 0;
            this.glowCounter = 0;
            this.filters = [
                /*this.bevelFilter,*/
                this.glowFilter,
                this.shadowFilter,
            ];
        } else if (!param1) {
            this.alpha = 0.2;
            this.mouseEnabled = false;
            this.glowActive = false;
            this.filters = [/*this.bevelFilter,*/ this.shadowFilter];
        }
    }

    public set disableSpin(param1: boolean) {
        this._disableSpin = param1;
    }

    public setSpin(param1: boolean) {
        if (param1 && !this.spinActive) {
            this.shakeActive = false;
            this.shakeCounter = 0;
            this.spinActive = true;
            this.shapeSprite.rotation -= this.shapeSprite.rotation % 15;
        } else if (!param1) {
            this._disableSpin = true;
        }
    }
}