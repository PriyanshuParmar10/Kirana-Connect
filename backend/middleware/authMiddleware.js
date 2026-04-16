const jwt = require("jsonwebtoken");

const protect = async (req, res, next) => {
    if (!req.headers.authorization ||
        !req.headers.authorization.startsWith("Bearer")) {
        return res.status(401).json({ message: "Not authorized, no token" });
    }

    try {
        const token = req.headers.authorization.split(" ")[1];
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decode;
        next();
    } catch (error) {
        res.status(401).json({ message: "Not authorized, token failed" });
    }
};

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                message: `Role: ${req.user.role} is not authorized to access this route.` 
            });
        }
        next();
    };
};

module.exports = { protect, authorize };

