﻿/// Copyright 2018
///     Enkhbold Nyamsuren (http://www.bcogs.net , http://www.bcogs.info/)
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

/// <reference path="../RageAssetManager/ILog.ts"/>
///
/// <reference path="BaseAdapter.ts"/>
/// <reference path="PlayerNode.ts"/>
/// <reference path="ScenarioNode.ts"/>
/// <reference path="Gameplay.ts"/>
/// <reference path="TwoA.ts"/>
/// <reference path="Misc.ts"/>
///

module TwoAPackage
{
    import Severity = AssetPackage.Severity;

    import TwoA = TwoAPackage.TwoA;
    import BaseAdapter = TwoAPackage.BaseAdapter;
    import PlayerNode = TwoAPackage.PlayerNode;
    import ScenarioNode = TwoAPackage.ScenarioNode;
    import Gameplay = TwoAPackage.Gameplay;

    export class DifficultyAdapter extends BaseAdapter
    {
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: properties for the adapter type

        /// <summary>
        /// Gets the type of the adapter
        /// </summary>
        get Type(): string {
            return "Game difficulty - Player skill";
        }

        /// <summary>
        /// Description of this adapter
        /// </summary>
        get Description(): string {
            return "Adapts game difficulty to player skill. Skill ratings are evaluated for individual players. "
                    + "Requires player accuracy (0 or 1) and response time. Uses a modified version of the CAP algorithm.";
        }

        ////// END: properties for the adapter type
        //////////////////////////////////////////////////////////////////////////////////////
        
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: const, fields, and properties for calculating target betas

        private static TARGET_DISTR_MEAN: number = 0.75;      // [SC] default value for 'targetDistrMean' field
        private static TARGET_DISTR_SD: number = 0.1;         // [SC] default value for 'targetDistrSD' field
        private static TARGET_LOWER_LIMIT: number = 0.50;     // [SC] default value for 'targetLowerLimit' field
        private static TARGET_UPPER_LIMIT: number = 1.0;      // [SC] default value for 'targetUpperLimit' field

        private static FI_SD_MULTIPLIER: number = 1.0;        // [SC] multipler for SD used to calculate the means of normal distributions used to decide on lower and upper bounds of the supports in a fuzzy interval

        private targetDistrMean = DifficultyAdapter.TARGET_DISTR_MEAN;
        private targetDistrSD = DifficultyAdapter.TARGET_DISTR_SD;
        private targetLowerLimit = DifficultyAdapter.TARGET_LOWER_LIMIT;
        private targetUpperLimit = DifficultyAdapter.TARGET_UPPER_LIMIT;

        private fiSDMultiplier = DifficultyAdapter.FI_SD_MULTIPLIER;

        /// <summary>
        /// Getter for target distribution mean. See 'setTargetDistribution' method for setting a value.
        /// </summary>
        get TargetDistrMean(): number {
            return this.targetDistrMean;
        }
        //set TargetDistrMean(p_targetDistrMean: number) {
        //    this.targetDistrMean = p_targetDistrMean;
        //}

        /// <summary>
        /// Getter for target distribution standard deviation. See 'setTargetDistribution' method for setting a value.
        /// </summary>
        get TargetDistrSD(): number {
            return this.targetDistrSD;
        }
        //set TargetDistrSD(p_targetDistrSD: number) {
        //    this.targetDistrSD = p_targetDistrSD;
        //}

        /// <summary>
        /// Getter for target distribution lower limit. See 'setTargetDistribution' method for setting a value.
        /// </summary>
        get TargetLowerLimit(): number {
            return this.targetLowerLimit;
        }
        //set TargetLowerLimit(p_targetLowerLimit: number) {
        //    this.targetLowerLimit = p_targetLowerLimit;
        //}

        /// <summary>
        /// Getter for target distribution upper limit. See 'setTargetDistribution' method for setting a value.
        /// </summary>
        get TargetUpperLimit(): number {
            return this.targetUpperLimit;
        }
        //set TargetUpperLimit(p_targetUpperLimit: number) {
        //    this.targetUpperLimit = p_targetUpperLimit;
        //}

        /// <summary>
        /// Getter/setter for a weight used to calculate distribution means for a fuzzy selection algorithm.
        /// </summary>
        get FiSDMultiplier(): number {
            return this.fiSDMultiplier;
        }
        set FiSDMultiplier(p_fiSDMultiplier: number) {
            if (p_fiSDMultiplier <= 0) {
                this.log(AssetPackage.Severity.Warning,
                    "In FiSDMultiplier: The standard deviation multiplier '"
                     + p_fiSDMultiplier + "' is less than or equal to 0.");
            }
            else {
                this.fiSDMultiplier = p_fiSDMultiplier;
            }
        }

        /// <summary>
        /// Sets FiSDMultiplier to a default value
        /// </summary>
        public setDefaultFiSDMultiplier(): void {
            this.FiSDMultiplier = DifficultyAdapter.FI_SD_MULTIPLIER;
        }

