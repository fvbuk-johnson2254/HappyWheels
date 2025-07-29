import b2CircleDef from "@/Box2D/Collision/Shapes/b2CircleDef";
import b2PolygonDef from "@/Box2D/Collision/Shapes/b2PolygonDef";
import b2Shape from "@/Box2D/Collision/Shapes/b2Shape";
import b2ContactPoint from "@/Box2D/Collision/b2ContactPoint";
import b2Math from "@/Box2D/Common/Math/b2Math";
import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import b2DistanceJointDef from "@/Box2D/Dynamics/Joints/b2DistanceJointDef";
import b2GearJoint from "@/Box2D/Dynamics/Joints/b2GearJoint";
import b2GearJointDef from "@/Box2D/Dynamics/Joints/b2GearJointDef";
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
export default class BicycleGuy extends CharacterB2D {
    public ejected: boolean;
    private wheelMaxSpeed: number = 20;
    private wheelCurrentSpeed: number;
    private wheelNewSpeed: number;
    private wheelContacts: number = 0;
    private backContacts: number = 0;
    private frontContacts: number = 0;
    private accelStep: number = 1;
    private maxTorque: number = 20;
    private impulseMagnitude: number = 3;
    private impulseOffset: number = 1;
    private maxSpinAV: number = 5;
    private wheelLoop1: AreaSoundLoop;
    private wheelLoop2: AreaSoundLoop;
    private wheelLoop3: AreaSoundLoop;
    public frameSmashLimit: number = 200;
    public wheelSmashLimit: number = 200;
    public frameBody: b2Body;
    public backWheelBody: b2Body;
    public frontWheelBody: b2Body;
    public gearBody: b2Body;
    public backWheelShape: b2Shape;
    public frontWheelShape: b2Shape;
    public frameShape1: b2Shape;
    public frameShape2: b2Shape;
    public frameShape3: b2Shape;
    public frameMC: MovieClip;
    public backWheelMC: MovieClip;
    public frontWheelMC: MovieClip;
    public gearMC: MovieClip;
    public forkMC: MovieClip;
    public brokenFrameMC: MovieClip;
    public seatMC: MovieClip;
    public backWheelJoint: b2RevoluteJoint;
    public frontWheelJoint: b2RevoluteJoint;
    public framePelvis: b2RevoluteJoint;
    public frameHand1: b2RevoluteJoint;
    public frameHand2: b2RevoluteJoint;
    public gearFoot1: b2RevoluteJoint;
    public gearFoot2: b2RevoluteJoint;
    public frameGear: b2RevoluteJoint;
    public gearJoint: b2GearJoint;

