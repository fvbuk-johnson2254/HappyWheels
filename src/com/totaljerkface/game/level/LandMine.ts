import b2PolygonDef from "@/Box2D/Collision/Shapes/b2PolygonDef";
import b2Shape from "@/Box2D/Collision/Shapes/b2Shape";
import b2AABB from "@/Box2D/Collision/b2AABB";
import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import b2Body from "@/Box2D/Dynamics/b2Body";
import b2BodyDef from "@/Box2D/Dynamics/b2BodyDef";
import b2World from "@/Box2D/Dynamics/b2World";
import Settings from "@/com/totaljerkface/game/Settings";
import ContactEvent from "@/com/totaljerkface/game/events/ContactEvent";
import LevelB2D from "@/com/totaljerkface/game/level/LevelB2D";
import LevelItem from "@/com/totaljerkface/game/level/LevelItem";
import SoundController from "@/com/totaljerkface/game/sound/SoundController";
import Explosion from "@/top/Explosion";
import { boundClass } from 'autobind-decorator';
import MovieClip from "flash/display/MovieClip";
import Sprite from "flash/display/Sprite";

@boundClass
export default class LandMine extends LevelItem {
    private mc: MovieClip;
    private id: string;
    private body: b2Body;
    private sensor: b2Shape;
    private hit: boolean;

    constructor(param1: string) {
        super();
        this.id = param1;
        this.createBody();
        this.mc = Settings.currentSession.level.background[param1 + "mc"];
        this.mc.visible = true;
        Settings.currentSession.contactListener.registerListener(
            ContactEvent.RESULT,
            this.sensor,
            this.checkContact,
        );
    }

    public createBody() {
        var _loc1_: b2BodyDef = null;
        var _loc2_: b2PolygonDef = null;
        _loc1_ = new b2BodyDef();
        _loc2_ = new b2PolygonDef();
        _loc2_.density = 1;
        _loc2_.friction = 1;
        _loc2_.restitution = 0.1;
        _loc2_.filter.categoryBits = 8;
        var _loc3_: MovieClip =
            Settings.currentSession.level.shapeGuide.getChildByName(
                this.id,
            ) as MovieClip;
        var _loc4_: number = (_loc3_.rotation * Math.PI) / 180;
        _loc2_.SetAsBox(
            (_loc3_.scaleX * 5) / this.m_physScale,
            (_loc3_.scaleY * 5) / this.m_physScale,
        );
        _loc1_.position.Set(
            _loc3_.x / this.m_physScale,
            _loc3_.y / this.m_physScale,
        );
        _loc1_.angle = _loc4_;
        this.body = Settings.currentSession.m_world.CreateBody(_loc1_);
        this.sensor = this.body.CreateShape(_loc2_);
    }

    public override paint() {
        var _loc1_: b2Vec2 = null;
        _loc1_ = this.body.GetWorldCenter();
        this.mc.x = _loc1_.x * this.m_physScale;
        this.mc.y = _loc1_.y * this.m_physScale;
        this.mc.rotation = this.body.GetAngle() * (180 / Math.PI);
    }

    public override actions() {
        var _loc2_: Sprite = null;
        var _loc3_: MovieClip = null;
        var _loc13_: b2Shape = null;
        var _loc14_: b2Body = null;
        var _loc15_: b2Vec2 = null;
        var _loc16_: b2Vec2 = null;
        var _loc17_: number = NaN;
        var _loc18_: number = NaN;
        var _loc19_: number = NaN;
        var _loc20_: number = NaN;
        var _loc21_: number = NaN;
        var _loc1_: b2World = Settings.currentSession.m_world;
        _loc2_ = Settings.currentSession.containerSprite;
        _loc1_.DestroyBody(this.body);
        this.mc.visible = false;
        _loc3_ = new Explosion();
        _loc3_.x = this.mc.x;
        _loc3_.y = this.mc.y;
        _loc3_.scaleX = _loc3_.scaleY = 0.5;
        _loc2_.addChildAt(_loc3_, 1);
        var _loc4_ = new Array();
        var _loc5_: number = 2;
        var _loc6_ = new b2AABB();
        var _loc7_: b2Vec2 = this.body.GetWorldCenter();
        _loc6_.lowerBound.Set(_loc7_.x - _loc5_, _loc7_.y - _loc5_);
        _loc6_.upperBound.Set(_loc7_.x + _loc5_, _loc7_.y + _loc5_);
        var _loc8_: number = _loc1_.Query(_loc6_, _loc4_, 30);
        var _loc9_ = 8;
        var _loc10_ = 8;
        var _loc11_: number = 0;
        while (_loc11_ < _loc4_.length) {
            _loc13_ = _loc4_[_loc11_];
            _loc14_ = _loc13_.GetBody();
            if (!_loc14_.IsStatic()) {
                _loc15_ = _loc14_.GetWorldCenter();
                _loc16_ = new b2Vec2(
                    _loc15_.x - _loc7_.x,
                    _loc15_.y - _loc7_.y,
                );
                _loc17_ = _loc16_.Length();
                _loc17_ = Math.min(_loc5_, _loc17_);
                _loc18_ = 1 - _loc17_ / _loc5_;
                _loc19_ = Math.atan2(_loc16_.y, _loc16_.x);
                _loc20_ = Math.cos(_loc19_) * _loc18_ * _loc9_;
                _loc21_ = Math.sin(_loc19_) * _loc18_ * _loc10_;
                _loc14_.ApplyImpulse(new b2Vec2(_loc20_, _loc21_), _loc15_);
            }
            _loc11_++;
        }
        SoundController.instance.playAreaSoundInstance(
            "MineExplosion",
            this.body,
        );
        var _loc12_: LevelB2D = Settings.currentSession.level;
        _loc12_.removeFromActionsVector(this);
    }

    public checkContact(param1: ContactEvent) {
        Settings.currentSession.contactListener.deleteListener(
            ContactEvent.RESULT,
            this.sensor,
        );
        Settings.currentSession.level.actionsVector.push(this);
    }
}