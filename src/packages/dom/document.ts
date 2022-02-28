import {EElementName} from '@src/types/enum';
import {getContext} from '../context/context';
import {createElement} from './elements/create-element';
import {Element} from './elements/element';
import {querySelector} from './parser/query-selector';

let _document: Document;
export class Document {
    constructor () {
        if (_document) return _document;
    }
    get body () {
        return getContext('body');
    }
    createElement (name: EElementName) {
        return createElement(name);
    }
    getElementById (id: string) {
        const body = getContext('body');
        if (body.getAttribute('id') === id) return body;
        return body.getElementById(id);
    }
    querySelector (selector: string) {
        return querySelector({
            children: [getContext('body')]
        } as Element, selector);
    }
    querySelectorAll (selector: string) {
        return getContext('body').querySelectorAll(selector);
    }
};

export const document = new Document();