import RefJoint from "@/com/totaljerkface/game/editor/RefJoint";
import RefSprite from "@/com/totaljerkface/game/editor/RefSprite";
import Action from "@/com/totaljerkface/game/editor/actions/Action";
import ActionProperty from "@/com/totaljerkface/game/editor/actions/ActionProperty";
import { boundClass } from 'autobind-decorator';
import Point from "flash/geom/Point";

@boundClass
export default class Special extends RefSprite {
    protected _type: string;

    constructor() {
        super();
        if (!this._triggerString) {
            this._triggerString = "triggerActionsSpecial";
        }
    }

    public get type(): string {
        return this._type;
    }

    public override clone(): RefSprite {
        var _loc1_ = new Special();
        _loc1_.x = this.x;
        _loc1_.y = this.y;
        return _loc1_;
    }

    public override setProperty(param1: string, param2): Action {
        var _loc3_: Action = null;
        var _loc4_: Action = null;
        var _loc9_ = 0;
        var _loc10_: RefJoint = null;
        if (
            ((param1 == "immovable2" && param2 == true) ||
                (param1 == "interactive" && param2 == false)) &&
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

    public override get groupable(): boolean {
        if (this._inGroup) {
            return false;
        }
        return this._groupable;
    }

    public get triggerActionsSpecial(): Dictionary<any, any> {
        return this._triggerActions;
    }
}