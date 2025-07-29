import BitmapManager from "@/com/totaljerkface/game/BitmapManager";
import SessionCharacterMenu from "@/com/totaljerkface/game/SessionCharacterMenu";
import Settings from "@/com/totaljerkface/game/Settings";
import SwfLoader from "@/com/totaljerkface/game/SwfLoader";
import CharacterIcon from "@/com/totaljerkface/game/menus/CharacterIcon";
import SoundController from "@/com/totaljerkface/game/sound/SoundController";
import { boundClass } from 'autobind-decorator';
import BitmapData from "flash/display/BitmapData";
import BitmapDataChannel from "flash/display/BitmapDataChannel";
import BlendMode from "flash/display/BlendMode";
import Sprite from "flash/display/Sprite";
import Event from "flash/events/Event";
import MouseEvent from "flash/events/MouseEvent";

/* [Embed(source="/_assets/assets.swf", symbol="symbol2866")] */
@boundClass
export default class CharacterMenu extends Sprite {
    public static CHARACTER_SELECTED: string;
    public spotlight1: Sprite;
    public spotlight2: Sprite;
    public altar: Sprite;
    private bg: Sprite;
    private smokeSprite1: Sprite;
    private smokeSprite2: Sprite;
    private scrollSpeedX: number = 2;
    private scrollSpeedY: number = 1;
    private scaleInc1: number = 0;
    private rotInc1: number = 0;
    private scaleInc2: number = 3.14;
    private rotInc2: number = 3.14;
    private characterLoader: SwfLoader;
    private session: SessionCharacterMenu;
    private iconHolder: Sprite;
    private icons: any[];
    private selectedIcon: CharacterIcon;

    constructor() {
        super();
        Settings.stageSprite = this.stage;
        Settings.characterIndex = 1;
        this.buildStage();
        this.buildMenu();
        SoundController.instance.playSoundItem("DrumLong");
        this.addEventListener(Event.ENTER_FRAME, this.scrollSmoke);
        this.loadCharacter();
        this.iconHolder.addEventListener(
            MouseEvent.MOUSE_OVER,
            this.iconMouseOverHandler,
        );
        this.iconHolder.addEventListener(
            MouseEvent.MOUSE_UP,
            this.iconMouseUpHandler,
        );
    }

    private buildStage() {
        var _loc4_: BitmapData = null;
        var _loc5_: BitmapData = null;
        this.bg = new Sprite();
        var _loc1_: number = 900;
        var _loc2_: number = 500;
        this.bg.graphics.beginFill(51);
        this.bg.graphics.drawRect(0, 0, _loc1_, _loc2_);
        this.bg.graphics.endFill();
        var _loc3_ = BitmapManager.instance;
        if (_loc3_.getTexture("smoke1") == null) {
            _loc4_ = new BitmapData(_loc1_, _loc2_, true);
            _loc4_.perlinNoise(
                _loc1_,
                _loc2_,
                10,
                4,
                true,
                true,
                BitmapDataChannel.ALPHA,
                true,
                null,
            );
            _loc5_ = new BitmapData(_loc1_, _loc2_, true);
            _loc5_.perlinNoise(
                _loc1_,
                _loc2_,
                10,
                4,
                true,
                true,
                BitmapDataChannel.ALPHA,
                true,
                null,
            );
            _loc3_.addTexture("smoke1", _loc4_);
            _loc3_.addTexture("smoke2", _loc5_);
        } else {
            _loc4_ = _loc3_.getTexture("smoke1");
            _loc5_ = _loc3_.getTexture("smoke2");
        }
        this.smokeSprite1 = new Sprite();
        this.smokeSprite1.graphics.beginBitmapFill(_loc4_, null, true);
        this.smokeSprite1.graphics.drawRect(0, 0, _loc1_ * 2, _loc2_ * 2);
        this.smokeSprite1.graphics.endFill();
        this.smokeSprite2 = new Sprite();
        this.smokeSprite2.graphics.beginBitmapFill(_loc5_, null, true);
        this.smokeSprite2.graphics.drawRect(0, 0, _loc1_ * 2, _loc2_ * 2);
        this.smokeSprite2.graphics.endFill();
        this.smokeSprite2.blendMode = BlendMode.HARDLIGHT;
        this.smokeSprite1.alpha = 0.5;
        this.smokeSprite2.alpha = 0.5;
        this.addChildAt(this.altar, 0);
        this.addChildAt(this.spotlight2, 0);
        this.addChildAt(this.spotlight1, 0);
        this.addChildAt(this.smokeSprite2, 0);
        this.addChildAt(this.smokeSprite1, 0);
        this.addChildAt(this.bg, 0);
    }

