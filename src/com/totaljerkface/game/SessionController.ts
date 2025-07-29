import ReplayData from "@/com/totaljerkface/game/ReplayData";
import Session from "@/com/totaljerkface/game/Session";
import SessionContentLoader from "@/com/totaljerkface/game/SessionContentLoader";
import SessionReplay from "@/com/totaljerkface/game/SessionReplay";
import SessionRestart from "@/com/totaljerkface/game/SessionRestart";
import SessionRestartReplay from "@/com/totaljerkface/game/SessionRestartReplay";
import Settings from "@/com/totaljerkface/game/Settings";
import CharacterB2D from "@/com/totaljerkface/game/character/CharacterB2D";
import MouseHelper from "@/com/totaljerkface/game/editor/MouseHelper";
import PromptSprite from "@/com/totaljerkface/game/editor/PromptSprite";
import GenericButton from "@/com/totaljerkface/game/editor/ui/GenericButton";
import Window from "@/com/totaljerkface/game/editor/ui/Window";
import NavigationEvent from "@/com/totaljerkface/game/events/NavigationEvent";
import SessionEvent from "@/com/totaljerkface/game/events/SessionEvent";
import LevelB2D from "@/com/totaljerkface/game/level/LevelB2D";
import CharacterMenu from "@/com/totaljerkface/game/menus/CharacterMenu";
import LevelDataObject from "@/com/totaljerkface/game/menus/LevelDataObject";
import ReplayDataObject from "@/com/totaljerkface/game/menus/ReplayDataObject";
import SaveReplayMenu from "@/com/totaljerkface/game/menus/SaveReplayMenu";
import SessionMenu from "@/com/totaljerkface/game/menus/SessionMenu";
import SessionReplayMenu from "@/com/totaljerkface/game/menus/SessionReplayMenu";
import TextUtils from "@/com/totaljerkface/game/utils/TextUtils";
import Tracker from "@/com/totaljerkface/game/utils/Tracker";
import TweenLite from "@/gs/TweenLite";
import Strong from "@/gs/easing/Strong";
import VictoryMC from "@/top/VictoryMC";
import { boundClass } from 'autobind-decorator';
import DisplayObjectContainer from "flash/display/DisplayObjectContainer";
import Sprite from "flash/display/Sprite";
import ErrorEvent from "flash/events/ErrorEvent";
import Event from "flash/events/Event";
import EventDispatcher from "flash/events/EventDispatcher";
import IOErrorEvent from "flash/events/IOErrorEvent";
import KeyboardEvent from "flash/events/KeyboardEvent";
import MouseEvent from "flash/events/MouseEvent";

@boundClass
export default class SessionController extends EventDispatcher {
    private parent: DisplayObjectContainer;
    private levelDataObject: LevelDataObject;
    private replayDataObject: ReplayDataObject;
    private sessionContentLoader: SessionContentLoader;
    private characterMenu: CharacterMenu;
    private session: Session;
    private menuButton: GenericButton;
    private sessionMenu: SessionMenu;
    private sessionReplayMenu: SessionReplayMenu;
    private saveReplayMenu: SaveReplayMenu;
    private promptSprite: PromptSprite;
    private victoryMC: VictoryMC;
    private disableSave: boolean;
    private incrementPlays: boolean;
    private restartCount: number = 0;
    private replayCount: number = 0;

    constructor(
        param1: DisplayObjectContainer,
        param2: LevelDataObject,
        param3: ReplayDataObject = null,
    ) {
        super();
        this.parent = param1;
        this.levelDataObject = param2;
        this.replayDataObject = param3;
    }

    public begin() {
        if (this.replayDataObject) {
            if (this.replayDataObject.version > Settings.CURRENT_VERSION) {
                Settings.debugText.text = "This replay is from a newer version of Happy Wheels.  Clear cache and reload";
                throw new Error(
                    "This replay is from a newer version of Happy Wheels.  Clear cache and reload",
                );
            }
            this.loadSession();
        } else {
            this.incrementPlays = true;
            if (this.levelDataObject.forceChar) {
                this.loadSession();
            } else {
                this.openCharacterMenu();
            }
        }
    }