        /// <summary>
        /// Sets target distribution parameters to their default values.
        /// </summary>
        public setDefaultTargetDistribution(): void {
            this.setTargetDistribution(DifficultyAdapter.TARGET_DISTR_MEAN, DifficultyAdapter.TARGET_DISTR_SD,
                DifficultyAdapter.TARGET_LOWER_LIMIT, DifficultyAdapter.TARGET_UPPER_LIMIT);
        }

        /// <summary>
        /// Sets target distribution parameters to custom values.
        /// </summary>
        /// 
        /// <param name="p_tDistrMean">   Dstribution mean</param>
        /// <param name="p_tDistrSD">     Distribution standard deviation</param>
        /// <param name="p_tLowerLimit">  Distribution lower limit</param>
        /// <param name="p_tUpperLimit">  Distribution upper limit</param>
        public setTargetDistribution(p_tDistrMean: number, p_tDistrSD: number, p_tLowerLimit: number, p_tUpperLimit: number): void {
            let validValuesFlag: boolean = true;

            // [SD] setting distribution mean
            if (p_tDistrMean <= 0 || p_tDistrMean >= 1) {
                this.log(AssetPackage.Severity.Warning,
                    "In DifficultyAdapter.setTargetDistribution: The target distribution mean '"
                    + p_tDistrMean + "' is not within the open interval (0, 1).");

                validValuesFlag = false;
            }

            // [SC] setting distribution SD
            if (p_tDistrSD <= 0 || p_tDistrSD >= 1) {
                this.log(AssetPackage.Severity.Warning,
                    "In DifficultyAdapter.setTargetDistribution: The target distribution standard deviation '"
                    + p_tDistrSD + "' is not within the open interval (0, 1).");

                validValuesFlag = false;
            }

            // [SC] setting distribution lower limit
            if (p_tLowerLimit < 0 || p_tLowerLimit > 1) {
                this.log(AssetPackage.Severity.Warning,
                    "In DifficultyAdapter.setTargetDistribution: The lower limit of distribution '"
                    + p_tLowerLimit + "' is not within the closed interval [0, 1].");

                validValuesFlag = false;
            }
            if (p_tLowerLimit >= p_tDistrMean) {
                this.log(AssetPackage.Severity.Warning,
                    "In DifficultyAdapter.setTargetDistribution: The lower limit of distribution '" + p_tLowerLimit
                    + "' is bigger than or equal to the mean of the distribution '" + p_tDistrMean + "'.");

                validValuesFlag = false;
            }

            // [SC] setting distribution upper limit
            if (p_tUpperLimit < 0 || p_tUpperLimit > 1) {
                this.log(AssetPackage.Severity.Warning,
                    "In DifficultyAdapter.setTargetDistribution: The upper limit of distribution '"
                    + p_tUpperLimit + "' is not within the closed interval [0, 1].");

                validValuesFlag = false;
            }
            if (p_tUpperLimit <= p_tDistrMean) {
                this.log(AssetPackage.Severity.Warning,
                    "In DifficultyAdapter.setTargetDistribution: The upper limit of distribution '" + p_tUpperLimit
                    + "' is less than or equal to the mean of the distribution '" + p_tDistrMean + "'.");

                validValuesFlag = false;
            }

            if (validValuesFlag) {
                this.targetDistrMean = p_tDistrMean;
                this.targetDistrSD = p_tDistrSD;
                this.targetLowerLimit = p_tLowerLimit;
                this.targetUpperLimit = p_tUpperLimit;
            }
            else {
                this.log(AssetPackage.Severity.Warning
                    , "In DifficultyAdapter.setTargetDistribution: Invalid value combination is found.");
            }
        }

        ////// END: const, fields, and properties for calculating target betas
        //////////////////////////////////////////////////////////////////////////////////////

        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: const, fields, and properties for calculating rating uncertainties

        private static DEF_MAX_DELAY: number = 30;                // [SC] The default value for the max number of days after which player's or item's undertainty reaches the maximum
        private static DEF_MAX_PLAY: number = 40;                 // [SC] The default value for the max number of administrations that should result in minimum uncertaint in item's or player's ratings

        private maxDelay: number = DifficultyAdapter.DEF_MAX_DELAY;        // [SC] set to DEF_MAX_DELAY in the constructor
        private maxPlay: number = DifficultyAdapter.DEF_MAX_PLAY;         // [SC] set to DEF_MAX_PLAY in the constructor

        /// <summary>
        /// Gets or sets the maximum delay.
        /// </summary>
        get MaxDelay(): number{
            return this.maxDelay;
        }
        set MaxDelay(p_maxDelay: number) {
            if (p_maxDelay <= 0) {
                this.log(AssetPackage.Severity.Warning,
                    "In DifficultyAdapter.MaxDelay: The maximum number of delay days '"
                    + p_maxDelay + "' should be higher than 0.");
            }
            else {
                this.maxDelay = p_maxDelay;
            }
        }

        /// <summary>
        /// Sets MaxDelay to its default value.
        /// </summary>
        public setDefaultMaxDelay(): void {
            this.MaxDelay = DifficultyAdapter.DEF_MAX_DELAY;
        }

