import b2ContactPoint from "@/Box2D/Collision/b2ContactPoint";
import b2CircleDef from "@/Box2D/Collision/Shapes/b2CircleDef";
import b2CircleShape from "@/Box2D/Collision/Shapes/b2CircleShape";
import b2PolygonDef from "@/Box2D/Collision/Shapes/b2PolygonDef";
import b2PolygonShape from "@/Box2D/Collision/Shapes/b2PolygonShape";
import b2Shape from "@/Box2D/Collision/Shapes/b2Shape";
import b2Math from "@/Box2D/Common/Math/b2Math";
import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import b2Body from "@/Box2D/Dynamics/b2Body";
import b2BodyDef from "@/Box2D/Dynamics/b2BodyDef";
import b2World from "@/Box2D/Dynamics/b2World";
import b2DistanceJoint from "@/Box2D/Dynamics/Joints/b2DistanceJoint";
import b2DistanceJointDef from "@/Box2D/Dynamics/Joints/b2DistanceJointDef";
import b2PrismaticJoint from "@/Box2D/Dynamics/Joints/b2PrismaticJoint";
import b2PrismaticJointDef from "@/Box2D/Dynamics/Joints/b2PrismaticJointDef";
import b2RevoluteJoint from "@/Box2D/Dynamics/Joints/b2RevoluteJoint";
import b2RevoluteJointDef from "@/Box2D/Dynamics/Joints/b2RevoluteJointDef";
import ContactListener from "@/com/totaljerkface/game/ContactListener";
import ContactEvent from "@/com/totaljerkface/game/events/ContactEvent";
import KeyDisplay from "@/com/totaljerkface/game/KeyDisplay";
import SnowSpray from "@/com/totaljerkface/game/particles/SnowSpray";
import Session from "@/com/totaljerkface/game/Session";
import SessionCharacterMenu from "@/com/totaljerkface/game/SessionCharacterMenu";
import AreaSoundLoop from "@/com/totaljerkface/game/sound/AreaSoundLoop";
import SoundController from "@/com/totaljerkface/game/sound/SoundController";
import ChristmasBellMC from "@/top/ChristmasBellMC";
import DisplayObject from "flash/display/DisplayObject";
import MovieClip from "flash/display/MovieClip";
import Sprite from "flash/display/Sprite";
import Event from "flash/events/Event";
// import BevelFilter from "flash/filters/BevelFilter";
import CharacterB2D from "@/com/totaljerkface/game/character/CharacterB2D";
import SleighElf from "@/com/totaljerkface/game/character/SleighElf";
import { boundClass } from 'autobind-decorator';

@boundClass
export default class SantaClaus extends CharacterB2D {
    protected elf1: SleighElf;
    protected elf2: SleighElf;
    protected ejected: boolean;
    protected ejectImpulse: number = 0;
    protected frontContacts: number = 0;
    protected backContacts: number = 0;
    public wheelMaxSpeed: number = 30;
    public accelStep: number = 1.25;
    public maxTorque: number = 100000;
    public gravityDisplacement: number = -0.3333333333333333;
    protected helmetSmashLimit: number = 2;
    protected sleighSmashLimit: number = 200;
    protected impulseLeft: number = 1.3;
    protected impulseRight: number = 1.7;
    protected impulseOffset: number = 1;
    protected maxSpinAV: number = 3.5;
    protected pumpCounter: number = 0;
    public wheelRadius: number;
    protected wheelMultiplier: number;
    protected wheelCurrentSpeed: number;
    protected wheelNewSpeed: number;
    protected pelvisAnchorPoint: b2Vec2;
    protected leg1AnchorPoint: b2Vec2;
    protected leg2AnchorPoint: b2Vec2;
    public antiGravArray: any[];
    private boostVal: number = 0;
    private boostMax: number = 50;
    private boostStepUp: number = 0.5;
    private boostStepDown: number = 0.5;
    private boostMeter: Sprite;
    private boostHolder: Sprite;
    protected snowSpray: SnowSpray;
    public sleighBody: b2Body;
    protected frontWheelBody: b2Body;
    protected midWheel1Body: b2Body;
    protected midWheel2Body: b2Body;
    protected backWheelBody: b2Body;
    protected reignsBody: b2Body;
    protected helmetBody: b2Body;
    protected boxBodies: any[];
    protected helmetShape: b2Shape;
    protected rearShape: b2PolygonShape;
    protected backShape: b2PolygonShape;
    protected skiShape: b2PolygonShape;
    protected seatShape: b2PolygonShape;
    protected frontShape: b2PolygonShape;
    protected bumperShape: b2CircleShape;
    protected baseShape: b2PolygonShape;
    protected stem1Shape: b2PolygonShape;
    protected stem2Shape: b2PolygonShape;
    protected stem3Shape: b2PolygonShape;
    protected backWheelShape: b2Shape;
    protected midWheel1Shape: b2Shape;
    protected midWheel2Shape: b2Shape;
    protected frontWheelShape: b2Shape;
    protected helmetMC: MovieClip;
    protected sleighMC: MovieClip;
    protected strapsSprite: Sprite;
    protected brokenSleighMCs: any[];
    protected brokenSkiMCs: any[];
    protected boxMCs: any[];
    protected bells: any[];
    protected stemMC: MovieClip;
    protected sleighPelvis: b2RevoluteJoint;
    protected sleighFoot1: b2RevoluteJoint;
    protected sleighFoot2: b2RevoluteJoint;
    protected sleighReigns: b2PrismaticJoint;
    protected reignsHand1: b2RevoluteJoint;
    protected reignsHand2: b2RevoluteJoint;
    protected frontWheelJoint: b2RevoluteJoint;
    protected midWheel1Joint: b2RevoluteJoint;
    protected midWheel2Joint: b2RevoluteJoint;
    protected backWheelJoint: b2RevoluteJoint;
    protected strapHeadJoints: any[];
    protected strapChest1Joints: any[];
    protected strapChest2Joints: any[];
    protected vertsBrokenSleigh: any[];
    protected vertsBrokenSki: any[];
    protected vertsBrokenStem: any[];
    protected newBaseVerts: any[];
    protected skiLoop: AreaSoundLoop;
    protected sleighBellLoop: AreaSoundLoop;

    constructor(
        param1: number,
        param2: number,
        param3: DisplayObject,
        param4: Session,
    ) {
        super(param1, param2, param3, param4, -1, "Santa");
        this.shapeRefScale = 50;
        this.elf1 = new SleighElf(
            param1,
            param2,
            param3["elf1"],
            param4,
            -2,
            "Elf1",
            this,
            35,
        );
        this.elf2 = new SleighElf(
            param1,
            param2,
            param3["elf2"],
            param4,
            -4,
            "Elf1",
            this,
            70,
        );
    }

    public override set session(param1: Session) {
        this._session = param1;
        if (this.elf1) {
            this.elf1.session = this._session;
        }
        if (this.elf2) {
            this.elf2.session = this._session;
        }
    }

    public override checkKeyStates() {
        super.checkKeyStates();
        this.checkElfKeys(this.elf1);
        this.checkElfKeys(this.elf2);
    }

    private checkElfKeys(param1: SleighElf) {
        if (!param1.dead) {
            if (param1.userVehicle) {
                param1.userVehicle.operateKeys(
                    this._session.iteration,
                    this.leftPressed,
                    this.rightPressed,
                    this.upPressed,
                    this.downPressed,
                    this.spacePressed,
                    this.shiftPressed,
                    this.ctrlPressed,
                    this.zPressed,
                );
            } else {
                if (this.leftPressed) {
                    if (this.rightPressed) {
                        param1.leftAndRightActions();
                    } else {
                        param1.leftPressedActions();
                    }
                } else if (this.rightPressed) {
                    param1.rightPressedActions();
                } else {
                    param1.leftAndRightActions();
                }
                if (this.upPressed) {
                    if (this.downPressed) {
                        param1.upAndDownActions();
                    } else {
                        param1.upPressedActions();
                    }
                } else if (this.downPressed) {
                    param1.downPressedActions();
                } else {
                    param1.upAndDownActions();
                }
                if (this.spacePressed) {
                    param1.spacePressedActions();
                } else {
                    param1.spaceNullActions();
                }
                if (this.shiftPressed) {
                    param1.shiftPressedActions();
                } else {
                    param1.shiftNullActions();
                }
                if (this.ctrlPressed) {
                    param1.ctrlPressedActions();
                } else {
                    param1.ctrlNullActions();
                }
                if (this.zPressed) {
                    param1.zPressedActions();
                } else {
                    param1.zNullActions();
                }
            }
        }
    }

    public override checkReplayData(param1: KeyDisplay, param2: string) {
        super.checkReplayData(param1, param2);
        this.checkElfReplayData(param1, param2, this.elf1);
        this.checkElfReplayData(param1, param2, this.elf2);
    }

    private checkElfReplayData(
        param1: KeyDisplay,
        param2: string,
        param3: SleighElf,
    ) {
        if (!param3.dead) {
            if (param3.userVehicle) {
                param3.userVehicle.operateReplayData(
                    this._session.iteration,
                    param2,
                );
            } else {
                if (param2.charAt(0) == "1") {
                    if (param2.charAt(1) == "1") {
                        param3.leftAndRightActions();
                    } else {
                        param3.leftPressedActions();
                    }
                } else if (param2.charAt(1) == "1") {
                    param3.rightPressedActions();
                } else {
                    param3.leftAndRightActions();
                }
                if (param2.charAt(2) == "1") {
                    if (param2.charAt(3) == "1") {
                        param3.upAndDownActions();
                    } else {
                        param3.upPressedActions();
                    }
                } else if (param2.charAt(3) == "1") {
                    param3.downPressedActions();
                } else {
                    param3.upAndDownActions();
                }
                if (param2.charAt(4) == "1") {
                    param3.spacePressedActions();
                } else {
                    param3.spaceNullActions();
                }
                if (param2.charAt(5) == "1") {
                    param3.shiftPressedActions();
                } else {
                    param3.shiftNullActions();
                }
                if (param2.charAt(6) == "1") {
                    param3.ctrlPressedActions();
                } else {
                    param3.ctrlNullActions();
                }
                if (param2.charAt(7) == "1") {
                    param3.zPressedActions();
                } else {
                    param3.zNullActions();
                }
            }
        }
    }

