import { boundClass } from 'autobind-decorator';
import MovieClip from "flash/display/MovieClip";

/* [Embed(source="/_assets/assets.swf", symbol="symbol911")] */
@boundClass
export default class CoinMC extends MovieClip {
    public container: MovieClip;
}