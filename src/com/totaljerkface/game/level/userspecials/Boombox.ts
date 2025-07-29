import b2ContactPoint from "@/Box2D/Collision/b2ContactPoint";
import b2PolygonDef from "@/Box2D/Collision/Shapes/b2PolygonDef";
import b2PolygonShape from "@/Box2D/Collision/Shapes/b2PolygonShape";
import b2Shape from "@/Box2D/Collision/Shapes/b2Shape";
import b2Math from "@/Box2D/Common/Math/b2Math";
import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import b2Body from "@/Box2D/Dynamics/b2Body";
import b2BodyDef from "@/Box2D/Dynamics/b2BodyDef";
import b2World from "@/Box2D/Dynamics/b2World";
import ContactListener from "@/com/totaljerkface/game/ContactListener";
import BoomboxRef from "@/com/totaljerkface/game/editor/specials/BoomboxRef";
import Special from "@/com/totaljerkface/game/editor/specials/Special";
import ContactEvent from "@/com/totaljerkface/game/events/ContactEvent";
import LevelB2D from "@/com/totaljerkface/game/level/LevelB2D";
import LevelItem from "@/com/totaljerkface/game/level/LevelItem";
import Trigger from "@/com/totaljerkface/game/level/Trigger";
import Session from "@/com/totaljerkface/game/Session";
import Settings from "@/com/totaljerkface/game/Settings";
import SoundController from "@/com/totaljerkface/game/sound/SoundController";
import BoomboxMC from "@/top/BoomboxMC";
import BoomboxPiece1MC from "@/top/BoomboxPiece1MC";
import BoomboxPiece2MC from "@/top/BoomboxPiece2MC";
import BoomboxShardsMC from "@/top/BoomboxShardsMC";
import { boundClass } from 'autobind-decorator';
import DisplayObject from "flash/display/DisplayObject";
import MovieClip from "flash/display/MovieClip";
import Sprite from "flash/display/Sprite";
import Point from "flash/geom/Point";

@boundClass
export default class Boombox extends LevelItem {
    private _shape: b2Shape;
    private _body: b2Body;
    private _interactive: boolean;
    private _crackImpulse: number = 6;
    private _shatterImpulse: number = 17;
    private _break: boolean = false;
    private mc: MovieClip;

    constructor(param1: Special, param2: b2Body = null, param3: Point = null) {
        super();
        this.createBody(param1);
    }

    public createBody(param1: Special) {
        var _loc2_: LevelB2D = null;
        _loc2_ = Settings.currentSession.level;
        var _loc3_: Sprite = _loc2_.background;
        var _loc4_: BoomboxRef = param1 as BoomboxRef;
        _loc4_ = _loc4_.clone() as BoomboxRef;
        var _loc5_: MovieClip = new BoomboxShardsMC();
        Settings.currentSession.particleController.createBMDArray(
            "boomboxshards",
            _loc5_,
        );
        this._interactive = _loc4_.interactive;
        this.mc = new BoomboxMC();
        this.mc.gotoAndStop(1);
        _loc3_.addChild(this.mc);
        this.mc.x = param1.x;
        this.mc.y = param1.y;
        this.mc.rotation = param1.rotation;
        if (!this._interactive) {
            return;
        }
        var _loc6_ = new b2Vec2(_loc4_.x, _loc4_.y);
        var _loc7_: number = _loc4_.rotation;
        var _loc8_ = new b2BodyDef();
        var _loc9_ = new b2PolygonDef();
        _loc9_.density = 2;
        _loc9_.friction = 0.3;
        _loc9_.filter.categoryBits = 8;
        _loc9_.restitution = 0.1;
        _loc9_.SetAsBox(24 / this.m_physScale, 14 / this.m_physScale);
        _loc8_.position.Set(
            _loc6_.x / this.m_physScale,
            _loc6_.y / this.m_physScale,
        );
        _loc8_.angle = (_loc7_ * Math.PI) / 180;
        _loc8_.isSleeping = _loc4_.sleeping;
        var _loc10_: b2Body = (this._body =
            Settings.currentSession.m_world.CreateBody(_loc8_));
        this._shape = _loc10_.CreateShape(_loc9_) as b2PolygonShape;
        _loc10_.SetMassFromShapes();
        _loc2_.paintBodyVector.push(_loc10_);
        _loc10_.SetUserData(this.mc);
        Settings.currentSession.contactListener.registerListener(
            ContactListener.RESULT,
            this._shape,
            this.checkContact,
        );
        Settings.currentSession.contactListener.registerListener(
            ContactListener.ADD,
            this._shape,
            this.checkAdd,
        );
    }

    private checkContact(param1: ContactEvent) {
        if (param1.impulse > this._crackImpulse) {
            if (param1.impulse > this._shatterImpulse) {
                Settings.currentSession.contactListener.deleteListener(
                    ContactListener.ADD,
                    this._shape,
                );
                this._break = true;
            }
            this._crackImpulse = this._shatterImpulse;
            Settings.currentSession.contactListener.deleteListener(
                ContactEvent.RESULT,
                this._shape,
            );
            Settings.currentSession.level.singleActionVector.push(this);
        }
    }

