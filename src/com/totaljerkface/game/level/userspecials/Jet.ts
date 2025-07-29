import b2PolygonDef from "@/Box2D/Collision/Shapes/b2PolygonDef";
import b2Shape from "@/Box2D/Collision/Shapes/b2Shape";
import b2AABB from "@/Box2D/Collision/b2AABB";
import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import b2Body from "@/Box2D/Dynamics/b2Body";
import b2BodyDef from "@/Box2D/Dynamics/b2BodyDef";
import b2World from "@/Box2D/Dynamics/b2World";
import ContactListener from "@/com/totaljerkface/game/ContactListener";
import Session from "@/com/totaljerkface/game/Session";
import Settings from "@/com/totaljerkface/game/Settings";
import CharacterB2D from "@/com/totaljerkface/game/character/CharacterB2D";
import JetRef from "@/com/totaljerkface/game/editor/specials/JetRef";
import Special from "@/com/totaljerkface/game/editor/specials/Special";
import ContactEvent from "@/com/totaljerkface/game/events/ContactEvent";
import LevelB2D from "@/com/totaljerkface/game/level/LevelB2D";
import LevelItem from "@/com/totaljerkface/game/level/LevelItem";
import Trigger from "@/com/totaljerkface/game/level/Trigger";
import AreaSoundLoop from "@/com/totaljerkface/game/sound/AreaSoundLoop";
import SoundController from "@/com/totaljerkface/game/sound/SoundController";
import Explosion2 from "@/top/Explosion2";
import JetMC from "@/top/JetMC";
import MetalPiecesMC from "@/top/MetalPiecesMC";
import MovieClip from "flash/display/MovieClip";
import Sprite from "flash/display/Sprite";
// import BevelFilter from "flash/filters/BevelFilter";
import NPCharacter from "@/com/totaljerkface/game/level/userspecials/NPCharacter";
import { boundClass } from 'autobind-decorator';

@boundClass
export default class Jet extends LevelItem {
    private smash_impulse: number;
    private mc: MovieClip;
    private body: b2Body;
    private jetShape: b2Shape;
    private power: number;
    private accelScaler: number;
    private accelStep: number;
    private firing: boolean;
    private fireCount: number = 0;
    private fireTotal: number;
    private _firingAllowed: boolean = true;
    private soundLoop: AreaSoundLoop;
    private fadeTime: number = 0;

