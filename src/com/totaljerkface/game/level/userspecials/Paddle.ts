import b2PolygonDef from "@/Box2D/Collision/Shapes/b2PolygonDef";
import b2Shape from "@/Box2D/Collision/Shapes/b2Shape";
import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import b2Body from "@/Box2D/Dynamics/b2Body";
import b2BodyDef from "@/Box2D/Dynamics/b2BodyDef";
import b2RevoluteJoint from "@/Box2D/Dynamics/Joints/b2RevoluteJoint";
import b2RevoluteJointDef from "@/Box2D/Dynamics/Joints/b2RevoluteJointDef";
import PaddleRef from "@/com/totaljerkface/game/editor/specials/PaddleRef";
import Special from "@/com/totaljerkface/game/editor/specials/Special";
import ContactEvent from "@/com/totaljerkface/game/events/ContactEvent";
import LevelB2D from "@/com/totaljerkface/game/level/LevelB2D";
import LevelItem from "@/com/totaljerkface/game/level/LevelItem";
import Settings from "@/com/totaljerkface/game/Settings";
import SoundController from "@/com/totaljerkface/game/sound/SoundController";
import MetalPiecesMC from "@/top/MetalPiecesMC";
import PaddleBaseMC from "@/top/PaddleBaseMC";
import PaddleMC from "@/top/PaddleMC";
import Sprite from "flash/display/Sprite";
// import BevelFilter from "flash/filters/BevelFilter";
import { boundClass } from 'autobind-decorator';
import ColorTransform from "flash/geom/ColorTransform";
import TextField from "flash/text/TextField";

@boundClass
export default class Paddle extends LevelItem {
    private static idCounter: number;
    private id: string;
    private timerText: TextField;
    private body: b2Body;
    private glow: Sprite;
    private padShape: b2Shape;
    private joint: b2RevoluteJoint;
    private hit: boolean;
    private delayCounter: number = 0;
    private delayTotal: number = 0;
    private delayTimeString: string;
    private paddle: PaddleMC;
    private startAng: number;
    private direction: number = 1;
    private tarAng: number = 90;
    private tolerance: number = 3;
    private maxSpeed: number = 6;
    private minSpeed: number = 0.5;
    private paddleSpeed: number;
    private blockerShape: b2Shape;

    constructor(param1: Special) {
        super();
        var _loc2_: PaddleRef = null;
        var _loc4_: LevelB2D = null;

        _loc2_ = param1 as PaddleRef;
        this.tarAng = (_loc2_.paddleAngle * Math.PI) / 180;
        this.paddleSpeed =
            this.minSpeed +
            ((this.maxSpeed - this.minSpeed) * _loc2_.paddleSpeed) / 10;
        this.paddle = new PaddleMC();
        var _loc3_ = new PaddleBaseMC();
        if (_loc2_.reverse) {
            this.direction = -1;
            this.tarAng *= this.direction;
            this.tolerance *= this.direction;
            this.paddle.nub.x *= -1;
            this.paddle.timer.x *= -1;
            this.paddle.arrow.x *= -1;
            _loc3_.nub.x *= -1;
        }
        this.createBody(
            new b2Vec2(_loc2_.x, _loc2_.y),
            (_loc2_.rotation * Math.PI) / 180,
        );
        this.createJoint();
        _loc4_ = Settings.currentSession.level;
        var _loc5_: Sprite = _loc4_.background;
        _loc5_.addChild(_loc3_);
        _loc3_.x = _loc2_.x;
        _loc3_.y = _loc2_.y;
        _loc3_.rotation = _loc2_.rotation;
        // @ts-expect-error
        this.timerText = this.paddle.timer.timerText;
        this.timerText.maxChars = 3;
        // @ts-expect-error
        this.glow = this.paddle.arrow.glow;
        this.glow.visible = false;
        var _loc6_: Sprite = _loc4_.foreground;
        _loc6_.addChild(this.paddle);
        this.paddle.x = _loc2_.x;
        this.paddle.y = _loc2_.y;
        this.paddle.rotation = _loc2_.rotation;
        this.delayTotal = Math.round(_loc2_.springDelay * 30);
        this.delayCounter = this.delayTotal;
        var _loc7_: number = this.delayCounter / 30;
        this.delayTimeString = _loc7_.toFixed(2);
        this.timerText.text = this.delayTimeString;
        _loc4_.paintItemVector.push(this);
        _loc4_.actionsVector.push(this);
        Settings.currentSession.contactListener.registerListener(
            ContactEvent.RESULT,
            this.padShape,
            this.checkContact,
        );
        // var _loc8_ = new BevelFilter(
        //     5,
        //     90,
        //     16777215,
        //     1,
        //     0,
        //     1,
        //     5,
        //     5,
        //     1,
        //     3,
        //     "inner",
        // );
        Settings.currentSession.particleController.createBMDArray(
            "metalpieces",
            new MetalPiecesMC(),
            [/*_loc8_*/],
        );
    }

