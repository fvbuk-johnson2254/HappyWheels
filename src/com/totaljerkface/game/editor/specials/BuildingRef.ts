import RefSprite from "@/com/totaljerkface/game/editor/RefSprite";
import Special from "@/com/totaljerkface/game/editor/specials/Special";
import { boundClass } from 'autobind-decorator';
import BitmapData from "flash/display/BitmapData";

@boundClass
export default class BuildingRef extends Special {
    protected tileWidth: number;
    protected tileHeight: number = 165;
    protected roofHeight: number = 100;
    protected minFloors: number = 3;
    protected maxFloors: number = 50;
    protected minFloorWidth: number = 1;
    protected maxFloorWidth: number = 10;
    protected _numFloors: number = 3;
    protected _floorWidth: number = 1;
    protected roofBMD: BitmapData;
    protected floorBMD: BitmapData;

    constructor() {
        super();
        this._shapesUsed = 1;
        this.rotatable = false;
        this.scalable = false;
        this.mouseChildren = false;
        this.createTextures();
        this.drawBuilding();
    }

    public override setAttributes() {
        this._type = "BuildingRef";
        this._attributes = ["x", "y", "floorWidth", "numFloors"];
    }

    protected createTextures() { }

    protected drawBuilding() { }

    public override clone(): RefSprite {
        var _loc1_: BuildingRef = null;
        _loc1_ = new BuildingRef();
        _loc1_.x = this.x;
        _loc1_.y = this.y;
        _loc1_.numFloors = this._numFloors;
        _loc1_.floorWidth = this._floorWidth;
        return _loc1_;
    }

    public get numFloors(): number {
        return this._numFloors;
    }

    public set numFloors(param1: number) {
        if (param1 < this.minFloors) {
            param1 = this.minFloors;
        }
        if (param1 > this.maxFloors) {
            param1 = this.maxFloors;
        }
        if (this._numFloors == param1) {
            return;
        }
        this._numFloors = param1;
        this.drawBuilding();
        if (this._selected) {
            this.drawBoundingBox();
        }
        this.x = this.x;
        this.y = this.y;
    }

    public get floorWidth(): number {
        return this._floorWidth;
    }

    public set floorWidth(param1: number) {
        if (param1 < this.minFloorWidth) {
            param1 = this.minFloorWidth;
        }
        if (param1 > this.maxFloorWidth) {
            param1 = this.maxFloorWidth;
        }
        if (this._floorWidth == param1) {
            return;
        }
        this._floorWidth = param1;
        this.drawBuilding();
        if (this._selected) {
            this.drawBoundingBox();
        }
        this.x = this.x;
        this.y = this.y;
    }
}