function VerifyEmailHtml(verificationCode: string) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Account</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            background-color: white;
            color: black;
            line-height: 1.6;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: white;
        }
        .header {
            text-align: center;
            padding: 20px 0;
            border-bottom: 1px solid #e0e0e0;
        }
        .logo {
            max-width: 200px;
            height: auto;
        }
        .content {
            padding: 40px 20px;
            text-align: center;
        }
        .title {
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 20px;
            color: black;
        }
        .message {
            font-size: 16px;
            margin-bottom: 30px;
            color: #333;
        }
        .verification-code {
            background-color: #f5f5f5;
            border: 2px solid #ddd;
            border-radius: 8px;
            padding: 20px;
            margin: 30px 0;
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 4px;
            color: black;
            font-family: 'Courier New', monospace;
        }
        .instructions {
            font-size: 14px;
            color: #666;
            margin-top: 20px;
        }
        .footer {
            text-align: center;
            padding: 20px;
            border-top: 1px solid #e0e0e0;
            font-size: 12px;
            color: #888;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="https://res.cloudinary.com/dndjbkrcv/image/upload/v1750600069/macherie-logo_uxt46y.png" alt="Ma Cherie Logo" class="logo">
        </div>
        
        <div class="content">
            <h1 class="title">Verify Your Account</h1>
            <p class="message">
                Thank you for signing up! To complete your registration and secure your account, 
                please use the verification code below:
            </p>
            
            <div class="verification-code">
                ${verificationCode}
            </div>
            
            <p class="instructions">
                Enter this code in the verification field on our website to activate your account.
                This code will expire in 10 minutes for security purposes.
            </p>
            
            <p class="instructions">
                If you didn't request this verification, please ignore this email or contact our support team.
            </p>
        </div>
        
        <div class="footer">
            <p>&copy; 2024 Ma Cherie. All rights reserved.</p>
            <p>This is an automated message, please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>
  `;
}

export { VerifyEmailHtml };