import b2ContactPoint from "@/Box2D/Collision/b2ContactPoint";
import b2PolygonDef from "@/Box2D/Collision/Shapes/b2PolygonDef";
import b2Shape from "@/Box2D/Collision/Shapes/b2Shape";
import b2Math from "@/Box2D/Common/Math/b2Math";
import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import b2Body from "@/Box2D/Dynamics/b2Body";
import b2BodyDef from "@/Box2D/Dynamics/b2BodyDef";
import b2World from "@/Box2D/Dynamics/b2World";
import b2RevoluteJoint from "@/Box2D/Dynamics/Joints/b2RevoluteJoint";
import b2RevoluteJointDef from "@/Box2D/Dynamics/Joints/b2RevoluteJointDef";
import ContactListener from "@/com/totaljerkface/game/ContactListener";
import Special from "@/com/totaljerkface/game/editor/specials/Special";
import VanRef from "@/com/totaljerkface/game/editor/specials/VanRef";
import ContactEvent from "@/com/totaljerkface/game/events/ContactEvent";
import LevelItem from "@/com/totaljerkface/game/level/LevelItem";
import Trigger from "@/com/totaljerkface/game/level/Trigger";
import Settings from "@/com/totaljerkface/game/Settings";
import SoundController from "@/com/totaljerkface/game/sound/SoundController";
import VanBodyMC from "@/top/VanBodyMC";
import VanTireMC from "@/top/VanTireMC";
import { boundClass } from 'autobind-decorator';
import DisplayObject from "flash/display/DisplayObject";
import MovieClip from "flash/display/MovieClip";
import Sprite from "flash/display/Sprite";
import Point from "flash/geom/Point";

@boundClass
export default class Van extends LevelItem {
    private vanMC: MovieClip;
    private lTireMC: Sprite;
    private rTireMC: Sprite;
    private vanBody: b2Body;
    private lTireBody: b2Body;
    private rTireBody: b2Body;
    private vanShape: b2Shape;
    private lTireShape: b2Shape;
    private rTireShape: b2Shape;
    private leftJoint: b2RevoluteJoint;
    private rightJoint: b2RevoluteJoint;
    private hit: boolean;

    constructor(param1: Special, param2: b2Body = null, param3: Point = null) {
        super();
        var _loc5_: ContactListener = null;

        var _loc4_: VanRef = param1 as VanRef;
        this.createMovieClips(_loc4_);
        trace("VANREF " + _loc4_.interactive);
        if (_loc4_.interactive) {
            this.createBody(
                new b2Vec2(_loc4_.x, _loc4_.y),
                (_loc4_.rotation * Math.PI) / 180,
                _loc4_.sleeping,
            );
            this.createJoints();
            _loc5_ = Settings.currentSession.contactListener;
            _loc5_.registerListener(
                ContactListener.RESULT,
                this.vanShape,
                this.checkContact,
            );
            _loc5_.registerListener(
                ContactListener.ADD,
                this.vanShape,
                this.vanAddContact,
            );
            _loc5_.registerListener(
                ContactListener.ADD,
                this.lTireShape,
                this.tireAddContact,
            );
            _loc5_.registerListener(
                ContactListener.ADD,
                this.rTireShape,
                this.tireAddContact,
            );
        }
    }

