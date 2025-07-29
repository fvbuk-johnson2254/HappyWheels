import b2Shape from "@/Box2D/Collision/Shapes/b2Shape";
import b2ContactPoint from "@/Box2D/Collision/b2ContactPoint";
import b2ContactResult from "@/Box2D/Dynamics/Contacts/b2ContactResult";
import b2ContactListener from "@/Box2D/Dynamics/b2ContactListener";
import ContactEvent from "@/com/totaljerkface/game/events/ContactEvent";
import { boundClass } from 'autobind-decorator';

@boundClass
export default class ContactListener extends b2ContactListener {
    public static ADD: string;
    public static REMOVE: string = "remove";
    public static PERSIST: string = "persist";
    public static RESULT: string = "result";
    private _addListeners: Dictionary<any, any>;
    private _removeListeners: Dictionary<any, any>;
    private _persistListeners: Dictionary<any, any>;
    private _resultListeners: Dictionary<any, any>;

    constructor() {
        super();
        this._addListeners = new Dictionary();
        this._removeListeners = new Dictionary();
        this._persistListeners = new Dictionary();
        this._resultListeners = new Dictionary();
    }

    public override Add(param1: b2ContactPoint) {
        var _loc3_: b2ContactPoint = null;
        var _loc2_: Function = this._addListeners.get(param1.shape1);
        if (_loc2_ != null) {
            _loc2_(param1);
        }
        _loc2_ = this._addListeners.get(param1.shape2);
        if (_loc2_ != null) {
            _loc3_ = new b2ContactPoint();
            _loc3_.shape1 = param1.shape2;
            _loc3_.shape2 = param1.shape1;
            _loc3_.normal = param1.normal.Negative();
            _loc3_.separation = param1.separation;
            _loc3_.velocity = param1.velocity;
            _loc3_.position = param1.position;
            _loc3_.id = param1.id;
            _loc3_.swap = true;
            _loc2_(_loc3_);
        }
    }

    public override Persist(param1: b2ContactPoint) {
        var _loc3_: b2ContactPoint = null;
        var _loc2_: Function = this._persistListeners.get(param1.shape1);
        if (_loc2_ != null) {
            _loc2_(param1);
        }
        _loc2_ = this._persistListeners.get(param1.shape2);
        if (_loc2_ != null) {
            _loc3_ = new b2ContactPoint();
            _loc3_.shape1 = param1.shape2;
            _loc3_.shape2 = param1.shape1;
            _loc3_.normal = param1.normal.Negative();
            _loc3_.separation = param1.separation;
            _loc3_.velocity = param1.velocity;
            _loc3_.position = param1.position;
            _loc2_(_loc3_);
        }
    }

    public override Remove(param1: b2ContactPoint) {
        var _loc3_: b2ContactPoint = null;
        var _loc2_: Function = this._removeListeners.get(param1.shape1);
        if (_loc2_ != null) {
            _loc2_(param1);
        }
        _loc2_ = this._removeListeners.get(param1.shape2);
        if (_loc2_ != null) {
            _loc3_ = new b2ContactPoint();
            _loc3_.shape1 = param1.shape2;
            _loc3_.shape2 = param1.shape1;
            _loc3_.velocity = param1.velocity;
            _loc2_(_loc3_);
        }
    }

    public override Result(param1: b2ContactResult) {
        var _loc2_: Function = this._resultListeners.get(param1.shape1);
        if (_loc2_ != null) {
            _loc2_(
                new ContactEvent(
                    ContactEvent.RESULT,
                    param1.shape1,
                    param1.normalImpulse,
                    param1.normal,
                    param1.shape2,
                    param1.position,
                ),
            );
        }
        _loc2_ = this._resultListeners.get(param1.shape2);
        if (_loc2_ != null) {
            _loc2_(
                new ContactEvent(
                    ContactEvent.RESULT,
                    param1.shape2,
                    param1.normalImpulse,
                    param1.normal,
                    param1.shape1,
                    param1.position,
                ),
            );
        }
    }

    public registerListener(param1: string, param2: b2Shape, param3: Function) {
        switch (param1) {
            case ContactListener.ADD:
                this._addListeners.set(param2, param3);
                break;
            case ContactListener.REMOVE:
                this._removeListeners.set(param2, param3);
                break;
            case ContactListener.PERSIST:
                this._persistListeners.set(param2, param3);
                break;
            case ContactListener.RESULT:
                this._resultListeners.set(param2, param3);
        }
    }

    public deleteListener(param1: string, param2: b2Shape) {
        switch (param1) {
            case ContactListener.ADD:
                this._addListeners.delete(param2);
                break;
            case ContactListener.REMOVE:
                this._removeListeners.delete(param2);
                break;
            case ContactListener.PERSIST:
                this._persistListeners.delete(param2);
                break;
            case ContactListener.RESULT:
                this._resultListeners.delete(param2);
        }
    }

    public listenerExists(param1: string, param2: b2Shape): boolean {
        switch (param1) {
            case ContactListener.ADD:
                if (this._addListeners.get(param2)) {
                    return true;
                }
                break;
            case ContactListener.REMOVE:
                if (this._removeListeners.get(param2)) {
                    return true;
                }
                break;
            case ContactListener.PERSIST:
                if (this._persistListeners.get(param2)) {
                    return true;
                }
                break;
            case ContactListener.RESULT:
                if (this._resultListeners.get(param2)) {
                    return true;
                }
                break;
        }
        return false;
    }

    public die() {
        this._addListeners = null;
        this._removeListeners = null;
        this._persistListeners = null;
        this._resultListeners = null;
    }
}