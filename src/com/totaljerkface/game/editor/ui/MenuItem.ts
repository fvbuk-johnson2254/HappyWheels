import { boundClass } from 'autobind-decorator';
import MovieClip from "flash/display/MovieClip";
import TextField from "flash/text/TextField";

/* [Embed(source="/_assets/assets.swf", symbol="symbol768")] */
@boundClass
export default class MenuItem extends MovieClip {
    public labelText: TextField;
    public inner: MovieClip;
}