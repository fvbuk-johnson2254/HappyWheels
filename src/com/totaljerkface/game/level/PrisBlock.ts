import b2PolygonDef from "@/Box2D/Collision/Shapes/b2PolygonDef";
import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import b2Body from "@/Box2D/Dynamics/b2Body";
import b2BodyDef from "@/Box2D/Dynamics/b2BodyDef";
import b2PrismaticJoint from "@/Box2D/Dynamics/Joints/b2PrismaticJoint";
import b2PrismaticJointDef from "@/Box2D/Dynamics/Joints/b2PrismaticJointDef";
import LevelItem from "@/com/totaljerkface/game/level/LevelItem";
import Settings from "@/com/totaljerkface/game/Settings";
import { boundClass } from 'autobind-decorator';
import MovieClip from "flash/display/MovieClip";

@boundClass
export default class PrisBlock extends LevelItem {
    private mc: MovieClip;
    private body: b2Body;
    private id: string;
    private counter: number;
    private speed: number;
    private waitTime: number;
    private prisJoint: b2PrismaticJoint;
    private distance: number;
    private raising: boolean;
    private waiting: boolean;

    constructor(
        param1: string,
        param2: number = 3,
        param3: number = 5,
        param4: number = 60,
        param5: number = 0,
    ) {
        super();
        var _loc6_: b2Vec2 = null;

        this.id = param1;
        this.speed = param2;
        this.distance = param3;
        this.waitTime = param4;
        this.createBody();
        this.createJoints();
        this.mc = Settings.currentSession.level.background[param1 + "mc"];
        _loc6_ = this.body.GetWorldCenter();
        this.mc.x = _loc6_.x * this.m_physScale;
        this.mc.y = _loc6_.y * this.m_physScale;
        this.mc.rotation = this.body.GetAngle() * (180 / Math.PI);
        this.counter = 0;
        this.raising = true;
        if (param5 > 0) {
            this.waiting = true;
            this.counter = param4 - param5;
        }
    }

    public createBody() {
        var _loc1_ = new b2BodyDef();
        _loc1_.allowSleep = false;
        this.body = Settings.currentSession.m_world.CreateBody(_loc1_);
        var _loc2_ = new b2PolygonDef();
        _loc2_.density = 50;
        _loc2_.friction = 1;
        _loc2_.restitution = 0.1;
        _loc2_.filter.categoryBits = 8;
        _loc2_.filter.groupIndex = -10;
        var _loc3_: MovieClip =
            Settings.currentSession.level.shapeGuide[this.id];
        var _loc4_: number = (_loc3_.rotation * Math.PI) / 180;
        var _loc5_ = new b2Vec2();
        _loc5_.Set(_loc3_.x / this.m_physScale, _loc3_.y / this.m_physScale);
        _loc2_.SetAsOrientedBox(
            (_loc3_.scaleX * 5) / this.m_physScale,
            (_loc3_.scaleY * 5) / this.m_physScale,
            _loc5_,
            _loc4_,
        );
        this.body.CreateShape(_loc2_);
        this.body.SetMassFromShapes();
    }

    public createJoints() {
        var _loc1_ = new b2PrismaticJointDef();
        _loc1_.Initialize(
            Settings.currentSession.level.levelBody,
            this.body,
            this.body.GetWorldCenter(),
            new b2Vec2(0, 1),
        );
        _loc1_.lowerTranslation = -this.distance;
        _loc1_.upperTranslation = 0;
        _loc1_.enableLimit = true;
        _loc1_.maxMotorForce = 100000;
        this.prisJoint = Settings.currentSession.m_world.CreateJoint(
            _loc1_,
        ) as b2PrismaticJoint;
    }

    public override paint() {
        var _loc1_: b2Vec2 = this.body.GetWorldCenter();
        this.mc.x = _loc1_.x * this.m_physScale;
        this.mc.y = _loc1_.y * this.m_physScale;
        this.mc.rotation = this.body.GetAngle() * (180 / Math.PI);
    }

    public override actions() {
        var _loc1_: number = this.prisJoint.GetJointTranslation();
        if (this.waiting) {
            if (this.counter != this.waitTime) {
                this.counter += 1;
                return;
            }
            this.prisJoint.EnableMotor(false);
            this.counter = 0;
            this.waiting = false;
        }
        if (this.raising) {
            if (_loc1_ < this.prisJoint.m_lowerTranslation) {
                this.raising = false;
                this.waiting = true;
                this.prisJoint.SetMotorSpeed(0);
                this.prisJoint.EnableMotor(true);
            } else {
                this.body.SetLinearVelocity(new b2Vec2(0, -this.speed));
            }
        } else if (_loc1_ > this.prisJoint.m_upperTranslation) {
            this.raising = true;
            this.waiting = true;
            this.prisJoint.SetMotorSpeed(0);
            this.prisJoint.EnableMotor(true);
        } else {
            this.body.SetLinearVelocity(new b2Vec2(0, this.speed));
        }
    }
}