import b2ContactPoint from "@/Box2D/Collision/b2ContactPoint";
import b2CircleDef from "@/Box2D/Collision/Shapes/b2CircleDef";
import b2FilterData from "@/Box2D/Collision/Shapes/b2FilterData";
import b2PolygonDef from "@/Box2D/Collision/Shapes/b2PolygonDef";
import b2Shape from "@/Box2D/Collision/Shapes/b2Shape";
import b2Math from "@/Box2D/Common/Math/b2Math";
import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import b2Body from "@/Box2D/Dynamics/b2Body";
import b2BodyDef from "@/Box2D/Dynamics/b2BodyDef";
import b2World from "@/Box2D/Dynamics/b2World";
import b2Joint from "@/Box2D/Dynamics/Joints/b2Joint";
import b2JointEdge from "@/Box2D/Dynamics/Joints/b2JointEdge";
import b2RevoluteJoint from "@/Box2D/Dynamics/Joints/b2RevoluteJoint";
import b2RevoluteJointDef from "@/Box2D/Dynamics/Joints/b2RevoluteJointDef";
import CharacterB2D from "@/com/totaljerkface/game/character/CharacterB2D";
import ContactListener from "@/com/totaljerkface/game/ContactListener";
import NPCharacterRef from "@/com/totaljerkface/game/editor/specials/NPCharacterRef";
import NPCSprite from "@/com/totaljerkface/game/editor/specials/npcsprites/NPCSprite";
import Special from "@/com/totaljerkface/game/editor/specials/Special";
import ContactEvent from "@/com/totaljerkface/game/events/ContactEvent";
import LevelItem from "@/com/totaljerkface/game/level/LevelItem";
import Trigger from "@/com/totaljerkface/game/level/Trigger";
import Emitter from "@/com/totaljerkface/game/particles/Emitter";
import Session from "@/com/totaljerkface/game/Session";
import Settings from "@/com/totaljerkface/game/Settings";
import AreaSoundInstance from "@/com/totaljerkface/game/sound/AreaSoundInstance";
import SoundController from "@/com/totaljerkface/game/sound/SoundController";
import { boundClass } from 'autobind-decorator';
import DisplayObject from "flash/display/DisplayObject";
import MovieClip from "flash/display/MovieClip";
import Sprite from "flash/display/Sprite";
import Point from "flash/geom/Point";

@boundClass
export default class NPCharacter extends LevelItem {
    public static GROUP_ID_COUNT: number;
    public static GRIND_STATE: number = 1;
    private mc_scale: number = 2;
    private character_scale: number;
    private session: Session;
    private characterLayer: Sprite;
    private headBody: b2Body;
    private chestBody: b2Body;
    private pelvisBody: b2Body;
    private upperArm1Body: b2Body;
    private upperArm2Body: b2Body;
    private lowerArm1Body: b2Body;
    private lowerArm2Body: b2Body;
    private upperLeg1Body: b2Body;
    private upperLeg2Body: b2Body;
    private lowerLeg1Body: b2Body;
    private lowerLeg2Body: b2Body;
    private heartBody: b2Body;
    private headShape: b2Shape;
    private chestShape: b2Shape;
    private pelvisShape: b2Shape;
    private neckJoint: b2RevoluteJoint;
    private waistJoint: b2RevoluteJoint;
    private shoulderJoint1: b2RevoluteJoint;
    private shoulderJoint2: b2RevoluteJoint;
    private elbowJoint1: b2RevoluteJoint;
    private elbowJoint2: b2RevoluteJoint;
    private hipJoint1: b2RevoluteJoint;
    private hipJoint2: b2RevoluteJoint;
    private kneeJoint1: b2RevoluteJoint;
    private kneeJoint2: b2RevoluteJoint;
    private headMC: MovieClip;
    private chestMC: MovieClip;
    private pelvisMC: MovieClip;
    private upperLeg1MC: MovieClip;
    private upperLeg2MC: MovieClip;
    private upperArm1MC: MovieClip;
    private upperArm2MC: MovieClip;
    private lowerArm1MC: MovieClip;
    private lowerArm2MC: MovieClip;
    private lowerLeg1MC: MovieClip;
    private lowerLeg2MC: MovieClip;
    private defaultFilter: b2FilterData;
    private zeroFilter: b2FilterData;
    private lowerBodyFilter: b2FilterData;
    private headSmashLimit: number;
    private chestSmashLimit: number;
    private pelvisSmashLimit: number;
    private footSmashLimit: number;
    private neckBreakLimit: number;
    private torsoBreakLimit: number;
    private shoulderBreakLimit: number;
    private hipBreakLimit: number;
    private elbowBreakLimit: number;
    private kneeBreakLimit: number;
    private headChunkRadius: number;
    private chestChunkRadius: number;
    private pelvisChunkRadius: number;
    private brainRadius: number = 12;
    private headBloodFlow: Emitter;
    private neckBloodFlow: Emitter;
    private stomachBloodFlow: Emitter;
    private shoulder1BloodFlow: Emitter;
    private shoulder2BloodFlow: Emitter;
    private arm1BloodFlow: Emitter;
    private arm2BloodFlow: Emitter;
    private hip1BloodFlow: Emitter;
    private hip2BloodFlow: Emitter;
    private thigh1BloodFlow: Emitter;
    private thigh2BloodFlow: Emitter;
    private contactImpulseDict: Dictionary<any, any>;
    private contactResultBuffer: Dictionary<any, any>;
    private contactAddBuffer: Dictionary<any, any>;
    private contactAddSounds: Dictionary<any, any>;
    private voiceSound: AreaSoundInstance;
    private voicePriority: number = -1;
    private voiceArray: any[];
    private tag: string;
    private paintVector: Vector<b2Body>;
    private _dead: boolean;
    private reversed: boolean;
    private destroyJointsUponDeath: boolean = false;
    private charSprite: NPCSprite;
    private userJoints: any[];

    constructor(param1: Special, param2: b2Body = null, param3: Point = null) {
        super();
        var _loc4_: NPCharacterRef = null;

        _loc4_ = param1 as NPCharacterRef;
        _loc4_ = _loc4_.clone() as NPCharacterRef;
        this.destroyJointsUponDeath = _loc4_.destroyJointsUponDeath;
        this.tag = _loc4_.tag;
        this.character_scale = this.m_physScale * this.mc_scale;
        this.paintVector = new Vector<b2Body>();
        this.voiceArray = new Array();
        this.session = Settings.currentSession;
        this.characterLayer = this.session.level.characterLayer;
        this.reversed = _loc4_.reverse;
        if (!_loc4_.interactive) {
            this.charSprite = _loc4_.npcSprite;
            this.charSprite.x = _loc4_.x;
            this.charSprite.y = _loc4_.y;
            this.charSprite.rotation = _loc4_.rotation;
            this.characterLayer.addChild(this.charSprite);
        } else {
            this.createFilters();
            this.createBodies(_loc4_);
            this.createJoints(_loc4_);
            this.createMovieClips(_loc4_);
            this.setBreakLimits();
            this.createDictionaries();
            Settings.currentSession.level.paintItemVector.push(this);
            Settings.currentSession.level.actionsVector.push(this);
        }
    }

    public addUserJoint(param1: b2Joint) {
        if (!this.userJoints) {
            this.userJoints = new Array();
        }
        this.userJoints.push(param1);
    }

    public override actions() {
        this.handleContactResults();
        this.handleContactAdds();
        this.checkJoints();
        if (!this._dead) {
            this.checkVocals();
            this.voiceArray = new Array();
        }
    }

    private createFilters() {
        this.defaultFilter = new b2FilterData();
        this.defaultFilter.groupIndex = NPCharacter.GROUP_ID_COUNT;
        this.defaultFilter.categoryBits = 260;
        this.zeroFilter = new b2FilterData();
        this.zeroFilter.groupIndex = 0;
        this.zeroFilter.categoryBits = 260;
        this.lowerBodyFilter = new b2FilterData();
        this.lowerBodyFilter.categoryBits = 260;
        this.lowerBodyFilter.groupIndex = NPCharacter.GROUP_ID_COUNT - 1;
        NPCharacter.GROUP_ID_COUNT -= 2;
    }

    private createDictionaries() {
        this.contactResultBuffer = new Dictionary();
        this.contactAddBuffer = new Dictionary();
        this.contactAddSounds = new Dictionary();
        this.contactImpulseDict = new Dictionary();
        this.contactImpulseDict.set(this.headShape, this.headSmashLimit);
        this.contactImpulseDict.set(this.chestShape, this.chestSmashLimit);
        this.contactImpulseDict.set(this.pelvisShape, this.pelvisSmashLimit);
        this.contactAddSounds.set(this.headShape, "Thud1");
        this.contactAddSounds.set(this.chestShape, "Thud2");
        this.contactAddSounds.set(this.pelvisShape, "Thud2");
    }

    private setBreakLimits() {
        var _loc1_: number =
            this.headBody.GetMass() / CharacterB2D.DEF_HEAD_MASS;
        var _loc2_: number =
            this.chestBody.GetMass() / CharacterB2D.DEF_CHEST_MASS;
        var _loc3_: number =
            this.pelvisBody.GetMass() / CharacterB2D.DEF_PELVIS_MASS;
        var _loc4_: number =
            this.upperArm1Body.GetMass() / CharacterB2D.DEF_UPPERARM_MASS;
        var _loc5_: number =
            this.lowerArm1Body.GetMass() / CharacterB2D.DEF_LOWERARM_MASS;
        var _loc6_: number =
            this.upperLeg1Body.GetMass() / CharacterB2D.DEF_UPPERLEG_MASS;
        var _loc7_: number =
            this.lowerLeg1Body.GetMass() / CharacterB2D.DEF_LOWERLEG_MASS;
        this.headSmashLimit = CharacterB2D.DEF_HEAD_SMASH * _loc1_;
        this.chestSmashLimit = CharacterB2D.DEF_CHEST_SMASH * _loc2_;
        this.pelvisSmashLimit = CharacterB2D.DEF_PELVIS_SMASH * _loc3_;
        this.footSmashLimit = CharacterB2D.DEF_FOOT_SMASH * _loc7_;
        this.neckBreakLimit = Math.pow(Math.round(85 * _loc1_), 2);
        this.torsoBreakLimit = Math.pow(Math.round(180 * _loc3_), 2);
        this.shoulderBreakLimit = Math.pow(Math.round(75 * _loc4_), 2);
        this.hipBreakLimit = Math.pow(Math.round(95 * _loc6_), 2);
        this.elbowBreakLimit = Math.pow(Math.round(70 * _loc5_), 2);
        this.kneeBreakLimit = Math.pow(Math.round(80 * _loc7_), 2);
    }

