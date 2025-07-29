import Settings from "@/com/totaljerkface/game/Settings";
import MouseHelper from "@/com/totaljerkface/game/editor/MouseHelper";
import LibraryButton from "@/com/totaljerkface/game/editor/ui/LibraryButton";
import ValueEvent from "@/com/totaljerkface/game/editor/ui/ValueEvent";
import NavigationEvent from "@/com/totaljerkface/game/events/NavigationEvent";
import BasicMenu from "@/com/totaljerkface/game/menus/BasicMenu";
import OptionsSlider from "@/com/totaljerkface/game/menus/OptionsSlider";
import ParticleController from "@/com/totaljerkface/game/particles/ParticleController";
import SoundController from "@/com/totaljerkface/game/sound/SoundController";
import Tracker from "@/com/totaljerkface/game/utils/Tracker";
import { boundClass } from 'autobind-decorator';
import MovieClip from "flash/display/MovieClip";
import StageDisplayState from "flash/display/StageDisplayState";
import StageQuality from "flash/display/StageQuality";
import MouseEvent from "flash/events/MouseEvent";
import SharedObject from "flash/net/SharedObject";

/* [Embed(source="/_assets/assets.swf", symbol="symbol398")] */
@boundClass
export default class OptionsMenu extends BasicMenu {
    public qCheck1: MovieClip;
    public qCheck2: MovieClip;
    public qCheck3: MovieClip;
    public sCheck: MovieClip;
    public cCheck: MovieClip;
    public fCheck: MovieClip;
    public soundCheck: MovieClip;
    public customizeControlsButton: LibraryButton;
    private particleSlider: OptionsSlider;
    private bloodTypeSlider: OptionsSlider;
    private sharedObject: SharedObject;

    constructor(param1: string, param2: string) {
        super();
        this.sharedObject = SharedObject.getLocal("options135");
        this.qCheck1.mouseChildren =
            this.qCheck2.mouseChildren =
            this.qCheck3.mouseChildren =
            this.fCheck.mouseChildren =
            this.sCheck.mouseChildren =
            this.cCheck.mouseChildren =
            this.soundCheck.mouseChildren =
            false;
        this.addEventListener(MouseEvent.MOUSE_UP, this.mouseUpHandler);
        this.addEventListener(MouseEvent.MOUSE_OVER, this.mouseOverHandler);
        if (param1 == "LOW") {
            this.qCheck1.gotoAndStop(2);
            this.qCheck2.gotoAndStop(1);
            this.qCheck3.gotoAndStop(1);
        } else if (param1 == "MEDIUM") {
            this.qCheck1.gotoAndStop(1);
            this.qCheck2.gotoAndStop(2);
            this.qCheck3.gotoAndStop(1);
        } else {
            this.qCheck1.gotoAndStop(1);
            this.qCheck2.gotoAndStop(1);
            this.qCheck3.gotoAndStop(2);
        }
        if (param2 == StageDisplayState.FULL_SCREEN_INTERACTIVE) {
            this.fCheck.gotoAndStop(2);
        } else {
            this.fCheck.gotoAndStop(1);
        }
        if (Settings.smoothing) {
            this.sCheck.gotoAndStop(2);
        } else {
            this.sCheck.gotoAndStop(1);
        }
        if (Settings.useCompressedTextures) {
            this.cCheck.gotoAndStop(2);
        } else {
            this.cCheck.gotoAndStop(1);
        }
        trace("MTU:ED?" + SoundController.instance.isMuted);
        if (SoundController.instance.isMuted) {
            this.soundCheck.gotoAndStop(2);
        } else {
            this.soundCheck.gotoAndStop(1);
        }
        this.particleSlider = new OptionsSlider("", "", 4, true, 0, 2000, 10);
        this.particleSlider.x = 465;
        this.particleSlider.y = 113;
        this.addChild(this.particleSlider);
        this.particleSlider.setValue(ParticleController.maxParticles);
        this.particleSlider.helpCaption = "This is the maximum number of particles that can be seen at once on screen.  Blood, broken glass, splintered wood, and other tiny flying objects are particles.  Lowering the number may increase performance.  If you don\'t want to see any spouting blood, set it to 0.";
        this.particleSlider.addEventListener(
            ValueEvent.VALUE_CHANGE,
            this.sliderChange,
        );
        this.bloodTypeSlider = new OptionsSlider("", "", 1, true, 1, 4, 3);
        this.bloodTypeSlider.x = 465;
        this.bloodTypeSlider.y = 143;
        this.addChild(this.bloodTypeSlider);
        this.bloodTypeSlider.setValue(Settings.bloodSetting);
        this.bloodTypeSlider.helpCaption = "This controls how the blood will look.<br><br>1) This is the original blood setting. It looks the worst but runs the fastest.<br><br>2) Each blood particle is drawn as a line. Runs slightly worse than 1 but looks a bit better<br><br>3) The blood looks like actual liquid. Runs a bit worse than 2. For the sake of performance, all blood is rendered on one layer.<br><br>4) This is just like setting 3, but has an additional bevel and blend mode applied. Only use this with a fast computer.";
        this.bloodTypeSlider.addEventListener(
            ValueEvent.VALUE_CHANGE,
            this.bloodTypeSliderChange,
        );
    }

