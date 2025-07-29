import b2CircleDef from "@/Box2D/Collision/Shapes/b2CircleDef";
import b2PolygonDef from "@/Box2D/Collision/Shapes/b2PolygonDef";
import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import b2Body from "@/Box2D/Dynamics/b2Body";
import b2BodyDef from "@/Box2D/Dynamics/b2BodyDef";
import b2RevoluteJoint from "@/Box2D/Dynamics/Joints/b2RevoluteJoint";
import b2RevoluteJointDef from "@/Box2D/Dynamics/Joints/b2RevoluteJointDef";
import LevelItem from "@/com/totaljerkface/game/level/LevelItem";
import Settings from "@/com/totaljerkface/game/Settings";
import { boundClass } from 'autobind-decorator';
import MovieClip from "flash/display/MovieClip";

@boundClass
export default class Gear extends LevelItem {
    private id: string;
    public body: b2Body;
    public revJoint: b2RevoluteJoint;
    private mc: MovieClip;
    private motorSpeed: number;

    constructor(
        param1: string,
        param2: number = 0,
        param3: number = 5,
        param4: number = 0.9,
        param5: number = 0.12,
    ) {
        super();
        this.id = param1;
        this.motorSpeed = param2;
        this.createBodies(param3, param4, param5);
        this.createJoints();
        this.createMCs();
    }

    public createBodies(param1: number, param2: number, param3: number) {
        var _loc5_: b2PolygonDef = null;
        var _loc7_: number = NaN;
        var _loc4_ = new b2BodyDef();
        this.body = Settings.currentSession.m_world.CreateBody(_loc4_);
        _loc5_ = new b2PolygonDef();
        _loc5_.density = 1;
        _loc5_.friction = 1;
        _loc5_.restitution = 0.1;
        _loc5_.filter.categoryBits = 8;
        _loc5_.filter.groupIndex = -10;
        var _loc6_ = new b2CircleDef();
        _loc6_.density = 1;
        _loc6_.friction = 1;
        _loc6_.restitution = 0.1;
        _loc6_.filter.categoryBits = 8;
        _loc6_.filter.groupIndex = -10;
        var _loc8_ = new b2Vec2();
        var _loc9_: MovieClip =
            Settings.currentSession.level.shapeGuide[this.id];
        var _loc10_: number = (_loc9_.rotation * Math.PI) / 180;
        _loc8_.Set(_loc9_.x / this.m_physScale, _loc9_.y / this.m_physScale);
        _loc6_.localPosition.Set(_loc8_.x, _loc8_.y);
        _loc6_.radius = (_loc9_.scaleX * 5 * param2) / this.m_physScale;
        this.body.CreateShape(_loc6_);
        var _loc11_: number = 180 / param1;
        var _loc12_: number = (_loc9_.scaleX * 5) / this.m_physScale;
        var _loc13_: number = (_loc9_.scaleX * 5 * param3) / this.m_physScale;
        var _loc14_: number = 0;
        while (_loc14_ < param1) {
            _loc7_ = _loc10_ + (_loc14_ * _loc11_ * Math.PI) / 180;
            _loc5_.SetAsOrientedBox(_loc12_, _loc13_, _loc8_, _loc7_);
            this.body.CreateShape(_loc5_);
            _loc14_++;
        }
        this.body.SetMassFromShapes();
    }

    public createJoints() {
        var _loc1_ = new b2RevoluteJointDef();
        var _loc2_ = new b2Vec2();
        var _loc3_: MovieClip =
            Settings.currentSession.level.shapeGuide[this.id];
        _loc2_.Set(_loc3_.x / this.m_physScale, _loc3_.y / this.m_physScale);
        _loc1_.Initialize(
            Settings.currentSession.level.levelBody,
            this.body,
            _loc2_,
        );
        this.revJoint = Settings.currentSession.m_world.CreateJoint(
            _loc1_,
        ) as b2RevoluteJoint;
        if (this.motorSpeed != 0) {
            this.revJoint.EnableMotor(true);
            this.revJoint.m_maxMotorTorque = 10000000;
            this.revJoint.SetMotorSpeed(this.motorSpeed);
        }
    }

    public createMCs() {
        this.mc = Settings.currentSession.level.background[this.id + "mc"];
        var _loc1_: MovieClip =
            Settings.currentSession.level.shapeGuide[this.id];
        // @ts-expect-error
        this.mc.inner.rotation = _loc1_.rotation;
    }

    public override paint() {
        var _loc1_: b2Vec2 = null;
        if (this.body.IsSleeping()) {
            return;
        }
        _loc1_ = this.body.GetWorldCenter();
        this.mc.x = _loc1_.x * this.m_physScale;
        this.mc.y = _loc1_.y * this.m_physScale;
        this.mc.rotation = this.body.GetAngle() * (180 / Math.PI);
    }
}