    private createBody(
        param1: b2Vec2,
        param2: number,
        param3: boolean = false,
    ) {
        var _loc4_: b2BodyDef = null;
        trace("rot2 " + param2);
        _loc4_ = new b2BodyDef();
        _loc4_.position.Set(
            param1.x / this.m_physScale,
            param1.y / this.m_physScale,
        );
        _loc4_.angle = param2;
        _loc4_.isSleeping = param3;
        var _loc5_: b2World = Settings.currentSession.m_world;
        this.vanBody = _loc5_.CreateBody(_loc4_);
        var _loc6_ = new b2PolygonDef();
        _loc6_.density = 10;
        _loc6_.friction = 0.3;
        _loc6_.restitution = 0.1;
        _loc6_.filter.categoryBits = 8;
        _loc6_.SetAsBox(66 / this.m_physScale, 58 / this.m_physScale);
        this.vanShape = this.vanBody.CreateShape(_loc6_);
        this.vanBody.SetMassFromShapes();
        _loc4_.position = this.vanBody.GetWorldPoint(
            new b2Vec2(-58 / this.m_physScale, 48 / this.m_physScale),
        );
        this.lTireBody = _loc5_.CreateBody(_loc4_);
        _loc6_.friction = 1;
        _loc6_.restitution = 0.3;
        _loc6_.SetAsBox(10 / this.m_physScale, 22.5 / this.m_physScale);
        this.lTireShape = this.lTireBody.CreateShape(_loc6_);
        this.lTireBody.SetMassFromShapes();
        _loc4_.position = this.vanBody.GetWorldPoint(
            new b2Vec2(58 / this.m_physScale, 48 / this.m_physScale),
        );
        this.rTireBody = _loc5_.CreateBody(_loc4_);
        this.rTireShape = this.rTireBody.CreateShape(_loc6_);
        this.rTireBody.SetMassFromShapes();
        Settings.currentSession.level.paintItemVector.push(this);
    }

    private createJoints() {
        var _loc1_ = new b2RevoluteJointDef();
        var _loc2_ = new b2Vec2();
        _loc1_.enableLimit = true;
        _loc1_.upperAngle = 0;
        _loc1_.lowerAngle = 0;
        _loc2_ = this.lTireBody.GetWorldCenter();
        _loc1_.Initialize(this.vanBody, this.lTireBody, _loc2_);
        var _loc3_: b2World = Settings.currentSession.m_world;
        this.leftJoint = _loc3_.CreateJoint(_loc1_) as b2RevoluteJoint;
        _loc2_ = this.rTireBody.GetWorldCenter();
        _loc1_.Initialize(this.vanBody, this.rTireBody, _loc2_);
        this.rightJoint = _loc3_.CreateJoint(_loc1_) as b2RevoluteJoint;
    }

    private createMovieClips(param1: VanRef) {
        this.vanMC = new VanBodyMC();
        this.vanMC.x = param1.x;
        this.vanMC.y = param1.y;
        this.vanMC.rotation = param1.rotation;
        this.lTireMC = new VanTireMC();
        this.rTireMC = new VanTireMC();
        var _loc2_: Sprite = Settings.currentSession.level.background;
        _loc2_.addChild(this.lTireMC);
        _loc2_.addChild(this.rTireMC);
        _loc2_.addChild(this.vanMC);
        if (!param1.interactive) {
            this.vanMC.addChildAt(this.lTireMC, 0);
            this.vanMC.addChildAt(this.rTireMC, 0);
            this.lTireMC.x = -58;
            this.rTireMC.x = 58;
            this.lTireMC.y = this.rTireMC.y = 48;
        }
    }

    public override paint() {
        var _loc1_: b2Vec2 = this.vanBody.GetWorldCenter();
        this.vanMC.x = _loc1_.x * this.m_physScale;
        this.vanMC.y = _loc1_.y * this.m_physScale;
        this.vanMC.rotation =
            (this.vanBody.GetAngle() * LevelItem.oneEightyOverPI) % 360;
        _loc1_ = this.lTireBody.GetWorldCenter();
        this.lTireMC.x = _loc1_.x * this.m_physScale;
        this.lTireMC.y = _loc1_.y * this.m_physScale;
        this.lTireMC.rotation =
            (this.lTireBody.GetAngle() * LevelItem.oneEightyOverPI) % 360;
        _loc1_ = this.rTireBody.GetWorldCenter();
        this.rTireMC.x = _loc1_.x * this.m_physScale;
        this.rTireMC.y = _loc1_.y * this.m_physScale;
        this.rTireMC.rotation =
            (this.rTireBody.GetAngle() * LevelItem.oneEightyOverPI) % 360;
    }

    private checkContact(param1: ContactEvent) {
        if (param1.impulse > 150) {
            trace("van impulse " + param1.impulse);
            Settings.currentSession.contactListener.deleteListener(
                ContactEvent.RESULT,
                this.vanShape,
            );
            Settings.currentSession.contactListener.deleteListener(
                ContactEvent.ADD,
                this.vanShape,
            );
            Settings.currentSession.level.actionsVector.push(this);
        }
    }

