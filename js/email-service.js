// ==========================================
// SYDF EMAIL SERVICE - Resend API
// ==========================================

// ⚠️ YAHAN APNI API KEY DAALEN
const RESEND_API_KEY = "YAHAN_RESEND_API_KEY_PASTE_KAREN";
const FROM_EMAIL = "SYDF <onboarding@resend.dev>";
// Note: Custom domain verify karne ke baad FROM_EMAIL change karen

// ==========================================
// SEND EMAIL FUNCTION
// ==========================================
async function sendEmail({ to, subject, html, text, type, recipientName }) {
  if (
    !RESEND_API_KEY ||
    RESEND_API_KEY === "YAHAN_RESEND_API_KEY_PASTE_KAREN"
  ) {
    console.error("❌ Resend API key not configured");
    return { success: false, error: "API key not configured" };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + RESEND_API_KEY,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [to],
        subject: subject,
        html: html || text,
        text: text,
      }),
    });

    const data = await response.json();

    // Log to database
    if (typeof supabaseClient !== "undefined" && supabaseClient) {
      try {
        const {
          data: { session },
        } = await supabaseClient.auth.getSession();
        await supabaseClient.from("email_logs").insert([
          {
            recipient_email: to,
            recipient_name: recipientName || null,
            subject: subject,
            body: text || html,
            email_type: type || "General",
            status: response.ok ? "Sent" : "Failed",
            resend_id: data.id || null,
            error_message: response.ok ? null : data.message || "Unknown error",
            sent_by: session ? session.user.email : "System",
          },
        ]);
      } catch (logErr) {
        console.error("Email log error:", logErr);
      }
    }

    if (!response.ok) {
      console.error("Resend error:", data);
      return { success: false, error: data.message || "Send failed" };
    }

    console.log("✅ Email sent to:", to);
    return { success: true, id: data.id };
  } catch (err) {
    console.error("Email error:", err);
    return { success: false, error: err.message };
  }
}

