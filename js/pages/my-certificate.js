/* ==========================================
   MY CERTIFICATE PAGE LOGIC
   ========================================== */

function showStatus(emoji, title, message, type) {
  const box = document.getElementById("statusBox");
  box.className = "loading-box" + (type ? " " + type : "");
  box.innerHTML =
    '<span class="ico">' +
    emoji +
    "</span><h3>" +
    title +
    "</h3><p>" +
    message +
    "</p>";
  box.style.display = "block";
  document.getElementById("certContent").style.display = "none";
  document.getElementById("printBtn").style.display = "none";
}

async function showCertificate(member) {
  document.getElementById("statusBox").style.display = "none";
  document.getElementById("certContent").style.display = "block";
  document.getElementById("printBtn").style.display = "inline-flex";

  document.getElementById("certName").textContent = member.name || "Member";
  document.getElementById("certUid").textContent =
    "UID: " + (member.uid || "-");
  document.getElementById("certDistrict").textContent =
    (member.district || "Swat") + " District";

  const mtype = (member.member_type || "").toLowerCase();
  let displayRole = member.role || "Member";
  if (mtype === "volunteer") displayRole = "Volunteer";
  else if (mtype === "intern") displayRole = "Intern";
  else if (mtype === "coordinator") displayRole = "Coordinator";
  document.getElementById("certRole").textContent = displayRole;

  // Signatures Fetch
  try {
    const { data: posData } = await supabaseClient
      .from("cabinet_positions")
      .select("title, assigned_to_name");

    if (posData) {
      const sg = posData.find(
        (p) =>
          p.title.toLowerCase().includes("secretary general") &&
          !p.title.toLowerCase().includes("deputy"),
      );
      if (sg && sg.assigned_to_name) {
        document.getElementById("sigSgName").textContent = sg.assigned_to_name;
      }
      const svp = posData.find((p) =>
        p.title.toLowerCase().includes("senior vice president"),
      );
      if (svp && svp.assigned_to_name) {
        document.getElementById("sigSvpName").textContent =
          svp.assigned_to_name;
      }
    }
  } catch (e) {
    console.log("Error loading signatures:", e);
  }

  // Date and ID
  const issueDate = new Date();
  const dateFormatted = issueDate.toLocaleDateString("en-PK", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const uidPart = (member.uid || "").replace(/[^0-9]/g, "").slice(-4) || "0000";
  const certID = "CERT-" + issueDate.getFullYear() + "-" + uidPart;

  // Info Bar
  document.getElementById("issueDate").textContent = dateFormatted;
  document.getElementById("certId").textContent = certID;

  // Inside Certificate (Top Meta Section)
  document.getElementById("metaIssueDate").textContent = dateFormatted;
  document.getElementById("metaCertId").textContent = certID;

  // QR Code using Image API (QuickChart for reliability)
  const verifyUrl =
    window.location.origin +
    window.location.pathname.replace("my-certificate.html", "verify.html") +
    "?uid=" +
    (member.uid || "").trim();
  const qrApiUrl =
    "https://quickchart.io/qr?text=" +
    encodeURIComponent(verifyUrl) +
    "&size=150";
  document.getElementById("qrImage").src = qrApiUrl;

  // Update Topbar
  document.getElementById("topAvatar").textContent = (member.name || "M")
    .charAt(0)
    .toUpperCase();
  document
    .querySelectorAll(".user-name")
    .forEach((el) => (el.textContent = member.name || "Member"));
  document
    .querySelectorAll(".user-uid")
    .forEach((el) => (el.textContent = member.uid || "-"));
}

window.addEventListener("load", async function () {
  let attempts = 0;
  while (
    (typeof supabaseClient === "undefined" || !supabaseClient) &&
    attempts < 30
  ) {
    await new Promise((r) => setTimeout(r, 100));
    attempts++;
  }
  if (!supabaseClient) {
    showStatus("⚠️", "System Not Ready", "Please refresh the page", "warn");
    return;
  }

  try {
    const { data: sessionData } = await supabaseClient.auth.getSession();
    const session = sessionData ? sessionData.session : null;

    if (!session || !session.user) {
      window.location.href = "login.html";
      return;
    }

    const { data: member, error } = await supabaseClient
      .from("members")
      .select("*")
      .eq("email", session.user.email)
      .single();

    if (error || !member) {
      showStatus(
        "❌",
        "Member Not Found",
        "Your member profile could not be found. Please contact admin.",
        "err",
      );
      return;
    }

    if (member.status === "Suspended") {
      showStatus(
        "⏸️",
        "Account Suspended",
        "Certificate is not available because your account is suspended. Please contact admin.",
        "warn",
      );
      return;
    }
    if (member.status === "Pending") {
      showStatus(
        "⏳",
        "Account Pending",
        "Your certificate will be available once your account is approved by admin.",
        "warn",
      );
      return;
    }
    if (member.status === "Rejected") {
      showStatus(
        "❌",
        "Account Rejected",
        "Certificate is not available.",
        "err",
      );
      return;
    }
    if (member.status === "Inactive") {
      showStatus(
        "💤",
        "Account Inactive",
        "Please contact admin to reactivate your account.",
        "warn",
      );
      return;
    }

    showCertificate(member);
  } catch (err) {
    console.error("Certificate error:", err);
    showStatus(
      "❌",
      "Error Loading",
      "There was an error loading your certificate. Please refresh.",
      "err",
    );
  }
});
