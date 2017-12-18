exports.getUserObject = function (user) {
  if (user) {
    return {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      roles: user.roles,
      isAdmin: user.isAdmin
    };
  } else {
    return undefined;
  }
};
