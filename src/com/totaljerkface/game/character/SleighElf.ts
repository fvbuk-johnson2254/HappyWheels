import b2ContactPoint from "@/Box2D/Collision/b2ContactPoint";
import b2CircleDef from "@/Box2D/Collision/Shapes/b2CircleDef";
import b2FilterData from "@/Box2D/Collision/Shapes/b2FilterData";
import b2PolygonDef from "@/Box2D/Collision/Shapes/b2PolygonDef";
import b2Shape from "@/Box2D/Collision/Shapes/b2Shape";
import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import b2Body from "@/Box2D/Dynamics/b2Body";
import b2BodyDef from "@/Box2D/Dynamics/b2BodyDef";
import b2PrismaticJoint from "@/Box2D/Dynamics/Joints/b2PrismaticJoint";
import b2PrismaticJointDef from "@/Box2D/Dynamics/Joints/b2PrismaticJointDef";
import b2RevoluteJoint from "@/Box2D/Dynamics/Joints/b2RevoluteJoint";
import b2RevoluteJointDef from "@/Box2D/Dynamics/Joints/b2RevoluteJointDef";
import CharacterB2D from "@/com/totaljerkface/game/character/CharacterB2D";
import SantaClaus from "@/com/totaljerkface/game/character/SantaClaus";
import ContactListener from "@/com/totaljerkface/game/ContactListener";
import Session from "@/com/totaljerkface/game/Session";
import SoundController from "@/com/totaljerkface/game/sound/SoundController";
import { boundClass } from 'autobind-decorator';
import DisplayObject from "flash/display/DisplayObject";
import MovieClip from "flash/display/MovieClip";

@boundClass
export default class SleighElf extends CharacterB2D {
    public santa: SantaClaus;
    public gravityDisplacement: number = -0.3333333333333333;
    protected wheelCurrentSpeed: number;
    protected wheelNewSpeed: number;
    protected wheelMaxSpeed: number;
    protected accelStep: number;
    protected wheelMultiplier: number;
    protected verticalOffset: number;
    protected stemBody: b2Body;
    protected wheelBody: b2Body;
    protected wheelShape: b2Shape;
    protected wheelContacts: number = 0;
    protected sleighStemJoint: b2PrismaticJoint;
    protected stemWheelJoint: b2RevoluteJoint;
    protected stemChestJoint: b2RevoluteJoint;
    protected wheelFoot1Joint: b2RevoluteJoint;
    protected wheelFoot2Joint: b2RevoluteJoint;
    public legsOk: boolean = true;
    public headAttached: boolean = true;
    public chestAttached: boolean = true;
    public strappedIn: boolean = true;
    public ejected: boolean;
    public extraFilter: b2FilterData;
    public antiGravArray: any[];
    protected minCos: number = 0.9396;
    protected sign: boolean;

    constructor(
        param1: number,
        param2: number,
        param3: DisplayObject,
        param4: Session,
        param5: number = -2,
        param6: string = "Elf1",
        param7: SantaClaus = null,
        param8: number = 50,
    ) {
        super(param1, param2, param3, param4, param5, param6);
        this.shapeRefScale = 50;
        this.santa = param7;
        this.verticalOffset = param8;
    }

    public override leftPressedActions() {
        var _loc1_: number = NaN;
        var _loc2_: number = NaN;
        var _loc3_: number = NaN;
        var _loc4_: number = NaN;
        var _loc5_: b2Vec2 = null;
        if (this.ejected) {
            this.currentPose = 1;
        } else if (this.legsOk) {
            _loc1_ = this.stemBody.GetAngle();
            _loc2_ = 1;
            _loc3_ = Math.cos(_loc1_) * _loc2_;
            _loc4_ = Math.sin(_loc1_) * _loc2_;
            _loc5_ = this.stemBody.GetLocalCenter();
        }
    }

