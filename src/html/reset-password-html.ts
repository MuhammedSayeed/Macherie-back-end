function ResetPasswordHtml(resetLink: string): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
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
        .reset-button {
            display: inline-block;
            background-color: black;
            color: white !important;
            padding: 15px 40px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: bold;
            font-size: 16px;
            margin: 30px 0;
            transition: background-color 0.3s ease;
        }
        .reset-button:hover {
            background-color: #333;
            color: white !important;
        }
        .reset-button:visited {
            color: white !important;
        }
        .reset-button:active {
            color: white !important;
        }
        .instructions {
            font-size: 14px;
            color: #666;
            margin-top: 20px;
        }
        .security-notice {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 8px;
            padding: 15px;
            margin: 20px 0;
            font-size: 14px;
            color: #856404;
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
            <h1 class="title">Reset Your Password</h1>
            <p class="message">
                We received a request to reset your password. Click the button below to create a new password for your account.
            </p>
            
            <a href="${resetLink}" class="reset-button">Reset Password</a>
            
            <div class="security-notice">
                <strong>Security Notice:</strong> This link will expire in 15 minutes for your security. If you didn't request this password reset, please ignore this email.
            </div>
            
            <p class="instructions">
                If the button above doesn't work, you can copy and paste the following link into your browser:
            </p>
            
            <p class="instructions">
                If you didn't request this password reset, please ignore this email or contact our support team if you have concerns about your account security.
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

export { ResetPasswordHtml };