    private mouseUpHandler(param1: MouseEvent) {
        switch (param1.target) {
            case this.qCheck1:
                this.qCheck1.gotoAndStop(2);
                this.qCheck2.gotoAndStop(1);
                this.qCheck3.gotoAndStop(1);
                this.stage.quality = StageQuality.LOW;
                this.sharedObject.data["quality"] = "LOW";
                Tracker.trackEvent(Tracker.OPTIONS, Tracker.SET_QUALITY, "low");
                break;
            case this.qCheck2:
                this.qCheck1.gotoAndStop(1);
                this.qCheck2.gotoAndStop(2);
                this.qCheck3.gotoAndStop(1);
                this.stage.quality = StageQuality.MEDIUM;
                this.sharedObject.data["quality"] = "MEDIUM";
                Tracker.trackEvent(
                    Tracker.OPTIONS,
                    Tracker.SET_QUALITY,
                    "medium",
                );
                break;
            case this.qCheck3:
                this.qCheck1.gotoAndStop(1);
                this.qCheck2.gotoAndStop(1);
                this.qCheck3.gotoAndStop(2);
                this.stage.quality = StageQuality.HIGH;
                this.sharedObject.data["quality"] = "HIGH";
                Tracker.trackEvent(
                    Tracker.OPTIONS,
                    Tracker.SET_QUALITY,
                    "high",
                );
                break;
            case this.fCheck:
                if (
                    this.stage.displayState ==
                    StageDisplayState.FULL_SCREEN_INTERACTIVE
                ) {
                    this.stage.displayState = StageDisplayState.NORMAL;
                    if (this.stage.displayState == StageDisplayState.NORMAL) {
                        this.fCheck.gotoAndStop(1);
                    }
                } else {
                    this.stage.displayState =
                        StageDisplayState.FULL_SCREEN_INTERACTIVE;
                    if (
                        this.stage.displayState ==
                        StageDisplayState.FULL_SCREEN_INTERACTIVE
                    ) {
                        this.fCheck.gotoAndStop(2);
                    }
                }
                break;
            case this.sCheck:
                if (this.sCheck.currentFrame == 1) {
                    this.sCheck.gotoAndStop(2);
                    Settings.smoothing = true;
                    this.sharedObject.data["smoothing"] = true;
                } else {
                    this.sCheck.gotoAndStop(1);
                    Settings.smoothing = false;
                    this.sharedObject.data["smoothing"] = false;
                }
                break;
            case this.cCheck:
                if (this.cCheck.currentFrame == 1) {
                    this.cCheck.gotoAndStop(2);
                    Settings.useCompressedTextures = true;
                    this.sharedObject.data["compressed"] = true;
                } else {
                    this.cCheck.gotoAndStop(1);
                    Settings.useCompressedTextures = false;
                    this.sharedObject.data["compressed"] = false;
                }
                break;
            case this.soundCheck:
                if (this.soundCheck.currentFrame == 1) {
                    this.soundCheck.gotoAndStop(2);
                    SoundController.instance.mute();
                    Tracker.trackEvent(Tracker.OPTIONS, Tracker.MUTE);
                } else {
                    this.soundCheck.gotoAndStop(1);
                    SoundController.instance.unMute();
                    Tracker.trackEvent(Tracker.OPTIONS, Tracker.UNMUTE);
                }
                break;
            case this.customizeControlsButton:
                Tracker.trackEvent(Tracker.OPTIONS, Tracker.CUSTOMIZE_CONTROLS);
                this.dispatchEvent(
                    new NavigationEvent(NavigationEvent.CUSTOMIZE_CONTROLS),
                );
        }
    }

    private mouseOverHandler(param1: MouseEvent) {
        switch (param1.target) {
            case this.qCheck1:
                MouseHelper.instance.show("low", this.qCheck1);
                break;
            case this.qCheck2:
                MouseHelper.instance.show("medium", this.qCheck2);
                break;
            case this.qCheck3:
                MouseHelper.instance.show("high", this.qCheck3);
                break;
            case this.fCheck:
                MouseHelper.instance.show(
                    "Fullscreen mode may not function with older flash plugins. Performance may be greatly reduced when using fullscreen mode. Non-vector graphics will appear pixelated due to scaling up. The only blood setting that will look as intended will be setting 2, which is rendered in vector. Press escape at any time to exit fullscreen mode.",
                    this.fCheck,
                );
                break;
            case this.sCheck:
                MouseHelper.instance.show(
                    "smoothing is used occasionally on certain bitmaps to make textures less pixelated, but can slow things down if overused",
                    this.sCheck,
                );
                break;
            case this.cCheck:
                MouseHelper.instance.show(
                    "this is currently only relevant to the first level.  using compressed, pre-drawn textures will speed up the loading of the level.  if your computer is old, make sure this is checked.",
                    this.cCheck,
                );
        }
    }

    private sliderChange(param1: ValueEvent) {
        ParticleController.maxParticles = param1.value;
        this.sharedObject.data["maxParticles"] =
            ParticleController.maxParticles;
    }

    private bloodTypeSliderChange(param1: ValueEvent) {
        Settings.bloodSetting = param1.value;
        Settings.sharedObject.data["bloodSetting"] = Settings.bloodSetting;
        Tracker.trackEvent(
            Tracker.OPTIONS,
            Tracker.SET_BLOOD,
            "value_" + param1.value,
        );
    }

    public override die() {
        super.die();
        this.removeEventListener(MouseEvent.MOUSE_UP, this.mouseUpHandler);
        this.removeEventListener(MouseEvent.MOUSE_OVER, this.mouseOverHandler);
        this.particleSlider.removeEventListener(
            ValueEvent.VALUE_CHANGE,
            this.sliderChange,
        );
        this.bloodTypeSlider.removeEventListener(
            ValueEvent.VALUE_CHANGE,
            this.bloodTypeSliderChange,
        );
        this.bloodTypeSlider.die();
        this.particleSlider.die();
    }
}