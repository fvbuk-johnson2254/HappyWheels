import b2ContactPoint from "@/Box2D/Collision/b2ContactPoint";
import b2FilterData from "@/Box2D/Collision/Shapes/b2FilterData";
import b2PolygonShape from "@/Box2D/Collision/Shapes/b2PolygonShape";
import b2Shape from "@/Box2D/Collision/Shapes/b2Shape";
import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import b2World from "@/Box2D/Dynamics/b2World";
import b2Contact from "@/Box2D/Dynamics/Contacts/b2Contact";
import b2RevoluteJoint from "@/Box2D/Dynamics/Joints/b2RevoluteJoint";
import b2RevoluteJointDef from "@/Box2D/Dynamics/Joints/b2RevoluteJointDef";
import CharacterB2D from "@/com/totaljerkface/game/character/CharacterB2D";
import MopedCouple from "@/com/totaljerkface/game/character/MopedCouple";
import ContactListener from "@/com/totaljerkface/game/ContactListener";
import Session from "@/com/totaljerkface/game/Session";
import { boundClass } from 'autobind-decorator';
import DisplayObject from "flash/display/DisplayObject";
import MovieClip from "flash/display/MovieClip";
import Sprite from "flash/display/Sprite";

@boundClass
export default class MopedGirl extends CharacterB2D {
    public guy: MopedCouple;
    private maxTorque: number = 30;
    public ejected: boolean;
    public torsoHand1: b2RevoluteJoint;
    public torsoHand2: b2RevoluteJoint;
    public framePelvis: b2RevoluteJoint;
    public frameFoot1: b2RevoluteJoint;
    public frameFoot2: b2RevoluteJoint;
    protected torsoAnchorPoint: b2Vec2;
    protected torsoHand1JointDef: b2RevoluteJointDef;
    protected torsoHand2JointDef: b2RevoluteJointDef;
    protected reAttachDistance: number = 0.25;
    private upperLeg1Shape: b2Shape;
    private upperLeg2Shape: b2Shape;
    private leg1Contacts: number;
    private leg2Contacts: number;
    private skirtSprite: Sprite;
    public extraFilter: b2FilterData;

    constructor(
        param1: number,
        param2: number,
        param3: DisplayObject,
        param4: Session,
        param5: number = -2,
        param6: string = "Char4",
        param7: MopedCouple = null,
    ) {
        super(param1, param2, param3, param4, param5, param6);
        this.guy = param7;
    }

    public override leftPressedActions() {
        if (this.ejected) {
            this.currentPose = 1;
        }
    }

    public override rightPressedActions() {
        if (this.ejected) {
            this.currentPose = 2;
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
        }
    }

    public override downPressedActions() {
        if (this.ejected) {
            this.currentPose = 4;
        }
    }

    public override upAndDownActions() {
        if (this.ejected) {
            if (this._currentPose == 3 || this._currentPose == 4) {
                this.currentPose = 0;
            }
        }
    }

    public override spacePressedActions() {
        if (this.ejected) {
            this.startGrab();
        }
    }

    public override spaceNullActions() {
        if (this.ejected) {
            this.releaseGrip();
        }
    }

    public override shiftPressedActions() {
        this.eject();
    }

    public override reset() {
        super.reset();
        this.ejected = false;
    }

    public override die() {
        super.die();
    }

    public override createBodies() {
        super.createBodies();
        var _loc1_: b2Shape = (this.upperLeg1Shape =
            this.upperLeg1Body.GetShapeList());
        _loc1_.m_isSensor = true;
        _loc1_ = this.upperLeg2Shape = this.upperLeg2Body.GetShapeList();
        _loc1_.m_isSensor = true;
        _loc1_ = this.lowerLeg1Body.GetShapeList();
        _loc1_.m_isSensor = true;
        _loc1_ = this.lowerLeg2Body.GetShapeList();
        _loc1_.m_isSensor = true;
        _loc1_ = this.lowerArm1Body.GetShapeList();
        _loc1_.m_isSensor = true;
        _loc1_ = this.lowerArm2Body.GetShapeList();
        _loc1_.m_isSensor = true;
        this.leg1Contacts = 0;
        this.leg2Contacts = 0;
        this._session.contactListener.registerListener(
            ContactListener.ADD,
            this.upperLeg1Shape,
            this.leg1Stuck,
        );
        this._session.contactListener.registerListener(
            ContactListener.REMOVE,
            this.upperLeg1Shape,
            this.leg1Free,
        );
        this._session.contactListener.registerListener(
            ContactListener.ADD,
            this.upperLeg2Shape,
            this.leg2Stuck,
        );
        this._session.contactListener.registerListener(
            ContactListener.REMOVE,
            this.upperLeg2Shape,
            this.leg2Free,
        );
    }

