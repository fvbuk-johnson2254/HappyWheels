import BitmapManager from "@/com/totaljerkface/game/BitmapManager";
import LevelLoader from "@/com/totaljerkface/game/LevelLoader";
import ReplayLoader from "@/com/totaljerkface/game/ReplayLoader";
import Settings from "@/com/totaljerkface/game/Settings";
import PromptSprite from "@/com/totaljerkface/game/editor/PromptSprite";
import StatusSprite from "@/com/totaljerkface/game/editor/StatusSprite";
import Window from "@/com/totaljerkface/game/editor/ui/Window";
import NavigationEvent from "@/com/totaljerkface/game/events/NavigationEvent";
import AppLinkButton from "@/com/totaljerkface/game/menus/AppLinkButton";
import BasicMenu from "@/com/totaljerkface/game/menus/BasicMenu";
import ControlsMenu from "@/com/totaljerkface/game/menus/ControlsMenu";
import CreditsMenu from "@/com/totaljerkface/game/menus/CreditsMenu";
import CustomizeControlsMenu from "@/com/totaljerkface/game/menus/CustomizeControlsMenu";
import FatLady from "@/com/totaljerkface/game/menus/FatLady";
import FeaturedMenu from "@/com/totaljerkface/game/menus/FeaturedMenu";
import LevelBrowser from "@/com/totaljerkface/game/menus/LevelBrowser";
import LevelDataObject from "@/com/totaljerkface/game/menus/LevelDataObject";
import LoadLevelMenu from "@/com/totaljerkface/game/menus/LoadLevelMenu";
import MainSelectionButton from "@/com/totaljerkface/game/menus/MainSelectionButton";
import OldMan from "@/com/totaljerkface/game/menus/OldMan";
import OptionsMenu from "@/com/totaljerkface/game/menus/OptionsMenu";
import ReplayBrowser from "@/com/totaljerkface/game/menus/ReplayBrowser";
import SoundController from "@/com/totaljerkface/game/sound/SoundController";
import SoundItem from "@/com/totaljerkface/game/sound/SoundItem";
import TextUtils from "@/com/totaljerkface/game/utils/TextUtils";
import Tracker from "@/com/totaljerkface/game/utils/Tracker";
import TweenLite from "@/gs/TweenLite";
import Bounce from "@/gs/easing/Bounce";
import Strong from "@/gs/easing/Strong";
import MenuMask from "@/top/MenuMask";
import MuteButton from "@/top/MuteButton";
import { boundClass } from 'autobind-decorator';
import BitmapData from "flash/display/BitmapData";
import BitmapDataChannel from "flash/display/BitmapDataChannel";
import BlendMode from "flash/display/BlendMode";
import MovieClip from "flash/display/MovieClip";
import Sprite from "flash/display/Sprite";
import StageQuality from 'flash/display/StageQuality';
import Event from "flash/events/Event";
import IOErrorEvent from "flash/events/IOErrorEvent";
import MouseEvent from "flash/events/MouseEvent";
import SharedObject from "flash/net/SharedObject";
import TextField from "flash/text/TextField";

/* [Embed(source="/_assets/assets.swf", symbol="symbol455")] */
@boundClass
export default class MainMenu extends Sprite {
    private static currentMenu: string;
    private static previousMenu: string;
    private static firstLoad: boolean = true;
    public static FEATURED_MENU: string = "featuredmenu";
    public static LEVEL_BROWSER: string = "levelbrowser";
    public static REPLAY_BROWSER: string = "replaybrowser";
    public oldMan: OldMan;
    public logo: Sprite;
    public logobg: Sprite;
    public versionText: TextField;
    public appLink: AppLinkButton;
    private bg: Sprite;
    private smokeSprite1: Sprite;
    private smokeSprite2: Sprite;
    private scrollSpeedX: number = 2;
    private scrollSpeedY: number = 1;
    private superPretzel: SoundItem;
    private loadMenu: LoadLevelMenu;
    private featuredMenu: FeaturedMenu;
    private levelBrowser: LevelBrowser;
    private replayBrowser: ReplayBrowser;
    private playBtn: MainSelectionButton;
    private browseBtn: MainSelectionButton;
    private editorBtn: MainSelectionButton;
    private optionsBtn: MainSelectionButton;
    private loadLevelBtn: MainSelectionButton;
    private creditsBtn: MainSelectionButton;
    private buttons: any[];
    private buttonX: number = 885;
    private buttonSpacing: number = 10;
    private spaceHeight: number = 0;
    private menuCenter: number = 380;
    private tweenTime: number = 1;
    private _tweenVal: number = 0;
    private transitioning: boolean;
    private leftBrowser: Sprite;
    private rightBrowser: Sprite;
    private menuMask: Sprite;
    private statusSprite: StatusSprite;
    private promptSprite: PromptSprite;
    private bigArrow: Sprite;
    private muteBtn: MovieClip;