    private createBodies(param1: NPCharacterRef) {
        var _loc2_: b2World = this.session.m_world;
        var _loc3_ = new b2BodyDef();
        var _loc4_ = new b2PolygonDef();
        var _loc5_ = new b2CircleDef();
        _loc4_.density = 1;
        _loc4_.friction = 0.3;
        _loc4_.restitution = 0.1;
        _loc4_.filter = this.defaultFilter;
        _loc5_.density = 1;
        _loc5_.friction = 0.3;
        _loc5_.restitution = 0.1;
        _loc5_.filter = this.defaultFilter;
        var _loc6_: number = param1.x / this.m_physScale;
        var _loc7_: number = param1.y / this.m_physScale;
        var _loc8_: NPCSprite = param1.npcSprite;
        var _loc9_: number = this.reversed ? -1 : 1;
        _loc3_.isSleeping = param1.sleeping;
        _loc3_.position.Set(
            param1.x / this.m_physScale,
            param1.y / this.m_physScale,
        );
        _loc3_.angle = param1.rotation / LevelItem.oneEightyOverPI;
        _loc4_.SetAsBox(
            (_loc8_.chestShape.scaleX * 50) / this.character_scale,
            (_loc8_.chestShape.scaleY * 50) / this.character_scale,
        );
        this.chestBody = _loc2_.CreateBody(_loc3_);
        this.chestShape = this.chestBody.CreateShape(_loc4_);
        this.chestShape.SetMaterial(2);
        this.chestShape.SetUserData(this);
        this.session.contactListener.registerListener(
            ContactListener.RESULT,
            this.chestShape,
            this.contactResultHandler,
        );
        this.session.contactListener.registerListener(
            ContactListener.ADD,
            this.chestShape,
            this.contactAddHandler,
        );
        this.chestBody.SetMassFromShapes();
        this.paintVector.push(this.chestBody);
        var _loc10_ = new Point(_loc8_.head.x, _loc8_.head.y);
        _loc10_ = _loc8_.headOuter.transform.matrix.transformPoint(_loc10_);
        _loc10_ = _loc8_.transform.matrix.transformPoint(_loc10_);
        _loc10_ = param1.transform.matrix.transformPoint(_loc10_);
        _loc3_.position.Set(
            _loc10_.x / this.m_physScale,
            _loc10_.y / this.m_physScale,
        );
        _loc3_.angle =
            (param1.rotation + _loc9_ * _loc8_.headOuter.rotation) /
            LevelItem.oneEightyOverPI;
        _loc5_.radius = (_loc8_.headShape.scaleX * 50) / this.character_scale;
        this.headBody = _loc2_.CreateBody(_loc3_);
        this.headShape = this.headBody.CreateShape(_loc5_);
        this.headShape.SetMaterial(2);
        this.headShape.SetUserData(this);
        this.session.contactListener.registerListener(
            ContactListener.RESULT,
            this.headShape,
            this.contactResultHandler,
        );
        this.session.contactListener.registerListener(
            ContactListener.ADD,
            this.headShape,
            this.contactAddHandler,
        );
        this.headBody.SetMassFromShapes();
        this.paintVector.push(this.headBody);
        _loc10_ = new Point(_loc8_.pelvis.x, _loc8_.pelvis.y);
        _loc10_ = _loc8_.transform.matrix.transformPoint(_loc10_);
        _loc10_ = param1.transform.matrix.transformPoint(_loc10_);
        _loc3_.position.Set(
            _loc10_.x / this.m_physScale,
            _loc10_.y / this.m_physScale,
        );
        _loc3_.angle =
            (param1.rotation + _loc9_ * _loc8_.pelvis.rotation) /
            LevelItem.oneEightyOverPI;
        _loc4_.SetAsBox(
            (_loc8_.pelvisShape.scaleX * 50) / this.character_scale,
            (_loc8_.pelvisShape.scaleY * 50) / this.character_scale,
        );
        this.pelvisBody = _loc2_.CreateBody(_loc3_);
        this.pelvisShape = this.pelvisBody.CreateShape(_loc4_);
        this.pelvisShape.SetMaterial(2);
        this.pelvisShape.SetUserData(this);
        this.session.contactListener.registerListener(
            ContactListener.RESULT,
            this.pelvisShape,
            this.contactResultHandler,
        );
        this.session.contactListener.registerListener(
            ContactListener.ADD,
            this.pelvisShape,
            this.contactAddHandler,
        );
        this.pelvisBody.SetMassFromShapes();
        this.paintVector.push(this.pelvisBody);
        _loc10_ = new Point(_loc8_.upperArm1.x, _loc8_.upperArm1.y);
        _loc10_ = _loc8_.arm1.transform.matrix.transformPoint(_loc10_);
        _loc10_ = _loc8_.transform.matrix.transformPoint(_loc10_);
        _loc10_ = param1.transform.matrix.transformPoint(_loc10_);
        _loc3_.position.Set(
            _loc10_.x / this.m_physScale,
            _loc10_.y / this.m_physScale,
        );
        _loc3_.angle =
            (param1.rotation + _loc9_ * _loc8_.arm1.rotation) /
            LevelItem.oneEightyOverPI;
        _loc4_.SetAsBox(
            (_loc8_.upperArm1Shape.scaleX * 50) / this.character_scale,
            (_loc8_.upperArm1Shape.scaleY * 50) / this.character_scale,
        );
        this.upperArm1Body = _loc2_.CreateBody(_loc3_);
        var _loc11_: b2Shape = this.upperArm1Body.CreateShape(_loc4_);
        _loc11_.SetMaterial(1);
        _loc11_.SetUserData(this);
        this.upperArm1Body.SetMassFromShapes();
        this.paintVector.push(this.upperArm1Body);
        _loc10_ = new Point(_loc8_.upperArm2.x, _loc8_.upperArm2.y);
        _loc10_ = _loc8_.arm2.transform.matrix.transformPoint(_loc10_);
        _loc10_ = _loc8_.transform.matrix.transformPoint(_loc10_);
        _loc10_ = param1.transform.matrix.transformPoint(_loc10_);
        _loc3_.position.Set(
            _loc10_.x / this.m_physScale,
            _loc10_.y / this.m_physScale,
        );
        _loc3_.angle =
            (param1.rotation + _loc9_ * _loc8_.arm2.rotation) /
            LevelItem.oneEightyOverPI;
        _loc4_.SetAsBox(
            (_loc8_.upperArm2Shape.scaleX * 50) / this.character_scale,
            (_loc8_.upperArm2Shape.scaleY * 50) / this.character_scale,
        );
        this.upperArm2Body = _loc2_.CreateBody(_loc3_);
        _loc11_ = this.upperArm2Body.CreateShape(_loc4_);
        _loc11_.SetMaterial(1);
        _loc11_.SetUserData(this);
        this.upperArm2Body.SetMassFromShapes();
        this.paintVector.push(this.upperArm2Body);
        _loc10_ = new Point(_loc8_.lowerArm1.x, _loc8_.lowerArm1.y);
        _loc10_ =
            _loc8_.lowerArmOuter1.transform.matrix.transformPoint(_loc10_);
        _loc10_ = _loc8_.arm1.transform.matrix.transformPoint(_loc10_);
        _loc10_ = _loc8_.transform.matrix.transformPoint(_loc10_);
        _loc10_ = param1.transform.matrix.transformPoint(_loc10_);
        _loc3_.position.Set(
            _loc10_.x / this.m_physScale,
            _loc10_.y / this.m_physScale,
        );
        _loc3_.angle =
            (param1.rotation +
                _loc9_ *
                (_loc8_.arm1.rotation + _loc8_.lowerArmOuter1.rotation)) /
            LevelItem.oneEightyOverPI;
        _loc4_.SetAsBox(
            (_loc8_.lowerArm1Shape.scaleX * 50) / this.character_scale,
            (_loc8_.lowerArm1Shape.scaleY * 50) / this.character_scale,
        );
        this.lowerArm1Body = _loc2_.CreateBody(_loc3_);
        _loc11_ = this.lowerArm1Body.CreateShape(_loc4_);
        _loc11_.SetMaterial(1);
        _loc11_.SetUserData(this);
        this.lowerArm1Body.SetMassFromShapes();
        this.paintVector.push(this.lowerArm1Body);
        _loc10_ = new Point(_loc8_.lowerArm2.x, _loc8_.lowerArm2.y);
        _loc10_ =
            _loc8_.lowerArmOuter2.transform.matrix.transformPoint(_loc10_);
        _loc10_ = _loc8_.arm2.transform.matrix.transformPoint(_loc10_);
        _loc10_ = _loc8_.transform.matrix.transformPoint(_loc10_);
        _loc10_ = param1.transform.matrix.transformPoint(_loc10_);
        _loc3_.position.Set(
            _loc10_.x / this.m_physScale,
            _loc10_.y / this.m_physScale,
        );
        _loc3_.angle =
            (param1.rotation +
                _loc9_ *
                (_loc8_.arm2.rotation + _loc8_.lowerArmOuter2.rotation)) /
            LevelItem.oneEightyOverPI;
        _loc4_.SetAsBox(
            (_loc8_.lowerArm2Shape.scaleX * 50) / this.character_scale,
            (_loc8_.lowerArm2Shape.scaleY * 50) / this.character_scale,
        );
        this.lowerArm2Body = _loc2_.CreateBody(_loc3_);
        _loc11_ = this.lowerArm2Body.CreateShape(_loc4_);
        _loc11_.SetMaterial(1);
        _loc11_.SetUserData(this);
        this.lowerArm2Body.SetMassFromShapes();
        this.paintVector.push(this.lowerArm2Body);
        _loc10_ = new Point(_loc8_.upperLeg1.x, _loc8_.upperLeg1.y);
        _loc10_ = _loc8_.leg1.transform.matrix.transformPoint(_loc10_);
        _loc10_ = _loc8_.transform.matrix.transformPoint(_loc10_);
        _loc10_ = param1.transform.matrix.transformPoint(_loc10_);
        _loc3_.position.Set(
            _loc10_.x / this.m_physScale,
            _loc10_.y / this.m_physScale,
        );
        _loc3_.angle =
            (param1.rotation + _loc9_ * _loc8_.leg1.rotation) /
            LevelItem.oneEightyOverPI;
        _loc4_.SetAsBox(
            (_loc8_.upperLeg1Shape.scaleX * 50) / this.character_scale,
            (_loc8_.upperLeg1Shape.scaleY * 50) / this.character_scale,
        );
        this.upperLeg1Body = _loc2_.CreateBody(_loc3_);
        _loc11_ = this.upperLeg1Body.CreateShape(_loc4_);
        _loc11_.SetMaterial(1);
        _loc11_.SetUserData(this);
        this.upperLeg1Body.SetMassFromShapes();
        this.paintVector.push(this.upperLeg1Body);
        _loc10_ = new Point(_loc8_.upperLeg2.x, _loc8_.upperLeg2.y);
        _loc10_ = _loc8_.leg2.transform.matrix.transformPoint(_loc10_);
        _loc10_ = _loc8_.transform.matrix.transformPoint(_loc10_);
        _loc10_ = param1.transform.matrix.transformPoint(_loc10_);
        _loc3_.position.Set(
            _loc10_.x / this.m_physScale,
            _loc10_.y / this.m_physScale,
        );
        _loc3_.angle =
            (param1.rotation + _loc9_ * _loc8_.leg2.rotation) /
            LevelItem.oneEightyOverPI;
        _loc4_.SetAsBox(
            (_loc8_.upperLeg2Shape.scaleX * 50) / this.character_scale,
            (_loc8_.upperLeg2Shape.scaleY * 50) / this.character_scale,
        );
        this.upperLeg2Body = _loc2_.CreateBody(_loc3_);
        _loc11_ = this.upperLeg2Body.CreateShape(_loc4_);
        _loc11_.SetMaterial(1);
        _loc11_.SetUserData(this);
        this.upperLeg2Body.SetMassFromShapes();
        this.paintVector.push(this.upperLeg2Body);
        _loc10_ = new Point(_loc8_.lowerLeg1.x, _loc8_.lowerLeg1.y);
        _loc10_ =
            _loc8_.lowerLegOuter1.transform.matrix.transformPoint(_loc10_);
        _loc10_ = _loc8_.leg1.transform.matrix.transformPoint(_loc10_);
        _loc10_ = _loc8_.transform.matrix.transformPoint(_loc10_);
        _loc10_ = param1.transform.matrix.transformPoint(_loc10_);
        _loc3_.position.Set(
            _loc10_.x / this.m_physScale,
            _loc10_.y / this.m_physScale,
        );
        _loc3_.angle =
            (param1.rotation +
                _loc9_ *
                (_loc8_.leg1.rotation + _loc8_.lowerLegOuter1.rotation)) /
            LevelItem.oneEightyOverPI;
        _loc4_.SetAsBox(
            (_loc8_.lowerLeg1Shape.scaleX * 50) / this.character_scale,
            (_loc8_.lowerLeg1Shape.scaleY * 50) / this.character_scale,
        );
        this.lowerLeg1Body = _loc2_.CreateBody(_loc3_);
        _loc11_ = this.lowerLeg1Body.CreateShape(_loc4_);
        _loc11_.SetMaterial(1);
        _loc11_.SetUserData(this);
        this.lowerLeg1Body.SetMassFromShapes();
        this.paintVector.push(this.lowerLeg1Body);
        _loc10_ = new Point(_loc8_.lowerLeg2.x, _loc8_.lowerLeg2.y);
        _loc10_ =
            _loc8_.lowerLegOuter2.transform.matrix.transformPoint(_loc10_);
        _loc10_ = _loc8_.leg2.transform.matrix.transformPoint(_loc10_);
        _loc10_ = _loc8_.transform.matrix.transformPoint(_loc10_);
        _loc10_ = param1.transform.matrix.transformPoint(_loc10_);
        _loc3_.position.Set(
            _loc10_.x / this.m_physScale,
            _loc10_.y / this.m_physScale,
        );
        _loc3_.angle =
            (param1.rotation +
                _loc9_ *
                (_loc8_.leg2.rotation + _loc8_.lowerLegOuter2.rotation)) /
            LevelItem.oneEightyOverPI;
        _loc4_.SetAsBox(
            (_loc8_.lowerLeg2Shape.scaleX * 50) / this.character_scale,
            (_loc8_.lowerLeg2Shape.scaleY * 50) / this.character_scale,
        );
        this.lowerLeg2Body = _loc2_.CreateBody(_loc3_);
        _loc11_ = this.lowerLeg2Body.CreateShape(_loc4_);
        _loc11_.SetMaterial(1);
        _loc11_.SetUserData(this);
        this.lowerLeg2Body.SetMassFromShapes();
        this.paintVector.push(this.lowerLeg2Body);
        this.headChunkRadius = Math.round(_loc8_.headShape.scaleX * 50 * 0.5);
        this.pelvisChunkRadius = Math.round(
            _loc8_.headShape.scaleX * 50 * 0.75,
        );
        this.chestChunkRadius = Math.round(_loc8_.headShape.scaleX * 50 * 0.95);
        this.brainRadius = 12;
    }

