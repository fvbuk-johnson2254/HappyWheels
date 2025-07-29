import b2Shape from "@/Box2D/Collision/Shapes/b2Shape";
import b2Distance from "@/Box2D/Collision/b2Distance";
import b2Sweep from "@/Box2D/Common/Math/b2Sweep";
import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import b2XForm from "@/Box2D/Common/Math/b2XForm";
import b2Settings from "@/Box2D/Common/b2Settings";

export default class b2TimeOfImpact {
    public static s_p1 = new b2Vec2();
    public static s_p2 = new b2Vec2();
    public static s_xf1 = new b2XForm();
    public static s_xf2 = new b2XForm();

    public static TimeOfImpact(
        param1: b2Shape,
        param2: b2Sweep,
        param3: b2Shape,
        param4: b2Sweep,
    ): number {
        var _loc5_: number = NaN;
        var _loc6_: number = NaN;
        var _loc25_: number = NaN;
        var _loc26_: b2XForm = null;
        var _loc27_: b2XForm = null;
        var _loc28_: number = NaN;
        var _loc29_: number = NaN;
        var _loc30_: number = NaN;
        var _loc31_: number = NaN;
        var _loc7_: number = param1.m_sweepRadius;
        var _loc8_: number = param3.m_sweepRadius;
        var _loc9_: number = param2.t0;
        var _loc10_: number = param2.c.x - param2.c0.x;
        var _loc11_: number = param2.c.y - param2.c0.y;
        var _loc12_: number = param4.c.x - param4.c0.x;
        var _loc13_: number = param4.c.y - param4.c0.y;
        var _loc14_: number = param2.a - param2.a0;
        var _loc15_: number = param4.a - param4.a0;
        var _loc16_: number = 0;
        var _loc17_: b2Vec2 = b2TimeOfImpact.s_p1;
        var _loc18_: b2Vec2 = b2TimeOfImpact.s_p2;
        var _loc19_: number = 20;
        var _loc20_: number = 0;
        var _loc21_: number = 0;
        var _loc22_: number = 0;
        var _loc23_: number = 0;
        var _loc24_: number = 0;
        while (true) {
            _loc25_ = (1 - _loc16_) * _loc9_ + _loc16_;
            _loc26_ = b2TimeOfImpact.s_xf1;
            _loc27_ = b2TimeOfImpact.s_xf2;
            param2.GetXForm(_loc26_, _loc25_);
            param4.GetXForm(_loc27_, _loc25_);
            _loc23_ = b2Distance.Distance(
                _loc17_,
                _loc18_,
                param1,
                _loc26_,
                param3,
                _loc27_,
            );
            if (_loc20_ == 0) {
                if (_loc23_ > 2 * b2Settings.b2_toiSlop) {
                    _loc24_ = 1.5 * b2Settings.b2_toiSlop;
                } else {
                    _loc5_ = 0.05 * b2Settings.b2_toiSlop;
                    _loc6_ = _loc23_ - 0.5 * b2Settings.b2_toiSlop;
                    _loc24_ = _loc5_ > _loc6_ ? _loc5_ : _loc6_;
                }
            }
            if (
                _loc23_ - _loc24_ < 0.05 * b2Settings.b2_toiSlop ||
                _loc20_ == _loc19_
            ) {
                break;
            }
            _loc21_ = _loc18_.x - _loc17_.x;
            _loc22_ = _loc18_.y - _loc17_.y;
            _loc28_ = Math.sqrt(_loc21_ * _loc21_ + _loc22_ * _loc22_);
            _loc21_ /= _loc28_;
            _loc22_ /= _loc28_;
            _loc29_ =
                _loc21_ * (_loc10_ - _loc12_) +
                _loc22_ * (_loc11_ - _loc13_) +
                (_loc14_ < 0 ? -_loc14_ : _loc14_) * _loc7_ +
                (_loc15_ < 0 ? -_loc15_ : _loc15_) * _loc8_;
            if (_loc29_ == 0) {
                _loc16_ = 1;
                break;
            }
            _loc30_ = (_loc23_ - _loc24_) / _loc29_;
            _loc31_ = _loc16_ + _loc30_;
            if (_loc31_ < 0 || 1 < _loc31_) {
                _loc16_ = 1;
                break;
            }
            if (_loc31_ < (1 + 100 * Number.MIN_VALUE) * _loc16_) {
                break;
            }
            _loc16_ = _loc31_;
            _loc20_++;
        }
        return _loc16_;
    }
}