export const otpEmailTemplate = ({ name, otp }) => {
  return `
  <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>Password Reset OTP - NodeMart</title>
      </head>
      <body style="margin:0; padding:0; background-color:#0f172a; font-family: Arial, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center" style="padding: 40px 0;">
              <table width="600" cellpadding="0" cellspacing="0" style="background:#020617; border-radius:10px; overflow:hidden;">
                
                <tr>
                  <td style="padding:30px; text-align:center;">
                    <h1 style="color:#38bdf8; margin:0; font-size:28px;">
                      🔐 Password Reset
                    </h1>

                    <p style="color:#94a3b8; margin-top:8px; font-size:14px;">
                      NodeMart Account Recovery
                    </p>
                  </td>
                </tr>

                <tr>
                  <td style="padding:30px;">
                    <p style="color:#cbd5f5; font-size:15px; line-height:1.6;">
                      Hi <strong>${name}</strong>,
                    </p>

                    <p style="color:#cbd5f5; font-size:15px; line-height:1.6;">
                      We received a request to reset your password. Use the OTP below to verify your identity:
                    </p>

                    <div style="text-align:center; margin:30px 0;">
                      <div style="display:inline-block; background:#1e293b; border:2px solid #38bdf8; border-radius:12px; padding:20px 40px;">
                        <span style="font-size:36px; font-weight:bold; color:#38bdf8; letter-spacing:10px; font-family: 'Courier New', monospace;">
                          ${otp}
                        </span>
                      </div>
                    </div>

                    <p style="color:#cbd5f5; font-size:15px; line-height:1.6; text-align:center;">
                      This OTP is valid for <strong style="color:#f59e0b;">5 minutes</strong>.
                    </p>

                    <div style="background:#1e293b; border-radius:8px; padding:16px; margin:20px 0;">
                      <p style="color:#f87171; font-size:13px; line-height:1.6; margin:0;">
                        ⚠️ <strong>Security Notice:</strong> If you did not request a password reset, 
                        please ignore this email. Your account remains secure.
                      </p>
                    </div>

                    <p style="color:#94a3b8; font-size:13px; line-height:1.6;">
                      Do not share this OTP with anyone. NodeMart staff will never ask for your OTP.
                    </p>
                  </td>
                </tr>

                <tr>
                  <td style="padding:20px; text-align:center; border-top:1px solid #1e293b;">
                    <p style="color:#64748b; font-size:12px; margin:0;">
                      © 2026 NodeMart • Built by developers, for developers
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
  </html>
  `
}