    private openCharacterMenu() {
        Settings.hideVehicle = false;
        this.characterMenu = new CharacterMenu();
        this.parent.addChildAt(this.characterMenu, 0);
        this.characterMenu.addEventListener(
            CharacterMenu.CHARACTER_SELECTED,
            this.loadSession,
        );
    }

    private closeCharacterMenu() {
        this.characterMenu.die();
        this.parent.removeChild(this.characterMenu);
        this.characterMenu.removeEventListener(
            CharacterMenu.CHARACTER_SELECTED,
            this.loadSession,
        );
        this.characterMenu = null;
    }

    private loadSession(param1: Event = null) {
        if (this.replayDataObject) {
            Settings.characterIndex = this.replayDataObject.character;
            this.sessionContentLoader = new SessionContentLoader(
                this.levelDataObject,
                Settings.characterIndex,
                this.replayDataObject.id,
            );
        } else {
            if (this.characterMenu) {
                this.closeCharacterMenu();
                Tracker.trackEvent(
                    Tracker.CHARACTER_MENU,
                    Tracker.CHARACTER_SELECTED,
                    "character_" + Settings.characterIndex,
                );
            }
            if (this.levelDataObject.forceChar) {
                Settings.characterIndex = this.levelDataObject.character;
            }
            this.sessionContentLoader = new SessionContentLoader(
                this.levelDataObject,
                Settings.characterIndex,
                -1,
                this.incrementPlays,
            );
        }
        this.sessionContentLoader.addEventListener(
            Event.COMPLETE,
            this.beginSession,
        );
        this.sessionContentLoader.addEventListener(
            IOErrorEvent.IO_ERROR,
            this.IOErrorHandler,
        );
        this.sessionContentLoader.addEventListener(
            ErrorEvent.ERROR,
            this.loadErrorHandler,
        );
        this.sessionContentLoader.load();
        this.incrementPlays = false;
    }

    private beginSession(param1: Event) {
        trace("begin session " + Settings.characterIndex);
        Settings.levelIndex = this.levelDataObject.id;
        Settings.stageSprite = this.parent.stage;
        if (this.replayDataObject) {
            Settings.currentSession = this.session = new SessionReplay(
                this.replayDataObject.version,
                this.sessionContentLoader.characterData,
                this.sessionContentLoader.levelData,
                this.sessionContentLoader.levelVersion,
                this.sessionContentLoader.replayData,
            );
        } else {
            Settings.currentSession = this.session = new Session(
                Settings.CURRENT_VERSION,
                this.sessionContentLoader.characterData,
                this.sessionContentLoader.levelData,
                this.sessionContentLoader.levelVersion,
            );
        }
        this.menuButton = new GenericButton("menu", 10066329, 50, 16777215);
        this.parent.addChildAt(this.menuButton, 0);
        this.menuButton.x = 10;
        this.menuButton.y = 467;
        this.menuButton.addEventListener(
            MouseEvent.MOUSE_UP,
            this.menuButtonPress,
        );
        this.menuButton.addEventListener(
            MouseEvent.ROLL_OVER,
            this.menuButtonRoll,
        );
        if (Settings.hideHUD) {
            this.menuButton.visible = false;
        }
        this.parent.addChildAt(this.session, 0);
        this.session.create();
        this.parent.stage.focus = this.parent.stage;
        this.sessionContentLoader.removeEventListener(
            Event.COMPLETE,
            this.beginSession,
        );
        this.sessionContentLoader.removeEventListener(
            IOErrorEvent.IO_ERROR,
            this.IOErrorHandler,
        );
        this.sessionContentLoader.removeEventListener(
            ErrorEvent.ERROR,
            this.loadErrorHandler,
        );
        this.sessionContentLoader = null;
        this.session.addEventListener(
            SessionEvent.COMPLETED,
            this.sessionCompleteHandler,
        );
        this.parent.stage.addEventListener(
            KeyboardEvent.KEY_DOWN,
            this.keyDownHandler,
        );
    }

