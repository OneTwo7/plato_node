describe('auth', function () {
  beforeEach(module('app'));

  describe('authorizeCurrentUserForRoute', function () {
    it('should return true if the current user is admin', inject(function (auth, identity) {
      identity.currentUser = {};
      identity.currentUser.roles = ['admin'];
      expect(auth.authorizeCurrentUserForRoute('admin')).to.be.true;
    }));
  });
});
