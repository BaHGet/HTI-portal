const jwt = require('jsonwebtoken')

const secret = process.env.TOKEN_SECRET

// Create Token
exports.createToken = ( data, expiresIn='1hr' )=>{
  return jwt.sign(data, secret, {expiresIn})
}

// VerifyToken
exports.VerifyToken = (req, res, next)=>{
  const token = req.header('token')
  if(!token) return res.status(401).send('Access Denied');
  
  try {
    const verified =  jwt.verify( token, secret );
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send({message:'Invalid Token', error:err}) 
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

