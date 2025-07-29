import { boundClass } from 'autobind-decorator';
import MovieClip from "flash/display/MovieClip";

/* [Embed(source="/_assets/assets.swf", symbol="symbol555")] */
@boundClass
export default class WatermelonMC extends MovieClip {
    public shapes: MovieClip;
    public chunks: MovieClip;
}