    public override actions() {
        Settings.currentSession.level.removeFromActionsVector(this);
        this.vanBody.DestroyShape(this.vanBody.m_shapeList);
        var _loc1_ = new b2PolygonDef();
        _loc1_.density = 10;
        _loc1_.friction = 0.3;
        _loc1_.restitution = 0.1;
        _loc1_.filter.categoryBits = 8;
        _loc1_.SetAsBox(66 / this.m_physScale, 52.5 / this.m_physScale);
        this.vanBody.CreateShape(_loc1_);
        this.vanBody.SetMassFromShapes();
        this.vanMC.gotoAndStop(3);
        var _loc2_: b2World = Settings.currentSession.m_world;
        _loc2_.DestroyJoint(this.leftJoint);
        _loc2_.DestroyJoint(this.rightJoint);
        Settings.currentSession.particleController.createBurst(
            "vanglass",
            50,
            30,
            this.vanBody,
            20,
            -1,
        );
        SoundController.instance.playAreaSoundInstance(
            "VanSmash",
            this.vanBody,
        );
    }

    private vanAddContact(param1: b2ContactPoint) {
        if (param1.shape2.m_isSensor) {
            return;
        }
        var _loc2_: number = param1.shape2.m_body.m_mass;
        if (_loc2_ != 0 && _loc2_ < this.vanBody.m_mass) {
            return;
        }
        var _loc3_: number = b2Math.b2Dot(param1.velocity, param1.normal);
        _loc3_ = Math.abs(_loc3_);
        if (_loc3_ > 4) {
            SoundController.instance.playAreaSoundInstance(
                "VanHit",
                this.vanBody,
            );
        }
    }

    private tireAddContact(param1: b2ContactPoint) {
        if (param1.shape2.m_isSensor) {
            return;
        }
        var _loc2_: number = param1.shape2.m_body.m_mass;
        var _loc3_: b2Body = param1.shape1.m_body;
        if (_loc2_ != 0 && _loc2_ < _loc3_.m_mass) {
            return;
        }
        var _loc4_: number = b2Math.b2Dot(param1.velocity, param1.normal);
        _loc4_ = Math.abs(_loc4_);
        if (_loc4_ > 4) {
            SoundController.instance.playAreaSoundInstance("CarTire1", _loc3_);
        }
    }

    public override getJointBody(param1: b2Vec2 = null): b2Body {
        var _loc3_: b2Body = null;
        var _loc6_: b2Body = null;
        var _loc7_: b2Vec2 = null;
        var _loc8_: b2Vec2 = null;
        var _loc9_ = undefined;
        var _loc2_: number = 10000000;
        var _loc4_: any[] = [this.vanBody, this.lTireBody, this.rTireBody];
        var _loc5_: number = 0;
        while (_loc5_ < _loc4_.length) {
            _loc6_ = _loc4_[_loc5_];
            _loc7_ = _loc6_.GetWorldCenter();
            _loc8_ = new b2Vec2(param1.x - _loc7_.x, param1.y - _loc7_.y);
            _loc9_ = _loc8_.x * _loc8_.x + _loc8_.y * _loc8_.y;
            if (_loc9_ < _loc2_) {
                _loc2_ = _loc9_;
                _loc3_ = _loc6_;
            }
            _loc5_++;
        }
        return _loc3_;
    }

    public override get groupDisplayObject(): DisplayObject {
        return this.vanMC;
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
            if (this.vanBody) {
                this.vanBody.WakeUp();
            }
        } else if (param2 == "apply impulse") {
            if (this.vanBody) {
                _loc4_ = Number(param3[0]);
                _loc5_ = Number(param3[1]);
                _loc6_ = this.vanBody.GetMass();
                this.vanBody.ApplyImpulse(
                    new b2Vec2(_loc4_ * _loc6_, _loc5_ * _loc6_),
                    this.vanBody.GetWorldCenter(),
                );
                _loc7_ = Number(param3[2]);
                _loc8_ = this.vanBody.GetAngularVelocity();
                this.vanBody.SetAngularVelocity(_loc8_ + _loc7_);
            }
        }
    }

    public override get bodyList(): any[] {
        if (this.vanBody) {
            return [this.vanBody];
        }
        return [];
    }
}