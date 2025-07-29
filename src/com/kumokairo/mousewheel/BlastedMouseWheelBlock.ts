import { boundClass } from 'autobind-decorator';
import Stage from "flash/display/Stage";
import IllegalOperationError from "flash/errors/IllegalOperationError";
import Event from "flash/events/Event";
import MouseEvent from "flash/events/MouseEvent";
import ExternalInterface from "flash/external/ExternalInterface";
import Capabilities from "flash/system/Capabilities";

@boundClass
export default class BlastedMouseWheelBlock {
    private static externalJavascriptFunction: string;
    private static nativeStage: Stage;
    private static isMac: boolean;
    private static NEW_OBJECT_ERROR = "You don't have to create an instance of this class. Call BlastedMouseWheelBlock.initialize(..) instead";
    private static NO_EXTERNAL_INTERFACE_ERROR = "No External Interface available. Please, disable BlastedMouseWheelBlock";
    private static EXTERNAL_ALLOW_BROWSER_SCROLL_FUNCTION = "allowBrowserScroll";
    private static EXTERNAL_JAVASCRIPT_FUNCTION_P1 = "var browserScrollAllow=true;var isMac=false;function registerEventListeners(inputIsMac){if(window.addEventListener){window.addEventListener('mousewheel',wheelHandler,true);window.addEventListener('DOMMouseScroll',wheelHandler,true);window.addEventListener('scroll',wheelHandler,true);isMac=inputIsMac}window.onmousewheel=wheelHandler;document.onmousewheel=wheelHandler}function wheelHandler(event){var delta=deltaFilter(event);if(delta==undefined){delta=event.detail}if(!event){event=window.event}if(!browserScrollAllow){if(window.chrome||isMac){document.getElementById('";
    private static EXTERNAL_JAVASCRIPT_FUNCTION_P2 = "').scrollHappened(delta)}if(event.preventDefault){event.preventDefault()}else{event.returnValue=false}}}function allowBrowserScroll(allow){browserScrollAllow=allow}function deltaFilter(event){var delta=0;if(event.wheelDelta){delta=event.wheelDelta/40;if(window.opera)delta=-delta}else if(event.detail){delta=-event.detail}return delta}";

    constructor() {
        throw new IllegalOperationError(BlastedMouseWheelBlock.NEW_OBJECT_ERROR);
    }

    public static initialize(param1: Stage, param2: string = "flashObject") {
        if (ExternalInterface.available) {
            BlastedMouseWheelBlock.isMac = Capabilities.os.toLowerCase().indexOf("mac") != -1;

            BlastedMouseWheelBlock.externalJavascriptFunction =
                BlastedMouseWheelBlock.EXTERNAL_JAVASCRIPT_FUNCTION_P1 +
                param2 +
                BlastedMouseWheelBlock.EXTERNAL_JAVASCRIPT_FUNCTION_P2;

            BlastedMouseWheelBlock.nativeStage = param1;

            param1.addEventListener(MouseEvent.MOUSE_MOVE, BlastedMouseWheelBlock.mouseOverStage);
            param1.addEventListener(Event.MOUSE_LEAVE, BlastedMouseWheelBlock.mouseLeavesStage);
            param1.addEventListener(MouseEvent.MOUSE_WHEEL, BlastedMouseWheelBlock.onMouseWheel);
            ExternalInterface.call("eval", BlastedMouseWheelBlock.externalJavascriptFunction);
            ExternalInterface.addCallback("scrollHappened", BlastedMouseWheelBlock.scrollHappened);
            ExternalInterface.call("registerEventListeners", BlastedMouseWheelBlock.isMac);
            return;
        }

        throw new Error(BlastedMouseWheelBlock.NO_EXTERNAL_INTERFACE_ERROR,);
    }

    private static onMouseWheel(param1: MouseEvent) { }

    private static scrollHappened(param1: number) {
        BlastedMouseWheelBlock.nativeStage.dispatchEvent(
            new MouseEvent(
                MouseEvent.MOUSE_WHEEL,
                true,
                false,
                BlastedMouseWheelBlock.nativeStage.mouseX,
                BlastedMouseWheelBlock.nativeStage.mouseY,
                null,
                false,
                false,
                false,
                false,
                param1
            )
        );
    }

    private static mouseOverStage(param1: MouseEvent) {
        if (BlastedMouseWheelBlock.nativeStage.hasEventListener(MouseEvent.MOUSE_MOVE)) {
            BlastedMouseWheelBlock.nativeStage.removeEventListener(
                MouseEvent.MOUSE_MOVE,
                BlastedMouseWheelBlock.mouseOverStage,
            );
        }

        BlastedMouseWheelBlock.nativeStage.addEventListener(
            Event.MOUSE_LEAVE,
            BlastedMouseWheelBlock.mouseLeavesStage
        );

        ExternalInterface.call(
            BlastedMouseWheelBlock.EXTERNAL_ALLOW_BROWSER_SCROLL_FUNCTION,
            false
        );
    }

    private static mouseLeavesStage(param1: Event) {
        if (BlastedMouseWheelBlock.nativeStage.hasEventListener(Event.MOUSE_LEAVE)) {
            BlastedMouseWheelBlock.nativeStage.removeEventListener(
                Event.MOUSE_LEAVE,
                BlastedMouseWheelBlock.mouseLeavesStage,
            );
        }

        BlastedMouseWheelBlock.nativeStage.addEventListener(
            MouseEvent.MOUSE_MOVE,
            BlastedMouseWheelBlock.mouseOverStage,
        );

        ExternalInterface.call(
            BlastedMouseWheelBlock.EXTERNAL_ALLOW_BROWSER_SCROLL_FUNCTION,
            true,
        );
    }
}
