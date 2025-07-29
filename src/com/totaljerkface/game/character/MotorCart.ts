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
import AreaSoundLoop from "@/com/totaljerkface/game/sound/AreaSoundLoop";
import SoundController from "@/com/totaljerkface/game/sound/SoundController";
import { boundClass } from 'autobind-decorator';
import DisplayObject from "flash/display/DisplayObject";
import MovieClip from "flash/display/MovieClip";
import Sprite from "flash/display/Sprite";

@boundClass
export default class MotorCart extends CharacterB2D {
    public ejected: boolean;
    protected wheelMaxSpeed: number = 50;
    protected wheelCurrentSpeed: number;
    protected wheelNewSpeed: number;
    protected wheelContacts: number = 0;
    protected backContacts: number = 0;
    protected frontContacts: number = 0;
    protected accelStep: number = 2;
    protected maxTorque: number = 100000;
    protected impulseMagnitude: number = 1.25;
    protected impulseOffset: number = 1;
    protected maxSpinAV: number = 5;
    protected wheelLoop1: AreaSoundLoop;
    protected wheelLoop2: AreaSoundLoop;
    protected wheelLoop3: AreaSoundLoop;
    protected motorSound: AreaSoundLoop;
    public cartSmashLimit: number = 100;
    public mainSmashLimit: number = 200;
    public crackerSmashLimit: number = 1;
    public mainSmashed: boolean;
    protected jumpTranslation: number;
    protected handleAnchorPoint: b2Vec2;
    protected pelvisAnchorPoint: b2Vec2;
    protected leg1AnchorPoint: b2Vec2;
    protected leg2AnchorPoint: b2Vec2;
    protected mainPelvisJointDef: b2RevoluteJointDef;
    protected mainHand1JointDef: b2RevoluteJointDef;
    protected mainHand2JointDef: b2RevoluteJointDef;
    protected mainLeg1JointDef: b2RevoluteJointDef;
    protected mainLeg2JointDef: b2RevoluteJointDef;
    protected cartShape: b2Shape;
    protected mainShape1: b2Shape;
    protected mainShape2: b2Shape;
    protected mainShape3: b2Shape;
    protected mainShape4: b2Shape;
    protected crackerShape: b2Shape;
    protected sodaShape: b2Shape;
    protected backWheelShape: b2Shape;
    protected frontWheelShape: b2Shape;
    protected handleShape: b2Shape;
    protected shaftShape: b2Shape;
    public mainBody: b2Body;
    public cartBody: b2Body;
    public shaftBody: b2Body;
    public backShockBody: b2Body;
    public frontShockBody: b2Body;
    public backWheelBody: b2Body;
    public frontWheelBody: b2Body;
    public groceryBodies: any[];
    public shockMC: Sprite;
    public mainMC: MovieClip;
    public frontEndMC: MovieClip;
    public shaftMC: MovieClip;
    public backWheelMC: MovieClip;
    public frontWheelMC: MovieClip;
    public groceryMCs: any[];
    protected mainFrontMC: Sprite;
    protected mainBaseMC: Sprite;
    protected mainRearMC: Sprite;
    protected mainSeatMC: Sprite;
    protected cartMC: Sprite;
    public backShockJoint: b2PrismaticJoint;
    public frontShockJoint: b2PrismaticJoint;
    public backWheelJoint: b2RevoluteJoint;
    public frontWheelJoint: b2RevoluteJoint;
    public mainCart: b2RevoluteJoint;
    public mainShaft: b2RevoluteJoint;
    public mainPelvis: b2RevoluteJoint;
    public mainHand1: b2RevoluteJoint;
    public mainHand2: b2RevoluteJoint;
    public mainLeg1: b2RevoluteJoint;
    public mainLeg2: b2RevoluteJoint;

