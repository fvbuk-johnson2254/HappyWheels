import b2CircleDef from "@/Box2D/Collision/Shapes/b2CircleDef";
import b2CircleShape from "@/Box2D/Collision/Shapes/b2CircleShape";
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
import DisplayObject from "flash/display/DisplayObject";
import MovieClip from "flash/display/MovieClip";
import Sprite from "flash/display/Sprite";
import { boundClass } from 'autobind-decorator';

@boundClass
export default class MiddleAgedExplorer extends CharacterB2D {
    private static GRAVITY_DISPLACEMENT: number;
    public static piOverOneEighty: number = Math.PI / 180;
    protected ejected: boolean;
    protected hatOn: boolean;
    protected wheelMaxSpeed: number = 1000;
    protected wheelCurrentSpeed: number;
    protected wheelNewSpeed: number;
    protected accelStep: number = 1;
    protected prisAccelStep: number = 0.5;
    protected maxTorque: number = 40;
    protected wheelContacts: number = 0;
    protected impulseMagnitude: number = 3;
    protected impulseLeft: number = 0.7;
    protected impulseRight: number = 0.7;
    protected impulseOffset: number = 1;
    protected maxSpinAV: number = 5;
    protected hatSmashLimit: number = 0.75;
    protected frameSmashLimit: number = 150;
    protected wheelSparkLimit: number = 8;
    protected frameSmashed: boolean;
    protected wheelLoop1: AreaSoundLoop;
    protected wheelLoop2: AreaSoundLoop;
    protected wheelLoop3: AreaSoundLoop;
    protected motorSound: AreaSoundLoop;
    protected handleAnchorPoint: b2Vec2;
    protected footAnchorPoint: b2Vec2;
    protected frameHand1JointDef: b2RevoluteJointDef;
    protected frameHand2JointDef: b2RevoluteJointDef;
    protected cartFoot1JointDef: b2RevoluteJointDef;
    protected cartFoot2JointDef: b2RevoluteJointDef;
    public frameBody: b2Body;
    public frontWheelBody: b2Body;
    public backWheelBody: b2Body;
    public hatBody: b2Body;
    public hatShape: b2Shape;
    public frameBottomShape: b2Shape;
    public frameLeftShape: b2Shape;
    public frameRightShape: b2Shape;
    public frontWheelShape: b2Shape;
    public backWheelShape: b2Shape;
    public frameMC: MovieClip;
    public frontWheelMC: MovieClip;
    public backWheelMC: MovieClip;
    public hatMC: MovieClip;
    public cartSmashedMC: MovieClip;
    public frameLeftSmashedMC: MovieClip;
    public frameRightSmashedMC: MovieClip;
    public frameBottomSmashedMC: MovieClip;
    public engineSmashedMC: MovieClip;
    public frontWheelJoint: b2RevoluteJoint;
    public backWheelJoint: b2RevoluteJoint;
    public frameHand1Joint: b2RevoluteJoint;
    public frameHand2Joint: b2RevoluteJoint;
    public cartFoot1Joint: b2RevoluteJoint;
    public cartFoot2Joint: b2RevoluteJoint;
    public frontDongleRailJoint: b2PrismaticJoint;
    public backDongleRailJoint: b2PrismaticJoint;
    public frontDongleRevJoint: b2RevoluteJoint;
    public backDongleRevJoint: b2RevoluteJoint;
    public connecting: boolean = false;
    public frontWheelPos: b2Vec2;
    public backWheelPos: b2Vec2;
    public frontRailBody: b2Body;
    public backRailBody: b2Body;
    public newFrontWheelRailBody: b2Body;
    public newBackWheelRailBody: b2Body;
    public previousFrontRailBody: b2Body;
    public previousBackRailBody: b2Body;
    public frontDongleBody: b2Body;
    public backDongleBody: b2Body;
    public destroyFrontDongle: boolean = false;
    public destroyBackDongle: boolean = false;
    public railDistanceMin: number = 37;
    public railJointY: number;
    public testSprite: Sprite;
    public frontWheelContactPoint: b2ContactPoint;
    public backWheelContactPoint: b2ContactPoint;
    public clickVolume: number = 0.6;
    public oneDongleCounter: number = 0;
    public oneDongleMax: number = 35;
    public frontDongleRevJointStartAngle: number;
    public backDongleRevJointStartAngle: number;

    constructor(
        param1: number,
        param2: number,
        param3: DisplayObject,
        param4: Session,
    ) {
        param1 += 20;
        param2 -= 40;
        super(param1, param2, param3, param4, -1, "Char2");
        this.railJointY = -23 / this.m_physScale;
    }

