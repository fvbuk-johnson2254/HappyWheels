import b2CircleDef from "@/Box2D/Collision/Shapes/b2CircleDef";
import b2PolygonDef from "@/Box2D/Collision/Shapes/b2PolygonDef";
import b2Shape from "@/Box2D/Collision/Shapes/b2Shape";
import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import b2Body from "@/Box2D/Dynamics/b2Body";
import b2BodyDef from "@/Box2D/Dynamics/b2BodyDef";
import ContactListener from "@/com/totaljerkface/game/ContactListener";
import Session from "@/com/totaljerkface/game/Session";
import Settings from "@/com/totaljerkface/game/Settings";
import CharacterB2D from "@/com/totaljerkface/game/character/CharacterB2D";
import ContactEvent from "@/com/totaljerkface/game/events/ContactEvent";
import { boundClass } from 'autobind-decorator';
import DisplayObject from "flash/display/DisplayObject";
import MovieClip from "flash/display/MovieClip";
import Sprite from "flash/display/Sprite";

@boundClass
export default class PlayableCharacterB2D extends CharacterB2D {
    private tags: any[];
    private polyChestedChars: any[] = [4, 6, 8, 11];
    private helmetedChars: any[] = [2, 3, 8, 9, 10, 11];
    private newScaleChars: any[] = [8, 9, 10, 11];
    private helmeted: boolean = false;
    public helmetSmashLimit: number = 2;
    protected helmetShape: b2Shape;
    protected helmetBody: b2Body;
    protected helmetMC: MovieClip;

    constructor(
        param1: number,
        param2: number,
        param3: DisplayObject,
        param4: Session,
        param5: number = -1,
        param6: string = "Char1",
    ) {
        super(param1, param2, param3, param4, param5, param6);
        this.tag = this.tags[Settings.characterIndex - 1];
        if (this.helmetedChars.indexOf(Settings.characterIndex) > -1) {
            this.helmeted = true;
        }
        if (this.newScaleChars.indexOf(Settings.characterIndex) > -1) {
            this.shapeRefScale = 50;
        }
    }

    public override leftPressedActions() {
        this.currentPose = 1;
    }

    public override rightPressedActions() {
        this.currentPose = 2;
    }

    public override leftAndRightActions() {
        if (this._currentPose == 1 || this._currentPose == 2) {
            this.currentPose = 0;
        }
    }

    public override upPressedActions() {
        this.currentPose = 3;
    }

    public override downPressedActions() {
        this.currentPose = 4;
    }

    public override upAndDownActions() {
        if (this._currentPose == 3 || this._currentPose == 4) {
            this.currentPose = 0;
        }
    }

    public override spacePressedActions() {
        this.startGrab();
    }

    public override spaceNullActions() {
        this.releaseGrip();
    }

    public override createDictionaries() {
        super.createDictionaries();
        if (this.helmeted) {
            this.helmetShape = this.head1Shape;
            this.contactImpulseDict.set(
                this.helmetShape,
                this.helmetSmashLimit,
            );
        }
    }

    public override createBodies() {
        var _loc7_: MovieClip = null;
        super.createBodies();
        if (this.polyChestedChars.indexOf(Settings.characterIndex) == -1) {
            return;
        }
        var _loc1_ = new b2PolygonDef();
        var _loc2_ = new b2CircleDef();
        var _loc3_ = new b2BodyDef();
        var _loc4_ = new b2BodyDef();
        _loc1_.density = 1;
        _loc1_.friction = 0.3;
        _loc1_.restitution = 0.1;
        _loc1_.filter = this.defaultFilter;
        this.paintVector.splice(this.paintVector.indexOf(this.chestBody), 1);
        this.paintVector.splice(this.paintVector.indexOf(this.pelvisBody), 1);
        this._session.m_world.DestroyBody(this.chestBody);
        this._session.m_world.DestroyBody(this.pelvisBody);
        var _loc5_: MovieClip = this.shapeGuide["chestShape"];
        _loc3_.position.Set(
            this._startX + _loc5_.x / this.character_scale,
            this._startY + _loc5_.y / this.character_scale,
        );
        _loc3_.angle = _loc5_.rotation / (180 / Math.PI);
        this.chestBody = this._session.m_world.CreateBody(_loc3_);
        _loc1_.vertexCount = 6;
        var _loc6_: number = 0;
        while (_loc6_ < 6) {
            _loc7_ = this.shapeGuide["chestVert" + [_loc6_]];
            _loc1_.vertices[_loc6_] = new b2Vec2(
                _loc7_.x / this.character_scale,
                _loc7_.y / this.character_scale,
            );
            _loc6_++;
        }
        this.chestShape = this.chestBody.CreateShape(_loc1_);
        this.chestShape.SetMaterial(2);
        this.chestShape.SetUserData(this);
        this._session.contactListener.registerListener(
            ContactListener.RESULT,
            this.chestShape,
            this.contactResultHandler,
        );
        this._session.contactListener.registerListener(
            ContactListener.ADD,
            this.chestShape,
            this.contactAddHandler,
        );
        this.chestBody.SetMassFromShapes();
        this.chestBody.AllowSleeping(false);
        this.paintVector.push(this.chestBody);
        this.cameraFocus = this.chestBody;
        _loc5_ = this.shapeGuide["pelvisShape"];
        _loc4_.position.Set(
            this._startX + _loc5_.x / this.character_scale,
            this._startY + _loc5_.y / this.character_scale,
        );
        _loc4_.angle = _loc5_.rotation / (180 / Math.PI);
        this.pelvisBody = this._session.m_world.CreateBody(_loc4_);
        _loc1_.vertexCount = 5;
        _loc6_ = 0;
        while (_loc6_ < 5) {
            _loc7_ = this.shapeGuide["pelvisVert" + [_loc6_]];
            _loc1_.vertices[_loc6_] = new b2Vec2(
                _loc7_.x / this.character_scale,
                _loc7_.y / this.character_scale,
            );
            _loc6_++;
        }
        this.pelvisShape = this.pelvisBody.CreateShape(_loc1_);
        this.pelvisShape.SetMaterial(2);
        this.pelvisShape.SetUserData(this);
        this._session.contactListener.registerListener(
            ContactListener.RESULT,
            this.pelvisShape,
            this.contactResultHandler,
        );
        this._session.contactListener.registerListener(
            ContactListener.ADD,
            this.pelvisShape,
            this.contactAddHandler,
        );
        this.pelvisBody.SetMassFromShapes();
        this.pelvisBody.AllowSleeping(false);
        this.paintVector.push(this.pelvisBody);
    }