    public override createMovieClips() {
        super.createMovieClips();
        this._session.containerSprite.addChildAt(
            this.chestMC,
            this._session.containerSprite.getChildIndex(this.lowerLeg1MC),
        );
        var _loc1_: number = this._session.containerSprite.getChildIndex(
            this.guy.lowerLeg2MC,
        );
        this._session.containerSprite.addChildAt(this.lowerLeg2MC, _loc1_);
        this._session.containerSprite.addChildAt(this.upperLeg2MC, _loc1_);
        this._session.containerSprite.addChildAt(this.upperLeg4MC, _loc1_);
        this._session.containerSprite.addChildAt(this.lowerArm2MC, _loc1_);
        this._session.containerSprite.addChildAt(this.upperArm2MC, _loc1_);
        this._session.containerSprite.addChildAt(this.upperArm4MC, _loc1_);
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
        _loc6_.Set(
            this.pelvisBody.GetPosition().x,
            this.pelvisBody.GetPosition().y,
        );
        _loc5_.Initialize(this.guy.frameBody, this.pelvisBody, _loc6_);
        this.framePelvis = this._session.m_world.CreateJoint(
            _loc5_,
        ) as b2RevoluteJoint;
        var _loc7_: MovieClip = this.shapeGuide["handleAnchor"];
        _loc6_.Set(
            this._startX + _loc7_.x / this.character_scale,
            this._startY + _loc7_.y / this.character_scale,
        );
        _loc5_.Initialize(this.guy.chestBody, this.lowerArm1Body, _loc6_);
        this.torsoHand1 = this._session.m_world.CreateJoint(
            _loc5_,
        ) as b2RevoluteJoint;
        this.torsoHand1JointDef = _loc5_.clone();
        this.torsoAnchorPoint = this.guy.chestBody.GetLocalPoint(_loc6_);
        _loc5_.Initialize(this.guy.chestBody, this.lowerArm2Body, _loc6_);
        this.torsoHand2 = this._session.m_world.CreateJoint(
            _loc5_,
        ) as b2RevoluteJoint;
        this.torsoHand2JointDef = _loc5_.clone();
        _loc7_ = this.shapeGuide["footAnchor"];
        _loc6_.Set(
            this._startX + _loc7_.x / this.character_scale,
            this._startY + _loc7_.y / this.character_scale,
        );
        _loc5_.Initialize(this.guy.frameBody, this.lowerLeg1Body, _loc6_);
        this.frameFoot1 = this._session.m_world.CreateJoint(
            _loc5_,
        ) as b2RevoluteJoint;
        _loc5_.Initialize(this.guy.frameBody, this.lowerLeg2Body, _loc6_);
        this.frameFoot2 = this._session.m_world.CreateJoint(
            _loc5_,
        ) as b2RevoluteJoint;
    }

    public override paint() {
        super.paint();
    }

    public override eject() {
        if (this.ejected) {
            return;
        }
        this.removeAction(this.reAttaching);
        this.ejected = true;
        this.resetJointLimits();
        var _loc1_: b2World = this._session.m_world;
        _loc1_.DestroyJoint(this.framePelvis);
        this.framePelvis = null;
        if (this.frameFoot1) {
            _loc1_.DestroyJoint(this.frameFoot1);
            this.frameFoot1 = null;
        }
        if (this.frameFoot2) {
            _loc1_.DestroyJoint(this.frameFoot2);
            this.frameFoot2 = null;
        }
        if (this.torsoHand1) {
            _loc1_.DestroyJoint(this.torsoHand1);
            this.torsoHand1 = null;
        }
        if (this.torsoHand2) {
            _loc1_.DestroyJoint(this.torsoHand2);
            this.torsoHand2 = null;
        }
        if (!this.guy.tankShape) {
            this.leg1Contacts = 0;
            this.leg2Contacts = 0;
            this.checkLegsFree();
        }
    }

    private countLegContacts() {
        var _loc4_: b2Shape = null;
        var _loc5_: b2Shape = null;
        var _loc1_: number = 0;
        var _loc2_: number = 0;
        var _loc3_: b2Contact = this._session.m_world.m_contactList;
        while (_loc3_) {
            _loc4_ = _loc3_.m_shape1;
            _loc5_ = _loc3_.m_shape2;
            if (_loc4_ == this.upperLeg1Shape) {
                if (_loc5_ == this.guy.seatShape) {
                    _loc1_ += 1;
                }
            } else if (_loc5_ == this.upperLeg1Shape) {
                if (_loc4_ == this.guy.seatShape) {
                    _loc1_ += 1;
                }
            } else if (_loc4_ == this.upperLeg2Shape) {
                if (_loc5_ == this.guy.seatShape) {
                    _loc2_ += 1;
                }
            } else if (_loc5_ == this.upperLeg2Shape) {
                if (_loc4_ == this.guy.seatShape) {
                    _loc2_ += 1;
                }
            }
            _loc3_ = _loc3_.m_next;
        }
        trace("COUNT " + _loc1_ + " " + _loc2_);
    }

