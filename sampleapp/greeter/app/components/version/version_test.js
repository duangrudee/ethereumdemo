'use strict';

describe('greeter.version module', function() {
  beforeEach(module('greeter.version'));

  describe('version service', function() {
    it('should return current version', inject(function(version) {
      expect(version).toEqual('0.1');
    }));
  });
});
