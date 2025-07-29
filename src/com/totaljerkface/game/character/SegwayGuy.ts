import b2CircleDef from "@/Box2D/Collision/Shapes/b2CircleDef";
import b2FilterData from "@/Box2D/Collision/Shapes/b2FilterData";
import b2PolygonDef from "@/Box2D/Collision/Shapes/b2PolygonDef";
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
import AreaSoundLoop from "@/com/totaljerkface/game/sound/AreaSoundLoop";
import SoundController from "@/com/totaljerkface/game/sound/SoundController";
import { boundClass } from 'autobind-decorator';
import DisplayObject from "flash/display/DisplayObject";
import MovieClip from "flash/display/MovieClip";
import Sprite from "flash/display/Sprite";

@boundClass
export default class SegwayGuy extends CharacterB2D {
    protected ejected: boolean;
    protected helmetOn: boolean;
    protected wheelMaxSpeed: number = 40;
    protected wheelCurrentSpeed: number;
    protected wheelNewSpeed: number;
    protected accelStep: number = 1;
    protected maxTorque: number = 20;
    protected wheelContacts: number = 0;
    protected impulseMagnitude: number = 3;
    protected impulseOffset: number = 1;
    protected maxSpinAV: number = 5;
    protected helmetSmashLimit: number = 2;
    protected frameSmashLimit: number = 20;
    protected frameSmashed: boolean;
    protected jumpTranslation: number;
    protected charge: number = 0;
    protected chargeMax: number = 15;
    protected chargeMin: number = 5;
    protected wheelLoop1: AreaSoundLoop;
    protected wheelLoop2: AreaSoundLoop;
    protected wheelLoop3: AreaSoundLoop;
    protected motorSound: AreaSoundLoop;
    protected handleAnchorPoint: b2Vec2;
    protected footAnchorPoint: b2Vec2;
    protected frameHand1JointDef: b2RevoluteJointDef;
    protected frameHand2JointDef: b2RevoluteJointDef;
    protected standFoot1JointDef: b2RevoluteJointDef;
    protected standFoot2JointDef: b2RevoluteJointDef;
    public frameBody: b2Body;
    public shockBody: b2Body;
    public wheelBody: b2Body;
    public standBody: b2Body;
    public helmetBody: b2Body;
    public helmetShape: b2Shape;
    public frameShape: b2Shape;
    public wheelShape: b2Shape;
    public standShape: b2Shape;
    public frameMC: MovieClip;
    public wheelMC: MovieClip;
    public wheelCoverMC: MovieClip;
    public shockMC: Sprite;
    public helmetMC: MovieClip;
    public shockJoint: b2PrismaticJoint;
    public wheelJoint: b2RevoluteJoint;
    public standFrame: b2RevoluteJoint;
    public frameHand1: b2RevoluteJoint;
    public frameHand2: b2RevoluteJoint;
    public standFoot1: b2RevoluteJoint;
    public standFoot2: b2RevoluteJoint;

    constructor(
        param1: number,
        param2: number,
        param3: DisplayObject,
        param4: Session,
    ) {
        super(param1, param2, param3, param4, -1, "Char2");
        this.jumpTranslation = 30 / this.m_physScale;
    }

    public override leftPressedActions() {
        if (this.ejected) {
            this.currentPose = 1;
        } else {
            this.leanBackward();
        }
    }

    public override rightPressedActions() {
        if (this.ejected) {
            this.currentPose = 2;
        } else {
            this.leanForward();
        }
    }

    public override leftAndRightActions() {
        if (this.ejected) {
            if (this._currentPose == 1 || this._currentPose == 2) {
                this.currentPose = 0;
            }
        } else {
            this.noLean();
        }
    }

    public override upPressedActions() {
        if (this.ejected) {
            this.currentPose = 3;
        } else {
            if (!this.wheelJoint.IsMotorEnabled()) {
                this.wheelJoint.EnableMotor(true);
            }
            this.wheelCurrentSpeed = this.wheelJoint.GetJointSpeed();
            this.wheelNewSpeed =
                this.wheelCurrentSpeed < this.wheelMaxSpeed
                    ? this.wheelCurrentSpeed + this.accelStep
                    : this.wheelCurrentSpeed;
            this.wheelJoint.SetMotorSpeed(this.wheelNewSpeed);
        }
    }

