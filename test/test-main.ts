import {startTest, ITestConfigItem} from 'easy-test-lib';
import lib from './lib';

export default ({cases, onComplete}: {
    cases: ITestConfigItem[];
    onComplete?: any;
}) => {
    startTest({
        args: {
        },
        cases,
        onTestComplete (result) { // 测试全部完成回调 可选
            let txtContent = '';
            const log = (text = '', options = '') => {
                console.log(text, options);
                txtContent += text + '\n';
            };
            log();
            log(`%c测试结果: ${result.passed ? '' : '不'}通过`, `color:${result.passed ? 'green' : 'red'};`);
            
            log(`测试用例数: ${result.results.length}`);
            log(`总耗时: ${result.time}ms`);
            log('----------------------------');
            log(`测试用例详细数据:`);
            log('----------------------------');
            result.results.forEach(item => {
                if (item.disabled) return;
                let str = `%c【${item.name}】: ${item.passed ? '' : '不'}通过(${item.time}ms); [输出结果]: ${lib.toString(item.result)};`;
                if (!item.passed) {
                    str += `期望结果: ${lib.toString(item.expect)}`;
                }
                log(str, `color:${item.passed ? 'green' : 'red'};`);
            });
            log('----------------------------');
    
            if (onComplete)
                onComplete(result, txtContent);
        }
    });
};


