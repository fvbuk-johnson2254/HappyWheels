import b2Body from "@/Box2D/Dynamics/b2Body";
import b2Contact from "@/Box2D/Dynamics/Contacts/b2Contact";

export default class b2ContactEdge {
    public other: b2Body;
    public contact: b2Contact;
    public prev: b2ContactEdge;
    public next: b2ContactEdge;
}