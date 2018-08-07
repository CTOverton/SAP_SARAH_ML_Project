sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function(Controller) {
    "use strict";

    return Controller.extend("SAP_SARAH_ML_Project.controller.Main", {
        onInit: function(){
            this.oFileUpload = this.getView().byId("fileUploader");
            this.oImage = this.getView().byId("imageId");
        },

        onAfterRendering: function(){
            //console.log("onAfterRending is called");
            // get DOM element of file input
            var fileInput = $("#previewImg")[0];		//var fileInput = document.getElementById("previewImg");
            // attach event of onchange
            fileInput.addEventListener("change", this.onChange);
        },

        onBeforeRendering: function(){
            //console.log("onBeforeRending is called");
        },

        // handle the image file change event
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

        // call ML API to classify the image
        onClassify: function(oEvent){
            //get file content
            var image = $("#image")[0];

            //get input file information
            var input = $("#previewImg")[0];

            //prepare file for api call
            var data = new FormData();
            data.append("files", input.files[0], input.files[0].name);

            var xhr = new XMLHttpRequest();
            xhr.withCredentials = false;

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
            xhr.open("POST", "/ml/imageclassifier/inference_sync", false);


            //adding request headers
            //xhr.setRequestHeader("Content-Type", "multipart/form-data");	//this will lead to 400 Bad Request error
            xhr.setRequestHeader("Accept", "application/json");
            //API Key for API Sandbox
            xhr.setRequestHeader("APIKey", "AYhSnclqxJyRJxbb9oNBxHGECp21uyFa");

            //set busy indicator before send request to ML API
            this.getView().byId("resultTable").setBusy(true);

            //sending request
            $.sap.delayedCall(2000, this, function(){
                xhr.send(data);
            });

        }
    });
});