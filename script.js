'use strict';


/**
 * Сравнивает два массива по значениям.
 * @param {Array} arr1 - первый массив.
 * @param {Array} arr2 - второй массив.
 * @returs {Boolean} - true, если массивы равны; false, если массивы не равны.
 */
function isEqualArrays(arr1, arr2) {
    if (arr1.length != arr2.length) {

        return false;

    } else {

        for (let i = 0; i < arr1.length; i += 1) {

            if (typeof arr1[i] === 'object' && typeof arr2[i] === 'object' && !Array.isArray(arr1[i]) && !Array.isArray(arr2[i]) && arr1[i] !== null && arr2[i] !== null) {

                if (!isEqualObjects(arr1[i], arr2[i])) {
                    return false;
                }

            } else if (Array.isArray(arr1[i]) && Array.isArray(arr2[i])) {

                if (!isEqualArrays(arr1[i], arr2[i])) {
                    return false;
                }

            } else if (typeof arr1[i] === 'function' && typeof arr2[i] === 'function') {

                if (('' + arr1[i]) !== ('' + arr2[i])) {
                    return false;
                }

            } else if (arr1[i] !== arr2[i] && !(arr1[i] !== arr1[i] && arr2[i] !== arr2[i])) {

                return false;
            }

        }

        return true;

    }
}


/**
 * Сравниваниет два объекта по значениям.
 * @param {Object} obj1 - первый объект.
 * @param {Object} obj2 - второй объект.
 * @returns {Boolean} - true, если объекты равны; false, если объекты не равны.
 */
function isEqualObjects(obj1, obj2) {
    let arr1 = Object.keys(obj1);
    let arr2 = Object.keys(obj2);

    if (arr1.length != arr2.length) {

        return false;

    } else {

        outer: for (let i = 0; i < arr1.length; i += 1) {

            let current1 = obj1[arr1[i]];

            for (let k = 0; k < arr2.length; k += 1) {

                let current2 = obj2[arr2[k]];

                if (k == (arr2.length - 1) && arr1[i] !== arr2[arr2.length - 1]) return false;

                if (arr1[i] !== arr2[k]) continue;

                if (typeof current1 === 'object' && typeof current2 === 'object' && !Array.isArray(current1) && !Array.isArray(current2) && current1 !== null && current2 !== null) {

                    if (!isEqualObjects(current1, current2)) {
                        return false;
                    } else {
                        continue outer;
                    }

                } else if (Array.isArray(current1) && Array.isArray(current2)) {

                    if (!isEqualArrays(current1, current2)) {
                        return false;
                    } else {
                        continue outer;
                    }

                } else if (typeof current1 === 'function' && typeof current2 === 'function') {

                    if (('' + current1) !== ('' + current2)) {
                        return false;
                    } else {
                        continue outer;
                    }

                } else {

                    if (current1 !== current2 && !(current1 !== current1 && current2 !== current2)) {
                        return false;
                    } else {
                        continue outer;
                    }
                }

            }

        }

    }

    return true;
}


/**
 * Возвращает пары скобок в строке.
 * @param {String} str - строка, в которой ищем пары скобок.
 * @param {String} openBr - открывающая скобка.
 * @param {String} closeBr - закрывающая скобка.
 * @returns {Object} - объект с элементами all и out,
 * где all содержит массивы пар скобок, а out содержит
 * только внешние (или же первую пару) скобки.
 */
function brackets(str, openBr, closeBr) {
    let arr = [],
        bufferOfBr = [],
        obj = {},
        outer = Infinity;

    for (let i = 0; i < str.length; i += 1) {
        if (str[i] === openBr) {
            bufferOfBr.push(i);
        }
        if (str[i] === closeBr) {
            arr.push([bufferOfBr.pop(), i]);
        }
    }

    arr.forEach(val => {
        if (val[0] < outer) {
            outer = val[0];
            obj['out'] = val;
        }
    });

    obj['all'] = arr;

    return obj;
}


