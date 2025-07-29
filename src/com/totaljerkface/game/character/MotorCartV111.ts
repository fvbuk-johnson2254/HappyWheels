import b2FilterData from "@/Box2D/Collision/Shapes/b2FilterData";
import b2PolygonShape from "@/Box2D/Collision/Shapes/b2PolygonShape";
import b2Shape from "@/Box2D/Collision/Shapes/b2Shape";
import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import b2Body from "@/Box2D/Dynamics/b2Body";
import b2World from "@/Box2D/Dynamics/b2World";
import b2RevoluteJoint from "@/Box2D/Dynamics/Joints/b2RevoluteJoint";
import b2RevoluteJointDef from "@/Box2D/Dynamics/Joints/b2RevoluteJointDef";
import MotorCart from "@/com/totaljerkface/game/character/MotorCart";
import ContactListener from "@/com/totaljerkface/game/ContactListener";
import Vehicle from "@/com/totaljerkface/game/level/groups/Vehicle";
import Session from "@/com/totaljerkface/game/Session";
import { boundClass } from 'autobind-decorator';
import DisplayObject from "flash/display/DisplayObject";

@boundClass
export default class MotorCartV111 extends MotorCart {
    protected reAttachDistance: number;
    protected ejectImpulse: number = 4;

    constructor(
        param1: number,
        param2: number,
        param3: DisplayObject,
        param4: Session,
    ) {
        super(param1, param2, param3, param4);
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
        if (!this.mainSmashed && !this._dying && !this.userVehicle) {
            _loc7_ = this.mainBody.GetWorldPoint(this.handleAnchorPoint);
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

    public override eject() {
        if (this.ejected) {
            return;
        }
        super.eject();
        var _loc1_: number = this.mainBody.GetAngle() - Math.PI / 2;
        var _loc2_: number = Math.cos(_loc1_) * this.ejectImpulse;
        var _loc3_: number = Math.sin(_loc1_) * this.ejectImpulse;
        this.chestBody.ApplyImpulse(
            new b2Vec2(_loc2_, _loc3_),
            this.chestBody.GetWorldCenter(),
        );
        this.pelvisBody.ApplyImpulse(
            new b2Vec2(_loc2_, _loc3_),
            this.pelvisBody.GetWorldCenter(),
        );
    }

    public override reAttaching() {
        var _loc8_: b2Vec2 = null;
        var _loc9_: b2Vec2 = null;
        var _loc1_: number = 0;
        var _loc2_: b2World = this._session.m_world;
        if (
            !this.mainHand1 &&
            !this.elbowJoint1.broken &&
            !this.shoulderJoint1.broken
        ) {
            _loc8_ = this.lowerArm1Body.GetWorldPoint(
                new b2Vec2(
                    0,
                    (this.lowerArm1Shape as b2PolygonShape).GetVertices()[2].y,
                ),
            );
            _loc9_ = this.mainBody.GetWorldPoint(this.handleAnchorPoint);
            if (
                Math.abs(_loc8_.x - _loc9_.x) < this.reAttachDistance &&
                Math.abs(_loc8_.y - _loc9_.y) < this.reAttachDistance
            ) {
                this.mainHand1 = _loc2_.CreateJoint(
                    this.mainHand1JointDef,
                ) as b2RevoluteJoint;
                // @ts-expect-error
                this.lowerArm1MC.hand.gotoAndStop(1);
                _loc1_ += 1;
            }
        } else {
            _loc1_ += 1;
        }
        if (
            !this.mainHand2 &&
            !this.elbowJoint2.broken &&
            !this.shoulderJoint2.broken
        ) {
            _loc8_ = this.lowerArm2Body.GetWorldPoint(
                new b2Vec2(
                    0,
                    (this.lowerArm2Shape as b2PolygonShape).GetVertices()[2].y,
                ),
            );
            _loc9_ = this.mainBody.GetWorldPoint(this.handleAnchorPoint);
            if (
                Math.abs(_loc8_.x - _loc9_.x) < this.reAttachDistance &&
                Math.abs(_loc8_.y - _loc9_.y) < this.reAttachDistance
            ) {
                this.mainHand2 = _loc2_.CreateJoint(
                    this.mainHand2JointDef,
                ) as b2RevoluteJoint;
                // @ts-expect-error
                this.lowerArm2MC.hand.gotoAndStop(1);
                _loc1_ += 1;
            }
        } else {
            _loc1_ += 1;
        }
        var _loc3_: number = 0.5;
        var _loc4_: number = 0.25;
        var _loc5_ = Number(this.kneeJoint1.GetJointAngle());
        var _loc6_ = Number(this.kneeJoint2.GetJointAngle());
        var _loc7_: boolean =
            ((_loc5_ < _loc3_ && _loc5_ > _loc4_) ||
                Boolean(this.kneeJoint1.broken)) &&
                ((_loc6_ < _loc3_ && _loc6_ > _loc4_) ||
                    Boolean(this.kneeJoint2.broken))
                ? true
                : false;
        if (!this.mainPelvis) {
            _loc8_ = this.pelvisBody.GetPosition();
            _loc9_ = this.mainBody.GetWorldPoint(this.pelvisAnchorPoint);
            if (
                Math.abs(_loc8_.x - _loc9_.x) < this.reAttachDistance &&
                Math.abs(_loc8_.y - _loc9_.y) < this.reAttachDistance &&
                _loc7_
            ) {
                trace("MAIN PELVIS " + _loc5_ + " " + _loc6_);
                this.mainPelvis = _loc2_.CreateJoint(
                    this.mainPelvisJointDef,
                ) as b2RevoluteJoint;
                _loc1_ += 1;
            }
        } else {
            _loc1_ += 1;
        }
        if (this.mainPelvis) {
            if (!this.mainLeg1) {
                _loc8_ = this.upperLeg1Body.GetPosition();
                _loc9_ = this.mainBody.GetWorldPoint(this.leg1AnchorPoint);
                if (
                    Math.abs(_loc8_.x - _loc9_.x) < this.reAttachDistance &&
                    Math.abs(_loc8_.y - _loc9_.y) < this.reAttachDistance &&
                    _loc7_
                ) {
                    this.mainLeg1 = _loc2_.CreateJoint(
                        this.mainLeg1JointDef,
                    ) as b2RevoluteJoint;
                    _loc1_ += 1;
                }
            } else {
                _loc1_ += 1;
            }
            if (!this.mainLeg2) {
                _loc8_ = this.upperLeg2Body.GetPosition();
                _loc9_ = this.mainBody.GetWorldPoint(this.leg2AnchorPoint);
                if (
                    Math.abs(_loc8_.x - _loc9_.x) < this.reAttachDistance &&
                    Math.abs(_loc8_.y - _loc9_.y) < this.reAttachDistance &&
                    _loc7_
                ) {
                    this.mainLeg2 = _loc2_.CreateJoint(
                        this.mainLeg2JointDef,
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
            trace(this.kneeJoint1.GetJointAngle());
            trace(this.kneeJoint2.GetJointAngle());
            this.removeAction(this.reAttaching);
        }
    }

    protected override reAttach(param1: b2Body) {
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
        _loc3_ = -10 / _loc5_ - _loc2_;
        _loc4_ = 10 / _loc5_ - _loc2_;
        this.neckJoint.SetLimits(_loc3_, _loc4_);
        var _loc6_: b2World = this._session.m_world;
        if (param1 == this.lowerArm1Body) {
            this.mainHand1 = _loc6_.CreateJoint(
                this.mainHand1JointDef,
            ) as b2RevoluteJoint;
            // @ts-expect-error
            this.lowerArm1MC.hand.gotoAndStop(1);
        } else {
            this.mainHand2 = _loc6_.CreateJoint(
                this.mainHand2JointDef,
            ) as b2RevoluteJoint;
            // @ts-expect-error
            this.lowerArm2MC.hand.gotoAndStop(1);
        }
        var _loc7_ = new b2FilterData();
        _loc7_.categoryBits = 513;
        _loc7_.groupIndex = -2;
        this.handleShape.SetFilterData(_loc7_);
        _loc6_.Refilter(this.handleShape);
        _loc7_ = this.zeroFilter.Copy();
        _loc7_.groupIndex = -2;
        this.shaftShape.SetFilterData(_loc7_);
        _loc6_.Refilter(this.shaftShape);
        this.actionsVector.push(this.reAttaching);
    }

    public override shoulderBreak1(param1: number, param2: boolean = true) {
        super.shoulderBreak1(param1, param2);
        if (this.ejected) {
            return;
        }
        if (this.mainHand1) {
            this._session.m_world.DestroyJoint(this.mainHand1);
            this.mainHand1 = null;
        }
        this.checkEject();
    }

    public override shoulderBreak2(param1: number, param2: boolean = true) {
        super.shoulderBreak2(param1, param2);
        if (this.ejected) {
            return;
        }
        if (this.mainHand2) {
            this._session.m_world.DestroyJoint(this.mainHand2);
            this.mainHand2 = null;
        }
        this.checkEject();
    }

    public override hipBreak1(param1: number, param2: boolean = true) {
        super.hipBreak1(param1, param2);
        if (this.ejected) {
            return;
        }
        if (this.mainLeg1) {
            this._session.m_world.DestroyJoint(this.mainLeg1);
            this.mainLeg1 = null;
        }
        this.checkEject();
    }

    public override hipBreak2(param1: number, param2: boolean = true) {
        super.hipBreak2(param1, param2);
        if (this.ejected) {
            return;
        }
        if (this.mainLeg2) {
            this._session.m_world.DestroyJoint(this.mainLeg2);
            this.mainLeg2 = null;
        }
        this.checkEject();
    }
}