import b2ContactPoint from "@/Box2D/Collision/b2ContactPoint";
import b2CircleDef from "@/Box2D/Collision/Shapes/b2CircleDef";
import b2FilterData from "@/Box2D/Collision/Shapes/b2FilterData";
import b2PolygonDef from "@/Box2D/Collision/Shapes/b2PolygonDef";
import b2PolygonShape from "@/Box2D/Collision/Shapes/b2PolygonShape";
import b2Shape from "@/Box2D/Collision/Shapes/b2Shape";
import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import b2Body from "@/Box2D/Dynamics/b2Body";
import b2BodyDef from "@/Box2D/Dynamics/b2BodyDef";
import b2World from "@/Box2D/Dynamics/b2World";
import b2PrismaticJoint from "@/Box2D/Dynamics/Joints/b2PrismaticJoint";
import b2PrismaticJointDef from "@/Box2D/Dynamics/Joints/b2PrismaticJointDef";
import b2RevoluteJoint from "@/Box2D/Dynamics/Joints/b2RevoluteJoint";
import b2RevoluteJointDef from "@/Box2D/Dynamics/Joints/b2RevoluteJointDef";
import CharacterB2D from "@/com/totaljerkface/game/character/CharacterB2D";
import ContactListener from "@/com/totaljerkface/game/ContactListener";
import ContactEvent from "@/com/totaljerkface/game/events/ContactEvent";
import FoodItem from "@/com/totaljerkface/game/level/userspecials/FoodItem";
import NPCharacter from "@/com/totaljerkface/game/level/userspecials/NPCharacter";
import Emitter from "@/com/totaljerkface/game/particles/Emitter";
import Session from "@/com/totaljerkface/game/Session";
import Settings from "@/com/totaljerkface/game/Settings";
import AreaSoundInstance from "@/com/totaljerkface/game/sound/AreaSoundInstance";
import AreaSoundLoop from "@/com/totaljerkface/game/sound/AreaSoundLoop";
import SoundController from "@/com/totaljerkface/game/sound/SoundController";
import { boundClass } from 'autobind-decorator';
import DisplayObject from "flash/display/DisplayObject";
import MovieClip from "flash/display/MovieClip";
import Sprite from "flash/display/Sprite";

@boundClass
export default class LawnMowerMan extends CharacterB2D {
    protected ejected: boolean;
    protected wheelMaxSpeed: number = 15;
    protected wheelCurrentSpeed: number;
    protected wheelNewSpeed: number;
    protected accelStep: number = 3;
    protected maxTorque: number = 100000;
    protected impulseLeft: number = 2.4;
    protected impulseRight: number = 2.8;
    protected impulseOffset: number = 1;
    protected maxSpinAV: number = 3.5;
    protected wheelLoop1: AreaSoundLoop;
    protected wheelLoop2: AreaSoundLoop;
    protected wheelLoop3: AreaSoundLoop;
    protected mowerLoop: AreaSoundLoop;
    protected grindLoop: AreaSoundLoop;
    protected mowerImpactSound: AreaSoundInstance;
    protected mowerSmashLimit: number = 100000;
    protected frontRearSmashLimit: number = 150;
    protected reAttachDistance: number = 0.25;
    protected ejectImpulse: number = 5;
    protected mowerSmashed: boolean;
    protected verticalTranslation: number;
    protected handleAnchorPoint: b2Vec2;
    protected pelvisAnchorPoint: b2Vec2;
    protected leg1AnchorPoint: b2Vec2;
    protected leg2AnchorPoint: b2Vec2;
    protected mowerPelvisJointDef: b2RevoluteJointDef;
    protected mowerHand1JointDef: b2RevoluteJointDef;
    protected mowerHand2JointDef: b2RevoluteJointDef;
    protected mowerFoot1JointDef: b2RevoluteJointDef;
    protected mowerFoot2JointDef: b2RevoluteJointDef;
    protected frontShape: b2PolygonShape;
    protected shaftShape: b2PolygonShape;
    protected handleShape: b2PolygonShape;
    protected rearShape: b2PolygonShape;
    protected topShape: b2PolygonShape;
    protected baseShape: b2PolygonShape;
    protected bladeShape: b2PolygonShape;
    protected seatShape1: b2PolygonShape;
    protected seatShape2: b2PolygonShape;
    protected backWheelShape: b2Shape;
    protected frontWheelShape: b2Shape;
    protected brokenFrontShape: b2PolygonShape;
    protected brokenRearShape: b2PolygonShape;
    public mowerBody: b2Body;
    public frontShockBody: b2Body;
    public backShockBody: b2Body;
    public backWheelBody: b2Body;
    public frontWheelBody: b2Body;
    public frontBody: b2Body;
    public rearBody: b2Body;
    public shockMC: Sprite;
    public bladeCoverMC: MovieClip;
    public mowerMC: MovieClip;
    public backWheelMC: MovieClip;
    public frontWheelMC: MovieClip;
    protected frontMC: Sprite;
    protected rearMC: Sprite;
    protected front1MC: Sprite;
    protected front2MC: Sprite;
    protected front3MC: Sprite;
    protected front4MC: Sprite;
    protected front5MC: Sprite;
    protected rear1MC: Sprite;
    protected rear2MC: Sprite;
    protected rear3MC: Sprite;
    protected rear4MC: Sprite;
    protected cartMC: Sprite;
    protected backShockJoint: b2PrismaticJoint;
    protected frontShockJoint: b2PrismaticJoint;
    protected backWheelJoint: b2RevoluteJoint;
    protected frontWheelJoint: b2RevoluteJoint;
    protected mowerPelvis: b2RevoluteJoint;
    protected mowerHand1: b2RevoluteJoint;
    protected mowerHand2: b2RevoluteJoint;
    protected mowerFoot1: b2RevoluteJoint;
    protected mowerFoot2: b2RevoluteJoint;
    protected bladeContactArray: any[];
    protected bladeShapeArray: any[];
    protected bladeX: number;
    protected bladeLeftX: number;
    protected bladeRightX: number;
    protected bladeY: number;
    protected bladeCenter: b2Vec2;
    protected mowerMass: number;
    protected targetBodies: any[];
    protected risingBodies: any[];
    protected grindSounds: any[];
    protected addedJointsArray: any[];
    protected clearanceShape: b2PolygonShape;
    protected contactCount: Dictionary<any, any>;
    protected targetMaskHolder: Sprite;
    protected grindingMass: number = 0;
    protected soundDelay: number = 10;
    protected soundDelayCount: number = 0;
    protected testSprite: Sprite;

    constructor(
        param1: number,
        param2: number,
        param3: DisplayObject,
        param4: Session,
    ) {
        super(param1, param2, param3, param4, -1, "Char11");
        this.verticalTranslation = 20 / this.m_physScale;
        this.bladeContactArray = new Array();
        this.bladeShapeArray = new Array();
        this.targetBodies = new Array();
        this.risingBodies = new Array();
        this.grindSounds = new Array();
        this.addedJointsArray = new Array();
        this.contactCount = new Dictionary();
        if (param4.version > 1.4) {
            this.mowerSmashLimit = 200;
        }
    }

    public override leftPressedActions() {
        var _loc1_: number = NaN;
        var _loc2_: number = NaN;
        var _loc3_: number = NaN;
        var _loc4_: number = NaN;
        var _loc5_: number = NaN;
        var _loc6_: b2Vec2 = null;
        if (this.ejected) {
            this.currentPose = 1;
        } else {
            _loc1_ = this.mowerBody.GetAngle();
            _loc2_ = this.mowerBody.GetAngularVelocity();
            _loc3_ = (_loc2_ + this.maxSpinAV) / this.maxSpinAV;
            if (_loc3_ < 0) {
                _loc3_ = 0;
            }
            if (_loc3_ > 1) {
                _loc3_ = 1;
            }
            _loc4_ = Math.cos(_loc1_) * this.impulseLeft * _loc3_;
            _loc5_ = Math.sin(_loc1_) * this.impulseLeft * _loc3_;
            _loc6_ = this.mowerBody.GetLocalCenter();
            this.mowerBody.ApplyImpulse(
                new b2Vec2(_loc5_, -_loc4_),
                this.mowerBody.GetWorldPoint(
                    new b2Vec2(_loc6_.x + this.impulseOffset, _loc6_.y),
                ),
            );
            this.mowerBody.ApplyImpulse(
                new b2Vec2(-_loc5_, _loc4_),
                this.mowerBody.GetWorldPoint(
                    new b2Vec2(_loc6_.x - this.impulseOffset, _loc6_.y),
                ),
            );
            this.currentPose = 7;
        }
    }

    public override rightPressedActions() {
        var _loc1_: number = NaN;
        var _loc2_: number = NaN;
        var _loc3_: number = NaN;
        var _loc4_: number = NaN;
        var _loc5_: number = NaN;
        var _loc6_: number = NaN;
        var _loc7_: b2Vec2 = null;
        if (this.ejected) {
            this.currentPose = 2;
        } else {
            _loc1_ = this.mowerBody.GetAngle();
            _loc2_ = this.mowerBody.GetAngularVelocity();
            _loc3_ = (_loc2_ - this.maxSpinAV) / -this.maxSpinAV;
            if (_loc3_ < 0) {
                _loc3_ = 0;
            }
            if (_loc3_ > 1) {
                _loc3_ = 1;
            }
            _loc4_ = 1;
            _loc5_ = Math.cos(_loc1_) * this.impulseRight * _loc3_;
            _loc6_ = Math.sin(_loc1_) * this.impulseRight * _loc3_;
            _loc7_ = this.mowerBody.GetLocalCenter();
            this.mowerBody.ApplyImpulse(
                new b2Vec2(-_loc6_, _loc5_),
                this.mowerBody.GetWorldPoint(
                    new b2Vec2(_loc7_.x + this.impulseOffset, _loc7_.y),
                ),
            );
            this.mowerBody.ApplyImpulse(
                new b2Vec2(_loc6_, -_loc5_),
                this.mowerBody.GetWorldPoint(
                    new b2Vec2(_loc7_.x - this.impulseOffset, _loc7_.y),
                ),
            );
            this.currentPose = 8;
        }
    }

    public override leftAndRightActions() {
        if (this.ejected) {
            if (this._currentPose == 1 || this._currentPose == 2) {
                this.currentPose = 0;
            }
        }
    }

    public override upPressedActions() {
        if (this.ejected) {
            this.currentPose = 3;
        } else {
            if (!this.backWheelJoint.IsMotorEnabled()) {
                this.backWheelJoint.EnableMotor(true);
                this.frontWheelJoint.EnableMotor(true);
                this.mowerLoop.fadeTo(1, 0.25);
            }
            this.wheelCurrentSpeed = this.backWheelJoint.GetJointSpeed();
            if (this.wheelCurrentSpeed < 0) {
                this.wheelNewSpeed = 0;
            } else {
                this.wheelNewSpeed =
                    this.wheelCurrentSpeed < this.wheelMaxSpeed
                        ? this.wheelCurrentSpeed + this.accelStep
                        : this.wheelCurrentSpeed;
            }
            this.backWheelJoint.SetMotorSpeed(this.wheelNewSpeed);
            this.frontWheelJoint.SetMotorSpeed(this.wheelNewSpeed * 1.76);
        }
    }

    public override downPressedActions() {
        if (this.ejected) {
            this.currentPose = 4;
        } else {
            if (!this.backWheelJoint.IsMotorEnabled()) {
                this.backWheelJoint.EnableMotor(true);
                this.frontWheelJoint.EnableMotor(true);
                this.mowerLoop.fadeTo(1, 0.25);
            }
            this.wheelCurrentSpeed = this.backWheelJoint.GetJointSpeed();
            if (this.wheelCurrentSpeed > 0) {
                this.wheelNewSpeed = 0;
            } else {
                this.wheelNewSpeed =
                    this.wheelCurrentSpeed > -this.wheelMaxSpeed
                        ? this.wheelCurrentSpeed - this.accelStep
                        : this.wheelCurrentSpeed;
            }
            this.backWheelJoint.SetMotorSpeed(this.wheelNewSpeed);
            this.frontWheelJoint.SetMotorSpeed(this.wheelNewSpeed * 1.76);
        }
    }

    public override upAndDownActions() {
        if (this.backWheelJoint.IsMotorEnabled()) {
            this.backWheelJoint.EnableMotor(false);
            this.frontWheelJoint.EnableMotor(false);
            if (this.mowerLoop) {
                this.mowerLoop.fadeTo(0.5, 0.25);
            }
        }
        if (this.ejected) {
            if (this._currentPose == 3 || this._currentPose == 4) {
                this.currentPose = 0;
            }
        }
    }

