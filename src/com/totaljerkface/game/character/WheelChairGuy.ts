import b2AABB from "@/Box2D/Collision/b2AABB";
import b2ContactPoint from "@/Box2D/Collision/b2ContactPoint";
import b2CircleDef from "@/Box2D/Collision/Shapes/b2CircleDef";
import b2FilterData from "@/Box2D/Collision/Shapes/b2FilterData";
import b2PolygonDef from "@/Box2D/Collision/Shapes/b2PolygonDef";
import b2Shape from "@/Box2D/Collision/Shapes/b2Shape";
import b2Math from "@/Box2D/Common/Math/b2Math";
import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import b2Body from "@/Box2D/Dynamics/b2Body";
import b2BodyDef from "@/Box2D/Dynamics/b2BodyDef";
import b2World from "@/Box2D/Dynamics/b2World";
import b2DistanceJointDef from "@/Box2D/Dynamics/Joints/b2DistanceJointDef";
import b2RevoluteJoint from "@/Box2D/Dynamics/Joints/b2RevoluteJoint";
import b2RevoluteJointDef from "@/Box2D/Dynamics/Joints/b2RevoluteJointDef";
import CharacterB2D from "@/com/totaljerkface/game/character/CharacterB2D";
import ContactListener from "@/com/totaljerkface/game/ContactListener";
import ContactEvent from "@/com/totaljerkface/game/events/ContactEvent";
import Session from "@/com/totaljerkface/game/Session";
import AreaSoundLoop from "@/com/totaljerkface/game/sound/AreaSoundLoop";
import SoundController from "@/com/totaljerkface/game/sound/SoundController";
import Explosion from "@/top/Explosion";
import { boundClass } from 'autobind-decorator';
import DisplayObject from "flash/display/DisplayObject";
import MovieClip from "flash/display/MovieClip";
import Sprite from "flash/display/Sprite";

@boundClass
export default class WheelChairGuy extends CharacterB2D {
    private firing: boolean;
    private ejected: boolean;
    private chairSmashed: boolean;
    private wheelMaxSpeed: number = 20;
    private wheelCurrentSpeed: number;
    private wheelNewSpeed: number;
    private wheelContacts: number = 0;
    private accelStep: number = 0.2;
    private maxTorque: number = 20;
    private impulseMagnitude: number = 0.5;
    private impulseOffset: number = 1;
    private maxSpinAV: number = 5;
    private jetImpulse: number = 2;
    private jetAngle: number = 0;
    private jetSound: AreaSoundLoop;
    private wheelSound: AreaSoundLoop;
    public chairSmashLimit: number = 200;
    public wheelSmashLimit: number = 200;
    public jetSmashLimit: number = 30;
    public fueltankSmashLimit: number = 30;
    public chairBody: b2Body;
    public bigWheelBody: b2Body;
    public smallWheelBody: b2Body;
    public jetBody: b2Body;
    public fueltankBody: b2Body;
    public jetShape: b2Shape;
    public fueltankShape: b2Shape;
    public bigWheelShape: b2Shape;
    public chairShape1: b2Shape;
    public chairShape2: b2Shape;
    public chairShape3: b2Shape;
    public chairMC: MovieClip;
    public bigWheelMC: MovieClip;
    public smallWheelMC: MovieClip;
    public jetMC: MovieClip;
    public handleMC: MovieClip;
    public fueltankMC: MovieClip;
    public bigWheelJoint: b2RevoluteJoint;
    public smallWheelJoint: b2RevoluteJoint;
    public chairPelvis: b2RevoluteJoint;
    public chairChest: b2RevoluteJoint;
    public chairLeg1: b2RevoluteJoint;
    public chairLeg2: b2RevoluteJoint;

