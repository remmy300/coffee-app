import jwt from "jsonwebtoken";
export const protect = (req, res, next) => {
    const request = req;
    const token = req.cookies.accessToken;
    if (!token)
        return res.status(401).json({ message: "Not authorized" });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        request.user = decoded;
        console.log("Decoded JWT:", decoded);
        next();
    }
    catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};
export const adminOnly = (req, res, next) => {
    const request = req;
    if (request.user?.role !== "admin") {
        return res.status(403).json({ message: "Admin only" });
    }
    next();
};