    public createBody(param1: b2Vec2, param2: number) {
        var _loc3_: number = 15;
        var _loc4_: number = 30;
        var _loc5_: number = 332;
        var _loc6_: number = 40;
        var _loc7_: number = 350;
        this.startAng = param2;
        var _loc8_ = new b2BodyDef();
        _loc8_.position.Set(
            param1.x / this.m_physScale,
            param1.y / this.m_physScale,
        );
        _loc8_.angle = param2;
        this.body = Settings.currentSession.m_world.CreateBody(_loc8_);
        var _loc9_ = new b2PolygonDef();
        _loc9_.density = 200;
        _loc9_.friction = 0.5;
        _loc9_.restitution = 0.1;
        _loc9_.filter.categoryBits = 8;
        _loc9_.filter.groupIndex = _loc3_;
        _loc9_.SetAsOrientedBox(
            (_loc5_ * 0.5) / this.m_physScale,
            (_loc4_ * 0.5) / this.m_physScale,
            new b2Vec2(0, -(_loc6_ - _loc4_) / 2 / this.m_physScale),
            0,
        );
        this.padShape = this.body.CreateShape(_loc9_);
        this.body.SetMassFromShapes();
        _loc9_.filter.groupIndex = 0;
        _loc9_.SetAsOrientedBox(
            (_loc7_ * 0.5) / this.m_physScale,
            (_loc6_ * 0.5) / this.m_physScale,
            this.body.GetWorldPoint(new b2Vec2(0, 0)),
            param2,
        );
        Settings.currentSession.level.levelBody.CreateShape(_loc9_);
        var _loc10_: number = _loc6_ - _loc4_;
        _loc8_ = new b2BodyDef();
        _loc8_.position = this.body.GetWorldPoint(
            new b2Vec2(0, (_loc6_ / 2 - _loc10_ / 2) / this.m_physScale),
        );
        _loc8_.angle = param2;
        _loc9_ = new b2PolygonDef();
        _loc9_.density = 0;
        _loc9_.friction = 0.5;
        _loc9_.restitution = 0.1;
        _loc9_.filter.categoryBits = 8;
        _loc9_.filter.groupIndex = _loc3_;
        _loc9_.SetAsBox(
            (_loc7_ * 0.75) / 2 / this.m_physScale,
            _loc10_ / 2 / this.m_physScale,
        );
        var _loc11_: b2Body =
            Settings.currentSession.m_world.CreateBody(_loc8_);
        this.blockerShape = _loc11_.CreateShape(_loc9_);
    }

    public createJoint() {
        var _loc1_ = new b2RevoluteJointDef();
        var _loc2_: number = 30;
        var _loc3_: number = 332;
        var _loc4_: number = 40;
        var _loc5_ = new b2Vec2(
            (this.direction * (_loc3_ / 2 - _loc2_ / 2)) / this.m_physScale,
            -(_loc4_ - _loc2_) / 2 / this.m_physScale,
        );
        _loc1_.Initialize(
            Settings.currentSession.level.levelBody,
            this.body,
            this.body.GetWorldPoint(_loc5_),
        );
        _loc1_.enableLimit = true;
        _loc1_.upperAngle = 0;
        _loc1_.lowerAngle = 0;
        _loc1_.enableMotor = false;
        _loc1_.maxMotorTorque = 1000000;
        this.joint = Settings.currentSession.m_world.CreateJoint(
            _loc1_,
        ) as b2RevoluteJoint;
    }

    public override paint() {
        if (this.body.IsSleeping()) {
            return;
        }
        var _loc1_: b2Vec2 = this.body.GetWorldCenter();
        this.paddle.x = _loc1_.x * this.m_physScale;
        this.paddle.y = _loc1_.y * this.m_physScale;
        this.paddle.rotation = (this.body.GetAngle() * 180) / Math.PI;
    }

