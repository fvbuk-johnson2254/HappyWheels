import b2AABB from "@/Box2D/Collision/b2AABB";
import b2Manifold from "@/Box2D/Collision/b2Manifold";
import b2ManifoldPoint from "@/Box2D/Collision/b2ManifoldPoint";
import ClipVertex from "@/Box2D/Collision/ClipVertex";
import b2CircleShape from "@/Box2D/Collision/Shapes/b2CircleShape";
import b2PolygonShape from "@/Box2D/Collision/Shapes/b2PolygonShape";
import b2Settings from "@/Box2D/Common/b2Settings";
import b2Mat22 from "@/Box2D/Common/Math/b2Mat22";
import b2Math from "@/Box2D/Common/Math/b2Math";
import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import b2XForm from "@/Box2D/Common/Math/b2XForm";

export default class b2Collision {
    public static b2_nullFeature = 0x000000ff;
    private static b2CollidePolyTempVec = new b2Vec2();

    public static ClipSegmentToLine(
        param1: any[],
        param2: any[],
        param3: b2Vec2,
        param4: number,
    ): number {
        var _loc5_: ClipVertex = null;
        var _loc6_: number = 0;
        var _loc7_: b2Vec2 = null;
        var _loc8_: b2Vec2 = null;
        var _loc9_: number = NaN;
        var _loc11_: number = NaN;
        var _loc12_: b2Vec2 = null;
        var _loc13_: ClipVertex = null;
        _loc6_ = 0;
        _loc5_ = param2[0];
        _loc7_ = _loc5_.v;
        _loc5_ = param2[1];
        _loc8_ = _loc5_.v;
        _loc9_ = b2Math.b2Dot(param3, _loc7_) - param4;
        var _loc10_: number = b2Math.b2Dot(param3, _loc8_) - param4;
        if (_loc9_ <= 0) {
            var _loc14_;
            param1[(_loc14_ = _loc6_++)] = param2[0];
        }
        if (_loc10_ <= 0) {
            param1[(_loc14_ = _loc6_++)] = param2[1];
        }
        if (_loc9_ * _loc10_ < 0) {
            _loc11_ = _loc9_ / (_loc9_ - _loc10_);
            _loc5_ = param1[_loc6_];
            _loc12_ = _loc5_.v;
            _loc12_.x = _loc7_.x + _loc11_ * (_loc8_.x - _loc7_.x);
            _loc12_.y = _loc7_.y + _loc11_ * (_loc8_.y - _loc7_.y);
            _loc5_ = param1[_loc6_];
            if (_loc9_ > 0) {
                _loc13_ = param2[0];
                _loc5_.id = _loc13_.id;
            } else {
                _loc13_ = param2[1];
                _loc5_.id = _loc13_.id;
            }
            _loc6_++;
        }
        return _loc6_;
    }

    public static EdgeSeparation(
        param1: b2PolygonShape,
        param2: b2XForm,
        param3: number,
        param4: b2PolygonShape,
        param5: b2XForm,
    ): number {
        var _loc11_: b2Mat22 = null;
        var _loc12_: b2Vec2 = null;
        var _loc25_: number = NaN;
        var _loc6_: number = param1.m_vertexCount;
        var _loc7_: any[] = param1.m_vertices;
        var _loc8_: any[] = param1.m_normals;
        var _loc9_: number = param4.m_vertexCount;
        var _loc10_: any[] = param4.m_vertices;
        _loc11_ = param2.R;
        _loc12_ = _loc8_[param3];
        var _loc13_: number =
            _loc11_.col1.x * _loc12_.x + _loc11_.col2.x * _loc12_.y;
        var _loc14_: number =
            _loc11_.col1.y * _loc12_.x + _loc11_.col2.y * _loc12_.y;
        _loc11_ = param5.R;
        var _loc15_: number =
            _loc11_.col1.x * _loc13_ + _loc11_.col1.y * _loc14_;
        var _loc16_: number =
            _loc11_.col2.x * _loc13_ + _loc11_.col2.y * _loc14_;
        var _loc17_: number = 0;
        var _loc18_ = Number.MAX_VALUE;
        var _loc19_: number = 0;
        while (_loc19_ < _loc9_) {
            _loc12_ = _loc10_[_loc19_];
            _loc25_ = _loc12_.x * _loc15_ + _loc12_.y * _loc16_;
            if (_loc25_ < _loc18_) {
                _loc18_ = _loc25_;
                _loc17_ = _loc19_;
            }
            _loc19_++;
        }
        _loc12_ = _loc7_[param3];
        _loc11_ = param2.R;
        var _loc20_: number =
            param2.position.x +
            (_loc11_.col1.x * _loc12_.x + _loc11_.col2.x * _loc12_.y);
        var _loc21_: number =
            param2.position.y +
            (_loc11_.col1.y * _loc12_.x + _loc11_.col2.y * _loc12_.y);
        _loc12_ = _loc10_[_loc17_];
        _loc11_ = param5.R;
        var _loc22_: number =
            param5.position.x +
            (_loc11_.col1.x * _loc12_.x + _loc11_.col2.x * _loc12_.y);
        var _loc23_: number =
            param5.position.y +
            (_loc11_.col1.y * _loc12_.x + _loc11_.col2.y * _loc12_.y);
        _loc22_ -= _loc20_;
        _loc23_ -= _loc21_;
        return _loc22_ * _loc13_ + _loc23_ * _loc14_;
    }

