/// Copyright 2018
///     Enkhbold Nyamsuren (http://www.bcogs.net , http://www.bcogs.info/)
///     Wim van der Vegt 
/// 
/// Licensed under the Apache License, Version 2.0 (the "License");
/// you may not use this file except in compliance with the License.
/// You may obtain a copy of the License at
/// 
///     http://www.apache.org/licenses/LICENSE-2.0
/// 
/// Unless required by applicable law or agreed to in writing, software
/// distributed under the License is distributed on an "AS IS" BASIS,
/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
/// See the License for the specific language governing permissions and
/// limitations under the License.
///

/// <reference path="RageAssetManager/AssetManager.ts"/>
/// 
/// <reference path="TwoA/TwoA.ts"/>
///
/// <reference path="Bridge.ts"/>
///

module TwoACocos2DDemo {
    import AssetManager = AssetManagerPackage.AssetManager;
    import Severity = AssetPackage.Severity;

    import TwoA = TwoAPackage.TwoA;
    import ScenarioNode = TwoAPackage.ScenarioNode;
    import PlayerNode = TwoAPackage.PlayerNode;
    import BaseAdapter = TwoAPackage.BaseAdapter;

    let bridge: Bridge = new Bridge();

    declare function startCocos2D();

    window.onload = () => {
        startCocos2D();

        Simulation.initSimulation();
    };

    export class Simulation {
        private static twoA: TwoA;

        // [SC] each row is a gameplay
        // [SC] column 1: scenario; column 2: accuracy; column 3: expected player rating; column 4: scenario rating
        private static performance: number[][] = [            
            [1, 1, 0.1153, 0.0117],
            [1, 1, 0.2102, -0.0832],
            [4,	1, 0.3663, 1.3239],
            [1,	1, 0.4442, -0.1611],
            [1,	1, 0.5148, -0.2317],
            [4,	1, 0.6532, 1.1855],
            [4,	1, 0.7792, 1.0595],
            [4,	1, 0.8931, 0.9456],
            [4,	0, 0.7958, 1.0429],
            [4,	1, 0.9081, 0.9306],
            [4,	1, 1.0092, 0.8295],
            [4,	1, 1.1002, 0.7385],
            [4,	0, 0.9823, 0.8564],
            [4,	1, 1.076, 0.7626],
            [4,	1, 1.1605, 0.6782],
            [4,	1, 1.2368, 0.6019],
            [5,	0, 1.1761, 2.1268],
            [4,	0, 1.0481, 0.7298],
            [5,	0, 0.9974, 2.1775],
            [4,	1, 1.0841, 0.6431],
            [4,	0, 0.9624, 0.7648],
            [4,	1, 1.0525, 0.6746],
            [4,	1, 1.1339, 0.5933],
            [4,	1, 1.2075, 0.5197],
            [4,	1, 1.2744, 0.4528],
            [5,	0, 1.2167, 2.2352],
            [4,	1, 1.2803, 0.3892],
            [4,	0, 1.1384, 0.5311],
            [5,	0, 1.0884, 2.2853],
            [4,	1, 1.1612, 0.4582],
            [4,	1, 1.2274, 0.392],
            [4,	0, 1.0879, 0.5315],
            [5,	0, 1.0415, 2.3317],
            [4,	1, 1.1166, 0.4565],
            [5,	1, 1.2708, 2.1774],
            [4,	0, 1.1322, 0.5951],
            [4,	1, 1.206, 0.5213],
            [4,	1, 1.273, 0.4543],
            [5,	0, 1.2154, 2.235],
            [4,	1, 1.2791, 0.3906],
            [4,	0, 1.1374, 0.5323],
            [4,	1, 1.208, 0.4617],
            [4,	1, 1.2723, 0.3973],
            [5,	1, 1.417, 2.0903],
            [5,	0, 1.3495, 2.1579],
            [5,	0, 1.2878, 2.2195],
            [5,	0, 1.2313, 2.276],
            [5,	0, 1.1793, 2.3281],
            [4,	1, 1.2421, 0.3345],
            [4,	0, 1.0996, 0.477]
        ];

        private static adaptID: string = "SkillDifficultyElo";
        private static gameID: string = "TileZero";
        private static playerID: string = "EvolvingAI";
        private static updateBetas: boolean = true;
        private static customK: number = 0.2;

