import b2PolygonShape from "@/Box2D/Collision/Shapes/b2PolygonShape";
import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import b2Body from "@/Box2D/Dynamics/b2Body";
import Settings from "@/com/totaljerkface/game/Settings";
import Burst from "@/com/totaljerkface/game/particles/Burst";
import Particle from "@/com/totaljerkface/game/particles/Particle";
import { boundClass } from 'autobind-decorator';

@boundClass
export default class BurstRect extends Burst {
    private offSet: b2Vec2;
    private targetBody: b2Body;
    private m_physScale: number;
    private startVel: b2Vec2;
    private startPos: b2Vec2;
    private leftX: number;
    private topY: number;
    private rangeX: number;
    private rangeY: number;

    constructor(
        param1: any[],
        param2: number,
        param3: b2Body,
        param4: number = 100,
    ) {
        super(param1, 0, 0, 0, param2, param4);
        var _loc13_: number = NaN;
        var _loc14_: number = NaN;
        this.targetBody = param3;
        this.m_physScale = Settings.currentSession.m_physScale;
        var _loc5_: b2PolygonShape = param3.GetShapeList() as b2PolygonShape;
        var _loc6_: any[] = _loc5_.GetVertices();
        var _loc7_: number = 10000;
        var _loc8_: number = 10000;
        var _loc9_: number = -10000;
        var _loc10_: number = -10000;
        var _loc11_: number = _loc5_.GetVertexCount();
        var _loc12_: number = 0;
        while (_loc12_ < _loc11_) {
            _loc13_ = Number(_loc6_[_loc12_].x);
            if (_loc13_ < _loc7_) {
                _loc7_ = _loc13_;
            }
            if (_loc13_ > _loc9_) {
                _loc9_ = _loc13_;
            }
            _loc14_ = Number(_loc6_[_loc12_].y);
            if (_loc14_ < _loc8_) {
                _loc8_ = _loc14_;
            }
            if (_loc14_ > _loc10_) {
                _loc10_ = _loc14_;
            }
            _loc12_++;
        }
        this.leftX = _loc7_;
        this.topY = _loc8_;
        this.rangeX = _loc9_ - _loc7_;
        this.rangeY = _loc10_ - _loc8_;
    }

    protected override createParticle() {
        var _loc5_: b2Vec2 = null;
        this.offSet = new b2Vec2(
            this.leftX + Math.random() * this.rangeX,
            this.topY + Math.random() * this.rangeY,
        );
        this.startVel = this.targetBody.GetLinearVelocityFromLocalPoint(
            this.offSet,
        );
        var _loc1_: number =
            this.startVel.x +
            (Math.random() * this.speedRange - this.halfSpeedRange);
        var _loc2_: number =
            this.startVel.y +
            (Math.random() * this.speedRange - this.halfSpeedRange);
        var _loc3_: number = Math.floor(Math.random() * this.bmdLength);
        var _loc4_ = new Particle(_loc2_, _loc1_, this.bmdArray[_loc3_]);
        this.addChildAt(_loc4_, 0);
        _loc5_ = this.targetBody.GetWorldPoint(this.offSet);
        _loc4_.x = _loc5_.x * this.m_physScale - _loc4_.width * 0.5;
        _loc4_.y = _loc5_.y * this.m_physScale - _loc4_.height * 0.5;
    }
}