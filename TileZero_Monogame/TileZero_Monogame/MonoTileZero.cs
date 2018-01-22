/* 
Copyright 2018 Enkhbold Nyamsuren (http://www.bcogs.net , http://www.bcogs.info/)

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/


using System;
using System.IO;

using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;
using Microsoft.Xna.Framework.Input;

//using TileZero;
using AssetManagerPackage;
using AssetPackage;
using TwoA;
using TZCfg = TileZero.Cfg;

using System.Diagnostics; // [TODO]

namespace TileZero_Monogame
{
    /// <summary>
    /// This is the main type for your game.
    /// </summary>
    public class MonoTileZero : Microsoft.Xna.Framework.Game
    {
        GraphicsDeviceManager graphics;
        SpriteBatch spriteBatch;

        private SpriteFont font;

        Texture2D cellTexture = null;

        Texture2D[,] tileTextures = null;

        TileZero.Game game = null;
        // [SC] the number of tiles to be played
        const int playableTileCount = 54;
        // [SC] the number of games to be played with each AI evolution
        const int numberOfMatches = 50; // [TODO]
        double winCount = 0;
        double lossCount = 0;
        // [SC] a player is represented by an AI evolving from Very Easy AI to Very Hard AI
        string[] aiOneEvolution = {
            //TZCfg.VERY_EASY_AI
            //, TZCfg.EASY_AI
            //, TZCfg.MEDIUM_COLOR_AI
            //, TZCfg.MEDIUM_SHAPE_AI
             TZCfg.HARD_AI
            //, TZCfg.VERY_HARD_AI
        };

        private TwoA.TwoA twoA;
        private string adaptID = "SkillDifficultyElo";
        private string gameID = "TileZero";
        private string playerID = "EvolvingAI";
        private bool updateBetas = true;
        private double customK = 0.2;

        Random rnd = null;

        private double prevActionTime = 0;

        /// <summary>
        /// The board offset from the left.
        /// </summary>
        const int marginLeft = 10;

        /// <summary>
        /// The board offset from the top.
        /// </summary>
        const int marginTop = 10;

        /// <summary>
        /// The width of a cell.
        /// </summary>
        const int cellw = 40;

        public MonoTileZero() {
            this.graphics = new GraphicsDeviceManager(this);
            this.Content.RootDirectory = "Content";

            this.Window.Title = String.Format("TileZero - A RAGE Game");
        }

        /// <summary>
        /// Allows the game to perform any initialization it needs to before starting to run.
        /// This is where it can query for any required services and load any non-graphic
        /// related content.  Calling base.Initialize will enumerate through any components
        /// and initialize them as well.
        /// </summary>
        protected override void Initialize() {
            // TODO: Add your initialization logic here

            this.graphics.IsFullScreen = false;
            this.graphics.SynchronizeWithVerticalRetrace = true;
            this.graphics.PreferredBackBufferWidth = 1000;
            this.graphics.PreferredBackBufferHeight = 620;
            this.graphics.ApplyChanges();

            base.Initialize();

            rnd = new Random();

            this.twoA = new TwoA.TwoA(null);
            addTwoAData();

            this.game = new TileZero.Game();

            startNewGame();
        }

        /// <summary>
        /// LoadContent will be called once per game and is the place to load
        /// all of your content.
        /// </summary>
        protected override void LoadContent() {
            // Create a new SpriteBatch, which can be used to draw textures.
            this.spriteBatch = new SpriteBatch(GraphicsDevice);

            // [SC] load cell image
            this.cellTexture = Content.Load<Texture2D>("cell");

            // [SC] load tile images
            this.tileTextures = new Texture2D[TZCfg.MAX_VAL_INDEX, TZCfg.MAX_VAL_INDEX];
            for (int colorIndex = 0; colorIndex < TZCfg.MAX_VAL_INDEX; colorIndex++) {
                for (int shapeIndex = 0; shapeIndex < TZCfg.MAX_VAL_INDEX; shapeIndex++) {
                    this.tileTextures[colorIndex, shapeIndex] = Content.Load<Texture2D>(
                            String.Format("{0}{1}_15_50", colorIndex, shapeIndex));
                }
            }

            this.font = Content.Load<SpriteFont>("Score");

            // TODO: use this.Content to load your game content here
        }

        /// <summary>
        /// UnloadContent will be called once per game and is the place to unload
        /// game-specific content.
        /// </summary>
        protected override void UnloadContent() {
            // TODO: Unload any non ContentManager content here

            // [SC] saving player data to a file
            using (StreamWriter datafile = new StreamWriter("playerData.txt")) {
                string line = ""
                        + "\"AdaptationID\""
                        + "\t" + "\"GameID\""
                        + "\t" + "\"PlayerID\""
                        + "\t" + "\"Rating\""
                        + "\t" + "\"PlayCount\""
                        + "\t" + "\"KFactor\""
                        + "\t" + "\"Uncertainty\""
                        + "\t" + "\"LastPlayed\"";
                datafile.WriteLine(line);

                // [SC] saving player data
                foreach (PlayerNode player in this.twoA.players) {
                    line = ""
                        + "\"" + player.AdaptationID + "\""
                        + "\t" + "\"" + player.GameID + "\""
                        + "\t" + "\"" + player.PlayerID + "\""
                        + "\t" + "\"" + Math.Round(player.Rating, 4) + "\""
                        + "\t" + "\"" + player.PlayCount + "\""
                        + "\t" + "\"" + player.KFactor + "\""
                        + "\t" + "\"" + player.Uncertainty + "\""
                        + "\t" + "\"" + player.GameID + "\""
                        + "\t" + "\"" + player.LastPlayed.ToString(TwoA.TwoA.DATE_FORMAT) + "\"";

                    datafile.WriteLine(line);
                }
            }

            // [SC] saving scenario data to a file
            using (StreamWriter datafile = new StreamWriter("scenarioData.txt")) {
                string line = ""
                        + "\"AdaptationID\""
                        + "\t" + "\"GameID\""
                        + "\t" + "\"ScenarioID\""
                        + "\t" + "\"Rating\""
                        + "\t" + "\"PlayCount\""
                        + "\t" + "\"KFactor\""
                        + "\t" + "\"Uncertainty\""
                        + "\t" + "\"LastPlayed\"";
                datafile.WriteLine(line);

                // [SC] saving player data
                foreach (ScenarioNode scenario in this.twoA.scenarios) {
                    line = ""
                        + "\"" + scenario.AdaptationID + "\""
                        + "\t" + "\"" + scenario.GameID + "\""
                        + "\t" + "\"" + scenario.ScenarioID + "\""
                        + "\t" + "\"" + Math.Round(scenario.Rating, 4) + "\""
                        + "\t" + "\"" + scenario.PlayCount + "\""
                        + "\t" + "\"" + scenario.KFactor + "\""
                        + "\t" + "\"" + scenario.Uncertainty + "\""
                        + "\t" + "\"" + scenario.LastPlayed.ToString(TwoA.TwoA.DATE_FORMAT) + "\"";

                    datafile.WriteLine(line);
                }
            }

            // [SC] saving gameplay data to a file
            using (StreamWriter datafile = new StreamWriter("gameplay.txt")) {
                string line = ""
                        + "\"AdaptationID\""
                        + "\t" + "\"GameID\""
                        + "\t" + "\"PlayerID\""
                        + "\t" + "\"ScenarioID\""
                        + "\t" + "\"Timestamp\""
                        + "\t" + "\"RT\""
                        + "\t" + "\"Accuracy\""
                        + "\t" + "\"PlayerRating\""
                        + "\t" + "\"ScenarioRating\"";
                datafile.WriteLine(line);

                // [SC] saving player data
                foreach (Gameplay gp in this.twoA.gameplays) {
                    line = ""
                        + "\"" + gp.AdaptationID + "\""
                        + "\t" + "\"" + gp.GameID + "\""
                        + "\t" + "\"" + gp.PlayerID + "\""
                        + "\t" + "\"" + gp.ScenarioID + "\""
                        + "\t" + "\"" + gp.Timestamp + "\""
                        + "\t" + "\"" + gp.RT + "\""
                        + "\t" + "\"" + gp.Accuracy + "\""
                        + "\t" + "\"" + Math.Round(gp.PlayerRating, 4) + "\""
                        + "\t" + "\"" + Math.Round(gp.ScenarioRating, 4) + "\"";

                    datafile.WriteLine(line);
                }
            }
        }

        /// <summary>
        /// Allows the game to run logic such as updating the world,
        /// checking for collisions, gathering input, and playing audio.
        /// </summary>
        /// <param name="gameTime">Provides a snapshot of timing values.</param>
        protected override void Update(GameTime gameTime) {
            if (GamePad.GetState(PlayerIndex.One).Buttons.Back == ButtonState.Pressed || Keyboard.GetState().IsKeyDown(Keys.Escape)) {
                Exit();
            }

            // TODO: Add your update logic here

            double currTime = gameTime.TotalGameTime.TotalMilliseconds;

            if (currTime - this.prevActionTime > TZCfg.ACTION_DELAY) {

                if (this.game.activeGameFlag) {
                    if (!this.game.advanceGame()) {
                        if (this.game.getPlayerByIndex(0).WinFlag) {
                            this.winCount++;
                            this.twoA.UpdateRatings(adaptID, gameID, playerID, this.game.getPlayerByIndex(1).getPlayerName()
                                , 0, 1, this.updateBetas, this.customK);
                        }
                        else {
                            this.lossCount++;
                            this.twoA.UpdateRatings(adaptID, gameID, playerID, this.game.getPlayerByIndex(1).getPlayerName()
                                , 0, 0, this.updateBetas, this.customK);
                        }
                    }
                }
                else {
                    startNewGame();
                }

                this.prevActionTime = currTime;
            }
            
            base.Update(gameTime);
        }

        /// <summary>
        /// This is called when the game should draw itself.
        /// </summary>
        /// <param name="gameTime">Provides a snapshot of timing values.</param>
        protected override void Draw(GameTime gameTime) {
            GraphicsDevice.Clear(Color.Black);

            // TODO: Add your drawing code here

            spriteBatch.Begin();
            {

                //! Draw Score
                //
                int startL = marginLeft + (TZCfg.BOARD_COL_COUNT + 2) * cellw;
                int startT = marginTop;
                for (int i = 0; i < this.game.getPlayerCount(); i++) {
                    TileZero.Player player = this.game.getPlayerByIndex(i);

                    string score = String.Format("{0}: {1}", player.getPlayerName(), player.getPlayerScore());
                    spriteBatch.DrawString(font, score, new Vector2(startL, startT), Color.CornflowerBlue);

                    startT += 30;
                }

                // [SC] show loss count
                string winStr = string.Format("Wins: {0}", this.winCount);
                spriteBatch.DrawString(font, winStr, new Vector2(startL, startT), Color.CornflowerBlue);
                startT += 30;

                // [SC] show loss count
                string lossStr = string.Format("Losses: {0}", this.lossCount);
                spriteBatch.DrawString(font, lossStr, new Vector2(startL, startT), Color.CornflowerBlue);
                startT += 30;

                // [SC] show win percentage
                string successStr = string.Format("Success rate: {0:0.0}%", this.winCount * 100/(this.winCount + this.lossCount));
                spriteBatch.DrawString(font, successStr, new Vector2(startL, startT), Color.CornflowerBlue);
                startT += 30;

                //! Draw player tiles
                // 
                // [SC] retrieve AI player simulating the human player
                TileZero.Player simPlayer = this.game.getPlayerByIndex(0);
                for (int r = 0; r < simPlayer.getPlayerTileCount(); r++) {

                    // [SC] get the abstratc object describing the tile
                    TileZero.TileZeroTile tile2draw = simPlayer.getTileAt(r);

                    Rectangle ra = new Rectangle(startL, startT, cellw, cellw);
                    spriteBatch.Draw(this.cellTexture, ra, Color.White);

                    Rectangle rc = new Rectangle(startL + 3, startT + 3, cellw - 6, cellw - 6);
                    spriteBatch.Draw(this.tileTextures[tile2draw.getColorIndex(), tile2draw.getShapeIndex()], rc, Color.White);

                    startT += cellw;
                }

                //! Draw board 15x15
                //! cell  40x40
                // 
                //! Draw Board.
                // 
                for (int r = 0; r < TZCfg.BOARD_ROW_COUNT; r++) {
                    for (int c = 0; c < TZCfg.BOARD_COL_COUNT; c++) {
                        int l = marginLeft + c * cellw;
                        int t = marginTop + r * cellw;

                        TileZero.TileZeroTile boardTile = this.game.getBoardTileAt(r, c);

                        Rectangle ra = new Rectangle(l, t, cellw, cellw);
                        spriteBatch.Draw(this.cellTexture, ra, Color.White);

                        if (boardTile != null) {
                            Rectangle rc = new Rectangle(l + 3, t + 3, cellw - 6, cellw - 6);
                            spriteBatch.Draw(this.tileTextures[boardTile.getColorIndex(), boardTile.getShapeIndex()]
                                                , rc, Color.White);
                        }
                    }
                }
            }
            spriteBatch.End();

            base.Draw(gameTime);
        }

        /// <summary>
        /// Creates a new game.
        /// </summary>
        private void startNewGame() {
            if (this.winCount + this.lossCount < numberOfMatches * this.aiOneEvolution.Length) {
                Debug.WriteLine("Gameplay: " + (this.winCount + this.lossCount));
                Debug.WriteLine("Player rating: " + twoA.PlayerRating(this.adaptID, this.gameID, this.playerID));
                Debug.WriteLine("Player uncertainty: " + twoA.PlayerUncertainty(this.adaptID, this.gameID, this.playerID));

                string aiOneID = getAiOne();
                string aiTwoID = this.twoA.TargetScenarioID(this.adaptID, this.gameID, this.playerID);

                int startPlayerIndex = rnd.Next(2); // [SC] decide whether the player or the opponent moves first;

                this.game.initNewGame(aiOneID, aiTwoID, playableTileCount, startPlayerIndex);
                this.game.getPlayerByIndex(0).setPlayerName(aiOneID);
                this.game.getPlayerByIndex(1).setPlayerName(aiTwoID);
                this.game.startNewGame();
            }
            else {
                Exit();
            }
        }

        private string getAiOne() {
            double currMatchCount = this.winCount + this.lossCount;

            for (int currIndex = 0; currIndex < this.aiOneEvolution.Length; currIndex++) {
                if (currMatchCount >= currIndex * numberOfMatches 
                    && currMatchCount < (currIndex + 1) * numberOfMatches) {
                    return this.aiOneEvolution[currIndex];
                }
            }

            return null;
        }

        private void addTwoAData() {
            if (this.twoA == null) {
                throw new NullReferenceException("TwoA instance is not initialized.");
            }

            this.twoA.SetTargetDistribution(this.adaptID, 0.5, 0.1, 0.25, 0.75);

            DateTime lastPlayed = DateTime.ParseExact("2012-12-31T11:59:59", TwoA.TwoA.DATE_FORMAT, null);

            double[] betas = {
                    -0.384
                    , 0.117
                    //, 1.520
                    //, 1.519
                    , 1.48
                    , 2.066
            };
            string[] scenarios = {
                TZCfg.VERY_EASY_AI
                , TZCfg.EASY_AI
                //, TZCfg.MEDIUM_COLOR_AI
                //, TZCfg.MEDIUM_SHAPE_AI
                , TZCfg.HARD_AI
                , TZCfg.VERY_HARD_AI
            };

            this.twoA.AddPlayer(
                new PlayerNode() {
                    AdaptationID = this.adaptID
                    , GameID = this.gameID
                    , PlayerID = this.playerID
                    , Rating = 0.01
                    , PlayCount = 0
                    , KFactor = 0.0075
                    , Uncertainty = 1
                    , LastPlayed = lastPlayed
                }
            );

            for (int index = 0; index < scenarios.Length; index++) {
                this.twoA.AddScenario(
                    new ScenarioNode() {
                        AdaptationID = this.adaptID
                        , GameID = this.gameID
                        , ScenarioID = scenarios[index]
                        , Rating = betas[index]
                        , PlayCount = 0
                        , KFactor = 0.0075
                        , Uncertainty = 0
                        , LastPlayed = lastPlayed
                        , TimeLimit = 900000
                    }
                );
            }
        }
    }
}
