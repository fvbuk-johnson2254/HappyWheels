const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const CircularDependencyPlugin = require("circular-dependency-plugin");
const visualizer = require("circular-dependency-plugin-visualizer");

module.exports = {
    mode: "development",
    entry: "./src/app.ts",
    bail: false,
    optimization: {
        noEmitOnErrors: false,
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "app.js"
    },
    devtool: "source-map",
    resolve: {
        alias: {
            "flash": path.resolve(__dirname, "node_modules/openfl/lib/openfl"),
            "@": path.resolve(__dirname, "./src"),
            "@assets": path.resolve(__dirname, "./public/assets")
        },
        extensions: ['.tsx', '.ts', '.js']
    },
    module: {
        rules: [
            {
                test: /\.[jt]sx?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                [
                                    '@babel/preset-env',
                                    {
                                        modules: "auto",
                                        forceAllTransforms: true
                                    }
                                ],
                                "@babel/preset-typescript"
                            ],
                            plugins: [
                                ["@babel/plugin-transform-modules-commonjs", { "lazy": true }],
                                ["@babel/plugin-proposal-decorators", { "legacy": true }]
                            ]
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                "public"
            ]
        }),
        new CircularDependencyPlugin(
            visualizer({
                exclude: /node_modules/,
                failOnError: false,
                cwd: process.cwd()
            }, {
                filepath: path.join(
                    __dirname,
                    "circular-dependencies.html"
                )
            })
        )
    ],
    performance: {
        hints: false
    }
};