    private loadErrorHandler(param1: Event) {
        var _loc3_: string = null;
        this.sessionContentLoader.removeEventListener(
            Event.COMPLETE,
            this.beginSession,
        );
        this.sessionContentLoader.removeEventListener(
            IOErrorEvent.IO_ERROR,
            this.IOErrorHandler,
        );
        this.sessionContentLoader.removeEventListener(
            ErrorEvent.ERROR,
            this.loadErrorHandler,
        );
        var _loc2_: string = this.sessionContentLoader.errorString;
        this.sessionContentLoader = null;
        var _loc4_: string = "ok";
        if (_loc2_ == "system_error") {
            _loc3_ = "There was an unexpected system Error";
        } else if (_loc2_ == "invalid_action") {
            _loc3_ = "An invalid action was passed (you really shouldn\'t ever be seeing this).";
        } else if (_loc2_ == "bad_param") {
            _loc3_ = "A bad parameter was passed (you really shouldn\'t ever be seeing this).";
        } else if (_loc2_ == "app_error") {
            _loc3_ = "Sorry, there was an application error. It was most likely database related. Please try again in a moment.";
        } else {
            _loc3_ = "An unknown Error has occurred.";
        }
        this.openPrompt(_loc3_, _loc4_);
        this.dispatchEvent(new NavigationEvent(NavigationEvent.MAIN_MENU));
    }

    private IOErrorHandler(param1: Event) {
        this.sessionContentLoader.removeEventListener(
            Event.COMPLETE,
            this.beginSession,
        );
        this.sessionContentLoader.removeEventListener(
            IOErrorEvent.IO_ERROR,
            this.IOErrorHandler,
        );
        this.sessionContentLoader.removeEventListener(
            ErrorEvent.ERROR,
            this.loadErrorHandler,
        );
        this.sessionContentLoader = null;
        this.openPrompt(
            "Sorry, there was a problem loading the level. Please wait a moment and then try again.",
            "alright",
        );
        this.dispatchEvent(new NavigationEvent(NavigationEvent.MAIN_MENU));
    }

    private killSession() {
        this.session.die();
        this.session.removeEventListener(
            SessionEvent.COMPLETED,
            this.sessionCompleteHandler,
        );
        this.parent.removeChild(this.session);
        this.menuButton.addEventListener(
            MouseEvent.MOUSE_UP,
            this.menuButtonPress,
        );
        this.menuButton.addEventListener(
            MouseEvent.ROLL_OVER,
            this.menuButtonRoll,
        );
        this.parent.removeChild(this.menuButton);
        if (this.victoryMC) {
            this.parent.removeChild(this.victoryMC);
            this.victoryMC = null;
        }
        Settings.currentSession = this.session = null;
    }

    private menuButtonPress(param1: MouseEvent = null) {
        if (this.replayDataObject) {
            if (!this.sessionReplayMenu) {
                this.openSessionReplayMenu();
            } else {
                this.closeSessionReplayMenu();
            }
        } else if (!this.sessionMenu) {
            this.openSessionMenu();
        } else if (!this.sessionMenu.disableKeys) {
            this.closeSessionMenu();
        }
    }

    private menuButtonRoll(param1: MouseEvent) {
        MouseHelper.instance.show(
            "Tab (esc is now used to exit fullscreen)",
            this.menuButton,
        );
    }

    private sessionCompleteHandler(param1: SessionEvent) {
        this.session.removeEventListener(
            SessionEvent.COMPLETED,
            this.sessionCompleteHandler,
        );
        if (this.replayDataObject) {
            this.openSessionReplayMenu(false);
        } else {
            this.openSessionMenu(false);
        }
    }

