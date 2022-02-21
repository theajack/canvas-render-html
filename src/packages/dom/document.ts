import {EElementName} from '@src/utils/enum';
import {createElement} from './elements/create-element';

let _document: Document;

export class Document {
    constructor () {
        if (_document) return _document;
    }
    get body () {
        return this.createElement(EElementName.Body);
    }
    createElement (name: EElementName) {
        return createElement(name);
    }
};

export const document = new Document();