    constructor(
        param1: number,
        param2: number,
        param3: DisplayObject,
        param4: Session,
        param5: number = -1,
        param6: string = "Char3",
    ) {
        super(param1, param2, param3, param4, param5, param6);
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
            this.frameBody.ApplyImpulse(
                new b2Vec2(_loc5_, -_loc4_),
                this.frameBody.GetWorldPoint(
                    new b2Vec2(_loc6_.x + this.impulseOffset, _loc6_.y),
                ),
            );
            this.leanBackPose();
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
            _loc1_ = this.frameBody.GetAngle();
            _loc2_ = this.frameBody.GetAngularVelocity();
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
            _loc7_ = this.frameBody.GetLocalCenter();
            this.frameBody.ApplyImpulse(
                new b2Vec2(_loc6_, -_loc5_),
                this.frameBody.GetWorldPoint(
                    new b2Vec2(_loc7_.x - this.impulseOffset, _loc7_.y),
                ),
            );
            this.leanForwardPose();
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
            this.frontWheelJoint.SetMotorSpeed(this.wheelNewSpeed);
        }
    }

    public override downPressedActions() {
        if (this.ejected) {
            this.currentPose = 4;
        } else {
            if (!this.backWheelJoint.IsMotorEnabled()) {
                this.backWheelJoint.EnableMotor(true);
                this.frontWheelJoint.EnableMotor(true);
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
            this.frontWheelJoint.SetMotorSpeed(this.wheelNewSpeed);
        }
    }

    public override upAndDownActions() {
        if (this.backWheelJoint.IsMotorEnabled()) {
            this.backWheelJoint.EnableMotor(false);
            this.frontWheelJoint.EnableMotor(false);
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
        } else {
            if (!this.backWheelJoint.IsMotorEnabled()) {
                this.backWheelJoint.EnableMotor(true);
                this.frontWheelJoint.EnableMotor(true);
            }
            this.backWheelJoint.SetMotorSpeed(0);
            this.frontWheelJoint.SetMotorSpeed(0);
        }
    }

    public override spaceNullActions() {
        if (this.ejected) {
            this.releaseGrip();
        }
    }

    public override zPressedActions() {
        this.eject();
    }

    public override actions() {
        var _loc1_: number = NaN;
        if (this.wheelContacts > 0) {
            _loc1_ = Math.abs(this.backWheelBody.GetAngularVelocity());
            if (_loc1_ > 18) {
                if (!this.wheelLoop3) {
                    this.wheelLoop3 =
                        SoundController.instance.playAreaSoundLoop(
                            "BikeLoop3",
                            this.backWheelBody,
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
                            this.backWheelBody,
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
                            this.backWheelBody,
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
            case 6:
            case 7:
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
        this.wheelContacts = 0;
        this.frontContacts = 0;
        this.backContacts = 0;
    }

    public override paint() {
        super.paint();
        var _loc1_: b2Vec2 = this.frontWheelBody.GetWorldCenter();
        this.frontWheelMC.x = _loc1_.x * this.m_physScale;
        this.frontWheelMC.y = _loc1_.y * this.m_physScale;
        // @ts-expect-error
        this.frontWheelMC.inner.rotation =
            (this.frontWheelBody.GetAngle() * CharacterB2D.oneEightyOverPI) %
            360;
        _loc1_ = this.backWheelBody.GetWorldCenter();
        this.backWheelMC.x = _loc1_.x * this.m_physScale;
        this.backWheelMC.y = _loc1_.y * this.m_physScale;
        // @ts-expect-error
        this.backWheelMC.inner.rotation =
            (this.backWheelBody.GetAngle() * CharacterB2D.oneEightyOverPI) %
            360;
    }

    public override createDictionaries() {
        super.createDictionaries();
        this.contactImpulseDict.set(this.frameShape1, this.frameSmashLimit);
        this.contactImpulseDict.set(this.frontWheelShape, this.wheelSmashLimit);
        this.contactImpulseDict.set(this.backWheelShape, this.wheelSmashLimit);
        this.contactAddSounds.set(this.backWheelShape, "TireHit1");
        this.contactAddSounds.set(this.frontWheelShape, "TireHit2");
        this.contactAddSounds.set(this.frameShape1, "BikeHit3");
        this.contactAddSounds.set(this.frameShape2, "BikeHit2");
        this.contactAddSounds.set(this.frameShape3, "BikeHit1");
    }

    public override createBodies() {
        var _loc10_: MovieClip = null;
        super.createBodies();
        var _loc1_ = new b2BodyDef();
        var _loc2_ = new b2BodyDef();
        var _loc3_ = new b2BodyDef();
        var _loc4_ = new b2BodyDef();
        var _loc5_ = new b2PolygonDef();
        var _loc6_ = new b2CircleDef();
        _loc5_.density = 2;
        _loc5_.friction = 0.3;
        _loc5_.restitution = 0.1;
        _loc5_.filter.categoryBits = 513;
        _loc6_.density = 5;
        _loc6_.friction = 1;
        _loc6_.restitution = 0.3;
        _loc6_.filter.categoryBits = 513;
        this.frameBody = this._session.m_world.CreateBody(_loc1_);
        _loc5_.vertexCount = 3;
        var _loc7_: number = 0;
        while (_loc7_ < 3) {
            _loc10_ = this.shapeGuide["seatVert" + [_loc7_ + 1]];
            _loc5_.vertices[_loc7_] = new b2Vec2(
                this._startX + _loc10_.x / this.character_scale,
                this._startY + _loc10_.y / this.character_scale,
            );
            _loc7_++;
        }
        this.frameShape1 = this.frameBody.CreateShape(_loc5_);
        this._session.contactListener.registerListener(
            ContactListener.RESULT,
            this.frameShape1,
            this.contactFrameResultHandler,
        );
        this._session.contactListener.registerListener(
            ContactListener.ADD,
            this.frameShape1,
            this.contactAddHandler,
        );
        _loc5_.filter = this.zeroFilter;
        _loc5_.vertexCount = 4;
        _loc7_ = 0;
        while (_loc7_ < 4) {
            _loc10_ = this.shapeGuide["frameVert" + [_loc7_ + 1]];
            _loc5_.vertices[_loc7_] = new b2Vec2(
                this._startX + _loc10_.x / this.character_scale,
                this._startY + _loc10_.y / this.character_scale,
            );
            _loc7_++;
        }
        this.frameShape2 = this.frameBody.CreateShape(_loc5_);
        this._session.contactListener.registerListener(
            ContactListener.RESULT,
            this.frameShape2,
            this.contactFrameResultHandler,
        );
        this._session.contactListener.registerListener(
            ContactListener.ADD,
            this.frameShape2,
            this.contactAddHandler,
        );
        _loc5_.vertexCount = 3;
        _loc7_ = 0;
        while (_loc7_ < 3) {
            _loc10_ = this.shapeGuide["forkVert" + [_loc7_ + 1]];
            _loc5_.vertices[_loc7_] = new b2Vec2(
                this._startX + _loc10_.x / this.character_scale,
                this._startY + _loc10_.y / this.character_scale,
            );
            _loc7_++;
        }
        this.frameShape3 = this.frameBody.CreateShape(_loc5_);
        this._session.contactListener.registerListener(
            ContactListener.RESULT,
            this.frameShape3,
            this.contactFrameResultHandler,
        );
        this._session.contactListener.registerListener(
            ContactListener.ADD,
            this.frameShape3,
            this.contactAddHandler,
        );
        this.frameBody.SetMassFromShapes();
        this.paintVector.push(this.frameBody);
        var _loc8_: Sprite = this.shapeGuide["backWheelShape"];
        _loc2_.position.Set(
            this._startX + _loc8_.x / this.character_scale,
            this._startY + _loc8_.y / this.character_scale,
        );
        _loc2_.angle = _loc8_.rotation / CharacterB2D.oneEightyOverPI;
        _loc6_.radius = _loc8_.width / 2 / this.character_scale;
        this.backWheelBody = this._session.m_world.CreateBody(_loc2_);
        this.backWheelShape = this.backWheelBody.CreateShape(_loc6_);
        this.backWheelBody.SetMassFromShapes();
        this._session.contactListener.registerListener(
            ContactListener.RESULT,
            this.backWheelShape,
            this.contactResultHandler,
        );
        this._session.contactListener.registerListener(
            ContactListener.ADD,
            this.backWheelShape,
            this.wheelContactAdd,
        );
        this._session.contactListener.registerListener(
            ContactListener.REMOVE,
            this.backWheelShape,
            this.wheelContactRemove,
        );
        _loc8_ = this.shapeGuide["frontWheelShape"];
        _loc3_.position.Set(
            this._startX + _loc8_.x / this.character_scale,
            this._startY + _loc8_.y / this.character_scale,
        );
        _loc3_.angle = _loc8_.rotation / CharacterB2D.oneEightyOverPI;
        _loc6_.radius = _loc8_.width / 2 / this.character_scale;
        this.frontWheelBody = this._session.m_world.CreateBody(_loc3_);
        this.frontWheelShape = this.frontWheelBody.CreateShape(_loc6_);
        this.frontWheelBody.SetMassFromShapes();
        this._session.contactListener.registerListener(
            ContactListener.RESULT,
            this.frontWheelShape,
            this.contactResultHandler,
        );
        this._session.contactListener.registerListener(
            ContactListener.ADD,
            this.frontWheelShape,
            this.wheelContactAdd,
        );
        this._session.contactListener.registerListener(
            ContactListener.REMOVE,
            this.frontWheelShape,
            this.wheelContactRemove,
        );
        _loc8_ = this.shapeGuide["gearShape"];
        _loc4_.position.Set(
            this._startX + _loc8_.x / this.character_scale,
            this._startY + _loc8_.y / this.character_scale,
        );
        _loc4_.angle = _loc8_.rotation / CharacterB2D.oneEightyOverPI;
        _loc6_.radius = _loc8_.width / 2 / this.character_scale;
        this.gearBody = this._session.m_world.CreateBody(_loc4_);
        this.gearBody.CreateShape(_loc6_);
        this.gearBody.SetMassFromShapes();
        this.paintVector.push(this.gearBody);
        var _loc9_: b2Shape = this.upperLeg1Body.GetShapeList();
        _loc9_.m_isSensor = true;
        _loc9_ = this.upperLeg2Body.GetShapeList();
        _loc9_.m_isSensor = true;
        _loc9_ = this.lowerLeg1Body.GetShapeList();
        _loc9_.m_isSensor = true;
        _loc9_ = this.lowerLeg2Body.GetShapeList();
        _loc9_.m_isSensor = true;
    }

    public override createMovieClips() {
        super.createMovieClips();
        this.frameMC = this.sourceObject["frame"];
        var _loc1_ = 1 / this.mc_scale;
        this.frameMC.scaleY = 1 / this.mc_scale;
        this.frameMC.scaleX = _loc1_;
        this.backWheelMC = this.sourceObject["backWheel"];
        _loc1_ = 1 / this.mc_scale;
        this.backWheelMC.scaleY = 1 / this.mc_scale;
        this.backWheelMC.scaleX = _loc1_;
        this.frontWheelMC = this.sourceObject["frontWheel"];
        _loc1_ = 1 / this.mc_scale;
        this.frontWheelMC.scaleY = 1 / this.mc_scale;
        this.frontWheelMC.scaleX = _loc1_;
        this.gearMC = this.sourceObject["gear"];
        _loc1_ = 1 / this.mc_scale;
        this.gearMC.scaleY = 1 / this.mc_scale;
        this.gearMC.scaleX = _loc1_;
        this.forkMC = this.sourceObject["fork"];
        _loc1_ = 1 / this.mc_scale;
        this.forkMC.scaleY = 1 / this.mc_scale;
        this.forkMC.scaleX = _loc1_;
        this.brokenFrameMC = this.sourceObject["brokenFrame"];
        _loc1_ = 1 / this.mc_scale;
        this.brokenFrameMC.scaleY = 1 / this.mc_scale;
        this.brokenFrameMC.scaleX = _loc1_;
        this.seatMC = this.sourceObject["seat"];
        _loc1_ = 1 / this.mc_scale;
        this.seatMC.scaleY = 1 / this.mc_scale;
        this.seatMC.scaleX = _loc1_;
        this.frontWheelMC.gotoAndStop(1);
        this.backWheelMC.gotoAndStop(1);
        // @ts-expect-error
        this.frontWheelMC.inner.broken.visible = false;
        // @ts-expect-error
        this.backWheelMC.inner.broken.visible = false;
        this.forkMC.visible = false;
        this.brokenFrameMC.visible = false;
        this.seatMC.visible = false;
        this.frameBody.SetUserData(this.frameMC);
        this.backWheelBody.SetUserData(this.backWheelMC);
        this.frontWheelBody.SetUserData(this.frontWheelMC);
        this.gearBody.SetUserData(this.gearMC);
        this._session.containerSprite.addChildAt(
            this.backWheelMC,
            this._session.containerSprite.getChildIndex(this.chestMC),
        );
        this._session.containerSprite.addChildAt(
            this.frontWheelMC,
            this._session.containerSprite.getChildIndex(this.chestMC),
        );
        this._session.containerSprite.addChildAt(
            this.gearMC,
            this._session.containerSprite.getChildIndex(this.chestMC),
        );
        this._session.containerSprite.addChildAt(
            this.frameMC,
            this._session.containerSprite.getChildIndex(this.chestMC),
        );
        this._session.containerSprite.addChildAt(
            this.brokenFrameMC,
            this._session.containerSprite.getChildIndex(this.chestMC),
        );
        this._session.containerSprite.addChildAt(
            this.seatMC,
            this._session.containerSprite.getChildIndex(this.chestMC),
        );
        this._session.containerSprite.addChildAt(
            this.forkMC,
            this._session.containerSprite.getChildIndex(this.chestMC),
        );
    }

    public override resetMovieClips() {
        super.resetMovieClips();
        this.frontWheelMC.gotoAndStop(1);
        this.backWheelMC.gotoAndStop(1);
        this.frameMC.visible = true;
        // @ts-expect-error
        this.frontWheelMC.inner.broken.visible = false;
        // @ts-expect-error
        this.backWheelMC.inner.broken.visible = false;
        // @ts-expect-error
        this.frontWheelMC.inner.spokes.visible = true;
        // @ts-expect-error
        this.backWheelMC.inner.spokes.visible = true;
        this.forkMC.visible = false;
        this.brokenFrameMC.visible = false;
        this.seatMC.visible = false;
        this.frameBody.SetUserData(this.frameMC);
        this.backWheelBody.SetUserData(this.backWheelMC);
        this.frontWheelBody.SetUserData(this.frontWheelMC);
        this.gearBody.SetUserData(this.gearMC);
    }

    public override createJoints() {
        var _loc1_: number = NaN;
        var _loc2_: number = NaN;
        var _loc3_: number = NaN;
        super.createJoints();
        var _loc4_: number = CharacterB2D.oneEightyOverPI;
        _loc1_ = this.upperLeg1Body.GetAngle() - this.pelvisBody.GetAngle();
        _loc2_ = -110 / _loc4_ - _loc1_;
        _loc3_ = 10 / _loc4_ - _loc1_;
        this.hipJoint1.SetLimits(_loc2_, _loc3_);
        _loc1_ = this.upperLeg2Body.GetAngle() - this.pelvisBody.GetAngle();
        _loc2_ = -110 / _loc4_ - _loc1_;
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
        _loc2_ = -20 / _loc4_ - _loc1_;
        _loc3_ = 0 / _loc4_ - _loc1_;
        this.neckJoint.SetLimits(_loc2_, _loc3_);
        var _loc5_ = new b2RevoluteJointDef();
        _loc5_.maxMotorTorque = this.maxTorque;
        var _loc6_ = new b2Vec2();
        var _loc7_: MovieClip = this.shapeGuide["backWheelShape"];
        _loc6_.Set(
            this._startX + _loc7_.x / this.character_scale,
            this._startY + _loc7_.y / this.character_scale,
        );
        _loc5_.Initialize(this.frameBody, this.backWheelBody, _loc6_);
        this.backWheelJoint = this._session.m_world.CreateJoint(
            _loc5_,
        ) as b2RevoluteJoint;
        _loc7_ = this.shapeGuide["frontWheelShape"];
        _loc6_.Set(
            this._startX + _loc7_.x / this.character_scale,
            this._startY + _loc7_.y / this.character_scale,
        );
        _loc5_.Initialize(this.frameBody, this.frontWheelBody, _loc6_);
        this.frontWheelJoint = this._session.m_world.CreateJoint(
            _loc5_,
        ) as b2RevoluteJoint;
        var _loc8_ = new b2DistanceJointDef();
        _loc8_.Initialize(
            this.frameBody,
            this.pelvisBody,
            this.pelvisBody.GetPosition(),
            this.pelvisBody.GetPosition(),
        );
        _loc6_.Set(
            this.pelvisBody.GetPosition().x,
            this.pelvisBody.GetPosition().y,
        );
        _loc5_.Initialize(this.frameBody, this.pelvisBody, _loc6_);
        this.framePelvis = this._session.m_world.CreateJoint(
            _loc5_,
        ) as b2RevoluteJoint;
        _loc7_ = this.shapeGuide["handleAnchor"];
        _loc6_.Set(
            this._startX + _loc7_.x / this.character_scale,
            this._startY + _loc7_.y / this.character_scale,
        );
        _loc5_.Initialize(this.frameBody, this.lowerArm1Body, _loc6_);
        this.frameHand1 = this._session.m_world.CreateJoint(
            _loc5_,
        ) as b2RevoluteJoint;
        _loc5_.Initialize(this.frameBody, this.lowerArm2Body, _loc6_);
        this.frameHand2 = this._session.m_world.CreateJoint(
            _loc5_,
        ) as b2RevoluteJoint;
        _loc7_ = this.shapeGuide["gearShape"];
        _loc6_.Set(
            this._startX + _loc7_.x / this.character_scale,
            this._startY + _loc7_.y / this.character_scale,
        );
        _loc5_.Initialize(this.frameBody, this.gearBody, _loc6_);
        this.frameGear = this._session.m_world.CreateJoint(
            _loc5_,
        ) as b2RevoluteJoint;
        var _loc9_ = new b2GearJointDef();
        _loc9_.body1 = this.backWheelBody;
        _loc9_.body2 = this.gearBody;
        _loc9_.joint1 = this.backWheelJoint;
        _loc9_.joint2 = this.frameGear;
        this.gearJoint = this._session.m_world.CreateJoint(
            _loc9_,
        ) as b2GearJoint;
        this.gearJoint.m_ratio *= -1;
        _loc7_ = this.shapeGuide["gearAnchor1"];
        _loc6_.Set(
            this._startX + _loc7_.x / this.character_scale,
            this._startY + _loc7_.y / this.character_scale,
        );
        _loc5_.Initialize(this.gearBody, this.lowerLeg1Body, _loc6_);
        this.gearFoot1 = this._session.m_world.CreateJoint(
            _loc5_,
        ) as b2RevoluteJoint;
        _loc7_ = this.shapeGuide["gearAnchor2"];
        _loc6_.Set(
            this._startX + _loc7_.x / this.character_scale,
            this._startY + _loc7_.y / this.character_scale,
        );
        _loc5_.Initialize(this.gearBody, this.lowerLeg2Body, _loc6_);
        this.gearFoot2 = this._session.m_world.CreateJoint(
            _loc5_,
        ) as b2RevoluteJoint;
    }

    protected contactFrameResultHandler(param1: ContactEvent) {
        var _loc2_: number = param1.impulse;
        if (_loc2_ > this.contactImpulseDict.get(this.frameShape1)) {
            if (this.contactResultBuffer.get(this.frameShape1)) {
                if (
                    _loc2_ >
                    this.contactResultBuffer.get(this.frameShape1).impulse
                ) {
                    this.contactResultBuffer.set(this.frameShape1, param1);
                }
            } else {
                this.contactResultBuffer.set(this.frameShape1, param1);
            }
        }
    }

    protected override handleContactResults() {
        var _loc1_: ContactEvent = null;
        super.handleContactResults();
        if (this.contactResultBuffer.get(this.frameShape1)) {
            _loc1_ = this.contactResultBuffer.get(this.frameShape1);
            this.frameSmash(_loc1_.impulse, _loc1_.normal);
            this.contactResultBuffer.delete(this.frameShape1);
            this.contactAddBuffer.delete(this.frameShape1);
            this.contactAddBuffer.delete(this.frameShape2);
            this.contactAddBuffer.delete(this.frameShape3);
        }
        if (this.contactResultBuffer.get(this.frontWheelShape)) {
            _loc1_ = this.contactResultBuffer.get(this.frontWheelShape);
            this.frontWheelSmash(_loc1_.impulse, _loc1_.normal);
            this.contactResultBuffer.delete(this.frontWheelShape);
            this.contactAddBuffer.delete(this.frontWheelShape);
        }
        if (this.contactResultBuffer.get(this.backWheelShape)) {
            _loc1_ = this.contactResultBuffer.get(this.backWheelShape);
            this.backWheelSmash(_loc1_.impulse, _loc1_.normal);
            this.contactResultBuffer.delete(this.backWheelShape);
            this.contactAddBuffer.delete(this.backWheelShape);
        }
    }

    protected wheelContactAdd(param1: b2ContactPoint) {
        if (param1.shape2.m_isSensor) {
            return;
        }
        if (param1.shape1 == this.frontWheelShape) {
            this.frontContacts += 1;
        } else {
            this.backContacts += 1;
        }
        this.wheelContacts = this.frontContacts + this.backContacts;
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
            this.contactAddBuffer.set(_loc2_, "hit");
        }
    }

    protected wheelContactRemove(param1: b2ContactPoint) {
        if (param1.shape2.m_isSensor) {
            return;
        }
        if (param1.shape1 == this.frontWheelShape) {
            --this.frontContacts;
        } else {
            --this.backContacts;
        }
        this.wheelContacts = this.frontContacts + this.backContacts;
    }

    public override eject() {
        if (this.ejected) {
            return;
        }
        this.ejected = true;
        this.resetJointLimits();
        var _loc1_: b2World = this.session.m_world;
        if (this.framePelvis) {
            _loc1_.DestroyJoint(this.framePelvis);
            this.framePelvis = null;
        }
        if (this.frameHand1) {
            _loc1_.DestroyJoint(this.frameHand1);
            this.frameHand1 = null;
        }
        if (this.frameHand2) {
            _loc1_.DestroyJoint(this.frameHand2);
            this.frameHand2 = null;
        }
        if (this.gearFoot1) {
            _loc1_.DestroyJoint(this.gearFoot1);
            this.gearFoot1 = null;
        }
        if (this.gearFoot2) {
            _loc1_.DestroyJoint(this.gearFoot2);
            this.gearFoot2 = null;
        }
        this.frontWheelBody.GetShapeList().SetFilterData(this.zeroFilter);
        this.backWheelBody.GetShapeList().SetFilterData(this.zeroFilter);
        _loc1_.Refilter(this.frontWheelBody.GetShapeList());
        _loc1_.Refilter(this.backWheelBody.GetShapeList());
        var _loc2_: b2Shape = this.frameBody.GetShapeList();
        while (_loc2_) {
            _loc2_.SetFilterData(this.zeroFilter);
            _loc1_.Refilter(_loc2_);
            _loc2_ = _loc2_.m_next;
        }
        _loc2_ = this.upperLeg1Body.GetShapeList();
        _loc2_.m_isSensor = false;
        _loc1_.Refilter(_loc2_);
        _loc2_ = this.upperLeg2Body.GetShapeList();
        _loc2_.m_isSensor = false;
        _loc1_.Refilter(_loc2_);
        _loc2_ = this.lowerLeg1Body.GetShapeList();
        _loc2_.m_isSensor = false;
        _loc1_.Refilter(_loc2_);
        _loc2_ = this.lowerLeg2Body.GetShapeList();
        _loc2_.m_isSensor = false;
        _loc1_.Refilter(_loc2_);
    }

    public override set dead(param1: boolean) {
        this._dead = param1;
        if (this._dead) {
            this.userVehicleEject();
            this.currentPose = 0;
            this.releaseGrip();
            this.backWheelJoint.EnableMotor(false);
            this.frontWheelJoint.EnableMotor(false);
            if (this.voiceSound) {
                this.voiceSound.stopSound();
                this.voiceSound = null;
            }
        }
    }

    public frameSmash(param1: number, param2: b2Vec2) {
        var _loc11_: Sprite = null;
        trace("frame impulse " + param1);
        this.contactImpulseDict.delete(this.frameShape1);
        var _loc3_: ContactListener = this._session.contactListener;
        _loc3_.deleteListener(ContactListener.RESULT, this.frameShape1);
        _loc3_.deleteListener(ContactListener.RESULT, this.frameShape2);
        _loc3_.deleteListener(ContactListener.RESULT, this.frameShape3);
        _loc3_.deleteListener(ContactListener.ADD, this.frameShape1);
        _loc3_.deleteListener(ContactListener.ADD, this.frameShape2);
        _loc3_.deleteListener(ContactListener.ADD, this.frameShape3);
        _loc3_.deleteListener(ContactListener.ADD, this.frontWheelShape);
        _loc3_.deleteListener(ContactListener.REMOVE, this.frontWheelShape);
        _loc3_.deleteListener(ContactListener.ADD, this.backWheelShape);
        _loc3_.deleteListener(ContactListener.REMOVE, this.backWheelShape);
        this.eject();
        this.frameMC.gotoAndStop(2);
        this.forkMC.visible = true;
        this.brokenFrameMC.visible = true;
        this.seatMC.visible = true;
        this.frameMC.visible = false;
        this._session.m_world.DestroyJoint(this.frontWheelJoint);
        this._session.m_world.DestroyJoint(this.backWheelJoint);
        if (this._session.version > 1.69) {
            this._session.m_world.DestroyJoint(this.gearJoint);
        }
        var _loc4_ = new b2BodyDef();
        var _loc5_ = new b2BodyDef();
        var _loc6_ = new b2BodyDef();
        var _loc7_ = new b2PolygonDef();
        _loc7_.density = 2;
        _loc7_.friction = 0.3;
        _loc7_.restitution = 0.1;
        _loc7_.filter = this.zeroFilter;
        _loc4_.position =
            _loc5_.position =
            _loc6_.position =
            this.frameBody.GetPosition();
        _loc4_.angle = _loc5_.angle = _loc6_.angle = this.frameBody.GetAngle();
        var _loc8_: b2Body = this._session.m_world.CreateBody(_loc4_);
        var _loc9_: b2Body = this._session.m_world.CreateBody(_loc5_);
        var _loc10_: b2Body = this._session.m_world.CreateBody(_loc6_);
        _loc7_.vertexCount = 3;
        var _loc12_: number = 0;
        while (_loc12_ < 3) {
            _loc11_ = this.shapeGuide["forkVert" + [_loc12_ + 1]];
            _loc7_.vertices[_loc12_] = new b2Vec2(
                this._startX + _loc11_.x / this.character_scale,
                this._startY + _loc11_.y / this.character_scale,
            );
            _loc12_++;
        }
        var _loc13_: b2Shape = _loc8_.CreateShape(_loc7_);
        _loc8_.SetMassFromShapes();
        _loc8_.SetLinearVelocity(this.frameBody.GetLinearVelocity());
        _loc8_.SetAngularVelocity(this.frameBody.GetAngularVelocity());
        _loc8_.m_userData = this.forkMC;
        this.paintVector.push(_loc8_);
        _loc7_.vertexCount = 4;
        _loc12_ = 0;
        while (_loc12_ < 4) {
            _loc11_ = this.shapeGuide["brokenVert" + [_loc12_ + 1]];
            _loc7_.vertices[_loc12_] = new b2Vec2(
                this._startX + _loc11_.x / this.character_scale,
                this._startY + _loc11_.y / this.character_scale,
            );
            _loc12_++;
        }
        var _loc14_: b2Shape = _loc9_.CreateShape(_loc7_);
        _loc9_.SetMassFromShapes();
        _loc9_.SetLinearVelocity(this.frameBody.GetLinearVelocity());
        _loc9_.SetAngularVelocity(this.frameBody.GetAngularVelocity());
        _loc9_.m_userData = this.brokenFrameMC;
        this.paintVector.push(_loc9_);
        _loc7_.vertexCount = 3;
        _loc12_ = 0;
        while (_loc12_ < 3) {
            _loc11_ = this.shapeGuide["seatVert" + [_loc12_ + 1]];
            _loc7_.vertices[_loc12_] = new b2Vec2(
                this._startX + _loc11_.x / this.character_scale,
                this._startY + _loc11_.y / this.character_scale,
            );
            _loc12_++;
        }
        var _loc15_: b2Shape = _loc10_.CreateShape(_loc7_);
        _loc10_.SetMassFromShapes();
        _loc10_.SetLinearVelocity(this.frameBody.GetLinearVelocity());
        _loc10_.SetAngularVelocity(this.frameBody.GetAngularVelocity());
        _loc10_.m_userData = this.seatMC;
        this.paintVector.push(_loc10_);
        this._session.m_world.DestroyBody(this.frameBody);
        this._session.contactListener.registerListener(
            ContactListener.ADD,
            _loc14_,
            this.contactAddHandler,
        );
        this.contactAddSounds.set(_loc14_, "BikeHit2");
        SoundController.instance.playAreaSoundInstance("BikeSmash1", _loc9_);
    }

    public frontWheelSmash(param1: number, param2: b2Vec2) {
        trace("front wheel impulse " + param1);
        trace("wheel angle " + Math.atan2(param2.y, param2.x));
        this.frontWheelMC.gotoAndStop(2);
        // @ts-expect-error
        this.frontWheelMC.inner.spokes.visible = false;
        // @ts-expect-error
        this.frontWheelMC.inner.broken.visible = true;
        this.contactImpulseDict.delete(this.frontWheelShape);
        this._session.contactListener.deleteListener(
            ContactListener.RESULT,
            this.frontWheelShape,
        );
        this._session.contactListener.deleteListener(
            ContactListener.ADD,
            this.frontWheelShape,
        );
        this._session.contactListener.deleteListener(
            ContactListener.REMOVE,
            this.frontWheelShape,
        );
        var _loc3_: b2Shape = this.frontWheelBody.GetShapeList();
        this.frontWheelBody.DestroyShape(_loc3_);
        var _loc4_ = new b2PolygonDef();
        _loc4_.density = 2;
        _loc4_.friction = 0.3;
        _loc4_.restitution = 0.1;
        if (this.ejected) {
            _loc4_.filter = this.zeroFilter;
        } else {
            _loc4_.filter.categoryBits = 513;
        }
        var _loc5_: number = Math.atan2(param2.y, param2.x);
        var _loc6_: number = _loc5_ - this.frontWheelBody.GetAngle();
        // @ts-expect-error
        this.frontWheelMC.inner.broken.rotation =
            _loc6_ * CharacterB2D.oneEightyOverPI;
        _loc4_.SetAsOrientedBox(
            25 / this.character_scale,
            50 / this.character_scale,
            new b2Vec2(0, 0),
            _loc6_,
        );
        this.frontWheelBody.CreateShape(_loc4_);
        SoundController.instance.playAreaSoundInstance(
            "BikeTireSmash1",
            this.frontWheelBody,
        );
    }

    public backWheelSmash(param1: number, param2: b2Vec2) {
        trace("back wheel impulse " + param1);
        trace("wheel angle " + Math.atan2(param2.y, param2.x));
        this.backWheelMC.gotoAndStop(2);
        // @ts-expect-error
        this.backWheelMC.inner.spokes.visible = false;
        // @ts-expect-error
        this.backWheelMC.inner.broken.visible = true;
        this.contactImpulseDict.delete(this.backWheelShape);
        this._session.contactListener.deleteListener(
            ContactListener.RESULT,
            this.backWheelShape,
        );
        this._session.contactListener.deleteListener(
            ContactListener.ADD,
            this.backWheelShape,
        );
        this._session.contactListener.deleteListener(
            ContactListener.REMOVE,
            this.backWheelShape,
        );
        var _loc3_: b2Shape = this.backWheelBody.GetShapeList();
        this.backWheelBody.DestroyShape(_loc3_);
        var _loc4_ = new b2PolygonDef();
        _loc4_.density = 2;
        _loc4_.friction = 0.3;
        _loc4_.restitution = 0.1;
        if (this.ejected) {
            _loc4_.filter = this.zeroFilter;
        } else {
            _loc4_.filter.categoryBits = 513;
        }
        var _loc5_: number = Math.atan2(param2.y, param2.x);
        var _loc6_: number = _loc5_ - this.backWheelBody.GetAngle();
        // @ts-expect-error
        this.backWheelMC.inner.broken.rotation =
            _loc6_ * CharacterB2D.oneEightyOverPI;
        _loc4_.SetAsOrientedBox(
            25 / this.character_scale,
            50 / this.character_scale,
            new b2Vec2(0, 0),
            _loc6_,
        );
        this.backWheelBody.CreateShape(_loc4_);
        SoundController.instance.playAreaSoundInstance(
            "BikeTireSmash1",
            this.backWheelBody,
        );
    }

    public checkEject() {
        if (
            !this.frameHand1 &&
            !this.frameHand2 &&
            !this.gearFoot1 &&
            !this.gearFoot2
        ) {
            this.eject();
        }
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
        }
        this.checkEject();
    }

    public override elbowBreak2(param1: number) {
        super.elbowBreak2(param1);
        if (this.ejected) {
            return;
        }
        if (this.frameHand2) {
            this._session.m_world.DestroyJoint(this.frameHand2);
            this.frameHand2 = null;
        }
        this.checkEject();
    }

    public override kneeBreak1(param1: number) {
        super.kneeBreak1(param1);
        if (this.ejected) {
            return;
        }
        if (this.gearFoot1) {
            this._session.m_world.DestroyJoint(this.gearFoot1);
            this.gearFoot1 = null;
        }
        this.checkEject();
    }

    public override kneeBreak2(param1: number) {
        super.kneeBreak2(param1);
        if (this.ejected) {
            return;
        }
        if (this.gearFoot2) {
            this._session.m_world.DestroyJoint(this.gearFoot2);
            this.gearFoot2 = null;
        }
        this.checkEject();
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
}