    public static FindMaxSeparation(
        param1: any[],
        param2: b2PolygonShape,
        param3: b2XForm,
        param4: b2PolygonShape,
        param5: b2XForm,
    ): number {
        var _loc8_: b2Vec2 = null;
        var _loc9_: b2Mat22 = null;
        var _loc22_: number = 0;
        var _loc23_: number = NaN;
        var _loc24_: number = 0;
        var _loc25_: number = NaN;
        var _loc6_: number = param2.m_vertexCount;
        var _loc7_: any[] = param2.m_normals;
        _loc9_ = param5.R;
        _loc8_ = param4.m_centroid;
        var _loc10_: number =
            param5.position.x +
            (_loc9_.col1.x * _loc8_.x + _loc9_.col2.x * _loc8_.y);
        var _loc11_: number =
            param5.position.y +
            (_loc9_.col1.y * _loc8_.x + _loc9_.col2.y * _loc8_.y);
        _loc9_ = param3.R;
        _loc8_ = param2.m_centroid;
        _loc10_ -=
            param3.position.x +
            (_loc9_.col1.x * _loc8_.x + _loc9_.col2.x * _loc8_.y);
        _loc11_ -=
            param3.position.y +
            (_loc9_.col1.y * _loc8_.x + _loc9_.col2.y * _loc8_.y);
        var _loc12_: number =
            _loc10_ * param3.R.col1.x + _loc11_ * param3.R.col1.y;
        var _loc13_: number =
            _loc10_ * param3.R.col2.x + _loc11_ * param3.R.col2.y;
        var _loc14_: number = 0;
        var _loc15_: number = -Number.MAX_VALUE;
        var _loc16_: number = 0;
        while (_loc16_ < _loc6_) {
            _loc8_ = _loc7_[_loc16_];
            _loc25_ = _loc8_.x * _loc12_ + _loc8_.y * _loc13_;
            if (_loc25_ > _loc15_) {
                _loc15_ = _loc25_;
                _loc14_ = _loc16_;
            }
            _loc16_++;
        }
        var _loc17_: number = b2Collision.EdgeSeparation(
            param2,
            param3,
            _loc14_,
            param4,
            param5,
        );
        if (_loc17_ > 0) {
            return _loc17_;
        }
        var _loc18_: number = _loc14_ - 1 >= 0 ? _loc14_ - 1 : _loc6_ - 1;
        var _loc19_: number = b2Collision.EdgeSeparation(
            param2,
            param3,
            _loc18_,
            param4,
            param5,
        );
        if (_loc19_ > 0) {
            return _loc19_;
        }
        var _loc20_: number = _loc14_ + 1 < _loc6_ ? _loc14_ + 1 : 0;
        var _loc21_: number = b2Collision.EdgeSeparation(
            param2,
            param3,
            _loc20_,
            param4,
            param5,
        );
        if (_loc21_ > 0) {
            return _loc21_;
        }
        if (_loc19_ > _loc17_ && _loc19_ > _loc21_) {
            _loc24_ = -1;
            _loc22_ = _loc18_;
            _loc23_ = _loc19_;
        } else {
            if (_loc21_ <= _loc17_) {
                param1[0] = _loc14_;
                return _loc17_;
            }
            _loc24_ = 1;
            _loc22_ = _loc20_;
            _loc23_ = _loc21_;
        }
        while (true) {
            if (_loc24_ == -1) {
                _loc14_ = _loc22_ - 1 >= 0 ? _loc22_ - 1 : _loc6_ - 1;
            } else {
                _loc14_ = _loc22_ + 1 < _loc6_ ? _loc22_ + 1 : 0;
            }
            _loc17_ = b2Collision.EdgeSeparation(
                param2,
                param3,
                _loc14_,
                param4,
                param5,
            );
            if (_loc17_ > 0) {
                break;
            }
            if (_loc17_ <= _loc23_) {
                param1[0] = _loc22_;
                return _loc23_;
            }
            _loc22_ = _loc14_;
            _loc23_ = _loc17_;
        }
        return _loc17_;
    }

