import b2CircleDef from "@/Box2D/Collision/Shapes/b2CircleDef";
import b2FilterData from "@/Box2D/Collision/Shapes/b2FilterData";
import b2PolygonDef from "@/Box2D/Collision/Shapes/b2PolygonDef";
import b2PolygonShape from "@/Box2D/Collision/Shapes/b2PolygonShape";
import b2Shape from "@/Box2D/Collision/Shapes/b2Shape";
import b2ContactPoint from "@/Box2D/Collision/b2ContactPoint";
import b2Math from "@/Box2D/Common/Math/b2Math";
import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import b2PrismaticJoint from "@/Box2D/Dynamics/Joints/b2PrismaticJoint";
import b2PrismaticJointDef from "@/Box2D/Dynamics/Joints/b2PrismaticJointDef";
import b2RevoluteJoint from "@/Box2D/Dynamics/Joints/b2RevoluteJoint";
import b2RevoluteJointDef from "@/Box2D/Dynamics/Joints/b2RevoluteJointDef";
import b2Body from "@/Box2D/Dynamics/b2Body";
import b2BodyDef from "@/Box2D/Dynamics/b2BodyDef";
import b2World from "@/Box2D/Dynamics/b2World";
import ContactListener from "@/com/totaljerkface/game/ContactListener";
import Session from "@/com/totaljerkface/game/Session";
import CharacterB2D from "@/com/totaljerkface/game/character/CharacterB2D";
import ContactEvent from "@/com/totaljerkface/game/events/ContactEvent";
import Vehicle from "@/com/totaljerkface/game/level/groups/Vehicle";
import SoundController from "@/com/totaljerkface/game/sound/SoundController";
import { boundClass } from 'autobind-decorator';
import DisplayObject from "flash/display/DisplayObject";
import MovieClip from "flash/display/MovieClip";

@boundClass
export default class PogoStickMan extends CharacterB2D {
    protected ejected: boolean;
    protected helmetOn: boolean;
    protected impulseMagnitude: number = 0.5;
    protected impulseOffset: number = 1;
    protected maxSpinAV: number = 5;
    protected reAttachDistance: number = 0.25;
    protected bounceSpeed: number = 6;
    protected bounceTranslation: number = -30;
    protected jumpTranslation: number = -40;
    protected verticalVelocityThreshold: number = 0.25;
    protected retractSpeed: number = -0.5;
    protected nubContacts: number = 0;
    protected charging: boolean;
    protected jumpFrames: number = 0;
    protected jumpFramesMax: number = 5;
    protected airLean: boolean;
    protected uprightAngle: number = -Math.PI * 0.5;
    protected forwardAngle: number = -Math.PI * 0.45;
    protected reverseAngle: number = -Math.PI * 0.6;
    protected targetAngle: number = this.uprightAngle;
    protected helmetSmashLimit: number = 2;
    protected frameSmashLimit: number = 40;
    protected frameSmashed: boolean;
    protected handleAnchorPoint: b2Vec2;
    protected footAnchorPoint: b2Vec2;
    protected frameHand1JointDef: b2RevoluteJointDef;
    protected frameHand2JointDef: b2RevoluteJointDef;
    protected frameFoot1JointDef: b2RevoluteJointDef;
    protected frameFoot2JointDef: b2RevoluteJointDef;
    public frameBody: b2Body;
    public rodBody: b2Body;
    public helmetBody: b2Body;
    public helmetShape: b2Shape;
    public frameShape: b2Shape;
    public rodShape: b2Shape;
    public nubShape: b2Shape;
    public stopperShape: b2Shape;
    public frameMC: MovieClip;
    public rodMC: MovieClip;
    public helmetMC: MovieClip;
    public brokenFrame1MC: MovieClip;
    public brokenFrame2MC: MovieClip;
    public springMC: MovieClip;
    public pogoJoint: b2PrismaticJoint;
    public frameHand1: b2RevoluteJoint;
    public frameHand2: b2RevoluteJoint;
    public frameFoot1: b2RevoluteJoint;
    public frameFoot2: b2RevoluteJoint;
    private COMArray: any[];
    private currCOM: b2Vec2;
    private prevCOM: b2Vec2;
    private velocityCOM: b2Vec2;
    private velocityAngle: number;
    private pivotDirection: b2Vec2;
    private pivotAngle: number;
    public tempElbowBreakLimit: number;
    public tempElbowLigamentLimit: number;
    public tempKneeBreakLimit: number;
    public tempKneeLigamentLimit: number;

    constructor(
        param1: number,
        param2: number,
        param3: DisplayObject,
        param4: Session,
    ) {
        super(param1, param2, param3, param4, -1, "Char12");
        this.shapeRefScale = 50;
        this.currentPose = 9;
        this.COMArray = new Array();
    }

    public override leftPressedActions() {
        var _loc1_: number = NaN;
        var _loc2_: number = NaN;
        var _loc3_: number = NaN;
        var _loc4_: number = NaN;
        var _loc5_: number = NaN;
        var _loc6_: b2Vec2 = null;
        var _loc7_: b2Vec2 = null;
        var _loc8_: b2Vec2 = null;
        var _loc9_: number = NaN;
        if (this.ejected) {
            this.currentPose = 1;
        } else {
            if (this.nubContacts == 0) {
                this.airLean = true;
            }
            _loc1_ = this.frameBody.GetAngle();
            _loc2_ = this.frameBody.GetAngularVelocity();
            _loc3_ = (_loc2_ + this.maxSpinAV) / this.maxSpinAV;
            if (_loc3_ < 0) {
                _loc3_ = 0;
            }
            if (_loc3_ > 1) {
                _loc3_ = 1;
            }
            _loc4_ = Math.cos(_loc1_) * this.impulseMagnitude * _loc3_;
            _loc5_ = Math.sin(_loc1_) * this.impulseMagnitude * _loc3_;
            _loc6_ = this.frameBody.GetLocalCenter();
            _loc7_ = this.frameBody.GetWorldPoint(
                new b2Vec2(_loc6_.x, _loc6_.y - this.impulseOffset),
            );
            _loc8_ = this.frameBody.GetWorldPoint(
                new b2Vec2(_loc6_.x, _loc6_.y + this.impulseOffset),
            );
            this.frameBody.ApplyImpulse(new b2Vec2(-_loc4_, -_loc5_), _loc7_);
            this.frameBody.ApplyImpulse(new b2Vec2(_loc4_, _loc5_), _loc8_);
            _loc9_ = 100;
        }
    }

    public override rightPressedActions() {
        var _loc1_: number = NaN;
        var _loc2_: number = NaN;
        var _loc3_: number = NaN;
        var _loc4_: number = NaN;
        var _loc5_: number = NaN;
        var _loc6_: b2Vec2 = null;
        var _loc7_: b2Vec2 = null;
        var _loc8_: b2Vec2 = null;
        var _loc9_: number = NaN;
        if (this.ejected) {
            this.currentPose = 2;
        } else {
            if (this.nubContacts == 0) {
                this.airLean = true;
            }
            _loc1_ = this.frameBody.GetAngle();
            _loc2_ = this.frameBody.GetAngularVelocity();
            _loc3_ = (_loc2_ - this.maxSpinAV) / -this.maxSpinAV;
            if (_loc3_ < 0) {
                _loc3_ = 0;
            }
            if (_loc3_ > 1) {
                _loc3_ = 1;
            }
            _loc4_ = Math.cos(_loc1_) * this.impulseMagnitude * _loc3_;
            _loc5_ = Math.sin(_loc1_) * this.impulseMagnitude * _loc3_;
            _loc6_ = this.frameBody.GetLocalCenter();
            _loc7_ = this.frameBody.GetWorldPoint(
                new b2Vec2(_loc6_.x, _loc6_.y - this.impulseOffset),
            );
            _loc8_ = this.frameBody.GetWorldPoint(
                new b2Vec2(_loc6_.x, _loc6_.y + this.impulseOffset),
            );
            this.frameBody.ApplyImpulse(new b2Vec2(_loc4_, _loc5_), _loc7_);
            this.frameBody.ApplyImpulse(new b2Vec2(-_loc4_, -_loc5_), _loc8_);
            _loc9_ = 100;
        }
    }