// ==========================================
// EMAIL TEMPLATES
// ==========================================
function getEmailTemplate(title, content, buttonText, buttonUrl) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            body { font-family: 'Poppins', Arial, sans-serif; background: #f4f6f9; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
            .header { background: linear-gradient(135deg, #0f2027, #1a4d4a, #1abc9c); padding: 35px 30px; text-align: center; }
            .header-logo { display: inline-block; font-size: 28px; font-weight: 700; color: #fbbf24; letter-spacing: 3px; margin-bottom: 8px; }
            .header-tagline { color: rgba(255,255,255,0.8); font-size: 12px; letter-spacing: 2px; }
            .content { padding: 40px 35px; color: #333; line-height: 1.7; }
            .content h1 { color: #0f2027; font-size: 22px; margin-bottom: 20px; }
            .content p { margin-bottom: 15px; font-size: 14px; color: #555; }
            .button { display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #1abc9c, #16a085); color: white !important; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 14px; margin: 20px 0; }
            .footer { background: #0f2027; color: rgba(255,255,255,0.7); padding: 25px; text-align: center; font-size: 12px; }
            .footer strong { color: #1abc9c; }
            .divider { height: 1px; background: #e5e7eb; margin: 25px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="header-logo">SYDF</div>
                <div class="header-tagline">SWAT YOUTH DEVELOPMENT FORUM</div>
            </div>
            <div class="content">
                <h1>${title}</h1>
                ${content}
                ${buttonText && buttonUrl ? `<div style="text-align: center;"><a href="${buttonUrl}" class="button">${buttonText}</a></div>` : ""}
                <div class="divider"></div>
                <p style="font-size: 12px; color: #888;">This email was sent to you as a registered member of SYDF. If you have any questions, reply to this email.</p>
            </div>
            <div class="footer">
                <p><strong>SYDF</strong> - Empowering Youth, Building Future</p>
                <p>© ${new Date().getFullYear()} Swat Youth Development Forum</p>
            </div>
        </div>
    </body>
    </html>`;
}

// ==========================================
// PRE-BUILT EMAILS
// ==========================================

// 1. WELCOME EMAIL
async function sendWelcomeEmail({ email, name, uid }) {
  const html = getEmailTemplate(
    "Welcome to SYDF! 🎉",
    `
        <p>Dear <strong>${name}</strong>,</p>
        <p>Welcome to <strong>Swat Youth Development Forum</strong>! We are thrilled to have you as a part of our family.</p>
        <p><strong>Your Member UID:</strong> ${uid}</p>
        <p>You can now access your dashboard, view documents, download your ID card, and participate in activities.</p>
        <p>If you need any help, feel free to reply to this email.</p>
        `,
    "Login to Dashboard",
    "https://habibhamdam1.github.io/SYDF-website/login.html",
  );
  return sendEmail({
    to: email,
    subject: "Welcome to SYDF! 🎉",
    html,
    text: "Welcome to SYDF! Your UID: " + uid,
    type: "Welcome",
    recipientName: name,
  });
}

// 2. REGISTRATION CONFIRMATION
async function sendRegistrationConfirmation({ email, name }) {
  const html = getEmailTemplate(
    "Registration Received! ✅",
    `
        <p>Dear <strong>${name}</strong>,</p>
        <p>Thank you for registering with SYDF. Your application has been received successfully.</p>
        <p>Our team will review your application and contact you soon for a short interview.</p>
        <p><strong>Status:</strong> Pending Approval</p>
        `,
    "Visit Website",
    "https://habibhamdam1.github.io/SYDF-website",
  );
  return sendEmail({
    to: email,
    subject: "Registration Received - SYDF",
    html,
    text: "Your registration has been received.",
    type: "Registration",
    recipientName: name,
  });
}

// 3. PAYMENT RECEIPT
async function sendPaymentReceipt({ email, name, amount, month, receiptNo }) {
  const html = getEmailTemplate(
    "Payment Received 💰",
    `
        <p>Dear <strong>${name}</strong>,</p>
        <p>Thank you! We have received your payment successfully.</p>
        <p><strong>Amount:</strong> Rs. ${amount}</p>
        <p><strong>Month:</strong> ${month}</p>
        <p><strong>Receipt #:</strong> ${receiptNo}</p>
        <p>Your payment record has been updated in our system.</p>
        `,
    "View Payment History",
    "https://habibhamdam1.github.io/SYDF-website/my-payments.html",
  );
  return sendEmail({
    to: email,
    subject: "Payment Receipt - SYDF",
    html,
    text: "Payment of Rs. " + amount + " received.",
    type: "Payment",
    recipientName: name,
  });
}

// 4. PASSWORD RESET
async function sendPasswordReset({ email, name, resetLink }) {
  const html = getEmailTemplate(
    "Password Reset Request 🔐",
    `
        <p>Dear <strong>${name || "Member"}</strong>,</p>
        <p>We received a request to reset your password. Click the button below to set a new password.</p>
        <p style="color:#ef4444;font-size:12px;"><strong>Note:</strong> This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
        `,
    "Reset Password",
    resetLink,
  );
  return sendEmail({
    to: email,
    subject: "Password Reset - SYDF",
    html,
    text: "Reset your password: " + resetLink,
    type: "Password",
    recipientName: name,
  });
}

// 5. WAITLIST NOTIFICATION
async function sendWaitlistNotification({ email, name }) {
  const html = getEmailTemplate(
    "Membership is Now Open! 🎉",
    `
        <p>Dear <strong>${name}</strong>,</p>
        <p>Good news! SYDF membership is now open for applications.</p>
        <p>You had shown interest in joining us. Now is the perfect time to apply!</p>
        <p>Click the button below to fill the application form.</p>
        `,
    "Apply Now",
    "https://habibhamdam1.github.io/SYDF-website/membership.html",
  );
  return sendEmail({
    to: email,
    subject: "Membership is Now Open - SYDF",
    html,
    text: "Membership is now open! Apply now.",
    type: "Waitlist",
    recipientName: name,
  });
}

// 6. PROPOSAL RESPONSE
async function sendProposalResponse({ email, name, title, status, response }) {
  const statusEmoji = status === "Approved" ? "✅" : "❌";
  const html = getEmailTemplate(
    statusEmoji + " Proposal " + status,
    `
        <p>Dear <strong>${name}</strong>,</p>
        <p>Your proposal "<strong>${title}</strong>" has been reviewed.</p>
        <p><strong>Status:</strong> ${status}</p>
        <p><strong>Response from Admin:</strong></p>
        <div style="background:#f0fdf9;border-left:3px solid #1abc9c;padding:15px;border-radius:8px;margin:15px 0;">
            <p style="margin:0;color:#333;">${response}</p>
        </div>
        `,
    "View My Proposals",
    "https://habibhamdam1.github.io/SYDF-website/member-proposals.html",
  );
  return sendEmail({
    to: email,
    subject: "Proposal " + status + " - SYDF",
    html,
    text: "Your proposal has been " + status,
    type: "Proposal",
    recipientName: name,
  });
}

// 7. GENERAL EMAIL (from compose)
async function sendGeneralEmail({ to, subject, body, recipientName }) {
  const html = getEmailTemplate(
    subject,
    `<p>${body.replace(/\n/g, "<br>")}</p>`,
    null,
    null,
  );
  return sendEmail({
    to,
    subject,
    html,
    text: body,
    type: "General",
    recipientName,
  });
}

// ==========================================
// EXPOSE FUNCTIONS
// ==========================================
window.sendEmail = sendEmail;
window.sendWelcomeEmail = sendWelcomeEmail;
window.sendRegistrationConfirmation = sendRegistrationConfirmation;
window.sendPaymentReceipt = sendPaymentReceipt;
window.sendPasswordReset = sendPasswordReset;
window.sendWaitlistNotification = sendWaitlistNotification;
window.sendProposalResponse = sendProposalResponse;
window.sendGeneralEmail = sendGeneralEmail;

console.log("✅ Email Service Loaded");
