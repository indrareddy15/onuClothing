import jwt from 'jsonwebtoken'

export const isAuthenticateuser = async (req, res, next) => {
    const header = req.headers['authorization'];
    if (!header) {
        console.log("No headers provided");
        return res.status(403).json({ success: false, message: "No headers provided" });
    }
    const token = header && header.split(' ')[1];
    if (!token) {
        console.log("No token provided");
        return res.status(403).json({ success: false, message: "User token has been expired or not been generated" });
    }
    jwt.verify(token, process.env.SECRETID, (err, user) => {
        if (err) {
            console.error("Error Verification User: Log In Time Expired: " + err.message);
            // return res.status(403).json({success:false, message:"Token is not valid"});
            return res.status(401).json({ success: false, message: `Log In Expired Please Refresh the Page to Login Again: ${err.message}` });
        }
        // console.log("Auth: User: ",user);
        req.user = user;
        next();
    });
}