    private checkRevJoint() {
        var _loc1_ = undefined;
        var _loc2_ = undefined;
        var _loc3_: number = NaN;
        var _loc4_: number = NaN;
        var _loc5_: number = NaN;
        if (Boolean(this.joint) && !this.joint.broken) {
            _loc1_ = this.joint.GetAnchor1();
            _loc2_ = this.joint.GetAnchor2();
            _loc3_ = _loc2_.x - _loc1_.x;
            _loc4_ = _loc2_.y - _loc1_.y;
            _loc5_ = _loc3_ * _loc3_ + _loc4_ * _loc4_;
            if (_loc5_ > 0.43) {
                this.breakJoint();
            }
        }
    }

    private breakJoint() {
        Settings.currentSession.particleController.createSparkBurstPoint(
            this.joint.GetAnchor1(),
            new b2Vec2(1, 1),
            50,
            80,
            100,
        );
        Settings.currentSession.particleController.createBurst(
            "metalpieces",
            10,
            50,
            this.body,
            25,
        );
        Settings.currentSession.m_world.DestroyJoint(this.joint);
        this.joint.broken = true;
        // @ts-expect-error
        this.paddle.arrow.glow.visible = true;
        Settings.currentSession.level.removeFromActionsVector(this);
        var _loc1_: ColorTransform = this.timerText.transform.colorTransform;
        _loc1_.color = 16711680;
        this.timerText.transform.colorTransform = _loc1_;
        this.timerText.alpha = 0.5;
        this.padShape.m_density = 10;
        this.body.SetMassFromShapes();
        // @ts-expect-error
        this.paddle.arrow.glow.visible = false;
        SoundController.instance.playAreaSoundInstance(
            "PaddleBreak",
            this.body,
        );
    }

    public override actions() {
        var _loc1_: number = NaN;
        if (this.hit) {
            if (this.delayCounter == 0) {
                this.glow.visible = true;
                this.hit = false;
                this.body.WakeUp();
                this.body.SetBullet(true);
                this.joint.SetMotorSpeed(this.direction * this.paddleSpeed);
                if (this.direction == -1) {
                    this.joint.SetLimits((-90 * Math.PI) / 180, 0);
                } else {
                    this.joint.SetLimits(0, (90 * Math.PI) / 180);
                }
                this.joint.EnableMotor(true);
                this.delayCounter = this.delayTotal;
                this.timerText.text = "0.00";
                SoundController.instance.playAreaSoundInstance(
                    "SpringBoxBounce",
                    this.body,
                );
            } else {
                _loc1_ = this.delayCounter / 30;
                this.timerText.text = _loc1_.toFixed(2);
                --this.delayCounter;
            }
        } else if (this.joint.IsMotorEnabled()) {
            this.checkRevJoint();
            if (
                (this.joint.GetMotorSpeed() > 0 && this.direction == 1) ||
                (this.joint.GetMotorSpeed() < 0 && this.direction == -1)
            ) {
                if (this.direction == 1) {
                    if (this.joint.GetJointAngle() > this.tarAng) {
                        this.joint.SetMotorSpeed(-2);
                    }
                } else if (this.joint.GetJointAngle() < this.tarAng) {
                    this.joint.SetMotorSpeed(2);
                }
            } else if (
                (this.joint.GetMotorSpeed() < 0 && this.direction == 1) ||
                (this.joint.GetMotorSpeed() > 0 && this.direction == -1)
            ) {
                if (
                    (this.joint.GetJointAngle() < 0 && this.direction == 1) ||
                    (this.joint.GetJointAngle() > 0 && this.direction == -1)
                ) {
                    this.joint.EnableMotor(false);
                    this.joint.SetLimits(0, 0);
                    this.joint.SetMotorSpeed(0);
                    this.body.SetBullet(false);
                    Settings.currentSession.contactListener.registerListener(
                        ContactEvent.RESULT,
                        this.padShape,
                        this.checkContact,
                    );
                    this.timerText.text = this.delayTimeString;
                    this.glow.visible = false;
                }
            }
        }
    }

    protected checkContact(param1: ContactEvent) {
        if (param1.otherShape == this.blockerShape) {
            return;
        }
        Settings.currentSession.contactListener.deleteListener(
            ContactEvent.RESULT,
            this.padShape,
        );
        this.hit = true;
    }
}