    public override spacePressedActions() {
        if (this.ejected) {
            this.startGrab();
        } else if (!this.backShockJoint.IsMotorEnabled()) {
            if (
                this.backShockJoint.GetUpperLimit() != this.verticalTranslation
            ) {
                this.frontShockJoint.SetMotorSpeed(2.5);
                this.backShockJoint.SetMotorSpeed(2.5);
                this.frontShockJoint.SetLimits(0, this.verticalTranslation);
                this.backShockJoint.SetLimits(0, this.verticalTranslation);
                this.frontShockJoint.EnableMotor(true);
                this.backShockJoint.EnableMotor(true);
                SoundController.instance.playAreaSoundInstance(
                    "SegwayJump",
                    this.backWheelBody,
                );
            }
        } else if (this.backShockJoint.GetMotorSpeed() > 0) {
            if (
                this.backShockJoint.GetJointTranslation() >
                this.verticalTranslation
            ) {
                this.frontShockJoint.EnableMotor(false);
                this.backShockJoint.EnableMotor(false);
                this.frontShockJoint.SetLimits(
                    this.verticalTranslation - 0.01,
                    this.verticalTranslation,
                );
                this.backShockJoint.SetLimits(
                    this.verticalTranslation - 0.01,
                    this.verticalTranslation,
                );
                this.frontShockJoint.SetMotorSpeed(0);
                this.backShockJoint.SetMotorSpeed(0);
            }
        } else if (this.backShockJoint.GetMotorSpeed() < 0) {
            if (this.backShockJoint.GetJointTranslation() < 0) {
                this.frontShockJoint.EnableMotor(false);
                this.backShockJoint.EnableMotor(false);
                this.frontShockJoint.SetLimits(0, 0);
                this.backShockJoint.SetLimits(0, 0);
                this.frontShockJoint.SetMotorSpeed(0);
                this.backShockJoint.SetMotorSpeed(0);
            }
        }
    }

    public override spaceNullActions() {
        if (this.ejected) {
            this.releaseGrip();
        } else if (this.backShockJoint.IsMotorEnabled()) {
            if (this.backShockJoint.GetMotorSpeed() > 0) {
                if (
                    this.frontShockJoint.GetJointTranslation() >
                    this.verticalTranslation
                ) {
                    this.frontShockJoint.SetMotorSpeed(-1);
                    this.backShockJoint.SetMotorSpeed(-1);
                }
            } else if (this.backShockJoint.GetMotorSpeed() < 0) {
                if (this.backShockJoint.GetJointTranslation() < 0) {
                    this.frontShockJoint.EnableMotor(false);
                    this.backShockJoint.EnableMotor(false);
                    this.frontShockJoint.SetLimits(0, 0);
                    this.backShockJoint.SetLimits(0, 0);
                    this.frontShockJoint.SetMotorSpeed(0);
                    this.backShockJoint.SetMotorSpeed(0);
                }
            }
        } else if (this.backShockJoint.GetUpperLimit() != 0) {
            this.frontShockJoint.SetMotorSpeed(-1);
            this.backShockJoint.SetMotorSpeed(-1);
            this.frontShockJoint.SetLimits(0, this.verticalTranslation);
            this.backShockJoint.SetLimits(0, this.verticalTranslation);
            this.frontShockJoint.EnableMotor(true);
            this.backShockJoint.EnableMotor(true);
        }
    }

    public override shiftPressedActions() {
        if (this.ejected) {
            this.currentPose = 6;
        }
    }

    public override shiftNullActions() {
        if (this._currentPose == 6) {
            this.currentPose = 0;
        }
    }

    public override ctrlPressedActions() {
        if (this.ejected) {
            this.currentPose = 7;
        }
    }

    public override ctrlNullActions() {
        if (this._currentPose == 7) {
            this.currentPose = 0;
        }
    }

    public override zPressedActions() {
        this.eject();
    }

    public override actions() {
        var _loc2_: b2Body = null;
        var _loc3_: number = 0;
        var _loc4_: number = NaN;
        var _loc5_: b2Shape = null;
        var _loc6_: b2Body = null;
        var _loc7_: Emitter = null;
        var _loc8_: Sprite = null;
        var _loc9_: NPCharacter = null;
        var _loc10_: CharacterB2D = null;
        var _loc11_: DisplayObject = null;
        var _loc12_: b2RevoluteJoint = null;
        super.actions();
        var _loc1_ = int(this.targetBodies.length - 1);
        while (_loc1_ > -1) {
            _loc2_ = this.targetBodies[_loc1_];
            _loc3_ = int(this.contactCount.get(_loc2_));
            if (_loc3_ == 0) {
                _loc4_ = _loc2_.GetMass();
                this.grindingMass -= _loc4_;
                _loc5_ = _loc2_.GetShapeList();
                if (_loc5_.m_userData instanceof NPCharacter) {
                    _loc9_ = _loc5_.m_userData as NPCharacter;
                    _loc9_.removeBody(_loc2_);
                } else if (_loc5_.m_userData instanceof CharacterB2D) {
                    _loc10_ = _loc5_.m_userData as CharacterB2D;
                    _loc10_.removeBody(_loc2_);
                }
                _loc6_ = this.risingBodies[_loc1_];
                _loc7_ = _loc6_.GetUserData();
                _loc7_.stopSpewing();
                this.session.m_world.DestroyBody(_loc2_);
                this.session.m_world.DestroyBody(_loc6_);
                _loc8_ = _loc2_.m_userData;
                if (_loc8_.mask != null) {
                    _loc11_ = _loc8_.mask;
                    _loc8_.mask = null;
                    this.targetMaskHolder.removeChild(_loc11_);
                }
                _loc8_.visible = false;
                this.targetBodies.splice(_loc1_, 1);
                this.risingBodies.splice(_loc1_, 1);
                if (this.targetBodies.length == 0) {
                    this.grindLoop.fadeOut(0.3);
                    this.grindLoop = null;
                }
            }
            _loc1_--;
        }
        _loc1_ = 0;
        while (_loc1_ < this.addedJointsArray.length) {
            _loc12_ = this.addedJointsArray[_loc1_];
            _loc6_ = _loc12_.GetBody1();
            this.risingBodies.push(_loc6_);
            _loc2_ = _loc12_.GetBody2();
            this.targetBodies.push(_loc2_);
            _loc1_++;
        }
        this.addedJointsArray = new Array();
        if (this.mowerImpactSound) {
            this.soundDelayCount += 1;
            if (this.soundDelayCount >= this.soundDelay) {
                this.mowerImpactSound = null;
                this.soundDelayCount = 0;
                this.soundDelay = Math.round(Math.random() * 20) + 5;
            }
        }
    }

    protected override checkPose() {
        switch (this._currentPose) {
            case 1:
                this.archPose();
                break;
            case 2:
                this.pushupPose();
                break;
            case 3:
                this.supermanPose();
                break;
            case 4:
                this.tuckPose();
                break;
            case 5:
                break;
            case 6:
                this.lungePoseLeft();
                break;
            case 7:
                this.leanBackPose();
                break;
            case 8:
                this.leanForwardPose();
                break;
            case 10:
                this.armsForwardPose();
                break;
            case 11:
                this.armsOverheadPose();
                break;
            case 12:
                this.holdPositionPose();
        }
    }

    public override reset() {
        super.reset();
        this.ejected = false;
        this.mowerSmashed = false;
        this.bladeContactArray = new Array();
        this.bladeShapeArray = new Array();
        this.addedJointsArray = new Array();
        this.targetBodies = new Array();
        this.risingBodies = new Array();
        this.grindSounds = new Array();
        this.contactCount = new Dictionary();
        this.grindingMass = 0;
        this.soundDelayCount = 0;
        this.soundDelay = 10;
        if (this.session.version > 1.4) {
            this.mowerSmashLimit = 200;
        }
    }

    public override die() {
        var _loc2_: b2Body = null;
        var _loc3_: Sprite = null;
        var _loc4_: DisplayObject = null;
        var _loc5_: DisplayObject = null;
        super.die();
        var _loc1_: number = 0;
        while (_loc1_ < this.targetBodies.length) {
            _loc2_ = this.targetBodies[_loc1_];
            _loc3_ = _loc2_.m_userData;
            if (_loc3_.mask != null) {
                _loc4_ = _loc3_.mask;
                _loc3_.mask = null;
                this.targetMaskHolder.removeChild(_loc4_);
            }
            _loc3_.visible = false;
            _loc1_++;
        }
        _loc1_ = this.targetMaskHolder.numChildren - 1;
        while (_loc1_ > -1) {
            _loc5_ = this.targetMaskHolder.getChildAt(_loc1_);
            this.targetMaskHolder.removeChild(_loc5_);
            _loc1_--;
        }
        if (this.mowerLoop) {
            this.mowerLoop.stopSound();
            this.mowerLoop = null;
        }
    }

    public override paint() {
        var _loc1_: b2Vec2 = null;
        var _loc2_: b2Vec2 = null;
        super.paint();
        _loc1_ = this.frontWheelBody.GetWorldCenter();
        this.frontWheelMC.x = _loc1_.x * this.m_physScale;
        this.frontWheelMC.y = _loc1_.y * this.m_physScale;
        // @ts-expect-error
        this.frontWheelMC.inner.rotation =
            (this.frontWheelBody.GetAngle() * (180 / Math.PI)) % 360;
        _loc1_ = this.backWheelBody.GetWorldCenter();
        this.backWheelMC.x = _loc1_.x * this.m_physScale;
        this.backWheelMC.y = _loc1_.y * this.m_physScale;
        // @ts-expect-error
        this.backWheelMC.inner.rotation =
            (this.backWheelBody.GetAngle() * (180 / Math.PI)) % 360;
        this.targetMaskHolder.x = this.bladeCoverMC.x = this.mowerMC.x;
        this.targetMaskHolder.y = this.bladeCoverMC.y = this.mowerMC.y;
        this.targetMaskHolder.rotation = this.bladeCoverMC.rotation =
            this.mowerMC.rotation;
        if (!this.mowerSmashed) {
            _loc1_ = this.frontShockJoint.GetAnchor1();
            _loc2_ = this.frontShockBody.GetWorldCenter();
            this.shockMC.graphics.clear();
            this.shockMC.graphics.lineStyle(3, 1513239);
            this.shockMC.graphics.moveTo(
                _loc1_.x * this.m_physScale,
                _loc1_.y * this.m_physScale,
            );
            this.shockMC.graphics.lineTo(
                _loc2_.x * this.m_physScale,
                _loc2_.y * this.m_physScale,
            );
            _loc1_ = this.backShockJoint.GetAnchor1();
            _loc2_ = this.backShockBody.GetWorldCenter();
            this.shockMC.graphics.moveTo(
                _loc1_.x * this.m_physScale,
                _loc1_.y * this.m_physScale,
            );
            this.shockMC.graphics.lineTo(
                _loc2_.x * this.m_physScale,
                _loc2_.y * this.m_physScale,
            );
        }
    }

    public override createDictionaries() {
        super.createDictionaries();
        this.contactImpulseDict.set(this.frontShape, this.mowerSmashLimit);
        this.contactAddSounds.set(this.backWheelShape, "CarTire1");
        this.contactAddSounds.set(this.frontWheelShape, "CarTire1");
        this.contactAddSounds.set(this.frontShape, "ChairHit3");
        this.contactAddSounds.set(this.topShape, "ChairHit2");
        this.contactAddSounds.set(this.seatShape1, "BikeHit3");
    }

