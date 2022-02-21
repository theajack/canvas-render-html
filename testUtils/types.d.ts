export interface IStrictTestCase {
    name: string;
    test(): any[];
    expect: any[];
}