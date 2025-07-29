import { boundClass } from 'autobind-decorator';
import MovieClip from "flash/display/MovieClip";

/* [Embed(source="/_assets/assets.swf", symbol="symbol2605")] */
@boundClass
export default class JetMC extends MovieClip {
    public flames: MovieClip;
    public lights: MovieClip;
}