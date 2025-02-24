const forgotPasswordTemplate = ({ name, otp }) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
    <center style="width: 100%; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <!-- Header -->
            <div style="text-align: center; padding: 20px 0;">
                <img src="[Your-Logo-URL]" alt="Fatafat Logo" style="max-width: 150px; height: auto;">
            </div>

            <!-- Main Content -->
            <div style="background: white; border-radius: 10px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <h1 style="color: #333; margin-top: 0;">Hi ${name},</h1>
                <p style="color: #666; line-height: 1.6;">You requested to reset your password. Use the OTP below to proceed:</p>
                
                <!-- OTP Box -->
                <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 25px 0; text-align: center;">
                    <code style="font-size: 32px; letter-spacing: 8px; color: #2d3436; font-weight: 700;">
                        ${otp}
                    </code>
                </div>

                <!-- Instructions -->
                <p style="color: #666; line-height: 1.6;">
                    This OTP is valid for 1 hour. Enter it in the password reset page on Fatafat to continue.
                </p>
                
                <!-- Support Info -->
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                    <p style="color: #999; font-size: 14px;">
                        If you didn't request this password reset, please ignore this email or contact our support team.
                    </p>
                </div>
            </div>

            <!-- Footer -->
            <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
                <p>© ${new Date().getFullYear()} Fatafat. All rights reserved.</p>
                <p style="margin: 10px 0;">
                    <a href="#" style="color: #666; text-decoration: none; margin: 0 10px;">Help Center</a>
                    <a href="#" style="color: #666; text-decoration: none; margin: 0 10px;">Privacy Policy</a>
                </p>
                <p>Follow us on 
                    <a href="#" style="color: #666; text-decoration: none;">Twitter</a>, 
                    <a href="#" style="color: #666; text-decoration: none;">Facebook</a>
                </p>
            </div>
        </div>
    </center>
</body>
</html>
`;
};

export default forgotPasswordTemplate;