import b2Math from "@/Box2D/Common/Math/b2Math";
import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import Settings from "@/com/totaljerkface/game/Settings";
import ActionEvent from "@/com/totaljerkface/game/editor/ActionEvent";
import ArtShape from "@/com/totaljerkface/game/editor/ArtShape";
import ArtTool from "@/com/totaljerkface/game/editor/ArtTool";
import Canvas from "@/com/totaljerkface/game/editor/Canvas";
import EdgeShape from "@/com/totaljerkface/game/editor/EdgeShape";
import Editor from "@/com/totaljerkface/game/editor/Editor";
import PolygonShape from "@/com/totaljerkface/game/editor/PolygonShape";
import PolygonTool from "@/com/totaljerkface/game/editor/PolygonTool";
import Action from "@/com/totaljerkface/game/editor/actions/Action";
import ActionAddVert from "@/com/totaljerkface/game/editor/actions/ActionAddVert";
import ActionDeleteVert from "@/com/totaljerkface/game/editor/actions/ActionDeleteVert";
import ActionDeselectVert from "@/com/totaljerkface/game/editor/actions/ActionDeselectVert";
import ActionMoveHandle from "@/com/totaljerkface/game/editor/actions/ActionMoveHandle";
import ActionMoveVert from "@/com/totaljerkface/game/editor/actions/ActionMoveVert";
import ActionSelectVert from "@/com/totaljerkface/game/editor/actions/ActionSelectVert";
import BezierHandle from "@/com/totaljerkface/game/editor/vertedit/BezierHandle";
import BezierVert from "@/com/totaljerkface/game/editor/vertedit/BezierVert";
import Vert from "@/com/totaljerkface/game/editor/vertedit/Vert";
import { boundClass } from 'autobind-decorator';
import BlendMode from "flash/display/BlendMode";
import DisplayObject from "flash/display/DisplayObject";
import Sprite from "flash/display/Sprite";
import Event from "flash/events/Event";
import KeyboardEvent from "flash/events/KeyboardEvent";
import MouseEvent from "flash/events/MouseEvent";
import Point from "flash/geom/Point";
import Rectangle from "flash/geom/Rectangle";

@boundClass
export default class VertEdit extends Sprite {
    private static _selectedVerts: Vector<Vert>;
    public static EDIT_COMPLETE: string = "editcomplete";
    private static ADJUSTMENT_LENGTH: number = 0.25;
    public dragging: boolean;
    public translating: boolean;
    private _edgeShape: EdgeShape;
    private _selectedHandle: BezierHandle;
    private _mouseVert: Vert;
    private _canvasIndex: number;
    private _canvas: Canvas;
    private boundingBoxSprite: Sprite;
    private initialData: Vector<Vector<number>>;

    constructor(param1: EdgeShape, param2: Canvas) {
        super();
        this._edgeShape = param1;
        this._canvas = param2;
        this.doubleClickEnabled = true;
        this.addEventListener(Event.ADDED_TO_STAGE, this.init);
    }

    private init(param1: Event) {
        var _loc6_: ArtShape = null;
        var _loc8_: b2Vec2 = null;
        var _loc9_: b2Vec2 = null;
        var _loc10_: b2Vec2 = null;
        this.removeEventListener(Event.ADDED_TO_STAGE, this.init);
        var _loc2_: number = 20000;
        var _loc3_: number = 10000;
        this.graphics.beginFill(10066329, 0.35);
        this.graphics.drawRect(0, 0, _loc2_, _loc3_);
        this.graphics.endFill();
        this._canvasIndex = this._edgeShape.parent.getChildIndex(
            this._edgeShape,
        );
        this.addChild(this._edgeShape);
        this._edgeShape.editMode = true;
        this._edgeShape.mouseEnabled = false;
        this._edgeShape.mouseChildren = true;
        this._edgeShape.blendMode = BlendMode.NORMAL;
        var _loc4_: Vert = this._edgeShape.getVertAt(0);
        trace("COMPLETE FILL " + this._edgeShape.completeFill);
        this._edgeShape.drawEditMode(
            _loc4_.position,
            this._edgeShape.completeFill,
        );
        if (!VertEdit._selectedVerts) {
            VertEdit._selectedVerts = new Vector<Vert>();
        }
        this.initialData = new Vector<Vector<number>>();
        var _loc5_: number = this._edgeShape.numVerts;
        if (this._edgeShape instanceof ArtShape) {
            _loc6_ = this._edgeShape as ArtShape;
        }
        var _loc7_: number = 0;
        while (_loc7_ < _loc5_) {
            _loc8_ = this._edgeShape.vertVector[_loc7_];
            this.initialData[_loc7_] = new Vector<number>(6);
            this.initialData[_loc7_][0] = _loc8_.x;
            this.initialData[_loc7_][1] = _loc8_.y;
            if (_loc6_) {
                _loc9_ = _loc6_.handleVector[_loc7_ * 2];
                _loc10_ = _loc6_.handleVector[_loc7_ * 2 + 1];
                this.initialData[_loc7_][2] = _loc9_.x;
                this.initialData[_loc7_][3] = _loc9_.y;
                this.initialData[_loc7_][4] = _loc10_.x;
                this.initialData[_loc7_][5] = _loc10_.y;
            }
            _loc7_++;
        }
        this.stage.addEventListener(
            MouseEvent.MOUSE_DOWN,
            this.mouseDownHandler,
        );
        this.stage.addEventListener(
            MouseEvent.DOUBLE_CLICK,
            this.doubleClickHandler,
        );
        this.stage.addEventListener(
            KeyboardEvent.KEY_DOWN,
            this.keyDownHandler,
        );
    }

