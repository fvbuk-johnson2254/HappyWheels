import b2PolygonDef from "@/Box2D/Collision/Shapes/b2PolygonDef";
import b2Shape from "@/Box2D/Collision/Shapes/b2Shape";
import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import b2Body from "@/Box2D/Dynamics/b2Body";
import b2BodyDef from "@/Box2D/Dynamics/b2BodyDef";
import KeyDisplay from "@/com/totaljerkface/game/KeyDisplay";
import Session from "@/com/totaljerkface/game/Session";
import BicycleGuy from "@/com/totaljerkface/game/character/BicycleGuy";
import CharacterB2D from "@/com/totaljerkface/game/character/CharacterB2D";
import ChildSeatKid from "@/com/totaljerkface/game/character/ChildSeatKid";
import ContactEvent from "@/com/totaljerkface/game/events/ContactEvent";
import { boundClass } from 'autobind-decorator';
import DisplayObject from "flash/display/DisplayObject";
import MovieClip from "flash/display/MovieClip";
import Event from "flash/events/Event";

@boundClass
export default class IrresponsibleDad extends BicycleGuy {
    public kid: ChildSeatKid;
    public helmetOn: boolean;
    public helmetSmashLimit: number = 2;
    public helmetBody: b2Body;
    public helmetShape: b2Shape;
    public helmetMC: MovieClip;

    constructor(
        param1: number,
        param2: number,
        param3: DisplayObject,
        param4: Session,
        param5: number = -1,
        param6: string = "Char3",
    ) {
        super(param1, param2, param3, param4, param5, param6);
        this.kid = new ChildSeatKid(
            param1,
            param2,
            param3["kid"],
            param4,
            -2,
            "Kid1",
            this,
        );
    }

    public override set session(param1: Session) {
        this._session = param1;
        if (this.kid) {
            this.kid.session = this._session;
        }
    }

