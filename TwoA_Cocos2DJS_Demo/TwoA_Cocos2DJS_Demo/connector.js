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

let buttonControl;
let buttonNew;

function startCocos2D() {
	cc.game.onStart = function () {
	    //load resources
        cc.LoaderScene.preload(["HelloWorld.png", "buttonControl.png", "buttonNew.png"], function () {
	        let MyScene = cc.Scene.extend({
	            onEnter: function () {
	                this._super();
	                let size = cc.director.getWinSize();

	                let label = cc.LabelTTF.create("HAT Asset demo with Cocos2D JS", "Arial", 40);
	                label.setPosition(size.width / 2, size.height / 2);
	                this.addChild(label, 1);

	                buttonControl = new ccui.Button();
                    buttonControl.loadTextures("buttonControl.png", "buttonControl.png");
                    buttonControl.setPosition(40 + buttonControl.width, size.height / 2 - 100);
                    buttonControl.addTouchEventListener(touchEvent, this);
                    this.addChild(buttonControl);

                    buttonNew = new ccui.Button();
                    buttonNew.loadTextures("buttonNew.png", "buttonNew.png");
                    buttonNew.setPosition(size.width - 40 - buttonNew.width, size.height / 2 - 100);
                    buttonNew.addTouchEventListener(touchEvent, this);
                    this.addChild(buttonNew);

	                window.alert("Press the New Game button to perform a simulation. Performance data and results from the gameplay are shown in console.");
	            }
	        });
	        cc.director.runScene(new MyScene());
	    }, this);
	};
	cc.game.run("gameCanvas");
}

function touchEvent(sender, type) {
    switch (type) {
        case ccui.Widget.TOUCH_BEGAN:
            if (sender === buttonControl) {
                TwoACocos2DDemo.Simulation.doControlSimulation();
            }
            else {
                TwoACocos2DDemo.Simulation.doNewSimulation();
            }
            break;
    }
}

function ccLog(txt) {
    cc.log(txt);
}

function ccLoad(fileID) {
    return cc.sys.localStorage.getItem(fileID);
}

function ccSave(fileID, fileData) {
    cc.sys.localStorage.setItem(fileID, fileData);
}

function ccDelete(fileID) {
    cc.sys.localStorage.removeItem(fileID);
}

function ccExists(fileID) {
    for (let j = 0; j < cc.sys.localStorage.length; j++) {
        if (cc.sys.localStorage.key(j) == fileID) {
            return true;
        }
    }
    return false;
}

function ccFiles() {
    let files = [];
    for (let j = 0; j < cc.sys.localStorage.length; j++) {
        files.push(cc.sys.localStorage.key(j));
    }
    return files;
}