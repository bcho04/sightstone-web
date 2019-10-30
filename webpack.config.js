const path    = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    mode: "production",
    entry: path.resolve(__dirname, "src", "web", "app", "index.js"),
    output: {
        // options related to how webpack emits results
        path: path.resolve(__dirname, "src", "web", "dist"), // string
        // the target directory for all output files
        // must be an absolute path (use the Node.js path module)
        filename: "bundle.js", // string
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)?$/,
                include: [
                  path.resolve(__dirname, "src", "web", "app"),
                  path.resolve(__dirname, "src", "web", "lib", "**")
                ],
                exclude: /node_modules/,
                loader: "babel-loader",
                query: {
                    presets: ["@babel/preset-env", "@babel/preset-react"]
                }
            }, 
            {
                test: /\.html$/,
                include: [
                    path.resolve(__dirname, "src", "web", "app")
                ],
                loader: "html-loader"
            },
            {
                test: /\.css?$/,
                include: [
                  path.resolve(__dirname, "src", "web", "app")
                ],
                use: ["style-loader", "css-loader"]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({hash: true, template: path.resolve(__dirname, "src", "web", "app", "index.html"), filename: path.resolve(__dirname, "src", "web", "dist", "index.html")}),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new webpack.optimize.AggressiveMergingPlugin() //Merge chunks 
    ],
    resolve: {
        // options for resolving module requests
        // (does not apply to resolving to loaders)
        modules: [
          "node_modules",
          path.resolve(__dirname, "app")
        ],
    },
    optimization: {
        minimize: true,
        mergeDuplicateChunks: true,
        removeEmptyChunks: true,
        removeAvailableModules: true
    },
    node: {
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
    },
};
