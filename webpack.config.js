const path    = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const process = require('process');
require('dotenv').config()

module.exports = {
    mode: process.env.NODE_ENV,
    entry: path.resolve(__dirname, "src", "app", "index.js"),
    output: {
        // options related to how webpack emits results
        path: path.resolve(__dirname, "dist"), // string
        // the target directory for all output files
        // must be an absolute path (use the Node.js path module)
        filename: "bundle.js", // string
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)?$/,
                include: [
                  path.resolve(__dirname, "src", "actions"),
                  path.resolve(__dirname, "src", "app"),
                  path.resolve(__dirname, "src", "components"),
                  path.resolve(__dirname, "src", "containers"),
                  path.resolve(__dirname, "src", "methods"),
                  path.resolve(__dirname, "src", "reducers")
                ],
                exclude: /node_modules/,
                loader: "babel-loader",
                // query: {
                //     presets: ["@babel/preset-env", "@babel/preset-react"]
                // }
            }, 
            {
                test: /\.html$/,
                include: [
                    path.resolve(__dirname, "src", "app")
                ],
                loader: "html-loader"
            },
            {
                test: /\.css?$/,
                include: [
                  path.resolve(__dirname, "src", "style")
                ],
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.(jpe?g|png|gif|svg)?$/,
                use: ["file-loader"]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({hash: true, template: path.resolve(__dirname, "src", "app", "index.html"), filename: path.resolve(__dirname, "dist", "index.html")}),
        // new webpack.DefinePlugin({
        //     'process.env': {
        //         'NODE_ENV': JSON.stringify('development')
        //     }
        // }),
        // new webpack.optimize.AggressiveMergingPlugin() //Merge chunks 
        new webpack.ProvidePlugin({
            process: 'process/browser',
            Buffer: ['buffer', "Buffer"],
          }),
    ],
    resolve: {
        // options for resolving module requests
        // (does not apply to resolving to loaders)
        extensions: [".ts", ".tsx", ".js", ".jsx"],
        modules: [
          "node_modules",
          path.resolve(__dirname, "app")
        ],
        fallback: { // polyfills for Webpack 5
            util: require.resolve("util/"),
            assert: require.resolve("assert"),
            http: require.resolve("stream-http"),
            crypto: require.resolve("crypto-browserify"),
            buffer: require.resolve("buffer/"),
            zlib: require.resolve("browserify-zlib"),
            stream: require.resolve("stream-browserify"),
            https: require.resolve("https-browserify"),
            path: require.resolve("path-browserify"),
            fs: false,
            tls: false,
            net: false,
        }
    },
    optimization: {
        minimize: true,
        mergeDuplicateChunks: true,
        removeEmptyChunks: true,
        removeAvailableModules: true
    }
};
