const jwt = require("jsonwebtoken");
const {config} =require("../config/secret") 

exports.authToken = (req, res, next) => {
    // לבדוק אם בכלל נשלח טוקן
    let token = req.header("x-api-key");
    if (!token) {
        return res.status(401).json({ msg: "you must send token" })
    }
    // לבדוק אם הטוקן תקני או בתוקף
    try {
        let decodeToken = jwt.verify(token, config.tokenSecret);
        req.tokenData=decodeToken
        next();

    }
    catch (err) {
        console.log(err)
        return res.status(401).json({ msg: "token invalid or expired" })
    }
}