    private keyDownHandler(param1: KeyboardEvent) {
        switch (param1.keyCode) {
            case 8:
                this.deleteSelected();
                break;
            case 13:
                this.insertVertSelected();
                break;
            case 37:
                this.moveSelected(-1, 0, param1.shiftKey);
                break;
            case 38:
                this.moveSelected(0, -1, param1.shiftKey);
                break;
            case 39:
                this.moveSelected(1, 0, param1.shiftKey);
                break;
            case 40:
                this.moveSelected(0, 1, param1.shiftKey);
        }
    }

    private mouseDownHandler(param1: MouseEvent) {
        var _loc2_: Action = null;
        var _loc3_: Action = null;
        var _loc4_: Vert = null;
        var _loc5_: number = 0;
        if (param1.target instanceof Vert) {
            _loc4_ = param1.target as Vert;
            _loc5_ = int(VertEdit._selectedVerts.indexOf(_loc4_));
            if (param1.shiftKey) {
                if (_loc5_ < 0) {
                    _loc2_ = this.addToSelected(_loc4_);
                    this._mouseVert = _loc4_;
                } else {
                    _loc2_ = this.removeFromSelected(_loc4_);
                    this._mouseVert = null;
                }
                if (VertEdit._selectedVerts.length > 0) {
                    if (!this._mouseVert) {
                        this._mouseVert =
                            VertEdit._selectedVerts[
                            VertEdit._selectedVerts.length - 1
                            ];
                    }
                    this.stage.addEventListener(
                        MouseEvent.MOUSE_UP,
                        this.mouseUpHandler,
                    );
                    this.stage.addEventListener(
                        MouseEvent.MOUSE_MOVE,
                        this.mouseMoveVert,
                    );
                }
            } else {
                if (_loc5_ < 0) {
                    _loc3_ = this.deselectAll();
                    _loc2_ = this.addToSelected(_loc4_);
                    if (_loc3_) {
                        _loc3_.nextAction = _loc2_;
                    }
                }
                this._mouseVert = _loc4_;
                this.stage.addEventListener(
                    MouseEvent.MOUSE_UP,
                    this.mouseUpHandler,
                );
                this.stage.addEventListener(
                    MouseEvent.MOUSE_MOVE,
                    this.mouseMoveVert,
                );
            }
        } else if (param1.target instanceof BezierHandle) {
            this._selectedHandle = param1.target as BezierHandle;
            this.stage.addEventListener(
                MouseEvent.MOUSE_UP,
                this.mouseUpHandler,
            );
            this.stage.addEventListener(
                MouseEvent.MOUSE_MOVE,
                this.mouseMoveBezHandle,
            );
        } else {
            if (VertEdit._selectedVerts.length > 0 && !param1.shiftKey) {
                _loc2_ = this.deselectAll();
            }
            if (this.parent.contains(param1.target as DisplayObject)) {
                this.stage.addEventListener(
                    MouseEvent.MOUSE_MOVE,
                    this.mouseMoveBox,
                );
                this.stage.addEventListener(
                    MouseEvent.MOUSE_UP,
                    this.mouseUpHandler,
                );
                if (!this.boundingBoxSprite) {
                    this.boundingBoxSprite = new Sprite();
                    this.addChild(this.boundingBoxSprite);
                    this.boundingBoxSprite.x = this.mouseX;
                    this.boundingBoxSprite.y = this.mouseY;
                    this.boundingBoxSprite.blendMode = BlendMode.INVERT;
                }
            }
        }
        if (_loc2_) {
            this.dispatchEvent(new ActionEvent(ActionEvent.GENERIC, _loc2_));
        }
    }

    private addToSelected(param1: Vert): Action {
        param1.selected = true;
        VertEdit._selectedVerts.push(param1);
        return new ActionSelectVert(
            this._edgeShape.getVertIndex(param1),
            this._edgeShape,
            VertEdit._selectedVerts,
            VertEdit._selectedVerts.length - 1,
        );
    }

    private removeFromSelected(param1: Vert): Action {
        var _loc2_: Action = null;
        param1.selected = false;
        var _loc3_ = int(VertEdit._selectedVerts.indexOf(param1));
        if (_loc3_ > -1) {
            VertEdit._selectedVerts.splice(_loc3_, 1);
            _loc2_ = new ActionDeselectVert(
                this._edgeShape.getVertIndex(param1),
                this._edgeShape,
                VertEdit._selectedVerts,
                _loc3_,
            );
        }
        return _loc2_;
    }

    public deselectAll(): Action {
        var _loc1_: Action = null;
        var _loc2_: Action = null;
        var _loc5_: Vert = null;
        var _loc3_ = int(VertEdit._selectedVerts.length);
        var _loc4_: number = _loc3_ - 1;
        while (_loc4_ > -1) {
            _loc5_ = VertEdit._selectedVerts[_loc4_];
            _loc1_ = this.removeFromSelected(_loc5_);
            if (_loc2_) {
                _loc2_.nextAction = _loc1_.firstAction;
            }
            _loc2_ = _loc1_;
            _loc4_--;
        }
        return _loc1_;
    }

