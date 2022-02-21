import {IStrictTestCase} from './types';

export function testStrictEqualCase ({
    testCases
}: {
    testCases: IStrictTestCase[],
}) {
    testCases.forEach((testCase) => {
        test(testCase.name, () => {
            const results = testCase.test();
            expect(results).toStrictEqual(testCase.expect);
        });
    });
}
