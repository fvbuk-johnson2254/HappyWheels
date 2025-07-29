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
import Special from "@/com/totaljerkface/game/editor/specials/Special";
import ToiletRef from "@/com/totaljerkface/game/editor/specials/ToiletRef";
import ContactEvent from "@/com/totaljerkface/game/events/ContactEvent";
import LevelB2D from "@/com/totaljerkface/game/level/LevelB2D";
import LevelItem from "@/com/totaljerkface/game/level/LevelItem";
import Trigger from "@/com/totaljerkface/game/level/Trigger";
import Spray from "@/com/totaljerkface/game/particles/Spray";
import Session from "@/com/totaljerkface/game/Session";
import Settings from "@/com/totaljerkface/game/Settings";
import AreaSoundInstance from "@/com/totaljerkface/game/sound/AreaSoundInstance";
import SoundController from "@/com/totaljerkface/game/sound/SoundController";
import ToiletBackPiece1MC from "@/top/ToiletBackPiece1MC";
import ToiletBackPiece2MC from "@/top/ToiletBackPiece2MC";
import ToiletBasePiece1MC from "@/top/ToiletBasePiece1MC";
import ToiletBasePiece2MC from "@/top/ToiletBasePiece2MC";
import ToiletMC from "@/top/ToiletMC";
import ToiletParticlesMC from "@/top/ToiletParticlesMC";
import WaterMC from "@/top/WaterMC";
import DisplayObject from "flash/display/DisplayObject";
import MovieClip from "flash/display/MovieClip";
import Sprite from "flash/display/Sprite";
import Event from "flash/events/Event";
// import BevelFilter from "flash/filters/BevelFilter";
import { boundClass } from 'autobind-decorator';
import Point from "flash/geom/Point";

@boundClass
export default class Toilet extends LevelItem {
    private _backShape: b2Shape;
    private _bowlShape: b2Shape;
    private _baseShape: b2Shape;
    private _body: b2Body;
    private _interactive: boolean;
    private _impulseMin: number = 12;
    private _breakBack: boolean = false;
    private _breakBase: boolean = false;
    private _inSingleActionArray = false;
    private _sound: AreaSoundInstance;
    private _hitSound: AreaSoundInstance;
    private mc: ToiletMC;
    private _sign: number;
    private _polyDef: b2PolygonDef;

    constructor(param1: Special, param2: b2Body = null, param3: Point = null) {
        super();
        this.createBody(param1);
    }