    private doubleClickHandler(param1: MouseEvent) {
        var _loc2_: BezierVert = null;
        if (param1.target instanceof BezierVert) {
            _loc2_ = param1.target as BezierVert;
            if (VertEdit._selectedVerts.indexOf(_loc2_) > -1) {
                this.enableVertHandles(_loc2_);
                this.redrawShape();
            }
        } else if (param1.target == this) {
            this.dispatchEvent(new Event(VertEdit.EDIT_COMPLETE));
        }
    }

    private enableVertHandles(param1: BezierVert) {
        var _loc4_: BezierVert = null;
        var _loc5_: BezierVert = null;
        var _loc8_: boolean = false;
        var _loc9_: Point = null;
        var _loc10_: Point = null;
        var _loc11_: Action = null;
        trace("ENABLE VERT HANDLES");
        var _loc2_: number = this._edgeShape.numVerts;
        var _loc3_: number = this._edgeShape.getVertIndex(param1);
        if (_loc3_ == 0) {
            _loc4_ = this._edgeShape.getVertAt(_loc2_ - 1) as BezierVert;
            _loc5_ = this._edgeShape.getVertAt(_loc3_ + 1) as BezierVert;
        } else if (_loc3_ == _loc2_ - 1) {
            _loc4_ = this._edgeShape.getVertAt(_loc3_ - 1) as BezierVert;
            _loc5_ = this._edgeShape.getVertAt(0) as BezierVert;
        } else {
            _loc4_ = this._edgeShape.getVertAt(_loc3_ - 1) as BezierVert;
            _loc5_ = this._edgeShape.getVertAt(_loc3_ + 1) as BezierVert;
        }
        var _loc6_: b2Vec2 =
            _loc4_.x == _loc5_.x && _loc4_.y == _loc5_.y
                ? new b2Vec2(_loc4_.x - param1.x, _loc4_.y - param1.y)
                : new b2Vec2(_loc4_.x - _loc5_.x, _loc4_.y - _loc5_.y);
        var _loc7_: number = _loc6_.Length();
        _loc6_.Normalize();
        _loc6_.Multiply(Math.max(5, _loc7_ * 0.25));
        _loc6_.x = Math.round(_loc6_.x);
        _loc6_.y = Math.round(_loc6_.y);
        if (param1.handle1.x == 0 && param1.handle1.y == 0) {
            _loc8_ = true;
            _loc9_ = new Point(param1.handle1.x, param1.handle1.y);
            if (!(param1.handle2.x == 0 && param1.handle2.y == 0)) {
                param1.handle1.Set(-param1.handle2.x, -param1.handle2.y);
            } else {
                param1.handle1.Set(_loc6_.x, _loc6_.y);
            }
        }
        if (param1.handle2.x == 0 && param1.handle2.y == 0) {
            _loc8_ = true;
            _loc10_ = new Point(param1.handle2.x, param1.handle2.y);
            if (!(param1.handle1.x == 0 && param1.handle1.y == 0)) {
                param1.handle2.Set(-param1.handle1.x, -param1.handle1.y);
            } else {
                param1.handle2.Set(_loc6_.x, _loc6_.y);
            }
        }
        if (_loc8_) {
            _loc11_ = new ActionMoveHandle(
                this._edgeShape.getVertIndex(param1),
                this._edgeShape,
                _loc9_,
                _loc10_,
            );
            this.dispatchEvent(new ActionEvent(ActionEvent.GENERIC, _loc11_));
        }
    }

    private mouseUpHandler(param1: MouseEvent) {
        var _loc2_: Action = null;
        var _loc3_: Action = null;
        var _loc4_: Rectangle = null;
        var _loc5_: number = 0;
        var _loc6_: number = 0;
        var _loc7_: Vert = null;
        var _loc8_: Rectangle = null;
        this.stage.removeEventListener(
            MouseEvent.MOUSE_UP,
            this.mouseUpHandler,
        );
        this.stage.removeEventListener(
            MouseEvent.MOUSE_MOVE,
            this.mouseMoveVert,
        );
        this.stage.removeEventListener(
            MouseEvent.MOUSE_MOVE,
            this.mouseMoveBezHandle,
        );
        this.stage.removeEventListener(
            MouseEvent.MOUSE_MOVE,
            this.mouseMoveBox,
        );
        this.dragging = false;
        this._mouseVert = null;
        if (this._selectedHandle) {
            this._selectedHandle = null;
        }
        if (this.boundingBoxSprite) {
            _loc4_ = this.boundingBoxSprite.getBounds(this._canvas);
            this.removeChild(this.boundingBoxSprite);
            this.boundingBoxSprite = null;
            _loc5_ = this._edgeShape.numVerts;
            if (!param1.shiftKey) {
                _loc2_ = this.deselectAll();
            }
            _loc6_ = 0;
            while (_loc6_ < _loc5_) {
                _loc7_ = this._edgeShape.getVertAt(_loc6_) as Vert;
                _loc8_ = _loc7_.getBounds(this._canvas);
                if (_loc8_.intersects(_loc4_)) {
                    _loc3_ = this.addToSelected(_loc7_);
                    if (_loc2_) {
                        _loc2_.nextAction = _loc3_;
                    }
                    _loc2_ = _loc3_;
                }
                _loc6_++;
            }
        }
        if (_loc3_) {
            this.dispatchEvent(new ActionEvent(ActionEvent.GENERIC, _loc3_));
        }
    }

