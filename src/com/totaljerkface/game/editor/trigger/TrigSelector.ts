import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import ActionEvent from "@/com/totaljerkface/game/editor/ActionEvent";
import Canvas from "@/com/totaljerkface/game/editor/Canvas";
import RefSprite from "@/com/totaljerkface/game/editor/RefSprite";
import Action from "@/com/totaljerkface/game/editor/actions/Action";
import RefTrigger from "@/com/totaljerkface/game/editor/trigger/RefTrigger";
import { boundClass } from 'autobind-decorator';
import Sprite from "flash/display/Sprite";
import Event from "flash/events/Event";
import MouseEvent from "flash/events/MouseEvent";

@boundClass
export default class TrigSelector extends Sprite {
    public static SELECT_COMPLETE: string;
    private _trigger: RefTrigger;
    private _triggers: any[];
    private indexArray: any[];
    private _canvas: Canvas;
    private _targetRef: RefSprite;
    private increment: number = 0;

    constructor(param1: any[], param2: Canvas) {
        super();
        trace("OK");
        this._triggers = param1;
        this._canvas = param2;
        param2.addChild(this);
        this.indexArray = new Array();
        this.addEventListener(Event.ENTER_FRAME, this.detectBodies);
        this.stage.addEventListener(
            MouseEvent.MOUSE_DOWN,
            this.mouseDownHandler,
        );
    }

