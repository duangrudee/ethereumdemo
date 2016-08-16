'use strict';

angular.module('greeter.version', [
  'greeter.version.interpolate-filter',
  'greeter.version.version-directive'
])

.value('version', '0.1');