    private storeCoords(): Vector<b2Vec2> {
        var _loc4_: Vert = null;
        var _loc1_: Vector<b2Vec2> = new Vector<b2Vec2>();
        var _loc2_: number = this._edgeShape.numVerts;
        var _loc3_: number = 0;
        while (_loc3_ < _loc2_) {
            _loc4_ = this._edgeShape.getVertAt(_loc3_);
            _loc1_.push(new b2Vec2(_loc4_.x, _loc4_.y));
            _loc3_++;
        }
        return _loc1_;
    }

    private mouseMoveVert(param1: MouseEvent) {
        var _loc2_: number = NaN;
        var _loc3_: number = NaN;
        var _loc4_: number = NaN;
        var _loc5_: number = NaN;
        var _loc6_: ActionMoveVert = null;
        var _loc7_: ActionMoveVert = null;
        var _loc8_: number = 0;
        var _loc9_: number = 0;
        var _loc10_: Vert = null;
        var _loc11_: number = NaN;
        var _loc12_: number = NaN;
        var _loc13_: Vector<b2Vec2> = null;
        var _loc14_: Vector<b2Vec2> = null;
        var _loc15_: Vector<number> = null;
        var _loc16_: number = 0;
        var _loc17_: b2Vec2 = null;
        if (VertEdit._selectedVerts.length > 0) {
            _loc2_ = this._mouseVert.x;
            _loc3_ = this._mouseVert.y;
            _loc4_ = Math.round(this._edgeShape.mouseX);
            _loc5_ = Math.round(this._edgeShape.mouseY);
            if (param1.shiftKey) {
                _loc4_ = Math.round(_loc4_ * 0.1) * 10;
                _loc5_ = Math.round(_loc5_ * 0.1) * 10;
            }
            _loc8_ = int(VertEdit._selectedVerts.length);
            if (this._edgeShape instanceof ArtShape) {
                _loc9_ = 0;
                while (_loc9_ < _loc8_) {
                    _loc10_ = VertEdit._selectedVerts[_loc9_];
                    if (!this.dragging) {
                        _loc6_ = new ActionMoveVert(
                            this._edgeShape.getVertIndex(_loc10_),
                            this._edgeShape,
                            new Point(_loc10_.x, _loc10_.y),
                        );
                        if (_loc7_) {
                            _loc6_.prevAction = _loc7_;
                        }
                        _loc7_ = _loc6_;
                    }
                    _loc11_ = _loc10_.x - _loc2_;
                    _loc12_ = _loc10_.y - _loc3_;
                    _loc10_.x = Math.round(_loc4_ + _loc11_);
                    _loc10_.y = Math.round(_loc5_ + _loc12_);
                    _loc9_++;
                }
                if (!this.dragging) {
                    this.dispatchEvent(
                        new ActionEvent(ActionEvent.GENERIC, _loc6_),
                    );
                    this.dragging = true;
                }
                this.redrawShape();
            } else {
                _loc13_ = this.storeCoords();
                _loc14_ = this.storeCoords();
                _loc15_ = new Vector<number>();
                _loc9_ = 0;
                while (_loc9_ < _loc8_) {
                    _loc10_ = VertEdit._selectedVerts[_loc9_];
                    _loc16_ = this._edgeShape.getVertIndex(_loc10_);
                    _loc15_.push(_loc16_);
                    _loc17_ = _loc14_[_loc16_];
                    _loc11_ = _loc10_.x - _loc2_;
                    _loc12_ = _loc10_.y - _loc3_;
                    _loc17_.x = Math.round(_loc4_ + _loc11_);
                    _loc17_.y = Math.round(_loc5_ + _loc12_);
                    _loc9_++;
                }
                if (this.isConvexB2Vec2(_loc14_)) {
                    _loc9_ = 0;
                    while (_loc9_ < _loc8_) {
                        _loc10_ = VertEdit._selectedVerts[_loc9_];
                        _loc17_ = _loc14_[_loc15_[_loc9_]];
                        if (!this.dragging) {
                            _loc6_ = new ActionMoveVert(
                                this._edgeShape.getVertIndex(_loc10_),
                                this._edgeShape,
                                new Point(_loc10_.x, _loc10_.y),
                            );
                            if (_loc7_) {
                                _loc6_.prevAction = _loc7_;
                            }
                            _loc7_ = _loc6_;
                        }
                        _loc10_.x = _loc17_.x;
                        _loc10_.y = _loc17_.y;
                        _loc9_++;
                    }
                    if (!this.dragging) {
                        this.dispatchEvent(
                            new ActionEvent(ActionEvent.GENERIC, _loc6_),
                        );
                        this.dragging = true;
                    }
                    this.redrawShape();
                }
            }
        }
    }

