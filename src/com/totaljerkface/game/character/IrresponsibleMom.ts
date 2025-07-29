import b2PolygonDef from "@/Box2D/Collision/Shapes/b2PolygonDef";
import b2Shape from "@/Box2D/Collision/Shapes/b2Shape";
import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import b2Body from "@/Box2D/Dynamics/b2Body";
import b2BodyDef from "@/Box2D/Dynamics/b2BodyDef";
import KeyDisplay from "@/com/totaljerkface/game/KeyDisplay";
import Session from "@/com/totaljerkface/game/Session";
import SessionCharacterMenu from "@/com/totaljerkface/game/SessionCharacterMenu";
import BicycleGuy from "@/com/totaljerkface/game/character/BicycleGuy";
import CharacterB2D from "@/com/totaljerkface/game/character/CharacterB2D";
import IMDaughter from "@/com/totaljerkface/game/character/IMDaughter";
import IMSon from "@/com/totaljerkface/game/character/IMSon";
import ContactEvent from "@/com/totaljerkface/game/events/ContactEvent";
import { boundClass } from 'autobind-decorator';
import DisplayObject from "flash/display/DisplayObject";
import MovieClip from "flash/display/MovieClip";
import Event from "flash/events/Event";

@boundClass
export default class IrresponsibleMom extends BicycleGuy {
    public daughter: IMDaughter;
    public son: IMSon;
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
        param6: string = "Char4",
    ) {
        super(param1, param2, param3, param4, param5, param6);
        this.shapeRefScale = 50;
        this.frameSmashLimit = 100;
        this.daughter = new IMDaughter(
            param1,
            param2,
            param3["daughter"],
            param4,
            -2,
            "Kid2",
            this,
        );
        this.son = new IMSon(
            param1,
            param2,
            param3["son"],
            param4,
            -3,
            "Kid1",
            this,
        );
    }

    public override set session(param1: Session) {
        this._session = param1;
        if (this.daughter) {
            this.daughter.session = this._session;
        }
        if (this.son) {
            this.son.session = this._session;
        }
    }

    public override checkKeyStates() {
        super.checkKeyStates();
        if (!this.daughter.dead) {
            if (this.daughter.userVehicle) {
                this.daughter.userVehicle.operateKeys(
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
                        this.daughter.leftAndRightActions();
                    } else {
                        this.daughter.leftPressedActions();
                    }
                } else if (this.rightPressed) {
                    this.daughter.rightPressedActions();
                } else {
                    this.daughter.leftAndRightActions();
                }
                if (this.upPressed) {
                    if (this.downPressed) {
                        this.daughter.upAndDownActions();
                    } else {
                        this.daughter.upPressedActions();
                    }
                } else if (this.downPressed) {
                    this.daughter.downPressedActions();
                } else {
                    this.daughter.upAndDownActions();
                }
                if (this.spacePressed) {
                    this.daughter.spacePressedActions();
                } else {
                    this.daughter.spaceNullActions();
                }
                if (this.shiftPressed) {
                    this.daughter.shiftPressedActions();
                } else {
                    this.daughter.shiftNullActions();
                }
                if (this.ctrlPressed) {
                    this.daughter.ctrlPressedActions();
                } else {
                    this.daughter.ctrlNullActions();
                }
                if (this.zPressed) {
                    this.daughter.zPressedActions();
                } else {
                    this.daughter.zNullActions();
                }
            }
        }
        if (!this.son.dead) {
            if (this.son.userVehicle) {
                this.son.userVehicle.operateKeys(
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
                        this.son.leftAndRightActions();
                    } else {
                        this.son.leftPressedActions();
                    }
                } else if (this.rightPressed) {
                    this.son.rightPressedActions();
                } else {
                    this.son.leftAndRightActions();
                }
                if (this.upPressed) {
                    if (this.downPressed) {
                        this.son.upAndDownActions();
                    } else {
                        this.son.upPressedActions();
                    }
                } else if (this.downPressed) {
                    this.son.downPressedActions();
                } else {
                    this.son.upAndDownActions();
                }
                if (this.spacePressed) {
                    this.son.spacePressedActions();
                } else {
                    this.son.spaceNullActions();
                }
                if (this.shiftPressed) {
                    this.son.shiftPressedActions();
                } else {
                    this.son.shiftNullActions();
                }
                if (this.ctrlPressed) {
                    this.son.ctrlPressedActions();
                } else {
                    this.son.ctrlNullActions();
                }
                if (this.zPressed) {
                    this.son.zPressedActions();
                } else {
                    this.son.zNullActions();
                }
            }
        }
    }

    public override checkReplayData(param1: KeyDisplay, param2: string) {
        super.checkReplayData(param1, param2);
        if (!this.daughter.dead) {
            if (this.daughter.userVehicle) {
                this.daughter.userVehicle.operateReplayData(
                    this._session.iteration,
                    param2,
                );
            } else {
                if (param2.charAt(0) == "1") {
                    if (param2.charAt(1) == "1") {
                        this.daughter.leftAndRightActions();
                    } else {
                        this.daughter.leftPressedActions();
                    }
                } else if (param2.charAt(1) == "1") {
                    this.daughter.rightPressedActions();
                } else {
                    this.daughter.leftAndRightActions();
                }
                if (param2.charAt(2) == "1") {
                    if (param2.charAt(3) == "1") {
                        this.daughter.upAndDownActions();
                    } else {
                        this.daughter.upPressedActions();
                    }
                } else if (param2.charAt(3) == "1") {
                    this.daughter.downPressedActions();
                } else {
                    this.daughter.upAndDownActions();
                }
                if (param2.charAt(4) == "1") {
                    this.daughter.spacePressedActions();
                } else {
                    this.daughter.spaceNullActions();
                }
                if (param2.charAt(5) == "1") {
                    this.daughter.shiftPressedActions();
                } else {
                    this.daughter.shiftNullActions();
                }
                if (param2.charAt(6) == "1") {
                    this.daughter.ctrlPressedActions();
                } else {
                    this.daughter.ctrlNullActions();
                }
                if (param2.charAt(7) == "1") {
                    this.daughter.zPressedActions();
                } else {
                    this.daughter.zNullActions();
                }
            }
        }
        if (!this.son.dead) {
            if (this.son.userVehicle) {
                this.son.userVehicle.operateReplayData(
                    this._session.iteration,
                    param2,
                );
            } else {
                if (param2.charAt(0) == "1") {
                    if (param2.charAt(1) == "1") {
                        this.son.leftAndRightActions();
                    } else {
                        this.son.leftPressedActions();
                    }
                } else if (param2.charAt(1) == "1") {
                    this.son.rightPressedActions();
                } else {
                    this.son.leftAndRightActions();
                }
                if (param2.charAt(2) == "1") {
                    if (param2.charAt(3) == "1") {
                        this.son.upAndDownActions();
                    } else {
                        this.son.upPressedActions();
                    }
                } else if (param2.charAt(3) == "1") {
                    this.son.downPressedActions();
                } else {
                    this.son.upAndDownActions();
                }
                if (param2.charAt(4) == "1") {
                    this.son.spacePressedActions();
                } else {
                    this.son.spaceNullActions();
                }
                if (param2.charAt(5) == "1") {
                    this.son.shiftPressedActions();
                } else {
                    this.son.shiftNullActions();
                }
                if (param2.charAt(6) == "1") {
                    this.son.ctrlPressedActions();
                } else {
                    this.son.ctrlNullActions();
                }
                if (param2.charAt(7) == "1") {
                    this.son.zPressedActions();
                } else {
                    this.son.zNullActions();
                }
            }
        }
    }

    protected override switchCamera() {
        if (this._session.camera.focus == this.cameraFocus) {
            this._session.camera.focus = this.daughter.cameraFocus;
        } else if (this._session.camera.focus == this.daughter.cameraFocus) {
            this._session.camera.focus = this.son.cameraFocus;
        } else {
            this._session.camera.focus = this.cameraFocus;
        }
    }

    public override actions() {
        super.actions();
        this.daughter.actions();
        this.son.actions();
    }

    public override create() {
        this.createFilters();
        this.createBodies();
        this.createJoints();
        this.createMovieClips();
        this.setLimits();
        this.createDictionaries();
        this.daughter.create();
        this.son.create();
        if (this._session instanceof SessionCharacterMenu) {
            this.daughter.wheelJoint.SetMotorSpeed(0);
            this.daughter.wheelJoint.EnableMotor(true);
        }
        this.dispatchEvent(new Event(Event.COMPLETE));
    }

    public override reset() {
        super.reset();
        this.helmetOn = true;
        this.daughter.reset();
        this.son.reset();
    }

    public override die() {
        super.die();
        this.helmetBody = null;
        this.daughter.die();
        this.son.die();
    }

    public override paint() {
        super.paint();
        this.daughter.paint();
        this.son.paint();
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
        this.daughter.handleContactBuffer();
        this.son.handleContactBuffer();
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
        this.daughter.checkJoints();
        this.son.checkJoints();
    }

    public override frameSmash(param1: number, param2: b2Vec2) {
        super.frameSmash(param1, param2);
        this.daughter.detachFrame(0);
        this.son.detachBasket(0);
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

    public override hipBreak1(param1: number, param2: boolean = true) {
        super.hipBreak1(param1, param2);
        if (this.ejected) {
            return;
        }
        if (this.gearFoot1) {
            this._session.m_world.DestroyJoint(this.gearFoot1);
            this.gearFoot1 = null;
        }
        this.checkEject();
    }

    public override hipBreak2(param1: number, param2: boolean = true) {
        super.hipBreak2(param1, param2);
        if (this.ejected) {
            return;
        }
        if (this.gearFoot2) {
            this._session.m_world.DestroyJoint(this.gearFoot2);
            this.gearFoot2 = null;
        }
        this.checkEject();
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