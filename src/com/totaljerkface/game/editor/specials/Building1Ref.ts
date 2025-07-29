import BitmapManager from "@/com/totaljerkface/game/BitmapManager";
import RefSprite from "@/com/totaljerkface/game/editor/RefSprite";
import BuildingRef from "@/com/totaljerkface/game/editor/specials/BuildingRef";
import Building1Source from "@/top/Building1Source";
import { boundClass } from 'autobind-decorator';
import BitmapData from "flash/display/BitmapData";
import MovieClip from "flash/display/MovieClip";
import Sprite from "flash/display/Sprite";
import Matrix from "flash/geom/Matrix";

@boundClass
export default class Building1Ref extends BuildingRef {
    public static B1_ROOF: string;
    public static B1_FLOOR: string = "b1floor";

    constructor() {
        super();
        this.name = "building 1";
    }

    public override setAttributes() {
        this._type = "Building1Ref";
        this._attributes = ["x", "y", "floorWidth", "numFloors"];
    }

    protected override createTextures() {
        var _loc3_: Sprite = null;
        var _loc1_ = BitmapManager.instance;
        if (_loc1_.getTexture(Building1Ref.B1_ROOF)) {
            this.roofBMD = _loc1_.getTexture(Building1Ref.B1_ROOF);
            this.floorBMD = _loc1_.getTexture(Building1Ref.B1_FLOOR);
            return;
        }
        var _loc2_: Sprite = new Building1Source();
        _loc3_ = new Sprite();
        _loc3_.addChild(this.createBricks(this.tileWidth, this.roofHeight));
        var _loc4_: Sprite = _loc2_["roofTexture"];
        _loc3_.addChild(_loc4_);
        this.roofBMD = new BitmapData(
            this.tileWidth,
            this.roofHeight,
            false,
            0,
        );
        this.roofBMD.draw(_loc3_);
        this.floorBMD = new BitmapData(600, 330, false, 0);
        this.floorBMD.draw(this.createBricks(600, 330));
        var _loc5_: Sprite = _loc2_["windowTexture"];
        this.addWindows(_loc5_, this.floorBMD);
        var _loc6_: Sprite = _loc2_["ledgeTexture"];
        this.addLedge(_loc6_, this.floorBMD);
        _loc1_.addTexture(Building1Ref.B1_ROOF, this.roofBMD);
        _loc1_.addTexture(Building1Ref.B1_FLOOR, this.floorBMD);
    }

    protected createBricks(param1, param2): Sprite {
        var _loc9_: number = 0;
        var _loc10_ = 0;
        var _loc11_: number = NaN;
        var _loc12_: number = NaN;
        var _loc13_: number = NaN;
        var _loc14_: number = NaN;
        var _loc15_: number = NaN;
        var _loc3_ = new Sprite();
        _loc3_.graphics.beginFill(13351586, 1);
        _loc3_.graphics.drawRect(0, 0, param1, param2);
        var _loc4_: number = Math.floor(param1 / 15);
        var _loc5_: number = Math.floor(param2 / 5);
        var _loc6_: number = 0;
        var _loc7_: number = 0;
        var _loc8_: number = 0;
        while (_loc8_ < _loc5_) {
            _loc6_ = _loc8_ % 2 == 1 ? -7 : 0;
            _loc9_ = 0;
            while (_loc9_ < _loc4_) {
                _loc10_ = 9206119;
                _loc11_ = 64;
                _loc12_ = _loc11_ * 0.5;
                _loc13_ = Math.round(Math.random() * _loc11_) - _loc12_;
                _loc14_ = _loc13_ << 8;
                _loc15_ = _loc13_ << 16;
                _loc10_ += _loc13_;
                _loc10_ = _loc10_ + _loc14_;
                _loc10_ = _loc10_ + _loc15_;
                _loc3_.graphics.beginFill(_loc10_, 1);
                _loc3_.graphics.drawRect(_loc6_, _loc7_, 14, 4);
                _loc3_.graphics.endFill();
                if (_loc6_ == -7) {
                    _loc3_.graphics.beginFill(_loc10_, 1);
                    _loc3_.graphics.drawRect(_loc6_ + param1, _loc7_, 14, 4);
                    _loc3_.graphics.endFill();
                }
                _loc6_ += 15;
                _loc9_++;
            }
            _loc7_ += 5;
            _loc8_++;
        }
        return _loc3_;
    }

    protected addWindows(param1: Sprite, param2: BitmapData) {
        var _loc7_: number = 0;
        var _loc8_: Matrix = null;
        var _loc3_: number = Math.floor(param2.width / this.tileWidth) * 3;
        var _loc4_: number = Math.floor(param2.height / this.tileHeight);
        var _loc5_: number = 40;
        var _loc6_: number = 0;
        while (_loc6_ < _loc4_) {
            _loc7_ = 0;
            while (_loc7_ < _loc3_) {
                this.randomizeWindowTexture(param1);
                _loc8_ = new Matrix();
                _loc8_.translate(_loc5_ + _loc7_ * 80, _loc6_ * 165);
                param2.draw(param1, _loc8_);
                if (_loc7_ % 3 == 2) {
                    _loc5_ += 60;
                }
                _loc7_++;
            }
            _loc5_ = 40;
            _loc6_++;
        }
    }

    protected addLedge(param1: Sprite, param2: BitmapData) {
        param1.width = param2.width;
        var _loc3_ = new Matrix();
        _loc3_.scale(50, 1);
        _loc3_.translate(0, 90);
        param2.draw(param1, _loc3_);
    }

    protected randomizeWindowTexture(param1: Sprite) {
        var _loc2_: number = Math.random();
        var _loc3_: MovieClip = param1["ac"];
        var _loc4_: MovieClip = param1["frame"];
        var _loc5_: MovieClip = param1["frameShadow"];
        var _loc6_: MovieClip = param1["shade"];
        _loc3_.visible = true;
        if (_loc2_ < 0.1) {
            _loc4_.y = 8;
        } else {
            _loc3_.visible = false;
            _loc4_.y = Math.ceil(Math.random() * 43);
        }
        _loc5_.y = _loc4_.y + 4;
        _loc6_.scaleY = Math.random() * 0.8 + 0.2;
    }

    protected override drawBuilding() {
        this.graphics.clear();
        var _loc1_: number = this.tileWidth * this._floorWidth;
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
        var _loc1_ = new Building1Ref();
        _loc1_.x = this.x;
        _loc1_.y = this.y;
        _loc1_.numFloors = this._numFloors;
        _loc1_.floorWidth = this._floorWidth;
        return _loc1_;
    }
}