    private detectBodies(param1: Event) {
        var _loc4_: b2Vec2 = null;
        var _loc7_: boolean = false;
        var _loc10_: RefSprite = null;
        var _loc11_: any[] = null;
        var _loc12_: number = 0;
        var _loc13_: RefTrigger = null;
        var _loc14_: number = 0;
        if (this._targetRef) {
            this._targetRef.alpha = 1;
        }
        this._targetRef = null;
        var _loc2_: number = Infinity;
        var _loc3_ = new b2Vec2(this.mouseX, this.mouseY);
        var _loc5_: number = 0;
        var _loc6_ = int(this._triggers.length);
        var _loc8_: number = this._canvas.shapes.numChildren;
        var _loc9_: number = 0;
        while (_loc9_ < _loc8_) {
            _loc10_ = this._canvas.shapes.getChildAt(_loc9_) as RefSprite;
            if (
                _loc10_.triggerable &&
                _loc10_.hitTestPoint(this.stage.mouseX, this.stage.mouseY, true)
            ) {
                _loc7_ = false;
                _loc11_ = new Array();
                _loc12_ = 0;
                while (_loc12_ < _loc6_) {
                    _loc13_ = this._triggers[_loc12_] as RefTrigger;
                    _loc14_ = int(_loc13_.targets.indexOf(_loc10_));
                    _loc11_[_loc12_] = _loc14_;
                    if (_loc14_ < 0) {
                        _loc7_ = true;
                    }
                    _loc12_++;
                }
                if (_loc7_) {
                    _loc4_ = new b2Vec2(
                        _loc10_.x - _loc3_.x,
                        _loc10_.y - _loc3_.y,
                    );
                    _loc5_ = _loc4_.LengthSquared();
                    if (_loc5_ < _loc2_) {
                        this._targetRef = _loc10_;
                        _loc2_ = _loc5_;
                        this.indexArray = _loc11_;
                    }
                }
            }
            _loc9_++;
        }
        _loc8_ = this._canvas.special.numChildren;
        _loc9_ = 0;
        while (_loc9_ < _loc8_) {
            _loc10_ = this._canvas.special.getChildAt(_loc9_) as RefSprite;
            if (
                _loc10_.triggerable &&
                _loc10_.hitTestPoint(this.stage.mouseX, this.stage.mouseY, true)
            ) {
                _loc7_ = false;
                _loc11_ = new Array();
                _loc12_ = 0;
                while (_loc12_ < _loc6_) {
                    _loc13_ = this._triggers[_loc12_] as RefTrigger;
                    _loc14_ = int(_loc13_.targets.indexOf(_loc10_));
                    _loc11_[_loc12_] = _loc14_;
                    if (_loc14_ < 0) {
                        _loc7_ = true;
                    }
                    _loc12_++;
                }
                if (_loc7_) {
                    _loc4_ = new b2Vec2(
                        _loc10_.x - _loc3_.x,
                        _loc10_.y - _loc3_.y,
                    );
                    _loc5_ = _loc4_.LengthSquared();
                    if (_loc5_ < _loc2_) {
                        this._targetRef = _loc10_;
                        _loc2_ = _loc5_;
                        this.indexArray = _loc11_;
                    }
                }
            }
            _loc9_++;
        }
        _loc8_ = this._canvas.groups.numChildren;
        _loc9_ = 0;
        while (_loc9_ < _loc8_) {
            _loc10_ = this._canvas.groups.getChildAt(_loc9_) as RefSprite;
            if (
                _loc10_.triggerable &&
                _loc10_.hitTestPoint(this.stage.mouseX, this.stage.mouseY, true)
            ) {
                _loc7_ = false;
                _loc11_ = new Array();
                _loc12_ = 0;
                while (_loc12_ < _loc6_) {
                    _loc13_ = this._triggers[_loc12_] as RefTrigger;
                    _loc14_ = int(_loc13_.targets.indexOf(_loc10_));
                    _loc11_[_loc12_] = _loc14_;
                    if (_loc14_ < 0) {
                        _loc7_ = true;
                    }
                    _loc12_++;
                }
                if (_loc7_) {
                    _loc4_ = new b2Vec2(
                        _loc10_.x - _loc3_.x,
                        _loc10_.y - _loc3_.y,
                    );
                    _loc5_ = _loc4_.LengthSquared();
                    if (_loc5_ < _loc2_) {
                        this._targetRef = _loc10_;
                        _loc2_ = _loc5_;
                        this.indexArray = _loc11_;
                    }
                }
            }
            _loc9_++;
        }
        _loc8_ = this._canvas.joints.numChildren;
        _loc9_ = 0;
        while (_loc9_ < _loc8_) {
            _loc10_ = this._canvas.joints.getChildAt(_loc9_) as RefSprite;
            if (
                _loc10_.triggerable &&
                _loc10_.hitTestPoint(this.stage.mouseX, this.stage.mouseY, true)
            ) {
                _loc7_ = false;
                _loc11_ = new Array();
                _loc12_ = 0;
                while (_loc12_ < _loc6_) {
                    _loc13_ = this._triggers[_loc12_] as RefTrigger;
                    _loc14_ = int(_loc13_.targets.indexOf(_loc10_));
                    _loc11_[_loc12_] = _loc14_;
                    if (_loc14_ < 0) {
                        _loc7_ = true;
                    }
                    _loc12_++;
                }
                if (_loc7_) {
                    _loc4_ = new b2Vec2(
                        _loc10_.x - _loc3_.x,
                        _loc10_.y - _loc3_.y,
                    );
                    _loc5_ = _loc4_.LengthSquared();
                    if (_loc5_ < _loc2_) {
                        this._targetRef = _loc10_;
                        _loc2_ = _loc5_;
                        this.indexArray = _loc11_;
                    }
                }
            }
            _loc9_++;
        }
        _loc8_ = this._canvas.triggers.numChildren;
        _loc9_ = 0;
        while (_loc9_ < _loc8_) {
            _loc10_ = this._canvas.triggers.getChildAt(_loc9_) as RefSprite;
            if (
                _loc10_.triggerable &&
                _loc10_.hitTestPoint(this.stage.mouseX, this.stage.mouseY, true)
            ) {
                _loc7_ = false;
                _loc11_ = new Array();
                _loc12_ = 0;
                while (_loc12_ < _loc6_) {
                    _loc13_ = this._triggers[_loc12_] as RefTrigger;
                    if (
                        !(
                            _loc10_ == _loc13_ ||
                            this.checkCircularLink(
                                _loc13_,
                                _loc10_ as RefTrigger,
                            )
                        )
                    ) {
                        _loc14_ = int(_loc13_.targets.indexOf(_loc10_));
                        _loc11_[_loc12_] = _loc14_;
                        if (_loc14_ < 0) {
                            _loc7_ = true;
                        }
                    }
                    _loc12_++;
                }
                if (_loc7_) {
                    _loc4_ = new b2Vec2(
                        _loc10_.x - _loc3_.x,
                        _loc10_.y - _loc3_.y,
                    );
                    _loc5_ = _loc4_.LengthSquared();
                    if (_loc5_ < _loc2_) {
                        this._targetRef = _loc10_;
                        _loc2_ = _loc5_;
                        this.indexArray = _loc11_;
                    }
                }
            }
            _loc9_++;
        }
        this.drawArms();
    }

