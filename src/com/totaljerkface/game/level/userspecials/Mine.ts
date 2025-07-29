import b2PolygonDef from "@/Box2D/Collision/Shapes/b2PolygonDef";
import b2Shape from "@/Box2D/Collision/Shapes/b2Shape";
import b2AABB from "@/Box2D/Collision/b2AABB";
import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import b2Body from "@/Box2D/Dynamics/b2Body";
import b2BodyDef from "@/Box2D/Dynamics/b2BodyDef";
import b2World from "@/Box2D/Dynamics/b2World";
import Settings from "@/com/totaljerkface/game/Settings";
import MineRef from "@/com/totaljerkface/game/editor/specials/MineRef";
import Special from "@/com/totaljerkface/game/editor/specials/Special";
import ContactEvent from "@/com/totaljerkface/game/events/ContactEvent";
import LevelB2D from "@/com/totaljerkface/game/level/LevelB2D";
import LevelItem from "@/com/totaljerkface/game/level/LevelItem";
import Trigger from "@/com/totaljerkface/game/level/Trigger";
import SoundController from "@/com/totaljerkface/game/sound/SoundController";
import Explosion from "@/top/Explosion";
import MineMC from "@/top/MineMC";
import { boundClass } from 'autobind-decorator';
import MovieClip from "flash/display/MovieClip";
import Sprite from "flash/display/Sprite";

@boundClass
export default class Mine extends LevelItem {
    private mc: MovieClip;
    private body: b2Body;
    private sensor: b2Shape;

    constructor(param1: Special) {
        super();
        var _loc2_: MineRef = param1 as MineRef;
        this.createBody(
            new b2Vec2(_loc2_.x, _loc2_.y),
            (_loc2_.rotation * Math.PI) / 180,
        );
        this.mc = new MineMC();
        var _loc3_: Sprite = Settings.currentSession.level.background;
        _loc3_.addChild(this.mc);
        Settings.currentSession.contactListener.registerListener(
            ContactEvent.RESULT,
            this.sensor,
            this.checkContact,
        );
    }

    public createBody(param1: b2Vec2, param2: number) {
        var _loc3_: b2BodyDef = null;
        var _loc4_: b2PolygonDef = null;
        _loc3_ = new b2BodyDef();
        _loc4_ = new b2PolygonDef();
        _loc4_.density = 1;
        _loc4_.friction = 1;
        _loc4_.restitution = 0.1;
        _loc4_.filter.categoryBits = 8;
        _loc4_.SetAsBox(12.5 / this.m_physScale, 1 / this.m_physScale);
        _loc3_.position.Set(
            param1.x / this.m_physScale,
            param1.y / this.m_physScale,
        );
        _loc3_.angle = param2;
        this.body = Settings.currentSession.m_world.CreateBody(_loc3_);
        this.body.CreateShape(_loc4_);
        _loc4_.SetAsOrientedBox(
            1 / this.m_physScale,
            0.5 / this.m_physScale,
            new b2Vec2(0, -2.5 / this.m_physScale),
        );
        this.sensor = this.body.CreateShape(_loc4_);
        Settings.currentSession.level.paintItemVector.push(this);
        this.body.SetMassFromShapes();
    }

    public override paint() {
        var _loc1_: b2Vec2 = this.body.GetWorldCenter();
        this.mc.x = _loc1_.x * this.m_physScale;
        this.mc.y = _loc1_.y * this.m_physScale;
        this.mc.rotation =
            (this.body.GetAngle() * LevelItem.oneEightyOverPI) % 360;
    }

    public override actions() {
        var _loc1_: MovieClip = null;
        var _loc11_: b2Shape = null;
        var _loc12_: b2Body = null;
        var _loc13_: b2Vec2 = null;
        var _loc14_: b2Vec2 = null;
        var _loc15_: number = NaN;
        var _loc16_: number = NaN;
        var _loc17_: number = NaN;
        var _loc18_: number = NaN;
        var _loc19_: number = NaN;
        _loc1_ = new Explosion();
        _loc1_.x = this.mc.x;
        _loc1_.y = this.mc.y;
        _loc1_.scaleX = _loc1_.scaleY = 0.5;
        if (Math.random() > 0.5) {
            _loc1_.scaleX *= -1;
        }
        _loc1_.rotation = (this.body.GetAngle() * 180) / Math.PI;
        Settings.currentSession.containerSprite.addChildAt(_loc1_, 1);
        var _loc2_: b2World = Settings.currentSession.m_world;
        _loc2_.DestroyBody(this.body);
        this.mc.visible = false;
        var _loc3_ = new Array();
        var _loc4_: number = 2;
        var _loc5_ = new b2AABB();
        var _loc6_: b2Vec2 = this.body.GetWorldCenter();
        _loc5_.lowerBound.Set(_loc6_.x - _loc4_, _loc6_.y - _loc4_);
        _loc5_.upperBound.Set(_loc6_.x + _loc4_, _loc6_.y + _loc4_);
        var _loc7_: number = _loc2_.Query(_loc5_, _loc3_, 30);
        var _loc8_ = 10;
        var _loc9_: number = 0;
        while (_loc9_ < _loc3_.length) {
            _loc11_ = _loc3_[_loc9_];
            _loc12_ = _loc11_.GetBody();
            if (!_loc12_.IsStatic()) {
                _loc13_ = _loc12_.GetWorldCenter();
                _loc14_ = new b2Vec2(
                    _loc13_.x - _loc6_.x,
                    _loc13_.y - _loc6_.y,
                );
                _loc15_ = _loc14_.Length();
                _loc15_ = Math.min(_loc4_, _loc15_);
                _loc16_ = 1 - _loc15_ / _loc4_;
                _loc17_ = Math.atan2(_loc14_.y, _loc14_.x);
                _loc18_ = Math.cos(_loc17_) * _loc16_ * _loc8_;
                _loc19_ = Math.sin(_loc17_) * _loc16_ * _loc8_;
                _loc12_.ApplyImpulse(new b2Vec2(_loc18_, _loc19_), _loc13_);
            }
            _loc9_++;
        }
        SoundController.instance.playAreaSoundInstance(
            "MineExplosion",
            this.body,
        );
        var _loc10_: LevelB2D = Settings.currentSession.level;
        _loc10_.removeFromActionsVector(this);
        _loc10_.removeFromPaintItemVector(this);
    }

    public checkContact(param1: ContactEvent) {
        Settings.currentSession.contactListener.deleteListener(
            ContactEvent.RESULT,
            this.sensor,
        );
        Settings.currentSession.level.actionsVector.push(this);
        this.sensor = null;
    }

    public override triggerSingleActivation(
        param1: Trigger,
        param2: string,
        param3: any[],
    ) {
        if (this._triggered) {
            return;
        }
        this._triggered = true;
        if (this.sensor) {
            Settings.currentSession.contactListener.deleteListener(
                ContactEvent.RESULT,
                this.sensor,
            );
            this.sensor = null;
            this.actions();
        }
    }

    public override get bodyList(): any[] {
        if (this.body) {
            return [this.body];
        }
        return [];
    }
}