/**
 * Превращает объект в строку.
 * @param {Object} obj - входящий объект.
 * @returns {String} - объект-строка.
 */
function myStringify(obj) {
    let str = '{',
        flagOnlyFunc = 0;

    for (let key in obj) {
        if (typeof obj[key] !== 'function') {
            break;
        } else {
            flagOnlyFunc = 1;
        }
    }

    if (flagOnlyFunc) return false;

    if (obj.toJSON) {
        str = obj.toJSON();
    } else {
        for (let key in obj) {
            if (typeof obj[key] === 'object' && !Array.isArray(obj[key]) && obj[key] !== null) {
                if (myStringify(obj[key])) {
                    str += `${key}:${myStringify(obj[key])}|`;
                }
                continue;
            } else if (typeof obj[key] === 'function') {
                continue;
            } else if (typeof obj[key] === 'string') {
                str += `${key}:^${obj[key]}^|`;
            } else if (Array.isArray(obj[key])) {
                str += `${key}:[${obj[key]}]|`;
            } else {
                str += `${key}:${obj[key]}|`;
            }
        }

        str = str.slice(0, -1) + '}';
    }

    return str;
}


/**
 * Превращает строку в объект.
 * @param {String} str - входящий строка.
 * @returns {Object} - объект.
 */
function myParse(str) {

    let obj = {},
        tmp = [];

    if (str[0] !== '{' || str[str.length - 1] !== '}') {
        return false;
    } else {
        str = str.slice(1, -1);
    }

    let innerObjs = brackets(str, '{', '}');

    for (let i = 0; i < str.length; i += 1) {
        if (str[i] === '|' || str[i] === ':') {
            tmp.push(str.slice(0, i));
            str = str.slice(i + 1);
            innerObjs = brackets(str, '{', '}');
            i = 0;
        }
        if (str[i] === '{') {
            tmp.push(myParse(str.slice(i, innerObjs['out'][1]) + '}'));
            str = str.slice(innerObjs['out'][1] + 2);
            innerObjs = brackets(str, '{', '}');
            i = 0;
        }
    }
    if (str !== '') tmp.push(str.slice(0));

    tmp.forEach((val, i, tmp) => {
        if (i % 2 === 0 || typeof val === 'object') return;
        if (val === 'null') {
            return tmp[i] = null;
        }
        if (val === 'undefined') {
            return tmp[i] = undefined;
        }
        if (val === 'true') {
            return tmp[i] = true;
        }
        if (val === 'false') {
            return tmp[i] = false;
        }
        if (val.indexOf('^') !== -1) {
            return tmp[i] = val.slice(1, -1);
        }
        if (val.indexOf('[') !== -1) {
            let tmpArr = [];

            val = val.slice(1, -1);
            for (let i = 0; i < val.length; i += 1) {
                if (val[i] === ',') {
                    tmpArr.push(+val.slice(0, i) || val.slice(0, i));
                    val = val.slice(i + 1);
                    i = 0;
                }
            }
            tmpArr.push(val);
            return tmp[i] = tmpArr;
        }
        if (typeof + val === 'number') {
            return tmp[i] = +val;
        }
    });

    tmp.forEach((val, i) => {
        if (i % 2 === 0) {
            obj[val] = tmp[i + 1];
        }
    });

    return obj;
}


let obj = {
    name: 'Alex',
    age: 100,
    city: 'Sochi',
    some: {
        one: 1,
        two: 2,
        three: {
            foo: '21',
            bar: [1, 2, 3, 'hello']
        }
    },
    test: null,
    // toJSON: function () {
    // return `{name:^${this.name}^}`;
    // }
};

let jsonObj = myStringify(obj);
let newObj = myParse(myStringify(obj));

console.log(jsonObj);
console.log(newObj);
console.log(isEqualObjects(obj, newObj));
