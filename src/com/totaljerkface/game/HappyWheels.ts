import BlastedMouseWheelBlock from "@/com/kumokairo/mousewheel/BlastedMouseWheelBlock";
import ArchitectureTest from "@/com/totaljerkface/game/ArchitectureTest";
import BitmapManager from "@/com/totaljerkface/game/BitmapManager";
import DebugText from "@/com/totaljerkface/game/DebugText";
import Editor from "@/com/totaljerkface/game/editor/Editor";
import MouseHelper from "@/com/totaljerkface/game/editor/MouseHelper";
import NavigationEvent from "@/com/totaljerkface/game/events/NavigationEvent";
import LevelLoader from "@/com/totaljerkface/game/LevelLoader";
import MemoryTest from "@/com/totaljerkface/game/MemoryTest";
import LevelBrowser from "@/com/totaljerkface/game/menus/LevelBrowser";
import LevelDataObject from "@/com/totaljerkface/game/menus/LevelDataObject";
import MainMenu from "@/com/totaljerkface/game/menus/MainMenu";
import ReplayBrowser from "@/com/totaljerkface/game/menus/ReplayBrowser";
import ReplayDataObject from "@/com/totaljerkface/game/menus/ReplayDataObject";
import ParticleController from "@/com/totaljerkface/game/particles/ParticleController";
import ReplayLoader from "@/com/totaljerkface/game/ReplayLoader";
import SessionController from "@/com/totaljerkface/game/SessionController";
import Settings from "@/com/totaljerkface/game/Settings";
import SoundLoader from "@/com/totaljerkface/game/SoundLoader";
import Tracker from "@/com/totaljerkface/game/utils/Tracker";
import GraphicsPathCommand from "flash/display/GraphicsPathCommand";
import GraphicsPathWinding from "flash/display/GraphicsPathWinding";
import Sprite from "flash/display/Sprite";
import Event from "flash/events/Event";
import ExternalInterface from "flash/external/ExternalInterface";
import SharedObject from "flash/net/SharedObject";
import Timer from "flash/utils/Timer";
import { boundClass } from 'autobind-decorator';

@boundClass
export default class HappyWheels extends Sprite {
    private architectureTest: ArchitectureTest;
    private mainMenu: MainMenu;
    private editor: Editor;
    private sessionController: SessionController;
    private mouseHelper: MouseHelper;
    private memoryTest: MemoryTest;
    private borderCover: Sprite;
    private _replayID: number;
    private _levelID: number;
    private _userID: number = 0;
    private _userName = "";
    private _potato = "";
    private _isMac = false;
    private _readOnly = false;
    private _preloadTimer: Timer;
    
    public init() {
        trace("init");
        trace("ExternalInterface.available " + ExternalInterface.available);

        if (ExternalInterface.available) {
            BlastedMouseWheelBlock.initialize(this.stage, "happyswf");
        }

        trace("readOnly " + this._readOnly);

        if (this._readOnly) {
            Settings.disableUpload = true;
        }

        this.createDebugText();
        this.createBorderCover();
        this.beginArchitectureTest();
    }

    public get levelID(): number {
        return this._levelID;
    }

    public set levelID(levelID: number) {
        this._levelID = levelID;
    }

    public get replayID(): number {
        return this._replayID;
    }

    public set replayID(replayID: number) {
        this._replayID = replayID;
    }

    public get userID(): number {
        return this._userID;
    }

    public set userID(userID: number) {
        this._userID = userID;
    }

    public get userName(): string {
        return this._userName;
    }

    public set userName(userName: string) {
        this._userName = userName;
    }

    public get isMac(): boolean {
        return this._isMac;
    }

    public set isMac(isMac: boolean) {
        this._isMac = isMac;
    }

    public get readOnly(): boolean {
        return this._readOnly;
    }

    public set readOnly(readOnly: boolean) {
        this._readOnly = readOnly;
    }

    public get potato(): string {
        return this._potato;
    }

