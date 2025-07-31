import DebugText from "@/com/totaljerkface/game/DebugText";
import Session from "@/com/totaljerkface/game/Session";
import { boundClass } from 'autobind-decorator';
import Stage from "flash/display/Stage";
import SharedObject from "flash/net/SharedObject";
import Window from "./editor/ui/Window";

@boundClass
export default class Settings {
    public static username: string;
    public static architecture: string;
    public static disableUpload: boolean;
    public static sharedObject: SharedObject;
    public static editorDebugDraw: boolean;
    public static GET_LOGIN: string;
    public static GET_USER_ID: string;
    public static GET_LEVEL_LIST: string;
    public static GET_FEATURED_LEVEL_LIST: string;
    public static GET_LEVEL_DATA: string;
    public static GET_LEVEL_DATA_NO_CACHE: string;
    public static SET_LEVEL_DATA: string;
    public static VOTE_LEVEL: string;
    public static ADD_LEVEL_FAVORITES: string;
    public static REMOVE_LEVEL_FAVORITES: string;
    public static FLAG_LEVEL: string;
    public static GET_REPLAY_LIST: string;
    public static GET_REPLAY_DATA: string;
    public static SET_REPLAY_DATA: string;
    public static VOTE_REPLAY: string;
    public static FLAG_REPLAY: string;
    public static USER_PROFILE: string;
    public static LEVEL_RULES: string;
    public static useCompressedTextures: boolean;
    public static replayIndex: number;
    public static userLevelIndex: number;
    public static debugText: DebugText;
    private static session: Session;
    public static stageSprite: Stage;
    public static CURRENT_VERSION: number = 1.87;
    public static user_id: number = -1;
    public static disableMessage = "Uploading new data is temporarily disabled. I\'M SORRY!";
    public static numBackgroundLayers = 5;
    public static characterPath = "characters/";
    public static levelPath = "levels/";
    public static imagePath = "game_images/";
    public static siteURL = "./";
    //@ts-ignore
    public static pathPrefix = href;
    public static hideHUD: boolean = false;
    public static smoothing: boolean = true;
    public static characterIndex: number = 1;
    public static hideVehicle: boolean = false;
    public static levelIndex: number = 1;
    public static bdIndex: number = 0;
    public static bdColor: number = 16777215;
    public static bloodSetting: number = 1;
    public static YParticleLimit: number = 850;
    public static activeXLimit: number = 2000;
    public static maxReplayFrames: number = 6000;
    public static characterNames: any[] = [
        "wheelchair guy",
        "segway guy",
        "irresponsible dad",
        "effective shopper",
        "moped couple",
        "lawnmower man",
        "explorer guy",
        "santa claus",
        "pogostick man",
        "irresponsible mom",
        "helicopter man",
    ];
    public static shapeClassPath: string = "com.totaljerkface.game.editor.";
    public static shapeList: any[] = [
        "RectangleShape",
        "CircleShape",
        "TriangleShape",
        "PolygonShape",
        "ArtShape",
    ];
    public static jointClassPath: string = "com.totaljerkface.game.editor.joints.";
    public static jointList: any[] = ["PinJoint"];
    public static specialClassPath: string = "com.totaljerkface.game.editor.specials.";
    public static specialList: any[] = [
        "VanRef",
        "TableRef",
        "MineRef",
        "IBeamRef",
        "LogRef",
        "SpringBoxRef",
        "SpikesRef",
        "WreckingBallRef",
        "FanRef",
        "FinishLineRef",
        "SoccerBallRef",
        "MeteorRef",
        "BoostRef",
        "Building1Ref",
        "Building2Ref",
        "HarpoonGunRef",
        "TextBoxRef",
        "NPCharacterRef",
        "GlassRef",
        "ChairRef",
        "BottleRef",
        "TVRef",
        "BoomboxRef",
        "SignPostRef",
        "ToiletRef",
        "HomingMineRef",
        "TrashCanRef",
        "RailRef",
        "JetRef",
        "ArrowGunRef",
        "ChainRef",
        "TokenRef",
        "FoodItemRef",
        "CannonRef",
        "BladeWeaponRef",
        "PaddleRef",
    ];
    public static totalCharacters = 11;
    public static favoriteLevelIds = new Array();
    public static accelerateDefaultCode = 38;
    public static decelerateDefaultCode = 40;
    public static leanForwardDefaultCode = 39;
    public static leanBackDefaultCode = 37;
    public static primaryActionDefaultCode = 32;
    public static secondaryAction1DefaultCode = 16;
    public static secondaryAction2DefaultCode = 17;
    public static ejectDefaultCode = 90;
    public static switchCameraDefaultCode = 67;
    public static accelerateCode = Settings.accelerateDefaultCode;
    public static decelerateCode = Settings.decelerateDefaultCode;
    public static leanForwardCode = Settings.leanForwardDefaultCode;
    public static leanBackCode = Settings.leanBackDefaultCode;
    public static primaryActionCode = Settings.primaryActionDefaultCode;
    public static secondaryAction1Code = Settings.secondaryAction1DefaultCode;
    public static secondaryAction2Code = Settings.secondaryAction2DefaultCode;
    public static ejectCode = Settings.ejectDefaultCode;
    public static switchCameraCode = Settings.switchCameraDefaultCode;

    public static get characterSWF(): string {
        return (
            Settings.pathPrefix +
            Settings.characterPath +
            "character" +
            Settings.characterIndex.toString() +
            ".swf"
        );
    }

    public static get currentSession(): Session {
        return Settings.session;
    }

    public static set currentSession(param1: Session) {
        Settings.session = param1;
    }
}