import b2Mat22 from "@/Box2D/Common/Math/b2Mat22";
import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import RefSprite from "@/com/totaljerkface/game/editor/RefSprite";
import Special from "@/com/totaljerkface/game/editor/specials/Special";
import CanvasEvent from "@/com/totaljerkface/game/events/CanvasEvent";
import { boundClass } from 'autobind-decorator';
import MovieClip from "flash/display/MovieClip";
import Sprite from "flash/display/Sprite";

/* [Embed(source="/_assets/assets.swf", symbol="symbol2634")] */
@boundClass
export default class HarpoonGunRef extends Special {
    public turret: Sprite;
    public light: MovieClip;
    public anchorSprite: Sprite;
    private _useAnchor: boolean = true;
    private _fixedAngleTurret: boolean = false;
    private _turretAngle: number = 0;
    private _triggerFiring: boolean = false;
    private _startDeactivated: boolean;

    constructor() {
        super();
        this._triggerable = true;
        this._triggers = new Array();
        this._triggerActions = new Dictionary();
        this._triggerActionList = ["fire harpoon", "deactivate", "activate"];
        this._triggerActionListProperties = [null, null, null];
        this._triggerString = "triggerActionsHarpoon";

        this.name = "harpoon gun";
        this._shapesUsed = 11;
        this._rotatable = true;
        this._scalable = false;
        this._joinable = false;
        this._groupable = false;
        this._keyedPropertyObject[this._triggerString] = this._triggerActions;
        this.light = this.turret.getChildByName("light") as MovieClip;
        this.anchorSprite = new Sprite();
        this.addChildAt(this.anchorSprite, this.getChildIndex(this.turret));
        this.drawAnchor();
    }

    public override setAttributes() {
        this._type = "HarpoonGunRef";
        this._attributes = ["x", "y", "angle", "useAnchor", "fixedAngleTurret"];
        if (this._fixedAngleTurret) {
            this._attributes.push("turretAngle");
        }
        this._attributes.push("triggerFiring", "startDeactivated");
        this.addTriggerProperties();
    }

    public override getFullProperties(): any[] {
        return [
            "x",
            "y",
            "angle",
            "useAnchor",
            "fixedAngleTurret",
            "turretAngle",
            "triggerFiring",
            "startDeactivated",
        ];
    }

    public override clone(): RefSprite {
        var _loc1_: HarpoonGunRef = null;
        _loc1_ = new HarpoonGunRef();
        _loc1_.x = this.x;
        _loc1_.y = this.y;
        _loc1_.angle = this.angle;
        _loc1_.useAnchor = this.useAnchor;
        _loc1_.fixedAngleTurret = this.fixedAngleTurret;
        _loc1_.turretAngle = this.turretAngle;
        _loc1_.triggerFiring = this.triggerFiring;
        _loc1_.startDeactivated = this.startDeactivated;
        this.transferKeyedProperties(_loc1_);
        return _loc1_;
    }

    public get useAnchor(): boolean {
        return this._useAnchor;
    }

    public set useAnchor(param1: boolean) {
        if (this._useAnchor == param1) {
            return;
        }
        this._useAnchor = param1;
        this.anchorSprite.visible = this._useAnchor;
        if (this._useAnchor) {
            this._shapesUsed = 11;
            this.dispatchEvent(new CanvasEvent(CanvasEvent.SHAPE, 7));
        } else {
            this._shapesUsed = 4;
            this.dispatchEvent(new CanvasEvent(CanvasEvent.SHAPE, -7));
        }
    }

    public get fixedAngleTurret(): boolean {
        return this._fixedAngleTurret;
    }

    public set fixedAngleTurret(param1: any) {
        if (param1 < -110) {
            param1 = true;
        }
        if (param1 > 110) {
            param1 = true;
        }
        this._fixedAngleTurret = param1;
        this.turret.rotation = this._fixedAngleTurret ? this._turretAngle : 0;
        this.setAttributes();
        this.drawAnchor();
        if (this._selected) {
            this.drawBoundingBox();
        }
        this.x = this.x;
        this.y = this.y;
        this.setLight();
    }

    public get turretAngle(): number {
        return this._turretAngle;
    }

    public set turretAngle(param1: number) {
        this._turretAngle = param1;
        this.turret.rotation = this._fixedAngleTurret ? this._turretAngle : 0;
        this.drawAnchor();
        if (this._selected) {
            this.drawBoundingBox();
        }
        this.x = this.x;
        this.y = this.y;
    }

    public get triggerFiring(): boolean {
        return this._triggerFiring;
    }

    public set triggerFiring(param1: boolean) {
        this._triggerFiring = param1;
        this.setLight();
    }

    private setLight() {
        if (this._startDeactivated) {
            this.light.gotoAndStop(4);
        } else if (this._triggerFiring) {
            this.light.gotoAndStop(3);
        } else if (this._fixedAngleTurret) {
            this.light.gotoAndStop(2);
        } else {
            this.light.gotoAndStop(1);
        }
    }

    public get startDeactivated(): boolean {
        return this._startDeactivated;
    }

    public set startDeactivated(param1: boolean) {
        this._startDeactivated = param1;
        this.setLight();
    }

    private drawAnchor() {
        this.anchorSprite.graphics.clear();
        this.anchorSprite.graphics.lineStyle(1, 0, 1);
        this.anchorSprite.graphics.moveTo(-22, -17);
        var _loc1_ = new b2Vec2(0, -45);
        var _loc2_ = new b2Mat22((-this.turret.rotation * Math.PI) / 180);
        _loc1_.MulTM(_loc2_);
        _loc1_.y += -35;
        var _loc3_ = new b2Vec2(_loc1_.x + 22, _loc1_.y + 17);
        var _loc4_: number = _loc3_.Length() * 0.25;
        _loc3_.Normalize();
        var _loc5_ = new b2Vec2(-22, -17);
        _loc5_.x += _loc4_ * 3 * _loc3_.x;
        _loc5_.y += _loc4_ * 3 * _loc3_.y;
        _loc5_.x += _loc4_ * _loc3_.y;
        _loc5_.y -= _loc4_ * _loc3_.x;
        this.anchorSprite.graphics.curveTo(
            _loc5_.x,
            _loc5_.y,
            _loc1_.x,
            _loc1_.y,
        );
    }
}