    private keyDownHandler(param1: KeyboardEvent) {
        if (!this.session) {
            return;
        }
        switch (param1.keyCode) {
            case 9:
                this.menuButtonPress();
        }
    }

    private openSessionMenu(param1: boolean = true) {
        var _loc2_: Window = null;
        var _loc3_: number = 0;
        var _loc4_: number = NaN;
        if (this.sessionMenu) {
            return;
        }
        this.sessionMenu = new SessionMenu(
            this.levelDataObject,
            this.disableSave,
        );
        this.sessionMenu.addEventListener(
            SessionMenu.RESTART_LEVEL,
            this.restartLevel,
        );
        this.sessionMenu.addEventListener(
            SessionMenu.CHOOSE_CHARACTER,
            this.reopenCharacterMenu,
        );
        this.sessionMenu.addEventListener(
            SessionMenu.VIEW_REPLAY,
            this.replayLevel,
        );
        this.sessionMenu.addEventListener(
            SessionMenu.SAVE_REPLAY,
            this.openSaveReplayMenu,
        );
        this.sessionMenu.addEventListener(
            SessionMenu.CANCEL,
            this.closeSessionMenu,
        );
        this.sessionMenu.addEventListener(
            SessionMenu.EXIT,
            this.returnToMainMenu,
        );
        _loc2_ = this.sessionMenu.window;
        this.parent.addChild(_loc2_);
        _loc2_.center();
        this.sessionMenu.init();
        if (param1) {
            this.session.pause();
        } else {
            _loc3_ = _loc2_.y;
            _loc2_.y = 520;
            if (this.session.replayData.completed) {
                this.victoryMC = new VictoryMC();
                this.victoryMC.x = 450;
                this.victoryMC.y = 175;
                _loc4_ = this.session.replayData.getLength() / 30;
                // @ts-expect-error
                this.victoryMC.timeText.textField.text =
                    TextUtils.setToHundredths(_loc4_) + " seconds";
                this.parent.addChildAt(
                    this.victoryMC,
                    this.parent.getChildIndex(_loc2_),
                );
                _loc3_ = 120;
                TweenLite.to(_loc2_, 0.5, {
                    y: _loc3_,
                    ease: Strong.easeOut,
                    delay: 1.5,
                });
            } else {
                TweenLite.to(_loc2_, 0.5, {
                    y: _loc3_,
                    ease: Strong.easeOut,
                });
            }
        }
    }

    private closeSessionMenu(param1: Event = null) {
        if (!this.sessionMenu) {
            return;
        }
        this.sessionMenu.die();
        this.sessionMenu.removeEventListener(
            SessionMenu.RESTART_LEVEL,
            this.restartLevel,
        );
        this.sessionMenu.removeEventListener(
            SessionMenu.CHOOSE_CHARACTER,
            this.reopenCharacterMenu,
        );
        this.sessionMenu.removeEventListener(
            SessionMenu.VIEW_REPLAY,
            this.replayLevel,
        );
        this.sessionMenu.removeEventListener(
            SessionMenu.SAVE_REPLAY,
            this.openSaveReplayMenu,
        );
        this.sessionMenu.removeEventListener(
            SessionMenu.CANCEL,
            this.closeSessionMenu,
        );
        this.sessionMenu.removeEventListener(
            SessionMenu.EXIT,
            this.returnToMainMenu,
        );
        this.sessionMenu = null;
        this.session.unpause();
    }

