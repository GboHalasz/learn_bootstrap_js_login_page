const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

const isDevelopment = process.env.NODE_ENV !== "production";

module.exports = {
    mode: isDevelopment ? "development" : "production",
    devtool: isDevelopment ? "inline-source-map" : false,
    entry: './src/main.js',
    output: {
        filename: isDevelopment ? '[name].bundle.js' : '[name].[contenthash].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },

    module: {
        rules: [
            {
                test: /\.js$/i,
                include: path.resolve(__dirname, 'src'),
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                },
            },
            {
                test: /\.css$/i,
                use: [
                    isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: "postcss-loader",
                        options: {
                            postcssOptions: {
                                plugins: [
                                    [
                                        "autoprefixer",
                                        {
                                            grid: true,
                                        },
                                    ],
                                ],
                            },
                        },
                    },
                ],
            },
            {
                test: /\.(png|jpe?g|gif|ttf|eot|svg)$/i,
                type: 'asset/resource',
            },
        ],
    },
    resolve: {
        extensions: ['.js'],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
        }),
        !isDevelopment &&
        new MiniCssExtractPlugin({
            filename: "[name].[contenthash].css",
        }),
    ].filter(Boolean),
    optimization: {
        runtimeChunk: 'single',
        splitChunks: {
            chunks: 'all',
        },
        minimize: !isDevelopment,
        minimizer: [
            new CssMinimizerPlugin(),
            new TerserPlugin({
                terserOptions: {
                    compress: {
                        drop_console: true,
                    },
                    mangle: true,
                    output: {
                        comments: false,
                    },
                },
                extractComments: false,
            }),
        ],
    },
    devServer: {
        static: path.resolve(__dirname, 'dist'),
        port: 3000,

        open: true,
    },
};