    public set potato(potato: string) {
        this._potato = potato;
    }

    public get preloadTimer(): Timer {
        return this._preloadTimer;
    }

    public set preloadTimer(timer: Timer) {
        this._preloadTimer = timer;
    }

    private beginArchitectureTest() {
        this.architectureTest = new ArchitectureTest();
        this.architectureTest.addEventListener(
            Event.COMPLETE,
            this.testComplete,
        );
        this.architectureTest.test();
    }

    private testComplete() {
        trace("test result = " + this.architectureTest.result);

        Settings.architecture = this.architectureTest.result;
        Settings.sharedObject = SharedObject.getLocal("options135");

        var options = Settings.sharedObject;

        if (options.data["keyCodes"]) {
            Settings.accelerateCode = options.data["keyCodes"].get("accelerateCode");
            Settings.decelerateCode = options.data["keyCodes"].get("decelerateCode");
            Settings.leanForwardCode = options.data["keyCodes"].get("leanForwardCode");
            Settings.leanBackCode = options.data["keyCodes"].get("leanBackCode");
            Settings.primaryActionCode = options.data["keyCodes"].get("primaryActionCode");
            Settings.secondaryAction1Code = options.data["keyCodes"].get("secondaryAction1Code");
            Settings.secondaryAction2Code = options.data["keyCodes"].get("secondaryAction2Code");
            Settings.ejectCode = options.data["keyCodes"].get("ejectCode");
            Settings.switchCameraCode = options.data["keyCodes"].get("switchCameraCode");
        } else {
            options.data["keyCodes"] = new Dictionary();
            options.data["keyCodes"].set("accelerateCode", Settings.accelerateDefaultCode);
            options.data["keyCodes"].set("decelerateCode", Settings.decelerateDefaultCode);
            options.data["keyCodes"].set("leanForwardCode", Settings.leanForwardDefaultCode);
            options.data["keyCodes"].set("leanBackCode", Settings.leanBackDefaultCode);
            options.data["keyCodes"].set("primaryActionCode", Settings.primaryActionDefaultCode);
            options.data["keyCodes"].set("secondaryAction1Code", Settings.secondaryAction1DefaultCode);
            options.data["keyCodes"].set("secondaryAction2Code", Settings.secondaryAction2DefaultCode);
            options.data["keyCodes"].set("ejectCode", Settings.ejectDefaultCode);
            options.data["keyCodes"].set("switchCameraCode", Settings.switchCameraDefaultCode);
        }

        for (const key in options.data) {
            trace(key + ": " + options.data[key]);
        }

        if (options.data["quality"] != undefined) {
            this.stage.quality = options.data["quality"];
        }
        if (options.data["smoothing"] != undefined) {
            Settings.smoothing = options.data["smoothing"];
        }
        if (options.data["compressed"] != undefined) {
            Settings.useCompressedTextures = options.data["compressed"];
        }
        if (options.data["maxParticles"] != undefined) {
            ParticleController.maxParticles = options.data["maxParticles"];
        }
        if (options.data["bloodSetting"] != undefined) {
            Settings.bloodSetting = options.data["bloodSetting"];
        }

        this.mouseHelper = new MouseHelper();
        this.addChild(this.mouseHelper);

        new BitmapManager();
        new MemoryTest();

        this.loadSounds();
    }

    private createDebugText() {
        Settings.debugText = new DebugText();
        var debugText = Settings.debugText;

        this.addChild(debugText);

        if (Settings.hideHUD) {
            debugText.visible = false;
        }
    }