    public override createBodies() {
        var _loc3_: b2Shape = null;
        var _loc16_: b2PolygonDef = null;
        var _loc17_: b2Vec2 = null;
        var _loc18_: number = NaN;
        var _loc21_: MovieClip = null;
        super.createBodies();
        var _loc1_ = new b2PolygonDef();
        var _loc2_ = new b2CircleDef();
        _loc3_ = this.upperLeg1Body.GetShapeList();
        _loc3_.m_isSensor = true;
        this._session.m_world.Refilter(_loc3_);
        _loc3_ = this.upperLeg2Body.GetShapeList();
        _loc3_.m_isSensor = true;
        this._session.m_world.Refilter(_loc3_);
        _loc3_ = this.lowerLeg1Body.GetShapeList();
        _loc3_.m_isSensor = true;
        this._session.m_world.Refilter(_loc3_);
        _loc3_ = this.lowerLeg2Body.GetShapeList();
        _loc3_.m_isSensor = true;
        this._session.m_world.Refilter(_loc3_);
        var _loc4_ = new b2BodyDef();
        var _loc5_ = new b2BodyDef();
        _loc1_.density = 1;
        _loc1_.friction = 0.3;
        _loc1_.restitution = 0.1;
        _loc1_.filter = this.defaultFilter;
        this.paintVector.splice(this.paintVector.indexOf(this.chestBody), 1);
        this.paintVector.splice(this.paintVector.indexOf(this.pelvisBody), 1);
        this._session.m_world.DestroyBody(this.chestBody);
        this._session.m_world.DestroyBody(this.pelvisBody);
        var _loc6_: MovieClip = this.shapeGuide["chestShape"];
        _loc4_.position.Set(
            this._startX + _loc6_.x / this.character_scale,
            this._startY + _loc6_.y / this.character_scale,
        );
        _loc4_.angle = _loc6_.rotation / (180 / Math.PI);
        this.chestBody = this._session.m_world.CreateBody(_loc4_);
        _loc1_.vertexCount = 6;
        var _loc7_: number = 0;
        while (_loc7_ < 6) {
            _loc21_ = this.shapeGuide["chestVert" + [_loc7_]];
            _loc1_.vertices[_loc7_] = new b2Vec2(
                _loc21_.x / this.character_scale,
                _loc21_.y / this.character_scale,
            );
            _loc7_++;
        }
        this.chestShape = this.chestBody.CreateShape(_loc1_);
        this.chestShape.SetMaterial(2);
        this.chestShape.SetUserData(this);
        this._session.contactListener.registerListener(
            ContactListener.RESULT,
            this.chestShape,
            this.contactResultHandler,
        );
        this._session.contactListener.registerListener(
            ContactListener.ADD,
            this.chestShape,
            this.contactAddHandler,
        );
        this.chestBody.SetMassFromShapes();
        this.chestBody.AllowSleeping(false);
        this.paintVector.push(this.chestBody);
        this.cameraFocus = this.chestBody;
        _loc6_ = this.shapeGuide["pelvisShape"];
        _loc5_.position.Set(
            this._startX + _loc6_.x / this.character_scale,
            this._startY + _loc6_.y / this.character_scale,
        );
        _loc5_.angle = _loc6_.rotation / (180 / Math.PI);
        this.pelvisBody = this._session.m_world.CreateBody(_loc5_);
        _loc1_.vertexCount = 5;
        _loc7_ = 0;
        while (_loc7_ < 5) {
            _loc21_ = this.shapeGuide["pelvisVert" + [_loc7_]];
            _loc1_.vertices[_loc7_] = new b2Vec2(
                _loc21_.x / this.character_scale,
                _loc21_.y / this.character_scale,
            );
            _loc7_++;
        }
        this.pelvisShape = this.pelvisBody.CreateShape(_loc1_);
        this.pelvisShape.SetMaterial(2);
        this.pelvisShape.SetUserData(this);
        this._session.contactListener.registerListener(
            ContactListener.RESULT,
            this.pelvisShape,
            this.contactResultHandler,
        );
        this._session.contactListener.registerListener(
            ContactListener.ADD,
            this.pelvisShape,
            this.contactAddHandler,
        );
        this.pelvisBody.SetMassFromShapes();
        this.pelvisBody.AllowSleeping(false);
        this.paintVector.push(this.pelvisBody);
        var _loc8_ = new b2BodyDef();
        var _loc9_ = new b2BodyDef();
        var _loc10_ = new b2BodyDef();
        var _loc11_ = new b2BodyDef();
        var _loc12_ = new b2BodyDef();
        var _loc13_ = new b2PolygonDef();
        var _loc14_ = new b2PolygonDef();
        var _loc15_ = new b2PolygonDef();
        _loc1_.density = 4;
        _loc1_.friction = 0.3;
        _loc1_.restitution = 0.1;
        _loc1_.filter = this.zeroFilter.Copy();
        _loc1_.filter.groupIndex = -2;
        this.mowerBody = this._session.m_world.CreateBody(_loc8_);
        _loc1_.vertexCount = 4;
        _loc7_ = 0;
        while (_loc7_ < 4) {
            _loc21_ = this.shapeGuide["handleVert" + [_loc7_ + 1]];
            _loc1_.vertices[_loc7_] = new b2Vec2(
                this._startX + _loc21_.x / this.character_scale,
                this._startY + _loc21_.y / this.character_scale,
            );
            _loc7_++;
        }
        this.handleShape = this.mowerBody.CreateShape(_loc1_) as b2PolygonShape;
        _loc6_ = this.shapeGuide["shaftShape"];
        _loc17_ = new b2Vec2(
            this._startX + _loc6_.x / this.character_scale,
            this._startY + _loc6_.y / this.character_scale,
        );
        _loc18_ = _loc6_.rotation / (180 / Math.PI);
        _loc1_.SetAsOrientedBox(
            (_loc6_.scaleX * 5) / this.character_scale,
            (_loc6_.scaleY * 5) / this.character_scale,
            _loc17_,
            _loc18_,
        );
        this.shaftShape = this.mowerBody.CreateShape(_loc1_) as b2PolygonShape;
        _loc1_.vertexCount = 6;
        _loc7_ = 0;
        while (_loc7_ < 6) {
            _loc21_ = this.shapeGuide["frontVert" + [_loc7_ + 1]];
            _loc1_.vertices[_loc7_] = new b2Vec2(
                this._startX + _loc21_.x / this.character_scale,
                this._startY + _loc21_.y / this.character_scale,
            );
            _loc7_++;
        }
        this.frontShape = this.mowerBody.CreateShape(_loc1_) as b2PolygonShape;
        this._session.contactListener.registerListener(
            ContactListener.RESULT,
            this.frontShape,
            this.contactMowerResultHandler,
        );
        this._session.contactListener.registerListener(
            ContactListener.ADD,
            this.frontShape,
            this.contactAddHandler,
        );
        _loc6_ = this.shapeGuide["baseShape"];
        _loc17_ = new b2Vec2(
            this._startX + _loc6_.x / this.character_scale,
            this._startY + _loc6_.y / this.character_scale,
        );
        _loc18_ = _loc6_.rotation / (180 / Math.PI);
        _loc1_.SetAsOrientedBox(
            (_loc6_.scaleX * 5) / this.character_scale,
            (_loc6_.scaleY * 5) / this.character_scale,
            _loc17_,
            _loc18_,
        );
        this.baseShape = this.mowerBody.CreateShape(_loc1_) as b2PolygonShape;
        _loc6_ = this.shapeGuide["bladeShape"];
        _loc17_ = new b2Vec2(
            this._startX + _loc6_.x / this.character_scale,
            this._startY + _loc6_.y / this.character_scale,
        );
        _loc18_ = _loc6_.rotation / (180 / Math.PI);
        _loc1_.SetAsOrientedBox(
            (_loc6_.scaleX * 5) / this.character_scale,
            (_loc6_.scaleY * 5) / this.character_scale,
            _loc17_,
            _loc18_,
        );
        this.bladeX = (_loc6_.scaleX * 5) / this.character_scale;
        this.bladeY = (_loc6_.scaleY * 5) / this.character_scale;
        this.bladeCenter = _loc17_;
        this.bladeShape = this.mowerBody.CreateShape(_loc1_) as b2PolygonShape;
        this.bladeLeftX = this.bladeShape.GetVertices()[0].x;
        this.bladeRightX = this.bladeShape.GetVertices()[1].x;
        this._session.contactListener.registerListener(
            ContactListener.RESULT,
            this.bladeShape,
            this.contactBladeResultHandler,
        );
        _loc1_.vertexCount = 5;
        _loc7_ = 0;
        while (_loc7_ < 5) {
            _loc21_ = this.shapeGuide["rearVert" + [_loc7_ + 1]];
            _loc1_.vertices[_loc7_] = new b2Vec2(
                this._startX + _loc21_.x / this.character_scale,
                this._startY + _loc21_.y / this.character_scale,
            );
            _loc7_++;
        }
        this.rearShape = this.mowerBody.CreateShape(_loc1_) as b2PolygonShape;
        this._session.contactListener.registerListener(
            ContactListener.RESULT,
            this.rearShape,
            this.contactMowerResultHandler,
        );
        _loc7_ = 0;
        while (_loc7_ < 5) {
            _loc21_ = this.shapeGuide["topVert" + [_loc7_ + 1]];
            _loc1_.vertices[_loc7_] = new b2Vec2(
                this._startX + _loc21_.x / this.character_scale,
                this._startY + _loc21_.y / this.character_scale,
            );
            _loc7_++;
        }
        this.topShape = this.mowerBody.CreateShape(_loc1_) as b2PolygonShape;
        this._session.contactListener.registerListener(
            ContactListener.RESULT,
            this.topShape,
            this.contactMowerResultHandler,
        );
        this._session.contactListener.registerListener(
            ContactListener.ADD,
            this.topShape,
            this.contactAddHandler,
        );
        _loc1_.vertexCount = 4;
        _loc7_ = 0;
        while (_loc7_ < 4) {
            _loc21_ = this.shapeGuide["backVert" + [_loc7_ + 1]];
            _loc1_.vertices[_loc7_] = new b2Vec2(
                this._startX + _loc21_.x / this.character_scale,
                this._startY + _loc21_.y / this.character_scale,
            );
            _loc7_++;
        }
        this.seatShape1 = this.mowerBody.CreateShape(_loc1_) as b2PolygonShape;
        this._session.contactListener.registerListener(
            ContactListener.RESULT,
            this.seatShape1,
            this.contactMowerResultHandler,
        );
        this._session.contactListener.registerListener(
            ContactListener.ADD,
            this.seatShape1,
            this.contactAddHandler,
        );
        _loc7_ = 0;
        while (_loc7_ < 4) {
            _loc21_ = this.shapeGuide["seatVert" + [_loc7_ + 1]];
            _loc1_.vertices[_loc7_] = new b2Vec2(
                this._startX + _loc21_.x / this.character_scale,
                this._startY + _loc21_.y / this.character_scale,
            );
            _loc7_++;
        }
        this.seatShape2 = this.mowerBody.CreateShape(_loc1_) as b2PolygonShape;
        this.mowerBody.DestroyShape(this.seatShape2);
        var _loc19_ = new b2FilterData();
        _loc19_.maskBits = 1;
        _loc19_.categoryBits = 1;
        _loc1_.filter = _loc19_;
        _loc1_.friction = 0.01;
        _loc1_.density = 0.01;
        _loc6_ = this.shapeGuide["alignShape1"];
        _loc17_ = new b2Vec2(
            this._startX + _loc6_.x / this.character_scale,
            this._startY + _loc6_.y / this.character_scale,
        );
        _loc18_ = _loc6_.rotation / (180 / Math.PI);
        _loc1_.SetAsOrientedBox(
            (_loc6_.scaleX * 5) / this.character_scale,
            (_loc6_.scaleY * 5) / this.character_scale,
            _loc17_,
            _loc18_,
        );
        this.mowerBody.CreateShape(_loc1_);
        _loc6_ = this.shapeGuide["alignShape2"];
        _loc17_ = new b2Vec2(
            this._startX + _loc6_.x / this.character_scale,
            this._startY + _loc6_.y / this.character_scale,
        );
        _loc18_ = _loc6_.rotation / (180 / Math.PI);
        _loc1_.SetAsOrientedBox(
            (_loc6_.scaleX * 5) / this.character_scale,
            (_loc6_.scaleY * 5) / this.character_scale,
            _loc17_,
            _loc18_,
        );
        this.mowerBody.CreateShape(_loc1_);
        _loc1_.isSensor = true;
        _loc6_ = this.shapeGuide["clearanceShape"];
        _loc17_ = new b2Vec2(
            this._startX + _loc6_.x / this.character_scale,
            this._startY + _loc6_.y / this.character_scale,
        );
        _loc18_ = _loc6_.rotation / (180 / Math.PI);
        _loc1_.SetAsOrientedBox(
            (_loc6_.scaleX * 5) / this.character_scale,
            (_loc6_.scaleY * 5) / this.character_scale,
            _loc17_,
            _loc18_,
        );
        this.clearanceShape = this.mowerBody.CreateShape(
            _loc1_,
        ) as b2PolygonShape;
        this.session.contactListener.registerListener(
            ContactListener.ADD,
            this.clearanceShape,
            this.clearanceContactAdd,
        );
        this.session.contactListener.registerListener(
            ContactListener.REMOVE,
            this.clearanceShape,
            this.clearanceContactRemove,
        );
        this.mowerBody.SetMassFromShapes();
        this.mowerMass = this.mowerBody.GetMass();
        this.paintVector.push(this.mowerBody);
        _loc2_.density = 5;
        _loc2_.friction = 1;
        _loc2_.restitution = 0.3;
        _loc2_.filter = this.zeroFilter.Copy();
        _loc2_.filter.groupIndex = -2;
        _loc6_ = this.shapeGuide["backWheelShape"];
        _loc9_.position.Set(
            this._startX + _loc6_.x / this.character_scale,
            this._startY + _loc6_.y / this.character_scale,
        );
        _loc9_.angle = _loc6_.rotation / (180 / Math.PI);
        _loc2_.localPosition.Set(0, 0);
        _loc2_.radius = _loc6_.width / 2 / this.character_scale;
        this.backWheelBody = this._session.m_world.CreateBody(_loc9_);
        this.backWheelShape = this.backWheelBody.CreateShape(_loc2_);
        this.backWheelBody.SetMassFromShapes();
        this._session.contactListener.registerListener(
            ContactListener.ADD,
            this.backWheelShape,
            this.contactAddHandler,
        );
        _loc6_ = this.shapeGuide["frontWheelShape"];
        _loc10_.position.Set(
            this._startX + _loc6_.x / this.character_scale,
            this._startY + _loc6_.y / this.character_scale,
        );
        _loc10_.angle = _loc6_.rotation / (180 / Math.PI);
        _loc2_.radius = _loc6_.width / 2 / this.character_scale;
        this.frontWheelBody = this._session.m_world.CreateBody(_loc10_);
        this.frontWheelShape = this.frontWheelBody.CreateShape(_loc2_);
        this.frontWheelBody.SetMassFromShapes();
        this._session.contactListener.registerListener(
            ContactListener.ADD,
            this.frontWheelShape,
            this.contactAddHandler,
        );
        _loc1_.density = 4;
        _loc1_.friction = 0.3;
        _loc1_.restitution = 0.1;
        _loc1_.filter = this.zeroFilter.Copy();
        _loc1_.filter.groupIndex = -2;
        _loc1_.isSensor = false;
        var _loc20_: number = 12 / this.character_scale;
        _loc1_.SetAsOrientedBox(_loc20_, _loc20_, _loc10_.position);
        this.frontShockBody = this._session.m_world.CreateBody(_loc11_);
        this.frontShockBody.CreateShape(_loc1_);
        this.frontShockBody.SetMassFromShapes();
        _loc1_.SetAsOrientedBox(_loc20_, _loc20_, _loc9_.position);
        this.backShockBody = this._session.m_world.CreateBody(_loc12_);
        this.backShockBody.CreateShape(_loc1_);
        this.backShockBody.SetMassFromShapes();
        this.mowerLoop = SoundController.instance.playAreaSoundLoop(
            "MowerLoop",
            this.mowerBody,
            0,
        );
        this.mowerLoop.fadeTo(0.5, 1);
    }

