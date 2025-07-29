import { TopLevel } from "./global";

declare global {
    const trace: typeof TopLevel.trace;
    const root: typeof TopLevel.root;
    const stage: typeof TopLevel.stage;
    const addChild: typeof TopLevel.addChild;
    const removeChild: typeof TopLevel.removeChild;
    const addChildAt: typeof TopLevel.addChildAt;
    const getDefinitionByName: typeof TopLevel.getDefinitionByName;
    const getQualifiedClassName: typeof TopLevel.getQualifiedClassName;
    const navigateToURL: typeof TopLevel.navigateToURL;
    const int: typeof TopLevel.int;
    const uint: typeof TopLevel.uint;
    const getTimer: typeof TopLevel.getTimer;
    
    class Event extends TopLevel.Event {}
    class Vector<T> extends TopLevel.Vector<T> {}
    class Dictionary<K, V> extends TopLevel.Dictionary<K, V> {}
    class XML extends TopLevel.XML {}
    class XMLList extends TopLevel.XMLList {}
    class Date extends TopLevel.Date {}
}

export {};
