import GenericButton from "@/com/totaljerkface/game/editor/ui/GenericButton";
import Window from "@/com/totaljerkface/game/editor/ui/Window";
import DropMenu from "@/com/totaljerkface/game/menus/DropMenu";
import TextUtils from "@/com/totaljerkface/game/utils/TextUtils";
import { boundClass } from 'autobind-decorator';
import Sprite from "flash/display/Sprite";
import Event from "flash/events/Event";
import KeyboardEvent from "flash/events/KeyboardEvent";
import MouseEvent from "flash/events/MouseEvent";
import TextField from "flash/text/TextField";

/* [Embed(source="/_assets/assets.swf", symbol="symbol2922")] */
@boundClass
export default class SearchLevelMenu extends Sprite {
    public static AUTHOR_NAME: string;
    public static LEVEL_NAME: string = "level";
    public static SEARCH: string = "search";
    public static CANCEL: string = "CANCEL";
    private static index: number = 0;
    private static minChars: number = 4;
    private static maxChars: number = 12;
    public searchText: TextField;
    public errorText: TextField;
    protected _window: Window;
    protected dropMenu: DropMenu;
    private searchButton: GenericButton;
    private cancelButton: GenericButton;

    constructor() {
        super();
        this.createWindow();
        this.dropMenu = new DropMenu(
            "search by:",
            ["level name", "author name"],
            [SearchLevelMenu.LEVEL_NAME, SearchLevelMenu.AUTHOR_NAME],
            SearchLevelMenu.index,
            8947848,
        );
        this.addChild(this.dropMenu);
        this.dropMenu.xLeft = 25;
        this.dropMenu.y = 14;
        this.searchButton = new GenericButton("search", 16613761, 70);
        this.addChild(this.searchButton);
        this.searchButton.x = 25;
        this.searchButton.y = 114;
        this.cancelButton = new GenericButton("cancel", 10066329, 70);
        this.addChild(this.cancelButton);
        this.cancelButton.x = 105;
        this.cancelButton.y = 114;
        this.searchText.maxChars = SearchLevelMenu.maxChars;
        this.searchText.restrict = "a-z A-Z 0-9 !@#$%\\^&*()_+\\-=\'|?/,.<> \"";
        this.addEventListener(MouseEvent.MOUSE_UP, this.mouseUpHandler);
        this.searchText.addEventListener(
            KeyboardEvent.KEY_DOWN,
            this.keyDownHandler,
        );
    }

    protected createWindow() {
        this._window = new Window(false, this, true);
    }

    public get window(): Window {
        return this._window;
    }

    public get searchType(): string {
        return this.dropMenu.value;
    }

    public get searchTerm(): string {
        return this.searchText.text;
    }

    private keyDownHandler(param1: KeyboardEvent) {
        if (param1.keyCode == 13) {
            this.validateTerm();
        }
    }

    private mouseUpHandler(param1: MouseEvent) {
        switch (param1.target) {
            case this.searchButton:
                this.validateTerm();
                break;
            case this.cancelButton:
                this.dispatchEvent(new Event(SearchLevelMenu.CANCEL));
        }
    }

    private validateTerm() {
        var _loc1_ = null;
        this.searchText.text = TextUtils.trimWhitespace(this.searchText.text);
        if (this.searchText.length < SearchLevelMenu.minChars) {
            _loc1_ = "must be between " +
                SearchLevelMenu.minChars +
                " and " +
                SearchLevelMenu.maxChars +
                " characters";
            this.errorText.text = _loc1_;
            return;
        }
        this.dispatchEvent(new Event(SearchLevelMenu.SEARCH));
    }

    public die() {
        SearchLevelMenu.index = this.dropMenu.currentIndex;
        this.removeEventListener(MouseEvent.MOUSE_UP, this.mouseUpHandler);
        this.dropMenu.die();
        this._window.closeWindow();
    }
}