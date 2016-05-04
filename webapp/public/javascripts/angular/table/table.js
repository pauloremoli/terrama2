angular.module('terrama2.table', ['terrama2'])
  .directive('terrama2Table', function(i18n) {
    return {
      restrict: 'E',
      templateUrl: '/javascripts/angular/table/templates/table.html',
      scope: {
        fields: '=fields',
        model: '=model',
        link: '&',
        icon: '&',
        iconProperties: '=?iconProperties',
        linkToAdd: '=?linkToAdd',
        context: '=context',
        remove: '&?',
        extra: '=?extra'
      },
      
      controller: function($scope, $http, i18n) {
        $scope.i18n = i18n;
        $scope.searchInput = '';
        $scope.emptyMessage = 'No ' + ($scope.context || 'data') + ' found';
        
        // defines display fields in table
        $scope.displayFields = [];
        // fields identifiers
        $scope.identityFields = [];

        $scope.extra = $scope.extra ? $scope.extra : {};

        // remove function
        $scope.removeOperation = function(object) {
          // todo: open model: confirmation

          // callback
          var callback = $scope.extra.removeOperationCallback;
          $http({
            method: 'DELETE',
            url: $scope.remove({object: object})
          }).success(function(response) {
            $scope.model.forEach(function(element, index, arr) {
              if (element.id == object.id)
                arr.splice(index, 1);

              if ($scope.isFunction(callback))
                callback(null, response);
            });

          }).error(function(err) {
            if ($scope.isFunction(callback))
              callback(err);
            console.log(err);
          });
        };

        if (!$scope.iconProperties)
          $scope.iconProperties = {type: 'img'};

        $scope.$watch('fields', function(fields) {
          // processing fields
          fields.forEach(function(field) {
            if (field instanceof Object) {
              // todo: validation throwing errors
              $scope.displayFields.push(field.as);
              $scope.identityFields.push(field.key);
            } else {
              $scope.displayFields.push(field);
              $scope.identityFields.push(field);
            }
          });

        });

        $scope.width = $scope.iconProperties.width || 24;
        $scope.width = $scope.iconProperties.height || 24;

        $scope.isFunction = function(target) {
          return angular.isFunction(target);
        };
        
        $scope.capitalizeIt = function(str) {
          return str.charAt(0).toUpperCase() + str.slice(1);
        }
      }
    }
  });