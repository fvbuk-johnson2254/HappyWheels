import b2AABB from "@/Box2D/Collision/b2AABB";
import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import b2Body from "@/Box2D/Dynamics/b2Body";
import b2DebugDraw from "@/Box2D/Dynamics/b2DebugDraw";
import b2World from "@/Box2D/Dynamics/b2World";
import CharacterB2D from "@/com/totaljerkface/game/character/CharacterB2D";
import HelicopterMan from "@/com/totaljerkface/game/character/HelicopterMan";
import IrresponsibleDad from "@/com/totaljerkface/game/character/IrresponsibleDad";
import IrresponsibleMom from "@/com/totaljerkface/game/character/IrresponsibleMom";
import LawnMowerMan from "@/com/totaljerkface/game/character/LawnMowerMan";
import MiddleAgedExplorer from "@/com/totaljerkface/game/character/MiddleAgedExplorer";
import MopedCouple from "@/com/totaljerkface/game/character/MopedCouple";
import MotorCart from "@/com/totaljerkface/game/character/MotorCart";
import MotorCartV111 from "@/com/totaljerkface/game/character/MotorCartV111";
import PlayableCharacterB2D from "@/com/totaljerkface/game/character/PlayableCharacterB2D";
import PogoStickMan from "@/com/totaljerkface/game/character/PogoStickMan";
import SantaClaus from "@/com/totaljerkface/game/character/SantaClaus";
import SegwayGuy from "@/com/totaljerkface/game/character/SegwayGuy";
import SegwayGuyV111 from "@/com/totaljerkface/game/character/SegwayGuyV111";
import WheelChairGuy from "@/com/totaljerkface/game/character/WheelChairGuy";
import ContactListener from "@/com/totaljerkface/game/ContactListener";
import ReplayEvent from "@/com/totaljerkface/game/events/ReplayEvent";
import SessionEvent from "@/com/totaljerkface/game/events/SessionEvent";
import Level1 from "@/com/totaljerkface/game/level/Level1";
import LevelB2D from "@/com/totaljerkface/game/level/LevelB2D";
import UserLevel from "@/com/totaljerkface/game/level/UserLevel";
import MemoryTest from "@/com/totaljerkface/game/MemoryTest";
import ParticleController from "@/com/totaljerkface/game/particles/ParticleController";
import ReplayData from "@/com/totaljerkface/game/ReplayData";
import Settings from "@/com/totaljerkface/game/Settings";
import SoundController from "@/com/totaljerkface/game/sound/SoundController";
import StageCamera from "@/com/totaljerkface/game/StageCamera";
import { boundClass } from 'autobind-decorator';
import BlendMode from "flash/display/BlendMode";
import Sprite from "flash/display/Sprite";
import Event from "flash/events/Event";
import TimerEvent from "flash/events/TimerEvent";
import Rectangle from "flash/geom/Rectangle";
import SoundChannel from "flash/media/SoundChannel";
import System from "flash/system/System";
import TextField from "flash/text/TextField";
import TextFieldAutoSize from "flash/text/TextFieldAutoSize";
import TextFormat from "flash/text/TextFormat";
import TextFormatAlign from "flash/text/TextFormatAlign";
import Timer from "flash/utils/Timer";

@boundClass
export default class Session extends Sprite {
    public m_world: b2World;
    public m_iterations: number = 10;
    public m_timeStep: number = 0.03333333333333333;
    public m_physScale: number = 62.5;
    public debug_sprite: Sprite;
    protected useDebugger: boolean;
    protected _version: number;
    protected _levelVersion: number;
    protected _containerSprite: Sprite;
    protected _buttonContainer: Sprite;
    protected _character: CharacterB2D;
    protected _level: LevelB2D;
    protected _contactListener: ContactListener;
    protected _replayData: ReplayData;
    protected _iteration: number;
    protected totalIterations: number;
    protected paused: boolean;
    protected _camera: StageCamera;
    protected _particleController: ParticleController;
    protected _music: SoundChannel;
    protected fpsTimer: Timer;
    protected fpsText: TextField;
    protected frames: number = 0;
    protected inputAllowed: boolean;
    public isReplay: boolean;