    private createBorderCover() {
        return;
        this.borderCover = new Sprite();
        this.stage.addChild(this.borderCover);

        var vector1: Vector<number> = new Vector<number>();
        var vector2: Vector<number> = new Vector<number>();

        this.borderCover.graphics.beginFill(0, 1);

        var width = 900;
        var height = 500;

        vector2.push(0 - height, 0 - height);
        vector2.push(width + height, 0 - height);
        vector2.push(width + height, height + height);
        vector2.push(0 - height, height + height);
        vector2.push(0 - height, 0 - height);
        vector1.push(GraphicsPathCommand.MOVE_TO);
        vector1.push(GraphicsPathCommand.LINE_TO);
        vector1.push(GraphicsPathCommand.LINE_TO);
        vector1.push(GraphicsPathCommand.LINE_TO);
        vector1.push(GraphicsPathCommand.LINE_TO);
        vector2.push(0, 0);
        vector2.push(0, height);
        vector2.push(width, height);
        vector2.push(width, 0);
        vector2.push(0, 0);
        vector1.push(GraphicsPathCommand.MOVE_TO);
        vector1.push(GraphicsPathCommand.LINE_TO);
        vector1.push(GraphicsPathCommand.LINE_TO);
        vector1.push(GraphicsPathCommand.LINE_TO);
        vector1.push(GraphicsPathCommand.LINE_TO);

        this.borderCover.graphics.drawPath(
            vector1,
            vector2,
            GraphicsPathWinding.NON_ZERO
        );

        this.borderCover.graphics.endFill();
    }

    private loadSounds() {
        trace("Loading Sound");
        var soundLoader = new SoundLoader();
        this.addChild(soundLoader);
        console.log('loadSounds', Event.COMPLETE);
        soundLoader.addEventListener(Event.COMPLETE, this.soundLoaded);
        soundLoader.loadSound(this._potato);
    }

    private soundLoaded(event: Event) {
        var levelLoader: LevelLoader = null;
        var replayLoader: ReplayLoader = null;

        trace("Sound Loaded");

        var soundLoader: SoundLoader = event.target as SoundLoader;

        soundLoader.removeEventListener(Event.COMPLETE, this.soundLoaded);

        this.removeChild(soundLoader);

        if (this._userID > 0) {
            Settings.user_id = this._userID;
            Settings.username = this._userName;
        }

        trace("levelID = " + this._levelID);
        trace("replayID = " + this._replayID);

        if (this._preloadTimer) {
            Tracker.trackEvent(
                Tracker.PRELOADER,
                Tracker.LOAD_COMPLETE,
                "userID_" + this._userID,
                this.preloadTimer.currentCount,
            );
            this._preloadTimer.stop();
            this._preloadTimer = null;
        }

        if (this._levelID) {
            levelLoader = new LevelLoader();
            levelLoader.addEventListener(
                LevelLoader.LEVEL_LOADED,
                this.levelLoadComplete,
            );
            levelLoader.addEventListener(
                LevelLoader.ID_NOT_FOUND,
                this.levelLoadComplete,
            );
            levelLoader.addEventListener(
                LevelLoader.LOAD_ERROR,
                this.levelLoadComplete,
            );
            levelLoader.load(this._levelID);
        } else if (this._replayID) {
            replayLoader = new ReplayLoader();
            replayLoader.addEventListener(
                ReplayLoader.REPLAY_AND_LEVEL_LOADED,
                this.replayLoadComplete,
            );
            replayLoader.addEventListener(
                ReplayLoader.ID_NOT_FOUND,
                this.replayLoadComplete,
            );
            replayLoader.addEventListener(
                ReplayLoader.LOAD_ERROR,
                this.replayLoadComplete,
            );
            replayLoader.load(this._replayID);
        } else {
            this.openMainMenu();
        }
    }

    private levelLoadComplete(event: Event) {
        var levelLoader: LevelLoader = event.target as LevelLoader;
        levelLoader.removeEventListener(
            LevelLoader.LEVEL_LOADED,
            this.levelLoadComplete,
        );
        levelLoader.removeEventListener(
            LevelLoader.ID_NOT_FOUND,
            this.levelLoadComplete,
        );
        levelLoader.removeEventListener(
            LevelLoader.LOAD_ERROR,
            this.levelLoadComplete,
        );
        levelLoader.die();
        if (
            event.type == LevelLoader.ID_NOT_FOUND ||
            event.type == LevelLoader.LOAD_ERROR
        ) {
            this.openMainMenu();
        } else {
            MainMenu.setCurrentMenu(MainMenu.LEVEL_BROWSER);
            LevelBrowser.importLevelDataArray([levelLoader.levelDataObject]);
            this.openSessionController(levelLoader.levelDataObject, null);
        }
    }