    public override downPressedActions() {
        if (this.ejected) {
            this.currentPose = 4;
        } else {
            if (!this.wheelJoint.IsMotorEnabled()) {
                this.wheelJoint.EnableMotor(true);
            }
            this.wheelCurrentSpeed = this.wheelJoint.GetJointSpeed();
            this.wheelNewSpeed =
                this.wheelCurrentSpeed > -this.wheelMaxSpeed
                    ? this.wheelCurrentSpeed - this.accelStep
                    : this.wheelCurrentSpeed;
            this.wheelJoint.SetMotorSpeed(this.wheelNewSpeed);
        }
    }

    public override upAndDownActions() {
        if (this.wheelJoint.IsMotorEnabled()) {
            this.wheelJoint.EnableMotor(false);
        }
        if (this._currentPose == 3 || this._currentPose == 4) {
            this.currentPose = 0;
        }
    }

    public override spacePressedActions() {
        var _loc1_: number = NaN;
        if (this.ejected) {
            this.startGrab();
        } else if (!this.shockJoint.IsMotorEnabled()) {
            this.shockJoint.SetMotorSpeed(7);
            this.shockJoint.SetLimits(0, this.jumpTranslation);
            this.shockJoint.EnableMotor(true);
            SoundController.instance.playAreaSoundInstance(
                "SegwayJump",
                this.wheelBody,
            );
        } else {
            _loc1_ = this.shockJoint.GetMotorSpeed();
            if (_loc1_ > 0) {
                if (
                    this.shockJoint.GetJointTranslation() > this.jumpTranslation
                ) {
                    this.shockJoint.SetMotorSpeed(-1);
                }
            } else if (_loc1_ < 0) {
                if (this.shockJoint.GetJointTranslation() < 0) {
                    this.shockJoint.EnableMotor(false);
                    this.shockJoint.SetLimits(0, 0);
                    this.shockJoint.SetMotorSpeed(0);
                }
            }
        }
    }