    constructor() {
        super();

        // @ts-ignore
        embedRecursive(this, {
            logo: Sprite,
            logobg: Sprite,
            versionText: TextField,
            appLink: AppLinkButton
        }, 455);
    }

    public static setCurrentMenu(param1: string) {
        MainMenu.currentMenu = param1;
        MainMenu.firstLoad = false;
    }

    public init() {
        this.buildStage();
        this.createButtons();
        this.addEventListener(Event.ENTER_FRAME, this.organizeButtons);
        this.addEventListener(MouseEvent.MOUSE_UP, this.mouseUpHandler);
        if (MainMenu.firstLoad) {
            MainMenu.firstLoad = false;
            this.beginIntroAnimation();
        } else {
            switch (MainMenu.currentMenu) {
                case MainMenu.FEATURED_MENU:
                    this.openFeaturedMenu();
                    break;
                case MainMenu.LEVEL_BROWSER:
                    this.openLevelBrowser();
                    break;
                case MainMenu.REPLAY_BROWSER:
                    this.openReplayBrowser();
            }
        }
    }

    private buildStage() {
        console.log('buildStage 1');
        var bitmapData1: BitmapData = null;
        var bitmapData2: BitmapData = null;
        var _loc1_: SharedObject = Settings.sharedObject;
        if (_loc1_.data["fatlady"] != 1) {
            _loc1_.data["fatlady"] = 1;
            this.oldMan = new FatLady();
        } else {
            this.oldMan = Math.random() > 0.5 ? new FatLady() : new OldMan();
        }
        this.oldMan.x = 450;
        this.oldMan.y = 250;
        this.addChildAt(this.oldMan, 0);
        this.bg = new Sprite();
        var width: number = 900;
        var height: number = 500;
        this.bg.graphics.beginFill(51);
        this.bg.graphics.drawRect(0, 0, width, height);
        this.bg.graphics.endFill();
        var bitmapManager = BitmapManager.instance;
        if (bitmapManager.getTexture("smoke1") == null) {
            bitmapData1 = new BitmapData(width, height, true);
            bitmapData1.perlinNoise(
                width,
                height,
                10,
                4,
                true,
                true,
                BitmapDataChannel.ALPHA,
                true,
                null,
            );
            bitmapData2 = new BitmapData(width, height, true);
            bitmapData2.perlinNoise(
                width,
                height,
                10,
                4,
                true,
                true,
                BitmapDataChannel.ALPHA,
                true,
                null,
            );
            bitmapManager.addTexture("smoke1", bitmapData1);
            bitmapManager.addTexture("smoke2", bitmapData2);
        } else {
            bitmapData1 = bitmapManager.getTexture("smoke1");
            bitmapData2 = bitmapManager.getTexture("smoke2");
        }
        this.smokeSprite1 = new Sprite();
        this.smokeSprite1.graphics.beginBitmapFill(bitmapData1, null, true);
        this.smokeSprite1.graphics.drawRect(0, 0, width * 2, height * 2);
        this.smokeSprite1.graphics.endFill();
        this.smokeSprite2 = new Sprite();
        this.smokeSprite2.graphics.beginBitmapFill(bitmapData2, null, true);
        this.smokeSprite2.graphics.drawRect(0, 0, width * 2, height * 2);
        this.smokeSprite2.graphics.endFill();
        this.smokeSprite2.blendMode = BlendMode.HARDLIGHT;
        this.smokeSprite1.alpha = 0.5;
        this.smokeSprite2.alpha = 0.5;
        this.smokeSprite1.mouseEnabled = false;
        this.smokeSprite2.mouseEnabled = false;
        this.bg.mouseEnabled = false;
        this.addChildAt(this.smokeSprite2, 0);
        this.addChildAt(this.smokeSprite1, 0);
        this.addChildAt(this.bg, 0);
        console.log({ mainMenu: this });
        console.log('buildStage 2');
        this.versionText.text = "v " + TextUtils.setToHundredths(Settings.CURRENT_VERSION);
    }

    private createButtons() {
        this.buttons = new Array();
        var color1: number = 4032711;
        var color2: number = 16613761;
        var quality = this.stage.quality;
        this.stage.quality = StageQuality.HIGH;
        this.creditsBtn = new MainSelectionButton("CREDITS", 25, color2);
        this.addChild(this.creditsBtn);
        this.optionsBtn = new MainSelectionButton("OPTIONS", 25, color2);
        this.addChild(this.optionsBtn);
        this.editorBtn = new MainSelectionButton("LEVEL EDITOR", 30, color1);
        this.addChild(this.editorBtn);
        this.loadLevelBtn = new MainSelectionButton(
            "LOAD LEVEL/REPLAY",
            30,
            color1,
        );
        this.addChild(this.loadLevelBtn);
        this.browseBtn = new MainSelectionButton("BROWSE LEVELS", 30, color1);
        this.addChild(this.browseBtn);
        this.playBtn = new MainSelectionButton("PLAY", 56, color1);
        this.addChild(this.playBtn);
        console.log({ playBtn: this.playBtn });
        this.creditsBtn.x =
            this.loadLevelBtn.x =
            this.optionsBtn.x =
            this.editorBtn.x =
            this.browseBtn.x =
            this.playBtn.x =
            this.buttonX;
        this.buttons = [
            this.playBtn,
            this.browseBtn,
            this.loadLevelBtn,
            this.editorBtn,
            this.optionsBtn,
            this.creditsBtn,
        ];
        this.spaceHeight = (this.buttons.length - 1) * this.buttonSpacing;
        this.stage.quality = quality as StageQuality;
        this.muteBtn = new MuteButton();
        this.muteBtn.x = this.stage.stageWidth - this.muteBtn.width - 5;
        this.muteBtn.y = 5;
        this.muteBtn.gotoAndStop(1);
        this.muteBtn.buttonMode = true;
        this.muteBtn.alpha = 0.7;
        this.addChild(this.muteBtn);
        this.muteBtn.gotoAndStop(!!Settings.sharedObject.data["muted"] ? 2 : 1);
    }

