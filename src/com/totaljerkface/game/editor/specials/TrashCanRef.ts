import RefJoint from "@/com/totaljerkface/game/editor/RefJoint";
import RefSprite from "@/com/totaljerkface/game/editor/RefSprite";
import Action from "@/com/totaljerkface/game/editor/actions/Action";
import ActionProperty from "@/com/totaljerkface/game/editor/actions/ActionProperty";
import Special from "@/com/totaljerkface/game/editor/specials/Special";
import CanvasEvent from "@/com/totaljerkface/game/events/CanvasEvent";
import { boundClass } from 'autobind-decorator';
import MovieClip from "flash/display/MovieClip";
import Point from "flash/geom/Point";

/* [Embed(source="/_assets/assets.swf", symbol="symbol853")] */
@boundClass
export default class TrashCanRef extends Special {
    public lid: MovieClip;
    private _bottleType: number = 1;
    private _interactive: boolean = true;
    private _sleeping: boolean = false;
    private _containsTrash: boolean = true;
    private _lid: MovieClip;

    constructor() {
        super();
        this._triggerable = true;
        this._triggers = new Array();
        this._triggerActions = new Dictionary();
        this._triggerActionList = ["wake from sleep", "apply impulse"];
        this._triggerActionListProperties = [
            null,
            ["impulseX", "impulseY", "spin"],
        ];

        this.name = "trash can";
        this._lid = this.lid;
        this._shapesUsed = 13;
        this._rotatable = true;
        this._scalable = false;
        this._joinable = true;
        this._joints = new Array();
        this._keyedPropertyObject[this._triggerString] = this._triggerActions;
    }

    public override setAttributes() {
        this._type = "TrashCanRef";
        this._attributes = [
            "x",
            "y",
            "angle",
            "sleeping",
            "interactive",
            "containsTrash",
        ];
        this.addTriggerProperties();
    }

    public override clone(): RefSprite {
        var _loc1_ = new TrashCanRef();
        _loc1_.x = this.x;
        _loc1_.y = this.y;
        _loc1_.rotatable = this._rotatable;
        _loc1_.angle = this.angle;
        _loc1_.interactive = this._interactive;
        // @ts-expect-error
        _loc1_.groupable = this._groupable;
        _loc1_.joinable = this._joinable;
        _loc1_.sleeping = this._sleeping;
        _loc1_.containsTrash = this._containsTrash;
        this.transferKeyedProperties(_loc1_);
        return _loc1_;
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
            this._shapesUsed = 1;
            this._artUsed = 0;
            this.dispatchEvent(new CanvasEvent(CanvasEvent.ART, -1));
            this.dispatchEvent(new CanvasEvent(CanvasEvent.SHAPE, 1));
        } else {
            this._groupable = true;
            this._joinable = false;
            this._shapesUsed = 0;
            this._artUsed = 1;
            this.dispatchEvent(new CanvasEvent(CanvasEvent.SHAPE, -1));
            this.dispatchEvent(new CanvasEvent(CanvasEvent.ART, 1));
        }
    }

    public get sleeping(): boolean {
        return this._sleeping;
    }

    public set sleeping(param1: boolean) {
        this._sleeping = param1;
    }

    public get containsTrash(): boolean {
        return this._containsTrash;
    }

    public set containsTrash(param1: boolean) {
        if (this._containsTrash == param1) {
            return;
        }
        if (param1) {
            this.addChild(this._lid);
        } else {
            this.removeChild(this._lid);
        }
        if (this._selected) {
            this.drawBoundingBox();
        }
        this._containsTrash = param1;
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