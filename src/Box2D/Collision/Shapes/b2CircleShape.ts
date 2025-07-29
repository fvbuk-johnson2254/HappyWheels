import b2AABB from "@/Box2D/Collision/b2AABB";
import b2Segment from "@/Box2D/Collision/b2Segment";
import b2CircleDef from "@/Box2D/Collision/Shapes/b2CircleDef";
import b2MassData from "@/Box2D/Collision/Shapes/b2MassData";
import b2Shape from "@/Box2D/Collision/Shapes/b2Shape";
import b2ShapeDef from "@/Box2D/Collision/Shapes/b2ShapeDef";
import b2Settings from "@/Box2D/Common/b2Settings";
import b2Mat22 from "@/Box2D/Common/Math/b2Mat22";
import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import b2XForm from "@/Box2D/Common/Math/b2XForm";

export default class b2CircleShape extends b2Shape {
    public m_localPosition = new b2Vec2();
    public m_radius: number;

    constructor(param1: b2ShapeDef) {
        super(param1);
        var _loc2_: b2CircleDef = param1 as b2CircleDef;
        this.m_type = b2Shape.e_circleShape;
        this.m_localPosition.SetV(_loc2_.localPosition);
        this.m_radius = _loc2_.radius;
    }

    public override TestPoint(param1: b2XForm, param2: b2Vec2): boolean {
        var _loc3_: b2Mat22 = param1.R;
        var _loc4_: number =
            param1.position.x +
            (_loc3_.col1.x * this.m_localPosition.x +
                _loc3_.col2.x * this.m_localPosition.y);
        var _loc5_: number =
            param1.position.y +
            (_loc3_.col1.y * this.m_localPosition.x +
                _loc3_.col2.y * this.m_localPosition.y);
        _loc4_ = param2.x - _loc4_;
        _loc5_ = param2.y - _loc5_;
        return (
            _loc4_ * _loc4_ + _loc5_ * _loc5_ <= this.m_radius * this.m_radius
        );
    }

    public override TestSegment(
        param1: b2XForm,
        param2: any[],
        param3: b2Vec2,
        param4: b2Segment,
        param5: number,
    ): boolean {
        var _loc10_: number = NaN;
        var _loc6_: b2Mat22 = param1.R;
        var _loc7_: number =
            param1.position.x +
            (_loc6_.col1.x * this.m_localPosition.x +
                _loc6_.col2.x * this.m_localPosition.y);
        var _loc8_: number =
            param1.position.x +
            (_loc6_.col1.y * this.m_localPosition.x +
                _loc6_.col2.y * this.m_localPosition.y);
        var _loc9_: number = param4.p1.x - _loc7_;
        _loc10_ = param4.p1.y - _loc8_;
        var _loc11_: number =
            _loc9_ * _loc9_ + _loc10_ * _loc10_ - this.m_radius * this.m_radius;
        if (_loc11_ < 0) {
            return false;
        }
        var _loc12_: number = param4.p2.x - param4.p1.x;
        var _loc13_: number = param4.p2.y - param4.p1.y;
        var _loc14_: number = _loc9_ * _loc12_ + _loc10_ * _loc13_;
        var _loc15_: number = _loc12_ * _loc12_ + _loc13_ * _loc13_;
        var _loc16_: number = _loc14_ * _loc14_ - _loc15_ * _loc11_;
        if (_loc16_ < 0 || _loc15_ < Number.MIN_VALUE) {
            return false;
        }
        var _loc17_: number = -(_loc14_ + Math.sqrt(_loc16_));
        if (0 <= _loc17_ && _loc17_ <= param5 * _loc15_) {
            _loc17_ /= _loc15_;
            param2[0] = _loc17_;
            param3.x = _loc9_ + _loc17_ * _loc12_;
            param3.y = _loc10_ + _loc17_ * _loc13_;
            param3.Normalize();
            return true;
        }
        return false;
    }

    public override ComputeAABB(param1: b2AABB, param2: b2XForm) {
        var _loc3_: b2Mat22 = param2.R;
        var _loc4_: number =
            param2.position.x +
            (_loc3_.col1.x * this.m_localPosition.x +
                _loc3_.col2.x * this.m_localPosition.y);
        var _loc5_: number =
            param2.position.y +
            (_loc3_.col1.y * this.m_localPosition.x +
                _loc3_.col2.y * this.m_localPosition.y);
        param1.lowerBound.Set(_loc4_ - this.m_radius, _loc5_ - this.m_radius);
        param1.upperBound.Set(_loc4_ + this.m_radius, _loc5_ + this.m_radius);
    }

    public override ComputeSweptAABB(
        param1: b2AABB,
        param2: b2XForm,
        param3: b2XForm,
    ) {
        var _loc4_: b2Mat22 = null;
        _loc4_ = param2.R;
        var _loc5_: number =
            param2.position.x +
            (_loc4_.col1.x * this.m_localPosition.x +
                _loc4_.col2.x * this.m_localPosition.y);
        var _loc6_: number =
            param2.position.y +
            (_loc4_.col1.y * this.m_localPosition.x +
                _loc4_.col2.y * this.m_localPosition.y);
        _loc4_ = param3.R;
        var _loc7_: number =
            param3.position.x +
            (_loc4_.col1.x * this.m_localPosition.x +
                _loc4_.col2.x * this.m_localPosition.y);
        var _loc8_: number =
            param3.position.y +
            (_loc4_.col1.y * this.m_localPosition.x +
                _loc4_.col2.y * this.m_localPosition.y);
        param1.lowerBound.Set(
            (_loc5_ < _loc7_ ? _loc5_ : _loc7_) - this.m_radius,
            (_loc6_ < _loc8_ ? _loc6_ : _loc8_) - this.m_radius,
        );
        param1.upperBound.Set(
            (_loc5_ > _loc7_ ? _loc5_ : _loc7_) + this.m_radius,
            (_loc6_ > _loc8_ ? _loc6_ : _loc8_) + this.m_radius,
        );
    }

    public override ComputeMass(param1: b2MassData) {
        param1.mass =
            this.m_density * b2Settings.b2_pi * this.m_radius * this.m_radius;
        param1.center.SetV(this.m_localPosition);
        param1.I =
            param1.mass *
            (0.5 * this.m_radius * this.m_radius +
                (this.m_localPosition.x * this.m_localPosition.x +
                    this.m_localPosition.y * this.m_localPosition.y));
    }

    public GetLocalPosition(): b2Vec2 {
        return this.m_localPosition;
    }

    public GetRadius(): number {
        return this.m_radius;
    }

    public override UpdateSweepRadius(param1: b2Vec2) {
        var _loc2_: number = this.m_localPosition.x - param1.x;
        var _loc3_: number = this.m_localPosition.y - param1.y;
        _loc2_ = Math.sqrt(_loc2_ * _loc2_ + _loc3_ * _loc3_);
        this.m_sweepRadius = _loc2_ + this.m_radius - b2Settings.b2_toiSlop;
    }
}