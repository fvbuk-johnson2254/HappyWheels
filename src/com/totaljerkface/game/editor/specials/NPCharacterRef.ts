import RefJoint from "@/com/totaljerkface/game/editor/RefJoint";
import RefSprite from "@/com/totaljerkface/game/editor/RefSprite";
import Action from "@/com/totaljerkface/game/editor/actions/Action";
import ActionProperty from "@/com/totaljerkface/game/editor/actions/ActionProperty";
import Special from "@/com/totaljerkface/game/editor/specials/Special";
import NPCSprite from "@/com/totaljerkface/game/editor/specials/npcsprites/NPCSprite";
import CanvasEvent from "@/com/totaljerkface/game/events/CanvasEvent";
import { boundClass } from 'autobind-decorator';
import Point from "flash/geom/Point";

@boundClass
export default class NPCharacterRef extends Special {
    public static NUM_CHARACTERS: number;
    private _npcSprite: NPCSprite;
    private _neckAngle: number = 0;
    private _shoulder1Angle: number = 0;
    private _shoulder2Angle: number = 0;
    private _elbow1Angle: number = 0;
    private _elbow2Angle: number = 0;
    private _hip1Angle: number = 0;
    private _hip2Angle: number = 0;
    private _knee1Angle: number = 0;
    private _knee2Angle: number = 0;
    private _reverse: boolean;
    private _sleeping: boolean;
    private _holdPose: boolean;
    private _interactive: boolean;
    private _destroyJointsUponDeath: boolean;
    private _charIndex: number = 1;

    constructor() {
        super();
        this._triggerable = true;
        this._triggers = new Array();
        this._triggerActions = new Dictionary();
        this._triggerActionList = [
            "wake from sleep",
            "apply impulse",
            "hold pose",
            "release pose",
        ];
        this._triggerActionListProperties = [
            null,
            ["impulseX", "impulseY", "spin"],
            null,
            null,
        ];
        this._triggerString = "triggerActionsNPC";

        this.name = "non-player character";
        this._shapesUsed = 24;
        this._artUsed = 0;
        this._rotatable = true;
        this._scalable = false;
        this._groupable = false;
        this._joinable = true;
        this._interactive = true;
        this._destroyJointsUponDeath = false;
        this._joints = new Array();
        this._keyedPropertyObject[this._triggerString] = this._triggerActions;
        this.doubleClickEnabled = true;
        var _loc1_ = getDefinitionByName(
            "com.totaljerkface.game.editor.specials.npcsprites.NPCSprite" +
            this._charIndex,
        );
        // @ts-expect-error
        this._npcSprite = new _loc1_();
        this.addChild(this._npcSprite);
        this._npcSprite.scaleX = this._npcSprite.scaleY = 0.5;
    }

    public override setAttributes() {
        this._type = "NPCharacterRef";
        this._attributes = [
            "x",
            "y",
            "angle",
            "charIndex",
            "sleeping",
            "reverse",
            "holdPose",
            "interactive",
            "neckAngle",
            "shoulder1Angle",
            "shoulder2Angle",
            "elbow1Angle",
            "elbow2Angle",
            "hip1Angle",
            "hip2Angle",
            "knee1Angle",
            "knee2Angle",
            "destroyJointsUponDeath",
        ];
        this.addTriggerProperties();
    }

    public override clone(): RefSprite {
        var _loc1_: NPCharacterRef = null;
        _loc1_ = new NPCharacterRef();
        _loc1_.angle = this.angle;
        _loc1_.sleeping = this.sleeping;
        _loc1_.reverse = this.reverse;
        _loc1_.holdPose = this.holdPose;
        _loc1_.interactive = this.interactive;
        _loc1_.neckAngle = this.neckAngle;
        _loc1_.shoulder1Angle = this.shoulder1Angle;
        _loc1_.shoulder2Angle = this.shoulder2Angle;
        _loc1_.elbow1Angle = this.elbow1Angle;
        _loc1_.elbow2Angle = this.elbow2Angle;
        _loc1_.hip1Angle = this.hip1Angle;
        _loc1_.hip2Angle = this.hip2Angle;
        _loc1_.knee1Angle = this.knee1Angle;
        _loc1_.knee2Angle = this.knee2Angle;
        _loc1_.charIndex = this.charIndex;
        _loc1_.destroyJointsUponDeath = this.destroyJointsUponDeath;
        _loc1_.x = this.x;
        _loc1_.y = this.y;
        this.transferKeyedProperties(_loc1_);
        return _loc1_;
    }

    public get npcSprite(): NPCSprite {
        return this._npcSprite;
    }

    public get charIndex(): number {
        return this._charIndex;
    }