    private beginIntroAnimation() {
        var index: number = 0;
        var button: MainSelectionButton = null;
        this.bg.alpha = 0;
        this.smokeSprite1.alpha = 0;
        this.smokeSprite2.alpha = 0;
        this.logo.scaleX =
            this.logo.scaleY =
            this.logobg.scaleX =
            this.logobg.scaleY =
            0;
        this.appLink.x = -9999;
        var buttonsLenght = int(this.buttons.length);
        var delay: number = 2;
        index = 0;
        while (index < buttonsLenght) {
            button = this.buttons[index];
            button.mouseEnabled = false;
            button.x = this.buttonX + 400;
            if (index == buttonsLenght - 1) {
                TweenLite.to(button, 0.5, {
                    x: this.buttonX,
                    ease: Strong.easeOut,
                    delay: delay,
                    onComplete: this.introComplete,
                });
            } else {
                TweenLite.to(button, 0.5, {
                    x: this.buttonX,
                    ease: Strong.easeOut,
                    delay: delay,
                });
            }
            delay += 0.15;
            index++;
        }
        // TweenLite.to(this.smokeSprite1, 1, { alpha: 0.5 });
        // TweenLite.to(this.smokeSprite2, 1, { alpha: 0.5 });
        TweenLite.to(this.bg, 2, { alpha: 1 });
        TweenLite.to(this.logo, 0.5, {
            scaleX: 2,
            scaleY: 2,
            ease: Bounce.easeOut,
            delay: 1.5,
        });
        TweenLite.to(this.logobg, 0.5, {
            scaleX: 2,
            scaleY: 2,
            ease: Bounce.easeOut,
            delay: 1.5,
        });
        TweenLite.to(this.appLink, 0.5, {
            x: -9999,
            ease: Strong.easeOut,
            delay: 1.5,
        });
        this.oldMan.slideIn();
        // this.superPretzel = SoundController.instance.playSoundItem("SuperPretzel");
    }

    private introComplete() {
        console.log('introComplete');
        var index: number = 0;
        while (index < this.buttons.length) {
            var button: MainSelectionButton = null;
            button = this.buttons[index];
            button.mouseEnabled = true;
            console.log(button.mouseEnabled)
            index++;
        }
        var _loc2_: SharedObject = Settings.sharedObject;
        trace("blood popup " + _loc2_.data["bloodpopup"]);
        if (
            Settings.CURRENT_VERSION == 1.6 &&
            _loc2_.data["bloodpopup"] == undefined
        ) {
            _loc2_.data["bloodpopup"] = 1;
            this.promptSprite = new PromptSprite(
                "For those of you incapable of problem solving, I\'ve set blood back to setting 1 by default. As stated several times, you can change the blood in the options menu. Here is a large, noticeable arrow pointing to the options menu. It\'s the button labelled: options.",
                "woah!",
                false,
                250,
            );
            this.addChild(this.promptSprite.window);
            this.promptSprite.window.x = 310;
            this.promptSprite.window.y = 320;
            this.optionsBtn.addArrow();
        }
    }

    private organizeButtons(param1: Event) {
        var _loc7_: MainSelectionButton = null;
        var _loc2_: number = 0;
        var _loc3_: number = 0;
        var _loc4_ = int(this.buttons.length);
        var _loc5_: number = 0;
        while (_loc5_ < _loc4_) {
            _loc7_ = this.buttons[_loc5_];
            _loc3_ += _loc7_.height;
            _loc5_++;
        }
        _loc2_ = _loc3_ + this.spaceHeight;
        var _loc6_: number = this.menuCenter - _loc2_ * 0.5;
        _loc5_ = 0;
        while (_loc5_ < _loc4_) {
            _loc7_ = this.buttons[_loc5_];
            _loc7_.y = _loc6_;
            _loc6_ = _loc7_.y + _loc7_.height + this.buttonSpacing;
            _loc5_++;
        }
        this.scrollSmoke();
        this.oldMan.step();
    }