    private isConvexB2Vec2(param1: Vector<b2Vec2>): boolean {
        var _loc4_: b2Vec2 = null;
        var _loc5_: number = 0;
        var _loc6_: b2Vec2 = null;
        var _loc7_: b2Vec2 = null;
        var _loc8_: b2Vec2 = null;
        var _loc9_: b2Vec2 = null;
        var _loc10_: b2Vec2 = null;
        var _loc11_: number = NaN;
        var _loc2_ = int(param1.length);
        var _loc3_: number = 0;
        while (_loc3_ < _loc2_) {
            _loc3_++;
        }
        _loc3_ = 0;
        while (_loc3_ < _loc2_) {
            _loc4_ = param1[_loc3_];
            _loc5_ = _loc3_ + 1;
            if (_loc5_ > _loc2_ - 1) {
                _loc5_ -= _loc2_;
            }
            _loc6_ = param1[_loc5_];
            _loc5_ = _loc3_ + 2;
            if (_loc5_ > _loc2_ - 1) {
                _loc5_ -= _loc2_;
            }
            _loc7_ = param1[_loc5_];
            _loc8_ = new b2Vec2(_loc6_.x - _loc4_.x, _loc6_.y - _loc4_.y);
            _loc9_ = new b2Vec2(_loc7_.x - _loc6_.x, _loc7_.y - _loc6_.y);
            _loc8_.Normalize();
            _loc9_.Normalize();
            _loc10_ = new b2Vec2(_loc8_.y, -_loc8_.x);
            _loc11_ = b2Math.b2Dot(_loc9_, _loc10_);
            if (_loc11_ >= 0) {
                return false;
            }
            _loc3_++;
        }
        return true;
    }

    private fixConcaveViolations(): Action {
        var _loc1_: Action = null;
        var _loc2_: Action = null;
        var _loc3_: boolean = false;
        var _loc5_: number = 0;
        var _loc6_: Vert = null;
        var _loc7_: number = 0;
        var _loc8_: Vert = null;
        var _loc9_: Vert = null;
        var _loc10_: b2Vec2 = null;
        var _loc11_: b2Vec2 = null;
        var _loc12_: b2Vec2 = null;
        var _loc13_: number = NaN;
        var _loc14_: b2Vec2 = null;
        var _loc15_: b2Vec2 = null;
        var _loc4_: number = this._edgeShape.numVerts;
        do {
            _loc3_ = false;
            _loc5_ = 0;
            while (_loc5_ < _loc4_) {
                _loc6_ = this._edgeShape.getVertAt(_loc5_);
                _loc7_ = _loc5_ + 1;
                if (_loc7_ > _loc4_ - 1) {
                    _loc7_ -= _loc4_;
                }
                _loc8_ = this._edgeShape.getVertAt(_loc7_);
                _loc7_ = _loc5_ + 2;
                if (_loc7_ > _loc4_ - 1) {
                    _loc7_ -= _loc4_;
                }
                _loc9_ = this._edgeShape.getVertAt(_loc7_);
                _loc10_ = new b2Vec2(_loc8_.x - _loc6_.x, _loc8_.y - _loc6_.y);
                _loc11_ = new b2Vec2(_loc9_.x - _loc8_.x, _loc9_.y - _loc8_.y);
                _loc10_.Normalize();
                _loc11_.Normalize();
                _loc12_ = new b2Vec2(_loc10_.y, -_loc10_.x);
                _loc13_ = b2Math.b2Dot(_loc11_, _loc12_);
                if (_loc13_ >= 0) {
                    _loc3_ = true;
                    _loc14_ = new b2Vec2(
                        _loc9_.x - _loc6_.x,
                        _loc9_.y - _loc6_.y,
                    );
                    _loc14_.Normalize();
                    _loc15_ = new b2Vec2(_loc14_.y, -_loc14_.x);
                    _loc13_ = b2Math.b2Dot(
                        _loc14_,
                        new b2Vec2(_loc8_.x - _loc6_.x, _loc8_.y - _loc6_.y),
                    );
                    _loc2_ = new ActionMoveVert(
                        this._edgeShape.getVertIndex(_loc8_),
                        this._edgeShape,
                        new Point(_loc8_.x, _loc8_.y),
                    );
                    if (_loc1_) {
                        _loc1_.nextAction = _loc2_;
                    }
                    _loc1_ = _loc2_;
                    _loc8_.x =
                        _loc6_.x +
                        _loc14_.x * _loc13_ +
                        _loc15_.x * VertEdit.ADJUSTMENT_LENGTH;
                    _loc8_.y =
                        _loc6_.y +
                        _loc14_.y * _loc13_ +
                        _loc15_.y * VertEdit.ADJUSTMENT_LENGTH;
                }
                _loc5_++;
            }
        } while (_loc3_ == true);

        return _loc1_;
    }