    private replayLoadComplete(event: Event) {
        var replayLoader: ReplayLoader = event.target as ReplayLoader;
        replayLoader.removeEventListener(
            ReplayLoader.REPLAY_AND_LEVEL_LOADED,
            this.replayLoadComplete,
        );
        replayLoader.removeEventListener(
            ReplayLoader.ID_NOT_FOUND,
            this.replayLoadComplete,
        );
        replayLoader.removeEventListener(
            ReplayLoader.LOAD_ERROR,
            this.replayLoadComplete,
        );
        replayLoader.die();
        if (event.type == ReplayLoader.ID_NOT_FOUND) {
            this.openMainMenu();
        } else {
            MainMenu.setCurrentMenu(MainMenu.REPLAY_BROWSER);
            LevelBrowser.importLevelDataArray([replayLoader.levelDataObject]);
            ReplayBrowser.importReplayDataArray(
                [replayLoader.replayDataObject],
                replayLoader.levelDataObject,
            );
            this.openSessionController(
                replayLoader.levelDataObject,
                replayLoader.replayDataObject,
            );
        }
    }

    private openMainMenu() {
        trace("OPEN MAIN MENU");
        this.mainMenu = new MainMenu();
        this.addChildAt(this.mainMenu, 0);
        this.mainMenu.init();
        this.mainMenu.addEventListener(NavigationEvent.EDITOR, this.openEditor);
        this.mainMenu.addEventListener(
            NavigationEvent.SESSION,
            this.receiveSessionFromMainMenu,
        );
    }

    private closeMainMenu() {
        if (!this.mainMenu) return;
        this.mainMenu.die();
        this.removeChild(this.mainMenu);
        this.mainMenu.removeEventListener(
            NavigationEvent.EDITOR,
            this.openEditor,
        );
        this.mainMenu.removeEventListener(
            NavigationEvent.SESSION,
            this.receiveSessionFromMainMenu,
        );
        this.mainMenu = null;
    }

    private openEditor(event: NavigationEvent) {
        var levelData: LevelDataObject = null;
        this.closeMainMenu();
        if (event.levelDataObject) {
            levelData = event.levelDataObject;
        }
        this.editor = new Editor(levelData);
        this.addChildAt(this.editor, 0);
        this.editor.init();
        this.editor.addEventListener(
            NavigationEvent.MAIN_MENU,
            this.closeEditor,
        );
    }

    private closeEditor(event: NavigationEvent) {
        this.editor.die();
        this.removeChild(this.editor);
        this.editor.removeEventListener(
            NavigationEvent.MAIN_MENU,
            this.closeEditor,
        );
        this.editor = null;
        this.openMainMenu();
    }

    private openSessionController(
        levelData: LevelDataObject,
        replayDATA: ReplayDataObject = null,
    ) {
        this.sessionController = new SessionController(this, levelData, replayDATA);
        this.sessionController.addEventListener(
            NavigationEvent.MAIN_MENU,
            this.closeSessionController,
        );
        this.sessionController.begin();
    }

    private closeSessionController() {
        this.sessionController.die();
        this.sessionController.removeEventListener(
            NavigationEvent.MAIN_MENU,
            this.closeSessionController,
        );
        this.sessionController = null;
        this.openMainMenu();
    }

    private receiveSessionFromMainMenu(event: NavigationEvent) {
        trace("session received");
        this.closeMainMenu();
        this.openSessionController(
            event.levelDataObject,
            event.replayDataObject,
        );
    }
}