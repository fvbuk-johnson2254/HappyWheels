import b2ContactPoint from "@/Box2D/Collision/b2ContactPoint";
import b2Segment from "@/Box2D/Collision/b2Segment";
import b2CircleDef from "@/Box2D/Collision/Shapes/b2CircleDef";
import b2PolygonDef from "@/Box2D/Collision/Shapes/b2PolygonDef";
import b2PolygonShape from "@/Box2D/Collision/Shapes/b2PolygonShape";
import b2Shape from "@/Box2D/Collision/Shapes/b2Shape";
import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import b2Body from "@/Box2D/Dynamics/b2Body";
import b2BodyDef from "@/Box2D/Dynamics/b2BodyDef";
import b2World from "@/Box2D/Dynamics/b2World";
import b2DistanceJoint from "@/Box2D/Dynamics/Joints/b2DistanceJoint";
import b2DistanceJointDef from "@/Box2D/Dynamics/Joints/b2DistanceJointDef";
import b2RevoluteJoint from "@/Box2D/Dynamics/Joints/b2RevoluteJoint";
import b2RevoluteJointDef from "@/Box2D/Dynamics/Joints/b2RevoluteJointDef";
import ContactListener from "@/com/totaljerkface/game/ContactListener";
import HarpoonGunRef from "@/com/totaljerkface/game/editor/specials/HarpoonGunRef";
import Special from "@/com/totaljerkface/game/editor/specials/Special";
import LevelItem from "@/com/totaljerkface/game/level/LevelItem";
import Trigger from "@/com/totaljerkface/game/level/Trigger";
import Harpoon from "@/com/totaljerkface/game/level/userspecials/Harpoon";
import Session from "@/com/totaljerkface/game/Session";
import Settings from "@/com/totaljerkface/game/Settings";
import SoundController from "@/com/totaljerkface/game/sound/SoundController";
import HarpoonGunMC from "@/top/HarpoonGunMC";
import { boundClass } from 'autobind-decorator';
import Sprite from "flash/display/Sprite";
import Event from "flash/events/Event";
import Point from "flash/geom/Point";

@boundClass
export default class HarpoonGun extends LevelItem {
    private mc: HarpoonGunMC;
    private harpoon: Harpoon;
    private laserSprite: Sprite;
    private laserColor: number;
    private useAnchor: boolean;
    private anchorSprite: Sprite;
    private fixedTurret: boolean;
    private turretAngle: number;
    private triggerFiring: boolean;
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
    private anchorJoints: any[];
    private disabled: boolean;

    constructor(param1: Special, param2: b2Body = null, param3: Point = null) {
        super();
        var _loc4_: HarpoonGunRef = param1 as HarpoonGunRef;
        this.fixedTurret = _loc4_.fixedAngleTurret;
        this.turretAngle = _loc4_.turretAngle;
        this.triggerFiring = _loc4_.triggerFiring;
        this.disabled = _loc4_.startDeactivated;
        this.useAnchor = _loc4_.useAnchor;
        if (param2) {
            this.baseBody = param2;
        }
        var _loc5_ = new b2Vec2(_loc4_.x, _loc4_.y);
        if (param3) {
            _loc5_.Add(new b2Vec2(param3.x, param3.y));
        }
        this.createBody(_loc5_, (_loc4_.rotation * Math.PI) / 180);
        this.mc = new HarpoonGunMC();
        this.mc.x = _loc4_.x;
        this.mc.y = _loc4_.y;
        this.mc.rotation = _loc4_.rotation;
        var _loc6_: Sprite = Settings.currentSession.level.background;
        this.anchorSprite = new Sprite();
        _loc6_.addChild(this.anchorSprite);
        _loc6_.addChild(this.mc);
        this.setLight();
        this.targetDictionary = new Dictionary();
        Settings.currentSession.level.paintItemVector.push(this);
    }

