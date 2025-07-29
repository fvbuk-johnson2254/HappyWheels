import b2ContactPoint from "@/Box2D/Collision/b2ContactPoint";
import b2ContactResult from "@/Box2D/Dynamics/Contacts/b2ContactResult";
import EventDispatcher from "flash/events/EventDispatcher";

export default class b2ContactListener extends EventDispatcher {
    public Add(point: b2ContactPoint) {}
    public Persist(point: b2ContactPoint) {}
    public Remove(point: b2ContactPoint) {}
    public Result(point: b2ContactResult) {}
}