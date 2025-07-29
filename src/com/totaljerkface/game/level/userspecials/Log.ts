import b2PolygonDef from "@/Box2D/Collision/Shapes/b2PolygonDef";
import b2Shape from "@/Box2D/Collision/Shapes/b2Shape";
import b2ContactPoint from "@/Box2D/Collision/b2ContactPoint";
import b2Math from "@/Box2D/Common/Math/b2Math";
import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import b2Body from "@/Box2D/Dynamics/b2Body";
import b2BodyDef from "@/Box2D/Dynamics/b2BodyDef";
import b2World from "@/Box2D/Dynamics/b2World";
import ContactListener from "@/com/totaljerkface/game/ContactListener";
import Session from "@/com/totaljerkface/game/Session";
import Settings from "@/com/totaljerkface/game/Settings";
import LogRef from "@/com/totaljerkface/game/editor/specials/LogRef";
import Special from "@/com/totaljerkface/game/editor/specials/Special";
import ContactEvent from "@/com/totaljerkface/game/events/ContactEvent";
import LevelB2D from "@/com/totaljerkface/game/level/LevelB2D";
import LevelItem from "@/com/totaljerkface/game/level/LevelItem";
import Trigger from "@/com/totaljerkface/game/level/Trigger";
import SoundController from "@/com/totaljerkface/game/sound/SoundController";
import LogHalf1 from "@/top/LogHalf1";
import LogHalf2 from "@/top/LogHalf2";
import LogMC from "@/top/LogMC";
import WoodChipsMC from "@/top/WoodChipsMC";
import { boundClass } from 'autobind-decorator';
import MovieClip from "flash/display/MovieClip";
import Sprite from "flash/display/Sprite";

@boundClass
export default class Log extends LevelItem {
    private mc: MovieClip;
    private body: b2Body;
    private shapeWidth: number;
    private shapeHeight: number;
    private center: b2Vec2;
    private angle: number;
    private shape: b2Shape;

    constructor(param1: Special) {
        super();
        var _loc2_: LogRef = param1 as LogRef;
        this.createBody(
            new b2Vec2(_loc2_.x, _loc2_.y),
            (_loc2_.rotation * Math.PI) / 180,
            _loc2_.shapeWidth,
            _loc2_.shapeHeight,
            _loc2_.immovable2,
            _loc2_.sleeping,
        );
        this.shapeWidth = _loc2_.shapeWidth;
        this.shapeHeight = _loc2_.shapeHeight;
        this.mc = new LogMC();
        this.mc.width = this.shapeWidth;
        this.mc.height = this.shapeHeight;
        this.mc.x = _loc2_.x;
        this.mc.y = _loc2_.y;
        this.mc.rotation = _loc2_.rotation;
        var _loc3_: Sprite = Settings.currentSession.level.background;
        _loc3_.addChild(this.mc);
        Settings.currentSession.particleController.createBMDArray(
            "woodchips",
            new WoodChipsMC(),
        );
    }

    public createBody(
        param1: b2Vec2,
        param2: number,
        param3: number,
        param4: number,
        param5: boolean,
        param6: boolean,
    ) {
        var _loc7_ = new b2BodyDef();
        var _loc8_ = new b2PolygonDef();
        _loc8_.density = 30;
        _loc8_.friction = 0.7;
        _loc8_.restitution = 0.2;
        _loc8_.filter.categoryBits = 8;
        var _loc9_: LevelB2D = Settings.currentSession.level;
        if (!param5) {
            _loc8_.SetAsBox(
                (param3 * 0.5) / this.m_physScale,
                (param4 * 0.5) / this.m_physScale,
            );
            _loc7_.position.Set(
                param1.x / this.m_physScale,
                param1.y / this.m_physScale,
            );
            _loc7_.angle = param2;
            _loc7_.isSleeping = param6;
            this.body = Settings.currentSession.m_world.CreateBody(_loc7_);
            this.shape = this.body.CreateShape(_loc8_);
            this.body.SetMassFromShapes();
            _loc9_.paintItemVector.push(this);
            Settings.currentSession.contactListener.registerListener(
                ContactListener.ADD,
                this.shape,
                this.checkAdd,
            );
        } else {
            this.center = new b2Vec2(
                param1.x / this.m_physScale,
                param1.y / this.m_physScale,
            );
            this.angle = param2;
            _loc8_.SetAsOrientedBox(
                (param3 * 0.5) / this.m_physScale,
                (param4 * 0.5) / this.m_physScale,
                this.center,
                param2,
            );
            this.shape = _loc9_.levelBody.CreateShape(_loc8_);
            _loc9_.keepVector.push(this);
        }
        Settings.currentSession.contactListener.registerListener(
            ContactListener.RESULT,
            this.shape,
            this.checkContact,
        );
    }

    public override paint() {
        var _loc1_: b2Vec2 = this.body.GetWorldCenter();
        this.mc.x = _loc1_.x * this.m_physScale;
        this.mc.y = _loc1_.y * this.m_physScale;
        this.mc.rotation =
            (this.body.GetAngle() * LevelItem.oneEightyOverPI) % 360;
    }