    public override leftAndRightActions() {
        var _loc1_: number = NaN;
        var _loc2_: number = NaN;
        var _loc3_: number = NaN;
        var _loc4_: number = NaN;
        var _loc5_: number = NaN;
        var _loc6_: number = NaN;
        var _loc7_: number = NaN;
        if (this.ejected) {
            if (this._currentPose == 1 || this._currentPose == 2) {
                this.currentPose = 0;
            }
        } else {
            this.updateCOMValues();
            if (this.airLean) {
                return;
            }
            if (this.velocityCOM.y > 0) {
                _loc6_ = this.velocityCOM.y / this.verticalVelocityThreshold;
                _loc6_ = Math.min(1, _loc6_);
                _loc7_ =
                    this.targetAngle * (1 - _loc6_) +
                    (this.velocityAngle - Math.PI) * _loc6_;
            } else {
                _loc6_ = -this.velocityCOM.y / this.verticalVelocityThreshold;
                _loc6_ = Math.min(1, _loc6_);
                _loc7_ =
                    this.targetAngle * (1 - _loc6_) +
                    this.velocityAngle * _loc6_;
            }
            _loc1_ = this.frameBody.GetAngularVelocity();
            _loc2_ = _loc1_ / 30;
            _loc3_ = _loc7_ - this.pivotAngle;
            if (_loc3_ > Math.PI) {
                _loc3_ -= Math.PI * 2;
            }
            if (_loc3_ < -Math.PI) {
                _loc3_ += Math.PI * 2;
            }
            _loc4_ = _loc3_ * 30 - _loc1_;
            _loc5_ = _loc3_ * 30;
            if (_loc5_ < -this.maxSpinAV * 2) {
                _loc5_ = -this.maxSpinAV * 2;
            }
            if (_loc5_ > this.maxSpinAV * 2) {
                _loc5_ = this.maxSpinAV * 2;
            }
            this.frameBody.SetAngularVelocity(_loc5_);
        }
    }

    public override upPressedActions() {
        var _loc1_: number = NaN;
        var _loc2_: number = NaN;
        var _loc3_: number = NaN;
        if (this.ejected) {
            this.currentPose = 3;
        } else {
            this.targetAngle = this.forwardAngle;
            this.airLean = false;
            if (!this.charging) {
                _loc1_ = this.pogoJoint.GetJointTranslation();
                _loc2_ = this.pogoJoint.GetMotorSpeed();
                if (this.nubContacts > 0 && this.jumpFrames == 0) {
                    if (this.pogoJoint.m_lowerTranslation == 0) {
                        this.pogoJoint.m_lowerTranslation =
                            this.bounceTranslation / this.character_scale;
                        this.pogoJoint.SetMotorSpeed(this.retractSpeed);
                    } else if (_loc2_ == this.retractSpeed) {
                        if (
                            _loc1_ <=
                            this.bounceTranslation / this.character_scale &&
                            this.pivotAngle > this.targetAngle &&
                            this.pivotAngle < this.targetAngle + Math.PI * 0.15
                        ) {
                            this.pogoJoint.SetMotorSpeed(this.bounceSpeed);
                            this.jumpFrames = this.jumpFramesMax;
                            _loc3_ = Math.min(
                                1,
                                Math.max((-_loc1_ * this.m_physScale) / 40, 0),
                            );
                            SoundController.instance.playAreaSoundInstance(
                                "PogoRelease",
                                this.frameBody,
                                _loc3_,
                            );
                        }
                    }
                }
                if (_loc2_ > 0 && _loc1_ >= 0) {
                    this.pogoJoint.m_lowerTranslation = 0;
                    this.pogoJoint.SetMotorSpeed(0);
                }
            }
        }
    }

    public override downPressedActions() {
        var _loc1_: number = NaN;
        var _loc2_: number = NaN;
        var _loc3_: number = NaN;
        if (this.ejected) {
            this.currentPose = 4;
        } else {
            this.targetAngle = this.reverseAngle;
            this.airLean = false;
            if (!this.charging) {
                _loc1_ = this.pogoJoint.GetJointTranslation();
                _loc2_ = this.pogoJoint.GetMotorSpeed();
                if (this.nubContacts > 0 && this.jumpFrames == 0) {
                    if (this.pogoJoint.m_lowerTranslation == 0) {
                        this.pogoJoint.m_lowerTranslation =
                            this.bounceTranslation / this.character_scale;
                        this.pogoJoint.SetMotorSpeed(this.retractSpeed);
                    } else if (_loc2_ == this.retractSpeed) {
                        if (
                            _loc1_ <=
                            this.bounceTranslation / this.character_scale &&
                            this.pivotAngle < this.targetAngle &&
                            this.pivotAngle > this.targetAngle - Math.PI * 0.15
                        ) {
                            this.pogoJoint.SetMotorSpeed(this.bounceSpeed);
                            this.jumpFrames = this.jumpFramesMax;
                            _loc3_ = Math.min(
                                1,
                                Math.max((-_loc1_ * this.m_physScale) / 40, 0),
                            );
                            SoundController.instance.playAreaSoundInstance(
                                "PogoRelease2",
                                this.frameBody,
                                _loc3_,
                            );
                        }
                    }
                }
                if (_loc2_ > 0 && _loc1_ >= 0) {
                    this.pogoJoint.m_lowerTranslation = 0;
                    this.pogoJoint.SetMotorSpeed(0);
                }
            }
        }
    }

    public override upAndDownActions() {
        var _loc1_: number = NaN;
        if (this.ejected) {
            if (this._currentPose == 3 || this._currentPose == 4) {
                this.currentPose = 0;
            }
        } else {
            this.targetAngle = this.uprightAngle;
            if (!this.charging) {
                _loc1_ = this.pogoJoint.GetJointTranslation();
                if (this.pogoJoint.m_lowerTranslation != 0) {
                    if (_loc1_ < 0) {
                        this.pogoJoint.SetMotorSpeed(0.5);
                    } else {
                        this.pogoJoint.SetMotorSpeed(0);
                        this.pogoJoint.m_lowerTranslation = 0;
                    }
                }
            }
        }
    }

    public override spacePressedActions() {
        var _loc1_: number = NaN;
        if (this.ejected) {
            this.startGrab();
        } else {
            this.charging = true;
            if (
                this.pogoJoint.m_lowerTranslation !=
                this.jumpTranslation / this.character_scale
            ) {
                this.pogoJoint.m_lowerTranslation =
                    this.jumpTranslation / this.character_scale;
            }
            _loc1_ = this.pogoJoint.GetJointTranslation();
            if (_loc1_ > this.pogoJoint.m_lowerTranslation) {
                this.pogoJoint.SetMotorSpeed(this.retractSpeed);
            } else {
                this.pogoJoint.SetMotorSpeed(0);
            }
        }
    }

    public override spaceNullActions() {
        var _loc1_: number = NaN;
        var _loc2_: number = NaN;
        var _loc3_: number = NaN;
        var _loc4_: number = NaN;
        if (this.ejected) {
            this.releaseGrip();
        } else if (this.charging) {
            _loc1_ = this.pogoJoint.GetJointTranslation();
            _loc2_ = _loc1_ * -70;
            if (_loc1_ < 0) {
                _loc3_ = this.pogoJoint.GetMotorSpeed();
                if (_loc2_ > _loc3_) {
                    _loc4_ = Math.min(
                        1,
                        Math.max((-_loc1_ * this.m_physScale) / 20, 0),
                    );
                    SoundController.instance.playAreaSoundInstance(
                        "PogoRelease",
                        this.frameBody,
                        _loc4_,
                    );
                }
                this.pogoJoint.SetMotorSpeed(_loc2_);
            } else {
                this.pogoJoint.SetMotorSpeed(0);
                this.pogoJoint.m_lowerTranslation = 0;
                this.charging = false;
                this.jumpFrames = this.jumpFramesMax;
            }
        }
    }

