/*
 * @Author: tackchen
 * @Date: 2022-02-25 23:07:53
 * @LastEditors: tackchen
 * @LastEditTime: 2022-02-26 00:00:16
 * @FilePath: /canvas-render-html/src/types/parsel-js.d.ts
 * @Description: Coding something
 */
declare module 'parsel-js' {

    export type TParselTokenType = 'type' | 'attribute' | 'class' | 'id' | 'combinator' | 'pseudo-element' | 'pseudo-class' | 'comma';
    
    export type TParselOperatorType = '=' | '|=' | '~=' | '*=' | '^=' | '$=';

    export type TParselCombinatorContent = ' ' | '+' | '>' | '~';

    export interface IParselToken {
        type: TParselTokenType;
		content: string | TParselCombinatorContent;
		pos: number[];
		name: string;
		operator?: TParselOperatorType,
		value?: string;
        argument?: string;
    }

    export function tokenize(selector: string): (IParselToken | string)[];
}