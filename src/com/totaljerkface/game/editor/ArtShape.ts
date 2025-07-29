import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import ArtTool from "@/com/totaljerkface/game/editor/ArtTool";
import EdgeShape from "@/com/totaljerkface/game/editor/EdgeShape";
import RefSprite from "@/com/totaljerkface/game/editor/RefSprite";
import BezierVert from "@/com/totaljerkface/game/editor/vertedit/BezierVert";
import Vert from "@/com/totaljerkface/game/editor/vertedit/Vert";
import { boundClass } from 'autobind-decorator';
import GraphicsPathCommand from "flash/display/GraphicsPathCommand";
import GraphicsPathWinding from "flash/display/GraphicsPathWinding";
import Sprite from "flash/display/Sprite";

@boundClass
export default class ArtShape extends EdgeShape {
    protected _handleVector: Vector<b2Vec2>;

    constructor(
        param1: boolean = false,
        param2: boolean = false,
        param3: boolean = false,
        param4: number = 1,
        param5: number = 4032711,
        param6: number = -1,
        param7: number = 100,
        param8: number = 1,
    ) {
        super(param1, param2, param3, param4, param5, param6, param7, param8);
        this._handleVector = new Vector<b2Vec2>();
        this.scalable = true;
        // @ts-expect-error
        this.joinable = false;
        this.minDimension = 0.1;
        this.maxDimension = 10;
        this.name = "art shape";
    }

    public static bezierValue(
        param1: number,
        param2: number,
        param3: number,
        param4: number,
        param5: number,
    ): number {
        var _loc6_: number = param5 - 3 * param4 + 3 * param3 - param2;
        var _loc7_: number = 3 * param4 - 6 * param3 + 3 * param2;
        var _loc8_: number = 3 * param3 - 3 * param2;
        var _loc9_: number = param2;
        return ((_loc6_ * param1 + _loc7_) * param1 + _loc8_) * param1 + _loc9_;
    }

