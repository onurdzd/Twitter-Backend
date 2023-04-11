const Users = require("../users/users-model");
const yup = require("yup");
const jwt=require("jsonwebtoken")

const stepSchema = yup.object().shape({
  username: yup
    .string("Hatalı username formatı")
    .min(4, "Username en az 4 karakter olmalı")
    .max(20, "Username 20 karakterden fazla olamaz.")
    .required("Username gereklidir"),
  password: yup
    .string("Hatalı password formatı")
    .min(5, "Şifre en az 5 karakter olmalı")
    .max(16, "Şifre 16 karakteri geçemez")
    .required("Password gereklidir"),
  mail: yup
    .string("Hatalı mail formatı")
    .email("Geçerli email girin")
    .required("Mail gereklidir"),
});

const stepSchema2 = yup.object().shape({
  password: yup
    .string("Hatalı password formatı")
    .min(5, "Şifre en az 5 karakter olmalı")
    .max(16, "Şifre 16 karakteri geçemez")
    .required("Password gereklidir"),
  username: yup
    .string("Hatalı username formatı")
    .min(4, "Username en az 4 karakter olmalı")
    .max(20, "Username 20 karakterden fazla olamaz.")
    .required("Username gereklidir"),
});

const registerPostDataIsValid = async (req, res, next) => {
  try {
    const yupCheck = await stepSchema.validate(req.body);
    if (!yupCheck) {
      next({ status: 400, message: "Girilen bilgiler hatalı" });
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
};

const registerUsernameMailIsValid = async (req, res, next) => {
  try {
    const username = await Users.getBy({ username: req.body.username });
    const mail = await Users.getBy({ mail: req.body.mail });
    if (username) {
      res.status(400).json({ message: "Username zaten kullanılıyor" });
    } else if (mail) {
      res.status(400).json({ message: "mail zaten kullanılıyor" });
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
};

const loginPostDataIsValid = async (req, res, next) => {
  try {
    const yupCheck = await stepSchema2.validate(req.body);
    if (!yupCheck) {
      next({ status: 400, message: "Girilen bilgiler hatalı" });
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
};

const loginUsernameMailIsValid = async (req, res, next) => {
  try {
    const username = await Users.getBy({username:req.body.username});
    if (!username) {
      res.status(400).json({ message: "Username sistemde mevcut değil" });
    }else {
      next();
    }
  } catch (error) {}
};

const resetUsernameVarmı =(req,res,next)=>{
try {
  if(!req.res.password){
    next({status:400,message:"Yeni şifreni girmelisin"})
  }else{
    next()
  }
} catch (error) {
  
}
}

const isValidToken=(req,res,next)=>{
  try {
    const token=req.headers.authorization
    if (token) {
        jwt.verify(token, process.env.SECRET, (err, decodedJWT) => {
          if (err) {
            res.status(401).json({
              message: "Zaman aşımı/Hatalı token.Yeniden login olmalısın.",
            });
          } else {
            req.decodedJWT = decodedJWT;
            next();
          }
        });
      }else{
        res.status(401).json({
          message: "Önce login olmalısın"
        })
      }
  } catch (error) {
    next()
  }
}

const idIsValid=(req,res,next)=>{
  try {
    if(req.decodedJWT.user_id === req.params.id){
      next()
    }else{
      next({
        status:400,
        message:`${req.params.id} nolu hesapta yetkin yok`
      })
    }
  } catch (error) {
    
  }
}


const adminYetkisi=(role_id)=>(req,res,next)=>{
  try {
    if(req.decodedJWT && req.decodedJWT.role_id ===role_id){
      next()
    }else{
      res.status(403).json({
        message: "Sadece adminler görebilir"
      })
    }
  } catch (error) {
    next(error)
  }
}

module.exports = {
  registerPostDataIsValid,
  registerUsernameMailIsValid,
  loginPostDataIsValid,
  loginUsernameMailIsValid,
  resetUsernameVarmı,
  isValidToken,
  adminYetkisi,
  idIsValid
};