    public static FindIncidentEdge(
        param1: any[],
        param2: b2PolygonShape,
        param3: b2XForm,
        param4: number,
        param5: b2PolygonShape,
        param6: b2XForm,
    ) {
        var _loc12_: b2Mat22 = null;
        var _loc13_: b2Vec2 = null;
        var _loc20_: ClipVertex = null;
        var _loc23_: number = NaN;
        var _loc7_: number = param2.m_vertexCount;
        var _loc8_: any[] = param2.m_normals;
        var _loc9_: number = param5.m_vertexCount;
        var _loc10_: any[] = param5.m_vertices;
        var _loc11_: any[] = param5.m_normals;
        _loc12_ = param3.R;
        _loc13_ = _loc8_[param4];
        var _loc14_: number =
            _loc12_.col1.x * _loc13_.x + _loc12_.col2.x * _loc13_.y;
        var _loc15_: number =
            _loc12_.col1.y * _loc13_.x + _loc12_.col2.y * _loc13_.y;
        _loc12_ = param6.R;
        var _loc16_: number =
            _loc12_.col1.x * _loc14_ + _loc12_.col1.y * _loc15_;
        _loc15_ = _loc12_.col2.x * _loc14_ + _loc12_.col2.y * _loc15_;
        _loc14_ = _loc16_;
        var _loc17_: number = 0;
        var _loc18_ = Number.MAX_VALUE;
        var _loc19_: number = 0;
        while (_loc19_ < _loc9_) {
            _loc13_ = _loc11_[_loc19_];
            _loc23_ = _loc14_ * _loc13_.x + _loc15_ * _loc13_.y;
            if (_loc23_ < _loc18_) {
                _loc18_ = _loc23_;
                _loc17_ = _loc19_;
            }
            _loc19_++;
        }
        var _loc21_: number = _loc17_;
        var _loc22_: number = _loc21_ + 1 < _loc9_ ? _loc21_ + 1 : 0;
        _loc20_ = param1[0];
        _loc13_ = _loc10_[_loc21_];
        _loc12_ = param6.R;
        _loc20_.v.x =
            param6.position.x +
            (_loc12_.col1.x * _loc13_.x + _loc12_.col2.x * _loc13_.y);
        _loc20_.v.y =
            param6.position.y +
            (_loc12_.col1.y * _loc13_.x + _loc12_.col2.y * _loc13_.y);
        _loc20_.id.features.referenceEdge = param4;
        _loc20_.id.features.incidentEdge = _loc21_;
        _loc20_.id.features.incidentVertex = 0;
        _loc20_ = param1[1];
        _loc13_ = _loc10_[_loc22_];
        _loc12_ = param6.R;
        _loc20_.v.x =
            param6.position.x +
            (_loc12_.col1.x * _loc13_.x + _loc12_.col2.x * _loc13_.y);
        _loc20_.v.y =
            param6.position.y +
            (_loc12_.col1.y * _loc13_.x + _loc12_.col2.y * _loc13_.y);
        _loc20_.id.features.referenceEdge = param4;
        _loc20_.id.features.incidentEdge = _loc22_;
        _loc20_.id.features.incidentVertex = 1;
    }