    public set charIndex(param1: number) {
        if (this._charIndex == param1) {
            return;
        }
        if (param1 < 1) {
            param1 = 1;
        }
        if (param1 > NPCharacterRef.NUM_CHARACTERS) {
            param1 = NPCharacterRef.NUM_CHARACTERS;
        }
        this._charIndex = param1;
        this.removeChild(this._npcSprite);
        var _loc2_ = getDefinitionByName(
            "com.totaljerkface.game.editor.specials.npcsprites.NPCSprite" +
            this._charIndex,
        );
        // @ts-expect-error
        this._npcSprite = new _loc2_();
        this.addChild(this._npcSprite);
        this._npcSprite.scaleX = this._reverse ? -0.5 : 0.5;
        this._npcSprite.scaleY = 0.5;
        this._npcSprite.headOuter.rotation = this._neckAngle;
        this._npcSprite.arm1.rotation = this._shoulder1Angle;
        this._npcSprite.arm2.rotation = this._shoulder2Angle;
        this._npcSprite.lowerArmOuter1.rotation = this._elbow1Angle;
        this._npcSprite.lowerArmOuter2.rotation = this._elbow2Angle;
        this._npcSprite.leg1.rotation = this._hip1Angle;
        this._npcSprite.leg2.rotation = this._hip2Angle;
        this._npcSprite.lowerLegOuter1.rotation = this._knee1Angle;
        this._npcSprite.lowerLegOuter2.rotation = this._knee2Angle;
        if (this._selected) {
            this.drawBoundingBox();
        }
        this.x = this.x;
        this.y = this.y;
    }

    public get reverse(): boolean {
        return this._reverse;
    }

    public set reverse(param1: boolean) {
        if (param1 == this._reverse) {
            return;
        }
        this._reverse = param1;
        if (this._reverse) {
            this._npcSprite.scaleX = -0.5;
        } else {
            this._npcSprite.scaleX = 0.5;
        }
        if (this._selected) {
            this.drawBoundingBox();
        }
        this.x = this.x;
        this.y = this.y;
    }

    public get destroyJointsUponDeath(): boolean {
        return this._destroyJointsUponDeath;
    }

    public set destroyJointsUponDeath(param1: boolean) {
        this._destroyJointsUponDeath = param1;
    }

    public get sleeping(): boolean {
        return this._sleeping;
    }

    public set sleeping(param1: boolean) {
        this._sleeping = param1;
    }

    public get holdPose(): boolean {
        return this._holdPose;
    }

    public set holdPose(param1: boolean) {
        this._holdPose = param1;
    }

    public get interactive(): boolean {
        return this._interactive;
    }

    public set interactive(param1: boolean) {
        if (this._interactive == param1) {
            return;
        }
        if (param1 && this._inGroup) {
            return;
        }
        this._interactive = param1;
        if (this._interactive) {
            this._groupable = false;
            this._joinable = true;
            this._shapesUsed = 24;
            this._artUsed = 0;
            this.dispatchEvent(new CanvasEvent(CanvasEvent.ART, -10));
            this.dispatchEvent(new CanvasEvent(CanvasEvent.SHAPE, 24));
        } else {
            this._groupable = true;
            this._joinable = false;
            this._shapesUsed = 0;
            this._artUsed = 10;
            this.dispatchEvent(new CanvasEvent(CanvasEvent.SHAPE, -24));
            this.dispatchEvent(new CanvasEvent(CanvasEvent.ART, 10));
        }
    }

    public get neckAngle(): number {
        return this._neckAngle;
    }

    public set neckAngle(param1: number) {
        if (param1 > 20) {
            param1 = 20;
        }
        if (param1 < -20) {
            param1 = -20;
        }
        this._npcSprite.headOuter.rotation = param1;
        this._neckAngle = param1;
        if (this._selected) {
            this.drawBoundingBox();
        }
        this.x = this.x;
        this.y = this.y;
    }

    public get shoulder1Angle(): number {
        return this._shoulder1Angle;
    }

    public set shoulder1Angle(param1: number) {
        if (param1 > 60) {
            param1 = 60;
        }
        if (param1 < -180) {
            param1 = -180;
        }
        this._npcSprite.arm1.rotation = param1;
        this._shoulder1Angle = param1;
        if (this._selected) {
            this.drawBoundingBox();
        }
        this.x = this.x;
        this.y = this.y;
    }

    public get shoulder2Angle(): number {
        return this._shoulder2Angle;
    }

    public set shoulder2Angle(param1: number) {
        if (param1 > 60) {
            param1 = 60;
        }
        if (param1 < -180) {
            param1 = -180;
        }
        this._npcSprite.arm2.rotation = param1;
        this._shoulder2Angle = param1;
        if (this._selected) {
            this.drawBoundingBox();
        }
        this.x = this.x;
        this.y = this.y;
    }

    public get elbow1Angle(): number {
        return this._elbow1Angle;
    }