        /// <summary>
        /// Gets or sets the maximum play.
        /// </summary>
        get MaxPlay(): number {
            return this.maxPlay;
        }
        set MaxPlay(p_maxPlay: number) {
            if (p_maxPlay <= 0) {
                this.log(AssetPackage.Severity.Warning,
                    "In DifficultyAdapter.MaxPlay: The maximum administration parameter '"
                    + p_maxPlay + "' should be higher than 0.");
            }
            else {
                this.maxPlay = p_maxPlay;
            }
        }

        /// <summary>
        /// Sets MaxPlay to its default value
        /// </summary>
        public setDefaultMaxPlay(): void {
            this.MaxPlay = DifficultyAdapter.DEF_MAX_PLAY;
        }

        ////// END: const, fields, and properties for calculating rating uncertainties
        //////////////////////////////////////////////////////////////////////////////////////

        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: const, fields, and properties for calculating k factors

        private static DEF_K: number = 0.0075;    // [SC] The default value for the K constant when there is no uncertainty
        private static DEF_K_UP: number = 4.0;    // [SC] the default value for the upward uncertainty weight
        private static DEF_K_DOWN: number = 0.5;  // [SC] The default value for the downward uncertainty weight

        private kConst: number = DifficultyAdapter.DEF_K;          // [SC] set to DEF_K in the constructor
        private kUp: number = DifficultyAdapter.DEF_K_UP;             // [SC] set to DEF_K_UP in the constructor
        private kDown: number = DifficultyAdapter.DEF_K_DOWN;           // [SC] set to DEF_K_DOWN in the constructor

        /// <summary>
        /// Getter/setter for the K constant.
        /// </summary>
        get KConst(): number {
            return this.kConst;
        }
        set KConst(p_kConst: number) {
            if (p_kConst <= 0) {
                this.log(AssetPackage.Severity.Warning
                    , "In DifficultyAdapter.KConst: K constant '"
                    + p_kConst + "' cannot be 0 or a negative number.");
            }
            else {
                this.kConst = p_kConst;
            }
        }

        /// <summary>
        /// Sets the K constant to its deafult value
        /// </summary>
        public setDefaultKConst(): void {
            this.KConst = DifficultyAdapter.DEF_K;
        }

        /// <summary>
        /// Getter/setter for the upward uncertainty weight.
        /// </summary>
        get KUp(): number {
            return this.kUp;
        }
        set KUp(p_kUp: number) {
            if (p_kUp < 0) {
                this.log(AssetPackage.Severity.Warning,
                    "In DifficultyAdapter.KUp: The upward uncertianty weight '"
                    + p_kUp + "' cannot be a negative number.");
            }
            else {
                this.kUp = p_kUp;
            }
        }

        /// <summary>
        /// Sets the upward uncertainty weight to its default value.
        /// </summary>
        public setDefaultKUp(): void {
            this.KUp = DifficultyAdapter.DEF_K_UP;
        }

        /// <summary>
        /// Getter/setter for the downward uncertainty weight.
        /// </summary>
        get KDown(): number {
            return this.kDown;
        }
        set KDown(p_kDown: number) {
            if (p_kDown < 0) {
                this.log(AssetPackage.Severity.Warning,
                    "In DifficultyAdapter.KDown: The downward uncertainty weight '"
                    + p_kDown + "' cannot be a negative number.");
            }
            else {
                this.kDown = p_kDown;
            }
        }

        /// <summary>
        /// Sets the downward uncetrtainty weight to its default value.
        /// </summary>
        public setDefaultKDown(): void {
            this.KDown = DifficultyAdapter.DEF_K_DOWN;
        }

        ////// END: properties for calculating k factors
        //////////////////////////////////////////////////////////////////////////////////////

        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: constructor

        /// <summary>
        /// Initializes a new instance of the TwoA.DifficultyAdapter class.
        /// </summary>
        constructor() {
            super();
        }

        public InitSettings(p_asset: TwoA) {
            super.InitSettings(p_asset); // [ASSET]
        }

        ////// END: constructor
        //////////////////////////////////////////////////////////////////////////////////////

        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: funtion for updating ratings
        
