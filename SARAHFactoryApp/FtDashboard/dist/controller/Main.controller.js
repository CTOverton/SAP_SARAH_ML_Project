var that;
var connection;
// The web socket connection to the Fischertechnik proxy
var keepAliveIntervall;
var hostname;
var token;	
var tempChart;
var tempProfile;

function readPlantError(data) {
	sap.m.MessageToast.show("Unable to read list of plants in MII.", {
		duration: 3000
	});
}

function readPlantSuccess(data) {
	var ArrayFactories = JSON.parse(data.Rowsets.Rowset[0].Row[0].Sites).Rowsets.Rowset.Row;
	for (var i = 0; i < ArrayFactories.length; i++) {
		var oListItem = new sap.ui.core.ListItem("idList" + i, {
			key: ArrayFactories[i].Site,
			text: ArrayFactories[i].Site,
			additionalText: ArrayFactories[i].Place
		});
		that.getView().byId("plantBox").addItem(oListItem);
	}
	
		// manual addition for test and special purposes
		
/*			var oListItemExtra = new sap.ui.core.ListItem("idList" + ArrayFactories.length, {
			key: "1717",
			text: "1717",
			additionalText: "Berlin"
		});
		that.getView().byId("plantBox").addItem(oListItemExtra);*/

	sap.m.MessageToast.show("Received data from SAP MII.", {
		duration: 3000
	});
}
sap.ui.define(["sap/ui/core/mvc/Controller"], function(Controller) {
	"use strict";
	return Controller.extend("FtDashboard.controller.Main", {
		onInit: function() {
			/*	var oVizFrame = this.getView().byId("idcolumn");

				//                2.Create a JSON Model and set the data
				var oModel = new sap.ui.model.json.JSONModel();
				var data = {
					'Cars': [{
						"Model": "Alto",
						"Value": "7586"
					}, {
						"Model": "Zen",
						"Value": "4311"
					}, {
						"Model": "Santro",
						"Value": "5151"
					}, {
						"Model": "Matiz",
						"Value": "2937"
					}, {
						"Model": "Wagan R",
						"Value": "9740"
					}]
				};
				oModel.setData(data);

				//                3. Create Viz dataset to feed to the data to the graph
				var oDataset = new sap.viz.ui5.data.FlattenedDataset({
					dimensions: [{
						name: 'Model',
						value: "{Model}"
					}],

					measures: [{
						name: 'Cars Bought',
						value: '{Value}'
					}],

					data: {
						path: "/Cars"
					}
				});

				oVizFrame.setDataset(oDataset);
				oVizFrame.setModel(oModel);
				oVizFrame.setVizType('bar');

				oVizFrame.setVizProperties({
					plotArea: {
						colorPalette: d3.scale.category20().range(),
						title: {
							text: "Jochen Test Title Plot Area"
						}
					}
				});

					var feedValueAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
							'uid': "valueAxis",
							'type': "Measure",
							'values': ["Cars Bought"]
						}),
						feedCategoryAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
							'uid': "categoryAxis",
							'type': "Dimension",
							'values': ["Model"]
						});
					oVizFrame.addFeed(feedValueAxis);
					oVizFrame.addFeed(feedCategoryAxis);*/

		},
		onAfterRendering: function() {
			that = this;
			this.connect();
			tempChart = that.getView().byId("tempChart");
			tempProfile = "cool";

			//prefill chart

			var i;
			for (i = 0; i < 20; i++) {
				var randValue = Math.floor(Math.random() * 100) + 80;
				tempChart.addPoint(new sap.suite.ui.microchart.InteractiveLineChartPoint({
					"value": randValue,
					"label": "",
					"displayedValue": randValue
				}));
			}

			//Read possible plants from MII
			$.ajax({
				url: "/XMII/Illuminator?QueryTemplate=fischertechnik%2FFischertechnikSites%2FCollectSitesXacuteQuery&IsTesting=T&Content-Type=text%2Fjson",
				type: "GET",
				//data: "{\"type\": \"cv_analyze\", \"image\": \"" + that.getView().byId("cameraImage").getSrc() + "\"}",
				//dataType: "text",
				contentType: "application/json;charset=utf-8",
				success: readPlantSuccess,
				error: readPlantError,
				async: true
			});
		},
		connect: function() {
			//TODO: remove line below when productive
			hostname = "ftproxya1305c29f.hana.ondemand.com";
			connection = new WebSocket("wss://" + hostname + "/FtProxy/ftproxy");
			connection.onerror = function() {
				sap.m.MessageToast.show("Error in web socket connection.", {
					duration: 3000
				});
			};
			connection.onopen = function() {
				that.getView().byId("connectButton").setState(true);
				/*				sap.m.MessageToast.show("Web socket connection open.", {
									duration: 3000
								});*/
			};
			connection.onclose = function() {
				that.getView().byId("connectButton").setState(false);
				//clearInterval(refreshIntervalId);
				clearInterval(keepAliveIntervall);
				sap.m.MessageToast.show("HCP has closed the web socket connection.", {
					duration: 3000
				});
			};
			connection.onmessage = function(e) {
				var json = JSON.parse(e.data);
				if (json.token.toLowerCase() === token.toLowerCase()) {
					if (json.type.toLowerCase() === "ui5status") {
						
						that.getView().byId("textMaterialValue").setValue(json.material);
						that.getView().byId("textShopOrderValue").setValue(json.shoporder);
						that.getView().byId("textSfcValue").setValue(json.sfc);
						
						var stateStartPlanned = json.stateStartPlanned;
						var stateStartNeutral = json.stateStartNeutral;
						var stateStartPositive = 100 - stateStartPlanned - stateStartNeutral;

						var stateHardeningPlanned = json.stateHardeningPlanned;
						var stateHardeningNeutral = json.stateHardeningNeutral;
						var stateHardeningPositive = 100 - stateHardeningPlanned - stateHardeningNeutral;

						var statePolishPlanned = json.statePolishPlanned;
						var statePolishNeutral = json.statePolishNeutral;
						var statePolishPositive = 100 - statePolishPlanned - statePolishNeutral;

						var stateColorCheckPlanned = json.stateColorCheckPlanned;
						var stateColorCheckNeutral = json.stateColorCheckNeutral;
						var stateColorCheckPositive = 100 - stateColorCheckPlanned - stateColorCheckNeutral;

						var stateAssemblyPlanned = json.stateAssemblyPlanned;
						var stateAssemblyNeutral = json.stateAssemblyNeutral;
						var stateAssemblyNegative = json.stateAssemblyNegative;
						var stateAssemblyPositive = 100 - stateAssemblyPlanned - stateAssemblyNeutral - stateAssemblyNegative;

						var stateArrayStart = [{
							state: sap.suite.ui.commons.ProcessFlowNodeState.Neutral,
							value: stateStartNeutral
						}, {
							state: sap.suite.ui.commons.ProcessFlowNodeState.Planned,
							value: stateStartPlanned
						}, {
							state: sap.suite.ui.commons.ProcessFlowNodeState.Positive,
							value: stateStartPositive
						}];
						var stateArrayHardening = [{
							state: sap.suite.ui.commons.ProcessFlowNodeState.Neutral,
							value: stateHardeningNeutral
						}, {
							state: sap.suite.ui.commons.ProcessFlowNodeState.Planned,
							value: stateHardeningPlanned
						}, {
							state: sap.suite.ui.commons.ProcessFlowNodeState.Positive,
							value: stateHardeningPositive
						}];
						var stateArrayPolish = [{
							state: sap.suite.ui.commons.ProcessFlowNodeState.Neutral,
							value: statePolishNeutral
						}, {
							state: sap.suite.ui.commons.ProcessFlowNodeState.Planned,
							value: statePolishPlanned
						}, {
							state: sap.suite.ui.commons.ProcessFlowNodeState.Positive,
							value: statePolishPositive
						}];
						var stateArrayColorCheck = [{
							state: sap.suite.ui.commons.ProcessFlowNodeState.Neutral,
							value: stateColorCheckNeutral
						}, {
							state: sap.suite.ui.commons.ProcessFlowNodeState.Planned,
							value: stateColorCheckPlanned
						}, {
							state: sap.suite.ui.commons.ProcessFlowNodeState.Positive,
							value: stateColorCheckPositive
						}];
						var stateArrayAssembly = [{
							state: sap.suite.ui.commons.ProcessFlowNodeState.Neutral,
							value: stateAssemblyNeutral
						}, {
							state: sap.suite.ui.commons.ProcessFlowNodeState.Planned,
							value: stateAssemblyPlanned
						}, {
							state: sap.suite.ui.commons.ProcessFlowNodeState.Positive,
							value: stateAssemblyPositive
						}, {
							state: sap.suite.ui.commons.ProcessFlowNodeState.Negative,
							value: stateAssemblyNegative
						}];

						that.getView().byId("processflow").getLane("id0").setState(stateArrayStart);
						that.getView().byId("processflow").getLane("id1").setState(stateArrayHardening);
						that.getView().byId("processflow").getLane("id2").setState(stateArrayPolish);
						that.getView().byId("processflow").getLane("id3").setState(stateArrayColorCheck);
						that.getView().byId("processflow").getLane("id4").setState(stateArrayAssembly);
					} else if (json.type.toLowerCase() === "deliveredcolor") {
						var color = json.color.toLowerCase();
						var oldValue = 0;

						if (color === "white") {
							oldValue = that.getView().byId("bearingChart").getBars()[0].getValue();
							that.getView().byId("bearingChart").getBars()[0].setValue(oldValue + 1);
						} else if (color === "blue") {
							oldValue = that.getView().byId("bearingChart").getBars()[1].getValue();
							that.getView().byId("bearingChart").getBars()[1].setValue(oldValue + 1);
						} else if (color === "red") {
							oldValue = that.getView().byId("bearingChart").getBars()[2].getValue();
							that.getView().byId("bearingChart").getBars()[2].setValue(oldValue + 1);
						} else if (color === "reset") {
							that.getView().byId("bearingChart").getBars()[0].setValue(0);
							that.getView().byId("bearingChart").getBars()[1].setValue(0);
							that.getView().byId("bearingChart").getBars()[2].setValue(0);
						}
					} else if (json.type.toLowerCase() === "temperature") {
						tempProfile = json.tempProfile;
					}

				}

			};
			keepAliveIntervall = setInterval(function() {
				connection.send("{\"type\":\"alive\"}");
			}, 240000);

			setInterval(function() {
				var randValue;
				if (tempProfile.toLowerCase() === "cool") {
					randValue = Math.floor(Math.random() * 100) + 80;
				} else if (tempProfile.toLowerCase() === "hot") {
					//var oldValue = tempChart.getPoints()[19].getValue();
					//randValue = oldValue + Math.floor(Math.random() * 40) + 10 ;
					randValue = Math.floor(Math.random() * 50) + 300;

				}

				tempChart.removePoint(0);
				tempChart.addPoint(new sap.suite.ui.microchart.InteractiveLineChartPoint({
					"value": randValue,
					"label": "",
					"displayedValue": randValue
				}));
			}, 2000);

		},
		onPlantChange: function() {
			/*			var valuePos = 50;
						var valueNeg = 50;
						var stateArray1 = [{
							state: sap.suite.ui.commons.ProcessFlowNodeState.Negative,
							value: 10
						}, {
							state: sap.suite.ui.commons.ProcessFlowNodeState.Positive,
							value: 90
						}];
						var stateArray2 = [{
							state: sap.suite.ui.commons.ProcessFlowNodeState.Planned,
							value: valuePos
						}, {
							state: sap.suite.ui.commons.ProcessFlowNodeState.Positive,
							value: valueNeg
						}];
						//that.getView().byId("processflow").getLane("id0").setState([{state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, value: 10},{state: sap.suite.ui.commons.ProcessFlowNodeState.Negative, value: 90}]);
						that.getView().byId("processflow").getLane("id0").setState(stateArray2);*/

			/*			var tempC = that.getView().byId("tempChart");
						//tempC.removePoint(0);
						tempC.addPoint(new sap.suite.ui.microchart.InteractiveLineChartPoint({
							"value": 33.1,
							"label": "",
							"displayedValue": 9
						}));*/

			var key = that.getView().byId("plantBox").getSelectedKey();
			var text = that.getView().byId("plantBox").getSelectedItem().getAdditionalText();
			token = key;
			sap.m.MessageToast.show("Displaying now plant " + key + " in " + text, {
				duration: 3000
			});
		}

	});
});