    public createBody(param1: Special) {
        var _loc2_: LevelB2D = null;
        var _loc14_: b2Vec2 = null;
        _loc2_ = Settings.currentSession.level;
        var _loc3_: Sprite = _loc2_.background;
        var _loc4_: ToiletRef = param1 as ToiletRef;
        _loc4_ = _loc4_.clone() as ToiletRef;
        this._sign = _loc4_.reverse ? -1 : 1;
        // var _loc5_ = new BevelFilter(1, 90, 16752029, 1, 5308416, 1, 0, 0);
        var _loc6_: MovieClip = new WaterMC();
        var _loc7_: MovieClip = new ToiletParticlesMC();
        var _loc8_: any[] = [/*_loc5_*/];
        Settings.currentSession.particleController.createBMDArray(
            "water",
            _loc6_,
            _loc8_,
        );
        Settings.currentSession.particleController.createBMDArray(
            "toiletParticles",
            _loc7_,
        );
        this._interactive = _loc4_.interactive;
        this.mc = new ToiletMC();
        this.mc.container.gotoAndStop(1);
        this.mc.container.scaleX *= this._sign;
        _loc3_.addChild(this.mc);
        this.mc.x = param1.x;
        this.mc.y = param1.y;
        this.mc.rotation = param1.rotation;
        if (!this._interactive) {
            return;
        }
        var _loc9_ = new b2Vec2(_loc4_.x, _loc4_.y);
        var _loc10_: number = _loc4_.rotation;
        var _loc11_ = new b2BodyDef();
        var _loc12_ = new b2PolygonDef();
        _loc12_.density = 2;
        _loc12_.friction = 0.3;
        _loc12_.filter.categoryBits = 8;
        _loc12_.restitution = 0.1;
        _loc12_.SetAsOrientedBox(
            10 / this.m_physScale,
            23.5 / this.m_physScale,
            new b2Vec2(
                (this._sign * -21) / this.m_physScale,
                -16 / this.m_physScale,
            ),
            0,
        );
        _loc11_.position.Set(
            _loc9_.x / this.m_physScale,
            _loc9_.y / this.m_physScale,
        );
        _loc11_.angle = (_loc10_ * Math.PI) / 180;
        _loc11_.isSleeping = _loc4_.sleeping;
        var _loc13_: b2Body = (this._body =
            Settings.currentSession.m_world.CreateBody(_loc11_));
        this._backShape = _loc13_.CreateShape(_loc12_) as b2PolygonShape;
        _loc12_.density = 4;
        _loc12_.SetAsOrientedBox(
            10.5 / this.m_physScale,
            7.5 / this.m_physScale,
            new b2Vec2(
                (this._sign * 3) / this.m_physScale,
                31.5 / this.m_physScale,
            ),
            0,
        );
        this._baseShape = _loc13_.CreateShape(_loc12_);
        this._polyDef = _loc12_;
        _loc12_.density = 2;
        _loc12_ = this.addBowlShapeToPolyDef(_loc12_);
        this._bowlShape = _loc13_.CreateShape(_loc12_);
        _loc13_.SetMassFromShapes();
        _loc2_.paintBodyVector.push(_loc13_);
        _loc13_.SetUserData(this.mc);
        _loc13_.SetMassFromShapes();
        _loc14_ = _loc13_.GetLocalCenter();
        this.mc.container.x = -_loc14_.x * this.m_physScale;
        this.mc.container.y = -_loc14_.y * this.m_physScale;
        Settings.currentSession.contactListener.registerListener(
            ContactListener.RESULT,
            this._backShape,
            this.checkBackContact,
        );
        Settings.currentSession.contactListener.registerListener(
            ContactListener.RESULT,
            this._bowlShape,
            this.checkBaseContact,
        );
        Settings.currentSession.contactListener.registerListener(
            ContactListener.RESULT,
            this._baseShape,
            this.checkBaseContact,
        );
        Settings.currentSession.contactListener.registerListener(
            ContactListener.ADD,
            this._backShape,
            this.checkAdd,
        );
        Settings.currentSession.contactListener.registerListener(
            ContactListener.ADD,
            this._bowlShape,
            this.checkAdd,
        );
        Settings.currentSession.contactListener.registerListener(
            ContactListener.ADD,
            this._baseShape,
            this.checkAdd,
        );
    }

    private addBowlShapeToPolyDef(param1: b2PolygonDef): b2PolygonDef {
        var _loc2_: any[] = null;
        param1.vertexCount = 5;
        param1.vertices[0] = new b2Vec2(
            (this._sign * -25) / this.m_physScale,
            4.5 / this.m_physScale,
        );
        if (this._breakBase) {
            param1.vertices[1] = new b2Vec2(
                (this._sign * 2) / this.m_physScale,
                4.5 / this.m_physScale,
            );
            param1.vertices[2] = new b2Vec2(
                (this._sign * 17) / this.m_physScale,
                25 / this.m_physScale,
            );
        } else {
            param1.vertices[1] = new b2Vec2(
                (this._sign * 31) / this.m_physScale,
                4.5 / this.m_physScale,
            );
            param1.vertices[2] = new b2Vec2(
                (this._sign * 25) / this.m_physScale,
                20 / this.m_physScale,
            );
        }
        param1.vertices[3] = new b2Vec2(
            (this._sign * 3.5) / this.m_physScale,
            30.5 / this.m_physScale,
        );
        param1.vertices[4] = new b2Vec2(
            (this._sign * -22) / this.m_physScale,
            17 / this.m_physScale,
        );
        if (this._sign == -1) {
            _loc2_ = new Array();
            _loc2_[0] = param1.vertices[1];
            _loc2_[1] = param1.vertices[0];
            _loc2_[3] = param1.vertices[3];
            _loc2_[2] = param1.vertices[4];
            _loc2_[4] = param1.vertices[2];
            param1.vertices = _loc2_;
        }
        return param1;
    }