        /// <summary>
        /// Updates the ratings.
        /// </summary>
        /// <param name="p_playerNode">               Player node to be updated. </param>
        /// <param name="p_pscenarioNode">             Scenario node to be updated. </param>
        /// <param name="p_prt">                       Player's response time. </param>
        /// <param name="p_pcorrectAnswer">            Player's accuracy. </param>
        /// <param name="p_pupdateScenarioRating">     Set to false to avoid updating scenario node. </param>
        /// <param name="p_pcustomPlayerKfct">         If non-0 value is provided then it is used as a weight to scale change in player's rating. Otherwise, adapter calculates its own K factor. </param>
        /// <param name="p_pcustomScenarioKfct">       If non-0 value is provided then it is used as a weight to scale change in scenario's rating. Otherwise, adapter calculates its own K factor. </param>
        /// <returns>True if updates are successfull, and false otherwise.</returns>
        public UpdateRatings(p_playerNode: PlayerNode, p_scenarioNode: ScenarioNode
            , p_rt: number, p_correctAnswer: number, p_updateScenarioRating: boolean
            , p_customPlayerKfct: number, p_customScenarioKfct: number): boolean {

            if (typeof this.asset === 'undefined' || this.asset === null) {
                this.log(AssetPackage.Severity.Error, "In DifficultyAdapter.UpdateRatings: Unable to update ratings. Asset instance is not detected.");
                return false;
            }

            if (typeof p_playerNode === 'undefined' || p_playerNode === null) {
                this.log(AssetPackage.Severity.Error, "In DifficultyAdapter.UpdateRatings: Null player node.");
                return false;
            }

            if (typeof p_scenarioNode === 'undefined' || p_scenarioNode === null) {
                this.log(AssetPackage.Severity.Error, "In DifficultyAdapter.UpdateRatings: Null scenario node.");
                return false;
            }

            if (!(this.validateCorrectAnswer(p_correctAnswer) && this.validateResponseTime(p_rt))) {
                this.log(AssetPackage.Severity.Error, "In DifficultyAdapter.UpdateRatings: Unable to update ratings. Invalid response time and/or accuracy detected.");
                return false;
            }

            // [TODO] should check for valid adaptation IDs in the player and scenarios?

            // [SC] getting player data
            let playerRating: number = p_playerNode.Rating;
            let playerPlayCount: number = p_playerNode.PlayCount;
            let playerUncertainty: number = p_playerNode.Uncertainty;
            let playerLastPlayed: string = p_playerNode.LastPlayed;

            // [SC] getting scenario data
            let scenarioRating: number = p_scenarioNode.Rating;
            let scenarioPlayCount: number = p_scenarioNode.PlayCount;
            let scenarioUncertainty: number = p_scenarioNode.Uncertainty;
            let scenarioTimeLimit: number = p_scenarioNode.TimeLimit;
            let scenarioLastPlayed: string = p_scenarioNode.LastPlayed;

            // [SC] current datetime
            let currDateTime: string = Misc.GetDateStr();

            // [SC] parsing player data
            let playerLastPlayedDays: number = Misc.DaysElapsed(playerLastPlayed);
            if (playerLastPlayedDays > this.MaxDelay) {
                playerLastPlayedDays = this.MaxDelay;
            }

            // [SC] parsing scenario data
            let scenarioLastPlayedDays: number = Misc.DaysElapsed(scenarioLastPlayed);
            if (scenarioLastPlayedDays > this.MaxDelay) {
                scenarioLastPlayedDays = this.MaxDelay;
            }

            // [SC] calculating actual and expected scores
            let actualScore: number = this.calcActualScore(p_correctAnswer, p_rt, scenarioTimeLimit);
            let expectScore: number = this.calcExpectedScore(playerRating, scenarioRating, scenarioTimeLimit);

            // [SC] calculating player and scenario uncertainties
            let playerNewUncertainty: number = this.calcThetaUncertainty(playerUncertainty, playerLastPlayedDays);
            let scenarioNewUncertainty: number = this.calcBetaUncertainty(scenarioUncertainty, scenarioLastPlayedDays);

            let playerNewKFct: number;
            let scenarioNewKFct: number;

            if (p_customPlayerKfct > 0) {
                playerNewKFct = p_customPlayerKfct;
            } else {
                // [SC] calculating player K factors
                playerNewKFct = this.calcThetaKFctr(playerNewUncertainty, scenarioNewUncertainty);
            }

            if (p_customScenarioKfct > 0) {
                scenarioNewKFct = p_customScenarioKfct;
            } else {
                // [SC] calculating scenario K factor
                scenarioNewKFct = this.calcBetaKFctr(playerNewUncertainty, scenarioNewUncertainty);
            }

            // [SC] calculating player and scenario ratings
            let playerNewRating: number = this.calcTheta(playerRating, playerNewKFct, actualScore, expectScore);
            let scenarioNewRating: number = this.calcBeta(scenarioRating, scenarioNewKFct, actualScore, expectScore);

            // [SC] updating player and scenario play counts
            let playerNewPlayCount: number = playerPlayCount + 1.0;
            let scenarioNewPlayCount: number = scenarioPlayCount + 1.0;

            // [SC] storing updated player data
            p_playerNode.Rating = playerNewRating;
            p_playerNode.PlayCount = playerNewPlayCount;
            p_playerNode.KFactor = playerNewKFct;
            p_playerNode.Uncertainty = playerNewUncertainty;
            p_playerNode.LastPlayed = currDateTime;

            // [SC] storing updated scenario data
            if (p_updateScenarioRating) {
                p_scenarioNode.Rating = scenarioNewRating;
                p_scenarioNode.PlayCount = scenarioNewPlayCount;
                p_scenarioNode.KFactor = scenarioNewKFct;
                p_scenarioNode.Uncertainty = scenarioNewUncertainty;
                p_scenarioNode.LastPlayed = currDateTime;
            }

            // [SC] creating game log
            this.asset.CreateNewRecord(this.Type, p_playerNode.GameID, p_playerNode.PlayerID, p_scenarioNode.ScenarioID
                , p_rt, p_correctAnswer, playerNewRating, scenarioNewRating, currDateTime);

            return true;
        }