    private createJoints(param1: NPCharacterRef) {
        var _loc4_: number = NaN;
        var _loc2_: b2World = this.session.m_world;
        var _loc3_ = new b2RevoluteJointDef();
        _loc3_.enableLimit = true;
        _loc3_.maxMotorTorque = 4;
        if (param1.holdPose && this.session.levelVersion < 1.75) {
            _loc3_.enableMotor = true;
            _loc3_.motorSpeed = 0;
        }
        var _loc5_ = new b2Vec2();
        var _loc6_: NPCSprite = param1.npcSprite;
        var _loc7_: number = this.reversed ? -1 : 1;
        var _loc8_ = new Point(_loc6_.headOuter.x, _loc6_.headOuter.y);
        _loc8_ = _loc6_.transform.matrix.transformPoint(_loc8_);
        _loc8_ = param1.transform.matrix.transformPoint(_loc8_);
        _loc5_.Set(_loc8_.x / this.m_physScale, _loc8_.y / this.m_physScale);
        _loc4_ = this.headBody.GetAngle() - this.chestBody.GetAngle();
        _loc3_.lowerAngle = -20 / LevelItem.oneEightyOverPI - _loc4_;
        _loc3_.upperAngle = 20 / LevelItem.oneEightyOverPI - _loc4_;
        _loc3_.Initialize(this.chestBody, this.headBody, _loc5_);
        this.neckJoint = _loc2_.CreateJoint(_loc3_) as b2RevoluteJoint;
        _loc8_ = new Point(_loc6_.pelvis.x, _loc6_.pelvis.y);
        _loc8_.y -= _loc6_.pelvis.height * 0.5;
        _loc8_ = _loc6_.transform.matrix.transformPoint(_loc8_);
        _loc8_ = param1.transform.matrix.transformPoint(_loc8_);
        _loc5_.Set(_loc8_.x / this.m_physScale, _loc8_.y / this.m_physScale);
        _loc4_ = this.pelvisBody.GetAngle() - this.chestBody.GetAngle();
        _loc3_.lowerAngle = -5 / LevelItem.oneEightyOverPI - _loc4_;
        _loc3_.upperAngle = 5 / LevelItem.oneEightyOverPI - _loc4_;
        _loc3_.Initialize(this.chestBody, this.pelvisBody, _loc5_);
        this.waistJoint = _loc2_.CreateJoint(_loc3_) as b2RevoluteJoint;
        _loc8_ = new Point(_loc6_.arm1.x, _loc6_.arm1.y);
        _loc8_ = _loc6_.transform.matrix.transformPoint(_loc8_);
        _loc8_ = param1.transform.matrix.transformPoint(_loc8_);
        _loc5_.Set(_loc8_.x / this.m_physScale, _loc8_.y / this.m_physScale);
        _loc4_ = this.upperArm1Body.GetAngle() - this.chestBody.GetAngle();
        if (this.reversed) {
            _loc3_.lowerAngle = -60 / LevelItem.oneEightyOverPI - _loc4_;
            _loc3_.upperAngle = 180 / LevelItem.oneEightyOverPI - _loc4_;
        } else {
            _loc3_.lowerAngle = -180 / LevelItem.oneEightyOverPI - _loc4_;
            _loc3_.upperAngle = 60 / LevelItem.oneEightyOverPI - _loc4_;
        }
        _loc3_.Initialize(this.chestBody, this.upperArm1Body, _loc5_);
        this.shoulderJoint1 = _loc2_.CreateJoint(_loc3_) as b2RevoluteJoint;
        _loc8_ = new Point(_loc6_.arm2.x, _loc6_.arm2.y);
        _loc8_ = _loc6_.transform.matrix.transformPoint(_loc8_);
        _loc8_ = param1.transform.matrix.transformPoint(_loc8_);
        _loc5_.Set(_loc8_.x / this.m_physScale, _loc8_.y / this.m_physScale);
        _loc4_ = this.upperArm2Body.GetAngle() - this.chestBody.GetAngle();
        if (this.reversed) {
            _loc3_.lowerAngle = -60 / LevelItem.oneEightyOverPI - _loc4_;
            _loc3_.upperAngle = 180 / LevelItem.oneEightyOverPI - _loc4_;
        } else {
            _loc3_.lowerAngle = -180 / LevelItem.oneEightyOverPI - _loc4_;
            _loc3_.upperAngle = 60 / LevelItem.oneEightyOverPI - _loc4_;
        }
        _loc3_.Initialize(this.chestBody, this.upperArm2Body, _loc5_);
        this.shoulderJoint2 = _loc2_.CreateJoint(_loc3_) as b2RevoluteJoint;
        _loc8_ = new Point(_loc6_.lowerArmOuter1.x, _loc6_.lowerArmOuter1.y);
        _loc8_ = _loc6_.arm1.transform.matrix.transformPoint(_loc8_);
        _loc8_ = _loc6_.transform.matrix.transformPoint(_loc8_);
        _loc8_ = param1.transform.matrix.transformPoint(_loc8_);
        _loc5_.Set(_loc8_.x / this.m_physScale, _loc8_.y / this.m_physScale);
        _loc4_ = this.lowerArm1Body.GetAngle() - this.upperArm1Body.GetAngle();
        if (this.reversed) {
            _loc3_.lowerAngle = 0 / LevelItem.oneEightyOverPI - _loc4_;
            _loc3_.upperAngle = 160 / LevelItem.oneEightyOverPI - _loc4_;
        } else {
            _loc3_.lowerAngle = -160 / LevelItem.oneEightyOverPI - _loc4_;
            _loc3_.upperAngle = 0 / LevelItem.oneEightyOverPI - _loc4_;
        }
        _loc3_.Initialize(this.upperArm1Body, this.lowerArm1Body, _loc5_);
        this.elbowJoint1 = _loc2_.CreateJoint(_loc3_) as b2RevoluteJoint;
        _loc8_ = new Point(_loc6_.lowerArmOuter2.x, _loc6_.lowerArmOuter2.y);
        _loc8_ = _loc6_.arm2.transform.matrix.transformPoint(_loc8_);
        _loc8_ = _loc6_.transform.matrix.transformPoint(_loc8_);
        _loc8_ = param1.transform.matrix.transformPoint(_loc8_);
        _loc5_.Set(_loc8_.x / this.m_physScale, _loc8_.y / this.m_physScale);
        _loc4_ = this.lowerArm2Body.GetAngle() - this.upperArm2Body.GetAngle();
        if (this.reversed) {
            _loc3_.lowerAngle = 0 / LevelItem.oneEightyOverPI - _loc4_;
            _loc3_.upperAngle = 160 / LevelItem.oneEightyOverPI - _loc4_;
        } else {
            _loc3_.lowerAngle = -160 / LevelItem.oneEightyOverPI - _loc4_;
            _loc3_.upperAngle = 0 / LevelItem.oneEightyOverPI - _loc4_;
        }
        _loc3_.Initialize(this.upperArm2Body, this.lowerArm2Body, _loc5_);
        this.elbowJoint2 = _loc2_.CreateJoint(_loc3_) as b2RevoluteJoint;
        _loc8_ = new Point(_loc6_.leg1.x, _loc6_.leg1.y);
        _loc8_ = _loc6_.transform.matrix.transformPoint(_loc8_);
        _loc8_ = param1.transform.matrix.transformPoint(_loc8_);
        _loc5_.Set(_loc8_.x / this.m_physScale, _loc8_.y / this.m_physScale);
        _loc4_ = this.upperLeg1Body.GetAngle() - this.pelvisBody.GetAngle();
        if (this.reversed) {
            _loc3_.lowerAngle = -10 / LevelItem.oneEightyOverPI - _loc4_;
            _loc3_.upperAngle = 150 / LevelItem.oneEightyOverPI - _loc4_;
        } else {
            _loc3_.lowerAngle = -150 / LevelItem.oneEightyOverPI - _loc4_;
            _loc3_.upperAngle = 10 / LevelItem.oneEightyOverPI - _loc4_;
        }
        _loc3_.Initialize(this.pelvisBody, this.upperLeg1Body, _loc5_);
        this.hipJoint1 = _loc2_.CreateJoint(_loc3_) as b2RevoluteJoint;
        _loc8_ = new Point(_loc6_.leg2.x, _loc6_.leg2.y);
        _loc8_ = _loc6_.transform.matrix.transformPoint(_loc8_);
        _loc8_ = param1.transform.matrix.transformPoint(_loc8_);
        _loc5_.Set(_loc8_.x / this.m_physScale, _loc8_.y / this.m_physScale);
        _loc4_ = this.upperLeg2Body.GetAngle() - this.pelvisBody.GetAngle();
        if (this.reversed) {
            _loc3_.lowerAngle = -10 / LevelItem.oneEightyOverPI - _loc4_;
            _loc3_.upperAngle = 150 / LevelItem.oneEightyOverPI - _loc4_;
        } else {
            _loc3_.lowerAngle = -150 / LevelItem.oneEightyOverPI - _loc4_;
            _loc3_.upperAngle = 10 / LevelItem.oneEightyOverPI - _loc4_;
        }
        _loc3_.Initialize(this.pelvisBody, this.upperLeg2Body, _loc5_);
        this.hipJoint2 = _loc2_.CreateJoint(_loc3_) as b2RevoluteJoint;
        _loc8_ = new Point(_loc6_.lowerLegOuter1.x, _loc6_.lowerLegOuter1.y);
        _loc8_ = _loc6_.leg1.transform.matrix.transformPoint(_loc8_);
        _loc8_ = _loc6_.transform.matrix.transformPoint(_loc8_);
        _loc8_ = param1.transform.matrix.transformPoint(_loc8_);
        _loc5_.Set(_loc8_.x / this.m_physScale, _loc8_.y / this.m_physScale);
        _loc4_ = this.lowerLeg1Body.GetAngle() - this.upperLeg1Body.GetAngle();
        if (this.reversed) {
            _loc3_.lowerAngle = -150 / LevelItem.oneEightyOverPI - _loc4_;
            _loc3_.upperAngle = 0 / LevelItem.oneEightyOverPI - _loc4_;
        } else {
            _loc3_.lowerAngle = 0 / LevelItem.oneEightyOverPI - _loc4_;
            _loc3_.upperAngle = 150 / LevelItem.oneEightyOverPI - _loc4_;
        }
        _loc3_.Initialize(this.upperLeg1Body, this.lowerLeg1Body, _loc5_);
        this.kneeJoint1 = _loc2_.CreateJoint(_loc3_) as b2RevoluteJoint;
        _loc8_ = new Point(_loc6_.lowerLegOuter2.x, _loc6_.lowerLegOuter2.y);
        _loc8_ = _loc6_.leg2.transform.matrix.transformPoint(_loc8_);
        _loc8_ = _loc6_.transform.matrix.transformPoint(_loc8_);
        _loc8_ = param1.transform.matrix.transformPoint(_loc8_);
        _loc5_.Set(_loc8_.x / this.m_physScale, _loc8_.y / this.m_physScale);
        _loc4_ = this.lowerLeg2Body.GetAngle() - this.upperLeg2Body.GetAngle();
        if (this.reversed) {
            _loc3_.lowerAngle = -150 / LevelItem.oneEightyOverPI - _loc4_;
            _loc3_.upperAngle = 0 / LevelItem.oneEightyOverPI - _loc4_;
        } else {
            _loc3_.lowerAngle = 0 / LevelItem.oneEightyOverPI - _loc4_;
            _loc3_.upperAngle = 150 / LevelItem.oneEightyOverPI - _loc4_;
        }
        _loc3_.Initialize(this.upperLeg2Body, this.lowerLeg2Body, _loc5_);
        this.kneeJoint2 = _loc2_.CreateJoint(_loc3_) as b2RevoluteJoint;
        if (param1.holdPose && this.session.levelVersion >= 1.75) {
            this.lockPose();
        }
    }

