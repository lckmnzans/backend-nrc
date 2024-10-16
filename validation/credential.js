module.exports = checkUserRole = (requiredRoles) => (req, res, next) => {
    if (req.user && requiredRoles.includes(req.user.role)) {
        return next();
    } else {
        return res.status(403).json({ message: 'Access denied' });
    }
}