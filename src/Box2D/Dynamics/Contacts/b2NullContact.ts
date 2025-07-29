import b2ContactListener from "@/Box2D/Dynamics/b2ContactListener";
import b2Contact from "@/Box2D/Dynamics/Contacts/b2Contact";

export default class b2NullContact extends b2Contact {
    public override Evaluate(l: b2ContactListener) {}
    public override GetManifolds(): any[] { return null; }
}