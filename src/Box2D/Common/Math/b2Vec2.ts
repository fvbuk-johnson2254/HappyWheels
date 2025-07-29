import b2Mat22 from "@/Box2D/Common/Math/b2Mat22";
import b2Math from "@/Box2D/Common/Math/b2Math";

export default class b2Vec2 {
    public x: number;
    public y: number;

    constructor(param1: number = 0, param2: number = 0) {
        this.x = param1;
        this.y = param2;
    }

    public static Make(param1: number, param2: number): b2Vec2 {
        return new b2Vec2(param1, param2);
    }

    public SetZero() {
        this.x = 0;
        this.y = 0;
    }

    public Set(param1: number = 0, param2: number = 0) {
        this.x = param1;
        this.y = param2;
    }

    public SetV(param1: b2Vec2) {
        this.x = param1.x;
        this.y = param1.y;
    }

    public Negative(): b2Vec2 {
        return new b2Vec2(-this.x, -this.y);
    }

    public Copy(): b2Vec2 {
        return new b2Vec2(this.x, this.y);
    }

    public Add(param1: b2Vec2) {
        this.x += param1.x;
        this.y += param1.y;
    }

    public Subtract(param1: b2Vec2) {
        this.x -= param1.x;
        this.y -= param1.y;
    }

    public Multiply(param1: number) {
        this.x *= param1;
        this.y *= param1;
    }

    public MulM(param1: b2Mat22) {
        var _loc2_: number = this.x;
        this.x = param1.col1.x * _loc2_ + param1.col2.x * this.y;
        this.y = param1.col1.y * _loc2_ + param1.col2.y * this.y;
    }

    public MulTM(param1: b2Mat22) {
        var _loc2_: number = b2Math.b2Dot(this, param1.col1);
        this.y = b2Math.b2Dot(this, param1.col2);
        this.x = _loc2_;
    }

    public CrossVF(param1: number) {
        var _loc2_: number = this.x;
        this.x = param1 * this.y;
        this.y = -param1 * _loc2_;
    }

    public CrossFV(param1: number) {
        var _loc2_: number = this.x;
        this.x = -param1 * this.y;
        this.y = param1 * _loc2_;
    }

    public MinV(param1: b2Vec2) {
        this.x = this.x < param1.x ? this.x : param1.x;
        this.y = this.y < param1.y ? this.y : param1.y;
    }

    public MaxV(param1: b2Vec2) {
        this.x = this.x > param1.x ? this.x : param1.x;
        this.y = this.y > param1.y ? this.y : param1.y;
    }

    public Abs() {
        if (this.x < 0) {
            this.x = -this.x;
        }
        if (this.y < 0) {
            this.y = -this.y;
        }
    }

    public Length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    public LengthSquared(): number {
        return this.x * this.x + this.y * this.y;
    }

    public Normalize(): number {
        var _loc1_: number = Math.sqrt(this.x * this.x + this.y * this.y);
        if (_loc1_ < Number.MIN_VALUE) {
            return 0;
        }
        var _loc2_: number = 1 / _loc1_;
        this.x *= _loc2_;
        this.y *= _loc2_;
        return _loc1_;
    }

    public IsValid(): boolean {
        return b2Math.b2IsValid(this.x) && b2Math.b2IsValid(this.y);
    }
}