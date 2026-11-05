
const jwt = require("jsonwebtoken");

exports.authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
        console.log("JWT_SECRET loaded:", !!process.env.JWT_SECRET);
        console.log("Authorization received:", !!req.headers.authorization);
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("JWT verified:", decoded.email);
        req.user = decoded;
        next();
    } catch (error) {
        console.log("JWT ERROR:", error.message);
        return res.status(401).json({ message: "Invalid token." });
    }

}

exports.isAdmin = async (req, res, next) => {
    try{
        if(!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if(req.user.role !== "Admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        next();
    }catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}
