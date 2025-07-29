import b2PolygonDef from "@/Box2D/Collision/Shapes/b2PolygonDef";
import b2Shape from "@/Box2D/Collision/Shapes/b2Shape";
import b2ContactPoint from "@/Box2D/Collision/b2ContactPoint";
import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import b2Body from "@/Box2D/Dynamics/b2Body";
import ContactListener from "@/com/totaljerkface/game/ContactListener";
import Session from "@/com/totaljerkface/game/Session";
import Settings from "@/com/totaljerkface/game/Settings";
import BoostRef from "@/com/totaljerkface/game/editor/specials/BoostRef";
import Special from "@/com/totaljerkface/game/editor/specials/Special";
import LevelItem from "@/com/totaljerkface/game/level/LevelItem";
import Trigger from "@/com/totaljerkface/game/level/Trigger";
import AreaSoundLoop from "@/com/totaljerkface/game/sound/AreaSoundLoop";
import SoundController from "@/com/totaljerkface/game/sound/SoundController";
import BoostPanelMC from "@/top/BoostPanelMC";
import BoostPanelOffMC from "@/top/BoostPanelOffMC";
import { boundClass } from 'autobind-decorator';
import DisplayObject from "flash/display/DisplayObject";
import MovieClip from "flash/display/MovieClip";
import Sprite from "flash/display/Sprite";

@boundClass
export default class Boost extends LevelItem {
    private mc: Sprite;
    private sensor: b2Shape;
    private bodies: any[];
    private angle: number;
    private sinVal: number;
    private cosVal: number;
    private power: number = 20;
    private sound: AreaSoundLoop;
    private soundBody: b2Body;
    private numPanels: number;

    constructor(param1: Special) {
        super();
        var _loc2_: BoostRef = param1 as BoostRef;
        this.power = _loc2_.boostPower;
        this.angle = ((_loc2_.rotation + 90) * Math.PI) / 180;
        this.sinVal = Math.sin(this.angle);
        this.cosVal = Math.cos(this.angle);
        this.createBodies(
            new b2Vec2(_loc2_.x, _loc2_.y),
            (_loc2_.rotation * Math.PI) / 180,
            _loc2_.numPanels,
        );
        this.mc = new Sprite();
        this.mc.x = _loc2_.x;
        this.mc.y = _loc2_.y;
        this.mc.rotation = _loc2_.rotation;
        this.numPanels = _loc2_.numPanels;
        this.setupMC();
        var _loc3_: Sprite = Settings.currentSession.level.foreground;
        _loc3_.addChild(this.mc);
        this.bodies = new Array();
        Settings.currentSession.level.actionsVector.push(this);
        Settings.currentSession.contactListener.registerListener(
            ContactListener.PERSIST,
            this.sensor,
            this.checkPersist,
        );
    }

    private setupMC() {
        var _loc2_: number = 0;
        var _loc4_: MovieClip = null;
        var _loc1_: number = this.numPanels * -90;
        _loc2_ = 1;
        var _loc3_: number = 0;
        while (_loc3_ < this.numPanels) {
            _loc4_ = new BoostPanelMC();
            this.mc.addChild(_loc4_);
            _loc4_.x = _loc1_;
            _loc1_ += 180;
            _loc4_.gotoAndPlay(_loc2_);
            _loc2_ -= 4;
            if (_loc2_ <= 0) {
                _loc2_ = 18 + _loc2_;
            }
            _loc3_++;
        }
    }

    public createBodies(param1: b2Vec2, param2: number, param3: number) {
        var _loc4_ = new b2PolygonDef();
        _loc4_.filter.categoryBits = 8;
        if (Settings.currentSession.version > 1.42) {
            _loc4_.filter.groupIndex = -20;
        }
        _loc4_.isSensor = true;
        _loc4_.SetAsOrientedBox(
            (90 * param3) / this.m_physScale,
            90 / this.m_physScale,
            new b2Vec2(
                param1.x / this.m_physScale,
                param1.y / this.m_physScale,
            ),
            param2,
        );
        this.sensor =
            Settings.currentSession.level.levelBody.CreateShape(_loc4_);
    }

    public override actions() {
        var _loc3_: b2Body = null;
        var _loc4_: b2Vec2 = null;
        var _loc5_: number = NaN;
        if (this.bodies.length == 0) {
            if (this.sound) {
                this.sound.fadeOut(0.2);
                this.sound = null;
            }
            return;
        }
        var _loc1_: boolean =
            this.bodies.indexOf(this.soundBody) > -1 ? true : false;
        var _loc2_: number = 0;
        while (_loc2_ < this.bodies.length) {
            _loc3_ = this.bodies[_loc2_];
            _loc4_ = _loc3_.GetWorldCenter();
            _loc5_ = this.power * _loc3_.GetMass();
            _loc3_.ApplyForce(
                new b2Vec2(this.sinVal * _loc5_, this.cosVal * -_loc5_),
                _loc4_,
            );
            _loc2_++;
        }
        if (!_loc1_) {
            if (this.sound) {
                this.sound.fadeOut(0.2);
                this.sound = null;
                this.soundBody = null;
            }
            this.soundBody = this.bodies[0];
            this.sound = SoundController.instance.playAreaSoundLoop(
                "BoostLoop",
                this.soundBody,
                0,
            );
            this.sound.fadeIn(0.2);
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
        var _loc4_: DisplayObject = null;
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
        while (this.mc.numChildren > 0) {
            _loc4_ = this.mc.getChildAt(0);
            this.mc.removeChild(_loc4_);
        }
        this.setupMC();
    }

    public override prepareForTrigger() {
        var _loc6_: DisplayObject = null;
        var _loc7_: MovieClip = null;
        var _loc1_: Session = Settings.currentSession;
        var _loc2_: Vector<LevelItem> = _loc1_.level.actionsVector;
        var _loc3_ = int(_loc2_.indexOf(this));
        _loc2_.splice(_loc3_, 1);
        _loc1_.contactListener.deleteListener(
            ContactListener.PERSIST,
            this.sensor,
        );
        while (this.mc.numChildren > 0) {
            _loc6_ = this.mc.getChildAt(0);
            this.mc.removeChild(_loc6_);
        }
        var _loc4_: number = this.numPanels * -90;
        var _loc5_: number = 0;
        while (_loc5_ < this.numPanels) {
            _loc7_ = new BoostPanelOffMC();
            this.mc.addChild(_loc7_);
            _loc7_.x = _loc4_;
            _loc4_ += 180;
            _loc5_++;
        }
    }
}