import {ITestConfigItem} from 'easy-test-lib';
import start from './test-main';
const caseFiles = [
    'query-selector',
    // 'id-map'
];

const cases: ITestConfigItem[] = [];

caseFiles.forEach(name => {
    const item = require(`./cases/${name}`).default;
    if (item instanceof Array) {
        cases.push(...item);
    } else {
        cases.push(item);
    }
});

start({cases});