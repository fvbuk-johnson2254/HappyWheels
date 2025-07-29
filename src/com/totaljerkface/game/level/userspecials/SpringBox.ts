import b2PolygonDef from "@/Box2D/Collision/Shapes/b2PolygonDef";
import b2Shape from "@/Box2D/Collision/Shapes/b2Shape";
import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import b2Body from "@/Box2D/Dynamics/b2Body";
import b2BodyDef from "@/Box2D/Dynamics/b2BodyDef";
import b2PrismaticJoint from "@/Box2D/Dynamics/Joints/b2PrismaticJoint";
import b2PrismaticJointDef from "@/Box2D/Dynamics/Joints/b2PrismaticJointDef";
import Special from "@/com/totaljerkface/game/editor/specials/Special";
import SpringBoxRef from "@/com/totaljerkface/game/editor/specials/SpringBoxRef";
import ContactEvent from "@/com/totaljerkface/game/events/ContactEvent";
import LevelB2D from "@/com/totaljerkface/game/level/LevelB2D";
import LevelItem from "@/com/totaljerkface/game/level/LevelItem";
import Settings from "@/com/totaljerkface/game/Settings";
import SoundController from "@/com/totaljerkface/game/sound/SoundController";
import SpringBoxMC from "@/top/SpringBoxMC";
import { boundClass } from 'autobind-decorator';
import Sprite from "flash/display/Sprite";
import TextField from "flash/text/TextField";

@boundClass
export default class SpringBox extends LevelItem {
    private static idCounter: number;
    private id: string;
    private mc: SpringBoxMC;
    private timerText: TextField;
    private body: b2Body;
    private glow: Sprite;
    private padShape: b2Shape;
    private joint: b2PrismaticJoint;
    private hit: boolean;
    private delayCounter: number = 0;
    private delayTotal: number = 0;
    private delayTimeString: string;

    constructor(param1: Special) {
        super();
        var _loc2_: SpringBoxRef = null;
        var _loc3_: LevelB2D = null;

        _loc2_ = param1 as SpringBoxRef;
        this.createBody(
            new b2Vec2(_loc2_.x, _loc2_.y),
            (_loc2_.rotation * Math.PI) / 180,
        );
        this.createJoint((_loc2_.rotation * Math.PI) / 180);
        _loc3_ = Settings.currentSession.level;
        this.mc = new SpringBoxMC();
        var _loc4_: Sprite = _loc3_.background;
        _loc4_.addChild(this.mc);
        this.mc.pad.y = -1 * this.body.GetLocalCenter().y * this.m_physScale;
        // @ts-expect-error
        this.timerText = this.mc.base.timerText;
        this.timerText.maxChars = 3;
        // @ts-expect-error
        this.glow = this.mc.base.glow;
        this.glow.visible = false;
        var _loc5_: Sprite = this.mc.base;
        var _loc6_: Sprite = _loc3_.foreground;
        _loc6_.addChild(_loc5_);
        _loc5_.x = _loc2_.x;
        _loc5_.y = _loc2_.y;
        _loc5_.rotation = _loc2_.rotation;
        this.delayTotal = Math.round(_loc2_.springDelay * 30);
        this.delayCounter = this.delayTotal;
        var _loc7_: number = this.delayCounter / 30;
        this.delayTimeString = _loc7_.toFixed(2);
        this.timerText.text = this.delayTimeString;
        _loc3_.paintItemVector.push(this);
        _loc3_.actionsVector.push(this);
        Settings.currentSession.contactListener.registerListener(
            ContactEvent.RESULT,
            this.padShape,
            this.checkContact,
        );
    }

    public createBody(param1: b2Vec2, param2: number) {
        var _loc3_ = new b2BodyDef();
        _loc3_.position.Set(
            param1.x / this.m_physScale,
            param1.y / this.m_physScale,
        );
        _loc3_.angle = param2;
        this.body = Settings.currentSession.m_world.CreateBody(_loc3_);
        var _loc4_ = new b2PolygonDef();
        _loc4_.density = 200;
        _loc4_.friction = 0.5;
        _loc4_.restitution = 0.1;
        _loc4_.filter.categoryBits = 8;
        _loc4_.SetAsOrientedBox(
            175 / this.m_physScale,
            11 / this.m_physScale,
            new b2Vec2(0, -9 / this.m_physScale),
            0,
        );
        this.padShape = this.body.CreateShape(_loc4_);
        _loc4_.SetAsOrientedBox(
            13 / this.m_physScale,
            9 / this.m_physScale,
            new b2Vec2(-120 / this.m_physScale, 11 / this.m_physScale),
            0,
        );
        this.body.CreateShape(_loc4_);
        _loc4_.SetAsOrientedBox(
            13 / this.m_physScale,
            9 / this.m_physScale,
            new b2Vec2(120 / this.m_physScale, 11 / this.m_physScale),
            0,
        );
        this.body.CreateShape(_loc4_);
        this.body.SetMassFromShapes();
        _loc4_.SetAsOrientedBox(
            175 / this.m_physScale,
            16 / this.m_physScale,
            this.body.GetWorldPoint(new b2Vec2(0, 4 / this.m_physScale)),
            param2,
        );
        Settings.currentSession.level.levelBody.CreateShape(_loc4_);
    }

    public createJoint(param1: number) {
        var _loc2_ = new b2PrismaticJointDef();
        _loc2_.Initialize(
            Settings.currentSession.level.levelBody,
            this.body,
            this.body.GetWorldCenter(),
            new b2Vec2(Math.sin(param1), -Math.cos(param1)),
        );
        _loc2_.enableLimit = true;
        _loc2_.upperTranslation = 0;
        _loc2_.lowerTranslation = 0;
        _loc2_.enableMotor = false;
        _loc2_.maxMotorForce = 1000000;
        this.joint = Settings.currentSession.m_world.CreateJoint(
            _loc2_,
        ) as b2PrismaticJoint;
    }

    public override paint() {
        var _loc1_: b2Vec2 = null;
        _loc1_ = this.body.GetWorldCenter();
        this.mc.x = _loc1_.x * this.m_physScale;
        this.mc.y = _loc1_.y * this.m_physScale;
        this.mc.rotation = this.body.GetAngle() * (180 / Math.PI);
    }

    public override actions() {
        var _loc1_: number = NaN;
        if (this.hit) {
            if (this.delayCounter == 0) {
                this.glow.visible = true;
                this.hit = false;
                this.body.WakeUp();
                this.joint.SetMotorSpeed(10);
                this.joint.SetLimits(0, 32 / this.m_physScale);
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
            if (this.joint.GetMotorSpeed() > 0) {
                if (this.joint.GetJointTranslation() * this.m_physScale > 32) {
                    this.joint.SetMotorSpeed(-1);
                }
            } else if (this.joint.GetMotorSpeed() < 0) {
                if (this.joint.GetJointTranslation() * this.m_physScale < 0) {
                    this.joint.EnableMotor(false);
                    this.joint.SetLimits(0, 0);
                    this.joint.SetMotorSpeed(0);
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
        Settings.currentSession.contactListener.deleteListener(
            ContactEvent.RESULT,
            this.padShape,
        );
        this.hit = true;
    }
}