    public set elbow1Angle(param1: number) {
        if (param1 > 0) {
            param1 = 0;
        }
        if (param1 < -160) {
            param1 = -160;
        }
        this._npcSprite.lowerArmOuter1.rotation = param1;
        this._elbow1Angle = param1;
        if (this._selected) {
            this.drawBoundingBox();
        }
        this.x = this.x;
        this.y = this.y;
    }

    public get elbow2Angle(): number {
        return this._elbow2Angle;
    }

    public set elbow2Angle(param1: number) {
        if (param1 > 0) {
            param1 = 0;
        }
        if (param1 < -160) {
            param1 = -160;
        }
        this._npcSprite.lowerArmOuter2.rotation = param1;
        this._elbow2Angle = param1;
        if (this._selected) {
            this.drawBoundingBox();
        }
        this.x = this.x;
        this.y = this.y;
    }

    public get hip1Angle(): number {
        return this._hip1Angle;
    }

    public set hip1Angle(param1: number) {
        if (param1 > 10) {
            param1 = 10;
        }
        if (param1 < -150) {
            param1 = -150;
        }
        this._npcSprite.leg1.rotation = param1;
        this._hip1Angle = param1;
        if (this._selected) {
            this.drawBoundingBox();
        }
        this.x = this.x;
        this.y = this.y;
    }

    public get hip2Angle(): number {
        return this._hip2Angle;
    }

    public set hip2Angle(param1: number) {
        if (param1 > 10) {
            param1 = 10;
        }
        if (param1 < -150) {
            param1 = -150;
        }
        this._npcSprite.leg2.rotation = param1;
        this._hip2Angle = param1;
        if (this._selected) {
            this.drawBoundingBox();
        }
        this.x = this.x;
        this.y = this.y;
    }

    public get knee1Angle(): number {
        return this._knee1Angle;
    }

    public set knee1Angle(param1: number) {
        if (param1 > 150) {
            param1 = 150;
        }
        if (param1 < 0) {
            param1 = 0;
        }
        this._npcSprite.lowerLegOuter1.rotation = param1;
        this._knee1Angle = param1;
        if (this._selected) {
            this.drawBoundingBox();
        }
        this.x = this.x;
        this.y = this.y;
    }

    public get knee2Angle(): number {
        return this._knee2Angle;
    }

    public set knee2Angle(param1: number) {
        if (param1 > 150) {
            param1 = 150;
        }
        if (param1 < 0) {
            param1 = 0;
        }
        this._npcSprite.lowerLegOuter2.rotation = param1;
        this._knee2Angle = param1;
        if (this._selected) {
            this.drawBoundingBox();
        }
        this.x = this.x;
        this.y = this.y;
    }

    public get tag(): string {
        var _loc1_: string = null;
        switch (this._charIndex) {
            case 1:
                _loc1_ = "Char1";
                break;
            case 2:
                _loc1_ = "Char2";
                break;
            case 3:
                _loc1_ = "Char3";
                break;
            case 4:
                _loc1_ = "Kid1";
                break;
            case 5:
                _loc1_ = "Char4";
                break;
            case 6:
                _loc1_ = "Char8";
                break;
            case 7:
                _loc1_ = "Char9";
                break;
            case 8:
                _loc1_ = "Char11";
                break;
            case 9:
                _loc1_ = "Char2";
                break;
            case 10:
                _loc1_ = "Santa";
                break;
            case 11:
                _loc1_ = "Elf1";
                break;
            case 12:
                _loc1_ = "Char12";
                break;
            case 13:
                _loc1_ = "Char4";
                break;
            case 14:
                _loc1_ = "Kid2";
                break;
            case 15:
                _loc1_ = "Kid1";
                break;
            case 16:
                _loc1_ = "Heli";
        }
        return _loc1_;
    }

    public override setProperty(param1: string, param2): Action {
        var _loc3_: Action = null;
        var _loc4_: Action = null;
        var _loc9_ = 0;
        var _loc10_: RefJoint = null;
        if (
            param1 == "interactive" &&
            param2 == false &&
            Boolean(this._joints)
        ) {
            _loc9_ = 0;
            while (_loc9_ < this._joints.length) {
                _loc10_ = this._joints[_loc9_];
                _loc3_ = _loc10_.removeBody(this);
                if (_loc4_) {
                    _loc4_.nextAction = _loc3_.firstAction;
                }
                _loc4_ = _loc3_;
                this.removeJoint(_loc10_);
                _loc9_ = --_loc9_ + 1;
            }
        }
        var _loc5_ = this[param1];
        var _loc6_ = new Point(this.x, this.y);
        this[param1] = param2;
        var _loc7_ = this[param1];
        var _loc8_ = new Point(this.x, this.y);
        if (_loc7_ != _loc5_) {
            _loc3_ = new ActionProperty(
                this,
                param1,
                _loc5_,
                _loc7_,
                _loc6_,
                _loc8_,
            );
            if (_loc4_) {
                _loc4_.nextAction = _loc3_;
            }
        }
        return _loc3_;
    }
}