    private scrollSmoke(param1: Event = null) {
        this.smokeSprite1.x += this.scrollSpeedX * 2;
        this.smokeSprite1.y -= this.scrollSpeedY;
        this.smokeSprite2.x -= this.scrollSpeedX;
        this.smokeSprite2.y -= this.scrollSpeedY;
        if (this.smokeSprite1.x > 0) {
            this.smokeSprite1.x -= this.smokeSprite1.width / 2;
        }
        if (this.smokeSprite1.y < -this.smokeSprite1.height / 2) {
            this.smokeSprite1.y += this.smokeSprite1.height / 2;
        }
        if (this.smokeSprite2.x < -this.smokeSprite2.width / 2) {
            this.smokeSprite2.x += this.smokeSprite2.width / 2;
        }
        if (this.smokeSprite2.y < -this.smokeSprite2.height / 2) {
            this.smokeSprite2.y += this.smokeSprite2.height / 2;
        }
    }

    private mouseUpHandler(param1: MouseEvent) {
        console.log('mouseUpHandler', param1);
        var _loc2_: SharedObject = null;
        switch (param1.target) {
            case this.playBtn:
                Tracker.trackEvent(
                    Tracker.MAIN_MENU,
                    Tracker.GOTO_FEATURED_BROWSER,
                );
                this.openFeaturedMenu();
                this.maskTransition(this.featuredMenu);
                break;
            case this.browseBtn:
                Tracker.trackEvent(
                    Tracker.MAIN_MENU,
                    Tracker.GOTO_LEVEL_BROWSER,
                );
                this.openLevelBrowser();
                this.maskTransition(this.levelBrowser);
                break;
            case this.editorBtn:
                Tracker.trackEvent(Tracker.MAIN_MENU, Tracker.GOTO_EDITOR);
                MainMenu.currentMenu = null;
                this.dispatchEvent(new NavigationEvent(NavigationEvent.EDITOR));
                break;
            case this.loadLevelBtn:
                Tracker.trackEvent(
                    Tracker.MAIN_MENU,
                    Tracker.GOTO_LEVEL_REPLAY_LOADER,
                );
                this.openLoadLevelMenu();
                break;
            case this.optionsBtn:
                Tracker.trackEvent(Tracker.MAIN_MENU, Tracker.GOTO_OPTIONS);
                this.openBasicMenu("options");
                break;
            case this.creditsBtn:
                Tracker.trackEvent(Tracker.MAIN_MENU, Tracker.GOTO_CREDITS);
                this.openBasicMenu("credits");
                break;
            case this.muteBtn:
                _loc2_ = Settings.sharedObject;
                if (_loc2_.data["muted"]) {
                    Tracker.trackEvent(Tracker.MAIN_MENU, Tracker.UNMUTE);
                    SoundController.instance.unMute();
                    this.muteBtn.gotoAndStop(1);
                } else {
                    Tracker.trackEvent(Tracker.MAIN_MENU, Tracker.MUTE);
                    SoundController.instance.mute();
                    this.muteBtn.gotoAndStop(2);
                }
                break;
            default:
                return;
        }
        SoundController.instance.playSoundItem("MenuSelect");
    }

    private openLoadLevelMenu() {
        this.loadMenu = new LoadLevelMenu();
        var _loc1_: Window = this.loadMenu.window;
        this.addChild(_loc1_);
        _loc1_.center();
        this.loadMenu.addEventListener(LoadLevelMenu.LOAD, this.beginLoad);
        this.loadMenu.addEventListener(
            LoadLevelMenu.CANCEL,
            this.closeLoadMenu,
        );
    }

    private beginLoad(param1: Event) {
        var _loc5_: string = null;
        var _loc6_: LevelLoader = null;
        var _loc7_: Window = null;
        var _loc8_: ReplayLoader = null;
        var _loc2_: string = this.loadMenu.loadID;
        var _loc3_: string = this.loadMenu.loadType;
        var _loc4_: any[] = _loc2_.split("=");
        if (_loc4_.length > 1) {
            _loc5_ = _loc4_[0];
            if (_loc5_.indexOf("levelid") > -1) {
                _loc3_ = LoadLevelMenu.LEVEL;
            } else if (_loc5_.indexOf("replayid") > -1) {
                _loc3_ = LoadLevelMenu.REPLAY;
            }
            _loc2_ = this.loadMenu.loadID = _loc4_[1];
        }
        if (_loc3_ == LoadLevelMenu.LEVEL) {
            this.statusSprite = new StatusSprite("loading level...");
            _loc7_ = this.statusSprite.window;
            this.addChild(_loc7_);
            _loc7_.center();
            _loc6_ = new LevelLoader();
            _loc6_.addEventListener(
                LevelLoader.LEVEL_LOADED,
                this.levelLoadComplete,
            );
            _loc6_.addEventListener(
                LevelLoader.ID_NOT_FOUND,
                this.levelLoadComplete,
            );
            _loc6_.addEventListener(
                LevelLoader.LOAD_ERROR,
                this.levelLoadComplete,
            );
            _loc6_.load(int(_loc2_));
        } else {
            this.statusSprite = new StatusSprite("loading replay...");
            _loc7_ = this.statusSprite.window;
            this.addChild(_loc7_);
            _loc7_.center();
            _loc8_ = new ReplayLoader();
            _loc8_.addEventListener(
                ReplayLoader.REPLAY_AND_LEVEL_LOADED,
                this.replayLoadComplete,
            );
            _loc8_.addEventListener(
                ReplayLoader.ID_NOT_FOUND,
                this.replayLoadComplete,
            );
            _loc8_.addEventListener(
                ReplayLoader.LOAD_ERROR,
                this.replayLoadComplete,
            );
            _loc8_.load(int(_loc2_));
        }
        this.closeLoadMenu(param1);
    }

