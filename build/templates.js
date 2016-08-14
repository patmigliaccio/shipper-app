(function () {
	'use strict';

	angular
		.module('core')
		.run(templates);

	templates.$inject = ['$templateCache'];

	function templates($templateCache) {
		$templateCache.put('modules/totals/client/views/list-totals.client.view.html', '<div class="row">\r\n    <h3 class="col-mg-12 col-lg-10">Awaiting Shipment Totals</h3>\r\n    <div class="col-md-offset-6 col-md-6 col-lg-offset-0 col-lg-2 text-right">\r\n        <button class="col-xs-12 btn btn-info"\r\n                type="button"\r\n                ng-csv="vm.totals"\r\n                csv-header="[\'Product\', \'12oz\', \'5lb\', \'Subscription\', \'Weight\', \'Units\']"\r\n                filename="Totals_Report.csv">Export <i class="fa fa-download"></i></button>\r\n    </div>\r\n</div>\r\n\r\n<div class="col-lg-12 orders-list" ng-show="vm.totals.length">\r\n    <div class="row header-row">\r\n        <div class="col-xs-6">Item</div>\r\n        <div class="col-sm-6">Total Weight</div>\r\n    </div>\r\n\r\n    <div class="row order-row" ng-repeat="total in vm.totals track by $index">\r\n        <div class="col-xs-6">{{ total.itemName }}</div>\r\n        <div class="col-xs-6">{{ total.totalWeight }} {{total.units}}</div>\r\n    </div>\r\n</div>\r\n\r\n<span class="col-lg-12 loader" us-spinner spinner-key="vm.spinner"></span>');	}
})();