    constructor(param1: Special) {
        super();
        var _loc2_: JetRef = param1 as JetRef;
        this.createBody(_loc2_);
        this.mc = new JetMC();
        var _loc3_: number = JetRef.MAX_POWER - JetRef.MIN_POWER;
        var _loc4_: number = (_loc2_.power - JetRef.MIN_POWER) / _loc3_;
        this.mc.scaleX = this.mc.scaleY = 1 + _loc4_;
        var _loc5_: Sprite = Settings.currentSession.level.background;
        _loc5_.addChild(this.mc);
        this.power = _loc2_.power;
        if (_loc2_.accelTime > 0) {
            this.accelScaler = 0;
            this.accelStep = 1 / (_loc2_.accelTime * 30);
            this.fadeTime = _loc2_.accelTime;
        } else {
            this.accelScaler = 1;
            this.accelStep = 0;
        }
        if (_loc2_.fireTime > 0) {
            this.fireTotal = _loc2_.fireTime * 30;
        } else {
            this.fireTotal = Infinity;
        }
        // var _loc6_ = new BevelFilter(
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
            [/*_loc6_*/],
        );
        Settings.currentSession.level.actionsVector.push(this);
        Settings.currentSession.contactListener.registerListener(
            ContactEvent.RESULT,
            this.jetShape,
            this.checkContact,
        );
        if (!_loc2_.sleeping) {
            this.fireEngine();
        } else {
            // @ts-expect-error
            this.mc.flames.visible = this.mc.lights.visible = false;
        }
    }

    public createBody(param1: JetRef) {
        var _loc2_ = new b2Vec2(param1.x, param1.y);
        var _loc3_: number = (param1.rotation * Math.PI) / 180;
        var _loc4_ = new b2BodyDef();
        _loc4_.isSleeping = param1.sleeping;
        _loc4_.fixedRotation = param1.fixedRotation;
        var _loc5_ = new b2PolygonDef();
        _loc5_.density = 3;
        _loc5_.friction = 0.5;
        _loc5_.restitution = 0.1;
        _loc5_.filter.categoryBits = 8;
        var _loc6_: number = 15.5;
        var _loc7_: number = 19;
        var _loc8_: number = JetRef.MAX_POWER - JetRef.MIN_POWER;
        var _loc9_: number = (param1.power - JetRef.MIN_POWER) / _loc8_;
        _loc6_ += _loc6_ * _loc9_;
        _loc7_ += _loc7_ * _loc9_;
        _loc5_.SetAsBox(
            (_loc6_ * 0.5) / this.m_physScale,
            (_loc7_ * 0.5) / this.m_physScale,
        );
        _loc4_.position.Set(
            _loc2_.x / this.m_physScale,
            _loc2_.y / this.m_physScale,
        );
        _loc4_.angle = _loc3_;
        this.body = Settings.currentSession.m_world.CreateBody(_loc4_);
        this.jetShape = this.body.CreateShape(_loc5_);
        Settings.currentSession.level.paintItemVector.push(this);
        this.body.SetMassFromShapes();
        this.smash_impulse = Math.round(100 * this.body.GetMass());
    }

    public override paint() {
        var _loc1_: b2Vec2 = null;
        _loc1_ = this.body.GetWorldCenter();
        this.mc.x = _loc1_.x * this.m_physScale;
        this.mc.y = _loc1_.y * this.m_physScale;
        this.mc.rotation =
            (this.body.GetAngle() * LevelItem.oneEightyOverPI) % 360;
        var _loc2_ = 0.95 * this.accelScaler + Math.random() * 0.1;
        // @ts-expect-error
        this.mc.flames.scaleY = 0.95 * this.accelScaler + Math.random() * 0.1;
        // @ts-expect-error
        this.mc.flames.scaleX = _loc2_;
    }

    public override actions() {
        var _loc1_: number = NaN;
        var _loc2_: number = NaN;
        var _loc3_: number = NaN;
        var _loc4_: number = NaN;
        if (!this.body.IsSleeping()) {
            if (this._firingAllowed) {
                if (!this.firing) {
                    this.fireEngine();
                }
                _loc1_ = this.body.GetAngle();
                this.accelScaler += this.accelStep;
                this.accelScaler = Math.min(1, this.accelScaler);
                _loc2_ = this.power * this.accelScaler;
                _loc3_ = Math.sin(_loc1_) * _loc2_;
                _loc4_ = -Math.cos(_loc1_) * _loc2_;
                this.body.ApplyImpulse(
                    new b2Vec2(_loc3_, _loc4_),
                    this.body.GetWorldCenter(),
                );
                this.fireCount += 1;
                if (this.fireCount > this.fireTotal) {
                    // @ts-expect-error
                    this.mc.flames.visible = this.mc.lights.visible = false;
                    Settings.currentSession.level.removeFromActionsVector(this);
                    this.soundLoop.stopSound();
                }
            } else {
                if (this.firing) {
                    this.firing = false;
                    // @ts-expect-error
                    this.mc.flames.visible = this.mc.lights.visible = false;
                    this.soundLoop.stopSound();
                }
                if (this.accelStep != 0) {
                    this.accelScaler = Math.max(
                        0,
                        this.accelScaler - this.accelStep,
                    );
                }
            }
        }
    }

    public override getJointBody(param1: b2Vec2 = null): b2Body {
        return this.body;
    }

    public fireEngine() {
        var _loc1_: number = 0;
        this.firing = true;
        // @ts-expect-error
        this.mc.flames.visible = this.mc.lights.visible = true;
        if (this.power < 4) {
            _loc1_ = 1;
        } else if (this.power < 8) {
            _loc1_ = 2;
        } else {
            _loc1_ = 3;
        }
        this.soundLoop = SoundController.instance.playAreaSoundLoop(
            "Jet" + _loc1_,
            this.body,
            0,
            Math.random() * 1000,
        );
        if (this.fadeTime > 0) {
            this.soundLoop.fadeIn(this.fadeTime);
        } else {
            this.soundLoop.maxVolume = 1;
        }
    }

    public override singleAction() {
        var _loc1_ = Settings.currentSession.level.actionsVector;
        var _loc2_ = int(_loc1_.indexOf(this));
        if (_loc2_ > -1) {
            _loc1_.splice(_loc2_, 1);
        }
        this.explode();
    }

    private explode() {
        var _loc13_: b2Shape = null;
        var _loc14_: b2Body = null;
        var _loc15_: b2Vec2 = null;
        var _loc16_: b2Vec2 = null;
        var _loc17_: number = NaN;
        var _loc18_: number = NaN;
        var _loc19_: number = NaN;
        var _loc20_: number = NaN;
        var _loc21_: number = NaN;
        var _loc22_: CharacterB2D = null;
        var _loc23_: NPCharacter = null;
        var _loc1_: Session = Settings.currentSession;
        var _loc2_: b2World = _loc1_.m_world;
        var _loc3_: MovieClip = new Explosion2();
        _loc3_.x = this.mc.x;
        _loc3_.y = this.mc.y;
        _loc3_.scaleX = _loc3_.scaleY = 0.5;
        if (Math.random() > 0.5) {
            _loc3_.scaleX *= -1;
        }
        _loc3_.rotation = (this.body.GetAngle() * 180) / Math.PI;
        _loc1_.containerSprite.addChildAt(_loc3_, 1);
        var _loc4_: ContactListener = _loc1_.contactListener;
        _loc2_.DestroyBody(this.body);
        this.mc.visible = false;
        var _loc5_ = new Array();
        var _loc6_: number = 2.6;
        var _loc7_ = new b2AABB();
        var _loc8_: b2Vec2 = this.body.GetWorldCenter();
        _loc7_.lowerBound.Set(_loc8_.x - _loc6_, _loc8_.y - _loc6_);
        _loc7_.upperBound.Set(_loc8_.x + _loc6_, _loc8_.y + _loc6_);
        var _loc9_: number = _loc2_.Query(_loc7_, _loc5_, 30);
        var _loc10_ = 5;
        var _loc11_: number = 0;
        while (_loc11_ < _loc5_.length) {
            _loc13_ = _loc5_[_loc11_];
            _loc14_ = _loc13_.GetBody();
            if (!_loc14_.IsStatic()) {
                _loc15_ = _loc14_.GetWorldCenter();
                _loc16_ = new b2Vec2(
                    _loc15_.x - _loc8_.x,
                    _loc15_.y - _loc8_.y,
                );
                _loc17_ = _loc16_.Length();
                _loc17_ = Math.min(_loc6_, _loc17_);
                _loc18_ = 1 - _loc17_ / _loc6_;
                _loc19_ = Math.atan2(_loc16_.y, _loc16_.x);
                _loc20_ = Math.cos(_loc19_) * _loc18_ * _loc10_;
                _loc21_ = Math.sin(_loc19_) * _loc18_ * _loc10_;
                _loc14_.ApplyImpulse(new b2Vec2(_loc20_, _loc21_), _loc15_);
                if (_loc13_.m_userData instanceof CharacterB2D) {
                    _loc22_ = _loc13_.m_userData as CharacterB2D;
                    _loc22_.explodeShape(_loc13_, _loc18_);
                } else if (_loc13_.m_userData instanceof NPCharacter) {
                    _loc23_ = _loc13_.m_userData as NPCharacter;
                    _loc23_.explodeShape(_loc13_, _loc18_);
                }
            }
            _loc11_++;
        }
        if (this.soundLoop) {
            this.soundLoop.stopSound();
        }
        SoundController.instance.playAreaSoundInstance(
            "MineExplosion",
            this.body,
        );
        _loc1_.particleController.createBurst(
            "metalpieces",
            10,
            50,
            this.body,
            25,
        );
        var _loc12_: LevelB2D = _loc1_.level;
        _loc12_.removeFromPaintItemVector(this);
    }

    public checkContact(param1: ContactEvent) {
        var _loc2_: LevelB2D = null;
        var _loc3_: ContactListener = null;
        if (param1.impulse > this.smash_impulse) {
            trace("jet impulse " + param1.impulse);
            _loc2_ = Settings.currentSession.level;
            _loc2_.singleActionVector.push(this);
            _loc3_ = Settings.currentSession.contactListener;
            _loc3_.deleteListener(ContactListener.RESULT, this.jetShape);
        }
    }

    public get firingAllowed(): boolean {
        return this._firingAllowed;
    }

    public set firingAllowed(param1: boolean) {
        this._firingAllowed = param1;
    }

    public override triggerSingleActivation(
        param1: Trigger,
        param2: string,
        param3: any[],
    ) {
        if (this.body) {
            this.body.WakeUp();
        }
    }

    public override get bodyList(): any[] {
        if (this.body) {
            return [this.body];
        }
        return [];
    }
}