    private closeLoadMenu(param1: Event) {
        this.loadMenu.removeEventListener(LoadLevelMenu.LOAD, this.beginLoad);
        this.loadMenu.removeEventListener(
            LoadLevelMenu.CANCEL,
            this.closeLoadMenu,
        );
        this.loadMenu.die();
        this.loadMenu = null;
    }

    private levelLoadComplete(param1: Event) {
        var _loc3_: PromptSprite = null;
        var _loc4_: Window = null;
        var _loc5_: string = null;
        var _loc6_: string = null;
        var _loc2_: LevelLoader = param1.target as LevelLoader;
        _loc2_.removeEventListener(
            LevelLoader.LEVEL_LOADED,
            this.levelLoadComplete,
        );
        _loc2_.removeEventListener(
            LevelLoader.ID_NOT_FOUND,
            this.levelLoadComplete,
        );
        _loc2_.removeEventListener(
            LevelLoader.LOAD_ERROR,
            this.levelLoadComplete,
        );
        _loc2_.die();
        this.statusSprite.die();
        if (param1.type == LevelLoader.ID_NOT_FOUND) {
            _loc3_ = new PromptSprite("Sorry, level not found.", "oh?");
            _loc4_ = _loc3_.window;
            this.addChild(_loc4_);
            _loc4_.center();
        } else if (param1.type == LevelLoader.LOAD_ERROR) {
            _loc6_ = "ok";
            if (_loc2_.errorString == "system_error") {
                _loc5_ = "There was an unexpected system Error";
            } else if (_loc2_.errorString == "invalid_action") {
                _loc5_ = "An invalid action was passed (you really shouldn\'t ever be seeing this).";
            } else if (_loc2_.errorString == "bad_param") {
                _loc5_ = "A bad parameter was passed (you really shouldn\'t ever be seeing this).";
            } else if (_loc2_.errorString == "app_error") {
                _loc5_ = "Sorry, there was an application error. It was most likely database related. Please try again in a moment.";
            } else if (_loc2_.errorString == "io_error") {
                _loc5_ = "Sorry, there was an IO Error.";
            } else if (_loc2_.errorString == "security_error") {
                _loc5_ = "Sorry, there was a security Error.";
            } else {
                _loc5_ = "An unknown Error has occurred.";
            }
            _loc3_ = new PromptSprite(_loc5_, _loc6_);
            _loc4_ = _loc3_.window;
            this.addChild(_loc4_);
            _loc4_.center();
        } else {
            Tracker.trackEvent(
                Tracker.LEVEL_REPLAY_LOADER,
                Tracker.LOAD_LEVEL,
                "levelID_" + _loc2_.levelDataObject.id,
            );
            MainMenu.currentMenu = MainMenu.LEVEL_BROWSER;
            LevelBrowser.importLevelDataArray([_loc2_.levelDataObject]);
            this.dispatchEvent(
                new NavigationEvent(
                    NavigationEvent.SESSION,
                    _loc2_.levelDataObject,
                    null,
                ),
            );
        }
    }