    constructor(
        param1: number,
        param2: Sprite,
        param3: Sprite,
        param4: number,
        param5 = false,
    ) {
        super();
        trace("SESSION version " + param1 + ", level version " + param4);
        this._version = param1;
        this._levelVersion = param4;
        this.debug_sprite = new Sprite();
        this.useDebugger = param5;
        this.init(param2, param3);
    }

    protected init(param1: Sprite, param2: Sprite) {
        this._containerSprite = new Sprite();
        this.containerSprite.mouseChildren = false;
        this.containerSprite.mouseEnabled = false;
        this.addChild(this._containerSprite);
        this.setupLevel(param2);
        this.setupCharacter(param1);
        MemoryTest.instance.addEntry("userLevel_", this._level);
        MemoryTest.instance.addEntry("character_", this._character);
        MemoryTest.instance.addEntry("session_", this);
        MemoryTest.instance.traceContents();
    }

    protected setupLevel(param1: Sprite) {
        switch (Settings.levelIndex) {
            case 1:
                this._level = new Level1(param1, this);
                break;
            default:
                this._level = new UserLevel(param1, this);
        }
    }

    protected setupCharacter(param1: Sprite) {
        var _loc2_: b2Vec2 = this.getStartPoint();
        trace("SETUP CHARACTER " + Settings.characterIndex);
        if (Settings.hideVehicle) {
            this._character = new PlayableCharacterB2D(
                _loc2_.x,
                _loc2_.y,
                param1,
                this,
            );
            return;
        }
        switch (Settings.characterIndex) {
            case 1:
                this._character = new WheelChairGuy(
                    _loc2_.x,
                    _loc2_.y,
                    param1,
                    this,
                );
                break;
            case 2:
                if (this.version >= 1.11) {
                    this._character = new SegwayGuyV111(
                        _loc2_.x,
                        _loc2_.y,
                        param1,
                        this,
                    );
                } else {
                    this._character = new SegwayGuy(
                        _loc2_.x,
                        _loc2_.y,
                        param1,
                        this,
                    );
                }
                break;
            case 3:
                this._character = new IrresponsibleDad(
                    _loc2_.x,
                    _loc2_.y,
                    param1,
                    this,
                );
                break;
            case 4:
                if (this.version >= 1.11) {
                    this._character = new MotorCartV111(
                        _loc2_.x,
                        _loc2_.y,
                        param1,
                        this,
                    );
                } else {
                    this._character = new MotorCart(
                        _loc2_.x,
                        _loc2_.y,
                        param1,
                        this,
                    );
                }
                break;
            case 5:
                this._character = new MopedCouple(
                    _loc2_.x,
                    _loc2_.y,
                    param1,
                    this,
                );
                break;
            case 6:
                this._character = new LawnMowerMan(
                    _loc2_.x,
                    _loc2_.y,
                    param1,
                    this,
                );
                break;
            case 7:
                this._character = new MiddleAgedExplorer(
                    _loc2_.x,
                    _loc2_.y,
                    param1,
                    this,
                );
                break;
            case 8:
                this._character = new SantaClaus(
                    _loc2_.x,
                    _loc2_.y,
                    param1,
                    this,
                );
                break;
            case 9:
                this._character = new PogoStickMan(
                    _loc2_.x,
                    _loc2_.y,
                    param1,
                    this,
                );
                break;
            case 10:
                this._character = new IrresponsibleMom(
                    _loc2_.x,
                    _loc2_.y,
                    param1,
                    this,
                    -1,
                    "Char4",
                );
                break;
            case 11:
                this._character = new HelicopterMan(
                    _loc2_.x,
                    _loc2_.y,
                    param1,
                    this,
                );
                break;
            default:
                throw new Error("FUCK THIS, DOG!");
        }
    }

    protected getStartPoint(): b2Vec2 {
        return new b2Vec2(this._level.startPoint.x, this._level.startPoint.y);
    }

