import { boundClass } from 'autobind-decorator';
import MovieClip from "flash/display/MovieClip";

/* [Embed(source="/_assets/assets.swf", symbol="symbol600")] */
@boundClass
export default class PineappleMC extends MovieClip {
    public shapes: MovieClip;
    public chunks: MovieClip;
}