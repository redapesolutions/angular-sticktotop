angular.module('stickyApp', ['ra.sticktotop']).controller('StickyController', function($scope) {
  $scope.makeRed = function() {
    $scope.stuck = true;
  };

  $scope.makeBlack = function() {
    $scope.stuck = false;
  };
});