    public create() {
        this._particleController = new ParticleController(
            this._containerSprite,
        );
        this.createWorld();
        trace("building level");
        this._level.create();
        trace("building character");
        this._character.create();
        this._character.addKeyListeners();
        this._containerSprite.addChild(this._level.foreground);
        this.particleController.placeBloodBitmap();
        this._camera = new StageCamera(
            this._containerSprite,
            this._character.cameraFocus,
            this,
        );
        this._camera.secondFocus = this._character.cameraSecondFocus;
        var _loc1_: Rectangle = this._level.cameraBounds;
        this._camera.setLimits(
            _loc1_.x,
            _loc1_.x + _loc1_.width,
            _loc1_.y,
            _loc1_.y + _loc1_.height,
        );
        this.setupTextFields();
        this._containerSprite.addChild(this.debug_sprite);
        this._character.addEventListener(
            ReplayEvent.ADD_ENTRY,
            this.addReplayEntry,
        );
        this._character.paint();
        this.start();
    }

    protected createWorld() {
        var _loc1_ = new b2AABB();
        var _loc2_: Rectangle = this._level.worldBounds;
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
        var _loc5_ = new b2DebugDraw();
        _loc5_.m_sprite = this.debug_sprite;
        _loc5_.m_drawScale = 62.5;
        _loc5_.m_fillAlpha = 0.3;
        _loc5_.m_lineThickness = 1;
        _loc5_.m_drawFlags = b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit;
        if (this.useDebugger) {
            this.m_world.SetDebugDraw(_loc5_);
        }
        this._contactListener = new ContactListener();
        this.m_world.SetContactListener(this._contactListener);
    }

    protected setupTextFields() {
        var _loc1_ = new TextFormat(
            "HelveticaNeueLT Std",
            12,
            0,
            null,
            null,
            null,
            null,
            null,
            TextFormatAlign.LEFT,
        );
        this.fpsText = new TextField();
        this.addChild(this.fpsText);
        this.fpsText.defaultTextFormat = _loc1_;
        this.fpsText.textColor = 16777215;
        this.fpsText.multiline = true;
        this.fpsText.height = 20;
        this.fpsText.selectable = false;
        this.fpsText.autoSize = TextFieldAutoSize.LEFT;
        this.fpsText.wordWrap = true;
        this.fpsText.embedFonts = true;
        this.fpsText.blendMode = BlendMode.INVERT;
        if (Settings.hideHUD) {
            this.fpsText.visible = false;
        }
    }

    public start() {
        this.paused = false;
        this.inputAllowed = true;
        this.frames = 0;
        this._iteration = 0;
        this._replayData = new ReplayData();
        this._music = SoundController.instance.playSoundLoop("Silence");
        if (this._level.endBlock) {
            this._level.endBlock.addEventListener(
                SessionEvent.COMPLETED,
                this.levelComplete,
            );
        }
        this.addEventListener(Event.ENTER_FRAME, this.run);
        this.fpsTimer = new Timer(1000, 0);
        this.fpsTimer.addEventListener(TimerEvent.TIMER, this.setFps);
        this.fpsTimer.start();
    }

    protected run(param1: Event) {
        this.frames += 1;
        this._character.preActions();
        if (this.inputAllowed) {
            this._character.checkKeyStates();
            ++this._iteration;
        } else {
            this._character.doNothing();
        }
        this._character.actions();
        this.m_world.Step(this.m_timeStep, this.m_iterations);
        this._character.handleContactBuffer();
        this._character.checkJoints();
        this._level.actions();
        this._character.paint();
        this._level.paint();
        this._camera.step();
        this._particleController.step();
        SoundController.instance.step();
    }

    protected addReplayEntry(param1: ReplayEvent) {
        this._replayData.addKeyEntry(param1.keyString, this._iteration);
    }

