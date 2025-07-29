import BitmapManager from "@/com/totaljerkface/game/BitmapManager";
import RefSprite from "@/com/totaljerkface/game/editor/RefSprite";
import BuildingRef from "@/com/totaljerkface/game/editor/specials/BuildingRef";
import Building2Source from "@/top/Building2Source";
import { boundClass } from 'autobind-decorator';
import BitmapData from "flash/display/BitmapData";
import Sprite from "flash/display/Sprite";
import Matrix from "flash/geom/Matrix";

@boundClass
export default class Building2Ref extends BuildingRef {
    public static B2_ROOF: string;
    public static B2_FLOOR: string = "b2floor";

    constructor() {
        super();
        this.name = "building 2";
    }

    public override setAttributes() {
        this._type = "Building2Ref";
        this._attributes = ["x", "y", "floorWidth", "numFloors"];
    }

    protected override createTextures() {
        var _loc2_: Sprite = null;
        this.tileWidth = 500;
        this.tileHeight = 180;
        this.roofHeight = 120;
        var _loc1_ = BitmapManager.instance;
        if (_loc1_.getTexture(Building2Ref.B2_ROOF)) {
            this.roofBMD = _loc1_.getTexture(Building2Ref.B2_ROOF);
            this.floorBMD = _loc1_.getTexture(Building2Ref.B2_FLOOR);
            return;
        }
        _loc2_ = new Building2Source();
        var _loc3_: Sprite = _loc2_["roofTexture"];
        this.roofBMD = new BitmapData(
            this.tileWidth,
            this.roofHeight,
            false,
            0,
        );
        this.roofBMD.draw(_loc3_);
        var _loc4_: Sprite = _loc2_["floorTexture"];
        this.floorBMD = new BitmapData(
            this.tileWidth,
            this.tileHeight,
            false,
            0,
        );
        this.floorBMD.draw(_loc4_);
        _loc1_.addTexture(Building2Ref.B2_ROOF, this.roofBMD);
        _loc1_.addTexture(Building2Ref.B2_FLOOR, this.floorBMD);
    }

    protected override drawBuilding() {
        this.graphics.clear();
        var _loc1_: number = this.tileWidth * this._floorWidth + 226;
        var _loc2_: number = 0;
        var _loc3_: number = 0;
        var _loc4_ = new Matrix(1, 0, 0, 1, _loc2_, _loc3_);
        this.graphics.beginBitmapFill(this.roofBMD, _loc4_, true, false);
        this.graphics.drawRect(_loc2_, _loc3_, _loc1_, this.roofHeight);
        this.graphics.endFill();
        _loc3_ += this.roofHeight;
        _loc4_ = new Matrix(1, 0, 0, 1, _loc2_, _loc3_);
        this.graphics.beginBitmapFill(this.floorBMD, _loc4_, true, false);
        this.graphics.drawRect(
            _loc2_,
            _loc3_,
            _loc1_,
            this.tileHeight * this._numFloors,
        );
        this.graphics.endFill();
    }

    public override clone(): RefSprite {
        var _loc1_ = new Building2Ref();
        _loc1_.x = this.x;
        _loc1_.y = this.y;
        _loc1_.numFloors = this._numFloors;
        _loc1_.floorWidth = this._floorWidth;
        return _loc1_;
    }
}