    private openSessionReplayMenu(param1: boolean = true) {
        if (this.sessionReplayMenu) {
            return;
        }
        if (param1) {
            this.session.pause();
        }
        this.sessionReplayMenu = new SessionReplayMenu(this.replayDataObject);
        this.sessionReplayMenu.addEventListener(
            SessionReplayMenu.RESTART_REPLAY,
            this.replayLevel,
        );
        this.sessionReplayMenu.addEventListener(
            SessionReplayMenu.PLAY_LEVEL,
            this.restartLevel,
        );
        this.sessionReplayMenu.addEventListener(
            SessionReplayMenu.CHOOSE_CHARACTER,
            this.reopenCharacterMenu,
        );
        this.sessionReplayMenu.addEventListener(
            SessionReplayMenu.CANCEL,
            this.closeSessionReplayMenu,
        );
        this.sessionReplayMenu.addEventListener(
            SessionReplayMenu.EXIT,
            this.returnToMainMenu,
        );
        var _loc2_: Window = this.sessionReplayMenu.window;
        this.parent.addChild(_loc2_);
        _loc2_.center();
    }

    private closeSessionReplayMenu(param1: Event = null) {
        if (!this.sessionReplayMenu) {
            return;
        }
        this.sessionReplayMenu.die();
        this.sessionReplayMenu.removeEventListener(
            SessionReplayMenu.RESTART_REPLAY,
            this.replayLevel,
        );
        this.sessionReplayMenu.removeEventListener(
            SessionReplayMenu.PLAY_LEVEL,
            this.restartLevel,
        );
        this.sessionReplayMenu.removeEventListener(
            SessionReplayMenu.CHOOSE_CHARACTER,
            this.reopenCharacterMenu,
        );
        this.sessionReplayMenu.removeEventListener(
            SessionReplayMenu.CANCEL,
            this.closeSessionReplayMenu,
        );
        this.sessionReplayMenu.removeEventListener(
            SessionReplayMenu.EXIT,
            this.returnToMainMenu,
        );
        this.sessionReplayMenu = null;
        this.session.unpause();
    }

    private reopenCharacterMenu(param1: Event) {
        this.replayDataObject = null;
        this.disableSave = false;
        this.closeSessionMenu();
        this.closeSessionReplayMenu();
        this.killSession();
        if (this.levelDataObject.forceChar) {
            this.loadSession();
        } else {
            this.restartCount += 1;
            Tracker.trackEvent(
                Tracker.LEVEL,
                Tracker.RESTART,
                "levelID_" + this.levelDataObject.id,
                this.restartCount,
            );
            this.openCharacterMenu();
        }
    }

    private returnToMainMenu(param1: Event) {
        this.closeSessionMenu();
        this.closeSessionReplayMenu();
        this.killSession();
        this.dispatchEvent(new NavigationEvent(NavigationEvent.MAIN_MENU));
    }

    private restartLevel(param1: Event = null) {
        this.closeSessionMenu();
        this.closeSessionReplayMenu();
        this.disableSave = false;
        this.replayDataObject = null;
        if (this.victoryMC) {
            this.parent.removeChild(this.victoryMC);
            this.victoryMC = null;
        }
        this.restartCount += 1;
        Tracker.trackEvent(
            Tracker.LEVEL,
            Tracker.RESTART,
            "levelID_" + this.levelDataObject.id,
            this.restartCount,
        );
        var _loc2_: CharacterB2D = this.session.character;
        var _loc3_: LevelB2D = this.session.level;
        var _loc4_: Sprite = this.session.containerSprite;
        var _loc5_: number = this.session.levelVersion;
        this.session.die();
        this.session.removeEventListener(
            SessionEvent.COMPLETED,
            this.sessionCompleteHandler,
        );
        this.parent.removeChild(this.session);
        Settings.currentSession = new SessionRestart(
            _loc4_,
            Settings.CURRENT_VERSION,
            _loc2_,
            _loc3_,
            _loc5_,
        );
        this.session = Settings.currentSession;
        this.parent.addChildAt(this.session, 0);
        this.session.create();
        this.session.addEventListener(
            SessionEvent.COMPLETED,
            this.sessionCompleteHandler,
        );
    }