    public override createMovieClips() {
        super.createMovieClips();
        this._session.containerSprite.addChildAt(
            this.pelvisMC,
            this._session.containerSprite.getChildIndex(this.chestMC),
        );
        var _loc1_: MovieClip = this.sourceObject["mowerShards"];
        this._session.particleController.createBMDArray("mowershards", _loc1_);
        this.shockMC = new Sprite();
        this.mowerMC = this.sourceObject["mower"];
        var _loc5_ = 1 / this.mc_scale;
        this.mowerMC.scaleY = 1 / this.mc_scale;
        this.mowerMC.scaleX = _loc5_;
        this.bladeCoverMC = this.sourceObject["bladecover"];
        _loc5_ = 1 / this.mc_scale;
        this.bladeCoverMC.scaleY = 1 / this.mc_scale;
        this.bladeCoverMC.scaleX = _loc5_;
        this.backWheelMC = this.sourceObject["backWheel"];
        _loc5_ = 1 / this.mc_scale;
        this.backWheelMC.scaleY = 1 / this.mc_scale;
        this.backWheelMC.scaleX = _loc5_;
        this.frontWheelMC = this.sourceObject["frontWheel"];
        _loc5_ = 1 / this.mc_scale;
        this.frontWheelMC.scaleY = 1 / this.mc_scale;
        this.frontWheelMC.scaleX = _loc5_;
        this.frontMC = this.sourceObject["mowerFront"];
        _loc5_ = 1 / this.mc_scale;
        this.frontMC.scaleY = 1 / this.mc_scale;
        this.frontMC.scaleX = _loc5_;
        this.frontMC.visible = false;
        this.rearMC = this.sourceObject["mowerRear"];
        _loc5_ = 1 / this.mc_scale;
        this.rearMC.scaleY = 1 / this.mc_scale;
        this.rearMC.scaleX = _loc5_;
        this.rearMC.visible = false;
        this.front1MC = this.sourceObject["front1"];
        _loc5_ = 1 / this.mc_scale;
        this.front1MC.scaleY = 1 / this.mc_scale;
        this.front1MC.scaleX = _loc5_;
        this.front1MC.visible = false;
        this.front2MC = this.sourceObject["front2"];
        _loc5_ = 1 / this.mc_scale;
        this.front2MC.scaleY = 1 / this.mc_scale;
        this.front2MC.scaleX = _loc5_;
        this.front2MC.visible = false;
        this.front3MC = this.sourceObject["front3"];
        _loc5_ = 1 / this.mc_scale;
        this.front3MC.scaleY = 1 / this.mc_scale;
        this.front3MC.scaleX = _loc5_;
        this.front3MC.visible = false;
        this.front4MC = this.sourceObject["front4"];
        _loc5_ = 1 / this.mc_scale;
        this.front4MC.scaleY = 1 / this.mc_scale;
        this.front4MC.scaleX = _loc5_;
        this.front4MC.visible = false;
        this.front5MC = this.sourceObject["front5"];
        _loc5_ = 1 / this.mc_scale;
        this.front5MC.scaleY = 1 / this.mc_scale;
        this.front5MC.scaleX = _loc5_;
        this.front5MC.visible = false;
        this.rear1MC = this.sourceObject["rear1"];
        _loc5_ = 1 / this.mc_scale;
        this.rear1MC.scaleY = 1 / this.mc_scale;
        this.rear1MC.scaleX = _loc5_;
        this.rear1MC.visible = false;
        this.rear2MC = this.sourceObject["rear2"];
        _loc5_ = 1 / this.mc_scale;
        this.rear2MC.scaleY = 1 / this.mc_scale;
        this.rear2MC.scaleX = _loc5_;
        this.rear2MC.visible = false;
        this.rear3MC = this.sourceObject["rear3"];
        _loc5_ = 1 / this.mc_scale;
        this.rear3MC.scaleY = 1 / this.mc_scale;
        this.rear3MC.scaleX = _loc5_;
        this.rear3MC.visible = false;
        this.rear4MC = this.sourceObject["rear4"];
        _loc5_ = 1 / this.mc_scale;
        this.rear4MC.scaleY = 1 / this.mc_scale;
        this.rear4MC.scaleX = _loc5_;
        this.rear4MC.visible = false;
        var _loc2_: b2Vec2 = this.mowerBody.GetLocalCenter();
        _loc2_ = new b2Vec2(
            (this._startX - _loc2_.x) * this.character_scale,
            (this._startY - _loc2_.y) * this.character_scale,
        );
        var _loc3_: MovieClip = this.shapeGuide["rearVert5"];
        var _loc4_ = new b2Vec2(_loc3_.x + _loc2_.x, _loc3_.y + _loc2_.y);
        // @ts-expect-error
        this.mowerMC.inner.x = this.bladeCoverMC.inner.x = _loc4_.x;
        // @ts-expect-error
        this.mowerMC.inner.y = this.bladeCoverMC.inner.y = _loc4_.y;
        this.mowerBody.SetUserData(this.mowerMC);
        this.backWheelBody.SetUserData(this.backWheelMC);
        this.frontWheelBody.SetUserData(this.frontWheelMC);
        this._session.containerSprite.addChildAt(
            this.shockMC,
            this._session.containerSprite.getChildIndex(this.pelvisMC),
        );
        this._session.containerSprite.addChildAt(
            this.mowerMC,
            this._session.containerSprite.getChildIndex(this.pelvisMC),
        );
        this._session.containerSprite.addChildAt(
            this.frontMC,
            this._session.containerSprite.getChildIndex(this.pelvisMC),
        );
        this._session.containerSprite.addChildAt(
            this.rearMC,
            this._session.containerSprite.getChildIndex(this.pelvisMC),
        );
        this._session.containerSprite.addChildAt(
            this.backWheelMC,
            this._session.containerSprite.getChildIndex(this.pelvisMC),
        );
        this._session.containerSprite.addChildAt(
            this.frontWheelMC,
            this._session.containerSprite.getChildIndex(this.pelvisMC),
        );
        this._session.containerSprite.addChildAt(
            this.bladeCoverMC,
            this._session.containerSprite.getChildIndex(this.lowerArm1MC),
        );
        this.targetMaskHolder = new Sprite();
        this._session.containerSprite.addChild(this.targetMaskHolder);
        this.testSprite = new Sprite();
        this._session.containerSprite.addChild(this.testSprite);
        this._session.containerSprite.addChildAt(
            this.front1MC,
            this._session.containerSprite.getChildIndex(this.pelvisMC),
        );
        this._session.containerSprite.addChildAt(
            this.front2MC,
            this._session.containerSprite.getChildIndex(this.pelvisMC),
        );
        this._session.containerSprite.addChildAt(
            this.front4MC,
            this._session.containerSprite.getChildIndex(this.pelvisMC),
        );
        this._session.containerSprite.addChildAt(
            this.front3MC,
            this._session.containerSprite.getChildIndex(this.pelvisMC),
        );
        this._session.containerSprite.addChildAt(
            this.front5MC,
            this._session.containerSprite.getChildIndex(this.pelvisMC),
        );
        this._session.containerSprite.addChildAt(
            this.rear1MC,
            this._session.containerSprite.getChildIndex(this.pelvisMC),
        );
        this._session.containerSprite.addChildAt(
            this.rear2MC,
            this._session.containerSprite.getChildIndex(this.pelvisMC),
        );
        this._session.containerSprite.addChildAt(
            this.rear3MC,
            this._session.containerSprite.getChildIndex(this.pelvisMC),
        );
        this._session.containerSprite.addChildAt(
            this.rear4MC,
            this._session.containerSprite.getChildIndex(this.pelvisMC),
        );
    }

    public override resetMovieClips() {
        super.resetMovieClips();
        trace("chest visible = " + this.chestMC.visible);
        this.testSprite.graphics.clear();
        this.mowerMC.visible = true;
        this.shockMC.visible = true;
        this.bladeCoverMC.visible = true;
        this.frontMC.visible = false;
        this.front1MC.visible = false;
        this.front2MC.visible = false;
        this.front3MC.visible = false;
        this.front4MC.visible = false;
        this.front5MC.visible = false;
        this.rearMC.visible = false;
        this.rear1MC.visible = false;
        this.rear2MC.visible = false;
        this.rear3MC.visible = false;
        this.rear4MC.visible = false;
        this.mowerBody.SetUserData(this.mowerMC);
        this.backWheelBody.SetUserData(this.backWheelMC);
        this.frontWheelBody.SetUserData(this.frontWheelMC);
        this.shockMC.graphics.clear();
        var _loc1_: MovieClip = this.sourceObject["mowerShards"];
        this._session.particleController.createBMDArray("mowershards", _loc1_);
    }

