import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import b2Body from "@/Box2D/Dynamics/b2Body";
import BackDrop from "@/com/totaljerkface/game/level/visuals/BackDrop";
import Session from "@/com/totaljerkface/game/Session";
import Settings from "@/com/totaljerkface/game/Settings";
import { boundClass } from 'autobind-decorator';
import DisplayObject from "flash/display/DisplayObject";
import Point from "flash/geom/Point";
import Rectangle from "flash/geom/Rectangle";

@boundClass
export default class StageCamera {
    private _containerObj: DisplayObject;
    private _focus: b2Body;
    private _secondFocus: b2Body;
    private _midScreen: Point;
    private _screenBounds: Rectangle;
    private _displacement: Point;
    private _buttonContainer: DisplayObject;
    private _tempFocus: b2Body;
    private _tempCount: number = 0;
    private _tempMax: number = 20;
    private midX: number = 7.2;
    private midY: number = 4;
    private leftLimit: number;
    private rightLimit: number;
    private topLimit: number;
    private bottomLimit: number;
    private leftBorder: number = 100;
    private rightBorder: number = 200;
    private topBorder: number = 100;
    private bottomBorder: number = 150;
    private minSpeed: number = 3;
    private moveIncrement: number = 5;
    private upInc: number = 1;
    private downInc: number = 5;
    private m_physScale: number;
    private backDrops: Vector<BackDrop>;

    constructor(param1: DisplayObject, param2: b2Body, param3: Session) {
        this._containerObj = param1;
        this._focus = param2;
        this._midScreen = new Point();
        this._displacement = new Point();
        this.m_physScale = param3.m_physScale;
        this._buttonContainer = param3.buttonContainer;
        if (param3.level) {
            this.backDrops = param3.level.backDrops;
        }
    }

    public setLimits(
        param1: number,
        param2: number,
        param3: number,
        param4: number,
    ) {
        this.leftLimit = -param1;
        this.rightLimit = -(param2 - 900);
        this.topLimit = -param3;
        this.bottomLimit = -(param4 - 500);
        trace(param1);
        trace(param2);
        trace(param3);
        trace(param4);
    }

    private setBorders() {
        var _loc1_: b2Vec2 = this._focus.GetLinearVelocity();
        var _loc2_: number = _loc1_.x;
        var _loc3_: number = _loc1_.y;
        if (_loc2_ > this.minSpeed) {
            if (this.leftBorder < 100) {
                this.leftBorder += this.moveIncrement;
            } else if (this.leftBorder > 100) {
                this.leftBorder -= this.moveIncrement;
            }
            if (this.rightBorder < 200) {
                this.rightBorder += this.moveIncrement;
            } else if (this.rightBorder > 200) {
                this.rightBorder -= this.moveIncrement;
            }
        } else if (_loc2_ < -this.minSpeed) {
            if (this.leftBorder < 600) {
                this.leftBorder += this.moveIncrement;
            } else if (this.leftBorder > 600) {
                this.leftBorder -= this.moveIncrement;
            }
            if (this.rightBorder < 700) {
                this.rightBorder += this.moveIncrement;
            } else if (this.rightBorder > 700) {
                this.rightBorder -= this.moveIncrement;
            }
        } else {
            if (this.leftBorder < 350) {
                this.leftBorder += this.moveIncrement;
            } else if (this.leftBorder > 350) {
                this.leftBorder -= this.moveIncrement;
            }
            if (this.rightBorder < 450) {
                this.rightBorder += this.moveIncrement;
            } else if (this.rightBorder > 450) {
                this.rightBorder -= this.moveIncrement;
            }
        }
        if (_loc3_ > this.minSpeed) {
            if (this.topBorder < 100) {
                this.topBorder += this.upInc;
            } else if (this.topBorder > 100) {
                this.topBorder -= this.moveIncrement;
            }
            if (this.bottomBorder < 150) {
                this.bottomBorder += this.upInc;
            } else if (this.bottomBorder > 150) {
                this.bottomBorder -= this.moveIncrement;
            }
        } else if (_loc3_ < -this.minSpeed) {
            if (this.topBorder < 350) {
                this.topBorder += this.upInc;
            } else if (this.topBorder > 350) {
                this.topBorder -= this.moveIncrement;
            }
            if (this.bottomBorder < 400) {
                this.bottomBorder += this.upInc;
            } else if (this.bottomBorder > 400) {
                this.bottomBorder -= this.moveIncrement;
            }
        } else {
            if (this.topBorder < 300) {
                this.topBorder += this.upInc;
            } else if (this.topBorder > 300) {
                this.topBorder -= this.moveIncrement;
            }
            if (this.bottomBorder < 350) {
                this.bottomBorder += this.upInc;
            } else if (this.bottomBorder > 350) {
                this.bottomBorder -= this.moveIncrement;
            }
        }
    }