    private buildMenu() {
        var _loc1_: number = 0;
        var _loc2_: CharacterIcon = null;
        this.iconHolder = new Sprite();
        this.iconHolder.x = 500;
        this.iconHolder.y = 120;
        this.addChild(this.iconHolder);
        this.icons = new Array();
        _loc1_ = 0;
        while (_loc1_ < 25) {
            _loc2_ = new CharacterIcon(_loc1_ + 1);
            this.iconHolder.addChild(_loc2_);
            _loc2_.x = (_loc1_ % 5) * 60;
            _loc2_.y = Math.floor(_loc1_ * 0.2) * 60;
            this.icons.push(_loc2_);
            _loc1_++;
        }
        _loc2_ = this.icons[0];
        _loc2_.selected = true;
        this.selectedIcon = _loc2_;
    }

    private iconMouseOverHandler(param1: MouseEvent) {
        var _loc2_: CharacterIcon = null;
        if (param1.target instanceof CharacterIcon) {
            _loc2_ = param1.target as CharacterIcon;
            if (_loc2_ == this.selectedIcon || _loc2_.selectable == false) {
                return;
            }
            this.selectedIcon.selected = false;
            _loc2_.selected = true;
            this.selectedIcon = _loc2_;
            this.loadCharacter();
            SoundController.instance.playSoundItem("SelectCharacter");
        }
    }

    private iconMouseUpHandler(param1: MouseEvent) {
        var _loc2_: CharacterIcon = null;
        if (param1.target instanceof CharacterIcon) {
            _loc2_ = param1.target as CharacterIcon;
            if (!_loc2_.selectable) {
                return;
            }
            SoundController.instance.playSoundItem("MenuSelect");
            this.dispatchEvent(new Event(CharacterMenu.CHARACTER_SELECTED));
        }
    }

    private scrollSmoke(param1: Event) {
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
        this.adjustSpotlights();
    }

    private adjustSpotlights() {
        this.spotlight1.scaleY = Math.sin(this.scaleInc1) * 0.25 + 1.25;
        this.scaleInc1 += 0.01;
        this.spotlight1.rotation = Math.sin(this.rotInc1) * 15 + 10;
        this.rotInc1 += 0.04;
        this.spotlight2.scaleY = Math.cos(this.scaleInc2) * 0.25 + 1.25;
        this.scaleInc2 -= 0.012;
        this.spotlight2.rotation = Math.cos(this.rotInc2) * 15 - 10;
        this.rotInc2 -= 0.04;
    }

    private loadCharacter() {
        Settings.characterIndex = this.selectedIcon.index;
        if (this.characterLoader) {
            this.characterLoader.removeEventListener(
                Event.COMPLETE,
                this.characterLoaded,
            );
            this.characterLoader.cancelLoad();
        } else if (this.session) {
            this.killSession();
        }
        this.characterLoader = new SwfLoader(Settings.characterSWF);
        this.characterLoader.addEventListener(
            Event.COMPLETE,
            this.characterLoaded,
        );
        this.characterLoader.loadSWF();
    }

    private characterLoaded(param1: Event) {
        this.characterLoader.removeEventListener(
            Event.COMPLETE,
            this.characterLoaded,
        );
        var _loc2_: Sprite = this.characterLoader.swfContent as Sprite;
        this.characterLoader.unLoadSwf();
        this.characterLoader = null;
        Settings.currentSession = this.session = new SessionCharacterMenu(
            _loc2_,
        );
        this.session.visible = false;
        this.addChild(this.session);
        this.session.scaleX = this.session.scaleY = 2;
        this.session.create();
        this.session.visible = true;
    }

    private killSession() {
        if (this.session) {
            this.session.die();
            this.removeChild(this.session);
            Settings.currentSession = this.session = null;
        }
    }

    public die() {
        this.killSession();
        if (this.characterLoader) {
            this.characterLoader.removeEventListener(
                Event.COMPLETE,
                this.characterLoaded,
            );
            this.characterLoader.cancelLoad();
        }
        this.iconHolder.removeEventListener(
            MouseEvent.MOUSE_OVER,
            this.iconMouseOverHandler,
        );
        this.removeEventListener(Event.ENTER_FRAME, this.scrollSmoke);
    }
}