    public override createJoints() {
        var _loc1_: number = NaN;
        var _loc2_: number = NaN;
        var _loc3_: number = NaN;
        super.createJoints();
        var _loc4_: number = 180 / Math.PI;
        _loc1_ = this.head1Body.GetAngle() - this.chestBody.GetAngle();
        _loc2_ = -10 / _loc4_ - _loc1_;
        _loc3_ = 10 / _loc4_ - _loc1_;
        this.neckJoint.SetLimits(_loc2_, _loc3_);
        var _loc5_ = new b2PrismaticJointDef();
        _loc5_.maxMotorForce = 1000;
        _loc5_.enableLimit = true;
        _loc5_.upperTranslation = 0;
        _loc5_.lowerTranslation = 0;
        var _loc6_ = new b2Vec2();
        var _loc7_: MovieClip = this.shapeGuide["frontWheelShape"];
        _loc6_.Set(
            this._startX + _loc7_.x / this.character_scale,
            this._startY + _loc7_.y / this.character_scale,
        );
        _loc5_.Initialize(
            this.mowerBody,
            this.frontShockBody,
            _loc6_,
            new b2Vec2(0, 1),
        );
        this.frontShockJoint = this._session.m_world.CreateJoint(
            _loc5_,
        ) as b2PrismaticJoint;
        _loc7_ = this.shapeGuide["backWheelShape"];
        _loc6_.Set(
            this._startX + _loc7_.x / this.character_scale,
            this._startY + _loc7_.y / this.character_scale,
        );
        _loc5_.Initialize(
            this.mowerBody,
            this.backShockBody,
            _loc6_,
            new b2Vec2(0, 1),
        );
        this.backShockJoint = this._session.m_world.CreateJoint(
            _loc5_,
        ) as b2PrismaticJoint;
        var _loc8_ = new b2RevoluteJointDef();
        _loc8_.maxMotorTorque = this.maxTorque;
        _loc8_.enableLimit = false;
        _loc8_.lowerAngle = 0;
        _loc8_.upperAngle = 0;
        _loc6_ = new b2Vec2();
        _loc6_.Set(
            this.pelvisBody.GetWorldCenter().x,
            this.pelvisBody.GetWorldCenter().y,
        );
        _loc8_.Initialize(this.mowerBody, this.pelvisBody, _loc6_);
        this.mowerPelvis = this._session.m_world.CreateJoint(
            _loc8_,
        ) as b2RevoluteJoint;
        this.mowerPelvisJointDef = _loc8_.clone();
        this.pelvisAnchorPoint = this.mowerBody.GetLocalPoint(_loc6_);
        _loc7_ = this.shapeGuide["backWheelShape"];
        _loc6_.Set(
            this._startX + _loc7_.x / this.character_scale,
            this._startY + _loc7_.y / this.character_scale,
        );
        _loc8_.Initialize(this.backShockBody, this.backWheelBody, _loc6_);
        this.backWheelJoint = this._session.m_world.CreateJoint(
            _loc8_,
        ) as b2RevoluteJoint;
        _loc7_ = this.shapeGuide["frontWheelShape"];
        _loc6_.Set(
            this._startX + _loc7_.x / this.character_scale,
            this._startY + _loc7_.y / this.character_scale,
        );
        _loc8_.Initialize(this.frontShockBody, this.frontWheelBody, _loc6_);
        this.frontWheelJoint = this._session.m_world.CreateJoint(
            _loc8_,
        ) as b2RevoluteJoint;
        _loc7_ = this.shapeGuide["handleAnchor"];
        _loc6_.Set(
            this._startX + _loc7_.x / this.character_scale,
            this._startY + _loc7_.y / this.character_scale,
        );
        _loc8_.Initialize(this.mowerBody, this.lowerArm1Body, _loc6_);
        this.mowerHand1 = this._session.m_world.CreateJoint(
            _loc8_,
        ) as b2RevoluteJoint;
        this.mowerHand1JointDef = _loc8_.clone();
        this.handleAnchorPoint = this.mowerBody.GetLocalPoint(_loc6_);
        _loc8_.Initialize(this.mowerBody, this.lowerArm2Body, _loc6_);
        this.mowerHand2 = this._session.m_world.CreateJoint(
            _loc8_,
        ) as b2RevoluteJoint;
        this.mowerHand2JointDef = _loc8_.clone();
        _loc7_ = this.shapeGuide["footAnchor"];
        _loc6_.Set(
            this._startX + _loc7_.x / this.character_scale,
            this._startY + _loc7_.y / this.character_scale,
        );
        _loc8_.Initialize(this.mowerBody, this.lowerLeg1Body, _loc6_);
        this.mowerFoot1 = this._session.m_world.CreateJoint(
            _loc8_,
        ) as b2RevoluteJoint;
        this.mowerFoot1JointDef = _loc8_.clone();
        this.leg1AnchorPoint = this.mowerBody.GetLocalPoint(_loc6_);
        _loc8_.Initialize(this.mowerBody, this.lowerLeg2Body, _loc6_);
        this.mowerFoot2 = this._session.m_world.CreateJoint(
            _loc8_,
        ) as b2RevoluteJoint;
        this.mowerFoot2JointDef = _loc8_.clone();
        this.leg2AnchorPoint = this.mowerBody.GetLocalPoint(_loc6_);
    }

    protected contactMowerResultHandler(param1: ContactEvent) {
        var _loc2_: number = param1.impulse;
        if (_loc2_ > this.contactImpulseDict.get(this.frontShape)) {
            if (this.contactResultBuffer.get(this.frontShape)) {
                if (
                    _loc2_ >
                    this.contactResultBuffer.get(this.frontShape).impulse
                ) {
                    this.contactResultBuffer.set(this.frontShape, param1);
                }
            } else {
                this.contactResultBuffer.set(this.frontShape, param1);
            }
        }
    }

    protected contactFrontResultHandler(param1: ContactEvent) {
        var _loc2_: number = param1.impulse;
        if (_loc2_ > this.contactImpulseDict.get(this.brokenFrontShape)) {
            if (this.contactResultBuffer.get(this.brokenFrontShape)) {
                if (
                    _loc2_ >
                    this.contactResultBuffer.get(this.brokenFrontShape).impulse
                ) {
                    this.contactResultBuffer.set(this.brokenFrontShape, param1);
                }
            } else {
                this.contactResultBuffer.set(this.brokenFrontShape, param1);
            }
        }
    }

    protected contactRearResultHandler(param1: ContactEvent) {
        var _loc2_: number = param1.impulse;
        if (_loc2_ > this.contactImpulseDict.get(this.brokenRearShape)) {
            if (this.contactResultBuffer.get(this.brokenRearShape)) {
                if (
                    _loc2_ >
                    this.contactResultBuffer.get(this.brokenRearShape).impulse
                ) {
                    this.contactResultBuffer.set(this.brokenRearShape, param1);
                }
            } else {
                this.contactResultBuffer.set(this.brokenRearShape, param1);
            }
        }
    }

    protected contactBladeResultHandler(param1: ContactEvent) {
        var _loc5_: ContactEvent = null;
        var _loc2_: number = param1.impulse;
        var _loc3_: b2Shape = param1.otherShape;
        if (_loc3_.m_density == 0) {
            return;
        }
        var _loc4_ = int(this.bladeShapeArray.indexOf(_loc3_));
        if (_loc4_ > -1) {
            _loc5_ = this.bladeContactArray[_loc4_];
            if (param1.impulse > _loc5_.impulse) {
                this.bladeContactArray[_loc4_] = param1;
            }
        } else {
            this.bladeShapeArray.push(_loc3_);
            this.bladeContactArray.push(param1);
        }
    }

    protected override handleContactResults() {
        var _loc1_: ContactEvent = null;
        super.handleContactResults();
        if (this.contactResultBuffer.get(this.frontShape)) {
            _loc1_ = this.contactResultBuffer.get(this.frontShape);
            this.mowerSmash(_loc1_.impulse);
            this.contactResultBuffer.delete(this.frontShape);
            this.contactAddBuffer.delete(this.frontShape);
            this.contactAddBuffer.delete(this.topShape);
            this.contactAddBuffer.delete(this.seatShape1);
        }
        if (this.contactResultBuffer.get(this.brokenFrontShape)) {
            _loc1_ = this.contactResultBuffer.get(this.brokenFrontShape);
            this.frontSmash(_loc1_.impulse);
            this.contactResultBuffer.delete(this.brokenFrontShape);
            this.contactAddBuffer.delete(this.brokenFrontShape);
        }
        if (this.contactResultBuffer.get(this.brokenRearShape)) {
            _loc1_ = this.contactResultBuffer.get(this.brokenRearShape);
            this.rearSmash(_loc1_.impulse);
            this.contactResultBuffer.delete(this.brokenRearShape);
            this.contactAddBuffer.delete(this.brokenRearShape);
            this.contactAddBuffer.delete(this.baseShape);
            this.contactAddBuffer.delete(this.bladeShape);
            this.contactAddBuffer.delete(this.topShape);
            this.contactAddBuffer.delete(this.seatShape1);
        }
        this.handleBladeContacts();
    }

