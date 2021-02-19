const path = require('path'),
    webpack = require('webpack'),
    VueLoaderPlugin = require('vue-loader/lib/plugin'),
    CopyPlugin = require('copy-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
    entry: {
        app_loader: path.resolve(__dirname, './src/app_loader.js'),
        version_runner: path.resolve(__dirname, './src/version_runner.js'),
        app: path.resolve(__dirname, './src/app.js'),
    },
    output: {
        path: path.resolve(__dirname, './dist/bundle'),
        filename: '[name].js',
    },
    plugins: [
        new VueLoaderPlugin(),
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, './src/public'),
                    to: path.resolve(__dirname, './dist'),
                },
            ],
          }),
    ],
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                  'vue-style-loader',
                  'css-loader',
                  'sass-loader',
                ]
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.(jpe?g|gif|png|svg|woff|ttf)$/,
            }
        ]
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            '@': path.resolve(__dirname, './'),
            '@components': path.resolve(__dirname, './src/common/components'),
            '@common-components': path.resolve(__dirname, './src/components/common'),
            '@login-page-components': path.resolve(__dirname, './src/components/common/login-page'),
            '@libs': path.resolve(__dirname, './src/common/libs'),
            '@services': path.resolve(__dirname, './src/core/services'),
            '@router': path.resolve(__dirname, './src/router'),
            '@store': path.resolve(__dirname, './src/store'),
            '@axios': path.resolve(__dirname, './src/axios'),
            '@helpers': path.resolve(__dirname, './src/core/helpers'),
            '@utils': path.resolve(__dirname, './src/core/utils'),
            '@config': path.resolve(__dirname, './src/core/config'),
            '@models': path.resolve(__dirname, './src/core/models'),
            '@common-traits': path.resolve(__dirname, './src/common/traits'),
        },
        extensions: ['*', '.ts', '.js', '.vue', '.json', 'scss']
    },
    performance: {
        hints: false,
    },
}

if (isProduction) {
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