    private createMovieClips(param1: NPCharacterRef) {
        var _loc4_: DisplayObject = null;
        var _loc2_ = getDefinitionByName(
            "com.totaljerkface.game.editor.specials.npcsprites.NPCSprite" +
            param1.charIndex,
        );
        // @ts-expect-error
        var _loc3_: NPCSprite = new _loc2_();
        _loc3_.removeShapes();
        this.headMC = _loc3_.head as MovieClip;
        this.chestMC = _loc3_.chest as MovieClip;
        this.pelvisMC = _loc3_.pelvis as MovieClip;
        this.upperArm1MC = _loc3_.upperArm1 as MovieClip;
        this.upperArm2MC = _loc3_.upperArm2 as MovieClip;
        this.lowerArm1MC = _loc3_.lowerArm1 as MovieClip;
        this.lowerArm2MC = _loc3_.lowerArm2 as MovieClip;
        this.upperLeg1MC = _loc3_.upperLeg1 as MovieClip;
        this.upperLeg2MC = _loc3_.upperLeg2 as MovieClip;
        this.lowerLeg1MC = _loc3_.lowerLeg1 as MovieClip;
        this.lowerLeg2MC = _loc3_.lowerLeg2 as MovieClip;
        this.headMC.scaleX = this.headMC.scaleY = 0.5;
        this.chestMC.scaleX = this.chestMC.scaleY = 0.5;
        this.pelvisMC.scaleX = this.pelvisMC.scaleY = 0.5;
        this.upperArm1MC.scaleX = this.upperArm1MC.scaleY = 0.5;
        this.upperArm2MC.scaleX = this.upperArm2MC.scaleY = 0.5;
        this.lowerArm1MC.scaleX = this.lowerArm1MC.scaleY = 0.5;
        this.lowerArm2MC.scaleX = this.lowerArm2MC.scaleY = 0.5;
        this.upperLeg1MC.scaleX = this.upperLeg1MC.scaleY = 0.5;
        this.upperLeg2MC.scaleX = this.upperLeg2MC.scaleY = 0.5;
        this.lowerLeg1MC.scaleX = this.lowerLeg1MC.scaleY = 0.5;
        this.lowerLeg2MC.scaleX = this.lowerLeg2MC.scaleY = 0.5;
        if (this.reversed) {
            this.headMC.scaleX = -0.5;
            this.chestMC.scaleX = -0.5;
            this.pelvisMC.scaleX = -0.5;
            this.upperArm1MC.scaleX = -0.5;
            this.upperArm2MC.scaleX = -0.5;
            this.lowerArm1MC.scaleX = -0.5;
            this.lowerArm2MC.scaleX = -0.5;
            this.upperLeg1MC.scaleX = -0.5;
            this.upperLeg2MC.scaleX = -0.5;
            this.lowerLeg1MC.scaleX = -0.5;
            this.lowerLeg2MC.scaleX = -0.5;
        }
        while (_loc3_.numChildren > 0) {
            _loc4_ = _loc3_.getChildAt(0);
            switch (_loc4_) {
                case _loc3_.arm2:
                    this.characterLayer.addChild(this.upperArm2MC);
                    this.characterLayer.addChild(this.lowerArm2MC);
                    _loc3_.removeChild(_loc3_.arm2);
                    break;
                case _loc3_.arm1:
                    this.characterLayer.addChild(this.upperArm1MC);
                    this.characterLayer.addChild(this.lowerArm1MC);
                    _loc3_.removeChild(_loc3_.arm1);
                    break;
                case _loc3_.headOuter:
                    this.characterLayer.addChild(this.headMC);
                    _loc3_.removeChild(_loc3_.headOuter);
                    break;
                case _loc3_.chest:
                    this.characterLayer.addChild(this.chestMC);
                    break;
                case _loc3_.pelvis:
                    this.characterLayer.addChild(this.pelvisMC);
                    break;
                case _loc3_.leg2:
                    this.characterLayer.addChild(this.upperLeg2MC);
                    this.characterLayer.addChild(this.lowerLeg2MC);
                    _loc3_.removeChild(_loc3_.leg2);
                    break;
                case _loc3_.leg1:
                    this.characterLayer.addChild(this.upperLeg1MC);
                    this.characterLayer.addChild(this.lowerLeg1MC);
                    _loc3_.removeChild(_loc3_.leg1);
                    break;
            }
        }
        this.headBody.SetUserData(this.headMC);
        this.chestBody.SetUserData(this.chestMC);
        this.pelvisBody.SetUserData(this.pelvisMC);
        this.upperArm1Body.SetUserData(this.upperArm1MC);
        this.upperArm2Body.SetUserData(this.upperArm2MC);
        this.lowerArm1Body.SetUserData(this.lowerArm1MC);
        this.lowerArm2Body.SetUserData(this.lowerArm2MC);
        this.upperLeg1Body.SetUserData(this.upperLeg1MC);
        this.upperLeg2Body.SetUserData(this.upperLeg2MC);
        this.lowerLeg1Body.SetUserData(this.lowerLeg1MC);
        this.lowerLeg2Body.SetUserData(this.lowerLeg2MC);
    }

    public override getJointBody(param1: b2Vec2 = null): b2Body {
        var _loc3_: b2Body = null;
        var _loc6_: b2Body = null;
        var _loc7_: b2Vec2 = null;
        var _loc8_: b2Vec2 = null;
        var _loc9_ = undefined;
        var _loc10_: number = 0;
        var _loc11_: b2JointEdge = null;
        var _loc2_: number = 10000000;
        var _loc4_ = int(this.paintVector.length);
        var _loc5_: number = 0;
        while (_loc5_ < _loc4_) {
            _loc6_ = this.paintVector[_loc5_];
            _loc7_ = _loc6_.GetWorldCenter();
            _loc8_ = new b2Vec2(param1.x - _loc7_.x, param1.y - _loc7_.y);
            _loc9_ = _loc8_.x * _loc8_.x + _loc8_.y * _loc8_.y;
            if (_loc9_ < _loc2_) {
                _loc10_ = 0;
                _loc11_ = _loc6_.m_jointList;
                while (_loc11_) {
                    _loc10_ += 1;
                    _loc11_ = _loc11_.next;
                }
                if (
                    !(
                        (_loc6_ == this.lowerArm1Body ||
                            _loc6_ == this.lowerArm2Body ||
                            _loc6_ == this.lowerLeg1Body ||
                            _loc6_ == this.lowerLeg2Body) &&
                        _loc10_ > 1
                    )
                ) {
                    _loc2_ = _loc9_;
                    _loc3_ = _loc6_;
                }
            }
            _loc5_++;
        }
        return _loc3_;
    }

    public override get groupDisplayObject(): DisplayObject {
        return this.charSprite;
    }

    public override paint() {
        var _loc3_: b2Body = null;
        var _loc4_: b2Vec2 = null;
        var _loc1_ = int(this.paintVector.length);
        var _loc2_: number = 0;
        while (_loc2_ < _loc1_) {
            _loc3_ = this.paintVector[_loc2_];
            _loc4_ = _loc3_.GetWorldCenter();
            _loc3_.m_userData.x = _loc4_.x * this.m_physScale;
            _loc3_.m_userData.y = _loc4_.y * this.m_physScale;
            _loc3_.m_userData.rotation =
                (_loc3_.GetAngle() * LevelItem.oneEightyOverPI) % 360;
            _loc2_++;
        }
    }

    public contactResultHandler(param1: ContactEvent) {
        var _loc2_: b2Shape = param1.shape;
        var _loc3_: number = param1.impulse;
        if (_loc3_ > this.contactImpulseDict.get(_loc2_)) {
            if (this.contactResultBuffer.get(_loc2_)) {
                if (_loc3_ > this.contactResultBuffer.get(_loc2_).impulse) {
                    this.contactResultBuffer.set(_loc2_, param1);
                }
            } else {
                this.contactResultBuffer.set(_loc2_, param1);
            }
        }
    }

    public contactAddHandler(param1: b2ContactPoint) {
        var _loc2_: b2Shape = param1.shape1;
        var _loc3_: b2Body = _loc2_.m_body;
        var _loc4_: b2Shape = param1.shape2;
        var _loc5_: b2Body = _loc4_.m_body;
        var _loc6_: number = _loc5_.m_mass;
        if (Boolean(this.contactAddBuffer.get(_loc2_)) || _loc4_.m_isSensor) {
            return;
        }
        if (_loc6_ != 0 && _loc6_ < _loc3_.m_mass) {
            return;
        }
        var _loc7_: number = b2Math.b2Dot(param1.velocity, param1.normal);
        _loc7_ = Math.abs(_loc7_);
        if (_loc7_ > 4) {
            this.contactAddBuffer.set(_loc2_, _loc7_);
        }
    }

