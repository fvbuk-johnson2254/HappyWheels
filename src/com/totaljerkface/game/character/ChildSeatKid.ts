import b2FilterData from "@/Box2D/Collision/Shapes/b2FilterData";
import b2PolygonDef from "@/Box2D/Collision/Shapes/b2PolygonDef";
import b2Shape from "@/Box2D/Collision/Shapes/b2Shape";
import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import b2Body from "@/Box2D/Dynamics/b2Body";
import b2BodyDef from "@/Box2D/Dynamics/b2BodyDef";
import b2World from "@/Box2D/Dynamics/b2World";
import b2RevoluteJoint from "@/Box2D/Dynamics/Joints/b2RevoluteJoint";
import b2RevoluteJointDef from "@/Box2D/Dynamics/Joints/b2RevoluteJointDef";
import CharacterB2D from "@/com/totaljerkface/game/character/CharacterB2D";
import IrresponsibleDad from "@/com/totaljerkface/game/character/IrresponsibleDad";
import ContactListener from "@/com/totaljerkface/game/ContactListener";
import Session from "@/com/totaljerkface/game/Session";
import { boundClass } from 'autobind-decorator';
import DisplayObject from "flash/display/DisplayObject";
import MovieClip from "flash/display/MovieClip";

@boundClass
export default class ChildSeatKid extends CharacterB2D {
    public dad: IrresponsibleDad;
    public ejected: boolean;
    public detached: boolean;
    public detachLimit: number = 200;
    public seatBody: b2Body;
    public seatShape1: b2Shape;
    public seatMC: MovieClip;
    public frameSeatJoint: b2RevoluteJoint;
    public seatChest: b2RevoluteJoint;
    public seatPelvis: b2RevoluteJoint;
    public seatLeg1: b2RevoluteJoint;
    public seatLeg2: b2RevoluteJoint;
    public extraFilter: b2FilterData;

