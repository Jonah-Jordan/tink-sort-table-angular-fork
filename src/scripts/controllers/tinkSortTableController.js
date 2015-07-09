'use strict';
(function(module) {
  try {
    module = angular.module('tink.sorttable');
  } catch (e) {
    module = angular.module('tink.sorttable', ['ngLodash']);
  }
module.controller('TinkSortTableController',['lodash','$scope',function(_,scope){
    var ctrl = this,
    dataModel = null,
    currentSort = {prop:null,order:null},
    headers = [];

    ctrl.init = function(data){
      dataModel = data;
    };
    ctrl.register = function(data){
      if(currentSort && data && currentSort.prop === data.prop){
        data.fn(currentSort.order);
      }
      headers[data.prop]={fn:data.fn};
    };

    ctrl.reSort = function(){
      if(currentSort && currentSort.prop !== null){
        ctrl.sortHeader(currentSort.prop,currentSort.type,currentSort.order)
      }
    }
    ctrl.sortHeader = function(prop,type,order){
      if(dataModel){
          if(currentSort.prop === prop){
            if(currentSort.order === 1){
              currentSort.order = -1;
            }else{
              currentSort.order = 1;
            }
        }else{
          if(currentSort.prop !== null){
            headers[currentSort.prop].fn(-99);
          }
          currentSort.order = 1;
          currentSort.prop = prop;
        }
        if(order){
          currentSort.order = order;
        }
        if(scope.tinkCallback){
          var stringOrder = true;
          if(currentSort.order === 1){
            stringOrder = true;
          }else{
            stringOrder = false;
          }
          scope.tinkCallback({$property:prop,$order:stringOrder,$type:type});
        }
        currentSort.type = type;
        if(scope.tinkSort !== false && scope.tinkSort !== 'false' && scope.tinkSort !== null && scope.tinkSort !== undefined){
          sortData(currentSort.order,prop,dataModel,type);
        }
        headers[prop].fn(currentSort.order);
      }
    };

    Object.byString = function(o, s) {
        s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
        s = s.replace(/^\./, '');           // strip a leading dot
        var a = s.split('.');
        for (var i = 0, n = a.length; i < n; ++i) {
            var k = a[i];
            if (k in o) {
                o = o[k];
            } else {
                return;
            }
        }
        return o;
    }


    function sortData(order,prop,data,type){
      if(type && type.toLowerCase() === 'date'){
            dataModel = dataModel.sort(function(a,b){
              var obj1Val = Object.byString(a,prop);
              var obj2Val = Object.byString(b,prop);
              return order*(obj1Val-obj2Val);
            });
      }else{
        dataModel = dataModel.sort(function(obj1, obj2) {


          var obj1Val = Object.byString(obj1,prop);
          var obj2Val = Object.byString(obj2,prop);

          if(!_.isString(obj1Val)){
            obj1Val = obj1Val.toString();
          }

          if(!_.isString(obj2Val)){
            obj2Val = obj2Val.toString();
          }
            return order*obj1Val.localeCompare(obj2Val);

        });
      }
    }

  }]);
})();