    public levelComplete(param1: SessionEvent = null) {
        trace("level complete");
        this.inputAllowed = false;
        this._replayData.completed = true;
        if (this._level.endBlock) {
            this._level.endBlock.removeEventListener(
                SessionEvent.COMPLETED,
                this.levelComplete,
            );
        }
        this.dispatchEvent(new SessionEvent(SessionEvent.COMPLETED));
    }

    public pause() {
        if (!this.paused) {
            this.paused = true;
            this.removeEventListener(Event.ENTER_FRAME, this.run);
            this.fpsTimer.stop();
            this.fpsTimer.removeEventListener(TimerEvent.TIMER, this.setFps);
            SoundController.instance.systemMute();
            if (this.buttonContainer) {
                this.buttonContainer.mouseChildren = false;
            }
        }
    }

    public unpause() {
        if (this.paused) {
            this.paused = false;
            this.addEventListener(Event.ENTER_FRAME, this.run);
            this.fpsTimer = new Timer(1000, 0);
            this.fpsTimer.addEventListener(TimerEvent.TIMER, this.setFps);
            this.fpsTimer.start();
            SoundController.instance.systemUnMute();
            if (this.buttonContainer) {
                this.buttonContainer.mouseChildren = true;
            }
        }
    }

    public die() {
        this.removeEventListener(Event.ENTER_FRAME, this.run);
        if (this.fpsTimer) {
            this.fpsTimer.stop();
            this.fpsTimer.removeEventListener(TimerEvent.TIMER, this.setFps);
        }
        if (this._level.endBlock) {
            this._level.endBlock.removeEventListener(
                SessionEvent.COMPLETED,
                this.levelComplete,
            );
        }
        var _loc1_: b2Body = this.m_world.GetBodyList();
        while (_loc1_) {
            this.m_world.DestroyBody(_loc1_);
            _loc1_ = _loc1_.m_next;
        }
        this.m_world = null;
        this._character.removeKeyListeners();
        this._character.removeEventListener(
            ReplayEvent.ADD_ENTRY,
            this.addReplayEntry,
        );
        this._character.die();
        this._character = null;
        this._level.die();
        this._level = null;
        this._music.stop();
        this._music = null;
        this._particleController.die();
        this._particleController = null;
        SoundController.instance.stopAllSounds();
        SoundController.instance.systemUnMute();
        this._camera = null;
        this._replayData = null;
        this._contactListener.die();
        this._contactListener = null;
        this._containerSprite = null;
        this.debug_sprite.graphics.clear();
    }

    protected cleanup() {
        var _loc1_: number = this._containerSprite.numChildren;
        var _loc2_: number = _loc1_;
        while (_loc2_ > 0) {
            this._containerSprite.removeChildAt(_loc2_ - 1);
            _loc2_--;
        }
    }

    protected setFps(param1: TimerEvent) {
        var _loc2_: number = Math.round(System.totalMemory / 10485.76) / 100;
        this.fpsText.htmlText =
            this.frames.toString() + " fps<br>" + _loc2_ + " MB";
        this.frames = 0;
    }

    public get character(): CharacterB2D {
        return this._character;
    }

    public set character(param1: CharacterB2D) {
        this._character = param1;
    }

    public get level(): LevelB2D {
        return this._level;
    }

    public set level(param1: LevelB2D) {
        this._level = param1;
    }

    public get containerSprite(): Sprite {
        return this._containerSprite;
    }

    public set containerSprite(param1: Sprite) {
        throw new Error("set this in an override");
    }

    public get contactListener(): ContactListener {
        return this._contactListener;
    }

    public get replayData(): ReplayData {
        return this._replayData;
    }

    public get camera(): StageCamera {
        return this._camera;
    }

    public get particleController(): ParticleController {
        return this._particleController;
    }

    public get iteration(): number {
        return this._iteration;
    }

    public get version(): number {
        return this._version;
    }

    public get levelVersion(): number {
        return this._levelVersion;
    }

    public get buttonContainer(): Sprite {
        if (!this._buttonContainer) {
            this._buttonContainer = new Sprite();
            if (!this.isReplay) {
                this.addChild(this._buttonContainer);
            }
        }
        return this._buttonContainer;
    }
}