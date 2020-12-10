import * as path from 'path';
import * as webpack from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import ConfigService from './helpers/ConfigService';
import { VueLoaderPlugin } from 'vue-loader';

module.exports = {
    entry: [
        path.resolve(__dirname, '../src/main.js'),
    ],
    plugins: [
        new VueLoaderPlugin(),
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash:8].css',
        }),
    ],
    output: {
        path: path.resolve(__dirname, './public'),
        publicPath: './public',
        filename: '[name].js',
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                  'vue-style-loader',
                  'css-loader',
                  'sass-loader'
                ]
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ]
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            '@': path.resolve(__dirname, './'),
            '@components': path.resolve(__dirname, '../src/common/components'),
            '@common-components': path.resolve(__dirname, '../src/components/common'),
            '@login-page-components': path.resolve(__dirname, '../src/components/common/login-page'),
            '@libs': path.resolve(__dirname, '../src/common/libs'),
            '@services': path.resolve(__dirname, '../src/core/services'),
            '@router': path.resolve(__dirname, '../src/router'),
            '@store': path.resolve(__dirname, '../src/store'),
            '@axios': path.resolve(__dirname, '../src/axios'),
            '@helpers': path.resolve(__dirname, '../src/core/helpers'),
            '@config': path.resolve(__dirname, '../src/core/config'),
            '@models': path.resolve(__dirname, '../src/core/models'),
            '@common-traits': path.resolve(__dirname, '../src/common/traits'),
        },
        extensions: ['*', '.ts', '.js', '.vue', '.json']
    },
    performance: {
        hints: false,
    },
}

if (ConfigService.isProduction()) {
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"',
            }
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true
        }),
    ]);
}