    private checkBackContact(param1: ContactEvent) {
        if (param1.impulse > this._impulseMin) {
            this._breakBack = true;
            Settings.currentSession.contactListener.deleteListener(
                ContactEvent.RESULT,
                this._backShape,
            );
            this.addToSingleActionArray();
        }
    }

    private checkBaseContact(param1: ContactEvent) {
        if (param1.impulse > this._impulseMin) {
            this._breakBase = true;
            Settings.currentSession.contactListener.deleteListener(
                ContactEvent.RESULT,
                this._bowlShape,
            );
            Settings.currentSession.contactListener.deleteListener(
                ContactEvent.RESULT,
                this._baseShape,
            );
            this.addToSingleActionArray();
        }
    }

    private addToSingleActionArray() {
        if (!this._inSingleActionArray) {
            this._inSingleActionArray = true;
            Settings.currentSession.level.singleActionVector.push(this);
        }
    }

    public override singleAction() {
        var _loc10_: Sprite = null;
        var _loc12_: b2Body = null;
        var _loc13_: number = 0;
        var _loc14_: b2Vec2 = null;
        var _loc15_: b2Vec2 = null;
        var _loc16_: Spray = null;
        var _loc17_: b2Vec2 = null;
        var _loc18_: b2Vec2 = null;
        var _loc19_: b2Vec2 = null;
        var _loc20_: b2Vec2 = null;
        this._inSingleActionArray = false;
        var _loc1_: Session = Settings.currentSession;
        var _loc2_: LevelB2D = _loc1_.level;
        var _loc3_: b2World = _loc1_.m_world;
        var _loc4_: Sprite = _loc2_.background;
        var _loc5_: b2Vec2 = this._body.GetWorldCenter();
        var _loc6_: b2Vec2 = this._body.GetLinearVelocity();
        var _loc7_: number = this._body.GetAngularVelocity();
        var _loc8_: number = this._body.GetAngle();
        var _loc9_ = new b2BodyDef();
        _loc9_.angle = _loc8_;
        _loc9_.position = _loc5_;
        if (this._breakBase && Boolean(this._baseShape)) {
            this._body.DestroyShape(this._baseShape);
            this._body.DestroyShape(this._bowlShape);
            this._baseShape = null;
            Settings.currentSession.contactListener.deleteListener(
                ContactEvent.ADD,
                this._baseShape,
            );
            _loc10_ = new ToiletBasePiece1MC();
            _loc10_.scaleX *= this._sign;
            _loc4_.addChild(_loc10_);
            _loc12_ = _loc3_.CreateBody(_loc9_);
            _loc12_.SetAngularVelocity(_loc7_);
            _loc12_.SetLinearVelocity(_loc6_);
            this._polyDef.SetAsOrientedBox(
                10.5 / this.m_physScale,
                7.5 / this.m_physScale,
                new b2Vec2(
                    (this._sign * 3) / this.m_physScale,
                    31.5 / this.m_physScale,
                ),
                0,
            );
            _loc12_.CreateShape(this._polyDef);
            _loc12_.SetUserData(_loc10_);
            _loc2_.paintBodyVector.push(_loc12_);
            this._polyDef = this.addBowlShapeToPolyDef(this._polyDef);
            _loc12_.CreateShape(this._polyDef);
            _loc12_.SetMassFromShapes();
            _loc12_.SetAngularVelocity(_loc7_);
            _loc12_.SetLinearVelocity(_loc6_);
            _loc13_ = _loc4_.getChildIndex(_loc10_);
            _loc14_ =
                this._sign == 1
                    ? new b2Vec2(11 / this.m_physScale, 22 / this.m_physScale)
                    : new b2Vec2(-1 / this.m_physScale, 13 / this.m_physScale);
            _loc15_ =
                this._sign == 1
                    ? new b2Vec2(1 / this.m_physScale, 13 / this.m_physScale)
                    : new b2Vec2(-11 / this.m_physScale, 22 / this.m_physScale);
            Settings.currentSession.particleController.createRectBurst(
                "toiletParticles",
                20,
                _loc12_,
                30,
            );
            _loc16_ = _loc1_.particleController.createSpray(
                "water",
                _loc12_,
                _loc14_,
                _loc15_,
                0,
                2,
                15,
                3,
                95,
                _loc4_,
                _loc13_,
            );
            _loc10_ = new ToiletBasePiece2MC();
            _loc10_.scaleX *= this._sign;
            _loc4_.addChild(_loc10_);
            _loc12_ = _loc3_.CreateBody(_loc9_);
            _loc12_.SetUserData(_loc10_);
            _loc2_.paintBodyVector.push(_loc12_);
            this._polyDef.vertexCount = 4;
            _loc17_ = new b2Vec2(
                (this._sign * 8) / this.m_physScale,
                4.5 / this.m_physScale,
            );
            _loc18_ = new b2Vec2(
                (this._sign * 31) / this.m_physScale,
                4.5 / this.m_physScale,
            );
            _loc19_ = new b2Vec2(
                (this._sign * 25) / this.m_physScale,
                20 / this.m_physScale,
            );
            _loc20_ = new b2Vec2(
                (this._sign * 17) / this.m_physScale,
                25 / this.m_physScale,
            );
            if (this._sign == 1) {
                this._polyDef.vertices[0] = _loc17_;
                this._polyDef.vertices[1] = _loc18_;
                this._polyDef.vertices[2] = _loc19_;
                this._polyDef.vertices[3] = _loc20_;
            } else {
                this._polyDef.vertices[0] = _loc18_;
                this._polyDef.vertices[1] = _loc17_;
                this._polyDef.vertices[2] = _loc20_;
                this._polyDef.vertices[3] = _loc19_;
            }
            _loc12_.CreateShape(this._polyDef);
            _loc12_.SetMassFromShapes();
            _loc12_.SetAngularVelocity(_loc7_);
            _loc12_.SetLinearVelocity(_loc6_);
            // @ts-expect-error
            this.mc.container.base.visible = false;
            this.playSound(_loc12_);
        }
        if (this._breakBack && Boolean(this._backShape)) {
            this._body.DestroyShape(this._backShape);
            this._backShape = null;
            Settings.currentSession.contactListener.deleteListener(
                ContactEvent.ADD,
                this._backShape,
            );
            this._polyDef.SetAsOrientedBox(
                10 / this.m_physScale,
                12.5 / this.m_physScale,
                new b2Vec2(
                    (this._sign * -14) / this.m_physScale,
                    -31 / this.m_physScale,
                ),
                0,
            );
            _loc10_ = new ToiletBackPiece1MC();
            _loc10_.scaleX *= this._sign;
            _loc4_.addChild(_loc10_);
            _loc12_ = _loc3_.CreateBody(_loc9_);
            _loc12_.CreateShape(this._polyDef);
            _loc12_.SetMassFromShapes();
            _loc12_.SetAngularVelocity(_loc7_);
            _loc12_.SetLinearVelocity(_loc6_);
            _loc12_.SetUserData(_loc10_);
            _loc2_.paintBodyVector.push(_loc12_);
            this._polyDef.SetAsOrientedBox(
                10 / this.m_physScale,
                11 / this.m_physScale,
                new b2Vec2(
                    (this._sign * -14) / this.m_physScale,
                    -7 / this.m_physScale,
                ),
                0,
            );
            _loc10_ = new ToiletBackPiece2MC();
            _loc10_.scaleX *= this._sign;
            _loc4_.addChild(_loc10_);
            _loc12_ = _loc3_.CreateBody(_loc9_);
            _loc12_.CreateShape(this._polyDef);
            _loc12_.SetUserData(_loc10_);
            _loc2_.paintBodyVector.push(_loc12_);
            _loc12_.SetMassFromShapes();
            _loc12_.SetAngularVelocity(_loc7_);
            _loc12_.SetLinearVelocity(_loc6_);
            // @ts-expect-error
            this.mc.container.back.visible = false;
            _loc13_ = _loc4_.getChildIndex(_loc10_);
            _loc14_ =
                this._sign == 1
                    ? new b2Vec2(-7 / this.m_physScale, -14 / this.m_physScale)
                    : new b2Vec2(23 / this.m_physScale, -13 / this.m_physScale);
            _loc15_ =
                this._sign == 1
                    ? new b2Vec2(-23 / this.m_physScale, -13 / this.m_physScale)
                    : new b2Vec2(7 / this.m_physScale, -14 / this.m_physScale);
            _loc1_.particleController.createRectBurst(
                "toiletParticles",
                20,
                _loc12_,
                30,
            );
            _loc1_.particleController.createSpray(
                "water",
                _loc12_,
                _loc14_,
                _loc15_,
                0,
                1,
                15,
                3,
                80,
                _loc4_,
                _loc13_,
            );
            this.playSound(_loc12_);
        }
        if (this._breakBase && this._breakBack) {
            Settings.currentSession.contactListener.deleteListener(
                ContactEvent.ADD,
                this._bowlShape,
            );
            _loc3_.DestroyBody(this._body);
            _loc4_.removeChild(this.mc);
            return;
        }
        this._body.SetMassFromShapes();
        var _loc11_: b2Vec2 = this._body.GetLocalCenter();
        this.mc.container.x = -_loc11_.x * this.m_physScale;
        this.mc.container.y = -_loc11_.y * this.m_physScale;
    }

