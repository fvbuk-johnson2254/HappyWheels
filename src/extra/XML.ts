// TODO: implement this
import { boundClass } from 'autobind-decorator';
import XMLList from './XMLList';

@boundClass
export default class XML {
    info: XMLList;
    [key: string]: any;

    constructor(text: string) {

    }

    children(): XMLList {
        return new XMLList();
    }

    child(selector: string): XML[] {
        return [];
    }

    attribute(name: string) {
        return '';
    }

    appendChild(xml: XML) {

    }

    toXMLString() {
        return '';
    }
}