    constructor(
        param1: number,
        param2: number,
        param3: DisplayObject,
        param4: Session,
    ) {
        super(param1, param2, param3, param4);
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
            _loc1_ = this.chairBody.GetAngle();
            _loc2_ = this.chairBody.GetAngularVelocity();
            _loc3_ = (_loc2_ + this.maxSpinAV) / this.maxSpinAV;
            if (_loc3_ < 0) {
                _loc3_ = 0;
            }
            if (_loc3_ > 1) {
                _loc3_ = 1;
            }
            _loc4_ = Math.cos(_loc1_) * this.impulseMagnitude * _loc3_;
            _loc5_ = Math.sin(_loc1_) * this.impulseMagnitude * _loc3_;
            _loc6_ = this.chairBody.GetLocalCenter();
            this.chairBody.ApplyImpulse(
                new b2Vec2(_loc5_, -_loc4_),
                this.chairBody.GetWorldPoint(
                    new b2Vec2(_loc6_.x + this.impulseOffset, _loc6_.y),
                ),
            );
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
            _loc1_ = this.chairBody.GetAngle();
            _loc2_ = this.chairBody.GetAngularVelocity();
            _loc3_ = (_loc2_ - this.maxSpinAV) / -this.maxSpinAV;
            if (_loc3_ < 0) {
                _loc3_ = 0;
            }
            if (_loc3_ > 1) {
                _loc3_ = 1;
            }
            _loc4_ = 1;
            _loc5_ = Math.cos(_loc1_) * this.impulseMagnitude * _loc3_;
            _loc6_ = Math.sin(_loc1_) * this.impulseMagnitude * _loc3_;
            _loc7_ = this.chairBody.GetLocalCenter();
            this.chairBody.ApplyImpulse(
                new b2Vec2(_loc6_, -_loc5_),
                this.chairBody.GetWorldPoint(
                    new b2Vec2(_loc7_.x - this.impulseOffset, _loc7_.y),
                ),
            );
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
            if (!this.bigWheelJoint.IsMotorEnabled()) {
                this.bigWheelJoint.EnableMotor(true);
            }
            this.wheelCurrentSpeed = this.bigWheelJoint.GetJointSpeed();
            if (this.wheelCurrentSpeed < 0) {
                this.wheelNewSpeed = 0;
            } else {
                this.wheelNewSpeed =
                    this.wheelCurrentSpeed < this.wheelMaxSpeed
                        ? this.wheelCurrentSpeed + this.accelStep
                        : this.wheelCurrentSpeed;
            }
            this.bigWheelJoint.SetMotorSpeed(this.wheelNewSpeed);
            this.currentPose = 5;
        }
    }

    public override downPressedActions() {
        if (this.ejected) {
            this.currentPose = 4;
        } else {
            if (!this.bigWheelJoint.IsMotorEnabled()) {
                this.bigWheelJoint.EnableMotor(true);
            }
            this.wheelCurrentSpeed = this.bigWheelJoint.GetJointSpeed();
            if (this.wheelCurrentSpeed > 0) {
                this.wheelNewSpeed = 0;
            } else {
                this.wheelNewSpeed =
                    this.wheelCurrentSpeed > -this.wheelMaxSpeed
                        ? this.wheelCurrentSpeed - this.accelStep
                        : this.wheelCurrentSpeed;
            }
            this.bigWheelJoint.SetMotorSpeed(this.wheelNewSpeed);
            this.currentPose = 5;
        }
    }

    public override upAndDownActions() {
        if (this.bigWheelJoint.IsMotorEnabled()) {
            this.bigWheelJoint.EnableMotor(false);
        }
        if (this.ejected) {
            if (this._currentPose == 3 || this._currentPose == 4) {
                this.currentPose = 0;
            }
        } else if (this._currentPose == 5) {
            this.currentPose = 0;
        }
    }

    public override spacePressedActions() {
        if (this.ejected) {
            this.startGrab();
        } else {
            if (this.chairSmashed) {
                return;
            }
            if (!this.firing) {
                this.firing = true;
                // @ts-expect-error
                this.jetMC.inner.turbine.play();
                // @ts-expect-error
                this.jetMC.flames.visible = true;
                if (!this.jetSound) {
                    this.jetSound = SoundController.instance.playAreaSoundLoop(
                        "JetBlast",
                        this.bigWheelBody,
                        0,
                    );
                    this.jetSound.fadeIn(0.2);
                } else {
                    this.jetSound.fadeIn(0.2);
                }
            }
        }
    }

    public override spaceNullActions() {
        if (this.ejected) {
            this.releaseGrip();
        } else if (this.firing) {
            this.firing = false;
            // @ts-expect-error
            this.jetMC.inner.turbine.stop();
            // @ts-expect-error
            this.jetMC.flames.visible = false;
            this.jetSound.fadeOut(0.2);
            this.jetSound = null;
        }
    }

    public override shiftPressedActions() {
        if (this.ejected) {
            this.currentPose = 6;
        } else {
            this.jetAngle += 0.1;
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
        } else {
            this.jetAngle -= 0.1;
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
        var _loc1_: number = NaN;
        var _loc2_: number = NaN;
        var _loc3_: number = NaN;
        if (this.firing) {
            _loc1_ = this.chairBody.GetAngle() + this.jetAngle;
            _loc2_ = Math.cos(_loc1_) * this.jetImpulse;
            _loc3_ = Math.sin(_loc1_) * this.jetImpulse;
            this.bigWheelBody.ApplyImpulse(
                new b2Vec2(_loc2_, _loc3_),
                this.chairBody.GetWorldCenter(),
            );
        }
        if (this.wheelContacts > 0) {
            if (Math.abs(this.bigWheelBody.GetAngularVelocity()) > 1) {
                if (!this.wheelSound) {
                    this.wheelSound =
                        SoundController.instance.playAreaSoundLoop(
                            "BikeLoop1",
                            this.bigWheelBody,
                            0,
                        );
                    this.wheelSound.fadeIn(0.2);
                }
            } else if (this.wheelSound) {
                this.wheelSound.fadeOut(0.2);
                this.wheelSound = null;
            }
        } else if (this.wheelSound) {
            this.wheelSound.fadeOut(0.2);
            this.wheelSound = null;
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
                this.seatPose();
                break;
            case 6:
                this.wheelPoseLeft();
                break;
            case 7:
                this.wheelPoseRight();
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
        this.firing = false;
        this.chairSmashed = false;
        this.jetAngle = 0;
        // @ts-expect-error
        this.jetMC.inner.rotation = 0;
        // @ts-expect-error
        this.jetMC.inner.turbine.stop();
        // @ts-expect-error
        this.jetMC.flames.visible = false;
        this.jetSound = null;
        this.wheelContacts = 0;
    }

    public override paint() {
        super.paint();
        if (this.chairSmashed) {
            return;
        }
        var _loc1_: b2Vec2 = this.bigWheelBody.GetWorldCenter();
        this.jetMC.x = _loc1_.x * this.m_physScale;
        this.jetMC.y = _loc1_.y * this.m_physScale;
        this.jetMC.rotation =
            ((this.chairBody.GetAngle() + this.jetAngle) *
                CharacterB2D.oneEightyOverPI) %
            360;
    }

    public override createDictionaries() {
        super.createDictionaries();
        this.contactImpulseDict.set(this.chairShape1, this.chairSmashLimit);
        this.contactImpulseDict.set(this.bigWheelShape, this.wheelSmashLimit);
        this.contactAddSounds.set(this.chairShape1, "ChairHit1");
        this.contactAddSounds.set(this.chairShape2, "ChairHit2");
        this.contactAddSounds.set(this.chairShape3, "ChairHit3");
        this.contactAddSounds.set(this.bigWheelShape, "TireHit1");
    }

    public override createBodies() {
        super.createBodies();
        var _loc1_: b2World = this.session.m_world;
        var _loc2_ = new b2BodyDef();
        var _loc3_ = new b2BodyDef();
        var _loc4_ = new b2BodyDef();
        var _loc5_ = new b2PolygonDef();
        var _loc6_ = new b2CircleDef();
        _loc5_.density = 2;
        _loc5_.friction = 0.3;
        _loc5_.restitution = 0.1;
        _loc5_.filter.categoryBits = 1025;
        _loc6_.density = 5;
        _loc6_.friction = 1;
        _loc6_.restitution = 0.1;
        _loc6_.filter.categoryBits = 1025;
        var _loc7_: MovieClip = this.shapeGuide["chair1Shape"];
        var _loc8_ = new b2Vec2(
            this._startX + _loc7_.x / this.character_scale,
            this._startY + _loc7_.y / this.character_scale,
        );
        _loc5_.SetAsOrientedBox(
            _loc7_.width / 2 / this.character_scale,
            _loc7_.height / 2 / this.character_scale,
            _loc8_,
        );
        this.chairBody = _loc1_.CreateBody(_loc2_);
        this.chairShape1 = this.chairBody.CreateShape(_loc5_);
        this._session.contactListener.registerListener(
            ContactListener.RESULT,
            this.chairShape1,
            this.contactChairResultHandler,
        );
        this._session.contactListener.registerListener(
            ContactListener.ADD,
            this.chairShape1,
            this.contactAddHandler,
        );
        _loc7_ = this.shapeGuide["chair2Shape"];
        _loc8_.Set(
            this._startX + _loc7_.x / this.character_scale,
            this._startY + _loc7_.y / this.character_scale,
        );
        _loc5_.SetAsOrientedBox(
            _loc7_.width / 2 / this.character_scale,
            _loc7_.height / 2 / this.character_scale,
            _loc8_,
        );
        this.chairShape2 = this.chairBody.CreateShape(_loc5_);
        this._session.contactListener.registerListener(
            ContactListener.RESULT,
            this.chairShape2,
            this.contactChairResultHandler,
        );
        this._session.contactListener.registerListener(
            ContactListener.ADD,
            this.chairShape2,
            this.contactAddHandler,
        );
        _loc7_ = this.shapeGuide["chair3Shape"];
        _loc8_.Set(
            this._startX + _loc7_.x / this.character_scale,
            this._startY + _loc7_.y / this.character_scale,
        );
        _loc5_.SetAsOrientedBox(
            _loc7_.width / 2 / this.character_scale,
            _loc7_.height / 2 / this.character_scale,
            _loc8_,
        );
        this.chairShape3 = this.chairBody.CreateShape(_loc5_);
        this._session.contactListener.registerListener(
            ContactListener.RESULT,
            this.chairShape3,
            this.contactChairResultHandler,
        );
        this._session.contactListener.registerListener(
            ContactListener.ADD,
            this.chairShape3,
            this.contactAddHandler,
        );
        this.chairBody.SetMassFromShapes();
        this.paintVector.push(this.chairBody);
        _loc7_ = this.shapeGuide["bigWheelShape"];
        _loc3_.position.Set(
            this._startX + _loc7_.x / this.character_scale,
            this._startY + _loc7_.y / this.character_scale,
        );
        _loc3_.angle = _loc7_.rotation / CharacterB2D.oneEightyOverPI;
        _loc6_.radius = _loc7_.width / 2 / this.character_scale;
        this.bigWheelBody = _loc1_.CreateBody(_loc3_);
        this.bigWheelShape = this.bigWheelBody.CreateShape(_loc6_);
        this._session.contactListener.registerListener(
            ContactListener.RESULT,
            this.bigWheelShape,
            this.contactResultHandler,
        );
        this._session.contactListener.registerListener(
            ContactListener.ADD,
            this.bigWheelShape,
            this.wheelContactAdd,
        );
        this._session.contactListener.registerListener(
            ContactListener.REMOVE,
            this.bigWheelShape,
            this.wheelContactRemove,
        );
        this.bigWheelBody.SetMassFromShapes();
        this.paintVector.push(this.bigWheelBody);
        _loc7_ = this.shapeGuide["smallWheelShape"];
        _loc4_.position.Set(
            this._startX + _loc7_.x / this.character_scale,
            this._startY + _loc7_.y / this.character_scale,
        );
        _loc4_.angle = _loc7_.rotation / CharacterB2D.oneEightyOverPI;
        _loc6_.radius = _loc7_.width / 2 / this.character_scale;
        this.smallWheelBody = _loc1_.CreateBody(_loc4_);
        this.smallWheelBody.CreateShape(_loc6_);
        this.smallWheelBody.SetMassFromShapes();
        this.paintVector.push(this.smallWheelBody);
        var _loc9_ = new b2FilterData();
        _loc9_.categoryBits = 516;
        _loc9_.groupIndex = this.groupID;
        _loc9_.maskBits = 520;
        this.lowerArm1Shape.SetFilterData(_loc9_);
        _loc1_.Refilter(this.lowerArm1Shape);
        this.lowerArm2Shape.SetFilterData(_loc9_);
        _loc1_.Refilter(this.lowerArm2Shape);
    }

    public override createMovieClips() {
        super.createMovieClips();
        this.chairMC = this.sourceObject["chair"];
        var _loc2_ = 1 / this.mc_scale;
        this.chairMC.scaleY = 1 / this.mc_scale;
        this.chairMC.scaleX = _loc2_;
        this.bigWheelMC = this.sourceObject["bigWheel"];
        _loc2_ = 1 / this.mc_scale;
        this.bigWheelMC.scaleY = 1 / this.mc_scale;
        this.bigWheelMC.scaleX = _loc2_;
        this.smallWheelMC = this.sourceObject["smallWheel"];
        _loc2_ = 1 / this.mc_scale;
        this.smallWheelMC.scaleY = 1 / this.mc_scale;
        this.smallWheelMC.scaleX = _loc2_;
        this.jetMC = this.sourceObject["jet"];
        _loc2_ = 1 / this.mc_scale;
        this.jetMC.scaleY = 1 / this.mc_scale;
        this.jetMC.scaleX = _loc2_;
        this.handleMC = this.sourceObject["handle"];
        _loc2_ = 1 / this.mc_scale;
        this.handleMC.scaleY = 1 / this.mc_scale;
        this.handleMC.scaleX = _loc2_;
        this.fueltankMC = this.sourceObject["fueltank"];
        _loc2_ = 1 / this.mc_scale;
        this.fueltankMC.scaleY = 1 / this.mc_scale;
        this.fueltankMC.scaleX = _loc2_;
        this.chairBody.SetUserData(this.chairMC);
        this.bigWheelBody.SetUserData(this.bigWheelMC);
        this.smallWheelBody.SetUserData(this.smallWheelMC);
        var _loc1_: Sprite = this.session.containerSprite;
        _loc1_.addChildAt(
            this.fueltankMC,
            _loc1_.getChildIndex(this.upperArm1MC),
        );
        _loc1_.addChildAt(this.chairMC, _loc1_.getChildIndex(this.upperArm1MC));
        _loc1_.addChildAt(
            this.bigWheelMC,
            _loc1_.getChildIndex(this.upperArm1MC),
        );
        _loc1_.addChildAt(
            this.smallWheelMC,
            _loc1_.getChildIndex(this.upperArm1MC),
        );
        _loc1_.addChildAt(
            this.handleMC,
            _loc1_.getChildIndex(this.upperArm1MC),
        );
        _loc1_.addChildAt(this.jetMC, _loc1_.getChildIndex(this.upperArm1MC));
        // @ts-expect-error
        this.jetMC.inner.turbine.stop();
        // @ts-expect-error
        this.jetMC.flames.visible = false;
        this.bigWheelMC.stop();
        this.bigWheelMC["inner"].visible = false;
        this.handleMC.visible = false;
        this.fueltankMC.visible = false;
        this.chairMC.stop();
        this.session.particleController.createBMDArray(
            "jetshards",
            this.sourceObject["metalShards"],
        );
    }

    public override resetMovieClips() {
        super.resetMovieClips();
        this.chairBody.SetUserData(this.chairMC);
        this.bigWheelBody.SetUserData(this.bigWheelMC);
        this.smallWheelBody.SetUserData(this.smallWheelMC);
        this.bigWheelMC.gotoAndStop(1);
        this.bigWheelMC["inner"].visible = false;
        this.chairMC.gotoAndStop(1);
        this.jetMC.visible = true;
        this.handleMC.visible = false;
        this.fueltankMC.visible = false;
        this.session.particleController.createBMDArray(
            "jetshards",
            this.sourceObject["metalShards"],
        );
    }

    public override createJoints() {
        var _loc2_: number = NaN;
        var _loc3_: number = NaN;
        var _loc4_: number = NaN;
        super.createJoints();
        var _loc1_: b2World = this.session.m_world;
        var _loc5_: number = CharacterB2D.oneEightyOverPI;
        _loc2_ = this.upperLeg1Body.GetAngle() - this.pelvisBody.GetAngle();
        _loc3_ = -110 / _loc5_ - _loc2_;
        _loc4_ = -90 / _loc5_ - _loc2_;
        this.hipJoint1.SetLimits(_loc3_, _loc4_);
        _loc2_ = this.upperLeg2Body.GetAngle() - this.pelvisBody.GetAngle();
        _loc3_ = -110 / _loc5_ - _loc2_;
        _loc4_ = -90 / _loc5_ - _loc2_;
        this.hipJoint2.SetLimits(_loc3_, _loc4_);
        var _loc6_ = new b2RevoluteJointDef();
        _loc6_.maxMotorTorque = this.maxTorque;
        var _loc7_ = new b2Vec2();
        var _loc8_: MovieClip = this.shapeGuide["bigWheelShape"];
        _loc7_.Set(
            this._startX + _loc8_.x / this.character_scale,
            this._startY + _loc8_.y / this.character_scale,
        );
        _loc6_.Initialize(this.chairBody, this.bigWheelBody, _loc7_);
        this.bigWheelJoint = _loc1_.CreateJoint(_loc6_) as b2RevoluteJoint;
        _loc8_ = this.shapeGuide["smallWheelShape"];
        _loc7_.Set(
            this._startX + _loc8_.x / this.character_scale,
            this._startY + _loc8_.y / this.character_scale,
        );
        _loc6_.Initialize(this.chairBody, this.smallWheelBody, _loc7_);
        this.smallWheelJoint = _loc1_.CreateJoint(_loc6_) as b2RevoluteJoint;
        var _loc9_ = new b2DistanceJointDef();
        _loc9_.Initialize(
            this.chairBody,
            this.pelvisBody,
            this.pelvisBody.GetPosition(),
            this.pelvisBody.GetPosition(),
        );
        _loc7_.Set(
            this.chestBody.GetPosition().x,
            this.chestBody.GetPosition().y,
        );
        _loc6_.Initialize(this.chairBody, this.chestBody, _loc7_);
        this.chairChest = _loc1_.CreateJoint(_loc6_) as b2RevoluteJoint;
        _loc7_.Set(
            this.pelvisBody.GetPosition().x,
            this.pelvisBody.GetPosition().y,
        );
        _loc6_.Initialize(this.chairBody, this.pelvisBody, _loc7_);
        this.chairPelvis = _loc1_.CreateJoint(_loc6_) as b2RevoluteJoint;
        _loc7_.Set(
            this.upperLeg1Body.GetPosition().x,
            this.upperLeg1Body.GetPosition().y,
        );
        _loc6_.Initialize(this.chairBody, this.upperLeg1Body, _loc7_);
        this.chairLeg1 = _loc1_.CreateJoint(_loc6_) as b2RevoluteJoint;
        _loc7_.Set(
            this.upperLeg2Body.GetPosition().x,
            this.upperLeg2Body.GetPosition().y,
        );
        _loc6_.Initialize(this.chairBody, this.upperLeg2Body, _loc7_);
        this.chairLeg2 = _loc1_.CreateJoint(_loc6_) as b2RevoluteJoint;
    }

    protected contactChairResultHandler(param1: ContactEvent) {
        var _loc2_: number = param1.impulse;
        if (_loc2_ > this.contactImpulseDict.get(this.chairShape1)) {
            if (this.contactResultBuffer.get(this.chairShape1)) {
                if (
                    _loc2_ >
                    this.contactResultBuffer.get(this.chairShape1).impulse
                ) {
                    this.contactResultBuffer.set(this.chairShape1, param1);
                }
            } else {
                this.contactResultBuffer.set(this.chairShape1, param1);
            }
        }
    }

    protected override handleContactResults() {
        var _loc1_: ContactEvent = null;
        super.handleContactResults();
        if (this.contactResultBuffer.get(this.chairShape1)) {
            _loc1_ = this.contactResultBuffer.get(this.chairShape1);
            this.chairSmash(_loc1_.impulse, _loc1_.normal);
            this.contactResultBuffer.delete(this.chairShape1);
            this.contactAddBuffer.delete(this.chairShape1);
            this.contactAddBuffer.delete(this.chairShape2);
            this.contactAddBuffer.delete(this.chairShape3);
        }
        if (this.contactResultBuffer.get(this.bigWheelShape)) {
            _loc1_ = this.contactResultBuffer.get(this.bigWheelShape);
            this.wheelSmash(_loc1_.impulse, _loc1_.normal);
            this.contactResultBuffer.delete(this.bigWheelShape);
            this.contactAddBuffer.delete(this.bigWheelShape);
        }
        if (this.contactResultBuffer.get(this.jetShape)) {
            _loc1_ = this.contactResultBuffer.get(this.jetShape);
            this.jetSmash(_loc1_.impulse);
            this.contactResultBuffer.delete(this.jetShape);
            this.contactAddBuffer.delete(this.jetShape);
        }
        if (this.contactResultBuffer.get(this.fueltankShape)) {
            _loc1_ = this.contactResultBuffer.get(this.fueltankShape);
            this.fueltankSmash(_loc1_.impulse);
            this.contactResultBuffer.delete(this.fueltankShape);
            this.contactAddBuffer.delete(this.fueltankShape);
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

    public override eject() {
        if (this.ejected) {
            return;
        }
        this.ejected = true;
        var _loc1_: b2World = this.session.m_world;
        this.resetJointLimits();
        _loc1_.DestroyJoint(this.chairPelvis);
        this.chairPelvis = null;
        _loc1_.DestroyJoint(this.chairChest);
        this.chairChest = null;
        if (this.chairLeg1) {
            _loc1_.DestroyJoint(this.chairLeg1);
            this.chairLeg1 = null;
        }
        if (this.chairLeg2) {
            _loc1_.DestroyJoint(this.chairLeg2);
            this.chairLeg2 = null;
        }
        var _loc2_: b2World = _loc1_;
        this.smallWheelBody.GetShapeList().SetFilterData(this.zeroFilter);
        this.bigWheelBody.GetShapeList().SetFilterData(this.zeroFilter);
        _loc2_.Refilter(this.smallWheelBody.GetShapeList());
        _loc2_.Refilter(this.bigWheelBody.GetShapeList());
        var _loc3_: b2Shape = this.chairBody.GetShapeList();
        while (_loc3_) {
            _loc3_.SetFilterData(this.zeroFilter);
            _loc2_.Refilter(_loc3_);
            _loc3_ = _loc3_.m_next;
        }
        _loc3_ = this.lowerArm1Body.GetShapeList();
        if (_loc3_.GetFilterData().maskBits == 520) {
            trace("refilter arm 1");
            _loc3_.SetFilterData(this.defaultFilter);
            _loc2_.Refilter(_loc3_);
        }
        _loc3_ = this.lowerArm2Body.GetShapeList();
        if (_loc3_.GetFilterData().maskBits == 520) {
            trace("refilter arm 2");
            _loc3_.SetFilterData(this.defaultFilter);
            _loc2_.Refilter(_loc3_);
        }
        // @ts-expect-error
        this.lowerArm1MC.hand.gotoAndStop(2);
        // @ts-expect-error
        this.lowerArm2MC.hand.gotoAndStop(2);
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
            this.bigWheelJoint.EnableMotor(false);
        }
    }

    public chairSmash(param1: number, param2: b2Vec2) {
        trace("chair impulse " + param1);
        this.contactImpulseDict.delete(this.chairShape1);
        var _loc3_: ContactListener = this._session.contactListener;
        _loc3_.deleteListener(ContactListener.RESULT, this.chairShape1);
        _loc3_.deleteListener(ContactListener.RESULT, this.chairShape2);
        _loc3_.deleteListener(ContactListener.RESULT, this.chairShape3);
        _loc3_.deleteListener(ContactListener.ADD, this.chairShape1);
        _loc3_.deleteListener(ContactListener.ADD, this.chairShape2);
        _loc3_.deleteListener(ContactListener.ADD, this.chairShape3);
        this.chairSmashed = true;
        var _loc4_: b2World = this.session.m_world;
        this.chairMC.gotoAndStop(2);
        _loc4_.DestroyJoint(this.bigWheelJoint);
        _loc4_.DestroyJoint(this.smallWheelJoint);
        var _loc5_: b2Shape = this.chairBody.GetShapeList();
        while (_loc5_) {
            this.chairBody.DestroyShape(_loc5_);
            _loc5_ = this.chairBody.GetShapeList();
        }
        var _loc6_ = new b2PolygonDef();
        _loc6_.density = 2;
        _loc6_.friction = 0.3;
        _loc6_.restitution = 0.1;
        _loc6_.filter = this.zeroFilter;
        var _loc7_: b2Vec2 = this.chairBody.GetLocalCenter();
        _loc6_.SetAsOrientedBox(
            40 / this.character_scale,
            45 / this.character_scale,
            new b2Vec2(
                _loc7_.x + 8 / this.character_scale,
                _loc7_.y + 2 / this.character_scale,
            ),
            0,
        );
        var _loc8_: b2Shape = this.chairBody.CreateShape(_loc6_);
        this.contactAddSounds.set(_loc8_, "ChairHit3");
        this._session.contactListener.registerListener(
            ContactListener.ADD,
            _loc8_,
            this.contactAddHandler,
        );
        var _loc9_ = new b2BodyDef();
        var _loc10_: b2Body = _loc4_.CreateBody(_loc9_);
        var _loc11_: number = this.chairBody.GetAngle();
        _loc6_.SetAsOrientedBox(
            5 / this.character_scale,
            35 / this.character_scale,
            this.chairBody.GetWorldPoint(
                new b2Vec2(
                    _loc7_.x - 30 / this.character_scale,
                    _loc7_.y - 55 / this.character_scale,
                ),
            ),
            _loc11_,
        );
        _loc10_.CreateShape(_loc6_);
        _loc10_.SetMassFromShapes();
        _loc10_.SetUserData(this.handleMC);
        this.handleMC.visible = true;
        // @ts-expect-error
        this.handleMC.inner.rotation = _loc11_ * CharacterB2D.oneEightyOverPI;
        this.paintVector.push(_loc10_);
        var _loc12_: b2Vec2 = this.chairBody.GetLinearVelocity();
        var _loc13_: number = this.chairBody.GetAngularVelocity();
        _loc10_.SetAngularVelocity(_loc13_);
        _loc10_.SetLinearVelocity(_loc12_);
        _loc9_.position = this.chairBody.GetWorldPoint(
            new b2Vec2(
                _loc7_.x + 8 / this.character_scale,
                _loc7_.y + 14 / this.character_scale,
            ),
        );
        _loc9_.angle = _loc11_;
        this.fueltankBody = _loc4_.CreateBody(_loc9_);
        _loc6_.SetAsBox(30 / this.character_scale, 9 / this.character_scale);
        this.fueltankShape = this.fueltankBody.CreateShape(_loc6_);
        _loc3_.registerListener(
            ContactListener.RESULT,
            this.fueltankShape,
            this.contactResultHandler,
        );
        _loc3_.registerListener(
            ContactListener.ADD,
            this.fueltankShape,
            this.contactAddHandler,
        );
        this.contactAddSounds.set(this.fueltankShape, "ChairHit1");
        this.fueltankBody.SetMassFromShapes();
        this.fueltankBody.SetUserData(this.fueltankMC);
        this.fueltankMC.visible = true;
        this.paintVector.push(this.fueltankBody);
        this.fueltankBody.SetAngularVelocity(_loc13_);
        this.fueltankBody.SetLinearVelocity(_loc12_);
        this.contactImpulseDict.set(
            this.fueltankShape,
            this.fueltankSmashLimit,
        );
        _loc9_ = new b2BodyDef();
        this.jetBody = _loc4_.CreateBody(_loc9_);
        _loc11_ = this.chairBody.GetAngle() + this.jetAngle;
        _loc6_.SetAsOrientedBox(
            21 / this.character_scale,
            16.5 / this.character_scale,
            this.bigWheelBody.GetWorldCenter(),
            _loc11_,
        );
        this.jetShape = this.jetBody.CreateShape(_loc6_);
        _loc3_.registerListener(
            ContactListener.RESULT,
            this.jetShape,
            this.contactResultHandler,
        );
        _loc3_.registerListener(
            ContactListener.ADD,
            this.jetShape,
            this.contactAddHandler,
        );
        this.contactAddSounds.set(this.jetShape, "ChairHit2");
        this.jetBody.SetMassFromShapes();
        this.jetBody.SetUserData(this.jetMC);
        // @ts-expect-error
        this.jetMC.inner.rotation = _loc11_ * CharacterB2D.oneEightyOverPI;
        this.paintVector.push(this.jetBody);
        this.jetBody.SetAngularVelocity(_loc13_);
        this.jetBody.SetLinearVelocity(_loc12_);
        this.contactImpulseDict.set(this.jetShape, this.jetSmashLimit);
        SoundController.instance.playAreaSoundInstance(
            "MetalSmashMedium",
            this.chairBody,
        );
        if (this.firing) {
            this.firing = false;
            // @ts-expect-error
            this.jetMC.inner.turbine.stop();
            // @ts-expect-error
            this.jetMC.flames.visible = false;
            this.jetSound.fadeOut(0.2);
            this.jetSound = null;
        }
        this.eject();
    }

    public wheelSmash(param1: number, param2: b2Vec2) {
        trace("wheel impulse " + param1);
        trace("wheel angle " + Math.atan2(param2.y, param2.x));
        this.bigWheelMC.gotoAndStop(2);
        this.bigWheelMC["inner"].visible = true;
        this.contactImpulseDict.delete(this.bigWheelShape);
        this._session.contactListener.deleteListener(
            ContactListener.RESULT,
            this.bigWheelShape,
        );
        this._session.contactListener.deleteListener(
            ContactListener.ADD,
            this.bigWheelShape,
        );
        this._session.contactListener.deleteListener(
            ContactListener.REMOVE,
            this.bigWheelShape,
        );
        var _loc3_: b2Shape = this.bigWheelBody.GetShapeList();
        this.bigWheelBody.DestroyShape(_loc3_);
        var _loc4_ = new b2PolygonDef();
        _loc4_.density = 2;
        _loc4_.friction = 0.3;
        _loc4_.restitution = 0.1;
        if (this.ejected) {
            _loc4_.filter = this.zeroFilter;
        } else {
            _loc4_.filter.categoryBits = 1025;
        }
        var _loc5_: number = Math.atan2(param2.y, param2.x);
        var _loc6_: number = _loc5_ - this.bigWheelBody.GetAngle();
        this.bigWheelMC["inner"].rotation =
            _loc6_ * CharacterB2D.oneEightyOverPI;
        _loc4_.SetAsOrientedBox(
            15 / this.character_scale,
            50 / this.character_scale,
            new b2Vec2(0, 0),
            _loc6_,
        );
        this.bigWheelBody.CreateShape(_loc4_);
        this.wheelCurrentSpeed = 0;
    }

    public fueltankSmash(param1: number) {
        var _loc12_: b2Shape = null;
        var _loc13_: b2Body = null;
        var _loc14_: b2Vec2 = null;
        var _loc15_: b2Vec2 = null;
        var _loc16_: number = NaN;
        var _loc17_: number = NaN;
        var _loc18_: number = NaN;
        var _loc19_: number = NaN;
        var _loc20_: number = NaN;
        trace("fuel impulse " + param1);
        this.contactImpulseDict.delete(this.fueltankShape);
        this._session.contactListener.deleteListener(
            ContactListener.RESULT,
            this.fueltankShape,
        );
        this._session.contactListener.deleteListener(
            ContactListener.ADD,
            this.fueltankShape,
        );
        var _loc2_: MovieClip = new Explosion();
        _loc2_.x = this.fueltankMC.x;
        _loc2_.y = this.fueltankMC.y;
        _loc2_.scaleX = _loc2_.scaleY = 0.5;
        var _loc3_: Sprite = this.session.containerSprite;
        _loc3_.addChildAt(_loc2_, _loc3_.getChildIndex(this.lowerArm1MC));
        var _loc4_ = new Array();
        var _loc5_: number = 2;
        var _loc6_ = new b2AABB();
        var _loc7_: b2Vec2 = this.fueltankBody.GetWorldCenter();
        _loc6_.lowerBound.Set(_loc7_.x - _loc5_, _loc7_.y - _loc5_);
        _loc6_.upperBound.Set(_loc7_.x + _loc5_, _loc7_.y + _loc5_);
        var _loc8_: b2World = this.session.m_world;
        var _loc9_: number = _loc8_.Query(_loc6_, _loc4_, 30);
        trace("tot intersects " + _loc9_);
        var _loc10_ = 10;
        var _loc11_: number = 0;
        while (_loc11_ < _loc4_.length) {
            _loc12_ = _loc4_[_loc11_];
            _loc13_ = _loc12_.GetBody();
            if (!_loc13_.IsStatic()) {
                _loc14_ = _loc13_.GetWorldCenter();
                _loc15_ = new b2Vec2(
                    _loc14_.x - _loc7_.x,
                    _loc14_.y - _loc7_.y,
                );
                _loc16_ = _loc15_.Length();
                _loc16_ = Math.min(_loc5_, _loc16_);
                _loc17_ = 1 - _loc16_ / _loc5_;
                _loc18_ = Math.atan2(_loc15_.y, _loc15_.x);
                _loc19_ = Math.cos(_loc18_) * _loc17_ * _loc10_;
                _loc20_ = Math.sin(_loc18_) * _loc17_ * _loc10_;
                _loc13_.ApplyImpulse(new b2Vec2(_loc19_, _loc20_), _loc14_);
            }
            _loc11_++;
        }
        this.fueltankMC.visible = false;
        this.session.particleController.createPointBurst(
            "jetshards",
            _loc7_.x * this.m_physScale,
            _loc7_.y * this.m_physScale,
            5,
            50,
            50,
            _loc3_.getChildIndex(this.fueltankMC),
        );
        _loc8_.DestroyBody(this.fueltankBody);
        SoundController.instance.playAreaSoundInstance(
            "MineExplosion",
            this.fueltankBody,
        );
    }

    public jetSmash(param1: number) {
        trace("jet impulse " + param1);
        this.contactImpulseDict.delete(this.jetShape);
        this._session.contactListener.deleteListener(
            ContactListener.RESULT,
            this.jetShape,
        );
        this._session.contactListener.deleteListener(
            ContactListener.ADD,
            this.jetShape,
        );
        var _loc2_: b2Vec2 = this.jetBody.GetWorldCenter();
        this.jetMC.visible = false;
        this.session.particleController.createPointBurst(
            "jetshards",
            _loc2_.x * this.m_physScale,
            _loc2_.y * this.m_physScale,
            5,
            50,
            50,
            this.session.containerSprite.getChildIndex(this.jetMC),
        );
        this.session.m_world.DestroyBody(this.jetBody);
        SoundController.instance.playAreaSoundInstance(
            "MetalSmashLight",
            this.jetBody,
        );
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

    public override hipBreak1(param1: number, param2: boolean = true) {
        super.hipBreak1(param1, param2);
        if (this.chairLeg1) {
            this.session.m_world.DestroyJoint(this.chairLeg1);
            this.chairLeg1 = null;
        }
    }

    public override hipBreak2(param1: number, param2: boolean = true) {
        super.hipBreak2(param1, param2);
        if (this.chairLeg2) {
            this.session.m_world.DestroyJoint(this.chairLeg2);
            this.chairLeg2 = null;
        }
    }

    public seatPose() {
        this.setJoint(this.neckJoint, 0.5, 2);
        this.setJoint(this.hipJoint1, 0.5, 5);
        this.setJoint(this.hipJoint2, 0.5, 5);
        this.setJoint(this.kneeJoint1, 1, 10);
        this.setJoint(this.kneeJoint2, 1, 10);
        this.setJoint(this.shoulderJoint1, 3, 20);
        this.setJoint(this.shoulderJoint2, 3, 20);
        this.setJoint(this.elbowJoint1, 1.4, 15);
        this.setJoint(this.elbowJoint2, 1.4, 15);
    }

    public wheelPoseLeft() {
        this.setJoint(this.neckJoint, 0.5, 2);
        this.setJoint(this.hipJoint1, 3.5, 2);
        this.setJoint(this.hipJoint2, 1.5, 2);
        this.setJoint(this.kneeJoint1, 0, 10);
        this.setJoint(this.kneeJoint2, 0, 10);
        this.setJoint(this.shoulderJoint1, -0.5, 20);
        this.setJoint(this.shoulderJoint2, 1, 20);
        this.setJoint(this.elbowJoint1, 3, 15);
        this.setJoint(this.elbowJoint2, 3, 15);
    }

    public wheelPoseRight() {
        this.setJoint(this.neckJoint, 0.5, 2);
        this.setJoint(this.hipJoint1, 1.5, 2);
        this.setJoint(this.hipJoint2, 3.5, 2);
        this.setJoint(this.kneeJoint1, 0, 10);
        this.setJoint(this.kneeJoint2, 0, 10);
        this.setJoint(this.shoulderJoint1, 1, 20);
        this.setJoint(this.shoulderJoint2, -0.5, 20);
        this.setJoint(this.elbowJoint1, 3, 15);
        this.setJoint(this.elbowJoint2, 3, 15);
    }
}