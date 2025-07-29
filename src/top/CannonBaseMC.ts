import { boundClass } from 'autobind-decorator';
import MovieClip from "flash/display/MovieClip";

/* [Embed(source="/_assets/assets.swf", symbol="symbol2908")] */
@boundClass
export default class CannonBaseMC extends MovieClip {
    public star: MovieClip;
    public meter: MovieClip;
}