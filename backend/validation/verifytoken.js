const jwt = require('jsonwebtoken')

exports. auth =(req,res,next)=>{
  const token = req.header('auth-token');
  if (!token) return res.status(401).send('Access Denied')

  try{
    const verified = jwt.verify(token , procces.env.TOKEN_SECRET)
    res.user = verified;
    next();
  }catch(error){
    res.status(401).send('Invalid Token')
  }
}