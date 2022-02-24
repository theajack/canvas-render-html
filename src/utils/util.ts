/*
 * @Author: tackchen
 * @Date: 2022-02-23 18:16:10
 * @LastEditors: tackchen
 * @FilePath: /canvas-render-html/src/utils/util.ts
 * @Description: Coding something
 */

export function parseNumFromStr (str: string, replace: string) {
    return parseFloat(str.replace(replace, ''));
}