import b2FilterData from "@/Box2D/Collision/Shapes/b2FilterData";
import b2PolygonShape from "@/Box2D/Collision/Shapes/b2PolygonShape";
import b2Shape from "@/Box2D/Collision/Shapes/b2Shape";
import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import b2Body from "@/Box2D/Dynamics/b2Body";
import b2World from "@/Box2D/Dynamics/b2World";
import b2RevoluteJoint from "@/Box2D/Dynamics/Joints/b2RevoluteJoint";
import b2RevoluteJointDef from "@/Box2D/Dynamics/Joints/b2RevoluteJointDef";
import Ligament from "@/com/totaljerkface/game/character/Ligament";
import SegwayGuy from "@/com/totaljerkface/game/character/SegwayGuy";
import ContactListener from "@/com/totaljerkface/game/ContactListener";
import Vehicle from "@/com/totaljerkface/game/level/groups/Vehicle";
import Session from "@/com/totaljerkface/game/Session";
import SoundController from "@/com/totaljerkface/game/sound/SoundController";
import { boundClass } from 'autobind-decorator';
import DisplayObject from "flash/display/DisplayObject";
import Sprite from "flash/display/Sprite";

@boundClass
export default class SegwayGuyV111 extends SegwayGuy {
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

    public override reAttaching() {
        var _loc3_: b2Vec2 = null;
        var _loc4_: b2Vec2 = null;
        var _loc1_: number = 0;
        var _loc2_: b2World = this._session.m_world;
        if (
            !this.frameHand1 &&
            !this.elbowJoint1.broken &&
            !this.shoulderJoint1.broken
        ) {
            _loc3_ = this.lowerArm1Body.GetWorldPoint(
                new b2Vec2(
                    0,
                    (this.lowerArm1Shape as b2PolygonShape).GetVertices()[2].y,
                ),
            );
            _loc4_ = this.frameBody.GetWorldPoint(this.handleAnchorPoint);
            if (
                Math.abs(_loc3_.x - _loc4_.x) < this.reAttachDistance &&
                Math.abs(_loc3_.y - _loc4_.y) < this.reAttachDistance
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
            _loc3_ = this.lowerArm2Body.GetWorldPoint(
                new b2Vec2(
                    0,
                    (this.lowerArm2Shape as b2PolygonShape).GetVertices()[2].y,
                ),
            );
            _loc4_ = this.frameBody.GetWorldPoint(this.handleAnchorPoint);
            if (
                Math.abs(_loc3_.x - _loc4_.x) < this.reAttachDistance &&
                Math.abs(_loc3_.y - _loc4_.y) < this.reAttachDistance
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
        if (
            !this.standFoot1 &&
            !this.kneeJoint1.broken &&
            !this.hipJoint1.broken
        ) {
            _loc3_ = this.lowerLeg1Body.GetWorldPoint(
                new b2Vec2(
                    0,
                    (this.lowerLeg1Shape as b2PolygonShape).GetVertices()[2].y,
                ),
            );
            _loc4_ = this.frameBody.GetWorldPoint(this.footAnchorPoint);
            if (
                Math.abs(_loc3_.x - _loc4_.x) < 0.2 &&
                Math.abs(_loc3_.y - _loc4_.y) < 0.2
            ) {
                this.standFoot1 = _loc2_.CreateJoint(
                    this.standFoot1JointDef,
                ) as b2RevoluteJoint;
                _loc1_ += 1;
            }
        } else {
            _loc1_ += 1;
        }
        if (
            !this.standFoot2 &&
            !this.kneeJoint2.broken &&
            !this.hipJoint2.broken
        ) {
            _loc3_ = this.lowerLeg2Body.GetWorldPoint(
                new b2Vec2(
                    0,
                    (this.lowerLeg2Shape as b2PolygonShape).GetVertices()[2].y,
                ),
            );
            _loc4_ = this.frameBody.GetWorldPoint(this.footAnchorPoint);
            if (
                Math.abs(_loc3_.x - _loc4_.x) < 0.2 &&
                Math.abs(_loc3_.y - _loc4_.y) < 0.2
            ) {
                this.standFoot2 = _loc2_.CreateJoint(
                    this.standFoot2JointDef,
                ) as b2RevoluteJoint;
                _loc1_ += 1;
            }
        } else {
            _loc1_ += 1;
        }
        if (_loc1_ >= 4) {
            trace("ATTACH COMPLETE");
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
            this.hipJoint1.m_body2.GetAngle() -
            this.hipJoint1.m_body1.GetAngle() -
            this.hipJoint1.GetJointAngle();
        _loc3_ = -50 / _loc5_ - _loc2_;
        _loc4_ = 10 / _loc5_ - _loc2_;
        this.hipJoint1.SetLimits(_loc3_, _loc4_);
        _loc2_ =
            this.hipJoint2.m_body2.GetAngle() -
            this.hipJoint2.m_body1.GetAngle() -
            this.hipJoint2.GetJointAngle();
        _loc3_ = -50 / _loc5_ - _loc2_;
        _loc4_ = 10 / _loc5_ - _loc2_;
        this.hipJoint2.SetLimits(_loc3_, _loc4_);
        _loc2_ =
            this.lowerArm1Body.GetAngle() -
            this.upperArm1Body.GetAngle() -
            this.elbowJoint1.GetJointAngle();
        _loc3_ = -60 / _loc5_ - _loc2_;
        _loc4_ = 0 / _loc5_ - _loc2_;
        this.elbowJoint1.SetLimits(_loc3_, _loc4_);
        _loc2_ =
            this.lowerArm2Body.GetAngle() -
            this.upperArm2Body.GetAngle() -
            this.elbowJoint2.GetJointAngle();
        _loc3_ = -60 / _loc5_ - _loc2_;
        _loc4_ = 0 / _loc5_ - _loc2_;
        this.elbowJoint2.SetLimits(_loc3_, _loc4_);
        _loc2_ =
            this.head1Body.GetAngle() -
            this.chestBody.GetAngle() -
            this.neckJoint.GetJointAngle();
        _loc3_ = 0 / _loc5_ - _loc2_;
        _loc4_ = 20 / _loc5_ - _loc2_;
        this.neckJoint.SetLimits(_loc3_, _loc4_);
        var _loc6_: b2World = this._session.m_world;
        var _loc7_ = new b2FilterData();
        _loc7_.categoryBits = 514;
        var _loc8_: b2Shape = this.frameBody.GetShapeList();
        while (_loc8_) {
            _loc8_.SetFilterData(_loc7_);
            _loc6_.Refilter(_loc8_);
            _loc8_ = _loc8_.m_next;
        }
        _loc7_ = new b2FilterData();
        _loc7_.categoryBits = 260;
        _loc7_.maskBits = 268;
        _loc8_ = this.wheelBody.GetShapeList();
        _loc8_.SetFilterData(_loc7_);
        _loc6_.Refilter(_loc8_);
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

    public override shoulderBreak1(param1: number, param2: boolean = true) {
        super.shoulderBreak1(param1, param2);
        if (this.ejected) {
            return;
        }
        if (this.frameHand1) {
            this._session.m_world.DestroyJoint(this.frameHand1);
            this.frameHand1 = null;
            this.checkEject();
        }
    }

    public override shoulderBreak2(param1: number, param2: boolean = true) {
        super.shoulderBreak2(param1, param2);
        if (this.ejected) {
            return;
        }
        if (this.frameHand2) {
            this._session.m_world.DestroyJoint(this.frameHand2);
            this.frameHand2 = null;
            this.checkEject();
        }
    }

    public override hipBreak1(param1: number, param2: boolean = true) {
        super.hipBreak1(param1, param2);
        if (this.ejected) {
            return;
        }
        if (this.standFoot1) {
            this._session.m_world.DestroyJoint(this.standFoot1);
            this.standFoot1 = null;
        }
    }

    public override hipBreak2(param1: number, param2: boolean = true) {
        super.hipBreak2(param1, param2);
        if (this.ejected) {
            return;
        }
        if (this.standFoot2) {
            this._session.m_world.DestroyJoint(this.standFoot2);
            this.standFoot2 = null;
        }
    }

    public override elbowBreak1(param1: number) {
        trace(
            this.tag +
            " elbow1 break " +
            param1 +
            " -> " +
            this._session.iteration,
        );
        this.elbowJoint1.broken = true;
        this._session.m_world.DestroyJoint(this.elbowJoint1);
        this.lowerArm1Body.GetShapeList().SetFilterData(this.zeroFilter);
        this._session.m_world.Refilter(this.lowerArm1Body.GetShapeList());
        this.lowerArm1MC.gotoAndStop(2);
        switch (this.upperArm1MC.currentFrame) {
            case 3:
                this.upperArm1MC.gotoAndStop(6);
                break;
            case 4:
                this.upperArm1MC.gotoAndStop(7);
                break;
            default:
                this.upperArm1MC.gotoAndStop(5);
        }
        this.lowerArm1MC.gotoAndStop(2);
        var _loc2_: Sprite = this.shapeGuide["lowerArm1Shape"];
        this._session.particleController.createBloodBurst(
            5,
            15,
            this.lowerArm1Body,
            50,
            new b2Vec2(
                0,
                (_loc2_.scaleY * -this.shapeRefScale) / this.character_scale,
            ),
            this._session.containerSprite,
        );
        if (param1 < this.elbowLigamentLimit) {
            this.elbowLigament1 = new Ligament(
                this.upperArm1Body,
                this.lowerArm1Body,
                this.ligamentLength,
                this.character_scale,
                this,
            );
            this.composites.push(this.elbowLigament1);
        }
        var _loc3_: number = Math.ceil(Math.random() * 4);
        SoundController.instance.playAreaSoundInstance(
            "BoneBreak" + _loc3_,
            this.lowerArm1Body,
        );
        this.addVocals("Elbow1", 1);
        if (this.vehicleArm1Joint) {
            this._session.m_world.DestroyJoint(this.vehicleArm1Joint);
            this.vehicleArm1Joint = null;
            if (this.vehicleArm2Joint == null) {
                this.userVehicleEject();
            }
        }
        if (this.ejected) {
            return;
        }
        if (this.frameHand1) {
            trace("REMOVE FRAME HAND 1");
            this._session.m_world.DestroyJoint(this.frameHand1);
            this.frameHand1 = null;
            this.checkEject();
        }
    }

    public override elbowBreak2(param1: number) {
        trace(
            this.tag +
            " elbow2 break " +
            param1 +
            " -> " +
            this._session.iteration,
        );
        this.elbowJoint2.broken = true;
        this._session.m_world.DestroyJoint(this.elbowJoint2);
        this.lowerArm2Body.GetShapeList().SetFilterData(this.zeroFilter);
        this._session.m_world.Refilter(this.lowerArm2Body.GetShapeList());
        this.lowerArm2MC.gotoAndStop(2);
        switch (this.upperArm2MC.currentFrame) {
            case 3:
                this.upperArm2MC.gotoAndStop(6);
                break;
            case 4:
                this.upperArm2MC.gotoAndStop(7);
                break;
            default:
                this.upperArm2MC.gotoAndStop(5);
        }
        this.lowerArm2MC.gotoAndStop(2);
        var _loc2_: Sprite = this.shapeGuide["lowerArm2Shape"];
        this._session.particleController.createBloodBurst(
            5,
            15,
            this.lowerArm2Body,
            50,
            new b2Vec2(
                0,
                (_loc2_.scaleY * -this.shapeRefScale) / this.character_scale,
            ),
            this._session.containerSprite,
        );
        if (param1 < this.elbowLigamentLimit) {
            this.elbowLigament2 = new Ligament(
                this.upperArm2Body,
                this.lowerArm2Body,
                this.ligamentLength,
                this.character_scale,
                this,
            );
            this.composites.push(this.elbowLigament2);
        }
        var _loc3_: number = Math.ceil(Math.random() * 4);
        SoundController.instance.playAreaSoundInstance(
            "BoneBreak" + _loc3_,
            this.lowerArm2Body,
        );
        this.addVocals("Elbow2", 1);
        if (this.vehicleArm2Joint) {
            this._session.m_world.DestroyJoint(this.vehicleArm2Joint);
            this.vehicleArm2Joint = null;
            if (this.vehicleArm1Joint == null) {
                this.userVehicleEject();
            }
        }
        if (this.ejected) {
            return;
        }
        if (this.frameHand2) {
            this._session.m_world.DestroyJoint(this.frameHand2);
            this.frameHand2 = null;
            this.checkEject();
        }
    }

    public checkEject() {
        if (!this.frameHand1 && !this.frameHand2) {
            this.eject();
        }
    }
}