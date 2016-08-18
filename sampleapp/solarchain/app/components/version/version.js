'use strict';

angular.module('solarchain.version', [
  'solarchain.version.interpolate-filter',
  'solarchain.version.version-directive'
])

.value('version', '0.1');