    private mouseMoveBezHandle(param1: MouseEvent) {
        var _loc2_: number = NaN;
        var _loc3_: Action = null;
        var _loc4_: BezierHandle = null;
        if (this._selectedHandle) {
            if (!this.dragging) {
                _loc3_ = new ActionMoveHandle(
                    this._edgeShape.getVertIndex(this._selectedHandle.vert),
                    this._edgeShape,
                );
            }
            this._selectedHandle.Set(
                Math.round(this._selectedHandle.vert.mouseX),
                Math.round(this._selectedHandle.vert.mouseY),
            );
            if (param1.shiftKey) {
                this._selectedHandle.Set(
                    Math.round(this._selectedHandle.x * 0.1) * 10,
                    Math.round(this._selectedHandle.y * 0.1) * 10,
                );
            }
            _loc2_ = Math.sqrt(
                this._selectedHandle.x * this._selectedHandle.x +
                this._selectedHandle.y * this._selectedHandle.y,
            );
            if (_loc2_ < 5 * Math.pow(2, -Editor.currentZoom)) {
                this._selectedHandle.Set(0, 0);
            }
            if (!param1.altKey) {
                _loc4_ =
                    this._selectedHandle == this._selectedHandle.vert.handle1
                        ? this._selectedHandle.vert.handle2
                        : this._selectedHandle.vert.handle1;
                _loc4_.Set(-this._selectedHandle.x, -this._selectedHandle.y);
            }
            this.redrawShape();
            if (!this.dragging) {
                this.dispatchEvent(
                    new ActionEvent(ActionEvent.GENERIC, _loc3_),
                );
                this.dragging = true;
            }
        }
    }

    private mouseMoveBox(param1: MouseEvent) {
        if (this.boundingBoxSprite) {
            this.boundingBoxSprite.graphics.clear();
            this.boundingBoxSprite.graphics.lineStyle(1, 0, 1);
            this.boundingBoxSprite.graphics.drawRect(
                0,
                0,
                this.boundingBoxSprite.mouseX,
                this.boundingBoxSprite.mouseY,
            );
        }
    }

    private moveSelected(param1: number, param2: number, param3: boolean) {
        var _loc5_: Action = null;
        var _loc6_: Action = null;
        var _loc7_: number = 0;
        var _loc8_: Vert = null;
        var _loc9_: Vector<b2Vec2> = null;
        var _loc10_: Vector<b2Vec2> = null;
        var _loc11_: Vector<number> = null;
        var _loc12_: number = 0;
        var _loc13_: b2Vec2 = null;
        if (this.stage.hasEventListener(MouseEvent.MOUSE_UP)) {
            return;
        }
        var _loc4_ = int(VertEdit._selectedVerts.length);
        if (_loc4_ == 0) {
            return;
        }
        if (param3) {
            param1 *= 10;
            param2 *= 10;
        }
        param1 *= 1 / this._canvas.parent.scaleX;
        param2 *= 1 / this._canvas.parent.scaleY;
        if (this._edgeShape instanceof ArtShape) {
            _loc7_ = 0;
            while (_loc7_ < _loc4_) {
                _loc8_ = VertEdit._selectedVerts[_loc7_];
                if (!this.translating) {
                    _loc5_ = new ActionMoveVert(
                        this._edgeShape.getVertIndex(_loc8_),
                        this._edgeShape,
                        new Point(_loc8_.x, _loc8_.y),
                    );
                    if (_loc6_) {
                        _loc5_.prevAction = _loc6_;
                    }
                    _loc6_ = _loc5_;
                }
                _loc8_.x += param1;
                _loc8_.y += param2;
                _loc7_++;
            }
            if (!this.translating && Boolean(_loc5_)) {
                this.dispatchEvent(
                    new ActionEvent(ActionEvent.GENERIC, _loc5_),
                );
                this.translating = true;
            }
            this.redrawShape();
        } else {
            _loc9_ = this.storeCoords();
            _loc10_ = this.storeCoords();
            _loc11_ = new Vector<number>();
            _loc7_ = 0;
            while (_loc7_ < _loc4_) {
                _loc8_ = VertEdit._selectedVerts[_loc7_];
                _loc12_ = this._edgeShape.getVertIndex(_loc8_);
                _loc11_.push(_loc12_);
                _loc13_ = _loc10_[_loc12_];
                _loc13_.x += param1;
                _loc13_.y += param2;
                _loc7_++;
            }
            if (this.isConvexB2Vec2(_loc10_)) {
                _loc7_ = 0;
                while (_loc7_ < _loc4_) {
                    _loc8_ = VertEdit._selectedVerts[_loc7_];
                    _loc13_ = _loc10_[_loc11_[_loc7_]];
                    if (!this.translating) {
                        _loc5_ = new ActionMoveVert(
                            this._edgeShape.getVertIndex(_loc8_),
                            this._edgeShape,
                            new Point(_loc8_.x, _loc8_.y),
                        );
                        if (_loc6_) {
                            _loc5_.prevAction = _loc6_;
                        }
                        _loc6_ = _loc5_;
                    }
                    _loc8_.x = _loc13_.x;
                    _loc8_.y = _loc13_.y;
                    _loc7_++;
                }
                if (!this.translating) {
                    this.dispatchEvent(
                        new ActionEvent(ActionEvent.GENERIC, _loc5_),
                    );
                    this.translating = true;
                }
                this.redrawShape();
            }
        }
    }