    constructor(
        param1: number,
        param2: number,
        param3: DisplayObject,
        param4: Session,
    ) {
        super(param1, param2, param3, param4, -1, "Char4");
        this.jumpTranslation = 20 / this.m_physScale;
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
            _loc1_ = this.mainBody.GetAngle();
            _loc2_ = this.mainBody.GetAngularVelocity();
            _loc3_ = (_loc2_ + this.maxSpinAV) / this.maxSpinAV;
            if (_loc3_ < 0) {
                _loc3_ = 0;
            }
            if (_loc3_ > 1) {
                _loc3_ = 1;
            }
            _loc4_ = Math.cos(_loc1_) * this.impulseMagnitude * _loc3_;
            _loc5_ = Math.sin(_loc1_) * this.impulseMagnitude * _loc3_;
            _loc6_ = this.mainBody.GetLocalCenter();
            this.mainBody.ApplyImpulse(
                new b2Vec2(_loc5_, -_loc4_),
                this.mainBody.GetWorldPoint(
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
            _loc1_ = this.mainBody.GetAngle();
            _loc2_ = this.mainBody.GetAngularVelocity();
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
            _loc7_ = this.mainBody.GetLocalCenter();
            this.mainBody.ApplyImpulse(
                new b2Vec2(_loc6_, -_loc5_),
                this.mainBody.GetWorldPoint(
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
            if (!this.backWheelJoint.IsMotorEnabled()) {
                this.backWheelJoint.EnableMotor(true);
                this.frontWheelJoint.EnableMotor(true);
                this.motorSound = SoundController.instance.playAreaSoundLoop(
                    "ElectricMotor1",
                    this.backWheelBody,
                    1,
                );
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
                this.motorSound = SoundController.instance.playAreaSoundLoop(
                    "ElectricMotor1",
                    this.backWheelBody,
                    1,
                );
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
            this.motorSound.fadeOut(0.25);
            this.motorSound = null;
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
            this.backShockJoint.SetMotorSpeed(5);
            this.frontShockJoint.SetMotorSpeed(5);
            this.backShockJoint.SetLimits(0, this.jumpTranslation);
            this.frontShockJoint.SetLimits(0, this.jumpTranslation);
            this.backShockJoint.EnableMotor(true);
            this.frontShockJoint.EnableMotor(true);
            SoundController.instance.playAreaSoundInstance(
                "SegwayJump",
                this.backWheelBody,
            );
        } else if (this.backShockJoint.GetMotorSpeed() > 0) {
            if (
                this.backShockJoint.GetJointTranslation() > this.jumpTranslation
            ) {
                this.backShockJoint.SetMotorSpeed(-1);
                this.frontShockJoint.SetMotorSpeed(-1);
            }
        } else if (this.backShockJoint.GetMotorSpeed() < 0) {
            if (this.backShockJoint.GetJointTranslation() < 0) {
                this.backShockJoint.EnableMotor(false);
                this.frontShockJoint.EnableMotor(false);
                this.backShockJoint.SetLimits(0, 0);
                this.frontShockJoint.SetLimits(0, 0);
                this.backShockJoint.SetMotorSpeed(0);
                this.frontShockJoint.SetMotorSpeed(0);
            }
        }
    }

    public override spaceNullActions() {
        if (this.ejected) {
            this.releaseGrip();
        } else if (this.backShockJoint.IsMotorEnabled()) {
            if (this.backShockJoint.GetMotorSpeed() > 0) {
                if (
                    this.backShockJoint.GetJointTranslation() >
                    this.jumpTranslation
                ) {
                    this.backShockJoint.SetMotorSpeed(-1);
                    this.frontShockJoint.SetMotorSpeed(-1);
                }
            } else if (this.backShockJoint.GetMotorSpeed() < 0) {
                if (this.backShockJoint.GetJointTranslation() < 0) {
                    this.backShockJoint.EnableMotor(false);
                    this.frontShockJoint.EnableMotor(false);
                    this.backShockJoint.SetLimits(0, 0);
                    this.frontShockJoint.SetLimits(0, 0);
                    this.backShockJoint.SetMotorSpeed(0);
                    this.frontShockJoint.SetMotorSpeed(0);
                }
            }
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
        var _loc1_: number = NaN;
        if (this.wheelContacts > 0) {
            _loc1_ = Math.abs(this.backWheelBody.GetAngularVelocity());
            if (_loc1_ > 50) {
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
            } else if (_loc1_ > 25) {
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
            } else if (_loc1_ > 5) {
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
                break;
            case 6:
                this.lungePoseLeft();
                break;
            case 7:
                this.lungePoseRight();
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
        this.mainSmashed = false;
    }

    public override paint() {
        var _loc2_: b2Vec2 = null;
        super.paint();
        var _loc1_: b2Vec2 = this.frontWheelBody.GetWorldCenter();
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
        if (!this.mainSmashed) {
            _loc1_ = this.backShockJoint.GetAnchor1();
            _loc2_ = this.backShockBody.GetWorldCenter();
            this.shockMC.graphics.clear();
            this.shockMC.graphics.lineStyle(3, 792077);
            this.shockMC.graphics.moveTo(
                _loc1_.x * this.m_physScale,
                _loc1_.y * this.m_physScale,
            );
            this.shockMC.graphics.lineTo(
                _loc2_.x * this.m_physScale,
                _loc2_.y * this.m_physScale,
            );
            _loc1_ = this.frontShockJoint.GetAnchor1();
            _loc2_ = this.frontShockBody.GetWorldCenter();
            this.shockMC.graphics.moveTo(
                _loc1_.x * this.m_physScale,
                _loc1_.y * this.m_physScale,
            );
            this.shockMC.graphics.lineTo(
                _loc2_.x * this.m_physScale,
                _loc2_.y * this.m_physScale,
            );
            this.cartMC.x = this.mainMC.x;
            this.cartMC.y = this.mainMC.y;
            this.cartMC.rotation = this.mainMC.rotation;
        }
    }

    public override createDictionaries() {
        super.createDictionaries();
        this.contactImpulseDict.set(this.cartShape, this.cartSmashLimit);
        this.contactImpulseDict.set(this.mainShape1, this.mainSmashLimit);
        this.contactImpulseDict.set(this.crackerShape, this.crackerSmashLimit);
        this.contactImpulseDict.set(this.sodaShape, this.crackerSmashLimit);
        this.contactAddSounds.set(this.backWheelShape, "CarTire1");
        this.contactAddSounds.set(this.frontWheelShape, "CarTire1");
        this.contactAddSounds.set(this.mainShape3, "BikeHit3");
        this.contactAddSounds.set(this.cartShape, "BikeHit1");
    }

    public override createBodies() {
        var _loc17_: b2PolygonDef = null;
        var _loc23_: MovieClip = null;
        var _loc24_: b2BodyDef = null;
        var _loc25_: b2Body = null;
        super.createBodies();
        var _loc1_ = new b2PolygonDef();
        var _loc2_ = new b2CircleDef();
        var _loc3_ = new b2BodyDef();
        var _loc4_ = new b2BodyDef();
        _loc1_.density = 1;
        _loc1_.friction = 0.3;
        _loc1_.restitution = 0.1;
        _loc1_.filter = this.defaultFilter;
        this.paintVector.splice(this.paintVector.indexOf(this.chestBody), 1);
        this.paintVector.splice(this.paintVector.indexOf(this.pelvisBody), 1);
        this._session.m_world.DestroyBody(this.chestBody);
        this._session.m_world.DestroyBody(this.pelvisBody);
        var _loc5_: MovieClip = this.shapeGuide["chestShape"];
        _loc3_.position.Set(
            this._startX + _loc5_.x / this.character_scale,
            this._startY + _loc5_.y / this.character_scale,
        );
        _loc3_.angle = _loc5_.rotation / (180 / Math.PI);
        this.chestBody = this._session.m_world.CreateBody(_loc3_);
        _loc1_.vertexCount = 6;
        var _loc6_: number = 0;
        while (_loc6_ < 6) {
            _loc23_ = this.shapeGuide["chestVert" + [_loc6_]];
            _loc1_.vertices[_loc6_] = new b2Vec2(
                _loc23_.x / this.character_scale,
                _loc23_.y / this.character_scale,
            );
            _loc6_++;
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
        _loc5_ = this.shapeGuide["pelvisShape"];
        _loc4_.position.Set(
            this._startX + _loc5_.x / this.character_scale,
            this._startY + _loc5_.y / this.character_scale,
        );
        _loc4_.angle = _loc5_.rotation / (180 / Math.PI);
        this.pelvisBody = this._session.m_world.CreateBody(_loc4_);
        _loc1_.vertexCount = 5;
        _loc6_ = 0;
        while (_loc6_ < 5) {
            _loc23_ = this.shapeGuide["pelvisVert" + [_loc6_]];
            _loc1_.vertices[_loc6_] = new b2Vec2(
                _loc23_.x / this.character_scale,
                _loc23_.y / this.character_scale,
            );
            _loc6_++;
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
        var _loc7_ = new b2BodyDef();
        var _loc8_ = new b2BodyDef();
        var _loc9_ = new b2BodyDef();
        var _loc10_ = new b2BodyDef();
        var _loc11_ = new b2BodyDef();
        var _loc12_ = new b2BodyDef();
        var _loc13_ = new b2BodyDef();
        var _loc14_ = new b2PolygonDef();
        var _loc15_ = new b2PolygonDef();
        var _loc16_ = new b2PolygonDef();
        _loc1_.density = 4;
        _loc1_.friction = 0.3;
        _loc1_.restitution = 0.1;
        _loc1_.filter = new b2FilterData();
        _loc1_.filter.categoryBits = 513;
        _loc1_.filter.groupIndex = -2;
        this.mainBody = this._session.m_world.CreateBody(_loc7_);
        this.shaftBody = this._session.m_world.CreateBody(_loc9_);
        _loc1_.vertexCount = 4;
        _loc6_ = 0;
        while (_loc6_ < 4) {
            _loc23_ = this.shapeGuide["frontVert" + [_loc6_ + 1]];
            _loc1_.vertices[_loc6_] = new b2Vec2(
                this._startX + _loc23_.x / this.character_scale,
                this._startY + _loc23_.y / this.character_scale,
            );
            _loc6_++;
        }
        this.mainShape1 = this.mainBody.CreateShape(_loc1_);
        this._session.contactListener.registerListener(
            ContactListener.RESULT,
            this.mainShape1,
            this.contactMainResultHandler,
        );
        _loc5_ = this.shapeGuide["baseShape"];
        var _loc18_ = new b2Vec2(
            this._startX + _loc5_.x / this.character_scale,
            this._startY + _loc5_.y / this.character_scale,
        );
        var _loc19_: number = _loc5_.rotation / (180 / Math.PI);
        _loc1_.SetAsOrientedBox(
            (_loc5_.scaleX * 5) / this.character_scale,
            (_loc5_.scaleY * 5) / this.character_scale,
            _loc18_,
            _loc19_,
        );
        this.mainShape2 = this.mainBody.CreateShape(_loc1_);
        this._session.contactListener.registerListener(
            ContactListener.RESULT,
            this.mainShape2,
            this.contactMainResultHandler,
        );
        _loc5_ = this.shapeGuide["cartShape"];
        _loc18_ = new b2Vec2(
            this._startX + _loc5_.x / this.character_scale,
            this._startY + _loc5_.y / this.character_scale,
        );
        _loc19_ = _loc5_.rotation / (180 / Math.PI);
        _loc1_.SetAsOrientedBox(
            (_loc5_.scaleX * 5) / this.character_scale,
            (_loc5_.scaleY * 5) / this.character_scale,
            _loc18_,
            _loc19_,
        );
        this.cartShape = this.mainBody.CreateShape(_loc1_);
        this._session.contactListener.registerListener(
            ContactListener.RESULT,
            this.cartShape,
            this.contactResultHandler,
        );
        this._session.contactListener.registerListener(
            ContactListener.ADD,
            this.cartShape,
            this.contactAddHandler,
        );
        _loc5_ = this.shapeGuide["handleShape"];
        _loc18_ = new b2Vec2(
            this._startX + _loc5_.x / this.character_scale,
            this._startY + _loc5_.y / this.character_scale,
        );
        _loc19_ = _loc5_.rotation / (180 / Math.PI);
        _loc1_.SetAsOrientedBox(
            (_loc5_.scaleX * 5) / this.character_scale,
            (_loc5_.scaleY * 5) / this.character_scale,
            _loc18_,
            _loc19_,
        );
        this.handleShape = this.shaftBody.CreateShape(_loc1_);
        _loc1_.filter = this.zeroFilter.Copy();
        _loc1_.filter.groupIndex = -2;
        _loc5_ = this.shapeGuide["seatShape"];
        _loc18_ = new b2Vec2(
            this._startX + _loc5_.x / this.character_scale,
            this._startY + _loc5_.y / this.character_scale,
        );
        _loc19_ = _loc5_.rotation / (180 / Math.PI);
        _loc1_.SetAsOrientedBox(
            (_loc5_.scaleX * 5) / this.character_scale,
            (_loc5_.scaleY * 5) / this.character_scale,
            _loc18_,
            _loc19_,
        );
        this.mainShape3 = this.mainBody.CreateShape(_loc1_);
        this._session.contactListener.registerListener(
            ContactListener.RESULT,
            this.mainShape3,
            this.contactMainResultHandler,
        );
        this._session.contactListener.registerListener(
            ContactListener.ADD,
            this.mainShape3,
            this.contactAddHandler,
        );
        _loc1_.vertexCount = 4;
        _loc6_ = 0;
        while (_loc6_ < 4) {
            _loc23_ = this.shapeGuide["rearVert" + [_loc6_ + 1]];
            _loc1_.vertices[_loc6_] = new b2Vec2(
                this._startX + _loc23_.x / this.character_scale,
                this._startY + _loc23_.y / this.character_scale,
            );
            _loc6_++;
        }
        this.mainShape4 = this.mainBody.CreateShape(_loc1_);
        this._session.contactListener.registerListener(
            ContactListener.RESULT,
            this.mainShape4,
            this.contactMainResultHandler,
        );
        this.mainBody.SetMassFromShapes();
        this.paintVector.push(this.mainBody);
        _loc5_ = this.shapeGuide["shaftShape"];
        _loc18_ = new b2Vec2(
            this._startX + _loc5_.x / this.character_scale,
            this._startY + _loc5_.y / this.character_scale,
        );
        _loc19_ = _loc5_.rotation / (180 / Math.PI);
        _loc1_.SetAsOrientedBox(
            (_loc5_.scaleX * 5) / this.character_scale,
            (_loc5_.scaleY * 5) / this.character_scale,
            _loc18_,
            _loc19_,
        );
        this.shaftShape = this.shaftBody.CreateShape(_loc1_);
        this.shaftBody.SetMassFromShapes();
        this.paintVector.push(this.shaftBody);
        _loc2_.density = 5;
        _loc2_.friction = 1;
        _loc2_.restitution = 0.3;
        _loc2_.filter.categoryBits = 513;
        _loc2_.filter.groupIndex = -2;
        _loc5_ = this.shapeGuide["backWheelShape"];
        _loc10_.position.Set(
            this._startX + _loc5_.x / this.character_scale,
            this._startY + _loc5_.y / this.character_scale,
        );
        _loc10_.angle = _loc5_.rotation / (180 / Math.PI);
        _loc2_.localPosition.Set(0, 0);
        _loc2_.radius = _loc5_.width / 2 / this.character_scale;
        this.backWheelBody = this._session.m_world.CreateBody(_loc10_);
        this.backWheelShape = this.backWheelBody.CreateShape(_loc2_);
        this.backWheelBody.SetMassFromShapes();
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
        _loc5_ = this.shapeGuide["frontWheelShape"];
        _loc11_.position.Set(
            this._startX + _loc5_.x / this.character_scale,
            this._startY + _loc5_.y / this.character_scale,
        );
        _loc11_.angle = _loc5_.rotation / (180 / Math.PI);
        _loc2_.radius = _loc5_.width / 2 / this.character_scale;
        this.frontWheelBody = this._session.m_world.CreateBody(_loc11_);
        this.frontWheelShape = this.frontWheelBody.CreateShape(_loc2_);
        this.frontWheelBody.SetMassFromShapes();
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
        var _loc20_: number = 12 / this.character_scale;
        _loc1_.SetAsOrientedBox(_loc20_, _loc20_, _loc10_.position);
        this.backShockBody = this._session.m_world.CreateBody(_loc12_);
        this.backShockBody.CreateShape(_loc1_);
        this.backShockBody.SetMassFromShapes();
        _loc1_.SetAsOrientedBox(_loc20_, _loc20_, _loc11_.position);
        this.frontShockBody = this._session.m_world.CreateBody(_loc13_);
        this.frontShockBody.CreateShape(_loc1_);
        this.frontShockBody.SetMassFromShapes();
        _loc1_.isSensor = false;
        _loc1_.filter.groupIndex = 0;
        _loc1_.density = 0.25;
        this.groceryBodies = new Array();
        _loc6_ = 0;
        while (_loc6_ < 10) {
            _loc24_ = new b2BodyDef();
            _loc5_ = this.shapeGuide["box" + _loc6_];
            _loc24_.position.Set(
                this._startX + _loc5_.x / this.character_scale,
                this._startY + _loc5_.y / this.character_scale,
            );
            _loc24_.angle = _loc5_.rotation / (180 / Math.PI);
            _loc1_.SetAsBox(
                (_loc5_.scaleX * 5) / this.character_scale,
                (_loc5_.scaleY * 5) / this.character_scale,
            );
            _loc25_ = this._session.m_world.CreateBody(_loc24_);
            _loc25_.CreateShape(_loc1_);
            _loc25_.SetMassFromShapes();
            this.paintVector.push(_loc25_);
            this.groceryBodies.push(_loc25_);
            _loc6_++;
        }
        var _loc21_: b2Body = this.groceryBodies[4];
        this.crackerShape = _loc21_.GetShapeList();
        this._session.contactListener.registerListener(
            ContactListener.RESULT,
            this.crackerShape,
            this.contactResultHandler,
        );
        var _loc22_: b2Body = this.groceryBodies[3];
        this.sodaShape = _loc22_.GetShapeList();
        this._session.contactListener.registerListener(
            ContactListener.RESULT,
            this.sodaShape,
            this.contactResultHandler,
        );
    }

    public override createMovieClips() {
        var _loc7_: MovieClip = null;
        var _loc8_: b2Body = null;
        super.createMovieClips();
        this._session.containerSprite.addChildAt(
            this.pelvisMC,
            this._session.containerSprite.getChildIndex(this.chestMC),
        );
        var _loc1_: MovieClip = this.sourceObject["cartPieces"];
        this._session.particleController.createBMDArray("cart", _loc1_);
        _loc1_ = this.sourceObject["crackers"];
        this._session.particleController.createBMDArray("crackers", _loc1_);
        _loc1_ = this.sourceObject["cola"];
        this._session.particleController.createBMDArray("cola", _loc1_);
        this.shockMC = new Sprite();
        this.mainMC = this.sourceObject["main"];
        var _loc9_ = 1 / this.mc_scale;
        this.mainMC.scaleY = 1 / this.mc_scale;
        this.mainMC.scaleX = _loc9_;
        this.backWheelMC = this.sourceObject["backWheel"];
        _loc9_ = 1 / this.mc_scale;
        this.backWheelMC.scaleY = 1 / this.mc_scale;
        this.backWheelMC.scaleX = _loc9_;
        this.frontWheelMC = this.sourceObject["frontWheel"];
        _loc9_ = 1 / this.mc_scale;
        this.frontWheelMC.scaleY = 1 / this.mc_scale;
        this.frontWheelMC.scaleX = _loc9_;
        this.shaftMC = this.sourceObject["shaft"];
        _loc9_ = 1 / this.mc_scale;
        this.shaftMC.scaleY = 1 / this.mc_scale;
        this.shaftMC.scaleX = _loc9_;
        this.mainFrontMC = this.sourceObject["mainFront"];
        _loc9_ = 1 / this.mc_scale;
        this.mainFrontMC.scaleY = 1 / this.mc_scale;
        this.mainFrontMC.scaleX = _loc9_;
        this.mainFrontMC.visible = false;
        this.mainBaseMC = this.sourceObject["mainBase"];
        _loc9_ = 1 / this.mc_scale;
        this.mainBaseMC.scaleY = 1 / this.mc_scale;
        this.mainBaseMC.scaleX = _loc9_;
        this.mainBaseMC.visible = false;
        this.mainSeatMC = this.sourceObject["mainSeat"];
        _loc9_ = 1 / this.mc_scale;
        this.mainSeatMC.scaleY = 1 / this.mc_scale;
        this.mainSeatMC.scaleX = _loc9_;
        this.mainSeatMC.visible = false;
        this.mainRearMC = this.sourceObject["mainRear"];
        _loc9_ = 1 / this.mc_scale;
        this.mainRearMC.scaleY = 1 / this.mc_scale;
        this.mainRearMC.scaleX = _loc9_;
        this.mainRearMC.visible = false;
        var _loc2_: b2Vec2 = this.mainBody.GetLocalCenter();
        _loc2_ = new b2Vec2(
            (this._startX - _loc2_.x) * this.character_scale,
            (this._startY - _loc2_.y) * this.character_scale,
        );
        var _loc3_: MovieClip = this.shapeGuide["rearVert4"];
        var _loc4_ = new b2Vec2(_loc3_.x + _loc2_.x, _loc3_.y + _loc2_.y);
        // @ts-expect-error
        this.mainMC.inner.x = _loc4_.x;
        // @ts-expect-error
        this.mainMC.inner.y = _loc4_.y;
        _loc2_ = this.shaftBody.GetLocalCenter();
        _loc2_ = new b2Vec2(
            (this._startX - _loc2_.x) * this.character_scale,
            (this._startY - _loc2_.y) * this.character_scale,
        );
        _loc3_ = this.shapeGuide["shaftShape"];
        _loc4_ = new b2Vec2(_loc3_.x + _loc2_.x, _loc3_.y + _loc2_.y);
        // @ts-expect-error
        this.shaftMC.inner.x = _loc4_.x;
        // @ts-expect-error
        this.shaftMC.inner.y = _loc4_.y;
        this.mainBody.SetUserData(this.mainMC);
        this.backWheelBody.SetUserData(this.backWheelMC);
        this.frontWheelBody.SetUserData(this.frontWheelMC);
        this.shaftBody.SetUserData(this.shaftMC);
        this._session.containerSprite.addChildAt(
            this.shockMC,
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
            this.shaftMC,
            this._session.containerSprite.getChildIndex(this.pelvisMC),
        );
        this._session.containerSprite.addChildAt(
            this.mainMC,
            this._session.containerSprite.getChildIndex(this.pelvisMC),
        );
        this._session.containerSprite.addChildAt(
            this.mainBaseMC,
            this._session.containerSprite.getChildIndex(this.pelvisMC),
        );
        this._session.containerSprite.addChildAt(
            this.mainFrontMC,
            this._session.containerSprite.getChildIndex(this.pelvisMC),
        );
        this._session.containerSprite.addChildAt(
            this.mainRearMC,
            this._session.containerSprite.getChildIndex(this.pelvisMC),
        );
        this._session.containerSprite.addChildAt(
            this.mainSeatMC,
            this._session.containerSprite.getChildIndex(this.pelvisMC),
        );
        this.groceryMCs = new Array();
        var _loc5_: number = 0;
        while (_loc5_ < 10) {
            _loc7_ = this.sourceObject["box" + _loc5_];
            _loc9_ = 1 / this.mc_scale;
            _loc7_.scaleY = 1 / this.mc_scale;
            _loc7_.scaleX = _loc9_;
            _loc8_ = this.groceryBodies[_loc5_];
            _loc8_.SetUserData(_loc7_);
            this.groceryMCs.push(_loc7_);
            this._session.containerSprite.addChildAt(
                _loc7_,
                this._session.containerSprite.getChildIndex(this.mainMC),
            );
            _loc5_++;
        }
        this.cartMC = new Sprite();
        _loc9_ = 1 / this.mc_scale;
        this.cartMC.scaleY = 1 / this.mc_scale;
        this.cartMC.scaleX = _loc9_;
        // @ts-expect-error
        var _loc6_: Sprite = this.mainMC.inner.cart;
        this.cartMC.addChild(_loc6_);
        // @ts-expect-error
        _loc6_.x += this.mainMC.inner.x;
        // @ts-expect-error
        _loc6_.y += this.mainMC.inner.y;
        this._session.containerSprite.addChildAt(
            this.cartMC,
            this._session.containerSprite.getChildIndex(this.lowerArm1MC) + 1,
        );
    }

    public override resetMovieClips() {
        var _loc3_: b2Body = null;
        var _loc4_: MovieClip = null;
        super.resetMovieClips();
        this.mainFrontMC.visible = false;
        this.mainBaseMC.visible = false;
        this.mainSeatMC.visible = false;
        this.mainRearMC.visible = false;
        this.mainMC.visible = true;
        this.cartMC.visible = true;
        this.mainBody.SetUserData(this.mainMC);
        this.backWheelBody.SetUserData(this.backWheelMC);
        this.frontWheelBody.SetUserData(this.frontWheelMC);
        this.shaftBody.SetUserData(this.shaftMC);
        this.shockMC.graphics.clear();
        var _loc1_: number = 0;
        while (_loc1_ < 10) {
            _loc3_ = this.groceryBodies[_loc1_];
            _loc4_ = this.groceryMCs[_loc1_];
            _loc3_.SetUserData(_loc4_);
            _loc4_.visible = true;
            _loc4_.gotoAndStop(1);
            _loc1_++;
        }
        var _loc2_: MovieClip = this.sourceObject["cartPieces"];
        this._session.particleController.createBMDArray("cart", _loc2_);
        _loc2_ = this.sourceObject["crackers"];
        this._session.particleController.createBMDArray("crackers", _loc2_);
        _loc2_ = this.sourceObject["cola"];
        this._session.particleController.createBMDArray("cola", _loc2_);
    }

    public override createJoints() {
        var _loc1_: number = NaN;
        var _loc2_: number = NaN;
        var _loc3_: number = NaN;
        super.createJoints();
        var _loc4_: number = 180 / Math.PI;
        _loc1_ = this.upperLeg1Body.GetAngle() - this.pelvisBody.GetAngle();
        _loc2_ = -80 / _loc4_ - _loc1_;
        _loc3_ = -75 / _loc4_ - _loc1_;
        _loc1_ = this.upperLeg2Body.GetAngle() - this.pelvisBody.GetAngle();
        _loc2_ = -80 / _loc4_ - _loc1_;
        _loc3_ = -75 / _loc4_ - _loc1_;
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
        var _loc7_: MovieClip = this.shapeGuide["backWheelShape"];
        _loc6_.Set(
            this._startX + _loc7_.x / this.character_scale,
            this._startY + _loc7_.y / this.character_scale,
        );
        _loc5_.Initialize(
            this.mainBody,
            this.backShockBody,
            _loc6_,
            new b2Vec2(0, 1),
        );
        this.backShockJoint = this._session.m_world.CreateJoint(
            _loc5_,
        ) as b2PrismaticJoint;
        _loc7_ = this.shapeGuide["frontWheelShape"];
        _loc6_.Set(
            this._startX + _loc7_.x / this.character_scale,
            this._startY + _loc7_.y / this.character_scale,
        );
        _loc5_.Initialize(
            this.mainBody,
            this.frontShockBody,
            _loc6_,
            new b2Vec2(0, 1),
        );
        this.frontShockJoint = this._session.m_world.CreateJoint(
            _loc5_,
        ) as b2PrismaticJoint;
        var _loc8_ = new b2RevoluteJointDef();
        _loc8_.maxMotorTorque = this.maxTorque;
        _loc8_.enableLimit = true;
        _loc8_.lowerAngle = 0;
        _loc8_.upperAngle = 0;
        _loc6_ = new b2Vec2();
        _loc7_ = this.shapeGuide["shaftAnchor"];
        _loc6_.Set(
            this._startX + _loc7_.x / this.character_scale,
            this._startY + _loc7_.y / this.character_scale,
        );
        _loc8_.Initialize(this.mainBody, this.shaftBody, _loc6_);
        this.mainShaft = this._session.m_world.CreateJoint(
            _loc8_,
        ) as b2RevoluteJoint;
        if (this._session.version >= 1.11) {
            _loc8_.enableLimit = false;
        }
        _loc6_.Set(
            this.pelvisBody.GetPosition().x,
            this.pelvisBody.GetPosition().y,
        );
        _loc8_.Initialize(this.mainBody, this.pelvisBody, _loc6_);
        this.mainPelvis = this._session.m_world.CreateJoint(
            _loc8_,
        ) as b2RevoluteJoint;
        this.mainPelvisJointDef = _loc8_.clone();
        this.pelvisAnchorPoint = this.mainBody.GetLocalPoint(_loc6_);
        _loc8_.enableLimit = false;
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
        _loc8_.Initialize(this.mainBody, this.lowerArm1Body, _loc6_);
        this.mainHand1 = this._session.m_world.CreateJoint(
            _loc8_,
        ) as b2RevoluteJoint;
        this.mainHand1JointDef = _loc8_.clone();
        this.handleAnchorPoint = this.mainBody.GetLocalPoint(_loc6_);
        _loc8_.Initialize(this.mainBody, this.lowerArm2Body, _loc6_);
        this.mainHand2 = this._session.m_world.CreateJoint(
            _loc8_,
        ) as b2RevoluteJoint;
        this.mainHand2JointDef = _loc8_.clone();
        _loc6_.Set(
            this.upperLeg1Body.GetPosition().x,
            this.upperLeg1Body.GetPosition().y,
        );
        _loc8_.Initialize(this.mainBody, this.upperLeg1Body, _loc6_);
        this.mainLeg1 = this._session.m_world.CreateJoint(
            _loc8_,
        ) as b2RevoluteJoint;
        this.mainLeg1JointDef = _loc8_.clone();
        this.leg1AnchorPoint = this.mainBody.GetLocalPoint(_loc6_);
        _loc6_.Set(
            this.upperLeg2Body.GetPosition().x,
            this.upperLeg2Body.GetPosition().y,
        );
        _loc8_.Initialize(this.mainBody, this.upperLeg2Body, _loc6_);
        this.mainLeg2 = this._session.m_world.CreateJoint(
            _loc8_,
        ) as b2RevoluteJoint;
        this.mainLeg2JointDef = _loc8_.clone();
        this.leg2AnchorPoint = this.mainBody.GetLocalPoint(_loc6_);
        _loc7_ = this.shapeGuide["sausageAnchor1"];
        _loc6_.Set(
            this._startX + _loc7_.x / this.character_scale,
            this._startY + _loc7_.y / this.character_scale,
        );
        _loc8_.Initialize(this.groceryBodies[7], this.groceryBodies[8], _loc6_);
        this._session.m_world.CreateJoint(_loc8_) as b2RevoluteJoint;
        _loc7_ = this.shapeGuide["sausageAnchor2"];
        _loc6_.Set(
            this._startX + _loc7_.x / this.character_scale,
            this._startY + _loc7_.y / this.character_scale,
        );
        _loc8_.Initialize(this.groceryBodies[8], this.groceryBodies[9], _loc6_);
        this._session.m_world.CreateJoint(_loc8_) as b2RevoluteJoint;
    }

    protected contactMainResultHandler(param1: ContactEvent) {
        var _loc2_: number = param1.impulse;
        if (_loc2_ > this.contactImpulseDict.get(this.mainShape1)) {
            if (this.contactResultBuffer.get(this.mainShape1)) {
                if (
                    _loc2_ >
                    this.contactResultBuffer.get(this.mainShape1).impulse
                ) {
                    this.contactResultBuffer.set(this.mainShape1, param1);
                }
            } else {
                this.contactResultBuffer.set(this.mainShape1, param1);
            }
        }
    }

    protected override handleContactResults() {
        var _loc1_: ContactEvent = null;
        super.handleContactResults();
        if (this.contactResultBuffer.get(this.cartShape)) {
            _loc1_ = this.contactResultBuffer.get(this.cartShape);
            this.cartSmash(_loc1_.impulse);
            this.contactResultBuffer.delete(this.cartShape);
            this.contactAddBuffer.delete(this.cartShape);
            this.contactAddBuffer.delete(this.mainShape3);
        }
        if (this.contactResultBuffer.get(this.mainShape1)) {
            _loc1_ = this.contactResultBuffer.get(this.mainShape1);
            this.mainSmash(_loc1_.impulse);
            this.contactResultBuffer.delete(this.mainShape1);
        }
        if (this.contactResultBuffer.get(this.crackerShape)) {
            _loc1_ = this.contactResultBuffer.get(this.crackerShape);
            this.crackerSmash(_loc1_.impulse);
            this.contactResultBuffer.delete(this.crackerShape);
        }
        if (this.contactResultBuffer.get(this.sodaShape)) {
            _loc1_ = this.contactResultBuffer.get(this.sodaShape);
            this.colaSmash(_loc1_.impulse);
            this.contactResultBuffer.delete(this.sodaShape);
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
        var _loc1_: b2World = this._session.m_world;
        if (this.mainPelvis) {
            _loc1_.DestroyJoint(this.mainPelvis);
            this.mainPelvis = null;
        }
        if (this.mainHand1) {
            _loc1_.DestroyJoint(this.mainHand1);
            this.mainHand1 = null;
        }
        if (this.mainHand2) {
            _loc1_.DestroyJoint(this.mainHand2);
            this.mainHand2 = null;
        }
        if (this.mainLeg1) {
            trace("ref ang " + this.mainLeg1.m_referenceAngle);
            _loc1_.DestroyJoint(this.mainLeg1);
            this.mainLeg1 = null;
        }
        if (this.mainLeg2) {
            _loc1_.DestroyJoint(this.mainLeg2);
            this.mainLeg2 = null;
        }
        var _loc2_: b2FilterData = this.zeroFilter.Copy();
        _loc2_.groupIndex = -2;
        this.frontWheelBody.GetShapeList().SetFilterData(_loc2_);
        this.backWheelBody.GetShapeList().SetFilterData(_loc2_);
        _loc1_.Refilter(this.frontWheelBody.GetShapeList());
        _loc1_.Refilter(this.backWheelBody.GetShapeList());
        this.backShockJoint.EnableMotor(false);
        this.frontShockJoint.EnableMotor(false);
        this.backShockJoint.SetLimits(0, 0);
        this.frontShockJoint.SetLimits(0, 0);
        this.backShockJoint.SetMotorSpeed(0);
        this.frontShockJoint.SetMotorSpeed(0);
        var _loc3_: b2Shape = this.mainBody.GetShapeList();
        while (_loc3_) {
            _loc3_.SetFilterData(_loc2_);
            _loc1_.Refilter(_loc3_);
            _loc3_ = _loc3_.m_next;
        }
        _loc3_ = this.shaftBody.GetShapeList();
        while (_loc3_) {
            _loc3_.SetFilterData(this.zeroFilter);
            _loc1_.Refilter(_loc3_);
            _loc3_ = _loc3_.m_next;
        }
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
            this.backWheelJoint.EnableMotor(false);
            this.frontWheelJoint.EnableMotor(false);
            if (this.voiceSound) {
                this.voiceSound.stopSound();
                this.voiceSound = null;
            }
        }
    }

    public checkEject() {
        if (
            !this.mainHand1 &&
            !this.mainHand2 &&
            !this.mainLeg1 &&
            !this.mainLeg2
        ) {
            this.eject();
        }
    }

    protected cartSmash(param1: number, param2: boolean = true) {
        trace(
            this.tag +
            " cart impulse " +
            param1 +
            " -> " +
            this._session.iteration,
        );
        this.contactImpulseDict.delete(this.cartShape);
        this._session.contactListener.deleteListener(
            ContactListener.RESULT,
            this.cartShape,
        );
        this._session.contactListener.deleteListener(
            ContactListener.ADD,
            this.cartShape,
        );
        this.mainBody.DestroyShape(this.cartShape);
        this.cartMC.visible = false;
        var _loc3_: b2Vec2 = this.mainBody.GetLocalCenter();
        var _loc4_: b2Vec2 = this.mainBody.GetWorldPoint(
            new b2Vec2(
                _loc3_.x + 35 / this.m_physScale,
                _loc3_.y + -15 / this.m_physScale,
            ),
        );
        this._session.particleController.createPointBurst(
            "cart",
            _loc4_.x * this.m_physScale,
            _loc4_.y * this.m_physScale,
            30,
            30,
            20,
        );
        if (param2) {
            SoundController.instance.playAreaSoundInstance(
                "MetalSmashLight",
                this.mainBody,
            );
        }
    }

    protected crackerSmash(param1: number) {
        trace(
            this.tag +
            " cracker impulse " +
            param1 +
            " -> " +
            this._session.iteration,
        );
        this.contactImpulseDict.delete(this.crackerShape);
        this._session.contactListener.deleteListener(
            ContactListener.RESULT,
            this.crackerShape,
        );
        var _loc2_: b2Body = this.groceryBodies[4];
        var _loc3_: Sprite = this.groceryMCs[4];
        _loc3_.visible = false;
        var _loc4_: b2Vec2 = _loc2_.GetWorldCenter();
        this._session.m_world.DestroyBody(_loc2_);
        this._session.particleController.createPointBurst(
            "crackers",
            _loc4_.x * this.m_physScale,
            _loc4_.y * this.m_physScale,
            30,
            30,
            40,
        );
    }

    protected colaSmash(param1: number) {
        trace(
            this.tag +
            " cola impulse " +
            param1 +
            " -> " +
            this._session.iteration,
        );
        this.contactImpulseDict.delete(this.sodaShape);
        this._session.contactListener.deleteListener(
            ContactListener.RESULT,
            this.sodaShape,
        );
        var _loc2_: b2Body = this.groceryBodies[3];
        var _loc3_: MovieClip = this.groceryMCs[3];
        _loc3_.gotoAndStop(2);
        var _loc4_: b2Vec2 = _loc2_.GetWorldCenter();
        this._session.particleController.createFlow(
            "cola",
            2.5,
            4,
            _loc2_,
            new b2Vec2(0, -10 / this.m_physScale),
            270,
            300,
        );
    }

    protected mainSmash(param1: number) {
        trace(
            this.tag +
            " main impulse " +
            param1 +
            " -> " +
            this._session.iteration,
        );
        this.contactImpulseDict.delete(this.mainShape1);
        var _loc2_: ContactListener = this._session.contactListener;
        _loc2_.deleteListener(ContactListener.RESULT, this.mainShape1);
        _loc2_.deleteListener(ContactListener.RESULT, this.mainShape2);
        _loc2_.deleteListener(ContactListener.RESULT, this.mainShape3);
        _loc2_.deleteListener(ContactListener.ADD, this.mainShape3);
        _loc2_.deleteListener(ContactListener.RESULT, this.mainShape4);
        this.eject();
        this.mainSmashed = true;
        if (this.cartShape.m_body) {
            this.cartSmash(100, false);
        }
        var _loc3_: b2World = this._session.m_world;
        var _loc4_: b2Vec2 = this.mainBody.GetPosition();
        var _loc5_: number = this.mainBody.GetAngle();
        var _loc6_: b2Vec2 = this.mainBody.GetLinearVelocity();
        var _loc7_: number = this.mainBody.GetAngularVelocity();
        var _loc8_ = new b2BodyDef();
        _loc8_.position = _loc4_;
        _loc8_.angle = _loc5_;
        var _loc9_ = new b2PolygonDef();
        _loc9_.density = 4;
        _loc9_.friction = 0.3;
        _loc9_.restitution = 0.1;
        _loc9_.filter = this.zeroFilter;
        var _loc10_: b2Body = _loc3_.CreateBody(_loc8_);
        _loc10_.SetLinearVelocity(_loc6_);
        _loc10_.SetAngularVelocity(_loc7_);
        var _loc11_: b2Body = _loc3_.CreateBody(_loc8_);
        _loc11_.SetLinearVelocity(_loc6_);
        _loc11_.SetAngularVelocity(_loc7_);
        var _loc12_: b2Body = _loc3_.CreateBody(_loc8_);
        _loc12_.SetLinearVelocity(_loc6_);
        _loc12_.SetAngularVelocity(_loc7_);
        var _loc13_: b2Body = _loc3_.CreateBody(_loc8_);
        _loc13_.SetLinearVelocity(_loc6_);
        _loc13_.SetAngularVelocity(_loc7_);
        var _loc14_: b2PolygonShape =
            this.mainBody.GetShapeList() as b2PolygonShape;
        var _loc15_: any[] = _loc14_.GetVertices();
        _loc9_.vertexCount = 4;
        _loc9_.vertices = _loc15_;
        _loc10_.CreateShape(_loc9_);
        _loc10_.SetMassFromShapes();
        _loc14_ = _loc14_.GetNext() as b2PolygonShape;
        _loc15_ = _loc14_.GetVertices();
        _loc9_.vertices = _loc15_;
        _loc11_.CreateShape(_loc9_);
        _loc11_.SetMassFromShapes();
        _loc14_ = _loc14_.GetNext() as b2PolygonShape;
        _loc15_ = _loc14_.GetVertices();
        _loc9_.vertices = _loc15_;
        _loc12_.CreateShape(_loc9_);
        _loc12_.SetMassFromShapes();
        _loc14_ = _loc14_.GetNext() as b2PolygonShape;
        _loc15_ = _loc14_.GetVertices();
        _loc9_.vertices = _loc15_;
        _loc13_.CreateShape(_loc9_);
        _loc13_.SetMassFromShapes();
        _loc3_.DestroyBody(this.mainBody);
        _loc3_.DestroyBody(this.frontShockBody);
        _loc3_.DestroyBody(this.backShockBody);
        this.mainFrontMC.visible = true;
        _loc13_.SetUserData(this.mainFrontMC);
        this.paintVector.push(_loc13_);
        this.mainSeatMC.visible = true;
        _loc11_.SetUserData(this.mainSeatMC);
        this.paintVector.push(_loc11_);
        this.mainRearMC.visible = true;
        _loc10_.SetUserData(this.mainRearMC);
        this.paintVector.push(_loc10_);
        this.mainBaseMC.visible = true;
        _loc12_.SetUserData(this.mainBaseMC);
        this.paintVector.push(_loc12_);
        this.mainMC.visible = false;
        this.shockMC.graphics.clear();
        SoundController.instance.playAreaSoundInstance(
            "MetalSmashHeavy",
            this.mainBody,
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

    public override elbowBreak1(param1: number) {
        super.elbowBreak1(param1);
        if (this.ejected) {
            return;
        }
        if (this.mainHand1) {
            this._session.m_world.DestroyJoint(this.mainHand1);
            this.mainHand1 = null;
        }
        this.checkEject();
    }

    public override elbowBreak2(param1: number) {
        super.elbowBreak2(param1);
        if (this.ejected) {
            return;
        }
        if (this.mainHand2) {
            this._session.m_world.DestroyJoint(this.mainHand2);
            this.mainHand2 = null;
        }
        this.checkEject();
    }

    public override kneeBreak1(param1: number) {
        super.kneeBreak1(param1);
        if (this.ejected) {
            return;
        }
        if (this.mainLeg1) {
            this._session.m_world.DestroyJoint(this.mainLeg1);
            this.mainLeg1 = null;
        }
        this.checkEject();
    }

    public override kneeBreak2(param1: number) {
        super.kneeBreak2(param1);
        if (this.ejected) {
            return;
        }
        if (this.mainLeg2) {
            this._session.m_world.DestroyJoint(this.mainLeg2);
            this.mainLeg2 = null;
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