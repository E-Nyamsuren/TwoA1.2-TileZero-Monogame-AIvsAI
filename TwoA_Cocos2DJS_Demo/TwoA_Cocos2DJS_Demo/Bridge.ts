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

/// <reference path="RageAssetManager/IBridge.ts"/>
/// <reference path="RageAssetManager/IDataStorage.ts"/>
/// <reference path="RageAssetManager/IDefaultSettings.ts"/>
/// <reference path="RageAssetManager/ILog.ts"/>
///

module TwoACocos2DDemo
{
    import IBridge = AssetPackage.IBridge;
    import IDataStorage = AssetPackage.IDataStorage;

    import IDefaultSettings = AssetPackage.IDefaultSettings;
    import ILog = AssetPackage.ILog;
    import Severity = AssetPackage.Severity;

    declare function ccLog(txt);
    declare function ccExists(fileID);
    declare function ccSave(fileID, fileData);
    declare function ccLoad(fileID);
    declare function ccDelete(fileID);
    declare function ccFiles();

    /// <summary>
    /// Export the Asset.
    /// </summary>
    export class Bridge implements IBridge, IDataStorage, IDefaultSettings, ILog
    {
        private DeriveAssetName(Class: string, Id: string): string {
            return Class + "AppSettings";
        }

        /// <summary>
        /// Determine if 'fileId' exists.
        /// </summary>
        ///
        /// <param name="fileId"> Identifier for the file. </param>
        ///
        /// <returns>
        /// true if it succeeds, false if it fails.
        /// </returns>
        Exists(fileId: string): boolean {
            return ccExists(fileId);
        }

        /// <summary>
        /// Loads the given file.
        /// </summary>
        ///
        /// <param name="fileId"> The file identifier to load. </param>
        ///
        /// <returns>
        /// A string.
        /// </returns>
        Load(fileId: string): string {
            return ccLoad(fileId);
        }

        /// <summary>
        /// Saves.
        /// </summary>
        ///
        /// <param name="fieldId">  Identifier for the field. </param>
        /// <param name="fileData"> Information describing the file. </param>
        ///
        /// <returns>
        /// .
        /// </returns>
        Save(fieldId: string, fileData: string): void {
            ccSave(fieldId, fileData);
        }

        /// <summary>
        /// Gets the files.
        /// </summary>
        ///
        /// <returns>
        /// A string[].
        /// </returns>
        Files(): string[] {
            return ccFiles();
        }

        /// <summary>
        /// Deletes the given fle.
        /// </summary>
        ///
        /// <param name="fileId">  Identifier for the field. </param>
        ///
        /// <returns>
        /// true if it succeeds, false if it fails.
        /// </returns>
        Delete(fileId: string): boolean {
            if (ccExists(fileId)) {
                ccDelete(fileId);
                return true;
            }
            return false;
        }

        /// <summary>
        /// Executes the log operation.
        /// 
        /// Implement this in Game Engine Code.
        /// </summary>
        ///
        /// <param name="msg"> The message. </param>
        Log(severity: Severity, msg: string): void {
            ccLog(severity + ": " + msg);
        }

        /// <summary>
        /// Query if 'Class' has default settings.
        /// </summary>
        ///
        /// <param name="Class"> The class. </param>
        /// <param name="Id">    The identifier. </param>
        ///
        /// <returns>
        /// true if default settings, false if not.
        /// </returns>
        HasDefaultSettings(Class: string, Id: string): boolean {
            // Note, a very simple implementation returning the same value for all classes!
            // [TODO]
            return true;
        }

        /// <summary>
        /// Loads default settings.
        /// </summary>
        ///
        /// <param name="Class"> The class. </param>
        /// <param name="Id">    The identifier. </param>
        ///
        /// <returns>
        /// The default settings.
        /// </returns>
        LoadDefaultSettings(Class: string, Id: string): string {
            // Note, a very simple implementation returning the same settings for all classes!
            // [TODO]
            return "";
        }

        /// <summary>
        /// Saves a default settings.
        /// </summary>
        ///
        /// <param name="Class">    The class. </param>
        /// <param name="Id">       The identifier. </param>
        /// <param name="fileData"> The file data. </param>
        SaveDefaultSettings(Class: string, Id: string, fileData: string): void {
            // [TODO]
        }
    }
}
