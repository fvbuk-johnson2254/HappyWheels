import b2ContactPoint from "@/Box2D/Collision/b2ContactPoint";
import b2Segment from "@/Box2D/Collision/b2Segment";
import b2CircleDef from "@/Box2D/Collision/Shapes/b2CircleDef";
import b2PolygonDef from "@/Box2D/Collision/Shapes/b2PolygonDef";
import b2PolygonShape from "@/Box2D/Collision/Shapes/b2PolygonShape";
import b2Shape from "@/Box2D/Collision/Shapes/b2Shape";
import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import b2Body from "@/Box2D/Dynamics/b2Body";
import b2BodyDef from "@/Box2D/Dynamics/b2BodyDef";
import b2RevoluteJoint from "@/Box2D/Dynamics/Joints/b2RevoluteJoint";
import b2RevoluteJointDef from "@/Box2D/Dynamics/Joints/b2RevoluteJointDef";
import CharacterB2D from "@/com/totaljerkface/game/character/CharacterB2D";
import ContactListener from "@/com/totaljerkface/game/ContactListener";
import ArrowGunRef from "@/com/totaljerkface/game/editor/specials/ArrowGunRef";
import Special from "@/com/totaljerkface/game/editor/specials/Special";
import LevelItem from "@/com/totaljerkface/game/level/LevelItem";
import Arrow from "@/com/totaljerkface/game/level/userspecials/Arrow";
import MemoryTest from "@/com/totaljerkface/game/MemoryTest";
import Session from "@/com/totaljerkface/game/Session";
import Settings from "@/com/totaljerkface/game/Settings";
import SoundController from "@/com/totaljerkface/game/sound/SoundController";
import ArrowGunMC from "@/top/ArrowGunMC";
import { boundClass } from 'autobind-decorator';
import DisplayObject from "flash/display/DisplayObject";
import Sprite from "flash/display/Sprite";
import Point from "flash/geom/Point";

@boundClass
export default class ArrowGun extends LevelItem {
    private mc: ArrowGunMC;
    private laserSprite: Sprite;
    private laserColor: number;
    private rangeSensor: b2Shape;
    private targetSensor: b2Shape;
    private targetAngle: number;
    private targetLength: number;
    private baseBody: b2Body;
    private turretBody: b2Body;
    private turretJoint: b2RevoluteJoint;
    private targetBody: b2Body;
    private targetDictionary: Dictionary<any, any>;
    private pathClear: boolean;
    private aligned: boolean;
    private arrows: any[];
    private arrowsLeft: number = 10;
    private framesPerShot: number = 3;
    private frameCount: number = 0;
    private retargetCount: number = 0;
    private _firingAllowed: boolean = true;
    private _unlimitedArrows: boolean;
    private type: number = 0;

    constructor(param1: Special, param2: b2Body = null, param3: Point = null) {
        super();
        var _loc4_: ArrowGunRef = null;
        this.arrows = new Array();

        _loc4_ = param1 as ArrowGunRef;
        if (param2) {
            this.baseBody = param2;
        }
        var _loc5_ = new b2Vec2(_loc4_.x, _loc4_.y);
        if (param3) {
            _loc5_.Add(new b2Vec2(param3.x, param3.y));
        }
        this.createBody(
            _loc5_,
            (_loc4_.rotation * Math.PI) / 180,
            _loc4_.immovable2,
        );
        this.framesPerShot = 23 - _loc4_.rateOfFire * 2;
        this.mc = new ArrowGunMC();
        this.mc.turret.gotoAndStop(1);
        this.mc.x = _loc4_.x;
        this.mc.y = _loc4_.y;
        this.mc.rotation = _loc4_.rotation;
        var _loc6_: Sprite = Settings.currentSession.level.background;
        _loc6_.addChild(this.mc);
        this.laserSprite = new Sprite();
        _loc6_.addChild(this.laserSprite);
        this.targetDictionary = new Dictionary();
        var _loc7_: ContactListener = Settings.currentSession.contactListener;
        if (_loc4_.dontShootPlayer) {
            _loc7_.registerListener(
                ContactListener.ADD,
                this.rangeSensor,
                this.targetAdd2,
            );
            _loc7_.registerListener(
                ContactListener.REMOVE,
                this.rangeSensor,
                this.targetRemove2,
            );
        } else {
            _loc7_.registerListener(
                ContactListener.ADD,
                this.rangeSensor,
                this.targetAdd,
            );
            _loc7_.registerListener(
                ContactListener.REMOVE,
                this.rangeSensor,
                this.targetRemove,
            );
        }
        Settings.currentSession.level.actionsVector.push(this);
        Settings.currentSession.level.paintItemVector.push(this);
        MemoryTest.instance.addEntry("ag_", this);
    }

