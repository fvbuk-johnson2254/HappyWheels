import b2CircleDef from "@/Box2D/Collision/Shapes/b2CircleDef";
import b2PolygonDef from "@/Box2D/Collision/Shapes/b2PolygonDef";
import b2Shape from "@/Box2D/Collision/Shapes/b2Shape";
import b2AABB from "@/Box2D/Collision/b2AABB";
import b2ContactPoint from "@/Box2D/Collision/b2ContactPoint";
import b2Segment from "@/Box2D/Collision/b2Segment";
import b2Math from "@/Box2D/Common/Math/b2Math";
import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import b2Body from "@/Box2D/Dynamics/b2Body";
import b2BodyDef from "@/Box2D/Dynamics/b2BodyDef";
import b2World from "@/Box2D/Dynamics/b2World";
import ContactListener from "@/com/totaljerkface/game/ContactListener";
import Session from "@/com/totaljerkface/game/Session";
import Settings from "@/com/totaljerkface/game/Settings";
import CharacterB2D from "@/com/totaljerkface/game/character/CharacterB2D";
import HomingMineRef from "@/com/totaljerkface/game/editor/specials/HomingMineRef";
import Special from "@/com/totaljerkface/game/editor/specials/Special";
import ContactEvent from "@/com/totaljerkface/game/events/ContactEvent";
import LevelB2D from "@/com/totaljerkface/game/level/LevelB2D";
import LevelItem from "@/com/totaljerkface/game/level/LevelItem";
import Trigger from "@/com/totaljerkface/game/level/Trigger";
import AreaSoundLoop from "@/com/totaljerkface/game/sound/AreaSoundLoop";
import SoundController from "@/com/totaljerkface/game/sound/SoundController";
import Explosion2 from "@/top/Explosion2";
import HomingMineMC from "@/top/HomingMineMC";
import MetalPiecesMC from "@/top/MetalPiecesMC";
import MovieClip from "flash/display/MovieClip";
import Sprite from "flash/display/Sprite";
// import BevelFilter from "flash/filters/BevelFilter";
import NPCharacter from "@/com/totaljerkface/game/level/userspecials/NPCharacter";
import { boundClass } from 'autobind-decorator';

@boundClass
export default class HomingMine extends LevelItem {
    private static SENSOR_RADIUS: number;
    private static SLOWING_FACTOR: number = 0.05;
    private static EXPLOSION_DISTANCE: number = Math.pow(0.48, 2);
    private static SMASH_IMPULSE: number = 3;
    private static GRAVITY_DISPLACEMENT: number = -0.3333333333333333;
    private laserSprite: Sprite;
    private laserColor: number;
    private mc: HomingMineMC;
    private mineBody: b2Body;
    private targetingBody: b2Body;
    private mineShape: b2Shape;
    private rangeSensor: b2Shape;
    private targetingSensor: b2Shape;
    private target: b2Body;
    private targetDictionary: Dictionary<any, any>;
    private pathClear: boolean;
    private inContact: boolean;
    private countingDown: boolean;
    private counter: number;
    private retargetCount: number = 0;
    private seekSpeed: number;
    private totalImpulseVector: b2Vec2;
    private hoverLoop: AreaSoundLoop;
    private beepLoop: AreaSoundLoop;

