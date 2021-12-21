/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');
// const Uglify = require("uglifyjs-webpack-plugin");
const TerserPlugin = require('terser-webpack-plugin');
const path = require("path");

module.exports = {
	mode: 'production',
	entry: {
		main: "./src/index.js"
	},
	output: {
		// publicPath: '/petro_mon/',
		publicPath: '',
		filename: "[name].[chunkhash].js",
		chunkFilename: "[name].[chunkhash].bundle.js",
		path: path.resolve(__dirname, "dist")
	},
	devServer: {
		historyApiFallback: true
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: [
							['@babel/preset-env', {targets: {ie: '11'}}]
						],
						plugins: ['@babel/plugin-syntax-dynamic-import', '@babel/plugin-proposal-class-properties']
					}
				}
			}
		]
	},
	optimization: {
		minimize: true,
		minimizer: [new TerserPlugin()],
	},
	plugins: [
		new CopyWebpackPlugin({
			patterns: [
			'fonts/**',
			'images/**',
			'bulma.css',
			'node_modules/lit-fontawesome/**',
			'node_modules/@webcomponents/webcomponentsjs/**',
			'manifest.json',
			'push-manifest.json'
			],
		}),
		new HtmlWebpackPlugin({
			chunksSortMode: 'none',
			template: 'index.html'
		}),
		// new Uglify(),
		new WorkboxWebpackPlugin.GenerateSW({
			include: ['index.html', 'manifest.json', 'push-manifest.json', /\.js$/],
			exclude: [/\/@webcomponents\/webcomponentsjs\//],
			// navigateFallback: 'index.html',
			swDest: 'service-worker.js',
			clientsClaim: true,
			skipWaiting: true,
			runtimeCaching: [
				{
					urlPattern: /\/@webcomponents\/webcomponentsjs\//,
					handler: 'StaleWhileRevalidate'
				},
				{
					urlPattern: /^https:\/\/fonts.gstatic.com\//,
					handler: 'StaleWhileRevalidate'
				}
			]
		})
	]
};