    private checkCircularLink(param1: RefTrigger, param2: RefTrigger): boolean {
        var _loc5_: RefTrigger = null;
        var _loc3_ = int(param1.triggers.length);
        var _loc4_: number = 0;
        if (_loc4_ >= _loc3_) {
            return false;
        }
        _loc5_ = param1.triggers[_loc4_];
        if (_loc5_ == param2) {
            return true;
        }
        return this.checkCircularLink(_loc5_, param2);
    }

    private drawArms() {
        var _loc4_: number = 0;
        var _loc5_: RefTrigger = null;
        var _loc6_: number = 0;
        this.increment += 0.15;
        var _loc1_: number = Math.sin(this.increment) * 0.4;
        var _loc2_: number = 0.6 - _loc1_;
        var _loc3_: number = 0.6 + _loc1_;
        this.graphics.clear();
        if (this._targetRef) {
            this._targetRef.alpha = _loc2_;
            this.graphics.lineStyle(3, 16613761, _loc3_);
            _loc4_ = 0;
            while (_loc4_ < this._triggers.length) {
                _loc5_ = this._triggers[_loc4_];
                _loc6_ = int(this.indexArray[_loc4_]);
                if (_loc6_ < 0) {
                    this.graphics.moveTo(_loc5_.x, _loc5_.y);
                    this.graphics.lineTo(this._targetRef.x, this._targetRef.y);
                }
                _loc4_++;
            }
            this.graphics.beginFill(16613761, _loc3_);
            this.graphics.drawCircle(this._targetRef.x, this._targetRef.y, 3);
            this.graphics.endFill();
        } else {
            this.graphics.lineStyle(1, 16613761, _loc3_);
            _loc4_ = 0;
            while (_loc4_ < this._triggers.length) {
                _loc5_ = this._triggers[_loc4_];
                this.graphics.moveTo(_loc5_.x, _loc5_.y);
                this.graphics.lineTo(this.mouseX, this.mouseY);
                _loc4_++;
            }
            this.graphics.beginFill(16613761, _loc3_);
            this.graphics.drawCircle(this.mouseX, this.mouseY, 1.5);
            this.graphics.endFill();
        }
    }

    private mouseDownHandler(param1: MouseEvent) {
        this.removeEventListener(MouseEvent.MOUSE_DOWN, this.mouseDownHandler);
        this.stage.addEventListener(MouseEvent.MOUSE_UP, this.mouseUpHandler);
    }

    private mouseUpHandler(param1: MouseEvent) {
        var _loc2_: Action = null;
        var _loc3_: Action = null;
        var _loc4_: number = 0;
        var _loc5_: RefTrigger = null;
        var _loc6_: number = 0;
        if (this._targetRef) {
            _loc4_ = 0;
            while (_loc4_ < this._triggers.length) {
                _loc5_ = this._triggers[_loc4_];
                _loc6_ = int(this.indexArray[_loc4_]);
                if (_loc6_ < 0) {
                    _loc2_ = _loc5_.addTarget(this._targetRef);
                    if (_loc3_) {
                        _loc3_.nextAction = _loc2_;
                    }
                    _loc3_ = _loc2_;
                }
                _loc4_++;
            }
            this.dispatchEvent(new ActionEvent(ActionEvent.GENERIC, _loc2_));
        } else {
            this.dispatchEvent(new Event(TrigSelector.SELECT_COMPLETE));
        }
    }

    public die() {
        if (this._targetRef) {
            this._targetRef.alpha = 1;
        }
        this.graphics.clear();
        this.removeEventListener(Event.ENTER_FRAME, this.detectBodies);
        this.stage.removeEventListener(
            MouseEvent.MOUSE_UP,
            this.mouseUpHandler,
        );
        this.stage.removeEventListener(
            MouseEvent.MOUSE_DOWN,
            this.mouseDownHandler,
        );
        this._canvas.removeChild(this);
    }
}