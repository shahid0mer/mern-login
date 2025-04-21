import jwt from "jsonwebtoken";

console.log("userAuth middleware file loaded ✅");

const userAuth = async (req, res, next) => {
 
  const { token } = req.cookies;


  if (!token) {
    return res.json({
      success: false,
      message: "Not authorized login again",
    });
  }
  try {
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
    
    if (tokenDecode.id) {
      req.userId = tokenDecode.id;
    } else {
      return res.json({
        success: false,
        message: "Not authorized login again",
      });
    }
    console.log("Decoded token:", tokenDecode);
    next();
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
  
};

export default userAuth;
