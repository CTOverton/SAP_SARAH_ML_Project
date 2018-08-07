// ==== Global Variables ==== //
var test = "";
var bearing_icon = "overlay";
var empty_icon = "circle-task";
var missing_icon = "decline";
var reds, whites, blues, emptys, missings = 0;
var cellValues = [
	["R","E","B"],
	["E","R","W"],
	["W","B","M"]
];
var configured = "false";

var currentImg;

var cropper;

var cropData = {
	0: {
		0:null,
		1:null,
		2:null
	},
	1: {
		0:null,
		1:null,
		2:null
	},
	2: {
		0:null,
		1:null,
		2:null
	}
};

var cropSrc = {
	0: {
		0:{src:null},
		1:{src:null},
		2:{src:null}
	},
	1: {
		0:{src:null},
		1:{src:null},
		2:{src:null}
	},
	2: {
		0:{src:null},
		1:{src:null},
		2:{src:null}
	}
};
	
var currentCell = {
	cell:null,
	row:null,
	col:null
};

var postZip;

// ==== SAP UI5 Standard ==== //
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"SAP_SARAH_ML_Project/libs/jszip", // Enables the jszip library (imports)
	"SAP_SARAH_ML_Project/libs/cropper"
], function(Controller, jszipjs, cropperjs) { // Second part of importing
	"use strict";
	return Controller.extend("SAP_SARAH_ML_Project.controller.View1", {
		
		// ==== Functions ==== //
		
		// When the program starts
		onInit: function() {
			//this.randomizeData(); // Randomize the data
			this.updateUI();
			test = this;
		},
		
		
		// When the window has rendered the view
		onAfterRendering: function() {
			var that = this;
            
            // When file is uploaded run function
            var fileInput = $("#input")[0];
            fileInput.addEventListener("change", this.onChangeConfig); // causes the "onChange" event to run when fileInput is changed
		},
		
		// Close the Crop Modal
		closethis: function() {
			this.getView().byId("myModal").setVisible(false);
			
			if (cropper) {
				cropper.destroy();
			}
		},
		
		// Start update process for UI
		update: function() {
			let that = this;
			
			// Crop Image to sections
			this.test().then(function(message) {
				console.log(message);
				// Zip cropped images
				that.zipImg().then(function(message) {
					console.log(message);
					// Post ZIP to model for classification
					that.classify();
				});
			});
		},
		
		// When crop button is pressed set crop data
		cellCrop: function() {
			var row = currentCell.row;
			var col = currentCell.col;
			
			cropData[row][col] = cropper.getData(true); // Set cropData from cropper
			
			// Update visual
			currentCell.cell.addStyleClass("config-cell set");
			currentCell.cell.getItems()[0].setText("Edit");
			this.closethis();
		},
		
		// Randomize the Shelf UI Visual
		randomizeData: function() {
			var letters = ["R","W","B","E","M"]; // Possible Settings
			
			// Loop for rows and cols
			for (var i = 0; i < cellValues.length; i++) {
				for (var j = 0; j < cellValues.length; j++) {
					cellValues[i][j] = letters[Math.floor(Math.random() * letters.length)]; // Set config data to random value
				}
			}
			this.updateUI(); // Update Visual
		},
		
		// On settings button click randomize data
		settings_randomizeData: function() {
			this.randomizeData();
		},
		
		// On settings button click set image to dropdown preset
		settings_setImg: function() {
			switch (this.getView().byId("settings_crop").getSelectedItem().getText()) {
				case "Factory Shelf Demo 1":
					 
					break;
				case "Factory Shelf Demo 1.1":
					
					break;
			}
		},
		
		// On settings button click set crop data to dropdown preset
		settings_setCrop: function() {
			switch (this.getView().byId("settings_crop").getSelectedItem().getText()) {
                case "Factory Shelf Demo 1, 1.1, 2":
                	cropData = {
						0: {
							0:{
								x: 82,
								y: 36,
								width: 841,
								height: 470,
								rotate: 0,
								scaleX: 1,
								scaleY: 1
							},
							1:{
								x: 906,
								y: 22,
								width: 779,
								height: 487,
								rotate: 0,
								scaleX: 1,
								scaleY: 1
							},
							2:{
								x: 1709,
								y: 39,
								width: 738,
								height: 494,
								rotate: 0,
								scaleX: 1,
								scaleY: 1
							}
						},
						1: {
							0:{
								x: 189,
								y: 485,
								width: 741,
								height: 422,
								rotate: 0,
								scaleX: 1,
								scaleY: 1
							},
							1:{
								x: 913,
								y: 502,
								width: 789,
								height: 429,
								rotate: 0,
								scaleX: 1,
								scaleY: 1
							},
							2:{
								x: 1658,
								y: 519,
								width: 731,
								height: 440,
								rotate: 0,
								scaleX: 1,
								scaleY: 1
							}
						},
						2: {
							0:{
								x: 244,
								y: 918,
								width: 717,
								height: 412,
								rotate: 0,
								scaleX: 1,
								scaleY: 1
							},
							1:{
								x: 937,
								y: 931,
								width: 724,
								height: 405,
								rotate: 0,
								scaleX: 1,
								scaleY: 1
							},
							2:{
								x: 1641,
								y: 942,
								width: 655,
								height: 422,
								rotate: 0,
								scaleX: 1,
								scaleY: 1
							}
						}
					};
                    break;
                case "Table Demo":
                    cropData = {
						0: {
							0:{
								x: 840,
								y: 389,
								width: 660,
								height: 470,
								rotate: 0,
								scaleX: 1,
								scaleY: 1
							},
							1:{
								x: 1931,
								y: 677,
								width: 572,
								height: 409,
								rotate: 0,
								scaleX: 1,
								scaleY: 1
							},
							2:{
								x: 2760,
								y: 763,
								width: 531,
								height: 502,
								rotate: 0,
								scaleX: 1,
								scaleY: 1
							}
						},
						1: {
							0:{
								x: 577,
								y: 804,
								width: 499,
								height: 422,
								rotate: 0,
								scaleX: 1,
								scaleY: 1
							},
							1:{
								x: 1111,
								y: 1217,
								width: 557,
								height: 498,
								rotate: 0,
								scaleX: 1,
								scaleY: 1
							},
							2:{
								x: 2261,
								y: 1165,
								width: 567,
								height: 457,
								rotate: 0,
								scaleX: 1,
								scaleY: 1
							}
						},
						2: {
							0:{
								x: 356,
								y: 1668,
								width: 622,
								height: 489,
								rotate: 0,
								scaleX: 1,
								scaleY: 1
							},
							1:{
								x: 1661,
								y: 1801,
								width: 732,
								height: 448,
								rotate: 0,
								scaleX: 1,
								scaleY: 1
							},
							2:{
								x: 3123,
								y: 1597,
								width: 620,
								height: 517,
								rotate: 0,
								scaleX: 1,
								scaleY: 1
							}
						}
					};
                    break;
                default:
            }
		},
		
		// Show or hide the config UI
		showhideConfig: function() {
			var that = this;
			var grid = this.getView().byId("grid-container"); // Must get by ID to use .setVisible as part of sap UI5
			var config = this.getView().byId("configUI"); // Must get by ID to use .setVisible as part of sap UI5
			
			this.updateUI(); // Update Cell Visuals
			
			if (grid.getVisible()) { // Check which is visible
				grid.setVisible(false);
				config.setVisible(true);
				
				setTimeout(function() { // Wait briefly to insure elements render before adding clickable function
				
				$(".config-cell").on("click", function() { // When cell is clicked
				   var cell = that.getView().byId("config-cell-"+this.id.split("")[24]+""+this.id.split("")[25]); // Get actual cell
				   
				   currentCell.cell = cell; // Set current cell
				   currentCell.row = this.id.split("")[24]; // Set row via dom cell id
				   currentCell.col = this.id.split("")[25]; // Set col via dom cell id
				   
				   that.getView().byId("myModal").setVisible(true); // Show modal for cropping
					setTimeout(function() { // Wait briefly to insure elements render before adding cropping image
						var modalImg = $("#img01")[0]; // document.getElementById("img01");
						var captionText = $("#caption")[0]; // document.getElementById("caption");
					 
						var file = $("#input")[0].files[0]; // Get uploaded file
						var reader  = new FileReader(); // New file reader
						
						// Once file has loaded
						reader.addEventListener("load", function () {
							modalImg.src = reader.result; // Set modal image to uploaded image
							$("#img02")[0].src = reader.result; // Set Preview Thumbnail to uploaded image
							currentImg = reader.result; // Set global variable currentimg to uploaded imgae
							that.cropNext(); // Create cropper with function
						}, false);
						
						if (file) {
							reader.readAsDataURL(file);
						}
					}, 100);
				});
				}, 100);
			
			} else { // If config visible, hide config and show shelf UI
				grid.setVisible(true);
				config.setVisible(false);
			}
			
			
		},
		
		// Creates the cropper on the img
		cropNext: function() {
			cropper = new Cropper($("#img01")[0]); // Convert img element to cropper element
			
			// Once cropper is initalized if previous crop exsits set to previous crop
			setTimeout(function() {
				var row = currentCell.row;
				var col = currentCell.col;
				
				if (cropData[row][col]) {
	                cropper.setData(cropData[row][col]); // Set crop box data
	            }
			}, 100);
		},
		
		// Update the preview image to be visible when image has been uploaded
		onChangeConfig: function(oEvent){
			var file = $("#input")[0].files[0]; // Get file upload
            var reader = new FileReader();

			// Once file has loaded
			reader.addEventListener("load", function () {
			    $("#img02")[0].src = reader.result; // Set Preview Thumbnail to uploaded image
			    currentImg = reader.result; // Set global variable currentimg to uploaded imgae
			  }, false);
			
			  if (file) {
			    reader.readAsDataURL(file);
			  }
        },
		
		// ...not sure if tihs function is actually used
		onChange: function(oEvent){
            this.classify();
        },
        
        // Update Shelf UI Visuals
		updateUI: function() {
		    for (var i = 0; i < 3; i++) { // Loops rows
		        for (var j = 0; j < 3; j++) { // Loop cols
		        	var cell = this.getView().byId("grid-cell-"+i+""+j); // Get current grid cell *Must do this way to use SAP UI5 addStyleClass
		        	var icon = this.getView().byId("grid-cell-icon-"+i+""+j); // Get current grid cell icon *Must do this way to use SAP UI5 setSrc
		        	
		        	// Remove all classes first since addStyleClass only adds a class, it doesn't change it
		        	cell.removeStyleClass("grid-cell red");
		        	cell.removeStyleClass("grid-cell white");
		        	cell.removeStyleClass("grid-cell blue");
		        	cell.removeStyleClass("grid-cell empty");
		        	cell.removeStyleClass("grid-cell missing");
		        	
		        	// Test for value to set correct color
		            switch (cellValues[i][j].toLowerCase()){
		                case "r":
		                	cell.addStyleClass("grid-cell red");
		                	icon.setSrc("sap-icon://"+bearing_icon);
		                    break;
		                case "w":
		                    cell.addStyleClass("grid-cell white");
		                	icon.setSrc("sap-icon://"+bearing_icon);
		                    break;
		                case "b":
		                    cell.addStyleClass("grid-cell blue");
		                	icon.setSrc("sap-icon://"+bearing_icon);
		                    break;
		                case "e":
		                    cell.addStyleClass("grid-cell empty");
		                	icon.setSrc("sap-icon://"+empty_icon);
		                    break;
		                default:
		                    cell.addStyleClass("grid-cell missing");
		                	icon.setSrc("sap-icon://"+missing_icon);
		            }
		        }
		    }
		},
		
		// Post call to get Bearer Token, promise resolves token
		getToken: function() {
			return new Promise(function(resolve, reject) { // Create returnable promise
				var xhr = new XMLHttpRequest();
				xhr.withCredentials = true;
				
				// Once post is complete
				xhr.addEventListener("readystatechange", function () {
				  if (this.readyState === 4) {
				    	var json = JSON.parse(this.response); // Convert response to json
				    	resolve(json.access_token); // Resolve (return) Bearer Token
				  }
				});
				
				// If post fails reject
				xhr.onerror = reject;
				
				// Set xhr settings
				xhr.open("POST", "/TokenAuth/oauth/token?grant_type=client_credentials");
				xhr.setRequestHeader("Authorization", "Basic c2ItYTY5N2ZjZmMtNzE3YS00OWYwLTliMTYtNWQzZGZmN2U3NjE1IWI0MDU5fG1sLWZvdW5kYXRpb24teHN1YWEtc3RkIWI1NDA6L21jWFJUOG9vZkRPa2lPRkFnbm1ZeXY0QWRrPQ==");
				xhr.setRequestHeader("Cache-Control", "no-cache");
				xhr.setRequestHeader("Postman-Token", "0d4da783-ad4f-435b-a97d-4c5a99f81907");
				
				// Send xhr Post
				xhr.send();
			});
		},
		
		// Use crop data to get all cropped images
		test: function() {
			return new Promise(function(resolve, reject) { // Create returnable promise
				cropper = new Cropper($("#img02")[0]); // Convert preview thumbnail to cropper
				
				 // Wait briefly to insure cropper is made before setting crop data
				setTimeout(function() {
					
					let dataSetActions = []; // List of promises to complete
					
					// After loop for each item create promise, get cropped image
					let addDataPromise = function(row,col){
					    var promiseData = new Promise(function(resolve, reject) { // New Promise
					    	var canvas = cropper.getCroppedCanvas(); // Get cropped section
					    	
			                canvas.toBlob(function (blob) { // Set image as blob
			                	cropSrc[row][col].src = blob; // Set blob (image) to global variable
			                	resolve(row + "" + col + " Complete"); // Resolve (return) the cell number that was completed
			                });
					    });
					    return promiseData.then(x => { // Return promise, then
					        console.log(x) // Display resolved message (i.e. shows that the promise was completed)
					    })
					}
					
					// Loop rows & cols, set crop box and add promise funciton to list
					for (let row=0; row<3; row++) {
						for (let col=0; col<3; col++) {
							if (cropData[row][col]) { // If crop data exsits
				                cropper.setData(cropData[row][col]); // Set crop box to crop data
				                dataSetActions.push(addDataPromise(row,col)) // Add crop function to list of promises
				            }
						}
					}
					
					// Once all promises have been resolved then destroy cropper and return that cropping has completed
					Promise.all(dataSetActions).then(x => {
						if (cropper) {
							cropper.destroy();
						}
						resolve('Cropping Complete');
					});
					
				}, 100);
			});
		},
		
		// Add all cropped images to zip archive
		zipImg: function() {
			return new Promise(function(resolve, reject) { // Create returnable promise
				var zip = new JSZip(); // Create new zip object

				let fileAddActions = []; // List of promises to complete
				
				// After loop for each item create promise, add image file to zip
				let addFilePromise = function(filename){
				    zip.file(fileName, cropSrc[row][col].src); // Add image file to zip
				
				    return zip.file(fileName).async("blob").then(x => { // Return promise, then
				        console.log(x) // Display resolved message (i.e. shows that the promise was completed)
				    })
				}
				
				// Loop rows & cols, create filename and add promise funciton to list
				for (var row = 0; row < 3; row++) { // Loop for rows
				    for (var col = 0; col < 3; col++) { // Loop for cols
				        if (cropSrc[row][col].src) { // If data for cropped img exists
				            var fileName = row + "" + col + ".png"; // Create filename
				            fileAddActions.push(addFilePromise(fileName)) // Add zip function to list of promises
				        }
				    }
				}
				
				// Once all promises have been resolved then zip archive
				Promise.all(fileAddActions).then(x => {
				    console.log("Files Added") // Display all files added to zip
				    
				    // Generate zip file
				    zip.generateAsync({type:"blob"}).then(function (content) {
				        postZip = content; // Save zip as global variable
				        resolve('Zip Created'); // Return that zipping is complete
				    });
				})
			});
		},
		
		// xhr post to get machine learning data to update UI
        classify: function(oEvent) {
        	var that = this;
        	
        	// Fist get bearer token for authorization
        	this.getToken()
				.then(function(token) {
				    var input = $("#upload_file")[0];
				    
		            var xhr = new XMLHttpRequest(); // New xhr request
		            xhr.withCredentials = true;
		            
		            // Once post is complete
		            xhr.addEventListener("readystatechange", function () {
		                if (this.readyState === this.DONE) {
		                    that.getView().byId("grid-container").setBusy(false); //release busy indicator
		                    var json = JSON.parse(this.response); // convert response text to json format
		                    
		                    // Loop for all cells in response
		                    for (var i = 0; i < Object.keys(json.predictions).length; i++) {
		                    	// Set cellvalue to correct value of response (ex: If response for cell 02 is "Red" set cellValues[0][2] = "R")
								cellValues[json.predictions[i].name.split("")[0]][json.predictions[i].name.split("")[1]] = json.predictions[i].results[0].label[0];
			                }
		                    
		                    // Update UI function to update visuals
		                    that.updateUI();
		                }
			            });
			
		            // Set xhr settings
		            xhr.open("POST", "/MLConfig/api/v2/image/classification/models/SARAH/versions/1", false);
		            xhr.setRequestHeader("accept", "application/json");
		            xhr.setRequestHeader("Authorization", "Bearer " + token);
		            
		            // Set busy indicator on shelf UI to show the call is in progress
		            that.getView().byId("grid-container").setBusy(true);

		            // Prepare file for api call
		            var data = new FormData();
		            data.append("files", postZip, "classify.zip"); // Add zip file to classify

		            // Send request
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