    public override rightPressedActions() {
        var _loc1_: number = NaN;
        var _loc2_: number = NaN;
        var _loc3_: number = NaN;
        var _loc4_: number = NaN;
        var _loc5_: b2Vec2 = null;
        if (this.ejected) {
            this.currentPose = 2;
        } else if (this.legsOk) {
            _loc1_ = this.stemBody.GetAngle();
            _loc2_ = 1;
            _loc3_ = Math.cos(_loc1_) * _loc2_;
            _loc4_ = Math.sin(_loc1_) * _loc2_;
            _loc5_ = this.stemBody.GetLocalCenter();
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
        } else if (this.legsOk) {
            if (!this.stemWheelJoint.IsMotorEnabled()) {
                this.stemWheelJoint.EnableMotor(true);
            }
            this.wheelCurrentSpeed = this.stemWheelJoint.GetJointSpeed();
            this.wheelNewSpeed =
                this.wheelCurrentSpeed < this.wheelMaxSpeed
                    ? this.wheelCurrentSpeed + this.accelStep
                    : this.wheelCurrentSpeed;
            this.stemWheelJoint.SetMotorSpeed(this.wheelNewSpeed);
            this.currentPose = 5;
        }
    }

    public override downPressedActions() {
        if (this.ejected) {
            this.currentPose = 4;
        } else if (this.legsOk) {
            if (!this.stemWheelJoint.IsMotorEnabled()) {
                this.stemWheelJoint.EnableMotor(true);
            }
            this.wheelCurrentSpeed = this.stemWheelJoint.GetJointSpeed();
            this.wheelNewSpeed =
                this.wheelCurrentSpeed > -this.wheelMaxSpeed
                    ? this.wheelCurrentSpeed - this.accelStep
                    : this.wheelCurrentSpeed;
            this.stemWheelJoint.SetMotorSpeed(this.wheelNewSpeed);
            this.currentPose = 6;
        }
    }

