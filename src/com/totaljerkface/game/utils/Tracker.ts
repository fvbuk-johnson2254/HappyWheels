import { boundClass } from 'autobind-decorator';
import ExternalInterface from "flash/external/ExternalInterface";

@boundClass
export default class Tracker {
    public static PRELOADER: string;
    public static MAIN_MENU: string = "main_menu";
    public static FEATURED_BROWSER: string = "featured_browser";
    public static LEVEL_BROWSER: string = "level_browser";
    public static REPLAY_BROWSER: string = "replay_browser";
    public static LEVEL_REPLAY_LOADER: string = "level_replay_loader";
    public static EDITOR: string = "editor";
    public static OPTIONS: string = "options";
    public static CREDITS: string = "credits";
    public static LEVEL: string = "level";
    public static REPLAY: string = "replay";
    public static CHARACTER_MENU: string = "character_menu";
    public static BEGIN_LOAD: string = "begin_load";
    public static AD_COMPLETE: string = "ad_complete";
    public static LOAD_COMPLETE: string = "load_complete";
    public static GOTO_MAIN_MENU: string = "goto_main_menu";
    public static GOTO_FEATURED_BROWSER: string = "goto_featured_browser";
    public static GOTO_LEVEL_BROWSER: string = "goto_level_browser";
    public static GOTO_REPLAY_BROWSER: string = "goto_replay_browser";
    public static GOTO_LEVEL_REPLAY_LOADER: string = "goto_level_replay_loader";
    public static GOTO_EDITOR: string = "goto_editor";
    public static GOTO_OPTIONS: string = "goto_options";
    public static GOTO_CREDITS: string = "goto_credits";
    public static GOTO_USER_PAGE: string = "goto_user_page";
    public static CLICK_IOS_LINK: string = "click_ios_link";
    public static CLICK_GOOGLEPLAY_LINK: string = "click_google_play_link";
    public static MUTE: string = "mute";
    public static UNMUTE: string = "unmute";
    public static GET_FAVORITES: string = "get_favorites";
    public static GET_LEVELS_BY_AUTHOR: string = "get_levels_by_author";
    public static LEVEL_SEARCH: string = "level_search";
    public static AUTHOR_SEARCH: string = "author_search";
    public static ADD_FAVORITE: string = "add_favorite";
    public static REMOVE_FAVORITE: string = "remove_favorite";
    public static REFRESH_LEVELS: string = "refresh_levels";
    public static PAGE_LEVELS: string = "page_levels";
    public static REFRESH_REPLAYS: string = "refresh_replays";
    public static PAGE_REPLAYS: string = "page_replays";
    public static LOAD_REPLAY: string = "load_replay";
    public static SAVE_LEVEL: string = "save_level";
    public static OVERWRITE_LEVEL: string = "overwrite_level";
    public static PUBLISH_LEVEL: string = "publish_level";
    public static LOAD_LEVEL: string = "load_level";
    public static DELETE_LEVEL: string = "delete_level";
    public static IMPORT_LEVELDATA: string = "import_leveldata";
    public static COPY_LEVELDATA: string = "copy_leveldata";
    public static SET_QUALITY: string = "set_quality";
    public static SET_BLOOD: string = "set_blood";
    public static CUSTOMIZE_CONTROLS: string = "customize_controls";
    public static VOTE: string = "vote";
    public static RESTART: string = "restart";
    public static CHANGE_CHARACTER: string = "change_character";
    public static CHARACTER_SELECTED: string = "character_selected";
    public static VIEW_REPLAY: string = "view_replay";
    public static SAVE_REPLAY: string = "save_replay";

    public static trackEvent(
        param1: string,
        param2: string,
        param3: string = null,
        param4: number = -1,
        param5: boolean = false,
    ) {
        var _loc6_: {} = null;
        var _loc7_: string = null;
        var _loc8_ = undefined;
        if (ExternalInterface.available) {
            _loc6_ = new Object();
            _loc6_["eventCategory"] = param1;
            _loc6_["eventAction"] = param2;
            if (param3) {
                _loc6_["eventLabel"] = param3;
            }
            if (param4 > -1) {
                _loc6_["eventValue"] = param4;
            }
            ExternalInterface.call("ga", "send", "event", _loc6_);
            _loc7_ = "";
            for (_loc8_ in _loc6_) {
                _loc7_ += _loc8_ + ": " + _loc6_[_loc8_] + " ";
            }
            trace("TRACK EVENT: " + _loc7_);
        }
    }
}