    public override leftPressedActions() {
        var _loc1_: number = NaN;
        var _loc2_: number = NaN;
        var _loc3_: number = NaN;
        var _loc4_: number = NaN;
        var _loc5_: number = NaN;
        var _loc6_: number = NaN;
        var _loc7_: b2Vec2 = null;
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
            _loc4_ = 0;
            _loc5_ = Math.cos(_loc1_) * (this.impulseLeft + _loc4_) * _loc3_;
            _loc6_ = Math.sin(_loc1_) * (this.impulseLeft + _loc4_) * _loc3_;
            _loc7_ = this.frameBody.GetLocalCenter();
            this.frameBody.ApplyImpulse(
                new b2Vec2(_loc6_, -_loc5_),
                this.frameBody.GetWorldPoint(
                    new b2Vec2(_loc7_.x + this.impulseOffset, _loc7_.y),
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
        var _loc7_: number = NaN;
        var _loc8_: b2Vec2 = null;
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
            _loc5_ = 0;
            _loc6_ = Math.cos(_loc1_) * (this.impulseRight + _loc5_) * _loc3_;
            _loc7_ = Math.sin(_loc1_) * (this.impulseRight + _loc5_) * _loc3_;
            _loc8_ = this.frameBody.GetLocalCenter();
            this.frameBody.ApplyImpulse(
                new b2Vec2(_loc7_, -_loc6_),
                this.frameBody.GetWorldPoint(
                    new b2Vec2(_loc8_.x - this.impulseOffset, _loc8_.y),
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
            this.accelerateMotorSpeed(
                this.frontDongleBody,
                this.frontWheelJoint,
                this.frontDongleRailJoint,
            );
            this.accelerateMotorSpeed(
                this.backDongleBody,
                this.backWheelJoint,
                this.backDongleRailJoint,
            );
        }
    }

    public accelerateMotorSpeed(
        param1: b2Body,
        param2: b2RevoluteJoint,
        param3: b2PrismaticJoint,
    ) {
        if (param1) {
            if (param2.IsMotorEnabled()) {
                param2.EnableMotor(false);
            }
            param3.EnableMotor(true);
            this.acceleratePrisJoint(param3);
        } else {
            if (!param2.IsMotorEnabled()) {
                param2.EnableMotor(true);
            }
            this.accelerateRevoluteJoint(param2);
        }
    }

    public acceleratePrisJoint(param1: b2PrismaticJoint) {
        var _loc2_: number = param1.GetJointSpeed();
        var _loc3_: number =
            _loc2_ < this.wheelMaxSpeed ? _loc2_ + this.prisAccelStep : _loc2_;
        param1.SetMotorSpeed(_loc3_);
    }

    public accelerateRevoluteJoint(param1: b2RevoluteJoint) {
        var _loc2_: number = param1.GetJointSpeed();
        var _loc3_: number =
            _loc2_ < this.wheelMaxSpeed ? _loc2_ + this.accelStep : _loc2_;
        param1.SetMotorSpeed(_loc3_);
    }

    public decelerateRevoluteJoint(param1: b2RevoluteJoint) {
        var _loc3_: number = NaN;
        var _loc2_: number = param1.GetJointSpeed();
        if (_loc2_ > 0) {
            _loc3_ = 0;
        } else {
            _loc3_ =
                _loc2_ > -this.wheelMaxSpeed ? _loc2_ - this.accelStep : _loc2_;
        }
        param1.SetMotorSpeed(_loc3_);
    }

    public deceleratePrisJoint(param1: b2PrismaticJoint) {
        var _loc3_: number = NaN;
        var _loc2_: number = param1.GetJointSpeed();
        if (_loc2_ > 0) {
            _loc3_ = 0;
        } else {
            _loc3_ =
                _loc2_ > -this.wheelMaxSpeed
                    ? _loc2_ - this.prisAccelStep
                    : _loc2_;
        }
        param1.SetMotorSpeed(_loc3_);
    }

    public decelerateMotorSpeed(
        param1: b2Body,
        param2: b2RevoluteJoint,
        param3: b2PrismaticJoint,
    ) {
        if (param1) {
            if (!param2.IsMotorEnabled()) {
                param2.EnableMotor(false);
            }
            param3.EnableMotor(true);
            this.deceleratePrisJoint(param3);
        } else {
            if (!param2.IsMotorEnabled()) {
                param2.EnableMotor(true);
            }
            this.decelerateRevoluteJoint(param2);
        }
    }

    public override downPressedActions() {
        if (this.ejected) {
            this.currentPose = 4;
        } else {
            this.decelerateMotorSpeed(
                this.frontDongleBody,
                this.frontWheelJoint,
                this.frontDongleRailJoint,
            );
            this.decelerateMotorSpeed(
                this.backDongleBody,
                this.backWheelJoint,
                this.backDongleRailJoint,
            );
        }
    }

    public override upAndDownActions() {
        if (this.frontDongleBody) {
            this.frontDongleRailJoint.EnableMotor(false);
        }
        if (this.backDongleBody) {
            this.backDongleRailJoint.EnableMotor(false);
        }
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
            this.connecting = true;
        }
    }

    public override spaceNullActions() {
        if (this.ejected) {
            this.releaseGrip();
        }
        this.connecting = false;
        if (this.frontDongleBody) {
            this.removeFrontDongle();
        }
        if (this.backDongleBody) {
            this.removeBackDongle();
        }
    }

    public override shiftPressedActions() {
        if (this.ejected) {
            this.currentPose = 5;
        } else {
            this.currentPose = 8;
        }
    }

    public override shiftNullActions() {
        if (this._currentPose == 5 || this._currentPose == 8) {
            this.currentPose = 0;
        }
    }

    public override ctrlPressedActions() {
        if (this.ejected) {
            this.currentPose = 6;
        } else {
            this.currentPose = 7;
        }
    }

    public override ctrlNullActions() {
        if (this._currentPose == 6 || this._currentPose == 7) {
            this.currentPose = 0;
        }
    }

    public override zPressedActions() {
        this.eject();
    }

    public wheelIsCloseToRail(param1: b2Body, param2: b2Body): boolean {
        if (
            Math.abs(
                param2.GetLocalPoint(param1.GetPosition()).y * this.m_physScale,
            ) > this.railDistanceMin
        ) {
            return false;
        }
        var _loc3_: b2PolygonShape = param2.GetShapeList() as b2PolygonShape;
        var _loc4_: b2CircleShape = param1.GetShapeList() as b2CircleShape;
        var _loc5_: number =
            Math.abs(_loc3_.GetVertices()[0].x) + _loc4_.m_radius;
        if (Math.abs(param2.GetLocalPoint(param1.GetPosition()).x) > _loc5_) {
            return false;
        }
        return true;
    }

    public dongleRevJointIsCloseToOrigin(param1: b2RevoluteJoint): boolean {
        var _loc2_ = param1.GetAnchor1();
        var _loc3_ = param1.GetAnchor2();
        var _loc4_: number = _loc3_.x - _loc2_.x;
        var _loc5_: number = _loc3_.y - _loc2_.y;
        var _loc6_: number = _loc4_ * _loc4_ + _loc5_ * _loc5_;
        if (_loc6_ > 0.1) {
            return false;
        }
        return true;
    }

    public removeFrontDongle() {
        this._session.m_world.DestroyBody(this.frontDongleBody);
        this.frontDongleBody = null;
        this.frontRailBody = null;
        this.frontDongleRailJoint = null;
        this.oneDongleCounter = 0;
    }

    public removeBackDongle() {
        this._session.m_world.DestroyBody(this.backDongleBody);
        this.backDongleBody = null;
        this.backRailBody = null;
        this.backDongleRailJoint = null;
        this.oneDongleCounter = 0;
    }

    public checkRemoveRailJoints() {
        var _loc1_: boolean = false;
        if (!this.frontDongleBody && !this.backDongleBody) {
            return;
        }
        if (!this.connecting) {
            _loc1_ = false;
            if (this.frontDongleBody) {
                this.removeFrontDongle();
                _loc1_ = true;
            }
            if (this.backDongleBody) {
                this.removeBackDongle();
                _loc1_ = true;
            }
            if (_loc1_) {
                SoundController.instance.playAreaSoundInstance(
                    "DoubleClickReverse",
                    this.frameBody,
                    this.clickVolume,
                );
            }
            return;
        }
        if (this.frontDongleBody) {
            if (
                !this.wheelIsCloseToRail(
                    this.frontWheelBody,
                    this.frontRailBody,
                ) ||
                !this.dongleRevJointIsCloseToOrigin(this.frontDongleRevJoint)
            ) {
                this.removeFrontDongle();
            }
        }
        if (this.backDongleBody) {
            if (
                !this.wheelIsCloseToRail(
                    this.backWheelBody,
                    this.backRailBody,
                ) ||
                !this.dongleRevJointIsCloseToOrigin(this.backDongleRevJoint)
            ) {
                this.removeBackDongle();
            }
        }
    }

    public checkAddRailJoints() {
        var _loc1_: b2Body = null;
        var _loc2_: boolean = false;
        var _loc3_: boolean = false;
        if (this.newFrontWheelRailBody) {
            _loc2_ = false;
            if (this.frontDongleBody) {
                this._session.m_world.DestroyJoint(this.frontDongleRailJoint);
            } else {
                this.frontDongleBody = this.createDongle(
                    this.frontWheelBody,
                    this.frontWheelPos,
                    this.newFrontWheelRailBody,
                );
                this.frontDongleRevJoint = this.createDongleRevJoint(
                    this.frontDongleBody,
                    this.frontWheelPos,
                );
                _loc1_ = this.frontDongleBody;
                _loc2_ = true;
            }
            this.frontDongleRailJoint = this.createPrisJoint(
                this.frontDongleBody,
                this.newFrontWheelRailBody,
                this.frontWheelBody,
                this.frontWheelPos,
            );
            this.previousFrontRailBody = this.frontRailBody;
            this.frontRailBody = this.newFrontWheelRailBody;
            if (_loc2_) {
                this.addSparkForAttachedWheel(
                    this.frontWheelBody,
                    this.frontRailBody,
                );
            }
            this.newFrontWheelRailBody = null;
        }
        if (this.newBackWheelRailBody) {
            _loc3_ = false;
            if (this.backDongleBody) {
                this._session.m_world.DestroyJoint(this.backDongleRailJoint);
            } else {
                this.backDongleBody = this.createDongle(
                    this.backWheelBody,
                    this.backWheelPos,
                    this.newBackWheelRailBody,
                );
                this.backDongleRevJoint = this.createDongleRevJoint(
                    this.backDongleBody,
                    this.backWheelPos,
                );
                _loc1_ = this.backDongleBody;
                _loc3_ = true;
            }
            this.backDongleRailJoint = this.createPrisJoint(
                this.backDongleBody,
                this.newBackWheelRailBody,
                this.backWheelBody,
                this.backWheelPos,
            );
            this.previousBackRailBody = this.backRailBody;
            this.backRailBody = this.newBackWheelRailBody;
            if (_loc3_) {
                this.addSparkForAttachedWheel(
                    this.backWheelBody,
                    this.backRailBody,
                );
            }
            this.newBackWheelRailBody = null;
        }
        if (_loc1_) {
            SoundController.instance.playAreaSoundInstance(
                "DoubleClick",
                _loc1_,
                this.clickVolume,
            );
        }
    }

    public checkPrisJoint(param1: b2PrismaticJoint, param2: number, param3) {
        var _loc4_ = undefined;
        var _loc5_ = undefined;
        var _loc6_: number = NaN;
        var _loc7_: number = NaN;
        var _loc8_: number = NaN;
        if (Boolean(param1) && !param1.broken) {
            _loc4_ = param1.GetAnchor1();
            _loc5_ = param1.GetAnchor2();
            _loc6_ = _loc5_.x - _loc4_.x;
            _loc7_ = _loc5_.y - _loc4_.y;
            _loc8_ = Math.sqrt(_loc6_ * _loc6_ + _loc7_ * _loc7_);
            if (_loc8_ > 0.5) {
                trace("pris joint break!");
            }
        }
    }

    public override actions() {
        var _loc1_: number = NaN;
        this.checkRemoveRailJoints();
        if (!this.ejected) {
            this.checkAddRailJoints();
        }
        if (this.frontDongleBody) {
            this.frontDongleBody.m_linearVelocity.y +=
                MiddleAgedExplorer.GRAVITY_DISPLACEMENT;
        }
        if (this.backDongleBody) {
            this.backDongleBody.m_linearVelocity.y +=
                MiddleAgedExplorer.GRAVITY_DISPLACEMENT;
        }
        if (Boolean(this.frontDongleBody) && !this.backDongleBody) {
            if (++this.oneDongleCounter == this.oneDongleMax) {
                this.removeFrontDongle();
            }
        }
        if (Boolean(this.backDongleBody) && !this.frontDongleBody) {
            if (++this.oneDongleCounter == this.oneDongleMax) {
                this.removeBackDongle();
            }
        }
        if (this.wheelContacts > 0) {
            _loc1_ = Math.abs(this.backWheelBody.GetAngularVelocity());
            if (_loc1_ > 50) {
                if (!this.wheelLoop3) {
                    this.wheelLoop3 =
                        SoundController.instance.playAreaSoundLoop(
                            "ExplorerRoll3",
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
                            "ExplorerRoll2",
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
                            "ExplorerRoll1",
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
        this.hatOn = true;
        this.frameSmashed = false;
        this.ejected = false;
        this.connecting = false;
        this.frontDongleBody = null;
        this.backDongleBody = null;
        this.newFrontWheelRailBody = null;
        this.newBackWheelRailBody = null;
        this.previousFrontRailBody = null;
        this.previousBackRailBody = null;
        this.oneDongleCounter = 0;
        this.destroyFrontDongle = false;
        this.destroyBackDongle = false;
        this.wheelContacts = 0;
    }

    public override die() {
        super.die();
        this.hatBody = null;
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

    public override createBodies() {
        var _loc10_: number = 0;
        var _loc11_: MovieClip = null;
        super.createBodies();
        var _loc1_ = new b2BodyDef();
        var _loc2_ = new b2BodyDef();
        var _loc3_ = new b2BodyDef();
        var _loc4_ = new b2PolygonDef();
        var _loc5_ = new b2CircleDef();
        _loc4_.density = 1.5;
        _loc4_.friction = 0.3;
        _loc4_.restitution = 0.1;
        _loc4_.filter.categoryBits = 514;
        _loc5_.density = 12;
        _loc5_.friction = 1;
        _loc5_.restitution = 0.3;
        _loc5_.filter.groupIndex = this.groupID;
        _loc5_.filter.categoryBits = 260;
        _loc5_.filter.maskBits = 268;
        this.frameBody = this._session.m_world.CreateBody(_loc1_);
        var _loc6_: MovieClip = this.shapeGuide["frameBottomShape"];
        var _loc7_ = new b2Vec2(
            this._startX + _loc6_.x / this.character_scale,
            this._startY + _loc6_.y / this.character_scale,
        );
        var _loc8_: number = _loc6_.rotation / CharacterB2D.oneEightyOverPI;
        _loc4_.SetAsOrientedBox(
            (_loc6_.scaleX * 5) / this.character_scale,
            (_loc6_.scaleY * 5) / this.character_scale,
            _loc7_,
            _loc8_,
        );
        this.frameBottomShape = this.frameBody.CreateShape(_loc4_);
        _loc4_.vertexCount = 4;
        var _loc9_: number = 0;
        while (_loc9_ < 2) {
            _loc10_ = 0;
            while (_loc10_ < _loc4_.vertexCount) {
                _loc11_ = this.shapeGuide["sidePoint" + _loc9_ + "_" + _loc10_];
                trace("x: " + _loc11_.x + " y: " + _loc11_.y);
                _loc4_.vertices[_loc10_] = new b2Vec2(
                    this._startX + _loc11_.x / this.character_scale,
                    this._startY + _loc11_.y / this.character_scale,
                );
                _loc10_++;
            }
            if (_loc9_ == 0) {
                this.frameLeftShape = this.frameBody.CreateShape(_loc4_);
            }
            if (_loc9_ == 1) {
                this.frameRightShape = this.frameBody.CreateShape(_loc4_);
            }
            _loc9_++;
        }
        this.frameBody.SetMassFromShapes();
        this.paintVector.push(this.frameBody);
        this._session.contactListener.registerListener(
            ContactListener.RESULT,
            this.frameBottomShape,
            this.contactResultHandler,
        );
        this._session.contactListener.registerListener(
            ContactListener.RESULT,
            this.frameLeftShape,
            this.contactResultHandler,
        );
        this._session.contactListener.registerListener(
            ContactListener.RESULT,
            this.frameRightShape,
            this.contactResultHandler,
        );
        _loc6_ = this.shapeGuide["frontWheelShape"];
        this.frontWheelPos = new b2Vec2(
            this._startX + _loc6_.x / this.character_scale,
            this._startY + _loc6_.y / this.character_scale,
        );
        _loc2_.position.Set(
            this._startX + _loc6_.x / this.character_scale,
            this._startY + _loc6_.y / this.character_scale,
        );
        _loc2_.angle = _loc6_.rotation / CharacterB2D.oneEightyOverPI;
        _loc5_.radius = _loc6_.width / 2 / this.character_scale;
        this.frontWheelBody = this._session.m_world.CreateBody(_loc2_);
        this.frontWheelShape = this.frontWheelBody.CreateShape(_loc5_);
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
        this._session.contactListener.registerListener(
            ContactListener.RESULT,
            this.frontWheelShape,
            this.wheelContactResult,
        );
        _loc6_ = this.shapeGuide["backWheelShape"];
        this.backWheelPos = new b2Vec2(
            this._startX + _loc6_.x / this.character_scale,
            this._startY + _loc6_.y / this.character_scale,
        );
        _loc3_.position.Set(
            this._startX + _loc6_.x / this.character_scale,
            this._startY + _loc6_.y / this.character_scale,
        );
        _loc3_.angle = _loc6_.rotation / CharacterB2D.oneEightyOverPI;
        _loc5_.radius = _loc6_.width / 2 / this.character_scale;
        this.backWheelBody = this._session.m_world.CreateBody(_loc3_);
        this.backWheelShape = this.backWheelBody.CreateShape(_loc5_);
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
        this._session.contactListener.registerListener(
            ContactListener.RESULT,
            this.backWheelShape,
            this.wheelContactResult,
        );
    }

    public override createMovieClips() {
        super.createMovieClips();
        var _loc1_: MovieClip = this.sourceObject["cartShards"];
        this._session.particleController.createBMDArray("cartshards", _loc1_);
        this.lowerLeg1MC.visible = false;
        this.lowerLeg2MC.visible = false;
        this.frameMC = this.sourceObject["frame"];
        var _loc3_ = 1 / this.mc_scale;
        this.frameMC.scaleY = 1 / this.mc_scale;
        this.frameMC.scaleX = _loc3_;
        this.frontWheelMC = this.sourceObject["frontWheel"];
        _loc3_ = 1 / this.mc_scale;
        this.frontWheelMC.scaleY = 1 / this.mc_scale;
        this.frontWheelMC.scaleX = _loc3_;
        this.backWheelMC = this.sourceObject["backWheel"];
        _loc3_ = 1 / this.mc_scale;
        this.backWheelMC.scaleY = 1 / this.mc_scale;
        this.backWheelMC.scaleX = _loc3_;
        this.hatMC = this.sourceObject["hat"];
        _loc3_ = 1 / this.mc_scale;
        this.hatMC.scaleY = 1 / this.mc_scale;
        this.hatMC.scaleX = _loc3_;
        this.hatMC.visible = false;
        this.cartSmashedMC = this.sourceObject["cartSmashed"];
        _loc3_ = 1 / this.mc_scale;
        this.cartSmashedMC.scaleY = 1 / this.mc_scale;
        this.cartSmashedMC.scaleX = _loc3_;
        this.cartSmashedMC.visible = false;
        this.frameLeftSmashedMC = this.sourceObject["frameLeftSmashed"];
        _loc3_ = 1 / this.mc_scale;
        this.frameLeftSmashedMC.scaleY = 1 / this.mc_scale;
        this.frameLeftSmashedMC.scaleX = _loc3_;
        this.frameLeftSmashedMC.visible = false;
        this.frameRightSmashedMC = this.sourceObject["frameRightSmashed"];
        _loc3_ = 1 / this.mc_scale;
        this.frameRightSmashedMC.scaleY = 1 / this.mc_scale;
        this.frameRightSmashedMC.scaleX = _loc3_;
        this.frameRightSmashedMC.visible = false;
        this.frameBottomSmashedMC = this.sourceObject["frameBottomSmashed"];
        _loc3_ = 1 / this.mc_scale;
        this.frameBottomSmashedMC.scaleY = 1 / this.mc_scale;
        this.frameBottomSmashedMC.scaleX = _loc3_;
        this.frameBottomSmashedMC.visible = false;
        this.engineSmashedMC = this.sourceObject["engineSmashed"];
        _loc3_ = 1 / this.mc_scale;
        this.engineSmashedMC.scaleY = 1 / this.mc_scale;
        this.engineSmashedMC.scaleX = _loc3_;
        this.engineSmashedMC.visible = false;
        this.frameBody.SetUserData(this.frameMC);
        var _loc2_: number =
            this._session.containerSprite.getChildIndex(this.lowerArm1MC) + 1;
        this._session.containerSprite.addChildAt(this.cartSmashedMC, _loc2_);
        this._session.containerSprite.addChildAt(this.frontWheelMC, _loc2_);
        this._session.containerSprite.addChildAt(this.backWheelMC, _loc2_);
        this._session.containerSprite.addChildAt(this.frameMC, _loc2_);
        this._session.containerSprite.addChildAt(
            this.frameLeftSmashedMC,
            _loc2_,
        );
        this._session.containerSprite.addChildAt(
            this.frameRightSmashedMC,
            _loc2_,
        );
        this._session.containerSprite.addChildAt(
            this.frameBottomSmashedMC,
            _loc2_,
        );
        this._session.containerSprite.addChildAt(this.engineSmashedMC, _loc2_);
        this._session.containerSprite.addChildAt(
            this.hatMC,
            this._session.containerSprite.getChildIndex(this.chestMC),
        );
    }

    public override resetMovieClips() {
        super.resetMovieClips();
        this.frameBody.SetUserData(this.frameMC);
        this.hatMC.visible = false;
        // @ts-expect-error
        this.head1MC.helmet.visible = true;
        this.frameMC.visible = true;
        this.frameLeftSmashedMC.visible = false;
        this.frameRightSmashedMC.visible = false;
        this.frameBottomSmashedMC.visible = false;
        this.cartSmashedMC.visible = false;
        this.lowerLeg1MC.visible = false;
        this.lowerLeg2MC.visible = false;
        this.engineSmashedMC.visible = false;
        var _loc1_: MovieClip = this.sourceObject["cartShards"];
        this._session.particleController.createBMDArray("cartshards", _loc1_);
    }

    public override createDictionaries() {
        super.createDictionaries();
        this.hatShape = this.head1Shape;
        this.contactImpulseDict.set(this.hatShape, this.hatSmashLimit);
        this.contactImpulseDict.set(this.frontWheelShape, this.wheelSparkLimit);
        this.contactImpulseDict.set(this.backWheelShape, this.wheelSparkLimit);
        this.contactImpulseDict.set(this.frameBottomShape, this.frameSmashLimit);
        this.contactImpulseDict.set(this.frameRightShape, this.frameSmashLimit);
        this.contactImpulseDict.set(this.frameLeftShape, this.frameSmashLimit);
        this.contactAddSounds.set(this.backWheelShape, "CarTire1");
        this.contactAddSounds.set(this.frontWheelShape, "CarTire1");
    }

    protected override handleContactResults() {
        var _loc1_: ContactEvent = null;
        if (this.contactResultBuffer.get(this.hatShape)) {
            _loc1_ = this.contactResultBuffer.get(this.hatShape);
            this.hatSmash(_loc1_.impulse);
            this.contactResultBuffer.delete(this.head1Shape);
            this.contactAddBuffer.delete(this.head1Shape);
        }
        if (this.contactResultBuffer.get(this.frontWheelShape)) {
            this.contactResultBuffer.delete(this.frontWheelShape);
        }
        if (this.contactResultBuffer.get(this.backWheelShape)) {
            this.contactResultBuffer.delete(this.backWheelShape);
        }
        if (this.contactResultBuffer.get(this.frameBottomShape)) {
            this.frameSmash(
                this.contactResultBuffer.get(this.frameBottomShape),
            );
        }
        if (this.contactResultBuffer.get(this.frameLeftShape)) {
            this.frameSmash(this.contactResultBuffer.get(this.frameLeftShape));
        }
        if (this.contactResultBuffer.get(this.frameRightShape)) {
            this.frameSmash(this.contactResultBuffer.get(this.frameRightShape));
        }
        super.handleContactResults();
    }

    protected addSparkForAttachedWheel(param1: b2Body, param2: b2Body) {
        var _loc3_: number = param2.GetAngle();
        var _loc4_: b2CircleShape = param1.GetShapeList() as b2CircleShape;
        var _loc5_ = new b2Vec2(
            Math.sin(param1.GetAngle() - _loc3_) * _loc4_.m_radius,
            Math.cos(param1.GetAngle() - _loc3_) * _loc4_.m_radius,
        );
        var _loc6_: b2Vec2 = param1.GetWorldPoint(_loc5_);
        this._session.particleController.createSparkBurstPoint(
            _loc6_,
            new b2Vec2(0.5, 0.5),
            0.25,
            25,
            20,
        );
    }

    protected addWheelSpark(param1: b2Shape) {
        var _loc2_: ContactEvent = this.contactResultBuffer.get(param1);
        var _loc3_: b2Vec2 = _loc2_.position;
        var _loc4_: number = Math.min(
            (_loc2_.impulse - this.wheelSparkLimit) / 20,
            1,
        );
        this._session.particleController.createSparkBurstPoint(
            _loc3_,
            new b2Vec2(3 * _loc4_, 3 * _loc4_),
            1,
            50,
            20,
        );
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
        if (_loc2_ == this.frontWheelShape) {
            this.frontWheelContactPoint = param1;
        } else {
            this.backWheelContactPoint = param1;
        }
    }

    protected wheelContactRemove(param1: b2ContactPoint) {
        if (param1.shape2.m_isSensor) {
            return;
        }
        --this.wheelContacts;
        if (param1.shape2.GetMaterial() & 4) {
            if (
                param1.shape1 == this.frontWheelShape &&
                param1.shape2.GetBody() == this.frontRailBody
            ) {
                this.destroyFrontDongle = true;
            }
            if (
                param1.shape1 == this.backWheelShape &&
                param1.shape2.GetBody() == this.backRailBody
            ) {
                this.destroyBackDongle = true;
            }
        }
    }

    protected wheelContactResult(param1: ContactEvent) {
        var _loc2_: b2Shape = param1.shape;
        var _loc3_: number = param1.impulse;
        if (_loc3_ > this.contactImpulseDict.get(_loc2_)) {
            if (this.contactResultBuffer.get(_loc2_)) {
                if (_loc3_ > this.contactResultBuffer.get(_loc2_).impulse) {
                    this.contactResultBuffer.set(_loc2_, param1);
                }
            } else {
                this.contactResultBuffer.set(_loc2_, param1);
            }
        }
        if (this.connecting) {
            if (param1.otherShape.GetMaterial() & 4) {
                if (
                    param1.shape == this.frontWheelShape &&
                    !this.newFrontWheelRailBody &&
                    this.frontRailBody != param1.otherShape.GetBody()
                ) {
                    this.newFrontWheelRailBody = param1.otherShape.GetBody();
                }
                if (
                    param1.shape == this.backWheelShape &&
                    !this.newBackWheelRailBody &&
                    this.backRailBody != param1.otherShape.GetBody()
                ) {
                    this.newBackWheelRailBody = param1.otherShape.GetBody();
                }
            }
        }
    }

    private createDongleRevJoint(
        param1: b2Body,
        param2: b2Vec2,
    ): b2RevoluteJoint {
        var _loc3_ = new b2RevoluteJointDef();
        _loc3_.collideConnected = false;
        _loc3_.Initialize(param1, this.frameBody, param1.GetPosition());
        _loc3_.localAnchor1 = new b2Vec2(0, 0);
        _loc3_.localAnchor2 = param2;
        _loc3_.maxMotorTorque = 300;
        return this._session.m_world.CreateJoint(_loc3_) as b2RevoluteJoint;
    }

    private createDongle(
        param1: b2Body,
        param2: b2Vec2,
        param3: b2Body,
    ): b2Body {
        var _loc4_ = new b2BodyDef();
        _loc4_.position = this.frameBody.GetWorldPoint(param2);
        _loc4_.fixedRotation = true;
        _loc4_.angle = param3.GetAngle();
        var _loc5_ = new b2PolygonDef();
        _loc5_.SetAsBox(0.25, 0.25);
        _loc5_.density = 375;
        _loc5_.isSensor = true;
        var _loc6_: b2Body = this._session.m_world.CreateBody(_loc4_);
        _loc6_.CreateShape(_loc5_);
        _loc6_.SetMassFromShapes();
        return _loc6_;
    }

    private getPrisJointSpeed(
        param1: b2Body,
        param2: b2Body,
        param3: b2Body,
    ): number {
        var _loc4_: number = param2.GetAngle();
        var _loc5_ = new b2Vec2(Math.cos(_loc4_), Math.sin(_loc4_));
        var _loc6_: b2Vec2 = param1.GetLinearVelocity();
        var _loc7_: number = b2Math.b2Dot(_loc6_, _loc5_);
        _loc5_.Multiply(_loc7_);
        param3.SetLinearVelocity(_loc5_);
        return _loc7_;
    }

    private createPrisJoint(
        param1: b2Body,
        param2: b2Body,
        param3: b2Body,
        param4: b2Vec2,
    ): b2PrismaticJoint {
        var _loc7_: b2PrismaticJoint = null;
        var _loc5_: number = param2.GetAngle();
        var _loc6_: number = _loc5_ + Math.PI / 2;
        var _loc8_ = new b2PrismaticJointDef();
        _loc8_.motorSpeed = this.getPrisJointSpeed(param3, param2, param1);
        _loc8_.enableMotor = true;
        _loc8_.maxMotorForce = 1000;
        var _loc9_: b2Vec2 = this.frameBody.GetWorldPoint(param4);
        var _loc10_: b2Vec2 = param2.GetLocalPoint(_loc9_);
        _loc10_.y = this.railJointY;
        var _loc11_: b2Vec2 = param1.GetWorldCenter();
        _loc8_.Initialize(
            param1,
            param2,
            param2.GetWorldPoint(_loc10_),
            new b2Vec2(-Math.sin(_loc6_), Math.cos(_loc6_)),
        );
        _loc8_.enableMotor = false;
        _loc8_.localAnchor1 = new b2Vec2(0, 0);
        _loc8_.localAnchor2 = _loc10_;
        return this._session.m_world.CreateJoint(_loc8_) as b2PrismaticJoint;
    }

    public override createJoints() {
        var _loc1_: number = NaN;
        var _loc2_: number = NaN;
        var _loc3_: number = NaN;
        var _loc7_: MovieClip = null;
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
        _loc5_.collideConnected = false;
        var _loc6_ = new b2Vec2();
        _loc5_.upperTranslation = 0;
        _loc5_.lowerTranslation = -1.5;
        _loc5_.maxMotorForce = 600;
        _loc5_.enableMotor = true;
        _loc5_.motorSpeed = 0.75;
        var _loc8_ = new b2RevoluteJointDef();
        _loc8_.maxMotorTorque = this.maxTorque;
        _loc7_ = this.shapeGuide["frontWheelShape"];
        _loc6_.Set(
            this._startX + _loc7_.x / this.character_scale,
            this._startY + _loc7_.y / this.character_scale,
        );
        _loc8_.Initialize(this.frameBody, this.frontWheelBody, _loc6_);
        this.frontWheelJoint = this._session.m_world.CreateJoint(
            _loc8_,
        ) as b2RevoluteJoint;
        _loc7_ = this.shapeGuide["backWheelShape"];
        _loc6_.Set(
            this._startX + _loc7_.x / this.character_scale,
            this._startY + _loc7_.y / this.character_scale,
        );
        _loc8_.Initialize(this.frameBody, this.backWheelBody, _loc6_);
        this.backWheelJoint = this._session.m_world.CreateJoint(
            _loc8_,
        ) as b2RevoluteJoint;
        _loc7_ = this.shapeGuide["footAnchor"];
        _loc6_.Set(
            this._startX + _loc7_.x / this.character_scale,
            this._startY + _loc7_.y / this.character_scale,
        );
        _loc8_.enableLimit = true;
        _loc8_.lowerAngle = -15 / _loc4_;
        _loc8_.upperAngle = 15 / _loc4_;
        _loc8_.Initialize(this.lowerLeg1Body, this.frameBody, _loc6_);
        this.cartFoot1Joint = this._session.m_world.CreateJoint(
            _loc8_,
        ) as b2RevoluteJoint;
        _loc8_.Initialize(this.lowerLeg2Body, this.frameBody, _loc6_);
        this.cartFoot2Joint = this._session.m_world.CreateJoint(
            _loc8_,
        ) as b2RevoluteJoint;
        _loc7_ = this.shapeGuide["handAnchor"];
        _loc6_.Set(
            this._startX + _loc7_.x / this.character_scale,
            this._startY + _loc7_.y / this.character_scale,
        );
        _loc8_.enableLimit = false;
        _loc8_.lowerAngle = -15 / _loc4_;
        _loc8_.upperAngle = 15 / _loc4_;
        _loc8_.Initialize(this.lowerArm1Body, this.frameBody, _loc6_);
        this.frameHand1Joint = this._session.m_world.CreateJoint(
            _loc8_,
        ) as b2RevoluteJoint;
        _loc8_.Initialize(this.lowerArm2Body, this.frameBody, _loc6_);
        this.frameHand2Joint = this._session.m_world.CreateJoint(
            _loc8_,
        ) as b2RevoluteJoint;
    }

    public override eject() {
        if (this.ejected) {
            return;
        }
        this.removeAction(this.reAttaching);
        this.ejected = true;
        this.resetJointLimits();
        var _loc1_: b2World = this._session.m_world;
        if (this.frameHand1Joint) {
            _loc1_.DestroyJoint(this.frameHand1Joint);
            this.frameHand1Joint = null;
        }
        if (this.frameHand2Joint) {
            _loc1_.DestroyJoint(this.frameHand2Joint);
            this.frameHand2Joint = null;
        }
        if (this.cartFoot1Joint) {
            _loc1_.DestroyJoint(this.cartFoot1Joint);
            this.cartFoot1Joint = null;
        }
        if (this.cartFoot2Joint) {
            _loc1_.DestroyJoint(this.cartFoot2Joint);
            this.cartFoot2Joint = null;
        }
        var _loc2_: b2FilterData = this.zeroFilter.Copy();
        _loc2_.groupIndex = -2;
        _loc1_.Refilter(this.frontWheelBody.GetShapeList());
        _loc1_.Refilter(this.backWheelBody.GetShapeList());
        var _loc3_: b2Shape = this.frameBody.GetShapeList();
        while (_loc3_) {
            _loc3_.SetFilterData(_loc2_);
            _loc1_.Refilter(_loc3_);
            _loc3_ = _loc3_.m_next;
        }
        // @ts-expect-error
        this.lowerArm1MC.hand.gotoAndStop(2);
        // @ts-expect-error
        this.lowerArm2MC.hand.gotoAndStop(2);
        if (!this.lowerLeg1MC.visible) {
            this.lowerLeg1MC.visible = true;
        }
        if (!this.lowerLeg2MC.visible) {
            this.lowerLeg2MC.visible = true;
        }
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

    public frameSmash(param1: number) {
        var _loc2_: b2Vec2 = null;
        var _loc14_: b2Body = null;
        var _loc15_: MovieClip = null;
        this.eject();
        trace("frame impulse " + param1 + " -> " + this._session.iteration);
        this.contactResultBuffer.delete(this.frameBottomShape);
        this.contactResultBuffer.delete(this.frameLeftShape);
        this.contactResultBuffer.delete(this.frameRightShape);
        this.frontWheelShape.SetFilterData(this.zeroFilter);
        this.backWheelShape.SetFilterData(this.zeroFilter);
        this._session.contactListener.deleteListener(
            ContactListener.RESULT,
            this.frameBottomShape,
        );
        this._session.contactListener.deleteListener(
            ContactListener.RESULT,
            this.frameLeftShape,
        );
        this._session.contactListener.deleteListener(
            ContactListener.RESULT,
            this.frameRightShape,
        );
        this._session.contactListener.deleteListener(
            ContactListener.ADD,
            this.frontWheelShape,
        );
        this._session.contactListener.deleteListener(
            ContactListener.ADD,
            this.backWheelShape,
        );
        if (this.frontDongleBody) {
            this.removeFrontDongle();
        }
        if (this.backDongleBody) {
            this.removeBackDongle();
        }
        var _loc3_: b2Vec2 = this.frameBody.GetPosition();
        var _loc4_: number = this.frameBody.GetAngle();
        var _loc5_: number = this.frameBody.GetAngularVelocity();
        var _loc6_ = new b2BodyDef();
        _loc6_.position = _loc3_;
        _loc6_.angle = _loc4_;
        var _loc7_ = new b2PolygonDef();
        _loc7_.density = 1.5;
        _loc7_.friction = 0.3;
        _loc7_.restitution = 0.1;
        _loc7_.filter.categoryBits = 514;
        var _loc8_ = new Array();
        var _loc9_: b2Body = this._session.m_world.CreateBody(_loc6_);
        _loc8_.push(_loc9_);
        var _loc10_: MovieClip = this.shapeGuide["cartBottomShape"];
        _loc2_ = new b2Vec2(
            this._startX + _loc10_.x / this.character_scale,
            this._startY + _loc10_.y / this.character_scale,
        );
        var _loc11_: number = _loc10_.rotation / CharacterB2D.oneEightyOverPI;
        _loc7_.SetAsOrientedBox(
            (_loc10_.scaleX * 5) / this.character_scale,
            (_loc10_.scaleY * 5) / this.character_scale,
            _loc2_,
            _loc11_,
        );
        _loc9_.CreateShape(_loc7_);
        _loc10_ = this.shapeGuide["cartLeftShape"];
        _loc11_ = _loc10_.rotation / CharacterB2D.oneEightyOverPI;
        _loc2_ = new b2Vec2(
            this._startX + _loc10_.x / this.character_scale,
            this._startY + _loc10_.y / this.character_scale,
        );
        _loc7_.SetAsOrientedBox(
            (_loc10_.scaleX * 5) / this.character_scale,
            (_loc10_.scaleY * 5) / this.character_scale,
            _loc2_,
            _loc11_,
        );
        _loc9_.CreateShape(_loc7_);
        _loc10_ = this.shapeGuide["cartRightShape"];
        _loc11_ = _loc10_.rotation / CharacterB2D.oneEightyOverPI;
        _loc2_ = new b2Vec2(
            this._startX + _loc10_.x / this.character_scale,
            this._startY + _loc10_.y / this.character_scale,
        );
        _loc7_.SetAsOrientedBox(
            (_loc10_.scaleX * 5) / this.character_scale,
            (_loc10_.scaleY * 5) / this.character_scale,
            _loc2_,
            _loc11_,
        );
        _loc9_.CreateShape(_loc7_);
        _loc9_.SetMassFromShapes();
        _loc9_.SetLinearVelocity(
            this.frameBody.GetLinearVelocityFromLocalPoint(
                _loc9_.GetLocalCenter(),
            ),
        );
        _loc9_.SetAngularVelocity(_loc5_);
        SoundController.instance.playAreaSoundInstance(
            "MetalSmashHeavy",
            _loc9_,
        );
        _loc9_ = this._session.m_world.CreateBody(_loc6_);
        _loc8_.push(_loc9_);
        _loc10_ = this.shapeGuide["frameLeftShape"];
        _loc11_ = _loc10_.rotation / CharacterB2D.oneEightyOverPI;
        _loc2_ = new b2Vec2(
            this._startX + _loc10_.x / this.character_scale,
            this._startY + _loc10_.y / this.character_scale,
        );
        _loc7_.SetAsOrientedBox(
            (_loc10_.scaleX * 5) / this.character_scale,
            (_loc10_.scaleY * 5) / this.character_scale,
            _loc2_,
            _loc11_,
        );
        _loc9_.CreateShape(_loc7_);
        _loc9_.SetMassFromShapes();
        _loc9_.SetLinearVelocity(
            this.frameBody.GetLinearVelocityFromLocalPoint(
                _loc9_.GetLocalCenter(),
            ),
        );
        _loc9_.SetAngularVelocity(_loc5_);
        _loc9_ = this._session.m_world.CreateBody(_loc6_);
        _loc8_.push(_loc9_);
        _loc10_ = this.shapeGuide["frameRightShape"];
        _loc11_ = _loc10_.rotation / CharacterB2D.oneEightyOverPI;
        _loc2_ = new b2Vec2(
            this._startX + _loc10_.x / this.character_scale,
            this._startY + _loc10_.y / this.character_scale,
        );
        _loc7_.SetAsOrientedBox(
            (_loc10_.scaleX * 5) / this.character_scale,
            (_loc10_.scaleY * 5) / this.character_scale,
            _loc2_,
            _loc11_,
        );
        _loc9_.CreateShape(_loc7_);
        _loc9_.SetMassFromShapes();
        _loc9_.SetLinearVelocity(
            this.frameBody.GetLinearVelocityFromLocalPoint(
                _loc9_.GetLocalCenter(),
            ),
        );
        _loc9_.SetAngularVelocity(_loc5_);
        _loc9_ = this._session.m_world.CreateBody(_loc6_);
        _loc8_.push(_loc9_);
        _loc10_ = this.shapeGuide["frame2BottomShape"];
        _loc11_ = _loc10_.rotation / CharacterB2D.oneEightyOverPI;
        _loc2_ = new b2Vec2(
            this._startX + _loc10_.x / this.character_scale,
            this._startY + _loc10_.y / this.character_scale,
        );
        _loc7_.SetAsOrientedBox(
            (_loc10_.scaleX * 5) / this.character_scale,
            (_loc10_.scaleY * 5) / this.character_scale,
            _loc2_,
            _loc11_,
        );
        _loc9_.CreateShape(_loc7_);
        _loc9_.SetMassFromShapes();
        _loc9_.SetLinearVelocity(
            this.frameBody.GetLinearVelocityFromLocalPoint(
                _loc9_.GetLocalCenter(),
            ),
        );
        _loc9_.SetAngularVelocity(_loc5_);
        _loc9_ = this._session.m_world.CreateBody(_loc6_);
        _loc8_.push(_loc9_);
        _loc10_ = this.shapeGuide["engineShape"];
        _loc11_ = _loc10_.rotation / CharacterB2D.oneEightyOverPI;
        _loc2_ = new b2Vec2(
            this._startX + _loc10_.x / this.character_scale,
            this._startY + _loc10_.y / this.character_scale,
        );
        _loc7_.SetAsOrientedBox(
            (_loc10_.scaleX * 5) / this.character_scale,
            (_loc10_.scaleY * 5) / this.character_scale,
            _loc2_,
            _loc11_,
        );
        _loc9_.CreateShape(_loc7_);
        _loc9_.SetMassFromShapes();
        _loc9_.SetLinearVelocity(
            this.frameBody.GetLinearVelocityFromLocalPoint(
                _loc9_.GetLocalCenter(),
            ),
        );
        _loc9_.SetAngularVelocity(_loc5_);
        this._session.particleController.createBurst(
            "cartshards",
            30,
            30,
            _loc9_,
            50,
        );
        var _loc12_ = [
            this.cartSmashedMC,
            this.frameLeftSmashedMC,
            this.frameRightSmashedMC,
            this.frameBottomSmashedMC,
            this.engineSmashedMC
        ];
        var _loc13_: number = 0;
        while (_loc13_ < _loc12_.length) {
            _loc14_ = _loc8_[_loc13_];
            _loc15_ = _loc12_[_loc13_];
            _loc15_.visible = true;
            _loc14_.SetUserData(_loc15_);
            this.paintVector.push(_loc14_);
            _loc13_++;
        }
        this._session.m_world.DestroyBody(this.frameBody);
        this.frameMC.visible = false;
    }

    public hatSmash(param1: number) {
        var _loc6_: MovieClip = null;
        this.contactImpulseDict.delete(this.hatShape);
        this.head1Shape = this.hatShape;
        this.contactImpulseDict.set(this.head1Shape, this.headSmashLimit);
        this.hatShape = null;
        this.hatOn = false;
        var _loc2_ = new b2PolygonDef();
        var _loc3_ = new b2BodyDef();
        _loc2_.density = 1;
        _loc2_.friction = 0.3;
        _loc2_.restitution = 0.1;
        _loc2_.filter = this.zeroFilter;
        var _loc4_: b2Vec2 = this.head1Body.GetPosition();
        _loc3_.position = _loc4_;
        _loc3_.angle = this.head1Body.GetAngle();
        _loc3_.userData = this.hatMC;
        this.hatMC.visible = true;
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
        this.hatBody = this._session.m_world.CreateBody(_loc3_);
        this.hatBody.CreateShape(_loc2_);
        this.hatBody.SetMassFromShapes();
        this.hatBody.SetLinearVelocity(this.head1Body.GetLinearVelocity());
        this.hatBody.SetAngularVelocity(this.head1Body.GetAngularVelocity());
        this.paintVector.push(this.hatBody);
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
        if (this.frameHand1Joint) {
            this._session.m_world.DestroyJoint(this.frameHand1Joint);
            this.frameHand1Joint = null;
            this.checkEject();
        }
    }

    public override shoulderBreak2(param1: number, param2: boolean = true) {
        super.shoulderBreak2(param1, param2);
        if (this.ejected) {
            return;
        }
        if (this.frameHand2Joint) {
            this._session.m_world.DestroyJoint(this.frameHand2Joint);
            this.frameHand2Joint = null;
            this.checkEject();
        }
    }

    public override hipBreak1(param1: number, param2: boolean = true) {
        super.hipBreak1(param1, param2);
        if (this.ejected) {
            return;
        }
        if (this.cartFoot1Joint) {
            this._session.m_world.DestroyJoint(this.cartFoot1Joint);
            this.cartFoot1Joint = null;
        }
        if (!this.lowerLeg1MC.visible) {
            this.lowerLeg1MC.visible = true;
        }
        this.checkEject();
    }

    public override hipBreak2(param1: number, param2: boolean = true) {
        super.hipBreak2(param1, param2);
        if (this.ejected) {
            return;
        }
        if (this.cartFoot2Joint) {
            this._session.m_world.DestroyJoint(this.cartFoot2Joint);
            this.cartFoot2Joint = null;
        }
        if (!this.lowerLeg2MC.visible) {
            this.lowerLeg2MC.visible = true;
        }
        this.checkEject();
    }

    public override elbowBreak1(param1: number) {
        super.elbowBreak1(param1);
        if (this.ejected) {
            return;
        }
        if (this.frameHand1Joint) {
            trace("REMOVE FRAME HAND 1");
            this._session.m_world.DestroyJoint(this.frameHand1Joint);
            this.frameHand1Joint = null;
            this.checkEject();
        }
    }

    public override elbowBreak2(param1: number) {
        super.elbowBreak2(param1);
        if (this.ejected) {
            return;
        }
        if (this.frameHand2Joint) {
            this._session.m_world.DestroyJoint(this.frameHand2Joint);
            this.frameHand2Joint = null;
            this.checkEject();
        }
    }

    public checkEject() {
        if (
            !this.frameHand1Joint &&
            !this.frameHand2Joint &&
            !this.cartFoot1Joint &&
            !this.cartFoot2Joint
        ) {
            this.eject();
        }
    }

    public override kneeBreak1(param1: number) {
        super.kneeBreak1(param1);
        if (this.ejected) {
            return;
        }
        if (this.cartFoot1Joint) {
            this._session.m_world.DestroyJoint(this.cartFoot1Joint);
            this.cartFoot1Joint = null;
        }
        if (!this.lowerLeg1MC.visible) {
            this.lowerLeg1MC.visible = true;
        }
        this.checkEject();
    }

    public override kneeBreak2(param1: number) {
        super.kneeBreak2(param1);
        if (this.cartFoot2Joint) {
            this._session.m_world.DestroyJoint(this.cartFoot2Joint);
            this.cartFoot2Joint = null;
        }
        if (!this.lowerLeg2MC.visible) {
            this.lowerLeg2MC.visible = true;
        }
        this.checkEject();
    }

    public leanBackPose() {
        this.setJoint(this.kneeJoint1, 45, 10);
        this.setJoint(this.kneeJoint2, 45, 10);
        this.setJoint(this.hipJoint1, -45 / CharacterB2D.oneEightyOverPI, 10);
        this.setJoint(this.hipJoint2, -45 / CharacterB2D.oneEightyOverPI, 10);
    }

    public leanForwardPose() {
        this.setJoint(this.kneeJoint1, 0 / CharacterB2D.oneEightyOverPI, 10);
        this.setJoint(this.kneeJoint2, 0 / CharacterB2D.oneEightyOverPI, 10);
        this.setJoint(this.hipJoint1, 0 / CharacterB2D.oneEightyOverPI, 10);
        this.setJoint(this.hipJoint2, 0 / CharacterB2D.oneEightyOverPI, 10);
        this.setJoint(this.elbowJoint1, -15 / CharacterB2D.oneEightyOverPI, 10);
        this.setJoint(this.elbowJoint2, -15 / CharacterB2D.oneEightyOverPI, 10);
    }

    public squatPose() {
        this.setJoint(this.elbowJoint1, -90 / CharacterB2D.oneEightyOverPI, 10);
        this.setJoint(this.elbowJoint2, -90 / CharacterB2D.oneEightyOverPI, 10);
        this.setJoint(this.kneeJoint1, 1.5, 10);
        this.setJoint(this.kneeJoint2, 1.5, 10);
    }

    public straightLegPose() {
        this.setJoint(this.kneeJoint1, 0, 10);
        this.setJoint(this.kneeJoint2, 0, 10);
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
            case this.hatShape:
                if (param2 > 0.85) {
                    this.hatSmash(0);
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
                if (param2 > _loc4_) {
                    this.chestSmash(0);
                }
                break;
            case this.pelvisShape:
                _loc5_ =
                    this.pelvisBody.GetMass() / CharacterB2D.DEF_PELVIS_MASS;
                _loc4_ = Math.max(1 - 0.15 * _loc5_, 0.7);
                if (param2 > _loc4_) {
                    this.pelvisSmash(0);
                }
        }
    }
}