var that;

sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	return Controller.extend("SAP_SARAH_ML_Project.controller.View1", {
		onAfterRendering: function() {
			that = this;
			
			var listItems;
			var items = that.getView().byId("__list0");
			console.log(items);
			// for(var i; i < items.length; i++) {
			// 	listItems[i] = items[i];
			// }
			
		}
	});
});