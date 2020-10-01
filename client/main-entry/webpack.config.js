const path          = require('path');
const webpack       = require('webpack');

const { VueLoaderPlugin } = require('vue-loader');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const router = {
    resolvePlace: function (fileName) {
        return path.resolve(__dirname, './', fileName);
    },
};

module.exports = {
    entry: [
        path.resolve(__dirname, './src/main.js'),
    ],
    plugins: [
        new VueLoaderPlugin(),
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash:8].css',
        }),
    ],
    output: {
        path: path.resolve(__dirname, './dist/public'),
        publicPath: './dist/public',
        filename: '[name].[contenthash:8].js',
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    process.env.NODE_ENV !== 'production'
                    ? 'vue-style-loader'
                    : MiniCssExtractPlugin.loader,
                    'css-loader',
                ],
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        
                    }
                }
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
            '@common-components': path.resolve(__dirname, './src/components/common'),
            '@login-page-components': path.resolve(__dirname, './src/components/common/login-page'),
            '@libs': path.resolve(__dirname, './src/common/libs'),
            '@router': path.resolve(__dirname, './src/router'),
            '@store': path.resolve(__dirname, './src/store'),
            '@axios': path.resolve(__dirname, './src/axios'),
            '@helpers': path.resolve(__dirname, './src/core/helpers'),
            '@config': path.resolve(__dirname, './src/core/config'),
            '@common-traits': path.resolve(__dirname, './src/common/traits'),
        },
        extensions: ['*', '.ts', '.js', '.vue', '.json']
    },
    performance: {
        hints: false,
    },
}

if (process.env.NODE_ENV === 'production') {
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