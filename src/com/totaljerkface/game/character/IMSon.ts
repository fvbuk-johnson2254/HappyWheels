import b2FilterData from "@/Box2D/Collision/Shapes/b2FilterData";
import b2PolygonDef from "@/Box2D/Collision/Shapes/b2PolygonDef";
import b2PolygonShape from "@/Box2D/Collision/Shapes/b2PolygonShape";
import b2Shape from "@/Box2D/Collision/Shapes/b2Shape";
import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import b2Body from "@/Box2D/Dynamics/b2Body";
import b2BodyDef from "@/Box2D/Dynamics/b2BodyDef";
import b2World from "@/Box2D/Dynamics/b2World";
import b2PrismaticJoint from "@/Box2D/Dynamics/Joints/b2PrismaticJoint";
import b2PrismaticJointDef from "@/Box2D/Dynamics/Joints/b2PrismaticJointDef";
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

@boundClass
export default class IMSon extends CharacterB2D {
    public mom: IrresponsibleMom;
    public ejected: boolean;
    public detached: boolean;
    protected ejectImpulse: number = 0.75;
    public detachLimit: number = 100;
    public basketSmashLimit: number = 3;
    private wheelMaxSpeed: number = 27.7;
    private wheelCurrentSpeed: number;
    private wheelNewSpeed: number;
    private accelStep: number = 1.385;
    public basketBody: b2Body;
    public basketShape1: b2Shape;
    public basketShape2: b2Shape;
    public basketShape3: b2Shape;
    public basketShape4: b2Shape;
    public basketShape5: b2Shape;
    public basketShape6: b2Shape;
    public basketMC: MovieClip;
    public connectingJoint: b2RevoluteJoint;
    public basketHand1: b2RevoluteJoint;
    public basketHand2: b2RevoluteJoint;
    public basketPelvis: b2PrismaticJoint;
    public extraFilter: b2FilterData;

