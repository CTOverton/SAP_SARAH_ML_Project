// ==== Global Variables ==== //
var test = "";
var bearing_icon = "overlay";
var empty_icon = "circle-task";
var missing_icon = "decline";
var reds, whites, blues, emptys, missings = 0;
var cellValues = [
	["R","W","B"],
	["R","W","B"],
	["R","W","B"]
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
			this.randomizeData(); // Randomize the data
			test = this;
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
            // var fileInput = $("#upload_file")[0]; // JQuery method of getting element instead of: var fileInput = document.getElementById("upload_file");
            // fileInput.addEventListener("change", this.onChange); // causes the "onChange" event to run when fileInput is changed
            
            var fileInput = $("#input")[0];
            fileInput.addEventListener("change", this.onChangeConfig); // causes the "onChange" event to run when fileInput is changed
            
   //         fileInput.addEventListener("change", function(){
   //         	var label = $("#upload_file_label")[0];
   //         	label.innerHTML = "Processing: " + fileInput.files[0].name;                      
			//     that.classify();
			// });
			
			
				// Get the modal
				//var modal = $("#myModal")[0]; //document.getElementById('myModal');
				
				// Get the image and insert it inside the modal - use its "alt" text as a caption
				//var img = $("#myImg")[0]; //document.getElementById('myImg');
				
	
				// $("#myImg")[0].addEventListener("click", function() {
					
				// 	that.getView().byId("myModal").setVisible(true);
				// 	setTimeout(function() {
				// 		var modalImg = $("#img01")[0]; //document.getElementById("img01");
				// 		var captionText = $("#caption")[0]; // document.getElementById("caption");
				// 		// modal.style.display = "block";
				// 	    // modalImg.src = this.src;
				// 	 //   captionText.innerHTML = this.alt;
				// 	}, 100);
				// });
				
				// Get the <span> element that closes the modal
				//var span = $("#close")[0]; // document.getElementsByClassName("close")[0];
				
				// When the user clicks on <span> (x), close the modal
				// $("#close")[0].addEventListener("click", function(){
				// 	modal.style.display = "none";
				// });
			
			
			
			
			// var elements = $(".config-cell");
			// for (var i = 0; i < elements.length; i++) {
			// 	elements[i].addEventListener("click", this.cellCrop;
			// }
			
			// var elements = $(".config-cell");
			// for (var i = 0; i < elements.length; i++) {
			// 	elements[i].addEventListener("click", function() {
			// 		console.log("clicked");
			// 	});
			// }
			
			// $(".config-cell")[0].addEventListener("click", function() {
			// 	console.log("hell");
			// });
			
			// var img = $("#cropimg")[0];
			
			// var cropper = new Cropper(img, {
   //             aspectRatio: 4 / 4,
   //         });
			
			
			
		},
		
		closethis: function() {
			this.getView().byId("myModal").setVisible(false);
			
			if (cropper) {
				cropper.destroy();
			}
		},
		
		configUI: function() {
			
		},
		
		update: function() {
			let that = this;
			
			this.test().then(function(message) {
				console.log(message);
				that.zipImg().then(function(message) {
					console.log(message);
					that.classify();
				});
			});
			
			// var begin = async function() {
			// 	var cropping = await that.test();
			// 	console.log(cropping);
			// 	var zipping = await that.zipImg();
			// 	console.log(zipping);
			// 	that.classify();
			// }
			
			// begin();
			
		},
		
		cellCrop: function() {
			var row = currentCell.row;
			var col = currentCell.col;
			
			cropData[row][col] = cropper.getData(true);
			
			currentCell.cell.addStyleClass("config-cell set");
			currentCell.cell.getItems()[0].setText("Edit");
			this.closethis();
		},
		
		showhideConfig: function() {
			var that = this;
			var grid = this.getView().byId("grid-container");
			var config = this.getView().byId("configUI");
			
			this.updateUI();
			
			if (grid.getVisible()) {
				grid.setVisible(false);
				config.setVisible(true);
				
				setTimeout(function() {
				
				$(".config-cell").on("click", function() {
				   // console.log($(this));
				   //this.classList.add("set");
				   //this.class = "config-cell set";
				   //$(this).addStyleClass(".config-cell set");
				   
				   var cell = that.getView().byId("config-cell-"+this.id.split("")[24]+""+this.id.split("")[25]);
				   
				   currentCell.cell = cell;
				   currentCell.row = this.id.split("")[24];
				   currentCell.col = this.id.split("")[25];
				   
				   that.getView().byId("myModal").setVisible(true);
					setTimeout(function() {
						var modalImg = $("#img01")[0]; // document.getElementById("img01");
						var captionText = $("#caption")[0]; // document.getElementById("caption");
						// modal.style.display = "block";
					    // modalImg.src = $("#input")[0].files[0].toDataURL();
					 //   captionText.innerHTML = this.alt;
					 
						var file = $("#input")[0].files[0];
						  var reader  = new FileReader();
						
						  reader.addEventListener("load", function () {
						  	// console.log("src: " + modalImg.src);
						  	// console.log("Reader: " + reader.result);
						    modalImg.src = reader.result;
						    currentImg = reader.result;
						    that.cropNext();
						  }, false);
						
						  if (file) {
						    reader.readAsDataURL(file);
						  }
					}, 100);
				   
				});
				}, 100);
			
			} else {
				grid.setVisible(true);
				config.setVisible(false);
			}
			
			
		},
		
		cropNext: function() {
			cropper = new Cropper($("#img01")[0]);
			setTimeout(function() {
				var row = currentCell.row;
				var col = currentCell.col;
				
				if (cropData[row][col]) {
	                cropper.setData(cropData[row][col]);
	            }
			}, 100);
		},
		
		// Update the preview image to be visible when image has been uploaded
		onChangeConfig: function(oEvent){
            var input = oEvent.target;
            var reader = new FileReader();

            // get file content
            reader.onload = function(){
                var dataUrl = reader.result;
                // set image area
                var image = $("#img01")[0];			//var image =  document.getElementById("image");
                image.src = dataUrl;
            };
            // read content
            reader.readAsDataURL(input.files[0]);
            

			
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
		
		test: function() {
			return new Promise(function(resolve, reject) {
				// this.getView().byId("config-cell-00-img-container").setVisible(true);
			
				// var grid = $("#config-img-00")[0];
				
				// grid.src = "https://i2.wp.com/beebom.com/wp-content/uploads/2016/01/Reverse-Image-Search-Engines-Apps-And-Its-Uses-2016.jpg?resize=640%2C426";
				
				cropper = new Cropper($("#img01")[0]);
				setTimeout(function() {
					
					let dataSetActions = [];
					let addDataPromise = function(row,col){
					    var promiseData = new Promise(function(resolve, reject) {
					    	var canvas = cropper.getCroppedCanvas();
				                
			                //cropSrc[row][col].src = 
			                canvas.toBlob(function (blob) {
			                	cropSrc[row][col].src = blob;
			                	resolve(row + "" + col + " Promised");
			                });
					    });
					    return promiseData.then(x => {
					        console.log(x)
					    })
					}
					
					for (let row=0; row<3; row++) {
						for (let col=0; col<3; col++) {
							if (cropData[row][col]) {
				                cropper.setData(cropData[row][col]);
				                dataSetActions.push(addDataPromise(row,col))
				            }
						}
					}
					
					Promise.all(dataSetActions).then(x => {
						if (cropper) {
							cropper.destroy();
						}
						resolve('Cropping Complete');
					});
					
				}, 100);
			});
		},
		
		zipImg: function() {
			return new Promise(function(resolve, reject) {
				var zip = new JSZip();

				let fileAddActions = [];
				let addFilePromise = function(filename){
				    zip.file(fileName, cropSrc[row][col].src);
				
				    return zip.file(fileName).async("blob").then(x => {
				        console.log(x)
				    })
				}
				
				
				for (var row = 0; row < 3; row++) { // Loop for rows
				    for (var col = 0; col < 3; col++) { // Loop for cols
				        if (cropSrc[row][col].src) { // If data for cropped img exists
				            var fileName = row + "" + col + ".png";
				            fileAddActions.push(addFilePromise(fileName))
				        }
				    }
				}
				
				Promise.all(fileAddActions).then(x => {
				    console.log("DONE")
				    zip.generateAsync({type:"blob"}).then(function (content) {
				        //window.location = "data:application/zip;base64," + base64;
				        postZip = content;
				        resolve('Zip Created');
				    });
				})
			});
		},
		
        classify: function(oEvent) {
        	var that = this;
        	
        	this.getToken()
				.then(function(token) {
				    // Code depending on result
				    var input = $("#upload_file")[0];
				    

		            // //prepare file for api call
		            // var data = new FormData();
		            // // data.append("files", input.files[0], input.files[0].name);
		            // data.append("files", postZip, "classify.zip");
		
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
		                    
		              //      var label = $("#upload_file_label")[0];
            				// label.innerHTML = "Classify";
		                }
			            });
			
		            //setting request method
		            xhr.open("POST", "/MLConfig/api/v2/image/classification/models/SARAH/versions/1", false);
		            
		            xhr.setRequestHeader("accept", "application/json");
		            xhr.setRequestHeader("Authorization", "Bearer " + token);
		            //set busy indicator before send request to ML API
		            that.getView().byId("grid-container").setBusy(true);
		
		            
		            
		            //prepare file for api call
		            var data = new FormData();
		            // data.append("files", input.files[0], input.files[0].name);
		            data.append("files", postZip, "classify.zip");//.then(function() {
		            // 	xhr.send(data);
		            // });
		            
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




// ================================================== Copy Paste Library

// var cropper = new Cropper($("#preview")[0], {
//                 aspectRatio: 4 / 4,
// 	            });