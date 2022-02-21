const childProcess = require('child_process');
const fs = require('fs');
const toc = require('gulp-markdown-toc');
const gulp = require('gulp');
const slog = require('single-line-log').stdout;
const chalk = require('chalk');

async function main () {
    clearNpm();
    syncVersion();
    readmeToc();
    await buildWebpack();
    console.log(chalk.green('Task All Success!'));
}

function clearNpm () {
    const done = logLoading('Clearing npm workspace');
    clearDirectory('./npm');
    done();
}

function clearDirectory (path) {
    const files = fs.readdirSync(path);
    files.forEach((file) => {
        const filePath = `${path}/${file}`;
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            clearDirectory(filePath);
            fs.rmdirSync(filePath);
        } else {
            fs.unlinkSync(filePath);
        }
    });
};

async function buildWebpack () {
    const done = logLoading('Building Webpack');
    const webpackCmd = 'node ./node_modules/webpack/bin/webpack.js --config webpack-config/build.js';
    await exec(webpackCmd);
    done();
}

function readmeToc () {
    const done = logLoading('Rendering readme TOC');
    gulp.src(['helper/README.md', 'helper/README.cn.md'])
        .pipe(toc())
        .pipe(gulp.dest('.'))
        .pipe(gulp.dest('npm'));
    done();
}


async function exec (cmd) {
    return new Promise(resolve => {
        childProcess.exec(cmd, function (error, stdout, stderr) {
            if (error) {
                throw new Error(`Exec error${cmd}`);
            }
            resolve({
                success: true,
                stdout,
                stderr
            });
        });
    });
}

function syncVersion () {
    const done = logLoading('Syncing package version');
    let version = process.argv[2];
    let versionFromPackage = false;
    if (!version) {
        version = require('../package.json').version;
        versionFromPackage = true;
    }
    console.log(chalk.blue(`NPM Veriosn = ${version}`));
    const pkg = require('./package.json');
    pkg.version = version;
    fs.writeFileSync('./src/version.ts', `export default '${version}';`, 'utf8');
    fs.writeFileSync('./npm/package.json', JSON.stringify(pkg, null, 4), 'utf8');
    if (!versionFromPackage) {
        const pkg = require('../package.json');
        pkg.version = version;
        fs.writeFileSync('./package.json', JSON.stringify(pkg, null, 4), 'utf8');
    }
    done();
}


function logLoading (text = 'Processing', time = 80) {
    const loadChar = ['\\', '|', '/', '-'];
    let index = 0;
    const interval = setInterval(() => {
        index ++;
        if (index >= loadChar.length) {
            index = 0;
        }
        slog(chalk.blue(`${loadChar[index]} ${text}...`));
    }, time);

    return () => {
        clearInterval(interval);
        slog(chalk.green(`${text} Done !`));
        console.log('');
    };
}

main();