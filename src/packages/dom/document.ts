import {EElementName} from '@src/types/enum';
import {getContext} from '../context/context';
import {createElement} from './elements/create-element';
import {Element} from './elements/element';
import {
    getElementById, getElementsByTagName,
    querySelector, querySelectorAll,
    getElementsByClassName, getElementsByName,
    getElementsByTagNameNs
} from './parser/query-selector';

let _document: Document;

function getBodyMockParent () {
    return {
        children: [getContext('body')]
    } as Element;
}

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
        return getElementById(getBodyMockParent(), id);
    }
    querySelector (selector: string) {
        return querySelector(getBodyMockParent(), selector);
    }
    querySelectorAll (selector: string) {
        return querySelectorAll(getBodyMockParent(), selector);
    }
    getElementsByTagName (tagName: string) {
        return getElementsByTagName(getBodyMockParent(), tagName);
    }
    getElementsByTagNameNs (tagName: string) {
        return getElementsByTagNameNs(getBodyMockParent(), tagName);
    }
    getElementsByClassName (className: string) {
        return getElementsByClassName(getBodyMockParent(), className);
    }
    getElementsByName (name: string) {
        return getElementsByName(getBodyMockParent(), name);
    }
};

export const document = new Document();