    private createBody(param1: b2Vec2, param2: number, param3: boolean) {
        var _loc7_: b2Vec2 = null;
        var _loc8_: b2BodyDef = null;
        var _loc9_: b2Vec2 = null;
        var _loc10_: b2Vec2 = null;
        var _loc11_: b2RevoluteJointDef = null;
        var _loc12_: b2Shape = null;
        var _loc4_ = new b2PolygonDef();
        _loc4_.friction = 0.5;
        _loc4_.restitution = 0.1;
        _loc4_.filter.categoryBits = 8;
        _loc4_.filter.groupIndex = -20;
        var _loc5_ = new b2CircleDef();
        _loc5_.filter.categoryBits = 8;
        _loc5_.filter.groupIndex = -20;
        _loc5_.density = 1;
        var _loc6_: Session = Settings.currentSession;
        if (param3) {
            _loc4_.SetAsOrientedBox(
                14 / this.m_physScale,
                8 / this.m_physScale,
                new b2Vec2(
                    param1.x / this.m_physScale,
                    param1.y / this.m_physScale,
                ),
                param2,
            );
            _loc6_.level.levelBody.CreateShape(_loc4_) as b2PolygonShape;
            _loc4_.isSensor = true;
            _loc4_.SetAsOrientedBox(
                400 / this.m_physScale,
                200 / this.m_physScale,
                new b2Vec2(
                    (param1.x - Math.sin(param2) * -200) / this.m_physScale,
                    (param1.y + Math.cos(param2) * -200) / this.m_physScale,
                ),
                param2,
            );
            this.rangeSensor = _loc6_.level.levelBody.CreateShape(_loc4_);
            _loc7_ = (this.rangeSensor as b2PolygonShape).m_vertices[0];
            _loc8_ = new b2BodyDef();
            _loc9_ = new b2Vec2(
                (param1.x - Math.sin(param2) * -27) / this.m_physScale,
                (param1.y + Math.cos(param2) * -27) / this.m_physScale,
            );
            _loc8_.position = _loc9_;
            _loc8_.angle = param2;
            this.turretBody = _loc6_.m_world.CreateBody(_loc8_);
            _loc10_ = new b2Vec2(_loc7_.x - _loc9_.x, _loc7_.y - _loc9_.y);
            this.targetLength = _loc10_.Length() + 0.5;
            _loc11_ = new b2RevoluteJointDef();
            _loc11_.maxMotorTorque = 10000;
            _loc11_.collideConnected = true;
            _loc11_.Initialize(this.turretBody, _loc6_.level.levelBody, _loc9_);
            this.turretJoint = _loc6_.m_world.CreateJoint(
                _loc11_,
            ) as b2RevoluteJoint;
        } else if (this.baseBody) {
            this.type = 2;
            _loc4_.density = 3;
            _loc4_.filter.groupIndex = 0;
            _loc4_.SetAsOrientedBox(
                14 / this.m_physScale,
                8 / this.m_physScale,
                new b2Vec2(
                    param1.x / this.m_physScale,
                    param1.y / this.m_physScale,
                ),
                param2,
            );
            this.baseBody.CreateShape(_loc4_) as b2PolygonShape;
            _loc4_.density = 0;
            _loc4_.filter.groupIndex = -20;
            _loc4_.isSensor = true;
            _loc4_.SetAsOrientedBox(
                400 / this.m_physScale,
                200 / this.m_physScale,
                new b2Vec2(
                    (param1.x - Math.sin(param2) * -200) / this.m_physScale,
                    (param1.y + Math.cos(param2) * -200) / this.m_physScale,
                ),
                param2,
            );
            this.rangeSensor = this.baseBody.CreateShape(_loc4_);
            _loc7_ = this.baseBody.GetWorldPoint(
                (this.rangeSensor as b2PolygonShape).m_vertices[0],
            );
            _loc8_ = new b2BodyDef();
            _loc9_ = this.baseBody.GetWorldPoint(
                new b2Vec2(
                    (param1.x - Math.sin(param2) * -27) / this.m_physScale,
                    (param1.y + Math.cos(param2) * -27) / this.m_physScale,
                ),
            );
            _loc8_.position = _loc9_;
            _loc8_.angle = param2;
            this.turretBody = _loc6_.m_world.CreateBody(_loc8_);
            _loc5_.localPosition = new b2Vec2(0, 0);
            _loc5_.radius = 2 / this.m_physScale;
            _loc12_ = this.turretBody.CreateShape(_loc5_);
            this.turretBody.SetMassFromShapes();
            this.turretBody.DestroyShape(_loc12_);
            _loc10_ = new b2Vec2(_loc7_.x - _loc9_.x, _loc7_.y - _loc9_.y);
            this.targetLength = _loc10_.Length() + 0.5;
            _loc11_ = new b2RevoluteJointDef();
            _loc11_.maxMotorTorque = 10000;
            _loc11_.collideConnected = true;
            _loc11_.Initialize(this.turretBody, this.baseBody, _loc9_);
            this.turretJoint = _loc6_.m_world.CreateJoint(
                _loc11_,
            ) as b2RevoluteJoint;
        } else {
            this.type = 1;
            _loc4_.density = 3;
            _loc8_ = new b2BodyDef();
            _loc8_.position = new b2Vec2(
                param1.x / this.m_physScale,
                param1.y / this.m_physScale,
            );
            _loc8_.angle = param2;
            this.baseBody = _loc6_.m_world.CreateBody(_loc8_);
            _loc4_.filter.groupIndex = 0;
            _loc4_.SetAsBox(14 / this.m_physScale, 8 / this.m_physScale);
            this.baseBody.CreateShape(_loc4_) as b2PolygonShape;
            this.baseBody.SetMassFromShapes();
            _loc4_.filter.groupIndex = -20;
            _loc4_.density = 0;
            _loc4_.isSensor = true;
            _loc4_.SetAsOrientedBox(
                400 / this.m_physScale,
                200 / this.m_physScale,
                new b2Vec2(0, -200 / this.m_physScale),
                0,
            );
            this.rangeSensor = this.baseBody.CreateShape(_loc4_);
            _loc7_ = this.baseBody.GetWorldPoint(
                (this.rangeSensor as b2PolygonShape).m_vertices[0],
            );
            _loc9_ = new b2Vec2(
                (param1.x - Math.sin(param2) * -27) / this.m_physScale,
                (param1.y + Math.cos(param2) * -27) / this.m_physScale,
            );
            _loc8_.position = _loc9_;
            this.turretBody = _loc6_.m_world.CreateBody(_loc8_);
            _loc5_.localPosition = new b2Vec2(0, 0);
            _loc5_.radius = 2 / this.m_physScale;
            _loc12_ = this.turretBody.CreateShape(_loc5_);
            this.turretBody.SetMassFromShapes();
            this.turretBody.DestroyShape(_loc12_);
            _loc10_ = new b2Vec2(_loc7_.x - _loc9_.x, _loc7_.y - _loc9_.y);
            this.targetLength = _loc10_.Length() + 0.5;
            _loc11_ = new b2RevoluteJointDef();
            _loc11_.maxMotorTorque = 10000;
            _loc11_.collideConnected = true;
            _loc11_.Initialize(this.turretBody, this.baseBody, _loc9_);
            this.turretJoint = _loc6_.m_world.CreateJoint(
                _loc11_,
            ) as b2RevoluteJoint;
        }
        if (Settings.currentSession.version > 1.55) {
            this.turretJoint.SetMotorSpeed(0);
            this.turretJoint.EnableMotor(true);
        }
    }

