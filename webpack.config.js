const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const ServiceWorkerWebpackPlugin = require('serviceworker-webpack-plugin');
const { HotModuleReplacementPlugin } = require('webpack');

const extractCSS = new MiniCssExtractPlugin({
    filename: '[name].css',
    chunkFilename: '[id].css',
});

const htmlWebpackPlugin = new HtmlWebPackPlugin({
    template: './public/index.html',
    favicon: './public/favicon.ico',
    filename: './index.html',
});

const hotModuleReplacementPlugin = new HotModuleReplacementPlugin();

const copyPlugin = new CopyWebpackPlugin(['public/manifest.json']);

const stylelintPlugin = new StyleLintPlugin();

const serviceWorkerWebpackPlugin = new ServiceWorkerWebpackPlugin({
    entry: __dirname + '/public/sw.js',
});

module.exports = {
    output: {
        filename: 'main.js',
        path: __dirname + '/build',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    'babel-loader',
                    'eslint-loader',
                ],
            },
            {
                test: /\.(s*)css$/,
                use: [
                    'css-hot-loader',
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                    'sass-loader',
                ],
            },
            {
                test: /\.html$/,
                use: [{
                    loader: 'html-loader',
                }],
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg|json)(\?v=\d+\.\d+\.\d+)?$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'media/',
                    },
                }],
            },
        ],
    },
    plugins: [
        htmlWebpackPlugin,
        extractCSS,
        hotModuleReplacementPlugin,
        copyPlugin,
        stylelintPlugin,
        serviceWorkerWebpackPlugin,
    ],
    devtool: 'source-map',
    devServer: {
        hot: true,
        port: 3000,
        historyApiFallback: true,
        proxy: {
            '/api': 'http://localhost:3030',
        },
        stats: 'minimal',
    },
};