    private leg1Stuck(param1: b2ContactPoint) {
        if (param1.shape2 == this.guy.seatShape) {
            this.leg1Contacts += 1;
        }
    }

    private leg1Free(param1: b2ContactPoint) {
        if (param1.shape2 == this.guy.seatShape) {
            --this.leg1Contacts;
            if (this.ejected) {
                this.checkLegsFree();
            }
        }
    }

    private leg2Stuck(param1: b2ContactPoint) {
        if (param1.shape2 == this.guy.seatShape) {
            this.leg2Contacts += 1;
        }
    }

    private leg2Free(param1: b2ContactPoint) {
        if (param1.shape2 == this.guy.seatShape) {
            --this.leg2Contacts;
            if (this.ejected) {
                this.checkLegsFree();
            }
        }
    }

    private checkLegsFree() {
        if (this.leg1Contacts == 0 && this.leg2Contacts == 0) {
            this._session.contactListener.deleteListener(
                ContactListener.REMOVE,
                this.upperLeg1Shape,
            );
            this._session.contactListener.deleteListener(
                ContactListener.REMOVE,
                this.upperLeg2Shape,
            );
            this._session.contactListener.deleteListener(
                ContactListener.ADD,
                this.upperLeg1Shape,
            );
            this._session.contactListener.deleteListener(
                ContactListener.ADD,
                this.upperLeg2Shape,
            );
            this.actionsVector.push(this.legsFree);
        }
    }

    private legsFree() {
        trace("LEGS FREE");
        this.removeAction(this.legsFree);
        var _loc1_: b2World = this._session.m_world;
        this.upperLeg1Shape.m_isSensor = false;
        if (this.upperLeg1Shape.m_body) {
            _loc1_.Refilter(this.upperLeg1Shape);
        }
        this.upperLeg2Shape.m_isSensor = false;
        if (this.upperLeg2Shape.m_body) {
            _loc1_.Refilter(this.upperLeg2Shape);
        }
        this.lowerLeg1Shape.m_isSensor = false;
        _loc1_.Refilter(this.lowerLeg1Shape);
        this.lowerLeg2Shape.m_isSensor = false;
        _loc1_.Refilter(this.lowerLeg2Shape);
        this.lowerArm1Shape.m_isSensor = false;
        _loc1_.Refilter(this.lowerArm1Shape);
        this.lowerArm2Shape.m_isSensor = false;
        _loc1_.Refilter(this.lowerArm2Shape);
    }

    public releaseGuy() {
        if (this.torsoHand1) {
            this._session.m_world.DestroyJoint(this.torsoHand1);
            this.torsoHand1 = null;
        }
        if (this.torsoHand2) {
            this._session.m_world.DestroyJoint(this.torsoHand2);
            this.torsoHand2 = null;
        }
    }

