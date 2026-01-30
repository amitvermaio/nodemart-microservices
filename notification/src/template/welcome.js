export const welcomeEmailTemplate = ({ name }) => {
  return `
  <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>Welcome to NodeMart</title>
      </head>
      <body style="margin:0; padding:0; background-color:#0f172a; font-family: Arial, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center" style="padding: 40px 0;">
              <table width="600" cellpadding="0" cellspacing="0" style="background:#020617; border-radius:10px; overflow:hidden;">
                
                <tr>
                  <td style="padding:30px; text-align:center;">
                    <h1 style="color:#38bdf8; margin:0; font-size:30px;">
                      🚀 Welcome to NodeMart
                    </h1>

                    <h2 style="color:#e5e7eb; margin:15px 0 5px; font-size:26px; font-weight:bold;">
                      ${name}
                    </h2>

                    <p style="color:#94a3b8; margin-top:8px; font-size:14px;">
                      E-commerce built for Coders & Programmers
                    </p>
                  </td>
                </tr>

                <tr>
                  <td style="padding:30px;">
                    <p style="color:#cbd5f5; font-size:15px; line-height:1.6;">
                      Welcome to <strong>NodeMart</strong> — your new home for developer-focused tools, 
                      digital products, and tech-powered shopping 🧠💻
                    </p>

                    <p style="color:#cbd5f5; font-size:15px; line-height:1.6;">
                      We’re building an ecosystem where programmers can:
                    </p>

                    <ul style="color:#cbd5f5; font-size:15px; line-height:1.8; padding-left:20px;">
                      <li>🛒 Buy developer-friendly products</li>
                      <li>⚡ Access coding tools & resources</li>
                      <li>🤝 Connect with like-minded builders</li>
                    </ul>

                    <div style="text-align:center; margin:30px 0;">
                      <a href="{{dashboardUrl}}"
                        style="background:#38bdf8; color:#020617; text-decoration:none;
                                padding:14px 28px; font-size:15px; border-radius:8px;
                                display:inline-block; font-weight:bold;">
                        Go to Dashboard →
                      </a>
                    </div>

                    <p style="color:#94a3b8; font-size:13px; line-height:1.6;">
                      If you didn’t create this account, you can safely ignore this email.
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