    protected override switchCamera() {
        if (this._session.camera.focus == this.cameraFocus) {
            this._session.camera.focus = this.elf1.cameraFocus;
        } else if (this._session.camera.focus == this.elf1.cameraFocus) {
            this._session.camera.focus = this.elf2.cameraFocus;
        } else {
            this._session.camera.focus = this.cameraFocus;
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
            _loc1_ = this.sleighBody.GetAngle();
            _loc2_ = this.sleighBody.GetAngularVelocity();
            _loc3_ = (_loc2_ + this.maxSpinAV) / this.maxSpinAV;
            if (_loc3_ < 0) {
                _loc3_ = 0;
            }
            if (_loc3_ > 1) {
                _loc3_ = 1;
            }
            _loc4_ = Math.cos(_loc1_) * this.impulseLeft * _loc3_;
            _loc5_ = Math.sin(_loc1_) * this.impulseLeft * _loc3_;
            _loc6_ = this.sleighBody.GetLocalCenter();
            this.sleighBody.ApplyImpulse(
                new b2Vec2(_loc5_, -_loc4_),
                this.sleighBody.GetWorldPoint(
                    new b2Vec2(_loc6_.x + this.impulseOffset, _loc6_.y),
                ),
            );
            this.sleighBody.ApplyImpulse(
                new b2Vec2(-_loc5_, _loc4_),
                this.sleighBody.GetWorldPoint(
                    new b2Vec2(_loc6_.x - this.impulseOffset, _loc6_.y),
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
            _loc1_ = this.sleighBody.GetAngle();
            _loc2_ = this.sleighBody.GetAngularVelocity();
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
            _loc7_ = this.sleighBody.GetLocalCenter();
            this.sleighBody.ApplyImpulse(
                new b2Vec2(-_loc6_, _loc5_),
                this.sleighBody.GetWorldPoint(
                    new b2Vec2(_loc7_.x + this.impulseOffset, _loc7_.y),
                ),
            );
            this.sleighBody.ApplyImpulse(
                new b2Vec2(_loc6_, -_loc5_),
                this.sleighBody.GetWorldPoint(
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
                this.midWheel1Joint.EnableMotor(true);
                this.midWheel2Joint.EnableMotor(true);
                this.frontWheelJoint.EnableMotor(true);
                if (this.sleighReigns) {
                    this.sleighReigns.EnableMotor(true);
                    this.pumpCounter = 0;
                }
            }
            this.wheelCurrentSpeed = this.midWheel1Joint.GetJointSpeed();
            if (this.wheelCurrentSpeed < 0) {
                this.wheelNewSpeed = 0;
            } else {
                this.wheelNewSpeed =
                    this.wheelCurrentSpeed < this.wheelMaxSpeed
                        ? this.wheelCurrentSpeed + this.accelStep
                        : this.wheelCurrentSpeed;
            }
            this.backWheelJoint.SetMotorSpeed(this.wheelNewSpeed);
            this.midWheel1Joint.SetMotorSpeed(this.wheelNewSpeed);
            this.midWheel2Joint.SetMotorSpeed(this.wheelNewSpeed);
            this.frontWheelJoint.SetMotorSpeed(this.wheelNewSpeed);
            if (this.sleighReigns) {
                this.sleighReigns.SetMotorSpeed(Math.sin(this.pumpCounter) * 6);
                this.pumpCounter += 0.6;
            }
        }
    }

    public override downPressedActions() {
        if (this.ejected) {
            this.currentPose = 4;
        } else {
            if (!this.backWheelJoint.IsMotorEnabled()) {
                this.backWheelJoint.EnableMotor(true);
                this.midWheel1Joint.EnableMotor(true);
                this.midWheel2Joint.EnableMotor(true);
                this.frontWheelJoint.EnableMotor(true);
                if (this.sleighReigns) {
                    this.sleighReigns.EnableMotor(true);
                    this.pumpCounter = 0;
                }
            }
            this.wheelCurrentSpeed = this.midWheel2Joint.GetJointSpeed();
            if (this.wheelCurrentSpeed > 0) {
                this.wheelNewSpeed = 0;
            } else {
                this.wheelNewSpeed =
                    this.wheelCurrentSpeed > -this.wheelMaxSpeed
                        ? this.wheelCurrentSpeed - this.accelStep
                        : this.wheelCurrentSpeed;
            }
            this.backWheelJoint.SetMotorSpeed(this.wheelNewSpeed);
            this.midWheel1Joint.SetMotorSpeed(this.wheelNewSpeed);
            this.midWheel2Joint.SetMotorSpeed(this.wheelNewSpeed);
            this.frontWheelJoint.SetMotorSpeed(this.wheelNewSpeed);
            if (this.sleighReigns) {
                this.sleighReigns.SetMotorSpeed(Math.sin(this.pumpCounter) * 6);
                this.pumpCounter += 0.6;
            }
        }
    }

    public override upAndDownActions() {
        if (this.ejected) {
            if (this._currentPose == 3 || this._currentPose == 4) {
                this.currentPose = 0;
            }
        } else if (this.backWheelJoint.IsMotorEnabled()) {
            this.backWheelJoint.EnableMotor(false);
            this.midWheel1Joint.EnableMotor(false);
            this.midWheel2Joint.EnableMotor(false);
            this.frontWheelJoint.EnableMotor(false);
            if (this.sleighReigns) {
                this.sleighReigns.EnableMotor(false);
            }
        }
    }

    public override spacePressedActions() {
        var _loc1_: number = 0;
        var _loc2_: number = 0;
        var _loc3_: any[] = null;
        var _loc4_: b2Body = null;
        var _loc5_: b2Vec2 = null;
        var _loc6_: b2Vec2 = null;
        if (this.ejected) {
            this.startGrab();
        } else {
            this.boostVal += this.boostStepUp;
            this.boostVal = Math.min(this.boostMax, this.boostVal);
            if (this.boostVal < this.boostMax) {
                _loc1_ = int(this.antiGravArray.length);
                _loc2_ = 0;
                while (_loc2_ < _loc1_) {
                    _loc4_ = this.antiGravArray[_loc2_];
                    if (!_loc4_.IsSleeping()) {
                        _loc4_.m_linearVelocity.y += this.gravityDisplacement;
                    }
                    _loc2_++;
                }
                _loc3_ = this.elf1.antiGravArray;
                _loc1_ = int(_loc3_.length);
                _loc2_ = 0;
                while (_loc2_ < _loc1_) {
                    _loc4_ = _loc3_[_loc2_];
                    if (!_loc4_.IsSleeping()) {
                        _loc4_.m_linearVelocity.y += this.gravityDisplacement;
                    }
                    _loc2_++;
                }
                _loc3_ = this.elf2.antiGravArray;
                _loc1_ = int(_loc3_.length);
                _loc2_ = 0;
                while (_loc2_ < _loc1_) {
                    _loc4_ = _loc3_[_loc2_];
                    if (!_loc4_.IsSleeping()) {
                        _loc4_.m_linearVelocity.y += this.gravityDisplacement;
                    }
                    _loc2_++;
                }
                if (!this.snowSpray) {
                    _loc5_ = new b2Vec2(
                        this._startX - 143 / this.character_scale,
                        this._startY + 178 / this.character_scale,
                    );
                    _loc6_ = new b2Vec2(
                        this._startX + 107 / this.character_scale,
                        this._startY + 178 / this.character_scale,
                    );
                    this.snowSpray =
                        this._session.particleController.createSnowSpray(
                            "snowflakes",
                            this.sleighBody,
                            _loc5_,
                            _loc6_,
                            0,
                            0,
                            180,
                            5,
                            5000,
                            this._session.containerSprite,
                        );
                    this.sleighBellLoop =
                        SoundController.instance.playAreaSoundLoop(
                            "SleighBellLoop",
                            this.sleighBody,
                            0,
                            0,
                        );
                    this.sleighBellLoop.fadeIn(0.5);
                }
            } else if (this.snowSpray) {
                this.snowSpray.stopSpewing();
                this.snowSpray = null;
                this.sleighBellLoop.fadeOut(0.5);
                this.sleighBellLoop = null;
            }
        }
    }

    public override spaceNullActions() {
        if (this.ejected) {
            this.releaseGrip();
        }
        this.boostVal -= this.boostStepDown;
        this.boostVal = Math.max(0, this.boostVal);
        if (this.snowSpray) {
            this.snowSpray.stopSpewing();
            this.snowSpray = null;
            this.sleighBellLoop.fadeOut(0.5);
            this.sleighBellLoop = null;
        }
    }

    public override shiftPressedActions() {
        if (this.ejected) {
            this.currentPose = 6;
        } else {
            if (!this.elf1.legsOk) {
                this.elf1.eject();
            }
            if (!this.elf2.legsOk) {
                this.elf2.eject();
            }
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
        if (this.ejected) {
            this.elf1.eject();
            this.elf2.eject();
        } else {
            this.ejectImpulse = 5;
            this.eject();
        }
    }

    public override actions() {
        var _loc2_: number = NaN;
        this.boostMeter.scaleY = 1 - this.boostVal / this.boostMax;
        var _loc1_: number = this.frontContacts + this.backContacts;
        if (_loc1_ > 0) {
            _loc2_ = Math.abs(this.backWheelBody.GetAngularVelocity());
            if (_loc2_ > 12) {
                if (!this.skiLoop) {
                    this.skiLoop = SoundController.instance.playAreaSoundLoop(
                        "SkiLoop",
                        this.sleighBody,
                        0,
                        Math.random() * 5000,
                    );
                    this.skiLoop.fadeIn(0.2);
                }
            } else if (this.skiLoop) {
                this.skiLoop.fadeOut(0.2);
                this.skiLoop = null;
            }
        } else if (this.skiLoop) {
            this.skiLoop.fadeOut(0.2);
            this.skiLoop = null;
        }
        super.actions();
        this.elf1.actions();
        this.elf2.actions();
    }

    protected floatElves() {
        var _loc4_: b2Body = null;
        var _loc1_: any[] = this.elf1.antiGravArray;
        var _loc2_ = int(_loc1_.length);
        var _loc3_: number = 0;
        while (_loc3_ < _loc2_) {
            _loc4_ = _loc1_[_loc3_];
            if (!_loc4_.IsSleeping()) {
                _loc4_.m_linearVelocity.y += this.gravityDisplacement;
            }
            _loc3_++;
        }
        _loc1_ = this.elf2.antiGravArray;
        _loc2_ = int(_loc1_.length);
        _loc3_ = 0;
        while (_loc3_ < _loc2_) {
            _loc4_ = _loc1_[_loc3_];
            if (!_loc4_.IsSleeping()) {
                _loc4_.m_linearVelocity.y += this.gravityDisplacement;
            }
            _loc3_++;
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
            case 6:
            case 7:
            case 8:
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

    public override create() {
        this.createFilters();
        this.createBodies();
        this.createJoints();
        this.createMovieClips();
        this.setLimits();
        this.createDictionaries();
        this.elf1.create();
        this.elf2.create();
        this._session.containerSprite.addChild(this.sleighMC);
        this._session.containerSprite.addChild(this.strapsSprite);
        this.createStraps();
        if (this._session instanceof SessionCharacterMenu) {
            this.actionsVector.push(this.floatElves);
        }
        this.dispatchEvent(new Event(Event.COMPLETE));
    }

    public override reset() {
        super.reset();
        this.ejected = false;
        this.frontContacts = 0;
        this.backContacts = 0;
        this.pumpCounter = 0;
        this.boostVal = 0;
        this.elf1.reset();
        this.elf2.reset();
        this.createStraps();
    }

    public override die() {
        var _loc2_: Sprite = null;
        super.die();
        this.helmetBody = null;
        this.snowSpray = null;
        this.skiLoop = null;
        this.sleighBellLoop = null;
        this.antiGravArray = new Array();
        var _loc1_: number = 0;
        while (_loc1_ < this.bells.length) {
            _loc2_ = this.bells[_loc1_];
            _loc2_.parent.removeChild(_loc2_);
            _loc1_++;
        }
        this.bells = null;
        this.elf1.die();
        this.elf2.die();
    }

    public override paint() {
        super.paint();
        this.elf1.paint();
        this.elf2.paint();
        this.strapsSprite.graphics.clear();
        this.strapsSprite.graphics.lineStyle(1, 3355443);
        var _loc1_: b2DistanceJoint = this
            .strapHeadJoints[0] as b2DistanceJoint;
        var _loc2_: b2Vec2 = _loc1_.GetAnchor1();
        var _loc3_: b2Vec2 = _loc1_.GetAnchor2();
        this.strapsSprite.graphics.moveTo(
            _loc2_.x * this.m_physScale,
            _loc2_.y * this.m_physScale,
        );
        this.strapsSprite.graphics.lineTo(
            _loc3_.x * this.m_physScale,
            _loc3_.y * this.m_physScale,
        );
        var _loc4_ = int(this.strapHeadJoints.length);
        var _loc5_: number = 1;
        while (_loc5_ < _loc4_) {
            _loc1_ = this.strapHeadJoints[_loc5_];
            _loc2_ = _loc1_.GetAnchor1();
            _loc3_ = _loc1_.GetAnchor2();
            this.strapsSprite.graphics.lineTo(
                _loc3_.x * this.m_physScale,
                _loc3_.y * this.m_physScale,
            );
            _loc5_++;
        }
        this.strapsSprite.graphics.lineStyle(1.5, 3355443);
        _loc1_ = this.strapChest1Joints[0] as b2DistanceJoint;
        _loc2_ = _loc1_.GetAnchor1();
        _loc3_ = _loc1_.GetAnchor2();
        this.strapsSprite.graphics.moveTo(
            _loc2_.x * this.m_physScale,
            _loc2_.y * this.m_physScale,
        );
        this.strapsSprite.graphics.lineTo(
            _loc3_.x * this.m_physScale,
            _loc3_.y * this.m_physScale,
        );
        _loc4_ = int(this.strapChest1Joints.length);
        _loc5_ = 1;
        while (_loc5_ < _loc4_) {
            _loc1_ = this.strapChest1Joints[_loc5_];
            _loc2_ = _loc1_.GetAnchor1();
            _loc3_ = _loc1_.GetAnchor2();
            this.strapsSprite.graphics.lineTo(
                _loc3_.x * this.m_physScale,
                _loc3_.y * this.m_physScale,
            );
            _loc5_++;
        }
        _loc1_ = this.strapChest2Joints[0] as b2DistanceJoint;
        _loc2_ = _loc1_.GetAnchor1();
        _loc3_ = _loc1_.GetAnchor2();
        this.strapsSprite.graphics.moveTo(
            _loc2_.x * this.m_physScale,
            _loc2_.y * this.m_physScale,
        );
        this.strapsSprite.graphics.lineTo(
            _loc3_.x * this.m_physScale,
            _loc3_.y * this.m_physScale,
        );
        _loc4_ = int(this.strapChest2Joints.length);
        _loc5_ = 1;
        while (_loc5_ < _loc4_) {
            _loc1_ = this.strapChest2Joints[_loc5_];
            _loc2_ = _loc1_.GetAnchor1();
            _loc3_ = _loc1_.GetAnchor2();
            this.strapsSprite.graphics.lineTo(
                _loc3_.x * this.m_physScale,
                _loc3_.y * this.m_physScale,
            );
            _loc5_++;
        }
    }

    public override createDictionaries() {
        super.createDictionaries();
        this.helmetShape = this.head1Shape;
        this.contactImpulseDict.set(this.helmetShape, this.helmetSmashLimit);
        this.contactImpulseDict.set(this.frontShape, this.sleighSmashLimit);
        this.contactImpulseDict.set(this.skiShape, this.sleighSmashLimit);
        this.contactImpulseDict.set(this.stem3Shape, this.sleighSmashLimit);
        this.contactAddSounds.set(this.backWheelShape, "SkiImpact1");
        this.contactAddSounds.set(this.frontWheelShape, "SkiImpact2");
        this.contactAddSounds.set(this.frontShape, "SleighImpact1");
        this.contactAddSounds.set(this.bumperShape, "SleighImpact2");
        this.contactAddSounds.set(this.stem1Shape, "SleighImpact2");
        this.contactAddSounds.set(this.stem2Shape, "SleighImpact1");
        this.contactAddSounds.set(this.stem3Shape, "SleighImpact1");
        this.contactAddSounds.set(this.rearShape, "SleighImpact3");
    }

    public override createBodies() {
        var _loc9_: any[] = null;
        var _loc10_: b2Vec2 = null;
        var _loc11_: MovieClip = null;
        var _loc12_: number = 0;
        var _loc13_: b2BodyDef = null;
        var _loc14_: b2Body = null;
        var _loc15_ = undefined;
        super.createBodies();
        this.antiGravArray = new Array();
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
            _loc11_ = this.shapeGuide["chestVert" + [_loc6_]];
            _loc1_.vertices[_loc6_] = new b2Vec2(
                _loc11_.x / this.character_scale,
                _loc11_.y / this.character_scale,
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
            _loc11_ = this.shapeGuide["pelvisVert" + [_loc6_]];
            _loc1_.vertices[_loc6_] = new b2Vec2(
                _loc11_.x / this.character_scale,
                _loc11_.y / this.character_scale,
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
        _loc1_ = new b2PolygonDef();
        _loc2_ = new b2CircleDef();
        _loc1_.density = 3;
        _loc1_.friction = 0.3;
        _loc1_.restitution = 0.3;
        _loc2_.density = 3;
        _loc2_.friction = 1;
        _loc2_.restitution = 0.1;
        if (this._session.version > 1.51) {
            _loc1_.filter = this.defaultFilter.Copy();
            _loc2_.filter = this.defaultFilter.Copy();
            _loc12_ = this.defaultFilter.groupIndex;
        } else {
            _loc1_.filter.categoryBits = 520;
            _loc2_.filter.categoryBits = 520;
            _loc12_ = 0;
        }
        this.sleighBody = this._session.m_world.CreateBody(_loc7_);
        _loc1_.vertexCount = 5;
        _loc6_ = 0;
        while (_loc6_ < 5) {
            _loc11_ = this.shapeGuide["rear_" + [_loc6_ + 1]];
            _loc1_.vertices[_loc6_] = new b2Vec2(
                this._startX + _loc11_.x / this.character_scale,
                this._startY + _loc11_.y / this.character_scale,
            );
            _loc6_++;
        }
        this.rearShape = this.sleighBody.CreateShape(_loc1_) as b2PolygonShape;
        this._session.contactListener.registerListener(
            ContactListener.RESULT,
            this.rearShape,
            this.contactSleighResultHandler,
        );
        this._session.contactListener.registerListener(
            ContactListener.ADD,
            this.rearShape,
            this.contactAddHandler,
        );
        _loc1_.vertexCount = 6;
        _loc6_ = 0;
        while (_loc6_ < 6) {
            _loc11_ = this.shapeGuide["base_" + [_loc6_ + 1]];
            _loc1_.vertices[_loc6_] = new b2Vec2(
                this._startX + _loc11_.x / this.character_scale,
                this._startY + _loc11_.y / this.character_scale,
            );
            _loc6_++;
        }
        this.skiShape = this.sleighBody.CreateShape(_loc1_) as b2PolygonShape;
        this._session.contactListener.registerListener(
            ContactListener.RESULT,
            this.skiShape,
            this.contactResultHandler,
        );
        _loc1_.filter.groupIndex = -1;
        _loc1_.vertexCount = 4;
        _loc6_ = 0;
        while (_loc6_ < 4) {
            _loc11_ = this.shapeGuide["back_" + [_loc6_ + 1]];
            _loc1_.vertices[_loc6_] = new b2Vec2(
                this._startX + _loc11_.x / this.character_scale,
                this._startY + _loc11_.y / this.character_scale,
            );
            _loc6_++;
        }
        this.backShape = this.sleighBody.CreateShape(_loc1_) as b2PolygonShape;
        _loc1_.vertexCount = 5;
        _loc6_ = 0;
        while (_loc6_ < 5) {
            _loc11_ = this.shapeGuide["seat_" + [_loc6_ + 1]];
            _loc1_.vertices[_loc6_] = new b2Vec2(
                this._startX + _loc11_.x / this.character_scale,
                this._startY + _loc11_.y / this.character_scale,
            );
            _loc6_++;
        }
        this.seatShape = this.sleighBody.CreateShape(_loc1_) as b2PolygonShape;
        _loc1_.filter.groupIndex = _loc12_;
        _loc1_.vertexCount = 5;
        _loc6_ = 0;
        while (_loc6_ < 5) {
            _loc11_ = this.shapeGuide["front_" + [_loc6_ + 1]];
            _loc1_.vertices[_loc6_] = new b2Vec2(
                this._startX + _loc11_.x / this.character_scale,
                this._startY + _loc11_.y / this.character_scale,
            );
            _loc6_++;
        }
        this.frontShape = this.sleighBody.CreateShape(_loc1_) as b2PolygonShape;
        this._session.contactListener.registerListener(
            ContactListener.RESULT,
            this.frontShape,
            this.contactSleighResultHandler,
        );
        this._session.contactListener.registerListener(
            ContactListener.ADD,
            this.frontShape,
            this.contactAddHandler,
        );
        _loc1_.filter.groupIndex = -2;
        this.vertsBrokenStem = new Array();
        _loc9_ = new Array();
        _loc1_.vertexCount = 4;
        _loc6_ = 0;
        while (_loc6_ < 4) {
            _loc11_ = this.shapeGuide["stem1_" + [_loc6_ + 1]];
            _loc10_ = new b2Vec2(
                this._startX + _loc11_.x / this.character_scale,
                this._startY + _loc11_.y / this.character_scale,
            );
            _loc1_.vertices[_loc6_] = _loc10_;
            _loc9_.push(_loc10_.Copy());
            _loc6_++;
        }
        this.vertsBrokenStem.push(_loc9_);
        this.stem1Shape = this.sleighBody.CreateShape(_loc1_) as b2PolygonShape;
        this._session.contactListener.registerListener(
            ContactListener.RESULT,
            this.stem1Shape,
            this.contactStemResultHandler,
        );
        this._session.contactListener.registerListener(
            ContactListener.ADD,
            this.stem1Shape,
            this.contactAddHandler,
        );
        _loc9_ = new Array();
        _loc6_ = 0;
        while (_loc6_ < 4) {
            _loc11_ = this.shapeGuide["stem2_" + [_loc6_ + 1]];
            _loc10_ = new b2Vec2(
                this._startX + _loc11_.x / this.character_scale,
                this._startY + _loc11_.y / this.character_scale,
            );
            _loc1_.vertices[_loc6_] = _loc10_;
            _loc9_.push(_loc10_.Copy());
            _loc6_++;
        }
        this.vertsBrokenStem.push(_loc9_);
        this.stem2Shape = this.sleighBody.CreateShape(_loc1_) as b2PolygonShape;
        this._session.contactListener.registerListener(
            ContactListener.RESULT,
            this.stem2Shape,
            this.contactStemResultHandler,
        );
        this._session.contactListener.registerListener(
            ContactListener.ADD,
            this.stem2Shape,
            this.contactAddHandler,
        );
        _loc9_ = new Array();
        _loc6_ = 0;
        while (_loc6_ < 4) {
            _loc11_ = this.shapeGuide["stem3_" + [_loc6_ + 1]];
            _loc10_ = new b2Vec2(
                this._startX + _loc11_.x / this.character_scale,
                this._startY + _loc11_.y / this.character_scale,
            );
            _loc1_.vertices[_loc6_] = _loc10_;
            _loc9_.push(_loc10_.Copy());
            _loc6_++;
        }
        this.vertsBrokenStem.push(_loc9_);
        this.stem3Shape = this.sleighBody.CreateShape(_loc1_) as b2PolygonShape;
        this._session.contactListener.registerListener(
            ContactListener.RESULT,
            this.stem3Shape,
            this.contactStemResultHandler,
        );
        this._session.contactListener.registerListener(
            ContactListener.ADD,
            this.stem3Shape,
            this.contactAddHandler,
        );
        _loc1_.filter.groupIndex = _loc12_;
        this.newBaseVerts = new Array();
        _loc6_ = 0;
        while (_loc6_ < 5) {
            _loc11_ = this.shapeGuide["newbase_" + [_loc6_ + 1]];
            _loc10_ = new b2Vec2(
                this._startX + _loc11_.x / this.character_scale,
                this._startY + _loc11_.y / this.character_scale,
            );
            this.newBaseVerts.push(_loc10_);
            _loc6_++;
        }
        _loc5_ = this.shapeGuide["handAnchor"];
        _loc7_.position.Set(
            this._startX + _loc5_.x / this.character_scale,
            this._startY + _loc5_.y / this.character_scale,
        );
        _loc1_.vertexCount = 4;
        _loc1_.SetAsBox(0.1, 0.1);
        _loc1_.isSensor = true;
        this.reignsBody = this._session.m_world.CreateBody(_loc7_);
        this.reignsBody.CreateShape(_loc1_);
        this.reignsBody.SetMassFromShapes();
        _loc5_ = this.shapeGuide["bumper"];
        _loc2_.radius = _loc5_.width / 2 / this.character_scale;
        _loc2_.localPosition = new b2Vec2(
            this._startX + _loc5_.x / this.character_scale,
            this._startY + _loc5_.y / this.character_scale,
        );
        this.bumperShape = this.sleighBody.CreateShape(_loc2_) as b2CircleShape;
        this._session.contactListener.registerListener(
            ContactListener.RESULT,
            this.bumperShape,
            this.contactSleighResultHandler,
        );
        this._session.contactListener.registerListener(
            ContactListener.ADD,
            this.bumperShape,
            this.contactAddHandler,
        );
        this.sleighBody.SetMassFromShapes();
        this.paintVector.push(this.sleighBody);
        _loc1_.density = 0.25;
        _loc1_.isSensor = false;
        _loc1_.filter.groupIndex = 0;
        this.boxBodies = new Array();
        _loc6_ = 0;
        while (_loc6_ < 8) {
            _loc13_ = new b2BodyDef();
            _loc5_ = this.shapeGuide["box" + (_loc6_ + 1)];
            _loc13_.position.Set(
                this._startX + _loc5_.x / this.character_scale,
                this._startY + _loc5_.y / this.character_scale,
            );
            _loc13_.angle = _loc5_.rotation / (180 / Math.PI);
            _loc1_.SetAsBox(
                (_loc5_.scaleX * this.shapeRefScale) / this.character_scale,
                (_loc5_.scaleY * this.shapeRefScale) / this.character_scale,
            );
            _loc14_ = this._session.m_world.CreateBody(_loc13_);
            _loc14_.CreateShape(_loc1_);
            _loc14_.SetMassFromShapes();
            this.paintVector.push(_loc14_);
            this.boxBodies.push(_loc14_);
            this.antiGravArray.push(_loc14_);
            _loc6_++;
        }
        _loc2_.localPosition = new b2Vec2();
        _loc2_.filter.groupIndex = 0;
        _loc5_ = this.shapeGuide["backWheel"];
        _loc8_.position.Set(
            this._startX + _loc5_.x / this.character_scale,
            this._startY + _loc5_.y / this.character_scale,
        );
        _loc8_.angle = _loc5_.rotation / CharacterB2D.oneEightyOverPI;
        _loc2_.radius = _loc5_.width / 2 / this.character_scale;
        this.wheelRadius = _loc5_.width * 0.5;
        this.backWheelBody = this._session.m_world.CreateBody(_loc8_);
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
        _loc5_ = this.shapeGuide["midWheel1"];
        _loc8_.position.Set(
            this._startX + _loc5_.x / this.character_scale,
            this._startY + _loc5_.y / this.character_scale,
        );
        _loc8_.angle = _loc5_.rotation / CharacterB2D.oneEightyOverPI;
        _loc2_.radius = _loc5_.width / 2 / this.character_scale;
        this.midWheel1Body = this._session.m_world.CreateBody(_loc8_);
        this.midWheel1Shape = this.midWheel1Body.CreateShape(_loc2_);
        this.midWheel1Body.SetMassFromShapes();
        _loc5_ = this.shapeGuide["midWheel2"];
        _loc2_.filter.groupIndex = -1;
        _loc8_.position.Set(
            this._startX + _loc5_.x / this.character_scale,
            this._startY + _loc5_.y / this.character_scale,
        );
        _loc8_.angle = _loc5_.rotation / CharacterB2D.oneEightyOverPI;
        _loc2_.radius = _loc5_.width / 2 / this.character_scale;
        this.midWheel2Body = this._session.m_world.CreateBody(_loc8_);
        this.midWheel2Shape = this.midWheel2Body.CreateShape(_loc2_);
        this.midWheel2Body.SetMassFromShapes();
        _loc2_.filter.groupIndex = 0;
        _loc5_ = this.shapeGuide["frontWheel"];
        _loc8_.position.Set(
            this._startX + _loc5_.x / this.character_scale,
            this._startY + _loc5_.y / this.character_scale,
        );
        _loc8_.angle = _loc5_.rotation / CharacterB2D.oneEightyOverPI;
        _loc2_.radius = _loc5_.width / 2 / this.character_scale;
        this.frontWheelBody = this._session.m_world.CreateBody(_loc8_);
        this.frontWheelShape = this.frontWheelBody.CreateShape(_loc2_);
        this.frontWheelBody.SetMassFromShapes();
        this.wheelMultiplier = this.wheelRadius / (_loc5_.width * 0.5);
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
        this.antiGravArray.push(this.head1Body);
        this.antiGravArray.push(this.chestBody);
        this.antiGravArray.push(this.pelvisBody);
        this.antiGravArray.push(this.upperArm1Body);
        this.antiGravArray.push(this.upperArm2Body);
        this.antiGravArray.push(this.lowerArm1Body);
        this.antiGravArray.push(this.lowerArm2Body);
        this.antiGravArray.push(this.upperLeg1Body);
        this.antiGravArray.push(this.upperLeg2Body);
        this.antiGravArray.push(this.lowerLeg1Body);
        this.antiGravArray.push(this.lowerLeg2Body);
        this.antiGravArray.push(this.sleighBody);
        this.antiGravArray.push(this.reignsBody);
        this.antiGravArray.push(this.backWheelBody);
        this.antiGravArray.push(this.midWheel1Body);
        this.antiGravArray.push(this.midWheel2Body);
        this.antiGravArray.push(this.frontWheelBody);
        this.vertsBrokenSleigh = new Array();
        _loc6_ = 0;
        while (_loc6_ < 7) {
            _loc9_ = new Array();
            _loc15_ = 0;
            while (_loc15_ < 6) {
                _loc5_ =
                    this.shapeGuide[
                    "broken_" + (_loc6_ + 1) + "_" + (_loc15_ + 1)
                    ];
                if (_loc5_) {
                    _loc9_.push(
                        new b2Vec2(
                            this._startX + _loc5_.x / this.character_scale,
                            this._startY + _loc5_.y / this.character_scale,
                        ),
                    );
                }
                _loc15_++;
            }
            this.vertsBrokenSleigh.push(_loc9_);
            _loc6_++;
        }
        this.vertsBrokenSki = new Array();
        _loc6_ = 0;
        while (_loc6_ < 3) {
            _loc9_ = new Array();
            _loc15_ = 0;
            while (_loc15_ < 6) {
                _loc5_ =
                    this.shapeGuide[
                    "ski_" + (_loc6_ + 1) + "_" + (_loc15_ + 1)
                    ];
                if (_loc5_) {
                    _loc9_.push(
                        new b2Vec2(
                            this._startX + _loc5_.x / this.character_scale,
                            this._startY + _loc5_.y / this.character_scale,
                        ),
                    );
                }
                _loc15_++;
            }
            this.vertsBrokenSki.push(_loc9_);
            _loc6_++;
        }
    }

    public override createMovieClips() {
        var _loc8_: MovieClip = null;
        var _loc10_: MovieClip = null;
        var _loc11_: b2Body = null;
        super.createMovieClips();
        var _loc1_: MovieClip = this.sourceObject["sleighShards"];
        this._session.particleController.createBMDArray("sleighShards", _loc1_);
        var _loc2_: MovieClip = this.sourceObject["snowflakes"];
        // var _loc3_ = new BevelFilter(
        //     1,
        //     90,
        //     16777215,
        //     1,
        //     0,
        //     1,
        //     2.5,
        //     2.5,
        //     0.7,
        //     3,
        // );
        // this._session.particleController.createBMDArray("snowflakes", _loc2_, [
        //     _loc3_,
        // ]);
        this._session.containerSprite.addChildAt(
            this.chestMC,
            this._session.containerSprite.getChildIndex(this.lowerLeg1MC),
        );
        this.sleighMC = this.sourceObject["sleigh"];
        var _loc12_ = 1 / this.mc_scale;
        this.sleighMC.scaleY = 1 / this.mc_scale;
        this.sleighMC.scaleX = _loc12_;
        this.helmetMC = this.sourceObject["helmet"];
        _loc12_ = 1 / this.mc_scale;
        this.helmetMC.scaleY = 1 / this.mc_scale;
        this.helmetMC.scaleX = _loc12_;
        this.helmetMC.visible = false;
        this._session.containerSprite.addChildAt(
            this.helmetMC,
            this._session.containerSprite.getChildIndex(this.chestMC),
        );
        var _loc4_: b2Vec2 = this.chestBody.GetLocalCenter();
        trace(
            "chest center " +
            _loc4_.x * this.character_scale +
            ", " +
            _loc4_.y * this.character_scale,
        );
        _loc4_ = this.pelvisBody.GetLocalCenter();
        trace(
            "pelvis center " +
            _loc4_.x * this.character_scale +
            ", " +
            _loc4_.y * this.character_scale,
        );
        var _loc5_: b2Vec2 = this.sleighBody.GetLocalCenter();
        _loc5_ = new b2Vec2(
            (this._startX - _loc5_.x) * this.character_scale,
            (this._startY - _loc5_.y) * this.character_scale,
        );
        var _loc6_: MovieClip = this.shapeGuide["rear_1"];
        var _loc7_ = new b2Vec2(_loc6_.x + _loc5_.x, _loc6_.y + _loc5_.y);
        // @ts-expect-error
        this.sleighMC.inner.x = _loc7_.x;
        // @ts-expect-error
        this.sleighMC.inner.y = _loc7_.y;
        this.sleighBody.SetUserData(this.sleighMC);
        this._session.containerSprite.addChild(this.sleighMC);
        this.strapsSprite = new Sprite();
        this._session.containerSprite.addChild(this.strapsSprite);
        this.brokenSleighMCs = new Array();
        var _loc9_: number = 1;
        while (_loc9_ < 8) {
            _loc8_ = this.sourceObject["sleigh" + _loc9_];
            _loc12_ = 1 / this.mc_scale;
            _loc8_.scaleY = 1 / this.mc_scale;
            _loc8_.scaleX = _loc12_;
            _loc8_.visible = false;
            this.brokenSleighMCs.push(_loc8_);
            this._session.containerSprite.addChild(_loc8_);
            _loc9_++;
        }
        _loc8_ = this.sourceObject["stem"];
        _loc12_ = 1 / this.mc_scale;
        _loc8_.scaleY = 1 / this.mc_scale;
        _loc8_.scaleX = _loc12_;
        _loc8_.visible = false;
        this.stemMC = _loc8_;
        this._session.containerSprite.addChild(_loc8_);
        this.brokenSkiMCs = new Array();
        _loc9_ = 1;
        while (_loc9_ < 4) {
            _loc8_ = this.sourceObject["ski" + _loc9_];
            _loc12_ = 1 / this.mc_scale;
            _loc8_.scaleY = 1 / this.mc_scale;
            _loc8_.scaleX = _loc12_;
            _loc8_.visible = false;
            this.brokenSkiMCs.push(_loc8_);
            this._session.containerSprite.addChild(_loc8_);
            _loc9_++;
        }
        this.boxMCs = new Array();
        _loc9_ = 0;
        while (_loc9_ < 8) {
            _loc10_ = this.sourceObject["box" + (_loc9_ + 1)];
            _loc12_ = 1 / this.mc_scale;
            _loc10_.scaleY = 1 / this.mc_scale;
            _loc10_.scaleX = _loc12_;
            _loc11_ = this.boxBodies[_loc9_];
            _loc11_.SetUserData(_loc10_);
            this.boxMCs.push(_loc10_);
            this._session.containerSprite.addChildAt(
                _loc10_,
                this._session.containerSprite.getChildIndex(this.sleighMC),
            );
            _loc9_++;
        }
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
    }

    public override createJoints() {
        var _loc1_: number = NaN;
        var _loc2_: number = NaN;
        var _loc3_: number = NaN;
        var _loc8_: MovieClip = null;
        super.createJoints();
        var _loc4_: number = 180 / Math.PI;
        _loc1_ = this.head1Body.GetAngle() - this.chestBody.GetAngle();
        _loc2_ = -5 / _loc4_ - _loc1_;
        _loc3_ = 5 / _loc4_ - _loc1_;
        this.neckJoint.SetLimits(_loc2_, _loc3_);
        var _loc5_ = new b2Vec2();
        var _loc6_ = new b2PrismaticJointDef();
        _loc8_ = this.shapeGuide["handAnchor"];
        _loc5_.Set(
            this._startX + _loc8_.x / this.character_scale,
            this._startY + _loc8_.y / this.character_scale,
        );
        _loc6_.Initialize(
            this.sleighBody,
            this.reignsBody,
            _loc5_,
            new b2Vec2(0, 1),
        );
        _loc6_.enableLimit = true;
        _loc6_.maxMotorForce = 1000;
        _loc6_.upperTranslation = 15 / this.m_physScale;
        _loc6_.lowerTranslation = -100 / this.m_physScale;
        this.sleighReigns = this._session.m_world.CreateJoint(
            _loc6_,
        ) as b2PrismaticJoint;
        var _loc7_ = new b2RevoluteJointDef();
        _loc7_.maxMotorTorque = this.maxTorque;
        _loc7_.enableLimit = false;
        _loc7_.lowerAngle = 0;
        _loc7_.upperAngle = 0;
        _loc7_.Initialize(this.reignsBody, this.lowerArm1Body, _loc5_);
        this.reignsHand1 = this._session.m_world.CreateJoint(
            _loc7_,
        ) as b2RevoluteJoint;
        _loc7_.Initialize(this.reignsBody, this.lowerArm2Body, _loc5_);
        this.reignsHand2 = this._session.m_world.CreateJoint(
            _loc7_,
        ) as b2RevoluteJoint;
        _loc5_.Set(
            this.pelvisBody.GetWorldCenter().x,
            this.pelvisBody.GetWorldCenter().y,
        );
        _loc7_.Initialize(this.sleighBody, this.pelvisBody, _loc5_);
        _loc7_.enableLimit = true;
        this.sleighPelvis = this._session.m_world.CreateJoint(
            _loc7_,
        ) as b2RevoluteJoint;
        _loc7_.enableLimit = false;
        this.pelvisAnchorPoint = this.sleighBody.GetLocalPoint(_loc5_);
        _loc8_ = this.shapeGuide["backWheel"];
        _loc5_.Set(
            this._startX + _loc8_.x / this.character_scale,
            this._startY + _loc8_.y / this.character_scale,
        );
        _loc7_.Initialize(this.sleighBody, this.backWheelBody, _loc5_);
        this.backWheelJoint = this._session.m_world.CreateJoint(
            _loc7_,
        ) as b2RevoluteJoint;
        _loc8_ = this.shapeGuide["midWheel1"];
        _loc5_.Set(
            this._startX + _loc8_.x / this.character_scale,
            this._startY + _loc8_.y / this.character_scale,
        );
        _loc7_.Initialize(this.sleighBody, this.midWheel1Body, _loc5_);
        this.midWheel1Joint = this._session.m_world.CreateJoint(
            _loc7_,
        ) as b2RevoluteJoint;
        _loc8_ = this.shapeGuide["midWheel2"];
        _loc5_.Set(
            this._startX + _loc8_.x / this.character_scale,
            this._startY + _loc8_.y / this.character_scale,
        );
        _loc7_.Initialize(this.sleighBody, this.midWheel2Body, _loc5_);
        this.midWheel2Joint = this._session.m_world.CreateJoint(
            _loc7_,
        ) as b2RevoluteJoint;
        _loc8_ = this.shapeGuide["frontWheel"];
        _loc5_.Set(
            this._startX + _loc8_.x / this.character_scale,
            this._startY + _loc8_.y / this.character_scale,
        );
        _loc7_.Initialize(this.sleighBody, this.frontWheelBody, _loc5_);
        this.frontWheelJoint = this._session.m_world.CreateJoint(
            _loc7_,
        ) as b2RevoluteJoint;
        _loc8_ = this.shapeGuide["footAnchor"];
        _loc5_.Set(
            this._startX + _loc8_.x / this.character_scale,
            this._startY + _loc8_.y / this.character_scale,
        );
        _loc7_.Initialize(this.sleighBody, this.lowerLeg1Body, _loc5_);
        this.sleighFoot1 = this._session.m_world.CreateJoint(
            _loc7_,
        ) as b2RevoluteJoint;
        this.leg1AnchorPoint = this.sleighBody.GetLocalPoint(_loc5_);
        _loc7_.Initialize(this.sleighBody, this.lowerLeg2Body, _loc5_);
        this.sleighFoot2 = this._session.m_world.CreateJoint(
            _loc7_,
        ) as b2RevoluteJoint;
        this.leg2AnchorPoint = this.sleighBody.GetLocalPoint(_loc5_);
    }

    protected createStraps() {
        var _loc9_: b2Vec2 = null;
        var _loc10_: b2Vec2 = null;
        var _loc12_: b2Body = null;
        var _loc16_: b2DistanceJoint = null;
        var _loc17_: ChristmasBellMC = null;
        this.strapHeadJoints = new Array();
        this.strapChest1Joints = new Array();
        this.strapChest2Joints = new Array();
        var _loc1_ = new b2DistanceJointDef();
        var _loc2_ = new b2BodyDef();
        var _loc3_ = new b2CircleDef();
        var _loc4_: number = 8;
        _loc3_.density = 0.25;
        _loc3_.friction = 1;
        _loc3_.restitution = 0.1;
        _loc3_.filter.categoryBits = 0;
        _loc3_.filter.maskBits = 0;
        _loc3_.radius = 3 / this.m_physScale;
        var _loc5_: b2Vec2 = this.reignsBody.GetPosition();
        var _loc6_: b2Vec2 = this.elf1.head1Body.GetWorldPoint(
            new b2Vec2(-18 / this.character_scale, 4 / this.character_scale),
        );
        var _loc7_: number = (_loc6_.x - _loc5_.x) / _loc4_;
        var _loc8_: number = (_loc6_.y - _loc5_.y) / _loc4_;
        _loc9_ = _loc5_.Copy();
        var _loc11_: b2Body = this.reignsBody;
        var _loc13_: number = 0;
        while (_loc13_ < _loc4_) {
            _loc2_.position.Set(
                _loc5_.x + _loc7_ * (_loc13_ + 1),
                _loc5_.y + _loc8_ * (_loc13_ + 1),
            );
            if (_loc13_ < _loc4_ - 1) {
                _loc12_ = this._session.m_world.CreateBody(_loc2_);
                _loc12_.CreateShape(_loc3_);
                _loc12_.SetMassFromShapes();
                _loc10_ = _loc12_.GetPosition();
                this.antiGravArray.push(_loc12_);
            } else {
                _loc12_ = this.elf1.head1Body;
                _loc10_ = _loc6_;
            }
            _loc1_.Initialize(_loc11_, _loc12_, _loc9_, _loc10_);
            _loc16_ = this._session.m_world.CreateJoint(
                _loc1_,
            ) as b2DistanceJoint;
            this.strapHeadJoints.push(_loc16_);
            _loc11_ = _loc12_;
            _loc9_ = _loc10_;
            _loc13_++;
        }
        _loc4_ = 4;
        _loc5_ = _loc6_;
        _loc6_ = this.elf2.head1Body.GetWorldPoint(
            new b2Vec2(-18 / this.character_scale, 4 / this.character_scale),
        );
        _loc7_ = (_loc6_.x - _loc5_.x) / _loc4_;
        _loc8_ = (_loc6_.y - _loc5_.y) / _loc4_;
        _loc9_ = _loc5_.Copy();
        _loc13_ = 0;
        while (_loc13_ < _loc4_) {
            _loc2_.position.Set(
                _loc5_.x + _loc7_ * (_loc13_ + 1),
                _loc5_.y + _loc8_ * (_loc13_ + 1),
            );
            if (_loc13_ < _loc4_ - 1) {
                _loc12_ = this._session.m_world.CreateBody(_loc2_);
                _loc12_.CreateShape(_loc3_);
                _loc12_.SetMassFromShapes();
                _loc10_ = _loc12_.GetPosition();
                this.antiGravArray.push(_loc12_);
            } else {
                _loc12_ = this.elf2.head1Body;
                _loc10_ = _loc6_;
            }
            _loc1_.Initialize(_loc11_, _loc12_, _loc9_, _loc10_);
            _loc16_ = this._session.m_world.CreateJoint(
                _loc1_,
            ) as b2DistanceJoint;
            this.strapHeadJoints.push(_loc16_);
            _loc11_ = _loc12_;
            _loc9_ = _loc10_;
            _loc13_++;
        }
        _loc4_ = 3;
        var _loc14_: MovieClip = this.shapeGuide["strap1Anchor"];
        _loc5_.Set(
            this._startX + _loc14_.x / this.character_scale,
            this._startY + _loc14_.y / this.character_scale,
        );
        _loc6_ = this.elf1.chestBody.GetWorldPoint(
            new b2Vec2(0, 20 / this.character_scale),
        );
        _loc7_ = (_loc6_.x - _loc5_.x) / _loc4_;
        _loc8_ = (_loc6_.y - _loc5_.y) / _loc4_;
        _loc9_ = _loc5_.Copy();
        _loc11_ = this.sleighBody;
        _loc13_ = 0;
        while (_loc13_ < _loc4_) {
            _loc2_.position.Set(
                _loc5_.x + _loc7_ * (_loc13_ + 1),
                _loc5_.y + _loc8_ * (_loc13_ + 1),
            );
            if (_loc13_ < _loc4_ - 1) {
                _loc12_ = this._session.m_world.CreateBody(_loc2_);
                _loc12_.CreateShape(_loc3_);
                _loc12_.SetMassFromShapes();
                _loc10_ = _loc12_.GetPosition();
                this.antiGravArray.push(_loc12_);
            } else {
                _loc12_ = this.elf1.chestBody;
                _loc10_ = _loc6_;
            }
            _loc1_.Initialize(_loc11_, _loc12_, _loc9_, _loc10_);
            _loc16_ = this._session.m_world.CreateJoint(
                _loc1_,
            ) as b2DistanceJoint;
            this.strapChest1Joints.push(_loc16_);
            _loc11_ = _loc12_;
            _loc9_ = _loc10_;
            _loc13_++;
        }
        _loc4_ = 5;
        _loc14_ = this.shapeGuide["strap2Anchor"];
        _loc5_.Set(
            this._startX + _loc14_.x / this.character_scale,
            this._startY + _loc14_.y / this.character_scale,
        );
        _loc6_ = this.elf2.chestBody.GetWorldPoint(
            new b2Vec2(0, 20 / this.character_scale),
        );
        _loc7_ = (_loc6_.x - _loc5_.x) / _loc4_;
        _loc8_ = (_loc6_.y - _loc5_.y) / _loc4_;
        _loc9_ = _loc5_.Copy();
        _loc11_ = this.sleighBody;
        this.bells = new Array();
        var _loc15_: number =
            this._session.containerSprite.getChildIndex(this.strapsSprite) + 1;
        _loc13_ = 0;
        while (_loc13_ < _loc4_) {
            _loc2_.position.Set(
                _loc5_.x + _loc7_ * (_loc13_ + 1),
                _loc5_.y + _loc8_ * (_loc13_ + 1),
            );
            if (_loc13_ < _loc4_ - 1) {
                _loc12_ = this._session.m_world.CreateBody(_loc2_);
                _loc12_.CreateShape(_loc3_);
                _loc12_.SetMassFromShapes();
                _loc17_ = new ChristmasBellMC();
                this.bells.push(_loc17_);
                this._session.containerSprite.addChildAt(_loc17_, _loc15_);
                _loc12_.SetUserData(_loc17_);
                this.paintVector.push(_loc12_);
                _loc10_ = _loc12_.GetWorldPoint(
                    new b2Vec2(0, -1 / this.m_physScale),
                );
                this.antiGravArray.push(_loc12_);
            } else {
                _loc12_ = this.elf2.chestBody;
                _loc10_ = _loc6_;
            }
            _loc1_.Initialize(_loc11_, _loc12_, _loc9_, _loc10_);
            _loc16_ = this._session.m_world.CreateJoint(
                _loc1_,
            ) as b2DistanceJoint;
            this.strapChest2Joints.push(_loc16_);
            _loc11_ = _loc12_;
            _loc9_ = _loc10_;
            _loc13_++;
        }
    }

    public override resetMovieClips() {
        var _loc8_: DisplayObject = null;
        var _loc9_: MovieClip = null;
        var _loc10_: b2Body = null;
        super.resetMovieClips();
        var _loc1_: number = 0;
        while (_loc1_ < this.brokenSleighMCs.length) {
            _loc8_ = this.brokenSleighMCs[_loc1_];
            _loc8_.visible = false;
            _loc1_++;
        }
        _loc1_ = 0;
        while (_loc1_ < this.brokenSkiMCs.length) {
            _loc8_ = this.brokenSkiMCs[_loc1_];
            _loc8_.visible = false;
            _loc1_++;
        }
        this.stemMC.visible = false;
        this.helmetMC.visible = false;
        // @ts-expect-error
        this.head1MC.helmet.visible = true;
        this.sleighMC.visible = true;
        // @ts-expect-error
        this.sleighMC.inner.stem.visible = true;
        // @ts-expect-error
        this.sleighMC.inner.ski.visible = true;
        this.strapsSprite.graphics.clear();
        var _loc2_: b2Vec2 = this.sleighBody.GetLocalCenter();
        _loc2_ = new b2Vec2(
            (this._startX - _loc2_.x) * this.character_scale,
            (this._startY - _loc2_.y) * this.character_scale,
        );
        var _loc3_: MovieClip = this.shapeGuide["rear_1"];
        var _loc4_ = new b2Vec2(_loc3_.x + _loc2_.x, _loc3_.y + _loc2_.y);
        // @ts-expect-error
        this.sleighMC.inner.x = _loc4_.x;
        // @ts-expect-error
        this.sleighMC.inner.y = _loc4_.y;
        this.sleighBody.SetUserData(this.sleighMC);
        _loc1_ = 0;
        while (_loc1_ < 8) {
            _loc9_ = this.boxMCs[_loc1_];
            _loc10_ = this.boxBodies[_loc1_];
            _loc10_.SetUserData(_loc9_);
            _loc1_++;
        }
        var _loc5_: MovieClip = this.sourceObject["sleighShards"];
        this._session.particleController.createBMDArray("sleighShards", _loc5_);
        var _loc6_: MovieClip = this.sourceObject["snowflakes"];
        // var _loc7_ = new BevelFilter(
        //     1,
        //     90,
        //     16777215,
        //     1,
        //     0,
        //     1,
        //     2.5,
        //     2.5,
        //     0.7,
        //     3,
        // );
        // this._session.particleController.createBMDArray("snowflakes", _loc6_, [
        //     _loc7_,
        // ]);
        this._session.addChild(this.boostHolder);
    }

    protected contactSleighResultHandler(param1: ContactEvent) {
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

    protected contactStemResultHandler(param1: ContactEvent) {
        var _loc2_: number = param1.impulse;
        if (_loc2_ > this.contactImpulseDict.get(this.stem3Shape)) {
            if (this.contactResultBuffer.get(this.stem3Shape)) {
                if (
                    _loc2_ >
                    this.contactResultBuffer.get(this.stem3Shape).impulse
                ) {
                    this.contactResultBuffer.set(this.stem3Shape, param1);
                }
            } else {
                this.contactResultBuffer.set(this.stem3Shape, param1);
            }
        }
    }

    public override handleContactBuffer() {
        super.handleContactBuffer();
        this.elf1.handleContactBuffer();
        this.elf2.handleContactBuffer();
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
        if (this.contactResultBuffer.get(this.frontShape)) {
            _loc1_ = this.contactResultBuffer.get(this.frontShape);
            this.sleighSmash(_loc1_.impulse);
            this.contactResultBuffer.delete(this.frontShape);
            this.contactResultBuffer.delete(this.skiShape);
            this.contactResultBuffer.delete(this.stem3Shape);
            this.contactAddBuffer.delete(this.rearShape);
            this.contactAddBuffer.delete(this.frontShape);
            this.contactAddBuffer.delete(this.bumperShape);
            this.contactAddBuffer.delete(this.baseShape);
            this.contactAddBuffer.delete(this.stem3Shape);
            this.contactAddBuffer.delete(this.stem2Shape);
            this.contactAddBuffer.delete(this.stem1Shape);
            this.contactAddBuffer.delete(this.frontWheelShape);
            this.contactAddBuffer.delete(this.backWheelShape);
        }
        if (this.contactResultBuffer.get(this.skiShape)) {
            _loc1_ = this.contactResultBuffer.get(this.skiShape);
            this.skiSmash(_loc1_.impulse);
            this.contactResultBuffer.delete(this.skiShape);
            this.contactAddBuffer.delete(this.frontWheelShape);
            this.contactAddBuffer.delete(this.backWheelShape);
        }
        if (this.contactResultBuffer.get(this.stem3Shape)) {
            _loc1_ = this.contactResultBuffer.get(this.stem3Shape);
            this.stemSmash(_loc1_.impulse);
            this.contactResultBuffer.delete(this.stem3Shape);
            this.contactAddBuffer.delete(this.stem3Shape);
            this.contactAddBuffer.delete(this.stem2Shape);
            this.contactAddBuffer.delete(this.stem1Shape);
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
    }

    public override checkJoints() {
        var _loc1_: b2DistanceJoint = null;
        var _loc2_: number = NaN;
        super.checkJoints();
        if (this.elf1.strappedIn) {
            _loc1_ = this.strapChest1Joints[0];
            _loc2_ = Math.abs(_loc1_.m_impulse);
            if (_loc2_ > 0.4) {
                this.breakStrap(this.elf1);
            }
        }
        if (this.elf2.strappedIn) {
            _loc1_ = this.strapChest2Joints[0];
            _loc2_ = Math.abs(_loc1_.m_impulse);
            if (_loc2_ > 0.4) {
                this.breakStrap(this.elf2);
            }
        }
        this.elf1.checkJoints();
        this.elf2.checkJoints();
    }

    public override eject() {
        var _loc5_: b2Shape = null;
        var _loc6_: number = 0;
        if (this.ejected) {
            return;
        }
        this.ejected = true;
        this.resetJointLimits();
        var _loc1_: b2World = this._session.m_world;
        if (this.sleighFoot1) {
            this._session.m_world.DestroyJoint(this.sleighFoot1);
            this.sleighFoot1 = null;
        }
        if (this.sleighFoot2) {
            this._session.m_world.DestroyJoint(this.sleighFoot2);
            this.sleighFoot2 = null;
        }
        if (this.sleighPelvis) {
            this._session.m_world.DestroyJoint(this.sleighPelvis);
            this.sleighPelvis = null;
        }
        if (this.reignsHand1) {
            this._session.m_world.DestroyJoint(this.reignsHand1);
            this.reignsHand1 = null;
            this.checkReigns();
        }
        if (this.reignsHand2) {
            this._session.m_world.DestroyJoint(this.reignsHand2);
            this.reignsHand2 = null;
            this.checkReigns();
        }
        if (this._session.version > 1.51) {
            _loc5_ = this.sleighBody.GetShapeList();
            while (_loc5_) {
                _loc6_ = _loc5_.m_filter.groupIndex;
                if (_loc6_ == -1) {
                    _loc5_.m_filter.groupIndex = 0;
                    _loc1_.Refilter(_loc5_);
                }
                _loc5_ = _loc5_.m_next;
            }
            this.midWheel2Shape.m_filter.groupIndex = 0;
            _loc1_.Refilter(this.midWheel2Shape);
        } else {
            this.seatShape.m_filter.groupIndex = 0;
            this.backShape.m_filter.groupIndex = 0;
            _loc1_.Refilter(this.seatShape);
            _loc1_.Refilter(this.backShape);
        }
        // @ts-expect-error
        this.lowerArm1MC.hand.gotoAndStop(2);
        // @ts-expect-error
        this.lowerArm2MC.hand.gotoAndStop(2);
        var _loc2_: number = this.sleighBody.GetAngle() - Math.PI / 2;
        var _loc3_: number = Math.cos(_loc2_) * this.ejectImpulse;
        var _loc4_: number = Math.sin(_loc2_) * this.ejectImpulse;
        this.chestBody.ApplyImpulse(
            new b2Vec2(_loc3_, _loc4_),
            this.chestBody.GetWorldCenter(),
        );
        this.pelvisBody.ApplyImpulse(
            new b2Vec2(_loc3_, _loc4_),
            this.pelvisBody.GetWorldCenter(),
        );
        if (this.backWheelJoint.IsMotorEnabled()) {
            this.backWheelJoint.EnableMotor(false);
            this.midWheel1Joint.EnableMotor(false);
            this.midWheel2Joint.EnableMotor(false);
            this.frontWheelJoint.EnableMotor(false);
        }
        if (this.snowSpray) {
            this.snowSpray.stopSpewing();
            this.snowSpray = null;
            this.sleighBellLoop.fadeOut(0.5);
            this.sleighBellLoop = null;
        }
    }

    public checkEject() {
        if (
            !this.reignsHand1 &&
            !this.reignsHand2 &&
            !this.sleighFoot1 &&
            !this.sleighFoot2
        ) {
            this.eject();
        }
    }

    public override set dead(param1: boolean) {
        if (this._dead == param1) {
            return;
        }
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

    protected sleighSmash(param1: number) {
        var _loc13_: b2Body = null;
        var _loc14_: any[] = null;
        var _loc15_: Sprite = null;
        trace(
            this.tag +
            " sleigh impulse " +
            param1 +
            " -> " +
            this._session.iteration,
        );
        this.contactImpulseDict.delete(this.frontShape);
        var _loc2_: ContactListener = this._session.contactListener;
        _loc2_.deleteListener(ContactListener.RESULT, this.rearShape);
        _loc2_.deleteListener(ContactListener.RESULT, this.frontShape);
        _loc2_.deleteListener(ContactListener.RESULT, this.bumperShape);
        _loc2_.deleteListener(ContactListener.ADD, this.rearShape);
        _loc2_.deleteListener(ContactListener.ADD, this.frontShape);
        _loc2_.deleteListener(ContactListener.ADD, this.bumperShape);
        if (this.baseShape) {
            _loc2_.deleteListener(ContactListener.RESULT, this.baseShape);
            _loc2_.deleteListener(ContactListener.ADD, this.baseShape);
        }
        var _loc3_: b2Vec2 = this.sleighBody.GetLocalCenter();
        this._session.particleController.createPointBurst(
            "sleighShards",
            _loc3_.x * this.m_physScale,
            _loc3_.y * this.m_physScale,
            100,
            30,
            20,
        );
        this.eject();
        if (this.snowSpray) {
            this.snowSpray.stopSpewing();
            this.snowSpray = null;
            this.sleighBellLoop.fadeOut(0.5);
            this.sleighBellLoop = null;
        }
        var _loc4_: b2World = this._session.m_world;
        var _loc5_: b2Vec2 = this.sleighBody.GetPosition();
        var _loc6_: number = this.sleighBody.GetAngle();
        var _loc7_: b2Vec2 = this.sleighBody.GetLinearVelocity();
        var _loc8_: number = this.sleighBody.GetAngularVelocity();
        _loc4_.DestroyBody(this.sleighBody);
        this.sleighMC.visible = false;
        var _loc9_ = new b2BodyDef();
        _loc9_.position = _loc5_;
        _loc9_.angle = _loc6_;
        var _loc10_ = new b2PolygonDef();
        _loc10_.density = 3;
        _loc10_.friction = 0.3;
        _loc10_.restitution = 0.3;
        _loc10_.filter = this.zeroFilter;
        var _loc11_ = int(this.vertsBrokenSleigh.length);
        var _loc12_: number = 0;
        while (_loc12_ < _loc11_) {
            _loc13_ = _loc4_.CreateBody(_loc9_);
            _loc14_ = this.vertsBrokenSleigh[_loc12_];
            _loc15_ = this.brokenSleighMCs[_loc12_];
            _loc10_.vertexCount = _loc14_.length;
            _loc10_.vertices = _loc14_;
            _loc13_.CreateShape(_loc10_);
            _loc13_.SetMassFromShapes();
            _loc13_.SetAngularVelocity(_loc8_);
            _loc13_.SetLinearVelocity(
                this.sleighBody.GetLinearVelocityFromLocalPoint(
                    _loc13_.GetLocalCenter(),
                ),
            );
            _loc13_.SetUserData(_loc15_);
            _loc15_.visible = true;
            this.paintVector.push(_loc13_);
            _loc12_++;
        }
        // @ts-expect-error
        if (this.sleighMC.inner.ski.visible == true) {
            this.skiSmash(0);
        }
        // @ts-expect-error
        if (this.sleighMC.inner.stem.visible == true) {
            this.stemSmash(0, false);
        }
        if (this.elf1.strappedIn) {
            this.breakStrap(this.elf1);
        }
        if (this.elf2.strappedIn) {
            this.breakStrap(this.elf2);
        }
        this.elf1.eject();
        this.elf2.eject();
        SoundController.instance.playAreaSoundInstance(
            "SleighSmash",
            this.sleighBody,
        );
    }

    protected skiSmash(param1: number) {
        var _loc13_: b2Body = null;
        var _loc14_: any[] = null;
        var _loc15_: Sprite = null;
        var _loc16_: b2Vec2 = null;
        var _loc17_: MovieClip = null;
        var _loc18_: b2Vec2 = null;
        trace(
            this.tag +
            " ski impulse " +
            param1 +
            " -> " +
            this._session.iteration,
        );
        this.contactImpulseDict.delete(this.skiShape);
        var _loc2_: ContactListener = this._session.contactListener;
        _loc2_.deleteListener(ContactListener.RESULT, this.skiShape);
        _loc2_.deleteListener(ContactListener.ADD, this.frontWheelShape);
        _loc2_.deleteListener(ContactListener.ADD, this.backWheelShape);
        _loc2_.deleteListener(ContactListener.REMOVE, this.frontWheelShape);
        _loc2_.deleteListener(ContactListener.REMOVE, this.backWheelShape);
        var _loc3_: b2World = this._session.m_world;
        var _loc4_: b2Vec2 = this.sleighBody.GetPosition();
        var _loc5_: number = this.sleighBody.GetAngle();
        var _loc6_: b2Vec2 = this.sleighBody.GetLinearVelocity();
        var _loc7_: number = this.sleighBody.GetAngularVelocity();
        _loc3_.DestroyBody(this.backWheelBody);
        _loc3_.DestroyBody(this.midWheel1Body);
        _loc3_.DestroyBody(this.midWheel2Body);
        _loc3_.DestroyBody(this.frontWheelBody);
        if (this.skiLoop) {
            this.skiLoop.stopSound();
        }
        this.frontContacts = 0;
        this.backContacts = 0;
        var _loc8_ = new b2BodyDef();
        _loc8_.position = _loc4_;
        _loc8_.angle = _loc5_;
        var _loc9_ = new b2PolygonDef();
        _loc9_.density = 3;
        _loc9_.friction = 0.3;
        _loc9_.restitution = 0.3;
        _loc9_.filter = this.zeroFilter;
        var _loc10_ = new Array();
        var _loc11_ = int(this.vertsBrokenSki.length);
        var _loc12_: number = 0;
        while (_loc12_ < _loc11_) {
            _loc13_ = _loc3_.CreateBody(_loc8_);
            _loc14_ = this.vertsBrokenSki[_loc12_];
            _loc15_ = this.brokenSkiMCs[_loc12_];
            _loc9_.vertexCount = _loc14_.length;
            _loc9_.vertices = _loc14_;
            _loc13_.CreateShape(_loc9_);
            _loc13_.SetMassFromShapes();
            _loc13_.SetAngularVelocity(_loc7_);
            _loc13_.SetLinearVelocity(
                this.sleighBody.GetLinearVelocityFromLocalPoint(
                    _loc13_.GetLocalCenter(),
                ),
            );
            _loc13_.SetUserData(_loc15_);
            _loc15_.visible = true;
            this.paintVector.push(_loc13_);
            _loc10_.push(_loc13_);
            _loc12_++;
        }
        if (this.sleighMC.visible) {
            // @ts-expect-error
            this.sleighMC.inner.ski.visible = false;
            this.sleighBody.DestroyShape(this.skiShape);
            _loc9_.vertexCount = this.newBaseVerts.length;
            _loc9_.vertices = this.newBaseVerts;
            this.baseShape = this.sleighBody.CreateShape(
                _loc9_,
            ) as b2PolygonShape;
            this.contactAddSounds.set(this.baseShape, "SleighImpact1");
            this._session.contactListener.registerListener(
                ContactListener.RESULT,
                this.baseShape,
                this.contactSleighResultHandler,
            );
            this._session.contactListener.registerListener(
                ContactListener.ADD,
                this.baseShape,
                this.contactAddHandler,
            );
            this.sleighBody.SetMassFromShapes();
            _loc16_ = this.sleighBody.GetLocalCenter();
            _loc16_ = new b2Vec2(
                (this._startX - _loc16_.x) * this.character_scale,
                (this._startY - _loc16_.y) * this.character_scale,
            );
            _loc17_ = this.shapeGuide["rear_1"];
            _loc18_ = new b2Vec2(_loc17_.x + _loc16_.x, _loc17_.y + _loc16_.y);
            // @ts-expect-error
            this.sleighMC.inner.x = _loc18_.x;
            // @ts-expect-error
            this.sleighMC.inner.y = _loc18_.y;
            _loc11_ = int(_loc10_.length);
            _loc12_ = 0;
            while (_loc12_ < _loc11_) {
                this.antiGravArray.push(_loc10_[_loc12_]);
                _loc12_++;
            }
        }
        SoundController.instance.playAreaSoundInstance(
            "SkiSmash",
            this.sleighBody,
        );
    }

    protected stemSmash(param1: number, param2: boolean = true) {
        var _loc14_: any[] = null;
        var _loc15_: b2Vec2 = null;
        var _loc16_: MovieClip = null;
        var _loc17_: b2Vec2 = null;
        var _loc18_: b2DistanceJoint = null;
        var _loc19_: b2DistanceJointDef = null;
        var _loc20_: b2DistanceJoint = null;
        trace(
            this.tag +
            " stem impulse " +
            param1 +
            " -> " +
            this._session.iteration,
        );
        this.contactImpulseDict.delete(this.stem3Shape);
        var _loc3_: ContactListener = this._session.contactListener;
        _loc3_.deleteListener(ContactListener.RESULT, this.stem1Shape);
        _loc3_.deleteListener(ContactListener.RESULT, this.stem2Shape);
        _loc3_.deleteListener(ContactListener.RESULT, this.stem3Shape);
        _loc3_.deleteListener(ContactListener.ADD, this.stem1Shape);
        _loc3_.deleteListener(ContactListener.ADD, this.stem2Shape);
        _loc3_.deleteListener(ContactListener.ADD, this.stem3Shape);
        var _loc4_: b2World = this._session.m_world;
        var _loc5_: b2Vec2 = this.sleighBody.GetPosition();
        var _loc6_: number = this.sleighBody.GetAngle();
        var _loc7_: b2Vec2 = this.sleighBody.GetLinearVelocity();
        var _loc8_: number = this.sleighBody.GetAngularVelocity();
        var _loc9_ = new b2BodyDef();
        _loc9_.position = _loc5_;
        _loc9_.angle = _loc6_;
        var _loc10_ = new b2PolygonDef();
        _loc10_.density = 3;
        _loc10_.friction = 0.3;
        _loc10_.restitution = 0.3;
        _loc10_.filter = this.zeroFilter;
        var _loc11_ = int(this.vertsBrokenStem.length);
        var _loc12_: b2Body = _loc4_.CreateBody(_loc9_);
        var _loc13_: number = 0;
        while (_loc13_ < _loc11_) {
            _loc14_ = this.vertsBrokenStem[_loc13_];
            _loc10_.vertexCount = _loc14_.length;
            _loc10_.vertices = _loc14_;
            _loc12_.CreateShape(_loc10_);
            _loc13_++;
        }
        _loc12_.SetMassFromShapes();
        _loc12_.SetAngularVelocity(_loc8_);
        _loc12_.SetLinearVelocity(
            this.sleighBody.GetLinearVelocityFromLocalPoint(
                _loc12_.GetLocalCenter(),
            ),
        );
        _loc12_.SetUserData(this.stemMC);
        this.stemMC.visible = true;
        this.paintVector.push(_loc12_);
        if (this.sleighMC.visible) {
            // @ts-expect-error
            this.sleighMC.inner.stem.visible = false;
            this.sleighBody.DestroyShape(this.stem1Shape);
            this.sleighBody.DestroyShape(this.stem2Shape);
            this.sleighBody.DestroyShape(this.stem3Shape);
            this.sleighBody.SetMassFromShapes();
            _loc15_ = this.sleighBody.GetLocalCenter();
            _loc15_ = new b2Vec2(
                (this._startX - _loc15_.x) * this.character_scale,
                (this._startY - _loc15_.y) * this.character_scale,
            );
            _loc16_ = this.shapeGuide["rear_1"];
            _loc17_ = new b2Vec2(_loc16_.x + _loc15_.x, _loc16_.y + _loc15_.y);
            // @ts-expect-error
            this.sleighMC.inner.x = _loc17_.x;
            // @ts-expect-error
            this.sleighMC.inner.y = _loc17_.y;
            if (this.elf1.strappedIn) {
                _loc18_ = this.strapChest1Joints[0];
                _loc19_ = new b2DistanceJointDef();
                _loc19_.body1 = _loc12_;
                _loc19_.body2 = _loc18_.m_body2;
                _loc19_.localAnchor1 = _loc18_.m_localAnchor1;
                _loc19_.localAnchor2 = _loc18_.m_localAnchor2;
                _loc19_.length = _loc18_.m_length;
                _loc20_ = _loc4_.CreateJoint(_loc19_) as b2DistanceJoint;
                _loc4_.DestroyJoint(_loc18_);
                this.strapChest1Joints[0] = _loc20_;
            }
            if (this.elf2.strappedIn) {
                _loc18_ = this.strapChest2Joints[0];
                _loc19_ = new b2DistanceJointDef();
                _loc19_.body1 = _loc12_;
                _loc19_.body2 = _loc18_.m_body2;
                _loc19_.localAnchor1 = _loc18_.m_localAnchor1;
                _loc19_.localAnchor2 = _loc18_.m_localAnchor2;
                _loc19_.length = _loc18_.m_length;
                _loc20_ = _loc4_.CreateJoint(_loc19_) as b2DistanceJoint;
                _loc4_.DestroyJoint(_loc18_);
                this.strapChest2Joints[0] = _loc20_;
            }
            this.antiGravArray.push(_loc12_);
        }
        if (param2) {
            SoundController.instance.playAreaSoundInstance(
                "StemSnap",
                this.sleighBody,
            );
        }
    }

    public helmetSmash(param1: number) {
        var _loc6_: MovieClip = null;
        trace("helmet impulse " + param1 + " -> " + this._session.iteration);
        this.contactImpulseDict.delete(this.helmetShape);
        this.head1Shape = this.helmetShape;
        this.contactImpulseDict.set(this.head1Shape, this.headSmashLimit);
        this.helmetShape = null;
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
    }

    public override pelvisSmash(param1: number) {
        super.pelvisSmash(param1);
    }

    public override neckBreak(
        param1: number,
        param2: boolean = true,
        param3: boolean = true,
    ) {
        super.neckBreak(param1, param2, param3);
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

    public override elbowBreak1(param1: number) {
        super.elbowBreak1(param1);
        if (this.ejected) {
            return;
        }
        if (this.reignsHand1) {
            this._session.m_world.DestroyJoint(this.reignsHand1);
            this.reignsHand1 = null;
            this.checkReigns();
        }
    }

    public override elbowBreak2(param1: number) {
        super.elbowBreak2(param1);
        if (this.ejected) {
            return;
        }
        if (this.reignsHand2) {
            this._session.m_world.DestroyJoint(this.reignsHand2);
            this.reignsHand2 = null;
            this.checkReigns();
        }
    }

    public override kneeBreak1(param1: number) {
        super.kneeBreak1(param1);
        if (this.ejected) {
            return;
        }
        if (this.sleighFoot1) {
            this._session.m_world.DestroyJoint(this.sleighFoot1);
            this.sleighFoot1 = null;
            this.checkEject();
        }
    }

    public override kneeBreak2(param1: number) {
        super.kneeBreak2(param1);
        if (this.ejected) {
            return;
        }
        if (this.sleighFoot2) {
            this._session.m_world.DestroyJoint(this.sleighFoot2);
            this.sleighFoot2 = null;
            this.checkEject();
        }
    }

    public override shoulderBreak1(param1: number, param2: boolean = true) {
        super.shoulderBreak1(param1, param2);
        if (this.ejected) {
            return;
        }
        if (this.reignsHand1) {
            this._session.m_world.DestroyJoint(this.reignsHand1);
            this.reignsHand1 = null;
            this.checkReigns();
        }
        if (this.upperArm3Body) {
            this.antiGravArray.push(this.upperArm3Body);
        }
    }

    public override shoulderBreak2(param1: number, param2: boolean = true) {
        super.shoulderBreak2(param1, param2);
        if (this.ejected) {
            return;
        }
        if (this.reignsHand2) {
            this._session.m_world.DestroyJoint(this.reignsHand2);
            this.reignsHand2 = null;
            this.checkReigns();
        }
        if (this.upperArm4Body) {
            this.antiGravArray.push(this.upperArm4Body);
        }
    }

    public override hipBreak1(param1: number, param2: boolean = true) {
        super.hipBreak1(param1, param2);
        if (this.ejected) {
            return;
        }
        if (this.sleighFoot1) {
            this._session.m_world.DestroyJoint(this.sleighFoot1);
            this.sleighFoot1 = null;
            this.checkEject();
        }
        if (this.upperLeg3Body) {
            this.antiGravArray.push(this.upperLeg3Body);
        }
    }

    public override hipBreak2(param1: number, param2: boolean = true) {
        super.hipBreak2(param1, param2);
        if (this.ejected) {
            return;
        }
        if (this.sleighFoot2) {
            this._session.m_world.DestroyJoint(this.sleighFoot2);
            this.sleighFoot2 = null;
            this.checkEject();
        }
        if (this.upperLeg4Body) {
            this.antiGravArray.push(this.upperLeg4Body);
        }
    }

    public override footSmash1(param1: number) {
        super.footSmash1(param1);
        this.antiGravArray.push(this.foot1Body);
    }

    public override footSmash2(param1: number) {
        super.footSmash2(param1);
        this.antiGravArray.push(this.foot1Body);
    }

    private checkReigns() {
        var _loc1_: b2BodyDef = null;
        var _loc2_: b2CircleDef = null;
        var _loc3_: b2DistanceJoint = null;
        var _loc4_: b2Vec2 = null;
        var _loc5_: b2Body = null;
        var _loc6_: b2DistanceJointDef = null;
        var _loc7_: b2DistanceJoint = null;
        if (this.reignsHand1 == null && this.reignsHand2 == null) {
            this._session.m_world.DestroyJoint(this.sleighReigns);
            this.sleighReigns = null;
            _loc1_ = new b2BodyDef();
            _loc2_ = new b2CircleDef();
            _loc2_.density = 0.25;
            _loc2_.friction = 1;
            _loc2_.restitution = 0.1;
            _loc2_.filter.categoryBits = 0;
            _loc2_.filter.maskBits = 0;
            _loc2_.radius = 0.048;
            _loc3_ = this.strapHeadJoints[0];
            _loc4_ = _loc3_.GetAnchor1();
            _loc1_.position.SetV(_loc4_);
            _loc5_ = this._session.m_world.CreateBody(_loc1_);
            _loc5_.CreateShape(_loc2_);
            _loc5_.SetMassFromShapes();
            _loc5_.SetLinearVelocity(this.reignsBody.GetLinearVelocity());
            this.antiGravArray.push(_loc5_);
            _loc6_ = new b2DistanceJointDef();
            _loc6_.Initialize(
                _loc5_,
                _loc3_.m_body2,
                _loc4_,
                _loc3_.m_body2.GetPosition(),
            );
            _loc6_.length = _loc3_.m_length;
            _loc7_ = this._session.m_world.CreateJoint(
                _loc6_,
            ) as b2DistanceJoint;
            this._session.m_world.DestroyJoint(_loc3_);
            this.strapHeadJoints[0] = _loc7_;
            this._session.m_world.DestroyBody(this.reignsBody);
            this.reignsBody = null;
            this.checkEject();
        }
    }

    private breakStrap(param1: SleighElf) {
        var _loc9_: any[] = null;
        var _loc10_: b2Vec2 = null;
        var _loc11_: string = null;
        param1.strappedIn = false;
        var _loc2_ = new b2BodyDef();
        var _loc3_ = new b2CircleDef();
        _loc3_.density = 0.25;
        _loc3_.friction = 1;
        _loc3_.restitution = 0.1;
        _loc3_.filter.categoryBits = 0;
        _loc3_.filter.maskBits = 0;
        _loc3_.radius = 0.048;
        if (param1 == this.elf1) {
            _loc9_ = this.strapChest1Joints;
            _loc10_ = new b2Vec2();
            _loc11_ = "StrapSnap1";
        } else {
            _loc9_ = this.strapChest2Joints;
            _loc10_ = new b2Vec2(0, -0.016);
            _loc11_ = "StrapSnap2";
        }
        var _loc4_: b2DistanceJoint = _loc9_[0];
        var _loc5_: b2Vec2 = _loc4_.GetAnchor1();
        _loc2_.position.SetV(_loc5_);
        var _loc6_: b2Body = this._session.m_world.CreateBody(_loc2_);
        _loc6_.CreateShape(_loc3_);
        _loc6_.SetMassFromShapes();
        _loc6_.SetLinearVelocity(
            this.sleighBody.GetLinearVelocityFromWorldPoint(_loc5_),
        );
        this.antiGravArray.push(_loc6_);
        var _loc7_ = new b2DistanceJointDef();
        _loc7_.Initialize(
            _loc6_,
            _loc4_.m_body2,
            _loc5_,
            _loc4_.m_body2.GetWorldPoint(_loc10_),
        );
        _loc7_.length = _loc4_.m_length;
        var _loc8_: b2DistanceJoint = this._session.m_world.CreateJoint(
            _loc7_,
        ) as b2DistanceJoint;
        this._session.m_world.DestroyJoint(_loc4_);
        _loc9_[0] = _loc8_;
        SoundController.instance.playAreaSoundInstance(_loc11_, _loc6_);
    }

    public elfHeadRemove(param1: SleighElf, param2: boolean) {
        var _loc7_: number = 0;
        var _loc8_: b2DistanceJoint = null;
        var _loc9_: b2DistanceJoint = null;
        var _loc10_: b2DistanceJoint = null;
        if (!param1.headAttached) {
            return;
        }
        param1.headAttached = false;
        var _loc3_ = new b2BodyDef();
        var _loc4_ = new b2CircleDef();
        _loc4_.density = 0.25;
        _loc4_.friction = 1;
        _loc4_.restitution = 0.1;
        _loc4_.filter.categoryBits = 0;
        _loc4_.filter.maskBits = 0;
        _loc4_.radius = 0.048;
        _loc3_.position = param1.head1Body.GetWorldPoint(
            new b2Vec2(-0.288, 0.064),
        );
        var _loc5_: b2Body = this._session.m_world.CreateBody(_loc3_);
        _loc5_.CreateShape(_loc4_);
        _loc5_.SetMassFromShapes();
        _loc5_.SetLinearVelocity(param1.head1Body.GetLinearVelocity());
        this.antiGravArray.push(_loc5_);
        var _loc6_ = new b2DistanceJointDef();
        if (param1 == this.elf1) {
            _loc7_ = 7;
            _loc8_ = this.strapHeadJoints[_loc7_];
            _loc6_.Initialize(
                _loc8_.m_body1,
                _loc5_,
                _loc8_.m_body1.GetPosition(),
                _loc3_.position,
            );
            _loc6_.length = _loc8_.m_length;
            _loc9_ = this._session.m_world.CreateJoint(
                _loc6_,
            ) as b2DistanceJoint;
            this.strapHeadJoints[_loc7_] = _loc9_;
            _loc7_ += 1;
            _loc10_ = this.strapHeadJoints[_loc7_];
            _loc6_.Initialize(
                _loc5_,
                _loc10_.m_body2,
                _loc3_.position,
                _loc10_.m_body2.GetPosition(),
            );
            _loc6_.length = _loc8_.m_length;
            _loc9_ = this._session.m_world.CreateJoint(
                _loc6_,
            ) as b2DistanceJoint;
            this.strapHeadJoints[_loc7_] = _loc9_;
            if (!param2) {
                this._session.m_world.DestroyJoint(_loc8_);
                this._session.m_world.DestroyJoint(_loc10_);
            }
        } else {
            _loc7_ = int(this.strapHeadJoints.length - 1);
            _loc8_ = this.strapHeadJoints[_loc7_];
            _loc6_.Initialize(
                _loc8_.m_body1,
                _loc5_,
                _loc8_.m_body1.GetPosition(),
                _loc3_.position,
            );
            _loc6_.length = _loc8_.m_length;
            _loc9_ = this._session.m_world.CreateJoint(
                _loc6_,
            ) as b2DistanceJoint;
            this.strapHeadJoints[_loc7_] = _loc9_;
            if (!param2) {
                this._session.m_world.DestroyJoint(_loc8_);
            }
        }
    }

    public elfChestRemove(param1: SleighElf, param2: boolean) {
        var _loc7_: number = 0;
        var _loc8_: b2DistanceJoint = null;
        var _loc9_: b2DistanceJoint = null;
        if (!param1.chestAttached) {
            return;
        }
        param1.chestAttached = false;
        var _loc3_ = new b2BodyDef();
        var _loc4_ = new b2CircleDef();
        _loc4_.density = 0.25;
        _loc4_.friction = 1;
        _loc4_.restitution = 0.1;
        _loc4_.filter.categoryBits = 0;
        _loc4_.filter.maskBits = 0;
        _loc4_.radius = 0.048;
        _loc3_.position = param1.chestBody.GetWorldPoint(new b2Vec2(0, 0.16));
        var _loc5_: b2Body = this._session.m_world.CreateBody(_loc3_);
        _loc5_.CreateShape(_loc4_);
        _loc5_.SetMassFromShapes();
        _loc5_.SetLinearVelocity(param1.chestBody.GetLinearVelocity());
        this.antiGravArray.push(_loc5_);
        var _loc6_ = new b2DistanceJointDef();
        if (param1 == this.elf1) {
            _loc7_ = int(this.strapChest1Joints.length - 1);
            _loc8_ = this.strapChest1Joints[_loc7_];
            _loc6_.Initialize(
                _loc8_.m_body1,
                _loc5_,
                _loc8_.m_body1.GetWorldPoint(new b2Vec2(0, -0.016)),
                _loc3_.position,
            );
            _loc6_.length = _loc8_.m_length;
            _loc9_ = this._session.m_world.CreateJoint(
                _loc6_,
            ) as b2DistanceJoint;
            this.strapChest1Joints[_loc7_] = _loc9_;
        } else {
            _loc7_ = int(this.strapChest2Joints.length - 1);
            _loc8_ = this.strapChest2Joints[_loc7_];
            _loc6_.Initialize(
                _loc8_.m_body1,
                _loc5_,
                _loc8_.m_body1.GetWorldPoint(new b2Vec2(0, -0.016)),
                _loc3_.position,
            );
            _loc6_.length = _loc8_.m_length;
            _loc9_ = this._session.m_world.CreateJoint(
                _loc6_,
            ) as b2DistanceJoint;
            this.strapChest2Joints[_loc7_] = _loc9_;
        }
        if (!this.headSmashed) {
            this._session.m_world.DestroyJoint(_loc8_);
        }
    }

    public mourn(param1: SleighElf) {
        if (!this._dead) {
            if (param1 == this.elf1) {
                this.addVocals("Mourn2", 3);
            }
            if (param1 == this.elf2) {
                this.addVocals("Mourn1", 3);
            }
        }
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