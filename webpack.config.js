/* eslint-env node */
const path = require('path');
const UglifyJSPlugin = require('terser-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const GRAPHICS_LIMIT = 1000000;
module.exports = {
    mode: 'development',
    entry: './app/index.js',
    output: {
        filename: 'bundle.js',
        path: __dirname + '/dist'
    },

    devtool: 'source-map',

    optimization: {
        noEmitOnErrors: true,
        concatenateModules: true,
        minimizer: [
            new UglifyJSPlugin({
                sourceMap: true,
                parallel: true,
                cache: true
            }),
            new OptimizeCssAssetsPlugin({
                cssProcessorOptions: {
                    discardComments: {
                        removeAll: true
                    },
                    safe: true
                }
            })
        ]
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['vue-style-loader', 'css-loader']
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                  loader: "babel-loader"
                }
            },
            {
                test: /\.svg(\?.*)?$/,
                loader: 'raw-loader'
            },
            {
                test: /\.svg(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    prefix: 'fonts/',
                    name: '[path][name].[ext]',
                    limit: GRAPHICS_LIMIT,
                    mimetype: 'image/svg+xml'
                }
            },
            {
                test: /\.(png|jpe?g|gif).*$/,
                loader: 'url-loader',
                options: {
                    limit: GRAPHICS_LIMIT,
                    name: '[path][name].[ext]'
                }
            },
        ]
    },
    plugins: [
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, 'app/index.html'),
                to: path.resolve(__dirname, 'dist/index.html')
            },
            {
                from: path.resolve(__dirname, 'app/textures'),
                to: path.resolve(__dirname, 'dist/textures')
            },
            {
                from: path.resolve(__dirname, 'app/fonts'),
                to: path.resolve(__dirname, 'dist/fonts')
            },
        ])
    ],
    resolve: {
        extensions: ['.ts', '.js', '.vue', '.json'],
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        stats: {
            colors: true,
            chunks: false,
            source: false,
            hash: false,
            modules: false,
            errorDetails: true,
            version: false,
            assets: false,
            chunkModules: false,
            children: false
        },
        port: 8280
    }
};