    public override actions() {
        var _loc2_: LevelB2D = null;
        var _loc11_: b2Vec2 = null;
        var _loc12_: b2Vec2 = null;
        var _loc13_: number = NaN;
        var _loc14_: number = NaN;
        var _loc1_: Session = Settings.currentSession;
        _loc2_ = _loc1_.level;
        var _loc3_: b2World = _loc1_.m_world;
        _loc2_.removeFromActionsVector(this);
        Settings.currentSession.contactListener.removeEventListener(
            ContactEvent.RESULT,
            this.checkContact,
        );
        if (this.body) {
            _loc2_.removeFromPaintItemVector(this);
            _loc11_ = this.body.GetWorldCenter();
            _loc12_ = this.body.GetLinearVelocity();
            _loc13_ = this.body.GetAngularVelocity();
            _loc3_.DestroyBody(this.body);
            _loc14_ = this.body.GetAngle();
            _loc1_.particleController.createBurst(
                "woodchips",
                10,
                30,
                this.body,
                30,
            );
        } else {
            _loc11_ = this.center;
            _loc12_ = new b2Vec2(0, 0);
            _loc13_ = 0;
            _loc14_ = this.angle;
            _loc2_.levelBody.DestroyShape(this.shape);
            _loc1_.particleController.createPointBurst(
                "woodchips",
                this.center.x * this.m_physScale,
                this.center.y * this.m_physScale,
                10,
                30,
                30,
            );
        }
        var _loc4_ = new b2BodyDef();
        _loc4_.angle = _loc14_;
        _loc4_.position = _loc11_;
        var _loc5_ = new b2PolygonDef();
        _loc5_.density = 30;
        _loc5_.friction = 0.7;
        _loc5_.restitution = 0.2;
        _loc5_.filter.categoryBits = 8;
        _loc5_.SetAsOrientedBox(
            (this.shapeWidth * 0.5) / this.m_physScale,
            (this.shapeHeight * 0.25) / this.m_physScale,
            new b2Vec2(0, (-this.shapeHeight * 0.25) / this.m_physScale),
            0,
        );
        var _loc6_: b2Body = _loc3_.CreateBody(_loc4_);
        _loc6_.CreateShape(_loc5_);
        _loc6_.SetMassFromShapes();
        _loc5_.SetAsOrientedBox(
            (this.shapeWidth * 0.5) / this.m_physScale,
            (this.shapeHeight * 0.25) / this.m_physScale,
            new b2Vec2(0, (this.shapeHeight * 0.25) / this.m_physScale),
            0,
        );
        var _loc7_: b2Body = _loc3_.CreateBody(_loc4_);
        _loc7_.CreateShape(_loc5_);
        _loc7_.SetMassFromShapes();
        _loc6_.SetLinearVelocity(_loc12_);
        _loc6_.SetAngularVelocity(_loc13_);
        _loc7_.SetLinearVelocity(_loc12_);
        _loc7_.SetAngularVelocity(_loc13_);
        var _loc8_: Sprite = new LogHalf1();
        var _loc9_: Sprite = new LogHalf2();
        _loc8_.scaleX = _loc9_.scaleX = this.mc.scaleX;
        _loc8_.scaleY = _loc9_.scaleY = this.mc.scaleY;
        var _loc10_: number = _loc2_.background.getChildIndex(this.mc);
        this.mc.parent.removeChild(this.mc);
        _loc2_.background.addChildAt(_loc9_, _loc10_);
        _loc2_.background.addChildAt(_loc8_, _loc10_);
        _loc6_.SetUserData(_loc8_);
        _loc7_.SetUserData(_loc9_);
        _loc2_.paintBodyVector.push(_loc6_);
        _loc2_.paintBodyVector.push(_loc7_);
        SoundController.instance.playAreaSoundInstance("LumberBreak", _loc6_);
        this.body = null;
    }

    public checkContact(param1: ContactEvent) {
        if (param1.impulse > 2250) {
            trace("imp " + param1.impulse);
            Settings.currentSession.contactListener.deleteListener(
                ContactEvent.RESULT,
                this.shape,
            );
            Settings.currentSession.contactListener.deleteListener(
                ContactListener.ADD,
                this.shape,
            );
            Settings.currentSession.level.actionsVector.push(this);
        }
    }

    private checkAdd(param1: b2ContactPoint) {
        var _loc4_: number = NaN;
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
            _loc4_ = Math.ceil(Math.random() * 2);
            SoundController.instance.playAreaSoundInstance(
                "LumberHit" + _loc4_,
                this.body,
            );
        }
    }

    public override getJointBody(param1: b2Vec2 = null): b2Body {
        return this.body;
    }

    public override triggerSingleActivation(
        param1: Trigger,
        param2: string,
        param3: any[],
    ) {
        var _loc4_: number = NaN;
        var _loc5_: number = NaN;
        var _loc6_: number = NaN;
        var _loc7_: number = NaN;
        var _loc8_: number = NaN;
        if (param2 == "wake from sleep") {
            if (this.body) {
                this.body.WakeUp();
            }
        } else if (param2 == "apply impulse") {
            if (this.body) {
                _loc4_ = Number(param3[0]);
                _loc5_ = Number(param3[1]);
                _loc6_ = this.body.GetMass();
                this.body.ApplyImpulse(
                    new b2Vec2(_loc4_ * _loc6_, _loc5_ * _loc6_),
                    this.body.GetWorldCenter(),
                );
                _loc7_ = Number(param3[2]);
                _loc8_ = this.body.GetAngularVelocity();
                this.body.SetAngularVelocity(_loc8_ + _loc7_);
            }
        }
    }

    public override get bodyList(): any[] {
        if (this.body) {
            return [this.body];
        }
        return [];
    }
}