    public override set dead(param1: boolean) {
        if (this._dead == param1) {
            return;
        }
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
            this.guy.mourn();
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

    public override neckBreak(
        param1: number,
        param2: boolean = true,
        param3: boolean = true,
    ) {
        super.neckBreak(param1, param2, param3);
        if (this.torsoHand1) {
            this._session.m_world.DestroyJoint(this.torsoHand1);
            this.torsoHand1 = null;
        }
        if (this.torsoHand2) {
            this._session.m_world.DestroyJoint(this.torsoHand2);
            this.torsoHand2 = null;
        }
        this.lowerArm1Shape.m_isSensor = false;
        this._session.m_world.Refilter(this.lowerArm1Shape);
        this.lowerArm2Shape.m_isSensor = false;
        this._session.m_world.Refilter(this.lowerArm2Shape);
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
        this.lowerArm1Shape.m_isSensor = false;
        this._session.m_world.Refilter(this.lowerArm1Shape);
        if (this.torsoHand1) {
            this._session.m_world.DestroyJoint(this.torsoHand1);
            this.torsoHand1 = null;
        }
    }

    public override elbowBreak2(param1: number) {
        super.elbowBreak2(param1);
        this.lowerArm2Shape.m_isSensor = false;
        this._session.m_world.Refilter(this.lowerArm2Shape);
        if (this.torsoHand2) {
            this._session.m_world.DestroyJoint(this.torsoHand2);
            this.torsoHand2 = null;
        }
    }

    public override shoulderBreak1(param1: number, param2: boolean = true) {
        super.shoulderBreak1(param1, param2);
        this.lowerArm1Shape.m_isSensor = false;
        this._session.m_world.Refilter(this.lowerArm1Shape);
        if (this.torsoHand1) {
            this._session.m_world.DestroyJoint(this.torsoHand1);
            this.torsoHand1 = null;
        }
    }

    public override shoulderBreak2(param1: number, param2: boolean = true) {
        super.shoulderBreak2(param1, param2);
        this.lowerArm2Shape.m_isSensor = false;
        this._session.m_world.Refilter(this.lowerArm2Shape);
        if (this.torsoHand2) {
            this._session.m_world.DestroyJoint(this.torsoHand2);
            this.torsoHand2 = null;
        }
    }

    public override hipBreak1(param1: number, param2: boolean = true) {
        super.hipBreak1(param1, param2);
        if (this.frameFoot1) {
            this._session.m_world.DestroyJoint(this.frameFoot1);
            this.frameFoot1 = null;
        }
    }

    public override hipBreak2(param1: number, param2: boolean = true) {
        super.hipBreak2(param1, param2);
        if (this.frameFoot2) {
            this._session.m_world.DestroyJoint(this.frameFoot2);
            this.frameFoot2 = null;
        }
    }

    public override kneeBreak1(param1: number) {
        super.kneeBreak1(param1);
        if (this.frameFoot1) {
            this._session.m_world.DestroyJoint(this.frameFoot1);
            this.frameFoot1 = null;
        }
    }

    public override kneeBreak2(param1: number) {
        super.kneeBreak2(param1);
        if (this.frameFoot2) {
            this._session.m_world.DestroyJoint(this.frameFoot2);
            this.frameFoot2 = null;
        }
    }

    public mourn() {
        if (!this._dead) {
            this.addVocals("Mourn", 3);
        }
    }

    public reAttaching() {
        var _loc1_: number = 0;
        var _loc2_: b2World = null;
        var _loc3_: b2Vec2 = null;
        var _loc4_: b2Vec2 = null;
        if (!this.ejected && !this.dead) {
            _loc1_ = 0;
            _loc2_ = this._session.m_world;
            if (
                !this.torsoHand1 &&
                !this.elbowJoint1.broken &&
                !this.shoulderJoint1.broken
            ) {
                _loc3_ = this.lowerArm1Body.GetWorldPoint(
                    new b2Vec2(
                        0,
                        (
                            this.lowerArm1Shape as b2PolygonShape
                        ).GetVertices()[2].y,
                    ),
                );
                _loc4_ = this.guy.chestBody.GetWorldPoint(
                    this.torsoAnchorPoint,
                );
                if (
                    Math.abs(_loc3_.x - _loc4_.x) < this.reAttachDistance &&
                    Math.abs(_loc3_.y - _loc4_.y) < this.reAttachDistance
                ) {
                    this.torsoHand1 = _loc2_.CreateJoint(
                        this.torsoHand1JointDef,
                    ) as b2RevoluteJoint;
                    // @ts-expect-error
                    this.lowerArm1MC.hand.gotoAndStop(1);
                    _loc1_ += 1;
                }
            } else {
                _loc1_ += 1;
            }
            if (
                !this.torsoHand2 &&
                !this.elbowJoint2.broken &&
                !this.shoulderJoint2.broken
            ) {
                _loc3_ = this.lowerArm2Body.GetWorldPoint(
                    new b2Vec2(
                        0,
                        (
                            this.lowerArm2Shape as b2PolygonShape
                        ).GetVertices()[2].y,
                    ),
                );
                _loc4_ = this.guy.chestBody.GetWorldPoint(
                    this.torsoAnchorPoint,
                );
                if (
                    Math.abs(_loc3_.x - _loc4_.x) < this.reAttachDistance &&
                    Math.abs(_loc3_.y - _loc4_.y) < this.reAttachDistance
                ) {
                    this.torsoHand2 = _loc2_.CreateJoint(
                        this.torsoHand2JointDef,
                    ) as b2RevoluteJoint;
                    // @ts-expect-error
                    this.lowerArm2MC.hand.gotoAndStop(1);
                    _loc1_ += 1;
                }
            } else {
                _loc1_ += 1;
            }
            if (_loc1_ >= 2) {
                this.removeAction(this.reAttaching);
            }
        } else {
            this.removeAction(this.reAttaching);
        }
    }
}