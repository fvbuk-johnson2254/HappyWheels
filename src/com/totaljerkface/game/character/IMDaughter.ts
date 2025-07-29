import b2CircleDef from "@/Box2D/Collision/Shapes/b2CircleDef";
import b2FilterData from "@/Box2D/Collision/Shapes/b2FilterData";
import b2PolygonDef from "@/Box2D/Collision/Shapes/b2PolygonDef";
import b2Shape from "@/Box2D/Collision/Shapes/b2Shape";
import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import b2Body from "@/Box2D/Dynamics/b2Body";
import b2BodyDef from "@/Box2D/Dynamics/b2BodyDef";
import b2World from "@/Box2D/Dynamics/b2World";
import b2GearJoint from "@/Box2D/Dynamics/Joints/b2GearJoint";
import b2GearJointDef from "@/Box2D/Dynamics/Joints/b2GearJointDef";
import b2RevoluteJoint from "@/Box2D/Dynamics/Joints/b2RevoluteJoint";
import b2RevoluteJointDef from "@/Box2D/Dynamics/Joints/b2RevoluteJointDef";
import CharacterB2D from "@/com/totaljerkface/game/character/CharacterB2D";
import IrresponsibleMom from "@/com/totaljerkface/game/character/IrresponsibleMom";
import ContactListener from "@/com/totaljerkface/game/ContactListener";
import ContactEvent from "@/com/totaljerkface/game/events/ContactEvent";
import Session from "@/com/totaljerkface/game/Session";
import SoundController from "@/com/totaljerkface/game/sound/SoundController";
import { boundClass } from 'autobind-decorator';
import DisplayObject from "flash/display/DisplayObject";
import MovieClip from "flash/display/MovieClip";
import Sprite from "flash/display/Sprite";

@boundClass
export default class IMDaughter extends CharacterB2D {
    public mom: IrresponsibleMom;
    public ejected: boolean;
    public detached: boolean;
    public detachLimit: number = 400;
    public maxTorque: number = 20;
    public frameSmashLimit: number = 50;
    private wheelMaxSpeed: number = 27.7;
    private wheelCurrentSpeed: number;
    private wheelNewSpeed: number;
    private accelStep: number = 1.385;
    public frameBody: b2Body;
    public wheelBody: b2Body;
    public gearBody: b2Body;
    public frameShape: b2Shape;
    public seatShape: b2Shape;
    public midShape: b2Shape;
    public endShape: b2Shape;
    public handleShape: b2Shape;
    public wheelShape: b2Shape;
    public frameMC: MovieClip;
    public wheelMC: MovieClip;
    public gearMC: MovieClip;
    public forkMC: MovieClip;
    public brokenFrameMC: MovieClip;
    public seatMC: MovieClip;
    public wheelJoint: b2RevoluteJoint;
    public framePelvis: b2RevoluteJoint;
    public frameHand1: b2RevoluteJoint;
    public frameHand2: b2RevoluteJoint;
    public gearFoot1: b2RevoluteJoint;
    public gearFoot2: b2RevoluteJoint;
    public frameGear: b2RevoluteJoint;
    public connectingJoint: b2RevoluteJoint;
    public gearJoint: b2GearJoint;
    public extraFilter: b2FilterData;

