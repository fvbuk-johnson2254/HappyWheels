import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import Special from "@/com/totaljerkface/game/editor/specials/Special";
import LevelItem from "@/com/totaljerkface/game/level/LevelItem";
import { boundClass } from 'autobind-decorator';

@boundClass
export default class Wheel extends LevelItem {
    constructor(param1: Special) {
        super();
        this.createBody(new b2Vec2(param1.x, param1.y));
    }

    public createBody(param1: b2Vec2) {
        trace("I\'M A WHEEL");
    }
}