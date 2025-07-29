import b2PolygonDef from "@/Box2D/Collision/Shapes/b2PolygonDef";
import b2Shape from "@/Box2D/Collision/Shapes/b2Shape";
import b2AABB from "@/Box2D/Collision/b2AABB";
import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import b2Body from "@/Box2D/Dynamics/b2Body";
import Session from "@/com/totaljerkface/game/Session";
import Settings from "@/com/totaljerkface/game/Settings";
import FinishLineRef from "@/com/totaljerkface/game/editor/specials/FinishLineRef";
import Special from "@/com/totaljerkface/game/editor/specials/Special";
import ContactEvent from "@/com/totaljerkface/game/events/ContactEvent";
import LevelB2D from "@/com/totaljerkface/game/level/LevelB2D";
import LevelItem from "@/com/totaljerkface/game/level/LevelItem";
import ParticleController from "@/com/totaljerkface/game/particles/ParticleController";
import SoundController from "@/com/totaljerkface/game/sound/SoundController";
import FinishLineMC from "@/top/FinishLineMC";
import SparksMC from "@/top/SparksMC";
import { boundClass } from 'autobind-decorator';
import Sprite from "flash/display/Sprite";

@boundClass
export default class FinishLine extends LevelItem {
    private static idCounter: number;
    private mc: FinishLineMC;
    private id: string;
    private shape: b2Shape;
    private aabb: b2AABB;
    private sparkCoords: b2Vec2;

    constructor(param1: Special) {
        super();
        var _loc2_: FinishLineRef = param1 as FinishLineRef;
        this.createBodies(new b2Vec2(_loc2_.x, _loc2_.y));
        trace(_loc2_.x + " " + _loc2_.y);
        this.mc = new FinishLineMC();
        this.mc.x = _loc2_.x;
        this.mc.y = _loc2_.y;
        this.mc.rotation = _loc2_.rotation;
        var _loc3_: LevelB2D = Settings.currentSession.level;
        var _loc4_: Sprite = _loc3_.background;
        _loc4_.addChild(this.mc);
        _loc3_.foreground.addChild(this.mc.flag);
        this.mc.flag.x = _loc2_.x - 200;
        this.mc.flag.y = _loc2_.y - 220;
        Settings.currentSession.particleController.createBMDArray(
            "sparks",
            new SparksMC(),
        );
        Settings.currentSession.contactListener.registerListener(
            ContactEvent.RESULT,
            this.shape,
            this.checkResult,
        );
    }

    public createBodies(param1: b2Vec2) {
        var _loc2_ = new b2PolygonDef();
        _loc2_.friction = 0.3;
        _loc2_.restitution = 0.1;
        _loc2_.filter.categoryBits = 8;
        _loc2_.SetAsOrientedBox(
            200 / this.m_physScale,
            20 / this.m_physScale,
            new b2Vec2(
                param1.x / this.m_physScale,
                param1.y / this.m_physScale,
            ),
            0,
        );
        this.shape =
            Settings.currentSession.level.levelBody.CreateShape(_loc2_);
        this.aabb = new b2AABB();
        this.aabb.lowerBound = new b2Vec2(
            (param1.x - 200) / this.m_physScale,
            (param1.y - 200) / this.m_physScale,
        );
        this.aabb.upperBound = new b2Vec2(
            (param1.x + 200) / this.m_physScale,
            param1.y / this.m_physScale,
        );
        this.sparkCoords = new b2Vec2(param1.x - 196, param1.y - 230);
        Settings.currentSession.level.keepVector.push(this);
    }

    private checkResult(param1: ContactEvent) {
        var _loc5_: number = 0;
        var _loc6_: ParticleController = null;
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
            _loc5_ = _loc2_.containerSprite.getChildIndex(
                _loc2_.level.foreground,
            );
            _loc6_ = _loc2_.particleController;
            _loc6_.createPointFlow(
                "sparks",
                this.sparkCoords.x,
                this.sparkCoords.y,
                2,
                5,
                -65,
                1000,
                _loc5_,
            );
            _loc6_.createPointFlow(
                "sparks",
                this.sparkCoords.x,
                this.sparkCoords.y,
                2,
                5,
                -115,
                1000,
                _loc5_,
            );
            SoundController.instance.playSoundItem("Victory");
        }
    }
}