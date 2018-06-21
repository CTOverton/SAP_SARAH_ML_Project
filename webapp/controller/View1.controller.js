var bearing_icon = "overlay";
var empty_icon = "circle-task";
var missing_icon = "sys-cancel";
var reds, whites, blues, emptys, missings = 0;
var cellValues = [
	["R","W","B"],
	["R","W","B"],
	["R","W","B"]
];

sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"SAP_SARAH_ML_Project/libs/jszip"
], function(Controller, jszipjs) {
	"use strict";
	return Controller.extend("SAP_SARAH_ML_Project.controller.View1", {
		onAfterRendering: function() {
			// bearing_icon = "something";
			// var listItems;
			// var items = that.getView().byId("__list0");
			this.randomizeData();
			
			// get DOM element of file input
            var fileInput = $("#previewImg")[0];		//var fileInput = document.getElementById("previewImg");
            // attach event of onchange
            fileInput.addEventListener("change", this.onChange);
		},
		
		onChange: function(oEvent){
            //console.log("onChange is called");
            var input = oEvent.target;
            var reader = new FileReader();

            // get file content
            reader.onload = function(){
                var dataUrl = reader.result;
                // set image area
                var image = $("#image")[0];			//var image =  document.getElementById("image");
                image.src = dataUrl;
            };
            // read content
            reader.readAsDataURL(input.files[0]);
        },
        
		updateUI: function() {
		    for (var i = 0; i < 3; i++) {
		        for (var j = 0; j < 3; j++) {
		        	var cell = this.getView().byId("grid-cell-"+i+""+j);
		        	var icon = this.getView().byId("grid-cell-icon-"+i+""+j);
		        	
		        	cell.removeStyleClass("grid-cell red");
		        	cell.removeStyleClass("grid-cell white");
		        	cell.removeStyleClass("grid-cell blue");
		        	cell.removeStyleClass("grid-cell empty");
		        	cell.removeStyleClass("grid-cell missing");
		        	
		            switch (cellValues[i][j].toLowerCase()){
		                case "r":
		                	cell.addStyleClass("grid-cell red");
		                	icon.setSrc("sap-icon://"+bearing_icon);
		                    break;
		                case "w":
		                	cell.removeStyleClass("grid-cell");
		                    cell.addStyleClass("grid-cell white");
		                	icon.setSrc("sap-icon://"+bearing_icon);
		                    break;
		                case "b":
		                	cell.removeStyleClass("grid-cell");
		                    cell.addStyleClass("grid-cell blue");
		                	icon.setSrc("sap-icon://"+bearing_icon);
		                    break;
		                case "e":
		                	cell.removeStyleClass("grid-cell");
		                    cell.addStyleClass("grid-cell empty");
		                	icon.setSrc("sap-icon://"+empty_icon);
		                    break;
		                default:
		                	cell.removeStyleClass("grid-cell");
		                    cell.addStyleClass("grid-cell missing");
		                	icon.setSrc("sap-icon://"+missing_icon);
		            }
		        }
		    }
		},
		
		randomizeData: function() {
			var letters = ["R","W","B","E","M"];
			
			for (var i = 0; i < cellValues.length; i++) {
				for (var j = 0; j < cellValues.length; j++) {
					cellValues[i][j] = letters[Math.floor(Math.random() * letters.length)];
				}
			}
			this.updateUI();
		},
		
		zipImg: function() {
			var zip = new JSZip();
			var input = $("#previewImg")[0];
			var img = zip.folder("images");
            var imgData = input.files[0];
			img.file("test.png", imgData, {base64: true});
			
			zip.generateAsync({type:"base64"}).then(function (base64) {window.location = "data:application/zip;base64," + base64;});
			
			// zip.folder("images").forEach(function (relativePath, file){
			//     console.log("iterating over", relativePath);
			// });
			
			
			
		}
	});
});