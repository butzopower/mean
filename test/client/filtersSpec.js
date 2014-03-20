'use strict';

describe('Filters', function () {
  beforeEach(module('mean.filters'));

  describe('| dasherize', function () {
    beforeEach(inject(function (dasherizeFilter) {
      this.filter = dasherizeFilter;
    }));

    it('dasherizes the input', function () {
      expect(this.filter('foo bar')).toEqual('foo-bar');
    });

    it('copes with camecase', function () {
      expect(this.filter('FooBar')).toEqual('foo-bar');
    });
  });
});
