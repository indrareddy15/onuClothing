import jwt from 'jsonwebtoken'
import User from '../model/usermodel.js'

const ProtectAdminRoute = async(req, res, next)=>{
    const header = req.headers['authorization'];
    // if(!header) return res.status(401).json({Success:false,message: 'No Headers Found!'});
    if(!header) {
        // return next( new ErrorHandler('User token has been expired or not been generated', 401))
        return res.status(401).json({success:false,message: 'User token has been expired or not been generated'})
    }
    const token = header && header.split(' ')[1];
    // if(!token) return res.status(402).json({Success:false,message: 'No token, authorization denied'});
    if (!token) {
        // return next( new ErrorHandler('User token has been expired or not been generated', 401)) 
        return res.status(401).json({success:false,message: 'User not found'})
    }

    const verifiedToken = jwt.verify(token, process.env.SECRETID)

    if(!verifiedToken) return next(new Error('User not found', 403));

    const user = await User.findById(verifiedToken.id)
	if (!user) {
        // return next(new ErrorHandler('User not found', 404))
        return res.status(404).json({success:false,message: 'User not found'})
    }
	if(user.role === 'user') {
        // return next(new ErrorHandler('Unauthorized to access this route', 401))
        return res.status(401).json({success:false,message: 'Unauthorized to access this route'})
    }
    // console.log("Admin User: ",user);
	req.user = user;
    next()
}

export default ProtectAdminRoute;