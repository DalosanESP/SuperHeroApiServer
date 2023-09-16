// Middleware function to verify authentication
export function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  if (req.user) {
    console.log(user)
    return next();
  }

  res.redirect('/'); // Redirect to login page if not authenticated
}