    private replayLoadComplete(param1: Event) {
        var _loc3_: PromptSprite = null;
        var _loc4_: Window = null;
        var _loc5_: string = null;
        var _loc6_: string = null;
        var _loc2_: ReplayLoader = param1.target as ReplayLoader;
        _loc2_.removeEventListener(
            ReplayLoader.REPLAY_AND_LEVEL_LOADED,
            this.replayLoadComplete,
        );
        _loc2_.removeEventListener(
            ReplayLoader.ID_NOT_FOUND,
            this.replayLoadComplete,
        );
        _loc2_.removeEventListener(
            ReplayLoader.LOAD_ERROR,
            this.replayLoadComplete,
        );
        _loc2_.die();
        this.statusSprite.die();
        if (param1.type == ReplayLoader.ID_NOT_FOUND) {
            _loc3_ = new PromptSprite("Sorry, replay not found.", "oh?");
            _loc4_ = _loc3_.window;
            this.addChild(_loc4_);
            _loc4_.center();
        } else if (param1.type == LevelLoader.LOAD_ERROR) {
            _loc6_ = "ok";
            if (_loc2_.errorString == "system_error") {
                _loc5_ = "There was an unexpected system Error";
            } else if (_loc2_.errorString == "invalid_action") {
                _loc5_ = "An invalid action was passed (you really shouldn\'t ever be seeing this).";
            } else if (_loc2_.errorString == "bad_param") {
                _loc5_ = "A bad parameter was passed (you really shouldn\'t ever be seeing this).";
            } else if (_loc2_.errorString == "app_error") {
                _loc5_ = "Sorry, there was an application error. It was most likely database related. Please try again in a moment.";
            } else if (_loc2_.errorString == "io_error") {
                _loc5_ = "Sorry, there was an IO Error.";
            } else if (_loc2_.errorString == "security_error") {
                _loc5_ = "Sorry, there was a security Error.";
            } else {
                _loc5_ = "An unknown Error has occurred.";
            }
            _loc3_ = new PromptSprite(_loc5_, _loc6_);
            _loc4_ = _loc3_.window;
            this.addChild(_loc4_);
            _loc4_.center();
        } else {
            Tracker.trackEvent(
                Tracker.LEVEL_REPLAY_LOADER,
                Tracker.LOAD_REPLAY,
                "replayID_" + _loc2_.replayDataObject.id,
            );
            MainMenu.currentMenu = MainMenu.REPLAY_BROWSER;
            LevelBrowser.importLevelDataArray([_loc2_.levelDataObject]);
            ReplayBrowser.importReplayDataArray(
                [_loc2_.replayDataObject],
                _loc2_.levelDataObject,
            );
            this.dispatchEvent(
                new NavigationEvent(
                    NavigationEvent.SESSION,
                    _loc2_.levelDataObject,
                    _loc2_.replayDataObject,
                ),
            );
        }
    }

    private IOErrorHandler(param1: IOErrorEvent) {
        if (this.statusSprite) {
            this.statusSprite.die();
        }
        param1.target.removeEventListener(
            IOErrorEvent.IO_ERROR,
            this.IOErrorHandler,
        );
        var _loc2_ = new PromptSprite(
            "Sorry, there was a problem. Please wait a moment and then try again.",
            "ugh, ok",
        );
        var _loc3_: Window = _loc2_.window;
        this.addChild(_loc3_);
        _loc3_.center();
    }

    private maskTransition(param1: Sprite) {
        this.menuMask = new MenuMask();
        this.addChild(this.menuMask);
        this.menuMask.x = this.menuMask.width;
        param1.mask = this.menuMask;
        TweenLite.to(this.menuMask, 0.5, {
            x: -50,
            ease: Strong.easeOut,
            onComplete: this.maskTransitionComplete,
        });
    }

    private maskTransitionComplete() {
        if (this.featuredMenu) {
            this.featuredMenu.mask = null;
        }
        if (this.levelBrowser) {
            this.levelBrowser.mask = null;
        }
        this.removeChild(this.menuMask);
        this.menuMask = null;
    }

    private hideButtons() {
        var _loc2_: MainSelectionButton = null;
        var _loc1_: number = 0;
        while (_loc1_ < this.buttons.length) {
            _loc2_ = this.buttons[_loc1_];
            _loc2_.alpha = 0.25;
            _loc1_++;
        }
        this.logo.alpha = 0.25;
        this.logobg.alpha = 0.1;
        this.muteBtn.alpha = 0.25;
    }

    private showButtons() {
        var _loc2_: MainSelectionButton = null;
        var _loc1_: number = 0;
        while (_loc1_ < this.buttons.length) {
            _loc2_ = this.buttons[_loc1_];
            _loc2_.alpha = 1;
            _loc1_++;
        }
        this.logo.alpha = 1;
        this.logobg.alpha = 1;
        this.muteBtn.alpha = 0.7;
        this.muteBtn.gotoAndStop(!!Settings.sharedObject.data["muted"] ? 2 : 1);
    }

    private openBasicMenu(param1: string) {
        var _loc2_: BasicMenu = null;
        switch (param1) {
            case "options":
                _loc2_ = new OptionsMenu(
                    this.stage.quality,
                    this.stage.displayState,
                );
                break;
            case "controls":
                _loc2_ = new ControlsMenu();
                break;
            case "credits":
                _loc2_ = new CreditsMenu();
                break;
            case "customize_controls":
                _loc2_ = new CustomizeControlsMenu();
                break;
            default:
                throw new Error("basic menu type not defined");
        }
        this.addChild(_loc2_);
        _loc2_.addEventListener(
            NavigationEvent.MAIN_MENU,
            this.basicMenuClosed,
        );
        _loc2_.addEventListener(
            NavigationEvent.CUSTOMIZE_CONTROLS,
            this.openCustomizeControls,
        );
        this.hideButtons();
        if (this.superPretzel) {
            this.superPretzel.volume = 0.5;
        }
    }

    private openCustomizeControls(param1: NavigationEvent) {
        this.basicMenuClosed(param1);
        this.openBasicMenu("customize_controls");
    }

