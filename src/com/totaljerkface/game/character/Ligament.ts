import b2CircleDef from "@/Box2D/Collision/Shapes/b2CircleDef";
import b2FilterData from "@/Box2D/Collision/Shapes/b2FilterData";
import b2PolygonShape from "@/Box2D/Collision/Shapes/b2PolygonShape";
import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import b2DistanceJoint from "@/Box2D/Dynamics/Joints/b2DistanceJoint";
import b2DistanceJointDef from "@/Box2D/Dynamics/Joints/b2DistanceJointDef";
import b2Body from "@/Box2D/Dynamics/b2Body";
import b2BodyDef from "@/Box2D/Dynamics/b2BodyDef";
import b2World from "@/Box2D/Dynamics/b2World";
import Settings from "@/com/totaljerkface/game/Settings";
import CharacterB2D from "@/com/totaljerkface/game/character/CharacterB2D";
import SantaClaus from "@/com/totaljerkface/game/character/SantaClaus";
import SleighElf from "@/com/totaljerkface/game/character/SleighElf";
import SoundController from "@/com/totaljerkface/game/sound/SoundController";
import { boundClass } from 'autobind-decorator';
import Sprite from "flash/display/Sprite";

@boundClass
export default class Ligament {
    private numPoints: number;
    private ligamentLength: number;
    private upperBody: b2Body;
    private lowerBody: b2Body;
    private character_scale: number;
    private m_physScale: number;
    private ligJoints: any[];
    private ligSprite: Sprite;
    private mainJoint: b2DistanceJoint;
    private lineThickness: number = 1;
    private lineColor: number = 16711680;
    private lineAlpha: number = 1;
    private ligFilter: b2FilterData;
    private antiGrav: any[];

    constructor(
        param1: b2Body,
        param2: b2Body,
        param3: number,
        param4: number,
        param5: CharacterB2D = null,
    ) {
        var _loc6_: SantaClaus = null;
        var _loc7_: SleighElf = null;

        this.upperBody = param1;
        this.lowerBody = param2;
        this.ligamentLength = param3;
        this.character_scale = param4;
        this.m_physScale = Settings.currentSession.m_physScale;
        if (param5 instanceof SantaClaus) {
            _loc6_ = param5 as SantaClaus;
            this.antiGrav = _loc6_.antiGravArray;
        } else if (param5 instanceof SleighElf) {
            _loc7_ = param5 as SleighElf;
            this.antiGrav = _loc7_.antiGravArray;
        }
        this.create();
    }

