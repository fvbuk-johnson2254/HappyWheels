import b2Mat22 from "@/Box2D/Common/Math/b2Mat22";
import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import b2XForm from "@/Box2D/Common/Math/b2XForm";

export default class b2Math {
	public static get b2Vec2_zero() {
        return new b2Vec2(0.0, 0.0);
    }

    public static get b2Mat22_identity() {
        return new b2Mat22(
            0,
            new b2Vec2(1, 0),
            new b2Vec2(0, 1),
        );
    }

    public static get b2XForm_identity() {
        return new b2XForm(b2Math.b2Vec2_zero, b2Math.b2Mat22_identity);
    }

    public static b2IsValid(param1: number): boolean {
        return isFinite(param1);
    }

    public static b2Dot(param1: b2Vec2, param2: b2Vec2): number {
        return param1.x * param2.x + param1.y * param2.y;
    }

    public static b2CrossVV(param1: b2Vec2, param2: b2Vec2): number {
        return param1.x * param2.y - param1.y * param2.x;
    }

    public static b2CrossVF(param1: b2Vec2, param2: number): b2Vec2 {
        return new b2Vec2(param2 * param1.y, -param2 * param1.x);
    }

    public static b2CrossFV(param1: number, param2: b2Vec2): b2Vec2 {
        return new b2Vec2(-param1 * param2.y, param1 * param2.x);
    }

    public static b2MulMV(param1: b2Mat22, param2: b2Vec2): b2Vec2 {
        return new b2Vec2(
            param1.col1.x * param2.x + param1.col2.x * param2.y,
            param1.col1.y * param2.x + param1.col2.y * param2.y,
        );
    }

    public static b2MulTMV(param1: b2Mat22, param2: b2Vec2): b2Vec2 {
        return new b2Vec2(
            b2Math.b2Dot(param2, param1.col1),
            b2Math.b2Dot(param2, param1.col2),
        );
    }

    public static b2MulX(param1: b2XForm, param2: b2Vec2): b2Vec2 {
        var _loc3_: b2Vec2 = null;
        _loc3_ = b2Math.b2MulMV(param1.R, param2);
        _loc3_.x += param1.position.x;
        _loc3_.y += param1.position.y;
        return _loc3_;
    }

    public static b2MulXT(param1: b2XForm, param2: b2Vec2): b2Vec2 {
        var _loc3_: b2Vec2 = null;
        var _loc4_: number = NaN;
        _loc3_ = b2Math.SubtractVV(param2, param1.position);
        _loc4_ = _loc3_.x * param1.R.col1.x + _loc3_.y * param1.R.col1.y;
        _loc3_.y = _loc3_.x * param1.R.col2.x + _loc3_.y * param1.R.col2.y;
        _loc3_.x = _loc4_;
        return _loc3_;
    }

    public static AddVV(param1: b2Vec2, param2: b2Vec2): b2Vec2 {
        return new b2Vec2(param1.x + param2.x, param1.y + param2.y);
    }

    public static SubtractVV(param1: b2Vec2, param2: b2Vec2): b2Vec2 {
        return new b2Vec2(param1.x - param2.x, param1.y - param2.y);
    }

    public static b2Distance(param1: b2Vec2, param2: b2Vec2): number {
        var _loc3_: number = param1.x - param2.x;
        var _loc4_: number = param1.y - param2.y;
        return Math.sqrt(_loc3_ * _loc3_ + _loc4_ * _loc4_);
    }

    public static b2DistanceSquared(param1: b2Vec2, param2: b2Vec2): number {
        var _loc3_: number = param1.x - param2.x;
        var _loc4_: number = param1.y - param2.y;
        return _loc3_ * _loc3_ + _loc4_ * _loc4_;
    }

    public static MulFV(param1: number, param2: b2Vec2): b2Vec2 {
        return new b2Vec2(param1 * param2.x, param1 * param2.y);
    }

    public static AddMM(param1: b2Mat22, param2: b2Mat22): b2Mat22 {
        return new b2Mat22(
            0,
            b2Math.AddVV(param1.col1, param2.col1),
            b2Math.AddVV(param1.col2, param2.col2),
        );
    }

    public static b2MulMM(param1: b2Mat22, param2: b2Mat22): b2Mat22 {
        return new b2Mat22(
            0,
            b2Math.b2MulMV(param1, param2.col1),
            b2Math.b2MulMV(param1, param2.col2),
        );
    }

    public static b2MulTMM(param1: b2Mat22, param2: b2Mat22): b2Mat22 {
        var _loc3_ = new b2Vec2(
            b2Math.b2Dot(param1.col1, param2.col1),
            b2Math.b2Dot(param1.col2, param2.col1),
        );
        var _loc4_ = new b2Vec2(
            b2Math.b2Dot(param1.col1, param2.col2),
            b2Math.b2Dot(param1.col2, param2.col2),
        );
        return new b2Mat22(0, _loc3_, _loc4_);
    }

    public static b2Abs(param1: number): number {
        return param1 > 0 ? param1 : -param1;
    }

    public static b2AbsV(param1: b2Vec2): b2Vec2 {
        return new b2Vec2(b2Math.b2Abs(param1.x), b2Math.b2Abs(param1.y));
    }

    public static b2AbsM(param1: b2Mat22): b2Mat22 {
        return new b2Mat22(
            0,
            b2Math.b2AbsV(param1.col1),
            b2Math.b2AbsV(param1.col2),
        );
    }

    public static b2Min(param1: number, param2: number): number {
        return param1 < param2 ? param1 : param2;
    }

    public static b2MinV(param1: b2Vec2, param2: b2Vec2): b2Vec2 {
        return new b2Vec2(
            b2Math.b2Min(param1.x, param2.x),
            b2Math.b2Min(param1.y, param2.y),
        );
    }

    public static b2Max(param1: number, param2: number): number {
        return param1 > param2 ? param1 : param2;
    }

    public static b2MaxV(param1: b2Vec2, param2: b2Vec2): b2Vec2 {
        return new b2Vec2(
            b2Math.b2Max(param1.x, param2.x),
            b2Math.b2Max(param1.y, param2.y),
        );
    }

    public static b2Clamp(
        param1: number,
        param2: number,
        param3: number,
    ): number {
        return b2Math.b2Max(param2, b2Math.b2Min(param1, param3));
    }

    public static b2ClampV(
        param1: b2Vec2,
        param2: b2Vec2,
        param3: b2Vec2,
    ): b2Vec2 {
        return b2Math.b2MaxV(param2, b2Math.b2MinV(param1, param3));
    }

    public static b2Swap(param1: any[], param2: any[]) {
        var _loc3_ = param1[0];
        param1[0] = param2[0];
        param2[0] = _loc3_;
    }

    public static b2Random(): number {
        return Math.random() * 2 - 1;
    }

    public static b2RandomRange(param1: number, param2: number): number {
        var _loc3_: number = Math.random();
        return (param2 - param1) * _loc3_ + param1;
    }

    public static b2NextPowerOfTwo(param1: number): number {
        param1 |= (param1 >> 1) & 2147483647;
        param1 |= (param1 >> 2) & 1073741823;
        param1 |= (param1 >> 4) & 268435455;
        param1 |= (param1 >> 8) & 16777215;
        param1 |= (param1 >> 16) & 65535;
        return param1 + 1;
    }

    public static b2IsPowerOfTwo(param1: number): boolean {
        return param1 > 0 && (param1 & (param1 - 1)) == 0;
    }
}