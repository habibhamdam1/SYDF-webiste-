// ==========================================
// PYDF ADMIN - COMPLETE (WITH STATUS SYSTEM)
// ==========================================

async function waitForSupabaseAdmin() {
  let attempts = 0;
  while (
    (typeof supabaseClient === "undefined" || !supabaseClient) &&
    attempts < 50
  ) {
    await new Promise((r) => setTimeout(r, 100));
    attempts++;
  }
  return supabaseClient;
}

function getAdminPage() {
  const path = window.location.pathname;
  let page = path.substring(path.lastIndexOf("/") + 1);
  if (!page) return "admin.html";
  if (!page.includes(".")) page += ".html";
  return page;
}

function formatDate(dateStr) {
  if (!dateStr) return "-";
  try {
    return new Date(dateStr).toLocaleDateString("en-PK", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "-";
  }
}

function getInitial(name) {
  return (name || "M").charAt(0).toUpperCase();
}

function getAvatarClass(gender) {
  return (gender || "").toLowerCase() === "female" ? "female" : "";
}

function getRoleClass(role) {
  if (!role) return "role-member";
  const r = role.toLowerCase();
  if (r.includes("president") && !r.includes("vice")) return "role-president";
  if (r.includes("vice president")) return "role-vp";
  if (r.includes("secretary general") || r === "gs") return "role-gs";
  if (r.includes("coordinator")) return "role-coordinator";
  return "role-member";
}

function getStatusBadge(status) {
  if (status === "Active") return "status-badge-active";
  if (status === "Rejected") return "status-badge-inactive";
  if (status === "Suspended") return "status-badge-overdue";
  if (status === "Inactive") return "status-badge-inactive";
  return "status-badge-pending";
}

// ==========================================
// SIDEBAR BADGES
// ==========================================
async function updateSidebarBadges() {
  try {
    const { data: members } = await supabaseClient
      .from("members")
      .select("status");
    const { data: waitlist } = await supabaseClient
      .from("waitlist")
      .select("id");
    const pendingApps = (members || []).filter(
      (m) => m.status === "Pending",
    ).length;
    const waitlistCount = (waitlist || []).length;

    document.querySelectorAll(".sidebar-nav .badge").forEach((badge) => {
      const li = badge.closest("li");
      const text = li?.textContent || "";
      if (text.includes("Applications")) {
        badge.textContent = pendingApps;
        badge.style.display = pendingApps > 0 ? "inline-block" : "none";
      }
      if (text.includes("Waitlist")) {
        badge.textContent = waitlistCount;
        badge.style.display = waitlistCount > 0 ? "inline-block" : "none";
      }
    });
  } catch (err) {
    console.error(err);
  }
}

// ==========================================
// DASHBOARD
// ==========================================
async function loadAdminDashboard() {
  try {
    const { data: members } = await supabaseClient.from("members").select("*");
    const totalMembers = members.length;
    const pending = members.filter((m) => m.status === "Pending");
    const active = members.filter((m) => m.status === "Active");
    const admins = members.filter((m) =>
      [
        "Super Admin",
        "Admin",
        "President",
        "Senior Vice President",
        "Vice President",
        "Secretary General",
      ].includes(m.role),
    );

    const statCards = document.querySelectorAll(".dash-stat-info h3");
    if (statCards[0]) statCards[0].textContent = totalMembers;
    if (statCards[1]) statCards[1].textContent = pending.length;
    if (statCards[2]) statCards[2].textContent = admins.length;
    if (statCards[3]) statCards[3].textContent = active.length;

    const pendingList = pending.slice(0, 3);
    const adminList = document.querySelector(".admin-list");
    if (adminList && pendingList.length > 0) {
      adminList.innerHTML = pendingList
        .map(
          (m) => `
                <div class="admin-list-item">
                    <div class="admin-item-avatar ${getAvatarClass(m.gender)}">${getInitial(m.name)}</div>
                    <div class="admin-item-info">
                        <h4>${m.name || "Unknown"}</h4>
                        <p>${m.district || "-"} • ${formatDate(m.created_at)}</p>
                    </div>
                    <div class="admin-item-actions">
                        <button class="btn-approve" data-id="${m.id}" data-action="approve">✓</button>
                        <button class="btn-reject" data-id="${m.id}" data-action="reject">✕</button>
                    </div>
                </div>
            `,
        )
        .join("");
      adminList.querySelectorAll("button[data-action]").forEach((btn) => {
        btn.addEventListener("click", handleQuickAction);
      });
    } else if (adminList) {
      adminList.innerHTML =
        '<p style="text-align:center; padding:20px; opacity:0.6; color:white;">No pending applications</p>';
    }
    console.log("✅ Dashboard:", totalMembers);
  } catch (err) {
    console.error(err);
  }
}

async function handleQuickAction() {
  const id = this.getAttribute("data-id");
  const action = this.getAttribute("data-action");
  if (action === "approve") {
    await supabaseClient
      .from("members")
      .update({ status: "Active" })
      .eq("id", id);
    alert("✅ Approved!");
    loadAdminDashboard();
    updateSidebarBadges();
  } else if (action === "reject") {
    if (!confirm("Reject?")) return;
    await supabaseClient
      .from("members")
      .update({ status: "Rejected" })
      .eq("id", id);
    alert("❌ Rejected");
    loadAdminDashboard();
    updateSidebarBadges();
  }
}

// ==========================================
// MEMBERS
// ==========================================
async function loadAdminMembers() {
  const tbody = document.querySelector("#membersTable tbody");
  if (!tbody) return;
  try {
    const { data, error } = await supabaseClient
      .from("members")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    if (!data || data.length === 0) {
      tbody.innerHTML =
        '<tr><td colspan="8" style="text-align:center; padding:40px; color:white;">No members</td></tr>';
      return;
    }
    tbody.innerHTML = data
      .map((m) => {
        const sc = getStatusBadge(m.status);
        const canAct = m.status !== "Super Admin";
        return `
            <tr data-id="${m.id}">
                <td class="col-check"><input type="checkbox"></td>
                <td><div class="member-cell"><div class="member-avatar ${getAvatarClass(m.gender)}">${getInitial(m.name)}</div><div class="member-info"><h4>${m.name || "-"}</h4><p>${m.email || "-"}</p></div></div></td>
                <td><span class="uid-badge">${m.uid || "-"}</span></td>
                <td>${m.district || "-"}</td>
                <td><span class="role-badge ${getRoleClass(m.role)}">${m.role || "Member"}</span></td>
                <td>${m.phone || "-"}</td>
                <td><span class="${sc}">${m.status || "Pending"}</span></td>
                <td class="col-actions">
                    <div class="action-btns">
                        ${m.status === "Active" ? `<button class="btn-action btn-suspend" data-id="${m.id}" data-name="${m.name}" title="Suspend" style="background:rgba(245,158,11,0.15);border-color:rgba(245,158,11,0.4);">⏸️</button>` : ""}
                        ${m.status !== "Active" ? `<button class="btn-action btn-activate" data-id="${m.id}" data-name="${m.name}" title="Activate" style="background:rgba(26,188,156,0.15);border-color:rgba(26,188,156,0.4);">✅</button>` : ""}
                        <button class="btn-action btn-delete" data-id="${m.id}" data-name="${m.name}" title="Delete">🗑️</button>
                    </div>
                </td>
            </tr>`;
      })
      .join("");

    const totalEl = document.querySelector(".page-header-info strong");
    if (totalEl) totalEl.textContent = data.length;
    const info = document.querySelector(".table-info");
    if (info)
      info.innerHTML = `Showing <strong>${data.length}</strong> members`;

    // Attach status handlers
    tbody.querySelectorAll(".btn-suspend").forEach((btn) => {
      btn.addEventListener("click", async function () {
        const id = this.getAttribute("data-id");
        const name = this.getAttribute("data-name");
        const reason = prompt(
          `Suspend ${name}?\n\nReason (required):\n(e.g. Non-payment, Misconduct, Request)`,
        );
        if (!reason || !reason.trim()) {
          alert("❌ Reason required to suspend.");
          return;
        }
        const { error } = await supabaseClient
          .from("members")
          .update({
            status: "Suspended",
            suspended_reason: reason.trim(),
            suspended_at: new Date().toISOString(),
            status_changed_by: "Admin",
          })
          .eq("id", id);
        if (error) {
          alert("❌ " + error.message);
          return;
        }
        alert("⏸️ " + name + " suspended.\n\nReason: " + reason);
        loadAdminMembers();
      });
    });

    tbody.querySelectorAll(".btn-activate").forEach((btn) => {
      btn.addEventListener("click", async function () {
        const id = this.getAttribute("data-id");
        const name = this.getAttribute("data-name");
        if (!confirm("Activate " + name + "?")) return;
        const { error } = await supabaseClient
          .from("members")
          .update({
            status: "Active",
            suspended_reason: null,
            suspended_at: null,
            status_changed_by: "Admin",
          })
          .eq("id", id);
        if (error) {
          alert("❌ " + error.message);
          return;
        }
        alert("✅ " + name + " activated!");
        loadAdminMembers();
      });
    });

    tbody.querySelectorAll(".btn-delete").forEach((btn) => {
      btn.addEventListener("click", async function () {
        const id = this.getAttribute("data-id");
        const name = this.getAttribute("data-name");
        if (
          !confirm(
            "⚠️ DELETE " + name + " permanently?\n\nThis cannot be undone!",
          )
        )
          return;
        if (!confirm("Are you absolutely sure? Type OK to confirm.")) return;
        const { error } = await supabaseClient
          .from("members")
          .delete()
          .eq("id", id);
        if (error) {
          alert("❌ " + error.message);
          return;
        }
        alert("🗑️ " + name + " deleted permanently.");
        loadAdminMembers();
      });
    });

    console.log("✅ Members:", data.length);
  } catch (err) {
    console.error(err);
  }
}

// ==========================================
// APPLICATIONS
// ==========================================
let allAppsMembers = [];
let currentAppFilter = "pending";

async function loadAdminApplications() {
  const loading = document.getElementById("loadingState");
  const grid = document.getElementById("applicationsGrid");
  if (!grid) return;
  if (loading) loading.style.display = "block";
  grid.style.display = "none";
  try {
    const { data, error } = await supabaseClient
      .from("members")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    allAppsMembers = data || [];
    const pending = allAppsMembers.filter((m) => m.status === "Pending");
    const pc = document.getElementById("pendingCount");
    if (pc) pc.textContent = pending.length;
    if (loading) loading.style.display = "none";
    renderAdminApplications();
  } catch (err) {
    console.error(err);
  }
}

function renderAdminApplications() {
  const grid = document.getElementById("applicationsGrid");
  const empty = document.getElementById("emptyState");
  if (!grid) return;
  let filtered = allAppsMembers;
  if (currentAppFilter === "pending")
    filtered = allAppsMembers.filter((m) => m.status === "Pending");
  else if (currentAppFilter === "Active")
    filtered = allAppsMembers.filter((m) => m.status === "Active");
  else if (currentAppFilter === "Rejected")
    filtered = allAppsMembers.filter((m) => m.status === "Rejected");

  if (filtered.length === 0) {
    grid.style.display = "none";
    if (empty) empty.style.display = "block";
    return;
  }
  if (empty) empty.style.display = "none";
  grid.style.display = "grid";
  grid.innerHTML = filtered
    .map((m) => {
      const sClass =
        m.status === "Active"
          ? "approved"
          : m.status === "Rejected"
            ? "rejected"
            : "pending";
      const sText =
        m.status === "Active"
          ? "Approved"
          : m.status === "Rejected"
            ? "Rejected"
            : "Pending";
      const actions =
        m.status === "Pending"
          ? `<button class="btn-approve-app" data-id="${m.id}" data-action="approve">✓ Approve</button><button class="btn-reject-app" data-id="${m.id}" data-action="reject">✕ Reject</button>`
          : `<button class="btn-view-app">👁️ View</button>`;
      return `
        <div class="glass-card application-card">
            <div class="application-header">
                <div class="app-avatar ${getAvatarClass(m.gender)}">${getInitial(m.name)}</div>
                <div class="app-header-info"><h3>${m.name || "Unknown"}</h3><p>Applied: ${formatDate(m.created_at)}</p></div>
                <span class="app-status ${sClass}">${sText}</span>
            </div>
            <div class="application-details">
                <div class="detail-row"><span class="detail-label">📧 Email</span><span class="detail-value">${m.email || "-"}</span></div>
                <div class="detail-row"><span class="detail-label">📱 Phone</span><span class="detail-value">${m.phone || "-"}</span></div>
                <div class="detail-row"><span class="detail-label">🆔 CNIC</span><span class="detail-value">${m.cnic || "-"}</span></div>
                <div class="detail-row"><span class="detail-label">📍 Location</span><span class="detail-value">${m.district || "-"}, ${m.tehsil || "-"}</span></div>
            </div>
            <div class="application-actions">${actions}</div>
        </div>`;
    })
    .join("");
  grid.querySelectorAll("button[data-action]").forEach((btn) => {
    btn.addEventListener("click", async function () {
      const id = this.getAttribute("data-id");
      const action = this.getAttribute("data-action");
      const member = allAppsMembers.find((m) => String(m.id) === String(id));
      if (action === "approve") {
        if (!confirm("Approve " + member.name + "?")) return;
        await supabaseClient
          .from("members")
          .update({ status: "Active" })
          .eq("id", id);
        alert("✅ Approved!");
        loadAdminApplications();
        updateSidebarBadges();
      } else if (action === "reject") {
        if (!confirm("Reject " + member.name + "?")) return;
        await supabaseClient
          .from("members")
          .update({ status: "Rejected" })
          .eq("id", id);
        alert("❌ Rejected");
        loadAdminApplications();
        updateSidebarBadges();
      }
    });
  });
}

// ==========================================
// WAITLIST
// ==========================================
async function loadAdminWaitlist() {
  const tbody = document.querySelector("#waitlistTable tbody");
  if (!tbody) return;
  try {
    const { data, error } = await supabaseClient
      .from("waitlist")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    if (!data || data.length === 0) {
      tbody.innerHTML =
        '<tr><td colspan="8" style="text-align:center; padding:40px; color:white;">No waitlist</td></tr>';
      return;
    }
    tbody.innerHTML = data
      .map(
        (w) => `
            <tr data-id="${w.id}">
                <td class="col-check"><input type="checkbox"></td>
                <td><div class="member-cell"><div class="member-avatar">${getInitial(w.name)}</div><div class="member-info"><h4>${w.name || "-"}</h4><p>Member</p></div></div></td>
                <td>${w.email || "-"}</td>
                <td>${w.whatsapp || "-"}</td>
                <td>${w.district || "-"}</td>
                <td>${formatDate(w.created_at)}</td>
                <td><span class="notify-badge ${w.notified ? "yes" : "no"}">${w.notified ? "Notified ✓" : "Not Notified"}</span></td>
                <td class="col-actions"><div class="action-btns"><button class="btn-action btn-send" data-id="${w.id}">📧</button><button class="btn-action btn-delete" data-id="${w.id}">🗑️</button></div></td>
            </tr>`,
      )
      .join("");
    const info = document.querySelector(".table-info");
    if (info)
      info.innerHTML = `Showing <strong>${data.length}</strong> records`;
  } catch (err) {
    console.error(err);
  }
}

// ==========================================
// FINANCE
// ==========================================
async function loadAdminFinance() {
  const tbody = document.querySelector("#financeTable tbody");
  if (!tbody) return;
  try {
    const { data } = await supabaseClient
      .from("payments")
      .select("*")
      .order("payment_date", { ascending: false });
    if (!data || data.length === 0) {
      tbody.innerHTML =
        '<tr><td colspan="9" style="text-align:center; padding:40px; color:white;">No payments yet</td></tr>';
    } else {
      tbody.innerHTML = data
        .map((p) => {
          const mc = (p.method || "").toLowerCase();
          const sc =
            p.status === "Paid"
              ? "status-badge-active"
              : "status-badge-pending";
          return `<tr data-id="${p.id}"><td class="col-check"><input type="checkbox"></td><td><span class="receipt-id">#${p.receipt_no}</span></td><td><div class="member-cell"><div class="member-avatar">${getInitial(p.member_name)}</div><div class="member-info"><h4>${p.member_name}</h4><p>${p.uid || "-"}</p></div></div></td><td><strong class="amount-green">Rs. ${p.amount}</strong></td><td><span class="pay-method ${mc}">${p.method}</span></td><td>${p.month || "-"}</td><td>${formatDate(p.payment_date)}</td><td><span class="${sc}">${p.status}</span></td><td class="col-actions"><div class="action-btns"><button class="btn-action btn-delete" data-id="${p.id}">🗑️</button></div></td></tr>`;
        })
        .join("");
    }
    const total = (data || []).reduce((s, p) => s + Number(p.amount || 0), 0);
    const sv = document.querySelectorAll(".fin-stat-value");
    if (sv[0]) sv[0].textContent = "Rs. " + total.toLocaleString();
    if (sv[1]) sv[1].textContent = "Rs. 0";
    if (sv[2]) sv[2].textContent = "Rs. " + total.toLocaleString();
    if (sv[3]) sv[3].textContent = (data || []).length;
    const info = document.querySelector(".table-info");
    if (info)
      info.innerHTML = `Showing <strong>${(data || []).length}</strong> payments`;
  } catch (err) {
    console.error(err);
  }
}

// ==========================================
// EXPENSES
// ==========================================
async function loadAdminExpenses() {
  const tbody = document.querySelector("#expenseTable tbody");
  if (!tbody) return;
  try {
    const { data } = await supabaseClient
      .from("expenses")
      .select("*")
      .order("expense_date", { ascending: false });
    if (!data || data.length === 0) {
      tbody.innerHTML =
        '<tr><td colspan="9" style="text-align:center; padding:40px; color:white;">No expenses yet</td></tr>';
    } else {
      tbody.innerHTML = data
        .map((e) => {
          const sc =
            e.status === "Approved"
              ? "status-badge-active"
              : "status-badge-pending";
          return `<tr data-id="${e.id}"><td class="col-check"><input type="checkbox"></td><td><span class="receipt-id">#${e.record_no}</span></td><td><div class="member-cell"><div class="member-avatar" style="background: rgba(239,68,68,0.2);">💸</div><div class="member-info"><h4>${e.description}</h4><p>Expense</p></div></div></td><td><span class="category-badge">${e.category}</span></td><td><strong class="amount-red">Rs. ${e.amount}</strong></td><td>${e.paid_by || "-"}</td><td>${formatDate(e.expense_date)}</td><td><span class="${sc}">${e.status}</span></td><td class="col-actions"><div class="action-btns"><button class="btn-action btn-delete" data-id="${e.id}">🗑️</button></div></td></tr>`;
        })
        .join("");
    }
    const total = (data || []).reduce((s, e) => s + Number(e.amount || 0), 0);
    const sv = document.querySelectorAll(".fin-stat-value");
    if (sv[0]) sv[0].textContent = "Rs. " + total.toLocaleString();
    if (sv[1]) sv[1].textContent = "Rs. 0";
    if (sv[2]) sv[2].textContent = (data || []).length;
    if (sv[3]) sv[3].textContent = (data || []).length;
  } catch (err) {
    console.error(err);
  }
}

// ==========================================
// DONATIONS
// ==========================================
async function loadAdminDonations() {
  const tbody = document.querySelector("#donationsTable tbody");
  if (!tbody) return;
  try {
    const { data } = await supabaseClient
      .from("donations")
      .select("*")
      .order("donation_date", { ascending: false });
    if (!data || data.length === 0) {
      tbody.innerHTML =
        '<tr><td colspan="9" style="text-align:center; padding:40px; color:white;">No donations yet</td></tr>';
    } else {
      tbody.innerHTML = data
        .map((d) => {
          const mc = (d.method || "").toLowerCase();
          const anon = d.is_anonymous;
          const name = anon ? "Anonymous" : d.donor_name || "Unknown";
          return `<tr data-id="${d.id}"><td class="col-check"><input type="checkbox"></td><td><span class="receipt-id">#${d.receipt_no}</span></td><td><div class="member-cell"><div class="member-avatar">${anon ? "?" : getInitial(d.donor_name)}</div><div class="member-info"><h4>${name}</h4><p>${anon ? "Hidden" : d.donor_email || "-"}</p></div></div></td><td><strong class="amount-green">Rs. ${d.amount}</strong></td><td><span class="pay-method ${mc}">${d.method}</span></td><td>${d.purpose || "General"}</td><td>${formatDate(d.donation_date)}</td><td><span class="donor-badge ${anon ? "anonymous" : "named"}">${anon ? "Anonymous" : "Named"}</span></td><td class="col-actions"><div class="action-btns"><button class="btn-action btn-delete" data-id="${d.id}">🗑️</button></div></td></tr>`;
        })
        .join("");
    }
    const total = (data || []).reduce((s, d) => s + Number(d.amount || 0), 0);
    const donors = new Set(
      (data || []).map((d) => d.donor_email || d.donor_name),
    ).size;
    const now = new Date();
    const thisMonth = (data || [])
      .filter((d) => {
        const dd = new Date(d.donation_date);
        return (
          dd.getMonth() === now.getMonth() &&
          dd.getFullYear() === now.getFullYear()
        );
      })
      .reduce((s, d) => s + Number(d.amount || 0), 0);
    const avg = (data || []).length > 0 ? Math.round(total / data.length) : 0;
    const sv = document.querySelectorAll(".fin-stat-value");
    if (sv[0]) sv[0].textContent = "Rs. " + total.toLocaleString();
    if (sv[1]) sv[1].textContent = donors;
    if (sv[2]) sv[2].textContent = "Rs. " + thisMonth.toLocaleString();
    if (sv[3]) sv[3].textContent = "Rs. " + avg.toLocaleString();
  } catch (err) {
    console.error(err);
  }
}

// ==========================================
// SPONSORSHIPS
// ==========================================
async function loadAdminSponsorships() {
  const grid = document.querySelector(".sponsors-grid");
  if (!grid) return;
  try {
    const { data } = await supabaseClient
      .from("sponsorships")
      .select("*")
      .order("sponsorship_date", { ascending: false });
    if (!data || data.length === 0) {
      grid.innerHTML =
        '<p style="color:white; text-align:center; padding:40px;">No sponsors yet</p>';
    } else {
      grid.innerHTML = data
        .map((s) => {
          const pkg = (s.package || "bronze").toLowerCase();
          const isCompany = s.sponsor_type === "Company";
          const tc = isCompany ? "company" : "individual";
          return `<div class="glass-card sponsor-card"><div class="sponsor-header"><div class="sponsor-logo ${tc}">${isCompany ? "🏢" : "👤"}</div><div class="sponsor-info"><h3>${s.sponsor_name}</h3><p>${s.sponsor_type}</p></div><span class="sponsor-badge ${pkg}">${s.package}</span></div><div class="sponsor-details"><div class="detail-row"><span class="detail-label">Contact</span><span class="detail-value">${s.contact_person || "-"}</span></div><div class="detail-row"><span class="detail-label">Email</span><span class="detail-value">${s.contact_email || "-"}</span></div><div class="detail-row"><span class="detail-label">Activity</span><span class="detail-value">${s.activity || "General"}</span></div><div class="detail-row"><span class="detail-label">Amount</span><span class="detail-value amount-highlight">Rs. ${Number(s.amount).toLocaleString()}</span></div></div><div class="sponsor-footer"><span class="sponsor-status ${s.status === "Active" ? "active" : "pending"}">${s.status}</span><div class="sponsor-actions"><button class="btn-action btn-delete" data-id="${s.id}">🗑️</button></div></div></div>`;
        })
        .join("");
    }
    const total = (data || []).reduce((s, x) => s + Number(x.amount || 0), 0);
    const active = (data || []).filter((x) => x.status === "Active").length;
    const sv = document.querySelectorAll(".fin-stat-value");
    if (sv[0]) sv[0].textContent = "Rs. " + total.toLocaleString();
    if (sv[1]) sv[1].textContent = active;
    if (sv[2]) sv[2].textContent = "Rs. 0";
    if (sv[3]) sv[3].textContent = (data || []).length;
  } catch (err) {
    console.error(err);
  }
}

// ==========================================
// CABINET
// ==========================================
async function loadAdminCabinet() {
  const cards = document.querySelectorAll(".cabinet-position-card");
  if (cards.length === 0) return;
  try {
    const { data } = await supabaseClient
      .from("members")
      .select("*")
      .neq("role", "Member")
      .eq("status", "Active");
    cards.forEach((card) => {
      const title =
        card.querySelector(".position-title")?.textContent?.trim() || "";
      const member = (data || []).find((m) => {
        const r = (m.role || "").toLowerCase();
        const t = title.toLowerCase();
        return r === t || t.includes(r) || r.includes(t);
      });
      if (member) {
        const n = card.querySelector(".position-member h5");
        const u = card.querySelector(".position-member p");
        const a = card.querySelector(".member-avatar-sm");
        if (n) n.textContent = member.name;
        if (u)
          u.textContent = `${member.uid || "-"} • ${member.district || "-"}`;
        if (a) a.textContent = getInitial(member.name);
      }
    });
  } catch (err) {
    console.error(err);
  }
}

// ==========================================
// DISTRICTS
// ==========================================
async function loadAdminDistricts() {
  const cards = document.querySelectorAll(".district-admin-card");
  if (cards.length === 0) return;
  try {
    const { data } = await supabaseClient
      .from("members")
      .select("district")
      .eq("status", "Active");
    const counts = {};
    (data || []).forEach((m) => {
      if (m.district) counts[m.district] = (counts[m.district] || 0) + 1;
    });
    cards.forEach((card) => {
      const name =
        card.querySelector(".district-admin-info h3")?.textContent?.trim() ||
        "";
      const info = card.querySelector(".district-admin-info p");
      if (info && counts[name]) {
        const t = (info.textContent.match(/(\d+)\s+Tehsils/) || [])[1] || "?";
        info.textContent = `${t} Tehsils • ${counts[name]} Members`;
      }
    });
  } catch (err) {
    console.error(err);
  }
}

// ==========================================
// STUB LOADERS
// ==========================================
async function loadAdminActivities() {
  try {
    const { data } = await supabaseClient.from("activities").select("*");
    console.log("Activities:", (data || []).length);
  } catch (e) {}
}
async function loadAdminNews() {
  try {
    const { data } = await supabaseClient.from("news").select("*");
    console.log("News:", (data || []).length);
  } catch (e) {}
}
async function loadAdminGallery() {
  try {
    const { data } = await supabaseClient.from("gallery").select("*");
    console.log("Gallery:", (data || []).length);
  } catch (e) {}
}
async function loadAdminDocuments() {
  try {
    const { data } = await supabaseClient.from("documents").select("*");
    console.log("Documents:", (data || []).length);
  } catch (e) {}
}
async function loadAdminNotifications() {
  try {
    const { data } = await supabaseClient.from("notifications").select("*");
    console.log("Notifications:", (data || []).length);
  } catch (e) {}
}
async function loadAdminEmail() {
  console.log("Email page loaded");
}
async function loadAdminReports() {
  console.log("Reports loaded");
}
async function loadAdminSettings() {
  console.log("Settings loaded");
}

// ==========================================
// MEMBERSHIP & REGISTRATION TOGGLES
// ==========================================
async function loadMembershipStatus() {
  try {
    const { data } = await supabaseClient
      .from("settings")
      .select("value")
      .eq("key", "membership_open")
      .single();
    updateMembershipUI(data.value === "true");
  } catch (err) {
    console.log(err);
  }
}

function updateMembershipUI(isOpen) {
  const block = document.querySelector(".membership-toggle-block");
  if (!block) return;
  const ind = block.querySelector(".status-indicator");
  const t = block.querySelector(".toggle-status h4");
  const d = block.querySelector(".toggle-status p");
  const b = block.querySelector(".btn-toggle-open");

  if (isOpen) {
    if (ind) {
      ind.className = "status-indicator open";
      ind.style.background = "#1abc9c";
    }
    if (t) t.textContent = "Currently Open";
    if (d) d.textContent = "Membership applications are being accepted";
    if (b) {
      b.textContent = "Close Membership";
      b.style.background = "linear-gradient(135deg, #ef4444, #b91c1c)";
      b.setAttribute("data-action", "close");
    }
  } else {
    if (ind) {
      ind.className = "status-indicator closed";
      ind.style.background = "#ef4444";
    }
    if (t) t.textContent = "Currently Closed";
    if (d) d.textContent = "Membership applications are not being accepted";
    if (b) {
      b.textContent = "Open Membership";
      b.style.background = "linear-gradient(135deg, #1abc9c, #16a085)";
      b.setAttribute("data-action", "open");
    }
  }

  if (b && !b.hasAttribute("data-listener")) {
    b.setAttribute("data-listener", "true");
    b.addEventListener("click", async function () {
      const action = this.getAttribute("data-action");
      const v = action === "open" ? "true" : "false";
      if (!confirm((action === "open" ? "Open" : "Close") + " membership?"))
        return;
      await supabaseClient
        .from("settings")
        .update({ value: v, updated_at: new Date().toISOString() })
        .eq("key", "membership_open");
      alert("✅ Membership is now " + (action === "open" ? "OPEN" : "CLOSED"));
      loadMembershipStatus();
    });
  }
}

async function loadRegistrationStatus() {
  try {
    const { data } = await supabaseClient
      .from("settings")
      .select("value")
      .eq("key", "registration_open")
      .single();
    updateRegistrationUI(data.value === "true");
  } catch (err) {
    console.log(err);
  }
}

function updateRegistrationUI(isOpen) {
  const block = document.querySelector(".membership-toggle-block");
  if (!block || document.getElementById("registrationToggleBlock")) return;
  const card = document.createElement("div");
  card.id = "registrationToggleBlock";
  card.className = "glass-card content-card";
  card.style.marginTop = "20px";
  card.innerHTML = `<div class="card-header"><h3>📝 Registration Status</h3></div><div class="membership-toggle-block"><div class="toggle-status"><span class="status-indicator ${isOpen ? "open" : "closed"}" style="background: ${isOpen ? "#1abc9c" : "#ef4444"};"></span><div><h4>Currently ${isOpen ? "Open" : "Closed"}</h4><p>${isOpen ? "New members can register" : "Registrations disabled"}</p></div></div><button class="btn-toggle-open" style="background: linear-gradient(135deg, ${isOpen ? "#ef4444, #b91c1c" : "#1abc9c, #16a085"});" data-reg-action="${isOpen ? "close" : "open"}">${isOpen ? "Close Registration" : "Open Registration"}</button></div>`;
  block.parentElement.insertBefore(card, block.nextSibling);
  card
    .querySelector("[data-reg-action]")
    .addEventListener("click", async function () {
      const a = this.getAttribute("data-reg-action");
      const v = a === "open" ? "true" : "false";
      if (!confirm((a === "open" ? "Open" : "Close") + " registration?"))
        return;
      await supabaseClient
        .from("settings")
        .update({ value: v, updated_at: new Date().toISOString() })
        .eq("key", "registration_open");
      alert("✅ Registration is now " + (a === "open" ? "OPEN" : "CLOSED"));
      location.reload();
    });
}

// ==========================================
// BACK TO WEBSITE BUTTON
// ==========================================
function addBackToWebsiteButton() {
  const footer = document.querySelector(".admin-sidebar .sidebar-footer");
  if (!footer || footer.querySelector(".back-to-site-btn")) return;
  const btn = document.createElement("a");
  btn.href = "index.html";
  btn.className = "back-to-site-btn";
  btn.innerHTML = "<span>🌐</span><span>Back to Website</span>";
  btn.style.cssText =
    "display:flex;align-items:center;gap:12px;padding:12px 15px;border-radius:10px;color:#93c5fd;text-decoration:none;font-size:14px;font-weight:500;transition:0.3s;background:rgba(59,130,246,0.08);border:1px solid rgba(59,130,246,0.15);margin-bottom:8px;cursor:pointer;";
  footer.insertBefore(btn, footer.firstChild);
}

// ==========================================
// UNIVERSAL DELETE
// ==========================================
function attachAllDeleteHandlers() {
  const configs = [
    {
      sel: "#financeTable .btn-delete",
      table: "payments",
      reload: loadAdminFinance,
    },
    {
      sel: "#expenseTable .btn-delete",
      table: "expenses",
      reload: loadAdminExpenses,
    },
    {
      sel: "#donationsTable .btn-delete",
      table: "donations",
      reload: loadAdminDonations,
    },
    {
      sel: "#waitlistTable .btn-delete",
      table: "waitlist",
      reload: loadAdminWaitlist,
    },
    {
      sel: ".sponsor-card .btn-delete",
      table: "sponsorships",
      reload: loadAdminSponsorships,
    },
  ];
  configs.forEach((cfg) => {
    document.querySelectorAll(cfg.sel).forEach((btn) => {
      if (btn.hasAttribute("data-del")) return;
      btn.setAttribute("data-del", "true");
      btn.addEventListener("click", async function (e) {
        e.preventDefault();
        const id = this.getAttribute("data-id");
        if (!id || !confirm("Delete this record?")) return;
        const { error } = await supabaseClient
          .from(cfg.table)
          .delete()
          .eq("id", id);
        if (error) {
          alert("❌ " + error.message);
          return;
        }
        alert("✅ Deleted!");
        cfg.reload();
      });
    });
  });
}

function hidePagination() {
  document
    .querySelectorAll(".pagination")
    .forEach((p) => (p.style.display = "none"));
}

// ==========================================
// MAIN
// ==========================================
async function initAdminData() {
  await waitForSupabaseAdmin();
  if (!supabaseClient) {
    console.error("Supabase not available");
    return;
  }
  const page = getAdminPage();
  console.log("🔍 Admin page:", page);

  switch (page) {
    case "admin.html":
      loadAdminDashboard();
      loadMembershipStatus();
      loadRegistrationStatus();
      break;
    case "admin-members.html":
      loadAdminMembers();
      break;
    case "admin-applications.html":
      loadAdminApplications();
      break;
    case "admin-waitlist.html":
      loadAdminWaitlist();
      break;
    case "admin-finance.html":
      loadAdminFinance();
      break;
    case "admin-expenses.html":
      loadAdminExpenses();
      break;
    case "admin-donations.html":
      loadAdminDonations();
      break;
    case "admin-sponsorships.html":
      loadAdminSponsorships();
      break;
    case "admin-cabinet.html":
      loadAdminCabinet();
      break;
    case "admin-districts.html":
      loadAdminDistricts();
      break;
    case "admin-proposals.html":
      break;
    case "admin-activities.html":
      loadAdminActivities();
      break;
    case "admin-news.html":
      loadAdminNews();
      break;
    case "admin-gallery.html":
      loadAdminGallery();
      break;
    case "admin-documents.html":
      loadAdminDocuments();
      break;
    case "admin-notifications.html":
      loadAdminNotifications();
      break;
    case "admin-email.html":
      loadAdminEmail();
      break;
    case "admin-reports.html":
      loadAdminReports();
      break;
    case "admin-settings.html":
      loadAdminSettings();
      break;
  }

  setTimeout(updateSidebarBadges, 500);
  setTimeout(attachAllDeleteHandlers, 1500);
  setTimeout(hidePagination, 500);
}

window.addEventListener("load", function () {
  setTimeout(initAdminData, 800);
  setTimeout(addBackToWebsiteButton, 600);
});
