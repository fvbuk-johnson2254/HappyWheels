import SessionEvent from "@/com/totaljerkface/game/events/SessionEvent";
import KeyDisplay from "@/com/totaljerkface/game/KeyDisplay";
import MouseData from "@/com/totaljerkface/game/level/MouseData";
import ParticleController from "@/com/totaljerkface/game/particles/ParticleController";
import ReplayData from "@/com/totaljerkface/game/ReplayData";
import ReplayProgressBar from "@/com/totaljerkface/game/ReplayProgressBar";
import Session from "@/com/totaljerkface/game/Session";
import Settings from "@/com/totaljerkface/game/Settings";
import SoundController from "@/com/totaljerkface/game/sound/SoundController";
import StageCamera from "@/com/totaljerkface/game/StageCamera";
import { boundClass } from 'autobind-decorator';
import Sprite from "flash/display/Sprite";
import Event from "flash/events/Event";
import TimerEvent from "flash/events/TimerEvent";
import Rectangle from "flash/geom/Rectangle";
import Timer from "flash/utils/Timer";

@boundClass
export default class SessionReplay extends Session {
    protected keyDisplay: KeyDisplay;
    protected replayProgressBar: ReplayProgressBar;
    protected mouseClickMap: {};

    constructor(
        param1: number,
        param2: Sprite,
        param3: Sprite,
        param4: number,
        param5: ReplayData,
    ) {
        super(param1, param2, param3, param4);
        trace("SESSION REPLAY");
        this._replayData = param5;
        this.mouseClickMap = this._replayData.getMouseClickMap();
        this.totalIterations = this._replayData.getLength();
        this.isReplay = true;
    }

    public override create() {
        this._particleController = new ParticleController(
            this._containerSprite,
        );
        this.createWorld();
        trace("building level");
        this._level.create();
        trace("building character");
        this._character.create();
        this._containerSprite.addChild(this._level.foreground);
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
        this._character.paint();
        this.start();
    }

    public override start() {
        this.paused = false;
        this.inputAllowed = true;
        this.frames = 0;
        this._iteration = 0;
        this._music = SoundController.instance.playSoundLoop("Silence");
        this.addReplayControls();
        this.addEventListener(Event.ENTER_FRAME, this.run);
        this.fpsTimer = new Timer(1000, 0);
        this.fpsTimer.addEventListener(TimerEvent.TIMER, this.setFps);
        this.fpsTimer.start();
    }

    private addReplayControls() {
        this.keyDisplay = new KeyDisplay(this._character);
        this.addChild(this.keyDisplay);
        this.replayProgressBar = new ReplayProgressBar();
        this.replayProgressBar.x = 150;
        this.replayProgressBar.y = 20;
        this.addChild(this.replayProgressBar);
        if (Settings.hideHUD) {
            this.keyDisplay.visible =
                this.replayProgressBar.visible =
                this.fpsText.visible =
                false;
        }
    }

    public removeReplayControls() {
        this.removeChild(this.keyDisplay);
        this.keyDisplay = null;
        this.replayProgressBar.die();
        this.stage.frameRate = 30;
    }

    protected override run(param1: Event) {
        var _loc2_: MouseData = null;
        this.replayProgressBar.updateProgress(
            this.iteration,
            this.totalIterations,
        );
        this.frames += 1;
        this._character.preActions();
        if (this.inputAllowed) {
            _loc2_ = this.mouseClickMap[this.iteration.toString()];
            if (_loc2_) {
                this.level.mouseClickTrigger(_loc2_);
            }
            if (this.iteration >= this.totalIterations) {
                this.levelComplete();
            }
            this._character.checkReplayData(
                this.keyDisplay,
                this.replayData.getKeyEntry(this.iteration),
            );
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

    public override levelComplete(param1: SessionEvent = null) {
        trace("level complete");
        this.inputAllowed = false;
        this.dispatchEvent(new SessionEvent(SessionEvent.COMPLETED));
    }

    public override die() {
        super.die();
        this.removeReplayControls();
    }
}