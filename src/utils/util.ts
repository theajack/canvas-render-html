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

export function isStartWith (str1: string, str2: string) {
    return str1.indexOf(str2) === 0;
}

export function isEndWith (str1: string, str2: string) {
    const lastIndex = str1.lastIndexOf(str2);
    return lastIndex >= 0 && lastIndex  === str1.length - str2.length;
}

export function isContain (str1: string, str2: string) {
    return str1.indexOf(str2) > 0;
}