import CharacterB2D from "@/com/totaljerkface/game/character/CharacterB2D";
import ReplayEvent from "@/com/totaljerkface/game/events/ReplayEvent";
import LevelB2D from "@/com/totaljerkface/game/level/LevelB2D";
import ParticleController from "@/com/totaljerkface/game/particles/ParticleController";
import Session from "@/com/totaljerkface/game/Session";
import StageCamera from "@/com/totaljerkface/game/StageCamera";
import { boundClass } from 'autobind-decorator';
import Sprite from "flash/display/Sprite";
import Rectangle from "flash/geom/Rectangle";

@boundClass
export default class SessionRestart extends Session {
    constructor(
        param1: Sprite,
        param2: number,
        param3: CharacterB2D,
        param4: LevelB2D,
        param5: number,
    ) {
        super(param2, null, null, param5);
        trace("SESSION RESTART");
        this._containerSprite = param1;
        this.addChild(this._containerSprite);
        this._character = param3;
        this._character.session = this;
        this._level = param4;
        this._level.session = this;
    }

    protected override init(param1: Sprite, param2: Sprite) { }

    public override create() {
        this._particleController = new ParticleController(
            this._containerSprite,
        );
        this.createWorld();
        trace("resetting level");
        this._level.reset();
        this._level.insertBackDrops();
        trace("resetting character");
        this._character.reset();
        this._character.addKeyListeners();
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
        this._character.addEventListener(
            ReplayEvent.ADD_ENTRY,
            this.addReplayEntry,
        );
        this._character.paint();
        this.start();
    }
}