    private create() {
        var _loc17_: b2Body = null;
        var _loc18_: b2Body = null;
        var _loc19_: b2Body = null;
        var _loc1_ = new b2BodyDef();
        var _loc2_ = new b2CircleDef();
        this.ligFilter = new b2FilterData();
        this.ligFilter.categoryBits = 2056;
        this.ligFilter.maskBits = 2056;
        _loc2_.density = 1;
        _loc2_.friction = 0.3;
        _loc2_.restitution = 0.1;
        _loc2_.radius = 7 / this.character_scale;
        _loc2_.filter = this.ligFilter;
        var _loc3_ = Number(
            (this.upperBody.GetShapeList() as b2PolygonShape).GetVertices()[2]
                .y,
        );
        var _loc4_: number = this.upperBody.GetAngle() + Math.PI / 2;
        var _loc5_ = new b2Vec2(
            this.upperBody.GetPosition().x + Math.cos(_loc4_) * _loc3_,
            this.upperBody.GetPosition().y + Math.sin(_loc4_) * _loc3_,
        );
        _loc3_ = Number(
            (this.lowerBody.GetShapeList() as b2PolygonShape).GetVertices()[0]
                .y,
        );
        _loc4_ = this.lowerBody.GetAngle() + Math.PI / 2;
        var _loc6_ = new b2Vec2(
            this.lowerBody.GetPosition().x + Math.cos(_loc4_) * _loc3_,
            this.lowerBody.GetPosition().y + Math.sin(_loc4_) * _loc3_,
        );
        var _loc7_: number = _loc6_.x - _loc5_.x;
        var _loc8_: number = _loc6_.y - _loc6_.y;
        var _loc9_: number = _loc7_ / (this.numPoints + 1);
        var _loc10_: number = _loc8_ / (this.numPoints + 1);
        var _loc11_ = new Array();
        var _loc12_: b2World = Settings.currentSession.m_world;
        var _loc13_: number = 1;
        while (_loc13_ <= this.numPoints) {
            _loc1_.position.Set(
                _loc5_.x + _loc9_ * _loc13_,
                _loc5_.y + _loc10_ * _loc13_,
            );
            _loc1_.fixedRotation = true;
            _loc17_ = _loc12_.CreateBody(_loc1_);
            _loc17_.CreateShape(_loc2_);
            _loc17_.SetMassFromShapes();
            _loc17_.SetLinearVelocity(this.upperBody.GetLinearVelocity());
            _loc11_.push(_loc17_);
            _loc13_++;
        }
        if (this.antiGrav) {
            _loc13_ = 0;
            while (_loc13_ < this.numPoints) {
                this.antiGrav.push(_loc11_[_loc13_]);
                _loc13_++;
            }
        }
        this.ligJoints = new Array();
        var _loc14_ = new b2DistanceJointDef();
        var _loc15_: number = this.ligamentLength / this.character_scale;
        _loc14_.Initialize(
            this.upperBody,
            _loc11_[0],
            _loc5_,
            _loc11_[0].GetPosition(),
        );
        _loc14_.length = _loc15_;
        _loc14_.collideConnected = false;
        this.mainJoint = _loc12_.CreateJoint(_loc14_) as b2DistanceJoint;
        this.ligJoints.push(this.mainJoint);
        _loc13_ = 0;
        while (_loc13_ < this.numPoints - 1) {
            _loc18_ = _loc11_[_loc13_];
            _loc19_ = _loc11_[_loc13_ + 1];
            _loc14_.Initialize(
                _loc18_,
                _loc19_,
                _loc18_.GetPosition(),
                _loc19_.GetPosition(),
            );
            _loc14_.length = _loc15_;
            this.ligJoints.push(
                _loc12_.CreateJoint(_loc14_) as b2DistanceJoint,
            );
            _loc13_++;
        }
        _loc14_.Initialize(
            _loc19_,
            this.lowerBody,
            _loc19_.GetPosition(),
            _loc6_,
        );
        _loc14_.length = _loc15_;
        this.ligJoints.push(_loc12_.CreateJoint(_loc14_) as b2DistanceJoint);
        this.ligSprite = new Sprite();
        var _loc16_: Sprite = Settings.currentSession.containerSprite;
        _loc16_.addChildAt(
            this.ligSprite,
            _loc16_.getChildIndex(this.upperBody.GetUserData() as Sprite),
        );
    }

    public paint() {
        var _loc3_: b2DistanceJoint = null;
        this.ligSprite.graphics.clear();
        this.ligSprite.graphics.lineStyle(
            this.lineThickness,
            this.lineColor,
            this.lineAlpha,
        );
        var _loc1_: b2Vec2 = this.mainJoint.GetAnchor1();
        this.ligSprite.graphics.moveTo(
            _loc1_.x * this.m_physScale,
            _loc1_.y * this.m_physScale,
        );
        var _loc2_: number = 0;
        while (_loc2_ < this.ligJoints.length - 1) {
            _loc3_ = this.ligJoints[_loc2_];
            _loc1_ = _loc3_.GetBody2().GetPosition();
            this.ligSprite.graphics.lineTo(
                _loc1_.x * this.m_physScale,
                _loc1_.y * this.m_physScale,
            );
            _loc2_++;
        }
        _loc3_ = this.ligJoints[_loc2_];
        _loc1_ = _loc3_.GetAnchor2();
        this.ligSprite.graphics.lineTo(
            _loc1_.x * this.m_physScale,
            _loc1_.y * this.m_physScale,
        );
        _loc1_ = this.lowerBody.GetWorldCenter();
        this.ligSprite.graphics.lineTo(
            _loc1_.x * this.m_physScale,
            _loc1_.y * this.m_physScale,
        );
    }