    private createBody(param1: b2Vec2, param2: number) {
        var _loc10_: ContactListener = null;
        var _loc3_ = new b2PolygonDef();
        _loc3_.friction = 0.5;
        _loc3_.restitution = 0.1;
        _loc3_.filter.categoryBits = 8;
        _loc3_.filter.groupIndex = -20;
        var _loc4_: Session = Settings.currentSession;
        _loc3_.SetAsOrientedBox(
            25 / this.m_physScale,
            16 / this.m_physScale,
            new b2Vec2(
                param1.x / this.m_physScale,
                param1.y / this.m_physScale,
            ),
            param2,
        );
        _loc4_.level.levelBody.CreateShape(_loc3_) as b2PolygonShape;
        _loc3_.isSensor = true;
        _loc3_.SetAsOrientedBox(
            400 / this.m_physScale,
            200 / this.m_physScale,
            new b2Vec2(
                (param1.x - Math.sin(param2) * -200) / this.m_physScale,
                (param1.y + Math.cos(param2) * -200) / this.m_physScale,
            ),
            param2,
        );
        this.rangeSensor = _loc4_.level.levelBody.CreateShape(_loc3_);
        var _loc5_: b2Vec2 = (this.rangeSensor as b2PolygonShape).m_vertices[0];
        var _loc6_ = new b2BodyDef();
        var _loc7_ = new b2Vec2(
            (param1.x - Math.sin(param2) * -35) / this.m_physScale,
            (param1.y + Math.cos(param2) * -35) / this.m_physScale,
        );
        _loc6_.position = _loc7_;
        _loc6_.angle = param2;
        this.turretBody = _loc4_.m_world.CreateBody(_loc6_);
        var _loc8_ = new b2Vec2(_loc5_.x - _loc7_.x, _loc5_.y - _loc7_.y);
        this.targetLength = _loc8_.Length() + 0.5;
        var _loc9_ = new b2RevoluteJointDef();
        _loc9_.maxMotorTorque = 10000;
        _loc9_.collideConnected = true;
        _loc9_.Initialize(this.turretBody, _loc4_.level.levelBody, _loc7_);
        this.turretJoint = _loc4_.m_world.CreateJoint(
            _loc9_,
        ) as b2RevoluteJoint;
        if (this.useAnchor) {
            this.createAnchor();
        }
        if (this.fixedTurret) {
            _loc4_.level.levelBody.DestroyShape(this.rangeSensor);
            this.rangeSensor = null;
            this.turretBody.SetXForm(
                this.turretBody.GetPosition(),
                param2 + this.turretAngle / LevelItem.oneEightyOverPI,
            );
            if (!this.triggerFiring) {
                this.createTargetSensor(this.targetLength);
                this.aligned = true;
                this.pathClear = true;
                Settings.currentSession.level.actionsVector.push(this);
            }
        } else {
            _loc10_ = Settings.currentSession.contactListener;
            _loc10_.registerListener(
                ContactListener.ADD,
                this.rangeSensor,
                this.targetAdd,
            );
            _loc10_.registerListener(
                ContactListener.REMOVE,
                this.rangeSensor,
                this.targetRemove,
            );
            Settings.currentSession.level.actionsVector.push(this);
        }
    }

    public override actions() {
        var _loc2_: ContactListener = null;
        var _loc3_: b2Vec2 = null;
        var _loc4_: b2Vec2 = null;
        var _loc5_: number = NaN;
        var _loc6_: number = NaN;
        var _loc7_: number = NaN;
        var _loc8_: number = NaN;
        if (this.disabled) {
            return;
        }
        var _loc1_: b2Vec2 = this.turretBody.GetPosition();
        if (!this.targetBody) {
            if (Boolean(this.targetSensor) && !this.fixedTurret) {
                this.removeTargetSensor();
            }
            this.findClosestTarget(_loc1_);
        }
        if (this.targetBody) {
            if (this.pathClear && this.aligned && !this.triggerFiring) {
                _loc2_ = Settings.currentSession.contactListener;
                if (this.fixedTurret) {
                    this.fireHarpoon2();
                    _loc2_.deleteListener(
                        ContactListener.REMOVE,
                        this.targetSensor,
                    );
                } else {
                    this.fireHarpoon();
                    _loc2_.deleteListener(
                        ContactListener.ADD,
                        this.rangeSensor,
                    );
                    _loc2_.deleteListener(
                        ContactListener.REMOVE,
                        this.rangeSensor,
                    );
                    Settings.currentSession.level.levelBody.DestroyShape(
                        this.rangeSensor,
                    );
                }
                this.removeTargetSensor();
                Settings.currentSession.level.removeFromActionsVector(this);
            }
            if (!this.fixedTurret) {
                _loc3_ = this.targetBody.GetWorldCenter();
                _loc4_ = new b2Vec2(_loc3_.x - _loc1_.x, _loc3_.y - _loc1_.y);
                _loc5_ = Math.atan2(_loc4_.y, _loc4_.x) + Math.PI * 0.5;
                this.aligned = false;
                _loc6_ = this.turretBody.GetAngle();
                _loc7_ = _loc6_ - _loc5_;
                _loc8_ = Math.PI * 2;
                if (_loc7_ > Math.PI) {
                    _loc7_ -= _loc8_;
                }
                if (_loc7_ < -Math.PI) {
                    _loc7_ += _loc8_;
                }
                if (Math.abs(_loc7_) > 0.52) {
                    _loc5_ += _loc7_ * 0.5;
                } else {
                    this.aligned = true;
                }
                this.turretBody.SetXForm(_loc1_, _loc5_);
                this.turretBody.SetAngularVelocity(0);
                this.turretBody.SetLinearVelocity(new b2Vec2(0, 0));
            }
        }
        this.pathClear = true;
    }

