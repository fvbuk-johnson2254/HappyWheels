import b2ContactPoint from "@/Box2D/Collision/b2ContactPoint";
import b2CircleDef from "@/Box2D/Collision/Shapes/b2CircleDef";
import b2PolygonDef from "@/Box2D/Collision/Shapes/b2PolygonDef";
import b2Shape from "@/Box2D/Collision/Shapes/b2Shape";
import b2Math from "@/Box2D/Common/Math/b2Math";
import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import b2Body from "@/Box2D/Dynamics/b2Body";
import b2BodyDef from "@/Box2D/Dynamics/b2BodyDef";
import b2RevoluteJoint from "@/Box2D/Dynamics/Joints/b2RevoluteJoint";
import b2RevoluteJointDef from "@/Box2D/Dynamics/Joints/b2RevoluteJointDef";
import ContactListener from "@/com/totaljerkface/game/ContactListener";
import Special from "@/com/totaljerkface/game/editor/specials/Special";
import WreckingBallRef from "@/com/totaljerkface/game/editor/specials/WreckingBallRef";
import LevelB2D from "@/com/totaljerkface/game/level/LevelB2D";
import LevelItem from "@/com/totaljerkface/game/level/LevelItem";
import Trigger from "@/com/totaljerkface/game/level/Trigger";
import Session from "@/com/totaljerkface/game/Session";
import Settings from "@/com/totaljerkface/game/Settings";
import SoundController from "@/com/totaljerkface/game/sound/SoundController";
import WreckingBallMC from "@/top/WreckingBallMC";
import { boundClass } from 'autobind-decorator';
import Sprite from "flash/display/Sprite";

@boundClass
export default class WreckingBall extends LevelItem {
    private mc: WreckingBallMC;
    private ballMC: Sprite;
    private ropeMC: Sprite;
    private body: b2Body;
    private ballShape: b2Shape;
    private stemShape: b2Shape;
    private joint: b2RevoluteJoint;
    private speed: number = 1.75;

    constructor(param1: Special) {
        super();
        var _loc3_: LevelB2D = null;
        var _loc4_: Sprite = null;

        var _loc2_: WreckingBallRef = param1 as WreckingBallRef;
        this.createBody(new b2Vec2(_loc2_.x, _loc2_.y), _loc2_.ropeLength);
        this.createJoint(new b2Vec2(_loc2_.x, _loc2_.y));
        this.mc = new WreckingBallMC();
        _loc3_ = Settings.currentSession.level;
        _loc4_ = _loc3_.background;
        _loc4_.addChild(this.mc);
        this.mc.x = _loc2_.x;
        this.mc.y = _loc2_.y;
        // @ts-expect-error
        this.mc.rope.base.y = _loc2_.ropeLength - 136.5;
        // @ts-expect-error
        this.mc.rope.stem.height = _loc2_.ropeLength - 120;
        this.ropeMC = this.mc.rope;
        this.ballMC = this.mc.ball;
        _loc4_.addChild(this.ballMC);
        _loc3_.paintItemVector.push(this);
        _loc3_.actionsVector.push(this);
        this.speed = (this.speed * 1000) / _loc2_.ropeLength;
    }

    public createBody(param1: b2Vec2, param2: number) {
        var _loc3_ = new b2BodyDef();
        _loc3_.position.Set(
            (param1.x + param2) / this.m_physScale,
            param1.y / this.m_physScale,
        );
        _loc3_.angle = (-90 * Math.PI) / 180;
        this.body = Settings.currentSession.m_world.CreateBody(_loc3_);
        var _loc4_ = new b2PolygonDef();
        _loc4_.density = 500;
        _loc4_.friction = 0.1;
        _loc4_.restitution = 0.1;
        _loc4_.filter.categoryBits = 8;
        var _loc5_ = new b2CircleDef();
        _loc5_.density = 500;
        _loc5_.friction = 0.1;
        _loc5_.restitution = 0.1;
        _loc5_.filter.categoryBits = 8;
        _loc4_.SetAsOrientedBox(
            18 / this.m_physScale,
            7.5 / this.m_physScale,
            new b2Vec2(0, -80 / this.m_physScale),
            0,
        );
        this.stemShape = this.body.CreateShape(_loc4_);
        _loc5_.radius = 75 / this.m_physScale;
        this.ballShape = this.body.CreateShape(_loc5_);
        this.body.SetMassFromShapes();
        Settings.currentSession.contactListener.registerListener(
            ContactListener.ADD,
            this.ballShape,
            this.checkAdd,
        );
        _loc4_.SetAsOrientedBox(
            18 / this.m_physScale,
            16 / this.m_physScale,
            new b2Vec2(
                param1.x / this.m_physScale,
                (param1.y - 16) / this.m_physScale,
            ),
            0,
        );
        Settings.currentSession.level.levelBody.CreateShape(_loc4_);
    }

