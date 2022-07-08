// const fs = require("fs");
import { assert } from 'console';
import * as fs from 'fs';
import * as path from 'path';

// const path = require("path");
const ignore = ['node_modules'];
var NUM_DEPTH = 9999;
var NUM_WIDTH = 9999;

export const treePath = function (dir: string, num_depth: number = 9999, num_width: number = 9999) {
    NUM_DEPTH = num_depth;
    NUM_WIDTH = num_width;
    assert(NUM_WIDTH >= 0 && NUM_DEPTH >= 0, "num_depth or num_width should be no less than 0!");


    const treeArr = [{
        name: path.basename(dir),
        str: path.basename(dir)
    }];

    const render = function (name: string, isLast: boolean, deep: Array<boolean>) {
        const line = deep.map(el => `${el ? '│' : ' '}  `).join('');
        const text = `${line}${isLast ? '└─' : '├─'} ${name}`;
        return {
            name: name,
            str: text
        };
    }

    const tree = function (target: string, deep: Array<boolean> = []) {
        const child = fs.readdirSync(target).filter(el => !el.startsWith('.'));
        var direct: Array<string> = [];
        let file: Array<string> = [];
        let num_width: number = 0;
        child.forEach(function (el) {
            const dir = path.join(target, el);
            const stat = fs.statSync(dir);
            const flag = ignore.every(function (reg) {
                return !dir.includes(reg);
            })
            if (flag) {
                if (stat.isFile()) {
                    if (num_width < NUM_WIDTH) {
                        file.push(el);
                    } else if (num_width === NUM_WIDTH) {
                        file.push("...");
                    }
                    num_width = num_width + 1;
                } else {
                    direct.push(el);
                }
            }

        })
        direct.forEach(function (el, i) {
            const dir = path.join(target, el);
            const isLast = (i === direct.length - 1) && (file.length === 0);
            treeArr.push(render(el, isLast, deep));
            if (deep.length + 1 < NUM_DEPTH) {
                tree(dir, [...deep, !isLast]);
            }
        })
        file.forEach(function (el, i) {
            const isLast = i === file.length - 1;
            treeArr.push(render(el, isLast, deep));
        })
    }

    tree(dir);
    return treeArr;
}