        ////// END: function for updating ratings
        //////////////////////////////////////////////////////////////////////////////////////

        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: functions for calculating matching scenario

        /// <summary>
        /// Calculates expected beta for target scenario. Returns ScenarioNode object of a scenario with beta closest to the target beta.
        /// If two more scenarios match then scenario that was least played is chosen.  
        /// </summary>
        ///
        /// <param name="p_playerNode">       Player node containing player parameters. </param>
        /// <param name="p_scenarioList">     A list of scenarios from which the target scenario is chosen. </param>
        ///
        /// <returns>
        /// ScenarioNode instance.
        /// </returns>
        public TargetScenario(p_playerNode: PlayerNode, p_scenarioList: ScenarioNode[]): ScenarioNode {
            if (typeof this.asset === 'undefined' || this.asset === null) {
                this.log(AssetPackage.Severity.Error
                    , "In DifficultyAdapter.TargetScenario: Unable to recommend a scenario. Asset instance is not detected.");
                return null;
            }

            // [TODO] should check for valid adaptation IDs in the player and scenarios?

            if (typeof p_playerNode === 'undefined' || p_playerNode === null) {
                this.log(AssetPackage.Severity.Error
                    , "In DifficultyAdapter.TargetScenario: Null player node. Returning null.");
                return null;
            }

            if (typeof p_scenarioList === 'undefined' || p_scenarioList === null || p_scenarioList.length === 0) {
                this.log(AssetPackage.Severity.Error
                    , "In DifficultyAdapter.TargetScenario: Null or empty scenario node list. Returning null.");
                return null;
            }

            // [SC] calculate min and max possible ratings for candidate scenarios
            let ratingFI: number[] = this.calcTargetBetas(p_playerNode.Rating); // [SC][2016.12.14] fuzzy interval for rating

            // [SC] info for the scenarios within the core rating range and with the lowest play count
            let coreScenarios: ScenarioNode[] = new Array();
            let coreMinPlayCount: number = 0;

            // [SC] info for the scenarios within the support rating range and with the lowest play count
            let supportScenarios: ScenarioNode[] = new Array();
            let supportMinPlayCount: number = 0;

            // [SC] info for the closest scenarios outside of the fuzzy interval and the lowest play count
            let outScenarios: ScenarioNode[] = new Array();
            let outMinPlayCount: number = 0;
            let outMinDistance: number = 0;

            // [SC] iterate through the list of all scenarios
            for(let scenario of p_scenarioList) {
                let scenarioRating: number = scenario.Rating;
                let scenarioPlayCount: number = scenario.PlayCount;

                // [SC] the scenario rating is within the core rating range
                if (scenarioRating >= ratingFI[1] && scenarioRating <= ratingFI[2]) {
                    if (coreScenarios.length === 0 || scenarioPlayCount < coreMinPlayCount) {
                        coreScenarios.length = 0;
                        coreScenarios.push(scenario);
                        coreMinPlayCount = scenarioPlayCount;
                    }
                    else if (scenarioPlayCount === coreMinPlayCount) {
                        coreScenarios.push(scenario);
                    }
                }
                // [SC] the scenario rating is outside of the core rating range but within the support range
                else if (scenarioRating >= ratingFI[0] && scenarioRating <= ratingFI[3]) {
                    if (supportScenarios.length === 0 || scenarioPlayCount < supportMinPlayCount) {
                        supportScenarios.length = 0;
                        supportScenarios.push(scenario);
                        supportMinPlayCount = scenarioPlayCount;
                    }
                    else if (scenarioPlayCount === supportMinPlayCount) {
                        supportScenarios.push(scenario);
                    }
                }
                // [SC] the scenario rating is outside of the support rating range
                else {
                    let distance: number = Math.min(Math.abs(scenarioRating - ratingFI[1]), Math.abs(scenarioRating - ratingFI[2]));
                    if (outScenarios.length === 0 || distance < outMinDistance) {
                        outScenarios.length = 0;
                        outScenarios.push(scenario);
                        outMinDistance = distance;
                        outMinPlayCount = scenarioPlayCount;
                    }
                    else if (distance === outMinDistance && scenarioPlayCount < outMinPlayCount) {
                        outScenarios.length = 0;
                        outScenarios.push(scenario);
                        outMinPlayCount = scenarioPlayCount;
                    }
                    else if (distance === outMinDistance && scenarioPlayCount === outMinPlayCount) {
                        outScenarios.push(scenario);
                    }
                }
            }

            if (coreScenarios.length > 0) {
                return coreScenarios[Misc.GetRandomInt(0, coreScenarios.length - 1)];
            }
            else if (supportScenarios.length > 0) {
                return supportScenarios[Misc.GetRandomInt(0, supportScenarios.length - 1)];
            }
            return outScenarios[Misc.GetRandomInt(0, outScenarios.length - 1)];
        }

