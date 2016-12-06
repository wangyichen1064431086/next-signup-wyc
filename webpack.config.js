const path = require('path');
const BowerWebpackPlugin = require('bower-webpack-plugin');
const webpack = require('webpack');

module.exports = {
	entry: {
		main: './client/main.js',
		account: ['./client/main-account.js'],
		profile: ['./client/main-profile.js']
	},
	output: {
		path: path.join(__dirname, 'public/scripts'),
		filename: '[name].js',
		sourceMapFilename: '[file].map'
	},
	watch: true,
	devtool: 'source-map',
	module: {
		loaders: [
			{
				test: /\.js$/,
				include: [
					path.resolve(__dirname, 'client'),
					path.resolve(__dirname, 'bower_components')
				],
				loader: 'babel',
				query: {
					presets: ['es2015']
				}
			}
		]
	},
	plugins: [
		new BowerWebpackPlugin({
			includes: /\.js$/
		})/*,
		new webpack.optimize.UglifyJsPlugin()*/
	]
};