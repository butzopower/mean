'use strict';

angular.module('mean.filters', []).filter('dasherize', function() {
  return function(input) {
    var uncapitalizedInput = input.charAt(0).toLowerCase() + input.slice(1);
    return uncapitalizedInput
      .replace(/([A-Z])/g, '-$1')
      .replace(/[-_\s]+/g, '-')
      .toLowerCase();
  };
});