    private deleteSelected() {
        var _loc1_: Action = null;
        var _loc2_: Action = null;
        var _loc3_: Action = null;
        var _loc8_: Vert = null;
        var _loc9_: number = 0;
        var _loc4_: number = this._edgeShape instanceof ArtShape ? 2 : 3;
        var _loc5_: string =
            this._edgeShape instanceof ArtShape
                ? "Art shapes must have at least 2 vertices"
                : "Polygon shapes must have at least 3 vertices";
        var _loc6_ = int(VertEdit._selectedVerts.length);
        var _loc7_: number = _loc6_ - 1;
        while (_loc7_ > -1) {
            if (this._edgeShape.numVerts <= _loc4_) {
                Settings.debugText.show(_loc5_);
                break;
            }
            _loc8_ = VertEdit._selectedVerts[_loc7_];
            _loc1_ = this.removeFromSelected(_loc8_);
            _loc9_ = this._edgeShape.getVertIndex(_loc8_);
            _loc2_ = new ActionDeleteVert(_loc9_, this._edgeShape, null);
            this._edgeShape.removeVert(_loc9_);
            _loc2_.prevAction = _loc1_;
            if (_loc3_) {
                _loc3_.nextAction = _loc1_;
            }
            _loc3_ = _loc2_;
            _loc7_--;
        }
        this.redrawShape();
        if (_loc2_) {
            this.dispatchEvent(new ActionEvent(ActionEvent.GENERIC, _loc2_));
        }
    }

    private insertVertSelected() {
        var _loc4_: Action = null;
        var _loc5_: Action = null;
        var _loc6_: Action = null;
        var _loc7_: Vert = null;
        var _loc8_: Vert = null;
        var _loc9_: BezierVert = null;
        var _loc10_: BezierVert = null;
        var _loc11_ = undefined;
        var _loc12_ = null;
        var _loc14_: number = NaN;
        var _loc15_: number = NaN;
        var _loc16_: Vert = null;
        var _loc17_: b2Vec2 = null;
        var _loc18_: b2Vec2 = null;
        var _loc19_: number = 0;
        var _loc1_ = int(VertEdit._selectedVerts.length);
        var _loc2_: number = this._edgeShape.numVerts;
        var _loc3_: Vert = this._edgeShape.getVertAt(_loc2_ - 1);
        if (this._edgeShape instanceof ArtShape) {
            _loc11_ = ArtTool.MAX_VERTS;
            _loc12_ = "Art shapes have a maximum of " + _loc11_ + " vertices";
        } else {
            _loc11_ = PolygonTool.MAX_VERTS;
            _loc12_ = "Polygon shapes have a maximum of " + _loc11_ + " vertices";
        }
        var _loc13_: number = 0;
        while (_loc13_ < _loc1_) {
            _loc7_ = VertEdit._selectedVerts[_loc13_];
            if (_loc2_ >= _loc11_) {
                Settings.debugText.show(_loc12_);
                break;
            }
            if (_loc7_ == _loc3_) {
                if (this._edgeShape.completeFill) {
                    _loc8_ = this._edgeShape.getVertAt(0);
                    if (
                        _loc7_ instanceof BezierVert &&
                        _loc8_ instanceof BezierVert
                    ) {
                        _loc9_ = _loc7_ as BezierVert;
                        _loc10_ = _loc8_ as BezierVert;
                        _loc14_ = ArtShape.bezierValue(
                            0.5,
                            _loc9_.x,
                            _loc9_.anchor2.x,
                            _loc10_.anchor1.x,
                            _loc10_.x,
                        );
                        _loc15_ = ArtShape.bezierValue(
                            0.5,
                            _loc9_.y,
                            _loc9_.anchor2.y,
                            _loc10_.anchor1.y,
                            _loc10_.y,
                        );
                        _loc16_ = new BezierVert(_loc14_, _loc15_);
                    } else {
                        _loc17_ = new b2Vec2(
                            _loc8_.x - _loc7_.x,
                            _loc8_.y - _loc7_.y,
                        );
                        _loc18_ = new b2Vec2(_loc17_.y, -_loc17_.x);
                        _loc18_.Normalize();
                        _loc14_ =
                            _loc7_.x +
                            _loc17_.x * 0.5 +
                            _loc18_.x * VertEdit.ADJUSTMENT_LENGTH;
                        _loc15_ =
                            _loc7_.y +
                            _loc17_.y * 0.5 +
                            _loc18_.y * VertEdit.ADJUSTMENT_LENGTH;
                        _loc16_ = new Vert(_loc14_, _loc15_);
                    }
                    _loc16_.edgeShape = this._edgeShape;
                    this._edgeShape.addVert(_loc16_);
                    _loc3_ = _loc16_;
                    _loc2_++;
                    _loc4_ = new ActionAddVert(_loc2_ - 1, this._edgeShape);
                    if (_loc5_) {
                        _loc5_.nextAction = _loc4_;
                    }
                    _loc5_ = _loc4_;
                }
            } else {
                _loc19_ = this._edgeShape.getVertIndex(_loc7_);
                _loc8_ = this._edgeShape.getVertAt(_loc19_ + 1);
                if (
                    _loc7_ instanceof BezierVert &&
                    _loc8_ instanceof BezierVert
                ) {
                    _loc9_ = _loc7_ as BezierVert;
                    _loc10_ = _loc8_ as BezierVert;
                    _loc14_ = ArtShape.bezierValue(
                        0.5,
                        _loc9_.x,
                        _loc9_.anchor2.x,
                        _loc10_.anchor1.x,
                        _loc10_.x,
                    );
                    _loc15_ = ArtShape.bezierValue(
                        0.5,
                        _loc9_.y,
                        _loc9_.anchor2.y,
                        _loc10_.anchor1.y,
                        _loc10_.y,
                    );
                    _loc16_ = new BezierVert(_loc14_, _loc15_);
                } else {
                    _loc17_ = new b2Vec2(
                        _loc8_.x - _loc7_.x,
                        _loc8_.y - _loc7_.y,
                    );
                    _loc18_ = new b2Vec2(_loc17_.y, -_loc17_.x);
                    _loc18_.Normalize();
                    _loc14_ =
                        _loc7_.x +
                        _loc17_.x * 0.5 +
                        _loc18_.x * VertEdit.ADJUSTMENT_LENGTH;
                    _loc15_ =
                        _loc7_.y +
                        _loc17_.y * 0.5 +
                        _loc18_.y * VertEdit.ADJUSTMENT_LENGTH;
                    _loc16_ = new Vert(_loc14_, _loc15_);
                }
                _loc16_.edgeShape = this._edgeShape;
                this._edgeShape.addVert(_loc16_, _loc19_ + 1);
                _loc2_++;
                _loc3_ = this._edgeShape.getVertAt(_loc2_ - 1);
                trace(_loc19_ + 1);
                _loc4_ = new ActionAddVert(_loc19_ + 1, this._edgeShape);
                if (_loc5_) {
                    _loc5_.nextAction = _loc4_;
                }
                _loc5_ = _loc4_;
            }
            _loc13_++;
        }
        if (this._edgeShape instanceof PolygonShape) {
            _loc6_ = this.fixConcaveViolations();
        }
        this.redrawShape();
        if (_loc6_) {
            _loc4_.nextAction = _loc6_.firstAction;
            _loc4_ = _loc6_;
        }
        if (_loc4_) {
            this.dispatchEvent(new ActionEvent(ActionEvent.GENERIC, _loc4_));
        }
    }