    public static b2CollidePolygons(
        param1: b2Manifold,
        param2: b2PolygonShape,
        param3: b2XForm,
        param4: b2PolygonShape,
        param5: b2XForm,
    ) {
        var _loc6_: ClipVertex = null;
        var _loc13_: b2PolygonShape = null;
        var _loc14_: b2PolygonShape = null;
        var _loc17_: number = 0;
        var _loc18_: number = 0;
        var _loc34_: number = 0;
        var _loc37_: b2Vec2 = null;
        var _loc38_: number = NaN;
        var _loc39_: b2ManifoldPoint = null;
        param1.pointCount = 0;
        var _loc7_: number = 0;
        var _loc8_: any[] = [_loc7_];
        var _loc9_: number = b2Collision.FindMaxSeparation(
            _loc8_,
            param2,
            param3,
            param4,
            param5,
        );
        _loc7_ = int(_loc8_[0]);
        if (_loc9_ > 0) {
            return;
        }
        var _loc10_: number = 0;
        var _loc11_: any[] = [_loc10_];
        var _loc12_: number = b2Collision.FindMaxSeparation(
            _loc11_,
            param4,
            param5,
            param2,
            param3,
        );
        _loc10_ = int(_loc11_[0]);
        if (_loc12_ > 0) {
            return;
        }
        var _loc15_ = new b2XForm();
        var _loc16_ = new b2XForm();
        var _loc19_: number = 0.98;
        var _loc20_: number = 0.001;
        if (_loc12_ > _loc19_ * _loc9_ + _loc20_) {
            _loc13_ = param4;
            _loc14_ = param2;
            _loc15_.Set(param5);
            _loc16_.Set(param3);
            _loc17_ = _loc10_;
            _loc18_ = 1;
        } else {
            _loc13_ = param2;
            _loc14_ = param4;
            _loc15_.Set(param3);
            _loc16_.Set(param5);
            _loc17_ = _loc7_;
            _loc18_ = 0;
        }
        var _loc21_: any[] = [new ClipVertex(), new ClipVertex()];
        b2Collision.FindIncidentEdge(
            _loc21_,
            _loc13_,
            _loc15_,
            _loc17_,
            _loc14_,
            _loc16_,
        );
        var _loc22_: number = _loc13_.m_vertexCount;
        var _loc23_: any[] = _loc13_.m_vertices;
        var _loc24_: b2Vec2 = _loc23_[_loc17_];
        var _loc25_: b2Vec2 = _loc24_.Copy();
        if (_loc17_ + 1 < _loc22_) {
            _loc24_ = _loc23_[int(_loc17_ + 1)];
            _loc37_ = _loc24_.Copy();
        } else {
            _loc24_ = _loc23_[0];
            _loc37_ = _loc24_.Copy();
        }
        var _loc26_: b2Vec2 = b2Math.SubtractVV(_loc37_, _loc25_);
        var _loc27_: b2Vec2 = b2Math.b2MulMV(
            _loc15_.R,
            b2Math.SubtractVV(_loc37_, _loc25_),
        );
        _loc27_.Normalize();
        var _loc28_: b2Vec2 = b2Math.b2CrossVF(_loc27_, 1);
        _loc25_ = b2Math.b2MulX(_loc15_, _loc25_);
        _loc37_ = b2Math.b2MulX(_loc15_, _loc37_);
        var _loc29_: number = b2Math.b2Dot(_loc28_, _loc25_);
        var _loc30_: number = -b2Math.b2Dot(_loc27_, _loc25_);
        var _loc31_: number = b2Math.b2Dot(_loc27_, _loc37_);
        var _loc32_: any[] = [new ClipVertex(), new ClipVertex()];
        var _loc33_: any[] = [new ClipVertex(), new ClipVertex()];
        _loc34_ = b2Collision.ClipSegmentToLine(
            _loc32_,
            _loc21_,
            _loc27_.Negative(),
            _loc30_,
        );
        if (_loc34_ < 2) {
            return;
        }
        _loc34_ = b2Collision.ClipSegmentToLine(
            _loc33_,
            _loc32_,
            _loc27_,
            _loc31_,
        );
        if (_loc34_ < 2) {
            return;
        }
        param1.normal = !!_loc18_ ? _loc28_.Negative() : _loc28_.Copy();
        var _loc35_: number = 0;
        var _loc36_: number = 0;
        while (_loc36_ < b2Settings.b2_maxManifoldPoints) {
            _loc6_ = _loc33_[_loc36_];
            _loc38_ = b2Math.b2Dot(_loc28_, _loc6_.v) - _loc29_;
            if (_loc38_ <= 0) {
                _loc39_ = param1.points[_loc35_];
                _loc39_.separation = _loc38_;
                _loc39_.localPoint1 = b2Math.b2MulXT(param3, _loc6_.v);
                _loc39_.localPoint2 = b2Math.b2MulXT(param5, _loc6_.v);
                _loc39_.id.key = _loc6_.id._key;
                _loc39_.id.features.flip = _loc18_;
                _loc35_++;
            }
            _loc36_++;
        }
        param1.pointCount = _loc35_;
    }