    public override actions() {
        var _loc2_: b2Vec2 = null;
        var _loc3_: b2Vec2 = null;
        var _loc4_: number = NaN;
        var _loc5_: number = NaN;
        var _loc6_: number = NaN;
        var _loc7_: number = NaN;
        var _loc8_: Arrow = null;
        var _loc1_: b2Vec2 = this.turretBody.GetPosition();
        if (!this.targetBody && this._firingAllowed) {
            if (this.targetSensor) {
                this.removeTargetSensor();
            }
            this.findClosestTarget(_loc1_);
        }
        if (this.targetBody) {
            if (
                this.pathClear &&
                this.aligned &&
                this.frameCount == 0 &&
                this._firingAllowed
            ) {
                if (this.arrows.length > 9) {
                    _loc8_ = this.arrows[0];
                    this.arrows.splice(0, 1);
                    _loc8_.remoteBreak();
                }
                _loc8_ = this.fireArrow();
                if (this.unlimitedArrows) {
                    if (_loc8_) {
                        this.arrows.push(_loc8_);
                    }
                } else {
                    --this.arrowsLeft;
                }
                this.frameCount = this.framesPerShot;
                if (this.arrowsLeft <= 0) {
                    Settings.currentSession.level.removeFromActionsVector(this);
                    if (this.baseBody) {
                        this.baseBody.DestroyShape(this.rangeSensor);
                    } else {
                        Settings.currentSession.level.levelBody.DestroyShape(
                            this.rangeSensor,
                        );
                    }
                    this.removeTargetSensor();
                    Settings.currentSession.m_world.DestroyBody(
                        this.turretBody,
                    );
                    this.turretBody = null;
                    this.die();
                    return;
                }
            }
            _loc2_ = this.targetBody.GetWorldCenter();
            _loc3_ = new b2Vec2(_loc2_.x - _loc1_.x, _loc2_.y - _loc1_.y);
            _loc4_ = Math.atan2(_loc3_.y, _loc3_.x) + Math.PI * 0.5;
            this.aligned = false;
            _loc5_ = this.turretBody.GetAngle();
            _loc6_ = _loc5_ - _loc4_;
            _loc7_ = Math.PI * 2;
            if (_loc6_ > Math.PI) {
                _loc6_ -= _loc7_;
            }
            if (_loc6_ < -Math.PI) {
                _loc6_ += _loc7_;
            }
            if (Math.abs(_loc6_) > 0.52) {
                _loc4_ += _loc6_ * 0.5;
            } else {
                this.aligned = true;
            }
            this.turretBody.SetXForm(_loc1_, _loc4_);
            this.turretBody.SetAngularVelocity(0);
            this.retargetCount += 1;
            if (this.retargetCount == 5) {
                this.findClosestTarget(_loc1_);
            }
        }
        this.pathClear = true;
        this.frameCount = Math.max(0, this.frameCount - 1);
    }

