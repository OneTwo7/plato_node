describe('userResource', function () {
  beforeEach(module('app'));

  describe('isAdmin', function () {
    it('should return false if user doesn\'t have admin role', inject(function (userResource) {
      var user = new userResource();
      user.roles = ['not admin'];
      expect(user.isAdmin()).to.be.falsey;
    }));
    it('should return true if the user is admin', inject(function (userResource) {
      var user = new userResource();
      user.roles = ['moderator', 'admin'];
      expect(user.isAdmin()).to.be.true;
    }));
  });
});