    public checkJoints() {
        var _loc1_: number = NaN;
        if (!this.mainJoint.broken) {
            _loc1_ = Math.abs(this.mainJoint.m_impulse);
            if (_loc1_ > 0.5) {
                this.breakJoint();
            }
        }
    }

    public breakJoint() {
        var _loc1_ = new b2BodyDef();
        var _loc2_ = new b2CircleDef();
        _loc2_.density = 1;
        _loc2_.friction = 0.3;
        _loc2_.restitution = 0.1;
        _loc2_.radius = 3 / this.character_scale;
        _loc2_.filter = this.ligFilter;
        var _loc3_: b2Vec2 = this.mainJoint.GetAnchor1();
        _loc1_.position.Set(_loc3_.x, _loc3_.y);
        _loc1_.fixedRotation = true;
        var _loc4_: b2Body = Settings.currentSession.m_world.CreateBody(_loc1_);
        _loc4_.CreateShape(_loc2_);
        _loc4_.SetMassFromShapes();
        _loc4_.SetLinearVelocity(this.upperBody.GetLinearVelocity());
        this.mainJoint.broken = true;
        this.mainJoint.m_body1 = _loc4_;
        this.mainJoint.m_localAnchor1.Set(0, 0);
        if (this.antiGrav) {
            this.antiGrav.push(_loc4_);
        }
        SoundController.instance.playAreaSoundInstance("LigTear2", _loc4_);
    }

    public remoteBreak() {
        var _loc1_ = new b2BodyDef();
        var _loc2_ = new b2CircleDef();
        _loc2_.density = 1;
        _loc2_.friction = 0.3;
        _loc2_.restitution = 0.1;
        _loc2_.radius = 3 / this.character_scale;
        _loc2_.filter = this.ligFilter;
        var _loc3_: b2World = Settings.currentSession.m_world;
        var _loc4_: b2Vec2 = this.mainJoint.GetAnchor1();
        _loc1_.position.Set(_loc4_.x, _loc4_.y);
        _loc1_.fixedRotation = true;
        var _loc5_: b2Body = _loc3_.CreateBody(_loc1_);
        _loc5_.CreateShape(_loc2_);
        _loc5_.SetMassFromShapes();
        _loc5_.SetLinearVelocity(this.upperBody.GetLinearVelocity());
        var _loc6_: b2Body = this.mainJoint.m_body2;
        Settings.currentSession.m_world.DestroyJoint(this.mainJoint);
        var _loc7_ = new b2DistanceJointDef();
        var _loc8_: number = this.ligamentLength / this.character_scale;
        _loc7_.Initialize(
            _loc5_,
            _loc6_,
            _loc5_.GetPosition(),
            _loc6_.GetPosition(),
        );
        _loc7_.length = _loc8_;
        _loc7_.collideConnected = false;
        this.mainJoint = _loc3_.CreateJoint(_loc7_) as b2DistanceJoint;
        this.mainJoint.broken = true;
        this.ligJoints[0] = this.mainJoint;
        if (this.antiGrav) {
            this.antiGrav.push(_loc5_);
        }
        SoundController.instance.playAreaSoundInstance("LigTear2", _loc5_);
    }

    public die() {
        if (this.ligSprite) {
            this.ligSprite.parent.removeChild(this.ligSprite);
            this.ligSprite = null;
        }
        if (this.antiGrav) {
            this.antiGrav = null;
        }
    }
}