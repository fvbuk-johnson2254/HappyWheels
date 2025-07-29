import b2PolygonDef from "@/Box2D/Collision/Shapes/b2PolygonDef";
import b2Shape from "@/Box2D/Collision/Shapes/b2Shape";
import b2AABB from "@/Box2D/Collision/b2AABB";
import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import b2Body from "@/Box2D/Dynamics/b2Body";
import b2BodyDef from "@/Box2D/Dynamics/b2BodyDef";
import Session from "@/com/totaljerkface/game/Session";
import Settings from "@/com/totaljerkface/game/Settings";
import ContactEvent from "@/com/totaljerkface/game/events/ContactEvent";
import SoundController from "@/com/totaljerkface/game/sound/SoundController";
import { boundClass } from 'autobind-decorator';
import DisplayObject from "flash/display/DisplayObject";
import EventDispatcher from "flash/events/EventDispatcher";

@boundClass
export default class EndBlock extends EventDispatcher {
    public session: Session;
    public m_physScale: number;
    public body: b2Body;
    public shape: b2Shape;
    public aabb: b2AABB;

    constructor() {
        super();
        this.session = Settings.currentSession;
        this.m_physScale = this.session.m_physScale;
        this.create();
    }

    private create() {
        var _loc1_ = new b2BodyDef();
        this.body = this.session.m_world.CreateBody(_loc1_);
        var _loc2_ = new b2PolygonDef();
        _loc2_.friction = 1;
        _loc2_.restitution = 0.1;
        _loc2_.filter.categoryBits = 8;
        var _loc3_: DisplayObject = this.session.level.shapeGuide["end"];
        var _loc4_: number = (_loc3_.rotation * Math.PI) / 180;
        var _loc5_ = new b2Vec2();
        _loc5_.Set(_loc3_.x / this.m_physScale, _loc3_.y / this.m_physScale);
        var _loc6_: number = (_loc3_.scaleX * 5) / this.m_physScale;
        var _loc7_: number = (_loc3_.scaleY * 5) / this.m_physScale;
        _loc2_.SetAsOrientedBox(_loc6_, _loc7_, _loc5_, _loc4_);
        this.shape = this.body.CreateShape(_loc2_);
        this.aabb = new b2AABB();
        this.aabb.lowerBound.Set(_loc5_.x - _loc6_, _loc5_.y - _loc6_ * 2);
        this.aabb.upperBound.Set(_loc5_.x + _loc6_, _loc5_.y);
        this.session.contactListener.registerListener(
            ContactEvent.RESULT,
            this.shape,
            this.checkEnd,
        );
    }

    private checkEnd(param1: ContactEvent) {
        var _loc2_: Session = Settings.currentSession;
        if (_loc2_.character.dead) {
            _loc2_.contactListener.deleteListener(
                ContactEvent.RESULT,
                this.shape,
            );
            return;
        }
        var _loc3_: b2Body = _loc2_.character.cameraFocus;
        var _loc4_: b2Vec2 = _loc3_.GetWorldCenter();
        if (
            _loc4_.x < this.aabb.upperBound.x &&
            _loc4_.x > this.aabb.lowerBound.x &&
            _loc4_.y < this.aabb.upperBound.y &&
            _loc4_.y > this.aabb.lowerBound.y
        ) {
            _loc2_.contactListener.deleteListener(
                ContactEvent.RESULT,
                this.shape,
            );
            if (!_loc2_.isReplay) {
                trace("session is not replay");
                _loc2_.levelComplete();
            }
            SoundController.instance.playSoundItem("Victory");
        }
    }

    public die() {
        this.session.contactListener.deleteListener(
            ContactEvent.RESULT,
            this.shape,
        );
    }
}