    protected handleBladeContacts() {
        var _loc2_: ContactEvent = null;
        var _loc3_: b2Shape = null;
        var _loc4_: b2Body = null;
        var _loc5_: b2Vec2 = null;
        var _loc6_: number = NaN;
        var _loc7_: b2Vec2 = null;
        var _loc8_: number = NaN;
        var _loc9_: b2World = null;
        var _loc10_: b2FilterData = null;
        var _loc11_: b2Body = null;
        var _loc12_: number = NaN;
        var _loc13_: number = NaN;
        var _loc14_: number = NaN;
        var _loc15_: number = NaN;
        var _loc16_: number = NaN;
        var _loc17_: number = NaN;
        var _loc18_: any[] = null;
        var _loc19_: number = NaN;
        var _loc20_: b2Vec2 = null;
        var _loc21_: b2Vec2 = null;
        var _loc22_: number = 0;
        var _loc23_: string = null;
        var _loc24_: b2BodyDef = null;
        var _loc25_: b2Body = null;
        var _loc26_: b2PolygonDef = null;
        var _loc27_: b2PrismaticJointDef = null;
        var _loc28_: b2PrismaticJoint = null;
        var _loc29_: b2RevoluteJointDef = null;
        var _loc30_: b2RevoluteJoint = null;
        var _loc31_: NPCharacter = null;
        var _loc32_: CharacterB2D = null;
        var _loc33_: FoodItem = null;
        var _loc34_: Sprite = null;
        var _loc35_: Sprite = null;
        var _loc36_: b2Vec2 = null;
        var _loc37_: FoodItem = null;
        var _loc38_: Emitter = null;
        var _loc39_: number = 0;
        var _loc40_: number = 0;
        var _loc41_: number = 0;
        var _loc42_: number = NaN;
        var _loc43_: number = NaN;
        var _loc44_: number = NaN;
        var _loc45_: number = NaN;
        var _loc46_: number = NaN;
        var _loc47_: number = NaN;
        var _loc48_: number = NaN;
        var _loc49_: string = null;
        var _loc50_: number = NaN;
        var _loc51_: number = NaN;
        var _loc52_: b2Vec2 = null;
        var _loc1_: number = 0;
        while (_loc1_ < this.bladeContactArray.length) {
            _loc2_ = this.bladeContactArray[_loc1_];
            _loc3_ = _loc2_.otherShape;
            _loc4_ = _loc3_.GetBody();
            _loc5_ = _loc2_.position;
            _loc6_ = _loc4_.GetMass();
            _loc7_ = this.mowerBody.GetLocalPoint(_loc5_);
            _loc7_.Subtract(this.bladeCenter);
            _loc8_ = -_loc7_.x / this.bladeX;
            if (Boolean(_loc3_.m_material & 7) && Math.abs(_loc8_) < 0.5) {
                this.grindingMass += _loc6_;
                _loc9_ = this.session.m_world;
                _loc10_ = new b2FilterData();
                _loc10_.categoryBits = 1;
                _loc10_.maskBits = 9;
                _loc10_.groupIndex = -3;
                _loc3_.SetFilterData(_loc10_);
                _loc9_.Refilter(_loc3_);
                _loc3_.SetMaterial(0);
                if (_loc3_.m_userData instanceof NPCharacter) {
                    _loc31_ = _loc3_.m_userData as NPCharacter;
                    _loc31_.grindShape(_loc3_);
                } else if (_loc3_.m_userData instanceof CharacterB2D) {
                    _loc32_ = _loc3_.m_userData as CharacterB2D;
                    _loc32_.grindShape(_loc3_);
                } else if (_loc3_.m_userData instanceof FoodItem) {
                    _loc33_ = _loc3_.m_userData as FoodItem;
                    _loc33_.grindShape(_loc3_);
                }
                _loc11_ = _loc4_;
                this.contactCount.set(_loc11_, 0);
                if (_loc6_ > 0.1) {
                    _loc34_ = _loc11_.GetUserData() as Sprite;
                    _loc35_ = new Sprite();
                    this.targetMaskHolder.addChild(_loc35_);
                    _loc36_ = this.clearanceShape.m_vertices[0].Copy();
                    _loc36_.Subtract(this.mowerBody.GetLocalCenter());
                    _loc35_.graphics.beginFill(0, 0);
                    _loc35_.graphics.drawRect(
                        -100,
                        _loc36_.y * this.m_physScale,
                        200,
                        100,
                    );
                    _loc35_.graphics.endFill();
                    _loc34_.mask = _loc35_;
                }
                _loc12_ = Math.min(1, _loc6_ / 0.4);
                _loc13_ = 1.12 * _loc12_;
                _loc14_ = _loc13_ * 0.5;
                _loc15_ = this.mowerBody.GetLocalPoint(_loc5_).x;
                _loc16_ = Math.max(this.bladeLeftX, _loc15_ - _loc14_);
                _loc17_ = Math.min(this.bladeRightX, _loc15_ + _loc14_);
                _loc18_ = this.bladeShape.GetVertices();
                _loc19_ = Number(this.bladeShape.GetVertices()[2].y);
                _loc20_ = new b2Vec2(_loc16_, _loc19_);
                _loc21_ = new b2Vec2(_loc17_, _loc19_);
                _loc22_ = this.session.containerSprite.getChildIndex(
                    this.bladeCoverMC,
                );
                if (_loc3_.GetUserData() instanceof FoodItem) {
                    _loc37_ = _loc3_.GetUserData() as FoodItem;
                    _loc23_ = _loc37_.particleType;
                    _loc38_ = this.session.particleController.createSpray(
                        _loc23_,
                        this.mowerBody,
                        _loc20_,
                        _loc21_,
                        0,
                        5,
                        180,
                        Math.round(20 * _loc12_),
                        5000,
                        this.session.containerSprite,
                        _loc22_,
                    );
                } else {
                    _loc39_ = 0;
                    _loc40_ = 5;
                    _loc41_ = 20;
                    if (Settings.bloodSetting > 1) {
                        _loc39_ = 3;
                        _loc40_ = 10;
                        _loc41_ = 20;
                    }
                    _loc38_ = this.session.particleController.createBloodSpray(
                        this.mowerBody,
                        _loc20_,
                        _loc21_,
                        _loc39_,
                        _loc40_,
                        180,
                        Math.round(_loc41_ * _loc12_),
                        5000,
                        this.session.containerSprite,
                        _loc22_,
                    );
                }
                _loc24_ = new b2BodyDef();
                _loc24_.position.Set(_loc5_.x, _loc5_.y);
                _loc24_.angle = this.mowerBody.GetAngle();
                _loc25_ = _loc9_.CreateBody(_loc24_);
                _loc26_ = new b2PolygonDef();
                _loc26_.density = 5;
                _loc26_.restitution = 0.1;
                _loc26_.friction = 0.1;
                _loc26_.SetAsBox(10 / this.m_physScale, 10 / this.m_physScale);
                _loc26_.isSensor = true;
                _loc25_.CreateShape(_loc26_);
                _loc25_.SetMassFromShapes();
                _loc25_.SetUserData(_loc38_);
                _loc27_ = new b2PrismaticJointDef();
                _loc27_.enableLimit = true;
                _loc27_.upperTranslation = 0;
                _loc27_.lowerTranslation = -10;
                _loc27_.maxMotorForce = 100000;
                _loc27_.enableMotor = true;
                _loc27_.motorSpeed = -0.5;
                _loc43_ = this.mowerBody.GetAngle();
                _loc27_.Initialize(
                    this.mowerBody,
                    _loc25_,
                    _loc5_,
                    new b2Vec2(-Math.sin(_loc43_), Math.cos(_loc43_)),
                );
                _loc28_ = _loc9_.CreateJoint(_loc27_) as b2PrismaticJoint;
                _loc29_ = new b2RevoluteJointDef();
                _loc29_.enableMotor = true;
                _loc29_.motorSpeed = 0;
                _loc29_.maxMotorTorque = 5;
                _loc29_.Initialize(_loc25_, _loc11_, _loc5_);
                _loc30_ = _loc9_.CreateJoint(_loc29_) as b2RevoluteJoint;
                this.addedJointsArray.push(_loc30_);
                if (!this.grindLoop) {
                    this.grindLoop = SoundController.instance.playAreaSoundLoop(
                        "GrindLoop2",
                        this.mowerBody,
                        0,
                        Math.random() * 10000,
                    );
                    this.grindLoop.fadeIn(0.2);
                }
            } else {
                _loc42_ = _loc8_ * 1.2217 - 1.5708;
                _loc42_ = _loc42_ + this.mowerBody.GetAngle();
                _loc43_ = _loc42_ - Math.PI;
                _loc44_ = 3;
                if (_loc6_ > 0) {
                    _loc45_ = _loc6_ / (_loc6_ + this.mowerMass);
                    _loc46_ = 1 - _loc45_;
                    _loc47_ = Math.cos(_loc42_) * _loc44_ * _loc45_;
                    _loc48_ = Math.sin(_loc42_) * _loc44_ * _loc45_;
                    this.mowerBody.ApplyImpulse(
                        new b2Vec2(_loc47_, _loc48_),
                        _loc5_,
                    );
                    _loc47_ = Math.cos(_loc43_) * _loc44_ * _loc46_;
                    _loc48_ = Math.sin(_loc43_) * _loc44_ * _loc46_;
                    _loc4_.ApplyImpulse(new b2Vec2(_loc47_, _loc48_), _loc5_);
                    if (
                        !this.mowerImpactSound &&
                        this.targetBodies.length == 0
                    ) {
                        _loc49_ = "MowerImpact" + Math.ceil(Math.random() * 3);
                        this.mowerImpactSound =
                            SoundController.instance.playAreaSoundInstance(
                                _loc49_,
                                _loc4_,
                            );
                        _loc50_ = this.mowerBody.GetLocalPoint(_loc5_).x;
                        _loc51_ = Number(this.bladeShape.GetVertices()[2].y);
                        _loc52_ = this.mowerBody.GetWorldPoint(
                            new b2Vec2(_loc50_, _loc51_),
                        );
                        this.session.particleController.createSparkBurstPoint(
                            _loc52_,
                            new b2Vec2(_loc47_ * 5, _loc48_ * 5),
                            5,
                            50,
                            20,
                        );
                    }
                } else {
                    _loc47_ = Math.cos(_loc42_) * _loc44_;
                    _loc48_ = Math.sin(_loc42_) * _loc44_;
                    this.mowerBody.ApplyImpulse(
                        new b2Vec2(_loc47_, _loc48_),
                        _loc5_,
                    );
                    if (
                        !this.mowerImpactSound &&
                        this.targetBodies.length == 0
                    ) {
                        _loc49_ = "MowerImpact" + Math.ceil(Math.random() * 3);
                        this.mowerImpactSound =
                            SoundController.instance.playAreaSoundInstance(
                                _loc49_,
                                this.mowerBody,
                                0.4,
                            );
                        _loc50_ = this.mowerBody.GetLocalPoint(_loc5_).x;
                        _loc51_ = Number(this.bladeShape.GetVertices()[2].y);
                        _loc52_ = this.mowerBody.GetWorldPoint(
                            new b2Vec2(_loc50_, _loc51_),
                        );
                        this.session.particleController.createSparkBurstPoint(
                            _loc52_,
                            new b2Vec2(-_loc47_ * 5, -_loc48_ * 5),
                            5,
                            50,
                            20,
                        );
                    }
                }
            }
            _loc1_++;
        }
        this.bladeContactArray = new Array();
        this.bladeShapeArray = new Array();
    }

    protected clearanceContactAdd(param1: b2ContactPoint) {
        var _loc2_: b2Body = param1.shape2.m_body;
        if (this.contactCount.get(_loc2_) == undefined) {
            throw new Error("contact count not defined");
        }
        var _loc3_ = int(this.contactCount.get(_loc2_));
        this.contactCount.set(_loc2_, _loc3_ + 1);
    }

    protected clearanceContactRemove(param1: b2ContactPoint) {
        var _loc2_: b2Body = param1.shape2.m_body;
        var _loc3_ = int(this.contactCount.get(_loc2_));
        this.contactCount.set(_loc2_, _loc3_ - 1);
    }

    public override eject() {
        if (this.ejected) {
            return;
        }
        this.ejected = true;
        this.resetJointLimits();
        var _loc1_: b2World = this._session.m_world;
        if (this.mowerPelvis) {
            _loc1_.DestroyJoint(this.mowerPelvis);
            this.mowerPelvis = null;
        }
        if (this.mowerHand1) {
            _loc1_.DestroyJoint(this.mowerHand1);
            this.mowerHand1 = null;
        }
        if (this.mowerHand2) {
            _loc1_.DestroyJoint(this.mowerHand2);
            this.mowerHand2 = null;
        }
        if (this.mowerFoot1) {
            _loc1_.DestroyJoint(this.mowerFoot1);
            this.mowerFoot1 = null;
        }
        if (this.mowerFoot2) {
            _loc1_.DestroyJoint(this.mowerFoot2);
            this.mowerFoot2 = null;
        }
        var _loc2_: b2Shape = this.upperLeg1Body.GetShapeList();
        _loc2_.m_isSensor = false;
        _loc1_.Refilter(_loc2_);
        _loc2_ = this.upperLeg2Body.GetShapeList();
        _loc2_.m_isSensor = false;
        _loc1_.Refilter(_loc2_);
        this.lowerLeg1Shape.m_isSensor = false;
        _loc1_.Refilter(this.lowerLeg1Shape);
        this.lowerLeg2Shape.m_isSensor = false;
        _loc1_.Refilter(this.lowerLeg2Shape);
        this.frontShockJoint.EnableMotor(false);
        this.frontShockJoint.SetLimits(0, 0);
        this.frontShockJoint.SetMotorSpeed(0);
        this.backShockJoint.EnableMotor(false);
        this.backShockJoint.SetLimits(0, 0);
        this.backShockJoint.SetMotorSpeed(0);
        // @ts-expect-error
        this.lowerArm1MC.hand.gotoAndStop(2);
        // @ts-expect-error
        this.lowerArm2MC.hand.gotoAndStop(2);
        var _loc3_: number = this.mowerBody.GetAngle() - Math.PI / 2;
        var _loc4_: number = Math.cos(_loc3_) * this.ejectImpulse;
        var _loc5_: number = Math.sin(_loc3_) * this.ejectImpulse;
        this.chestBody.ApplyImpulse(
            new b2Vec2(_loc4_, _loc5_),
            this.chestBody.GetWorldCenter(),
        );
        this.pelvisBody.ApplyImpulse(
            new b2Vec2(_loc4_, _loc5_),
            this.pelvisBody.GetWorldCenter(),
        );
    }

    public override set dead(param1: boolean) {
        this._dead = param1;
        if (this._dead) {
            this.userVehicleEject();
            this.currentPose = 0;
            this.releaseGrip();
            if (this.voiceSound) {
                this.voiceSound.stopSound();
                this.voiceSound = null;
            }
        }
    }

    public checkEject() {
        if (
            !this.mowerHand1 &&
            !this.mowerHand2 &&
            !this.mowerFoot1 &&
            !this.mowerFoot2
        ) {
            this.eject();
        }
    }

