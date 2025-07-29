import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import EdgeShape from "@/com/totaljerkface/game/editor/EdgeShape";
import PolygonTool from "@/com/totaljerkface/game/editor/PolygonTool";
import RefSprite from "@/com/totaljerkface/game/editor/RefSprite";
import Vert from "@/com/totaljerkface/game/editor/vertedit/Vert";
import { boundClass } from 'autobind-decorator';
import GraphicsPathCommand from "flash/display/GraphicsPathCommand";
import GraphicsPathWinding from "flash/display/GraphicsPathWinding";
import Sprite from "flash/display/Sprite";

@boundClass
export default class PolygonShape extends EdgeShape {
    constructor(
        param1: boolean = true,
        param2: boolean = true,
        param3: boolean = false,
        param4: number = 1,
        param5: number = 4032711,
        param6: number = -1,
        param7: number = 100,
        param8: number = 1,
    ) {
        super(param1, param2, param3, param4, param5, param6, param7, param8);
        this._vertContainer = new Sprite();
        this.scalable = true;
        this.minDimension = 0.1;
        this.maxDimension = 10;
        this.name = "polygon shape";
        this.doubleClickEnabled = true;
    }

    public override setAttributes() {
        if (this._interactive) {
            this._attributes = [
                "x",
                "y",
                "shapeWidth",
                "shapeHeight",
                "angle",
                "color",
                "outlineColor",
                "opacity",
                "immovable",
                "collision",
            ];
        } else {
            this._attributes = [
                "x",
                "y",
                "shapeWidth",
                "shapeHeight",
                "angle",
                "color",
                "outlineColor",
                "opacity",
            ];
        }
        this.addTriggerProperties();
    }

    public override get functions(): any[] {
        var _loc1_ = new Array();
        _loc1_.push("reverseShape");
        _loc1_.push("resetScale");
        if (this.groupable) {
            _loc1_.push("groupSelected");
        }
        return _loc1_;
    }

    public override drawEditMode(
        param1: b2Vec2,
        param2: boolean,
        param3: boolean = false,
    ) {
        var _loc7_: Vert = null;
        var _loc8_: number = 0;
        var _loc9_: Vert = null;
        var _loc10_: Vert = null;
        var _loc11_: Vert = null;
        this.graphics.clear();
        var _loc4_: Vector<number> = new Vector<number>();
        var _loc5_: Vector<number> = new Vector<number>();
        this.graphics.lineStyle(0, 0, this._opacity, false);
        if (this.outlineColor >= 0) {
            this.graphics.lineStyle(
                0,
                this._outlineColor,
                this._opacity,
                false,
            );
        }
        if (param2) {
            this.graphics.beginFill(this._color, this._opacity);
        }
        var _loc6_: number = this._vertContainer.numChildren;
        if (_loc6_ > 0) {
            _loc7_ = this._vertContainer.getChildAt(0) as Vert;
            _loc4_.push(GraphicsPathCommand.MOVE_TO);
            _loc5_.push(_loc7_.x);
            _loc5_.push(_loc7_.y);
            _loc8_ = 1;
            while (_loc8_ < _loc6_) {
                _loc9_ = this._vertContainer.getChildAt(_loc8_) as Vert;
                _loc4_.push(GraphicsPathCommand.LINE_TO);
                _loc5_.push(_loc9_.x, _loc9_.y);
                _loc7_ = _loc9_;
                _loc8_++;
            }
        }
        if (param1) {
            this.graphics.lineStyle(0, 0, 0.5, false);
            _loc10_ = this._vertContainer.getChildAt(
                this._vertContainer.numChildren - 1,
            ) as Vert;
            _loc11_ = this._vertContainer.getChildAt(0) as Vert;
            if (param2) {
                _loc4_.push(GraphicsPathCommand.LINE_TO);
                _loc5_.push(param1.x, param1.y);
                this.graphics.drawPath(
                    _loc4_,
                    _loc5_,
                    GraphicsPathWinding.EVEN_ODD,
                );
                this.graphics.endFill();
            } else {
                if (param3) {
                    _loc4_.push(GraphicsPathCommand.LINE_TO);
                    _loc5_.push(param1.x, param1.y);
                }
                this.graphics.drawPath(
                    _loc4_,
                    _loc5_,
                    GraphicsPathWinding.NON_ZERO,
                );
            }
        } else {
            this.graphics.drawPath(
                _loc4_,
                _loc5_,
                GraphicsPathWinding.NON_ZERO,
            );
            if (param2) {
                this.graphics.endFill();
            }
        }
    }

    protected override drawShape() {
        var _loc4_: b2Vec2 = null;
        var _loc5_: number = 0;
        this.graphics.clear();
        var _loc1_: Vector<number> = new Vector<number>();
        var _loc2_: Vector<number> = new Vector<number>();
        if (this.outlineColor >= 0) {
            this.graphics.lineStyle(0, this._outlineColor, this._opacity, true);
        }
        this.graphics.beginFill(this._color, this._opacity);
        var _loc3_ = int(this._vertVector.length);
        if (_loc3_ > 0) {
            _loc4_ = this._vertVector[0];
            _loc1_.push(GraphicsPathCommand.MOVE_TO);
            _loc2_.push(_loc4_.x);
            _loc2_.push(_loc4_.y);
            _loc5_ = 1;
            while (_loc5_ < _loc3_) {
                _loc4_ = this._vertVector[_loc5_];
                _loc1_.push(GraphicsPathCommand.LINE_TO);
                _loc2_.push(_loc4_.x);
                _loc2_.push(_loc4_.y);
                _loc5_++;
            }
            _loc4_ = this._vertVector[0];
            _loc1_.push(GraphicsPathCommand.LINE_TO);
            _loc2_.push(_loc4_.x);
            _loc2_.push(_loc4_.y);
            this.graphics.drawPath(
                _loc1_,
                _loc2_,
                GraphicsPathWinding.NON_ZERO,
            );
            this.graphics.endFill();
            this.setDefaultDimensions();
        }
    }

