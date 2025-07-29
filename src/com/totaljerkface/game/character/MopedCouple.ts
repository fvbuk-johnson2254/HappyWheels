import b2PolygonShape from "@/Box2D/Collision/Shapes/b2PolygonShape";
import b2Shape from "@/Box2D/Collision/Shapes/b2Shape";
import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import b2World from "@/Box2D/Dynamics/b2World";
import b2RevoluteJoint from "@/Box2D/Dynamics/Joints/b2RevoluteJoint";
import MopedGirl from "@/com/totaljerkface/game/character/MopedGirl";
import MopedGuy from "@/com/totaljerkface/game/character/MopedGuy";
import KeyDisplay from "@/com/totaljerkface/game/KeyDisplay";
import Session from "@/com/totaljerkface/game/Session";
import { boundClass } from 'autobind-decorator';
import DisplayObject from "flash/display/DisplayObject";
import Event from "flash/events/Event";

@boundClass
export default class MopedCouple extends MopedGuy {
    public girl: MopedGirl;

    constructor(
        param1: number,
        param2: number,
        param3: DisplayObject,
        param4: Session,
    ) {
        super(param1, param2, param3, param4);
        this.girl = new MopedGirl(
            param1,
            param2,
            param3["girl"],
            param4,
            -2,
            "Char9",
            this,
        );
    }

    public override set session(param1: Session) {
        this._session = param1;
        if (this.girl) {
            this.girl.session = this._session;
        }
    }

    public override checkKeyStates() {
        super.checkKeyStates();
        if (!this.girl.dead) {
            if (this.girl.userVehicle) {
                this.girl.userVehicle.operateKeys(
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
                        this.girl.leftAndRightActions();
                    } else {
                        this.girl.leftPressedActions();
                    }
                } else if (this.rightPressed) {
                    this.girl.rightPressedActions();
                } else {
                    this.girl.leftAndRightActions();
                }
                if (this.upPressed) {
                    if (this.downPressed) {
                        this.girl.upAndDownActions();
                    } else {
                        this.girl.upPressedActions();
                    }
                } else if (this.downPressed) {
                    this.girl.downPressedActions();
                } else {
                    this.girl.upAndDownActions();
                }
                if (this.spacePressed) {
                    this.girl.spacePressedActions();
                } else {
                    this.girl.spaceNullActions();
                }
                if (this.shiftPressed) {
                    this.girl.shiftPressedActions();
                } else {
                    this.girl.shiftNullActions();
                }
                if (this.ctrlPressed) {
                    this.girl.ctrlPressedActions();
                } else {
                    this.girl.ctrlNullActions();
                }
                if (this.zPressed) {
                    this.girl.zPressedActions();
                } else {
                    this.girl.zNullActions();
                }
            }
        }
    }

    public override checkReplayData(param1: KeyDisplay, param2: string) {
        super.checkReplayData(param1, param2);
        if (!this.girl.dead) {
            if (this.girl.userVehicle) {
                this.girl.userVehicle.operateReplayData(
                    this._session.iteration,
                    param2,
                );
            } else {
                if (param2.charAt(0) == "1") {
                    if (param2.charAt(1) == "1") {
                        this.girl.leftAndRightActions();
                    } else {
                        this.girl.leftPressedActions();
                    }
                } else if (param2.charAt(1) == "1") {
                    this.girl.rightPressedActions();
                } else {
                    this.girl.leftAndRightActions();
                }
                if (param2.charAt(2) == "1") {
                    if (param2.charAt(3) == "1") {
                        this.girl.upAndDownActions();
                    } else {
                        this.girl.upPressedActions();
                    }
                } else if (param2.charAt(3) == "1") {
                    this.girl.downPressedActions();
                } else {
                    this.girl.upAndDownActions();
                }
                if (param2.charAt(4) == "1") {
                    this.girl.spacePressedActions();
                } else {
                    this.girl.spaceNullActions();
                }
                if (param2.charAt(5) == "1") {
                    this.girl.shiftPressedActions();
                } else {
                    this.girl.shiftNullActions();
                }
                if (param2.charAt(6) == "1") {
                    this.girl.ctrlPressedActions();
                } else {
                    this.girl.ctrlNullActions();
                }
                if (param2.charAt(7) == "1") {
                    this.girl.zPressedActions();
                } else {
                    this.girl.zNullActions();
                }
            }
        }
    }

    protected override switchCamera() {
        if (this._session.camera.focus == this.cameraFocus) {
            this._session.camera.focus = this.girl.cameraFocus;
        } else {
            this._session.camera.focus = this.cameraFocus;
        }
    }

    public override shiftPressedActions() {
        this.girl.eject();
    }

    public override actions() {
        super.actions();
        this.girl.actions();
    }

    public override create() {
        this.createFilters();
        this.createBodies();
        this.createJoints();
        this.createMovieClips();
        this.setLimits();
        this.createDictionaries();
        this.girl.create();
        this.dispatchEvent(new Event(Event.COMPLETE));
    }

    public override reset() {
        super.reset();
        this.girl.reset();
    }

    public override die() {
        super.die();
        this.girl.die();
    }

    public override paint() {
        super.paint();
        this.girl.paint();
    }

    public override handleContactBuffer() {
        super.handleContactBuffer();
        this.girl.handleContactBuffer();
    }

    public override checkJoints() {
        super.checkJoints();
        this.girl.checkJoints();
    }

    public override eject() {
        if (this.ejected) {
            this.girl.releaseGuy();
        }
        super.eject();
    }

    public override set dead(param1: boolean) {
        this._dead = param1;
        if (this._dead) {
            this.girl.mourn();
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

    public override frameSmash(param1: number, param2: b2Vec2) {
        super.frameSmash(param1, param2);
        this.girl.eject();
    }

    public mourn() {
        if (this._dead) {
        }
    }

    public override reAttaching() {
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
                this.girl.actionsVector.push(this.girl.reAttaching);
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