    public static b2CollideCircles(
        param1: b2Manifold,
        param2: b2CircleShape,
        param3: b2XForm,
        param4: b2CircleShape,
        param5: b2XForm,
    ) {
        var _loc6_: b2Mat22 = null;
        var _loc7_: b2Vec2 = null;
        var _loc18_: number = NaN;
        var _loc24_: number = NaN;
        var _loc25_: number = NaN;
        param1.pointCount = 0;
        _loc6_ = param3.R;
        _loc7_ = param2.m_localPosition;
        var _loc8_: number =
            param3.position.x +
            (_loc6_.col1.x * _loc7_.x + _loc6_.col2.x * _loc7_.y);
        var _loc9_: number =
            param3.position.y +
            (_loc6_.col1.y * _loc7_.x + _loc6_.col2.y * _loc7_.y);
        _loc6_ = param5.R;
        _loc7_ = param4.m_localPosition;
        var _loc10_: number =
            param5.position.x +
            (_loc6_.col1.x * _loc7_.x + _loc6_.col2.x * _loc7_.y);
        var _loc11_: number =
            param5.position.y +
            (_loc6_.col1.y * _loc7_.x + _loc6_.col2.y * _loc7_.y);
        var _loc12_: number = _loc10_ - _loc8_;
        var _loc13_: number = _loc11_ - _loc9_;
        var _loc14_: number = _loc12_ * _loc12_ + _loc13_ * _loc13_;
        var _loc15_: number = param2.m_radius;
        var _loc16_: number = param4.m_radius;
        var _loc17_: number = _loc15_ + _loc16_;
        if (_loc14_ > _loc17_ * _loc17_) {
            return;
        }
        if (_loc14_ < Number.MIN_VALUE) {
            _loc18_ = -_loc17_;
            param1.normal.Set(0, 1);
        } else {
            _loc24_ = Math.sqrt(_loc14_);
            _loc18_ = _loc24_ - _loc17_;
            _loc25_ = 1 / _loc24_;
            param1.normal.x = _loc25_ * _loc12_;
            param1.normal.y = _loc25_ * _loc13_;
        }
        param1.pointCount = 1;
        var _loc19_: b2ManifoldPoint = param1.points[0];
        _loc19_.id.key = 0;
        _loc19_.separation = _loc18_;
        _loc8_ += _loc15_ * param1.normal.x;
        _loc9_ += _loc15_ * param1.normal.y;
        _loc10_ -= _loc16_ * param1.normal.x;
        _loc11_ -= _loc16_ * param1.normal.y;
        var _loc20_: number = 0.5 * (_loc8_ + _loc10_);
        var _loc21_: number = 0.5 * (_loc9_ + _loc11_);
        var _loc22_: number = _loc20_ - param3.position.x;
        var _loc23_: number = _loc21_ - param3.position.y;
        _loc19_.localPoint1.x =
            _loc22_ * param3.R.col1.x + _loc23_ * param3.R.col1.y;
        _loc19_.localPoint1.y =
            _loc22_ * param3.R.col2.x + _loc23_ * param3.R.col2.y;
        _loc22_ = _loc20_ - param5.position.x;
        _loc23_ = _loc21_ - param5.position.y;
        _loc19_.localPoint2.x =
            _loc22_ * param5.R.col1.x + _loc23_ * param5.R.col1.y;
        _loc19_.localPoint2.y =
            _loc22_ * param5.R.col2.x + _loc23_ * param5.R.col2.y;
    }

