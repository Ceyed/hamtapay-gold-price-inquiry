const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { join } = require('path');

module.exports = (env = {}) => {
    const nodeEnv = env['node-env'] || 'production';

    return {
        mode: nodeEnv,
        entry: './apps/market-data/src/main.ts',
        target: 'node',
        output: {
            path: join(__dirname, '../../dist/apps/market-data'),
            filename: 'main.js',
        },
        resolve: {
            extensions: ['.ts', '.js'],
        },
        plugins: [
            new NxAppWebpackPlugin({
                target: 'node',
                compiler: 'tsc',
                main: './src/main.ts',
                tsConfig: './tsconfig.app.json',
                assets: ['./src/assets'],
                optimization: false,
                outputHashing: 'none',
                generatePackageJson: true,
            }),
        ],
    };
};
