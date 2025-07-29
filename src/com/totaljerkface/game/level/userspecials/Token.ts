import b2ContactPoint from "@/Box2D/Collision/b2ContactPoint";
import b2CircleDef from "@/Box2D/Collision/Shapes/b2CircleDef";
import b2Shape from "@/Box2D/Collision/Shapes/b2Shape";
import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import b2Body from "@/Box2D/Dynamics/b2Body";
import b2BodyDef from "@/Box2D/Dynamics/b2BodyDef";
import CharacterB2D from "@/com/totaljerkface/game/character/CharacterB2D";
import ContactListener from "@/com/totaljerkface/game/ContactListener";
import Special from "@/com/totaljerkface/game/editor/specials/Special";
import TokenRef from "@/com/totaljerkface/game/editor/specials/TokenRef";
import LevelItem from "@/com/totaljerkface/game/level/LevelItem";
import UserLevel from "@/com/totaljerkface/game/level/UserLevel";
import Session from "@/com/totaljerkface/game/Session";
import Settings from "@/com/totaljerkface/game/Settings";
import SoundController from "@/com/totaljerkface/game/sound/SoundController";
import CoinMC from "@/top/CoinMC";
import { boundClass } from 'autobind-decorator';
import Point from "flash/geom/Point";

@boundClass
export default class Token extends LevelItem {
    private _shape: b2Shape;
    private _body: b2Body;
    private mc: CoinMC;

    constructor(param1: Special, param2: b2Body = null, param3: Point = null) {
        super();
        var _loc4_: TokenRef = param1 as TokenRef;
        this.mc = new CoinMC();
        this.mc.x = param1.x;
        this.mc.y = param1.y;
        this.mc.container.gotoAndStop(_loc4_.tokenType);
        Settings.currentSession.level.background.addChild(this.mc);
        this.createBody(_loc4_);
    }

    public createBody(param1: TokenRef) {
        var _loc2_ = new b2BodyDef();
        _loc2_.position = new b2Vec2(
            param1.x / this.m_physScale,
            param1.y / this.m_physScale,
        );
        var _loc3_ = new b2CircleDef();
        _loc3_.isSensor = true;
        _loc3_.radius = 23 / this.m_physScale;
        _loc3_.filter.categoryBits = 8;
        this._body = Settings.currentSession.m_world.CreateBody(_loc2_);
        this._shape = this._body.CreateShape(_loc3_) as b2Shape;
        Settings.currentSession.contactListener.registerListener(
            ContactListener.ADD,
            this._shape,
            this.checkContact,
        );
    }

    private checkContact(param1: b2ContactPoint) {
        var _loc3_ = undefined;
        var _loc4_: CharacterB2D = null;
        var _loc2_: Session = Settings.currentSession;
        if (param1.shape2.GetMaterial() & 2) {
            _loc3_ = param1.shape2.GetUserData();
            if (_loc3_ instanceof CharacterB2D) {
                _loc4_ = _loc3_ as CharacterB2D;
                if (!_loc4_.dead) {
                    _loc2_.contactListener.deleteListener(
                        ContactListener.ADD,
                        this._shape,
                    );
                    SoundController.instance.playAreaSoundInstance(
                        "Bleep3",
                        this._body,
                    );
                    Settings.currentSession.level.singleActionVector.push(this);
                }
            }
        }
    }

    public override singleAction() {
        var _loc1_: UserLevel = Settings.currentSession.level as UserLevel;
        _loc1_.tokenFound();
        Settings.currentSession.level.background.removeChild(this.mc);
        Settings.currentSession.m_world.DestroyBody(this._body);
        this._body = null;
    }
}