    private basicMenuClosed(param1: NavigationEvent) {
        var _loc2_: BasicMenu = param1.target as BasicMenu;
        _loc2_.removeEventListener(
            NavigationEvent.MAIN_MENU,
            this.basicMenuClosed,
        );
        _loc2_.removeEventListener(
            NavigationEvent.CUSTOMIZE_CONTROLS,
            this.openCustomizeControls,
        );
        _loc2_.die();
        this.removeChild(_loc2_);
        this.showButtons();
        if (this.superPretzel) {
            this.superPretzel.volume = 1;
        }
    }

    private openFeaturedMenu() {
        MainMenu.currentMenu = MainMenu.FEATURED_MENU;
        this.hideButtons();
        this.featuredMenu = new FeaturedMenu();
        this.addChild(this.featuredMenu);
        this.featuredMenu.init();
        this.featuredMenu.addEventListener(
            NavigationEvent.MAIN_MENU,
            this.closeFeaturedMenu,
        );
        this.featuredMenu.addEventListener(
            NavigationEvent.SESSION,
            this.cloneAndDispatchEvent,
        );
        this.featuredMenu.addEventListener(
            NavigationEvent.REPLAY_BROWSER,
            this.transToReplayBrowser,
        );
        this.featuredMenu.addEventListener(
            NavigationEvent.LEVEL_BROWSER,
            this.transToLevelBrowser,
        );
        if (!this.transitioning) {
            this.featuredMenu.activate();
        }
        if (this.superPretzel) {
            this.superPretzel.volume = 0.5;
        }
    }

    private closeFeaturedMenu(param1: NavigationEvent = null) {
        this.featuredMenu.removeEventListener(
            NavigationEvent.MAIN_MENU,
            this.closeFeaturedMenu,
        );
        this.featuredMenu.removeEventListener(
            NavigationEvent.SESSION,
            this.cloneAndDispatchEvent,
        );
        this.featuredMenu.removeEventListener(
            NavigationEvent.REPLAY_BROWSER,
            this.transToReplayBrowser,
        );
        this.featuredMenu.removeEventListener(
            NavigationEvent.LEVEL_BROWSER,
            this.transToLevelBrowser,
        );
        this.featuredMenu.die();
        this.removeChild(this.featuredMenu);
        this.featuredMenu = null;
        this.showButtons();
        if (this.superPretzel) {
            this.superPretzel.volume = 1;
        }
    }

    private openLevelBrowser(param1: boolean = true) {
        MainMenu.currentMenu = MainMenu.LEVEL_BROWSER;
        this.hideButtons();
        this.levelBrowser = new LevelBrowser();
        this.addChild(this.levelBrowser);
        this.levelBrowser.init();
        this.levelBrowser.addEventListener(
            NavigationEvent.MAIN_MENU,
            this.closeLevelBrowser,
        );
        this.levelBrowser.addEventListener(
            NavigationEvent.SESSION,
            this.cloneAndDispatchEvent,
        );
        this.levelBrowser.addEventListener(
            NavigationEvent.EDITOR,
            this.cloneAndDispatchEvent,
        );
        this.levelBrowser.addEventListener(
            NavigationEvent.REPLAY_BROWSER,
            this.transToReplayBrowser,
        );
        if (!this.transitioning) {
            this.levelBrowser.activate();
        }
        if (this.superPretzel) {
            this.superPretzel.volume = 0.5;
        }
    }

    private closeLevelBrowser(param1: NavigationEvent = null) {
        this.levelBrowser.removeEventListener(
            NavigationEvent.MAIN_MENU,
            this.closeLevelBrowser,
        );
        this.levelBrowser.removeEventListener(
            NavigationEvent.SESSION,
            this.cloneAndDispatchEvent,
        );
        this.levelBrowser.removeEventListener(
            NavigationEvent.EDITOR,
            this.cloneAndDispatchEvent,
        );
        this.levelBrowser.removeEventListener(
            NavigationEvent.REPLAY_BROWSER,
            this.transToReplayBrowser,
        );
        this.levelBrowser.die();
        this.removeChild(this.levelBrowser);
        this.levelBrowser = null;
        this.showButtons();
        if (this.superPretzel) {
            this.superPretzel.volume = 1;
        }
    }

    private openReplayBrowser(param1: LevelDataObject = null) {
        MainMenu.currentMenu = MainMenu.REPLAY_BROWSER;
        this.hideButtons();
        this.replayBrowser = new ReplayBrowser(param1);
        this.addChild(this.replayBrowser);
        this.replayBrowser.init();
        this.replayBrowser.addEventListener(
            NavigationEvent.PREVIOUS_MENU,
            this.transFromReplayBrowser,
        );
        this.replayBrowser.addEventListener(
            NavigationEvent.SESSION,
            this.cloneAndDispatchEvent,
        );
        if (!this.transitioning) {
            this.replayBrowser.activate();
        }
    }