    constructor(param1: Special) {
        super();
        var _loc2_: HomingMineRef = param1 as HomingMineRef;
        this.createBodies(new b2Vec2(_loc2_.x, _loc2_.y));
        this.mc = new HomingMineMC();
        var _loc3_: Sprite = Settings.currentSession.level.background;
        _loc3_.addChild(this.mc);
        this.laserSprite = new Sprite();
        _loc3_.addChild(this.laserSprite);
        this.seekSpeed = _loc2_.seekSpeed * 0.01;
        this.counter = _loc2_.explosionDelay * 30;
        this.targetDictionary = new Dictionary();
        this.totalImpulseVector = new b2Vec2();
        var _loc4_: ContactListener = Settings.currentSession.contactListener;
        _loc4_.registerListener(
            ContactListener.ADD,
            this.rangeSensor,
            this.targetAdd,
        );
        _loc4_.registerListener(
            ContactListener.REMOVE,
            this.rangeSensor,
            this.targetRemove,
        );
        _loc4_.registerListener(
            ContactListener.RESULT,
            this.mineShape,
            this.mineResult,
        );
        Settings.currentSession.level.paintItemVector.push(this);
        Settings.currentSession.level.actionsVector.push(this);
        // var _loc5_ = new BevelFilter(
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
            [/*_loc5_*/],
        );
    }

    public createBodies(param1: b2Vec2) {
        var _loc2_ = new b2BodyDef();
        _loc2_.allowSleep = false;
        _loc2_.position = new b2Vec2(
            param1.x / this.m_physScale,
            param1.y / this.m_physScale,
        );
        var _loc3_ = new b2CircleDef();
        _loc3_.density = 1;
        _loc3_.friction = 1;
        _loc3_.restitution = 0.1;
        _loc3_.filter.categoryBits = 8;
        _loc3_.radius = 10 / this.m_physScale;
        this.mineBody = Settings.currentSession.m_world.CreateBody(_loc2_);
        this.mineShape = this.mineBody.CreateShape(_loc3_);
        this.mineBody.SetMassFromShapes();
        _loc3_.filter.groupIndex = -20;
        _loc3_.isSensor = true;
        _loc3_.radius = HomingMine.SENSOR_RADIUS / this.m_physScale;
        this.rangeSensor = this.mineBody.CreateShape(_loc3_);
        this.targetingBody = Settings.currentSession.m_world.CreateBody(_loc2_);
        var _loc4_ = new b2PolygonDef();
        _loc4_.isSensor = true;
        _loc4_.density = 1;
        _loc4_.filter.categoryBits = 8;
        _loc4_.filter.groupIndex = -20;
        var _loc5_: number = _loc3_.radius * 0.5;
        _loc4_.SetAsOrientedBox(
            2 / this.m_physScale,
            _loc5_,
            new b2Vec2(0, -_loc5_),
            0,
        );
        this.targetingSensor = this.targetingBody.CreateShape(_loc4_);
        this.targetingBody.SetMassFromShapes();
        this.targetingBody.DestroyShape(this.targetingSensor);
        this.targetingSensor = null;
        this.mineBody.m_linearVelocity.y += -0.3333333333333333;
        this.targetingBody.m_linearVelocity.y += -0.3333333333333333;
    }

    public override paint() {
        var _loc1_: b2Vec2 = this.mineBody.GetWorldCenter();
        this.mc.x = _loc1_.x * this.m_physScale;
        this.mc.y = _loc1_.y * this.m_physScale;
        var _loc2_: number = this.mineBody.GetAngle();
        this.mc.rotation = (_loc2_ * LevelItem.oneEightyOverPI) % 360;
        var _loc3_: number =
            this.totalImpulseVector.x * Math.cos(_loc2_) +
            this.totalImpulseVector.y * Math.sin(_loc2_);
        var _loc4_: number =
            this.totalImpulseVector.x * Math.sin(_loc2_) -
            this.totalImpulseVector.y * Math.cos(_loc2_);
        _loc3_ += (Math.random() * _loc3_ - _loc3_ * 0.5) * 0.5;
        _loc4_ += (Math.random() * _loc4_ - _loc4_ * 0.5) * 0.5;
        this.mc.jet1.scaleX = this.mc.jet1.scaleY =
            _loc4_ < 0 ? Math.min(-_loc4_ / this.seekSpeed, 2) : 0;
        this.mc.jet2.scaleX = this.mc.jet2.scaleY =
            _loc3_ < 0 ? Math.min(-_loc3_ / this.seekSpeed, 2) : 0;
        this.mc.jet3.scaleX = this.mc.jet3.scaleY =
            _loc4_ > 0 ? Math.min(_loc4_ / this.seekSpeed, 2) : 0;
        this.mc.jet4.scaleX = this.mc.jet4.scaleY =
            _loc3_ > 0 ? Math.min(_loc3_ / this.seekSpeed, 2) : 0;
    }

    public override actions() {
        var _loc5_: b2Vec2 = null;
        var _loc6_: b2Vec2 = null;
        var _loc7_: number = NaN;
        var _loc8_: number = NaN;
        var _loc9_: number = NaN;
        var _loc10_: number = NaN;
        var _loc11_: b2Vec2 = null;
        var _loc12_: b2Vec2 = null;
        var _loc13_: number = NaN;
        var _loc14_: b2Vec2 = null;
        var _loc15_: number = NaN;
        var _loc16_: number = NaN;
        var _loc17_: number = NaN;
        var _loc18_: number = NaN;
        var _loc19_: number = NaN;
        var _loc20_: b2Vec2 = null;
        if (this.countingDown) {
            --this.counter;
            if (this.counter <= 0) {
                this.explode();
                return;
            }
        }
        var _loc1_: b2Vec2 = this.mineBody.GetPosition();
        var _loc2_: b2Vec2 = this.mineBody.GetLinearVelocity();
        var _loc3_: number = this.mineBody.GetAngularVelocity();
        if (!this.target) {
            if (this.targetingSensor) {
                this.removeTargetingSensor();
            }
            this.findClosestTarget();
        }
        if (this.target) {
            _loc5_ = this.target.GetWorldCenter();
            _loc6_ = new b2Vec2(_loc5_.x - _loc1_.x, _loc5_.y - _loc1_.y);
            _loc7_ = _loc6_.LengthSquared();
            if (
                !this.countingDown &&
                (_loc7_ < HomingMine.EXPLOSION_DISTANCE || this.inContact)
            ) {
                if (this.counter <= 0) {
                    this.explode();
                    return;
                }
                this.mc.light.gotoAndPlay(5);
                this.countingDown = true;
                this.beepLoop = SoundController.instance.playAreaSoundLoop(
                    "HomingMineBeep",
                    this.mineBody,
                );
            }
            _loc8_ = Math.atan2(_loc6_.y, _loc6_.x) + Math.PI * 0.5;
            this.targetingBody.SetXForm(_loc1_, _loc8_);
            if (this.pathClear) {
                if (!this.countingDown) {
                    this.mc.light.gotoAndStop(3);
                }
                if (!this.hoverLoop) {
                    this.hoverLoop = SoundController.instance.playAreaSoundLoop(
                        "MineHover",
                        this.mineBody,
                    );
                    SoundController.instance.playAreaSoundInstance(
                        "HomingMineFind",
                        this.mineBody,
                    );
                }
                _loc11_ = _loc2_.Copy();
                _loc11_.Multiply(0.03333333333333333);
                _loc12_ = _loc6_.Copy();
                _loc12_.Normalize();
                _loc13_ = b2Math.b2Dot(_loc11_, _loc12_);
                _loc14_ = new b2Vec2(-_loc12_.y, _loc12_.x);
                _loc15_ = b2Math.b2Dot(_loc11_, _loc14_);
                if (Math.abs(_loc15_) > this.seekSpeed) {
                    if (_loc15_ > 0) {
                        _loc9_ = _loc14_.x * -this.seekSpeed;
                        _loc10_ = _loc14_.y * -this.seekSpeed;
                    } else {
                        _loc9_ = _loc14_.x * this.seekSpeed;
                        _loc10_ = _loc14_.y * this.seekSpeed;
                    }
                } else {
                    _loc16_ = _loc15_;
                    _loc17_ = this.seekSpeed;
                    _loc18_ = _loc16_ * _loc16_ + _loc17_ * _loc17_;
                    _loc19_ = Math.sqrt(_loc18_);
                    _loc20_ = _loc14_.Copy();
                    _loc20_.Multiply(-_loc16_);
                    _loc12_.Multiply(_loc19_);
                    _loc20_.Add(_loc12_);
                    _loc9_ = _loc20_.x;
                    _loc10_ = _loc20_.y;
                }
            } else {
                _loc9_ =
                    (-_loc2_.x * HomingMine.SLOWING_FACTOR) /
                    this.mineBody.m_invMass;
                _loc10_ =
                    (-_loc2_.y * HomingMine.SLOWING_FACTOR) /
                    this.mineBody.m_invMass;
                if (!this.countingDown) {
                    this.mc.light.gotoAndStop(2);
                }
                if (this.hoverLoop) {
                    this.hoverLoop.fadeOut(0.5);
                    this.hoverLoop = null;
                    SoundController.instance.playAreaSoundInstance(
                        "HomingMineLose",
                        this.mineBody,
                    );
                }
            }
            this.retargetCount += 1;
            if (this.retargetCount == 5) {
                this.findClosestTarget();
            }
        } else {
            _loc9_ =
                (-_loc2_.x * HomingMine.SLOWING_FACTOR) /
                this.mineBody.m_invMass;
            _loc10_ =
                (-_loc2_.y * HomingMine.SLOWING_FACTOR) /
                this.mineBody.m_invMass;
            if (this.hoverLoop) {
                this.hoverLoop.fadeOut(0.5);
                this.hoverLoop = null;
                SoundController.instance.playAreaSoundInstance(
                    "HomingMineLose",
                    this.mineBody,
                );
            }
        }
        this.pathClear = true;
        var _loc4_: number =
            (-_loc3_ * HomingMine.SLOWING_FACTOR) / this.mineBody.m_invI;
        this.mineBody.m_linearVelocity.x += this.mineBody.m_invMass * _loc9_;
        this.mineBody.m_linearVelocity.y += this.mineBody.m_invMass * _loc10_;
        this.mineBody.m_angularVelocity += this.mineBody.m_invI * _loc4_;
        this.mineBody.m_linearVelocity.y += HomingMine.GRAVITY_DISPLACEMENT;
        this.targetingBody.m_linearVelocity.y +=
            HomingMine.GRAVITY_DISPLACEMENT;
        this.totalImpulseVector.Set(_loc9_, _loc10_ - this.seekSpeed * 0.5);
    }

    public override singleAction() {
        trace("SINGLE ACTION FUCK");
        var _loc1_ = Settings.currentSession.level.actionsVector;
        var _loc2_ = int(_loc1_.indexOf(this));
        if (_loc2_ > -1) {
            _loc1_.splice(_loc2_, 1);
        }
        this.explode();
    }

    private explode() {
        var _loc3_: MovieClip = null;
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
        _loc3_ = new Explosion2();
        _loc3_.x = this.mc.x;
        _loc3_.y = this.mc.y;
        _loc3_.scaleX = _loc3_.scaleY = 0.5;
        if (Math.random() > 0.5) {
            _loc3_.scaleX *= -1;
        }
        _loc3_.rotation = (this.mineBody.GetAngle() * 180) / Math.PI;
        _loc1_.containerSprite.addChildAt(_loc3_, 1);
        if (this.targetingSensor) {
            this.removeTargetingSensor();
        }
        var _loc4_: ContactListener = _loc1_.contactListener;
        _loc4_.deleteListener(ContactListener.ADD, this.rangeSensor);
        _loc4_.deleteListener(ContactListener.REMOVE, this.rangeSensor);
        _loc4_.deleteListener(ContactListener.ADD, this.mineShape);
        _loc4_.deleteListener(ContactListener.RESULT, this.mineShape);
        _loc2_.DestroyBody(this.mineBody);
        _loc2_.DestroyBody(this.targetingBody);
        this.mc.visible = false;
        this.mc.light.gotoAndStop(1);
        var _loc5_ = new Array();
        var _loc6_: number = 2.6;
        var _loc7_ = new b2AABB();
        var _loc8_: b2Vec2 = this.mineBody.GetWorldCenter();
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
        if (this.hoverLoop) {
            this.hoverLoop.stopSound();
        }
        if (this.beepLoop) {
            this.beepLoop.stopSound();
        }
        SoundController.instance.playAreaSoundInstance(
            "MineExplosion",
            this.mineBody,
        );
        _loc1_.particleController.createBurst(
            "metalpieces",
            10,
            50,
            this.mineBody,
            25,
        );
        this.mineBody = null;
        var _loc12_: LevelB2D = _loc1_.level;
        _loc12_.removeFromPaintItemVector(this);
        _loc12_.removeFromActionsVector(this);
    }

    private findClosestTarget() {
        var _loc3_ = undefined;
        var _loc4_: b2Body = null;
        var _loc5_: b2Vec2 = null;
        var _loc6_: b2Vec2 = null;
        var _loc7_: number = NaN;
        this.retargetCount = 0;
        var _loc1_: number = 1000000;
        var _loc2_: b2Vec2 = this.mineBody.GetPosition();
        for (_loc3_ of this.targetDictionary.keys()) {
            _loc4_ = _loc3_ as b2Body;
            _loc5_ = _loc4_.GetWorldCenter();
            _loc6_ = new b2Vec2(_loc5_.x - _loc2_.x, _loc5_.y - _loc2_.y);
            _loc7_ = _loc6_.LengthSquared();
            if (_loc7_ < _loc1_) {
                _loc1_ = _loc7_;
                this.target = _loc4_;
            }
        }
        if (Boolean(this.target) && !this.targetingSensor) {
            this.createTargetSensor();
        }
    }

    private mineResult(param1: ContactEvent) {
        var _loc2_: LevelB2D = null;
        var _loc3_: ContactListener = null;
        if (param1.impulse > HomingMine.SMASH_IMPULSE) {
            trace("homing mine impulse " + param1.impulse);
            _loc2_ = Settings.currentSession.level;
            _loc2_.singleActionVector.push(this);
            _loc3_ = Settings.currentSession.contactListener;
            _loc3_.deleteListener(ContactListener.ADD, this.mineShape);
            _loc3_.deleteListener(ContactListener.RESULT, this.mineShape);
        } else if (param1.otherShape.GetMaterial() & 2) {
            this.inContact = true;
        }
    }

    private targetAdd(param1: b2ContactPoint) {
        var _loc2_: b2Body = null;
        var _loc3_: number = 0;
        if (param1.shape2.GetMaterial() & 2) {
            _loc2_ = param1.shape2.GetBody();
            if (this.targetDictionary.get(_loc2_)) {
                _loc3_ = int(this.targetDictionary.get(_loc2_));
                this.targetDictionary.set(_loc2_, _loc3_ + 1);
            } else {
                this.targetDictionary.set(_loc2_, 1);
            }
        }
    }

    private targetRemove(param1: b2ContactPoint) {
        var _loc2_: b2Body = null;
        var _loc3_: number = 0;
        if (param1.shape2.GetMaterial() & 2) {
            _loc2_ = param1.shape2.GetBody();
            if (this.targetDictionary.get(_loc2_)) {
                _loc3_ = int(this.targetDictionary.get(_loc2_));
                _loc3_--;
                if (_loc3_ == 0) {
                    this.targetDictionary.delete(_loc2_);
                    if (this.target) {
                        if (_loc2_ == this.target) {
                            this.target = null;
                            if (!this.countingDown) {
                                this.mc.light.gotoAndStop(1);
                            }
                        }
                    }
                } else {
                    this.targetDictionary.set(_loc2_, _loc3_);
                }
            }
        }
    }

    private createTargetSensor() {
        var _loc1_ = new b2PolygonDef();
        _loc1_.isSensor = true;
        _loc1_.density = 1;
        _loc1_.filter.categoryBits = 8;
        _loc1_.filter.groupIndex = -20;
        var _loc2_: number =
            (HomingMine.SENSOR_RADIUS * 0.5) / this.m_physScale;
        _loc1_.SetAsOrientedBox(
            2 / this.m_physScale,
            _loc2_,
            new b2Vec2(0, -_loc2_),
            0,
        );
        this.targetingSensor = this.targetingBody.CreateShape(_loc1_);
        var _loc3_: ContactListener = Settings.currentSession.contactListener;
        _loc3_.registerListener(
            ContactListener.ADD,
            this.targetingSensor,
            this.checkAdd,
        );
        _loc3_.registerListener(
            ContactListener.PERSIST,
            this.targetingSensor,
            this.checkPersist,
        );
        this.pathClear = false;
    }

    private removeTargetingSensor() {
        var _loc1_: ContactListener = Settings.currentSession.contactListener;
        _loc1_.deleteListener(ContactListener.ADD, this.targetingSensor);
        _loc1_.deleteListener(ContactListener.PERSIST, this.targetingSensor);
        this.targetingBody.DestroyShape(this.targetingSensor);
        this.targetingSensor = null;
    }

    private checkAdd(param1: b2ContactPoint) {
        if (!this.target) {
            this.pathClear = false;
            return;
        }
        var _loc2_: b2Shape = param1.shape2;
        var _loc3_: b2Body = _loc2_.m_body;
        var _loc4_: number = _loc3_.GetMass();
        var _loc5_: number = _loc2_.m_density;
        if (_loc2_.IsSensor()) {
            return;
        }
        if (_loc4_ > 0 && _loc5_ < 10) {
            return;
        }
        var _loc6_: b2Vec2 = this.targetingBody.GetPosition();
        var _loc7_: b2Vec2 = this.target.GetWorldCenter();
        var _loc8_ = new b2Segment();
        _loc8_.p1 = _loc6_;
        _loc8_.p2 = _loc7_;
        var _loc9_: any[] = [];
        var _loc10_ = new b2Vec2();
        var _loc11_: boolean = _loc2_.TestSegment(
            _loc3_.m_xf,
            _loc9_,
            _loc10_,
            _loc8_,
            1,
        );
        if (_loc11_) {
            this.pathClear = false;
        }
    }

    private checkPersist(param1: b2ContactPoint) {
        if (!this.target) {
            this.pathClear = false;
            return;
        }
        var _loc2_: b2Shape = param1.shape2;
        var _loc3_: b2Body = _loc2_.m_body;
        var _loc4_: number = _loc3_.GetMass();
        var _loc5_: number = _loc2_.m_density;
        if (_loc2_.IsSensor()) {
            return;
        }
        if (_loc4_ > 0 && _loc5_ < 10) {
            return;
        }
        var _loc6_: b2Vec2 = this.targetingBody.GetPosition();
        var _loc7_: b2Vec2 = this.target.GetWorldCenter();
        var _loc8_ = new b2Segment();
        _loc8_.p1 = _loc6_;
        _loc8_.p2 = _loc7_;
        var _loc9_: any[] = [];
        var _loc10_ = new b2Vec2();
        var _loc11_: boolean = _loc2_.TestSegment(
            _loc3_.m_xf,
            _loc9_,
            _loc10_,
            _loc8_,
            1,
        );
        if (_loc11_) {
            this.pathClear = false;
        }
    }

    public override triggerSingleActivation(
        param1: Trigger,
        param2: string,
        param3: any[],
    ) {
        var _loc4_: Vector<LevelItem> = null;
        var _loc5_: number = 0;
        if (this._triggered) {
            return;
        }
        this._triggered = true;
        if (this.mineBody) {
            _loc4_ = Settings.currentSession.level.singleActionVector;
            _loc5_ = int(_loc4_.indexOf(this));
            if (_loc5_ > -1) {
                return;
            }
            this.singleAction();
        }
    }

    public override get bodyList(): any[] {
        if (this.mineBody) {
            return [this.mineBody];
        }
        return [];
    }
}