    protected override handleContactResults() {
        var _loc1_: ContactEvent = null;
        if (this.contactResultBuffer.get(this.helmetShape)) {
            _loc1_ = this.contactResultBuffer.get(this.helmetShape);
            this.helmetSmash(_loc1_.impulse);
            this.contactResultBuffer.delete(this.head1Shape);
            this.contactAddBuffer.delete(this.head1Shape);
        }
        super.handleContactResults();
    }

    public override createMovieClips() {
        var _loc2_: number = 0;
        super.createMovieClips();
        if (this.helmeted) {
            this.helmetMC = this.sourceObject["helmet"];
            var _loc3_ = 1 / this.mc_scale;
            this.helmetMC.scaleY = 1 / this.mc_scale;
            this.helmetMC.scaleX = _loc3_;
            this.helmetMC.visible = false;
            this._session.containerSprite.addChildAt(
                this.helmetMC,
                this._session.containerSprite.getChildIndex(this.chestMC),
            );
        }
        var _loc1_: Sprite = this._session.containerSprite;
        if (Settings.characterIndex == 8) {
            _loc2_ = _loc1_.getChildIndex(this.chestMC);
            _loc1_.setChildIndex(this.lowerLeg1MC, --_loc2_);
            _loc1_.setChildIndex(this.upperLeg1MC, --_loc2_);
            _loc1_.setChildIndex(this.pelvisMC, --_loc2_);
        } else if (
            Settings.characterIndex == 4 ||
            Settings.characterIndex == 6 ||
            Settings.characterIndex == 11
        ) {
            _loc2_ = _loc1_.getChildIndex(this.pelvisMC);
            _loc1_.setChildIndex(this.chestMC, ++_loc2_);
            _loc2_ = _loc1_.getChildIndex(this.lowerLeg1MC);
            _loc1_.setChildIndex(this.upperArm1MC, ++_loc2_);
            _loc1_.setChildIndex(this.lowerArm1MC, ++_loc2_);
        } else if (Settings.characterIndex == 7) {
            _loc2_ = _loc1_.getChildIndex(this.upperLeg1MC);
            _loc1_.setChildIndex(this.chestMC, ++_loc2_);
            _loc2_ = _loc1_.getChildIndex(this.lowerLeg1MC);
            _loc1_.setChildIndex(this.upperArm1MC, ++_loc2_);
            _loc1_.setChildIndex(this.lowerArm1MC, ++_loc2_);
        }
    }

    public helmetSmash(param1: number) {
        var _loc6_: MovieClip = null;
        trace("helmet impulse " + param1 + " -> " + this._session.iteration);
        this.contactImpulseDict.delete(this.helmetShape);
        this.head1Shape = this.helmetShape;
        this.contactImpulseDict.set(this.head1Shape, this.headSmashLimit);
        this.helmetShape = null;
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

    public override resetMovieClips() {
        super.resetMovieClips();
        if (this.helmeted) {
            this.helmetMC.visible = false;
            // @ts-expect-error
            this.head1MC.helmet.visible = true;
        }
    }

    public override explodeShape(param1: b2Shape, param2: number) {
        if (param1 == this.helmetShape) {
            if (param2 > 0.85) {
                this.helmetSmash(0);
            }
            return;
        }
        super.explodeShape(param1, param2);
    }
}