    public override shiftPressedActions() {
        if (this.ejected) {
            this.currentPose = 7;
        } else {
            this.currentPose = 5;
        }
    }

    public override shiftNullActions() {
        if (this.ejected) {
            if (this._currentPose == 7) {
                this.currentPose = 0;
            }
        } else if (this._currentPose == 5) {
            this.currentPose = 9;
        }
    }

    public override ctrlPressedActions() {
        if (this.ejected) {
            this.currentPose = 8;
        } else {
            this.currentPose = 6;
        }
    }

    public override ctrlNullActions() {
        if (this.ejected) {
            if (this._currentPose == 8) {
                this.currentPose = 0;
            }
        } else if (this._currentPose == 6) {
            this.currentPose = 9;
        }
    }

    public override zPressedActions() {
        this.eject();
    }

    public override actions() {
        super.actions();
        if (this.jumpFrames > 0) {
            --this.jumpFrames;
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
                this.straightLegPose();
                break;
            case 6:
                this.squatPose();
                break;
            case 7:
                this.fistPoseLeft();
                break;
            case 8:
                this.fistPoseRight();
                break;
            case 9:
                this.pogoPose();
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

    public override setLimits() {
        super.setLimits();
        this.tempElbowBreakLimit = this.elbowBreakLimit;
        this.tempElbowLigamentLimit = this.elbowLigamentLimit;
        this.tempKneeBreakLimit = this.kneeBreakLimit;
        this.tempKneeLigamentLimit = this.kneeLigamentLimit;
        this.elbowBreakLimit = 90;
        this.elbowLigamentLimit = 110;
        this.kneeBreakLimit = 120;
        this.kneeLigamentLimit = 140;
    }

    public override reset() {
        super.reset();
        this.helmetOn = true;
        this.frameSmashed = false;
        this.ejected = false;
        this.nubContacts = 0;
        this.charging = false;
        this.jumpFrames = 0;
        this.airLean = false;
        this.targetAngle = this.uprightAngle;
        this.elbowBreakLimit = 90;
        this.elbowLigamentLimit = 110;
        this.kneeBreakLimit = 120;
        this.kneeLigamentLimit = 140;
        this.currentPose = 9;
    }

    public override die() {
        super.die();
        this.helmetBody = null;
    }

    public override paint() {
        var _loc1_: DisplayObject = null;
        var _loc2_: number = NaN;
        var _loc3_: number = NaN;
        super.paint();
        if (!this.frameSmashed) {
            _loc1_ = this.frameMC.getChildByName("spring");
            _loc2_ = this.pogoJoint.GetJointTranslation() * this.m_physScale;
            _loc3_ = _loc2_ / -20;
            _loc3_ = Math.max(Math.min(1, _loc3_), 0);
            _loc1_.scaleY = (1 - _loc3_) * 0.55 + 0.45;
        }
    }

    public override createBodies() {
        super.createBodies();
        var _loc1_ = new b2BodyDef();
        var _loc2_ = new b2PolygonDef();
        var _loc3_ = new b2CircleDef();
        _loc2_.density = 5;
        _loc2_.friction = 1;
        _loc2_.restitution = 0.1;
        _loc2_.filter = this.defaultFilter;
        _loc3_.density = 5;
        _loc3_.friction = 1;
        _loc3_.restitution = 0.3;
        _loc3_.filter.categoryBits = 260;
        _loc3_.filter.maskBits = 270;
        var _loc4_: MovieClip = this.shapeGuide["frameShape"];
        var _loc5_ = new b2Vec2(
            this._startX + _loc4_.x / this.character_scale,
            this._startY + _loc4_.y / this.character_scale,
        );
        var _loc6_: number = _loc4_.rotation / CharacterB2D.oneEightyOverPI;
        _loc1_.position.Set(_loc5_.x, _loc5_.y);
        _loc1_.angle = _loc6_;
        this.frameBody = this._session.m_world.CreateBody(_loc1_);
        _loc2_.SetAsBox(
            (_loc4_.scaleX * this.shapeRefScale) / this.character_scale,
            (_loc4_.scaleY * this.shapeRefScale) / this.character_scale,
        );
        this.frameShape = this.frameBody.CreateShape(_loc2_);
        this.frameBody.SetMassFromShapes();
        this.paintVector.push(this.frameBody);
        this._session.contactListener.registerListener(
            ContactListener.RESULT,
            this.frameShape,
            this.contactResultHandler,
        );
        this._session.contactListener.registerListener(
            ContactListener.ADD,
            this.frameShape,
            this.contactAddHandler,
        );
        _loc3_.radius = 10 / this.character_scale;
        _loc3_.localPosition.Set(
            0,
            -(_loc4_.scaleY * this.shapeRefScale) / this.character_scale,
        );
        _loc4_ = this.shapeGuide["rodShape"];
        _loc5_ = new b2Vec2(
            this._startX + _loc4_.x / this.character_scale,
            this._startY + _loc4_.y / this.character_scale,
        );
        _loc6_ = _loc4_.rotation / CharacterB2D.oneEightyOverPI;
        _loc1_.position.Set(_loc5_.x, _loc5_.y);
        _loc1_.angle = _loc6_;
        _loc2_.SetAsBox(
            (_loc4_.scaleX * this.shapeRefScale) / this.character_scale,
            (_loc4_.scaleY * this.shapeRefScale) / this.character_scale,
        );
        this.rodBody = this._session.m_world.CreateBody(_loc1_);
        this.rodShape = this.rodBody.CreateShape(_loc2_);
        this.rodBody.SetMassFromShapes();
        this.paintVector.push(this.rodBody);
        _loc3_.radius = 7 / this.character_scale;
        _loc3_.filter = this.defaultFilter;
        _loc3_.localPosition.Set(
            0,
            (_loc4_.scaleY * this.shapeRefScale) / this.character_scale,
        );
        this.nubShape = this.rodBody.CreateShape(_loc3_);
        this._session.contactListener.registerListener(
            ContactListener.ADD,
            this.nubShape,
            this.nubContactAdd,
        );
        this._session.contactListener.registerListener(
            ContactListener.REMOVE,
            this.nubShape,
            this.nubContactRemove,
        );
        this.COMArray = [
            this.frameBody,
            this.rodBody,
            this.head1Body,
            this.chestBody,
            this.pelvisBody,
            this.upperArm1Body,
            this.lowerArm1Body,
            this.upperArm2Body,
            this.lowerArm2Body,
            this.upperLeg1Body,
            this.lowerLeg1Body,
            this.upperLeg2Body,
            this.lowerLeg2Body,
        ];
        this.prevCOM = this.getCenterOfMass();
    }

    public override createJoints() {
        var _loc1_: number = NaN;
        var _loc2_: number = NaN;
        var _loc3_: number = NaN;
        super.createJoints();
        _loc1_ = this.upperLeg1Body.GetAngle() - this.pelvisBody.GetAngle();
        _loc2_ = -100 / CharacterB2D.oneEightyOverPI - _loc1_;
        _loc3_ = 0 / CharacterB2D.oneEightyOverPI - _loc1_;
        this.hipJoint1.SetLimits(_loc2_, _loc3_);
        _loc1_ = this.upperLeg2Body.GetAngle() - this.pelvisBody.GetAngle();
        _loc2_ = -100 / CharacterB2D.oneEightyOverPI - _loc1_;
        _loc3_ = 0 / CharacterB2D.oneEightyOverPI - _loc1_;
        this.hipJoint2.SetLimits(_loc2_, _loc3_);
        _loc1_ = this.upperArm1Body.GetAngle() - this.chestBody.GetAngle();
        _loc2_ = -120 / CharacterB2D.oneEightyOverPI - _loc1_;
        _loc3_ = 0 / CharacterB2D.oneEightyOverPI - _loc1_;
        this.shoulderJoint1.SetLimits(_loc2_, _loc3_);
        _loc1_ = this.upperArm2Body.GetAngle() - this.chestBody.GetAngle();
        _loc2_ = -120 / CharacterB2D.oneEightyOverPI - _loc1_;
        _loc3_ = 0 / CharacterB2D.oneEightyOverPI - _loc1_;
        this.shoulderJoint2.SetLimits(_loc2_, _loc3_);
        _loc1_ = this.lowerArm1Body.GetAngle() - this.upperArm1Body.GetAngle();
        _loc2_ = -60 / CharacterB2D.oneEightyOverPI - _loc1_;
        _loc3_ = 0 / CharacterB2D.oneEightyOverPI - _loc1_;
        this.elbowJoint1.SetLimits(_loc2_, _loc3_);
        _loc1_ = this.lowerArm2Body.GetAngle() - this.upperArm2Body.GetAngle();
        _loc2_ = -60 / CharacterB2D.oneEightyOverPI - _loc1_;
        _loc3_ = 0 / CharacterB2D.oneEightyOverPI - _loc1_;
        this.elbowJoint2.SetLimits(_loc2_, _loc3_);
        _loc1_ = this.head1Body.GetAngle() - this.chestBody.GetAngle();
        _loc2_ = 0 / CharacterB2D.oneEightyOverPI - _loc1_;
        _loc3_ = 5 / CharacterB2D.oneEightyOverPI - _loc1_;
        this.neckJoint.SetLimits(_loc2_, _loc3_);
        var _loc4_ = new b2PrismaticJointDef();
        _loc4_.maxMotorForce = 10000;
        _loc4_.enableLimit = true;
        _loc4_.lowerTranslation = 0;
        _loc4_.upperTranslation = 0 / this.character_scale;
        _loc4_.enableMotor = true;
        _loc4_.motorSpeed = 0;
        var _loc5_ = new b2Vec2();
        var _loc6_: MovieClip = this.shapeGuide["frameShape"];
        var _loc7_: number = this.frameBody.GetAngle();
        _loc5_.Set(
            this._startX + _loc6_.x / this.character_scale,
            this._startY + _loc6_.y / this.character_scale,
        );
        _loc4_.Initialize(
            this.frameBody,
            this.rodBody,
            _loc5_,
            new b2Vec2(-Math.sin(_loc7_), Math.cos(_loc7_)),
        );
        this.pogoJoint = this._session.m_world.CreateJoint(
            _loc4_,
        ) as b2PrismaticJoint;
        var _loc8_ = new b2RevoluteJointDef();
        _loc8_.enableLimit = true;
        _loc8_.lowerAngle = -100 / CharacterB2D.oneEightyOverPI;
        _loc8_.upperAngle = 10 / CharacterB2D.oneEightyOverPI;
        _loc6_ = this.shapeGuide["handleAnchor"];
        _loc5_.Set(
            this._startX + _loc6_.x / this.character_scale,
            this._startY + _loc6_.y / this.character_scale,
        );
        _loc8_.Initialize(this.frameBody, this.lowerArm1Body, _loc5_);
        this.frameHand1 = this._session.m_world.CreateJoint(
            _loc8_,
        ) as b2RevoluteJoint;
        this.frameHand1JointDef = _loc8_.clone();
        this.handleAnchorPoint = this.frameBody.GetLocalPoint(_loc5_);
        _loc8_.Initialize(this.frameBody, this.lowerArm2Body, _loc5_);
        this.frameHand2 = this._session.m_world.CreateJoint(
            _loc8_,
        ) as b2RevoluteJoint;
        this.frameHand2JointDef = _loc8_.clone();
        _loc8_.lowerAngle = -10 / CharacterB2D.oneEightyOverPI;
        _loc8_.upperAngle = 10 / CharacterB2D.oneEightyOverPI;
        _loc6_ = this.shapeGuide["footAnchor"];
        _loc5_.Set(
            this._startX + _loc6_.x / this.character_scale,
            this._startY + _loc6_.y / this.character_scale,
        );
        _loc8_.Initialize(this.frameBody, this.lowerLeg1Body, _loc5_);
        this.frameFoot1 = this._session.m_world.CreateJoint(
            _loc8_,
        ) as b2RevoluteJoint;
        this.frameFoot1JointDef = _loc8_.clone();
        this.footAnchorPoint = this.frameBody.GetLocalPoint(_loc5_);
        _loc8_.Initialize(this.frameBody, this.lowerLeg2Body, _loc5_);
        this.frameFoot2 = this._session.m_world.CreateJoint(
            _loc8_,
        ) as b2RevoluteJoint;
        this.frameFoot2JointDef = _loc8_.clone();
    }

    public override createMovieClips() {
        super.createMovieClips();
        this.frameMC = this.sourceObject["frame"];
        var _loc2_ = 1 / this.mc_scale;
        this.frameMC.scaleY = 1 / this.mc_scale;
        this.frameMC.scaleX = _loc2_;
        this.brokenFrame1MC = this.sourceObject["brokenframe1"];
        _loc2_ = 1 / this.mc_scale;
        this.brokenFrame1MC.scaleY = 1 / this.mc_scale;
        this.brokenFrame1MC.scaleX = _loc2_;
        this.brokenFrame2MC = this.sourceObject["brokenframe2"];
        _loc2_ = 1 / this.mc_scale;
        this.brokenFrame2MC.scaleY = 1 / this.mc_scale;
        this.brokenFrame2MC.scaleX = _loc2_;
        this.rodMC = this.sourceObject["rod"];
        _loc2_ = 1 / this.mc_scale;
        this.rodMC.scaleY = 1 / this.mc_scale;
        this.rodMC.scaleX = _loc2_;
        this.springMC = this.sourceObject["spring"];
        _loc2_ = 1 / this.mc_scale;
        this.springMC.scaleY = 1 / this.mc_scale;
        this.springMC.scaleX = _loc2_;
        this.helmetMC = this.sourceObject["helmet"];
        _loc2_ = 1 / this.mc_scale;
        this.helmetMC.scaleY = 1 / this.mc_scale;
        this.helmetMC.scaleX = _loc2_;
        this.helmetMC.visible = false;
        this.frameBody.SetUserData(this.frameMC);
        this.rodBody.SetUserData(this.rodMC);
        var _loc1_: number = this._session.containerSprite.getChildIndex(
            this.upperLeg1MC,
        );
        this._session.containerSprite.addChildAt(this.frameMC, _loc1_);
        this._session.containerSprite.addChildAt(this.brokenFrame1MC, _loc1_);
        this._session.containerSprite.addChildAt(this.brokenFrame2MC, _loc1_);
        this._session.containerSprite.addChildAt(this.springMC, _loc1_);
        this._session.containerSprite.addChildAt(this.rodMC, _loc1_);
        this._session.containerSprite.addChildAt(
            this.helmetMC,
            this._session.containerSprite.getChildIndex(this.chestMC),
        );
        this.rodMC.gotoAndStop(1);
        this.brokenFrame1MC.visible = false;
        this.brokenFrame2MC.visible = false;
        this.springMC.visible = false;
    }

    public override resetMovieClips() {
        super.resetMovieClips();
        this.frameBody.SetUserData(this.frameMC);
        this.rodBody.SetUserData(this.rodMC);
        this.frameMC.visible = true;
        this.brokenFrame1MC.visible = false;
        this.brokenFrame2MC.visible = false;
        this.springMC.visible = false;
        this.rodMC.gotoAndStop(1);
        this.helmetMC.visible = false;
        // @ts-expect-error
        this.head1MC.helmet.visible = true;
    }

    public override createDictionaries() {
        super.createDictionaries();
        this.helmetShape = this.head1Shape;
        this.contactImpulseDict.set(this.helmetShape, this.helmetSmashLimit);
        this.contactImpulseDict.set(this.frameShape, this.frameSmashLimit);
        this.contactAddSounds.set(this.frameShape, "Thud1");
    }

    protected override handleContactResults() {
        var _loc1_: ContactEvent = null;
        if (this.contactResultBuffer.get(this.helmetShape)) {
            _loc1_ = this.contactResultBuffer.get(this.helmetShape);
            this.helmetSmash(_loc1_.impulse);
            this.contactResultBuffer.delete(this.head1Shape);
            this.contactAddBuffer.delete(this.head1Shape);
        }
        super.handleContactResults();
        if (this.contactResultBuffer.get(this.frameShape)) {
            _loc1_ = this.contactResultBuffer.get(this.frameShape);
            this.frameSmash(_loc1_.impulse);
            this.contactResultBuffer.delete(this.frameShape);
            this.contactAddBuffer.delete(this.frameShape);
        }
    }

    protected nubContactAdd(param1: b2ContactPoint) {
        if (param1.shape2.m_isSensor) {
            return;
        }
        var _loc2_: b2Shape = param1.shape1;
        var _loc3_: b2Body = _loc2_.m_body;
        var _loc4_: b2Shape = param1.shape2;
        var _loc5_: b2Body = _loc4_.m_body;
        var _loc6_: number = _loc5_.m_mass;
        if (_loc6_ != 0 && _loc6_ < _loc3_.m_mass) {
            return;
        }
        this.airLean = false;
        this.nubContacts += 1;
        if (this.contactAddBuffer.get(_loc2_)) {
            return;
        }
        var _loc7_: number = b2Math.b2Dot(param1.velocity, param1.normal);
        _loc7_ = Math.abs(_loc7_);
        if (_loc7_ > 4) {
        }
    }

    protected nubContactRemove(param1: b2ContactPoint) {
        if (param1.shape2.m_isSensor) {
            return;
        }
        var _loc2_: b2Shape = param1.shape1;
        var _loc3_: b2Body = _loc2_.m_body;
        var _loc4_: b2Shape = param1.shape2;
        var _loc5_: b2Body = _loc4_.m_body;
        var _loc6_: number = _loc5_.m_mass;
        if (_loc6_ != 0 && _loc6_ < _loc3_.m_mass) {
            return;
        }
        --this.nubContacts;
    }

    public override eject() {
        if (this.ejected) {
            return;
        }
        this.removeAction(this.reAttaching);
        this.actionsVector.push(this.relaxPogo);
        this.ejected = true;
        this.pogoJoint.SetMotorSpeed(0);
        this.resetJointLimits();
        var _loc1_: b2World = this._session.m_world;
        if (this.frameHand1) {
            _loc1_.DestroyJoint(this.frameHand1);
            this.frameHand1 = null;
        }
        if (this.frameHand2) {
            _loc1_.DestroyJoint(this.frameHand2);
            this.frameHand2 = null;
        }
        if (this.frameFoot1) {
            _loc1_.DestroyJoint(this.frameFoot1);
            this.frameFoot1 = null;
        }
        if (this.frameFoot2) {
            _loc1_.DestroyJoint(this.frameFoot2);
            this.frameFoot2 = null;
        }
        this.frameShape.SetFilterData(this.zeroFilter);
        this.rodShape.SetFilterData(this.zeroFilter);
        this._session.m_world.Refilter(this.frameShape);
        this._session.m_world.Refilter(this.rodShape);
        this.elbowBreakLimit = this.tempElbowBreakLimit;
        this.elbowLigamentLimit = this.tempElbowLigamentLimit;
        this.kneeBreakLimit = this.tempKneeBreakLimit;
        this.kneeLigamentLimit = this.tempKneeLigamentLimit;
        // @ts-expect-error
        this.lowerArm1MC.hand.gotoAndStop(2);
        // @ts-expect-error
        this.lowerArm2MC.hand.gotoAndStop(2);
    }

    public override set dead(param1: boolean) {
        this._dead = param1;
        if (this._dead) {
            this.removeAction(this.reAttaching);
            this.userVehicleEject();
            this.currentPose = 0;
            this.releaseGrip();
            if (this.voiceSound) {
                this.voiceSound.stopSound();
                this.voiceSound = null;
            }
        }
    }

    public frameSmash(param1: number) {
        trace("frame impulse " + param1 + " -> " + this._session.iteration);
        this.contactImpulseDict.delete(this.frameShape);
        this._session.contactListener.deleteListener(
            ContactListener.RESULT,
            this.frameShape,
        );
        this._session.contactListener.deleteListener(
            ContactListener.ADD,
            this.frameShape,
        );
        var _loc2_: b2World = this._session.m_world;
        _loc2_.DestroyJoint(this.pogoJoint);
        this.frameSmashed = true;
        this.eject();
        var _loc3_: number = this.frameBody.GetAngularVelocity();
        var _loc4_ = new b2BodyDef();
        _loc4_.position = this.frameBody.GetPosition();
        _loc4_.angle = this.frameBody.GetAngle();
        var _loc5_ = new b2PolygonDef();
        _loc5_.density = 5;
        _loc5_.friction = 1;
        _loc5_.restitution = 0.1;
        _loc5_.filter = this.zeroFilter;
        var _loc6_: number = 31.25 / this.character_scale;
        var _loc7_: b2Body = _loc2_.CreateBody(_loc4_);
        _loc5_.SetAsOrientedBox(
            10 / this.character_scale,
            _loc6_,
            new b2Vec2(0, -_loc6_),
            0,
        );
        _loc7_.CreateShape(_loc5_);
        _loc7_.SetMassFromShapes();
        _loc7_.SetAngularVelocity(_loc3_);
        _loc7_.SetLinearVelocity(
            this.frameBody.GetLinearVelocityFromLocalPoint(
                new b2Vec2(0, -_loc6_),
            ),
        );
        _loc7_.SetUserData(this.brokenFrame1MC);
        this.paintVector.push(_loc7_);
        _loc7_ = _loc2_.CreateBody(_loc4_);
        _loc5_.SetAsOrientedBox(
            10 / this.character_scale,
            _loc6_,
            new b2Vec2(0, _loc6_),
            0,
        );
        _loc7_.CreateShape(_loc5_);
        _loc7_.SetMassFromShapes();
        _loc7_.SetAngularVelocity(_loc3_);
        _loc7_.SetLinearVelocity(
            this.frameBody.GetLinearVelocityFromLocalPoint(
                new b2Vec2(0, _loc6_),
            ),
        );
        _loc7_.SetUserData(this.brokenFrame2MC);
        this.paintVector.push(_loc7_);
        _loc7_ = _loc2_.CreateBody(_loc4_);
        _loc5_.SetAsOrientedBox(
            4 / this.character_scale,
            _loc6_,
            new b2Vec2(0, 0),
            0,
        );
        _loc5_.density = 0.5;
        _loc7_.CreateShape(_loc5_);
        _loc7_.SetMassFromShapes();
        _loc7_.SetAngularVelocity(_loc3_);
        _loc7_.SetLinearVelocity(this.frameBody.GetLinearVelocity());
        _loc7_.SetUserData(this.springMC);
        this.paintVector.push(_loc7_);
        this.frameMC.visible = false;
        this.brokenFrame1MC.visible = true;
        this.brokenFrame2MC.visible = true;
        this.springMC.visible = true;
        this.rodMC.gotoAndStop(2);
        _loc2_.DestroyBody(this.frameBody);
        SoundController.instance.playAreaSoundInstance(
            "PogoFrameSmash",
            _loc7_,
        );
    }

    public helmetSmash(param1: number) {
        var _loc6_: MovieClip = null;
        trace("helmet impulse " + param1 + " -> " + this._session.iteration);
        this.contactImpulseDict.delete(this.helmetShape);
        this.head1Shape = this.helmetShape;
        this.contactImpulseDict.set(this.head1Shape, this.headSmashLimit);
        this.helmetShape = null;
        this.helmetOn = false;
        var _loc2_ = new b2PolygonDef();
        var _loc3_ = new b2BodyDef();
        _loc2_.density = 1;
        _loc2_.friction = 0.3;
        _loc2_.restitution = 0.1;
        _loc2_.filter = this.zeroFilter;
        var _loc4_: b2Vec2 = this.head1Body.GetPosition();
        _loc3_.position = _loc4_;
        _loc3_.angle = this.head1Body.GetAngle();
        _loc3_.userData = this.helmetMC;
        this.helmetMC.visible = true;
        // @ts-expect-error
        this.head1MC.helmet.visible = false;
        _loc2_.vertexCount = 4;
        var _loc5_: number = 0;
        while (_loc5_ < 4) {
            _loc6_ = this.shapeGuide["helmetVert" + [_loc5_ + 1]];
            _loc2_.vertices[_loc5_] = new b2Vec2(
                _loc6_.x / this.character_scale,
                _loc6_.y / this.character_scale,
            );
            _loc5_++;
        }
        this.helmetBody = this._session.m_world.CreateBody(_loc3_);
        this.helmetBody.CreateShape(_loc2_);
        this.helmetBody.SetMassFromShapes();
        this.helmetBody.SetLinearVelocity(this.head1Body.GetLinearVelocity());
        this.helmetBody.SetAngularVelocity(this.head1Body.GetAngularVelocity());
        this.paintVector.push(this.helmetBody);
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
        this.removeFromCOMArray(this.upperArm1Body);
        this.removeFromCOMArray(this.lowerArm1Body);
        if (this.upperArm3Body) {
            this.COMArray.push(this.upperArm3Body);
        }
        if (this.frameHand1) {
            this._session.m_world.DestroyJoint(this.frameHand1);
            this.frameHand1 = null;
            this.checkEject();
        }
    }

    public override shoulderBreak2(param1: number, param2: boolean = true) {
        super.shoulderBreak2(param1, param2);
        if (this.ejected) {
            return;
        }
        this.removeFromCOMArray(this.upperArm2Body);
        this.removeFromCOMArray(this.lowerArm2Body);
        if (this.upperArm4Body) {
            this.COMArray.push(this.upperArm4Body);
        }
        if (this.frameHand2) {
            this._session.m_world.DestroyJoint(this.frameHand2);
            this.frameHand2 = null;
            this.checkEject();
        }
    }

    public override elbowBreak1(param1: number) {
        super.elbowBreak1(param1);
        if (this.ejected) {
            return;
        }
        this.removeFromCOMArray(this.lowerArm1Body);
        if (this.frameHand1) {
            this._session.m_world.DestroyJoint(this.frameHand1);
            this.frameHand1 = null;
            this.checkEject();
        }
    }

    public override elbowBreak2(param1: number) {
        super.elbowBreak2(param1);
        if (this.ejected) {
            return;
        }
        this.removeFromCOMArray(this.lowerArm2Body);
        if (this.frameHand2) {
            this._session.m_world.DestroyJoint(this.frameHand2);
            this.frameHand2 = null;
            this.checkEject();
        }
    }

    public override hipBreak1(param1: number, param2: boolean = true) {
        super.hipBreak1(param1, param2);
        if (this.ejected) {
            return;
        }
        this.removeFromCOMArray(this.upperLeg1Body);
        this.removeFromCOMArray(this.lowerLeg1Body);
        if (this.upperLeg3Body) {
            this.COMArray.push(this.upperLeg3Body);
        }
        if (this.frameFoot1) {
            this._session.m_world.DestroyJoint(this.frameFoot1);
            this.frameFoot1 = null;
            this.checkLegsBroken();
        }
    }

    public override hipBreak2(param1: number, param2: boolean = true) {
        super.hipBreak2(param1, param2);
        if (this.ejected) {
            return;
        }
        this.removeFromCOMArray(this.upperLeg2Body);
        this.removeFromCOMArray(this.lowerLeg2Body);
        if (this.upperLeg4Body) {
            this.COMArray.push(this.upperLeg4Body);
        }
        if (this.frameFoot2) {
            this._session.m_world.DestroyJoint(this.frameFoot2);
            this.frameFoot2 = null;
            this.checkLegsBroken();
        }
    }

    public override kneeBreak1(param1: number) {
        super.kneeBreak1(param1);
        if (this.ejected) {
            return;
        }
        this.removeFromCOMArray(this.lowerLeg1Body);
        if (this.frameFoot1) {
            this._session.m_world.DestroyJoint(this.frameFoot1);
            this.frameFoot1 = null;
            this.checkLegsBroken();
        }
    }

    public override kneeBreak2(param1: number) {
        super.kneeBreak2(param1);
        if (this.ejected) {
            return;
        }
        this.removeFromCOMArray(this.lowerLeg2Body);
        if (this.frameFoot2) {
            this._session.m_world.DestroyJoint(this.frameFoot2);
            this.frameFoot2 = null;
            this.checkLegsBroken();
        }
    }

    public pogoPose() {
        this.setJoint(this.kneeJoint1, 1.2, 10);
        this.setJoint(this.kneeJoint2, 1.2, 10);
    }

    public squatPose() {
        this.setJoint(this.kneeJoint1, 2.5, 10);
        this.setJoint(this.kneeJoint2, 2.5, 10);
    }

    public straightLegPose() {
        this.setJoint(this.kneeJoint1, 0.25, 10);
        this.setJoint(this.kneeJoint2, 0.25, 10);
    }

    public fistPoseLeft() {
        this.setJoint(this.neckJoint, 0.5, 2);
        this.setJoint(this.hipJoint1, 1.5, 2);
        this.setJoint(this.hipJoint2, 3.5, 2);
        this.setJoint(this.kneeJoint1, 1.7, 10);
        this.setJoint(this.kneeJoint2, 0, 10);
        this.setJoint(this.shoulderJoint1, 3, 20);
        this.setJoint(this.shoulderJoint2, 1, 20);
        this.setJoint(this.elbowJoint1, 1.5, 15);
        this.setJoint(this.elbowJoint2, 3, 15);
    }

    public fistPoseRight() {
        this.setJoint(this.neckJoint, 0.5, 2);
        this.setJoint(this.hipJoint1, 3.5, 2);
        this.setJoint(this.hipJoint2, 1.5, 2);
        this.setJoint(this.kneeJoint1, 0, 10);
        this.setJoint(this.kneeJoint2, 1.7, 10);
        this.setJoint(this.shoulderJoint1, 1, 20);
        this.setJoint(this.shoulderJoint2, 3, 20);
        this.setJoint(this.elbowJoint1, 3, 15);
        this.setJoint(this.elbowJoint2, 1.5, 15);
    }

    public override explodeShape(param1: b2Shape, param2: number) {
        var _loc3_: number = NaN;
        var _loc4_: number = NaN;
        var _loc5_: number = NaN;
        switch (param1) {
            case this.helmetShape:
                if (param2 > 0.85) {
                    this.helmetSmash(0);
                }
                break;
            case this.head1Shape:
                if (param2 > 0.85) {
                    this.headSmash1(0);
                }
                break;
            case this.chestShape:
                _loc3_ = this.chestBody.GetMass() / CharacterB2D.DEF_CHEST_MASS;
                _loc4_ = Math.max(1 - 0.15 * _loc3_, 0.7);
                trace("new chest ratio " + _loc4_);
                if (param2 > _loc4_) {
                    this.chestSmash(0);
                }
                break;
            case this.pelvisShape:
                _loc5_ =
                    this.pelvisBody.GetMass() / CharacterB2D.DEF_PELVIS_MASS;
                _loc4_ = Math.max(1 - 0.15 * _loc5_, 0.7);
                trace("new pelvis ratio " + _loc4_);
                if (param2 > _loc4_) {
                    this.pelvisSmash(0);
                }
        }
    }

    protected getCenterOfMass(): b2Vec2 {
        var _loc5_: b2Body = null;
        var _loc6_: b2Vec2 = null;
        var _loc7_: number = NaN;
        var _loc1_ = new b2Vec2();
        var _loc2_: number = 0;
        var _loc3_ = int(this.COMArray.length);
        var _loc4_: number = 0;
        while (_loc4_ < _loc3_) {
            _loc5_ = this.COMArray[_loc4_];
            _loc6_ = _loc5_.GetWorldCenter();
            _loc7_ = _loc5_.GetMass();
            _loc1_.x += _loc6_.x * _loc7_;
            _loc1_.y += _loc6_.y * _loc7_;
            _loc2_ += _loc7_;
            _loc4_++;
        }
        _loc1_.Multiply(1 / _loc2_);
        return _loc1_;
    }

    protected removeFromCOMArray(param1: b2Body) {
        var _loc2_ = int(this.COMArray.indexOf(param1));
        if (_loc2_ > -1) {
            this.COMArray.splice(_loc2_, 1);
        }
    }

    protected updateCOMValues() {
        this.currCOM = this.getCenterOfMass();
        this.velocityCOM = new b2Vec2(
            this.currCOM.x - this.prevCOM.x,
            this.currCOM.y - this.prevCOM.y,
        );
        this.prevCOM = this.currCOM;
        this.velocityAngle = Math.atan2(this.velocityCOM.y, this.velocityCOM.x);
        var _loc1_: b2Vec2 = this.rodBody.GetWorldPoint(
            new b2Vec2(0, 62.5 / this.character_scale),
        );
        this.pivotDirection = new b2Vec2(
            this.currCOM.x - _loc1_.x,
            this.currCOM.y - _loc1_.y,
        );
        this.pivotAngle = Math.atan2(
            this.pivotDirection.y,
            this.pivotDirection.x,
        );
    }

    public checkEject() {
        if (!this.frameHand1 && !this.frameHand2) {
            this.eject();
        }
    }

    public checkLegsBroken() {
        var _loc1_: b2FilterData = null;
        if (
            (Boolean(this.hipJoint1.broken) ||
                Boolean(this.kneeJoint1.broken)) &&
            (Boolean(this.hipJoint2.broken) || Boolean(this.kneeJoint2.broken))
        ) {
            _loc1_ = this.defaultFilter.Copy();
            _loc1_.groupIndex = 0;
            this.frameShape.SetFilterData(_loc1_);
            this.nubShape.SetFilterData(_loc1_);
            this._session.m_world.Refilter(this.frameShape);
            this._session.m_world.Refilter(this.nubShape);
        }
    }

    public override grabAction(
        param1: b2Body,
        param2: b2Shape,
        param3: b2Body,
    ) {
        var _loc7_: b2Vec2 = null;
        var _loc8_: Vehicle = null;
        var _loc4_: b2Shape = param1.GetShapeList();
        var _loc5_: b2Vec2 = param1.GetWorldPoint(
            new b2Vec2(0, (_loc4_ as b2PolygonShape).GetVertices()[2].y),
        );
        if (!this.frameSmashed && !this._dying && !this.userVehicle) {
            _loc7_ = this.frameBody.GetWorldPoint(this.handleAnchorPoint);
            if (
                Math.abs(_loc5_.x - _loc7_.x) < this.reAttachDistance &&
                Math.abs(_loc5_.y - _loc7_.y) < this.reAttachDistance
            ) {
                this.reAttach(param1);
                return;
            }
        }
        var _loc6_ = new b2RevoluteJointDef();
        if (!param3.IsStatic()) {
            _loc6_.enableLimit = true;
        }
        _loc6_.maxMotorTorque = 4;
        _loc6_.Initialize(param3, param1, _loc5_);
        if (param1 == this.lowerArm1Body) {
            // @ts-expect-error
            this.lowerArm1MC.hand.gotoAndStop(1);
            this._session.contactListener.deleteListener(
                ContactListener.RESULT,
                this.lowerArm1Shape,
            );
            if (param2.GetUserData() instanceof Vehicle) {
                _loc8_ = param2.GetUserData();
                if (Boolean(this.userVehicle) && _loc8_ != this.userVehicle) {
                    this.gripJoint1 = this._session.m_world.CreateJoint(
                        _loc6_,
                    ) as b2RevoluteJoint;
                } else {
                    this.userVehicle = param2.GetUserData();
                    this.userVehicle.addCharacter(this);
                    this.vehicleArm1Joint = this._session.m_world.CreateJoint(
                        _loc6_,
                    ) as b2RevoluteJoint;
                    this.currentPose = 0;
                    switch (this.userVehicle.characterPose) {
                        case 0:
                            break;
                        case 1:
                            this.currentPose = 10;
                            break;
                        case 2:
                            this.currentPose = 11;
                            break;
                        case 3:
                            this.currentPose = 12;
                    }
                }
            } else {
                this.gripJoint1 = this._session.m_world.CreateJoint(
                    _loc6_,
                ) as b2RevoluteJoint;
            }
        }
        if (param1 == this.lowerArm2Body) {
            // @ts-expect-error
            this.lowerArm2MC.hand.gotoAndStop(1);
            this._session.contactListener.deleteListener(
                ContactListener.RESULT,
                this.lowerArm2Shape,
            );
            if (param2.GetUserData() instanceof Vehicle) {
                _loc8_ = param2.GetUserData();
                if (Boolean(this.userVehicle) && _loc8_ != this.userVehicle) {
                    this.gripJoint2 = this._session.m_world.CreateJoint(
                        _loc6_,
                    ) as b2RevoluteJoint;
                } else {
                    this.userVehicle = param2.GetUserData();
                    this.userVehicle.addCharacter(this);
                    this.vehicleArm2Joint = this._session.m_world.CreateJoint(
                        _loc6_,
                    ) as b2RevoluteJoint;
                    this.currentPose = 0;
                    switch (this.userVehicle.characterPose) {
                        case 0:
                            break;
                        case 1:
                            this.currentPose = 10;
                            break;
                        case 2:
                            this.currentPose = 11;
                            break;
                        case 3:
                            this.currentPose = 12;
                    }
                }
            } else {
                this.gripJoint2 = this._session.m_world.CreateJoint(
                    _loc6_,
                ) as b2RevoluteJoint;
            }
        }
    }

    protected reAttach(param1: b2Body) {
        var _loc2_: number = NaN;
        var _loc3_: number = NaN;
        var _loc4_: number = NaN;
        trace("RE ATTACH");
        this._session.contactListener.deleteListener(
            ContactListener.RESULT,
            this.lowerArm1Shape,
        );
        this._session.contactListener.deleteListener(
            ContactListener.RESULT,
            this.lowerArm2Shape,
        );
        this.contactResultBuffer.delete(this.lowerArm1Shape);
        this.contactResultBuffer.delete(this.lowerArm2Shape);
        this.removeAction(this.relaxPogo);
        this.ejected = false;
        this.currentPose = 0;
        this.releaseGrip();
        this.elbowBreakLimit = 90;
        this.elbowLigamentLimit = 110;
        this.kneeBreakLimit = 120;
        this.kneeLigamentLimit = 140;
        _loc2_ =
            this.hipJoint1.m_body2.GetAngle() -
            this.hipJoint1.m_body1.GetAngle() -
            this.hipJoint1.GetJointAngle();
        _loc3_ = -100 / CharacterB2D.oneEightyOverPI - _loc2_;
        _loc4_ = 0 / CharacterB2D.oneEightyOverPI - _loc2_;
        this.hipJoint1.SetLimits(_loc3_, _loc4_);
        _loc2_ =
            this.hipJoint2.m_body2.GetAngle() -
            this.hipJoint2.m_body1.GetAngle() -
            this.hipJoint2.GetJointAngle();
        _loc3_ = -100 / CharacterB2D.oneEightyOverPI - _loc2_;
        _loc4_ = 0 / CharacterB2D.oneEightyOverPI - _loc2_;
        this.hipJoint2.SetLimits(_loc3_, _loc4_);
        _loc2_ =
            this.shoulderJoint1.m_body2.GetAngle() -
            this.shoulderJoint1.m_body1.GetAngle() -
            this.shoulderJoint1.GetJointAngle();
        _loc3_ = -120 / CharacterB2D.oneEightyOverPI - _loc2_;
        _loc4_ = 0 / CharacterB2D.oneEightyOverPI - _loc2_;
        this.shoulderJoint1.SetLimits(_loc3_, _loc4_);
        _loc2_ =
            this.shoulderJoint2.m_body2.GetAngle() -
            this.shoulderJoint2.m_body1.GetAngle() -
            this.shoulderJoint2.GetJointAngle();
        _loc3_ = -120 / CharacterB2D.oneEightyOverPI - _loc2_;
        _loc4_ = 0 / CharacterB2D.oneEightyOverPI - _loc2_;
        this.shoulderJoint2.SetLimits(_loc3_, _loc4_);
        _loc2_ =
            this.lowerArm1Body.GetAngle() -
            this.upperArm1Body.GetAngle() -
            this.elbowJoint1.GetJointAngle();
        _loc3_ = -60 / CharacterB2D.oneEightyOverPI - _loc2_;
        _loc4_ = 0 / CharacterB2D.oneEightyOverPI - _loc2_;
        this.elbowJoint1.SetLimits(_loc3_, _loc4_);
        _loc2_ =
            this.lowerArm2Body.GetAngle() -
            this.upperArm2Body.GetAngle() -
            this.elbowJoint2.GetJointAngle();
        _loc3_ = -60 / CharacterB2D.oneEightyOverPI - _loc2_;
        _loc4_ = 0 / CharacterB2D.oneEightyOverPI - _loc2_;
        this.elbowJoint2.SetLimits(_loc3_, _loc4_);
        _loc2_ =
            this.head1Body.GetAngle() -
            this.chestBody.GetAngle() -
            this.neckJoint.GetJointAngle();
        _loc3_ = 0 / CharacterB2D.oneEightyOverPI - _loc2_;
        _loc4_ = 5 / CharacterB2D.oneEightyOverPI - _loc2_;
        this.neckJoint.SetLimits(_loc3_, _loc4_);
        var _loc5_: b2World = this._session.m_world;
        this.frameShape.SetFilterData(this.defaultFilter);
        this.rodShape.SetFilterData(this.defaultFilter);
        _loc5_.Refilter(this.frameShape);
        _loc5_.Refilter(this.rodShape);
        this.checkLegsBroken();
        if (param1 == this.lowerArm1Body) {
            this.frameHand1 = _loc5_.CreateJoint(
                this.frameHand1JointDef,
            ) as b2RevoluteJoint;
            // @ts-expect-error
            this.lowerArm1MC.hand.gotoAndStop(1);
        } else {
            this.frameHand2 = _loc5_.CreateJoint(
                this.frameHand2JointDef,
            ) as b2RevoluteJoint;
            // @ts-expect-error
            this.lowerArm2MC.hand.gotoAndStop(1);
        }
        this.actionsVector.push(this.reAttaching);
    }

    public reAttaching() {
        var _loc3_: b2Vec2 = null;
        var _loc4_: b2Vec2 = null;
        var _loc1_: number = 0;
        var _loc2_: b2World = this._session.m_world;
        if (
            !this.frameHand1 &&
            !this.elbowJoint1.broken &&
            !this.shoulderJoint1.broken
        ) {
            _loc3_ = this.lowerArm1Body.GetWorldPoint(
                new b2Vec2(
                    0,
                    (this.lowerArm1Shape as b2PolygonShape).GetVertices()[2].y,
                ),
            );
            _loc4_ = this.frameBody.GetWorldPoint(this.handleAnchorPoint);
            if (
                Math.abs(_loc3_.x - _loc4_.x) < this.reAttachDistance &&
                Math.abs(_loc3_.y - _loc4_.y) < this.reAttachDistance
            ) {
                this.frameHand1 = _loc2_.CreateJoint(
                    this.frameHand1JointDef,
                ) as b2RevoluteJoint;
                // @ts-expect-error
                this.lowerArm1MC.hand.gotoAndStop(1);
                _loc1_ += 1;
            }
        } else {
            _loc1_ += 1;
        }
        if (
            !this.frameHand2 &&
            !this.elbowJoint2.broken &&
            !this.shoulderJoint2.broken
        ) {
            _loc3_ = this.lowerArm2Body.GetWorldPoint(
                new b2Vec2(
                    0,
                    (this.lowerArm2Shape as b2PolygonShape).GetVertices()[2].y,
                ),
            );
            _loc4_ = this.frameBody.GetWorldPoint(this.handleAnchorPoint);
            if (
                Math.abs(_loc3_.x - _loc4_.x) < this.reAttachDistance &&
                Math.abs(_loc3_.y - _loc4_.y) < this.reAttachDistance
            ) {
                this.frameHand2 = _loc2_.CreateJoint(
                    this.frameHand2JointDef,
                ) as b2RevoluteJoint;
                // @ts-expect-error
                this.lowerArm2MC.hand.gotoAndStop(1);
                _loc1_ += 1;
            }
        } else {
            _loc1_ += 1;
        }
        if (
            !this.frameFoot1 &&
            !this.kneeJoint1.broken &&
            !this.hipJoint1.broken
        ) {
            _loc3_ = this.lowerLeg1Body.GetWorldPoint(
                new b2Vec2(
                    0,
                    (this.lowerLeg1Shape as b2PolygonShape).GetVertices()[2].y,
                ),
            );
            _loc4_ = this.frameBody.GetWorldPoint(this.footAnchorPoint);
            if (
                Math.abs(_loc3_.x - _loc4_.x) < 0.2 &&
                Math.abs(_loc3_.y - _loc4_.y) < 0.2
            ) {
                this.frameFoot1 = _loc2_.CreateJoint(
                    this.frameFoot1JointDef,
                ) as b2RevoluteJoint;
                _loc1_ += 1;
            }
        } else {
            _loc1_ += 1;
        }
        if (
            !this.frameFoot2 &&
            !this.kneeJoint2.broken &&
            !this.hipJoint2.broken
        ) {
            _loc3_ = this.lowerLeg2Body.GetWorldPoint(
                new b2Vec2(
                    0,
                    (this.lowerLeg2Shape as b2PolygonShape).GetVertices()[2].y,
                ),
            );
            _loc4_ = this.frameBody.GetWorldPoint(this.footAnchorPoint);
            if (
                Math.abs(_loc3_.x - _loc4_.x) < 0.2 &&
                Math.abs(_loc3_.y - _loc4_.y) < 0.2
            ) {
                this.frameFoot2 = _loc2_.CreateJoint(
                    this.frameFoot2JointDef,
                ) as b2RevoluteJoint;
                _loc1_ += 1;
            }
        } else {
            _loc1_ += 1;
        }
        if (_loc1_ >= 4) {
            trace("ATTACH COMPLETE");
            this.removeAction(this.reAttaching);
            this.currentPose = 9;
        }
    }

    protected relaxPogo() {
        trace("RELAX POGO");
        var _loc1_: number = this.pogoJoint.GetJointTranslation();
        var _loc2_: number = _loc1_ * -70;
        if (_loc1_ < 0) {
            this.pogoJoint.SetMotorSpeed(_loc2_);
        } else {
            trace("RELAXED");
            this.pogoJoint.SetMotorSpeed(0);
            this.pogoJoint.m_lowerTranslation = 0;
            this.jumpFrames = this.jumpFramesMax;
            this.removeAction(this.relaxPogo);
        }
    }
}