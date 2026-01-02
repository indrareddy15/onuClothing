import jwt from 'jsonwebtoken'
import crypto from 'crypto'
const sendtoken = (user) =>{
    
    /* const token = user.getJWTToken();
    const option = {
        expire: new Date(
            Date.now() + 5 * 24*60*60*1000
        ),
        httpOnly:true
    }
    
    res.status(statuscode).cookie('token', token, option).json({
        success: true,
        user,
        token
    }) */
    const SECRET_KEY = process.env.SECRETID || crypto.randomBytes(64).toString('hex');
    const token = jwt.sign({
        id:user._id,
        role:user.role,
        user:user,        
    },SECRET_KEY,{
        algorithm: 'HS512',
        expiresIn: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
        noTimestamp: true,
    })
    return token;
}

export default sendtoken