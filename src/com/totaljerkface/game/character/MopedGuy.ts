import b2CircleDef from "@/Box2D/Collision/Shapes/b2CircleDef";
import b2PolygonDef from "@/Box2D/Collision/Shapes/b2PolygonDef";
import b2PolygonShape from "@/Box2D/Collision/Shapes/b2PolygonShape";
import b2Shape from "@/Box2D/Collision/Shapes/b2Shape";
import b2ContactPoint from "@/Box2D/Collision/b2ContactPoint";
import b2Math from "@/Box2D/Common/Math/b2Math";
import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
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
import AreaSoundInstance from "@/com/totaljerkface/game/sound/AreaSoundInstance";
import AreaSoundLoop from "@/com/totaljerkface/game/sound/AreaSoundLoop";
import SoundController from "@/com/totaljerkface/game/sound/SoundController";
import { boundClass } from 'autobind-decorator';
import DisplayObject from "flash/display/DisplayObject";
import MovieClip from "flash/display/MovieClip";
import Sprite from "flash/display/Sprite";
import Event from "flash/events/Event";

@boundClass
export default class MopedGuy extends CharacterB2D {
    public ejected: boolean;
    private wheelMaxSpeed: number = 30;
    private wheelCurrentSpeed: number;
    private wheelNewSpeed: number;
    private wheelContacts: number = 0;
    private backContacts: number = 0;
    private frontContacts: number = 0;
    private accelStep: number = 0.5;
    private maxTorque: number = 30;
    private prevSpeed: number = 0;
    private currSpeed: number = 0;
    private impulseMagnitude: number = 0.75;
    private impulseOffset: number = 1;
    private maxSpinAV: number = 5;
    private boostVal: number = 0;
    private boostMax: number = 50;
    private boostStepUp: number = 2;
    private boostStepDown: number = 0.5;
    private boostMeter: Sprite;
    private boostHolder: Sprite;
    private boostImpulse: number = 4;
    private accelSound: AreaSoundInstance;
    private steadySound: AreaSoundLoop;
    private idleSound: AreaSoundLoop;
    private wheelLoop1: AreaSoundLoop;
    private wheelLoop2: AreaSoundLoop;
    private wheelLoop3: AreaSoundLoop;
    public frameSmashLimit: number = 200;
    public wheelSmashLimit: number = 200;
    protected frameSmashed: boolean;
    protected handleAnchorPoint: b2Vec2;
    protected pelvisAnchorPoint: b2Vec2;
    protected footAnchorPoint: b2Vec2;
    protected framePelvisJointDef: b2RevoluteJointDef;
    protected frameHand1JointDef: b2RevoluteJointDef;
    protected frameHand2JointDef: b2RevoluteJointDef;
    protected frameFoot1JointDef: b2RevoluteJointDef;
    protected frameFoot2JointDef: b2RevoluteJointDef;
    protected reAttachDistance: number = 0.25;
    public frameBody: b2Body;
    public backWheelBody: b2Body;
    public frontWheelBody: b2Body;
    public backWheelShape: b2Shape;
    public frontWheelShape: b2Shape;
    public forkShape: b2PolygonShape;
    public tankShape: b2PolygonShape;
    public engineShape: b2PolygonShape;
    public middleShape: b2PolygonShape;
    public rearShape: b2PolygonShape;
    public seatShape: b2PolygonShape;
    public frameMC: MovieClip;
    public backWheelMC: MovieClip;
    public frontWheelMC: MovieClip;
    public gearMC: MovieClip;
    public brokenForkMC: MovieClip;
    public brokenTankMC: MovieClip;
    public brokenEngineMC: MovieClip;
    public brokenMiddleMC: MovieClip;
    public brokenRearMC: MovieClip;
    public brokenSeatMC: MovieClip;
    public backWheelJoint: b2RevoluteJoint;
    public frontWheelJoint: b2RevoluteJoint;
    public framePelvis: b2RevoluteJoint;
    public frameHand1: b2RevoluteJoint;
    public frameHand2: b2RevoluteJoint;
    public frameFoot1: b2RevoluteJoint;
    public frameFoot2: b2RevoluteJoint;

    constructor(
        param1: number,
        param2: number,
        param3: DisplayObject,
        param4: Session,
    ) {
        super(param1, param2, param3, param4, -1, "Char8");
        this.impulseMagnitude = this._session.version > 1.2 ? 1 : 0.75;
    }

    public override leftPressedActions() {
        var _loc1_: number = NaN;
        var _loc2_: number = NaN;
        var _loc3_: number = NaN;
        var _loc4_: b2Vec2 = null;
        if (this.ejected) {
            this.currentPose = 1;
        } else {
            _loc1_ = this.frameBody.GetAngle();
            _loc2_ = Math.cos(_loc1_) * this.impulseMagnitude;
            _loc3_ = Math.sin(_loc1_) * this.impulseMagnitude;
            _loc4_ = this.frameBody.GetLocalCenter();
            this.frameBody.ApplyImpulse(
                new b2Vec2(_loc3_, -_loc2_),
                this.frameBody.GetWorldPoint(
                    new b2Vec2(_loc4_.x + this.impulseOffset, _loc4_.y),
                ),
            );
        }
    }

