(function() {
  var module = angular.module('ra.sticktotop', ['ng']);

  module.directive('stickyContainer', function($log) {
    // If lodash is available, it probably is more efficient than our throttle
    try {
      var throttle = _.throttle;
      $log.info('Sticky container: Using lodash throttle');
    } catch(e){
      $log.info('Sticky container: Lodash not found, using internal throttle function. Consider using lodash for better performance');
      var throttle = function throttle(callback, interval) {
        var timeout = null;
        return function() {
          if(!timeout) {
            timeout = setTimeout(function() {
              clearTimeout(timeout);
              timeout = null;
            }, interval);
            return callback.call(callback, arguments);
          }
        };
      };
    } 
    return {
      restrict: 'AE',
      link: function postLink(scope, element, attributes){        
      },
      controller: function($element, $scope, $attrs) {
        this.parentElement = $element;
        var period = parseInt($attrs.scrollPeriod, 10) || 50;
        var triggers = [];
        // Utility function used for keeping track of the index of the sub directive within its parent
        this.getIndex = function() {
          return triggers.length;
        };
        this.addTrigger = function(fn) {
          triggers.push(fn);
          return function clearTrigger() {
            var index = -1;
            angular.forEach(triggers, function findCb(cb, i) {
              if(fn === cb) {
                index = i;
              }
            });
            if(index !== -1){
              triggers.splice(index, 1);
            } else {
              $log.debug('Trigger callback could not be removed: not found, there might be an error in the code?');
            }
            // TODO if we decide to go the lodash way, would be quite a bit nicer
            // triggers = _.without(triggers, fn);
          };
        };

        var trigger = throttle(function(event) {
          angular.forEach(triggers, function(i) {
            i($element[0].scrollTop, event, $element);
          });
        }, period);
        $element.on('scroll', trigger);
        // Avoid memory leaks
        $element.on('$destroy', function() {
          $element.off('scroll', trigger);
        });
      }
    }
  })
  .directive('stickyDiv', function($parse) {
    return {
      restrict: 'A',
      require: '^stickyContainer',
      compile: function(element, attributes, controller) {
        // Default class to be used on copy and original
        var outOfViewClass = attributes.outOfViewClass || 'out-of-view';
        // Remove directive to avoid infinite loop (cause Angular is going through the elements and  finding a new directive each time)
        element[0].removeAttribute('sticky-div');
        // Keep a copy of the original element (to be fixed)
        var elementCopy = element.clone();
        // Add a class to differentiate the two
        elementCopy.addClass('sticky-div-copy');
        element.addClass('sticky-div-original');
        // Add it to the DOM
        element.after(elementCopy);

        // Prepare some things that don't need the scope
        // Add an offset at which the div should move
        var extra = attributes.stickyOffset ? $parse(attributes.stickyOffset) : angular.bind(angular, angular.identity, 0);
        // If we pass a function on fix and on unfix, create a new scope
        var onStick = $parse(attributes.onStick);
        var onUnstick = $parse(attributes.onUnstick);

        return function postLink(scope, element, attributes, controller){
          // Keep track of index of this particular sticky div
          var index = controller.getIndex();
          // Let's assume that padding won't change at least?
          var parentPaddingTop = parseInt(window.getComputedStyle(controller.parentElement[0]).paddingTop, 10);
          
          // If live offset is on, we expect the boxes tohave changed size/position
          // This is slightly resource heavier but needed if things are not in place when directive is created
          if(angular.isDefined(attributes.liveOffset)) {
            var initialOffset = function readPosition() {
              return element[0].offsetTop - (controller.parentElement[0].offsetTop + parentPaddingTop + extra());
            }; 
          } else {
            // Read top position from top parent if live offset isn't on
            // Make it a function  for consistency but basically return a value
            var initialOffset = angular.bind(angular, angular.identity, element[0].offsetTop - (controller.parentElement[0].offsetTop + parentPaddingTop + extra(scope)));
          }

          var clearTrigger = controller.addTrigger(function(scroll, event, parentElement) {
            var hasIt = elementCopy.hasClass(outOfViewClass);
            var isOut = scroll >= initialOffset();
            var stateChange;
            if(hasIt && !isOut) {
              elementCopy.removeClass(outOfViewClass);
              element.removeClass(outOfViewClass);
              stateChange = 'removed';
            } else if(!hasIt && isOut) {
              elementCopy.addClass(outOfViewClass);
              element.addClass(outOfViewClass);
              stateChange = 'added';
            }
            // Do we care about change of state?
            if(stateChange && (onStick || onUnstick)) {
              scope.$apply(angular.bind(scope, (stateChange === 'removed' ? onUnstick : onStick), scope, {$index: index, $scrollPosition: scroll, $event: event}));
            }
          });

          // TODO: scope destroy or element destroy?
          scope.$on('$destroy', clearTrigger);
        }
      }
    }
  });

}).call(this);