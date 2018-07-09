// ==== Global Variables ==== //
var bearing_icon = "overlay";
var empty_icon = "circle-task";
var missing_icon = "decline";
var reds, whites, blues, emptys, missings = 0;
var cellValues = [
	["R","W","B"],
	["R","W","B"],
	["R","W","B"]
];

// ==== SAP UI5 Standard ==== //
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"SAP_SARAH_ML_Project/libs/jszip" // Enables the jszip library (imports)
], function(Controller, jszipjs) { // Second part of importing
	"use strict";
	return Controller.extend("SAP_SARAH_ML_Project.controller.View1", {
		
		// ==== Functions ==== //
		
		// When the program starts
		onInit: function() {
			this.randomizeData(); // Randomize the data
			// this.getToken()
			// 	.then(function(result) {
			//     // Code depending on result
			//     console.log(result);
			//   })
			//   .catch(function() {
			//     // An error occurred
			//   });
		},
		
		
		// When the window has rendered the view
		onAfterRendering: function() {
			var that = this;
            var fileInput = $("#upload_file")[0]; // JQuery method of getting element instead of: var fileInput = document.getElementById("upload_file");
            // fileInput.addEventListener("change", this.onChange); // causes the "onChange" event to run when fileInput is changed
            fileInput.addEventListener("change", function(){
            	var label = $("#upload_file_label")[0];
            	label.innerHTML = "Processing: " + fileInput.files[0].name;                      
			    that.classify();
			});
		},
		
		// Update the preview image to be visible when image has been uploaded
		onChange: function(oEvent){
            // var input = oEvent.target;
            // var reader = new FileReader();

            // // get file content
            // reader.onload = function(){
            //     var dataUrl = reader.result;
            //     // set image area
            //     var image = $("#image")[0];			//var image =  document.getElementById("image");
            //     image.src = dataUrl;
            // };
            // // read content
            // reader.readAsDataURL(input.files[0]);
            this.classify();
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
		
		getToken: function() {
			return new Promise(function(resolve, reject) {
				var xhr = new XMLHttpRequest();
				xhr.withCredentials = true;
				
				xhr.addEventListener("readystatechange", function () {
				  if (this.readyState === 4) {
				    	var json = JSON.parse(this.response);
				    	resolve(json.access_token);
				  }
				});
				
				xhr.onerror = reject;
				xhr.open("POST", "/TokenAuth/oauth/token?grant_type=client_credentials");
				xhr.setRequestHeader("Authorization", "Basic c2ItYTY5N2ZjZmMtNzE3YS00OWYwLTliMTYtNWQzZGZmN2U3NjE1IWI0MDU5fG1sLWZvdW5kYXRpb24teHN1YWEtc3RkIWI1NDA6L21jWFJUOG9vZkRPa2lPRkFnbm1ZeXY0QWRrPQ==");
				xhr.setRequestHeader("Cache-Control", "no-cache");
				xhr.setRequestHeader("Postman-Token", "0d4da783-ad4f-435b-a97d-4c5a99f81907");
				
				xhr.send();
			});
		},
		
		zipImg: function() {
			var zip = new JSZip();
			var input = $("#upload_file")[0];
			var img = zip.folder("images");
            var imgData = input.files[0];
			img.file("test.png", imgData, {base64: true});
			
			zip.generateAsync({type:"base64"}).then(function (base64) {window.location = "data:application/zip;base64," + base64;});

			// zip.folder("images").forEach(function (relativePath, file){
			//     console.log("iterating over", relativePath);
			// });
		},
		
        classify: function(oEvent) {
        	var that = this;
        	
        	this.getToken()
				.then(function(token) {
				    // Code depending on result
				    var input = $("#upload_file")[0];

		            //prepare file for api call
		            var data = new FormData();
		            data.append("files", input.files[0], input.files[0].name);
		
		            var xhr = new XMLHttpRequest();
		            xhr.withCredentials = true;
		            

		            xhr.addEventListener("readystatechange", function () {
		                if (this.readyState === this.DONE) {
		                    //release busy indicator
		                    that.getView().byId("grid-container").setBusy(false);
		                    // convert response text to json format
		                    var json = JSON.parse(this.response);
		                    
		                    for (var i = 0; i < Object.keys(json.predictions).length; i++) {
								cellValues[json.predictions[i].name.split("")[0]][json.predictions[i].name.split("")[1]] = json.predictions[i].results[0].label[0];
			                }
		                    
		                    that.updateUI();
		                    
		                    var label = $("#upload_file_label")[0];
            				label.innerHTML = "Classify";
		                }
			            });
			
		            //setting request method
		            xhr.open("POST", "/MLConfig/api/v2/image/classification/models/SARAH/versions/1", false);
		            
		            xhr.setRequestHeader("accept", "application/json");
		            xhr.setRequestHeader("Authorization", "Bearer " + token);
		            //set busy indicator before send request to ML API
		            that.getView().byId("grid-container").setBusy(true);
		
		            //sending request
		            $.sap.delayedCall(2000, this, function(){
		                xhr.send(data);
		            });
				})
			  .catch(function() {
			    // An error occurred
			  });
        }
	});
});