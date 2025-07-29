import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import b2Body from "@/Box2D/Dynamics/b2Body";
import Trigger from "@/com/totaljerkface/game/level/Trigger";
import Settings from "@/com/totaljerkface/game/Settings";
import { boundClass } from 'autobind-decorator';
import DisplayObject from "flash/display/DisplayObject";
import EventDispatcher from "flash/events/EventDispatcher";

@boundClass
export default class LevelItem extends EventDispatcher {
    protected static oneEightyOverPI: number;
    protected m_physScale: number = Settings.currentSession.level.m_physScale;
    protected _triggered: boolean;

    public paint() { }

    public actions() { }

    public singleAction() { }

    public die() { }

    public getJointBody(param1: b2Vec2 = null): b2Body {
        return null;
    }

    public get groupDisplayObject(): DisplayObject {
        return null;
    }

    public triggerSingleActivation(
        param1: Trigger,
        param2: string,
        param3: any[],
    ) {
        if (this._triggered) {
            return;
        }
        this._triggered = true;
    }

    public triggerRepeatActivation(
        param1: Trigger,
        param2: string,
        param3: any[],
        param4: number,
    ): boolean {
        return true;
    }

    public get bodyList(): any[] {
        return [];
    }

    public prepareForTrigger() { }
}