    public override getFlatSprite(): Sprite {
        var _loc1_: Sprite = null;
        _loc1_ = new Sprite();
        if (this._opacity == 0 || (this._outlineColor < 0 && this._color < 0)) {
            _loc1_.visible = false;
        }
        if (this._outlineColor >= 0) {
            _loc1_.graphics.lineStyle(0, this._outlineColor, 1, true);
        }
        if (this._color >= 0) {
            _loc1_.graphics.beginFill(this._color, 1);
        }
        var _loc2_: Vector<number> = new Vector<number>();
        var _loc3_: Vector<number> = new Vector<number>();
        var _loc4_: b2Vec2 = this._vertVector[0];
        _loc2_.push(GraphicsPathCommand.MOVE_TO);
        _loc3_.push(_loc4_.x);
        _loc3_.push(_loc4_.y);
        var _loc5_ = int(this._vertVector.length);
        var _loc6_: number = 1;
        while (_loc6_ < _loc5_) {
            _loc4_ = this._vertVector[_loc6_];
            _loc2_.push(GraphicsPathCommand.LINE_TO);
            _loc3_.push(_loc4_.x);
            _loc3_.push(_loc4_.y);
            _loc6_++;
        }
        _loc4_ = this._vertVector[0];
        _loc2_.push(GraphicsPathCommand.LINE_TO);
        _loc3_.push(_loc4_.x);
        _loc3_.push(_loc4_.y);
        _loc1_.graphics.drawPath(_loc2_, _loc3_, GraphicsPathWinding.NON_ZERO);
        _loc1_.graphics.endFill();
        _loc1_.x = this.x;
        _loc1_.y = this.y;
        _loc1_.scaleX = this.scaleX;
        _loc1_.scaleY = this.scaleY;
        _loc1_.rotation = this.rotation;
        _loc1_.alpha = this._opacity;
        return _loc1_;
    }

    public getCenteredSprite(param1: b2Vec2): Sprite {
        var _loc2_: Sprite = null;
        _loc2_ = new Sprite();
        if (this._opacity == 0 || (this._outlineColor < 0 && this._color < 0)) {
            _loc2_.visible = false;
        }
        if (this.outlineColor >= 0) {
            _loc2_.graphics.lineStyle(0, this._outlineColor, 1, true);
        }
        if (this.color >= 0) {
            _loc2_.graphics.beginFill(this._color, 1);
        }
        var _loc3_: Vector<number> = new Vector<number>();
        var _loc4_: Vector<number> = new Vector<number>();
        var _loc5_: b2Vec2 = this._vertVector[0];
        _loc3_.push(GraphicsPathCommand.MOVE_TO);
        _loc4_.push(this.scaleX * _loc5_.x - param1.x);
        _loc4_.push(this.scaleY * _loc5_.y - param1.y);
        var _loc6_ = int(this._vertVector.length);
        var _loc7_: number = 1;
        while (_loc7_ < _loc6_) {
            _loc5_ = this._vertVector[_loc7_];
            _loc3_.push(GraphicsPathCommand.LINE_TO);
            _loc4_.push(this.scaleX * _loc5_.x - param1.x);
            _loc4_.push(this.scaleY * _loc5_.y - param1.y);
            _loc7_++;
        }
        _loc5_ = _loc5_ = this._vertVector[0];
        _loc3_.push(GraphicsPathCommand.LINE_TO);
        _loc4_.push(this.scaleX * _loc5_.x - param1.x);
        _loc4_.push(this.scaleY * _loc5_.y - param1.y);
        _loc2_.graphics.drawPath(_loc3_, _loc4_, GraphicsPathWinding.NON_ZERO);
        _loc2_.graphics.endFill();
        _loc2_.x = this.x;
        _loc2_.y = this.y;
        _loc2_.rotation = this.rotation;
        _loc2_.alpha = this._opacity;
        return _loc2_;
    }

    public override clone(): RefSprite {
        var _loc4_: b2Vec2 = null;
        var _loc1_ = new PolygonShape(
            this.interactive,
            this.immovable,
            this.sleeping,
            this.density,
            this.color,
            this.outlineColor,
            this.opacity,
            this.collision,
        );
        var _loc2_: number = this.numVerts;
        var _loc3_: number = 0;
        while (_loc3_ < _loc2_) {
            _loc4_ = this._vertVector[_loc3_].Copy();
            _loc1_.vertVector.push(_loc4_);
            _loc3_++;
        }
        _loc1_.completeFill = this.completeFill;
        _loc1_.drawShape();
        _loc1_.vID = this.vID;
        _loc1_.scaleY = this.scaleY;
        _loc1_.scaleX = this.scaleX;
        _loc1_.angle = this.angle;
        _loc1_.x = this.x;
        _loc1_.y = this.y;
        _loc1_.vehicleHandle = this.vehicleHandle;
        this.transferKeyedProperties(_loc1_);
        return _loc1_;
    }

    public override set vID(param1: number) {
        this._vID = param1;
        PolygonTool.updateIdCounter(param1);
    }
}