    protected mowerSmash(param1: number) {
        var _loc14_: b2Body = null;
        var _loc15_: b2Shape = null;
        var _loc16_: b2Body = null;
        var _loc17_: Emitter = null;
        var _loc18_: Sprite = null;
        var _loc19_: NPCharacter = null;
        var _loc20_: CharacterB2D = null;
        var _loc21_: DisplayObject = null;
        trace(
            this.tag +
            " mower impulse " +
            param1 +
            " -> " +
            this._session.iteration,
        );
        this.contactImpulseDict.delete(this.frontShape);
        var _loc2_: ContactListener = this._session.contactListener;
        _loc2_.deleteListener(ContactListener.RESULT, this.frontShape);
        _loc2_.deleteListener(ContactListener.RESULT, this.topShape);
        _loc2_.deleteListener(ContactListener.RESULT, this.rearShape);
        _loc2_.deleteListener(ContactListener.RESULT, this.seatShape1);
        _loc2_.deleteListener(ContactListener.RESULT, this.bladeShape);
        _loc2_.deleteListener(ContactListener.ADD, this.frontShape);
        _loc2_.deleteListener(ContactListener.ADD, this.topShape);
        _loc2_.deleteListener(ContactListener.ADD, this.seatShape1);
        var _loc3_: b2World = this._session.m_world;
        this.bladeShapeArray = new Array();
        this.bladeContactArray = new Array();
        var _loc4_ = int(this.targetBodies.length);
        var _loc5_: number = 0;
        while (_loc5_ < _loc4_) {
            _loc14_ = this.targetBodies[_loc5_];
            _loc15_ = _loc14_.GetShapeList();
            if (_loc15_.m_userData instanceof NPCharacter) {
                _loc19_ = _loc15_.m_userData as NPCharacter;
                _loc19_.removeBody(_loc14_);
            } else if (_loc15_.m_userData instanceof CharacterB2D) {
                _loc20_ = _loc15_.m_userData as CharacterB2D;
                _loc20_.removeBody(_loc14_);
            }
            _loc16_ = this.risingBodies[_loc5_];
            _loc17_ = _loc16_.GetUserData();
            _loc17_.stopSpewing();
            _loc3_.DestroyBody(_loc14_);
            _loc3_.DestroyBody(_loc16_);
            _loc18_ = _loc14_.m_userData;
            if (_loc18_.mask != null) {
                _loc21_ = _loc18_.mask;
                _loc18_.mask = null;
                this.targetMaskHolder.removeChild(_loc21_);
            }
            _loc18_.visible = false;
            _loc5_++;
        }
        if (this.grindLoop) {
            this.grindLoop.stopSound();
            this.grindLoop = null;
        }
        this.mowerLoop.stopSound();
        this.mowerLoop = null;
        this.addedJointsArray = new Array();
        this.targetBodies = new Array();
        this.risingBodies = new Array();
        this.eject();
        this.mowerSmashed = true;
        var _loc6_: b2Vec2 = this.mowerBody.GetPosition();
        var _loc7_: number = this.mowerBody.GetAngle();
        var _loc8_: b2Vec2 = this.mowerBody.GetLinearVelocity();
        var _loc9_: number = this.mowerBody.GetAngularVelocity();
        var _loc10_ = new b2BodyDef();
        _loc10_.position = _loc6_;
        _loc10_.angle = _loc7_;
        var _loc11_ = new b2PolygonDef();
        _loc11_.density = 4;
        _loc11_.friction = 0.3;
        _loc11_.restitution = 0.1;
        _loc11_.filter = this.zeroFilter;
        this.frontBody = _loc3_.CreateBody(_loc10_);
        this.frontBody.SetAngularVelocity(_loc9_);
        this.rearBody = _loc3_.CreateBody(_loc10_);
        this.rearBody.SetAngularVelocity(_loc9_);
        _loc11_.vertexCount = 4;
        _loc11_.vertices = this.handleShape.GetVertices();
        this.handleShape = this.frontBody.CreateShape(
            _loc11_,
        ) as b2PolygonShape;
        _loc2_.registerListener(
            ContactListener.RESULT,
            this.handleShape,
            this.contactFrontResultHandler,
        );
        _loc11_.vertices = this.shaftShape.GetVertices();
        this.frontBody.CreateShape(_loc11_);
        _loc11_.vertexCount = 6;
        _loc11_.vertices = this.frontShape.GetVertices();
        this.brokenFrontShape = this.frontBody.CreateShape(
            _loc11_,
        ) as b2PolygonShape;
        _loc2_.registerListener(
            ContactListener.RESULT,
            this.brokenFrontShape,
            this.contactFrontResultHandler,
        );
        _loc2_.registerListener(
            ContactListener.ADD,
            this.brokenFrontShape,
            this.contactAddHandler,
        );
        this.frontBody.SetMassFromShapes();
        this.frontBody.SetLinearVelocity(
            this.mowerBody.GetLinearVelocityFromLocalPoint(
                this.frontBody.GetLocalCenter(),
            ),
        );
        this.contactImpulseDict.set(
            this.brokenFrontShape,
            this.frontRearSmashLimit,
        );
        this.contactAddSounds.set(this.brokenFrontShape, "ChairHit3");
        _loc11_.vertexCount = 4;
        _loc11_.vertices = this.baseShape.GetVertices();
        this.baseShape = this.rearBody.CreateShape(_loc11_) as b2PolygonShape;
        _loc2_.registerListener(
            ContactListener.RESULT,
            this.baseShape,
            this.contactRearResultHandler,
        );
        _loc2_.registerListener(
            ContactListener.ADD,
            this.baseShape,
            this.contactAddHandler,
        );
        _loc11_.vertices = this.bladeShape.GetVertices();
        this.bladeShape = this.rearBody.CreateShape(_loc11_) as b2PolygonShape;
        _loc2_.registerListener(
            ContactListener.RESULT,
            this.bladeShape,
            this.contactRearResultHandler,
        );
        _loc2_.registerListener(
            ContactListener.ADD,
            this.bladeShape,
            this.contactAddHandler,
        );
        _loc11_.vertexCount = 5;
        _loc11_.vertices = this.rearShape.GetVertices();
        this.brokenRearShape = this.rearBody.CreateShape(
            _loc11_,
        ) as b2PolygonShape;
        _loc2_.registerListener(
            ContactListener.RESULT,
            this.brokenRearShape,
            this.contactRearResultHandler,
        );
        _loc2_.registerListener(
            ContactListener.ADD,
            this.brokenRearShape,
            this.contactAddHandler,
        );
        _loc11_.vertices = this.topShape.GetVertices();
        this.topShape = this.rearBody.CreateShape(_loc11_) as b2PolygonShape;
        _loc2_.registerListener(
            ContactListener.RESULT,
            this.topShape,
            this.contactRearResultHandler,
        );
        _loc2_.registerListener(
            ContactListener.ADD,
            this.topShape,
            this.contactAddHandler,
        );
        _loc11_.vertexCount = 4;
        _loc11_.vertices = this.seatShape1.GetVertices();
        this.seatShape1 = this.rearBody.CreateShape(_loc11_) as b2PolygonShape;
        _loc2_.registerListener(
            ContactListener.RESULT,
            this.seatShape1,
            this.contactRearResultHandler,
        );
        _loc2_.registerListener(
            ContactListener.ADD,
            this.seatShape1,
            this.contactAddHandler,
        );
        _loc11_.vertices = this.seatShape2.GetVertices();
        this.seatShape2 = this.rearBody.CreateShape(_loc11_) as b2PolygonShape;
        this.rearBody.SetMassFromShapes();
        this.rearBody.SetLinearVelocity(
            this.mowerBody.GetLinearVelocityFromLocalPoint(
                this.rearBody.GetLocalCenter(),
            ),
        );
        this.contactImpulseDict.set(
            this.brokenRearShape,
            this.frontRearSmashLimit,
        );
        this.contactAddSounds.set(this.bladeShape, "BikeHit1");
        this.contactAddSounds.set(this.baseShape, "ChairHit2");
        this.contactAddSounds.set(this.topShape, "ChairHit2");
        this.contactAddSounds.set(this.brokenRearShape, "ChairHit3");
        this.contactAddSounds.set(this.seatShape1, "BikeHit3");
        var _loc12_: b2Vec2 = this.mowerBody.GetWorldCenter();
        this._session.particleController.createPointBurst(
            "mowershards",
            _loc12_.x * this.m_physScale,
            _loc12_.y * this.m_physScale,
            30,
            30,
            70,
        );
        _loc3_.DestroyBody(this.mowerBody);
        _loc3_.DestroyBody(this.frontShockBody);
        _loc3_.DestroyBody(this.backShockBody);
        this.mowerMC.visible = this.bladeCoverMC.visible = false;
        this.frontMC.visible = true;
        this.frontBody.SetUserData(this.frontMC);
        this.paintVector.push(this.frontBody);
        this.rearMC.visible = true;
        this.rearBody.SetUserData(this.rearMC);
        this.paintVector.push(this.rearBody);
        var _loc13_ = new b2RevoluteJointDef();
        _loc13_.maxMotorTorque = this.maxTorque;
        _loc13_.enableLimit = false;
        _loc13_.lowerAngle = 0;
        _loc13_.upperAngle = 0;
        _loc13_.body1 = this.frontBody;
        _loc13_.body2 = this.frontWheelBody;
        _loc13_.localAnchor1 = this.frontShockJoint.m_localAnchor1;
        _loc13_.localAnchor2 = this.frontWheelJoint.m_localAnchor2;
        _loc3_.DestroyJoint(this.frontWheelJoint);
        this.frontWheelJoint = _loc3_.CreateJoint(_loc13_) as b2RevoluteJoint;
        _loc13_.body1 = this.rearBody;
        _loc13_.body2 = this.backWheelBody;
        _loc13_.localAnchor1 = this.backShockJoint.m_localAnchor1;
        _loc13_.localAnchor2 = this.backWheelJoint.m_localAnchor2;
        _loc3_.DestroyJoint(this.backWheelJoint);
        this.backWheelJoint = _loc3_.CreateJoint(_loc13_) as b2RevoluteJoint;
        this.shockMC.visible = false;
        SoundController.instance.playAreaSoundInstance(
            "MetalSmashHeavy3",
            this.mowerBody,
        );
    }

    public frontSmash(param1: number) {
        var _loc16_: MovieClip = null;
        trace(
            this.tag +
            " front impulse " +
            param1 +
            " -> " +
            this._session.iteration,
        );
        this.contactImpulseDict.delete(this.brokenFrontShape);
        var _loc2_: ContactListener = this._session.contactListener;
        _loc2_.deleteListener(ContactListener.RESULT, this.brokenFrontShape);
        _loc2_.deleteListener(ContactListener.RESULT, this.handleShape);
        _loc2_.deleteListener(ContactListener.ADD, this.brokenFrontShape);
        var _loc3_: b2World = this._session.m_world;
        var _loc4_: b2Vec2 = this.frontBody.GetPosition();
        var _loc5_: number = this.frontBody.GetAngle();
        var _loc6_: b2Vec2 = this.frontBody.GetLinearVelocity();
        var _loc7_: number = this.frontBody.GetAngularVelocity();
        var _loc8_ = new b2BodyDef();
        _loc8_.position = _loc4_;
        _loc8_.angle = _loc5_;
        var _loc9_ = new b2PolygonDef();
        _loc9_.density = 4;
        _loc9_.friction = 0.3;
        _loc9_.restitution = 0.1;
        _loc9_.filter = this.zeroFilter;
        var _loc10_: b2Body = _loc3_.CreateBody(_loc8_);
        _loc10_.SetAngularVelocity(_loc7_);
        var _loc11_: b2Body = _loc3_.CreateBody(_loc8_);
        _loc11_.SetAngularVelocity(_loc7_);
        var _loc12_: b2Body = _loc3_.CreateBody(_loc8_);
        _loc12_.SetAngularVelocity(_loc7_);
        var _loc13_: b2Body = _loc3_.CreateBody(_loc8_);
        _loc13_.SetAngularVelocity(_loc7_);
        var _loc14_: b2Body = _loc3_.CreateBody(_loc8_);
        _loc14_.SetAngularVelocity(_loc7_);
        _loc9_.vertexCount = 4;
        _loc9_.vertices = this.handleShape.GetVertices();
        _loc10_.CreateShape(_loc9_);
        var _loc15_: number = 0;
        while (_loc15_ < 4) {
            _loc16_ = this.shapeGuide["f1vert" + [_loc15_ + 1]];
            _loc9_.vertices[_loc15_] = new b2Vec2(
                this._startX + _loc16_.x / this.character_scale,
                this._startY + _loc16_.y / this.character_scale,
            );
            _loc15_++;
        }
        _loc10_.CreateShape(_loc9_);
        _loc10_.SetMassFromShapes();
        _loc10_.SetLinearVelocity(
            this.frontBody.GetLinearVelocityFromLocalPoint(
                _loc10_.GetLocalCenter(),
            ),
        );
        _loc10_.SetUserData(this.front1MC);
        this.front1MC.visible = true;
        this.paintVector.push(_loc10_);
        _loc15_ = 0;
        while (_loc15_ < 4) {
            _loc16_ = this.shapeGuide["f2vert" + [_loc15_ + 1]];
            _loc9_.vertices[_loc15_] = new b2Vec2(
                this._startX + _loc16_.x / this.character_scale,
                this._startY + _loc16_.y / this.character_scale,
            );
            _loc15_++;
        }
        _loc11_.CreateShape(_loc9_);
        _loc11_.SetMassFromShapes();
        _loc11_.SetLinearVelocity(
            this.frontBody.GetLinearVelocityFromLocalPoint(
                _loc11_.GetLocalCenter(),
            ),
        );
        _loc11_.SetUserData(this.front2MC);
        this.front2MC.visible = true;
        this.paintVector.push(_loc11_);
        _loc15_ = 0;
        while (_loc15_ < 4) {
            _loc16_ = this.shapeGuide["f3vert" + [_loc15_ + 1]];
            _loc9_.vertices[_loc15_] = new b2Vec2(
                this._startX + _loc16_.x / this.character_scale,
                this._startY + _loc16_.y / this.character_scale,
            );
            _loc15_++;
        }
        _loc12_.CreateShape(_loc9_);
        _loc12_.SetMassFromShapes();
        _loc12_.SetLinearVelocity(
            this.frontBody.GetLinearVelocityFromLocalPoint(
                _loc12_.GetLocalCenter(),
            ),
        );
        _loc12_.SetUserData(this.front3MC);
        this.front3MC.visible = true;
        this.paintVector.push(_loc12_);
        _loc15_ = 0;
        while (_loc15_ < 4) {
            _loc16_ = this.shapeGuide["f4vert" + [_loc15_ + 1]];
            _loc9_.vertices[_loc15_] = new b2Vec2(
                this._startX + _loc16_.x / this.character_scale,
                this._startY + _loc16_.y / this.character_scale,
            );
            _loc15_++;
        }
        _loc13_.CreateShape(_loc9_);
        _loc13_.SetMassFromShapes();
        _loc13_.SetLinearVelocity(
            this.frontBody.GetLinearVelocityFromLocalPoint(
                _loc13_.GetLocalCenter(),
            ),
        );
        _loc13_.SetUserData(this.front4MC);
        this.front4MC.visible = true;
        this.paintVector.push(_loc13_);
        _loc15_ = 0;
        while (_loc15_ < 4) {
            _loc16_ = this.shapeGuide["f5vert" + [_loc15_ + 1]];
            _loc9_.vertices[_loc15_] = new b2Vec2(
                this._startX + _loc16_.x / this.character_scale,
                this._startY + _loc16_.y / this.character_scale,
            );
            _loc15_++;
        }
        _loc14_.CreateShape(_loc9_);
        _loc14_.SetMassFromShapes();
        _loc14_.SetLinearVelocity(
            this.frontBody.GetLinearVelocityFromLocalPoint(
                _loc14_.GetLocalCenter(),
            ),
        );
        _loc14_.SetUserData(this.front5MC);
        this.front5MC.visible = true;
        this.paintVector.push(_loc14_);
        this._session.particleController.createBurst(
            "mowershards",
            30,
            30,
            this.frontBody,
            50,
        );
        _loc3_.DestroyBody(this.frontBody);
        this.frontMC.visible = false;
        _loc3_.DestroyJoint(this.frontWheelJoint);
        SoundController.instance.playAreaSoundInstance(
            "MetalSmashHeavy2",
            this.frontBody,
        );
    }