    public override spaceNullActions() {
        if (this.ejected) {
            this.releaseGrip();
        } else if (this.shockJoint.IsMotorEnabled()) {
            if (this.shockJoint.GetMotorSpeed() > 0) {
                if (
                    this.shockJoint.GetJointTranslation() > this.jumpTranslation
                ) {
                    this.shockJoint.SetMotorSpeed(-1);
                }
            } else if (this.shockJoint.GetMotorSpeed() < 0) {
                if (this.shockJoint.GetJointTranslation() < 0) {
                    this.shockJoint.EnableMotor(false);
                    this.shockJoint.SetLimits(0, 0);
                    this.shockJoint.SetMotorSpeed(0);
                }
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
        if (this._currentPose == 5 || this._currentPose == 7) {
            this.currentPose = 0;
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
        if (this._currentPose == 6 || this._currentPose == 8) {
            this.currentPose = 0;
        }
    }

    public override zPressedActions() {
        this.eject();
    }

    public override actions() {
        var _loc1_: number = NaN;
        if (this.wheelContacts > 0) {
            _loc1_ = Math.abs(this.wheelBody.GetAngularVelocity());
            if (_loc1_ > 18) {
                if (!this.wheelLoop3) {
                    this.wheelLoop3 =
                        SoundController.instance.playAreaSoundLoop(
                            "BikeLoop3",
                            this.wheelBody,
                            0,
                        );
                    this.wheelLoop3.fadeIn(0.2);
                }
                if (this.wheelLoop1) {
                    this.wheelLoop1.fadeOut(0.2);
                    this.wheelLoop1 = null;
                }
                if (this.wheelLoop2) {
                    this.wheelLoop2.fadeOut(0.2);
                    this.wheelLoop2 = null;
                }
            } else if (_loc1_ > 9) {
                if (!this.wheelLoop2) {
                    this.wheelLoop2 =
                        SoundController.instance.playAreaSoundLoop(
                            "BikeLoop2",
                            this.wheelBody,
                            0,
                        );
                    this.wheelLoop2.fadeIn(0.2);
                }
                if (this.wheelLoop1) {
                    this.wheelLoop1.fadeOut(0.2);
                    this.wheelLoop1 = null;
                }
                if (this.wheelLoop3) {
                    this.wheelLoop3.fadeOut(0.2);
                    this.wheelLoop3 = null;
                }
            } else if (_loc1_ > 1) {
                if (!this.wheelLoop1) {
                    this.wheelLoop1 =
                        SoundController.instance.playAreaSoundLoop(
                            "BikeLoop1",
                            this.wheelBody,
                            0,
                        );
                    this.wheelLoop1.fadeIn(0.2);
                }
                if (this.wheelLoop2) {
                    this.wheelLoop2.fadeOut(0.2);
                    this.wheelLoop2 = null;
                }
                if (this.wheelLoop3) {
                    this.wheelLoop3.fadeOut(0.2);
                    this.wheelLoop3 = null;
                }
            } else {
                if (this.wheelLoop1) {
                    this.wheelLoop1.fadeOut(0.2);
                    this.wheelLoop1 = null;
                }
                if (this.wheelLoop2) {
                    this.wheelLoop2.fadeOut(0.2);
                    this.wheelLoop2 = null;
                }
                if (this.wheelLoop3) {
                    this.wheelLoop3.fadeOut(0.2);
                    this.wheelLoop3 = null;
                }
            }
        } else {
            if (this.wheelLoop1) {
                this.wheelLoop1.fadeOut(0.2);
                this.wheelLoop1 = null;
            }
            if (this.wheelLoop2) {
                this.wheelLoop2.fadeOut(0.2);
                this.wheelLoop2 = null;
            }
            if (this.wheelLoop3) {
                this.wheelLoop3.fadeOut(0.2);
                this.wheelLoop3 = null;
            }
        }
        super.actions();
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
        this.helmetOn = true;
        this.frameSmashed = false;
        this.ejected = false;
    }

    public override die() {
        super.die();
        this.helmetBody = null;
    }

    public override paint() {
        super.paint();
        var _loc1_: b2Vec2 = this.wheelBody.GetWorldCenter();
        this.wheelMC.x = _loc1_.x * this.m_physScale;
        this.wheelMC.y = _loc1_.y * this.m_physScale;
        // @ts-expect-error
        this.wheelMC.inner.rotation =
            (this.wheelBody.GetAngle() * (180 / Math.PI)) % 360;
        _loc1_ = this.standBody.GetWorldCenter();
        var _loc2_: b2Vec2 = this.shockBody.GetWorldCenter();
        this.shockMC.graphics.clear();
        this.shockMC.graphics.lineStyle(3, 13752544);
        this.shockMC.graphics.moveTo(
            _loc1_.x * this.m_physScale,
            _loc1_.y * this.m_physScale,
        );
        this.shockMC.graphics.lineTo(
            _loc2_.x * this.m_physScale,
            _loc2_.y * this.m_physScale,
        );
    }

    public override createBodies() {
        super.createBodies();
        var _loc1_ = new b2BodyDef();
        var _loc2_ = new b2BodyDef();
        var _loc3_ = new b2BodyDef();
        var _loc4_ = new b2PolygonDef();
        var _loc5_ = new b2CircleDef();
        _loc4_.density = 5;
        _loc4_.friction = 0.3;
        _loc4_.restitution = 0.1;
        _loc4_.filter.categoryBits = 514;
        _loc5_.density = 5;
        _loc5_.friction = 1;
        _loc5_.restitution = 0.3;
        _loc5_.filter.groupIndex = this.groupID;
        _loc5_.filter.categoryBits = 260;
        _loc5_.filter.maskBits = 268;
        var _loc6_: MovieClip = this.shapeGuide["frameShape"];
        var _loc7_ = new b2Vec2(
            this._startX + _loc6_.x / this.character_scale,
            this._startY + _loc6_.y / this.character_scale,
        );
        var _loc8_: number = _loc6_.rotation / (180 / Math.PI);
        _loc4_.SetAsOrientedBox(
            (_loc6_.scaleX * 5) / this.character_scale,
            (_loc6_.scaleY * 5) / this.character_scale,
            _loc7_,
            _loc8_,
        );
        this.frameBody = this._session.m_world.CreateBody(_loc1_);
        this.frameShape = this.frameBody.CreateShape(_loc4_);
        _loc6_ = this.shapeGuide["handleShape"];
        _loc7_ = new b2Vec2(
            this._startX + _loc6_.x / this.character_scale,
            this._startY + _loc6_.y / this.character_scale,
        );
        _loc8_ = _loc6_.rotation / (180 / Math.PI);
        _loc4_.SetAsOrientedBox(
            (_loc6_.scaleX * 5) / this.character_scale,
            (_loc6_.scaleY * 5) / this.character_scale,
            _loc7_,
            _loc8_,
        );
        this.frameBody.CreateShape(_loc4_);
        this.frameBody.SetMassFromShapes();
        this.paintVector.push(this.frameBody);
        this._session.contactListener.registerListener(
            ContactListener.RESULT,
            this.frameShape,
            this.contactResultHandler,
        );
        _loc6_ = this.shapeGuide["standShape"];
        _loc3_.position.Set(
            this._startX + _loc6_.x / this.character_scale,
            this._startY + _loc6_.y / this.character_scale,
        );
        _loc4_.SetAsBox(
            (_loc6_.scaleX * 5) / this.character_scale,
            (_loc6_.scaleY * 5) / this.character_scale,
        );
        _loc4_.isSensor = true;
        _loc3_.fixedRotation = true;
        this.standBody = this._session.m_world.CreateBody(_loc3_);
        this.standShape = this.standBody.CreateShape(_loc4_);
        this.standBody.SetMassFromShapes();
        this.paintVector.push(this.standBody);
        this._session.contactListener.registerListener(
            ContactListener.ADD,
            this.standShape,
            this.contactAddHandler,
        );
        this.shockBody = this._session.m_world.CreateBody(_loc3_);
        this.shockBody.CreateShape(_loc4_);
        this.shockBody.SetMassFromShapes();
        _loc6_ = this.shapeGuide["wheelShape"];
        _loc2_.position.Set(
            this._startX + _loc6_.x / this.character_scale,
            this._startY + _loc6_.y / this.character_scale,
        );
        _loc2_.angle = _loc6_.rotation / (180 / Math.PI);
        _loc5_.radius = _loc6_.width / 2 / this.character_scale;
        this.wheelBody = this._session.m_world.CreateBody(_loc2_);
        this.wheelShape = this.wheelBody.CreateShape(_loc5_);
        this.wheelBody.SetMassFromShapes();
        this._session.contactListener.registerListener(
            ContactListener.RESULT,
            this.wheelShape,
            this.contactResultHandler,
        );
        this._session.contactListener.registerListener(
            ContactListener.ADD,
            this.wheelShape,
            this.wheelContactAdd,
        );
        this._session.contactListener.registerListener(
            ContactListener.REMOVE,
            this.wheelShape,
            this.wheelContactRemove,
        );
    }

    public override createMovieClips() {
        super.createMovieClips();
        this.shockMC = new Sprite();
        this.frameMC = this.sourceObject["frame"];
        var _loc5_ = 1 / this.mc_scale;
        this.frameMC.scaleY = 1 / this.mc_scale;
        this.frameMC.scaleX = _loc5_;
        this.wheelMC = this.sourceObject["wheel"];
        _loc5_ = 1 / this.mc_scale;
        this.wheelMC.scaleY = 1 / this.mc_scale;
        this.wheelMC.scaleX = _loc5_;
        this.wheelCoverMC = this.sourceObject["wheelCover"];
        _loc5_ = 1 / this.mc_scale;
        this.wheelCoverMC.scaleY = 1 / this.mc_scale;
        this.wheelCoverMC.scaleX = _loc5_;
        this.helmetMC = this.sourceObject["helmet"];
        _loc5_ = 1 / this.mc_scale;
        this.helmetMC.scaleY = 1 / this.mc_scale;
        this.helmetMC.scaleX = _loc5_;
        this.helmetMC.visible = false;
        this.standBody.SetUserData(this.wheelCoverMC);
        var _loc1_: b2Vec2 = this.frameBody.GetLocalCenter();
        _loc1_ = new b2Vec2(
            (this._startX - _loc1_.x) * this.character_scale,
            (this._startY - _loc1_.y) * this.character_scale,
        );
        var _loc2_: MovieClip = this.shapeGuide["frameShape"];
        var _loc3_ = new b2Vec2(_loc2_.x + _loc1_.x, _loc2_.y + _loc1_.y);
        // @ts-expect-error
        this.frameMC.inner.x = _loc3_.x;
        // @ts-expect-error
        this.frameMC.inner.y = _loc3_.y;
        this.frameBody.SetUserData(this.frameMC);
        var _loc4_: number = this._session.containerSprite.getChildIndex(
            this.upperArm1MC,
        );
        this._session.containerSprite.addChildAt(this.wheelMC, _loc4_);
        this._session.containerSprite.addChildAt(this.shockMC, _loc4_);
        this._session.containerSprite.addChildAt(this.wheelCoverMC, _loc4_);
        this._session.containerSprite.addChildAt(this.frameMC, _loc4_);
        this._session.containerSprite.addChildAt(this.chestMC, _loc4_);
        this._session.containerSprite.addChildAt(
            this.helmetMC,
            this._session.containerSprite.getChildIndex(this.chestMC),
        );
    }

    public override resetMovieClips() {
        super.resetMovieClips();
        this.frameBody.SetUserData(this.frameMC);
        this.standBody.SetUserData(this.wheelCoverMC);
        this.shockMC.graphics.clear();
        this.helmetMC.visible = false;
        // @ts-expect-error
        this.head1MC.helmet.visible = true;
    }

    public override createDictionaries() {
        super.createDictionaries();
        this.helmetShape = this.head1Shape;
        this.contactImpulseDict.set(this.helmetShape, this.helmetSmashLimit);
        this.contactImpulseDict.set(this.frameShape, this.frameSmashLimit);
        this.contactAddSounds.set(this.wheelShape, "TireHit1");
        this.contactAddSounds.set(this.standShape, "Thud2");
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
        }
    }

    protected wheelContactAdd(param1: b2ContactPoint) {
        if (param1.shape2.m_isSensor) {
            return;
        }
        this.wheelContacts += 1;
        var _loc2_: b2Shape = param1.shape1;
        var _loc3_: b2Body = _loc2_.m_body;
        var _loc4_: b2Shape = param1.shape2;
        var _loc5_: b2Body = _loc4_.m_body;
        var _loc6_: number = _loc5_.m_mass;
        if (this.contactAddBuffer.get(_loc2_)) {
            return;
        }
        if (_loc6_ != 0 && _loc6_ < _loc3_.m_mass) {
            return;
        }
        var _loc7_: number = b2Math.b2Dot(param1.velocity, param1.normal);
        _loc7_ = Math.abs(_loc7_);
        if (_loc7_ > 4) {
            this.contactAddBuffer.set(_loc2_, _loc7_);
        }
    }

    protected wheelContactRemove(param1: b2ContactPoint) {
        if (param1.shape2.m_isSensor) {
            return;
        }
        --this.wheelContacts;
    }

    public override createJoints() {
        var _loc1_: number = NaN;
        var _loc2_: number = NaN;
        var _loc3_: number = NaN;
        super.createJoints();
        var _loc4_: number = 180 / Math.PI;
        _loc1_ = this.upperLeg1Body.GetAngle() - this.pelvisBody.GetAngle();
        _loc2_ = -50 / _loc4_ - _loc1_;
        _loc3_ = 10 / _loc4_ - _loc1_;
        this.hipJoint1.SetLimits(_loc2_, _loc3_);
        _loc1_ = this.upperLeg2Body.GetAngle() - this.pelvisBody.GetAngle();
        _loc2_ = -50 / _loc4_ - _loc1_;
        _loc3_ = 10 / _loc4_ - _loc1_;
        this.hipJoint2.SetLimits(_loc2_, _loc3_);
        _loc1_ = this.lowerArm1Body.GetAngle() - this.upperArm1Body.GetAngle();
        _loc2_ = -60 / _loc4_ - _loc1_;
        _loc3_ = 0 / _loc4_ - _loc1_;
        this.elbowJoint1.SetLimits(_loc2_, _loc3_);
        _loc1_ = this.lowerArm2Body.GetAngle() - this.upperArm2Body.GetAngle();
        _loc2_ = -60 / _loc4_ - _loc1_;
        _loc3_ = 0 / _loc4_ - _loc1_;
        this.elbowJoint2.SetLimits(_loc2_, _loc3_);
        _loc1_ = this.head1Body.GetAngle() - this.chestBody.GetAngle();
        _loc2_ = 0 / _loc4_ - _loc1_;
        _loc3_ = 20 / _loc4_ - _loc1_;
        this.neckJoint.SetLimits(_loc2_, _loc3_);
        var _loc5_ = new b2PrismaticJointDef();
        _loc5_.maxMotorForce = 1000;
        _loc5_.enableLimit = true;
        _loc5_.upperTranslation = 0;
        _loc5_.lowerTranslation = 0;
        var _loc6_ = new b2Vec2();
        var _loc7_: MovieClip = this.shapeGuide["wheelShape"];
        _loc6_.Set(
            this._startX + _loc7_.x / this.character_scale,
            this._startY + _loc7_.y / this.character_scale,
        );
        _loc5_.Initialize(
            this.standBody,
            this.shockBody,
            _loc6_,
            new b2Vec2(0, 1),
        );
        this.shockJoint = this._session.m_world.CreateJoint(
            _loc5_,
        ) as b2PrismaticJoint;
        var _loc8_ = new b2RevoluteJointDef();
        _loc8_.maxMotorTorque = this.maxTorque;
        _loc7_ = this.shapeGuide["wheelShape"];
        _loc6_.Set(
            this._startX + _loc7_.x / this.character_scale,
            this._startY + _loc7_.y / this.character_scale,
        );
        _loc8_.Initialize(this.shockBody, this.wheelBody, _loc6_);
        this.wheelJoint = this._session.m_world.CreateJoint(
            _loc8_,
        ) as b2RevoluteJoint;
        _loc7_ = this.shapeGuide["frameAnchor"];
        _loc6_.Set(
            this._startX + _loc7_.x / this.character_scale,
            this._startY + _loc7_.y / this.character_scale,
        );
        _loc8_.enableLimit = true;
        _loc8_.lowerAngle = -15 / _loc4_;
        _loc8_.upperAngle = 15 / _loc4_;
        _loc8_.Initialize(this.standBody, this.frameBody, _loc6_);
        this.standFrame = this._session.m_world.CreateJoint(
            _loc8_,
        ) as b2RevoluteJoint;
        _loc8_.lowerAngle = -100 / _loc4_;
        _loc8_.upperAngle = 10 / _loc4_;
        _loc7_ = this.shapeGuide["handleAnchor"];
        _loc6_.Set(
            this._startX + _loc7_.x / this.character_scale,
            this._startY + _loc7_.y / this.character_scale,
        );
        _loc8_.Initialize(this.frameBody, this.lowerArm1Body, _loc6_);
        this.frameHand1 = this._session.m_world.CreateJoint(
            _loc8_,
        ) as b2RevoluteJoint;
        this.frameHand1JointDef = _loc8_.clone();
        this.handleAnchorPoint = this.frameBody.GetLocalPoint(_loc6_);
        _loc8_.Initialize(this.frameBody, this.lowerArm2Body, _loc6_);
        this.frameHand2 = this._session.m_world.CreateJoint(
            _loc8_,
        ) as b2RevoluteJoint;
        this.frameHand2JointDef = _loc8_.clone();
        _loc8_.lowerAngle = -10 / _loc4_;
        _loc8_.upperAngle = 10 / _loc4_;
        _loc7_ = this.shapeGuide["footAnchor"];
        _loc6_.Set(
            this._startX + _loc7_.x / this.character_scale,
            this._startY + _loc7_.y / this.character_scale,
        );
        _loc8_.Initialize(this.frameBody, this.lowerLeg1Body, _loc6_);
        this.standFoot1 = this._session.m_world.CreateJoint(
            _loc8_,
        ) as b2RevoluteJoint;
        this.standFoot1JointDef = _loc8_.clone();
        this.footAnchorPoint = this.frameBody.GetLocalPoint(_loc6_);
        _loc8_.Initialize(this.frameBody, this.lowerLeg2Body, _loc6_);
        this.standFoot2 = this._session.m_world.CreateJoint(
            _loc8_,
        ) as b2RevoluteJoint;
        this.standFoot2JointDef = _loc8_.clone();
    }

    public override eject() {
        if (this.ejected) {
            return;
        }
        this.removeAction(this.reAttaching);
        this.ejected = true;
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
        if (this.standFoot1) {
            _loc1_.DestroyJoint(this.standFoot1);
            this.standFoot1 = null;
        }
        if (this.standFoot2) {
            _loc1_.DestroyJoint(this.standFoot2);
            this.standFoot2 = null;
        }
        this.shockJoint.EnableMotor(false);
        this.shockJoint.SetLimits(0, 0);
        this.shockJoint.SetMotorSpeed(0);
        var _loc2_ = new b2FilterData();
        _loc2_.categoryBits = 260;
        _loc2_.groupIndex = -2;
        var _loc3_: b2Shape = this.frameBody.GetShapeList();
        while (_loc3_) {
            _loc3_.SetFilterData(_loc2_);
            _loc1_.Refilter(_loc3_);
            _loc3_ = _loc3_.m_next;
        }
        this.wheelBody.GetShapeList().SetFilterData(_loc2_);
        _loc1_.Refilter(this.wheelBody.GetShapeList());
        // @ts-expect-error
        this.lowerArm1MC.hand.gotoAndStop(2);
        // @ts-expect-error
        this.lowerArm2MC.hand.gotoAndStop(2);
    }

    protected reAttach(param1: b2Body) {
        throw new Error("this must be called only in subclass");
    }

    public reAttaching() {
        throw new Error("this must be called only in subclass");
    }

    public override set dead(param1: boolean) {
        this._dead = param1;
        if (this._dead) {
            this.removeAction(this.reAttaching);
            this.userVehicleEject();
            this.currentPose = 0;
            this.releaseGrip();
            this.wheelJoint.EnableMotor(false);
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
            this.standShape,
        );
        var _loc2_: b2World = this._session.m_world;
        _loc2_.DestroyJoint(this.standFrame);
        this.standFrame = null;
        this.frameSmashed = true;
        this.eject();
        var _loc3_: b2Shape = this.frameBody.GetShapeList();
        while (_loc3_) {
            _loc3_.SetFilterData(this.zeroFilter);
            _loc2_.Refilter(_loc3_);
            _loc3_ = _loc3_.m_next;
        }
        this.wheelBody.GetShapeList().SetFilterData(this.zeroFilter);
        _loc2_.Refilter(this.wheelBody.GetShapeList());
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

    public override elbowBreak1(param1: number) {
        super.elbowBreak1(param1);
        if (this.ejected) {
            return;
        }
        if (this.frameHand1) {
            this._session.m_world.DestroyJoint(this.frameHand1);
            this.frameHand1 = null;
            if (!this.frameHand2) {
                this.eject();
            }
        }
    }

    public override elbowBreak2(param1: number) {
        super.elbowBreak2(param1);
        if (this.ejected) {
            return;
        }
        if (this.frameHand2) {
            this._session.m_world.DestroyJoint(this.frameHand2);
            this.frameHand2 = null;
            if (!this.frameHand1) {
                this.eject();
            }
        }
    }

    public override kneeBreak1(param1: number) {
        super.kneeBreak1(param1);
        if (this.ejected) {
            return;
        }
        if (this.standFoot1) {
            this._session.m_world.DestroyJoint(this.standFoot1);
            this.standFoot1 = null;
        }
    }

    public override kneeBreak2(param1: number) {
        super.kneeBreak2(param1);
        if (this.standFoot2) {
            this._session.m_world.DestroyJoint(this.standFoot2);
            this.standFoot2 = null;
        }
    }

    public leanBackPose() {
        this.setJoint(this.neckJoint, 0, 2);
        this.setJoint(this.elbowJoint1, 1.04, 15);
        this.setJoint(this.elbowJoint2, 1.04, 15);
    }

    public leanForwardPose() {
        this.setJoint(this.neckJoint, 1, 1);
        this.setJoint(this.elbowJoint1, 0, 15);
        this.setJoint(this.elbowJoint2, 0, 15);
    }

    public squatPose() {
        this.setJoint(this.kneeJoint1, 1.5, 10);
        this.setJoint(this.kneeJoint2, 1.5, 10);
    }

    public straightLegPose() {
        this.setJoint(this.kneeJoint1, 0, 10);
        this.setJoint(this.kneeJoint2, 0, 10);
    }

    public leanForward() {
        this.setJoint(this.standFrame, 0.52, 20);
    }

    public leanBackward() {
        this.setJoint(this.standFrame, 0, 20);
    }

    public noLean() {
        this.setJoint(this.standFrame, 0.26, 20);
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
}