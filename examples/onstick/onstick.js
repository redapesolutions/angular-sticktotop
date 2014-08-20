angular.module('stickyApp', ['ra.sticktotop']).controller('StickyController', function($scope, $log) {
  $scope.makeRed = function(index, scroll) {
    $log.debug('Sticky div number ' + index + ' got stuck as scroll reached ' + scroll);
    $scope['stuck'+index] = true;
  };

  $scope.makeBlack = function(index) {
    $scope['stuck'+index] = false;
  };
});