    public rearSmash(param1: number) {
        var _loc16_: MovieClip = null;
        trace(
            this.tag +
            " rear impulse " +
            param1 +
            " -> " +
            this._session.iteration,
        );
        this.contactImpulseDict.delete(this.brokenRearShape);
        var _loc2_: ContactListener = this._session.contactListener;
        _loc2_.deleteListener(ContactListener.RESULT, this.baseShape);
        _loc2_.deleteListener(ContactListener.RESULT, this.bladeShape);
        _loc2_.deleteListener(ContactListener.RESULT, this.brokenRearShape);
        _loc2_.deleteListener(ContactListener.RESULT, this.topShape);
        _loc2_.deleteListener(ContactListener.RESULT, this.seatShape1);
        _loc2_.deleteListener(ContactListener.ADD, this.baseShape);
        _loc2_.deleteListener(ContactListener.ADD, this.bladeShape);
        _loc2_.deleteListener(ContactListener.ADD, this.brokenRearShape);
        _loc2_.deleteListener(ContactListener.ADD, this.topShape);
        _loc2_.deleteListener(ContactListener.ADD, this.seatShape1);
        var _loc3_: b2World = this._session.m_world;
        var _loc4_: b2Vec2 = this.rearBody.GetPosition();
        var _loc5_: number = this.rearBody.GetAngle();
        var _loc6_: b2Vec2 = this.rearBody.GetLinearVelocity();
        var _loc7_: number = this.rearBody.GetAngularVelocity();
        var _loc8_ = new b2BodyDef();
        _loc8_.position = _loc4_;
        _loc8_.angle = _loc5_;
        var _loc9_ = new b2PolygonDef();
        _loc9_.density = 4;
        _loc9_.friction = 0.3;
        _loc9_.restitution = 0.1;
        _loc9_.filter = this.zeroFilter;
        var _loc10_: b2Body = _loc3_.CreateBody(_loc8_);
        _loc10_.SetAngularVelocity(_loc7_);
        var _loc11_: b2Body = _loc3_.CreateBody(_loc8_);
        _loc11_.SetAngularVelocity(_loc7_);
        var _loc12_: b2Body = _loc3_.CreateBody(_loc8_);
        _loc12_.SetAngularVelocity(_loc7_);
        var _loc13_: b2Body = _loc3_.CreateBody(_loc8_);
        _loc13_.SetAngularVelocity(_loc7_);
        var _loc14_: b2Body = _loc3_.CreateBody(_loc8_);
        _loc14_.SetAngularVelocity(_loc7_);
        _loc9_.vertexCount = this.baseShape.m_vertexCount;
        _loc9_.vertices = this.baseShape.GetVertices();
        _loc10_.CreateShape(_loc9_);
        _loc10_.SetMassFromShapes();
        _loc10_.SetLinearVelocity(
            this.rearBody.GetLinearVelocityFromLocalPoint(
                _loc10_.GetLocalCenter(),
            ),
        );
        _loc10_.SetUserData(this.rear3MC);
        this.rear3MC.visible = true;
        this.paintVector.push(_loc10_);
        var _loc15_: number = 0;
        while (_loc15_ < 4) {
            _loc16_ = this.shapeGuide["r1vert" + [_loc15_]];
            _loc9_.vertices[_loc15_] = new b2Vec2(
                this._startX + _loc16_.x / this.character_scale,
                this._startY + _loc16_.y / this.character_scale,
            );
            _loc15_++;
        }
        _loc11_.CreateShape(_loc9_);
        _loc11_.SetMassFromShapes();
        _loc11_.SetLinearVelocity(
            this.rearBody.GetLinearVelocityFromLocalPoint(
                _loc11_.GetLocalCenter(),
            ),
        );
        _loc11_.SetUserData(this.rear4MC);
        this.rear4MC.visible = true;
        this.paintVector.push(_loc11_);
        _loc9_.vertexCount = this.brokenRearShape.m_vertexCount;
        _loc9_.vertices = this.brokenRearShape.GetVertices();
        _loc12_.CreateShape(_loc9_);
        _loc9_.vertexCount = this.topShape.m_vertexCount;
        _loc9_.vertices = this.topShape.GetVertices();
        _loc12_.CreateShape(_loc9_);
        _loc12_.SetMassFromShapes();
        _loc12_.SetLinearVelocity(
            this.rearBody.GetLinearVelocityFromLocalPoint(
                _loc12_.GetLocalCenter(),
            ),
        );
        _loc12_.SetUserData(this.rear2MC);
        this.rear2MC.visible = true;
        this.paintVector.push(_loc12_);
        _loc9_.vertexCount = this.seatShape1.m_vertexCount;
        _loc9_.vertices = this.seatShape1.GetVertices();
        _loc13_.CreateShape(_loc9_);
        _loc9_.vertexCount = this.seatShape2.m_vertexCount;
        _loc9_.vertices = this.seatShape2.GetVertices();
        _loc13_.CreateShape(_loc9_);
        _loc13_.SetMassFromShapes();
        _loc13_.SetLinearVelocity(
            this.rearBody.GetLinearVelocityFromLocalPoint(
                _loc13_.GetLocalCenter(),
            ),
        );
        _loc13_.SetUserData(this.rear1MC);
        this.rear1MC.visible = true;
        this.paintVector.push(_loc13_);
        this._session.particleController.createBurst(
            "mowershards",
            30,
            30,
            this.rearBody,
            50,
        );
        _loc3_.DestroyBody(this.rearBody);
        this.rearMC.visible = false;
        _loc3_.DestroyJoint(this.backWheelJoint);
        SoundController.instance.playAreaSoundInstance(
            "MetalSmashHeavy",
            this.rearBody,
        );
    }

    public override headSmash1(param1: number) {
        super.headSmash1(param1);
        this.eject();
    }

    public override chestSmash(param1: number) {
        super.chestSmash(param1);
        this.eject();
    }

    public override pelvisSmash(param1: number) {
        super.pelvisSmash(param1);
        this.eject();
    }

    public override torsoBreak(
        param1: number,
        param2: boolean = true,
        param3: boolean = true,
    ) {
        super.torsoBreak(param1, param2, param3);
        this.eject();
    }

    public override neckBreak(
        param1: number,
        param2: boolean = true,
        param3: boolean = true,
    ) {
        super.neckBreak(param1, param2, param3);
        this.eject();
    }

    public override shoulderBreak1(param1: number, param2: boolean = true) {
        super.shoulderBreak1(param1, param2);
        if (this.ejected) {
            return;
        }
        if (this.mowerHand1) {
            this._session.m_world.DestroyJoint(this.mowerHand1);
            this.mowerHand1 = null;
        }
        this.checkEject();
    }

    public override shoulderBreak2(param1: number, param2: boolean = true) {
        super.shoulderBreak2(param1, param2);
        if (this.ejected) {
            return;
        }
        if (this.mowerHand2) {
            this._session.m_world.DestroyJoint(this.mowerHand2);
            this.mowerHand2 = null;
        }
        this.checkEject();
    }

    public override elbowBreak1(param1: number) {
        super.elbowBreak1(param1);
        if (this.ejected) {
            return;
        }
        if (this.mowerHand1) {
            this._session.m_world.DestroyJoint(this.mowerHand1);
            this.mowerHand1 = null;
        }
        this.checkEject();
    }

    public override elbowBreak2(param1: number) {
        super.elbowBreak2(param1);
        if (this.ejected) {
            return;
        }
        if (this.mowerHand2) {
            this._session.m_world.DestroyJoint(this.mowerHand2);
            this.mowerHand2 = null;
        }
        this.checkEject();
    }

    public override hipBreak1(param1: number, param2: boolean = true) {
        super.hipBreak1(param1, param2);
        if (this.ejected) {
            return;
        }
        if (this.mowerFoot1) {
            this._session.m_world.DestroyJoint(this.mowerFoot1);
            this.mowerFoot1 = null;
        }
        this.checkEject();
    }

    public override hipBreak2(param1: number, param2: boolean = true) {
        super.hipBreak2(param1, param2);
        if (this.ejected) {
            return;
        }
        if (this.mowerFoot2) {
            this._session.m_world.DestroyJoint(this.mowerFoot2);
            this.mowerFoot2 = null;
        }
        this.checkEject();
    }

    public override kneeBreak1(param1: number) {
        super.kneeBreak1(param1);
        if (this.ejected) {
            return;
        }
        if (this.mowerFoot1) {
            this._session.m_world.DestroyJoint(this.mowerFoot1);
            this.mowerFoot1 = null;
        }
        this.checkEject();
    }

    public override kneeBreak2(param1: number) {
        super.kneeBreak2(param1);
        if (this.ejected) {
            return;
        }
        if (this.mowerFoot2) {
            this._session.m_world.DestroyJoint(this.mowerFoot2);
            this.mowerFoot2 = null;
        }
        this.checkEject();
    }

    public leanBackPose() {
        this.setJoint(this.neckJoint, 0, 2);
        this.setJoint(this.elbowJoint1, 2.5, 15);
        this.setJoint(this.elbowJoint2, 2.5, 15);
    }

    public leanForwardPose() {
        this.setJoint(this.neckJoint, 1, 1);
        this.setJoint(this.elbowJoint1, 0, 15);
        this.setJoint(this.elbowJoint2, 0, 15);
    }

    public lungePoseLeft() {
        this.setJoint(this.neckJoint, 0.5, 2);
        this.setJoint(this.hipJoint1, 3.5, 2);
        this.setJoint(this.hipJoint2, 0, 2);
        this.setJoint(this.kneeJoint1, 0, 10);
        this.setJoint(this.kneeJoint2, 2, 10);
        this.setJoint(this.shoulderJoint1, 3, 20);
        this.setJoint(this.shoulderJoint2, 1, 20);
        this.setJoint(this.elbowJoint1, 1.5, 15);
        this.setJoint(this.elbowJoint2, 3, 15);
    }

    public lungePoseRight() {
        this.setJoint(this.neckJoint, 0.5, 2);
        this.setJoint(this.hipJoint1, 0, 2);
        this.setJoint(this.hipJoint2, 3.5, 2);
        this.setJoint(this.kneeJoint1, 2, 10);
        this.setJoint(this.kneeJoint2, 0, 10);
        this.setJoint(this.shoulderJoint1, 1, 20);
        this.setJoint(this.shoulderJoint2, 3, 20);
        this.setJoint(this.elbowJoint1, 3, 15);
        this.setJoint(this.elbowJoint2, 1.5, 15);
    }
}