        // private static updateDatafiles: boolean = false; // [2018.01.12]

        public static initSimulation(): void {
            bridge.Log(Severity.Information, "START SIMULATION =======================");

            // [SC] instantiate the asset
            this.twoA = new TwoA();

            // [SC] give asset its own bridge
            this.twoA.Bridge = bridge;
        }

        public static doControlSimulation(): void {
            // [SC] adding datafiles to the local storage
            this.addTwoAData();

            for (let index: number = 0; index < this.performance.length; index++) {
                // [SC] retrieving RT, accuracy and expected rating
                let scenarioID: string = this.getScenarioByNumId(this.performance[index][0]);
                let accuracy: number = this.performance[index][1];
                let expectTheta: number = this.performance[index][2];
                let expectBeta: number = this.performance[index][3];

                let playerNode: PlayerNode = this.twoA.Player(this.adaptID, this.gameID, this.playerID, true);
                let scenarioNode: ScenarioNode = this.twoA.Scenario(this.adaptID, this.gameID, scenarioID, true);

                // [SC] update player's and scenario's ratings
                this.twoA.UpdateRatings(playerNode, scenarioNode, 0, accuracy, this.updateBetas, this.customK);

                let factor: number = Math.pow(10, 4);
                let actualTheta: number = Math.round(playerNode.Rating * factor) / factor;
                let actualBeta: number = Math.round(scenarioNode.Rating * factor) / factor;

                // [SC] print update results
                bridge.Log(Severity.Information, "Gameplay " + (index + 1) + " against " + scenarioID + ".");
                bridge.Log(Severity.Information, "    Expected theta: " + expectTheta + "; Calculated theta: " + actualTheta);
                bridge.Log(Severity.Information, "    Expected beta: " + expectBeta + "; Calculated beta: " + actualBeta);
            }

            window.alert("Simulation ended.");

            this.printData();

            bridge.Log(Severity.Information, "END SIMULATION =======================");
        }

        public static doNewSimulation(): void {
            // [SC] adding datafiles to the local storage
            this.addTwoAData();

            for (let index: number = 0; index < this.performance.length; index++) {
                // [SC] retrieving RT, accuracy and expected rating
                let accuracy: number = this.performance[index][1];
                let expectTheta: number = this.performance[index][2];

                let playerNode: PlayerNode = this.twoA.Player(this.adaptID, this.gameID, this.playerID, true);
                let scenarioNode: ScenarioNode = this.twoA.TargetScenario(playerNode);

                // [SC] update player's and scenario's ratings
                this.twoA.UpdateRatings(playerNode, scenarioNode, 0, accuracy, this.updateBetas, this.customK);

                let factor: number = Math.pow(10, 4);
                let actualTheta: number = Math.round(playerNode.Rating * factor) / factor;

                // [SC] print update results
                bridge.Log(Severity.Information, "Gameplay " + (index + 1) + " against " + scenarioNode.ScenarioID + ".");
                bridge.Log(Severity.Information, "    Expected theta: " + expectTheta + "; Calculated theta: " + actualTheta
                    + "; Difference: " + Math.abs(expectTheta - actualTheta));
            }

            window.alert("Simulation ended.");

            this.printData();

            bridge.Log(Severity.Information, "END SIMULATION =======================");
        }

