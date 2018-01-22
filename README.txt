"TileZero_Monogame" 
	- contains monogame implemetantion of the TileZero game that uses the RAGE asset architecture and TwoA asset
	- the source code is in Visual Studio project format
	- requires Monogame 3.6
"TileZero_Monogame/executable" 
	- contains executable of the game; requires Windows 7 or higher
"TileZero_Monogame/RageAssetManager" 
	- source code for the RAGE Client-side asset architecture
"TileZero_Monogame/TileZero" 
	- source code for the TileZero game including AI players
"TileZero_Monogame/TileZero_Monogame" 
	- Monogame wrapper for the TileZero 
	- contains game loop
	- connects RAGE asset architecture and TwoA asset to the game
"TileZero_Monogame/TwoA" 
	- source code for the TwoA asset v1.2

"TwoA_Cocos2DJS_Demo"
	- contains TwoA demo with the Cocos2D-JS v3.12 game engine
	- testing the project outside of Visual Studio requires a web server (e.g., Apache)
"TwoA_Cocos2DJS_Demo/TwoA_Cocos2DJS_Demo_Compiled"
	- transcompiled version of the demo
	- can be run direcltly if copied to a web server
	- output is printed in a browser console
"TwoA_Cocos2DJS_Demo/TwoA_Cocos2DJS_Demo"
	- project folder with source code
	- source code is in Visual Studio TypeScript project format
"TwoA_Cocos2DJS_Demo/TwoA_Cocos2DJS_Demo/frameworks"
	- JS code for the Cocos2D game engine
"TwoA_Cocos2DJS_Demo/TwoA_Cocos2DJS_Demo/RageAssetManager"
	- TypeScript code for the RAGE Client-side asset architecture
"TwoA_Cocos2DJS_Demo/TwoA_Cocos2DJS_Demo/TwoA"
	- TypeScript code for the TwoA asset

"data"
	- example data produced by the Monogame and Cocos2d demos
	- data is in tab-deliminated table format

"R"
	- R script for analyzing and plotting the example data