    constructor(
        param1: number,
        param2: number,
        param3: DisplayObject,
        param4: Session,
        param5: number = -3,
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

    public override shiftPressedActions() {
        this.eject();
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
        this.contactImpulseDict.set(this.basketShape1, this.basketSmashLimit);
        this.contactAddSounds.set(this.basketShape1, "BasketHit");
        this.contactAddSounds.set(this.basketShape2, "BasketHit");
        this.contactAddSounds.set(this.basketShape3, "BasketHit");
    }

    public override createBodies() {
        var _loc4_: MovieClip = null;
        super.createBodies();
        var _loc1_ = new b2BodyDef();
        var _loc2_ = new b2PolygonDef();
        _loc2_.density = 1;
        _loc2_.friction = 0.3;
        _loc2_.restitution = 0.1;
        _loc2_.filter = this.mom.defaultFilter;
        this.basketBody = this._session.m_world.CreateBody(_loc1_);
        _loc2_.vertexCount = 4;
        var _loc3_: number = 0;
        while (_loc3_ < 4) {
            _loc4_ = this.shapeGuide["crateRight" + [_loc3_ + 1]];
            _loc2_.vertices[_loc3_] = new b2Vec2(
                this._startX + _loc4_.x / this.character_scale,
                this._startY + _loc4_.y / this.character_scale,
            );
            _loc3_++;
        }
        this.basketShape1 = this.basketBody.CreateShape(_loc2_);
        this._session.contactListener.registerListener(
            ContactListener.RESULT,
            this.basketShape1,
            this.contactBasketResultHandler,
        );
        this._session.contactListener.registerListener(
            ContactListener.ADD,
            this.basketShape1,
            this.contactAddHandler,
        );
        _loc3_ = 0;
        while (_loc3_ < 4) {
            _loc4_ = this.shapeGuide["crateBottom" + [_loc3_ + 1]];
            _loc2_.vertices[_loc3_] = new b2Vec2(
                this._startX + _loc4_.x / this.character_scale,
                this._startY + _loc4_.y / this.character_scale,
            );
            _loc3_++;
        }
        this.basketShape2 = this.basketBody.CreateShape(_loc2_);
        this._session.contactListener.registerListener(
            ContactListener.RESULT,
            this.basketShape2,
            this.contactBasketResultHandler,
        );
        this._session.contactListener.registerListener(
            ContactListener.ADD,
            this.basketShape2,
            this.contactAddHandler,
        );
        _loc3_ = 0;
        while (_loc3_ < 4) {
            _loc4_ = this.shapeGuide["crateLeft" + [_loc3_ + 1]];
            _loc2_.vertices[_loc3_] = new b2Vec2(
                this._startX + _loc4_.x / this.character_scale,
                this._startY + _loc4_.y / this.character_scale,
            );
            _loc3_++;
        }
        this.basketShape3 = this.basketBody.CreateShape(_loc2_);
        this._session.contactListener.registerListener(
            ContactListener.RESULT,
            this.basketShape3,
            this.contactBasketResultHandler,
        );
        this._session.contactListener.registerListener(
            ContactListener.ADD,
            this.basketShape3,
            this.contactAddHandler,
        );
        this.basketBody.SetMassFromShapes();
        this.paintVector.push(this.basketBody);
    }

    public override createMovieClips() {
        super.createMovieClips();
        var _loc1_: MovieClip = this.sourceObject["basketPieces"];
        this._session.particleController.createBMDArray("basketPieces", _loc1_);
        this.basketMC = this.sourceObject["basket"];
        var _loc5_ = 1 / this.mc_scale;
        this.basketMC.scaleY = 1 / this.mc_scale;
        this.basketMC.scaleX = _loc5_;
        var _loc2_: b2Vec2 = this.basketBody.GetLocalCenter();
        _loc2_ = new b2Vec2(
            (this._startX - _loc2_.x) * this.character_scale,
            (this._startY - _loc2_.y) * this.character_scale,
        );
        var _loc3_: MovieClip = this.shapeGuide["crateLeft1"];
        var _loc4_ = new b2Vec2(_loc3_.x + _loc2_.x, _loc3_.y + _loc2_.y);
        // @ts-expect-error
        this.basketMC.inner.x = _loc4_.x;
        // @ts-expect-error
        this.basketMC.inner.y = _loc4_.y;
        this.basketBody.SetUserData(this.basketMC);
        this._session.containerSprite.addChild(this.basketMC);
    }

    public override resetMovieClips() {
        super.resetMovieClips();
        var _loc1_: MovieClip = this.sourceObject["basketPieces"];
        this._session.particleController.createBMDArray("basketPieces", _loc1_);
        this.basketMC.visible = true;
        // @ts-expect-error
        this.basketMC.inner.frame.visible = false;
        this.basketBody.SetUserData(this.basketMC);
    }

    public override createJoints() {
        var _loc1_: number = NaN;
        var _loc2_: number = NaN;
        var _loc3_: number = NaN;
        super.createJoints();
        var _loc4_: number = CharacterB2D.oneEightyOverPI;
        _loc1_ = this.lowerLeg1Body.GetAngle() - this.upperLeg1Body.GetAngle();
        _loc2_ = 50 / _loc4_ - _loc1_;
        _loc3_ = 150 / _loc4_ - _loc1_;
        this.kneeJoint1.SetLimits(_loc2_, _loc3_);
        _loc1_ = this.lowerLeg2Body.GetAngle() - this.upperLeg2Body.GetAngle();
        _loc2_ = 50 / _loc4_ - _loc1_;
        _loc3_ = 150 / _loc4_ - _loc1_;
        this.kneeJoint2.SetLimits(_loc2_, _loc3_);
        _loc1_ = this.upperLeg1Body.GetAngle() - this.pelvisBody.GetAngle();
        _loc2_ = -110 / _loc4_ - _loc1_;
        _loc3_ = -40 / _loc4_ - _loc1_;
        _loc1_ = this.upperLeg2Body.GetAngle() - this.pelvisBody.GetAngle();
        _loc2_ = -110 / _loc4_ - _loc1_;
        _loc3_ = -40 / _loc4_ - _loc1_;
        _loc1_ = this.lowerArm1Body.GetAngle() - this.upperArm1Body.GetAngle();
        _loc2_ = -160 / _loc4_ - _loc1_;
        _loc3_ = -20 / _loc4_ - _loc1_;
        this.elbowJoint1.SetLimits(_loc2_, _loc3_);
        _loc1_ = this.lowerArm2Body.GetAngle() - this.upperArm2Body.GetAngle();
        _loc2_ = -160 / _loc4_ - _loc1_;
        _loc3_ = -20 / _loc4_ - _loc1_;
        this.elbowJoint2.SetLimits(_loc2_, _loc3_);
        _loc1_ = this.head1Body.GetAngle() - this.chestBody.GetAngle();
        _loc2_ = -10 / _loc4_ - _loc1_;
        _loc3_ = 10 / _loc4_ - _loc1_;
        this.neckJoint.SetLimits(_loc2_, _loc3_);
        var _loc5_ = new b2RevoluteJointDef();
        var _loc6_ = new b2Vec2();
        var _loc7_: MovieClip = this.shapeGuide["crateAnchor"];
        _loc6_.Set(
            this._startX + _loc7_.x / this.character_scale,
            this._startY + _loc7_.y / this.character_scale,
        );
        _loc5_.enableLimit = true;
        _loc5_.lowerAngle = 0;
        _loc5_.upperAngle = 0;
        _loc5_.Initialize(this.mom.frameBody, this.basketBody, _loc6_);
        this.connectingJoint = this._session.m_world.CreateJoint(
            _loc5_,
        ) as b2RevoluteJoint;
        _loc5_.enableLimit = false;
        _loc6_.SetV(
            this.lowerArm1Body.GetWorldPoint(
                new b2Vec2(
                    0,
                    (this.lowerArm1Shape as b2PolygonShape).GetVertices()[2].y,
                ),
            ),
        );
        _loc5_.Initialize(this.basketBody, this.lowerArm1Body, _loc6_);
        this.basketHand1 = this._session.m_world.CreateJoint(
            _loc5_,
        ) as b2RevoluteJoint;
        _loc6_.SetV(
            this.lowerArm2Body.GetWorldPoint(
                new b2Vec2(
                    0,
                    (this.lowerArm2Shape as b2PolygonShape).GetVertices()[2].y,
                ),
            ),
        );
        _loc5_.Initialize(this.basketBody, this.lowerArm2Body, _loc6_);
        this.basketHand2 = this._session.m_world.CreateJoint(
            _loc5_,
        ) as b2RevoluteJoint;
        var _loc8_ = new b2PrismaticJointDef();
        _loc6_.SetV(this.pelvisBody.GetWorldCenter());
        _loc8_.enableLimit = true;
        _loc8_.upperTranslation = 0.25;
        _loc8_.lowerTranslation = 0;
        var _loc9_: number = 25 / _loc4_;
        _loc8_.Initialize(
            this.basketBody,
            this.pelvisBody,
            _loc6_,
            new b2Vec2(Math.sin(_loc9_), -Math.cos(_loc9_)),
        );
        this.basketPelvis = this._session.m_world.CreateJoint(
            _loc8_,
        ) as b2PrismaticJoint;
    }

    protected contactBasketResultHandler(param1: ContactEvent) {
        var _loc2_: number = param1.impulse;
        if (_loc2_ > this.contactImpulseDict.get(this.basketShape1)) {
            if (this.contactResultBuffer.get(this.basketShape1)) {
                if (
                    _loc2_ >
                    this.contactResultBuffer.get(this.basketShape1).impulse
                ) {
                    this.contactResultBuffer.set(this.basketShape1, param1);
                }
            } else {
                this.contactResultBuffer.set(this.basketShape1, param1);
            }
        }
    }

    protected override handleContactResults() {
        var _loc1_: ContactEvent = null;
        super.handleContactResults();
        if (this.contactResultBuffer.get(this.basketShape1)) {
            _loc1_ = this.contactResultBuffer.get(this.basketShape1);
            this.basketSmash(_loc1_.impulse, _loc1_.normal);
            this.contactResultBuffer.delete(this.basketShape1);
            this.contactAddBuffer.delete(this.basketShape1);
            this.contactAddBuffer.delete(this.basketShape2);
            this.contactAddBuffer.delete(this.basketShape3);
            if (this.basketShape4) {
                this.contactAddBuffer.delete(this.basketShape4);
                this.contactAddBuffer.delete(this.basketShape5);
                this.contactAddBuffer.delete(this.basketShape6);
            }
        }
    }

    public override checkJoints() {
        super.checkJoints();
        if (!this.detached) {
            this.checkRevJoint(
                this.connectingJoint,
                this.detachLimit,
                this.detachBasket,
            );
        }
    }

    public detachBasket(param1: number) {
        var _loc8_: MovieClip = null;
        trace("detach basket " + param1);
        if (this.detached) {
            return;
        }
        this.connectingJoint.broken = true;
        this.detached = true;
        this._session.m_world.DestroyJoint(this.connectingJoint);
        this.basketBody.DestroyShape(this.basketShape1);
        this.basketBody.DestroyShape(this.basketShape2);
        this.basketBody.DestroyShape(this.basketShape3);
        var _loc2_: ContactListener = this._session.contactListener;
        _loc2_.deleteListener(ContactListener.RESULT, this.basketShape1);
        _loc2_.deleteListener(ContactListener.RESULT, this.basketShape2);
        _loc2_.deleteListener(ContactListener.RESULT, this.basketShape3);
        _loc2_.deleteListener(ContactListener.ADD, this.basketShape1);
        _loc2_.deleteListener(ContactListener.ADD, this.basketShape2);
        _loc2_.deleteListener(ContactListener.ADD, this.basketShape3);
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
        }
        var _loc3_ = new b2PolygonDef();
        _loc3_.density = 1;
        _loc3_.friction = 0.3;
        _loc3_.restitution = 0.1;
        _loc3_.filter = this.zeroFilter;
        _loc3_.vertexCount = 4;
        var _loc4_: number = 0;
        while (_loc4_ < 4) {
            _loc8_ = this.shapeGuide["crate2Right" + [_loc4_ + 1]];
            _loc3_.vertices[_loc4_] = new b2Vec2(
                this._startX + _loc8_.x / this.character_scale,
                this._startY + _loc8_.y / this.character_scale,
            );
            _loc4_++;
        }
        this.basketShape4 = this.basketBody.CreateShape(_loc3_);
        _loc2_.registerListener(
            ContactListener.RESULT,
            this.basketShape4,
            this.contactBasketResultHandler,
        );
        _loc2_.registerListener(
            ContactListener.ADD,
            this.basketShape4,
            this.contactAddHandler,
        );
        _loc4_ = 0;
        while (_loc4_ < 4) {
            _loc8_ = this.shapeGuide["crate2Bottom" + [_loc4_ + 1]];
            _loc3_.vertices[_loc4_] = new b2Vec2(
                this._startX + _loc8_.x / this.character_scale,
                this._startY + _loc8_.y / this.character_scale,
            );
            _loc4_++;
        }
        this.basketShape5 = this.basketBody.CreateShape(_loc3_);
        _loc2_.registerListener(
            ContactListener.RESULT,
            this.basketShape5,
            this.contactBasketResultHandler,
        );
        _loc2_.registerListener(
            ContactListener.ADD,
            this.basketShape5,
            this.contactAddHandler,
        );
        _loc4_ = 0;
        while (_loc4_ < 4) {
            _loc8_ = this.shapeGuide["crate2Left" + [_loc4_ + 1]];
            _loc3_.vertices[_loc4_] = new b2Vec2(
                this._startX + _loc8_.x / this.character_scale,
                this._startY + _loc8_.y / this.character_scale,
            );
            _loc4_++;
        }
        this.basketShape6 = this.basketBody.CreateShape(_loc3_);
        _loc2_.registerListener(
            ContactListener.RESULT,
            this.basketShape6,
            this.contactBasketResultHandler,
        );
        _loc2_.registerListener(
            ContactListener.ADD,
            this.basketShape6,
            this.contactAddHandler,
        );
        this.contactAddSounds.set(this.basketShape4, "BasketHit");
        this.contactAddSounds.set(this.basketShape5, "BasketHit");
        this.contactAddSounds.set(this.basketShape6, "BasketHit");
        this.basketBody.SetMassFromShapes();
        var _loc5_: b2Vec2 = this.basketBody.GetLocalCenter();
        _loc5_ = new b2Vec2(
            (this._startX - _loc5_.x) * this.character_scale,
            (this._startY - _loc5_.y) * this.character_scale,
        );
        var _loc6_: MovieClip = this.shapeGuide["crateLeft1"];
        var _loc7_ = new b2Vec2(_loc6_.x + _loc5_.x, _loc6_.y + _loc5_.y);
        // @ts-expect-error
        this.basketMC.inner.x = _loc7_.x;
        // @ts-expect-error
        this.basketMC.inner.y = _loc7_.y;
        // @ts-expect-error
        this.basketMC.inner.frame.visible = false;
    }

