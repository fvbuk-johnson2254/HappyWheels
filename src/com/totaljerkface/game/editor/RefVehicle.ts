import RefGroup from "@/com/totaljerkface/game/editor/RefGroup";
import RefShape from "@/com/totaljerkface/game/editor/RefShape";
import RefSprite from "@/com/totaljerkface/game/editor/RefSprite";
import Special from "@/com/totaljerkface/game/editor/specials/Special";
import { boundClass } from 'autobind-decorator';

@boundClass
export default class RefVehicle extends RefGroup {
    public static NUM_ACTIONS: number;
    public static NUM_POSES: number = 3;
    protected _spaceAction: number = 0;
    protected _shiftAction: number = 0;
    protected _ctrlAction: number = 0;
    protected _acceleration: number = 1;
    protected _characterPose: number = 0;
    protected _lockJoints: boolean = false;
    protected _leaningStrength: number = 0;

    constructor() {
        super();
        this.name = "vehicle";
    }

    public override setAttributes() {
        this._attributes = [
            "x",
            "y",
            "angle",
            "sleeping",
            "foreground",
            "acceleration",
            "lockJoints",
            "leaningStrength",
            "spaceAction",
            "shiftAction",
            "ctrlAction",
            "characterPose",
        ];
        this.addTriggerProperties();
    }

    public override get functions(): any[] {
        return ["convertVehicleToGroup"];
    }

    public override get vehiclePossible(): boolean {
        return false;
    }

    public get acceleration(): number {
        return this._acceleration;
    }

    public set acceleration(param1: number) {
        if (param1 < 1) {
            param1 = 1;
        }
        if (param1 > 10) {
            param1 = 10;
        }
        this._acceleration = param1;
    }

    public get lockJoints(): boolean {
        return this._lockJoints;
    }

    public set lockJoints(param1: boolean) {
        this._lockJoints = param1;
    }

    public get leaningStrength(): number {
        return this._leaningStrength;
    }

    public set leaningStrength(param1: number) {
        if (param1 < 0) {
            param1 = 0;
        }
        if (param1 > 10) {
            param1 = 10;
        }
        this._leaningStrength = param1;
    }

    public get spaceAction(): number {
        return this._spaceAction;
    }

    public set spaceAction(param1: number) {
        if (param1 < 0) {
            param1 = 0;
        }
        if (param1 > RefVehicle.NUM_ACTIONS) {
            param1 = RefVehicle.NUM_ACTIONS;
        }
        this._spaceAction = param1;
    }

    public get shiftAction(): number {
        return this._shiftAction;
    }

    public set shiftAction(param1: number) {
        if (param1 < 0) {
            param1 = 0;
        }
        if (param1 > RefVehicle.NUM_ACTIONS) {
            param1 = RefVehicle.NUM_ACTIONS;
        }
        this._shiftAction = param1;
    }

    public get ctrlAction(): number {
        return this._ctrlAction;
    }

    public set ctrlAction(param1: number) {
        if (param1 < 0) {
            param1 = 0;
        }
        if (param1 > RefVehicle.NUM_ACTIONS) {
            param1 = RefVehicle.NUM_ACTIONS;
        }
        this._ctrlAction = param1;
    }

    public get characterPose(): number {
        return this._characterPose;
    }

    public set characterPose(param1: number) {
        if (param1 < 0) {
            param1 = 0;
        }
        if (param1 > RefVehicle.NUM_POSES) {
            param1 = RefVehicle.NUM_POSES;
        }
        this._characterPose = param1;
    }

    public override checkVehicleAttached(param1: any[] = null): boolean {
        return true;
    }

    public override clone(): RefSprite {
        var _loc3_: RefShape = null;
        var _loc4_: RefShape = null;
        var _loc5_: RefSprite = null;
        var _loc6_: RefSprite = null;
        var _loc1_ = new RefVehicle();
        _loc1_.offset = this.offset;
        _loc1_.x = this.x;
        _loc1_.y = this.y;
        _loc1_.angle = this.angle;
        _loc1_.sleeping = this.sleeping;
        _loc1_.foreground = this.foreground;
        // @ts-expect-error
        _loc1_.joinable = this.joinable;
        _loc1_.acceleration = this.acceleration;
        _loc1_.leaningStrength = this.leaningStrength;
        _loc1_.spaceAction = this.spaceAction;
        _loc1_.shiftAction = this.shiftAction;
        _loc1_.ctrlAction = this.ctrlAction;
        _loc1_.characterPose = this.characterPose;
        _loc1_.lockJoints = this.lockJoints;
        var _loc2_: number = 0;
        while (_loc2_ < this._shapeContainer.numChildren) {
            _loc3_ = this._shapeContainer.getChildAt(_loc2_) as RefShape;
            _loc4_ = _loc3_.clone() as RefShape;
            _loc1_.addShape(_loc4_);
            _loc4_.group = _loc1_;
            _loc4_.inGroup = true;
            _loc4_.setFilters();
            _loc2_++;
        }
        _loc2_ = 0;
        while (_loc2_ < this._specialContainer.numChildren) {
            _loc5_ = this._specialContainer.getChildAt(_loc2_) as RefSprite;
            _loc6_ = _loc5_.clone();
            _loc6_.group = _loc1_;
            _loc6_.inGroup = true;
            _loc1_.addSpecial(_loc6_ as Special);
            _loc2_++;
        }
        this.transferKeyedProperties(_loc1_);
        return _loc1_;
    }

    public cloneAsGroup(): RefGroup {
        var _loc3_: RefSprite = null;
        var _loc4_: RefSprite = null;
        var _loc1_ = new RefGroup();
        _loc1_.offset = this.offset;
        _loc1_.x = this.x;
        _loc1_.y = this.y;
        _loc1_.angle = this.angle;
        _loc1_.sleeping = this.sleeping;
        _loc1_.foreground = this.foreground;
        // @ts-expect-error
        _loc1_.joinable = this.joinable;
        var _loc2_: number = 0;
        while (_loc2_ < this._shapeContainer.numChildren) {
            _loc3_ = this._shapeContainer.getChildAt(_loc2_) as RefSprite;
            _loc4_ = _loc3_.clone();
            _loc4_.group = _loc1_;
            _loc4_.inGroup = true;
            _loc1_.addShape(_loc4_ as RefShape);
            _loc2_++;
        }
        _loc2_ = 0;
        while (_loc2_ < this._specialContainer.numChildren) {
            _loc3_ = this._specialContainer.getChildAt(_loc2_) as RefSprite;
            _loc4_ = _loc3_.clone();
            _loc4_.group = _loc1_;
            _loc4_.inGroup = true;
            _loc1_.addSpecial(_loc4_ as Special);
            _loc2_++;
        }
        return _loc1_;
    }
}