    public static b2CollidePolygonAndCircle(
        param1: b2Manifold,
        param2: b2PolygonShape,
        param3: b2XForm,
        param4: b2CircleShape,
        param5: b2XForm,
    ) {
        var _loc6_: b2ManifoldPoint = null;
        var _loc7_: number = NaN;
        var _loc8_: number = NaN;
        var _loc9_: number = NaN;
        var _loc10_: number = NaN;
        var _loc11_: b2Vec2 = null;
        var _loc12_: b2Mat22 = null;
        var _loc17_: number = NaN;
        var _loc32_: number = NaN;
        var _loc33_: number = NaN;
        var _loc34_: number = NaN;
        param1.pointCount = 0;
        _loc12_ = param5.R;
        _loc11_ = param4.m_localPosition;
        var _loc13_: number =
            param5.position.x +
            (_loc12_.col1.x * _loc11_.x + _loc12_.col2.x * _loc11_.y);
        var _loc14_: number =
            param5.position.y +
            (_loc12_.col1.y * _loc11_.x + _loc12_.col2.y * _loc11_.y);
        _loc7_ = _loc13_ - param3.position.x;
        _loc8_ = _loc14_ - param3.position.y;
        _loc12_ = param3.R;
        var _loc15_: number = _loc7_ * _loc12_.col1.x + _loc8_ * _loc12_.col1.y;
        var _loc16_: number = _loc7_ * _loc12_.col2.x + _loc8_ * _loc12_.col2.y;
        var _loc18_: number = 0;
        var _loc19_: number = -Number.MAX_VALUE;
        var _loc20_: number = param4.m_radius;
        var _loc21_: number = param2.m_vertexCount;
        var _loc22_: any[] = param2.m_vertices;
        var _loc23_: any[] = param2.m_normals;
        var _loc24_: number = 0;
        while (_loc24_ < _loc21_) {
            _loc11_ = _loc22_[_loc24_];
            _loc7_ = _loc15_ - _loc11_.x;
            _loc8_ = _loc16_ - _loc11_.y;
            _loc11_ = _loc23_[_loc24_];
            _loc34_ = _loc11_.x * _loc7_ + _loc11_.y * _loc8_;
            if (_loc34_ > _loc20_) {
                return;
            }
            if (_loc34_ > _loc19_) {
                _loc19_ = _loc34_;
                _loc18_ = _loc24_;
            }
            _loc24_++;
        }
        if (_loc19_ < Number.MIN_VALUE) {
            param1.pointCount = 1;
            _loc11_ = _loc23_[_loc18_];
            _loc12_ = param3.R;
            param1.normal.x =
                _loc12_.col1.x * _loc11_.x + _loc12_.col2.x * _loc11_.y;
            param1.normal.y =
                _loc12_.col1.y * _loc11_.x + _loc12_.col2.y * _loc11_.y;
            _loc6_ = param1.points[0];
            _loc6_.id.features.incidentEdge = _loc18_;
            _loc6_.id.features.incidentVertex = b2Collision.b2_nullFeature;
            _loc6_.id.features.referenceEdge = 0;
            _loc6_.id.features.flip = 0;
            _loc9_ = _loc13_ - _loc20_ * param1.normal.x;
            _loc10_ = _loc14_ - _loc20_ * param1.normal.y;
            _loc7_ = _loc9_ - param3.position.x;
            _loc8_ = _loc10_ - param3.position.y;
            _loc12_ = param3.R;
            _loc6_.localPoint1.x =
                _loc7_ * _loc12_.col1.x + _loc8_ * _loc12_.col1.y;
            _loc6_.localPoint1.y =
                _loc7_ * _loc12_.col2.x + _loc8_ * _loc12_.col2.y;
            _loc7_ = _loc9_ - param5.position.x;
            _loc8_ = _loc10_ - param5.position.y;
            _loc12_ = param5.R;
            _loc6_.localPoint2.x =
                _loc7_ * _loc12_.col1.x + _loc8_ * _loc12_.col1.y;
            _loc6_.localPoint2.y =
                _loc7_ * _loc12_.col2.x + _loc8_ * _loc12_.col2.y;
            _loc6_.separation = _loc19_ - _loc20_;
            return;
        }
        var _loc25_: number = _loc18_;
        var _loc26_: number = _loc25_ + 1 < _loc21_ ? _loc25_ + 1 : 0;
        _loc11_ = _loc22_[_loc25_];
        var _loc27_: b2Vec2 = _loc22_[_loc26_];
        var _loc28_: number = _loc27_.x - _loc11_.x;
        var _loc29_: number = _loc27_.y - _loc11_.y;
        var _loc30_: number = Math.sqrt(_loc28_ * _loc28_ + _loc29_ * _loc29_);
        _loc28_ /= _loc30_;
        _loc29_ /= _loc30_;
        _loc7_ = _loc15_ - _loc11_.x;
        _loc8_ = _loc16_ - _loc11_.y;
        var _loc31_: number = _loc7_ * _loc28_ + _loc8_ * _loc29_;
        _loc6_ = param1.points[0];
        if (_loc31_ <= 0) {
            _loc32_ = _loc11_.x;
            _loc33_ = _loc11_.y;
            _loc6_.id.features.incidentEdge = b2Collision.b2_nullFeature;
            _loc6_.id.features.incidentVertex = _loc25_;
        } else if (_loc31_ >= _loc30_) {
            _loc32_ = _loc27_.x;
            _loc33_ = _loc27_.y;
            _loc6_.id.features.incidentEdge = b2Collision.b2_nullFeature;
            _loc6_.id.features.incidentVertex = _loc26_;
        } else {
            _loc32_ = _loc28_ * _loc31_ + _loc11_.x;
            _loc33_ = _loc29_ * _loc31_ + _loc11_.y;
            _loc6_.id.features.incidentEdge = _loc18_;
            _loc6_.id.features.incidentVertex = 0;
        }
        _loc7_ = _loc15_ - _loc32_;
        _loc8_ = _loc16_ - _loc33_;
        _loc17_ = Math.sqrt(_loc7_ * _loc7_ + _loc8_ * _loc8_);
        _loc7_ /= _loc17_;
        _loc8_ /= _loc17_;
        if (_loc17_ > _loc20_) {
            return;
        }
        param1.pointCount = 1;
        _loc12_ = param3.R;
        param1.normal.x = _loc12_.col1.x * _loc7_ + _loc12_.col2.x * _loc8_;
        param1.normal.y = _loc12_.col1.y * _loc7_ + _loc12_.col2.y * _loc8_;
        _loc9_ = _loc13_ - _loc20_ * param1.normal.x;
        _loc10_ = _loc14_ - _loc20_ * param1.normal.y;
        _loc7_ = _loc9_ - param3.position.x;
        _loc8_ = _loc10_ - param3.position.y;
        _loc12_ = param3.R;
        _loc6_.localPoint1.x =
            _loc7_ * _loc12_.col1.x + _loc8_ * _loc12_.col1.y;
        _loc6_.localPoint1.y =
            _loc7_ * _loc12_.col2.x + _loc8_ * _loc12_.col2.y;
        _loc7_ = _loc9_ - param5.position.x;
        _loc8_ = _loc10_ - param5.position.y;
        _loc12_ = param5.R;
        _loc6_.localPoint2.x =
            _loc7_ * _loc12_.col1.x + _loc8_ * _loc12_.col1.y;
        _loc6_.localPoint2.y =
            _loc7_ * _loc12_.col2.x + _loc8_ * _loc12_.col2.y;
        _loc6_.separation = _loc17_ - _loc20_;
        _loc6_.id.features.referenceEdge = 0;
        _loc6_.id.features.flip = 0;
    }

    public static b2TestOverlap(param1: b2AABB, param2: b2AABB): boolean {
        var _loc3_: b2Vec2 = param2.lowerBound;
        var _loc4_: b2Vec2 = param1.upperBound;
        var _loc5_: number = _loc3_.x - _loc4_.x;
        var _loc6_: number = _loc3_.y - _loc4_.y;
        _loc3_ = param1.lowerBound;
        _loc4_ = param2.upperBound;
        var _loc7_: number = _loc3_.x - _loc4_.x;
        var _loc8_: number = _loc3_.y - _loc4_.y;
        if (_loc5_ > 0 || _loc6_ > 0) {
            return false;
        }
        if (_loc7_ > 0 || _loc8_ > 0) {
            return false;
        }
        return true;
    }
}