        /// <summary>
        /// Calculates a fuzzy interval for a target beta.
        /// </summary>
        ///
        /// <param name="p_theta"> The theta. </param>
        ///
        /// <returns>
        /// A four-element array of ratings (in an ascending order) representing lower and upper bounds of the support and core
        /// </returns>
        public calcTargetBetas(p_theta: number): number[] {
            // [SC] mean of one-sided normal distribution from which to derive the lower bound of the support in a fuzzy interval
            let lower_distr_mean: number = this.TargetDistrMean - (this.FiSDMultiplier * this.TargetDistrSD);
            if (lower_distr_mean < BaseAdapter.DistrLowerLimit) {
                lower_distr_mean = BaseAdapter.DistrLowerLimit;
            }
            // [SC] mean of one-sided normal distribution from which to derive the upper bound of the support in a fuzzy interval
            let upper_distr_mean: number = this.TargetDistrMean + (this.FiSDMultiplier * this.TargetDistrSD);
            if (upper_distr_mean > BaseAdapter.DistrUpperLimit) {
                upper_distr_mean = BaseAdapter.DistrUpperLimit;
            }

            // [SC] the array stores four probabilities (in an ascending order) that represent lower and upper bounds of the support and core 
            let randNums: number[] = new Array(4);

            // [SC] calculating two probabilities as the lower and upper bounds of the core in a fuzzy interval
            let rndNum: number;
            for (let index = 1; index < 3; index++) {
                while (true) {
                    rndNum = Misc.GetNormal(this.TargetDistrMean, this.TargetDistrSD);

                    if (rndNum > this.TargetLowerLimit || rndNum < this.TargetUpperLimit) {
                        if (rndNum < BaseAdapter.DistrLowerLimit) {
                            rndNum = BaseAdapter.DistrLowerLimit;
                        }
                        else if (rndNum > BaseAdapter.DistrUpperLimit) {
                            rndNum = BaseAdapter.DistrUpperLimit;
                        }
                        break;
                    }
                }
                randNums[index] = rndNum;
            }
            // [SC] sorting lower and upper bounds of the core in an ascending order
            if (randNums[1] > randNums[2]) {
                let temp: number = randNums[1];
                randNums[1] = randNums[2];
                randNums[2] = temp;
            }

            // [SC] calculating probability that is the lower bound of the support in a fuzzy interval
            while (true) {
                rndNum = Misc.GetNormalOneSide(lower_distr_mean, this.TargetDistrSD, true);

                if (rndNum < randNums[1]) {
                    if (rndNum < BaseAdapter.DistrLowerLimit) {
                        rndNum = BaseAdapter.DistrLowerLimit;
                    }
                    break;
                }
            }
            randNums[0] = rndNum;

            // [SC] calculating probability that is the upper bound of the support in a fuzzy interval
            while (true) {
                rndNum = Misc.GetNormalOneSide(upper_distr_mean, this.TargetDistrSD, false);

                if (rndNum > randNums[2]) {
                    if (rndNum > BaseAdapter.DistrUpperLimit) {
                        rndNum = BaseAdapter.DistrUpperLimit;
                    }
                    break;
                }
            }
            randNums[3] = rndNum;

            // [SC] tralsating probability bounds of a fuzzy interval into a beta values
            let lowerLimitBeta: number = p_theta + Math.log((1.0 - randNums[3]) / randNums[3]);
            let minBeta: number = p_theta + Math.log((1.0 - randNums[2]) / randNums[2]); // [SC][2016.10.07] a modified version of the equation from the original data; better suits the data
            let maxBeta: number = p_theta + Math.log((1.0 - randNums[1]) / randNums[1]);
            let upperLimitBeta: number = p_theta + Math.log((1.0 - randNums[0]) / randNums[0]);

            return new Array(lowerLimitBeta, minBeta, maxBeta, upperLimitBeta);
        }

        /// <summary>
        /// Returns target difficulty rating given a skill rating.
        /// </summary>
        /// <param name="p_theta">Skill rating.</param>
        /// <returns>Difficulty rating.</returns>
        public TargetDifficultyRating(p_theta: number): number {
            return p_theta + Math.log((1.0 - this.TargetDistrMean) / this.TargetDistrMean);
        }

        ////// END: functions for calculating matching scenario
        //////////////////////////////////////////////////////////////////////////////////////

        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: functions for calculating expected and actual scores