    constructor(
        param1: number,
        param2: number,
        param3: DisplayObject,
        param4: Session,
        param5: number = -2,
        param6: string = "kid",
        param7: IrresponsibleDad = null,
    ) {
        super(param1, param2, param3, param4, param5, param6);
        this.dad = param7;
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

    public override zPressedActions() {
        this.eject();
    }

    public override ctrlPressedActions() {
        this.eject();
    }

    public override createFilters() {
        this.defaultFilter = new b2FilterData();
        this.defaultFilter.groupIndex = this.groupID;
        this.defaultFilter.categoryBits = 260;
        this.defaultFilter.maskBits = 270;
        this.zeroFilter = new b2FilterData();
        this.zeroFilter.groupIndex = 0;
        this.zeroFilter.categoryBits = 260;
        this.lowerBodyFilter = new b2FilterData();
        this.lowerBodyFilter.categoryBits = 260;
        this.lowerBodyFilter.groupIndex = this.groupID - 5;
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
        this.seatBody = null;
    }

    public override createDictionaries() {
        super.createDictionaries();
        this.contactAddSounds.set(this.seatShape1, "BikeHit3");
    }

    public override createBodies() {
        var _loc4_: MovieClip = null;
        super.createBodies();
        var _loc1_ = new b2BodyDef();
        var _loc2_ = new b2PolygonDef();
        _loc2_.density = 1;
        _loc2_.friction = 0.3;
        _loc2_.restitution = 0.1;
        _loc2_.filter = this.defaultFilter;
        _loc2_.vertexCount = 4;
        var _loc3_: number = 0;
        while (_loc3_ < 4) {
            _loc4_ = this.shapeGuide["seat1Vert" + [_loc3_ + 1]];
            _loc2_.vertices[_loc3_] = new b2Vec2(
                this._startX + _loc4_.x / this.character_scale,
                this._startY + _loc4_.y / this.character_scale,
            );
            _loc3_++;
        }
        this.seatBody = this._session.m_world.CreateBody(_loc1_);
        this.seatShape1 = this.seatBody.CreateShape(_loc2_);
        this._session.contactListener.registerListener(
            ContactListener.ADD,
            this.seatShape1,
            this.contactAddHandler,
        );
        _loc3_ = 0;
        while (_loc3_ < 4) {
            _loc4_ = this.shapeGuide["seat2Vert" + [_loc3_ + 1]];
            _loc2_.vertices[_loc3_] = new b2Vec2(
                this._startX + _loc4_.x / this.character_scale,
                this._startY + _loc4_.y / this.character_scale,
            );
            _loc3_++;
        }
        this.seatBody.CreateShape(_loc2_);
        _loc3_ = 0;
        while (_loc3_ < 4) {
            _loc4_ = this.shapeGuide["seat3Vert" + [_loc3_ + 1]];
            _loc2_.vertices[_loc3_] = new b2Vec2(
                this._startX + _loc4_.x / this.character_scale,
                this._startY + _loc4_.y / this.character_scale,
            );
            _loc3_++;
        }
        _loc2_.isSensor = true;
        this.seatBody.CreateShape(_loc2_);
        this.seatBody.SetMassFromShapes();
        this.paintVector.push(this.seatBody);
    }

    public override createMovieClips() {
        super.createMovieClips();
        this.seatMC = this.sourceObject["seat"];
        var _loc4_ = 1 / this.mc_scale;
        this.seatMC.scaleY = 1 / this.mc_scale;
        this.seatMC.scaleX = _loc4_;
        var _loc1_: b2Vec2 = this.seatBody.GetLocalCenter();
        _loc1_ = new b2Vec2(
            (this._startX - _loc1_.x) * this.character_scale,
            (this._startY - _loc1_.y) * this.character_scale,
        );
        var _loc2_: MovieClip = this.shapeGuide["seat3Vert3"];
        var _loc3_ = new b2Vec2(_loc2_.x + _loc1_.x, _loc2_.y + _loc1_.y);
        // @ts-expect-error
        this.seatMC.inner.x = _loc3_.x;
        // @ts-expect-error
        this.seatMC.inner.y = _loc3_.y;
        this.seatBody.SetUserData(this.seatMC);
        this._session.containerSprite.addChildAt(
            this.seatMC,
            this._session.containerSprite.getChildIndex(this.upperArm1MC),
        );
    }

    public override resetMovieClips() {
        super.resetMovieClips();
        this.seatBody.SetUserData(this.seatMC);
    }

    public override createJoints() {
        super.createJoints();
        var _loc1_ = new b2RevoluteJointDef();
        var _loc2_ = new b2Vec2();
        var _loc3_: IrresponsibleDad = this._session
            .character as IrresponsibleDad;
        var _loc4_: MovieClip = this.shapeGuide["frameSeatAnchor"];
        _loc1_.enableLimit = true;
        _loc1_.lowerAngle = 0;
        _loc1_.upperAngle = 0;
        _loc2_.Set(
            this._startX + _loc4_.x / this.character_scale,
            this._startY + _loc4_.y / this.character_scale,
        );
        _loc1_.Initialize(_loc3_.frameBody, this.seatBody, _loc2_);
        this.frameSeatJoint = this._session.m_world.CreateJoint(
            _loc1_,
        ) as b2RevoluteJoint;
        _loc1_.enableLimit = false;
        _loc2_.Set(
            this.chestBody.GetPosition().x,
            this.chestBody.GetPosition().y,
        );
        _loc1_.Initialize(this.seatBody, this.chestBody, _loc2_);
        this.seatChest = this._session.m_world.CreateJoint(
            _loc1_,
        ) as b2RevoluteJoint;
        _loc2_.Set(
            this.pelvisBody.GetPosition().x,
            this.pelvisBody.GetPosition().y,
        );
        _loc1_.Initialize(this.seatBody, this.pelvisBody, _loc2_);
        this.seatPelvis = this._session.m_world.CreateJoint(
            _loc1_,
        ) as b2RevoluteJoint;
        _loc2_.Set(
            this.upperLeg1Body.GetPosition().x,
            this.upperLeg1Body.GetPosition().y,
        );
        _loc1_.Initialize(this.seatBody, this.upperLeg1Body, _loc2_);
        this.seatLeg1 = this._session.m_world.CreateJoint(
            _loc1_,
        ) as b2RevoluteJoint;
        _loc2_.Set(
            this.upperLeg2Body.GetPosition().x,
            this.upperLeg2Body.GetPosition().y,
        );
        _loc1_.Initialize(this.seatBody, this.upperLeg2Body, _loc2_);
        this.seatLeg2 = this._session.m_world.CreateJoint(
            _loc1_,
        ) as b2RevoluteJoint;
    }

    public override checkJoints() {
        super.checkJoints();
        this.checkRevJoint(
            this.frameSeatJoint,
            this.detachLimit,
            this.detachSeat,
        );
    }

    public detachSeat(param1: number) {
        var _loc2_: b2Shape = null;
        trace("detach seat " + param1);
        this.frameSeatJoint.broken = true;
        this.detached = true;
        this._session.m_world.DestroyJoint(this.frameSeatJoint);
        if (!this.ejected) {
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
            _loc2_ = this.seatBody.GetShapeList();
            while (_loc2_) {
                _loc2_.SetFilterData(this.extraFilter);
                _loc2_.m_isSensor = false;
                this._session.m_world.Refilter(_loc2_);
                _loc2_ = _loc2_.m_next;
            }
        } else {
            _loc2_ = this.seatBody.GetShapeList();
            while (_loc2_) {
                _loc2_.m_isSensor = false;
                this._session.m_world.Refilter(_loc2_);
                _loc2_ = _loc2_.m_next;
            }
        }
    }

    public override eject() {
        if (this.ejected) {
            return;
        }
        this.ejected = true;
        this.resetJointLimits();
        this._session.m_world.DestroyJoint(this.seatPelvis);
        this.seatPelvis = null;
        this._session.m_world.DestroyJoint(this.seatChest);
        this.seatChest = null;
        if (this.seatLeg1) {
            this._session.m_world.DestroyJoint(this.seatLeg1);
            this.seatLeg1 = null;
        }
        if (this.seatLeg2) {
            this._session.m_world.DestroyJoint(this.seatLeg2);
            this.seatLeg2 = null;
        }
        var _loc1_: b2World = this._session.m_world;
        if (!this.detached) {
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
        }
        var _loc2_: b2Shape = this.seatBody.GetShapeList();
        while (_loc2_) {
            _loc2_.SetFilterData(this.zeroFilter);
            _loc1_.Refilter(_loc2_);
            _loc2_ = _loc2_.m_next;
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
            this.dad.mourn();
        }
    }

    public refilterShit(param1: b2Shape) {
        if (param1.m_filter.maskBits == this.defaultFilter.maskBits) {
            param1.m_filter = this.extraFilter;
            this._session.m_world.Refilter(param1);
        }
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

    public override hipBreak1(param1: number, param2: boolean = true) {
        super.hipBreak1(param1, param2);
        if (this.seatLeg1) {
            this._session.m_world.DestroyJoint(this.seatLeg1);
            this.seatLeg1 = null;
        }
    }

    public override hipBreak2(param1: number, param2: boolean = true) {
        super.hipBreak2(param1, param2);
        if (this.seatLeg2) {
            this._session.m_world.DestroyJoint(this.seatLeg2);
            this.seatLeg2 = null;
        }
    }
}