    private findClosestTarget(param1: b2Vec2) {
        var _loc3_ = undefined;
        var _loc4_: b2Body = null;
        var _loc5_: b2Vec2 = null;
        var _loc6_: b2Vec2 = null;
        var _loc7_: number = NaN;
        this.retargetCount = 0;
        var _loc2_: number = 1000000;
        for (_loc3_ of this.targetDictionary.keys()) {
            _loc4_ = _loc3_ as b2Body;
            _loc5_ = _loc4_.GetWorldCenter();
            _loc6_ = new b2Vec2(_loc5_.x - param1.x, _loc5_.y - param1.y);
            _loc7_ = _loc6_.LengthSquared();
            if (_loc7_ < _loc2_) {
                _loc2_ = _loc7_;
                this.targetBody = _loc4_;
            }
        }
        if (Boolean(this.targetBody) && !this.targetSensor) {
            this.createTargetSensor(this.targetLength);
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
                    if (this.targetBody) {
                        if (_loc2_ == this.targetBody) {
                            this.targetBody = null;
                        }
                    }
                } else {
                    this.targetDictionary.set(_loc2_, _loc3_);
                }
            }
        }
    }

    private targetAdd2(param1: b2ContactPoint) {
        var _loc2_: b2Body = null;
        var _loc3_: number = 0;
        if (param1.shape2.GetUserData() instanceof CharacterB2D) {
            return;
        }
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

    private targetRemove2(param1: b2ContactPoint) {
        var _loc2_: b2Body = null;
        var _loc3_: number = 0;
        if (param1.shape2.GetUserData() instanceof CharacterB2D) {
            return;
        }
        if (param1.shape2.GetMaterial() & 2) {
            _loc2_ = param1.shape2.GetBody();
            if (this.targetDictionary.get(_loc2_)) {
                _loc3_ = int(this.targetDictionary.get(_loc2_));
                _loc3_--;
                if (_loc3_ == 0) {
                    this.targetDictionary.delete(_loc2_);
                    if (this.targetBody) {
                        if (_loc2_ == this.targetBody) {
                            this.targetBody = null;
                        }
                    }
                } else {
                    this.targetDictionary.set(_loc2_, _loc3_);
                }
            }
        }
    }

    private createTargetSensor(param1: number) {
        var _loc2_ = new b2PolygonDef();
        _loc2_.isSensor = true;
        _loc2_.density = 1e-7;
        _loc2_.filter.categoryBits = 8;
        _loc2_.filter.groupIndex = -20;
        var _loc3_: number = param1 * 0.5;
        _loc2_.SetAsOrientedBox(
            2 / this.m_physScale,
            _loc3_,
            new b2Vec2(0, -_loc3_),
            0,
        );
        this.targetSensor = this.turretBody.CreateShape(_loc2_);
        this.turretBody.SetMassFromShapes();
        var _loc4_: ContactListener = Settings.currentSession.contactListener;
        _loc4_.registerListener(
            ContactListener.ADD,
            this.targetSensor,
            this.checkAdd,
        );
        _loc4_.registerListener(
            ContactListener.PERSIST,
            this.targetSensor,
            this.checkPersist,
        );
        this.pathClear = false;
        this.turretJoint.EnableMotor(false);
    }

    private removeTargetSensor() {
        var _loc1_: ContactListener = Settings.currentSession.contactListener;
        _loc1_.deleteListener(ContactListener.ADD, this.targetSensor);
        _loc1_.deleteListener(ContactListener.PERSIST, this.targetSensor);
        this.turretBody.DestroyShape(this.targetSensor);
        this.targetSensor = null;
        this.turretJoint.SetMotorSpeed(0);
        this.turretJoint.EnableMotor(true);
    }

    private checkAdd(param1: b2ContactPoint) {
        if (!this.targetBody) {
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
        var _loc6_: b2Vec2 = this.turretBody.GetPosition();
        var _loc7_: b2Vec2 = this.targetBody.GetWorldCenter();
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
        if (!this.targetBody) {
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
        var _loc6_: b2Vec2 = this.turretBody.GetPosition();
        var _loc7_: b2Vec2 = this.targetBody.GetWorldCenter();
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

    private fireArrow(): Arrow {
        var _loc19_: b2Vec2 = null;
        var _loc1_: number = 2000 / this.m_physScale;
        var _loc2_: b2Vec2 = this.targetBody.GetLinearVelocity();
        var _loc3_: b2Vec2 = this.targetBody.GetWorldCenter();
        var _loc4_: b2Vec2 = this.turretBody.GetPosition();
        if (this.baseBody) {
            _loc19_ = this.baseBody.GetLinearVelocityFromWorldPoint(_loc4_);
            _loc2_.Subtract(_loc19_);
        }
        var _loc5_: number =
            Math.pow(_loc2_.x, 2) + Math.pow(_loc2_.y, 2) - Math.pow(_loc1_, 2);
        var _loc6_: number =
            2 *
            (_loc2_.x * (_loc3_.x - _loc4_.x) +
                _loc2_.y * (_loc3_.y - _loc4_.y));
        var _loc7_: number =
            Math.pow(_loc3_.x - _loc4_.x, 2) + Math.pow(_loc3_.y - _loc4_.y, 2);
        var _loc8_: number = Math.pow(_loc6_, 2) - 4 * _loc5_ * _loc7_;
        if (_loc8_ < 0) {
            return null;
        }
        var _loc9_: number = (-_loc6_ + Math.sqrt(_loc8_)) / (2 * _loc5_);
        var _loc10_: number = (-_loc6_ - Math.sqrt(_loc8_)) / (2 * _loc5_);
        _loc9_ = _loc9_ < 0 ? 10000 : _loc9_;
        _loc10_ = _loc10_ < 0 ? 10000 : _loc10_;
        var _loc11_: number = Math.min(_loc9_, _loc10_);
        var _loc12_: number = _loc11_ * _loc2_.x + _loc3_.x;
        var _loc13_: number = _loc11_ * _loc2_.y + _loc3_.y;
        var _loc14_: b2Vec2 = this.targetBody.GetWorldCenter();
        var _loc15_ = new b2Vec2(_loc12_ - _loc4_.x, _loc13_ - _loc4_.y);
        var _loc16_: number = Math.atan2(_loc15_.y, _loc15_.x);
        var _loc17_ = new b2Vec2(
            _loc1_ * Math.cos(_loc16_),
            _loc1_ * Math.sin(_loc16_),
        );
        if (_loc19_) {
            _loc17_.Add(_loc19_);
        }
        var _loc18_ = new Arrow(
            _loc4_,
            _loc16_,
            _loc17_,
            this.mc.parent.getChildIndex(this.mc),
        );
        SoundController.instance.playAreaSoundInstance(
            "ArrowFire" + Math.ceil(Math.random() * 2),
            this.turretBody,
        );
        this.mc.turret.gotoAndPlay(2);
        return _loc18_;
    }

    public override paint() {
        var _loc1_: b2Vec2 = null;
        if (this.type == 1) {
            _loc1_ = this.baseBody.GetWorldCenter();
            this.mc.x = _loc1_.x * this.m_physScale;
            this.mc.y = _loc1_.y * this.m_physScale;
            this.mc.rotation =
                (this.baseBody.GetAngle() * LevelItem.oneEightyOverPI) % 360;
        }
        if (this.turretBody) {
            this.mc.turret.rotation =
                this.turretBody.GetAngle() * LevelItem.oneEightyOverPI -
                (this.mc.rotation + this.mc.parent.parent.rotation);
        }
    }

    public override getJointBody(param1: b2Vec2 = null): b2Body {
        return this.baseBody;
    }

    public override get groupDisplayObject(): DisplayObject {
        return this.mc;
    }

    public override die() {
        var _loc1_: ContactListener = Settings.currentSession.contactListener;
        _loc1_.deleteListener(ContactListener.ADD, this.rangeSensor);
        _loc1_.deleteListener(ContactListener.REMOVE, this.rangeSensor);
        if (this.targetSensor) {
            _loc1_.deleteListener(ContactListener.ADD, this.targetSensor);
            _loc1_.deleteListener(ContactListener.PERSIST, this.targetSensor);
        }
        this.targetDictionary = null;
        this.arrows = null;
    }

    public get firingAllowed(): boolean {
        return this._firingAllowed;
    }

    public set firingAllowed(param1: boolean) {
        this._firingAllowed = param1;
        if (!this._firingAllowed) {
            if (this.targetBody) {
                this.targetBody = null;
            }
            if (this.targetSensor) {
                this.removeTargetSensor();
            }
        }
    }

    public get unlimitedArrows(): boolean {
        return this._unlimitedArrows;
    }

    public set unlimitedArrows(param1: boolean) {
        this._unlimitedArrows = param1;
    }
}