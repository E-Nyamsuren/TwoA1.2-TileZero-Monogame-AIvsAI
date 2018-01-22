var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/// <reference path="IBridge.ts"/>
/// <reference path="ISettings.ts"/>
/// <summary>
/// A Message Broadcast package.
/// </summary>
var MessagesPackage;
/// <summary>
/// A Message Broadcast package.
/// </summary>
(function (MessagesPackage) {
    /*
     * todo error checks on nil/undefined objects (as func in subscribers[len].func(message, parameters) ?).
     * todo add sender in broadcast (or is parameters enough)?
     * todo add some more bookkeeping (like list messages).
     * todo use the hash table from AssetManager instead (so rewrite this code)?
     *
     * done strongly typed all parameters and return types.
     */
    /// <summary>
    /// A static Broastcast Messages class.
    /// </summary>
    var Messages = /** @class */ (function () {
        function Messages() {
        }
        /// <summary>
        /// Defines a new Message.
        /// </summary>
        ///
        /// <param name="message"> The message. </param>
        ///
        /// <returns>
        /// true if newly defined, false if already defined.
        /// </returns>
        Messages.define = function (message) {
            if (!this.messages[message]) {
                this.messages[message] = [];
                return true;
            }
            return false;
        };
        Messages.broadcaster = function (message, subscribers, parameters) {
            //var subscribers = this.messages[message];
            var len = subscribers ? subscribers.length : 0;
            for (var subscriber in subscribers) {
                var tmp = subscribers[subscriber];
                if (tmp.func) {
                    tmp.func(message, parameters);
                }
                //! This code fails to compile in the latest TypeScript version ('func' not found on type string).
                // 
                //if (subscriber.func) {
                //    subscriber.func(message, parameters);
                //}
            }
        };
        /// <summary>
        /// Broadcast a message.
        /// </summary>
        ///
        /// <param name="message">    The message to broadcast. </param>
        /// <param name="parameters"> The (optional) arguments. </param>
        ///
        /// <returns>
        /// true if the message exists else false.
        /// </returns>
        Messages.broadcast = function (message, parameters) {
            if (!this.messages[message]) {
                return false;
            }
            setTimeout(this.broadcaster, 0, message, this.messages[message], parameters);
            //{
            //    broadcaster(
            //    var subscribers = this.messages[message];
            //    var len: number = subscribers ? subscribers.length : 0;
            //    for (var subscriber in subscribers) {
            //        var tmp: any = subscriber;
            //        if (tmp.func) {
            //            tmp.func(message, parameters);
            //        }
            //        //! This code fails to compile in the latest TypeScript version ('func' not found on type string).
            //        // 
            //        //if (subscriber.func) {
            //        //    subscriber.func(message, parameters);
            //        //}
            //    }
            //}, 0, message, this.messages[message]);
            return true;
        };
        /// <summary>
        /// Subscribe to a broadcast.
        /// </summary>
        ///
        /// <remarks>
        /// if the message does not exist yet it's created on-the-fly.
        /// </remarks>
        ///
        /// <param name="message">  The message. </param>
        /// <param name="callback"> The callback function. </param>
        ///
        /// <returns>
        /// the broadcast subscription id.
        /// </returns>
        Messages.subscribe = function (message, callback) {
            if (!this.messages[message]) {
                this.messages[message] = [];
            }
            /// <summary>
            /// Identifier for the subscription.
            /// </summary>
            var subscriptionId = (++this.idGenerator).toString();
            this.messages[message].push({
                token: subscriptionId,
                func: callback
            });
            return subscriptionId;
        };
        /// <summary>
        /// Unsubscribes the given broadcast subscription id.
        /// </summary>
        ///
        /// <param name="subscriptionId"> The broadcast subscription id. </param>
        ///
        /// <returns>
        /// true if unsubscribed else false.
        /// </returns>
        Messages.unsubscribe = function (subscriptionId) {
            for (var m in this.messages) {
                if (this.messages[m]) {
                    for (var i = 0, j = this.messages[m].length; i < j; i++) {
                        if (this.messages[m][i].token === subscriptionId) {
                            this.messages[m].splice(i, 1);
                            return true;
                        }
                    }
                }
            }
            return false;
        };
        /// <summary>
        /// The messages is a dictionary of lists (a list of subscribers per broadcast message).
        /// </summary>
        Messages.messages = {};
        /// <summary>
        /// The subscription ID generator.
        /// </summary>
        Messages.idGenerator = -1;
        return Messages;
    }());
    MessagesPackage.Messages = Messages;
})(MessagesPackage || (MessagesPackage = {}));
/// <summary>
/// A Dictionary class.
/// </summary>
var AssetManagerPackage;
/// <summary>
/// A Dictionary class.
/// </summary>
(function (AssetManagerPackage) {
    /// <summary>
    /// A simple Dictionary.
    /// </summary>
    var Dictionary = /** @class */ (function () {
        /// <summary>
        /// Initializes a new instance of the Dictionary class.
        /// </summary>
        function Dictionary() {
            this.keys_ = new Array();
            // Nothing
        }
        /// <summary>
        /// Adds key.
        /// </summary>
        ///
        /// <param name="key">   The key. </param>
        /// <param name="value"> The value. </param>
        ///
        /// <returns>
        /// .
        /// </returns>
        Dictionary.prototype.add = function (key, value) {
            this[key] = value;
            this.keys_.push(key);
        };
        /// <summary>
        /// Removes the given key.
        /// </summary>
        ///
        /// <param name="key"> The key to remove. </param>
        ///
        /// <returns>
        /// .
        /// </returns>
        Dictionary.prototype.remove = function (key) {
            var index = this.keys_.indexOf(key, 0);
            this.keys_.splice(index, 1);
            delete this[key];
        };
        Object.defineProperty(Dictionary.prototype, "keys", {
            /// <summary>
            /// Gets the keys.
            /// </summary>
            ///
            /// <returns>
            /// A string[].
            /// </returns>
            get: function () {
                var arr = new Array();
                for (var key in this.keys_) {
                    arr.push(this.keys_[key]);
                }
                return arr;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Dictionary.prototype, "values", {
            /// <summary>
            /// Gets the values.
            /// </summary>
            ///
            /// <returns>
            /// An any[].
            /// </returns>
            get: function () {
                var arr = new Array();
                for (var key in this.keys_) {
                    arr.push(this[key]);
                }
                return arr;
            },
            enumerable: true,
            configurable: true
        });
        /// <summary>
        /// Contains key.
        /// </summary>
        ///
        /// <param name="key"> The key. </param>
        ///
        /// <returns>
        /// .
        /// </returns>
        Dictionary.prototype.containsKey = function (key) {
            return (typeof this[key] === "undefined") ? false : true;
        };
        return Dictionary;
    }());
    AssetManagerPackage.Dictionary = Dictionary;
})(AssetManagerPackage || (AssetManagerPackage = {}));
/// <reference path='Dictionary.ts' />
var AssetPackage;
/// <reference path='Dictionary.ts' />
(function (AssetPackage) {
    var Version = /** @class */ (function () {
        /// <summary>
        /// Initializes a new instance of the version class.
        /// </summary>
        function Version(major, minor, build, revision, maturity) {
            /// <summary>
            /// The private major.
            /// </summary>
            this.Major = "0";
            /// <summary>
            /// The private minor.
            /// </summary>
            this.Minor = "0";
            /// <summary>
            /// The private build.
            /// </summary>
            this.Build = "0";
            /// <summary>
            /// The private revision.
            /// </summary>
            this.Revision = "0";
            /// <summary>
            /// The public maturity.
            /// </summary>
            this.Maturity = "";
            /// <summary>
            /// The public dependencies.
            /// </summary>
            this.Dependencies = [];
            this.Major = major;
            this.Minor = minor;
            this.Build = build;
            this.Revision = revision;
            this.Maturity = maturity;
            this.Dependencies = [];
            // this.Dependencies.push(new Dependency("Logger", "1.2.3", "*"));
            // Output of JSON.stringify(this)
            // {
            //        "Major":"1",
            //        "Minor":"0",
            //        "Revision":"15"
            //        "Build":"22",
            //        "Revision":"15"
            //        "Maturity":"Alpha"
            //        "Dependencies":[
            //          {"Class":"Logger","minVersion":"1.2.3","maxVersion":"*"}
            //          ]
            // }
            // console.log(JSON.stringify(this));
        }
        return Version;
    }());
    AssetPackage.Version = Version;
    /// <summary>
    /// A dependency.
    /// </summary>
    var Dependency = /** @class */ (function () {
        /// <summary>
        /// Initializes a new instance of the version class.
        /// </summary>
        ///
        /// <param name="Class">      The class. </param>
        /// <param name="minVersion"> The minimum version. </param>
        /// <param name="maxVersion"> The maximum version. </param>
        function Dependency(Class, minVersion, maxVersion) {
            /// <summary>
            /// The public class.
            /// </summary>
            this.Class = "";
            /// <summary>
            /// The public minimum version.
            /// </summary>
            this.minVersion = "";
            /// <summary>
            /// The public maximum version.
            /// </summary>
            this.maxVersion = "";
            this.Class = Class;
            this.minVersion = minVersion;
            this.maxVersion = maxVersion;
        }
        Object.defineProperty(Dependency.prototype, "versionRange", {
            /// <summary>
            /// Version range.
            /// </summary>
            ///
            /// <returns>
            /// A string.
            /// </returns>
            get: function () {
                var minV = this.isEmpty(this.minVersion) ? "0.0" : this.minVersion;
                var maxV = this.isEmpty(this.maxVersion) ? "*" : this.maxVersion;
                return minV + "-" + maxV;
            },
            enumerable: true,
            configurable: true
        });
        ;
        /// <summary>
        /// Query if 'str' is empty.
        /// </summary>
        ///
        /// <param name="str"> The string. </param>
        ///
        /// <returns>
        /// true if empty, false if not.
        /// </returns>
        Dependency.prototype.isEmpty = function (str) {
            return (!str || 0 === str.length);
        };
        return Dependency;
    }());
    AssetPackage.Dependency = Dependency;
})(AssetPackage || (AssetPackage = {}));
/// <reference path='IAsset.ts' />
/// <reference path='IBridge.ts' />
/// <reference path='Messages.ts' />
/// <reference path='Dictionary.ts' />
/// <reference path='Version.ts' />
/// <summary>
/// An asset manager package.
/// 
/// Note this package has to be setup to 
/// 1) combine code into a single js file,   
/// 2) redirect output the the proof-of concept project  
/// 3) generated declaration files.  
/// </summary>
var AssetManagerPackage;
/// <reference path='IAsset.ts' />
/// <reference path='IBridge.ts' />
/// <reference path='Messages.ts' />
/// <reference path='Dictionary.ts' />
/// <reference path='Version.ts' />
/// <summary>
/// An asset manager package.
/// 
/// Note this package has to be setup to 
/// 1) combine code into a single js file,   
/// 2) redirect output the the proof-of concept project  
/// 3) generated declaration files.  
/// </summary>
(function (AssetManagerPackage) {
    var Dictionary = AssetManagerPackage.Dictionary;
    /// <summary>
    /// Export the AssetManager.
    /// </summary>
    var AssetManager = /** @class */ (function () {
        /// <summary>
        /// Initializes a new instance of the AssetManager class.
        /// </summary>
        function AssetManager() {
            /// <summary>
            /// User to generate uniqueId's for registered assets.
            /// </summary>
            this.idGenerator = 0;
            /// <summary>
            /// The assets dictionary (id = object).
            /// </summary>
            this.assets = new Dictionary();
            if (AssetManager._instance) {
                throw new Error("Error: Instantiation failed: Use AssetManager.getInstance() instead of new.");
            }
            AssetManager._instance = this;
        }
        Object.defineProperty(AssetManager, "Instance", {
            /// <summary>
            /// Gets the singleton instance.
            /// </summary>
            ///
            /// <returns>
            /// An AssetManager.
            /// </returns>
            get: function () {
                if (AssetManager._instance === null) {
                    AssetManager._instance = new AssetManager();
                }
                return AssetManager._instance;
            },
            enumerable: true,
            configurable: true
        });
        /// <summary>
        /// Registers the asset instance.
        /// </summary>
        ///
        /// <param name="asset"> The asset. </param>
        /// <param name="claz">  The claz. </param>
        ///
        /// <returns>
        /// .
        /// </returns>
        AssetManager.prototype.registerAssetInstance = function (asset, claz) {
            var keys = this.assets.keys;
            for (var i = 0; i < keys.length; i++) {
                if (this.assets[keys[i]] === asset) {
                    return keys[i];
                }
            }
            var Id = claz + "_" + (this.idGenerator++).toString(); //assets.length
            this.assets.add(Id, asset);
            return Id;
        };
        /// <summary>
        /// Returns the exact match.
        /// </summary>
        ///
        /// <param name="id"> The identifier. </param>
        ///
        /// <returns>
        /// The found asset by identifier.
        /// </returns>
        AssetManager.prototype.findAssetById = function (id) {
            return this.assets[id];
        };
        /// <summary>
        /// Returns the first match.
        /// </summary>
        ///
        /// <param name="claz"> The claz. </param>
        ///
        /// <returns>
        /// The found asset by class.
        /// </returns>
        AssetManager.prototype.findAssetByClass = function (claz) {
            var keys = this.assets.keys;
            for (var i = 0; i < keys.length; i++) {
                if (keys[i].indexOf(claz + "_") == 0) {
                    return this.assets[keys[i]];
                }
            }
            return null;
        };
        /// <summary>
        /// Searches for the first assets by class.
        /// </summary>
        ///
        /// <param name="claz"> The claz. </param>
        ///
        /// <returns>
        /// The found assets by class.
        /// </returns>
        AssetManager.prototype.findAssetsByClass = function (claz) {
            var keys = this.assets.keys;
            var results = [];
            for (var i = 0; i < keys.length; i++) {
                if (keys[i].indexOf(claz + "_") == 0) {
                    results.push(this.assets[keys[i]]);
                }
            }
            return results;
        };
        Object.defineProperty(AssetManager.prototype, "Bridge", {
            /// <summary>
            /// Gets the bridge.
            /// </summary>
            ///
            /// <returns>
            /// A get.
            /// </returns>
            get: function () {
                return this._bridge;
            },
            /// <summary>
            /// Bridges the given value.
            /// </summary>
            ///
            /// <param name="val"> The value. </param>
            ///
            /// <returns>
            /// A set.
            /// </returns>
            set: function (val) {
                this._bridge = val;
            },
            enumerable: true,
            configurable: true
        });
        /// <summary>
        /// Pads String Left or Right with spaces.
        /// </summary>
        ///
        /// <param name="str">     The string to pad. </param>
        /// <param name="pad">     The padding length. </param>
        /// <param name="padLeft"> true to pad left. </param>
        ///
        /// <returns>
        /// A string.
        /// </returns>
        AssetManager.prototype.pad = function (str, pad, padLeft) {
            return this.padc(str, pad, ' ', padLeft);
        };
        /// <summary>
        /// Pads String Left or Right with a character.
        /// </summary>
        ///
        /// <param name="str">     The string to pad. </param>
        /// <param name="pad">     The padding length. </param>
        /// <param name="padwith"> The padding character. </param>
        /// <param name="padLeft"> true to pad left. </param>
        ///
        /// <returns>
        /// A string.
        /// </returns>
        AssetManager.prototype.padc = function (str, pad, padwith, padLeft) {
            var padding = Array(pad).join(padwith);
            if (typeof str === 'undefined')
                return padding;
            if (padLeft) {
                return (padding + str).slice(-padding.length);
            }
            else {
                return (str + padding).substring(0, padding.length);
            }
        };
        Object.defineProperty(AssetManager.prototype, "VersionAndDependenciesReport", {
            /// <summary>
            /// Version and dependencies report.
            /// </summary>
            ///
            /// <returns>
            /// A string.
            /// </returns>
            get: function () {
                var col1w = 40;
                var col2w = 32;
                var report = "";
                report += this.pad("Asset", col1w, false);
                report += "Depends on";
                report += "\r\n";
                report += this.padc("", col1w - 1, "-", false);
                report += "+";
                report += this.padc("", col2w, "-", false);
                report += "\r\n";
                var keys = this.assets.keys;
                for (var i = 0; i < keys.length; i++) {
                    var key = keys[i];
                    var asset = this.assets[key];
                    report += this.pad(asset.Class + " v" + asset.Version, col1w - 1, false);
                    var cnt = 0;
                    for (var j = 0; j < asset.Dependencies.length; j++) {
                        var dependency = asset.Dependencies[j];
                        //! Better version matches (see Microsoft).
                        // 
                        //! https://msdn.microsoft.com/en-us/library/system.version(v=vs.110).aspx
                        //
                        //! dependency.value has min-max format (inclusive) like:
                        // 
                        //? v1.2.3-*        (v1.2.3 or higher)
                        //? v0.0-*          (all versions)
                        //? v1.2.3-v2.2     (v1.2.3 or higher less than or equal to v2.1)
                        //
                        var vrange = dependency.versionRange.split('-');
                        var low;
                        var hi;
                        switch (vrange.length) {
                            case 1:
                                low = vrange[0].split('.');
                                hi = low;
                                break;
                            case 2:
                                low = vrange[0].split('.');
                                if (vrange[1] === "*") {
                                    hi = "255.255".split('.');
                                }
                                else {
                                    hi = vrange[1].split('.');
                                }
                                break;
                            default:
                                break;
                        }
                        var found = false;
                        if (low != null) {
                            var foundAssets = this.findAssetsByClass(dependency.Class);
                            for (var dep in foundAssets) {
                                var asset = foundAssets[dep];
                                var av = asset.Version.split('.');
                                var loOk = true;
                                for (var i = 0; i < low.length; i++) {
                                    if (av.length < i + 1) {
                                        break;
                                    }
                                    if (low[i] == "*") {
                                        break;
                                    }
                                    else if (av[i] < low[i]) {
                                        loOk = false;
                                        break;
                                    }
                                }
                                var hiOk = true;
                                for (var i = 0; i < hi.length; i++) {
                                    if (av.length < i + 1) {
                                        break;
                                    }
                                    if (hi[i] == "*") {
                                        break;
                                    }
                                    else if (av[i] > hi[i]) {
                                        hiOk = false;
                                        break;
                                    }
                                }
                                found = loOk && hiOk;
                            }
                            report += "|" + dependency.Class + " v" + dependency.versionRange + " [" + (found ? "resolved" : "missing") + "]";
                            report += "\r\n";
                        }
                        else {
                            report += "error";
                            report += "\r\n";
                        }
                        if (j < asset.Dependencies.length - 1) {
                            report += this.pad("", col1w - 1, false);
                        }
                        cnt++;
                    }
                    if (cnt == 0) {
                        report += "|No dependencies";
                        report += "\r\n";
                    }
                }
                report += this.padc("", col1w - 1, "-", false);
                report += "+";
                report += this.padc("", col2w, "-", false);
                report += "\r\n";
                return report;
            },
            enumerable: true,
            configurable: true
        });
        AssetManager._instance = null;
        return AssetManager;
    }());
    AssetManagerPackage.AssetManager = AssetManager;
})(AssetManagerPackage || (AssetManagerPackage = {}));
var AssetPackage;
(function (AssetPackage) {
    /// <summary>
    /// Values that represent log severity.
    /// <br/>
    ///      See
    /// <a href="https://msdn.microsoft.com/en-us/library/office/ff604025(v=office.14).aspx">Trace
    /// and Event Log Severity Levels</a>
    /// </summary>
    var Severity;
    (function (Severity) {
        /// <summary>
        /// An enum constant representing the critical option.
        /// </summary>
        Severity[Severity["Critical"] = 1] = "Critical";
        /// <summary>
        /// An enum constant representing the error option.
        /// </summary>
        Severity[Severity["Error"] = 2] = "Error";
        /// <summary>
        /// An enum constant representing the warning option.
        /// </summary>
        Severity[Severity["Warning"] = 4] = "Warning";
        /// <summary>
        /// An enum constant representing the information option.
        /// </summary>
        Severity[Severity["Information"] = 8] = "Information";
        /// <summary>
        /// An enum constant representing the verbose option.
        /// </summary>
        Severity[Severity["Verbose"] = 16] = "Verbose";
    })(Severity = AssetPackage.Severity || (AssetPackage.Severity = {}));
    var LogLevel;
    (function (LogLevel) {
        /// <summary>
        /// An enum constant representing the critical option.
        /// </summary>
        LogLevel[LogLevel["Critical"] = 1] = "Critical";
        /// <summary>
        /// An enum constant representing the error option.
        /// </summary>
        LogLevel[LogLevel["Error"] = 3] = "Error";
        /// <summary>
        /// An enum constant representing the warning option.
        /// </summary>
        LogLevel[LogLevel["Warn"] = 7] = "Warn";
        /// <summary>
        /// An enum constant representing the information option.
        /// </summary>
        LogLevel[LogLevel["Info"] = 15] = "Info";
        /// <summary>
        /// An enum constant representing all option.
        /// </summary>
        LogLevel[LogLevel["All"] = 31] = "All";
    })(LogLevel = AssetPackage.LogLevel || (AssetPackage.LogLevel = {}));
})(AssetPackage || (AssetPackage = {}));
/// <reference path="AssetManager.ts"/>
/// <reference path="IAsset.ts"/>
/// <reference path="IBridge.ts"/>
/// <reference path="IDataStorage.ts"/>
/// <reference path="IDefaultSettings.ts"/>
/// <reference path="ILog.ts"/>
/// <reference path="Version.ts"/>
///
var AssetPackage;
/// <reference path="AssetManager.ts"/>
/// <reference path="IAsset.ts"/>
/// <reference path="IBridge.ts"/>
/// <reference path="IDataStorage.ts"/>
/// <reference path="IDefaultSettings.ts"/>
/// <reference path="ILog.ts"/>
/// <reference path="Version.ts"/>
///
(function (AssetPackage) {
    var AssetManager = AssetManagerPackage.AssetManager;
    /// <summary>
    /// Export the Asset.
    /// </summary>
    var BaseAsset = /** @class */ (function () {
        /// <summary>
        /// Initializes a new instance of the Asset class.
        /// Sets the ClassName property/
        /// </summary>
        function BaseAsset() {
            /// <summary>
            /// Information describing the protected version.
            /// </summary>
            /// 
            /// <remarks>
            /// Commas after the last member and \r\n are not allowed.
            /// </remarks>
            this.versionInfo = '{' +
                '  "Major":"1", ' +
                '  "Minor":"2", ' +
                '  "Build":"3" ' +
                '}';
            /// <summary>
            /// Manager for asset.
            /// 
            /// Note: should be protected (ie. only visible in derived assets).
            /// </summary>
            this.assetManager = AssetManager.Instance;
            this._sId = "";
            this._sClass = "";
            var funcNameRegex = /function (.{1,})\(/;
            var code = (this).constructor.toString();
            var results = (funcNameRegex).exec(code);
            this._sClass = (results && results.length > 1) ? results[1] : "";
            this.setId(this.assetManager.registerAssetInstance(this, this.Class));
        }
        Object.defineProperty(BaseAsset.prototype, "Class", {
            /// <summary>
            /// Gets the class.
            /// </summary>
            ///
            /// <returns>
            /// A string.
            /// </returns>
            get: function () {
                return this._sClass;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseAsset.prototype, "Id", {
            /// <summary>
            /// Gets the identifier.
            /// </summary>
            ///
            /// <returns>
            /// A string.
            /// </returns>
            get: function () {
                return this._sId;
            },
            enumerable: true,
            configurable: true
        });
        /// <summary>
        /// Sets an identifier.
        /// </summary>
        ///
        /// <param name="id"> The identifier. </param>
        ///
        /// <returns>
        /// .
        /// </returns>
        BaseAsset.prototype.setId = function (id) {
            if (this._sId.length == 0) {
                this._sId = id;
            }
        };
        Object.defineProperty(BaseAsset.prototype, "Version", {
            /// <summary>
            /// Gets the version.
            /// </summary>
            ///
            /// <returns>
            /// A string.
            /// </returns>
            get: function () {
                var _version = JSON.parse(this.versionInfo);
                return _version.Major + "." + _version.Minor + "." + _version.Build +
                    (this.isEmpty(_version.Revision) ? "" : "." + _version.Revision);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseAsset.prototype, "Maturity", {
            /// <summary>
            /// Gets the maturity.
            /// </summary>
            ///
            /// <returns>
            /// A string.
            /// </returns>
            get: function () {
                var _version = JSON.parse(this.versionInfo);
                return _version.Maturity;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseAsset.prototype, "Dependencies", {
            /// <summary>
            /// The dependencies.
            /// </summary>
            get: function () {
                var _version = JSON.parse(this.versionInfo);
                // Fixup for missing versionRange property/method in Dependency by re-creating them properly.
                if (_version.Dependencies) {
                    for (var j = 0; j < _version.Dependencies.length; j++) {
                        var _dep = _version.Dependencies[j];
                        _version.Dependencies[j] = new AssetPackage.Dependency(_dep.Class, _dep.minVersion, _dep.maxVersion);
                    }
                    return _version.Dependencies;
                }
                else {
                    return [];
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseAsset.prototype, "Bridge", {
            /// <summary>
            /// Gets the bridge.
            /// </summary>
            ///
            /// <returns>
            /// A get.
            /// </returns>
            get: function () {
                return this._bridge;
            },
            /// <summary>
            /// Bridges the given value.
            /// </summary>
            ///
            /// <param name="val"> The value. </param>
            ///
            /// <returns>
            /// A set.
            /// </returns>
            set: function (val) {
                this._bridge = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseAsset.prototype, "Settings", {
            /// <summary>
            /// Gets the settings.
            /// </summary>
            ///
            /// <returns>
            /// The ISettings.
            /// </returns>
            get: function () {
                return this._settings;
            },
            /// <summary>
            /// Settings the given value.
            /// </summary>
            ///
            /// <param name="val"> The value. </param>
            ///
            /// <returns>
            /// A set.
            /// </returns>
            set: function (val) {
                this._settings = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseAsset.prototype, "hasSettings", {
            /// <summary>
            /// Query if this object has settings.
            /// </summary>
            ///
            /// <returns>
            /// true if settings, false if not.
            /// </returns>
            get: function () {
                return this.Settings != null;
            },
            enumerable: true,
            configurable: true
        });
        /// <summary>
        /// Loads default settings.
        /// </summary>
        ///
        /// <returns>
        /// true if it succeeds, false if it fails.
        /// </returns>
        BaseAsset.prototype.LoadDefaultSettings = function () {
            var ds = this.getInterfaceMethod("LoadDefaultSettings");
            if (ds && this.hasSettings && ds.HasDefaultSettings(this.Class, this.Id)) {
                var Json = ds.LoadDefaultSettings(this.Class, this.Id);
                this.Settings = JSON.parse(Json);
                return true;
            }
            return false;
        };
        /// <summary>
        /// Loads the settings.
        /// </summary>
        ///
        /// <param name="filename"> Filename of the file. </param>
        ///
        /// <returns>
        /// true if it succeeds, false if it fails.
        /// </returns>
        BaseAsset.prototype.LoadSettings = function (filename) {
            var ds = this.getInterfaceMethod("Load");
            if (ds) {
                // TODO TEST CODE
                // this.Settings = JSON.parse("[1, 2, 3, 4]");
                // ds.Save(filename, JSON.stringify(this.Settings));
                var json = ds.Load(filename);
                this.Settings = JSON.parse(json);
                return true;
            }
            return false;
        };
        /// <summary>
        /// Saves the default settings.
        /// </summary>
        ///
        /// <returns>
        /// true if it succeeds, false if it fails.
        /// </returns>
        BaseAsset.prototype.SaveDefaultSettings = function (force) {
            var ds = this.getInterfaceMethod("SaveDefaultSettings");
            if (ds && this.hasSettings && (force || !ds.HasDefaultSettings(this.Class, this.Id))) {
                ds.SaveDefaultSettings(this.Class, this.Id, JSON.stringify(this.Settings));
                return true;
            }
            return false;
        };
        /// <summary>
        /// Saves the settings.
        /// </summary>
        ///
        /// <param name="filename"> Filename of the file. </param>
        ///
        /// <returns>
        /// true if it succeeds, false if it fails.
        /// </returns>
        BaseAsset.prototype.SaveSettings = function (filename) {
            var ds = this.getInterfaceMethod("Save");
            if (ds) {
                ds.Save(filename, JSON.stringify(this.Settings));
                return true;
            }
            return false;
        };
        /// <summary>
        /// Settings from JSON.
        /// </summary>
        ///
        /// <param name="json"> The JSON. </param>
        ///
        /// <returns>
        /// The ISettings.
        /// </returns>
        BaseAsset.prototype.SettingsFromJson = function (json) {
            // TODO Test
            // 
            return JSON.parse(json);
        };
        /// <summary>
        /// Settings to JSON.
        /// </summary>
        ///
        /// <returns>
        /// A string.
        /// </returns>
        BaseAsset.prototype.SettingsToJson = function () {
            // TODO Test
            // 
            return JSON.stringify(this.Settings);
        };
        /// <summary>
        /// Logs.
        /// </summary>
        ///
        /// <param name="severity"> The severity. </param>
        /// <param name="format">   Describes the format to use. </param>
        /// <param name="args">     A variable-length parameters list containing
        ///                         arguments. </param>
        BaseAsset.prototype.Log = function (severity, format) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            var ds = this.getInterfaceMethod("Log");
            if (ds != null) {
                var result = format;
                for (var i = 0; i < args.length; i++) {
                    result = result.replace("{" + i + "}", args[i]);
                }
                //this.Log(severity, result);
                ds.Log(severity, result);
            }
        };
        ///// <summary>
        ///// Logs.
        ///// </summary>
        /////
        ///// <param name="severity"> The severity. </param>
        ///// <param name="msg">      The message. </param>
        //public Log(severity: Severity, msg: string): void {
        //    var ds: ILog = this.getInterfaceMethod("Log");
        //    if (ds != null) {
        //        ds.Log(severity, msg);
        //    }
        //}
        /// <summary>
        /// Gets the methods.
        /// </summary>
        ///
        /// <param name="obj"> The object. </param>
        ///
        /// <returns>
        /// An array of any.
        /// </returns>
        BaseAsset.prototype.getMethods = function (obj) {
            var methods = [];
            // console.log("Methods:");
            for (var m in obj) {
                if (typeof obj[m] == "function") {
                    // console.log(m);
                    methods.push(m);
                }
            }
            return methods;
        };
        /// <summary>
        /// Gets interface method.
        /// </summary>
        ///
        /// <param name="methodName"> Name of the method. </param>
        ///
        /// <returns>
        /// The interface method.
        /// </returns>
        BaseAsset.prototype.getInterfaceMethod = function (methodName) {
            //var methods: any[] = this.getMethods(new T());
            if (this.Bridge != null) {
                // Check if method is present on Asset Bridge!
                // 
                var methods = this.getMethods(this.Bridge);
                for (var m in methods) {
                    // console.log(methods[m]);
                    if (methods[m] == methodName &&
                        (eval("typeof this.Bridge." + methodName) === 'function')) {
                        return this.Bridge;
                    }
                }
            }
            else if (AssetManager.Instance.Bridge != null) {
                // Check if method is present on AssetManager Bridge!
                // 
                var methods = this.getMethods(AssetManager.Instance.Bridge);
                for (var m in methods) {
                    // console.log(methods[m]);
                    if (methods[m] == methodName &&
                        (eval("typeof AssetManager.Instance.Bridge." + methodName) === 'function')) {
                        return AssetManager.Instance.Bridge;
                    }
                }
            }
            return null;
        };
        /// <summary>
        /// Query if 'str' is empty.
        /// </summary>
        ///
        /// <param name="str"> The string. </param>
        ///
        /// <returns>
        /// true if empty, false if not.
        /// </returns>
        BaseAsset.prototype.isEmpty = function (str) {
            return (!str || 0 === str.length);
        };
        return BaseAsset;
    }());
    AssetPackage.BaseAsset = BaseAsset;
})(AssetPackage || (AssetPackage = {}));
/// Copyright 2018
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
var Misc;
/// Copyright 2018
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
(function (Misc) {
    function IsNullOrEmpty(p_string) {
        if (typeof p_string !== 'undefined' && p_string) {
            return false;
        }
        else {
            return true;
        }
    }
    Misc.IsNullOrEmpty = IsNullOrEmpty;
    // [SC] returns a random integer between [p_min, p_max]
    function GetRandomInt(p_min, p_max) {
        //return p_min + Math.round(Math.random() * (p_max - p_min));
        return Math.floor(Math.random() * (p_max - p_min + 1) + p_min);
    }
    Misc.GetRandomInt = GetRandomInt;
    function DaysElapsed(p_pastDateStr) {
        // The number of milliseconds in one day
        var ONE_DAY = 1000 * 60 * 60 * 24;
        // Convert both dates to milliseconds
        var date1_ms = new Date().getTime();
        var date2_ms = Date.parse(p_pastDateStr);
        // Calculate the difference in milliseconds
        var difference_ms = Math.abs(date1_ms - date2_ms);
        // Convert back to days and return
        return Math.round(difference_ms / ONE_DAY);
    }
    Misc.DaysElapsed = DaysElapsed;
    function GetDateStr() {
        return new Date().toJSON().slice(0, 19);
    }
    Misc.GetDateStr = GetDateStr;
    function GetNormal(p_mean, p_stdev) {
        var y2;
        var use_last = false;
        var y1;
        if (use_last) {
            y1 = y2;
            use_last = false;
        }
        else {
            var x1 = void 0, x2 = void 0, w = void 0;
            do {
                x1 = 2.0 * Math.random() - 1.0;
                x2 = 2.0 * Math.random() - 1.0;
                w = x1 * x1 + x2 * x2;
            } while (w >= 1.0);
            w = Math.sqrt((-2.0 * Math.log(w)) / w);
            y1 = x1 * w;
            y2 = x2 * w;
            use_last = true;
        }
        var retval = p_mean + p_stdev * y1;
        if (retval > 0) {
            return retval;
        }
        return -retval;
    }
    Misc.GetNormal = GetNormal;
    function GetNormalOneSide(p_mean, p_stdev, p_left) {
        var value = GetNormal(p_mean, p_stdev);
        if (p_left && value > p_mean) {
            value = p_mean - (value - p_mean);
        }
        else if (!p_left && value < p_mean) {
            value = p_mean + (p_mean - value);
        }
        return value;
    }
    Misc.GetNormalOneSide = GetNormalOneSide;
})(Misc || (Misc = {}));
/// Copyright 2018
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
/// <reference path="TwoA.ts"/>
/// <reference path="Misc.ts"/>
///
var TwoAPackage;
/// Copyright 2018
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
/// <reference path="TwoA.ts"/>
/// <reference path="Misc.ts"/>
///
(function (TwoAPackage) {
    var BaseAdapter = /** @class */ (function () {
        ////// END: properties
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: constructor
        function BaseAdapter() {
        }
        Object.defineProperty(BaseAdapter, "Type", {
            ////// END: fields
            //////////////////////////////////////////////////////////////////////////////////////
            //////////////////////////////////////////////////////////////////////////////////////
            ////// START: properties
            /// <summary>
            /// Gets the type of the adapter; It needs to be overriden by inheriting classes
            /// </summary>
            get: function () {
                return BaseAdapter.UNASSIGNED_TYPE;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseAdapter, "Description", {
            /// <summary>
            /// Description of this adapter. It needs to be overriden by inheriting classes
            /// </summary>
            get: function () {
                return BaseAdapter.UNASSIGNED_TYPE;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseAdapter, "ErrorCode", {
            /// <summary>
            /// Getter for a code indicating error. 
            /// </summary>
            get: function () {
                return BaseAdapter.ERROR_CODE;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseAdapter, "DistrLowerLimit", {
            /// <summary>
            /// Lower limit of a normal distribution with mean in interval (0, 1)
            /// </summary>
            get: function () {
                return BaseAdapter.DISTR_LOWER_LIMIT;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseAdapter, "DistrUpperLimit", {
            /// <summary>
            /// Upper limit of a normal distribution with mean in interval (0,1)
            /// </summary>
            get: function () {
                return BaseAdapter.DISTR_UPPER_LIMIT;
            },
            enumerable: true,
            configurable: true
        });
        BaseAdapter.prototype.InitSettings = function (p_asset) {
            this.asset = p_asset; // [ASSET]
        };
        ////// END: constructor
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: misc methods
        /// <summary>
        /// Logs a message using assets's Log method
        /// </summary>
        /// 
        /// <param name="severity"> Message type</param>
        /// <param name="msg">      A message to be logged</param>
        BaseAdapter.prototype.log = function (severity, msg) {
            if (typeof this.asset !== 'undefined' && this.asset !== null) {
                this.asset.Log(severity, msg);
            }
        };
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: const fields
        BaseAdapter.MIN_K_FCT = 0.0075;
        BaseAdapter.INITIAL_K_FCT = 0.0375; // [SC] FIDE range for K 40 for new players until 30 completed games, or as long as their rating remains under 2300; K = 20, for players with a rating always under 2400; K = 10, for players with any published rating of at least 2400 and at least 30 games played in previous events. Thereafter it remains permanently at 10.
        BaseAdapter.INITIAL_RATING = 0.01;
        BaseAdapter.INITIAL_UNCERTAINTY = 1.0;
        BaseAdapter.DEFAULT_TIME_LIMIT = 90000; // [SC] in milliseconds
        BaseAdapter.DEFAULT_DATETIME = "2015-07-22T11:56:17";
        BaseAdapter.UNASSIGNED_TYPE = "UNASSIGNED"; // [SC] any adapter should have a Type unique among adapters oof TwoA
        BaseAdapter.ERROR_CODE = -9999;
        BaseAdapter.DISTR_LOWER_LIMIT = 0.001; // [SC] lower limit of any probability value
        BaseAdapter.DISTR_UPPER_LIMIT = 0.999; // [SC] upper limit of any probability value
        return BaseAdapter;
    }());
    TwoAPackage.BaseAdapter = BaseAdapter;
})(TwoAPackage || (TwoAPackage = {}));
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
/// <reference path="Misc.ts"/>
///
var TwoAPackage;
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
/// <reference path="Misc.ts"/>
///
(function (TwoAPackage) {
    /// <summary>
    /// The Player node
    /// </summary>
    var PlayerNode = /** @class */ (function () {
        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="p_adaptID">Adaptation ID</param>
        /// <param name="p_gameID">Game ID</param>
        /// <param name="p_playerID">Player ID</param>
        function PlayerNode(p_adaptID, p_gameID, p_playerID) {
            this.rating = TwoAPackage.BaseAdapter.INITIAL_RATING;
            this.playCount = 0;
            this.kFct = TwoAPackage.BaseAdapter.INITIAL_K_FCT;
            this.uncertainty = TwoAPackage.BaseAdapter.INITIAL_UNCERTAINTY;
            this.lastPlayed = Misc.GetDateStr();
            this.AdaptationID = p_adaptID;
            this.GameID = p_gameID;
            this.PlayerID = p_playerID;
        }
        Object.defineProperty(PlayerNode.prototype, "AdaptationID", {
            /// <summary>
            /// Identifier for the Adaptation node.
            /// </summary>
            get: function () {
                return this.adaptID;
            },
            set: function (p_adaptID) {
                if (!Misc.IsNullOrEmpty(p_adaptID)) {
                    this.adaptID = p_adaptID;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerNode.prototype, "GameID", {
            /// <summary>
            /// Identifier for the Game node.
            /// </summary>
            get: function () {
                return this.gameID;
            },
            set: function (p_gameID) {
                if (!Misc.IsNullOrEmpty(p_gameID)) {
                    this.gameID = p_gameID;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerNode.prototype, "PlayerID", {
            /// <summary>
            /// Identifier for the Player node.
            /// </summary>
            get: function () {
                return this.playerID;
            },
            set: function (p_playerID) {
                if (!Misc.IsNullOrEmpty(p_playerID)) {
                    this.playerID = p_playerID;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerNode.prototype, "Rating", {
            /// <summary>
            /// Player rating
            /// </summary
            get: function () {
                return this.rating;
            },
            set: function (p_rating) {
                this.rating = p_rating;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerNode.prototype, "PlayCount", {
            /// <summary>
            /// Number of times the player played any scenario.
            /// </summary>
            get: function () {
                return this.playCount;
            },
            set: function (p_playCount) {
                if (p_playCount >= 0) {
                    this.playCount = p_playCount;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerNode.prototype, "KFactor", {
            /// <summary>
            /// Player's K factor.
            /// </summary>
            get: function () {
                return this.kFct;
            },
            set: function (p_kFct) {
                if (p_kFct > 0) {
                    this.kFct = p_kFct;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerNode.prototype, "Uncertainty", {
            /// <summary>
            /// Uncertainty in player's rating.
            /// </summary>
            get: function () {
                return this.uncertainty;
            },
            set: function (p_uncertainty) {
                if (p_uncertainty >= 0 && p_uncertainty <= 1) {
                    this.uncertainty = p_uncertainty;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerNode.prototype, "LastPlayed", {
            /// <summary>
            /// Last time the player played.
            /// </summary>
            get: function () {
                return this.lastPlayed;
            },
            set: function (p_lastPlayed) {
                if (!Misc.IsNullOrEmpty(p_lastPlayed)) {
                    this.lastPlayed = p_lastPlayed;
                }
            },
            enumerable: true,
            configurable: true
        });
        /// <summary>
        /// Makes a shallow clone of this instance.
        /// </summary>
        /// <returns>New instance of PlayerNode</returns>
        PlayerNode.prototype.ShallowClone = function () {
            var newPlayerNode = new PlayerNode(this.AdaptationID, this.GameID, this.PlayerID);
            newPlayerNode.Rating = this.Rating;
            newPlayerNode.PlayCount = this.PlayCount;
            newPlayerNode.KFactor = this.KFactor;
            newPlayerNode.Uncertainty = this.Uncertainty;
            newPlayerNode.LastPlayed = this.LastPlayed;
            return newPlayerNode;
        };
        return PlayerNode;
    }());
    TwoAPackage.PlayerNode = PlayerNode;
})(TwoAPackage || (TwoAPackage = {}));
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
/// <reference path="Misc.ts"/>
///
var TwoAPackage;
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
/// <reference path="Misc.ts"/>
///
(function (TwoAPackage) {
    /// <summary>
    /// The Scenario node
    /// </summary>
    var ScenarioNode = /** @class */ (function () {
        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="p_adaptID">Adaptation ID</param>
        /// <param name="p_gameID">Game ID</param>
        /// <param name="p_scenarioID">Scenario ID</param>
        function ScenarioNode(p_adaptID, p_gameID, p_scenarioID) {
            this.rating = TwoAPackage.BaseAdapter.INITIAL_RATING;
            this.playCount = 0;
            this.kFct = TwoAPackage.BaseAdapter.INITIAL_K_FCT;
            this.uncertainty = TwoAPackage.BaseAdapter.INITIAL_UNCERTAINTY;
            this.lastPlayed = Misc.GetDateStr();
            this.timeLimit = TwoAPackage.BaseAdapter.DEFAULT_TIME_LIMIT;
            this.AdaptationID = p_adaptID;
            this.GameID = p_gameID;
            this.ScenarioID = p_scenarioID;
        }
        Object.defineProperty(ScenarioNode.prototype, "AdaptationID", {
            /// <summary>
            /// Identifier for the Adaptation node.
            /// </summary>
            get: function () {
                return this.adaptID;
            },
            set: function (p_adaptID) {
                if (!Misc.IsNullOrEmpty(p_adaptID)) {
                    this.adaptID = p_adaptID;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ScenarioNode.prototype, "GameID", {
            /// <summary>
            /// Identifier for the Game node.
            /// </summary>
            get: function () {
                return this.gameID;
            },
            set: function (p_gameID) {
                if (!Misc.IsNullOrEmpty(p_gameID)) {
                    this.gameID = p_gameID;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ScenarioNode.prototype, "ScenarioID", {
            /// <summary>
            /// Identifier for the Scenario node.
            /// </summary>
            get: function () {
                return this.scenarioID;
            },
            set: function (p_scenarioID) {
                if (!Misc.IsNullOrEmpty(p_scenarioID)) {
                    this.scenarioID = p_scenarioID;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ScenarioNode.prototype, "Rating", {
            /// <summary>
            /// Scenario rating
            /// </summary>
            get: function () {
                return this.rating;
            },
            set: function (p_rating) {
                this.rating = p_rating;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ScenarioNode.prototype, "PlayCount", {
            /// <summary>
            /// Number of times the scenario was played.
            /// </summary>
            get: function () {
                return this.playCount;
            },
            set: function (p_playCount) {
                if (p_playCount >= 0) {
                    this.playCount = p_playCount;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ScenarioNode.prototype, "KFactor", {
            /// <summary>
            /// Scenario's K factor.
            /// </summary>
            get: function () {
                return this.kFct;
            },
            set: function (p_kFct) {
                if (p_kFct > 0) {
                    this.kFct = p_kFct;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ScenarioNode.prototype, "Uncertainty", {
            /// <summary>
            /// Uncertainty in scenario's rating.
            /// </summary>
            get: function () {
                return this.uncertainty;
            },
            set: function (p_uncertainty) {
                if (p_uncertainty >= 0 && p_uncertainty <= 1) {
                    this.uncertainty = p_uncertainty;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ScenarioNode.prototype, "LastPlayed", {
            /// <summary>
            /// Last time the scenario played.
            /// </summary>
            get: function () {
                return this.lastPlayed;
            },
            set: function (p_lastPlayed) {
                if (!Misc.IsNullOrEmpty(p_lastPlayed)) {
                    this.lastPlayed = p_lastPlayed;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ScenarioNode.prototype, "TimeLimit", {
            /// <summary>
            /// Time limit for completing the scenario.
            /// </summary>
            get: function () {
                return this.timeLimit;
            },
            set: function (p_timeLimit) {
                if (p_timeLimit > 0) {
                    this.timeLimit = p_timeLimit;
                }
            },
            enumerable: true,
            configurable: true
        });
        /// <summary>
        /// Makes a shallow clone of this instance.
        /// </summary>
        /// <returns>New instance of ScenarioNode</returns>
        ScenarioNode.prototype.ShallowClone = function () {
            var newScenarioNode = new ScenarioNode(this.AdaptationID, this.GameID, this.ScenarioID);
            newScenarioNode.Rating = this.Rating;
            newScenarioNode.PlayCount = this.PlayCount;
            newScenarioNode.KFactor = this.KFactor;
            newScenarioNode.Uncertainty = this.Uncertainty;
            newScenarioNode.LastPlayed = this.LastPlayed;
            newScenarioNode.TimeLimit = this.TimeLimit;
            return newScenarioNode;
        };
        return ScenarioNode;
    }());
    TwoAPackage.ScenarioNode = ScenarioNode;
})(TwoAPackage || (TwoAPackage = {}));
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
/// <reference path="Misc.ts"/>
///
var TwoAPackage;
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
/// <reference path="Misc.ts"/>
///
(function (TwoAPackage) {
    /// <summary>
    /// A TwoA gameplay.
    /// </summary>
    var Gameplay = /** @class */ (function () {
        /// <summary>
        /// Constructor.
        /// </summary>
        function Gameplay() {
        }
        Object.defineProperty(Gameplay.prototype, "AdaptationID", {
            /// <summary>
            /// Identifier for the Adaptation node.
            /// </summary>
            get: function () {
                return this.adaptID;
            },
            set: function (p_adaptID) {
                if (!Misc.IsNullOrEmpty(p_adaptID)) {
                    this.adaptID = p_adaptID;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Gameplay.prototype, "GameID", {
            /// <summary>
            /// Identifier for the Game node.
            /// </summary>
            get: function () {
                return this.gameID;
            },
            set: function (p_gameID) {
                if (!Misc.IsNullOrEmpty(p_gameID)) {
                    this.gameID = p_gameID;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Gameplay.prototype, "PlayerID", {
            /// <summary>
            /// Identifier for the player.
            /// </summary>
            get: function () {
                return this.playerID;
            },
            set: function (p_playerID) {
                if (!Misc.IsNullOrEmpty(p_playerID)) {
                    this.playerID = p_playerID;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Gameplay.prototype, "ScenarioID", {
            /// <summary>
            /// Identifier for the scenario.
            /// </summary>
            get: function () {
                return this.scenarioID;
            },
            set: function (p_scenarioID) {
                if (!Misc.IsNullOrEmpty(p_scenarioID)) {
                    this.scenarioID = p_scenarioID;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Gameplay.prototype, "Timestamp", {
            /// <summary>
            /// The timestamp.
            /// </summary>
            get: function () {
                return this.timestamp;
            },
            set: function (p_timestamp) {
                if (!Misc.IsNullOrEmpty(p_timestamp)) {
                    this.timestamp = p_timestamp;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Gameplay.prototype, "RT", {
            /// <summary>
            /// The RT.
            /// </summary>
            get: function () {
                return this.rt;
            },
            set: function (p_rt) {
                this.rt = p_rt;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Gameplay.prototype, "Accuracy", {
            /// <summary>
            /// The accuracy.
            /// </summary>
            get: function () {
                return this.accuracy;
            },
            set: function (p_accuracy) {
                this.accuracy = p_accuracy;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Gameplay.prototype, "PlayerRating", {
            /// <summary>
            /// The player rating.
            /// </summary>
            get: function () {
                return this.playerRating;
            },
            set: function (p_playerRating) {
                this.playerRating = p_playerRating;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Gameplay.prototype, "ScenarioRating", {
            /// <summary>
            /// The scenario rating.
            /// </summary>
            get: function () {
                return this.scenarioRating;
            },
            set: function (p_scenarioRating) {
                this.scenarioRating = p_scenarioRating;
            },
            enumerable: true,
            configurable: true
        });
        return Gameplay;
    }());
    TwoAPackage.Gameplay = Gameplay;
})(TwoAPackage || (TwoAPackage = {}));
/// Copyright 2018
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
var TwoAPackage;
/// Copyright 2018
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
(function (TwoAPackage) {
    var BaseAdapter = TwoAPackage.BaseAdapter;
    var DifficultyAdapter = /** @class */ (function (_super) {
        __extends(DifficultyAdapter, _super);
        ////// END: properties for calculating k factors
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: constructor
        /// <summary>
        /// Initializes a new instance of the TwoA.DifficultyAdapter class.
        /// </summary>
        function DifficultyAdapter() {
            var _this = _super.call(this) || this;
            _this.targetDistrMean = DifficultyAdapter.TARGET_DISTR_MEAN;
            _this.targetDistrSD = DifficultyAdapter.TARGET_DISTR_SD;
            _this.targetLowerLimit = DifficultyAdapter.TARGET_LOWER_LIMIT;
            _this.targetUpperLimit = DifficultyAdapter.TARGET_UPPER_LIMIT;
            _this.fiSDMultiplier = DifficultyAdapter.FI_SD_MULTIPLIER;
            _this.maxDelay = DifficultyAdapter.DEF_MAX_DELAY; // [SC] set to DEF_MAX_DELAY in the constructor
            _this.maxPlay = DifficultyAdapter.DEF_MAX_PLAY; // [SC] set to DEF_MAX_PLAY in the constructor
            _this.kConst = DifficultyAdapter.DEF_K; // [SC] set to DEF_K in the constructor
            _this.kUp = DifficultyAdapter.DEF_K_UP; // [SC] set to DEF_K_UP in the constructor
            _this.kDown = DifficultyAdapter.DEF_K_DOWN; // [SC] set to DEF_K_DOWN in the constructor
            return _this;
        }
        Object.defineProperty(DifficultyAdapter.prototype, "Type", {
            //////////////////////////////////////////////////////////////////////////////////////
            ////// START: properties for the adapter type
            /// <summary>
            /// Gets the type of the adapter
            /// </summary>
            get: function () {
                return "Game difficulty - Player skill";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DifficultyAdapter.prototype, "Description", {
            /// <summary>
            /// Description of this adapter
            /// </summary>
            get: function () {
                return "Adapts game difficulty to player skill. Skill ratings are evaluated for individual players. "
                    + "Requires player accuracy (0 or 1) and response time. Uses a modified version of the CAP algorithm.";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DifficultyAdapter.prototype, "TargetDistrMean", {
            /// <summary>
            /// Getter for target distribution mean. See 'setTargetDistribution' method for setting a value.
            /// </summary>
            get: function () {
                return this.targetDistrMean;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DifficultyAdapter.prototype, "TargetDistrSD", {
            //set TargetDistrMean(p_targetDistrMean: number) {
            //    this.targetDistrMean = p_targetDistrMean;
            //}
            /// <summary>
            /// Getter for target distribution standard deviation. See 'setTargetDistribution' method for setting a value.
            /// </summary>
            get: function () {
                return this.targetDistrSD;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DifficultyAdapter.prototype, "TargetLowerLimit", {
            //set TargetDistrSD(p_targetDistrSD: number) {
            //    this.targetDistrSD = p_targetDistrSD;
            //}
            /// <summary>
            /// Getter for target distribution lower limit. See 'setTargetDistribution' method for setting a value.
            /// </summary>
            get: function () {
                return this.targetLowerLimit;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DifficultyAdapter.prototype, "TargetUpperLimit", {
            //set TargetLowerLimit(p_targetLowerLimit: number) {
            //    this.targetLowerLimit = p_targetLowerLimit;
            //}
            /// <summary>
            /// Getter for target distribution upper limit. See 'setTargetDistribution' method for setting a value.
            /// </summary>
            get: function () {
                return this.targetUpperLimit;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DifficultyAdapter.prototype, "FiSDMultiplier", {
            //set TargetUpperLimit(p_targetUpperLimit: number) {
            //    this.targetUpperLimit = p_targetUpperLimit;
            //}
            /// <summary>
            /// Getter/setter for a weight used to calculate distribution means for a fuzzy selection algorithm.
            /// </summary>
            get: function () {
                return this.fiSDMultiplier;
            },
            set: function (p_fiSDMultiplier) {
                if (p_fiSDMultiplier <= 0) {
                    this.log(AssetPackage.Severity.Warning, "In FiSDMultiplier: The standard deviation multiplier '"
                        + p_fiSDMultiplier + "' is less than or equal to 0.");
                }
                else {
                    this.fiSDMultiplier = p_fiSDMultiplier;
                }
            },
            enumerable: true,
            configurable: true
        });
        /// <summary>
        /// Sets FiSDMultiplier to a default value
        /// </summary>
        DifficultyAdapter.prototype.setDefaultFiSDMultiplier = function () {
            this.FiSDMultiplier = DifficultyAdapter.FI_SD_MULTIPLIER;
        };
        /// <summary>
        /// Sets target distribution parameters to their default values.
        /// </summary>
        DifficultyAdapter.prototype.setDefaultTargetDistribution = function () {
            this.setTargetDistribution(DifficultyAdapter.TARGET_DISTR_MEAN, DifficultyAdapter.TARGET_DISTR_SD, DifficultyAdapter.TARGET_LOWER_LIMIT, DifficultyAdapter.TARGET_UPPER_LIMIT);
        };
        /// <summary>
        /// Sets target distribution parameters to custom values.
        /// </summary>
        /// 
        /// <param name="p_tDistrMean">   Dstribution mean</param>
        /// <param name="p_tDistrSD">     Distribution standard deviation</param>
        /// <param name="p_tLowerLimit">  Distribution lower limit</param>
        /// <param name="p_tUpperLimit">  Distribution upper limit</param>
        DifficultyAdapter.prototype.setTargetDistribution = function (p_tDistrMean, p_tDistrSD, p_tLowerLimit, p_tUpperLimit) {
            var validValuesFlag = true;
            // [SD] setting distribution mean
            if (p_tDistrMean <= 0 || p_tDistrMean >= 1) {
                this.log(AssetPackage.Severity.Warning, "In DifficultyAdapter.setTargetDistribution: The target distribution mean '"
                    + p_tDistrMean + "' is not within the open interval (0, 1).");
                validValuesFlag = false;
            }
            // [SC] setting distribution SD
            if (p_tDistrSD <= 0 || p_tDistrSD >= 1) {
                this.log(AssetPackage.Severity.Warning, "In DifficultyAdapter.setTargetDistribution: The target distribution standard deviation '"
                    + p_tDistrSD + "' is not within the open interval (0, 1).");
                validValuesFlag = false;
            }
            // [SC] setting distribution lower limit
            if (p_tLowerLimit < 0 || p_tLowerLimit > 1) {
                this.log(AssetPackage.Severity.Warning, "In DifficultyAdapter.setTargetDistribution: The lower limit of distribution '"
                    + p_tLowerLimit + "' is not within the closed interval [0, 1].");
                validValuesFlag = false;
            }
            if (p_tLowerLimit >= p_tDistrMean) {
                this.log(AssetPackage.Severity.Warning, "In DifficultyAdapter.setTargetDistribution: The lower limit of distribution '" + p_tLowerLimit
                    + "' is bigger than or equal to the mean of the distribution '" + p_tDistrMean + "'.");
                validValuesFlag = false;
            }
            // [SC] setting distribution upper limit
            if (p_tUpperLimit < 0 || p_tUpperLimit > 1) {
                this.log(AssetPackage.Severity.Warning, "In DifficultyAdapter.setTargetDistribution: The upper limit of distribution '"
                    + p_tUpperLimit + "' is not within the closed interval [0, 1].");
                validValuesFlag = false;
            }
            if (p_tUpperLimit <= p_tDistrMean) {
                this.log(AssetPackage.Severity.Warning, "In DifficultyAdapter.setTargetDistribution: The upper limit of distribution '" + p_tUpperLimit
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
                this.log(AssetPackage.Severity.Warning, "In DifficultyAdapter.setTargetDistribution: Invalid value combination is found.");
            }
        };
        Object.defineProperty(DifficultyAdapter.prototype, "MaxDelay", {
            /// <summary>
            /// Gets or sets the maximum delay.
            /// </summary>
            get: function () {
                return this.maxDelay;
            },
            set: function (p_maxDelay) {
                if (p_maxDelay <= 0) {
                    this.log(AssetPackage.Severity.Warning, "In DifficultyAdapter.MaxDelay: The maximum number of delay days '"
                        + p_maxDelay + "' should be higher than 0.");
                }
                else {
                    this.maxDelay = p_maxDelay;
                }
            },
            enumerable: true,
            configurable: true
        });
        /// <summary>
        /// Sets MaxDelay to its default value.
        /// </summary>
        DifficultyAdapter.prototype.setDefaultMaxDelay = function () {
            this.MaxDelay = DifficultyAdapter.DEF_MAX_DELAY;
        };
        Object.defineProperty(DifficultyAdapter.prototype, "MaxPlay", {
            /// <summary>
            /// Gets or sets the maximum play.
            /// </summary>
            get: function () {
                return this.maxPlay;
            },
            set: function (p_maxPlay) {
                if (p_maxPlay <= 0) {
                    this.log(AssetPackage.Severity.Warning, "In DifficultyAdapter.MaxPlay: The maximum administration parameter '"
                        + p_maxPlay + "' should be higher than 0.");
                }
                else {
                    this.maxPlay = p_maxPlay;
                }
            },
            enumerable: true,
            configurable: true
        });
        /// <summary>
        /// Sets MaxPlay to its default value
        /// </summary>
        DifficultyAdapter.prototype.setDefaultMaxPlay = function () {
            this.MaxPlay = DifficultyAdapter.DEF_MAX_PLAY;
        };
        Object.defineProperty(DifficultyAdapter.prototype, "KConst", {
            /// <summary>
            /// Getter/setter for the K constant.
            /// </summary>
            get: function () {
                return this.kConst;
            },
            set: function (p_kConst) {
                if (p_kConst <= 0) {
                    this.log(AssetPackage.Severity.Warning, "In DifficultyAdapter.KConst: K constant '"
                        + p_kConst + "' cannot be 0 or a negative number.");
                }
                else {
                    this.kConst = p_kConst;
                }
            },
            enumerable: true,
            configurable: true
        });
        /// <summary>
        /// Sets the K constant to its deafult value
        /// </summary>
        DifficultyAdapter.prototype.setDefaultKConst = function () {
            this.KConst = DifficultyAdapter.DEF_K;
        };
        Object.defineProperty(DifficultyAdapter.prototype, "KUp", {
            /// <summary>
            /// Getter/setter for the upward uncertainty weight.
            /// </summary>
            get: function () {
                return this.kUp;
            },
            set: function (p_kUp) {
                if (p_kUp < 0) {
                    this.log(AssetPackage.Severity.Warning, "In DifficultyAdapter.KUp: The upward uncertianty weight '"
                        + p_kUp + "' cannot be a negative number.");
                }
                else {
                    this.kUp = p_kUp;
                }
            },
            enumerable: true,
            configurable: true
        });
        /// <summary>
        /// Sets the upward uncertainty weight to its default value.
        /// </summary>
        DifficultyAdapter.prototype.setDefaultKUp = function () {
            this.KUp = DifficultyAdapter.DEF_K_UP;
        };
        Object.defineProperty(DifficultyAdapter.prototype, "KDown", {
            /// <summary>
            /// Getter/setter for the downward uncertainty weight.
            /// </summary>
            get: function () {
                return this.kDown;
            },
            set: function (p_kDown) {
                if (p_kDown < 0) {
                    this.log(AssetPackage.Severity.Warning, "In DifficultyAdapter.KDown: The downward uncertainty weight '"
                        + p_kDown + "' cannot be a negative number.");
                }
                else {
                    this.kDown = p_kDown;
                }
            },
            enumerable: true,
            configurable: true
        });
        /// <summary>
        /// Sets the downward uncetrtainty weight to its default value.
        /// </summary>
        DifficultyAdapter.prototype.setDefaultKDown = function () {
            this.KDown = DifficultyAdapter.DEF_K_DOWN;
        };
        DifficultyAdapter.prototype.InitSettings = function (p_asset) {
            _super.prototype.InitSettings.call(this, p_asset); // [ASSET]
        };
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
        DifficultyAdapter.prototype.UpdateRatings = function (p_playerNode, p_scenarioNode, p_rt, p_correctAnswer, p_updateScenarioRating, p_customPlayerKfct, p_customScenarioKfct) {
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
            var playerRating = p_playerNode.Rating;
            var playerPlayCount = p_playerNode.PlayCount;
            var playerUncertainty = p_playerNode.Uncertainty;
            var playerLastPlayed = p_playerNode.LastPlayed;
            // [SC] getting scenario data
            var scenarioRating = p_scenarioNode.Rating;
            var scenarioPlayCount = p_scenarioNode.PlayCount;
            var scenarioUncertainty = p_scenarioNode.Uncertainty;
            var scenarioTimeLimit = p_scenarioNode.TimeLimit;
            var scenarioLastPlayed = p_scenarioNode.LastPlayed;
            // [SC] current datetime
            var currDateTime = Misc.GetDateStr();
            // [SC] parsing player data
            var playerLastPlayedDays = Misc.DaysElapsed(playerLastPlayed);
            if (playerLastPlayedDays > this.MaxDelay) {
                playerLastPlayedDays = this.MaxDelay;
            }
            // [SC] parsing scenario data
            var scenarioLastPlayedDays = Misc.DaysElapsed(scenarioLastPlayed);
            if (scenarioLastPlayedDays > this.MaxDelay) {
                scenarioLastPlayedDays = this.MaxDelay;
            }
            // [SC] calculating actual and expected scores
            var actualScore = this.calcActualScore(p_correctAnswer, p_rt, scenarioTimeLimit);
            var expectScore = this.calcExpectedScore(playerRating, scenarioRating, scenarioTimeLimit);
            // [SC] calculating player and scenario uncertainties
            var playerNewUncertainty = this.calcThetaUncertainty(playerUncertainty, playerLastPlayedDays);
            var scenarioNewUncertainty = this.calcBetaUncertainty(scenarioUncertainty, scenarioLastPlayedDays);
            var playerNewKFct;
            var scenarioNewKFct;
            if (p_customPlayerKfct > 0) {
                playerNewKFct = p_customPlayerKfct;
            }
            else {
                // [SC] calculating player K factors
                playerNewKFct = this.calcThetaKFctr(playerNewUncertainty, scenarioNewUncertainty);
            }
            if (p_customScenarioKfct > 0) {
                scenarioNewKFct = p_customScenarioKfct;
            }
            else {
                // [SC] calculating scenario K factor
                scenarioNewKFct = this.calcBetaKFctr(playerNewUncertainty, scenarioNewUncertainty);
            }
            // [SC] calculating player and scenario ratings
            var playerNewRating = this.calcTheta(playerRating, playerNewKFct, actualScore, expectScore);
            var scenarioNewRating = this.calcBeta(scenarioRating, scenarioNewKFct, actualScore, expectScore);
            // [SC] updating player and scenario play counts
            var playerNewPlayCount = playerPlayCount + 1.0;
            var scenarioNewPlayCount = scenarioPlayCount + 1.0;
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
            this.asset.CreateNewRecord(this.Type, p_playerNode.GameID, p_playerNode.PlayerID, p_scenarioNode.ScenarioID, p_rt, p_correctAnswer, playerNewRating, scenarioNewRating, currDateTime);
            return true;
        };
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
        DifficultyAdapter.prototype.TargetScenario = function (p_playerNode, p_scenarioList) {
            if (typeof this.asset === 'undefined' || this.asset === null) {
                this.log(AssetPackage.Severity.Error, "In DifficultyAdapter.TargetScenario: Unable to recommend a scenario. Asset instance is not detected.");
                return null;
            }
            // [TODO] should check for valid adaptation IDs in the player and scenarios?
            if (typeof p_playerNode === 'undefined' || p_playerNode === null) {
                this.log(AssetPackage.Severity.Error, "In DifficultyAdapter.TargetScenario: Null player node. Returning null.");
                return null;
            }
            if (typeof p_scenarioList === 'undefined' || p_scenarioList === null || p_scenarioList.length === 0) {
                this.log(AssetPackage.Severity.Error, "In DifficultyAdapter.TargetScenario: Null or empty scenario node list. Returning null.");
                return null;
            }
            // [SC] calculate min and max possible ratings for candidate scenarios
            var ratingFI = this.calcTargetBetas(p_playerNode.Rating); // [SC][2016.12.14] fuzzy interval for rating
            // [SC] info for the scenarios within the core rating range and with the lowest play count
            var coreScenarios = new Array();
            var coreMinPlayCount = 0;
            // [SC] info for the scenarios within the support rating range and with the lowest play count
            var supportScenarios = new Array();
            var supportMinPlayCount = 0;
            // [SC] info for the closest scenarios outside of the fuzzy interval and the lowest play count
            var outScenarios = new Array();
            var outMinPlayCount = 0;
            var outMinDistance = 0;
            // [SC] iterate through the list of all scenarios
            for (var _i = 0, p_scenarioList_1 = p_scenarioList; _i < p_scenarioList_1.length; _i++) {
                var scenario = p_scenarioList_1[_i];
                var scenarioRating = scenario.Rating;
                var scenarioPlayCount = scenario.PlayCount;
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
                else {
                    var distance = Math.min(Math.abs(scenarioRating - ratingFI[1]), Math.abs(scenarioRating - ratingFI[2]));
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
        };
        /// <summary>
        /// Calculates a fuzzy interval for a target beta.
        /// </summary>
        ///
        /// <param name="p_theta"> The theta. </param>
        ///
        /// <returns>
        /// A four-element array of ratings (in an ascending order) representing lower and upper bounds of the support and core
        /// </returns>
        DifficultyAdapter.prototype.calcTargetBetas = function (p_theta) {
            // [SC] mean of one-sided normal distribution from which to derive the lower bound of the support in a fuzzy interval
            var lower_distr_mean = this.TargetDistrMean - (this.FiSDMultiplier * this.TargetDistrSD);
            if (lower_distr_mean < BaseAdapter.DistrLowerLimit) {
                lower_distr_mean = BaseAdapter.DistrLowerLimit;
            }
            // [SC] mean of one-sided normal distribution from which to derive the upper bound of the support in a fuzzy interval
            var upper_distr_mean = this.TargetDistrMean + (this.FiSDMultiplier * this.TargetDistrSD);
            if (upper_distr_mean > BaseAdapter.DistrUpperLimit) {
                upper_distr_mean = BaseAdapter.DistrUpperLimit;
            }
            // [SC] the array stores four probabilities (in an ascending order) that represent lower and upper bounds of the support and core 
            var randNums = new Array(4);
            // [SC] calculating two probabilities as the lower and upper bounds of the core in a fuzzy interval
            var rndNum;
            for (var index = 1; index < 3; index++) {
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
                var temp = randNums[1];
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
            var lowerLimitBeta = p_theta + Math.log((1.0 - randNums[3]) / randNums[3]);
            var minBeta = p_theta + Math.log((1.0 - randNums[2]) / randNums[2]); // [SC][2016.10.07] a modified version of the equation from the original data; better suits the data
            var maxBeta = p_theta + Math.log((1.0 - randNums[1]) / randNums[1]);
            var upperLimitBeta = p_theta + Math.log((1.0 - randNums[0]) / randNums[0]);
            return new Array(lowerLimitBeta, minBeta, maxBeta, upperLimitBeta);
        };
        /// <summary>
        /// Returns target difficulty rating given a skill rating.
        /// </summary>
        /// <param name="p_theta">Skill rating.</param>
        /// <returns>Difficulty rating.</returns>
        DifficultyAdapter.prototype.TargetDifficultyRating = function (p_theta) {
            return p_theta + Math.log((1.0 - this.TargetDistrMean) / this.TargetDistrMean);
        };
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
        DifficultyAdapter.prototype.calcActualScore = function (p_correctAnswer, p_responseTime, p_itemMaxDuration) {
            if (!(this.validateCorrectAnswer(p_correctAnswer)
                && this.validateResponseTime(p_responseTime)
                && this.validateItemMaxDuration(p_itemMaxDuration))) {
                this.log(AssetPackage.Severity.Error, "In DifficultyAdapter.calcActualScore: Cannot calculate score."
                    + " Invalid parameter detected. Returning error code '" + BaseAdapter.ErrorCode + "'.");
                return BaseAdapter.ErrorCode;
            }
            // [SC][2017.01.03]
            if (p_responseTime > p_itemMaxDuration) {
                p_responseTime = p_itemMaxDuration;
                this.log(AssetPackage.Severity.Warning, "In DifficultyAdapter.calcActualScore: Response time '" + p_responseTime
                    + "' exceeds the item's max time duration '" + p_itemMaxDuration
                    + "'. Setting the response time to item's max duration.");
            }
            var discrParam = this.getDiscriminationParam(p_itemMaxDuration);
            return (((2.0 * p_correctAnswer) - 1.0) * ((discrParam * p_itemMaxDuration) - (discrParam * p_responseTime)));
        };
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
        DifficultyAdapter.prototype.calcExpectedScore = function (p_playerTheta, p_itemBeta, p_itemMaxDuration) {
            if (!this.validateItemMaxDuration(p_itemMaxDuration)) {
                this.log(AssetPackage.Severity.Error, "In DifficultyAdapter.calcExpectedScore: Cannot calculate score."
                    + " Invalid parameter detected. Returning error code '" + BaseAdapter.ErrorCode + "'.");
                return BaseAdapter.ErrorCode;
            }
            var weight = this.getDiscriminationParam(p_itemMaxDuration) * p_itemMaxDuration;
            var ratingDifference = p_playerTheta - p_itemBeta; // [SC][2016.01.07]
            if (ratingDifference === 0) {
                ratingDifference = 0.001;
            }
            var expFctr = Math.exp(2.0 * weight * ratingDifference); // [SC][2016.01.07]
            return (weight * ((expFctr + 1.0) / (expFctr - 1.0))) - (1.0 / ratingDifference); // [SC][2016.01.07]
        };
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
        DifficultyAdapter.prototype.getDiscriminationParam = function (p_itemMaxDuration) {
            return 1.0 / p_itemMaxDuration;
        };
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
        DifficultyAdapter.prototype.calcThetaUncertainty = function (p_currThetaU, p_currDelayCount) {
            var newThetaU = p_currThetaU - (1.0 / this.MaxPlay) + (p_currDelayCount / this.MaxDelay);
            if (newThetaU < 0) {
                newThetaU = 0.0;
            }
            else if (newThetaU > 1) {
                newThetaU = 1.0;
            }
            return newThetaU;
        };
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
        DifficultyAdapter.prototype.calcBetaUncertainty = function (p_currBetaU, p_currDelayCount) {
            var newBetaU = p_currBetaU - (1.0 / this.MaxPlay) + (p_currDelayCount / this.MaxDelay);
            if (newBetaU < 0) {
                newBetaU = 0.0;
            }
            else if (newBetaU > 1) {
                newBetaU = 1.0;
            }
            return newBetaU;
        };
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
        DifficultyAdapter.prototype.calcThetaKFctr = function (p_currThetaU, p_currBetaU) {
            return this.KConst * (1.0 + (this.KUp * p_currThetaU) - (this.KDown * p_currBetaU));
        };
        /// <summary>
        /// Calculates a new K factor for the beta rating
        /// </summary>
        /// 
        /// <param name="p_currThetaU">   current uncertainty fot the theta rating</param>
        /// <param name="p_currBetaU">    current uncertainty for the beta rating</param>
        /// 
        /// <returns>a double value of a new K factor for the beta rating</returns>
        DifficultyAdapter.prototype.calcBetaKFctr = function (p_currThetaU, p_currBetaU) {
            return this.KConst * (1.0 + (this.KUp * p_currBetaU) - (this.KDown * p_currThetaU));
        };
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
        DifficultyAdapter.prototype.calcTheta = function (p_currTheta, p_thetaKFctr, p_actualScore, p_expectScore) {
            return p_currTheta + (p_thetaKFctr * (p_actualScore - p_expectScore));
        };
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
        DifficultyAdapter.prototype.calcBeta = function (p_currBeta, p_betaKFctr, p_actualScore, p_expectScore) {
            return p_currBeta + (p_betaKFctr * (p_expectScore - p_actualScore));
        };
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
        DifficultyAdapter.prototype.validateCorrectAnswer = function (p_correctAnswer) {
            if (p_correctAnswer !== 0 && p_correctAnswer !== 1) {
                this.log(AssetPackage.Severity.Error, "In DifficultyAdapter.validateCorrectAnswer: Accuracy should be either 0 or 1. "
                    + "Current value is '" + p_correctAnswer + "'.");
                return false;
            }
            return true;
        };
        /// <summary>
        /// Tests the validity of the value representing the response time.
        /// </summary>
        /// 
        /// <param name="p_responseTime">Response time in milliseconds</param>
        /// 
        /// <returns>True if the value is valid</returns>
        DifficultyAdapter.prototype.validateResponseTime = function (p_responseTime) {
            if (p_responseTime <= 0) {
                this.log(AssetPackage.Severity.Error, "In DifficultyAdapter.validateResponseTime: Response time cannot be 0 or negative. "
                    + "Current value is '" + p_responseTime + "'.");
                return false;
            }
            return true;
        };
        /// <summary>
        /// Tests the validity of the value representing the max amount of time to respond.
        /// </summary>
        /// 
        /// <param name="p_itemMaxDuration">Time duration in mulliseconds</param>
        /// 
        /// <returns>True if the value is valid</returns>
        DifficultyAdapter.prototype.validateItemMaxDuration = function (p_itemMaxDuration) {
            if (p_itemMaxDuration <= 0) {
                this.log(AssetPackage.Severity.Error, "In DifficultyAdapter.validateItemMaxDuration: Max playable duration cannot be 0 or negative. "
                    + "Current value is '" + p_itemMaxDuration + "'.");
                return false;
            }
            return true;
        };
        ////// END: properties for the adapter type
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: const, fields, and properties for calculating target betas
        DifficultyAdapter.TARGET_DISTR_MEAN = 0.75; // [SC] default value for 'targetDistrMean' field
        DifficultyAdapter.TARGET_DISTR_SD = 0.1; // [SC] default value for 'targetDistrSD' field
        DifficultyAdapter.TARGET_LOWER_LIMIT = 0.50; // [SC] default value for 'targetLowerLimit' field
        DifficultyAdapter.TARGET_UPPER_LIMIT = 1.0; // [SC] default value for 'targetUpperLimit' field
        DifficultyAdapter.FI_SD_MULTIPLIER = 1.0; // [SC] multipler for SD used to calculate the means of normal distributions used to decide on lower and upper bounds of the supports in a fuzzy interval
        ////// END: const, fields, and properties for calculating target betas
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: const, fields, and properties for calculating rating uncertainties
        DifficultyAdapter.DEF_MAX_DELAY = 30; // [SC] The default value for the max number of days after which player's or item's undertainty reaches the maximum
        DifficultyAdapter.DEF_MAX_PLAY = 40; // [SC] The default value for the max number of administrations that should result in minimum uncertaint in item's or player's ratings
        ////// END: const, fields, and properties for calculating rating uncertainties
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: const, fields, and properties for calculating k factors
        DifficultyAdapter.DEF_K = 0.0075; // [SC] The default value for the K constant when there is no uncertainty
        DifficultyAdapter.DEF_K_UP = 4.0; // [SC] the default value for the upward uncertainty weight
        DifficultyAdapter.DEF_K_DOWN = 0.5; // [SC] The default value for the downward uncertainty weight
        return DifficultyAdapter;
    }(BaseAdapter));
    TwoAPackage.DifficultyAdapter = DifficultyAdapter;
})(TwoAPackage || (TwoAPackage = {}));
/// Copyright 2018
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
var TwoAPackage;
/// Copyright 2018
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
(function (TwoAPackage) {
    var BaseAdapter = TwoAPackage.BaseAdapter;
    var DifficultyAdapterElo = /** @class */ (function (_super) {
        __extends(DifficultyAdapterElo, _super);
        ////// END: const, fields, and properties for calculating expected score
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: constructor
        /// <summary>
        /// Initializes a new instance of the TwoA.DifficultyAdapter class.
        /// </summary>
        function DifficultyAdapterElo() {
            var _this = _super.call(this) || this;
            _this.targetDistrMean = DifficultyAdapterElo.TARGET_DISTR_MEAN;
            _this.targetDistrSD = DifficultyAdapterElo.TARGET_DISTR_SD;
            _this.targetLowerLimit = DifficultyAdapterElo.TARGET_LOWER_LIMIT;
            _this.targetUpperLimit = DifficultyAdapterElo.TARGET_UPPER_LIMIT;
            _this.fiSDMultiplier = DifficultyAdapterElo.FI_SD_MULTIPLIER;
            _this.maxDelay = DifficultyAdapterElo.DEF_MAX_DELAY; // [SC] set to DEF_MAX_DELAY in the constructor
            _this.maxPlay = DifficultyAdapterElo.DEF_MAX_PLAY; // [SC] set to DEF_MAX_PLAY in the constructor
            _this.kConst = DifficultyAdapterElo.DEF_K; // [SC] set to DEF_K in the constructor
            _this.kUp = DifficultyAdapterElo.DEF_K_UP; // [SC] set to DEF_K_UP in the constructor
            _this.kDown = DifficultyAdapterElo.DEF_K_DOWN; // [SC] set to DEF_K_DOWN in the constructor
            _this.expectScoreMagnifier = DifficultyAdapterElo.EXPECT_SCORE_MAGNIFIER; // [SC] value of the expected score magnifier used in calculations
            _this.magnifierStepSize = DifficultyAdapterElo.MAGNIFIER_STEP_SIZE; // [SC] value of the magnifieer step size used in calculations
            return _this;
        }
        Object.defineProperty(DifficultyAdapterElo.prototype, "Type", {
            //////////////////////////////////////////////////////////////////////////////////////
            ////// START: properties for the adapter type
            /// <summary>
            /// Gets the type of the adapter
            /// </summary>
            get: function () {
                return "SkillDifficultyElo";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DifficultyAdapterElo.prototype, "Description", {
            /// <summary>
            /// Description of this adapter
            /// </summary>
            get: function () {
                return "Adapts game difficulty to player skill. Skill ratings are evaluated for individual players. "
                    + "Requires player accuracy (value within [0, 1]) observations. Uses the Elo equation for expected score estimation.";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DifficultyAdapterElo.prototype, "TargetDistrMean", {
            /// <summary>
            /// Getter for target distribution mean. See 'setTargetDistribution' method for setting a value.
            /// </summary>
            get: function () {
                return this.targetDistrMean;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DifficultyAdapterElo.prototype, "TargetDistrSD", {
            /// <summary>
            /// Getter for target distribution standard deviation. See 'setTargetDistribution' method for setting a value.
            /// </summary>
            get: function () {
                return this.targetDistrSD;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DifficultyAdapterElo.prototype, "TargetLowerLimit", {
            /// <summary>
            /// Getter for target distribution lower limit. See 'setTargetDistribution' method for setting a value.
            /// </summary>
            get: function () {
                return this.targetLowerLimit;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DifficultyAdapterElo.prototype, "TargetUpperLimit", {
            /// <summary>
            /// Getter for target distribution upper limit. See 'setTargetDistribution' method for setting a value.
            /// </summary>
            get: function () {
                return this.targetUpperLimit;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DifficultyAdapterElo.prototype, "FiSDMultiplier", {
            /// <summary>
            /// Getter/setter for a weight used to calculate distribution means for a fuzzy selection algorithm.
            /// </summary>
            get: function () {
                return this.fiSDMultiplier;
            },
            set: function (p_fiSDMultiplier) {
                if (p_fiSDMultiplier <= 0) {
                    this.log(AssetPackage.Severity.Warning, "In DifficultyAdapterElo.FiSDMultiplier: The standard deviation multiplier '"
                        + p_fiSDMultiplier + "' is less than or equal to 0.");
                }
                else {
                    this.fiSDMultiplier = p_fiSDMultiplier;
                }
            },
            enumerable: true,
            configurable: true
        });
        /// <summary>
        /// Sets FiSDMultiplier to a default value
        /// </summary>
        DifficultyAdapterElo.prototype.setDefaultFiSDMultiplier = function () {
            this.FiSDMultiplier = DifficultyAdapterElo.FI_SD_MULTIPLIER;
        };
        /// <summary>
        /// Sets target distribution parameters to their default values.
        /// </summary>
        DifficultyAdapterElo.prototype.setDefaultTargetDistribution = function () {
            this.setTargetDistribution(DifficultyAdapterElo.TARGET_DISTR_MEAN, DifficultyAdapterElo.TARGET_DISTR_SD, DifficultyAdapterElo.TARGET_LOWER_LIMIT, DifficultyAdapterElo.TARGET_UPPER_LIMIT);
        };
        // [TEST]
        /// <summary>
        /// Sets target distribution parameters to custom values.
        /// </summary>
        /// 
        /// <param name="tDistrMean">   Dstribution mean</param>
        /// <param name="tDistrSD">     Distribution standard deviation</param>
        /// <param name="tLowerLimit">  Distribution lower limit</param>
        /// <param name="tUpperLimit">  Distribution upper limit</param>
        DifficultyAdapterElo.prototype.setTargetDistribution = function (p_tDistrMean, p_tDistrSD, p_tLowerLimit, p_tUpperLimit) {
            var validValuesFlag = true;
            // [SD] setting distribution mean
            if (p_tDistrMean <= 0 || p_tDistrMean >= 1) {
                this.log(AssetPackage.Severity.Warning, "In DifficultyAdapterElo.setTargetDistribution: The target distribution mean '"
                    + p_tDistrMean + "' is not within the open interval (0, 1).");
                validValuesFlag = false;
            }
            // [SC] setting distribution SD
            if (p_tDistrSD <= 0 || p_tDistrSD >= 1) {
                this.log(AssetPackage.Severity.Warning, "In DifficultyAdapterElo.setTargetDistribution: The target distribution standard deviation '"
                    + p_tDistrSD + "' is not within the open interval (0, 1).");
                validValuesFlag = false;
            }
            // [SC] setting distribution lower limit
            if (p_tLowerLimit < 0 || p_tLowerLimit > 1) {
                this.log(AssetPackage.Severity.Warning, "In DifficultyAdapterElo.setTargetDistribution: The lower limit of distribution '"
                    + p_tLowerLimit + "' is not within the closed interval [0, 1].");
                validValuesFlag = false;
            }
            if (p_tLowerLimit >= p_tDistrMean) {
                this.log(AssetPackage.Severity.Warning, "In DifficultyAdapterElo.setTargetDistribution: The lower limit of distribution '"
                    + p_tLowerLimit + "' is bigger than or equal to the mean of the distribution '" + p_tDistrMean + "'.");
                validValuesFlag = false;
            }
            // [SC] setting distribution upper limit
            if (p_tUpperLimit < 0 || p_tUpperLimit > 1) {
                this.log(AssetPackage.Severity.Warning, "In DifficultyAdapterElo.setTargetDistribution: The upper limit of distribution '"
                    + p_tUpperLimit + "' is not within the closed interval [0, 1].");
                validValuesFlag = false;
            }
            if (p_tUpperLimit <= p_tDistrMean) {
                this.log(AssetPackage.Severity.Warning, "In DifficultyAdapterElo.setTargetDistribution: The upper limit of distribution '"
                    + p_tUpperLimit + "' is less than or equal to the mean of the distribution '" + p_tDistrMean + "'.");
                validValuesFlag = false;
            }
            if (validValuesFlag) {
                this.targetDistrMean = p_tDistrMean;
                this.targetDistrSD = p_tDistrSD;
                this.targetLowerLimit = p_tLowerLimit;
                this.targetUpperLimit = p_tUpperLimit;
            }
            else {
                this.log(AssetPackage.Severity.Warning, "In DifficultyAdapterElo.setTargetDistribution: Invalid value combination is found.");
            }
        };
        Object.defineProperty(DifficultyAdapterElo.prototype, "MaxDelay", {
            /// <summary>
            /// Gets or sets the maximum delay.
            /// </summary>
            get: function () {
                return this.maxDelay;
            },
            set: function (p_maxDelay) {
                if (p_maxDelay <= 0) {
                    this.log(AssetPackage.Severity.Warning, "In DifficultyAdapterElo.MaxDelay: The maximum number of delay days '" + p_maxDelay + "' should be higher than 0.");
                }
                else {
                    this.maxDelay = p_maxDelay;
                }
            },
            enumerable: true,
            configurable: true
        });
        /// <summary>
        /// Sets MaxDelay to its default value.
        /// </summary>
        DifficultyAdapterElo.prototype.setDefaultMaxDelay = function () {
            this.MaxDelay = DifficultyAdapterElo.DEF_MAX_DELAY;
        };
        Object.defineProperty(DifficultyAdapterElo.prototype, "MaxPlay", {
            /// <summary>
            /// Gets or sets the maximum play.
            /// </summary>
            get: function () {
                return this.maxPlay;
            },
            set: function (p_maxPlay) {
                if (p_maxPlay <= 0) {
                    this.log(AssetPackage.Severity.Warning, "In DifficultyAdapterElo.MaxPlay: The maximum administration parameter '"
                        + p_maxPlay + "' should be higher than 0.");
                }
                else {
                    this.maxPlay = p_maxPlay;
                }
            },
            enumerable: true,
            configurable: true
        });
        /// <summary>
        /// Sets MaxPlay to its default value
        /// </summary>
        DifficultyAdapterElo.prototype.setDefaultMaxPlay = function () {
            this.MaxPlay = DifficultyAdapterElo.DEF_MAX_PLAY;
        };
        Object.defineProperty(DifficultyAdapterElo.prototype, "KConst", {
            /// <summary>
            /// Getter/setter for the K constant.
            /// </summary>
            get: function () {
                return this.kConst;
            },
            set: function (p_kConst) {
                if (p_kConst <= 0) {
                    this.log(AssetPackage.Severity.Warning, "In DifficultyAdapterElo.KConst: K constant '"
                        + p_kConst + "' cannot be a negative number or 0.");
                }
                else {
                    this.kConst = p_kConst;
                }
            },
            enumerable: true,
            configurable: true
        });
        /// <summary>
        /// Sets K constant to its default value.
        /// </summary>
        DifficultyAdapterElo.prototype.setDefaultKConst = function () {
            this.KConst = DifficultyAdapterElo.DEF_K;
        };
        Object.defineProperty(DifficultyAdapterElo.prototype, "KUp", {
            /// <summary>
            /// Getter/setter for the upward uncertainty weight.
            /// </summary>
            get: function () {
                return this.kUp;
            },
            set: function (p_kUp) {
                if (p_kUp < 0) {
                    this.log(AssetPackage.Severity.Warning, "In DifficultyAdapterElo.KUp: The upward uncertianty weight '"
                        + p_kUp + "' cannot be a negative number.");
                }
                else {
                    this.kUp = p_kUp;
                }
            },
            enumerable: true,
            configurable: true
        });
        /// <summary>
        /// Sets the upward uncertainty weight to its default value.
        /// </summary>
        DifficultyAdapterElo.prototype.setDefaultKUp = function () {
            this.KUp = DifficultyAdapterElo.DEF_K_UP;
        };
        Object.defineProperty(DifficultyAdapterElo.prototype, "KDown", {
            /// <summary>
            /// Getter/setter for the downward uncertainty weight.
            /// </summary>
            get: function () {
                return this.kDown;
            },
            set: function (p_kDown) {
                if (p_kDown < 0) {
                    this.log(AssetPackage.Severity.Warning, "In DifficultyAdapterElo.KDown: The downward uncertainty weight '"
                        + p_kDown + "' cannot be a negative number.");
                }
                else {
                    this.kDown = p_kDown;
                }
            },
            enumerable: true,
            configurable: true
        });
        /// <summary>
        /// Sets the downward uncertainty weight to its default value.
        /// </summary>
        DifficultyAdapterElo.prototype.setDefaultKDown = function () {
            this.KDown = DifficultyAdapterElo.DEF_K_DOWN;
        };
        Object.defineProperty(DifficultyAdapterElo.prototype, "ExpectScoreMagnifier", {
            /// <summary>
            /// Getter/setter for the expected score magnifier
            /// </summary>
            get: function () {
                return this.expectScoreMagnifier;
            },
            set: function (p_expectScoreMagnifier) {
                if (p_expectScoreMagnifier < 0) {
                    this.log(AssetPackage.Severity.Warning, "In DifficultyAdapterElo.ExpectScoreMagnifier: The expected score magnifier '"
                        + p_expectScoreMagnifier + "' should be equal to or higher than 0.");
                }
                else {
                    this.expectScoreMagnifier = p_expectScoreMagnifier;
                }
            },
            enumerable: true,
            configurable: true
        });
        /// <summary>
        /// Sets the expected score magnifier to its default value
        /// </summary>
        DifficultyAdapterElo.prototype.setDefaultExpectScoreMagnifier = function () {
            this.ExpectScoreMagnifier = DifficultyAdapterElo.EXPECT_SCORE_MAGNIFIER;
        };
        Object.defineProperty(DifficultyAdapterElo.prototype, "MagnifierStepSize", {
            /// <summary>
            /// Getter/setter for the magnifier step size
            /// </summary>
            get: function () {
                return this.magnifierStepSize;
            },
            set: function (p_magnifierStepSize) {
                if (p_magnifierStepSize < 1) {
                    this.log(AssetPackage.Severity.Warning, "In DifficultyAdapterElo.MagnifierStepSize: The magnifier step size '"
                        + p_magnifierStepSize + "' should be equal to or higher than 1.");
                }
                else {
                    this.magnifierStepSize = p_magnifierStepSize;
                }
            },
            enumerable: true,
            configurable: true
        });
        /// <summary>
        /// Sets the magnifier step size to its default value.
        /// </summary>
        DifficultyAdapterElo.prototype.setDefaultMagnifierStepSize = function () {
            this.MagnifierStepSize = DifficultyAdapterElo.MAGNIFIER_STEP_SIZE;
        };
        DifficultyAdapterElo.prototype.InitSettings = function (p_asset) {
            _super.prototype.InitSettings.call(this, p_asset); // [ASSET]
        };
        ////// END: constructor
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: funtion for updating ratings
        /// <summary>
        /// Updates the ratings.
        /// </summary>
        /// <param name="p_playerNode">               Player node to be updated. </param>
        /// <param name="p_scenarioNode">             Scenario node to be updated. </param>
        /// <param name="p_rt">                       This param is ignored. </param>
        /// <param name="p_correctAnswer">            Player's accuracy. </param>
        /// <param name="p_updateScenarioRating">     Set to false to avoid updating scenario node. </param>
        /// <param name="p_customPlayerKfct">         If non-0 value is provided then it is used as a weight to scale change in player's rating. Otherwise, adapter calculates its own K factor. </param>
        /// <param name="p_customScenarioKfct">       If non-0 value is provided then it is used as a weight to scale change in scenario's rating. Otherwise, adapter calculates its own K factor. </param>
        /// <returns>True if updates are successfull, and false otherwise.</returns>
        DifficultyAdapterElo.prototype.UpdateRatings = function (p_playerNode, p_scenarioNode, p_rt, p_correctAnswer, p_updateScenarioRating, p_customPlayerKfct, p_customScenarioKfct) {
            if (typeof this.asset === 'undefined' || this.asset === null) {
                this.log(AssetPackage.Severity.Error, "In DifficultyAdapterElo.UpdateRatings: Unable to update ratings. Asset instance is not detected.");
                return false;
            }
            if (typeof p_playerNode === 'undefined' || p_playerNode === null) {
                this.log(AssetPackage.Severity.Error, "In DifficultyAdapterElo.UpdateRatings: Null player node.");
                return false;
            }
            if (typeof p_scenarioNode === 'undefined' || p_scenarioNode === null) {
                this.log(AssetPackage.Severity.Error, "In DifficultyAdapterElo.UpdateRatings: Null scenario node.");
                return false;
            }
            if (!this.validateCorrectAnswer(p_correctAnswer)) {
                this.log(AssetPackage.Severity.Error, "In DifficultyAdapterElo.UpdateRatings: Unable to update ratings. Invalid accuracy detected.");
                return false;
            }
            // [SC] getting player data
            var playerRating = p_playerNode.Rating;
            var playerPlayCount = p_playerNode.PlayCount;
            var playerUncertainty = p_playerNode.Uncertainty;
            var playerLastPlayed = p_playerNode.LastPlayed;
            // [SC] getting scenario data
            var scenarioRating = p_scenarioNode.Rating;
            var scenarioPlayCount = p_scenarioNode.PlayCount;
            var scenarioUncertainty = p_scenarioNode.Uncertainty;
            var scenarioLastPlayed = p_scenarioNode.LastPlayed;
            // [SC] getting current datetime
            var currDateTime = Misc.GetDateStr();
            // [SC] parsing player data
            var playerLastPlayedDays = Misc.DaysElapsed(playerLastPlayed);
            if (playerLastPlayedDays > this.MaxDelay) {
                playerLastPlayedDays = this.MaxDelay;
            }
            // [SC] parsing scenario data
            var scenarioLastPlayedDays = Misc.DaysElapsed(scenarioLastPlayed);
            if (scenarioLastPlayedDays > this.MaxDelay) {
                scenarioLastPlayedDays = this.MaxDelay;
            }
            // [SC] calculating expected scores
            var expectScore = this.calcExpectedScore(playerRating, scenarioRating);
            // [SC] calculating player and scenario uncertainties
            var playerNewUncertainty = this.calcThetaUncertainty(playerUncertainty, playerLastPlayedDays);
            var scenarioNewUncertainty = this.calcBetaUncertainty(scenarioUncertainty, scenarioLastPlayedDays);
            var playerNewKFct;
            var scenarioNewKFct;
            if (p_customPlayerKfct > 0) {
                playerNewKFct = p_customPlayerKfct;
            }
            else {
                // [SC] calculating player K factors
                playerNewKFct = this.calcThetaKFctr(playerNewUncertainty, scenarioNewUncertainty);
            }
            if (p_customScenarioKfct > 0) {
                scenarioNewKFct = p_customScenarioKfct;
            }
            else {
                // [SC] calculating scenario K factor
                scenarioNewKFct = this.calcBetaKFctr(playerNewUncertainty, scenarioNewUncertainty);
            }
            // [SC] calculating player and scenario ratings
            var playerNewRating = this.calcTheta(playerRating, playerNewKFct, p_correctAnswer, expectScore);
            var scenarioNewRating = this.calcBeta(scenarioRating, scenarioNewKFct, p_correctAnswer, expectScore);
            // [SC] updating player and scenario play counts
            var playerNewPlayCount = playerPlayCount + 1;
            var scenarioNewPlayCount = scenarioPlayCount + 1;
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
            this.asset.CreateNewRecord(this.Type, p_playerNode.GameID, p_playerNode.PlayerID, p_scenarioNode.ScenarioID, 0, p_correctAnswer, playerNewRating, scenarioNewRating, currDateTime);
            return true;
        };
        ////// END: funtion for updating ratings
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
        DifficultyAdapterElo.prototype.TargetScenario = function (p_playerNode, p_scenarioList) {
            if (typeof this.asset === 'undefined' || this.asset === null) {
                this.log(AssetPackage.Severity.Error, "In DifficultyAdapterElo.TargetScenario: Unable to recommend a scenario. Asset instance is not detected.");
                return null;
            }
            // [TODO] should check for valid adaptation IDs in the player and scenarios?
            if (typeof p_playerNode === 'undefined' || p_playerNode === null) {
                this.log(AssetPackage.Severity.Error, "In DifficultyAdapterElo.TargetScenario: Null player node. Returning null.");
                return null;
            }
            if (typeof p_scenarioList === 'undefined' || p_scenarioList === null || p_scenarioList.length === 0) {
                this.log(AssetPackage.Severity.Error, "In DifficultyAdapterElo.TargetScenario: Null or empty scenario node list. Returning null.");
                return null;
            }
            // [SC] calculate min and max possible ratings for candidate scenarios
            var ratingFI = this.calcTargetBetas(p_playerNode.Rating); // [SC][2016.12.14] fuzzy interval for rating
            // [SC] info for the scenarios within the core rating range and with the lowest play count
            var coreScenarios = new Array();
            var coreMinPlayCount = 0;
            // [SC] info for the scenarios within the support rating range and with the lowest play count
            var supportScenarios = new Array();
            var supportMinPlayCount = 0;
            // [SC] info for the closest scenarios outside of the fuzzy interval and the lowest play count
            var outScenarios = new Array();
            var outMinPlayCount = 0;
            var outMinDistance = 0;
            // [SC] iterate through the list of all scenarios
            for (var _i = 0, p_scenarioList_2 = p_scenarioList; _i < p_scenarioList_2.length; _i++) {
                var scenario = p_scenarioList_2[_i];
                var scenarioRating = scenario.Rating;
                var scenarioPlayCount = scenario.PlayCount;
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
                else if (scenarioRating >= ratingFI[0] && scenarioRating <= ratingFI[3]) {
                    if (supportScenarios.length === 0 || scenarioPlayCount < supportMinPlayCount) {
                        supportScenarios.length = 0;
                        supportScenarios.push(scenario);
                        supportMinPlayCount = scenarioPlayCount;
                    }
                    else if (scenarioPlayCount == supportMinPlayCount) {
                        supportScenarios.push(scenario);
                    }
                }
                else {
                    var distance = Math.min(Math.abs(scenarioRating - ratingFI[1]), Math.abs(scenarioRating - ratingFI[2]));
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
        };
        /// <summary>
        /// Calculates a fuzzy interval for a target beta.
        /// </summary>
        ///
        /// <param name="p_theta"> The theta. </param>
        ///
        /// <returns>
        /// A four-element array of ratings (in an ascending order) representing lower and upper bounds of the support and core
        /// </returns>
        DifficultyAdapterElo.prototype.calcTargetBetas = function (p_theta) {
            // [SC] mean of one-sided normal distribution from which to derive the lower bound of the support in a fuzzy interval
            var lower_distr_mean = this.TargetDistrMean - (this.FiSDMultiplier * this.TargetDistrSD);
            if (lower_distr_mean < BaseAdapter.DistrLowerLimit) {
                lower_distr_mean = BaseAdapter.DistrLowerLimit;
            }
            // [SC] mean of one-sided normal distribution from which to derive the upper bound of the support in a fuzzy interval
            var upper_distr_mean = this.TargetDistrMean + (this.FiSDMultiplier * this.TargetDistrSD);
            if (upper_distr_mean > BaseAdapter.DistrUpperLimit) {
                upper_distr_mean = BaseAdapter.DistrUpperLimit;
            }
            // [SC] the array stores four probabilities (in an ascending order) that represent lower and upper bounds of the support and core 
            var randNums = new Array(4);
            // [SC] calculating two probabilities as the lower and upper bounds of the core in a fuzzy interval
            var rndNum;
            for (var index = 1; index < 3; index++) {
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
                var temp = randNums[1];
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
            var lowerLimitBeta = p_theta + Math.log((1.0 - randNums[3]) / randNums[3]);
            var minBeta = p_theta + Math.log((1.0 - randNums[2]) / randNums[2]); // [SC][2016.10.07] a modified version of the equation from the original data; better suits the data
            var maxBeta = p_theta + Math.log((1.0 - randNums[1]) / randNums[1]);
            var upperLimitBeta = p_theta + Math.log((1.0 - randNums[0]) / randNums[0]);
            return new Array(lowerLimitBeta, minBeta, maxBeta, upperLimitBeta);
        };
        /// <summary>
        /// Returns target difficulty rating given a skill rating.
        /// </summary>
        /// <param name="p_theta">Skill rating.</param>
        /// <returns>Difficulty rating.</returns>
        DifficultyAdapterElo.prototype.TargetDifficultyRating = function (p_theta) {
            return p_theta + Math.log((1.0 - this.TargetDistrMean) / this.TargetDistrMean);
        };
        ////// END: functions for calculating matching scenario
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: functions for calculating expected
        /// <summary>
        /// Calculates expected score given player's skill rating and item's
        /// difficulty rating. Uses the original formula from the Elo rating system.
        /// </summary>
        ///
        /// <param name="p_playerTheta">     player's skill rating. </param>
        /// <param name="p_itemBeta">        item's difficulty rating. </param>
        ///
        /// <returns>
        /// expected score as a double.
        /// </returns>
        DifficultyAdapterElo.prototype.calcExpectedScore = function (p_playerTheta, p_itemBeta) {
            var expFctr = Math.pow(this.ExpectScoreMagnifier, (p_itemBeta - p_playerTheta) / this.MagnifierStepSize);
            return 1.0 / (1.0 + expFctr);
        };
        ////// END: functions for calculating expected
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: functions for calculating rating uncertainties
        /// <summary>
        /// Calculates a new uncertainty for the theta rating.
        /// </summary>
        ///
        /// <param name="currThetaU">       current uncertainty value for theta
        ///                                 rating. </param>
        /// <param name="currDelayCount">   the current number of consecutive days
        ///                                 the player has not played. </param>
        ///
        /// <returns>
        /// a new uncertainty value for theta rating.
        /// </returns>
        DifficultyAdapterElo.prototype.calcThetaUncertainty = function (p_currThetaU, p_currDelayCount) {
            var newThetaU = p_currThetaU - (1.0 / this.MaxPlay) + (p_currDelayCount / this.MaxDelay);
            if (newThetaU < 0) {
                newThetaU = 0.0;
            }
            else if (newThetaU > 1) {
                newThetaU = 1.0;
            }
            return newThetaU;
        };
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
        DifficultyAdapterElo.prototype.calcBetaUncertainty = function (p_currBetaU, p_currDelayCount) {
            var newBetaU = p_currBetaU - (1.0 / this.MaxPlay) + (p_currDelayCount / this.MaxDelay);
            if (newBetaU < 0) {
                newBetaU = 0.0;
            }
            else if (newBetaU > 1) {
                newBetaU = 1.0;
            }
            return newBetaU;
        };
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
        DifficultyAdapterElo.prototype.calcThetaKFctr = function (p_currThetaU, p_currBetaU) {
            return this.KConst * (1.0 + (this.KUp * p_currThetaU) - (this.KDown * p_currBetaU));
        };
        /// <summary>
        /// Calculates a new K factor for the beta rating
        /// </summary>
        /// 
        /// <param name="p_currThetaU">   current uncertainty fot the theta rating</param>
        /// <param name="p_currBetaU">    current uncertainty for the beta rating</param>
        /// 
        /// <returns>a double value of a new K factor for the beta rating</returns>
        DifficultyAdapterElo.prototype.calcBetaKFctr = function (p_currThetaU, p_currBetaU) {
            return this.KConst * (1.0 + (this.KUp * p_currBetaU) - (this.KDown * p_currThetaU));
        };
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
        DifficultyAdapterElo.prototype.calcTheta = function (p_currTheta, p_thetaKFctr, p_actualScore, p_expectScore) {
            return p_currTheta + (p_thetaKFctr * (p_actualScore - p_expectScore));
        };
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
        DifficultyAdapterElo.prototype.calcBeta = function (p_currBeta, p_betaKFctr, p_actualScore, p_expectScore) {
            return p_currBeta + (p_betaKFctr * (p_expectScore - p_actualScore));
        };
        ////// END: functions for calculating theta and beta ratings
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: tester functions
        /// <summary>
        /// Tests the validity of the value representing correctness of player's answer.
        /// </summary>
        /// 
        /// <param name="correctAnswer"> Player's answer. </param>
        /// 
        /// <returns>True if the value is valid</returns>
        DifficultyAdapterElo.prototype.validateCorrectAnswer = function (p_correctAnswer) {
            if (p_correctAnswer < 0 || p_correctAnswer > 1) {
                this.log(AssetPackage.Severity.Error, "In DifficultyAdapterElo.validateCorrectAnswer: Accuracy should be within interval [0, 1]."
                    + " Current value is '" + p_correctAnswer + "'.");
                return false;
            }
            return true;
        };
        ////// END: properties for the adapter type
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: const, fields, and properties for calculating target betas
        DifficultyAdapterElo.TARGET_DISTR_MEAN = 0.75; // [SC] default value for 'targetDistrMean' field
        DifficultyAdapterElo.TARGET_DISTR_SD = 0.1; // [SC] default value for 'targetDistrSD' field
        DifficultyAdapterElo.TARGET_LOWER_LIMIT = 0.50; // [SC] default value for 'targetLowerLimit' field
        DifficultyAdapterElo.TARGET_UPPER_LIMIT = 1.0; // [SC] default value for 'targetUpperLimit' field
        DifficultyAdapterElo.FI_SD_MULTIPLIER = 1.0; // [SC] multipler for SD used to calculate the means of normal distributions used to decide on lower and upper bounds of the supports in a fuzzy interval
        ////// END: const, fields, and properties for calculating target betas
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: const, fields, and properties for calculating rating uncertainties
        DifficultyAdapterElo.DEF_MAX_DELAY = 30; // [SC] The default value for the max number of days after which player's or item's undertainty reaches the maximum
        DifficultyAdapterElo.DEF_MAX_PLAY = 40; // [SC] The default value for the max number of administrations that should result in minimum uncertaint in item's or player's ratings
        ////// END: const, fields, and properties for calculating rating uncertainties
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: const, fields, and properties for calculating k factors
        DifficultyAdapterElo.DEF_K = 0.0075; // [SC] The default value for the K constant when there is no uncertainty
        DifficultyAdapterElo.DEF_K_UP = 4.0; // [SC] the default value for the upward uncertainty weight
        DifficultyAdapterElo.DEF_K_DOWN = 0.5; // [SC] The default value for the downward uncertainty weight
        ////// END: const, fields, and properties for calculating k factors
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: const, fields, and properties for calculating expected score
        DifficultyAdapterElo.EXPECT_SCORE_MAGNIFIER = 10; // [SC] The default value for the expected score magnifier 
        DifficultyAdapterElo.MAGNIFIER_STEP_SIZE = 2.302573; // [SC] The default value for the magnifier step size in ELO is 400; changed to match CAP difficulty rating scale
        return DifficultyAdapterElo;
    }(BaseAdapter));
    TwoAPackage.DifficultyAdapterElo = DifficultyAdapterElo;
})(TwoAPackage || (TwoAPackage = {}));
/// Copyright 2018
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
/// <reference path="../RageAssetManager/AssetManager.ts"/>
/// <reference path="../RageAssetManager/BaseAsset.ts"/>
/// <reference path="../RageAssetManager/IAsset.ts"/>
/// <reference path="../RageAssetManager/IDataStorage.ts"/>
/// <reference path="../RageAssetManager/ILog.ts"/>
///
/// <reference path="DifficultyAdapter.ts"/>
/// <reference path="DifficultyAdapterElo.ts"/>
///
var TwoAPackage;
/// Copyright 2018
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
/// <reference path="../RageAssetManager/AssetManager.ts"/>
/// <reference path="../RageAssetManager/BaseAsset.ts"/>
/// <reference path="../RageAssetManager/IAsset.ts"/>
/// <reference path="../RageAssetManager/IDataStorage.ts"/>
/// <reference path="../RageAssetManager/ILog.ts"/>
///
/// <reference path="DifficultyAdapter.ts"/>
/// <reference path="DifficultyAdapterElo.ts"/>
///
(function (TwoAPackage) {
    var BaseAsset = AssetPackage.BaseAsset;
    var Severity = AssetPackage.Severity;
    var BaseAdapter = TwoAPackage.BaseAdapter;
    var DifficultyAdapter = TwoAPackage.DifficultyAdapter;
    var DifficultyAdapterElo = TwoAPackage.DifficultyAdapterElo;
    var PlayerNode = TwoAPackage.PlayerNode;
    var ScenarioNode = TwoAPackage.ScenarioNode;
    var Gameplay = TwoAPackage.Gameplay;
    /// <summary>
    /// Export the TwoA asset
    /// </summary>
    var TwoA = /** @class */ (function (_super) {
        __extends(TwoA, _super);
        ////// END: fields
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: constructor
        /// <summary>
        /// Initialize the instance of the TwoA asset
        /// <summary>
        function TwoA() {
            var _this = _super.call(this) || this;
            _this.InitSettings();
            return _this;
        }
        /// <summary>
        /// Initialises the settings.
        /// </summary>
        TwoA.prototype.InitSettings = function () {
            // [SC] list of available players
            this.players = new Array();
            // [SC] list of available scenarios
            this.scenarios = new Array();
            // [SC] list of gameplays
            this.gameplays = new Array();
            // [SC] create the TwoA adapter
            this.adapter = new DifficultyAdapter();
            this.adapter.InitSettings(this);
            // [SC] create the TwoA-Elo adapter
            this.adapterElo = new DifficultyAdapterElo();
            this.adapterElo.InitSettings(this);
        };
        ////// END: constructor
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: Misc methods
        /// <summary>
        /// Returns a 2D array with descriptions of available adapters.
        /// The first column contains adapter IDs.
        /// The second column contains adapter descriptions.
        /// </summary>
        /// 
        /// <returns>2D array of strings</returns>
        TwoA.prototype.AvailableAdapters = function () {
            var descr = [
                [this.adapter.Type, this.adapter.Description],
                [this.adapterElo.Type, this.adapterElo.Description]
            ];
            return descr;
        };
        ////// END: Misc methods
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: Methods for target scenario retrievals
        /// <summary>
        /// Get the Target scenario ID from the adapter.
        /// </summary>
        ///
        /// <param name="p_playerNode"> Player node. </param>
        ///
        /// <returns>
        /// A string.
        /// </returns>
        TwoA.prototype.TargetScenarioID = function (p_playerNode) {
            var scenarioNode = this.TargetScenario(p_playerNode);
            if (typeof scenarioNode === 'undefined' || scenarioNode === null) {
                this.Log(Severity.Error, "In TwoA.TargetScenarioID: Unable to recommend a scenario ID. Returning null.");
                return null;
            }
            return scenarioNode.ScenarioID;
        };
        /// <summary>
        /// Get the Target scenario from the adapter.
        /// </summary>
        ///
        /// <param name="p_playerNode"> Player node. </param>
        ///
        /// <returns>
        /// ScenarioNode of the recommended scenario.
        /// </returns>
        TwoA.prototype.TargetScenario = function (p_playerNode) {
            if (typeof p_playerNode === 'undefined' || p_playerNode === null) {
                this.Log(Severity.Error, "In TwoA.TargetScenario: Null player node object. Returning null.");
                return null;
            }
            // [SC] get available scenario nodes
            var scenarioList = this.AllScenarios(p_playerNode.AdaptationID, p_playerNode.GameID);
            if (typeof scenarioList === 'undefined' || scenarioList === null || scenarioList.length === 0) {
                this.Log(Severity.Error, "In TwoA.TargetScenario: Unable to retrieve scenario node list. Returning null.");
                return null;
            }
            return this.TargetScenarioCustom(p_playerNode, scenarioList);
        };
        /// <summary>
        /// Get the Target scenario from the adapter.
        /// </summary>
        /// <param name="p_playerNode">       Player node. </param>
        /// <param name="p_scenarioList">     List of scenario nodes from which to recommend. </param>
        /// <returns>
        /// ScenarioNode of the recommended scenario.
        /// </returns>
        TwoA.prototype.TargetScenarioCustom = function (p_playerNode, p_scenarioList) {
            if (typeof p_playerNode === 'undefined' || p_playerNode === null) {
                this.Log(Severity.Error, "In TwoA.TargetScenario: Null player node object. Returning null.");
                return null;
            }
            if (typeof p_scenarioList === 'undefined' || p_scenarioList === null || p_scenarioList.length === 0) {
                this.Log(Severity.Error, "In TwoA.TargetScenario: Unable to retrieve scenario node list. Returning null.");
                return null;
            }
            if (p_playerNode.AdaptationID === this.adapter.Type) {
                return this.adapter.TargetScenario(p_playerNode, p_scenarioList);
            }
            else if (p_playerNode.AdaptationID === this.adapterElo.Type) {
                return this.adapterElo.TargetScenario(p_playerNode, p_scenarioList);
            }
            else {
                this.Log(Severity.Error, "In TwoA.TargetScenario: Unknown adapter " + p_playerNode.AdaptationID + ". Returning null.");
                return null;
            }
        };
        ////// END: Methods for target scenario retrievals
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: Methods for target difficulty rating retrieval
        /// <summary>
        /// Returns target difficulty rating given a player's skill rating.
        /// </summary>
        /// <param name="p_adaptID">          Adaptation ID.</param>
        /// <param name="p_playerRating">     Player's skill rating.</param>
        /// <returns>Difficulty rating</returns>
        TwoA.prototype.TargetDifficultyRatingCustom = function (p_adaptID, p_playerRating) {
            if (Misc.IsNullOrEmpty(p_adaptID)) {
                this.Log(Severity.Error, "In TwoA.TargetDifficultyRating: Null player node object. Returning 0.");
                return 0;
            }
            if (p_adaptID === this.adapter.Type) {
                return this.adapter.TargetDifficultyRating(p_playerRating);
            }
            else if (p_adaptID === this.adapterElo.Type) {
                return this.adapterElo.TargetDifficultyRating(p_playerRating);
            }
            else {
                this.Log(Severity.Error, "In TwoA.TargetDifficultyRating: Unknown adapter '" + p_adaptID + "'. Returning 0.");
                return 0;
            }
        };
        /// <summary>
        /// Returns target difficulty rating given a player's skill rating.
        /// </summary>
        /// <param name="p_playerNode">Player's node</param>
        /// <returns>Difficulty rating</returns>
        TwoA.prototype.TargetDifficultyRating = function (p_playerNode) {
            if (typeof p_playerNode === 'undefined' || p_playerNode === null) {
                this.Log(Severity.Error, "In TwoA.TargetDifficultyRating: Null player node object. Returning 0.");
                return 0;
            }
            return this.TargetDifficultyRatingCustom(p_playerNode.AdaptationID, p_playerNode.Rating);
        };
        ////// END: Methods for target difficulty rating retrieval
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: Methods for updating ratings
        /// <summary>
        /// Updates the ratings based on player's performance in a scenario.
        /// </summary>
        /// <param name="p_playerNode">               Player node to be updated. </param>
        /// <param name="p_scenarioNode">             Scenario node to be updated. </param>
        /// <param name="p_rt">                       Player's response time. </param>
        /// <param name="p_correctAnswer">            Player's accuracy. </param>
        /// <param name="p_updateScenarioRating">     Set to false to avoid updating scenario node. </param>
        /// <param name="p_customKfct">               If non-0 value is provided then it is used as a weight to scale changes in player's and scenario's ratings. Otherwise, adapter calculates its own K factors. </param>
        /// <returns>True if updates are successfull, and false otherwise.</returns>
        TwoA.prototype.UpdateRatings = function (p_playerNode, p_scenarioNode, p_rt, p_correctAnswer, p_updateScenarioRating, p_customKfct) {
            if (typeof p_playerNode === 'undefined' || p_playerNode === null) {
                this.Log(Severity.Error, "In TwoA.UpdateRatings: Player node is null. No update is done.");
                return false;
            }
            if (typeof p_scenarioNode === 'undefined' || p_scenarioNode === null) {
                this.Log(Severity.Error, "In TwoA.UpdateRatings: Scenario node is null. No update is done.");
                return false;
            }
            if (p_playerNode.AdaptationID !== p_scenarioNode.AdaptationID) {
                this.Log(Severity.Error, "In TwoA.UpdateRatings: Inconsistent adaptation IDs in player and scenario nodes. No update is done.");
                return false;
            }
            if (p_playerNode.GameID !== p_scenarioNode.GameID) {
                this.Log(Severity.Error, "In TwoA.UpdateRatings: Inconsistent game IDs in player and scenario nodes. No update is done.");
                return false;
            }
            if (p_playerNode.AdaptationID === this.adapter.Type) {
                return this.adapter.UpdateRatings(p_playerNode, p_scenarioNode, p_rt, p_correctAnswer, p_updateScenarioRating, p_customKfct, p_customKfct);
            }
            else if (p_playerNode.AdaptationID === this.adapterElo.Type) {
                return this.adapterElo.UpdateRatings(p_playerNode, p_scenarioNode, p_rt, p_correctAnswer, p_updateScenarioRating, p_customKfct, p_customKfct);
            }
            else {
                this.Log(Severity.Error, "In TwoA.UpdateRatings: Unknown adapter '" + p_playerNode.AdaptationID + "'. No update is done.");
                return false;
            }
        };
        /// <summary>
        /// Creates new record to the game log.
        /// </summary>
        ///
        /// <param name="p_adaptID">          Identifier for the adapt. </param>
        /// <param name="p_gameID">           Identifier for the game. </param>
        /// <param name="p_playerID">         Identifier for the player. </param>
        /// <param name="p_scenarioID">       Identifier for the scenario. </param>
        /// <param name="p_rt">               The right. </param>
        /// <param name="p_accuracy">         The correct answer. </param>
        /// <param name="p_playerRating">     The player new rating. </param>
        /// <param name="p_scenarioRating">   The scenario new rating. </param>
        /// <param name="p_timestamp">        The current date time. </param>
        TwoA.prototype.CreateNewRecord = function (p_adaptID, p_gameID, p_playerID, p_scenarioID, p_rt, p_accuracy, p_playerRating, p_scenarioRating, p_timestamp) {
            var newGameplay = new Gameplay();
            newGameplay.AdaptationID = p_adaptID;
            newGameplay.GameID = p_gameID;
            newGameplay.PlayerID = p_playerID;
            newGameplay.ScenarioID = p_scenarioID;
            newGameplay.Timestamp = p_timestamp;
            newGameplay.RT = p_rt;
            newGameplay.Accuracy = p_accuracy;
            newGameplay.PlayerRating = p_playerRating;
            newGameplay.ScenarioRating = p_scenarioRating;
            this.gameplays.push(newGameplay);
        };
        ////// END: Methods for updating ratings
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: Methods for calculating scores
        /// <summary>
        /// Calculates a normalized score based on player's performance defined by response time and accuracy.
        /// </summary>
        /// 
        /// <param name="p_correctAnswer">    1 if player provided correct answer and 0 otherwise</param>
        /// <param name="p_responseTime">     Players response time in milliseconds</param>
        /// <param name="p_itemMaxDuration">  Max allowed time in millisecond given to player to solve the problem.</param>
        /// 
        /// <returns>A score within range (-1, 1)</returns>
        TwoA.prototype.CalculateScore = function (p_correctAnswer, p_responseTime, p_itemMaxDuration) {
            /* SCORE MATRIX
             *              ----------------------------------------------
             *              | Low response  | High response | Time limit |
             *              | time          | time          | reached    |
             * -------------|---------------|---------------|------------|
             * Response = 1 | High positive | Low positive  |     0      |
             *              | score         | score         |            |
             * -------------|---------------|---------------|------------|
             * Response = 0 | High negative | Low negative  |     0      |
             *              | score         | score         |            |
             * ----------------------------------------------------------*/
            return this.adapter.calcActualScore(p_correctAnswer, p_responseTime, p_itemMaxDuration);
        };
        /// <summary>
        /// Calculates player's expected score based on player's skill rating and scenarios difficulty rating.
        /// </summary>
        /// <param name="p_adaptID">          Adaptation ID</param>
        /// <param name="p_playerRating">     Player's skill rating</param>
        /// <param name="p_scenarioRating">   Scenario's difficulty rating</param>
        /// <param name="p_itemMaxDuration">  Max allowed time in millisecond given to player to solve the problem.</param>
        /// <returns>Expected score or error code.</returns>
        TwoA.prototype.CalculateExpectedScore = function (p_adaptID, p_playerRating, p_scenarioRating, p_itemMaxDuration) {
            if (p_adaptID === this.adapter.Type) {
                return this.adapter.calcExpectedScore(p_playerRating, p_scenarioRating, p_itemMaxDuration);
            }
            else if (p_adaptID === this.adapterElo.Type) {
                return this.adapterElo.calcExpectedScore(p_playerRating, p_scenarioRating);
            }
            else {
                this.Log(Severity.Error, "In TwoA.CalculateExpectedScore: Unknown adapter '" + p_adaptID
                    + "'. No update is done. Returning error code '" + BaseAdapter.ERROR_CODE + "'.");
                return BaseAdapter.ERROR_CODE;
            }
        };
        ////// END: Methods for calculating scores
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: methods for setting adapter parameters
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: Methods for target distribution
        /// <summary>
        /// Returns the mean, sd, lower and upper limits of target distribution as an array.
        /// </summary>
        /// <param name="p_adaptID">Adapter ID.</param>
        /// <returns>An array with four elements.</returns>
        TwoA.prototype.GetTargetDistribution = function (p_adaptID) {
            if (p_adaptID === this.adapter.Type) {
                return new Array(this.adapter.TargetDistrMean, this.adapter.TargetDistrSD, this.adapter.TargetLowerLimit, this.adapter.TargetUpperLimit);
            }
            else if (p_adaptID === this.adapterElo.Type) {
                return new Array(this.adapterElo.TargetDistrMean, this.adapterElo.TargetDistrSD, this.adapterElo.TargetLowerLimit, this.adapterElo.TargetUpperLimit);
            }
            else {
                this.Log(AssetPackage.Severity.Error, "In 'TwoA.GetTargetDistribution' method: adapter ID '"
                    + p_adaptID + "' is not recognized. Returning null.");
                return null;
            }
        };
        /// <summary>
        /// Sets the target distribution parameters to custom value.
        /// </summary>
        /// <param name="p_adaptID">      Adapter ID.</param>
        /// <param name="p_mean">         Distribution mean.</param>
        /// <param name="p_sd">           Distribution standard deviation.</param>
        /// <param name="p_lowerLimit">   Distribution lower limit.</param>
        /// <param name="p_upperLimit">   Distribution upper limit.</param>
        TwoA.prototype.SetTargetDistribution = function (p_adaptID, p_mean, p_sd, p_lowerLimit, p_upperLimit) {
            if (p_adaptID === this.adapter.Type) {
                this.adapter.setTargetDistribution(p_mean, p_sd, p_lowerLimit, p_upperLimit);
            }
            else if (p_adaptID === this.adapterElo.Type) {
                this.adapterElo.setTargetDistribution(p_mean, p_sd, p_lowerLimit, p_upperLimit);
            }
            else {
                this.Log(AssetPackage.Severity.Error, "In 'TwoA.SetTargetDistribution' method: adapter ID '"
                    + p_adaptID + "' is not recognized.");
            }
        };
        /// <summary>
        /// Sets the target distribution parameters to default values.
        /// </summary>
        /// <param name="p_adaptID">  Adapter ID.</param>
        TwoA.prototype.SetDefaultTargetDistribution = function (p_adaptID) {
            if (p_adaptID === this.adapter.Type) {
                this.adapter.setDefaultTargetDistribution();
            }
            else if (p_adaptID === this.adapterElo.Type) {
                this.adapterElo.setDefaultTargetDistribution();
            }
            else {
                this.Log(AssetPackage.Severity.Error, "In 'TwoA.SetDefaultTargetDistribution' method: adapter ID '"
                    + p_adaptID + "' is not recognized.");
            }
        };
        ////// END: Methods for target distribution
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: Methods for fuzzy intervals
        /// <summary>
        /// Gets the fuzzy interval SD multiplier.
        /// </summary>
        /// <param name="p_adaptID">Adapter ID></param>
        /// <returns>Multiplier value, or 0 if the adapter is not found.</returns>
        TwoA.prototype.GetFiSDMultiplier = function (p_adaptID) {
            if (p_adaptID === this.adapter.Type) {
                return this.adapter.FiSDMultiplier;
            }
            else if (p_adaptID === this.adapterElo.Type) {
                return this.adapterElo.FiSDMultiplier;
            }
            else {
                this.Log(AssetPackage.Severity.Error, "In 'TwoA.GetFiSDMultiplier' method: adapter ID '"
                    + p_adaptID + "' is not recognized. Returning error code '"
                    + BaseAdapter.ErrorCode + "'.");
                return BaseAdapter.ErrorCode;
            }
        };
        /// <summary>
        /// Sets the fuzzy interval SD multiplier
        /// </summary>
        /// <param name="p_adaptID">      Adapter ID.</param>
        /// <param name="p_multiplier">   The value of the multiplier.</param>
        TwoA.prototype.SetFiSDMultiplier = function (p_adaptID, p_multiplier) {
            if (p_adaptID === this.adapter.Type) {
                this.adapter.FiSDMultiplier = p_multiplier;
            }
            else if (p_adaptID === this.adapterElo.Type) {
                this.adapterElo.FiSDMultiplier = p_multiplier;
            }
            else {
                this.Log(AssetPackage.Severity.Error, "In 'TwoA.SetFiSDMultiplier' method: adapter ID '"
                    + p_adaptID + "' is not recognized.");
            }
        };
        /// <summary>
        /// Sets the fuzzy interval SD multiplier to its default value.
        /// </summary>
        /// <param name="p_adaptID">Adapter ID.</param>
        TwoA.prototype.SetDefaultFiSDMultiplier = function (p_adaptID) {
            if (p_adaptID === this.adapter.Type) {
                this.adapter.setDefaultFiSDMultiplier();
            }
            else if (p_adaptID === this.adapterElo.Type) {
                this.adapterElo.setDefaultFiSDMultiplier();
            }
            else {
                this.Log(AssetPackage.Severity.Error, "In 'TwoA.SetDefaultFiSDMultiplier' method: adapter ID '"
                    + p_adaptID + "' is not recognized.");
            }
        };
        ////// END: Methods for fuzzy intervals
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: Methods for uncertainty parameters
        /// <summary>
        /// Gets the maximum delay for the uncertainty calculation.
        /// </summary>
        /// <param name="p_adaptID"> Adapter ID.</param>
        /// <returns>The number of days as double value, or 0 if adapter is not found</returns>
        TwoA.prototype.GetMaxDelay = function (p_adaptID) {
            if (p_adaptID === this.adapter.Type) {
                return this.adapter.MaxDelay;
            }
            else if (p_adaptID === this.adapterElo.Type) {
                return this.adapterElo.MaxDelay;
            }
            else {
                this.Log(AssetPackage.Severity.Error, "In 'TwoA.GetMaxDelay' method: adapter ID '" + p_adaptID
                    + "' is not recognized. Returning error code '" + BaseAdapter.ErrorCode + "'.");
                return BaseAdapter.ErrorCode;
            }
        };
        /// <summary>
        /// Sets the maximum delay for uncertainty calculation.
        /// </summary>
        /// <param name="p_adaptID">  Adapter ID.</param>
        /// <param name="p_maxDelay"> Maximum delay in days.</param>
        TwoA.prototype.SetMaxDelay = function (p_adaptID, p_maxDelay) {
            if (p_adaptID === this.adapter.Type) {
                this.adapter.MaxDelay = p_maxDelay;
            }
            else if (p_adaptID === this.adapterElo.Type) {
                this.adapterElo.MaxDelay = p_maxDelay;
            }
            else {
                this.Log(AssetPackage.Severity.Error, "In 'TwoA.SetMaxDelay' method: adapter ID '" + p_adaptID + "' is not recognized.");
            }
        };
        /// <summary>
        /// Sets the maximum delay for uncertainty calculation to its default value.
        /// </summary>
        /// <param name="p_adaptID">Adapter ID.</param>
        TwoA.prototype.SetDefaultMaxDelay = function (p_adaptID) {
            if (p_adaptID === this.adapter.Type) {
                this.adapter.setDefaultMaxDelay();
            }
            else if (p_adaptID === this.adapterElo.Type) {
                this.adapterElo.setDefaultMaxDelay();
            }
            else {
                this.Log(AssetPackage.Severity.Error, "In 'TwoA.SetDefaultMaxDelay' method: adapter ID '" + p_adaptID + "' is not recognized.");
            }
        };
        /// <summary>
        /// Get the maximum play count for uncertainty calculation.
        /// </summary>
        /// <param name="p_adaptID">Adapter ID</param>
        /// <returns>The number of play counts as double value.</returns>
        TwoA.prototype.GetMaxPlay = function (p_adaptID) {
            if (p_adaptID === this.adapter.Type) {
                return this.adapter.MaxPlay;
            }
            else if (p_adaptID === this.adapterElo.Type) {
                return this.adapterElo.MaxPlay;
            }
            else {
                this.Log(AssetPackage.Severity.Error, "In 'TwoA.GetMaxPlay' method: adapter ID '" + p_adaptID
                    + "' is not recognized. Returning error code '" + BaseAdapter.ErrorCode + "'.");
                return BaseAdapter.ErrorCode;
            }
        };
        /// <summary>
        /// Set the maximum play count for uncertainty calculation.
        /// </summary>
        /// <param name="p_adaptID">  Adapter ID</param>
        /// <param name="p_maxPlay">  Max play count</param>
        TwoA.prototype.SetMaxPlay = function (p_adaptID, p_maxPlay) {
            if (p_adaptID === this.adapter.Type) {
                this.adapter.MaxPlay = p_maxPlay;
            }
            else if (p_adaptID === this.adapterElo.Type) {
                this.adapterElo.MaxPlay = p_maxPlay;
            }
            else {
                this.Log(AssetPackage.Severity.Error, "In 'TwoA.SetMaxPlay' method: adapter ID '" + p_adaptID + "' is not recognized.");
            }
        };
        /// <summary>
        /// Sets the maximum play count to its default value.
        /// </summary>
        /// <param name="p_adaptID">Adapter ID</param>
        TwoA.prototype.SetDefaultMaxPlay = function (p_adaptID) {
            if (p_adaptID === this.adapter.Type) {
                this.adapter.setDefaultMaxPlay();
            }
            else if (p_adaptID === this.adapterElo.Type) {
                this.adapterElo.setDefaultMaxPlay();
            }
            else {
                this.Log(AssetPackage.Severity.Error, "In 'TwoA.SetDefaultMaxPlay' method: adapter ID '" + p_adaptID + "' is not recognized.");
            }
        };
        ////// END: Methods for uncertainty parameters
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: Methods for K factor
        /// <summary>
        /// Get the K constant
        /// </summary>
        /// <param name="p_adaptID">Adapter ID</param>
        /// <returns>K constant as double value</returns>
        TwoA.prototype.GetKConst = function (p_adaptID) {
            if (p_adaptID === this.adapter.Type) {
                return this.adapter.KConst;
            }
            else if (p_adaptID === this.adapterElo.Type) {
                return this.adapterElo.KConst;
            }
            else {
                this.Log(AssetPackage.Severity.Error, "In 'TwoA.GetKConst' method: adapter ID '" + p_adaptID
                    + "' is not recognized. Returning error code '" + BaseAdapter.ErrorCode + "'.");
                return BaseAdapter.ErrorCode;
            }
        };
        /// <summary>
        /// Set the K constant value
        /// </summary>
        /// <param name="p_adaptID">  Adapter ID</param>
        /// <param name="p_kConst">   The value of the K constant</param>
        TwoA.prototype.SetKConst = function (p_adaptID, p_kConst) {
            if (p_adaptID === this.adapter.Type) {
                this.adapter.KConst = p_kConst;
            }
            else if (p_adaptID === this.adapterElo.Type) {
                this.adapterElo.KConst = p_kConst;
            }
            else {
                this.Log(AssetPackage.Severity.Error, "In 'TwoA.SetKConst' method: adapter ID '" + p_adaptID + "' is not recognized.");
            }
        };
        /// <summary>
        /// Sets the K constant to its default value.
        /// </summary>
        /// <param name="p_adaptID">Adapter ID</param>
        TwoA.prototype.SetDefaultKConst = function (p_adaptID) {
            if (p_adaptID === this.adapter.Type) {
                this.adapter.setDefaultKConst();
            }
            else if (p_adaptID === this.adapterElo.Type) {
                this.adapterElo.setDefaultKConst();
            }
            else {
                this.Log(AssetPackage.Severity.Error, "In 'TwoA.SetDefaultKConst' method: adapter ID '" + p_adaptID + "' is not recognized.");
            }
        };
        /// <summary>
        /// Get the value of the upward uncertainty weight.
        /// </summary>
        /// <param name="p_adaptID">Adapter ID</param>
        /// <returns>Upward uncertainty weight as double value</returns>
        TwoA.prototype.GetKUp = function (p_adaptID) {
            if (p_adaptID === this.adapter.Type) {
                return this.adapter.KUp;
            }
            else if (p_adaptID === this.adapterElo.Type) {
                return this.adapterElo.KUp;
            }
            else {
                this.Log(AssetPackage.Severity.Error, "In 'TwoA.GetKUp' method: adapter ID '" + p_adaptID
                    + "' is not recognized. Returning error code '" + BaseAdapter.ErrorCode + "'.");
                return BaseAdapter.ErrorCode;
            }
        };
        /// <summary>
        /// Set the value for the upward uncertainty weight.
        /// </summary>
        /// <param name="p_adaptID">  Adapter ID</param>
        /// <param name="p_kUp">      Weight value</param>
        TwoA.prototype.SetKUp = function (p_adaptID, p_kUp) {
            if (p_adaptID === this.adapter.Type) {
                this.adapter.KUp = p_kUp;
            }
            else if (p_adaptID === this.adapterElo.Type) {
                this.adapterElo.KUp = p_kUp;
            }
            else {
                this.Log(AssetPackage.Severity.Error, "In 'TwoA.SetKUp' method: adapter ID '" + p_adaptID + "' is not recognized.");
            }
        };
        /// <summary>
        /// Set the upward uncertainty weight to its default value.
        /// </summary>
        /// <param name="p_adaptID">Adapter ID</param>
        TwoA.prototype.SetDefaultKUp = function (p_adaptID) {
            if (p_adaptID === this.adapter.Type) {
                this.adapter.setDefaultKUp();
            }
            else if (p_adaptID === this.adapterElo.Type) {
                this.adapterElo.setDefaultKUp();
            }
            else {
                this.Log(AssetPackage.Severity.Error, "In 'TwoA.SetDefaultKUp' method: adapter ID '" + p_adaptID + "' is not recognized.");
            }
        };
        /// <summary>
        /// Get the value of the downward uncertainty weight.
        /// </summary>
        /// <param name="p_adaptID">Adapter ID</param>
        /// <returns>Weight value as double number</returns>
        TwoA.prototype.GetKDown = function (p_adaptID) {
            if (p_adaptID === this.adapter.Type) {
                return this.adapter.KDown;
            }
            else if (p_adaptID === this.adapterElo.Type) {
                return this.adapterElo.KDown;
            }
            else {
                this.Log(AssetPackage.Severity.Error, "In 'TwoA.GetKDown' method: adapter ID '" + p_adaptID
                    + "' is not recognized. Returning error code '" + BaseAdapter.ErrorCode + "'.");
                return BaseAdapter.ErrorCode;
            }
        };
        /// <summary>
        /// Set the value of the downward uncertainty weight.
        /// </summary>
        /// <param name="p_adaptID">  Adapter ID</param>
        /// <param name="p_kDown">    Weight value</param>
        TwoA.prototype.SetKDown = function (p_adaptID, p_kDown) {
            if (p_adaptID === this.adapter.Type) {
                this.adapter.KDown = p_kDown;
            }
            else if (p_adaptID === this.adapterElo.Type) {
                this.adapterElo.KDown = p_kDown;
            }
            else {
                this.Log(AssetPackage.Severity.Error, "In 'TwoA.SetKDown' method: adapter ID '" + p_adaptID + "' is not recognized.");
            }
        };
        /// <summary>
        /// Sets the downward uncertainty weight to its default value.
        /// </summary>
        /// <param name="p_adaptID">Adapter ID</param>
        TwoA.prototype.SetDefaultKDown = function (p_adaptID) {
            if (p_adaptID === this.adapter.Type) {
                this.adapter.setDefaultKDown();
            }
            else if (p_adaptID === this.adapterElo.Type) {
                this.adapterElo.setDefaultKDown();
            }
            else {
                this.Log(AssetPackage.Severity.Error, "In 'TwoA.SetDefaultKDown' method: adapter ID '" + p_adaptID + "' is not recognized.");
            }
        };
        ////// END: Methods for K factor
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: Methods for Elo-based expected score params
        /// <summary>
        /// Get the value of the expected score magnifier
        /// </summary>
        /// <param name="p_adaptID">Adapter ID</param>
        /// <returns>Magnifier as double value</returns>
        TwoA.prototype.GetExpectScoreMagnifier = function (p_adaptID) {
            if (p_adaptID === this.adapterElo.Type) {
                return this.adapterElo.ExpectScoreMagnifier;
            }
            else {
                this.Log(AssetPackage.Severity.Error, "In 'TwoA.GetExpectScoreMagnifier' method: adapter ID '" + p_adaptID
                    + "' is not recognized. Returning error code '" + BaseAdapter.ErrorCode + "'.");
                return BaseAdapter.ErrorCode;
            }
        };
        /// <summary>
        /// Set the value of the expected score magnifier.
        /// </summary>
        /// <param name="p_adaptID">              Adapter ID</param>
        /// <param name="p_expectScoreMagnifier"> The value for the magnifier</param>
        TwoA.prototype.SetExpectScoreMagnifier = function (p_adaptID, p_expectScoreMagnifier) {
            if (p_adaptID === this.adapterElo.Type) {
                this.adapterElo.ExpectScoreMagnifier = p_expectScoreMagnifier;
            }
            else {
                this.Log(AssetPackage.Severity.Error, "In 'TwoA.SetExpectScoreMagnifier' method: adapter ID '" + p_adaptID + "' is not recognized.");
            }
        };
        /// <summary>
        /// Sets the expected score magnifier to its default value.
        /// </summary>
        /// <param name="p_adaptID">Adapter ID</param>
        TwoA.prototype.SetDefaultExpectScoreMagnifier = function (p_adaptID) {
            if (p_adaptID === this.adapterElo.Type) {
                this.adapterElo.setDefaultExpectScoreMagnifier();
            }
            else {
                this.Log(AssetPackage.Severity.Error, "In 'TwoA.SetDefaultExpectScoreMagnifier' method: adapter ID '" + p_adaptID + "' is not recognized.");
            }
        };
        /// <summary>
        /// Get the value of the magnifier step size.
        /// </summary>
        /// <param name="p_adaptID">Adapter ID</param>
        /// <returns>Magnifier step size as double value</returns>
        TwoA.prototype.GetMagnifierStepSize = function (p_adaptID) {
            if (p_adaptID === this.adapterElo.Type) {
                return this.adapterElo.MagnifierStepSize;
            }
            else {
                this.Log(AssetPackage.Severity.Error, "In 'TwoA.GetMagnifierStepSize' method: adapter ID '" + p_adaptID
                    + "' is not recognized. Returning error code '" + BaseAdapter.ErrorCode + "'.");
                return BaseAdapter.ErrorCode;
            }
        };
        /// <summary>
        /// Set the value of teh magnifier step size.
        /// </summary>
        /// <param name="p_adaptID">              Adapter ID</param>
        /// <param name="p_magnifierStepSize">    The value of the magnifier step size</param>
        TwoA.prototype.SetMagnifierStepSize = function (p_adaptID, p_magnifierStepSize) {
            if (p_adaptID === this.adapterElo.Type) {
                this.adapterElo.MagnifierStepSize = p_magnifierStepSize;
            }
            else {
                this.Log(AssetPackage.Severity.Error, "In 'TwoA.SetMagnifierStepSize' method: adapter ID '" + p_adaptID + "' is not recognized.");
            }
        };
        /// <summary>
        /// Sets the magnifier step size to its default value.
        /// </summary>
        /// <param name="p_adaptID">Adapter ID</param>
        TwoA.prototype.SetDefaultMagnifierStepSize = function (p_adaptID) {
            if (p_adaptID === this.adapterElo.Type) {
                this.adapterElo.setDefaultMagnifierStepSize();
            }
            else {
                this.Log(AssetPackage.Severity.Error, "In 'TwoA.SetDefaultMagnifierStepSize' method: adapter ID '" + p_adaptID + "' is not recognized.");
            }
        };
        ////// END: Methods for Elo-based expected score params
        //////////////////////////////////////////////////////////////////////////////////////
        ////// END: methods for setting adapter parameters
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: methods for player data
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: Player param getters
        // [2016.11.14]
        /// <summary>
        /// Get a value of Rating for a player.
        /// </summary>
        /// 
        /// <exception cref="NullReferenceException">    Thrown when matching player is not found 
        ///                                              and null is returned. </exception>
        /// 
        /// <param name="p_adaptID">      Identifier for the adapt. </param>
        /// <param name="p_gameID">       Identifier for the game. </param>
        /// <param name="p_playerID">     Identifier for the player. </param>
        /// 
        /// <returns>
        /// Rating as double value.
        /// </returns>
        TwoA.prototype.GetPlayerRating = function (p_adaptID, p_gameID, p_playerID) {
            var player = this.Player(p_adaptID, p_gameID, p_playerID, true);
            if (typeof player === 'undefined' || player === null) {
                this.Log(AssetPackage.Severity.Error, "Unable to get Rating for player '" + p_playerID
                    + "' for adaptation '" + p_adaptID + "' in game '" + p_gameID + "'.");
                throw new ReferenceError(); // [TODO]
            }
            else {
                return player.Rating;
            }
        };
        // [2016.11.14]
        /// <summary>
        /// Get a value of PlayCount for a player.
        /// </summary>
        /// 
        /// <exception cref="NullReferenceException">    Thrown when matching player is not found 
        ///                                              and null is returned. </exception>
        /// 
        /// <param name="p_adaptID">      Identifier for the adapt. </param>
        /// <param name="p_gameID">       Identifier for the game. </param>
        /// <param name="p_playerID">     Identifier for the player. </param>
        /// 
        /// <returns>
        /// PlayCount as double value.
        /// </returns>
        TwoA.prototype.GetPlayerPlayCount = function (p_adaptID, p_gameID, p_playerID) {
            var player = this.Player(p_adaptID, p_gameID, p_playerID, true);
            if (typeof player === 'undefined' || player === null) {
                this.Log(AssetPackage.Severity.Error, "Unable to get PlayCount for player '" + p_playerID
                    + "' for adaptation '" + p_adaptID + "' in game '" + p_gameID + "'.");
                throw new ReferenceError(); // [TODO]
            }
            else {
                return player.PlayCount;
            }
        };
        // [2016.11.14]
        /// <summary>
        /// Get a value of KFactor for a player.
        /// </summary>
        /// 
        /// <exception cref="NullReferenceException">    Thrown when matching player is not found 
        ///                                              and null is returned. </exception>
        /// 
        /// <param name="p_adaptID">      Identifier for the adapt. </param>
        /// <param name="p_gameID">       Identifier for the game. </param>
        /// <param name="p_playerID">     Identifier for the player. </param>
        /// 
        /// <returns>
        /// KFactor as double value.
        /// </returns>
        TwoA.prototype.GetPlayerKFactor = function (p_adaptID, p_gameID, p_playerID) {
            var player = this.Player(p_adaptID, p_gameID, p_playerID, true);
            if (typeof player === 'undefined' || player === null) {
                this.Log(AssetPackage.Severity.Error, "Unable to get KFactor for player '" + p_playerID
                    + "' for adaptation '" + p_adaptID + "' in game '" + p_gameID + "'.");
                throw new ReferenceError(); // [TODO]
            }
            else {
                return player.KFactor;
            }
        };
        // [2016.11.14]
        /// <summary>
        /// Get a value of Uncertainty for a player.
        /// </summary>
        /// 
        /// <exception cref="NullReferenceException">    Thrown when matching player is not found 
        ///                                              and null is returned. </exception>
        /// 
        /// <param name="p_adaptID">      Identifier for the adapt. </param>
        /// <param name="p_gameID">       Identifier for the game. </param>
        /// <param name="p_playerID">     Identifier for the player. </param>
        /// 
        /// <returns>
        /// Uncertainty as double value.
        /// </returns>
        TwoA.prototype.GetPlayerUncertainty = function (p_adaptID, p_gameID, p_playerID) {
            var player = this.Player(p_adaptID, p_gameID, p_playerID, true);
            if (typeof player === 'undefined' || player === null) {
                this.Log(AssetPackage.Severity.Error, "Unable to get Uncertainty for player '" + p_playerID
                    + "' for adaptation '" + p_adaptID + "' in game '" + p_gameID + "'.");
                throw new ReferenceError(); // [TODO]
            }
            else {
                return player.Uncertainty;
            }
        };
        // [2016.11.14]
        /// <summary>
        /// Get a value of LastPlayed for a player.
        /// </summary>
        /// 
        /// <exception cref="NullReferenceException">    Thrown when matching player is not found 
        ///                                              and null is returned. </exception>
        /// 
        /// <param name="p_adaptID">      Identifier for the adapt. </param>
        /// <param name="p_gameID">       Identifier for the game. </param>
        /// <param name="p_playerID">     Identifier for the player. </param>
        /// 
        /// <returns>
        /// LastPlayed as string DateTime object.
        /// </returns>
        TwoA.prototype.GetPlayerLastPlayed = function (p_adaptID, p_gameID, p_playerID) {
            var player = this.Player(p_adaptID, p_gameID, p_playerID, true);
            if (typeof player === 'undefined' || player === null) {
                this.Log(AssetPackage.Severity.Error, "Unable to get LastPlayed for player '" + p_playerID
                    + "' for adaptation '" + p_adaptID + "' in game '" + p_gameID + "'.");
                throw new ReferenceError(); // [TODO]
            }
            else {
                return player.LastPlayed;
            }
        };
        ////// END: Player param getters
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: Player param setters
        /// <summary>
        /// Set a Rating value for a player.
        /// </summary>
        /// 
        /// <param name="p_adaptID">      Identifier for the adapt. </param>
        /// <param name="p_gameID">       Identifier for the game. </param>
        /// <param name="p_playerID">     Identifier for the player. </param>
        /// <param name="p_rating">       The value of Rating. </param>
        /// 
        /// <returns>
        /// True if value was changed, false otherwise.
        /// </returns>
        TwoA.prototype.SetPlayerRating = function (p_adaptID, p_gameID, p_playerID, p_rating) {
            var player = this.Player(p_adaptID, p_gameID, p_playerID, true);
            if (typeof player === 'undefined' || player === null) {
                this.Log(AssetPackage.Severity.Error, "Unable to set Rating for player '" + p_playerID
                    + "' for adaptation '" + p_adaptID + "' in game '" + p_gameID + "'. Player not found.");
                return false;
            }
            player.Rating = p_rating;
            return true;
        };
        /// <summary>
        /// Set a PlayCount value for a player.
        /// </summary>
        /// 
        /// <param name="p_adaptID">      Identifier for the adapt. </param>
        /// <param name="p_gameID">       Identifier for the game. </param>
        /// <param name="p_playerID">     Identifier for the player. </param>
        /// <param name="p_playCount">    The value of PlayCount. </param>
        /// 
        /// <returns>
        /// True if value was changed, false otherwise.
        /// </returns>
        TwoA.prototype.SetPlayerPlayCount = function (p_adaptID, p_gameID, p_playerID, p_playCount) {
            var player = this.Player(p_adaptID, p_gameID, p_playerID, true);
            if (typeof player === 'undefined' || player === null) {
                this.Log(AssetPackage.Severity.Error, "Unable to set PlayCount for player '" + p_playerID
                    + "' for adaptation '" + p_adaptID + "' in game '" + p_gameID + "'. Player not found.");
                return false;
            }
            if (!this.IsValidPlayCount(p_playCount)) {
                this.Log(Severity.Error, "Unable to set PlayCount for player '" + p_playerID
                    + "' for adaptation '" + p_adaptID + "' in game '" + p_gameID + "'. Invalid play count.");
                return false;
            }
            player.PlayCount = p_playCount;
            return true;
        };
        /// <summary>
        /// Set a KFactor value for a player.
        /// </summary>
        /// 
        /// <param name="p_adaptID">      Identifier for the adapt. </param>
        /// <param name="p_gameID">       Identifier for the game. </param>
        /// <param name="p_playerID">     Identifier for the player. </param>
        /// <param name="p_kFactor">      The value of KFactor. </param>
        /// 
        /// <returns>
        /// True if value was changed, false otherwise.
        /// </returns>
        TwoA.prototype.SetPlayerKFactor = function (p_adaptID, p_gameID, p_playerID, p_kFactor) {
            var player = this.Player(p_adaptID, p_gameID, p_playerID, true);
            if (typeof player === 'undefined' || player === null) {
                this.Log(AssetPackage.Severity.Error, "Unable to set KFactor for player '" + p_playerID
                    + "' for adaptation '" + p_adaptID + "' in game '" + p_gameID + "'. Player not found.");
                return false;
            }
            if (!this.IsValidKFactor(p_kFactor)) {
                this.Log(Severity.Error, "Unable to set KFactor for player '" + p_playerID
                    + "' for adaptation '" + p_adaptID + "' in game '" + p_gameID + "'. Invalid K factor.");
                return false;
            }
            player.KFactor = p_kFactor;
            return true;
        };
        /// <summary>
        /// Set an Uncertainty value for a player.
        /// </summary>
        /// 
        /// <param name="p_adaptID">      Identifier for the adapt. </param>
        /// <param name="p_gameID">       Identifier for the game. </param>
        /// <param name="p_playerID">     Identifier for the player. </param>
        /// <param name="p_uncertainty">  The value of Uncertainty. </param>
        /// 
        /// <returns>
        /// True if value was changed, false otherwise.
        /// </returns>
        TwoA.prototype.SetPlayerUncertainty = function (p_adaptID, p_gameID, p_playerID, p_uncertainty) {
            var player = this.Player(p_adaptID, p_gameID, p_playerID, true);
            if (typeof player === 'undefined' || player === null) {
                this.Log(AssetPackage.Severity.Error, "Unable to set Uncertainty for player '" + p_playerID
                    + "' for adaptation '" + p_adaptID + "' in game '" + p_gameID + "'. Player not found.");
                return false;
            }
            if (!this.IsValidUncertainty(p_uncertainty)) {
                this.Log(Severity.Error, "Unable to set Uncertainty for player '" + p_playerID
                    + "' for adaptation '" + p_adaptID + "' in game '" + p_gameID + "'. Invalid uncertainty.");
                return false;
            }
            player.Uncertainty = p_uncertainty;
            return true;
        };
        /// <summary>
        /// Set a LastPlayed datetime for a player.
        /// </summary>
        /// 
        /// <param name="p_adaptID">      Identifier for the adapt. </param>
        /// <param name="p_gameID">       Identifier for the game. </param>
        /// <param name="p_playerID">     Identifier for the player. </param>
        /// <param name="p_lastPlayed">   The DateTime object for LastPlayed datetime. </param>
        /// 
        /// <returns>
        /// True if value was changed, false otherwise.
        /// </returns>
        TwoA.prototype.SetPlayerLastPlayed = function (p_adaptID, p_gameID, p_playerID, p_lastPlayed) {
            var player = this.Player(p_adaptID, p_gameID, p_playerID, true);
            if (typeof player === 'undefined' || player === null) {
                this.Log(AssetPackage.Severity.Error, "Unable to set LastPlayed for player '" + p_playerID
                    + "' for adaptation '" + p_adaptID + "' in game '" + p_gameID + "'. Player not found.");
                return false;
            }
            if (Misc.IsNullOrEmpty(p_lastPlayed)) {
                this.Log(Severity.Error, "Unable to set LastPlayed for player '" + p_playerID
                    + "' for adaptation '" + p_adaptID + "' in game '" + p_gameID + "'. Null date object.");
                return false;
            }
            player.LastPlayed = p_lastPlayed;
            return true;
        };
        ////// END: Player param setters
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: PlayerNode adders
        /// <summary>
        /// Add a new player node.
        /// </summary>
        /// <param name="p_playerNode">New player node.</param>
        /// <returns>True if new player node was added and false otherwise.</returns>
        TwoA.prototype.AddPlayerNode = function (p_playerNode) {
            if (Misc.IsNullOrEmpty(p_playerNode.AdaptationID)) {
                this.Log(Severity.Error, "In TwoA.AddPlayer: Cannot add player. Adaptation ID is null or empty string.");
                return false;
            }
            if (Misc.IsNullOrEmpty(p_playerNode.GameID)) {
                this.Log(Severity.Error, "In TwoA.AddPlayer: Cannot add player. Game ID is null or empty string.");
                return false;
            }
            if (Misc.IsNullOrEmpty(p_playerNode.PlayerID)) {
                this.Log(Severity.Error, "In TwoA.AddPlayer: Cannot add player. Player ID is null or empty string.");
                return false;
            }
            if (this.Player(p_playerNode.AdaptationID, p_playerNode.GameID, p_playerNode.PlayerID, false) !== null) {
                this.Log(Severity.Error, "In TwoA.AddPlayer: Cannot add player. Player '" + p_playerNode.PlayerID
                    + "' in game '" + p_playerNode.GameID + "' with adaptation '" + p_playerNode.AdaptationID + "' already exists.");
                return false;
            }
            if (!this.IsValidPlayCount(p_playerNode.PlayCount)) {
                this.Log(Severity.Error, "In TwoA.AddPlayer: Cannot add player. Invalid play count.");
                return false;
            }
            if (!this.IsValidKFactor(p_playerNode.KFactor)) {
                this.Log(Severity.Error, "In TwoA.AddPlayer: Cannot add player. Invalid K factor.");
                return false;
            }
            if (!this.IsValidUncertainty(p_playerNode.Uncertainty)) {
                this.Log(Severity.Error, "In TwoA.AddPlayer: Cannot add player. Invalid uncertainty.");
                return false;
            }
            if (Misc.IsNullOrEmpty(p_playerNode.LastPlayed)) {
                this.Log(Severity.Error, "In TwoA.AddPlayer: Cannot add player. Null or empty string for last played date.");
                return false;
            }
            this.players.push(p_playerNode);
            return true;
        };
        /// <summary>
        /// Add a new player node with custom parameters.
        /// </summary>
        /// <param name="p_adaptID">Adaptation ID.</param>
        /// <param name="p_gameID">Game ID.</param>
        /// <param name="p_playerID">Player ID.</param>
        /// <param name="p_rating">Player's skill rating.</param>
        /// <param name="p_playCount">The number of past games played by the player.</param>
        /// <param name="p_kFactor">Player's K factor.</param>
        /// <param name="p_uncertainty">Player's uncertainty.</param>
        /// <param name="p_lastPlayed">The datetime the player played the last game. Should have 'yyyy-MM-ddThh:mm:ss' format.</param>
        /// <returns>True if new player node was added and false otherwise.</returns>
        TwoA.prototype.AddPlayer = function (p_adaptID, p_gameID, p_playerID, p_rating, p_playCount, p_kFactor, p_uncertainty, p_lastPlayed) {
            var newPlayerNode = new PlayerNode(p_adaptID, p_gameID, p_playerID);
            newPlayerNode.Rating = p_rating;
            newPlayerNode.PlayCount = p_playCount;
            newPlayerNode.KFactor = p_kFactor;
            newPlayerNode.Uncertainty = p_uncertainty;
            newPlayerNode.LastPlayed = p_lastPlayed;
            if (this.AddPlayerNode(newPlayerNode)) {
                return newPlayerNode;
            }
            else {
                return null;
            }
        };
        /// <summary>
        /// Add a new player node with default parameters.
        /// </summary>
        /// <param name="p_adaptID">Adaptation ID.</param>
        /// <param name="p_gameID">Game ID.</param>
        /// <param name="p_playerID">Player ID.</param>
        /// <returns>True if new player node was added and false otherwise.</returns>
        TwoA.prototype.AddPlayerDefault = function (p_adaptID, p_gameID, p_playerID) {
            return this.AddPlayer(p_adaptID, p_gameID, p_playerID, BaseAdapter.INITIAL_RATING, 0, BaseAdapter.INITIAL_K_FCT, BaseAdapter.INITIAL_UNCERTAINTY, BaseAdapter.DEFAULT_DATETIME);
        };
        ////// END: PlayerNode adders
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: PlayerNode getter
        /// <summary>
        /// Get a PlayerNode with a given player ID.
        /// </summary>
        ///
        /// <param name="p_adaptID">  Identifier for the adapt. </param>
        /// <param name="p_gameID">   Identifier for the game. </param>
        /// <param name="p_playerID"> Identifier for the player. </param>
        ///
        /// <returns>
        /// PlayerNode object, or null if no ID match is found.
        /// </returns>
        TwoA.prototype.Player = function (p_adaptID, p_gameID, p_playerID, p_showWarning) {
            if (p_showWarning === void 0) { p_showWarning = true; }
            if (Misc.IsNullOrEmpty(p_adaptID) || Misc.IsNullOrEmpty(p_gameID) || Misc.IsNullOrEmpty(p_playerID)) {
                if (p_showWarning) {
                    this.Log(Severity.Error, "In TwoA.Player method: one or more parameters are null. Expected string values. Returning null.");
                }
                return null;
            }
            for (var _i = 0, _a = this.players; _i < _a.length; _i++) {
                var player = _a[_i];
                if (player.AdaptationID === p_adaptID && player.GameID === p_gameID && player.PlayerID === p_playerID) {
                    return player;
                }
            }
            if (p_showWarning) {
                this.Log(Severity.Error, "In TwoA.Player method: Player not found. Returning null.");
            }
            return null;
        };
        /// <summary>
        /// Gets a list of all player nodes.
        /// </summary>
        ///
        /// <param name="p_adaptID"> Identifier for the adapt. </param>
        /// <param name="p_gameID">  Identifier for the game. </param>
        ///
        /// <returns>
        /// List of PlayerNode instances.
        /// </returns>
        TwoA.prototype.AllPlayers = function (p_adaptID, p_gameID) {
            if (Misc.IsNullOrEmpty(p_adaptID) || Misc.IsNullOrEmpty(p_gameID)) {
                this.Log(Severity.Error, "In TwoA.AllPlayers method: one or more parameters are null. Expected string values. Returning null.");
                return null;
            }
            var matchingPlayers = new Array();
            for (var _i = 0, _a = this.players; _i < _a.length; _i++) {
                var player = _a[_i];
                if (player.AdaptationID === p_adaptID && player.GameID === p_gameID) {
                    matchingPlayers.push(player);
                }
            }
            if (matchingPlayers.length === 0) {
                this.Log(Severity.Error, "In TwoA.AllPlayers method: Unable to retrieve players for game '"
                    + p_gameID + "' with adaptation '" + p_adaptID + "'. No matching scenarios.");
                return null;
            }
            return matchingPlayers.sort(function (playerOne, playerTwo) {
                if (playerOne.Rating < playerTwo.Rating) {
                    return -1;
                }
                else if (playerOne.Rating > playerTwo.Rating) {
                    return 1;
                }
                else {
                    return 0;
                }
            });
        };
        ////// END: PlayerNode getter
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: PlayerNode removers
        /// [TODO] rather inefficient
        /// <summary>
        /// Removes a specified player.
        /// </summary>
        /// <param name="p_adaptID">Adaptation ID</param>
        /// <param name="p_gameID">Game ID</param>
        /// <param name="p_playerID">Player ID</param>
        /// <returns>True if the player was removed, and false otherwise.</returns>
        TwoA.prototype.RemovePlayer = function (p_adaptID, p_gameID, p_playerID) {
            return this.RemovePlayerNode(this.Player(p_adaptID, p_gameID, p_playerID, true));
        };
        /// <summary>
        /// Removes a specified player.
        /// </summary>
        /// <param name="playerNode">PlayerNode instance to remove.</param>
        /// <returns>True if player was removed, and false otherwise.</returns>
        TwoA.prototype.RemovePlayerNode = function (p_playerNode) {
            if (typeof p_playerNode === 'undefined' || p_playerNode === null) {
                this.Log(Severity.Error, "In TwoA.RemovePlayer: Cannot remove player. The playerNode parameter is null.");
                return false;
            }
            var index = this.players.indexOf(p_playerNode, 0);
            if (index < 0) {
                this.Log(Severity.Error, "In TwoA.RemovePlayer: Cannot remove player. The playerNode was not found.");
                return false;
            }
            this.players.splice(index, 1);
            return true;
        };
        ////// END: PlayerNode removers
        //////////////////////////////////////////////////////////////////////////////////////
        ////// END: methods for player data
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: methods for scenario data
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: Scenario param getters
        // [2016.11.14]
        /// <summary>
        /// Get a value of Rating for a scenario.
        /// </summary>
        /// 
        /// <exception cref="NullReferenceException">    Thrown when matching scenario is not found 
        ///                                              and null is returned. </exception>
        /// 
        /// <param name="p_adaptID">      Identifier for the adapt. </param>
        /// <param name="p_gameID">       Identifier for the game. </param>
        /// <param name="p_scenarioID">   Identifier for the scenario. </param>
        /// 
        /// <returns>
        /// Rating as double value.
        /// </returns>
        TwoA.prototype.GetScenarioRating = function (p_adaptID, p_gameID, p_scenarioID) {
            var scenario = this.Scenario(p_adaptID, p_gameID, p_scenarioID, true);
            if (typeof scenario === 'undefined' || scenario === null) {
                this.Log(Severity.Error, "Unable to get Rating for scenario '" + p_scenarioID
                    + "' for adaptation '" + p_adaptID + "' in game '" + p_gameID + "'."); // [TODO]
                throw new ReferenceError(); // [TODO]
            }
            else {
                return scenario.Rating;
            }
        };
        // [2016.11.14]
        /// <summary>
        /// Get a value of PlayCount for a scenario.
        /// </summary>
        /// 
        /// <exception cref="NullReferenceException">    Thrown when matching scenario is not found 
        ///                                              and null is returned. </exception>
        /// 
        /// <param name="p_adaptID">      Identifier for the adapt. </param>
        /// <param name="p_gameID">       Identifier for the game. </param>
        /// <param name="p_scenarioID">   Identifier for the scenario. </param>
        /// 
        /// <returns>
        /// PlayCount as double value.
        /// </returns>
        TwoA.prototype.GetScenarioPlayCount = function (p_adaptID, p_gameID, p_scenarioID) {
            var scenario = this.Scenario(p_adaptID, p_gameID, p_scenarioID, true);
            if (typeof scenario === 'undefined' || scenario === null) {
                this.Log(Severity.Error, "Unable to get PlayCount for scenario '" + p_scenarioID
                    + "' for adaptation '" + p_adaptID + "' in game '" + p_gameID + "'."); // [TODO]
                throw new ReferenceError(); // [TODO]
            }
            else {
                return scenario.PlayCount;
            }
        };
        // [2016.11.14]
        /// <summary>
        /// Get a value of KFactor for a scenario.
        /// </summary>
        /// 
        /// <exception cref="NullReferenceException">    Thrown when matching scenario is not found 
        ///                                              and null is returned. </exception>
        /// 
        /// <param name="p_adaptID">      Identifier for the adapt. </param>
        /// <param name="p_gameID">       Identifier for the game. </param>
        /// <param name="p_scenarioID">   Identifier for the scenario. </param>
        /// 
        /// <returns>
        /// KFactor as double value.
        /// </returns>
        TwoA.prototype.GetScenarioKFactor = function (p_adaptID, p_gameID, p_scenarioID) {
            var scenario = this.Scenario(p_adaptID, p_gameID, p_scenarioID, true);
            if (typeof scenario === 'undefined' || scenario === null) {
                this.Log(Severity.Error, "Unable to get KFactor for scenario '" + p_scenarioID
                    + "' for adaptation '" + p_adaptID + "' in game '" + p_gameID + "'."); // [TODO]
                throw new ReferenceError(); // [TODO]
            }
            else {
                return scenario.KFactor;
            }
        };
        // [2016.11.14]
        /// <summary>
        /// Get a value of Uncertainty for a scenario.
        /// </summary>
        /// 
        /// <exception cref="NullReferenceException">    Thrown when matching scenario is not found 
        ///                                              and null is returned. </exception>
        /// 
        /// <param name="p_adaptID">      Identifier for the adapt. </param>
        /// <param name="p_gameID">       Identifier for the game. </param>
        /// <param name="p_scenarioID">   Identifier for the scenario. </param>
        /// 
        /// <returns>
        /// Uncertainty as double value.
        /// </returns>
        TwoA.prototype.GetScenarioUncertainty = function (p_adaptID, p_gameID, p_scenarioID) {
            var scenario = this.Scenario(p_adaptID, p_gameID, p_scenarioID, true);
            if (typeof scenario === 'undefined' || scenario === null) {
                this.Log(Severity.Error, "Unable to get Uncertainty for scenario '" + p_scenarioID
                    + "' for adaptation '" + p_adaptID + "' in game '" + p_gameID + "'."); // [TODO]
                throw new ReferenceError(); // [TODO]
            }
            else {
                return scenario.Uncertainty;
            }
        };
        // [2016.11.14]
        /// <summary>
        /// Get a value of LastPlayed for a scenario.
        /// </summary>
        /// 
        /// <exception cref="NullReferenceException">    Thrown when matching scenario is not found 
        ///                                              and null is returned. </exception>
        /// 
        /// <param name="p_adaptID">      Identifier for the adapt. </param>
        /// <param name="p_gameID">       Identifier for the game. </param>
        /// <param name="p_scenarioID">   Identifier for the scenario. </param>
        /// 
        /// <returns>
        /// LastPlayed as DateTime object.
        /// </returns>
        TwoA.prototype.GetScenarioLastPlayed = function (p_adaptID, p_gameID, p_scenarioID) {
            var scenario = this.Scenario(p_adaptID, p_gameID, p_scenarioID, true);
            if (typeof scenario === 'undefined' || scenario === null) {
                this.Log(Severity.Error, "Unable to get LastPlayed for scenario '" + p_scenarioID
                    + "' for adaptation '" + p_adaptID + "' in game '" + p_gameID + "'."); // [TODO]
                throw new ReferenceError(); // [TODO]
            }
            else {
                return scenario.LastPlayed;
            }
        };
        // [2016.11.14]
        /// <summary>
        /// Get a value of TimeLimit for a scenario.
        /// </summary>
        /// 
        /// <exception cref="NullReferenceException">    Thrown when matching scenario is not found 
        ///                                              and null is returned. </exception>
        /// 
        /// <param name="p_adaptID">      Identifier for the adapt. </param>
        /// <param name="p_gameID">       Identifier for the game. </param>
        /// <param name="p_scenarioID">   Identifier for the scenario. </param>
        /// 
        /// <returns>
        /// TimeLimit as double value.
        /// </returns>
        TwoA.prototype.GetScenarioTimeLimit = function (p_adaptID, p_gameID, p_scenarioID) {
            var scenario = this.Scenario(p_adaptID, p_gameID, p_scenarioID, true);
            if (typeof scenario === 'undefined' || scenario === null) {
                this.Log(Severity.Error, "Unable to get TimeLimit for scenario '" + p_scenarioID
                    + "' for adaptation '" + p_adaptID + "' in game '" + p_gameID + "'."); // [TODO]
                throw new ReferenceError(); // [TODO]
            }
            else {
                return scenario.TimeLimit;
            }
        };
        ////// END: Scenario param getters
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: Scenario param setters
        /// <summary>
        /// Set a Rating value for a scenario.
        /// </summary>
        /// 
        /// <param name="p_adaptID">      Identifier for the adapt. </param>
        /// <param name="p_gameID">       Identifier for the game. </param>
        /// <param name="p_scenarioID">   Identifier for the scenario. </param>
        /// <param name="p_rating">       The value of Rating. </param>
        /// 
        /// <returns>
        /// True if value was changed, false otherwise.
        /// </returns>
        TwoA.prototype.SetScenarioRating = function (p_adaptID, p_gameID, p_scenarioID, p_rating) {
            var scenario = this.Scenario(p_adaptID, p_gameID, p_scenarioID, true);
            if (typeof scenario === 'undefined' || scenario === null) {
                this.Log(Severity.Error, "Unable to set Rating for scenario '" + p_scenarioID
                    + "' for adaptation '" + p_adaptID + "' in game '" + p_gameID + "'. The scenario not found.");
                return false;
            }
            scenario.Rating = p_rating;
            return true;
        };
        /// <summary>
        /// Set a PlayCount value for a scenario.
        /// </summary>
        /// 
        /// <param name="p_adaptID">      Identifier for the adapt. </param>
        /// <param name="p_gameID">       Identifier for the game. </param>
        /// <param name="p_scenarioID">   Identifier for the scenario. </param>
        /// <param name="p_playCount">    The value of PlayCount. </param>
        /// 
        /// <returns>
        /// True if value was changed, false otherwise.
        /// </returns>
        TwoA.prototype.SetScenarioPlayCount = function (p_adaptID, p_gameID, p_scenarioID, p_playCount) {
            var scenario = this.Scenario(p_adaptID, p_gameID, p_scenarioID, true);
            if (typeof scenario === 'undefined' || scenario === null) {
                this.Log(Severity.Error, "Unable to set PlayCount for scenario '" + p_scenarioID
                    + "' for adaptation '" + p_adaptID + "' in game '" + p_gameID + "'. The scenario not found.");
                return false;
            }
            if (!this.IsValidPlayCount(p_playCount)) {
                this.Log(Severity.Error, "Unable to set PlayCount for scenario '" + p_scenarioID
                    + "' for adaptation '" + p_adaptID + "' in game '" + p_gameID + "'. Invalid play count.");
                return false;
            }
            scenario.PlayCount = p_playCount;
            return true;
        };
        /// <summary>
        /// Set a KFactor value for a scenario.
        /// </summary>
        /// 
        /// <param name="p_adaptID">      Identifier for the adapt. </param>
        /// <param name="p_gameID">       Identifier for the game. </param>
        /// <param name="p_scenarioID">   Identifier for the scenario. </param>
        /// <param name="p_kFactor">      The value of KFactor. </param>
        /// 
        /// <returns>
        /// True if value was changed, false otherwise.
        /// </returns>
        TwoA.prototype.SetScenarioKFactor = function (p_adaptID, p_gameID, p_scenarioID, p_kFactor) {
            var scenario = this.Scenario(p_adaptID, p_gameID, p_scenarioID, true);
            if (typeof scenario === 'undefined' || scenario === null) {
                this.Log(Severity.Error, "Unable to set KFactor for scenario '" + p_scenarioID
                    + "' for adaptation '" + p_adaptID + "' in game '" + p_gameID + "'. The scenario not found.");
                return false;
            }
            if (!this.IsValidKFactor(p_kFactor)) {
                this.Log(Severity.Error, "Unable to set KFactor for scenario '" + p_scenarioID
                    + "' for adaptation '" + p_adaptID + "' in game '" + p_gameID + "'. Invalid K factor.");
                return false;
            }
            scenario.KFactor = p_kFactor;
            return true;
        };
        /// <summary>
        /// Set an Uncertainty value for a scenario.
        /// </summary>
        /// 
        /// <param name="p_adaptID">      Identifier for the adapt. </param>
        /// <param name="p_gameID">       Identifier for the game. </param>
        /// <param name="p_scenarioID">   Identifier for the scenario. </param>
        /// <param name="p_uncertainty">  The value of Uncertainty. </param>
        /// 
        /// <returns>
        /// True if value was changed, false otherwise.
        /// </returns>
        TwoA.prototype.SetScenarioUncertainty = function (p_adaptID, p_gameID, p_scenarioID, p_uncertainty) {
            var scenario = this.Scenario(p_adaptID, p_gameID, p_scenarioID, true);
            if (typeof scenario === 'undefined' || scenario === null) {
                this.Log(Severity.Error, "Unable to set Uncertainty for scenario '" + p_scenarioID
                    + "' for adaptation '" + p_adaptID + "' in game '" + p_gameID + "'. The scenario not found.");
                return false;
            }
            if (!this.IsValidUncertainty(p_uncertainty)) {
                this.Log(Severity.Error, "Unable to set Uncertainty for scenario '" + p_scenarioID
                    + "' for adaptation '" + p_adaptID + "' in game '" + p_gameID + "'. Invalid uncertainty.");
                return false;
            }
            scenario.Uncertainty = p_uncertainty;
            return true;
        };
        /// <summary>
        /// Set a LastPlayed datetime for a scenario.
        /// </summary>
        /// 
        /// <param name="p_adaptID">      Identifier for the adapt. </param>
        /// <param name="p_gameID">       Identifier for the game. </param>
        /// <param name="p_scenarioID">   Identifier for the scenario. </param>
        /// <param name="p_lastPlayed">   String value of the date and time of the last play. </param>
        /// 
        /// <returns>
        /// True if value was changed, false otherwise.
        /// </returns>
        TwoA.prototype.SetScenarioLastPlayed = function (p_adaptID, p_gameID, p_scenarioID, p_lastPlayed) {
            var scenario = this.Scenario(p_adaptID, p_gameID, p_scenarioID, true);
            if (typeof scenario === 'undefined' || scenario === null) {
                this.Log(Severity.Error, "Unable to set LastPlayed for scenario '" + p_scenarioID
                    + "' for adaptation '" + p_adaptID + "' in game '" + p_gameID + "'. The scenario not found.");
                return false;
            }
            if (Misc.IsNullOrEmpty(p_lastPlayed)) {
                this.Log(Severity.Error, "Unable to set LastPlayed for scenario '" + p_scenarioID
                    + "' for adaptation '" + p_adaptID + "' in game '" + p_gameID + "'. Null or empty date and time string.");
                return false;
            }
            scenario.LastPlayed = p_lastPlayed;
            return true;
        };
        /// <summary>
        /// Set a TimeLimit for a scenario.
        /// </summary>
        /// 
        /// <param name="p_adaptID">      Identifier for the adapt. </param>
        /// <param name="p_gameID">       Identifier for the game. </param>
        /// <param name="p_scenarioID">   Identifier for the scenario. </param>
        /// <param name="p_timeLimit">    The value of TimeLimit. </param>
        /// 
        /// <returns>
        /// True if value was changed, false otherwise.
        /// </returns>
        TwoA.prototype.SetScenarioTimeLimit = function (p_adaptID, p_gameID, p_scenarioID, p_timeLimit) {
            var scenario = this.Scenario(p_adaptID, p_gameID, p_scenarioID, true);
            if (typeof scenario === 'undefined' || scenario === null) {
                this.Log(Severity.Error, "Unable to set TimeLimit for scenario '" + p_scenarioID
                    + "' for adaptation '" + p_adaptID + "' in game '" + p_gameID + "'. The scenario not found.");
                return false;
            }
            if (!this.IsValidTimeLimit(p_timeLimit)) {
                this.Log(Severity.Error, "Unable to set TimeLimit for scenario '" + p_scenarioID
                    + "' for adaptation '" + p_adaptID + "' in game '" + p_gameID + "'. Invalid time limit.");
                return false;
            }
            scenario.TimeLimit = p_timeLimit;
            return true;
        };
        ////// END: Scenario param setters
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: ScenarioNode adders
        /// <summary>
        /// Add a new scenario node.
        /// </summary>
        /// <param name="p_scenarioNode">New scenario node.</param>
        /// <returns>True if new scenario node was added and false otherwise.</returns>
        TwoA.prototype.AddScenarioNode = function (p_scenarioNode) {
            if (Misc.IsNullOrEmpty(p_scenarioNode.AdaptationID)) {
                this.Log(Severity.Error, "In TwoA.AddScenario: Cannot add scenario. Adaptation ID is null or empty string.");
                return false;
            }
            if (Misc.IsNullOrEmpty(p_scenarioNode.GameID)) {
                this.Log(Severity.Error, "In TwoA.AddScenario: Cannot add scenario. Game ID is null or empty string.");
                return false;
            }
            if (Misc.IsNullOrEmpty(p_scenarioNode.ScenarioID)) {
                this.Log(Severity.Error, "In TwoA.AddScenario: Cannot add scenario. Scenario ID is null or empty string.");
                return false;
            }
            if (this.Scenario(p_scenarioNode.AdaptationID, p_scenarioNode.GameID, p_scenarioNode.ScenarioID, false) !== null) {
                this.Log(Severity.Error, "In TwoA.AddScenario: Cannot add scenario. Scenario '" + p_scenarioNode.ScenarioID
                    + "' in game '" + p_scenarioNode.GameID + "' with adaptation '" + p_scenarioNode.AdaptationID + "' already exists.");
                return false;
            }
            if (!this.IsValidPlayCount(p_scenarioNode.PlayCount)) {
                this.Log(Severity.Error, "In TwoA.AddScenario: Cannot add scenario. Invalid play count.");
                return false;
            }
            if (!this.IsValidKFactor(p_scenarioNode.KFactor)) {
                this.Log(Severity.Error, "In TwoA.AddScenario: Cannot add scenario. Invalid K factor.");
                return false;
            }
            if (!this.IsValidUncertainty(p_scenarioNode.Uncertainty)) {
                this.Log(Severity.Error, "In TwoA.AddScenario: Cannot add scenario. Invalid uncertainty.");
                return false;
            }
            if (Misc.IsNullOrEmpty(p_scenarioNode.LastPlayed)) {
                this.Log(Severity.Error, "In TwoA.AddScenario: Cannot add scenario. Null or empty string for last played date.");
                return false;
            }
            if (!this.IsValidTimeLimit(p_scenarioNode.TimeLimit)) {
                this.Log(Severity.Error, "In TwoA.AddScenario: Cannot add scenario. Invalid time limit.");
                return false;
            }
            this.scenarios.push(p_scenarioNode);
            return true;
        };
        /// <summary>
        /// Add a new scenario node with custom parameters.
        /// </summary>
        /// <param name="p_adaptID">Adaptation ID.</param>
        /// <param name="p_gameID">Game ID.</param>
        /// <param name="p_scenarioID">Scenario ID.</param>
        /// <param name="p_rating">Scenario's difficulty rating.</param>
        /// <param name="p_playCount">The number of time the scenario was played to calculate the difficulty rating.</param>
        /// <param name="p_kFactor">Scenario's K factor.</param>
        /// <param name="p_uncertainty">Scenario's uncertainty.</param>
        /// <param name="p_lastPlayed">The datetime the scenario was last played. Should have 'yyyy-MM-ddThh:mm:ss' format.</param>
        /// <param name="p_timeLimit">Time limit to complete the scenario (in milliseconds).</param>
        /// <returns>True if new scenario node was added and false otherwise.</returns>
        TwoA.prototype.AddScenario = function (p_adaptID, p_gameID, p_scenarioID, p_rating, p_playCount, p_kFactor, p_uncertainty, p_lastPlayed, p_timeLimit) {
            var newScenarioNode = new ScenarioNode(p_adaptID, p_gameID, p_scenarioID);
            newScenarioNode.Rating = p_rating;
            newScenarioNode.PlayCount = p_playCount;
            newScenarioNode.KFactor = p_kFactor;
            newScenarioNode.Uncertainty = p_uncertainty;
            newScenarioNode.LastPlayed = p_lastPlayed;
            newScenarioNode.TimeLimit = p_timeLimit;
            if (this.AddScenarioNode(newScenarioNode)) {
                return newScenarioNode;
            }
            else {
                return null;
            }
        };
        /// <summary>
        /// Add a new scenario node with default parameters.
        /// </summary>
        /// <param name="p_adaptID">Adaptation ID.</param>
        /// <param name="p_gameID">Game ID.</param>
        /// <param name="p_scenarioID">Scenario ID.</param>
        /// <returns>True if new scenario node was added and false otherwise.</returns>
        TwoA.prototype.AddScenarioDefault = function (p_adaptID, p_gameID, p_scenarioID) {
            return this.AddScenario(p_adaptID, p_gameID, p_scenarioID, BaseAdapter.INITIAL_RATING, 0, BaseAdapter.INITIAL_K_FCT, BaseAdapter.INITIAL_UNCERTAINTY, BaseAdapter.DEFAULT_DATETIME, BaseAdapter.DEFAULT_TIME_LIMIT);
        };
        ////// END: ScenarioNode adders
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: ScenarioNode getter
        /// <summary>
        /// Get a ScenarioNode with a given scenario ID.
        /// </summary>
        ///
        /// <param name="p_adaptID">    Identifier for the adapt. </param>
        /// <param name="p_gameID">     Identifier for the game. </param>
        /// <param name="p_scenarioID"> Identifier for the scenario. </param>
        ///
        /// <returns>
        /// ScenarioNode object, or null if no ID match is found.
        /// </returns>
        TwoA.prototype.Scenario = function (p_adaptID, p_gameID, p_scenarioID, p_showWarning) {
            if (p_showWarning === void 0) { p_showWarning = true; }
            if (Misc.IsNullOrEmpty(p_adaptID) || Misc.IsNullOrEmpty(p_gameID) || Misc.IsNullOrEmpty(p_scenarioID)) {
                if (p_showWarning) {
                    this.Log(Severity.Error, "In TwoA.Scenario method: one or more parameters are null. Expected string values. Returning null.");
                }
                return null;
            }
            for (var _i = 0, _a = this.scenarios; _i < _a.length; _i++) {
                var scenario = _a[_i];
                if (scenario.AdaptationID === p_adaptID && scenario.GameID === p_gameID && scenario.ScenarioID === p_scenarioID) {
                    return scenario;
                }
            }
            if (p_showWarning) {
                this.Log(Severity.Error, "In TwoA.Scenario method: Scenario not found. Returning null.");
            }
            return null;
        };
        /// <summary>
        /// Gets a list of all scenario nodes.
        /// </summary>
        ///
        /// <param name="p_adaptID">    Identifier for the adapt. </param>
        /// <param name="p_gameID">     Identifier for the game. </param>
        ///
        /// <returns>
        /// all scenarios.
        /// </returns>
        TwoA.prototype.AllScenarios = function (p_adaptID, p_gameID) {
            if (Misc.IsNullOrEmpty(p_adaptID) || Misc.IsNullOrEmpty(p_gameID)) {
                this.Log(Severity.Error, "In AllScenarios method: one or more parameters are null. Expected string values. Returning null.");
                return null;
            }
            var matchingScenarios = new Array();
            for (var _i = 0, _a = this.scenarios; _i < _a.length; _i++) {
                var scenario = _a[_i];
                if (scenario.AdaptationID === p_adaptID && scenario.GameID === p_gameID) {
                    matchingScenarios.push(scenario);
                }
            }
            if (matchingScenarios.length === 0) {
                this.Log(Severity.Error, "In TwoA.AllScenarios method: Unable to retrieve scenarios for game '"
                    + p_gameID + "' with adaptation '" + p_adaptID + "'. No matching scenarios.");
                return null;
            }
            return matchingScenarios.sort(function (scenarioOne, scenarioTwo) {
                if (scenarioOne.Rating < scenarioTwo.Rating) {
                    return -1;
                }
                else if (scenarioOne.Rating > scenarioTwo.Rating) {
                    return 1;
                }
                else {
                    return 0;
                }
            });
        };
        ////// END: ScenarioNode getter
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: ScenarioNode removers
        /// <summary>
        /// Removes a specified scenario.
        /// </summary>
        /// <param name="p_adaptID">Adaptation ID</param>
        /// <param name="p_gameID">Game ID</param>
        /// <param name="p_scenarioID">Scenario ID</param>
        /// <returns>True if scenario was removed, and false otherwise.</returns>
        TwoA.prototype.RemoveScenario = function (p_adaptID, p_gameID, p_scenarioID) {
            return this.RemoveScenarioNode(this.Scenario(p_adaptID, p_gameID, p_scenarioID, true));
        };
        /// <summary>
        /// Removes a specified scenario.
        /// </summary>
        /// <param name="p_scenarioNode">ScenarioNode instance to remove.</param>
        /// <returns>True if scenario was removed, and false otherwise.</returns>
        TwoA.prototype.RemoveScenarioNode = function (p_scenarioNode) {
            if (typeof p_scenarioNode === 'undefined' || p_scenarioNode === null) {
                this.Log(Severity.Error, "In TwoA.RemoveScenario: Cannot remove scenario. The scenarioNode parameter is null.");
                return false;
            }
            var index = this.scenarios.indexOf(p_scenarioNode, 0);
            if (index < 0) {
                this.Log(Severity.Error, "In TwoA.RemoveScenario: Cannot remove scenario. The scenarioNode was not found.");
                return false;
            }
            this.scenarios.splice(index, 1);
            return true;
        };
        ////// END: ScenarioNode removers
        //////////////////////////////////////////////////////////////////////////////////////
        ////// END: methods for scenario data
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: methods for value validity checks
        /// <summary>
        /// Returns true if play count value is valid.
        /// </summary>
        /// <param name="p_playCount">Play count value</param>
        /// <returns>bool</returns>
        TwoA.prototype.IsValidPlayCount = function (p_playCount) {
            if (p_playCount < 0) {
                this.Log(Severity.Information, "Play count should be equal to or higher than 0.");
                return false;
            }
            return true;
        };
        /// <summary>
        /// Returns true if K factor value is valid.
        /// </summary>
        /// <param name="p_kFactor">K factor value</param>
        /// <returns>bool</returns>
        TwoA.prototype.IsValidKFactor = function (p_kFactor) {
            if (p_kFactor <= 0) {
                this.Log(Severity.Information, "K factor should be equal to or higher than '" + BaseAdapter.MIN_K_FCT + "'.");
                return false;
            }
            return true;
        };
        /// <summary>
        /// Returns true if uncertainty value is valid.
        /// </summary>
        /// <param name="p_uncertainty">Uncertainty value</param>
        /// <returns>bool</returns>
        TwoA.prototype.IsValidUncertainty = function (p_uncertainty) {
            if (p_uncertainty < 0 || p_uncertainty > 1) {
                this.Log(Severity.Information, "The uncertainty should be within [0, 1].");
                return false;
            }
            return true;
        };
        /// <summary>
        /// Returns true if time limit value is valid.
        /// </summary>
        /// <param name="p_timeLimit">Time limit value</param>
        /// <returns>bool</returns>
        TwoA.prototype.IsValidTimeLimit = function (p_timeLimit) {
            if (p_timeLimit <= 0) {
                this.Log(Severity.Error, "Time limit should be higher than 0.");
                return false;
            }
            return true;
        };
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: constants
        TwoA.DATE_FORMAT = "yyyy-MM-ddThh:mm:ss";
        return TwoA;
    }(BaseAsset));
    TwoAPackage.TwoA = TwoA;
})(TwoAPackage || (TwoAPackage = {}));
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
var TwoACocos2DDemo;
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
(function (TwoACocos2DDemo) {
    /// <summary>
    /// Export the Asset.
    /// </summary>
    var Bridge = /** @class */ (function () {
        function Bridge() {
        }
        Bridge.prototype.DeriveAssetName = function (Class, Id) {
            return Class + "AppSettings";
        };
        /// <summary>
        /// Determine if 'fileId' exists.
        /// </summary>
        ///
        /// <param name="fileId"> Identifier for the file. </param>
        ///
        /// <returns>
        /// true if it succeeds, false if it fails.
        /// </returns>
        Bridge.prototype.Exists = function (fileId) {
            return ccExists(fileId);
        };
        /// <summary>
        /// Loads the given file.
        /// </summary>
        ///
        /// <param name="fileId"> The file identifier to load. </param>
        ///
        /// <returns>
        /// A string.
        /// </returns>
        Bridge.prototype.Load = function (fileId) {
            return ccLoad(fileId);
        };
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
        Bridge.prototype.Save = function (fieldId, fileData) {
            ccSave(fieldId, fileData);
        };
        /// <summary>
        /// Gets the files.
        /// </summary>
        ///
        /// <returns>
        /// A string[].
        /// </returns>
        Bridge.prototype.Files = function () {
            return ccFiles();
        };
        /// <summary>
        /// Deletes the given fle.
        /// </summary>
        ///
        /// <param name="fileId">  Identifier for the field. </param>
        ///
        /// <returns>
        /// true if it succeeds, false if it fails.
        /// </returns>
        Bridge.prototype.Delete = function (fileId) {
            if (ccExists(fileId)) {
                ccDelete(fileId);
                return true;
            }
            return false;
        };
        /// <summary>
        /// Executes the log operation.
        /// 
        /// Implement this in Game Engine Code.
        /// </summary>
        ///
        /// <param name="msg"> The message. </param>
        Bridge.prototype.Log = function (severity, msg) {
            ccLog(severity + ": " + msg);
        };
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
        Bridge.prototype.HasDefaultSettings = function (Class, Id) {
            // Note, a very simple implementation returning the same value for all classes!
            // [TODO]
            return true;
        };
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
        Bridge.prototype.LoadDefaultSettings = function (Class, Id) {
            // Note, a very simple implementation returning the same settings for all classes!
            // [TODO]
            return "";
        };
        /// <summary>
        /// Saves a default settings.
        /// </summary>
        ///
        /// <param name="Class">    The class. </param>
        /// <param name="Id">       The identifier. </param>
        /// <param name="fileData"> The file data. </param>
        Bridge.prototype.SaveDefaultSettings = function (Class, Id, fileData) {
            // [TODO]
        };
        return Bridge;
    }());
    TwoACocos2DDemo.Bridge = Bridge;
})(TwoACocos2DDemo || (TwoACocos2DDemo = {}));
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
var TwoACocos2DDemo;
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
(function (TwoACocos2DDemo) {
    var Severity = AssetPackage.Severity;
    var TwoA = TwoAPackage.TwoA;
    var bridge = new TwoACocos2DDemo.Bridge();
    window.onload = function () {
        startCocos2D();
        Simulation.initSimulation();
    };
    var Simulation = /** @class */ (function () {
        function Simulation() {
        }
        // private static updateDatafiles: boolean = false; // [2018.01.12]
        Simulation.initSimulation = function () {
            bridge.Log(Severity.Information, "START SIMULATION =======================");
            // [SC] instantiate the asset
            this.twoA = new TwoA();
            // [SC] give asset its own bridge
            this.twoA.Bridge = bridge;
        };
        Simulation.doControlSimulation = function () {
            // [SC] adding datafiles to the local storage
            this.addTwoAData();
            for (var index = 0; index < this.performance.length; index++) {
                // [SC] retrieving RT, accuracy and expected rating
                var scenarioID = this.getScenarioByNumId(this.performance[index][0]);
                var accuracy = this.performance[index][1];
                var expectTheta = this.performance[index][2];
                var expectBeta = this.performance[index][3];
                var playerNode = this.twoA.Player(this.adaptID, this.gameID, this.playerID, true);
                var scenarioNode = this.twoA.Scenario(this.adaptID, this.gameID, scenarioID, true);
                // [SC] update player's and scenario's ratings
                this.twoA.UpdateRatings(playerNode, scenarioNode, 0, accuracy, this.updateBetas, this.customK);
                var factor = Math.pow(10, 4);
                var actualTheta = Math.round(playerNode.Rating * factor) / factor;
                var actualBeta = Math.round(scenarioNode.Rating * factor) / factor;
                // [SC] print update results
                bridge.Log(Severity.Information, "Gameplay " + (index + 1) + " against " + scenarioID + ".");
                bridge.Log(Severity.Information, "    Expected theta: " + expectTheta + "; Calculated theta: " + actualTheta);
                bridge.Log(Severity.Information, "    Expected beta: " + expectBeta + "; Calculated beta: " + actualBeta);
            }
            window.alert("Simulation ended.");
            this.printData();
            bridge.Log(Severity.Information, "END SIMULATION =======================");
        };
        Simulation.doNewSimulation = function () {
            // [SC] adding datafiles to the local storage
            this.addTwoAData();
            for (var index = 0; index < this.performance.length; index++) {
                // [SC] retrieving RT, accuracy and expected rating
                var accuracy = this.performance[index][1];
                var expectTheta = this.performance[index][2];
                var playerNode = this.twoA.Player(this.adaptID, this.gameID, this.playerID, true);
                var scenarioNode = this.twoA.TargetScenario(playerNode);
                // [SC] update player's and scenario's ratings
                this.twoA.UpdateRatings(playerNode, scenarioNode, 0, accuracy, this.updateBetas, this.customK);
                var factor = Math.pow(10, 4);
                var actualTheta = Math.round(playerNode.Rating * factor) / factor;
                // [SC] print update results
                bridge.Log(Severity.Information, "Gameplay " + (index + 1) + " against " + scenarioNode.ScenarioID + ".");
                bridge.Log(Severity.Information, "    Expected theta: " + expectTheta + "; Calculated theta: " + actualTheta
                    + "; Difference: " + Math.abs(expectTheta - actualTheta));
            }
            window.alert("Simulation ended.");
            this.printData();
            bridge.Log(Severity.Information, "END SIMULATION =======================");
        };
        Simulation.printData = function () {
            var factor = Math.pow(10, 4);
            bridge.Log(Severity.Information, "");
            bridge.Log(Severity.Information, "PLAYER DATA================================");
            bridge.Log(Severity.Information, "\"AdaptationID\""
                + "\t" + "\"GameID\""
                + "\t" + "\"ScenarioID\""
                + "\t" + "\"Rating\""
                + "\t" + "\"PlayCount\""
                + "\t" + "\"KFactor\""
                + "\t" + "\"Uncertainty\""
                + "\t" + "\"LastPlayed\"");
            for (var _i = 0, _a = this.twoA.players; _i < _a.length; _i++) {
                var player = _a[_i];
                bridge.Log(Severity.Information, "\"" + player.AdaptationID + "\""
                    + "\t" + "\"" + player.GameID + "\""
                    + "\t" + "\"" + player.PlayerID + "\""
                    + "\t" + "\"" + Math.round(player.Rating * factor) / factor + "\""
                    + "\t" + "\"" + player.PlayCount + "\""
                    + "\t" + "\"" + Math.round(player.KFactor * factor) / factor + "\""
                    + "\t" + "\"" + Math.round(player.Uncertainty * factor) / factor + "\""
                    + "\t" + "\"" + player.GameID + "\""
                    + "\t" + "\"" + player.LastPlayed + "\"");
            }
            bridge.Log(Severity.Information, "");
            bridge.Log(Severity.Information, "SCENARIO DATA================================");
            bridge.Log(Severity.Information, "\"AdaptationID\""
                + "\t" + "\"GameID\""
                + "\t" + "\"ScenarioID\""
                + "\t" + "\"Rating\""
                + "\t" + "\"PlayCount\""
                + "\t" + "\"KFactor\""
                + "\t" + "\"Uncertainty\""
                + "\t" + "\"LastPlayed\"");
            for (var _b = 0, _c = this.twoA.scenarios; _b < _c.length; _b++) {
                var scenario = _c[_b];
                bridge.Log(Severity.Information, "\"" + scenario.AdaptationID + "\""
                    + "\t" + "\"" + scenario.GameID + "\""
                    + "\t" + "\"" + scenario.ScenarioID + "\""
                    + "\t" + "\"" + Math.round(scenario.Rating * factor) / factor + "\""
                    + "\t" + "\"" + scenario.PlayCount + "\""
                    + "\t" + "\"" + Math.round(scenario.KFactor * factor) / factor + "\""
                    + "\t" + "\"" + Math.round(scenario.Uncertainty * factor) / factor + "\""
                    + "\t" + "\"" + scenario.LastPlayed + "\"");
            }
            bridge.Log(Severity.Information, "");
            bridge.Log(Severity.Information, "GAMEPLAY DATA================================");
            bridge.Log(Severity.Information, "\"AdaptationID\""
                + "\t" + "\"GameID\""
                + "\t" + "\"PlayerID\""
                + "\t" + "\"ScenarioID\""
                + "\t" + "\"Timestamp\""
                + "\t" + "\"RT\""
                + "\t" + "\"Accuracy\""
                + "\t" + "\"PlayerRating\""
                + "\t" + "\"ScenarioRating\"");
            for (var _d = 0, _e = this.twoA.gameplays; _d < _e.length; _d++) {
                var gp = _e[_d];
                bridge.Log(Severity.Information, "\"" + gp.AdaptationID + "\""
                    + "\t" + "\"" + gp.GameID + "\""
                    + "\t" + "\"" + gp.PlayerID + "\""
                    + "\t" + "\"" + gp.ScenarioID + "\""
                    + "\t" + "\"" + gp.Timestamp + "\""
                    + "\t" + "\"" + gp.RT + "\""
                    + "\t" + "\"" + gp.Accuracy + "\""
                    + "\t" + "\"" + Math.round(gp.PlayerRating * factor) / factor + "\""
                    + "\t" + "\"" + Math.round(gp.ScenarioRating * factor) / factor + "\"");
            }
        };
        Simulation.addTwoAData = function () {
            if (this.twoA == null) {
                throw new Error("TwoA instance is not initialized.");
            }
            this.twoA.SetTargetDistribution(this.adaptID, 0.5, 0.1, 0.25, 0.75);
            this.twoA.players = new Array();
            this.twoA.scenarios = new Array();
            this.twoA.gameplays = new Array();
            var betas = [
                -0.384,
                0.117
                //, 1.520
                //, 1.519
                ,
                1.48,
                2.066
            ];
            var scenarios = [
                "Very Easy AI",
                "Easy AI"
                //, "Medium Color AI"
                //, "Medium Shape AI"
                ,
                "Hard AI",
                "Very Hard AI"
            ];
            this.twoA.AddPlayer(this.adaptID, this.gameID, this.playerID, 0.01, 0, 0.0075, 1, "2012-12-31T11:59:59");
            for (var index = 0; index < scenarios.length; index++) {
                this.twoA.AddScenario(this.adaptID, this.gameID, scenarios[index], betas[index], 0, 0.0075, 0, "2012-12-31T11:59:59", 900000);
            }
        };
        Simulation.getScenarioByNumId = function (scenarioNum) {
            switch (scenarioNum) {
                case 0: return "Very Easy AI";
                case 1: return "Easy AI";
                case 2: return "Medium Color AI";
                case 3: return "Medium Shape AI";
                case 4: return "Hard AI";
                case 5: return "Very Hard AI";
                default: throw new Error("Unknown scenario number");
            }
        };
        // [SC] each row is a gameplay
        // [SC] column 1: scenario; column 2: accuracy; column 3: expected player rating; column 4: scenario rating
        Simulation.performance = [
            [1, 1, 0.1153, 0.0117],
            [1, 1, 0.2102, -0.0832],
            [4, 1, 0.3663, 1.3239],
            [1, 1, 0.4442, -0.1611],
            [1, 1, 0.5148, -0.2317],
            [4, 1, 0.6532, 1.1855],
            [4, 1, 0.7792, 1.0595],
            [4, 1, 0.8931, 0.9456],
            [4, 0, 0.7958, 1.0429],
            [4, 1, 0.9081, 0.9306],
            [4, 1, 1.0092, 0.8295],
            [4, 1, 1.1002, 0.7385],
            [4, 0, 0.9823, 0.8564],
            [4, 1, 1.076, 0.7626],
            [4, 1, 1.1605, 0.6782],
            [4, 1, 1.2368, 0.6019],
            [5, 0, 1.1761, 2.1268],
            [4, 0, 1.0481, 0.7298],
            [5, 0, 0.9974, 2.1775],
            [4, 1, 1.0841, 0.6431],
            [4, 0, 0.9624, 0.7648],
            [4, 1, 1.0525, 0.6746],
            [4, 1, 1.1339, 0.5933],
            [4, 1, 1.2075, 0.5197],
            [4, 1, 1.2744, 0.4528],
            [5, 0, 1.2167, 2.2352],
            [4, 1, 1.2803, 0.3892],
            [4, 0, 1.1384, 0.5311],
            [5, 0, 1.0884, 2.2853],
            [4, 1, 1.1612, 0.4582],
            [4, 1, 1.2274, 0.392],
            [4, 0, 1.0879, 0.5315],
            [5, 0, 1.0415, 2.3317],
            [4, 1, 1.1166, 0.4565],
            [5, 1, 1.2708, 2.1774],
            [4, 0, 1.1322, 0.5951],
            [4, 1, 1.206, 0.5213],
            [4, 1, 1.273, 0.4543],
            [5, 0, 1.2154, 2.235],
            [4, 1, 1.2791, 0.3906],
            [4, 0, 1.1374, 0.5323],
            [4, 1, 1.208, 0.4617],
            [4, 1, 1.2723, 0.3973],
            [5, 1, 1.417, 2.0903],
            [5, 0, 1.3495, 2.1579],
            [5, 0, 1.2878, 2.2195],
            [5, 0, 1.2313, 2.276],
            [5, 0, 1.1793, 2.3281],
            [4, 1, 1.2421, 0.3345],
            [4, 0, 1.0996, 0.477]
        ];
        Simulation.adaptID = "SkillDifficultyElo";
        Simulation.gameID = "TileZero";
        Simulation.playerID = "EvolvingAI";
        Simulation.updateBetas = true;
        Simulation.customK = 0.2;
        return Simulation;
    }());
    TwoACocos2DDemo.Simulation = Simulation;
})(TwoACocos2DDemo || (TwoACocos2DDemo = {}));
//# sourceMappingURL=app.js.map