    public override checkKeyStates() {
        super.checkKeyStates();
        if (!this.kid.dead) {
            if (this.kid.userVehicle) {
                this.kid.userVehicle.operateKeys(
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
                        this.kid.leftAndRightActions();
                    } else {
                        this.kid.leftPressedActions();
                    }
                } else if (this.rightPressed) {
                    this.kid.rightPressedActions();
                } else {
                    this.kid.leftAndRightActions();
                }
                if (this.upPressed) {
                    if (this.downPressed) {
                        this.kid.upAndDownActions();
                    } else {
                        this.kid.upPressedActions();
                    }
                } else if (this.downPressed) {
                    this.kid.downPressedActions();
                } else {
                    this.kid.upAndDownActions();
                }
                if (this.spacePressed) {
                    this.kid.spacePressedActions();
                } else {
                    this.kid.spaceNullActions();
                }
                if (this.shiftPressed) {
                    this.kid.shiftPressedActions();
                } else {
                    this.kid.shiftNullActions();
                }
                if (this.ctrlPressed) {
                    this.kid.ctrlPressedActions();
                } else {
                    this.kid.ctrlNullActions();
                }
                if (this.zPressed) {
                    this.kid.zPressedActions();
                } else {
                    this.kid.zNullActions();
                }
            }
        }
    }

    public override checkReplayData(param1: KeyDisplay, param2: string) {
        super.checkReplayData(param1, param2);
        if (!this.kid.dead) {
            if (this.kid.userVehicle) {
                this.kid.userVehicle.operateReplayData(
                    this._session.iteration,
                    param2,
                );
            } else {
                if (param2.charAt(0) == "1") {
                    if (param2.charAt(1) == "1") {
                        this.kid.leftAndRightActions();
                    } else {
                        this.kid.leftPressedActions();
                    }
                } else if (param2.charAt(1) == "1") {
                    this.kid.rightPressedActions();
                } else {
                    this.kid.leftAndRightActions();
                }
                if (param2.charAt(2) == "1") {
                    if (param2.charAt(3) == "1") {
                        this.kid.upAndDownActions();
                    } else {
                        this.kid.upPressedActions();
                    }
                } else if (param2.charAt(3) == "1") {
                    this.kid.downPressedActions();
                } else {
                    this.kid.upAndDownActions();
                }
                if (param2.charAt(4) == "1") {
                    this.kid.spacePressedActions();
                } else {
                    this.kid.spaceNullActions();
                }
                if (param2.charAt(5) == "1") {
                    this.kid.shiftPressedActions();
                } else {
                    this.kid.shiftNullActions();
                }
                if (param2.charAt(6) == "1") {
                    this.kid.ctrlPressedActions();
                } else {
                    this.kid.ctrlNullActions();
                }
                if (param2.charAt(7) == "1") {
                    this.kid.zPressedActions();
                } else {
                    this.kid.zNullActions();
                }
            }
        }
    }

    protected override switchCamera() {
        if (this._session.camera.focus == this.cameraFocus) {
            this._session.camera.focus = this.kid.cameraFocus;
        } else {
            this._session.camera.focus = this.cameraFocus;
        }
    }

    public override shiftPressedActions() {
        this.eject();
    }

    public override actions() {
        super.actions();
        this.kid.actions();
    }

    public override create() {
        this.createFilters();
        this.createBodies();
        this.createJoints();
        this.createMovieClips();
        this.setLimits();
        this.createDictionaries();
        this.kid.create();
        this.dispatchEvent(new Event(Event.COMPLETE));
    }

    public override reset() {
        super.reset();
        this.helmetOn = true;
        this.kid.reset();
    }

    public override die() {
        super.die();
        this.helmetBody = null;
        this.kid.die();
    }

    public override paint() {
        super.paint();
        this.kid.paint();
    }

    public override createMovieClips() {
        super.createMovieClips();
        this.helmetMC = this.sourceObject["helmet"];
        var _loc1_ = 1 / this.mc_scale;
        this.helmetMC.scaleY = 1 / this.mc_scale;
        this.helmetMC.scaleX = _loc1_;
        this.helmetMC.visible = false;
        this._session.containerSprite.addChildAt(
            this.helmetMC,
            this._session.containerSprite.getChildIndex(this.chestMC),
        );
    }

    public override resetMovieClips() {
        super.resetMovieClips();
        this.helmetMC.visible = false;
        // @ts-expect-error
        this.head1MC.helmet.visible = true;
    }

    public override createDictionaries() {
        super.createDictionaries();
        this.helmetShape = this.head1Shape;
        this.contactImpulseDict.set(this.helmetShape, this.helmetSmashLimit);
    }

    public override handleContactBuffer() {
        super.handleContactBuffer();
        this.kid.handleContactBuffer();
    }

    protected override handleContactResults() {
        var _loc1_: ContactEvent = null;
        if (this.contactResultBuffer.get(this.helmetShape)) {
            _loc1_ = this.contactResultBuffer.get(this.helmetShape);
            this.helmetSmash(_loc1_.impulse);
            this.contactResultBuffer.delete(this.head1Shape);
            this.contactAddBuffer.delete(this.head1Shape);
        }
        if (this.contactResultBuffer.get(this.head1Shape)) {
            _loc1_ = this.contactResultBuffer.get(this.head1Shape);
            this.headSmash1(_loc1_.impulse);
            this.contactResultBuffer.delete(this.head1Shape);
            this.contactAddBuffer.delete(this.head1Shape);
        }
        if (this.contactResultBuffer.get(this.chestShape)) {
            _loc1_ = this.contactResultBuffer.get(this.chestShape);
            this.chestSmash(_loc1_.impulse);
            this.contactResultBuffer.delete(this.chestShape);
            this.contactAddBuffer.delete(this.chestShape);
        }
        if (this.contactResultBuffer.get(this.pelvisShape)) {
            _loc1_ = this.contactResultBuffer.get(this.pelvisShape);
            this.pelvisSmash(_loc1_.impulse);
            this.contactResultBuffer.delete(this.pelvisShape);
            this.contactAddBuffer.delete(this.pelvisShape);
        }
        if (this.contactResultBuffer.get(this.lowerLeg1Shape)) {
            _loc1_ = this.contactResultBuffer.get(this.lowerLeg1Shape);
            this.footSmash1(_loc1_.impulse);
            this.contactResultBuffer.delete(this.lowerLeg1Shape);
            this.contactAddBuffer.delete(this.lowerLeg1Shape);
        }
        if (this.contactResultBuffer.get(this.lowerLeg2Shape)) {
            _loc1_ = this.contactResultBuffer.get(this.lowerLeg2Shape);
            this.footSmash2(_loc1_.impulse);
            this.contactResultBuffer.delete(this.lowerLeg2Shape);
            this.contactAddBuffer.delete(this.lowerLeg2Shape);
        }
        if (this.contactResultBuffer.get(this.frameShape1)) {
            _loc1_ = this.contactResultBuffer.get(this.frameShape1);
            this.frameSmash(_loc1_.impulse, _loc1_.normal);
            this.contactResultBuffer.delete(this.frameShape1);
        }
        if (this.contactResultBuffer.get(this.frontWheelShape)) {
            _loc1_ = this.contactResultBuffer.get(this.frontWheelShape);
            this.frontWheelSmash(_loc1_.impulse, _loc1_.normal);
            this.contactResultBuffer.delete(this.frontWheelShape);
            this.contactAddBuffer.delete(this.frontWheelShape);
        }
        if (this.contactResultBuffer.get(this.backWheelShape)) {
            _loc1_ = this.contactResultBuffer.get(this.backWheelShape);
            this.backWheelSmash(_loc1_.impulse, _loc1_.normal);
            this.contactResultBuffer.delete(this.backWheelShape);
            this.contactAddBuffer.delete(this.backWheelShape);
        }
        if (this.contactResultBuffer.get(this.lowerArm1Shape)) {
            _loc1_ = this.contactResultBuffer.get(this.lowerArm1Shape);
            this.grabAction(
                this.lowerArm1Body,
                _loc1_.otherShape,
                _loc1_.otherShape.GetBody(),
            );
            this.contactResultBuffer.delete(this.lowerArm1Shape);
        }
        if (this.contactResultBuffer.get(this.lowerArm2Shape)) {
            _loc1_ = this.contactResultBuffer.get(this.lowerArm2Shape);
            this.grabAction(
                this.lowerArm2Body,
                _loc1_.otherShape,
                _loc1_.otherShape.GetBody(),
            );
            this.contactResultBuffer.delete(this.lowerArm2Shape);
        }
    }

    public override checkJoints() {
        super.checkJoints();
        this.kid.checkJoints();
    }

    public helmetSmash(param1: number) {
        var _loc6_: MovieClip = null;
        trace("helmet impulse " + param1 + " -> " + this._session.iteration);
        this.contactImpulseDict.delete(this.helmetShape);
        this.head1Shape = this.helmetShape;
        this.contactImpulseDict.set(this.head1Shape, this.headSmashLimit);
        this.helmetShape = null;
        this.helmetOn = false;
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

    public mourn() {
        if (!this._dead) {
            this.addVocals("Damnit", 3);
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