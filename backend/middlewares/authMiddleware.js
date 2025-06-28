const jwt = require('jsonwebtoken')

const secret = process.env.SECRET_TOKEN

// Create Token
exports.createToken = ( data, expireIn='1h' )=>{
  return jwt.sign(data, secret, {expireIn})
}

// VerifyToken
exports.VerifyToken = (token)=>{
   try {
    return jwt.verify( token, secret );
  } catch (err) {
    return null; 
  }
}

// assignTokenToHeader
exports.assignTokenToHeader = (req,res,next)=>{
  const token = req.header('auth-token');
  if (!token) return res.status(401).send('Access Denied')

  try{
    const verified = jwt.verify(token , secret)
    res.user = verified;
    next();
  }catch(error){
    res.status(401).send('Invalid Token')
  }
}


// updateToken
exports.updateToken = (oldToken, newdata, expiresIn = '1h')=>{
  const verified = verifyToken(oldToken);
  if (!verified) return null;
  return createToken(newdata, expiresIn);
}