        public static printData(): void {
            let factor: number = Math.pow(10, 4);

            bridge.Log(Severity.Information, "");
            bridge.Log(Severity.Information, "PLAYER DATA================================");
            bridge.Log(Severity.Information,
                "\"AdaptationID\""
                + "\t" + "\"GameID\""
                + "\t" + "\"ScenarioID\""
                + "\t" + "\"Rating\""
                + "\t" + "\"PlayCount\""
                + "\t" + "\"KFactor\""
                + "\t" + "\"Uncertainty\""
                + "\t" + "\"LastPlayed\""
            );
            for(let player of this.twoA.players) {
                bridge.Log(Severity.Information,
                    "\"" + player.AdaptationID + "\""
                    + "\t" + "\"" + player.GameID + "\""
                    + "\t" + "\"" + player.PlayerID + "\""
                    + "\t" + "\"" + Math.round(player.Rating * factor) / factor + "\""
                    + "\t" + "\"" + player.PlayCount + "\""
                    + "\t" + "\"" + Math.round(player.KFactor * factor) / factor + "\""
                    + "\t" + "\"" + Math.round(player.Uncertainty * factor) / factor + "\""
                    + "\t" + "\"" + player.GameID + "\""
                    + "\t" + "\"" + player.LastPlayed + "\""
                );
            }

            bridge.Log(Severity.Information, "");
            bridge.Log(Severity.Information, "SCENARIO DATA================================");
            bridge.Log(Severity.Information,
                "\"AdaptationID\""
                + "\t" + "\"GameID\""
                + "\t" + "\"ScenarioID\""
                + "\t" + "\"Rating\""
                + "\t" + "\"PlayCount\""
                + "\t" + "\"KFactor\""
                + "\t" + "\"Uncertainty\""
                + "\t" + "\"LastPlayed\""
            );
            for (let scenario of this.twoA.scenarios) {
                bridge.Log(Severity.Information,
                    "\"" + scenario.AdaptationID + "\""
                    + "\t" + "\"" + scenario.GameID + "\""
                    + "\t" + "\"" + scenario.ScenarioID + "\""
                    + "\t" + "\"" + Math.round(scenario.Rating * factor) / factor + "\""
                    + "\t" + "\"" + scenario.PlayCount + "\""
                    + "\t" + "\"" + Math.round(scenario.KFactor * factor) / factor + "\""
                    + "\t" + "\"" + Math.round(scenario.Uncertainty * factor) / factor + "\""
                    + "\t" + "\"" + scenario.LastPlayed + "\""
                );
            }

            bridge.Log(Severity.Information, "");
            bridge.Log(Severity.Information, "GAMEPLAY DATA================================");
            bridge.Log(Severity.Information,
                "\"AdaptationID\""
                + "\t" + "\"GameID\""
                + "\t" + "\"PlayerID\""
                + "\t" + "\"ScenarioID\""
                + "\t" + "\"Timestamp\""
                + "\t" + "\"RT\""
                + "\t" + "\"Accuracy\""
                + "\t" + "\"PlayerRating\""
                + "\t" + "\"ScenarioRating\""
            );
            for (let gp of this.twoA.gameplays) {
                bridge.Log(Severity.Information,
                    "\"" + gp.AdaptationID + "\""
                    + "\t" + "\"" + gp.GameID + "\""
                    + "\t" + "\"" + gp.PlayerID + "\""
                    + "\t" + "\"" + gp.ScenarioID + "\""
                    + "\t" + "\"" + gp.Timestamp + "\""
                    + "\t" + "\"" + gp.RT + "\""
                    + "\t" + "\"" + gp.Accuracy + "\""
                    + "\t" + "\"" + Math.round(gp.PlayerRating * factor) / factor + "\""
                    + "\t" + "\"" + Math.round(gp.ScenarioRating * factor) / factor + "\""
                );
            }
        }

        public static addTwoAData(): void {
            if (this.twoA == null) {
                throw new Error("TwoA instance is not initialized.");
            }

            this.twoA.SetTargetDistribution(this.adaptID, 0.5, 0.1, 0.25, 0.75);

            this.twoA.players = new Array();
            this.twoA.scenarios = new Array();
            this.twoA.gameplays = new Array();

            let betas: number[] = [
                - 0.384
                , 0.117
                //, 1.520
                //, 1.519
                , 1.48
                , 2.066
            ];
            let scenarios: string[] = [
                "Very Easy AI"
                , "Easy AI"
                //, "Medium Color AI"
                //, "Medium Shape AI"
                , "Hard AI"
                , "Very Hard AI"
            ];

            this.twoA.AddPlayer(this.adaptID, this.gameID, this.playerID, 0.01, 0, 0.0075, 1, "2012-12-31T11:59:59");

            for (let index = 0; index < scenarios.length; index++) {
                this.twoA.AddScenario(this.adaptID, this.gameID, scenarios[index], betas[index], 0, 0.0075, 0, "2012-12-31T11:59:59", 900000);
            }
        }

        public static getScenarioByNumId(scenarioNum: number): string {
            switch (scenarioNum) {
                case 0: return "Very Easy AI";
                case 1: return "Easy AI";
                case 2: return "Medium Color AI";
                case 3: return "Medium Shape AI";
                case 4: return "Hard AI";
                case 5: return "Very Hard AI";
                default: throw new Error("Unknown scenario number");
            }
        }
    }
}