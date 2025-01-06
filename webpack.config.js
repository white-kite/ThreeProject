const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require("copy-webpack-plugin");

const webpackMode = process.env.NODE_ENV || 'development';
//main: './src/main.js',
//mainPage: './src/mainPage.js', // 추가한 파일에 대한 엔트리 포인트
//open: './src/open.js', // 추가한 파일에 대한 엔트리 포인트
module.exports = {
	mode: webpackMode,
	entry: {		
		mainPage: './src/mainPage.js', // 추가한 파일에 대한 엔트리 포인트
		open: './src/open.js', // 추가한 파일에 대한 엔트리 포인트
		main: './src/main.js',
		room: './src/room.js',
	},
	output: {
		path: path.resolve('./dist'),
		filename: '[name].min.js'
	},
	// es5로 빌드 해야 할 경우 주석 제거
	// 단, 이거 설정하면 webpack-dev-server 3번대 버전에서 live reloading 동작 안함
	// target: ['web', 'es5'],
	devServer: {
		liveReload: true,
		open: '/open.html', // 서버 시작시 열릴 페이지
	},
	optimization: {
		minimizer: webpackMode === 'production' ? [
			new TerserPlugin({
				terserOptions: {
					compress: {
						drop_console: true
					}
				}
			})
		] : [],
		splitChunks: {
			chunks: 'all'
		}
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: /node_modules/
			},
			{
				test: /\.js$/,
				enforce: 'pre',
				use: ['source-map-loader'],
			}
		],
		
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './src/mainPage.html',
			chunks: ['mainPage'],
			filename: 'mainPage.html',
			minify: webpackMode === 'production' ? {
			  collapseWhitespace: true,
			  removeComments: true,
			} : false,
		  }),
		new HtmlWebpackPlugin({
			template: './src/index.html',
			minify: process.env.NODE_ENV === 'production' ? {
				collapseWhitespace: true,
				removeComments: true,
			} : false
		}),
		new HtmlWebpackPlugin({
			template: './src/open.html',
			chunks: ['open'],
			filename: 'open.html',
			minify: webpackMode === 'production' ? {
			  collapseWhitespace: true,
			  removeComments: true,
			} : false,
		  }),
		new HtmlWebpackPlugin({
			template: './src/warehouse.html',
			chunks: [''],
			filename: 'warehouse.html',
			minify: webpackMode === 'production' ? {
			  collapseWhitespace: true,
			  removeComments: true,
			} : false,
		  }),
		  new HtmlWebpackPlugin({
			template: './src/main.html',
			chunks: ['main'],
			filename: 'main.html',
			minify: webpackMode === 'production' ? {
			  collapseWhitespace: true,
			  removeComments: true,
			} : false,
		  }),  
		  new HtmlWebpackPlugin({
			template: './src/room.html',
			chunks: ['room'],
			filename: 'room.html',
			minify: webpackMode === 'production' ? {
			  collapseWhitespace: true,
			  removeComments: true,
			} : false,
		  }),
		new CleanWebpackPlugin(),
		// CopyWebpackPlugin: 그대로 복사할 파일들을 설정하는 플러그인
		// 아래 patterns에 설정한 파일/폴더는 빌드 시 dist 폴더에 자동으로 생성됩니다.
		// patterns에 설정한 경로에 해당 파일이 없으면 에러가 발생합니다.
		// 사용하는 파일이나 폴더 이름이 다르다면 변경해주세요.
		// 그대로 사용할 파일들이 없다면 CopyWebpackPlugin을 통째로 주석 처리 해주세요.
		new CopyWebpackPlugin({
			patterns: [
				{ from: "./src/main.css", to: "./main.css" },
				{ from: "./src/room.css", to: "./room.css" },
				{ from: "./src/room02.css", to: "./room02.css" },
				{ from: "./src/sakura.min.css", to: "./sakura.min.css" },
				{ from: "./src/sakura.js", to: "./sakura.js" },				
				{ from: "./src/models", to: "./models" },
				{ from: "./src/open.js", to: "./open.js" },				
				{ from: "./src/mainPage.js", to: "./mainPage.js" },				
				{ from: "./src/mainCanvas.js", to: "./mainCanvas.js" },				
				{ from: "./src/meshs", to: "./models/meshs" },
				{ from: "./src/models/kenney/road", to: "./models/kenney/road" },
				{ from: "./src/models/kenney/background", to: "./models/kenney/background" },
				{ from: "./src/models/kenney/roadTile", to: "./models/kenney/roadTile" },
				{ from: "./src/models/kenney/commercial", to: "./models/kenney/commercial" },
				{ from: "./src/models/kenney/character", to: "./models/kenney/character" },
				{ from: "./src/models/kenney/character/enemy/enemy1", to: "./models/kenney/character/enemy/enemy1" },
				{ from: "./src/models/kenney/effect/particle1", to: "./models/kenney/effect/particle1" },
				{ from: "./src/models/kenney/effect/fire", to: "./models/kenney/effect/fire" },
				{ from: "./src/models/kenney/item/potion", to: "./models/kenney/item/potion" },
				{ from: "./src/models/kenney/item/weapon", to: "./models/kenney/item/weapon" },
				{ from: "./src/models/kenney/item/gift", to: "./models/kenney/item/gift" },
				{ from: "./src/DNFBitBitTTF.ttf", to: "./DNFBitBitTTF.ttf" },
				
				{ from: "./src/models/kenney/sound", to: "./models/kenney/sound" },
				{ from: "./src/images", to: "./images" },
				{ from: "./src/models/room01", to: "./models" },
				{ from: "./src/sounds", to: "./sounds" }
			],
		})
	]
};
