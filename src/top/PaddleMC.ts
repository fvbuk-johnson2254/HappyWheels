import { boundClass } from 'autobind-decorator';
import MovieClip from "flash/display/MovieClip";

/* [Embed(source="/_assets/assets.swf", symbol="symbol1077")] */
@boundClass
export default class PaddleMC extends MovieClip {
    public nub: MovieClip;
    public timer: MovieClip;
    public arrow: MovieClip;
}