    private findClosestTarget(param1: b2Vec2) {
        var _loc3_ = undefined;
        var _loc4_: b2Body = null;
        var _loc5_: b2Vec2 = null;
        var _loc6_: b2Vec2 = null;
        var _loc7_: number = NaN;
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
        if (Boolean(this.targetBody) && !this.fixedTurret) {
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

    private targetAdd2(param1: b2ContactPoint) {
        this.targetAdd(param1);
        this.checkAdd(param1);
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

    private createTargetSensor(param1: number) {
        var _loc2_ = new b2PolygonDef();
        _loc2_.isSensor = true;
        _loc2_.density = 1;
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
        var _loc4_: ContactListener = Settings.currentSession.contactListener;
        if (this.fixedTurret) {
            _loc4_.registerListener(
                ContactListener.ADD,
                this.targetSensor,
                this.targetAdd2,
            );
            _loc4_.registerListener(
                ContactListener.REMOVE,
                this.targetSensor,
                this.targetRemove,
            );
            _loc4_.registerListener(
                ContactListener.PERSIST,
                this.targetSensor,
                this.checkPersist,
            );
        } else {
            this.turretBody.SetMassFromShapes();
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
        }
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
            if (!this.fixedTurret) {
                this.pathClear = false;
            }
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
            if (!this.fixedTurret) {
                this.pathClear = false;
            }
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

    private fireHarpoon() {
        trace("FIRE HARPOON");
        var _loc1_: number = 2000 / this.m_physScale;
        var _loc2_: b2Vec2 = this.targetBody.GetLinearVelocity();
        var _loc3_: b2Vec2 = this.targetBody.GetWorldCenter();
        var _loc4_: b2Vec2 = this.turretBody.GetPosition();
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
            return;
        }
        var _loc9_: number = (-_loc6_ + Math.sqrt(_loc8_)) / (2 * _loc5_);
        var _loc10_: number = (-_loc6_ - Math.sqrt(_loc8_)) / (2 * _loc5_);
        _loc9_ = _loc9_ < 0 ? 10000 : _loc9_;
        _loc10_ = _loc10_ < 0 ? 10000 : _loc10_;
        var _loc11_: number = Math.min(_loc9_, _loc10_);
        if (_loc11_ == 10000) {
            trace("t " + _loc11_);
        }
        var _loc12_: number = _loc11_ * _loc2_.x + _loc3_.x;
        var _loc13_: number = _loc11_ * _loc2_.y + _loc3_.y;
        var _loc14_: b2Vec2 = this.targetBody.GetWorldCenter();
        var _loc15_ = new b2Vec2(_loc12_ - _loc4_.x, _loc13_ - _loc4_.y);
        var _loc16_: number = Math.atan2(_loc15_.y, _loc15_.x);
        var _loc17_ = new b2Vec2(
            _loc1_ * Math.cos(_loc16_),
            _loc1_ * Math.sin(_loc16_),
        );
        // @ts-expect-error
        this.mc.turret.harpoon.visible = false;
        this.harpoon = new Harpoon(_loc4_, _loc16_, _loc17_);
        SoundController.instance.playAreaSoundInstance(
            "HarpoonFire",
            this.harpoon.harpoonBody,
        );
        if (!this.useAnchor) {
            return;
        }
        var _loc18_: b2DistanceJoint =
            this.anchorJoints[this.anchorJoints.length - 1];
        _loc18_.m_localAnchor2 = new b2Vec2(-20 / this.m_physScale, 0);
        _loc18_.m_body2 = this.harpoon.harpoonBody;
        this.harpoon.addEventListener(
            Harpoon.HIT,
            this.harpoonHit,
            false,
            0,
            true,
        );
    }

    private fireHarpoon2() {
        trace("FIRE HARPOON 2");
        var _loc1_: number = 2000 / this.m_physScale;
        var _loc2_: b2Vec2 = this.turretBody.GetPosition();
        var _loc3_: b2Vec2 = this.turretBody.GetWorldPoint(new b2Vec2(0, -10));
        var _loc4_ = new b2Vec2(_loc3_.x - _loc2_.x, _loc3_.y - _loc2_.y);
        var _loc5_: number = Math.atan2(_loc4_.y, _loc4_.x);
        var _loc6_ = new b2Vec2(
            _loc1_ * Math.cos(_loc5_),
            _loc1_ * Math.sin(_loc5_),
        );
        // @ts-expect-error
        this.mc.turret.harpoon.visible = false;
        this.harpoon = new Harpoon(_loc2_, _loc5_, _loc6_, this.fixedTurret);
        SoundController.instance.playAreaSoundInstance(
            "HarpoonFire",
            this.harpoon.harpoonBody,
        );
        this.targetDictionary = new Dictionary();
        this.targetBody = null;
        if (!this.useAnchor) {
            return;
        }
        var _loc7_: b2DistanceJoint =
            this.anchorJoints[this.anchorJoints.length - 1];
        _loc7_.m_localAnchor2 = new b2Vec2(-20 / this.m_physScale, 0);
        _loc7_.m_body2 = this.harpoon.harpoonBody;
        this.harpoon.addEventListener(
            Harpoon.HIT,
            this.harpoonHit,
            false,
            0,
            true,
        );
    }

    private createAnchor() {
        var _loc11_: b2Body = null;
        var _loc12_: b2Body = null;
        var _loc13_: b2Vec2 = null;
        var _loc14_: b2Vec2 = null;
        var _loc17_: b2DistanceJoint = null;
        var _loc1_: b2Vec2 = this.turretBody.GetWorldPoint(
            new b2Vec2(0, -50 / this.m_physScale),
        );
        var _loc2_: b2Vec2 = this.turretBody.GetWorldPoint(
            new b2Vec2(-21.5 / this.m_physScale, 17 / this.m_physScale),
        );
        var _loc3_ = new b2BodyDef();
        var _loc4_ = new b2CircleDef();
        _loc4_.friction = 0.5;
        _loc4_.restitution = 0.1;
        _loc4_.filter.categoryBits = 8;
        _loc4_.filter.groupIndex = -20;
        _loc4_.density = 0.25;
        _loc4_.radius = 2.5 / this.m_physScale;
        var _loc5_: b2World = Settings.currentSession.m_world;
        var _loc6_: number = 8;
        var _loc7_: number = new b2Vec2(
            _loc1_.x - _loc2_.x,
            _loc1_.y - _loc2_.y,
        ).Length();
        var _loc8_: number = (_loc7_ * 1.25) / _loc6_;
        var _loc9_: number = (_loc1_.x - _loc2_.x) / _loc6_;
        var _loc10_: number = (_loc1_.y - _loc2_.y) / _loc6_;
        var _loc15_ = new b2DistanceJointDef();
        this.anchorJoints = new Array();
        var _loc16_: number = 0;
        while (_loc16_ < _loc6_) {
            _loc11_ =
                _loc16_ == 0
                    ? Settings.currentSession.level.levelBody
                    : _loc12_;
            if (_loc16_ == 0) {
                _loc11_ = Settings.currentSession.level.levelBody;
                _loc13_ = _loc2_.Copy();
            } else {
                _loc11_ = _loc12_;
                _loc13_ = _loc11_.GetWorldCenter();
            }
            if (_loc16_ < _loc6_ - 1) {
                _loc2_.Add(new b2Vec2(_loc9_, _loc10_));
                _loc3_.position = _loc2_;
                _loc12_ = _loc5_.CreateBody(_loc3_);
                _loc12_.CreateShape(_loc4_);
                _loc12_.SetMassFromShapes();
                _loc14_ = _loc2_.Copy();
            } else {
                _loc12_ = this.turretBody;
                _loc14_ = _loc1_;
            }
            _loc15_.Initialize(_loc11_, _loc12_, _loc13_, _loc14_);
            _loc15_.length = _loc8_;
            _loc17_ = _loc5_.CreateJoint(_loc15_) as b2DistanceJoint;
            this.anchorJoints.push(_loc17_);
            _loc16_++;
        }
    }

    private harpoonHit(param1: Event) {
        var _loc4_: b2DistanceJoint = null;
        this.harpoon.removeEventListener(Harpoon.HIT, this.harpoonHit);
        var _loc2_ = int(this.anchorJoints.length);
        var _loc3_: number = 0;
        while (_loc3_ < this.anchorJoints.length - 1) {
            _loc4_ = this.anchorJoints[_loc3_];
            _loc4_.m_body2.m_shapeList.m_density = 10;
            _loc4_.m_body2.SetMassFromShapes();
            _loc3_++;
        }
    }

    public override paint() {
        var _loc1_: number = 0;
        var _loc2_: b2DistanceJoint = null;
        var _loc3_: b2Vec2 = null;
        var _loc4_: number = 0;
        this.mc.turret.rotation =
            (this.turretBody.GetAngle() * 180) / Math.PI - this.mc.rotation;
        if (this.anchorJoints) {
            _loc1_ = int(this.anchorJoints.length);
            this.anchorSprite.graphics.clear();
            this.anchorSprite.graphics.lineStyle(1);
            _loc2_ = this.anchorJoints[0];
            _loc3_ = _loc2_.GetAnchor1();
            this.anchorSprite.graphics.moveTo(
                _loc3_.x * this.m_physScale,
                _loc3_.y * this.m_physScale,
            );
            _loc4_ = 0;
            while (_loc4_ < _loc1_) {
                _loc2_ = this.anchorJoints[_loc4_];
                _loc3_ = _loc2_.GetAnchor2();
                this.anchorSprite.graphics.lineTo(
                    _loc3_.x * this.m_physScale,
                    _loc3_.y * this.m_physScale,
                );
                _loc4_++;
            }
        }
    }

    public override triggerSingleActivation(
        param1: Trigger,
        param2: string,
        param3: any[],
    ) {
        var _loc4_: ContactListener = null;
        if (param2 == "fire harpoon") {
            if (!this.harpoon && !this.disabled) {
                this.fireHarpoon2();
                _loc4_ = Settings.currentSession.contactListener;
                if (this.targetSensor) {
                    _loc4_.deleteListener(
                        ContactListener.REMOVE,
                        this.targetSensor,
                    );
                    this.removeTargetSensor();
                }
                if (this.rangeSensor) {
                    _loc4_.deleteListener(
                        ContactListener.ADD,
                        this.rangeSensor,
                    );
                    _loc4_.deleteListener(
                        ContactListener.REMOVE,
                        this.rangeSensor,
                    );
                    Settings.currentSession.level.levelBody.DestroyShape(
                        this.rangeSensor,
                    );
                }
                Settings.currentSession.level.removeFromActionsVector(this);
            }
        } else if (param2 == "deactivate") {
            this.disabled = true;
            this.setLight();
        } else if (param2 == "activate") {
            this.disabled = false;
            this.setLight();
        }
    }

    private setLight() {
        if (this.disabled) {
            // @ts-expect-error
            this.mc.turret.light.gotoAndStop(4);
        } else if (this.triggerFiring) {
            // @ts-expect-error
            this.mc.turret.light.gotoAndStop(3);
        } else if (this.fixedTurret) {
            // @ts-expect-error
            this.mc.turret.light.gotoAndStop(2);
        } else {
            // @ts-expect-error
            this.mc.turret.light.gotoAndStop(1);
        }
    }
}