import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import PolygonTool from "@/com/totaljerkface/game/editor/PolygonTool";
import RefShape from "@/com/totaljerkface/game/editor/RefShape";
import Vert from "@/com/totaljerkface/game/editor/vertedit/Vert";
import { boundClass } from 'autobind-decorator';
import BlendMode from "flash/display/BlendMode";
import Sprite from "flash/display/Sprite";

@boundClass
export default class EdgeShape extends RefShape {
    protected _editMode: boolean;
    protected _vertContainer: Sprite;
    protected _vertVector: Vector<b2Vec2> = new Vector<b2Vec2>();
    protected _vID: number = 0;
    protected _completeFill: boolean = false;
    protected _defaultWidth: number;
    protected _defaultHeight: number;

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
        this.doubleClickEnabled = true;
    }

    public addVert(param1: Vert, param2: number = -1) {
        if (param2 < 0) {
            if (this._editMode) {
                this._vertContainer.addChild(param1);
            }
            this._vertVector.push(param1.vec);
        } else {
            if (this._editMode) {
                this._vertContainer.addChildAt(param1, param2);
            }
            this._vertVector.splice(param2, 0, param1.vec);
        }
    }

    public removeVert(param1: number = -1) {
        if (param1 < 0) {
            param1 = this._vertContainer.numChildren - 1;
            this._vertContainer.removeChildAt(param1);
            this._vertVector.pop();
        } else {
            this._vertContainer.removeChildAt(param1);
            this._vertVector.splice(param1, 1);
        }
    }

    public get numVerts(): number {
        return this._vertVector.length;
    }

    public getVertAt(param1: number): Vert {
        return this._vertContainer.getChildAt(param1) as Vert;
    }

    public getVertIndex(param1: Vert): number {
        return this._vertContainer.getChildIndex(param1);
    }

    public deselectAllVerts() {
        var _loc3_: Vert = null;
        var _loc1_: number = this.numVerts;
        var _loc2_: number = 0;
        while (_loc2_ < _loc1_) {
            _loc3_ = this._vertContainer.getChildAt(_loc2_) as Vert;
            _loc3_.selected = false;
            _loc2_++;
        }
    }

    public resizeVerts() {
        var _loc3_: Vert = null;
        var _loc1_: number = this.numVerts;
        var _loc2_: number = 0;
        while (_loc2_ < _loc1_) {
            _loc3_ = this._vertContainer.getChildAt(_loc2_) as Vert;
            _loc3_.selected = _loc3_.selected;
            _loc2_++;
        }
    }

    public drawEditMode(
        param1: b2Vec2,
        param2: boolean,
        param3: boolean = false,
    ) { }

    public redraw() {
        this.drawShape();
    }

    public override get shapeWidth(): number {
        return Math.round(this.scaleX * this._defaultWidth);
    }

    public override set shapeWidth(param1: number) {
        if (param1 == 0) {
            return;
        }
        this.scaleX = this._defaultWidth > 0 ? param1 / this._defaultWidth : 1;
    }

    public override get shapeHeight(): number {
        return Math.round(this.scaleY * this._defaultHeight);
    }

    public override set shapeHeight(param1: number) {
        if (param1 == 0) {
            return;
        }
        this.scaleY =
            this._defaultHeight > 0 ? param1 / this._defaultHeight : 1;
    }

    public get defaultWidth(): number {
        return this._defaultWidth;
    }

    public set defaultWidth(param1: number) {
        this._defaultWidth = param1;
    }

    public get defaultHeight(): number {
        return this._defaultHeight;
    }

    public set defaultHeight(param1: number) {
        this._defaultHeight = param1;
    }

    public get vID(): number {
        return this._vID;
    }

    public set vID(param1: number) { }

    public get completeFill(): boolean {
        return this._completeFill;
    }

    public set completeFill(param1: boolean) {
        this._completeFill = param1;
    }

    public get vertContainer(): Sprite {
        return this._vertContainer;
    }

    public get vertVector(): Vector<b2Vec2> {
        return this._vertVector;
    }

    public get editMode(): boolean {
        return this._editMode;
    }

    public set editMode(param1: boolean) {
        this._editMode = param1;
        if (this._editMode) {
            this.populateVertContainer();
            this.addChild(this._vertContainer);
            this.blendMode = BlendMode.INVERT;
        } else {
            this.destroyVertContainer();
            this.drawShape();
            this.blendMode = BlendMode.NORMAL;
        }
    }

    protected populateVertContainer() {
        var _loc3_: b2Vec2 = null;
        var _loc4_: Vert = null;
        this.destroyVertContainer();
        this._vertContainer = new Sprite();
        var _loc1_ = int(this._vertVector.length);
        var _loc2_: number = 0;
        while (_loc2_ < _loc1_) {
            _loc3_ = this._vertVector[_loc2_];
            _loc4_ = new Vert();
            _loc4_.edgeShape = this;
            _loc4_.vec = _loc3_;
            this._vertContainer.addChild(_loc4_);
            _loc2_++;
        }
    }

    protected destroyVertContainer() {
        if (this._vertContainer) {
            if (this._vertContainer.parent) {
                this._vertContainer.parent.removeChild(this._vertContainer);
            }
            this._vertContainer = null;
        }
    }

    public recenter() {
        var _loc9_: b2Vec2 = null;
        var _loc1_: number = this.numVerts;
        var _loc2_: number = 0;
        var _loc3_: number = 0;
        var _loc4_: number = 0;
        var _loc5_: number = 0;
        var _loc6_: number = 0;
        while (_loc6_ < _loc1_) {
            _loc9_ = this._vertVector[_loc6_];
            if (_loc9_.x < _loc2_) {
                _loc2_ = _loc9_.x;
            }
            if (_loc9_.x > _loc4_) {
                _loc4_ = _loc9_.x;
            }
            if (_loc9_.y < _loc3_) {
                _loc3_ = _loc9_.y;
            }
            if (_loc9_.y > _loc5_) {
                _loc5_ = _loc9_.y;
            }
            _loc6_++;
        }
        var _loc7_: number = (_loc2_ + _loc4_) * 0.5;
        var _loc8_: number = (_loc3_ + _loc5_) * 0.5;
        _loc6_ = 0;
        while (_loc6_ < _loc1_) {
            _loc9_ = this._vertVector[_loc6_];
            _loc9_.x -= _loc7_;
            _loc9_.y -= _loc8_;
            _loc6_++;
        }
        this.xUnbound = this.x + _loc7_;
        this.yUnbound = this.y + _loc8_;
    }

    protected setDefaultDimensions() {
        var _loc7_: b2Vec2 = null;
        var _loc1_: number = this.numVerts;
        var _loc2_: number = 0;
        var _loc3_: number = 0;
        var _loc4_: number = 0;
        var _loc5_: number = 0;
        var _loc6_: number = 0;
        while (_loc6_ < _loc1_) {
            _loc7_ = this._vertVector[_loc6_];
            if (_loc7_.x < _loc2_) {
                _loc2_ = _loc7_.x;
            }
            if (_loc7_.x > _loc4_) {
                _loc4_ = _loc7_.x;
            }
            if (_loc7_.y < _loc3_) {
                _loc3_ = _loc7_.y;
            }
            if (_loc7_.y > _loc5_) {
                _loc5_ = _loc7_.y;
            }
            _loc6_++;
        }
        this._defaultWidth = _loc4_ - _loc2_;
        this._defaultHeight = _loc5_ - _loc3_;
    }

    public reverse() {
        var _loc3_: b2Vec2 = null;
        var _loc1_: number = this.numVerts;
        this._vertVector.reverse();
        var _loc2_: number = 0;
        while (_loc2_ < _loc1_) {
            _loc3_ = this._vertVector[_loc2_];
            _loc3_.x = -_loc3_.x;
            _loc2_++;
        }
        this.drawShape();
        this.drawBoundingBox();
        this.x = this.x;
        this.y = this.y;
        this.vID = PolygonTool.getIDCounter();
    }
}