    constructor(
        param1: number,
        param2: number,
        param3: DisplayObject,
        param4: Session,
        param5: number = -2,
        param6: string = "kid",
        param7: IrresponsibleMom = null,
    ) {
        super(param1, param2, param3, param4, param5, param6);
        this.shapeRefScale = 50;
        this.mom = param7;
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
        } else {
            if (!this.wheelJoint.IsMotorEnabled()) {
                this.wheelJoint.EnableMotor(true);
            }
            this.wheelCurrentSpeed = this.wheelJoint.GetJointSpeed();
            if (this.wheelCurrentSpeed < 0) {
                this.wheelNewSpeed = 0;
            } else {
                this.wheelNewSpeed =
                    this.wheelCurrentSpeed < this.wheelMaxSpeed
                        ? this.wheelCurrentSpeed + this.accelStep
                        : this.wheelCurrentSpeed;
            }
            this.wheelJoint.SetMotorSpeed(this.wheelNewSpeed);
        }
    }

    public override downPressedActions() {
        if (this.ejected) {
            this.currentPose = 4;
        } else {
            if (!this.wheelJoint.IsMotorEnabled()) {
                this.wheelJoint.EnableMotor(true);
            }
            this.wheelCurrentSpeed = this.wheelJoint.GetJointSpeed();
            if (this.wheelCurrentSpeed > 0) {
                this.wheelNewSpeed = 0;
            } else {
                this.wheelNewSpeed =
                    this.wheelCurrentSpeed > -this.wheelMaxSpeed
                        ? this.wheelCurrentSpeed - this.accelStep
                        : this.wheelCurrentSpeed;
            }
            this.wheelJoint.SetMotorSpeed(this.wheelNewSpeed);
        }
    }

    public override upAndDownActions() {
        if (this.wheelJoint.IsMotorEnabled()) {
            this.wheelJoint.EnableMotor(false);
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
            if (!this.wheelJoint.IsMotorEnabled()) {
                this.wheelJoint.EnableMotor(true);
            }
            this.wheelJoint.SetMotorSpeed(0);
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

    public override ctrlPressedActions() {
        this.eject();
    }

    public override paint() {
        var _loc1_: b2Vec2 = null;
        super.paint();
        _loc1_ = this.wheelBody.GetWorldCenter();
        this.wheelMC.x = _loc1_.x * this.m_physScale;
        this.wheelMC.y = _loc1_.y * this.m_physScale;
        // @ts-expect-error
        this.wheelMC.inner.rotation =
            (this.wheelBody.GetAngle() * CharacterB2D.oneEightyOverPI) % 360;
    }

    public override createFilters() {
        super.createFilters();
        this.extraFilter = new b2FilterData();
        this.extraFilter.groupIndex = this.groupID;
        this.extraFilter.categoryBits = 260;
    }

    public override reset() {
        super.reset();
        this.ejected = false;
        this.detached = false;
    }

    public override die() {
        super.die();
    }

    public override createDictionaries() {
        super.createDictionaries();
        this.contactImpulseDict.set(this.frameShape, this.frameSmashLimit);
        this.contactAddSounds.set(this.wheelShape, "TireHit1");
        this.contactAddSounds.set(this.frameShape, "BikeHit3");
        this.contactAddSounds.set(this.midShape, "BikeHit2");
        this.contactAddSounds.set(this.handleShape, "BikeHit1");
    }

    public override createBodies() {
        var _loc9_: MovieClip = null;
        super.createBodies();
        var _loc1_ = new b2BodyDef();
        var _loc2_ = new b2BodyDef();
        var _loc3_ = new b2BodyDef();
        var _loc4_ = new b2PolygonDef();
        var _loc5_ = new b2CircleDef();
        _loc4_.density = 2;
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
            _loc9_ = this.shapeGuide["seatVert" + [_loc6_ + 1]];
            _loc4_.vertices[_loc6_] = new b2Vec2(
                this._startX + _loc9_.x / this.character_scale,
                this._startY + _loc9_.y / this.character_scale,
            );
            _loc6_++;
        }
        this.seatShape = this.frameBody.CreateShape(_loc4_);
        this._session.contactListener.registerListener(
            ContactListener.RESULT,
            this.seatShape,
            this.contactFrameResultHandler,
        );
        _loc4_.filter = this.zeroFilter;
        _loc6_ = 0;
        while (_loc6_ < 3) {
            _loc9_ = this.shapeGuide["frameVert" + [_loc6_ + 1]];
            _loc4_.vertices[_loc6_] = new b2Vec2(
                this._startX + _loc9_.x / this.character_scale,
                this._startY + _loc9_.y / this.character_scale,
            );
            _loc6_++;
        }
        this.frameShape = this.frameBody.CreateShape(_loc4_);
        this._session.contactListener.registerListener(
            ContactListener.RESULT,
            this.frameShape,
            this.contactFrameResultHandler,
        );
        this._session.contactListener.registerListener(
            ContactListener.ADD,
            this.frameShape,
            this.contactAddHandler,
        );
        _loc6_ = 0;
        while (_loc6_ < 3) {
            _loc9_ = this.shapeGuide["handleVert" + [_loc6_ + 1]];
            _loc4_.vertices[_loc6_] = new b2Vec2(
                this._startX + _loc9_.x / this.character_scale,
                this._startY + _loc9_.y / this.character_scale,
            );
            _loc6_++;
        }
        this.handleShape = this.frameBody.CreateShape(_loc4_);
        this._session.contactListener.registerListener(
            ContactListener.RESULT,
            this.handleShape,
            this.contactFrameResultHandler,
        );
        this._session.contactListener.registerListener(
            ContactListener.ADD,
            this.handleShape,
            this.contactAddHandler,
        );
        _loc4_.vertexCount = 4;
        _loc6_ = 0;
        while (_loc6_ < 4) {
            _loc9_ = this.shapeGuide["midVert" + [_loc6_ + 1]];
            _loc4_.vertices[_loc6_] = new b2Vec2(
                this._startX + _loc9_.x / this.character_scale,
                this._startY + _loc9_.y / this.character_scale,
            );
            _loc6_++;
        }
        this.midShape = this.frameBody.CreateShape(_loc4_);
        this._session.contactListener.registerListener(
            ContactListener.RESULT,
            this.midShape,
            this.contactFrameResultHandler,
        );
        this._session.contactListener.registerListener(
            ContactListener.ADD,
            this.midShape,
            this.contactAddHandler,
        );
        _loc6_ = 0;
        while (_loc6_ < 4) {
            _loc9_ = this.shapeGuide["endVert" + [_loc6_ + 1]];
            _loc4_.vertices[_loc6_] = new b2Vec2(
                this._startX + _loc9_.x / this.character_scale,
                this._startY + _loc9_.y / this.character_scale,
            );
            _loc6_++;
        }
        this.endShape = this.frameBody.CreateShape(_loc4_);
        this._session.contactListener.registerListener(
            ContactListener.RESULT,
            this.endShape,
            this.contactFrameResultHandler,
        );
        this.frameBody.SetMassFromShapes();
        this.paintVector.push(this.frameBody);
        var _loc7_: Sprite = this.shapeGuide["wheelShape"];
        _loc2_.position.Set(
            this._startX + _loc7_.x / this.character_scale,
            this._startY + _loc7_.y / this.character_scale,
        );
        _loc2_.angle = _loc7_.rotation / CharacterB2D.oneEightyOverPI;
        _loc5_.radius = _loc7_.width / 2 / this.character_scale;
        this.wheelBody = this._session.m_world.CreateBody(_loc2_);
        this.wheelShape = this.wheelBody.CreateShape(_loc5_);
        this.wheelBody.SetMassFromShapes();
        this._session.contactListener.registerListener(
            ContactListener.ADD,
            this.wheelShape,
            this.contactAddHandler,
        );
        _loc7_ = this.shapeGuide["gearShape"];
        _loc3_.position.Set(
            this._startX + _loc7_.x / this.character_scale,
            this._startY + _loc7_.y / this.character_scale,
        );
        _loc3_.angle = _loc7_.rotation / CharacterB2D.oneEightyOverPI;
        _loc5_.radius = _loc7_.width / 2 / this.character_scale;
        this.gearBody = this._session.m_world.CreateBody(_loc3_);
        this.gearBody.CreateShape(_loc5_);
        this.gearBody.SetMassFromShapes();
        this.paintVector.push(this.gearBody);
        var _loc8_: b2Shape = this.upperLeg1Body.GetShapeList();
        _loc8_.m_isSensor = true;
        _loc8_ = this.upperLeg2Body.GetShapeList();
        _loc8_.m_isSensor = true;
        _loc8_ = this.lowerLeg1Body.GetShapeList();
        _loc8_.m_isSensor = true;
        _loc8_ = this.lowerLeg2Body.GetShapeList();
        _loc8_.m_isSensor = true;
        this.endShape.m_isSensor = true;
    }

    public override createMovieClips() {
        super.createMovieClips();
        this.gearMC = this.sourceObject["gear"];
        var _loc4_ = 1 / this.mc_scale;
        this.gearMC.scaleY = 1 / this.mc_scale;
        this.gearMC.scaleX = _loc4_;
        this.wheelMC = this.sourceObject["wheel"];
        _loc4_ = 1 / this.mc_scale;
        this.wheelMC.scaleY = 1 / this.mc_scale;
        this.wheelMC.scaleX = _loc4_;
        this.frameMC = this.sourceObject["frame"];
        _loc4_ = 1 / this.mc_scale;
        this.frameMC.scaleY = 1 / this.mc_scale;
        this.frameMC.scaleX = _loc4_;
        this.forkMC = this.sourceObject["fork"];
        _loc4_ = 1 / this.mc_scale;
        this.forkMC.scaleY = 1 / this.mc_scale;
        this.forkMC.scaleX = _loc4_;
        this.brokenFrameMC = this.sourceObject["brokenFrame"];
        _loc4_ = 1 / this.mc_scale;
        this.brokenFrameMC.scaleY = 1 / this.mc_scale;
        this.brokenFrameMC.scaleX = _loc4_;
        this.seatMC = this.sourceObject["seat"];
        _loc4_ = 1 / this.mc_scale;
        this.seatMC.scaleY = 1 / this.mc_scale;
        this.seatMC.scaleX = _loc4_;
        var _loc1_: b2Vec2 = this.frameBody.GetLocalCenter();
        _loc1_ = new b2Vec2(
            (this._startX - _loc1_.x) * this.character_scale,
            (this._startY - _loc1_.y) * this.character_scale,
        );
        var _loc2_: MovieClip = this.shapeGuide["frameVert1"];
        var _loc3_ = new b2Vec2(_loc2_.x + _loc1_.x, _loc2_.y + _loc1_.y);
        // @ts-expect-error
        this.frameMC.inner.x = _loc3_.x;
        // @ts-expect-error
        this.frameMC.inner.y = _loc3_.y;
        this.forkMC.visible = false;
        this.brokenFrameMC.visible = false;
        this.seatMC.visible = false;
        this.frameBody.SetUserData(this.frameMC);
        this.gearBody.SetUserData(this.gearMC);
        this.wheelBody.SetUserData(this.wheelMC);
        this._session.containerSprite.addChildAt(
            this.wheelMC,
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
        this.frameMC.visible = true;
        this.forkMC.visible = false;
        this.brokenFrameMC.visible = false;
        this.seatMC.visible = false;
        this.frameBody.SetUserData(this.frameMC);
        this.gearBody.SetUserData(this.gearMC);
        this.wheelBody.SetUserData(this.wheelMC);
    }

    public override createJoints() {
        var _loc1_: number = NaN;
        var _loc2_: number = NaN;
        var _loc3_: number = NaN;
        super.createJoints();
        var _loc4_: number = CharacterB2D.oneEightyOverPI;
        _loc1_ = this.lowerLeg1Body.GetAngle() - this.upperLeg1Body.GetAngle();
        _loc2_ = 10 / _loc4_ - _loc1_;
        _loc3_ = 150 / _loc4_ - _loc1_;
        _loc1_ = this.lowerLeg2Body.GetAngle() - this.upperLeg2Body.GetAngle();
        _loc2_ = 10 / _loc4_ - _loc1_;
        _loc3_ = 150 / _loc4_ - _loc1_;
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
        var _loc7_: MovieClip = this.shapeGuide["wheelShape"];
        _loc6_.Set(
            this._startX + _loc7_.x / this.character_scale,
            this._startY + _loc7_.y / this.character_scale,
        );
        _loc5_.Initialize(this.frameBody, this.wheelBody, _loc6_);
        this.wheelJoint = this._session.m_world.CreateJoint(
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
        var _loc8_ = new b2GearJointDef();
        _loc8_.body1 = this.wheelBody;
        _loc8_.body2 = this.gearBody;
        _loc8_.joint1 = this.wheelJoint;
        _loc8_.joint2 = this.frameGear;
        this.gearJoint = this._session.m_world.CreateJoint(
            _loc8_,
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
        _loc7_ = this.shapeGuide["connectAnchor"];
        _loc6_.Set(
            this._startX + _loc7_.x / this.character_scale,
            this._startY + _loc7_.y / this.character_scale,
        );
        _loc5_.Initialize(this.mom.frameBody, this.frameBody, _loc6_);
        _loc5_.enableLimit = true;
        _loc5_.lowerAngle = -35 / _loc4_;
        _loc5_.upperAngle = 35 / _loc4_;
        this.connectingJoint = this._session.m_world.CreateJoint(
            _loc5_,
        ) as b2RevoluteJoint;
    }

    protected contactFrameResultHandler(param1: ContactEvent) {
        var _loc2_: number = param1.impulse;
        if (_loc2_ > this.contactImpulseDict.get(this.frameShape)) {
            if (this.contactResultBuffer.get(this.frameShape)) {
                if (
                    _loc2_ >
                    this.contactResultBuffer.get(this.frameShape).impulse
                ) {
                    this.contactResultBuffer.set(this.frameShape, param1);
                }
            } else {
                this.contactResultBuffer.set(this.frameShape, param1);
            }
        }
    }

    protected override handleContactResults() {
        var _loc1_: ContactEvent = null;
        super.handleContactResults();
        if (this.contactResultBuffer.get(this.frameShape)) {
            _loc1_ = this.contactResultBuffer.get(this.frameShape);
            this.frameSmash(_loc1_.impulse, _loc1_.normal);
            this.contactResultBuffer.delete(this.frameShape);
            this.contactAddBuffer.delete(this.frameShape);
            this.contactAddBuffer.delete(this.midShape);
            this.contactAddBuffer.delete(this.handleShape);
        }
        if (this.contactResultBuffer.get(this.wheelShape)) {
            _loc1_ = this.contactResultBuffer.get(this.wheelShape);
            this.contactResultBuffer.delete(this.wheelShape);
            this.contactAddBuffer.delete(this.wheelShape);
        }
    }

    public override checkJoints() {
        super.checkJoints();
        if (!this.detached) {
            this.checkRevJoint(
                this.connectingJoint,
                this.detachLimit,
                this.detachFrame,
            );
        }
    }

    public detachFrame(param1: number) {
        trace("detach rear frame " + param1);
        if (this.detached) {
            return;
        }
        this.connectingJoint.broken = true;
        this.detached = true;
        this._session.m_world.DestroyJoint(this.connectingJoint);
        this.refilterShit(this.head1Body.GetShapeList());
        this.refilterShit(this.pelvisBody.GetShapeList());
        this.refilterShit(this.chestBody.GetShapeList());
        this.refilterShit(this.upperArm1Body.GetShapeList());
        this.refilterShit(this.upperArm2Body.GetShapeList());
        this.refilterShit(this.lowerArm1Body.GetShapeList());
        this.refilterShit(this.lowerArm2Body.GetShapeList());
        this.endShape.m_isSensor = false;
        this._session.m_world.Refilter(this.endShape);
        SoundController.instance.playAreaSoundInstance(
            "StrapSnap1",
            this.frameBody,
        );
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
        this.wheelShape.SetFilterData(this.zeroFilter);
        _loc1_.Refilter(this.wheelShape);
        this.seatShape.SetFilterData(this.zeroFilter);
        _loc1_.Refilter(this.seatShape);
        this.frameShape.SetFilterData(this.zeroFilter);
        _loc1_.Refilter(this.frameShape);
        this.midShape.SetFilterData(this.zeroFilter);
        _loc1_.Refilter(this.midShape);
        this.handleShape.SetFilterData(this.zeroFilter);
        _loc1_.Refilter(this.handleShape);
        this.refilterShit(this.head1Body.GetShapeList());
        this.refilterShit(this.pelvisBody.GetShapeList());
        this.refilterShit(this.chestBody.GetShapeList());
        this.refilterShit(this.upperArm1Body.GetShapeList());
        this.refilterShit(this.upperArm2Body.GetShapeList());
        this.refilterShit(this.lowerArm1Body.GetShapeList());
        this.refilterShit(this.lowerArm2Body.GetShapeList());
        this.refilterShit(this.upperLeg1Body.GetShapeList());
        this.refilterShit(this.upperLeg2Body.GetShapeList());
        this.refilterShit(this.lowerLeg1Body.GetShapeList());
        this.refilterShit(this.lowerLeg2Body.GetShapeList());
        this.wheelJoint.EnableMotor(false);
    }

    public refilterShit(param1: b2Shape) {
        param1.m_isSensor = false;
        if (param1.m_filter.maskBits == this.defaultFilter.maskBits) {
            param1.m_filter = this.extraFilter;
        }
        this._session.m_world.Refilter(param1);
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

    public frameSmash(param1: number, param2: b2Vec2) {
        var _loc11_: Sprite = null;
        trace("daughter frame impulse " + param1);
        this.contactImpulseDict.delete(this.frameShape);
        var _loc3_: ContactListener = this._session.contactListener;
        _loc3_.deleteListener(ContactListener.RESULT, this.frameShape);
        _loc3_.deleteListener(ContactListener.RESULT, this.midShape);
        _loc3_.deleteListener(ContactListener.RESULT, this.handleShape);
        _loc3_.deleteListener(ContactListener.RESULT, this.seatShape);
        _loc3_.deleteListener(ContactListener.RESULT, this.endShape);
        _loc3_.deleteListener(ContactListener.ADD, this.frameShape);
        _loc3_.deleteListener(ContactListener.ADD, this.midShape);
        _loc3_.deleteListener(ContactListener.ADD, this.handleShape);
        _loc3_.deleteListener(ContactListener.ADD, this.wheelShape);
        _loc3_.deleteListener(ContactListener.REMOVE, this.wheelShape);
        this.eject();
        this.detached = true;
        this.forkMC.visible = true;
        this.brokenFrameMC.visible = true;
        this.seatMC.visible = true;
        this.frameMC.visible = false;
        this._session.m_world.DestroyJoint(this.wheelJoint);
        this._session.m_world.DestroyJoint(this.gearJoint);
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
            _loc11_ = this.shapeGuide["broken2Vert" + [_loc12_ + 1]];
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
            if (this.gearFoot2 == null) {
                this._session.m_world.DestroyJoint(this.framePelvis);
                this.framePelvis = null;
            }
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
            if (this.gearFoot1 == null) {
                this._session.m_world.DestroyJoint(this.framePelvis);
                this.framePelvis = null;
            }
        }
        this.checkEject();
    }

    public override hipBreak1(param1: number, param2: boolean = true) {
        super.hipBreak1(param1, param2);
        if (this.ejected) {
            return;
        }
        if (!this.kneeJoint1.broken) {
            this.refilterShit(this.lowerLeg1Shape);
        }
        if (this.gearFoot1) {
            this._session.m_world.DestroyJoint(this.gearFoot1);
            this.gearFoot1 = null;
            if (this.gearFoot2 == null) {
                this._session.m_world.DestroyJoint(this.framePelvis);
                this.framePelvis = null;
            }
        }
        this.checkEject();
    }

    public override hipBreak2(param1: number, param2: boolean = true) {
        super.hipBreak2(param1, param2);
        if (this.ejected) {
            return;
        }
        if (!this.kneeJoint2.broken) {
            this.refilterShit(this.lowerLeg2Shape);
        }
        if (this.gearFoot2) {
            this._session.m_world.DestroyJoint(this.gearFoot2);
            this.gearFoot2 = null;
            if (this.gearFoot1 == null) {
                this._session.m_world.DestroyJoint(this.framePelvis);
                this.framePelvis = null;
            }
        }
        this.checkEject();
    }
}