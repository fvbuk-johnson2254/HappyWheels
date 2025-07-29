import b2PolygonDef from "@/Box2D/Collision/Shapes/b2PolygonDef";
import b2Shape from "@/Box2D/Collision/Shapes/b2Shape";
import b2ContactPoint from "@/Box2D/Collision/b2ContactPoint";
import b2Mat22 from "@/Box2D/Common/Math/b2Mat22";
import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import b2Body from "@/Box2D/Dynamics/b2Body";
import ContactListener from "@/com/totaljerkface/game/ContactListener";
import Session from "@/com/totaljerkface/game/Session";
import Settings from "@/com/totaljerkface/game/Settings";
import FanRef from "@/com/totaljerkface/game/editor/specials/FanRef";
import Special from "@/com/totaljerkface/game/editor/specials/Special";
import LevelItem from "@/com/totaljerkface/game/level/LevelItem";
import Trigger from "@/com/totaljerkface/game/level/Trigger";
import AreaSoundLoopStatic from "@/com/totaljerkface/game/sound/AreaSoundLoopStatic";
import SoundController from "@/com/totaljerkface/game/sound/SoundController";
import FanMC from "@/top/FanMC";
import { boundClass } from 'autobind-decorator';
import Sprite from "flash/display/Sprite";
import Point from "flash/geom/Point";

@boundClass
export default class Fan extends LevelItem {
    private mc: FanMC;
    private sensor: b2Shape;
    private bodies: any[];
    private angle: number;
    private center: b2Vec2;
    private sinVal: number;
    private cosVal: number;
    private fanSound: AreaSoundLoopStatic;
    private fanVec: b2Vec2;

    constructor(param1: Special) {
        super();
        var _loc2_: FanRef = param1 as FanRef;
        this.angle = (_loc2_.rotation * Math.PI) / 180;
        this.sinVal = Math.sin(this.angle);
        this.cosVal = Math.cos(this.angle);
        this.createBodies(new b2Vec2(_loc2_.x, _loc2_.y), this.angle);
        this.mc = new FanMC();
        this.mc.x = _loc2_.x;
        this.mc.y = _loc2_.y;
        this.mc.rotation = _loc2_.rotation;
        var _loc3_: Sprite = Settings.currentSession.level.background;
        _loc3_.addChild(this.mc);
        this.bodies = new Array();
        Settings.currentSession.level.actionsVector.push(this);
        Settings.currentSession.contactListener.registerListener(
            ContactListener.PERSIST,
            this.sensor,
            this.checkPersist,
        );
        this.fanVec = new b2Vec2(
            _loc2_.x / this.m_physScale,
            _loc2_.y / this.m_physScale,
        );
        this.fanSound = SoundController.instance.playAreaSoundLoopStatic(
            "SwooshFan",
            new Point(this.fanVec.x, this.fanVec.y),
        );
    }