        /// <summary>
        /// Calculates actual score given success/failure outcome and response time.
        /// </summary>
        ///
        /// <param name="p_correctAnswer">   should be either 0, for failure,
        ///                                         or 1 for success. </param>
        /// <param name="p_responseTime">    a response time in milliseconds. </param>validateResponseTime
        /// <param name="p_itemMaxDuration">  maximum duration of time given to a
        ///                                 player to provide an answer. </param>
        ///
        /// <returns>
        /// actual score as a double.
        /// </returns>
        public calcActualScore(p_correctAnswer: number, p_responseTime: number, p_itemMaxDuration: number): number {
            if (!(this.validateCorrectAnswer(p_correctAnswer)
                && this.validateResponseTime(p_responseTime)
                && this.validateItemMaxDuration(p_itemMaxDuration))) {

                this.log(AssetPackage.Severity.Error
                    , "In DifficultyAdapter.calcActualScore: Cannot calculate score."
                    + " Invalid parameter detected. Returning error code '" + BaseAdapter.ErrorCode + "'.");

                return BaseAdapter.ErrorCode;
            }

            // [SC][2017.01.03]
            if (p_responseTime > p_itemMaxDuration) {
                p_responseTime = p_itemMaxDuration;

                this.log(AssetPackage.Severity.Warning
                    , "In DifficultyAdapter.calcActualScore: Response time '" + p_responseTime
                    + "' exceeds the item's max time duration '" + p_itemMaxDuration
                    + "'. Setting the response time to item's max duration.");
            }

            let discrParam: number = this.getDiscriminationParam(p_itemMaxDuration);
            return (((2.0 * p_correctAnswer) - 1.0) * ((discrParam * p_itemMaxDuration) - (discrParam * p_responseTime)));
        }

        /// <summary>
        /// Calculates expected score given player's skill rating and item's
        /// difficulty rating.
        /// </summary>
        ///
        /// <param name="p_playerTheta">     player's skill rating. </param>
        /// <param name="p_itemBeta">        item's difficulty rating. </param>
        /// <param name="p_itemMaxDuration">  maximum duration of time given to a
        ///                                 player to provide an answer. </param>
        ///
        /// <returns>
        /// expected score as a double.
        /// </returns>
        public calcExpectedScore(p_playerTheta: number, p_itemBeta: number, p_itemMaxDuration: number): number {
            if (!this.validateItemMaxDuration(p_itemMaxDuration)) {
                this.log(AssetPackage.Severity.Error
                    , "In DifficultyAdapter.calcExpectedScore: Cannot calculate score."
                    + " Invalid parameter detected. Returning error code '" + BaseAdapter.ErrorCode + "'.");

                return BaseAdapter.ErrorCode;
            }

            let weight: number = this.getDiscriminationParam(p_itemMaxDuration) * p_itemMaxDuration;

            let ratingDifference: number = p_playerTheta - p_itemBeta; // [SC][2016.01.07]
            if (ratingDifference === 0) { // [SC][2016.01.07]
                ratingDifference = 0.001;
            }

            let expFctr: number = Math.exp(2.0 * weight * ratingDifference); // [SC][2016.01.07]

            return (weight * ((expFctr + 1.0) / (expFctr - 1.0))) - (1.0 / ratingDifference); // [SC][2016.01.07]
        }

        /// <summary>
        /// Calculates discrimination parameter a_i necessary to calculate expected
        /// and actual scores.
        /// </summary>
        ///
        /// <param name="p_itemMaxDuration">  maximum duration of time given to a
        ///                                 player to provide an answer; should be
        ///                                 player. </param>
        ///
        /// <returns>
        /// discrimination parameter a_i as double number.
        /// </returns>
        public getDiscriminationParam(p_itemMaxDuration: number): number {
            return 1.0 / p_itemMaxDuration;
        }

        ////// END: functions for calculating expected and actual scores
        //////////////////////////////////////////////////////////////////////////////////////

        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: functions for calculating rating uncertainties

        /// <summary>
        /// Calculates a new uncertainty for the theta rating.
        /// </summary>
        ///
        /// <param name="p_currThetaU">       current uncertainty value for theta
        ///                                 rating. </param>
        /// <param name="p_currDelayCount">   the current number of consecutive days
        ///                                 the player has not played. </param>
        ///
        /// <returns>
        /// a new uncertainty value for theta rating.
        /// </returns>
        public calcThetaUncertainty(p_currThetaU: number, p_currDelayCount: number): number {
            let newThetaU: number = p_currThetaU - (1.0 / this.MaxPlay) + (p_currDelayCount / this.MaxDelay);
            if (newThetaU < 0) {
                newThetaU = 0.0;
            }
            else if (newThetaU > 1) {
                newThetaU = 1.0;
            }
            return newThetaU;
        }

        /// <summary>
        /// Calculates a new uncertainty for the beta rating.
        /// </summary>
        ///
        /// <param name="p_currBetaU">        current uncertainty value for the beta
        ///                                 rating. </param>
        /// <param name="p_currDelayCount">   the current number of consecutive days
        ///                                 the item has not beein played. </param>
        ///
        /// <returns>
        /// a new uncertainty value for the beta rating.
        /// </returns>
        public calcBetaUncertainty(p_currBetaU: number, p_currDelayCount: number): number {
            let newBetaU: number = p_currBetaU - (1.0 / this.MaxPlay) + (p_currDelayCount / this.MaxDelay);
            if (newBetaU < 0) {
                newBetaU = 0.0;
            }
            else if (newBetaU > 1) {
                newBetaU = 1.0;
            }
            return newBetaU;
        }

