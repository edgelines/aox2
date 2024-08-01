const { merge } = require('webpack-merge');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin') //추가
const common = require('./webpack.common.js');


module.exports = merge(common, {
    mode: "production",
    // devtool: "hidden-source-map",
    devtool: false, // 소스 맵 파일을 생성하지 않도록 설정
    output: {
        path: path.resolve('./dist'),
        filename: '[name].[chunkhash:8].js',
        // filename: 'build.js',
        publicPath: '/', // 라우터 링크 못읽는 현상 수정
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'src', 'index.html'),  // index.html 파일의 경로를 지정합니다.
            favicon: path.resolve(__dirname, 'src', 'favicon.ico'),
            inject: true,
            filename: path.resolve('./dist/index.html')
        }),
    ],
    // entry: './src/index.js',
});