    private closeReplayBrowser(param1: NavigationEvent = null) {
        this.replayBrowser.removeEventListener(
            NavigationEvent.PREVIOUS_MENU,
            this.transFromReplayBrowser,
        );
        this.replayBrowser.removeEventListener(
            NavigationEvent.SESSION,
            this.cloneAndDispatchEvent,
        );
        this.replayBrowser.die();
        this.removeChild(this.replayBrowser);
        this.replayBrowser = null;
        this.showButtons();
    }

    private transToLevelBrowser(param1: NavigationEvent) {
        this.transitioning = true;
        this.featuredMenu.mouseChildren = false;
        this.openLevelBrowser();
        this.levelBrowser.x = 900;
        this.leftBrowser = this.featuredMenu;
        this.rightBrowser = this.levelBrowser;
        this._tweenVal = 0;
        TweenLite.to(this, this.tweenTime, {
            tweenVal: 1,
            ease: Strong.easeInOut,
            onComplete: this.transToLBComplete,
        });
    }

    private transToLBComplete() {
        this.transitioning = false;
        this.leftBrowser = null;
        this.rightBrowser = null;
        this.closeFeaturedMenu();
        this.levelBrowser.activate();
        this.hideButtons();
        if (this.superPretzel) {
            this.superPretzel.volume = 0.5;
        }
    }

    private transToReplayBrowser(param1: NavigationEvent) {
        this.transitioning = true;
        if (param1.target == this.featuredMenu) {
            MainMenu.previousMenu = MainMenu.FEATURED_MENU;
            this.featuredMenu.mouseChildren = false;
            this.leftBrowser = this.featuredMenu;
        } else {
            MainMenu.previousMenu = MainMenu.LEVEL_BROWSER;
            this.levelBrowser.mouseChildren = false;
            this.leftBrowser = this.levelBrowser;
        }
        this.openReplayBrowser(param1.levelDataObject);
        this.replayBrowser.clearReplayList();
        this.replayBrowser.x = 900;
        this.rightBrowser = this.replayBrowser;
        this._tweenVal = 0;
        TweenLite.to(this, this.tweenTime, {
            tweenVal: 1,
            ease: Strong.easeInOut,
            onComplete: this.transToComplete,
        });
    }

    private transToComplete() {
        this.transitioning = false;
        this.leftBrowser = null;
        this.rightBrowser = null;
        if (MainMenu.previousMenu == MainMenu.FEATURED_MENU) {
            this.closeFeaturedMenu();
        } else {
            this.closeLevelBrowser();
        }
        this.replayBrowser.activate();
        this.hideButtons();
    }

    private transFromReplayBrowser(param1: NavigationEvent) {
        this.transitioning = true;
        this.replayBrowser.mouseChildren = false;
        if (MainMenu.previousMenu == MainMenu.FEATURED_MENU) {
            this.openFeaturedMenu();
            this.featuredMenu.x = -900;
            this.leftBrowser = this.featuredMenu;
        } else {
            this.openLevelBrowser();
            this.levelBrowser.x = -900;
            this.leftBrowser = this.levelBrowser;
        }
        this.rightBrowser = this.replayBrowser;
        this._tweenVal = 1;
        TweenLite.to(this, this.tweenTime, {
            tweenVal: 0,
            ease: Strong.easeInOut,
            onComplete: this.transFromRBComplete,
        });
    }

    private transFromRBComplete() {
        this.transitioning = false;
        this.leftBrowser = null;
        this.rightBrowser = null;
        this.closeReplayBrowser();
        if (MainMenu.previousMenu == MainMenu.FEATURED_MENU) {
            this.featuredMenu.activate();
        } else {
            this.levelBrowser.activate();
        }
        MainMenu.previousMenu = null;
        this.hideButtons();
    }

    public get tweenVal(): number {
        return this._tweenVal;
    }

    public set tweenVal(param1: number) {
        this._tweenVal = param1;
        var _loc2_: number = Math.round(this._tweenVal * -900);
        this.leftBrowser.x = _loc2_;
        this.rightBrowser.x = _loc2_ + 900;
    }

    private cloneAndDispatchEvent(param1: Event) {
        this.dispatchEvent(param1.clone());
    }

    public die() {
        var _loc2_: MainSelectionButton = null;
        this.removeEventListener(Event.ENTER_FRAME, this.organizeButtons);
        this.removeEventListener(MouseEvent.MOUSE_UP, this.mouseUpHandler);
        if (this.featuredMenu) {
            this.closeFeaturedMenu();
        }
        if (this.levelBrowser) {
            this.closeLevelBrowser();
        }
        if (this.replayBrowser) {
            this.closeReplayBrowser();
        }
        if (this.superPretzel) {
            this.superPretzel.fadeOut(1);
            this.superPretzel = null;
        }
        var _loc1_: number = 0;
        while (_loc1_ < this.buttons.length) {
            _loc2_ = this.buttons[_loc1_];
            _loc2_.die();
            _loc1_++;
        }
    }
}