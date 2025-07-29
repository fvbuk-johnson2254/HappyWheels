import { boundClass } from 'autobind-decorator';
import MovieClip from "flash/display/MovieClip";

/* [Embed(source="/_assets/assets.swf", symbol="symbol1009")] */
@boundClass
export default class SpringBoxMC extends MovieClip {
    public base: MovieClip;
    public pad: MovieClip;
}