import b2ContactID from "@/Box2D/Collision/b2ContactID";

export default class Features {
    public _referenceEdge: number;
    public _incidentEdge: number;
    public _incidentVertex: number;
    public _flip: number;
    public _m_id: b2ContactID;

    public set referenceEdge(param1: number) {
        this._referenceEdge = param1;
        this._m_id._key =
            (this._m_id._key & 4294967040) | (this._referenceEdge & 255);
    }

    public get referenceEdge(): number {
        return this._referenceEdge;
    }

    public set incidentEdge(param1: number) {
        this._incidentEdge = param1;
        this._m_id._key =
            (this._m_id._key & 4294902015) |
            ((this._incidentEdge << 8) & 65280);
    }

    public get incidentEdge(): number {
        return this._incidentEdge;
    }

    public set incidentVertex(param1: number) {
        this._incidentVertex = param1;
        this._m_id._key =
            (this._m_id._key & 4278255615) |
            ((this._incidentVertex << 16) & 16711680);
    }

    public get incidentVertex(): number {
        return this._incidentVertex;
    }

    public set flip(param1: number) {
        this._flip = param1;
        this._m_id._key =
            (this._m_id._key & 16777215) | ((this._flip << 24) & 4278190080);
    }

    public get flip(): number {
        return this._flip;
    }
}