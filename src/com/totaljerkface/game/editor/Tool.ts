import ArtTool from "@/com/totaljerkface/game/editor/ArtTool";
import Canvas from "@/com/totaljerkface/game/editor/Canvas";
import Editor from "@/com/totaljerkface/game/editor/Editor";
import PolygonTool from "@/com/totaljerkface/game/editor/PolygonTool";
import RefShape from "@/com/totaljerkface/game/editor/RefShape";
import ToolBar from "@/com/totaljerkface/game/editor/ToolBar";
import Window from "@/com/totaljerkface/game/editor/ui/Window";
import { boundClass } from 'autobind-decorator';
import Sprite from "flash/display/Sprite";

@boundClass
export default class Tool extends Sprite {
    private static windowX: number;
    private static windowY: number = 30;
    protected _canvas: Canvas;
    protected _editor: Editor;
    protected window: Window;

    constructor(param1: Editor, param2: Canvas) {
        super();
        this._editor = param1;
        this._canvas = param2;
    }

    public activate() {
        this.window = new Window(false, this);
        this.window.x = Tool.windowX;
        this.window.y = Tool.windowY;
        this._canvas.parent.parent.addChild(this.window);
    }

    public deactivate() {
        Tool.windowX = this.window.x;
        Tool.windowY = this.window.y;
        this.window.closeWindow();
        this.window = null;
    }

    public resetActionVars(param1: string) { }

    public addFrameHandler() { }

    public removeFrameHandler() { }

    public setCurrentShape(param1: RefShape) { }

    public die() {
        if (this.window) {
            this.deactivate();
        }
    }

    public get canvas(): Canvas {
        return this._canvas;
    }

    public get editor(): Editor {
        return this._editor;
    }

    public remoteButtonPress() {
        if (this instanceof PolygonTool) {
            this._editor.toolBar.pressButton(ToolBar.POLYGON);
        } else if (this instanceof ArtTool) {
            this._editor.toolBar.pressButton(ToolBar.ART);
        }
    }

    public resizeElements() { }
}