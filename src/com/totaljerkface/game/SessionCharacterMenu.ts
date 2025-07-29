import b2PolygonDef from "@/Box2D/Collision/Shapes/b2PolygonDef";
import b2AABB from "@/Box2D/Collision/b2AABB";
import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import b2Body from "@/Box2D/Dynamics/b2Body";
import b2BodyDef from "@/Box2D/Dynamics/b2BodyDef";
import b2DebugDraw from "@/Box2D/Dynamics/b2DebugDraw";
import b2World from "@/Box2D/Dynamics/b2World";
import ContactListener from "@/com/totaljerkface/game/ContactListener";
import Session from "@/com/totaljerkface/game/Session";
import Settings from "@/com/totaljerkface/game/Settings";
import StageCamera from "@/com/totaljerkface/game/StageCamera";
import ParticleController from "@/com/totaljerkface/game/particles/ParticleController";
import { boundClass } from 'autobind-decorator';
import Sprite from "flash/display/Sprite";
import Event from "flash/events/Event";
import TimerEvent from "flash/events/TimerEvent";
import Rectangle from "flash/geom/Rectangle";
import Timer from "flash/utils/Timer";

@boundClass
export default class SessionCharacterMenu extends Session {
    constructor(param1: Sprite) {
        super(Settings.CURRENT_VERSION, param1, null, 0);
    }

    protected override setupLevel(param1: Sprite) { }

    protected override getStartPoint(): b2Vec2 {
        switch (Settings.characterIndex) {
            case 1:
                return new b2Vec2(100, 80);
            case 2:
                return new b2Vec2(100, 40);
            case 3:
                return new b2Vec2(100, 65);
            case 4:
                return new b2Vec2(80, 90);
            case 5:
                return new b2Vec2(90, 65);
            case 6:
                return new b2Vec2(80, 70);
            case 7:
                return new b2Vec2(85, 75);
            case 8:
                return new b2Vec2(100, 70);
            case 9:
                return new b2Vec2(100, 40);
            case 10:
                return new b2Vec2(125, 70);
            case 11:
                return new b2Vec2(125, 80);
            default:
                return new b2Vec2(100, 100);
        }
    }

    public override create() {
        this._particleController = new ParticleController(
            this._containerSprite,
        );
        this.createWorld();
        trace("building character");
        this._character.create();
        this._camera = new StageCamera(
            this._containerSprite,
            this._character.cameraFocus,
            this,
        );
        this.setupTextFields();
        this.fpsText.visible = false;
        this._containerSprite.addChild(this.debug_sprite);
        this._character.paint();
        this.start();
    }

    protected override createWorld() {
        var _loc5_: b2DebugDraw = null;
        var _loc1_ = new b2AABB();
        var _loc2_ = new Rectangle(0, 0, 1000, 1000);
        _loc1_.lowerBound.Set(
            _loc2_.x / this.m_physScale,
            _loc2_.y / this.m_physScale,
        );
        _loc1_.upperBound.Set(
            (_loc2_.x + _loc2_.width) / this.m_physScale,
            (_loc2_.y + _loc2_.height) / this.m_physScale,
        );
        var _loc3_ = new b2Vec2(0, 10);
        var _loc4_: boolean = true;
        this.m_world = new b2World(_loc1_, _loc3_, _loc4_);
        _loc5_ = new b2DebugDraw();
        _loc5_.m_sprite = this.debug_sprite;
        _loc5_.m_drawScale = 62.5;
        _loc5_.m_fillAlpha = 0.3;
        _loc5_.m_lineThickness = 1;
        _loc5_.m_drawFlags = b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit;
        this._contactListener = new ContactListener();
        this.m_world.SetContactListener(this._contactListener);
        var _loc6_ = new b2BodyDef();
        var _loc7_ = new b2PolygonDef();
        _loc7_.friction = 1;
        _loc7_.restitution = 0.1;
        _loc7_.filter.categoryBits = 8;
        _loc7_.filter.groupIndex = -10;
        var _loc8_: b2Body = this.m_world.CreateBody(_loc6_);
        _loc7_.SetAsOrientedBox(
            80 / this.m_physScale,
            50 / this.m_physScale,
            new b2Vec2(100 / this.m_physScale, 225 / this.m_physScale),
        );
        _loc8_.CreateShape(_loc7_);
    }

    public override start() {
        this.paused = false;
        this.frames = 0;
        this._iteration = 0;
        this.addEventListener(Event.ENTER_FRAME, this.run);
        this.fpsTimer = new Timer(1000, 0);
        this.fpsTimer.addEventListener(TimerEvent.TIMER, this.setFps);
        this.fpsTimer.start();
    }

    protected override run(param1: Event) {
        this.frames += 1;
        this._character.preActions();
        this._character.doNothing();
        this._character.actions();
        this.m_world.Step(this.m_timeStep, this.m_iterations);
        this._character.handleContactBuffer();
        this._character.checkJoints();
        this._character.paint();
        this._particleController.step();
    }

    public override die() {
        this.removeEventListener(Event.ENTER_FRAME, this.run);
        if (this.fpsTimer) {
            this.fpsTimer.stop();
            this.fpsTimer.removeEventListener(TimerEvent.TIMER, this.setFps);
        }
        var _loc1_: b2Body = this.m_world.GetBodyList();
        while (_loc1_) {
            this.m_world.DestroyBody(_loc1_);
            _loc1_ = _loc1_.m_next;
        }
        this.m_world = null;
        this._character.die();
        this._character = null;
        this._particleController.die();
        this._particleController = null;
    }
}