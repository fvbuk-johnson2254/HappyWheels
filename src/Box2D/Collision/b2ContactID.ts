import Features from "@/Box2D/Collision/Features";

export default class b2ContactID {
    public features = new Features();
    public _key: number;

    constructor() {
        this.features._m_id = this;
    }

    public Set(param1: b2ContactID) {
        this.key = param1._key;
    }

    public Copy(): b2ContactID {
        var _loc1_ = new b2ContactID();
        _loc1_.key = this.key;
        return _loc1_;
    }

    public get key(): number {
        return this._key;
    }

    public set key(param1: number) {
        this._key = param1;
        this.features._referenceEdge = this._key & 255;
        this.features._incidentEdge = ((this._key & 65280) >> 8) & 255;
        this.features._incidentVertex = ((this._key & 16711680) >> 16) & 255;
        this.features._flip = ((this._key & 4278190080) >> 24) & 255;
    }
}