    public override eject() {
        if (this.ejected) {
            return;
        }
        this.ejected = true;
        this.resetJointLimits();
        var _loc1_: b2World = this.session.m_world;
        if (this.basketPelvis) {
            _loc1_.DestroyJoint(this.basketPelvis);
            this.basketPelvis = null;
        }
        if (this.basketHand1) {
            _loc1_.DestroyJoint(this.basketHand1);
            this.basketHand1 = null;
        }
        if (this.basketHand2) {
            _loc1_.DestroyJoint(this.basketHand2);
            this.basketHand2 = null;
        }
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
        var _loc2_: number = this.basketBody.GetAngle() - Math.PI / 2;
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
    }

    public refilterShit(param1: b2Shape) {
        if (param1.m_filter.maskBits == this.defaultFilter.maskBits) {
            param1.m_filter = this.extraFilter;
            this._session.m_world.Refilter(param1);
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

    public basketSmash(param1: number, param2: b2Vec2) {
        trace("basket impulse " + param1);
        this.contactImpulseDict.delete(this.basketShape1);
        var _loc3_: ContactListener = this._session.contactListener;
        _loc3_.deleteListener(ContactListener.RESULT, this.basketShape1);
        _loc3_.deleteListener(ContactListener.RESULT, this.basketShape2);
        _loc3_.deleteListener(ContactListener.RESULT, this.basketShape3);
        _loc3_.deleteListener(ContactListener.ADD, this.basketShape1);
        _loc3_.deleteListener(ContactListener.ADD, this.basketShape2);
        _loc3_.deleteListener(ContactListener.ADD, this.basketShape3);
        if (this.basketShape4) {
            _loc3_.deleteListener(ContactListener.RESULT, this.basketShape4);
            _loc3_.deleteListener(ContactListener.RESULT, this.basketShape5);
            _loc3_.deleteListener(ContactListener.RESULT, this.basketShape6);
            _loc3_.deleteListener(ContactListener.ADD, this.basketShape4);
            _loc3_.deleteListener(ContactListener.ADD, this.basketShape5);
            _loc3_.deleteListener(ContactListener.ADD, this.basketShape6);
        }
        this.eject();
        this.detached = true;
        this.basketMC.visible = false;
        this._session.m_world.DestroyJoint(this.connectingJoint);
        this._session.m_world.DestroyBody(this.basketBody);
        var _loc4_: b2Vec2 = this.basketBody.GetWorldCenter();
        this._session.particleController.createPointBurst(
            "basketPieces",
            _loc4_.x * this.m_physScale,
            _loc4_.y * this.m_physScale,
            5,
            20,
            30,
        );
        SoundController.instance.playAreaSoundInstance(
            "BasketSmash",
            this.basketBody,
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

    public override elbowBreak1(param1: number) {
        super.elbowBreak1(param1);
        if (this.ejected) {
            return;
        }
        if (this.basketHand1) {
            this._session.m_world.DestroyJoint(this.basketHand1);
            this.basketHand1 = null;
        }
        if (!this.basketHand2) {
            this.eject();
        }
    }

    public override elbowBreak2(param1: number) {
        super.elbowBreak2(param1);
        if (this.ejected) {
            return;
        }
        if (this.basketHand2) {
            this._session.m_world.DestroyJoint(this.basketHand2);
            this.basketHand2 = null;
        }
        if (!this.basketHand1) {
            this.eject();
        }
    }

    public override shoulderBreak1(param1: number, param2: boolean = true) {
        super.shoulderBreak1(param1, param2);
        if (this.ejected) {
            return;
        }
        if (this.basketHand1) {
            this._session.m_world.DestroyJoint(this.basketHand1);
            this.basketHand1 = null;
        }
        if (!this.basketHand2) {
            this.eject();
        }
    }

    public override shoulderBreak2(param1: number, param2: boolean = true) {
        super.shoulderBreak2(param1, param2);
        if (this.ejected) {
            return;
        }
        if (this.basketHand2) {
            this._session.m_world.DestroyJoint(this.basketHand2);
            this.basketHand2 = null;
        }
        if (!this.basketHand1) {
            this.eject();
        }
    }
}