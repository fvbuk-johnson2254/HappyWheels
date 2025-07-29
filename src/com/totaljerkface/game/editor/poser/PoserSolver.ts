import b2Math from "@/Box2D/Common/Math/b2Math";
import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import PoserSegment from "@/com/totaljerkface/game/editor/poser/PoserSegment";
import { boundClass } from 'autobind-decorator';

@boundClass
export default class PoserSolver {
    private static numIterations: number;
    private static distanceError: number = 1;
    private static PIoverOneEighty: number = Math.PI / 180;
    private static PI_2: number = Math.PI * 2;
    private static dampingAngle: number = Math.PI / 6;

    public static solve(param1: number, param2: number, param3: PoserSegment) {
        var _loc5_: PoserSegment = null;
        var _loc6_: number = NaN;
        var _loc7_: number = NaN;
        var _loc8_: b2Vec2 = null;
        var _loc9_: b2Vec2 = null;
        var _loc10_: b2Vec2 = null;
        var _loc11_: b2Vec2 = null;
        var _loc12_: number = NaN;
        var _loc13_: number = NaN;
        var _loc14_: number = NaN;
        var _loc4_: number = 0;
        while (_loc4_ < PoserSolver.numIterations) {
            _loc5_ = param3;
            while (_loc5_) {
                _loc8_ = new b2Vec2(_loc5_.x, _loc5_.y);
                _loc9_ = param3.endPoint;
                _loc6_ = Math.abs(param1 - _loc9_.x);
                _loc7_ = Math.abs(param2 - _loc9_.y);
                if (
                    _loc6_ < PoserSolver.distanceError &&
                    _loc7_ < PoserSolver.distanceError
                ) {
                    PoserSolver.drawSegments(param3);
                    return;
                }
                _loc10_ = new b2Vec2(param1 - _loc8_.x, param2 - _loc8_.y);
                _loc11_ = new b2Vec2(_loc9_.x - _loc8_.x, _loc9_.y - _loc8_.y);
                _loc10_.Normalize();
                _loc11_.Normalize();
                _loc12_ = b2Math.b2Dot(_loc10_, _loc11_);
                if (_loc12_ < 0.9999) {
                    _loc13_ = b2Math.b2CrossVV(_loc10_, _loc11_);
                    if (_loc13_ > 0) {
                        _loc14_ = Math.acos(_loc12_);
                        _loc5_.angle -= _loc14_;
                    } else if (_loc13_ < 0) {
                        _loc14_ = Math.acos(_loc12_);
                        _loc5_.angle += _loc14_;
                    }
                }
                _loc5_ = _loc5_.parentSegment;
            }
            _loc9_ = param3.endPoint;
            _loc6_ = Math.abs(param1 - _loc9_.x);
            _loc7_ = Math.abs(param2 - _loc9_.y);
            if (
                _loc6_ < PoserSolver.distanceError &&
                _loc7_ < PoserSolver.distanceError
            ) {
                PoserSolver.drawSegments(param3);
                return;
            }
            _loc4_++;
        }
        PoserSolver.drawSegments(param3);
    }

    private static drawSegments(param1: PoserSegment) {
        while (param1) {
            param1.drawSegment();
            param1 = param1.parentSegment;
        }
    }
}