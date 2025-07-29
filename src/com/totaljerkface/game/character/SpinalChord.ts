import b2CircleDef from "@/Box2D/Collision/Shapes/b2CircleDef";
import b2CircleShape from "@/Box2D/Collision/Shapes/b2CircleShape";
import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import b2Body from "@/Box2D/Dynamics/b2Body";
import b2BodyDef from "@/Box2D/Dynamics/b2BodyDef";
import b2World from "@/Box2D/Dynamics/b2World";
import b2DistanceJoint from "@/Box2D/Dynamics/Joints/b2DistanceJoint";
import b2DistanceJointDef from "@/Box2D/Dynamics/Joints/b2DistanceJointDef";
import CharacterB2D from "@/com/totaljerkface/game/character/CharacterB2D";
import SantaClaus from "@/com/totaljerkface/game/character/SantaClaus";
import SleighElf from "@/com/totaljerkface/game/character/SleighElf";
import SoundController from "@/com/totaljerkface/game/sound/SoundController";
import { boundClass } from 'autobind-decorator';
import MovieClip from "flash/display/MovieClip";
import Sprite from "flash/display/Sprite";

@boundClass
export default class SpinalChord {
    private character: CharacterB2D;
    private totalVertebrae: number;
    private spineLength: number;
    private spineSprite: Sprite;
    private chestBody: b2Body;
    private head1Body: b2Body;
    private neckVertebraJoint: b2DistanceJoint;
    private vertebraHeadJoint: b2DistanceJoint;
    private vertebraJoints: any[];
    private spineMCs: any[];
    private m_physScale: number;
    private lineThickness: number = 1;
    private lineColor: number = 16711680;
    private lineAlpha: number = 1;
    private antiGrav: any[];

    constructor(param1: CharacterB2D, param2: number, param3: number) {
        var _loc4_: SantaClaus = null;
        var _loc5_: SleighElf = null;

        this.character = param1;
        this.totalVertebrae = param2;
        this.spineLength = param3;
        this.spineMCs = param1.spineMCs;
        this.m_physScale = param1.m_physScale;
        this.chestBody = param1.chestBody;
        this.head1Body = param1.head1Body;
        if (param1 instanceof SantaClaus) {
            _loc4_ = param1 as SantaClaus;
            this.antiGrav = _loc4_.antiGravArray;
        } else if (param1 instanceof SleighElf) {
            _loc5_ = param1 as SleighElf;
            this.antiGrav = _loc5_.antiGravArray;
        }
        this.create();
    }

    private create() {
        var _loc3_ = undefined;
        var _loc19_: b2Body = null;
        var _loc20_: b2Body = null;
        var _loc21_: b2Body = null;
        var _loc22_: MovieClip = null;
        var _loc1_: b2World = this.character.session.m_world;
        var _loc2_ = this.character.character_scale;
        _loc3_ = this.character.mc_scale;
        var _loc4_ = new b2BodyDef();
        var _loc5_ = new b2CircleDef();
        _loc5_.density = 1;
        _loc5_.friction = 0.3;
        _loc5_.restitution = 0.1;
        _loc5_.radius = 5 / _loc2_;
        _loc5_.filter = this.character.zeroFilter;
        var _loc6_: number = (
            this.head1Body.GetShapeList() as b2CircleShape
        ).GetRadius();
        var _loc7_: number = this.head1Body.GetAngle() + Math.PI / 2;
        var _loc8_: b2Vec2 = this.head1Body.GetWorldPoint(
            new b2Vec2(0, _loc6_),
        );
        var _loc9_: MovieClip = this.character.shapeGuide["spineAnchor"];
        var _loc10_: b2Vec2 = this.chestBody.GetWorldPoint(
            new b2Vec2(_loc9_.x / _loc2_, _loc9_.y / _loc2_),
        );
        var _loc11_: number = _loc8_.x - _loc10_.x;
        var _loc12_: number = _loc8_.y - _loc10_.y;
        var _loc13_: number = _loc11_ / (this.totalVertebrae + 1);
        var _loc14_: number = _loc12_ / (this.totalVertebrae + 1);
        var _loc15_ = new Array();
        var _loc16_: number = 1;
        while (_loc16_ <= this.totalVertebrae) {
            _loc4_.position.Set(
                _loc10_.x + _loc13_ * _loc16_,
                _loc10_.y + _loc14_ * _loc16_,
            );
            _loc4_.fixedRotation = true;
            _loc19_ = _loc1_.CreateBody(_loc4_);
            _loc19_.CreateShape(_loc5_);
            _loc19_.SetMassFromShapes();
            _loc19_.SetLinearVelocity(this.head1Body.GetLinearVelocity());
            _loc15_.push(_loc19_);
            _loc16_++;
        }
        if (this.antiGrav) {
            _loc16_ = 0;
            while (_loc16_ < this.totalVertebrae) {
                this.antiGrav.push(_loc15_[_loc16_]);
                _loc16_++;
            }
        }
        var _loc17_ = new b2DistanceJointDef();
        var _loc18_: number = this.spineLength / _loc2_;
        _loc17_.Initialize(
            this.chestBody,
            _loc15_[0],
            _loc10_,
            _loc15_[0].GetPosition(),
        );
        _loc17_.length = _loc18_;
        _loc17_.collideConnected = false;
        this.neckVertebraJoint = _loc1_.CreateJoint(_loc17_) as b2DistanceJoint;
        this.vertebraJoints = new Array();
        _loc16_ = 0;
        while (_loc16_ <= this.totalVertebrae - 2) {
            _loc20_ = _loc15_[_loc16_];
            _loc21_ = _loc15_[_loc16_ + 1];
            _loc17_.Initialize(
                _loc20_,
                _loc21_,
                _loc20_.GetPosition(),
                _loc21_.GetPosition(),
            );
            _loc17_.length = _loc18_;
            _loc17_.collideConnected = false;
            this.vertebraJoints.push(
                _loc1_.CreateJoint(_loc17_) as b2DistanceJoint,
            );
            _loc16_++;
        }
        _loc20_ = _loc15_[this.totalVertebrae - 1];
        _loc17_.Initialize(
            _loc20_,
            this.head1Body,
            _loc20_.GetPosition(),
            _loc8_,
        );
        _loc17_.length = _loc18_;
        _loc17_.collideConnected = false;
        this.vertebraHeadJoint = _loc1_.CreateJoint(_loc17_) as b2DistanceJoint;
        _loc16_ = 0;
        while (_loc16_ < this.spineMCs.length) {
            _loc22_ = this.spineMCs[_loc16_];
            _loc22_.x = -200;
            _loc22_.y = -200;
            _loc22_.visible = true;
            var _loc23_ = 1 / _loc3_;
            _loc22_.scaleY = 1 / _loc3_;
            _loc22_.scaleX = _loc23_;
            _loc16_++;
        }
        this.spineSprite = new Sprite();
        this.character.session.containerSprite.addChildAt(
            this.spineSprite,
            this.character.session.containerSprite.getChildIndex(
                this.spineMCs[0],
            ),
        );
    }