    private replayLevel(param1: Event) {
        this.closeSessionMenu();
        this.closeSessionReplayMenu();
        if (this.victoryMC) {
            this.parent.removeChild(this.victoryMC);
            this.victoryMC = null;
        }
        this.replayCount += 1;
        Tracker.trackEvent(
            Tracker.LEVEL,
            Tracker.VIEW_REPLAY,
            "levelID_" + this.levelDataObject.id,
            this.replayCount,
        );
        var _loc2_: CharacterB2D = this.session.character;
        var _loc3_: LevelB2D = this.session.level;
        var _loc4_: Sprite = this.session.containerSprite;
        var _loc5_: ReplayData = this.session.replayData;
        var _loc6_: number = this.session.version;
        var _loc7_: number = this.session.levelVersion;
        this.session.die();
        this.session.removeEventListener(
            SessionEvent.COMPLETED,
            this.sessionCompleteHandler,
        );
        this.parent.removeChild(this.session);
        Settings.currentSession = new SessionRestartReplay(
            _loc4_,
            _loc6_,
            _loc2_,
            _loc3_,
            _loc7_,
            _loc5_,
        );
        this.session = Settings.currentSession;
        this.parent.addChildAt(this.session, 0);
        this.session.create();
        this.session.addEventListener(
            SessionEvent.COMPLETED,
            this.sessionCompleteHandler,
        );
    }

    private openSaveReplayMenu(param1: Event) {
        if (this.session.replayData.getLength() > Settings.maxReplayFrames) {
            this.openPrompt(
                "Sorry, your replay must be less than 200 seconds.",
                "ok",
            );
            return;
        }
        this.sessionMenu.disableKeys = true;
        this.saveReplayMenu = new SaveReplayMenu(
            this.session.replayData,
            this.levelDataObject.id,
            Settings.characterIndex,
        );
        this.saveReplayMenu.addEventListener(
            SaveReplayMenu.SAVE_COMPLETE,
            this.closeSaveReplayMenu,
        );
        this.saveReplayMenu.addEventListener(
            SaveReplayMenu.GENERIC_ERROR,
            this.closeSaveReplayMenu,
        );
        this.saveReplayMenu.addEventListener(
            Window.WINDOW_CLOSED,
            this.closeSaveReplayMenu,
        );
        var _loc2_: Window = this.saveReplayMenu.window;
        this.parent.addChild(_loc2_);
        _loc2_.center();
    }

    private closeSaveReplayMenu(param1: Event) {
        this.saveReplayMenu.removeEventListener(
            SaveReplayMenu.SAVE_COMPLETE,
            this.closeSaveReplayMenu,
        );
        this.saveReplayMenu.removeEventListener(
            SaveReplayMenu.GENERIC_ERROR,
            this.closeSaveReplayMenu,
        );
        this.saveReplayMenu.removeEventListener(
            Window.WINDOW_CLOSED,
            this.closeSaveReplayMenu,
        );
        this.saveReplayMenu.die();
        this.sessionMenu.disableKeys = false;
        if (param1.type == SaveReplayMenu.GENERIC_ERROR) {
            this.openPrompt(this.saveReplayMenu.errorMessage, "alright");
        }
        if (param1.type == SaveReplayMenu.SAVE_COMPLETE) {
            Tracker.trackEvent(
                Tracker.LEVEL,
                Tracker.SAVE_REPLAY,
                "levelID_" + this.levelDataObject.id,
            );
            trace("save complete");
            this.disableSave = true;
            this.sessionMenu.disableSave = true;
            this.openPrompt(
                "Replay succesfully saved: id " +
                this.saveReplayMenu.newReplayID,
                "ok",
            );
        }
    }

    private openPrompt(param1: string, param2: string) {
        this.promptSprite = new PromptSprite(param1, param2);
        var _loc3_: Window = this.promptSprite.window;
        this.parent.addChild(_loc3_);
        _loc3_.center();
    }

    public die() {
        this.parent.stage.removeEventListener(
            KeyboardEvent.KEY_DOWN,
            this.keyDownHandler,
        );
    }
}