    private redrawShape() {
        var _loc1_: Vert = this._edgeShape.getVertAt(0);
        this._edgeShape.drawEditMode(
            _loc1_.position,
            this._edgeShape.completeFill,
        );
    }

    public resizeVerts() {
        this._edgeShape.resizeVerts();
    }

    private isDataAltered(): boolean {
        var _loc2_: ArtShape = null;
        var _loc4_: b2Vec2 = null;
        var _loc5_: b2Vec2 = null;
        var _loc6_: b2Vec2 = null;
        var _loc1_: number = this._edgeShape.numVerts;
        if (_loc1_ != this.initialData.length) {
            return true;
        }
        if (this._edgeShape instanceof ArtShape) {
            _loc2_ = this._edgeShape as ArtShape;
        }
        var _loc3_: number = 0;
        while (_loc3_ < _loc1_) {
            _loc4_ = this._edgeShape.vertVector[_loc3_];
            if (this.initialData[_loc3_][0] != _loc4_.x) {
                return true;
            }
            if (this.initialData[_loc3_][1] != _loc4_.y) {
                return true;
            }
            if (_loc2_) {
                _loc5_ = _loc2_.handleVector[_loc3_ * 2];
                _loc6_ = _loc2_.handleVector[_loc3_ * 2 + 1];
                if (this.initialData[_loc3_][2] != _loc5_.x) {
                    return true;
                }
                if (this.initialData[_loc3_][3] != _loc5_.y) {
                    return true;
                }
                if (this.initialData[_loc3_][4] != _loc6_.x) {
                    return true;
                }
                if (this.initialData[_loc3_][5] != _loc6_.y) {
                    return true;
                }
            }
            _loc3_++;
        }
        return false;
    }

    public get edgeShape(): EdgeShape {
        return this._edgeShape;
    }

    public die() {
        this.stage.removeEventListener(
            MouseEvent.MOUSE_DOWN,
            this.mouseDownHandler,
        );
        this.stage.removeEventListener(
            MouseEvent.DOUBLE_CLICK,
            this.doubleClickHandler,
        );
        this.stage.removeEventListener(
            KeyboardEvent.KEY_DOWN,
            this.keyDownHandler,
        );
        this.stage.removeEventListener(
            MouseEvent.MOUSE_UP,
            this.mouseUpHandler,
        );
        this.stage.removeEventListener(
            MouseEvent.MOUSE_MOVE,
            this.mouseMoveBezHandle,
        );
        this.stage.removeEventListener(
            MouseEvent.MOUSE_MOVE,
            this.mouseMoveVert,
        );
        this.stage.removeEventListener(
            MouseEvent.MOUSE_MOVE,
            this.mouseMoveBox,
        );
        this.removeEventListener(Event.ADDED_TO_STAGE, this.init);
        if (this.parent) {
            this.parent.removeChild(this);
        }
        this._edgeShape.editMode = false;
        this._edgeShape.mouseEnabled = true;
        this._edgeShape.mouseChildren = false;
        trace("ALTERED " + this.isDataAltered());
        if (this.isDataAltered()) {
            if (this._edgeShape instanceof ArtShape) {
                this._edgeShape.vID = ArtTool.getIDCounter();
            } else {
                this._edgeShape.vID = PolygonTool.getIDCounter();
            }
        }
        this._canvas.addRefSpriteAt(this._edgeShape, this._canvasIndex);
    }
}