    public createJoint(param1: b2Vec2) {
        var _loc2_ = new b2RevoluteJointDef();
        _loc2_.Initialize(
            Settings.currentSession.level.levelBody,
            this.body,
            new b2Vec2(
                param1.x / this.m_physScale,
                param1.y / this.m_physScale,
            ),
        );
        _loc2_.enableLimit = true;
        _loc2_.upperAngle = Math.PI + 0.25 * Math.PI;
        _loc2_.lowerAngle = -0.25 * Math.PI;
        _loc2_.enableMotor = false;
        _loc2_.maxMotorTorque = 10000000;
        this.joint = Settings.currentSession.m_world.CreateJoint(
            _loc2_,
        ) as b2RevoluteJoint;
    }

    public override paint() {
        var _loc1_: b2Vec2 = null;
        _loc1_ = this.body.GetWorldCenter();
        this.ballMC.x = _loc1_.x * this.m_physScale;
        this.ballMC.y = _loc1_.y * this.m_physScale;
        this.ballMC.rotation = this.body.GetAngle() * LevelItem.oneEightyOverPI;
        this.ropeMC.rotation = this.ballMC.rotation;
    }

    public override actions() {
        if (this.joint.GetJointAngle() < 0.3) {
            if (this.joint.IsMotorEnabled()) {
                this.joint.EnableMotor(false);
                if (this.speed < 0) {
                    this.speed *= -1;
                }
                this.joint.SetMotorSpeed(this.speed);
            }
        } else if (this.joint.GetJointAngle() > 2.84) {
            if (this.joint.IsMotorEnabled()) {
                this.joint.EnableMotor(false);
                if (this.speed > 0) {
                    this.speed *= -1;
                }
                this.joint.SetMotorSpeed(this.speed);
            }
        } else if (!this.joint.IsMotorEnabled()) {
            this.joint.EnableMotor(true);
            this.joint.SetMotorSpeed(this.speed);
            SoundController.instance.playAreaSoundInstance(
                "BallSwing",
                this.body,
            );
        }
    }

    private checkAdd(param1: b2ContactPoint) {
        if (param1.shape2.m_isSensor) {
            return;
        }
        var _loc2_: number = param1.shape2.m_body.m_mass;
        if (_loc2_ != 0 && _loc2_ < this.body.m_mass) {
            return;
        }
        var _loc3_: number = b2Math.b2Dot(param1.velocity, param1.normal);
        _loc3_ = Math.abs(_loc3_);
        if (_loc3_ > 4) {
            SoundController.instance.playAreaSoundInstance(
                "BallHit",
                this.body,
            );
        }
    }

    public override prepareForTrigger() {
        var _loc1_: Session = Settings.currentSession;
        var _loc2_: Vector<LevelItem> = _loc1_.level.actionsVector;
        var _loc3_ = int(_loc2_.indexOf(this));
        _loc2_.splice(_loc3_, 1);
        this.joint.m_upperAngle = 0;
        this.joint.m_lowerAngle = 0;
        this.body.PutToSleep();
        this.ballShape.m_isSensor = true;
        this.stemShape.m_isSensor = true;
        Settings.currentSession.m_world.Refilter(this.ballShape);
        Settings.currentSession.m_world.Refilter(this.stemShape);
    }

    public override triggerSingleActivation(
        param1: Trigger,
        param2: string,
        param3: any[],
    ) {
        if (this._triggered) {
            return;
        }
        this._triggered = true;
        this.body.WakeUp();
        this.joint.m_upperAngle = Math.PI + 0.25 * Math.PI;
        this.joint.m_lowerAngle = -0.25 * Math.PI;
        this.ballShape.m_isSensor = false;
        this.stemShape.m_isSensor = false;
        var _loc4_: Session = Settings.currentSession;
        _loc4_.m_world.Refilter(this.ballShape);
        _loc4_.m_world.Refilter(this.stemShape);
        _loc4_.level.actionsVector.push(this);
    }
}