    public override rightPressedActions() {
        var _loc1_: number = NaN;
        var _loc2_: number = NaN;
        var _loc3_: number = NaN;
        var _loc4_: b2Vec2 = null;
        if (this.ejected) {
            this.currentPose = 2;
        } else {
            _loc1_ = this.frameBody.GetAngle();
            _loc2_ = Math.cos(_loc1_) * this.impulseMagnitude;
            _loc3_ = Math.sin(_loc1_) * this.impulseMagnitude;
            _loc4_ = this.frameBody.GetLocalCenter();
            this.frameBody.ApplyImpulse(
                new b2Vec2(_loc3_, -_loc2_),
                this.frameBody.GetWorldPoint(
                    new b2Vec2(_loc4_.x - this.impulseOffset, _loc4_.y),
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
            this.backWheelJoint.EnableMotor(true);
            this.frontWheelJoint.EnableMotor(false);
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
        }
    }

    private accelComplete(param1: Event) {
        if (this.accelSound) {
            this.accelSound = null;
        }
        if (!this.steadySound) {
            this.steadySound = SoundController.instance.playAreaSoundInstance(
                "MotoSteady",
                this.backWheelBody,
            );
        }
    }

    public override downPressedActions() {
        if (this.ejected) {
            this.currentPose = 4;
        } else {
            this.backWheelJoint.EnableMotor(true);
            this.frontWheelJoint.EnableMotor(false);
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
        }
    }

    public override upAndDownActions() {
        this.backWheelJoint.EnableMotor(false);
        this.frontWheelJoint.EnableMotor(false);
        if (this.ejected) {
            if (this._currentPose == 3 || this._currentPose == 4) {
                this.currentPose = 0;
            }
        } else {
            if (this.accelSound) {
                trace("STOP SOUND");
                this.accelSound.fadeOut(0.2);
                this.accelSound = null;
            }
            if (this.steadySound) {
                this.steadySound.fadeOut(0.2);
                this.steadySound = null;
            }
            if (this.idleSound) {
            }
        }
    }

    public override spacePressedActions() {
        var _loc1_: number = NaN;
        var _loc2_: number = NaN;
        var _loc3_: number = NaN;
        if (this.ejected) {
            this.startGrab();
        } else {
            this.boostVal += this.boostStepUp;
            this.boostVal = Math.min(this.boostMax, this.boostVal);
            if (this.boostVal < this.boostMax) {
                _loc1_ = this.frameBody.GetAngle();
                _loc2_ = Math.cos(_loc1_) * this.boostImpulse;
                _loc3_ = Math.sin(_loc1_) * this.boostImpulse;
                this.frameBody.ApplyImpulse(
                    new b2Vec2(_loc2_, _loc3_),
                    this.frameBody.GetWorldCenter(),
                );
            }
        }
    }

    public override spaceNullActions() {
        if (this.ejected) {
            this.releaseGrip();
        }
        this.boostVal -= this.boostStepDown;
        this.boostVal = Math.max(0, this.boostVal);
    }

    public override ctrlPressedActions() {
        if (!this.ejected) {
            this.backWheelJoint.EnableMotor(true);
            this.frontWheelJoint.EnableMotor(true);
            this.backWheelJoint.SetMotorSpeed(0);
            this.frontWheelJoint.SetMotorSpeed(0);
        }
    }

    public override ctrlNullActions() { }

    public override zPressedActions() {
        this.eject();
    }

    public override actions() {
        var _loc1_: number = NaN;
        this.boostMeter.scaleY = 1 - this.boostVal / this.boostMax;
        this.prevSpeed = this.currSpeed;
        this.currSpeed = this.backWheelJoint.GetJointSpeed();
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
        this.boostVal = 0;
        this.frameSmashed = false;
        this.impulseMagnitude = this._session.version > 1.2 ? 1 : 0.75;
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
        // @ts-expect-error
        this.frontWheelMC.rim.rotation =
            (this.frameBody.GetAngle() * CharacterB2D.oneEightyOverPI) % 360;
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
        this.contactImpulseDict.set(this.tankShape, this.frameSmashLimit);
        this.contactImpulseDict.set(this.frontWheelShape, this.wheelSmashLimit);
        this.contactImpulseDict.set(this.backWheelShape, this.wheelSmashLimit);
        this.contactAddSounds.set(this.backWheelShape, "TireHit1");
        this.contactAddSounds.set(this.frontWheelShape, "TireHit2");
        this.contactAddSounds.set(this.tankShape, "ChairHit1");
        this.contactAddSounds.set(this.forkShape, "ChairHit1");
        this.contactAddSounds.set(this.engineShape, "ChairHit2");
        this.contactAddSounds.set(this.rearShape, "ChairHit3");
    }

    public override createBodies() {
        var _loc9_: MovieClip = null;
        super.createBodies();
        var _loc1_ = new b2BodyDef();
        var _loc2_ = new b2BodyDef();
        var _loc3_ = new b2BodyDef();
        var _loc4_ = new b2PolygonDef();
        var _loc5_ = new b2CircleDef();
        _loc4_.density = 3;
        _loc4_.friction = 0.3;
        _loc4_.restitution = 0.1;
        _loc4_.filter.categoryBits = 513;
        _loc5_.density = 5;
        _loc5_.friction = 1;
        _loc5_.restitution = 0.3;
        _loc5_.filter.categoryBits = 513;
        this.frameBody = this._session.m_world.CreateBody(_loc1_);
        _loc4_.vertexCount = 3;
        var _loc6_: number = 0;
        while (_loc6_ < 3) {
            _loc9_ = this.shapeGuide["rearVert" + [_loc6_ + 1]];
            _loc4_.vertices[_loc6_] = new b2Vec2(
                this._startX + _loc9_.x / this.character_scale,
                this._startY + _loc9_.y / this.character_scale,
            );
            _loc6_++;
        }
        this.rearShape = this.frameBody.CreateShape(_loc4_) as b2PolygonShape;
        _loc4_.vertexCount = 4;
        _loc6_ = 0;
        while (_loc6_ < 4) {
            _loc9_ = this.shapeGuide["middleVert" + [_loc6_ + 1]];
            _loc4_.vertices[_loc6_] = new b2Vec2(
                this._startX + _loc9_.x / this.character_scale,
                this._startY + _loc9_.y / this.character_scale,
            );
            _loc6_++;
        }
        this.middleShape = this.frameBody.CreateShape(_loc4_) as b2PolygonShape;
        _loc4_.vertexCount = 5;
        _loc6_ = 0;
        while (_loc6_ < 5) {
            _loc9_ = this.shapeGuide["engineVert" + [_loc6_ + 1]];
            _loc4_.vertices[_loc6_] = new b2Vec2(
                this._startX + _loc9_.x / this.character_scale,
                this._startY + _loc9_.y / this.character_scale,
            );
            _loc6_++;
        }
        this.engineShape = this.frameBody.CreateShape(_loc4_) as b2PolygonShape;
        _loc4_.filter = this.zeroFilter;
        _loc4_.vertexCount = 4;
        _loc6_ = 0;
        while (_loc6_ < 4) {
            _loc9_ = this.shapeGuide["seatVert" + [_loc6_ + 1]];
            _loc4_.vertices[_loc6_] = new b2Vec2(
                this._startX + _loc9_.x / this.character_scale,
                this._startY + _loc9_.y / this.character_scale,
            );
            _loc6_++;
        }
        this.seatShape = this.frameBody.CreateShape(_loc4_) as b2PolygonShape;
        _loc4_.vertexCount = 5;
        _loc6_ = 0;
        while (_loc6_ < 5) {
            _loc9_ = this.shapeGuide["tankVert" + [_loc6_ + 1]];
            _loc4_.vertices[_loc6_] = new b2Vec2(
                this._startX + _loc9_.x / this.character_scale,
                this._startY + _loc9_.y / this.character_scale,
            );
            _loc6_++;
        }
        this.tankShape = this.frameBody.CreateShape(_loc4_) as b2PolygonShape;
        _loc4_.vertexCount = 3;
        _loc6_ = 0;
        while (_loc6_ < 3) {
            _loc9_ = this.shapeGuide["forkVert" + [_loc6_ + 1]];
            _loc4_.vertices[_loc6_] = new b2Vec2(
                this._startX + _loc9_.x / this.character_scale,
                this._startY + _loc9_.y / this.character_scale,
            );
            _loc6_++;
        }
        this.forkShape = this.frameBody.CreateShape(_loc4_) as b2PolygonShape;
        this._session.contactListener.registerListener(
            ContactListener.RESULT,
            this.rearShape,
            this.contactFrameResultHandler,
        );
        this._session.contactListener.registerListener(
            ContactListener.RESULT,
            this.engineShape,
            this.contactFrameResultHandler,
        );
        this._session.contactListener.registerListener(
            ContactListener.RESULT,
            this.seatShape,
            this.contactFrameResultHandler,
        );
        this._session.contactListener.registerListener(
            ContactListener.RESULT,
            this.tankShape,
            this.contactFrameResultHandler,
        );
        this._session.contactListener.registerListener(
            ContactListener.RESULT,
            this.forkShape,
            this.contactFrameResultHandler,
        );
        this._session.contactListener.registerListener(
            ContactListener.ADD,
            this.rearShape,
            this.contactAddHandler,
        );
        this._session.contactListener.registerListener(
            ContactListener.ADD,
            this.engineShape,
            this.contactAddHandler,
        );
        this._session.contactListener.registerListener(
            ContactListener.ADD,
            this.tankShape,
            this.contactAddHandler,
        );
        this._session.contactListener.registerListener(
            ContactListener.ADD,
            this.forkShape,
            this.contactAddHandler,
        );
        this.frameBody.SetMassFromShapes();
        this.paintVector.push(this.frameBody);
        _loc5_.filter = this.zeroFilter;
        var _loc7_: Sprite = this.shapeGuide["backWheelShape"];
        _loc2_.position.Set(
            this._startX + _loc7_.x / this.character_scale,
            this._startY + _loc7_.y / this.character_scale,
        );
        _loc2_.angle = _loc7_.rotation / CharacterB2D.oneEightyOverPI;
        _loc5_.radius = _loc7_.width / 2 / this.character_scale;
        this.backWheelBody = this._session.m_world.CreateBody(_loc2_);
        this.backWheelShape = this.backWheelBody.CreateShape(_loc5_);
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
        _loc7_ = this.shapeGuide["frontWheelShape"];
        _loc3_.position.Set(
            this._startX + _loc7_.x / this.character_scale,
            this._startY + _loc7_.y / this.character_scale,
        );
        _loc3_.angle = _loc7_.rotation / CharacterB2D.oneEightyOverPI;
        _loc5_.radius = _loc7_.width / 2 / this.character_scale;
        this.frontWheelBody = this._session.m_world.CreateBody(_loc3_);
        this.frontWheelShape = this.frontWheelBody.CreateShape(_loc5_);
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
        var _loc8_: b2Shape = this.upperLeg1Body.GetShapeList();
        _loc8_.m_isSensor = true;
        _loc8_ = this.upperLeg2Body.GetShapeList();
        _loc8_.m_isSensor = true;
    }

    public override createMovieClips() {
        super.createMovieClips();
        this.frameMC = this.sourceObject["frame"];
        var _loc2_ = 1 / this.mc_scale;
        this.frameMC.scaleY = 1 / this.mc_scale;
        this.frameMC.scaleX = _loc2_;
        this.backWheelMC = this.sourceObject["backWheel"];
        _loc2_ = 1 / this.mc_scale;
        this.backWheelMC.scaleY = 1 / this.mc_scale;
        this.backWheelMC.scaleX = _loc2_;
        this.frontWheelMC = this.sourceObject["frontWheel"];
        _loc2_ = 1 / this.mc_scale;
        this.frontWheelMC.scaleY = 1 / this.mc_scale;
        this.frontWheelMC.scaleX = _loc2_;
        this.frontWheelMC.gotoAndStop(1);
        this.backWheelMC.gotoAndStop(1);
        // @ts-expect-error
        this.frontWheelMC.inner.broken.visible = false;
        // @ts-expect-error
        this.backWheelMC.inner.broken.visible = false;
        this.frameBody.SetUserData(this.frameMC);
        this.backWheelBody.SetUserData(this.backWheelMC);
        this.frontWheelBody.SetUserData(this.frontWheelMC);
        var _loc1_: b2Vec2 = this.frameBody.GetLocalCenter();
        _loc1_ = new b2Vec2(
            (this._startX - _loc1_.x) * this.character_scale,
            (this._startY - _loc1_.y) * this.character_scale,
        );
        // @ts-expect-error
        this.frameMC.inner.x = _loc1_.x;
        // @ts-expect-error
        this.frameMC.inner.y = _loc1_.y;
        this.brokenForkMC = this.sourceObject["fork"];
        _loc2_ = 1 / this.mc_scale;
        this.brokenForkMC.scaleY = 1 / this.mc_scale;
        this.brokenForkMC.scaleX = _loc2_;
        this.brokenForkMC.visible = false;
        this.brokenTankMC = this.sourceObject["tank"];
        _loc2_ = 1 / this.mc_scale;
        this.brokenTankMC.scaleY = 1 / this.mc_scale;
        this.brokenTankMC.scaleX = _loc2_;
        this.brokenTankMC.visible = false;
        this.brokenEngineMC = this.sourceObject["engine"];
        _loc2_ = 1 / this.mc_scale;
        this.brokenEngineMC.scaleY = 1 / this.mc_scale;
        this.brokenEngineMC.scaleX = _loc2_;
        this.brokenEngineMC.visible = false;
        this.brokenMiddleMC = this.sourceObject["middle"];
        _loc2_ = 1 / this.mc_scale;
        this.brokenMiddleMC.scaleY = 1 / this.mc_scale;
        this.brokenMiddleMC.scaleX = _loc2_;
        this.brokenMiddleMC.visible = false;
        this.brokenRearMC = this.sourceObject["rear"];
        _loc2_ = 1 / this.mc_scale;
        this.brokenRearMC.scaleY = 1 / this.mc_scale;
        this.brokenRearMC.scaleX = _loc2_;
        this.brokenRearMC.visible = false;
        this.brokenSeatMC = this.sourceObject["seat"];
        _loc2_ = 1 / this.mc_scale;
        this.brokenSeatMC.scaleY = 1 / this.mc_scale;
        this.brokenSeatMC.scaleX = _loc2_;
        this.brokenSeatMC.visible = false;
        this._session.containerSprite.addChildAt(
            this.backWheelMC,
            this._session.containerSprite.getChildIndex(this.chestMC),
        );
        this._session.containerSprite.addChildAt(
            this.frontWheelMC,
            this._session.containerSprite.getChildIndex(this.chestMC),
        );
        this._session.containerSprite.addChildAt(
            this.frameMC,
            this._session.containerSprite.getChildIndex(this.chestMC),
        );
        this._session.containerSprite.addChildAt(
            this.frameMC,
            this._session.containerSprite.getChildIndex(this.chestMC),
        );
        this._session.containerSprite.addChildAt(
            this.brokenRearMC,
            this._session.containerSprite.getChildIndex(this.chestMC),
        );
        this._session.containerSprite.addChildAt(
            this.brokenSeatMC,
            this._session.containerSprite.getChildIndex(this.chestMC),
        );
        this._session.containerSprite.addChildAt(
            this.brokenEngineMC,
            this._session.containerSprite.getChildIndex(this.chestMC),
        );
        this._session.containerSprite.addChildAt(
            this.brokenTankMC,
            this._session.containerSprite.getChildIndex(this.chestMC),
        );
        this._session.containerSprite.addChildAt(
            this.brokenForkMC,
            this._session.containerSprite.getChildIndex(this.chestMC),
        );
        this.boostHolder = new Sprite();
        this.boostHolder.graphics.beginFill(13421772);
        this.boostHolder.graphics.drawRoundRect(-2, -52, 10, 54, 4, 4);
        this.boostHolder.graphics.endFill();
        this.boostHolder.graphics.beginFill(16613761);
        this.boostHolder.graphics.drawRect(0, 0, 6, -50);
        this.boostHolder.graphics.endFill();
        this._session.addChild(this.boostHolder);
        this.boostHolder.y = 90;
        this.boostHolder.x = 870;
        this.boostMeter = new Sprite();
        this.boostMeter.graphics.beginFill(16776805);
        this.boostMeter.graphics.drawRect(0, 0, 6, -50);
        this.boostMeter.graphics.endFill();
        this.boostHolder.addChild(this.boostMeter);
        this.session.particleController.createBMDArray(
            "jetshards",
            this.sourceObject["metalShards"],
        );
    }

    public override resetMovieClips() {
        super.resetMovieClips();
        this.frontWheelMC.gotoAndStop(1);
        this.backWheelMC.gotoAndStop(1);
        this.frameMC.visible = true;
        // @ts-expect-error
        this.frontWheelMC.rim.visible = true;
        // @ts-expect-error
        this.frontWheelMC.inner.broken.visible = false;
        // @ts-expect-error
        this.backWheelMC.inner.broken.visible = false;
        // @ts-expect-error
        this.frontWheelMC.inner.spokes.visible = true;
        // @ts-expect-error
        this.backWheelMC.inner.spokes.visible = true;
        this.brokenForkMC.visible = false;
        this.brokenTankMC.visible = false;
        this.brokenEngineMC.visible = false;
        this.brokenMiddleMC.visible = false;
        this.brokenRearMC.visible = false;
        this.brokenSeatMC.visible = false;
        this.frameBody.SetUserData(this.frameMC);
        this.backWheelBody.SetUserData(this.backWheelMC);
        this.frontWheelBody.SetUserData(this.frontWheelMC);
        this._session.addChild(this.boostHolder);
        this.session.particleController.createBMDArray(
            "jetshards",
            this.sourceObject["metalShards"],
        );
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
        _loc1_ = this.upperLeg2Body.GetAngle() - this.pelvisBody.GetAngle();
        _loc2_ = -110 / _loc4_ - _loc1_;
        _loc3_ = 10 / _loc4_ - _loc1_;
        _loc1_ = this.lowerArm1Body.GetAngle() - this.upperArm1Body.GetAngle();
        _loc2_ = -90 / _loc4_ - _loc1_;
        _loc3_ = 0 / _loc4_ - _loc1_;
        this.elbowJoint1.SetLimits(_loc2_, _loc3_);
        _loc1_ = this.lowerArm2Body.GetAngle() - this.upperArm2Body.GetAngle();
        _loc2_ = -90 / _loc4_ - _loc1_;
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
        _loc6_.Set(
            this.pelvisBody.GetPosition().x,
            this.pelvisBody.GetPosition().y,
        );
        _loc5_.Initialize(this.frameBody, this.pelvisBody, _loc6_);
        this.framePelvis = this._session.m_world.CreateJoint(
            _loc5_,
        ) as b2RevoluteJoint;
        this.framePelvisJointDef = _loc5_.clone();
        this.pelvisAnchorPoint = this.frameBody.GetLocalPoint(_loc6_);
        _loc7_ = this.shapeGuide["handleAnchor"];
        _loc6_.Set(
            this._startX + _loc7_.x / this.character_scale,
            this._startY + _loc7_.y / this.character_scale,
        );
        _loc5_.Initialize(this.frameBody, this.lowerArm1Body, _loc6_);
        this.frameHand1 = this._session.m_world.CreateJoint(
            _loc5_,
        ) as b2RevoluteJoint;
        this.frameHand1JointDef = _loc5_.clone();
        this.handleAnchorPoint = this.frameBody.GetLocalPoint(_loc6_);
        _loc5_.Initialize(this.frameBody, this.lowerArm2Body, _loc6_);
        this.frameHand2 = this._session.m_world.CreateJoint(
            _loc5_,
        ) as b2RevoluteJoint;
        this.frameHand2JointDef = _loc5_.clone();
        _loc7_ = this.shapeGuide["footAnchor"];
        _loc6_.Set(
            this._startX + _loc7_.x / this.character_scale,
            this._startY + _loc7_.y / this.character_scale,
        );
        _loc5_.Initialize(this.frameBody, this.lowerLeg1Body, _loc6_);
        this.frameFoot1 = this._session.m_world.CreateJoint(
            _loc5_,
        ) as b2RevoluteJoint;
        this.frameFoot1JointDef = _loc5_.clone();
        this.footAnchorPoint = this.frameBody.GetLocalPoint(_loc6_);
        _loc5_.Initialize(this.frameBody, this.lowerLeg2Body, _loc6_);
        this.frameFoot2 = this._session.m_world.CreateJoint(
            _loc5_,
        ) as b2RevoluteJoint;
        this.frameFoot2JointDef = _loc5_.clone();
    }

    protected contactFrameResultHandler(param1: ContactEvent) {
        var _loc2_: number = param1.impulse;
        if (_loc2_ > this.contactImpulseDict.get(this.tankShape)) {
            if (this.contactResultBuffer.get(this.tankShape)) {
                if (
                    _loc2_ >
                    this.contactResultBuffer.get(this.tankShape).impulse
                ) {
                    this.contactResultBuffer.set(this.tankShape, param1);
                }
            } else {
                this.contactResultBuffer.set(this.tankShape, param1);
            }
        }
    }

    protected override handleContactResults() {
        var _loc1_: ContactEvent = null;
        super.handleContactResults();
        if (this.contactResultBuffer.get(this.tankShape)) {
            _loc1_ = this.contactResultBuffer.get(this.tankShape);
            this.frameSmash(_loc1_.impulse, _loc1_.normal);
            this.contactResultBuffer.delete(this.tankShape);
            this.contactAddBuffer.delete(this.tankShape);
            this.contactAddBuffer.delete(this.forkShape);
            this.contactAddBuffer.delete(this.engineShape);
            this.contactAddBuffer.delete(this.rearShape);
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
        this.removeAction(this.reAttaching);
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
        if (this.frameFoot1) {
            _loc1_.DestroyJoint(this.frameFoot1);
            this.frameFoot1 = null;
        }
        if (this.frameFoot2) {
            _loc1_.DestroyJoint(this.frameFoot2);
            this.frameFoot2 = null;
        }
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
        trace("frame impulse " + param1);
        this.contactImpulseDict.delete(this.tankShape);
        var _loc3_: ContactListener = this._session.contactListener;
        _loc3_.deleteListener(ContactListener.RESULT, this.rearShape);
        _loc3_.deleteListener(ContactListener.RESULT, this.engineShape);
        _loc3_.deleteListener(ContactListener.RESULT, this.seatShape);
        _loc3_.deleteListener(ContactListener.RESULT, this.tankShape);
        _loc3_.deleteListener(ContactListener.RESULT, this.forkShape);
        _loc3_.deleteListener(ContactListener.ADD, this.rearShape);
        _loc3_.deleteListener(ContactListener.ADD, this.engineShape);
        _loc3_.deleteListener(ContactListener.ADD, this.tankShape);
        _loc3_.deleteListener(ContactListener.ADD, this.forkShape);
        this.eject();
        this.frameSmashed = true;
        var _loc4_: b2World = this._session.m_world;
        var _loc5_: b2Vec2 = this.frameBody.GetPosition();
        var _loc6_: number = this.frameBody.GetAngle();
        var _loc7_: b2Vec2 = this.frameBody.GetLinearVelocity();
        var _loc8_: number = this.frameBody.GetAngularVelocity();
        var _loc9_ = new b2BodyDef();
        _loc9_.position = _loc5_;
        _loc9_.angle = _loc6_;
        var _loc10_ = new b2PolygonDef();
        _loc10_.density = 3;
        _loc10_.friction = 0.3;
        _loc10_.restitution = 0.1;
        _loc10_.filter = this.zeroFilter;
        var _loc11_: b2Body = _loc4_.CreateBody(_loc9_);
        _loc11_.SetLinearVelocity(_loc7_);
        _loc11_.SetAngularVelocity(_loc8_);
        var _loc12_: b2Body = _loc4_.CreateBody(_loc9_);
        _loc12_.SetLinearVelocity(_loc7_);
        _loc12_.SetAngularVelocity(_loc8_);
        var _loc13_: b2Body = _loc4_.CreateBody(_loc9_);
        _loc13_.SetLinearVelocity(_loc7_);
        _loc13_.SetAngularVelocity(_loc8_);
        var _loc14_: b2Body = _loc4_.CreateBody(_loc9_);
        _loc14_.SetLinearVelocity(_loc7_);
        _loc14_.SetAngularVelocity(_loc8_);
        var _loc15_: b2Body = _loc4_.CreateBody(_loc9_);
        _loc15_.SetLinearVelocity(_loc7_);
        _loc15_.SetAngularVelocity(_loc8_);
        var _loc16_: b2Body = _loc4_.CreateBody(_loc9_);
        _loc16_.SetLinearVelocity(_loc7_);
        _loc16_.SetAngularVelocity(_loc8_);
        var _loc17_: any[] = this.rearShape.GetVertices();
        _loc10_.vertexCount = 3;
        _loc10_.vertices = _loc17_;
        _loc15_.CreateShape(_loc10_);
        _loc15_.SetMassFromShapes();
        _loc17_ = this.middleShape.GetVertices();
        _loc10_.vertexCount = 4;
        _loc10_.vertices = _loc17_;
        _loc14_.CreateShape(_loc10_);
        _loc14_.SetMassFromShapes();
        _loc17_ = this.engineShape.GetVertices();
        _loc10_.vertexCount = 5;
        _loc10_.vertices = _loc17_;
        _loc13_.CreateShape(_loc10_);
        _loc13_.SetMassFromShapes();
        _loc17_ = this.seatShape.GetVertices();
        _loc10_.vertexCount = 4;
        _loc10_.vertices = _loc17_;
        _loc16_.CreateShape(_loc10_);
        _loc16_.SetMassFromShapes();
        _loc17_ = this.tankShape.GetVertices();
        _loc10_.vertexCount = 5;
        _loc10_.vertices = _loc17_;
        _loc12_.CreateShape(_loc10_);
        _loc12_.SetMassFromShapes();
        _loc17_ = this.forkShape.GetVertices();
        _loc10_.vertexCount = 3;
        _loc10_.vertices = _loc17_;
        _loc11_.CreateShape(_loc10_);
        _loc11_.SetMassFromShapes();
        this.brokenRearMC.visible = true;
        _loc15_.SetUserData(this.brokenRearMC);
        this.paintVector.push(_loc15_);
        this.brokenMiddleMC.visible = true;
        _loc14_.SetUserData(this.brokenMiddleMC);
        this.paintVector.push(_loc14_);
        this.brokenEngineMC.visible = true;
        _loc13_.SetUserData(this.brokenEngineMC);
        this.paintVector.push(_loc13_);
        this.brokenSeatMC.visible = true;
        _loc16_.SetUserData(this.brokenSeatMC);
        this.paintVector.push(_loc16_);
        this.brokenTankMC.visible = true;
        _loc12_.SetUserData(this.brokenTankMC);
        this.paintVector.push(_loc12_);
        this.brokenForkMC.visible = true;
        _loc11_.SetUserData(this.brokenForkMC);
        this.paintVector.push(_loc11_);
        _loc4_.DestroyBody(this.frameBody);
        this.tankShape = null;
        this.session.particleController.createPointBurst(
            "jetshards",
            _loc5_.x * this.m_physScale,
            _loc5_.y * this.m_physScale,
            5,
            50,
            50,
            this._session.containerSprite.getChildIndex(this.frameMC),
        );
        this.frameMC.visible = false;
        // @ts-expect-error
        this.frontWheelMC.rim.visible = false;
        SoundController.instance.playAreaSoundInstance(
            "MetalSmashHeavy",
            _loc12_,
        );
    }

    public frontWheelSmash(param1: number, param2: b2Vec2) {
        trace("front wheel impulse " + param1);
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
            45 / this.character_scale,
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
            45 / this.character_scale,
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
            !this.frameFoot1 &&
            !this.frameFoot2
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
        if (this.frameHand1) {
            this._session.m_world.DestroyJoint(this.frameHand1);
            this.frameHand1 = null;
        }
        if (this.frameHand2) {
            this._session.m_world.DestroyJoint(this.frameHand2);
            this.frameHand2 = null;
        }
        this.checkEject();
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

    public override shoulderBreak1(param1: number, param2: boolean = true) {
        super.shoulderBreak1(param1, param2);
        this.lowerArm1Shape.m_isSensor = false;
        this._session.m_world.Refilter(this.lowerArm1Shape);
        if (this.ejected) {
            return;
        }
        if (this.frameHand1) {
            this._session.m_world.DestroyJoint(this.frameHand1);
            this.frameHand1 = null;
        }
        this.checkEject();
    }

    public override shoulderBreak2(param1: number, param2: boolean = true) {
        super.shoulderBreak2(param1, param2);
        this.lowerArm2Shape.m_isSensor = false;
        this._session.m_world.Refilter(this.lowerArm2Shape);
        if (this.ejected) {
            return;
        }
        if (this.frameHand2) {
            this._session.m_world.DestroyJoint(this.frameHand2);
            this.frameHand2 = null;
        }
        this.checkEject();
    }

    public override hipBreak1(param1: number, param2: boolean = true) {
        super.hipBreak1(param1, param2);
        if (this.ejected) {
            return;
        }
        if (this.frameFoot1) {
            this._session.m_world.DestroyJoint(this.frameFoot1);
            this.frameFoot1 = null;
        }
        this.checkEject();
    }

    public override hipBreak2(param1: number, param2: boolean = true) {
        super.hipBreak2(param1, param2);
        if (this.ejected) {
            return;
        }
        if (this.frameFoot2) {
            this._session.m_world.DestroyJoint(this.frameFoot2);
            this.frameFoot2 = null;
        }
        this.checkEject();
    }

    public override kneeBreak1(param1: number) {
        super.kneeBreak1(param1);
        if (this.ejected) {
            return;
        }
        if (this.frameFoot1) {
            this._session.m_world.DestroyJoint(this.frameFoot1);
            this.frameFoot1 = null;
        }
        this.checkEject();
    }

    public override kneeBreak2(param1: number) {
        super.kneeBreak2(param1);
        if (this.ejected) {
            return;
        }
        if (this.frameFoot2) {
            this._session.m_world.DestroyJoint(this.frameFoot2);
            this.frameFoot2 = null;
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
        this.ejected = false;
        this.currentPose = 0;
        this.releaseGrip();
        var _loc5_: number = 180 / Math.PI;
        _loc2_ =
            this.head1Body.GetAngle() -
            this.chestBody.GetAngle() -
            this.neckJoint.GetJointAngle();
        _loc3_ = -20 / _loc5_ - _loc2_;
        _loc4_ = 0 / _loc5_ - _loc2_;
        this.neckJoint.SetLimits(_loc3_, _loc4_);
        _loc2_ =
            this.lowerArm1Body.GetAngle() -
            this.upperArm1Body.GetAngle() -
            this.elbowJoint1.GetJointAngle();
        _loc3_ = -90 / _loc5_ - _loc2_;
        _loc4_ = 0 / _loc5_ - _loc2_;
        this.elbowJoint1.SetLimits(_loc3_, _loc4_);
        _loc2_ =
            this.lowerArm2Body.GetAngle() -
            this.upperArm2Body.GetAngle() -
            this.elbowJoint2.GetJointAngle();
        _loc3_ = -90 / _loc5_ - _loc2_;
        _loc4_ = 0 / _loc5_ - _loc2_;
        this.elbowJoint2.SetLimits(_loc3_, _loc4_);
        var _loc6_: b2World = this._session.m_world;
        if (param1 == this.lowerArm1Body) {
            this.frameHand1 = _loc6_.CreateJoint(
                this.frameHand1JointDef,
            ) as b2RevoluteJoint;
            // @ts-expect-error
            this.lowerArm1MC.hand.gotoAndStop(1);
        } else {
            this.frameHand2 = _loc6_.CreateJoint(
                this.frameHand2JointDef,
            ) as b2RevoluteJoint;
            // @ts-expect-error
            this.lowerArm2MC.hand.gotoAndStop(1);
        }
        this.actionsVector.push(this.reAttaching);
    }

    public reAttaching() {
        var _loc7_: b2Vec2 = null;
        var _loc8_: b2Vec2 = null;
        var _loc9_: b2Shape = null;
        var _loc1_: number = 0;
        var _loc2_: b2World = this._session.m_world;
        if (
            !this.frameHand1 &&
            !this.elbowJoint1.broken &&
            !this.shoulderJoint1.broken
        ) {
            _loc7_ = this.lowerArm1Body.GetWorldPoint(
                new b2Vec2(
                    0,
                    (this.lowerArm1Shape as b2PolygonShape).GetVertices()[2].y,
                ),
            );
            _loc8_ = this.frameBody.GetWorldPoint(this.handleAnchorPoint);
            if (
                Math.abs(_loc7_.x - _loc8_.x) < this.reAttachDistance &&
                Math.abs(_loc7_.y - _loc8_.y) < this.reAttachDistance
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
            _loc7_ = this.lowerArm2Body.GetWorldPoint(
                new b2Vec2(
                    0,
                    (this.lowerArm2Shape as b2PolygonShape).GetVertices()[2].y,
                ),
            );
            _loc8_ = this.frameBody.GetWorldPoint(this.handleAnchorPoint);
            if (
                Math.abs(_loc7_.x - _loc8_.x) < this.reAttachDistance &&
                Math.abs(_loc7_.y - _loc8_.y) < this.reAttachDistance
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
        var _loc3_: number = -0.87;
        var _loc4_ = Number(this.hipJoint1.GetJointAngle());
        var _loc5_ = Number(this.hipJoint2.GetJointAngle());
        var _loc6_: boolean =
            (_loc4_ < _loc3_ || Boolean(this.hipJoint1.broken)) &&
                (_loc5_ < _loc3_ || Boolean(this.hipJoint2.broken))
                ? true
                : false;
        if (!this.framePelvis) {
            _loc7_ = this.pelvisBody.GetPosition();
            _loc8_ = this.frameBody.GetWorldPoint(this.pelvisAnchorPoint);
            if (
                Math.abs(_loc7_.x - _loc8_.x) < this.reAttachDistance &&
                Math.abs(_loc7_.y - _loc8_.y) < this.reAttachDistance &&
                _loc6_
            ) {
                trace("frame PELVIS " + _loc4_ + " " + _loc5_);
                this.framePelvis = _loc2_.CreateJoint(
                    this.framePelvisJointDef,
                ) as b2RevoluteJoint;
                _loc9_ = this.upperLeg1Body.GetShapeList();
                _loc9_.m_isSensor = true;
                _loc2_.Refilter(_loc9_);
                _loc9_ = this.upperLeg2Body.GetShapeList();
                _loc9_.m_isSensor = true;
                _loc2_.Refilter(_loc9_);
                _loc1_ += 1;
            }
        } else {
            _loc1_ += 1;
        }
        if (this.framePelvis) {
            if (
                !this.frameFoot1 &&
                !this.kneeJoint1.broken &&
                !this.hipJoint1.broken
            ) {
                _loc7_ = this.lowerLeg1Body.GetWorldPoint(
                    new b2Vec2(
                        0,
                        (
                            this.lowerLeg1Shape as b2PolygonShape
                        ).GetVertices()[2].y,
                    ),
                );
                _loc8_ = this.frameBody.GetWorldPoint(this.footAnchorPoint);
                if (
                    Math.abs(_loc7_.x - _loc8_.x) < this.reAttachDistance &&
                    Math.abs(_loc7_.y - _loc8_.y) < this.reAttachDistance
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
                _loc7_ = this.lowerLeg2Body.GetWorldPoint(
                    new b2Vec2(
                        0,
                        (
                            this.lowerLeg2Shape as b2PolygonShape
                        ).GetVertices()[2].y,
                    ),
                );
                _loc8_ = this.frameBody.GetWorldPoint(this.footAnchorPoint);
                if (
                    Math.abs(_loc7_.x - _loc8_.x) < this.reAttachDistance &&
                    Math.abs(_loc7_.y - _loc8_.y) < this.reAttachDistance
                ) {
                    this.frameFoot2 = _loc2_.CreateJoint(
                        this.frameFoot2JointDef,
                    ) as b2RevoluteJoint;
                    _loc1_ += 1;
                }
            } else {
                _loc1_ += 1;
            }
        }
        if (_loc1_ >= 5) {
            trace("ATTACH COMPLETE");
            trace("currpose " + this._currentPose);
            this.removeAction(this.reAttaching);
        }
    }
}