    public override singleAction() {
        var _loc3_: number = NaN;
        var _loc1_: LevelB2D = Settings.currentSession.level;
        var _loc2_: Sprite = _loc1_.background;
        if (!this._break) {
            _loc3_ = Math.ceil(Math.random() * 2);
            Settings.currentSession.contactListener.registerListener(
                ContactListener.RESULT,
                this._shape,
                this.checkContact,
            );
            SoundController.instance.playAreaSoundInstance(
                "BoomboxCrush1",
                this._body,
            );
            Settings.currentSession.particleController.createRectBurst(
                "boomboxshards",
                8,
                this._body,
                15,
            );
            _loc3_ = 1 + Math.ceil(Math.random() * 3);
            this.mc.gotoAndStop(_loc3_);
            this._break = true;
            return;
        }
        this.shatter();
    }

    public override getJointBody(param1: b2Vec2 = null): b2Body {
        return this._body;
    }

    private shatter() {
        var _loc1_: Session = Settings.currentSession;
        var _loc2_: LevelB2D = _loc1_.level;
        var _loc3_: b2World = _loc1_.m_world;
        Settings.currentSession.particleController.createRectBurst(
            "boomboxshards",
            10,
            this._body,
            30,
        );
        var _loc4_: number = Math.ceil(Math.random() * 2);
        SoundController.instance.playAreaSoundInstance(
            "BoomboxSmash" + _loc4_,
            this._body,
        );
        _loc2_.removeFromPaintBodyVector(this._body);
        var _loc5_: b2Vec2 = this._body.GetWorldCenter();
        var _loc6_: b2Vec2 = this._body.GetLinearVelocity();
        var _loc7_: number = this._body.GetAngularVelocity();
        _loc3_.DestroyBody(this._body);
        var _loc8_: number = this._body.GetAngle();
        var _loc9_: number = _loc2_.background.getChildIndex(this.mc);
        var _loc10_: Sprite = new BoomboxPiece1MC();
        var _loc11_: Sprite = new BoomboxPiece2MC();
        _loc2_.background.addChildAt(_loc10_, _loc9_);
        _loc2_.background.addChildAt(_loc11_, _loc9_);
        var _loc12_ = new b2BodyDef();
        _loc12_.angle = _loc8_;
        var _loc13_ = new b2Vec2(
            -13.6 / this.m_physScale,
            1.8 / this.m_physScale,
        );
        _loc12_.position = this._body.GetWorldPoint(_loc13_);
        var _loc14_ = new b2PolygonDef();
        _loc14_.density = 2;
        _loc14_.friction = 0.3;
        _loc14_.restitution = 0.1;
        _loc14_.filter.categoryBits = 8;
        _loc14_.vertexCount = 3;
        _loc14_.SetAsBox(10.5 / this.m_physScale, 14 / this.m_physScale);
        var _loc15_: b2Body = _loc3_.CreateBody(_loc12_);
        _loc15_.CreateShape(_loc14_);
        _loc15_.SetMassFromShapes();
        var _loc16_: b2Vec2 = _loc15_.GetLocalCenter();
        _loc15_.SetAngularVelocity(_loc7_);
        _loc15_.SetLinearVelocity(
            this._body.GetLinearVelocityFromLocalPoint(_loc16_),
        );
        _loc15_.SetUserData(_loc10_);
        _loc2_.paintBodyVector.push(_loc15_);
        _loc13_ = new b2Vec2(13.55 / this.m_physScale, 1.8 / this.m_physScale);
        _loc12_.position = this._body.GetWorldPoint(_loc13_);
        _loc15_ = _loc3_.CreateBody(_loc12_);
        _loc15_.CreateShape(_loc14_);
        _loc15_.SetMassFromShapes();
        _loc16_ = _loc15_.GetLocalCenter();
        _loc15_.SetAngularVelocity(_loc7_);
        _loc15_.SetLinearVelocity(
            this._body.GetLinearVelocityFromLocalPoint(_loc16_),
        );
        _loc15_.SetUserData(_loc11_);
        _loc2_.paintBodyVector.push(_loc15_);
        this.mc.parent.removeChild(this.mc);
        this._body = null;
    }

    private checkAdd(param1: b2ContactPoint) {
        if (param1.shape2.m_isSensor) {
            return;
        }
        var _loc2_: number = param1.shape2.m_body.m_mass;
        if (_loc2_ != 0 && _loc2_ < this._body.m_mass) {
            return;
        }
        var _loc3_: number = b2Math.b2Dot(param1.velocity, param1.normal);
        _loc3_ = Math.abs(_loc3_);
        if (_loc3_ > 4) {
            SoundController.instance.playAreaSoundInstance(
                "BoomboxHit",
                this._body,
            );
        }
    }

    public override get groupDisplayObject(): DisplayObject {
        return this.mc;
    }

    public override die() {
        var _loc1_: ContactListener = Settings.currentSession.contactListener;
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
            if (this._body) {
                this._body.WakeUp();
            }
        } else if (param2 == "apply impulse") {
            if (this._body) {
                _loc4_ = Number(param3[0]);
                _loc5_ = Number(param3[1]);
                _loc6_ = this._body.GetMass();
                this._body.ApplyImpulse(
                    new b2Vec2(_loc4_ * _loc6_, _loc5_ * _loc6_),
                    this._body.GetWorldCenter(),
                );
                _loc7_ = Number(param3[2]);
                _loc8_ = this._body.GetAngularVelocity();
                this._body.SetAngularVelocity(_loc8_ + _loc7_);
            }
        }
    }

    public override get bodyList(): any[] {
        if (this._body) {
            return [this._body];
        }
        return [];
    }
}