    private checkAdd(param1: b2ContactPoint) {
        var _loc4_: number = NaN;
        if (param1.shape2.m_isSensor) {
            return;
        }
        if (this._hitSound) {
            return;
        }
        var _loc2_: number = param1.shape2.m_body.m_mass;
        if (_loc2_ != 0 && _loc2_ < this._body.m_mass) {
            return;
        }
        var _loc3_: number = b2Math.b2Dot(param1.velocity, param1.normal);
        _loc3_ = Math.abs(_loc3_);
        if (_loc3_ > 4) {
            _loc4_ = Math.ceil(Math.random() * 2);
            if (!this._hitSound) {
                this._hitSound = SoundController.instance.playAreaSoundInstance(
                    "ToiletHit" + _loc4_,
                    this._body,
                );
            }
            if (this._hitSound) {
                this._hitSound.addEventListener(
                    AreaSoundInstance.AREA_SOUND_STOP,
                    this.hitSoundComplete,
                    false,
                    0,
                    true,
                );
            }
        }
    }

    private playSound(param1: b2Body) {
        var _loc2_: number = Math.ceil(Math.random() * 3);
        if (!this._sound) {
            this._sound = SoundController.instance.playAreaSoundInstance(
                "ToiletSmash" + _loc2_,
                param1,
            );
        }
        if (this._sound) {
            this._sound.addEventListener(
                AreaSoundInstance.AREA_SOUND_STOP,
                this.soundComplete,
                false,
                0,
                true,
            );
        }
    }

    private soundComplete(param1: Event) {
        this._sound.removeEventListener(
            AreaSoundInstance.AREA_SOUND_STOP,
            this.soundComplete,
        );
        this._sound = null;
    }

    private hitSoundComplete(param1: Event) {
        this._hitSound.removeEventListener(
            AreaSoundInstance.AREA_SOUND_STOP,
            this.hitSoundComplete,
        );
        this._hitSound = null;
    }

    public override getJointBody(param1: b2Vec2 = null): b2Body {
        return this._body;
    }

    public override get groupDisplayObject(): DisplayObject {
        return this.mc;
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