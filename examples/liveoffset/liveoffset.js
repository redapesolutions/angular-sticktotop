angular.module('stickyApp', ['ra.sticktotop']).controller('StickController', function($scope) {
  // Height will be somewhere between 100 and 300
  $scope.rand1 = Math.ceil(100+Math.random()*200);
  $scope.rand2 = Math.ceil(100+Math.random()*200);
});