    public paint() {
        var _loc2_: b2Vec2 = null;
        var _loc3_: b2DistanceJoint = null;
        var _loc4_: MovieClip = null;
        var _loc5_: b2Vec2 = null;
        var _loc6_: number = NaN;
        this.spineSprite.graphics.clear();
        this.spineSprite.graphics.lineStyle(
            this.lineThickness,
            this.lineColor,
            this.lineAlpha,
        );
        if (this.neckVertebraJoint) {
            _loc2_ = this.neckVertebraJoint.GetAnchor1();
            this.spineSprite.graphics.moveTo(
                _loc2_.x * this.m_physScale,
                _loc2_.y * this.m_physScale,
            );
            _loc2_ = this.vertebraJoints[0].GetBody1().GetPosition();
            this.spineSprite.graphics.lineTo(
                _loc2_.x * this.m_physScale,
                _loc2_.y * this.m_physScale,
            );
        } else {
            _loc2_ = this.vertebraJoints[0].GetBody1().GetPosition();
            this.spineSprite.graphics.moveTo(
                _loc2_.x * this.m_physScale,
                _loc2_.y * this.m_physScale,
            );
        }
        var _loc1_: number = 0;
        while (_loc1_ < this.vertebraJoints.length) {
            _loc3_ = this.vertebraJoints[_loc1_];
            _loc4_ = this.spineMCs[_loc1_];
            _loc2_ = _loc3_.GetBody1().GetPosition();
            _loc4_.x = _loc2_.x * this.m_physScale;
            _loc4_.y = _loc2_.y * this.m_physScale;
            _loc5_ = _loc3_.GetBody2().GetPosition();
            _loc6_ = Math.atan2(_loc2_.y - _loc5_.y, _loc2_.x - _loc5_.x);
            _loc4_.rotation = _loc6_ * (180 / Math.PI);
            this.spineSprite.graphics.lineTo(
                _loc5_.x * this.m_physScale,
                _loc5_.y * this.m_physScale,
            );
            _loc1_++;
        }
        _loc4_ = this.spineMCs[_loc1_];
        _loc2_ = _loc5_;
        _loc4_.x = _loc2_.x * this.m_physScale;
        _loc4_.y = _loc2_.y * this.m_physScale;
        if (this.vertebraHeadJoint) {
            _loc5_ = this.vertebraHeadJoint.GetAnchor2();
            _loc6_ = Math.atan2(_loc2_.y - _loc5_.y, _loc2_.x - _loc5_.x);
            _loc4_.rotation = _loc6_ * (180 / Math.PI);
            this.spineSprite.graphics.lineTo(
                _loc5_.x * this.m_physScale,
                _loc5_.y * this.m_physScale,
            );
        } else {
            _loc4_.rotation = this.spineMCs[_loc1_ - 1].rotation;
        }
    }

    public spineBreak1(param1: number) {
        if (this.neckVertebraJoint == null) {
            return;
        }
        this.neckVertebraJoint.broken = true;
        this.character.session.m_world.DestroyJoint(this.neckVertebraJoint);
        this.neckVertebraJoint = null;
        SoundController.instance.playAreaSoundInstance(
            "LigTear1",
            this.chestBody,
        );
    }

    public spineBreak2(param1: number) {
        if (this.vertebraHeadJoint == null) {
            return;
        }
        this.vertebraHeadJoint.broken = true;
        this.character.session.m_world.DestroyJoint(this.vertebraHeadJoint);
        this.vertebraHeadJoint = null;
    }

    public checkJoints() {
        this.checkDistJoint(this.neckVertebraJoint, 0.5, this.spineBreak1);
        this.checkDistJoint(this.vertebraHeadJoint, 0.5, this.spineBreak2);
    }

    private checkDistJoint(param1: b2DistanceJoint, param2: number, param3) {
        var _loc4_: number = NaN;
        if (Boolean(param1) && !param1.broken) {
            _loc4_ = Math.abs(param1.m_impulse);
            if (_loc4_ > param2) {
                param3(_loc4_);
            }
        }
    }

    public die() {
        this.spineSprite.parent.removeChild(this.spineSprite);
        this.spineSprite = null;
        if (this.antiGrav) {
            this.antiGrav = null;
        }
    }
}