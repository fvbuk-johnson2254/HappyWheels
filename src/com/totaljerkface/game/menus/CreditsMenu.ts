import BasicMenu from "@/com/totaljerkface/game/menus/BasicMenu";
import CreditsLink from "@/com/totaljerkface/game/menus/CreditsLink";
import { boundClass } from 'autobind-decorator';
import Sprite from "flash/display/Sprite";
import Event from "flash/events/Event";

/* [Embed(source="/_assets/assets.swf", symbol="symbol477")] */
@boundClass
export default class CreditsMenu extends BasicMenu {
    public creditsSprite: Sprite;

    constructor() {
        super();
        var _loc2_: CreditsLink = null;

        this.creditsSprite.y = 510;
        this.addEventListener(Event.ENTER_FRAME, this.scroll);
        var _loc1_: Sprite = this.creditsSprite.getChildByName(
            "benText1",
        ) as Sprite;
        if (_loc1_) {
            _loc2_ = new CreditsLink(_loc1_, "http://contactbenhaynes.com");
        }
        _loc1_ = this.creditsSprite.getChildByName("jimText") as Sprite;
        _loc2_ = new CreditsLink(_loc1_, "http://www.totaljerkface.com");
        _loc1_ = this.creditsSprite.getChildByName("jackText") as Sprite;
        _loc2_ = new CreditsLink(_loc1_, "http://www.pekopeko.com");
        _loc1_ = this.creditsSprite.getChildByName("brianText") as Sprite;
        if (_loc1_) {
            _loc2_ = new CreditsLink(_loc1_, "http://wateristhenewfire.com");
        }
        _loc1_ = this.creditsSprite.getChildByName("jonText") as Sprite;
        if (_loc1_) {
            _loc2_ = new CreditsLink(_loc1_, "http://www.jonathanbelsky.com");
        }
        _loc1_ = this.creditsSprite.getChildByName("andyText") as Sprite;
        if (_loc1_) {
            _loc2_ = new CreditsLink(_loc1_, "http://andypressman.com");
        }
        _loc1_ = this.creditsSprite.getChildByName("benText2") as Sprite;
        if (_loc1_) {
            _loc2_ = new CreditsLink(_loc1_, "http://contactbenhaynes.com");
        }
        _loc1_ = this.creditsSprite.getChildByName("erinText") as Sprite;
        _loc2_ = new CreditsLink(_loc1_, "http://www.box2d.org");
    }

    private scroll(param1: Event) {
        --this.creditsSprite.y;
        if (this.creditsSprite.y < -50 - this.creditsSprite.height) {
            this.creditsSprite.y = 510;
        }
    }

    public override die() {
        super.die();
        this.removeEventListener(Event.ENTER_FRAME, this.scroll);
    }
}