    protected handleContactResults() {
        var _loc1_: ContactEvent = null;
        if (this.contactResultBuffer.get(this.headShape)) {
            _loc1_ = this.contactResultBuffer.get(this.headShape);
            this.headSmash(_loc1_.impulse);
            this.contactResultBuffer.delete(this.headShape);
            this.contactAddBuffer.delete(this.headShape);
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
    }

    private handleContactAdds() {
        var _loc1_ = undefined;
        var _loc2_: b2Shape = null;
        var _loc3_: string = null;
        for (_loc1_ of this.contactAddBuffer.keys()) {
            _loc2_ = _loc1_ as b2Shape;
            _loc3_ = this.contactAddSounds.get(_loc2_);
            SoundController.instance.playAreaSoundInstance(
                _loc3_,
                _loc2_.m_body,
            );
            this.contactAddBuffer.delete(_loc1_);
        }
    }

    private checkJoints() {
        this.checkRevJoint(
            this.waistJoint,
            this.torsoBreakLimit,
            this.torsoBreak,
        );
        this.checkRevJoint(this.neckJoint, this.neckBreakLimit, this.neckBreak);
        this.checkRevJoint(
            this.shoulderJoint1,
            this.shoulderBreakLimit,
            this.shoulderBreak1,
        );
        this.checkRevJoint(
            this.shoulderJoint2,
            this.shoulderBreakLimit,
            this.shoulderBreak2,
        );
        this.checkRevJoint(
            this.elbowJoint1,
            this.elbowBreakLimit,
            this.elbowBreak1,
        );
        this.checkRevJoint(
            this.elbowJoint2,
            this.elbowBreakLimit,
            this.elbowBreak2,
        );
        this.checkRevJoint(this.hipJoint1, this.hipBreakLimit, this.hipBreak1);
        this.checkRevJoint(this.hipJoint2, this.hipBreakLimit, this.hipBreak2);
        this.checkRevJoint(
            this.kneeJoint1,
            this.kneeBreakLimit,
            this.kneeBreak1,
        );
        this.checkRevJoint(
            this.kneeJoint2,
            this.kneeBreakLimit,
            this.kneeBreak2,
        );
    }

    private checkRevJoint(param1: b2Joint, param2: number, param3) {
        var _loc4_: b2Vec2 = null;
        var _loc5_: number = NaN;
        var _loc6_ = undefined;
        var _loc7_ = undefined;
        var _loc8_: number = NaN;
        var _loc9_: number = NaN;
        var _loc10_: number = NaN;
        if (!param1.broken) {
            _loc4_ = param1.GetReactionForce();
            _loc5_ = _loc4_.LengthSquared();
            if (_loc5_ > param2) {
                param3(_loc5_);
                return;
            }
            _loc6_ = param1.GetAnchor1();
            _loc7_ = param1.GetAnchor2();
            _loc8_ = _loc7_.x - _loc6_.x;
            _loc9_ = _loc7_.y - _loc6_.y;
            _loc10_ = _loc8_ * _loc8_ + _loc9_ * _loc9_;
            if (_loc10_ > 0.25) {
                param3(1000);
            }
        }
    }

    public get dead(): boolean {
        return this._dead;
    }

    public set dead(param1: boolean) {
        this._dead = param1;
        if (this._dead) {
            if (this.voiceSound) {
                this.voiceSound.stopSound();
                this.voiceSound = null;
            }
            if (this.destroyJointsUponDeath) {
                this.destroyUserJoints();
            }
            if (this.session.levelVersion < 1.75) {
                this.cancelPose();
            } else {
                this.releasePose();
            }
        }
    }

    private destroyUserJoints() {
        var _loc1_: string = null;
        for (_loc1_ in this.userJoints) {
            this.session.m_world.DestroyJoint(this.userJoints[_loc1_]);
        }
        this.userJoints = null;
    }

    private cancelPose() {
        this.neckJoint.EnableMotor(false);
        this.shoulderJoint1.EnableMotor(false);
        this.shoulderJoint2.EnableMotor(false);
        this.elbowJoint1.EnableMotor(false);
        this.elbowJoint2.EnableMotor(false);
        this.hipJoint1.EnableMotor(false);
        this.hipJoint2.EnableMotor(false);
        this.kneeJoint1.EnableMotor(false);
        this.kneeJoint2.EnableMotor(false);
    }

    private headSmash(param1: number) {
        var _loc11_: DisplayObject = null;
        var _loc12_: number = NaN;
        var _loc13_: b2BodyDef = null;
        var _loc14_: b2Body = null;
        var _loc15_: b2Shape = null;
        this.contactImpulseDict.delete(this.headShape);
        this.session.contactListener.deleteListener(
            ContactListener.RESULT,
            this.headShape,
        );
        this.session.contactListener.deleteListener(
            ContactListener.ADD,
            this.headShape,
        );
        this.dead = true;
        if (!this.neckJoint.broken) {
            this.neckJoint.broken = true;
            this.chestMC.nextFrame();
            if (this.chestShape.m_userData != NPCharacter.GRIND_STATE) {
                _loc11_ = this.chestMC.getChildByName("spineRef");
                _loc12_ = this.reversed ? -1 : 1;
                this.neckBloodFlow =
                    this.session.particleController.createBloodFlow(
                        2.5,
                        4,
                        this.chestBody,
                        new b2Vec2(
                            (_loc12_ * _loc11_.x) / this.character_scale,
                            _loc11_.y / this.character_scale,
                        ),
                        270,
                        500,
                        this.characterLayer,
                        this.characterLayer.getChildIndex(this.chestMC),
                    );
            }
        } else {
            this.headBloodFlow.stopSpewing();
        }
        var _loc2_ = new b2CircleDef();
        _loc2_.density = 1;
        _loc2_.friction = 0.3;
        _loc2_.restitution = 0.1;
        _loc2_.radius = this.headChunkRadius / this.character_scale;
        _loc2_.filter = this.zeroFilter;
        var _loc3_: b2Vec2 = this.headBody.GetPosition();
        var _loc4_: number = this.headBody.GetAngle();
        var _loc5_: number = 4 / this.character_scale;
        var _loc6_ = new b2Vec2();
        this.headMC.gotoAndStop(3);
        this.headMC.visible = false;
        var _loc7_: number = this.characterLayer.getChildIndex(this.headMC);
        var _loc8_: number = 1;
        while (_loc8_ < 5) {
            _loc13_ = new b2BodyDef();
            _loc11_ = this.headMC.getChildByName("chunk" + _loc8_);
            _loc11_.scaleX = _loc11_.scaleY = 0.5;
            this.characterLayer.addChildAt(_loc11_, _loc7_);
            _loc13_.userData = _loc11_;
            _loc13_.position.Set(
                _loc3_.x + Math.sin(_loc4_) * _loc5_,
                _loc3_.y + Math.cos(_loc4_) * _loc5_,
            );
            _loc14_ = this.session.m_world.CreateBody(_loc13_);
            _loc15_ = _loc14_.CreateShape(_loc2_);
            _loc15_.SetMaterial(1);
            _loc14_.SetMassFromShapes();
            _loc14_.SetLinearVelocity(
                this.headBody.GetLinearVelocityFromWorldPoint(_loc13_.position),
            );
            _loc14_.SetAngularVelocity(this.headBody.GetAngularVelocity());
            this.paintVector.push(_loc14_);
            _loc4_ += Math.PI / 2;
            _loc8_++;
        }
        _loc2_.radius = this.brainRadius / this.character_scale;
        var _loc9_ = new b2BodyDef();
        _loc11_ = this.headMC.getChildByName("brain");
        _loc11_.scaleX = _loc11_.scaleY = 0.5;
        this.characterLayer.addChildAt(_loc11_, _loc7_);
        _loc9_.userData = _loc11_;
        _loc9_.position.Set(_loc3_.x, _loc3_.y);
        _loc9_.angle = this.headBody.GetAngle();
        var _loc10_: b2Body = this.session.m_world.CreateBody(_loc9_);
        _loc15_ = _loc10_.CreateShape(_loc2_);
        _loc15_.SetMaterial(1);
        _loc10_.SetMassFromShapes();
        _loc10_.SetLinearVelocity(this.headBody.GetLinearVelocity());
        _loc10_.SetAngularVelocity(this.headBody.GetAngularVelocity());
        this.paintVector.push(_loc10_);
        this.session.particleController.createBloodBurst(
            5,
            15,
            this.headBody,
            200,
            new b2Vec2(),
            this.characterLayer,
        );
        SoundController.instance.playAreaSoundInstance(
            "HeadSmash",
            this.headBody,
        );
        this.session.m_world.DestroyBody(this.headBody);
    }

    private chestSmash(param1: number) {
        var _loc10_: b2BodyDef = null;
        var _loc11_: DisplayObject = null;
        var _loc12_: b2Body = null;
        var _loc13_: b2Shape = null;
        this.contactImpulseDict.delete(this.chestShape);
        this.session.contactListener.deleteListener(
            ContactListener.RESULT,
            this.chestShape,
        );
        this.session.contactListener.deleteListener(
            ContactListener.ADD,
            this.chestShape,
        );
        this.dead = true;
        if (!this.neckJoint.broken) {
            this.neckBreak(0, false, false);
        }
        if (this.shoulderJoint1) {
            if (!this.shoulderJoint1.broken) {
                this.shoulderBreak1(0, false);
            }
        }
        if (this.shoulderJoint2) {
            if (!this.shoulderJoint2.broken) {
                this.shoulderBreak2(0, false);
            }
        }
        if (!this.waistJoint.broken) {
            this.torsoBreak(0, false);
        }
        var _loc2_ = new b2CircleDef();
        _loc2_.density = 1;
        _loc2_.friction = 0.3;
        _loc2_.restitution = 0.1;
        _loc2_.radius = this.chestChunkRadius / this.character_scale;
        _loc2_.filter = this.zeroFilter;
        var _loc3_: b2Vec2 = this.chestBody.GetPosition();
        var _loc4_: number = this.chestBody.GetAngle() + Math.PI / 4;
        var _loc5_: number = 5 / this.character_scale;
        var _loc6_ = new b2Vec2();
        this.chestMC.gotoAndStop(9);
        this.chestMC.visible = false;
        var _loc7_: number = this.characterLayer.getChildIndex(this.chestMC);
        var _loc8_: number = 1;
        while (_loc8_ < 5) {
            _loc10_ = new b2BodyDef();
            _loc11_ = this.chestMC.getChildByName("chunk" + _loc8_);
            _loc11_.scaleX = _loc11_.scaleY = 0.5;
            this.characterLayer.addChildAt(_loc11_, _loc7_);
            _loc10_.userData = _loc11_;
            _loc10_.position.Set(
                _loc3_.x + Math.sin(_loc4_) * _loc5_,
                _loc3_.y + Math.cos(_loc4_) * _loc5_,
            );
            _loc10_.angle = this.chestBody.GetAngle();
            _loc12_ = this.session.m_world.CreateBody(_loc10_);
            _loc13_ = _loc12_.CreateShape(_loc2_);
            _loc13_.SetMaterial(1);
            _loc12_.SetMassFromShapes();
            _loc12_.SetLinearVelocity(
                this.chestBody.GetLinearVelocityFromWorldPoint(
                    _loc10_.position,
                ),
            );
            _loc12_.SetAngularVelocity(this.chestBody.GetAngularVelocity());
            this.paintVector.push(_loc12_);
            _loc4_ += Math.PI / 2;
            _loc8_++;
        }
        _loc2_.radius = this.headChunkRadius / this.character_scale;
        var _loc9_ = new b2BodyDef();
        _loc11_ = this.chestMC.getChildByName("heart");
        _loc11_.scaleX = _loc11_.scaleY = 0.5;
        this.characterLayer.addChildAt(_loc11_, _loc7_);
        (_loc11_ as MovieClip).play();
        _loc9_.userData = _loc11_;
        _loc9_.position.Set(_loc3_.x, _loc3_.y);
        _loc9_.angle = this.chestBody.GetAngle();
        this.heartBody = this.session.m_world.CreateBody(_loc9_);
        _loc13_ = this.heartBody.CreateShape(_loc2_);
        _loc13_.SetMaterial(1);
        this.heartBody.SetMassFromShapes();
        this.heartBody.SetLinearVelocity(this.chestBody.GetLinearVelocity());
        this.heartBody.SetAngularVelocity(this.chestBody.GetAngularVelocity());
        this.paintVector.push(this.heartBody);
        if (this.stomachBloodFlow) {
            this.stomachBloodFlow.stopSpewing();
        }
        if (this.neckBloodFlow) {
            this.neckBloodFlow.stopSpewing();
        }
        if (this.shoulder1BloodFlow) {
            this.shoulder1BloodFlow.stopSpewing();
        }
        if (this.shoulder2BloodFlow) {
            this.shoulder2BloodFlow.stopSpewing();
        }
        this.session.particleController.createBloodBurst(
            5,
            20,
            this.chestBody,
            300,
            new b2Vec2(),
            this.characterLayer,
            _loc7_,
        );
        SoundController.instance.playAreaSoundInstance(
            "ChestSmash",
            this.chestBody,
        );
        this.chestBody.SetAngularVelocity(0);
        this.chestBody.SetLinearVelocity(new b2Vec2());
        this.session.m_world.DestroyBody(this.chestBody);
        this.chestMC.visible = false;
    }

    private pelvisSmash(param1: number) {
        var _loc9_: b2BodyDef = null;
        var _loc10_: DisplayObject = null;
        var _loc11_: b2Body = null;
        var _loc12_: b2Shape = null;
        this.contactImpulseDict.delete(this.pelvisShape);
        this.session.contactListener.deleteListener(
            ContactListener.RESULT,
            this.pelvisShape,
        );
        this.session.contactListener.deleteListener(
            ContactListener.ADD,
            this.pelvisShape,
        );
        if (this.hipJoint1) {
            if (!this.hipJoint1.broken) {
                this.hipBreak1(0, false);
            }
        }
        if (this.hipJoint2) {
            if (!this.hipJoint2.broken) {
                this.hipBreak2(0, false);
            }
        }
        if (!this.waistJoint.broken) {
            this.torsoBreak(0);
        }
        if (this.hip1BloodFlow) {
            this.hip1BloodFlow.stopSpewing();
        }
        if (this.hip2BloodFlow) {
            this.hip2BloodFlow.stopSpewing();
        }
        var _loc2_ = new b2CircleDef();
        _loc2_.density = 1;
        _loc2_.friction = 0.3;
        _loc2_.restitution = 0.1;
        _loc2_.radius = this.pelvisChunkRadius / this.character_scale;
        _loc2_.filter = this.zeroFilter;
        var _loc3_: b2Vec2 = this.pelvisBody.GetPosition();
        var _loc4_: number = this.pelvisBody.GetAngle();
        var _loc5_: number = 3 / this.character_scale;
        var _loc6_ = new b2Vec2();
        this.pelvisMC.gotoAndStop(5);
        this.pelvisMC.visible = false;
        var _loc7_: number = this.characterLayer.getChildIndex(this.pelvisMC);
        var _loc8_: number = 1;
        while (_loc8_ < 4) {
            _loc9_ = new b2BodyDef();
            _loc10_ = this.pelvisMC.getChildByName("chunk" + _loc8_);
            _loc10_.scaleX = _loc10_.scaleY = 0.5;
            this.characterLayer.addChildAt(_loc10_, _loc7_);
            _loc9_.userData = _loc10_;
            _loc9_.position.Set(
                _loc3_.x + Math.sin(_loc4_) * _loc5_,
                _loc3_.y + Math.cos(_loc4_) * _loc5_,
            );
            _loc9_.angle = this.pelvisBody.GetAngle();
            _loc11_ = this.session.m_world.CreateBody(_loc9_);
            _loc12_ = _loc11_.CreateShape(_loc2_);
            _loc12_.SetMaterial(1);
            _loc11_.SetMassFromShapes();
            _loc11_.SetLinearVelocity(
                this.pelvisBody.GetLinearVelocityFromWorldPoint(
                    _loc9_.position,
                ),
            );
            _loc11_.SetAngularVelocity(this.pelvisBody.GetAngularVelocity());
            this.paintVector.push(_loc11_);
            _loc4_ += (Math.PI * 2) / 3;
            _loc8_++;
        }
        this.session.particleController.createBloodBurst(
            5,
            15,
            this.pelvisBody,
            200,
            new b2Vec2(),
            this.characterLayer,
            _loc7_,
        );
        SoundController.instance.playAreaSoundInstance(
            "PelvisSmash",
            this.pelvisBody,
        );
        this.session.m_world.DestroyBody(this.pelvisBody);
        this.pelvisMC.visible = false;
        this.addVocals("Pelvis", 5);
    }

    private torsoBreak(
        param1: number,
        param2: boolean = true,
        param3: boolean = true,
    ) {
        this.waistJoint.broken = true;
        this.session.m_world.DestroyJoint(this.waistJoint);
        var _loc4_: number = this.chestMC.currentFrame;
        this.chestMC.gotoAndStop(_loc4_ + 4);
        this.pelvisMC.nextFrame();
        var _loc5_: b2Vec2 = this.chestBody.GetPosition();
        var _loc6_: b2Vec2 = this.pelvisBody.GetPosition();
        if (this.pelvisShape.m_userData != NPCharacter.GRIND_STATE) {
            this.pelvisBody.GetShapeList().SetFilterData(this.lowerBodyFilter);
            this.session.m_world.Refilter(this.pelvisBody.GetShapeList());
        }
        var _loc7_: b2Shape = this.upperLeg1Body.GetShapeList();
        if (_loc7_.m_filter.groupIndex != -3) {
            _loc7_.SetFilterData(this.lowerBodyFilter);
            this.session.m_world.Refilter(_loc7_);
        }
        _loc7_ = this.upperLeg2Body.GetShapeList();
        if (_loc7_.m_filter.groupIndex != -3) {
            _loc7_.SetFilterData(this.lowerBodyFilter);
            this.session.m_world.Refilter(_loc7_);
        }
        _loc7_ = this.lowerLeg1Body.GetShapeList();
        if (_loc7_.m_filter.groupIndex != -3) {
            _loc7_.SetFilterData(this.lowerBodyFilter);
            this.session.m_world.Refilter(_loc7_);
        }
        _loc7_ = this.lowerLeg2Body.GetShapeList();
        if (_loc7_.m_filter.groupIndex != -3) {
            _loc7_.SetFilterData(this.lowerBodyFilter);
            this.session.m_world.Refilter(_loc7_);
        }
        if (param2 && this.chestShape.m_userData != NPCharacter.GRIND_STATE) {
            this.stomachBloodFlow =
                this.session.particleController.createBloodFlow(
                    2,
                    3,
                    this.chestBody,
                    new b2Vec2(0, 0),
                    90,
                    500,
                    this.characterLayer,
                    this.characterLayer.getChildIndex(this.chestMC),
                );
        }
        if (param3) {
            SoundController.instance.playAreaSoundInstance(
                "LimbRip1",
                this.pelvisBody,
            );
        }
        this.addVocals("Torso", 5);
    }

    private neckBreak(
        param1: number,
        param2: boolean = true,
        param3: boolean = true,
    ) {
        var _loc4_: DisplayObject = null;
        var _loc5_: number = NaN;
        this.dead = true;
        this.neckJoint.broken = true;
        this.session.m_world.DestroyJoint(this.neckJoint);
        this.headMC.gotoAndStop(2);
        this.chestMC.nextFrame();
        if (this.headShape.m_userData != NPCharacter.GRIND_STATE) {
            this.headBody.GetShapeList().SetFilterData(this.zeroFilter);
            this.session.m_world.Refilter(this.headBody.GetShapeList());
            this.headBloodFlow =
                this.session.particleController.createBloodFlow(
                    2.5,
                    4,
                    this.headBody,
                    new b2Vec2(0, 0),
                    90,
                    150,
                    this.characterLayer,
                    this.characterLayer.getChildIndex(this.headMC),
                );
        }
        if (param2 && this.chestShape.m_userData != NPCharacter.GRIND_STATE) {
            _loc4_ = this.chestMC.getChildByName("spineRef");
            _loc5_ = this.reversed ? -1 : 1;
            this.neckBloodFlow =
                this.session.particleController.createBloodFlow(
                    2.5,
                    4,
                    this.chestBody,
                    new b2Vec2(
                        (_loc5_ * _loc4_.x) / this.character_scale,
                        _loc4_.y / this.character_scale,
                    ),
                    270,
                    500,
                    this.characterLayer,
                    this.characterLayer.getChildIndex(this.chestMC),
                );
        }
        if (param3) {
            SoundController.instance.playAreaSoundInstance(
                "NeckBreak",
                this.headBody,
            );
        }
    }

    private shoulderBreak1(param1: number, param2: boolean = true) {
        this.shoulderJoint1.broken = true;
        var _loc3_: b2Vec2 = this.shoulderJoint1.m_localAnchor1;
        var _loc4_: b2Vec2 = this.shoulderJoint1.m_localAnchor2;
        this.session.m_world.DestroyJoint(this.shoulderJoint1);
        var _loc5_: b2Shape = this.upperArm1Body.GetShapeList();
        if (_loc5_.m_filter.groupIndex != -3) {
            _loc5_.SetFilterData(this.zeroFilter);
            this.session.m_world.Refilter(_loc5_);
            _loc5_.SetMaterial(2);
            _loc5_.SetUserData(this);
            this.arm1BloodFlow =
                this.session.particleController.createBloodFlow(
                    1,
                    3,
                    this.upperArm1Body,
                    _loc4_,
                    270,
                    200,
                    this.characterLayer,
                    this.characterLayer.getChildIndex(this.upperArm1MC),
                );
        }
        _loc5_ = this.lowerArm1Body.GetShapeList();
        if (_loc5_.m_filter.groupIndex != -3) {
            _loc5_.SetFilterData(this.zeroFilter);
            this.session.m_world.Refilter(_loc5_);
        }
        this.upperArm1MC.nextFrame();
        this.chestMC.nextFrame();
        this.chestMC.nextFrame();
        if (param2 && this.chestShape.m_userData != NPCharacter.GRIND_STATE) {
            this.shoulder1BloodFlow =
                this.session.particleController.createBloodFlow(
                    0,
                    1,
                    this.chestBody,
                    _loc3_,
                    270,
                    500,
                    this.characterLayer,
                    this.characterLayer.getChildIndex(this.upperArm1MC),
                );
            SoundController.instance.playAreaSoundInstance(
                "LimbRip2",
                this.upperArm1Body,
            );
        }
        this.addVocals("Shoulder1", 3);
    }

    private shoulderBreak2(param1: number, param2: boolean = true) {
        this.shoulderJoint2.broken = true;
        var _loc3_: b2Vec2 = this.shoulderJoint2.m_localAnchor1;
        var _loc4_: b2Vec2 = this.shoulderJoint2.m_localAnchor2;
        this.session.m_world.DestroyJoint(this.shoulderJoint2);
        var _loc5_: b2Shape = this.upperArm2Body.GetShapeList();
        if (_loc5_.m_filter.groupIndex != -3) {
            _loc5_.SetFilterData(this.zeroFilter);
            this.session.m_world.Refilter(_loc5_);
            _loc5_.SetMaterial(2);
            _loc5_.SetUserData(this);
            this.arm2BloodFlow =
                this.session.particleController.createBloodFlow(
                    1,
                    3,
                    this.upperArm2Body,
                    _loc4_,
                    270,
                    200,
                    this.characterLayer,
                    this.characterLayer.getChildIndex(this.chestMC),
                );
        }
        _loc5_ = this.lowerArm2Body.GetShapeList();
        if (_loc5_.m_filter.groupIndex != -3) {
            _loc5_.SetFilterData(this.zeroFilter);
            this.session.m_world.Refilter(_loc5_);
        }
        this.upperArm2MC.nextFrame();
        if (param2 && this.chestShape.m_userData != NPCharacter.GRIND_STATE) {
            this.shoulder2BloodFlow =
                this.session.particleController.createBloodFlow(
                    0,
                    1,
                    this.chestBody,
                    _loc3_,
                    270,
                    500,
                    this.characterLayer,
                    this.characterLayer.getChildIndex(this.upperArm2MC),
                );
            SoundController.instance.playAreaSoundInstance(
                "LimbRip2",
                this.upperArm2Body,
            );
        }
        this.addVocals("Shoulder2", 3);
    }

    private elbowBreak1(param1: number) {
        var _loc4_: b2Shape = null;
        this.elbowJoint1.broken = true;
        var _loc2_: b2Vec2 = this.elbowJoint1.m_localAnchor2;
        this.session.m_world.DestroyJoint(this.elbowJoint1);
        var _loc3_: b2JointEdge = this.lowerArm1Body.m_jointList;
        while (_loc3_) {
            _loc4_ = _loc3_.other.GetShapeList();
            if (!_loc4_.m_isSensor) {
                this.session.m_world.DestroyJoint(_loc3_.joint);
            }
            _loc3_ = _loc3_.next;
        }
        _loc4_ = this.lowerArm1Body.GetShapeList();
        if (_loc4_.m_filter.groupIndex != -3) {
            _loc4_.SetFilterData(this.zeroFilter);
            this.session.m_world.Refilter(_loc4_);
        }
        this.lowerArm1MC.gotoAndStop(2);
        var _loc5_: number = this.upperArm1MC.currentFrame;
        this.upperArm1MC.gotoAndStop(_loc5_ + 2);
        this.session.particleController.createBloodBurst(
            5,
            15,
            this.lowerArm1Body,
            50,
            _loc2_,
            this.characterLayer,
        );
        var _loc6_: number = Math.ceil(Math.random() * 4);
        SoundController.instance.playAreaSoundInstance(
            "BoneBreak" + _loc6_,
            this.lowerArm1Body,
        );
        this.addVocals("Elbow1", 1);
    }

    private elbowBreak2(param1: number) {
        var _loc4_: b2Shape = null;
        this.elbowJoint2.broken = true;
        var _loc2_: b2Vec2 = this.elbowJoint1.m_localAnchor2;
        this.session.m_world.DestroyJoint(this.elbowJoint2);
        var _loc3_: b2JointEdge = this.lowerArm2Body.m_jointList;
        while (_loc3_) {
            _loc4_ = _loc3_.other.GetShapeList();
            if (!_loc4_.m_isSensor) {
                this.session.m_world.DestroyJoint(_loc3_.joint);
            }
            _loc3_ = _loc3_.next;
        }
        _loc4_ = this.lowerArm2Body.GetShapeList();
        if (_loc4_.m_filter.groupIndex != -3) {
            _loc4_.SetFilterData(this.zeroFilter);
            this.session.m_world.Refilter(_loc4_);
        }
        this.lowerArm2MC.gotoAndStop(2);
        var _loc5_: number = this.upperArm2MC.currentFrame;
        this.upperArm2MC.gotoAndStop(_loc5_ + 2);
        this.session.particleController.createBloodBurst(
            5,
            15,
            this.lowerArm2Body,
            50,
            _loc2_,
            this.characterLayer,
        );
        var _loc6_: number = Math.ceil(Math.random() * 4);
        SoundController.instance.playAreaSoundInstance(
            "BoneBreak" + _loc6_,
            this.lowerArm2Body,
        );
        this.addVocals("Elbow2", 1);
    }

    private hipBreak1(param1: number, param2: boolean = true) {
        this.hipJoint1.broken = true;
        var _loc3_: b2Vec2 = this.hipJoint1.m_localAnchor1;
        var _loc4_: b2Vec2 = this.hipJoint1.m_localAnchor2;
        this.session.m_world.DestroyJoint(this.hipJoint1);
        var _loc5_: b2Shape = this.upperLeg1Body.GetShapeList();
        if (_loc5_.m_filter.groupIndex != -3) {
            _loc5_.SetFilterData(this.zeroFilter);
            this.session.m_world.Refilter(_loc5_);
            _loc5_.SetMaterial(2);
            _loc5_.SetUserData(this);
            this.thigh1BloodFlow =
                this.session.particleController.createBloodFlow(
                    1,
                    3,
                    this.upperLeg1Body,
                    _loc4_,
                    270,
                    200,
                    this.characterLayer,
                    this.characterLayer.getChildIndex(this.upperLeg1MC),
                );
        }
        _loc5_ = this.lowerLeg1Body.GetShapeList();
        if (_loc5_.m_filter.groupIndex != -3) {
            _loc5_.SetFilterData(this.zeroFilter);
            this.session.m_world.Refilter(_loc5_);
        }
        this.upperLeg1MC.nextFrame();
        var _loc6_: number = this.pelvisMC.currentFrame;
        this.pelvisMC.gotoAndStop(_loc6_ + 2);
        if (param2 && this.pelvisShape.m_userData != NPCharacter.GRIND_STATE) {
            this.hip1BloodFlow =
                this.session.particleController.createBloodFlow(
                    0,
                    1,
                    this.pelvisBody,
                    new b2Vec2(0, 0),
                    90,
                    500,
                    this.characterLayer,
                    this.characterLayer.getChildIndex(this.upperLeg1MC),
                );
            SoundController.instance.playAreaSoundInstance(
                "LimbRip3",
                this.upperLeg1Body,
            );
        }
        this.addVocals("Hip1", 4);
    }

    private hipBreak2(param1: number, param2: boolean = true) {
        this.hipJoint2.broken = true;
        var _loc3_: b2Vec2 = this.hipJoint2.m_localAnchor1;
        var _loc4_: b2Vec2 = this.hipJoint2.m_localAnchor2;
        this.session.m_world.DestroyJoint(this.hipJoint2);
        var _loc5_: b2Shape = this.upperLeg2Body.GetShapeList();
        if (_loc5_.m_filter.groupIndex != -3) {
            _loc5_.SetFilterData(this.zeroFilter);
            this.session.m_world.Refilter(_loc5_);
            _loc5_.SetMaterial(2);
            _loc5_.SetUserData(this);
            this.thigh2BloodFlow =
                this.session.particleController.createBloodFlow(
                    1,
                    3,
                    this.upperLeg2Body,
                    _loc4_,
                    270,
                    200,
                    this.characterLayer,
                    this.characterLayer.getChildIndex(this.upperLeg2MC),
                );
        }
        _loc5_ = this.lowerLeg2Body.GetShapeList();
        if (_loc5_.m_filter.groupIndex != -3) {
            _loc5_.SetFilterData(this.zeroFilter);
            this.session.m_world.Refilter(_loc5_);
        }
        this.upperLeg2MC.nextFrame();
        if (param2 && this.pelvisShape.m_userData != NPCharacter.GRIND_STATE) {
            this.hip2BloodFlow =
                this.session.particleController.createBloodFlow(
                    0,
                    1,
                    this.pelvisBody,
                    new b2Vec2(0, 0),
                    90,
                    500,
                    this.characterLayer,
                    this.characterLayer.getChildIndex(this.upperLeg2MC),
                );
            SoundController.instance.playAreaSoundInstance(
                "LimbRip4",
                this.upperLeg2Body,
            );
        }
        this.addVocals("Hip2", 4);
    }

    private kneeBreak1(param1: number) {
        var _loc4_: b2Shape = null;
        this.kneeJoint1.broken = true;
        var _loc2_: b2Vec2 = this.kneeJoint1.m_localAnchor2;
        this.session.m_world.DestroyJoint(this.kneeJoint1);
        var _loc3_: b2JointEdge = this.lowerLeg1Body.m_jointList;
        while (_loc3_) {
            _loc4_ = _loc3_.other.GetShapeList();
            if (!_loc4_.m_isSensor) {
                this.session.m_world.DestroyJoint(_loc3_.joint);
            }
            _loc3_ = _loc3_.next;
        }
        _loc4_ = this.lowerLeg1Body.GetShapeList();
        if (_loc4_.m_filter.groupIndex != -3) {
            _loc4_.SetFilterData(this.zeroFilter);
            _loc4_.m_isSensor = false;
        }
        this.session.m_world.Refilter(_loc4_);
        this.lowerLeg1MC.gotoAndStop(2);
        var _loc5_: number = this.upperLeg1MC.currentFrame;
        this.upperLeg1MC.gotoAndStop(_loc5_ + 2);
        this.session.particleController.createBloodBurst(
            5,
            15,
            this.lowerLeg1Body,
            50,
            _loc2_,
            this.characterLayer,
        );
        var _loc6_: number = Math.ceil(Math.random() * 4);
        SoundController.instance.playAreaSoundInstance(
            "BoneBreak" + _loc6_,
            this.upperLeg1Body,
        );
        this.addVocals("Knee1", 2);
    }

    private kneeBreak2(param1: number) {
        var _loc4_: b2Shape = null;
        this.kneeJoint2.broken = true;
        var _loc2_: b2Vec2 = this.kneeJoint2.m_localAnchor2;
        this.session.m_world.DestroyJoint(this.kneeJoint2);
        var _loc3_: b2JointEdge = this.lowerLeg2Body.m_jointList;
        while (_loc3_) {
            _loc4_ = _loc3_.other.GetShapeList();
            if (!_loc4_.m_isSensor) {
                this.session.m_world.DestroyJoint(_loc3_.joint);
            }
            _loc3_ = _loc3_.next;
        }
        _loc4_ = this.lowerLeg2Body.GetShapeList();
        if (_loc4_.m_filter.groupIndex != -3) {
            _loc4_.SetFilterData(this.zeroFilter);
            _loc4_.m_isSensor = false;
        }
        this.session.m_world.Refilter(_loc4_);
        this.lowerLeg2MC.gotoAndStop(2);
        var _loc5_: number = this.upperLeg2MC.currentFrame;
        this.upperLeg2MC.gotoAndStop(_loc5_ + 2);
        this.session.particleController.createBloodBurst(
            5,
            15,
            this.lowerLeg2Body,
            50,
            _loc2_,
            this.characterLayer,
        );
        var _loc6_: number = Math.ceil(Math.random() * 4);
        SoundController.instance.playAreaSoundInstance(
            "BoneBreak" + _loc6_,
            this.upperLeg2Body,
        );
        this.addVocals("Knee2", 2);
    }

    protected checkVocals() {
        var _loc2_: string = null;
        var _loc1_ = int(this.voiceArray.length - 1);
        if (this.voiceSound) {
            if (this.voiceSound.soundChannel) {
                if (_loc1_ > this.voicePriority) {
                    this.voiceSound.stopSound();
                    _loc2_ = this.voiceArray[_loc1_];
                    this.voiceSound =
                        SoundController.instance.playAreaSoundInstance(
                            this.tag + _loc2_,
                            this.headBody,
                        );
                    this.voicePriority = _loc1_;
                }
                return;
            }
            this.voiceSound = null;
            this.voicePriority = -1;
        }
        if (_loc1_ < 0) {
            return;
        }
        _loc2_ = this.voiceArray[_loc1_];
        this.voiceSound = SoundController.instance.playAreaSoundInstance(
            this.tag + _loc2_,
            this.headBody,
        );
        this.voicePriority = _loc1_;
    }

    public addVocals(param1: string, param2: number) {
        this.voiceArray[param2] = param1;
    }

    protected randomVocals(param1: number): string {
        var _loc2_: any[] = [
            "Elbow1",
            "Elbow2",
            "Knee1",
            "Knee2",
            "Shoulder1",
            "Shoulder2",
            "Hip1",
            "Hip2",
            "Knee1",
            "Spikes",
        ];
        return _loc2_[param1];
    }

    public shapeImpale(
        param1: b2Shape,
        param2: boolean = true,
        param3: b2Vec2 = null,
        param4: number = 0,
    ) {
        var _loc5_: string = null;
        var _loc6_: number = 0;
        var _loc7_: b2Vec2 = null;
        var _loc8_: b2Vec2 = null;
        var _loc9_: number = NaN;
        if (Settings.currentSession.version < 1.35) {
            return;
        }
        if (param1 == this.chestShape || param1 == this.pelvisShape) {
            _loc5_ = param1.GetBody().GetPosition().x.toString();
            _loc6_ = int(_loc5_.charAt(_loc5_.length - 1));
            this.addVocals(this.randomVocals(_loc6_), 5);
        } else if (param1 == this.headShape) {
            if (param2) {
                if (param3) {
                    _loc7_ = param1.GetBody().GetWorldCenter();
                    _loc8_ = new b2Vec2(
                        param3.x - _loc7_.x,
                        param3.y - _loc7_.y,
                    );
                    _loc9_ = _loc8_.LengthSquared();
                    if (_loc9_ < param4) {
                        this.dead = true;
                    } else {
                        _loc5_ = param1.GetBody().GetPosition().x.toString();
                        _loc6_ = int(_loc5_.charAt(_loc5_.length - 1));
                        this.addVocals(this.randomVocals(_loc6_), 5);
                    }
                } else {
                    this.dead = true;
                }
            } else {
                _loc5_ = param1.GetBody().GetPosition().x.toString();
                _loc6_ = int(_loc5_.charAt(_loc5_.length - 1));
                this.addVocals(this.randomVocals(_loc6_), 5);
            }
        }
    }

    public grindShape(param1: b2Shape) {
        switch (param1) {
            case this.headShape:
                this.headShape.SetUserData(NPCharacter.GRIND_STATE);
                this.contactResultBuffer.delete(this.headShape);
                this.contactAddBuffer.delete(this.headShape);
                this.session.contactListener.deleteListener(
                    ContactListener.RESULT,
                    this.headShape,
                );
                this.session.contactListener.deleteListener(
                    ContactListener.ADD,
                    this.headShape,
                );
                if (this.headBloodFlow) {
                    this.headBloodFlow.stopSpewing();
                }
                break;
            case this.chestShape:
                this.chestShape.SetUserData(NPCharacter.GRIND_STATE);
                this.contactResultBuffer.delete(this.chestShape);
                this.contactAddBuffer.delete(this.chestShape);
                this.session.contactListener.deleteListener(
                    ContactListener.RESULT,
                    this.chestShape,
                );
                this.session.contactListener.deleteListener(
                    ContactListener.ADD,
                    this.chestShape,
                );
                if (this.neckBloodFlow) {
                    this.neckBloodFlow.stopSpewing();
                }
                if (this.shoulder1BloodFlow) {
                    this.shoulder1BloodFlow.stopSpewing();
                }
                if (this.shoulder2BloodFlow) {
                    this.shoulder2BloodFlow.stopSpewing();
                }
                if (this.stomachBloodFlow) {
                    this.stomachBloodFlow.stopSpewing();
                }
                break;
            case this.pelvisShape:
                this.pelvisShape.SetUserData(NPCharacter.GRIND_STATE);
                this.contactResultBuffer.delete(this.pelvisShape);
                this.contactAddBuffer.delete(this.pelvisShape);
                this.session.contactListener.deleteListener(
                    ContactListener.RESULT,
                    this.pelvisShape,
                );
                this.session.contactListener.deleteListener(
                    ContactListener.ADD,
                    this.pelvisShape,
                );
                if (this.hip1BloodFlow) {
                    this.hip1BloodFlow.stopSpewing();
                }
                if (this.hip2BloodFlow) {
                    this.hip2BloodFlow.stopSpewing();
                }
                break;
            case this.upperArm1Body.GetShapeList():
                if (this.arm1BloodFlow) {
                    this.arm1BloodFlow.stopSpewing();
                }
                break;
            case this.upperArm2Body.GetShapeList():
                if (this.arm2BloodFlow) {
                    this.arm2BloodFlow.stopSpewing();
                }
                break;
            case this.upperLeg1Body.GetShapeList():
                if (this.thigh1BloodFlow) {
                    this.thigh1BloodFlow.stopSpewing();
                }
                break;
            case this.upperLeg2Body.GetShapeList():
                if (this.thigh2BloodFlow) {
                    this.thigh2BloodFlow.stopSpewing();
                }
        }
    }

    public removeBody(param1: b2Body) {
        switch (param1) {
            case this.headBody:
                if (!this.neckJoint.broken) {
                    this.neckBreak(0, true, true);
                }
                break;
            case this.chestBody:
                if (!this.neckJoint.broken) {
                    this.neckBreak(0, true, true);
                }
                if (!this.shoulderJoint1.broken) {
                    this.shoulderBreak1(0, true);
                }
                if (!this.shoulderJoint2.broken) {
                    this.shoulderBreak2(0, true);
                }
                if (!this.waistJoint.broken) {
                    this.torsoBreak(0);
                }
                break;
            case this.pelvisBody:
                if (!this.hipJoint1.broken) {
                    this.hipBreak1(0, true);
                }
                if (!this.hipJoint2.broken) {
                    this.hipBreak2(0, true);
                }
                if (!this.waistJoint.broken) {
                    this.torsoBreak(0);
                }
                break;
            case this.upperArm1Body:
                if (!this.shoulderJoint1.broken) {
                    this.shoulderBreak1(0, true);
                }
                if (!this.elbowJoint1.broken) {
                    this.elbowBreak1(0);
                }
                break;
            case this.upperArm2Body:
                if (!this.shoulderJoint2.broken) {
                    this.shoulderBreak2(0, true);
                }
                if (!this.elbowJoint2.broken) {
                    this.elbowBreak2(0);
                }
                break;
            case this.upperLeg1Body:
                if (!this.hipJoint1.broken) {
                    this.hipBreak1(0, true);
                }
                if (!this.kneeJoint1.broken) {
                    this.kneeBreak1(0);
                }
                break;
            case this.upperLeg2Body:
                if (!this.hipJoint2.broken) {
                    this.hipBreak2(0, true);
                }
                if (!this.kneeJoint2.broken) {
                    this.kneeBreak2(0);
                }
        }
    }

    public explodeShape(param1: b2Shape, param2: number) {
        var _loc3_: number = NaN;
        var _loc4_: number = NaN;
        var _loc5_: number = NaN;
        switch (param1) {
            case this.headShape:
                if (param2 > 0.85) {
                    this.contactResultBuffer.delete(this.headShape);
                    this.contactAddBuffer.delete(this.headShape);
                    this.headSmash(0);
                }
                break;
            case this.chestShape:
                _loc3_ = this.chestBody.GetMass() / CharacterB2D.DEF_CHEST_MASS;
                _loc4_ = Math.max(1 - 0.15 * _loc3_, 0.7);
                if (param2 > _loc4_) {
                    this.contactResultBuffer.delete(this.chestShape);
                    this.contactAddBuffer.delete(this.chestShape);
                    this.chestSmash(0);
                }
                break;
            case this.pelvisShape:
                _loc5_ =
                    this.pelvisBody.GetMass() / CharacterB2D.DEF_PELVIS_MASS;
                _loc4_ = Math.max(1 - 0.15 * _loc5_, 0.7);
                if (param2 > _loc4_) {
                    this.contactResultBuffer.delete(this.pelvisShape);
                    this.contactAddBuffer.delete(this.pelvisShape);
                    this.pelvisSmash(0);
                }
        }
    }

    public get centralBody(): b2Body {
        if (this.heartBody) {
            return this.heartBody;
        }
        return this.chestBody;
    }

    public override triggerSingleActivation(
        param1: Trigger,
        param2: string,
        param3: any[],
    ) {
        var _loc4_: number = NaN;
        var _loc5_: number = NaN;
        var _loc6_: number = NaN;
        var _loc7_: any[] = null;
        var _loc8_: number = 0;
        var _loc9_: number = 0;
        var _loc10_: b2Body = null;
        var _loc11_: number = NaN;
        var _loc12_: number = NaN;
        if (param2 == "wake from sleep") {
            if (this.chestBody) {
                this.chestBody.WakeUp();
            }
        } else if (param2 == "apply impulse") {
            if (this.destroyJointsUponDeath && this._dead) {
                return;
            }
            if (this.chestBody) {
                _loc4_ = Number(param3[0]);
                _loc5_ = Number(param3[1]);
                _loc6_ = Number(param3[2]);
                _loc7_ = [this.chestBody, this.headBody, this.pelvisBody];
                if (!this.shoulderJoint1.broken) {
                    _loc7_.push(this.upperArm1Body);
                    if (!this.elbowJoint1.broken) {
                        _loc7_.push(this.lowerArm1Body);
                    }
                }
                if (!this.shoulderJoint2.broken) {
                    _loc7_.push(this.upperArm2Body);
                    if (!this.elbowJoint2.broken) {
                        _loc7_.push(this.lowerArm2Body);
                    }
                }
                if (!this.hipJoint1.broken) {
                    _loc7_.push(this.upperLeg1Body);
                    if (!this.kneeJoint1.broken) {
                        _loc7_.push(this.lowerLeg1Body);
                    }
                }
                if (!this.hipJoint2.broken) {
                    _loc7_.push(this.upperLeg2Body);
                    if (!this.kneeJoint2.broken) {
                        _loc7_.push(this.lowerLeg2Body);
                    }
                }
                _loc8_ = int(_loc7_.length);
                _loc9_ = 0;
                while (_loc9_ < _loc8_) {
                    _loc10_ = _loc7_[_loc9_];
                    _loc11_ = _loc10_.GetMass();
                    _loc10_.ApplyImpulse(
                        new b2Vec2(_loc4_ * _loc11_, _loc5_ * _loc11_),
                        _loc10_.GetWorldCenter(),
                    );
                    _loc9_++;
                }
                if (_loc6_) {
                    _loc12_ = this.chestBody.GetAngularVelocity();
                    this.chestBody.SetAngularVelocity(_loc12_ + _loc6_ * 10);
                }
            }
        } else if (param2 == "hold pose") {
            if (this.destroyJointsUponDeath && this._dead) {
                return;
            }
            if (this.chestBody) {
                this.lockPose();
            }
        } else {
            param2 = "release pose";
            if (param2) {
                if (this.destroyJointsUponDeath && this._dead) {
                    return;
                }
                if (this.chestBody) {
                    this.releasePose();
                }
            }
        }
    }

    public override get bodyList(): any[] {
        if (this.chestBody) {
            return [this.chestBody, this.headBody];
        }
        return [];
    }

    private lockPose() {
        trace("LOCK POSE");
        var _loc1_: number = 0;
        var _loc2_: number = this.neckJoint.GetJointAngle();
        this.neckJoint.m_lowerAngle = _loc2_ - _loc1_;
        this.neckJoint.m_upperAngle = _loc2_ + _loc1_;
        _loc2_ = this.waistJoint.GetJointAngle();
        this.waistJoint.m_lowerAngle = _loc2_ - _loc1_;
        this.waistJoint.m_upperAngle = _loc2_ + _loc1_;
        _loc2_ = this.shoulderJoint1.GetJointAngle();
        this.shoulderJoint1.m_lowerAngle = _loc2_ - _loc1_;
        this.shoulderJoint1.m_upperAngle = _loc2_ + _loc1_;
        _loc2_ = this.elbowJoint1.GetJointAngle();
        this.elbowJoint1.m_lowerAngle = _loc2_ - _loc1_;
        this.elbowJoint1.m_upperAngle = _loc2_ + _loc1_;
        _loc2_ = this.shoulderJoint2.GetJointAngle();
        this.shoulderJoint2.m_lowerAngle = _loc2_ - _loc1_;
        this.shoulderJoint2.m_upperAngle = _loc2_ + _loc1_;
        _loc2_ = this.elbowJoint2.GetJointAngle();
        this.elbowJoint2.m_lowerAngle = _loc2_ - _loc1_;
        this.elbowJoint2.m_upperAngle = _loc2_ + _loc1_;
        _loc2_ = this.hipJoint1.GetJointAngle();
        this.hipJoint1.m_lowerAngle = _loc2_ - _loc1_;
        this.hipJoint1.m_upperAngle = _loc2_ + _loc1_;
        _loc2_ = this.kneeJoint1.GetJointAngle();
        this.kneeJoint1.m_lowerAngle = _loc2_ - _loc1_;
        this.kneeJoint1.m_upperAngle = _loc2_ + _loc1_;
        _loc2_ = this.hipJoint2.GetJointAngle();
        this.hipJoint2.m_lowerAngle = _loc2_ - _loc1_;
        this.hipJoint2.m_upperAngle = _loc2_ + _loc1_;
        _loc2_ = this.kneeJoint2.GetJointAngle();
        this.kneeJoint2.m_lowerAngle = _loc2_ - _loc1_;
        this.kneeJoint2.m_upperAngle = _loc2_ + _loc1_;
    }

    private releasePose() {
        trace("RELEASE POSE");
        var _loc1_: number = this.reversed ? -1 : 1;
        this.neckJoint.m_lowerAngle =
            -20 / LevelItem.oneEightyOverPI - this.neckJoint.m_referenceAngle;
        this.neckJoint.m_upperAngle =
            20 / LevelItem.oneEightyOverPI - this.neckJoint.m_referenceAngle;
        this.waistJoint.m_lowerAngle =
            -5 / LevelItem.oneEightyOverPI - this.waistJoint.m_referenceAngle;
        this.waistJoint.m_upperAngle =
            5 / LevelItem.oneEightyOverPI - this.waistJoint.m_referenceAngle;
        if (this.reversed) {
            this.shoulderJoint1.m_lowerAngle =
                -60 / LevelItem.oneEightyOverPI -
                this.shoulderJoint1.m_referenceAngle;
            this.shoulderJoint1.m_upperAngle =
                180 / LevelItem.oneEightyOverPI -
                this.shoulderJoint1.m_referenceAngle;
            this.shoulderJoint2.m_lowerAngle =
                -60 / LevelItem.oneEightyOverPI -
                this.shoulderJoint2.m_referenceAngle;
            this.shoulderJoint2.m_upperAngle =
                180 / LevelItem.oneEightyOverPI -
                this.shoulderJoint2.m_referenceAngle;
            this.elbowJoint1.m_lowerAngle =
                0 / LevelItem.oneEightyOverPI -
                this.elbowJoint1.m_referenceAngle;
            this.elbowJoint1.m_upperAngle =
                160 / LevelItem.oneEightyOverPI -
                this.elbowJoint1.m_referenceAngle;
            this.elbowJoint2.m_lowerAngle =
                0 / LevelItem.oneEightyOverPI -
                this.elbowJoint2.m_referenceAngle;
            this.elbowJoint2.m_upperAngle =
                160 / LevelItem.oneEightyOverPI -
                this.elbowJoint2.m_referenceAngle;
            this.hipJoint1.m_lowerAngle =
                -10 / LevelItem.oneEightyOverPI -
                this.hipJoint1.m_referenceAngle;
            this.hipJoint1.m_upperAngle =
                150 / LevelItem.oneEightyOverPI -
                this.hipJoint1.m_referenceAngle;
            this.hipJoint2.m_lowerAngle =
                -10 / LevelItem.oneEightyOverPI -
                this.hipJoint2.m_referenceAngle;
            this.hipJoint2.m_upperAngle =
                150 / LevelItem.oneEightyOverPI -
                this.hipJoint2.m_referenceAngle;
            this.kneeJoint1.m_lowerAngle =
                -150 / LevelItem.oneEightyOverPI -
                this.kneeJoint1.m_referenceAngle;
            this.kneeJoint1.m_upperAngle =
                0 / LevelItem.oneEightyOverPI -
                this.kneeJoint1.m_referenceAngle;
            this.kneeJoint2.m_lowerAngle =
                -150 / LevelItem.oneEightyOverPI -
                this.kneeJoint2.m_referenceAngle;
            this.kneeJoint2.m_upperAngle =
                0 / LevelItem.oneEightyOverPI -
                this.kneeJoint2.m_referenceAngle;
        } else {
            this.shoulderJoint1.m_lowerAngle =
                -180 / LevelItem.oneEightyOverPI -
                this.shoulderJoint1.m_referenceAngle;
            this.shoulderJoint1.m_upperAngle =
                60 / LevelItem.oneEightyOverPI -
                this.shoulderJoint1.m_referenceAngle;
            this.shoulderJoint2.m_lowerAngle =
                -180 / LevelItem.oneEightyOverPI -
                this.shoulderJoint2.m_referenceAngle;
            this.shoulderJoint2.m_upperAngle =
                60 / LevelItem.oneEightyOverPI -
                this.shoulderJoint2.m_referenceAngle;
            this.elbowJoint1.m_lowerAngle =
                -160 / LevelItem.oneEightyOverPI -
                this.elbowJoint1.m_referenceAngle;
            this.elbowJoint1.m_upperAngle =
                0 / LevelItem.oneEightyOverPI -
                this.elbowJoint1.m_referenceAngle;
            this.elbowJoint2.m_lowerAngle =
                -160 / LevelItem.oneEightyOverPI -
                this.elbowJoint2.m_referenceAngle;
            this.elbowJoint2.m_upperAngle =
                0 / LevelItem.oneEightyOverPI -
                this.elbowJoint2.m_referenceAngle;
            this.hipJoint1.m_lowerAngle =
                -150 / LevelItem.oneEightyOverPI -
                this.hipJoint1.m_referenceAngle;
            this.hipJoint1.m_upperAngle =
                10 / LevelItem.oneEightyOverPI -
                this.hipJoint1.m_referenceAngle;
            this.hipJoint2.m_lowerAngle =
                -150 / LevelItem.oneEightyOverPI -
                this.hipJoint2.m_referenceAngle;
            this.hipJoint2.m_upperAngle =
                10 / LevelItem.oneEightyOverPI -
                this.hipJoint2.m_referenceAngle;
            this.kneeJoint1.m_lowerAngle =
                0 / LevelItem.oneEightyOverPI -
                this.kneeJoint1.m_referenceAngle;
            this.kneeJoint1.m_upperAngle =
                150 / LevelItem.oneEightyOverPI -
                this.kneeJoint1.m_referenceAngle;
            this.kneeJoint2.m_lowerAngle =
                0 / LevelItem.oneEightyOverPI -
                this.kneeJoint2.m_referenceAngle;
            this.kneeJoint2.m_upperAngle =
                150 / LevelItem.oneEightyOverPI -
                this.kneeJoint2.m_referenceAngle;
        }
    }
}