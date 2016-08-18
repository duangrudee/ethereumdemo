'use strict';

describe('solarchain.version module', function() {
  beforeEach(module('solarchain.version'));

  describe('version service', function() {
    it('should return current version', inject(function(version) {
      expect(version).toEqual('0.1');
    }));
  });
});