    public override upAndDownActions() {
        if (this.ejected) {
            if (this._currentPose == 3 || this._currentPose == 4) {
                this.currentPose = 0;
            }
        } else if (this.legsOk) {
            if (this.stemWheelJoint.IsMotorEnabled()) {
                this.stemWheelJoint.EnableMotor(false);
            }
            this.currentPose = 0;
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

    public override zPressedActions() {
        if (this.santa.dead) {
            this.eject();
        }
    }

    public override actions() {
        var _loc1_: number = NaN;
        var _loc2_: number = NaN;
        var _loc3_: number = 0;
        super.actions();
        if (this.wheelContacts > 0) {
            if (Math.abs(this.wheelBody.m_angularVelocity) > 5) {
                _loc1_ = this.wheelBody.GetAngle();
                _loc2_ = Math.cos(_loc1_);
                if (!this.sign) {
                    if (_loc2_ > this.minCos) {
                        this.sign = true;
                        if (this.wheelFoot2Joint) {
                            _loc3_ = Math.ceil(Math.random() * 5) * 2;
                            SoundController.instance.playAreaSoundInstance(
                                "Step" + _loc3_,
                                this.wheelBody,
                            );
                        }
                    }
                } else if (_loc2_ < -this.minCos) {
                    this.sign = false;
                    if (this.wheelFoot1Joint) {
                        _loc3_ = Math.ceil(Math.random() * 5) * 2 - 1;
                        SoundController.instance.playAreaSoundInstance(
                            "Step" + _loc3_,
                            this.wheelBody,
                        );
                    }
                }
            }
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
                this.runForwardPose();
                break;
            case 6:
                this.runBackwardPose();
                break;
            case 7:
                this.armsDownPose();
                break;
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

    public override reset() {
        super.reset();
        this.ejected = false;
        this.legsOk = true;
        this.sign = true;
        this.wheelContacts = 0;
        this.headAttached = true;
        this.chestAttached = true;
        this.strappedIn = true;
    }

    public override die() {
        super.die();
    }

    public override paint() {
        var _loc1_: number = NaN;
        var _loc2_: b2Vec2 = null;
        var _loc3_: b2Vec2 = null;
        var _loc4_: b2Vec2 = null;
        var _loc5_: number = NaN;
        var _loc6_: number = NaN;
        var _loc7_: number = NaN;
        super.paint();
        _loc1_ = Math.abs(this.wheelBody.GetAngularVelocity()) / 5;
        _loc1_ = Math.max(_loc1_, 0);
        _loc1_ = Math.min(_loc1_, 1);
        _loc1_ = 1 - _loc1_;
        if (this.wheelFoot1Joint) {
            _loc2_ = this.lowerLeg1Body.GetWorldCenter();
            _loc3_ = this.stemBody.GetWorldPoint(new b2Vec2(0.115, 0.5702));
            _loc4_ = new b2Vec2(_loc2_.x - _loc3_.x, _loc2_.y - _loc3_.y);
            _loc5_ = Number(this.lowerLeg1Body.GetAngle());
            _loc6_ = this.stemBody.GetAngle() + 0.305;
            _loc7_ = _loc5_ - _loc6_;
            _loc3_ = new b2Vec2(
                _loc2_.x - _loc4_.x * _loc1_,
                _loc2_.y - _loc4_.y * _loc1_,
            );
            this.lowerLeg1MC.x = _loc3_.x * this.m_physScale;
            this.lowerLeg1MC.y = _loc3_.y * this.m_physScale;
            this.lowerLeg1MC.rotation =
                ((_loc5_ - _loc7_ * _loc1_) * CharacterB2D.oneEightyOverPI) %
                360;
            _loc2_ = this.upperLeg1Body.GetWorldCenter();
            _loc3_ = this.stemBody.GetWorldPoint(new b2Vec2(0.1553, 0.1994));
            _loc4_ = new b2Vec2(_loc2_.x - _loc3_.x, _loc2_.y - _loc3_.y);
            _loc5_ = Number(this.upperLeg1Body.GetAngle());
            _loc6_ = this.stemBody.GetAngle() - 0.1952;
            _loc7_ = _loc5_ - _loc6_;
            _loc3_ = new b2Vec2(
                _loc2_.x - _loc4_.x * _loc1_,
                _loc2_.y - _loc4_.y * _loc1_,
            );
            this.upperLeg1MC.x = _loc3_.x * this.m_physScale;
            this.upperLeg1MC.y = _loc3_.y * this.m_physScale;
            this.upperLeg1MC.rotation =
                ((_loc5_ - _loc7_ * _loc1_) * CharacterB2D.oneEightyOverPI) %
                360;
        }
        if (this.wheelFoot2Joint) {
            _loc2_ = this.lowerLeg2Body.GetWorldCenter();
            _loc3_ = this.stemBody.GetWorldPoint(new b2Vec2(0.115, 0.5702));
            _loc4_ = new b2Vec2(_loc2_.x - _loc3_.x, _loc2_.y - _loc3_.y);
            _loc5_ = Number(this.lowerLeg2Body.GetAngle());
            _loc6_ = this.stemBody.GetAngle() + 0.305;
            _loc7_ = _loc5_ - _loc6_;
            _loc3_ = new b2Vec2(
                _loc2_.x - _loc4_.x * _loc1_,
                _loc2_.y - _loc4_.y * _loc1_,
            );
            this.lowerLeg2MC.x = _loc3_.x * this.m_physScale;
            this.lowerLeg2MC.y = _loc3_.y * this.m_physScale;
            this.lowerLeg2MC.rotation =
                ((_loc5_ - _loc7_ * _loc1_) * CharacterB2D.oneEightyOverPI) %
                360;
            _loc2_ = this.upperLeg2Body.GetWorldCenter();
            _loc3_ = this.stemBody.GetWorldPoint(new b2Vec2(0.1553, 0.1994));
            _loc4_ = new b2Vec2(_loc2_.x - _loc3_.x, _loc2_.y - _loc3_.y);
            _loc5_ = Number(this.upperLeg2Body.GetAngle());
            _loc6_ = this.stemBody.GetAngle() - 0.1952;
            _loc7_ = _loc5_ - _loc6_;
            _loc3_ = new b2Vec2(
                _loc2_.x - _loc4_.x * _loc1_,
                _loc2_.y - _loc4_.y * _loc1_,
            );
            this.upperLeg2MC.x = _loc3_.x * this.m_physScale;
            this.upperLeg2MC.y = _loc3_.y * this.m_physScale;
            this.upperLeg2MC.rotation =
                ((_loc5_ - _loc7_ * _loc1_) * CharacterB2D.oneEightyOverPI) %
                360;
        }
    }

    public override createBodies() {
        super.createBodies();
        this._session.contactListener.deleteListener(
            ContactListener.RESULT,
            this.lowerLeg1Shape,
        );
        this._session.contactListener.deleteListener(
            ContactListener.RESULT,
            this.lowerLeg2Shape,
        );
        var _loc1_ = new b2PolygonDef();
        var _loc2_ = new b2CircleDef();
        var _loc3_ = new b2BodyDef();
        var _loc4_ = new b2BodyDef();
        _loc1_ = new b2PolygonDef();
        _loc2_ = new b2CircleDef();
        _loc1_.density = 4;
        _loc1_.friction = 0.3;
        _loc1_.restitution = 0.3;
        _loc1_.filter.categoryBits = 0;
        _loc1_.filter.maskBits = 0;
        _loc2_.density = 6;
        _loc2_.friction = 1;
        _loc2_.restitution = 0.1;
        _loc2_.filter.categoryBits = 62464;
        _loc2_.filter.maskBits = 520;
        _loc2_.filter.groupIndex = this.groupID;
        var _loc5_: MovieClip = this.shapeGuide["stem"];
        _loc3_.position.Set(
            this._startX + _loc5_.x / this.character_scale,
            this._startY + _loc5_.y / this.character_scale,
        );
        _loc3_.angle = _loc5_.rotation / CharacterB2D.oneEightyOverPI;
        _loc1_.SetAsBox(
            (_loc5_.scaleX * this.shapeRefScale) / this.character_scale,
            (_loc5_.scaleY * this.shapeRefScale) / this.character_scale,
        );
        this.stemBody = this._session.m_world.CreateBody(_loc3_);
        this.stemBody.CreateShape(_loc1_);
        this.stemBody.SetMassFromShapes();
        _loc5_ = this.shapeGuide["wheel"];
        _loc4_.position.Set(
            this._startX + _loc5_.x / this.character_scale,
            this._startY + _loc5_.y / this.character_scale,
        );
        _loc4_.angle = _loc5_.rotation / CharacterB2D.oneEightyOverPI;
        _loc2_.radius = _loc5_.width / 2 / this.character_scale;
        this.wheelBody = this._session.m_world.CreateBody(_loc4_);
        this.wheelShape = this.wheelBody.CreateShape(_loc2_);
        this.wheelBody.SetMassFromShapes();
        this._session.contactListener.registerListener(
            ContactListener.ADD,
            this.wheelShape,
            this.wheelContactAdd,
        );
        this._session.contactListener.registerListener(
            ContactListener.REMOVE,
            this.wheelShape,
            this.wheelContactRemove,
        );
        this.wheelMultiplier = this.santa.wheelRadius / (_loc5_.width * 0.5);
        this.wheelMaxSpeed = this.santa.wheelMaxSpeed * this.wheelMultiplier;
        this.accelStep = this.santa.accelStep * this.wheelMultiplier;
        this.antiGravArray = new Array();
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
        this.antiGravArray.push(this.stemBody);
        this.antiGravArray.push(this.wheelBody);
    }

    public override createMovieClips() {
        super.createMovieClips();
        this._session.containerSprite.addChildAt(
            this.chestMC,
            this._session.containerSprite.getChildIndex(this.lowerLeg1MC),
        );
    }

    public override createJoints() {
        var _loc1_: number = NaN;
        var _loc2_: number = NaN;
        var _loc3_: number = NaN;
        super.createJoints();
        var _loc4_: number = CharacterB2D.oneEightyOverPI;
        _loc1_ = this.lowerArm1Body.GetAngle() - this.upperArm1Body.GetAngle();
        _loc2_ = -90 / _loc4_ - _loc1_;
        _loc3_ = 0 / _loc4_ - _loc1_;
        this.elbowJoint1.SetLimits(_loc2_, _loc3_);
        _loc1_ = this.lowerArm2Body.GetAngle() - this.upperArm2Body.GetAngle();
        _loc2_ = -90 / _loc4_ - _loc1_;
        _loc3_ = 0 / _loc4_ - _loc1_;
        this.elbowJoint2.SetLimits(_loc2_, _loc3_);
        _loc1_ =
            this.shoulderJoint1.m_body2.GetAngle() -
            this.shoulderJoint1.m_body1.GetAngle();
        _loc2_ = -170 / _loc4_ - _loc1_;
        _loc3_ = 0 / _loc4_ - _loc1_;
        this.shoulderJoint1.SetLimits(_loc2_, _loc3_);
        _loc1_ =
            this.shoulderJoint2.m_body2.GetAngle() -
            this.shoulderJoint2.m_body1.GetAngle();
        _loc2_ = -170 / _loc4_ - _loc1_;
        _loc3_ = 0 / _loc4_ - _loc1_;
        this.shoulderJoint2.SetLimits(_loc2_, _loc3_);
        _loc1_ = this.head1Body.GetAngle() - this.chestBody.GetAngle();
        _loc2_ = -10 / _loc4_ - _loc1_;
        _loc3_ = 0 / _loc4_ - _loc1_;
        this.neckJoint.SetLimits(_loc2_, _loc3_);
        var _loc5_ = new b2PrismaticJointDef();
        var _loc6_ = new b2RevoluteJointDef();
        var _loc7_ = new b2Vec2();
        _loc7_.Set(
            this.stemBody.GetPosition().x,
            this.stemBody.GetPosition().y,
        );
        _loc5_.Initialize(
            this.santa.sleighBody,
            this.stemBody,
            _loc7_,
            new b2Vec2(0, 1),
        );
        _loc5_.enableLimit = true;
        _loc5_.upperTranslation = this.verticalOffset / this.m_physScale;
        _loc5_.lowerTranslation = -this.verticalOffset / this.m_physScale;
        this.sleighStemJoint = this._session.m_world.CreateJoint(
            _loc5_,
        ) as b2PrismaticJoint;
        _loc6_.maxMotorTorque = this.santa.maxTorque;
        _loc7_.Set(
            this.wheelBody.GetPosition().x,
            this.wheelBody.GetPosition().y,
        );
        _loc6_.Initialize(this.stemBody, this.wheelBody, _loc7_);
        this.stemWheelJoint = this._session.m_world.CreateJoint(
            _loc6_,
        ) as b2RevoluteJoint;
        _loc6_.maxMotorTorque = 0;
        var _loc8_: MovieClip = this.shapeGuide["foot1Anchor"];
        _loc7_.Set(
            this._startX + _loc8_.x / this.character_scale,
            this._startY + _loc8_.y / this.character_scale,
        );
        _loc6_.Initialize(this.wheelBody, this.lowerLeg1Body, _loc7_);
        this.wheelFoot1Joint = this._session.m_world.CreateJoint(
            _loc6_,
        ) as b2RevoluteJoint;
        _loc8_ = this.shapeGuide["foot2Anchor"];
        _loc7_.Set(
            this._startX + _loc8_.x / this.character_scale,
            this._startY + _loc8_.y / this.character_scale,
        );
        _loc6_.Initialize(this.wheelBody, this.lowerLeg2Body, _loc7_);
        this.wheelFoot2Joint = this._session.m_world.CreateJoint(
            _loc6_,
        ) as b2RevoluteJoint;
        _loc7_.Set(
            this.chestBody.GetPosition().x,
            this.chestBody.GetPosition().y,
        );
        _loc6_.Initialize(this.stemBody, this.chestBody, _loc7_);
        _loc6_.enableLimit = true;
        _loc6_.lowerAngle = 0;
        _loc6_.upperAngle = 20 / _loc4_;
        this.stemChestJoint = this._session.m_world.CreateJoint(
            _loc6_,
        ) as b2RevoluteJoint;
    }

    public override eject() {
        if (this.ejected) {
            return;
        }
        this.ejected = true;
        if (this._session.version > 1.51) {
            this.resetJointLimits();
        }
        this.disableRunning();
        this.santa.elfHeadRemove(this, false);
        this.santa.elfChestRemove(this, false);
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
            this.santa.mourn(this);
            this.disableRunning();
        }
    }

    protected wheelContactAdd(param1: b2ContactPoint) {
        if (param1.shape2.m_isSensor) {
            return;
        }
        this.wheelContacts += 1;
    }

    protected wheelContactRemove(param1: b2ContactPoint) {
        if (param1.shape2.m_isSensor) {
            return;
        }
        --this.wheelContacts;
    }

    public override headSmash1(param1: number) {
        super.headSmash1(param1);
        var _loc2_ = int(this.paintVector.length);
        var _loc3_: number = _loc2_ - 5;
        while (_loc3_ < _loc2_) {
            this.antiGravArray.push(this.paintVector[_loc3_]);
            _loc3_++;
        }
        if (this.ejected) {
            return;
        }
        this.santa.elfHeadRemove(this, true);
    }

    public override chestSmash(param1: number) {
        super.chestSmash(param1);
        var _loc2_ = int(this.paintVector.length);
        var _loc3_: number = _loc2_ - 5;
        while (_loc3_ < _loc2_) {
            this.antiGravArray.push(this.paintVector[_loc3_]);
            _loc3_++;
        }
        if (this.ejected) {
            return;
        }
        this.santa.elfChestRemove(this, true);
    }

    public override pelvisSmash(param1: number) {
        super.pelvisSmash(param1);
        var _loc2_ = int(this.paintVector.length);
        var _loc3_: number = _loc2_ - 3;
        while (_loc3_ < _loc2_) {
            this.antiGravArray.push(this.paintVector[_loc3_]);
            _loc3_++;
        }
    }

    public override torsoBreak(
        param1: number,
        param2: boolean = true,
        param3: boolean = true,
    ) {
        super.torsoBreak(param1, param2, param3);
        this.disableRunning();
    }

    public override kneeBreak1(param1: number) {
        super.kneeBreak1(param1);
        if (this.ejected) {
            return;
        }
        if (this.wheelFoot1Joint) {
            this._session.m_world.DestroyJoint(this.wheelFoot1Joint);
            this.wheelFoot1Joint = null;
            this._session.contactListener.registerListener(
                ContactListener.RESULT,
                this.lowerLeg1Shape,
                this.contactResultHandler,
            );
            this.checkLegsOk();
        }
    }

    public override kneeBreak2(param1: number) {
        super.kneeBreak2(param1);
        if (this.ejected) {
            return;
        }
        if (this.wheelFoot2Joint) {
            this._session.m_world.DestroyJoint(this.wheelFoot2Joint);
            this.wheelFoot2Joint = null;
            this._session.contactListener.registerListener(
                ContactListener.RESULT,
                this.lowerLeg2Shape,
                this.contactResultHandler,
            );
            this.checkLegsOk();
        }
    }

    public override shoulderBreak1(param1: number, param2: boolean = true) {
        super.shoulderBreak1(param1, param2);
        if (this.upperArm3Body) {
            this.antiGravArray.push(this.upperArm3Body);
        }
    }

    public override shoulderBreak2(param1: number, param2: boolean = true) {
        super.shoulderBreak2(param1, param2);
        if (this.upperArm4Body) {
            this.antiGravArray.push(this.upperArm4Body);
        }
    }

    public override hipBreak1(param1: number, param2: boolean = true) {
        super.hipBreak1(param1, param2);
        if (this.upperLeg3Body) {
            this.antiGravArray.push(this.upperLeg3Body);
        }
        if (this.ejected) {
            return;
        }
        if (this.wheelFoot1Joint) {
            this._session.m_world.DestroyJoint(this.wheelFoot1Joint);
            this.wheelFoot1Joint = null;
            this._session.contactListener.registerListener(
                ContactListener.RESULT,
                this.lowerLeg1Shape,
                this.contactResultHandler,
            );
            this.checkLegsOk();
        }
    }

    public override hipBreak2(param1: number, param2: boolean = true) {
        super.hipBreak2(param1, param2);
        if (this.upperLeg4Body) {
            this.antiGravArray.push(this.upperLeg4Body);
        }
        if (this.ejected) {
            return;
        }
        if (this.wheelFoot2Joint) {
            this._session.m_world.DestroyJoint(this.wheelFoot2Joint);
            this.wheelFoot2Joint = null;
            this._session.contactListener.registerListener(
                ContactListener.RESULT,
                this.lowerLeg2Shape,
                this.contactResultHandler,
            );
            this.checkLegsOk();
        }
    }

    public override footSmash1(param1: number) {
        super.footSmash1(param1);
        this.antiGravArray.push(this.foot1Body);
    }

    public override footSmash2(param1: number) {
        super.footSmash2(param1);
        this.antiGravArray.push(this.foot2Body);
    }

    public disableRunning() {
        if (this.wheelFoot1Joint) {
            this._session.m_world.DestroyJoint(this.wheelFoot1Joint);
            this.wheelFoot1Joint = null;
            this._session.contactListener.registerListener(
                ContactListener.RESULT,
                this.lowerLeg1Shape,
                this.contactResultHandler,
            );
        }
        if (this.wheelFoot2Joint) {
            this._session.m_world.DestroyJoint(this.wheelFoot2Joint);
            this.wheelFoot2Joint = null;
            this._session.contactListener.registerListener(
                ContactListener.RESULT,
                this.lowerLeg2Shape,
                this.contactResultHandler,
            );
        }
        this.checkLegsOk();
    }

    protected checkLegsOk() {
        if (this.wheelFoot1Joint == null && this.wheelFoot2Joint == null) {
            this.wheelContacts = 0;
            this._session.contactListener.deleteListener(
                ContactListener.ADD,
                this.wheelShape,
            );
            this._session.contactListener.deleteListener(
                ContactListener.REMOVE,
                this.wheelShape,
            );
            this._session.m_world.DestroyBody(this.wheelBody);
            this.stemWheelJoint = null;
            this._session.m_world.DestroyBody(this.stemBody);
            this.sleighStemJoint = null;
            this.stemChestJoint = null;
            this.legsOk = false;
        }
        this.currentPose = 0;
    }

    protected runForwardPose() {
        var _loc1_: number = NaN;
        var _loc2_: number = NaN;
        if (this.wheelFoot1Joint) {
            _loc1_ =
                this.kneeJoint1.GetJointAngle() - this.kneeJoint1.m_lowerAngle;
            _loc2_ = _loc1_ / (150 / CharacterB2D.oneEightyOverPI);
            this.setJoint(this.elbowJoint2, 1 * _loc2_, 15);
            _loc1_ =
                this.hipJoint1.GetJointAngle() - this.hipJoint1.m_lowerAngle;
            _loc2_ = _loc1_ / (160 / CharacterB2D.oneEightyOverPI);
            this.setJoint(this.shoulderJoint2, 3 * _loc2_, 15);
        }
        if (this.wheelFoot2Joint) {
            _loc1_ =
                this.kneeJoint2.GetJointAngle() - this.kneeJoint2.m_lowerAngle;
            _loc2_ = _loc1_ / (150 / CharacterB2D.oneEightyOverPI);
            this.setJoint(this.elbowJoint1, 1 * _loc2_, 15);
            _loc1_ =
                this.hipJoint2.GetJointAngle() - this.hipJoint2.m_lowerAngle;
            _loc2_ = _loc1_ / (160 / CharacterB2D.oneEightyOverPI);
            this.setJoint(this.shoulderJoint1, 3 * _loc2_, 15);
        }
    }

    protected runBackwardPose() {
        var _loc1_: number = NaN;
        var _loc2_: number = NaN;
        if (this.wheelFoot1Joint) {
            _loc1_ =
                this.kneeJoint1.GetJointAngle() - this.kneeJoint1.m_lowerAngle;
            _loc2_ = _loc1_ / (150 / CharacterB2D.oneEightyOverPI);
            this.setJoint(this.elbowJoint2, 2.6 * _loc2_, 15);
            _loc1_ =
                this.hipJoint1.GetJointAngle() - this.hipJoint1.m_lowerAngle;
            _loc2_ = _loc1_ / (160 / CharacterB2D.oneEightyOverPI);
            this.setJoint(this.shoulderJoint2, 4.18 * _loc2_, 15);
        }
        if (this.wheelFoot2Joint) {
            _loc1_ =
                this.kneeJoint2.GetJointAngle() - this.kneeJoint2.m_lowerAngle;
            _loc2_ = _loc1_ / (150 / CharacterB2D.oneEightyOverPI);
            this.setJoint(this.elbowJoint1, 2.6 * _loc2_, 15);
            _loc1_ =
                this.hipJoint2.GetJointAngle() - this.hipJoint2.m_lowerAngle;
            _loc2_ = _loc1_ / (160 / CharacterB2D.oneEightyOverPI);
            this.setJoint(this.shoulderJoint1, 4.18 * _loc2_, 15);
        }
    }

    protected armsDownPose() {
        this.setJoint(this.elbowJoint1, 2.4, 5, 2);
        this.setJoint(this.elbowJoint2, 2.4, 5, 2);
        this.setJoint(this.shoulderJoint1, 3, 10, 2);
        this.setJoint(this.shoulderJoint2, 3, 10, 2);
    }
}