        ////// END: functions for calculating rating uncertainties
        //////////////////////////////////////////////////////////////////////////////////////

        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: functions for calculating k factors

        /// <summary>
        /// Calculates a new K factor for theta rating
        /// </summary>
        ///
        /// <param name="p_currThetaU">   current uncertainty for the theta rating</param>
        /// <param name="p_currBetaU">    current uncertainty for the beta rating</param>
        /// 
        /// <returns>a double value of a new K factor for the theta rating</returns>
        public calcThetaKFctr(p_currThetaU: number, p_currBetaU: number): number {
            return this.KConst * (1.0 + (this.KUp * p_currThetaU) - (this.KDown * p_currBetaU));
        }

        /// <summary>
        /// Calculates a new K factor for the beta rating
        /// </summary>
        /// 
        /// <param name="p_currThetaU">   current uncertainty fot the theta rating</param>
        /// <param name="p_currBetaU">    current uncertainty for the beta rating</param>
        /// 
        /// <returns>a double value of a new K factor for the beta rating</returns>
        public calcBetaKFctr(p_currThetaU: number, p_currBetaU: number): number {
            return this.KConst * (1.0 + (this.KUp * p_currBetaU) - (this.KDown * p_currThetaU));
        }

        ////// END: functions for calculating k factors
        //////////////////////////////////////////////////////////////////////////////////////

        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: functions for calculating theta and beta ratings

        /// <summary>
        /// Calculates a new theta rating.
        /// </summary>
        ///
        /// <param name="p_currTheta">   current theta rating. </param>
        /// <param name="p_thetaKFctr">  K factor for the theta rating. </param>
        /// <param name="p_actualScore"> actual performance score. </param>
        /// <param name="p_expectScore"> expected performance score. </param>
        ///
        /// <returns>
        /// a double value for the new theta rating.
        /// </returns>
        public calcTheta(p_currTheta: number, p_thetaKFctr: number, p_actualScore: number, p_expectScore: number): number {
            return p_currTheta + (p_thetaKFctr * (p_actualScore - p_expectScore));
        }

        /// <summary>
        /// Calculates a new beta rating.
        /// </summary>
        ///
        /// <param name="p_currBeta">    current beta rating. </param>
        /// <param name="p_betaKFctr">   K factor for the beta rating. </param>
        /// <param name="p_actualScore"> actual performance score. </param>
        /// <param name="p_expectScore"> expected performance score. </param>
        ///
        /// <returns>
        /// a double value for new beta rating.
        /// </returns>
        public calcBeta(p_currBeta: number, p_betaKFctr: number, p_actualScore: number, p_expectScore: number): number {
            return p_currBeta + (p_betaKFctr * (p_expectScore - p_actualScore));
        }

        ////// END: functions for calculating theta and beta ratings
        //////////////////////////////////////////////////////////////////////////////////////

        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: tester functions

        /// <summary>
        /// Tests the validity of the value representing correctness of player's answer.
        /// </summary>
        /// 
        /// <param name="p_correctAnswer"> Player's answer. </param>
        /// 
        /// <returns>True if the value is valid</returns>
        public validateCorrectAnswer(p_correctAnswer: number): boolean { // [SC][2017.01.03]
            if (p_correctAnswer !== 0 && p_correctAnswer !== 1) {
                this.log(AssetPackage.Severity.Error
                    , "In DifficultyAdapter.validateCorrectAnswer: Accuracy should be either 0 or 1. "
                    + "Current value is '" + p_correctAnswer + "'.");

                return false;
            }

            return true;
        }

        /// <summary>
        /// Tests the validity of the value representing the response time.
        /// </summary>
        /// 
        /// <param name="p_responseTime">Response time in milliseconds</param>
        /// 
        /// <returns>True if the value is valid</returns>
        public validateResponseTime(p_responseTime: number): boolean {
            if (p_responseTime <= 0) {
                this.log(AssetPackage.Severity.Error
                    , "In DifficultyAdapter.validateResponseTime: Response time cannot be 0 or negative. "
                    + "Current value is '" + p_responseTime + "'.");

                return false;
            }

            return true;
        }

        /// <summary>
        /// Tests the validity of the value representing the max amount of time to respond.
        /// </summary>
        /// 
        /// <param name="p_itemMaxDuration">Time duration in mulliseconds</param>
        /// 
        /// <returns>True if the value is valid</returns>
        public validateItemMaxDuration(p_itemMaxDuration: number): boolean {
            if (p_itemMaxDuration <= 0) {
                this.log(AssetPackage.Severity.Error
                    , "In DifficultyAdapter.validateItemMaxDuration: Max playable duration cannot be 0 or negative. "
                        + "Current value is '" + p_itemMaxDuration + "'.");

                return false;
            }

            return true;
        }

        ////// END: tester functions
        //////////////////////////////////////////////////////////////////////////////////////
    }
}