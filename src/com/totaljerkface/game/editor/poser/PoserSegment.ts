import b2Mat22 from "@/Box2D/Common/Math/b2Mat22";
import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import { boundClass } from 'autobind-decorator';
import Sprite from "flash/display/Sprite";

@boundClass
export default class PoserSegment extends Sprite {
    private static PI_OVER_ONEEIGHTY: number;
    private static ONEEIGHTY_OVER_PI: number = 180 / Math.PI;
    private _parentSegment: PoserSegment;
    public _childSegments: any[];
    private _length: number;
    private _invLength: number;
    private _minAngle: number;
    private _maxAngle: number;
    private _angle: number;
    private _referenceAngle: number;
    private _vector: b2Vec2;
    private _normal: b2Vec2;
    private _modelOffsetAngle: number;
    private _modelDifference: number;
    private _sprite: Sprite;

    constructor(
        param1: Sprite,
        param2: b2Vec2,
        param3: number = 90,
        param4: number = -90,
        param5: number = 90,
        param6: PoserSegment = null,
    ) {
        super();
        var _loc7_: b2Vec2 = null;

        this._sprite = param1;
        _loc7_ = new b2Vec2(param1.x, param1.y);
        this.x = _loc7_.x;
        this.y = _loc7_.y;
        var _loc8_ = new b2Vec2(param2.x - _loc7_.x, param2.y - _loc7_.y);
        this._angle = this._referenceAngle = Math.atan2(_loc8_.y, _loc8_.x);
        this._length = _loc8_.Length();
        this._invLength = 1 / this._length;
        this._childSegments = new Array();
        this._modelOffsetAngle = param3 * PoserSegment.PI_OVER_ONEEIGHTY;
        this._modelDifference = this._modelOffsetAngle - this._referenceAngle;
        this._minAngle = param4 * PoserSegment.PI_OVER_ONEEIGHTY;
        this._maxAngle = param5 * PoserSegment.PI_OVER_ONEEIGHTY;
        this.parentSegment = param6;
        this.calculateVector();
        this.drawSegment();
    }

    public get parentSegment(): PoserSegment {
        return this._parentSegment;
    }

    public set parentSegment(param1: PoserSegment) {
        this._parentSegment = param1;
        if (this._parentSegment) {
            this._parentSegment.addChildSegment(this);
        }
    }

    public addChildSegment(param1: PoserSegment) {
        this._childSegments.push(param1);
    }

    public drawSegment() {
        var _loc2_: PoserSegment = null;
        this.graphics.clear();
        this.graphics.lineStyle(1, 0, 1, false);
        this.graphics.moveTo(0, 0);
        this.graphics.lineTo(this._vector.x, this._vector.y);
        this._sprite.x = this.x;
        this._sprite.y = this.y;
        this._sprite.rotation = Math.round(
            (this._angle + this._modelDifference - this._modelOffsetAngle) *
            PoserSegment.ONEEIGHTY_OVER_PI,
        );
        var _loc1_: number = 0;
        while (_loc1_ < this._childSegments.length) {
            _loc2_ = this._childSegments[_loc1_];
            _loc2_.drawSegment();
            _loc1_++;
        }
    }

    public calculateVector() {
        this._vector = new b2Vec2(this._length, 0);
        var _loc1_ = new b2Mat22(this.angle);
        this._vector.MulM(_loc1_);
        this._normal = new b2Vec2(
            this._vector.x * this._invLength,
            this._vector.y * this._invLength,
        );
    }

    public get endPoint(): b2Vec2 {
        return new b2Vec2(this._vector.x + this.x, this._vector.y + this.y);
    }

    public get length(): number {
        return this._length;
    }

    public get angle(): number {
        return this._angle;
    }

    public get angleDegrees(): number {
        return this._angle * PoserSegment.ONEEIGHTY_OVER_PI;
    }

    public set angle(param1: number) {
        var _loc2_: number = NaN;
        var _loc3_: b2Vec2 = null;
        var _loc5_: number = NaN;
        var _loc6_: number = NaN;
        var _loc7_: number = NaN;
        var _loc8_: PoserSegment = null;
        if (this._parentSegment) {
            _loc5_ =
                this._parentSegment.angle + this._parentSegment.modelDifference;
            _loc6_ = param1 - _loc5_;
            if (_loc6_ < this._minAngle) {
                param1 = _loc5_ + this._minAngle;
            }
            if (_loc6_ > this._maxAngle) {
                param1 = _loc5_ + this._maxAngle;
            }
        } else {
            _loc7_ = param1 - this._referenceAngle;
            if (_loc7_ < this._minAngle) {
                param1 = this._referenceAngle + this._minAngle;
            }
            if (_loc7_ > this._maxAngle) {
                param1 = this._referenceAngle + this._maxAngle;
            }
        }
        _loc2_ = this._angle - param1;
        this._angle = param1;
        this.calculateVector();
        _loc3_ = this.endPoint;
        var _loc4_: number = 0;
        while (_loc4_ < this._childSegments.length) {
            _loc8_ = this._childSegments[_loc4_];
            _loc8_.x = _loc3_.x;
            _loc8_.y = _loc3_.y;
            _loc8_.angle -= _loc2_;
            _loc4_++;
        }
    }

    public get modelAngle(): number {
        if (this._parentSegment) {
            return (
                this._angle -
                this._parentSegment.angle -
                this._parentSegment.modelDifference
            );
        }
        return this._angle + this._modelDifference - this._modelOffsetAngle;
    }

    public set modelAngle(param1: number) {
        if (this._parentSegment) {
            param1 =
                param1 +
                this._parentSegment.angle +
                this._parentSegment.modelDifference;
        } else {
            param1 += this._referenceAngle;
        }
        this.angle = param1;
        this.drawSegment();
    }

    public get modelAngleDegrees(): number {
        return this.modelAngle * PoserSegment.ONEEIGHTY_OVER_PI;
    }

    public set modelAngleDegrees(param1: number) {
        param1 *= PoserSegment.PI_OVER_ONEEIGHTY;
        this.modelAngle = param1;
    }

    public get relativeAngle(): number {
        if (this._parentSegment) {
            return this._angle - this._parentSegment.angle;
        }
        return this.angle;
    }

    public get relativeAngleDegrees(): number {
        return this.relativeAngle * PoserSegment.ONEEIGHTY_OVER_PI;
    }

    public get modelDifference(): number {
        return this._modelDifference;
    }

    public get sprite(): Sprite {
        return this._sprite;
    }
}