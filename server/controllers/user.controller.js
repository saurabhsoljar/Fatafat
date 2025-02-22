import sendEmail from "../config/sendEmail.js";
import UserModel from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import verifyEmailTemplate from "../utils/veryfyEmailTemplate.js";
import generatedAccessToken from "../utils/generatedAccessToken.js";
import genertedRefshToken from "../utils/generatedRefreshToken.js";

//register controller
async function registerUserController(request, response) {
  try {
    const { name, email, password } = request.body;

    if (!name || !email || !password) {
      return response.status(400).json({
        message: "Please provide name, email and password",
        error: true,
        success: false,
      });
    }

    const user = await UserModel.findOne({ email });

    if (user) {
      return response.status(409).json({
        message: "Email address is already registered.",
        error: true,
        success: false,
      });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(password, salt);

    const payload = {
      name,
      email,
      password: hashPassword,
    };

    const newUser = new UserModel(payload);
    const save = await newUser.save();

    const verifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${save?._id}`;

    const verifyEmail = await sendEmail({
      sendTo: email,
      subject: "Varify email from fatafat",
      html: verifyEmailTemplate({
        name,
        url: verifyEmailUrl,
      }),
    });

    return response.status(201).json({
      message:
        "User registered successfully. Please check your email to verify your account.",
      error: false,
      success: true,
      data: save,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return response.status(500).json({
      message: "An error occurred during registration.",
      error: error.message,
      success: false,
    });
  }
}

//verify email controller
async function verifyEmailController(request, response) {
  try {
    const { code } = request.query;  

    if (!code) {
      return response.status(400).json({
        message: "Verification code is missing.",
        error: true,
        success: false,
      });
    }

    const user = await UserModel.findOne({ _id: code });

    if (!user) {
      return response.status(400).json({
        message: "Invalid verification code.",
        error: true,
        success: false,
      });
    }

    const updateResult = await UserModel.updateOne(
      { _id: code },
      { verify_email: true }
    );

    if (updateResult.modifiedCount === 0) {
      return response.status(400).json({
        message: "Email verification failed.",
        error: true,
        success: false,
      });
    }

    return response.json({
      message: "Email verification successful.",
      success: true,
      error: false,
    });
  } catch (error) {
    console.error("Email verification error:", error);
    return response.status(500).json({
      message: "An error occurred during email verification.",
      error: error.message,
      success: false, // Corrected to false
    });
  }
}

// login controller
async function loginController(request,response) {
  try {
    const { email, password } = request.body

    if(!email || !password){
      return response.status(400).json({
        message : "provide email, password",
        error : true,
        success : false
      })
    }

    const user = await UserModel.findOne({ email })

    if(!user){
      return response.status(400).json({
        message : "User not register",
        error : true,
        success : false
      })
    }

    if(user.status !== "Active"){
      return response.status(400).json({
        message : "Contact to Admin",
        error : true,
        success : false
      })
    }

    const checkPassword = await bcryptjs.compare(password,user.password)

    if(!checkPassword){
      return response.status(400).json({
        message : "Check your password",
        error : true,
        success : false
      })
    }


    const accesstoken = await generatedAccessToken(user._id)
    const refreshToken = await genertedRefshToken(user._id)
    const cookiesOption = {
      httpOnly : true,
      secure : true,
      sameSite : "None"
    }

    response.cookie('accessToken',accesstoken,cookiesOption)
    response.cookie('refreshToken',refreshToken,cookiesOption)

    return response.json({
      message : "Login successfully",
      error : false,
      success : true,
      data : {
        accesstoken,
        refreshToken
      }
    })


  } catch (error) {
    return response.status(500).json({
      message : error.message || error,
      error : true,
      success : false
    })
  }
}

// logout controllet
async function logoutController(request, response) {
  try {
    const userId = request.userId; // Ensure middleware sets this

    // Clear cookies
    const cookiesOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None"
    };
    
    response.clearCookie("accessToken", cookiesOption);
    response.clearCookie("refreshToken", cookiesOption);

    
    await UserModel.findByIdAndUpdate(
      userId,
      { $set: { refreshToken: "" } },  
      { new: true }
    );

    return response.json({
      message: "Logout successful",
      error: false,
      success: true
    });

  } catch (error) {
    console.error("Logout error:", error);  
    return response.status(500).json({
      message: error.message,
      error: true,
      success: false
    });
  }
}

export { registerUserController, verifyEmailController,loginController,logoutController};