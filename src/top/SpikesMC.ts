import { boundClass } from 'autobind-decorator';
import MovieClip from "flash/display/MovieClip";

/* [Embed(source="/_assets/assets.swf", symbol="symbol1016")] */
@boundClass
export default class SpikesMC extends MovieClip {
    public base: MovieClip;
    public spikes: MovieClip;
}