    public step() {
        var _loc1_: b2Vec2 = null;
        var _loc2_: number = NaN;
        this.setBorders();
        if (this._secondFocus) {
            _loc1_ = this._focus.GetPosition().Copy();
            _loc1_.y += this._secondFocus.GetPosition().y;
            _loc1_.y *= 0.5;
            this.center(_loc1_);
        } else if (this._tempFocus) {
            _loc1_ = this._focus.GetPosition().Copy();
            _loc2_ = 0.5 - (0.5 * this._tempCount) / this._tempMax;
            _loc1_.y =
                _loc1_.y * (1 - _loc2_) +
                this._tempFocus.GetPosition().y * _loc2_;
            this.center(_loc1_);
            if (this._tempCount >= this._tempMax) {
                this._tempFocus = null;
            }
            ++this._tempCount;
        } else {
            this.center(this._focus.GetPosition());
        }
        if (this._buttonContainer) {
            this._buttonContainer.x = this.containerObj.x;
            this._buttonContainer.y = this.containerObj.y;
        }
        this.adjustBackDrops();
        Settings.YParticleLimit =
            this._focus.GetPosition().y * this.m_physScale + 1000;
    }

    public center(param1: b2Vec2) {
        var _loc5_: number = NaN;
        var _loc6_: number = NaN;
        var _loc7_: number = NaN;
        var _loc8_: number = NaN;
        var _loc2_ = new Point(
            param1.x * this.m_physScale,
            param1.y * this.m_physScale,
        );
        var _loc3_: number =
            this._containerObj.localToGlobal(_loc2_).x + this._displacement.x;
        var _loc4_: number =
            this._containerObj.localToGlobal(_loc2_).y + this._displacement.y;
        if (_loc3_ > this.rightBorder) {
            _loc5_ = _loc3_ - this.rightBorder;
            this._containerObj.x -= _loc5_;
            if (this._containerObj.x < this.rightLimit) {
                this._containerObj.x = this.rightLimit;
            }
        }
        if (_loc3_ < this.leftBorder) {
            _loc6_ = this.leftBorder - _loc3_;
            this._containerObj.x += _loc6_;
            if (this._containerObj.x > this.leftLimit) {
                this._containerObj.x = this.leftLimit;
            }
        }
        if (_loc4_ > this.bottomBorder) {
            _loc7_ = _loc4_ - this.bottomBorder;
            this._containerObj.y -= _loc7_;
            if (this._containerObj.y < this.bottomLimit) {
                this._containerObj.y = this.bottomLimit;
            }
        }
        if (_loc4_ < this.topBorder) {
            _loc8_ = this.topBorder - _loc4_;
            this._containerObj.y += _loc8_;
            if (this._containerObj.y > this.topLimit) {
                this._containerObj.y = this.topLimit;
            }
        }
        this._screenBounds = new Rectangle(
            -this._containerObj.x,
            -this._containerObj.y,
            900,
            500,
        );
        this._midScreen = new Point(
            this.midX - this._containerObj.x / this.m_physScale,
            this.midY - this._containerObj.y / this.m_physScale,
        );
    }

    public removeSecondFocus() {
        if (!this._secondFocus) {
            return;
        }
        this._tempFocus = this._secondFocus;
        this._secondFocus = null;
        this._tempCount = 0;
    }

    private adjustBackDrops() {
        var _loc2_: BackDrop = null;
        var _loc1_: number = 0;
        while (_loc1_ < this.backDrops.length) {
            _loc2_ = this.backDrops[_loc1_];
            if (_loc2_.multiplier > 0) {
                _loc2_.x = Math.round(this._containerObj.x * _loc2_.multiplier);
                _loc2_.y = Math.round(this._containerObj.y * _loc2_.multiplier);
            }
            _loc1_++;
        }
    }

    public get midScreenPoint(): Point {
        return this._midScreen;
    }

    public get screenBounds(): Rectangle {
        return this._screenBounds;
    }

    public get focus(): b2Body {
        return this._focus;
    }

    public set focus(param1: b2Body) {
        this._focus = param1;
    }

    public get secondFocus(): b2Body {
        return this._secondFocus;
    }

    public set secondFocus(param1: b2Body) {
        this._secondFocus = param1;
    }

    public get containerObj(): DisplayObject {
        return this._containerObj;
    }

    public set containerObj(param1: DisplayObject) {
        this._containerObj = param1;
    }

    public get displacement(): Point {
        return this._displacement;
    }

    public set displacement(param1: Point) {
        this._displacement = param1.clone();
    }

    public get buttonContainer(): DisplayObject {
        return this._buttonContainer;
    }

    public set buttonContainer(param1: DisplayObject) {
        this._buttonContainer = param1;
    }
}