    public override setAttributes() {
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

    public override addVert(param1: Vert, param2: number = -1) {
        var _loc3_: BezierVert = param1 as BezierVert;
        if (!_loc3_) {
            throw new Error("trying to add a regular vert into an art shape");
        }
        if (param2 < 0) {
            if (this._editMode) {
                this._vertContainer.addChild(param1);
            }
            this._vertVector.push(param1.vec);
            this._handleVector.push(_loc3_.handle1.vec);
            this._handleVector.push(_loc3_.handle2.vec);
        } else {
            if (this._editMode) {
                this._vertContainer.addChildAt(param1, param2);
            }
            this._vertVector.splice(param2, 0, param1.vec);
            this._handleVector.splice(
                param2 * 2,
                0,
                _loc3_.handle1.vec,
                _loc3_.handle2.vec,
            );
        }
    }

    public override removeVert(param1: number = -1) {
        if (param1 < 0) {
            param1 = this._vertContainer.numChildren - 1;
            this._vertContainer.removeChildAt(param1);
            this._vertVector.pop();
            this._handleVector.pop();
            this._handleVector.pop();
        } else {
            this._vertContainer.removeChildAt(param1);
            this._vertVector.splice(param1, 1);
            this._handleVector.splice(param1 * 2, 2);
        }
    }

    private addBezierCommands(
        param1: Vector<number>,
        param2: Vector<number>,
        param3: b2Vec2,
        param4: b2Vec2,
        param5: b2Vec2,
        param6: b2Vec2,
    ) {
        if (param5.x == 0 && param5.y == 0 && param6.x == 0 && param6.y == 0) {
            param1.push(GraphicsPathCommand.LINE_TO);
            param2.push(param4.x, param4.y);
        } else {
            param1.push(GraphicsPathCommand.CUBIC_CURVE_TO);
            param2.push(param5.x, param5.y);
            param2.push(param6.x, param6.y);
            param2.push(param4.x, param4.y);
        }
    }

    public override drawEditMode(
        param1: b2Vec2,
        param2: boolean,
        param3: boolean = false,
    ) {
        var _loc7_: BezierVert = null;
        var _loc8_: number = 0;
        var _loc9_: BezierVert = null;
        var _loc10_: BezierVert = null;
        var _loc11_: BezierVert = null;
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
            _loc7_ = this._vertContainer.getChildAt(0) as BezierVert;
            _loc4_.push(GraphicsPathCommand.MOVE_TO);
            _loc5_.push(_loc7_.x);
            _loc5_.push(_loc7_.y);
            _loc8_ = 1;
            while (_loc8_ < _loc6_) {
                _loc9_ = this._vertContainer.getChildAt(_loc8_) as BezierVert;
                this.addBezierCommands(
                    _loc4_,
                    _loc5_,
                    _loc7_.position,
                    _loc9_.position,
                    _loc7_.anchor2,
                    _loc9_.anchor1,
                );
                _loc7_ = _loc9_;
                _loc8_++;
            }
        }
        if (param1) {
            this.graphics.lineStyle(0, 0, 0.5, false);
            _loc10_ = this._vertContainer.getChildAt(
                this._vertContainer.numChildren - 1,
            ) as BezierVert;
            _loc11_ = this._vertContainer.getChildAt(0) as BezierVert;
            if (param2) {
                this.addBezierCommands(
                    _loc4_,
                    _loc5_,
                    _loc10_.position,
                    _loc11_.position,
                    _loc10_.anchor2,
                    _loc11_.anchor1,
                );
                this.graphics.drawPath(
                    _loc4_,
                    _loc5_,
                    GraphicsPathWinding.EVEN_ODD,
                );
                this.graphics.endFill();
            } else {
                if (param3) {
                    this.addBezierCommands(
                        _loc4_,
                        _loc5_,
                        _loc10_.position,
                        param1,
                        _loc10_.anchor2,
                        param1,
                    );
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
        var _loc6_: b2Vec2 = null;
        var _loc7_: b2Vec2 = null;
        var _loc8_: b2Vec2 = null;
        this.graphics.clear();
        var _loc1_: Vector<number> = new Vector<number>();
        var _loc2_: Vector<number> = new Vector<number>();
        if (this.outlineColor >= 0) {
            this.graphics.lineStyle(
                0,
                this._outlineColor,
                this._opacity,
                false,
            );
        }
        if (this._completeFill) {
            this.graphics.beginFill(this._color, this._opacity);
        } else if (this._outlineColor == -1) {
            this.graphics.lineStyle(0, 0, this._opacity, false);
        }
        var _loc3_ = int(this._vertVector.length);
        if (_loc3_ > 0) {
            _loc4_ = this._vertVector[0];
            _loc1_.push(GraphicsPathCommand.MOVE_TO);
            _loc2_.push(_loc4_.x);
            _loc2_.push(_loc4_.y);
            _loc5_ = 1;
            while (_loc5_ < _loc3_) {
                _loc6_ = this._vertVector[_loc5_];
                _loc7_ = this._handleVector[(_loc5_ - 1) * 2 + 1].Copy();
                _loc8_ = this._handleVector[_loc5_ * 2].Copy();
                _loc7_.Add(_loc4_);
                _loc8_.Add(_loc6_);
                this.addBezierCommands(
                    _loc1_,
                    _loc2_,
                    _loc4_,
                    _loc6_,
                    _loc7_,
                    _loc8_,
                );
                _loc4_ = _loc6_;
                _loc5_++;
            }
            if (this._completeFill) {
                _loc6_ = this._vertVector[0];
                _loc7_ = this._handleVector[(_loc5_ - 1) * 2 + 1].Copy();
                _loc8_ = this._handleVector[0].Copy();
                _loc7_.Add(_loc4_);
                _loc8_.Add(_loc6_);
                this.addBezierCommands(
                    _loc1_,
                    _loc2_,
                    _loc4_,
                    _loc6_,
                    _loc7_,
                    _loc8_,
                );
                this.graphics.drawPath(
                    _loc1_,
                    _loc2_,
                    GraphicsPathWinding.NON_ZERO,
                );
                this.graphics.endFill();
            } else {
                this.graphics.drawPath(
                    _loc1_,
                    _loc2_,
                    GraphicsPathWinding.NON_ZERO,
                );
            }
            this.setDefaultDimensions();
        }
    }

    public override getFlatSprite(): Sprite {
        var _loc1_: Sprite = null;
        var _loc7_: b2Vec2 = null;
        var _loc8_: b2Vec2 = null;
        var _loc9_: b2Vec2 = null;
        _loc1_ = new Sprite();
        if (this._opacity == 0 || (this._outlineColor < 0 && this._color < 0)) {
            _loc1_.visible = false;
        }
        if (this._outlineColor >= 0) {
            _loc1_.graphics.lineStyle(0, this._outlineColor, 1, false);
        }
        if (this._completeFill) {
            if (this._color >= 0) {
                _loc1_.graphics.beginFill(this._color, 1);
            }
        } else if (this._outlineColor == -1) {
            _loc1_.graphics.lineStyle(0, 0, 1, false);
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
            _loc7_ = this._vertVector[_loc6_];
            _loc8_ = this._handleVector[(_loc6_ - 1) * 2 + 1].Copy();
            _loc9_ = this._handleVector[_loc6_ * 2].Copy();
            _loc8_.Add(_loc4_);
            _loc9_.Add(_loc7_);
            this.addBezierCommands(
                _loc2_,
                _loc3_,
                _loc4_,
                _loc7_,
                _loc8_,
                _loc9_,
            );
            _loc4_ = _loc7_;
            _loc6_++;
        }
        if (this._completeFill) {
            _loc7_ = this._vertVector[0];
            _loc8_ = this._handleVector[(_loc6_ - 1) * 2 + 1].Copy();
            _loc9_ = this._handleVector[0].Copy();
            _loc8_.Add(_loc4_);
            _loc9_.Add(_loc7_);
            this.addBezierCommands(
                _loc2_,
                _loc3_,
                _loc4_,
                _loc7_,
                _loc8_,
                _loc9_,
            );
            _loc1_.graphics.drawPath(
                _loc2_,
                _loc3_,
                GraphicsPathWinding.NON_ZERO,
            );
            _loc1_.graphics.endFill();
        } else {
            _loc1_.graphics.drawPath(
                _loc2_,
                _loc3_,
                GraphicsPathWinding.NON_ZERO,
            );
        }
        _loc1_.x = this.x;
        _loc1_.y = this.y;
        _loc1_.scaleX = this.scaleX;
        _loc1_.scaleY = this.scaleY;
        _loc1_.rotation = this.rotation;
        _loc1_.alpha = this._opacity;
        return _loc1_;
    }

    public override clone(): RefSprite {
        var _loc4_: b2Vec2 = null;
        var _loc5_: number = 0;
        var _loc6_: b2Vec2 = null;
        var _loc7_: b2Vec2 = null;
        var _loc1_ = new ArtShape(
            this.interactive,
            this.immovable,
            this.sleeping,
            this.density,
            this.color,
            this.outlineColor,
            this.opacity,
            this.collision,
        );
        var _loc2_ = int(this._vertVector.length);
        var _loc3_: number = 0;
        while (_loc3_ < _loc2_) {
            _loc4_ = this._vertVector[_loc3_].Copy();
            _loc1_.vertVector.push(_loc4_);
            _loc5_ = _loc3_ * 2;
            _loc6_ = this._handleVector[_loc5_].Copy();
            _loc7_ = this._handleVector[_loc5_ + 1].Copy();
            _loc1_.handleVector.push(_loc6_, _loc7_);
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
        ArtTool.updateIdCounter(param1);
    }

    protected override populateVertContainer() {
        var _loc3_: BezierVert = null;
        var _loc4_: number = 0;
        this.destroyVertContainer();
        this._vertContainer = new Sprite();
        var _loc1_ = int(this._vertVector.length);
        var _loc2_: number = 0;
        while (_loc2_ < _loc1_) {
            _loc3_ = new BezierVert();
            _loc3_.edgeShape = this;
            _loc3_.vec = this._vertVector[_loc2_];
            _loc4_ = _loc2_ * 2;
            _loc3_.handle1.vec = this._handleVector[_loc4_];
            _loc3_.handle2.vec = this._handleVector[_loc4_ + 1];
            this._vertContainer.addChild(_loc3_);
            _loc2_++;
        }
    }

    public override reverse() {
        var _loc3_: b2Vec2 = null;
        var _loc4_: b2Vec2 = null;
        var _loc5_: b2Vec2 = null;
        var _loc1_: number = this.numVerts;
        this._vertVector.reverse();
        this._handleVector.reverse();
        var _loc2_: number = 0;
        while (_loc2_ < _loc1_) {
            _loc3_ = this._vertVector[_loc2_];
            _loc3_.x = -_loc3_.x;
            _loc4_ = this._handleVector[_loc2_ * 2];
            _loc5_ = this._handleVector[_loc2_ * 2 + 1];
            _loc4_.x = -_loc4_.x;
            _loc5_.x = -_loc5_.x;
            _loc2_++;
        }
        this.drawShape();
        this.drawBoundingBox();
        this.x = this.x;
        this.y = this.y;
        this.vID = ArtTool.getIDCounter();
    }

    public get handleVector(): Vector<b2Vec2> {
        return this._handleVector;
    }
}