    public createBodies(param1: b2Vec2, param2: number) {
        var _loc8_: b2Vec2 = null;
        var _loc3_ = new b2PolygonDef();
        _loc3_.isSensor = true;
        _loc3_.filter.categoryBits = 8;
        if (Settings.currentSession.version > 1.42) {
            _loc3_.filter.groupIndex = -20;
        }
        var _loc4_: b2Body = Settings.currentSession.level.levelBody;
        this.center = new b2Vec2(
            (param1.x + Math.sin(param2) * 300) / this.m_physScale,
            (param1.y - Math.cos(param2) * 300) / this.m_physScale,
        );
        _loc3_.SetAsOrientedBox(
            150 / this.m_physScale,
            250 / this.m_physScale,
            this.center,
            param2,
        );
        this.sensor = _loc4_.CreateShape(_loc3_);
        _loc3_.isSensor = false;
        _loc3_.friction = 0.3;
        _loc3_.restitution = 0.1;
        _loc3_.filter.categoryBits = 8;
        _loc3_.filter.groupIndex = 0;
        _loc3_.SetAsOrientedBox(
            150 / this.m_physScale,
            25 / this.m_physScale,
            new b2Vec2(
                (param1.x - Math.sin(param2) * -25) / this.m_physScale,
                (param1.y + Math.cos(param2) * -25) / this.m_physScale,
            ),
            param2,
        );
        _loc4_.CreateShape(_loc3_);
        _loc3_.vertexCount = 7;
        _loc3_.vertices[0] = new b2Vec2(150 / this.m_physScale, 0);
        _loc3_.vertices[1] = new b2Vec2(
            125 / this.m_physScale,
            84.5 / this.m_physScale,
        );
        _loc3_.vertices[2] = new b2Vec2(
            65 / this.m_physScale,
            137 / this.m_physScale,
        );
        _loc3_.vertices[3] = new b2Vec2(0, 150 / this.m_physScale);
        _loc3_.vertices[4] = new b2Vec2(
            -65 / this.m_physScale,
            137 / this.m_physScale,
        );
        _loc3_.vertices[5] = new b2Vec2(
            -125 / this.m_physScale,
            84.5 / this.m_physScale,
        );
        _loc3_.vertices[6] = new b2Vec2(-150 / this.m_physScale, 0);
        var _loc5_ = new b2Mat22(this.angle);
        var _loc6_ = new b2Vec2(
            param1.x / this.m_physScale,
            param1.y / this.m_physScale,
        );
        var _loc7_: number = 0;
        while (_loc7_ < _loc3_.vertexCount) {
            _loc8_ = _loc3_.vertices[_loc7_];
            _loc8_.MulM(_loc5_);
            _loc8_.Add(_loc6_);
            _loc7_++;
        }
        _loc4_.CreateShape(_loc3_);
    }

    public override actions() {
        var _loc2_: b2Body = null;
        var _loc3_: b2Vec2 = null;
        var _loc4_: b2Vec2 = null;
        var _loc5_: number = NaN;
        var _loc6_: number = NaN;
        var _loc7_: number = NaN;
        if (this.bodies.length == 0) {
            return;
        }
        var _loc1_: number = 0;
        while (_loc1_ < this.bodies.length) {
            _loc2_ = this.bodies[_loc1_];
            _loc3_ = _loc2_.GetWorldCenter();
            _loc4_ = _loc3_.Copy();
            _loc4_.Subtract(this.center);
            _loc5_ =
                (_loc4_.x * -this.sinVal + _loc4_.y * this.cosVal) *
                this.m_physScale +
                250;
            _loc5_ = Math.max(_loc5_, 0);
            _loc5_ = Math.min(_loc5_, 250);
            _loc6_ = _loc5_ / 250;
            _loc7_ = _loc6_ * _loc6_ * 15;
            _loc2_.ApplyForce(
                new b2Vec2(this.sinVal * _loc7_, this.cosVal * -_loc7_),
                _loc3_,
            );
            _loc1_++;
        }
        this.bodies = new Array();
    }

    private checkPersist(param1: b2ContactPoint) {
        var _loc2_: b2Body = param1.shape2.GetBody();
        if (this.bodies.indexOf(_loc2_) > -1) {
            return;
        }
        this.bodies.push(_loc2_);
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
        Settings.currentSession.level.actionsVector.push(this);
        Settings.currentSession.contactListener.registerListener(
            ContactListener.PERSIST,
            this.sensor,
            this.checkPersist,
        );
        this.mc.blades.play();
        this.fanSound = SoundController.instance.playAreaSoundLoopStatic(
            "SwooshFan",
            new Point(this.fanVec.x, this.fanVec.y),
        );
    }

    public override prepareForTrigger() {
        var _loc1_: Session = Settings.currentSession;
        var _loc2_: Vector<LevelItem> = _loc1_.level.actionsVector;
        var _loc3_ = int(_loc2_.indexOf(this));
        _loc2_.splice(_loc3_, 1);
        _loc1_.contactListener.deleteListener(
            ContactListener.PERSIST,
            this.sensor,
        );
        this.mc.blades.gotoAndStop(2);
        this.fanSound.stopSound(true);
    }
}