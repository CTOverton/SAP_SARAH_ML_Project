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
			// just testing
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
			
			
			
		},
		
		// call ML API to classify the image
        onClassify: function(oEvent){
            //get input file information
            var input = $("#previewImg")[0];

            //prepare file for api call
            var data = new FormData();
            data.append("files", input.files[0], input.files[0].name);

            var xhr = new XMLHttpRequest();
            xhr.withCredentials = true;

            var that = this;

            xhr.addEventListener("readystatechange", function () {
                if (this.readyState === this.DONE) {
                    //release busy indicator
                    that.getView().byId("resultTable").setBusy(false);
                    // convert response text to json format
                    var json = JSON.parse(this.response);
                    var oModel = new sap.ui.model.json.JSONModel();
                    oModel.setData(json.predictions[0]);
                    that.getView().setModel(oModel);
                }
            });

            //setting request method
            xhr.open("POST", "/MLConfig/api/v2/image/classification/models/SARAH/versions/1", false);
            
            xhr.setRequestHeader("accept", "application/json");
            //API Key for API Sandbox
            xhr.setRequestHeader("Authorization", "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImtleS1pZC0xIn0.eyJqdGkiOiI0Yzc0YzZkOGE0ODk0NTZjOWI2MjE3Njc5Njc0ZDJhNiIsImV4dF9hdHRyIjp7ImVuaGFuY2VyIjoiWFNVQUEiLCJ6ZG4iOiJtYXhhdHRuc3ViZG9tYWluIiwic2VydmljZWluc3RhbmNlaWQiOiJhNjk3ZmNmYy03MTdhLTQ5ZjAtOWIxNi01ZDNkZmY3ZTc2MTUifSwic3ViIjoic2ItYTY5N2ZjZmMtNzE3YS00OWYwLTliMTYtNWQzZGZmN2U3NjE1IWI0MDU5fG1sLWZvdW5kYXRpb24teHN1YWEtc3RkIWI1NDAiLCJhdXRob3JpdGllcyI6WyJtbC1mb3VuZGF0aW9uLXhzdWFhLXN0ZCFiNTQwLmRhdGFtYW5hZ2VtZW50LnJlYWQiLCJtbC1mb3VuZGF0aW9uLXhzdWFhLXN0ZCFiNTQwLnJldHJhaW5zZXJ2aWNlLnJlYWQiLCJtbC1mb3VuZGF0aW9uLXhzdWFhLXN0ZCFiNTQwLm1vZGVsZGVwbG95bWVudC5hbGwiLCJ1YWEucmVzb3VyY2UiLCJtbC1mb3VuZGF0aW9uLXhzdWFhLXN0ZCFiNTQwLm1vZGVsc2VydmljZS5yZWFkIiwibWwtZm91bmRhdGlvbi14c3VhYS1zdGQhYjU0MC5zdG9yYWdlYXBpLmFsbCIsIm1sLWZvdW5kYXRpb24teHN1YWEtc3RkIWI1NDAuZGF0YW1hbmFnZW1lbnQud3JpdGUiLCJtbC1mb3VuZGF0aW9uLXhzdWFhLXN0ZCFiNTQwLmZ1bmN0aW9uYWxzZXJ2aWNlLmFsbCIsIm1sLWZvdW5kYXRpb24teHN1YWEtc3RkIWI1NDAubW9kZWxyZXBvLnJlYWQiLCJtbC1mb3VuZGF0aW9uLXhzdWFhLXN0ZCFiNTQwLnJldHJhaW5zZXJ2aWNlLndyaXRlIiwibWwtZm91bmRhdGlvbi14c3VhYS1zdGQhYjU0MC5pbmZlcmVuY2UiLCJtbC1mb3VuZGF0aW9uLXhzdWFhLXN0ZCFiNTQwLm1vZGVsbWV0ZXJpbmcucmVhZCIsIm1sLWZvdW5kYXRpb24teHN1YWEtc3RkIWI1NDAubW9kZWxyZXBvLndyaXRlIl0sInNjb3BlIjpbIm1sLWZvdW5kYXRpb24teHN1YWEtc3RkIWI1NDAuZGF0YW1hbmFnZW1lbnQucmVhZCIsIm1sLWZvdW5kYXRpb24teHN1YWEtc3RkIWI1NDAucmV0cmFpbnNlcnZpY2UucmVhZCIsIm1sLWZvdW5kYXRpb24teHN1YWEtc3RkIWI1NDAubW9kZWxkZXBsb3ltZW50LmFsbCIsInVhYS5yZXNvdXJjZSIsIm1sLWZvdW5kYXRpb24teHN1YWEtc3RkIWI1NDAubW9kZWxzZXJ2aWNlLnJlYWQiLCJtbC1mb3VuZGF0aW9uLXhzdWFhLXN0ZCFiNTQwLnN0b3JhZ2VhcGkuYWxsIiwibWwtZm91bmRhdGlvbi14c3VhYS1zdGQhYjU0MC5kYXRhbWFuYWdlbWVudC53cml0ZSIsIm1sLWZvdW5kYXRpb24teHN1YWEtc3RkIWI1NDAuZnVuY3Rpb25hbHNlcnZpY2UuYWxsIiwibWwtZm91bmRhdGlvbi14c3VhYS1zdGQhYjU0MC5tb2RlbHJlcG8ucmVhZCIsIm1sLWZvdW5kYXRpb24teHN1YWEtc3RkIWI1NDAucmV0cmFpbnNlcnZpY2Uud3JpdGUiLCJtbC1mb3VuZGF0aW9uLXhzdWFhLXN0ZCFiNTQwLmluZmVyZW5jZSIsIm1sLWZvdW5kYXRpb24teHN1YWEtc3RkIWI1NDAubW9kZWxtZXRlcmluZy5yZWFkIiwibWwtZm91bmRhdGlvbi14c3VhYS1zdGQhYjU0MC5tb2RlbHJlcG8ud3JpdGUiXSwiY2xpZW50X2lkIjoic2ItYTY5N2ZjZmMtNzE3YS00OWYwLTliMTYtNWQzZGZmN2U3NjE1IWI0MDU5fG1sLWZvdW5kYXRpb24teHN1YWEtc3RkIWI1NDAiLCJjaWQiOiJzYi1hNjk3ZmNmYy03MTdhLTQ5ZjAtOWIxNi01ZDNkZmY3ZTc2MTUhYjQwNTl8bWwtZm91bmRhdGlvbi14c3VhYS1zdGQhYjU0MCIsImF6cCI6InNiLWE2OTdmY2ZjLTcxN2EtNDlmMC05YjE2LTVkM2RmZjdlNzYxNSFiNDA1OXxtbC1mb3VuZGF0aW9uLXhzdWFhLXN0ZCFiNTQwIiwiZ3JhbnRfdHlwZSI6ImNsaWVudF9jcmVkZW50aWFscyIsInJldl9zaWciOiIzNjZiYWUyNyIsImlhdCI6MTUzMDEwNzI1MiwiZXhwIjoxNTMwMTUwNDUyLCJpc3MiOiJodHRwOi8vbWF4YXR0bnN1YmRvbWFpbi5sb2NhbGhvc3Q6ODA4MC91YWEvb2F1dGgvdG9rZW4iLCJ6aWQiOiJmMGYxMGM2Zi1mYTFiLTQ1ZDYtOTM2Zi0yNTQxNDQ2YTY0ZjgiLCJhdWQiOlsic2ItYTY5N2ZjZmMtNzE3YS00OWYwLTliMTYtNWQzZGZmN2U3NjE1IWI0MDU5fG1sLWZvdW5kYXRpb24teHN1YWEtc3RkIWI1NDAiLCJtbC1mb3VuZGF0aW9uLXhzdWFhLXN0ZCFiNTQwLm1vZGVsc2VydmljZSIsInVhYSIsIm1sLWZvdW5kYXRpb24teHN1YWEtc3RkIWI1NDAucmV0cmFpbnNlcnZpY2UiLCJtbC1mb3VuZGF0aW9uLXhzdWFhLXN0ZCFiNTQwIiwibWwtZm91bmRhdGlvbi14c3VhYS1zdGQhYjU0MC5mdW5jdGlvbmFsc2VydmljZSIsIm1sLWZvdW5kYXRpb24teHN1YWEtc3RkIWI1NDAuZGF0YW1hbmFnZW1lbnQiLCJtbC1mb3VuZGF0aW9uLXhzdWFhLXN0ZCFiNTQwLm1vZGVsZGVwbG95bWVudCIsIm1sLWZvdW5kYXRpb24teHN1YWEtc3RkIWI1NDAuc3RvcmFnZWFwaSIsIm1sLWZvdW5kYXRpb24teHN1YWEtc3RkIWI1NDAubW9kZWxyZXBvIiwibWwtZm91bmRhdGlvbi14c3VhYS1zdGQhYjU0MC5tb2RlbG1ldGVyaW5nIl19.hpICKf_Dl01t5W1p3Jtp7echmiMQTItmGmBD0A_b0mCHctYcwmucgsGDGHXSTW6eO1-R8rElKF-yrmpZh6oeVZGBBGtVFLgNi3iOedhJkzCCnV51y6_3MPQmGpyMvLFX-kEObVmtYa7yBX-VepmYEXpJyH1RVIrTwqoejBrcaPw--Qj1aIZmZiDeA7oCA63cLE3uCLqhsIDLQu5RtCfVX6Zw0ldtSd1vP31iS_wdTYxiRKQgV8DzLODaopsoTQv0hsIGMTCiA3ivZfGMyarer6KyQ1mu6SlXvcYT4UkfMrr1W0mW6Yp_RHgJdnxmz7i-A2mGHl8fn8VQiElITH5_ple66upuonBKBFpiaTL-HgwNPaqfmntPNYQcz6Fs46IYKVvpgoOXD_gATvXLAI_sQtrwPOhxSuns1-7yWNmt-ytLV0n5imtzKdKWmVLTjI53iJUMrFcXq4JkEmJZ97uav7uCT0JXAhHQhEhFyBB0rR-TuEsY6i9IZ2E7gQNiGdYftkLTIxPX0pnJN8QHM3eT5vTOXAvygc95NHESye6KkVlozRjAobWQFdMqFW--ie68hv_ks6pUneCKvHERH-tbxmQyNmsf0dKbuBdeZcWnuVlvbu-HTiO-tGA7fIhIMZ2Z85fUNsmcgRn6TZQL-bEbHOUF3DqAnFHOJyLAgJSwNNI");
            
            //set busy indicator before send request to ML API
            this.getView().byId("resultTable").setBusy(true);

            //sending request
            $.sap.delayedCall(2000, this, function(){
                xhr.send(data);
            });

        }
	});
});