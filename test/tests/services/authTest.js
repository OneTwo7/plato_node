describe('mvAuth', function () {
  beforeEach(module('app'));

  describe('authorizeCurrentUserForRoute', function () {
    it('should return true if the current user is admin', inject(function (mvAuth, mvIdentity) {
      mvIdentity.currentUser = {};
      mvIdentity.currentUser.roles = ['admin'];
      expect(mvAuth.authorizeCurrentUserForRoute('admin')).to.be.true;
    }));
  });
});
