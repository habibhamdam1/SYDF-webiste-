/* ==========================================
   MY ACTIVITIES PAGE LOGIC
   ========================================== */

let allActivities = [];
let currentEmail = null;

function escapeHtml(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[c];
  });
}

function formatDate(d) {
  if (!d) return "-";
  try {
    return new Date(d).toLocaleDateString("en-PK", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch (e) {
    return "-";
  }
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
    document.getElementById("activitiesList").innerHTML =
      '<div class="empty-box"><span class="ico">⚠️</span><h3>System not ready</h3><p>Please refresh the page.</p></div>';
    return;
  }

  try {
    const { data: sessionData } = await supabaseClient.auth.getSession();
    const session = sessionData ? sessionData.session : null;

    if (!session || !session.user) {
      window.location.href = "login.html";
      return;
    }

    currentEmail = session.user.email;

    // Topbar user info
    const { data: member } = await supabaseClient
      .from("members")
      .select("name, uid")
      .eq("email", currentEmail)
      .maybeSingle();

    if (member) {
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

    // 1. Fetch joined activity IDs for this member
    const { data: joinedData, error: joinError } = await supabaseClient
      .from("activity_participants")
      .select("activity_id")
      .eq("member_email", currentEmail);

    if (joinError) throw joinError;

    const joinedIds = (joinedData || [])
      .map((j) => j.activity_id)
      .filter((id) => id != null);

    // If no joined activities, show empty state
    if (joinedIds.length === 0) {
      document.getElementById("activitiesList").innerHTML =
        '<div class="empty-box"><span class="ico">🎯</span><h3>No Activities Joined</h3><p>You haven\'t joined any activities yet.</p><br><a href="dashboard.html" style="color: var(--accent); font-weight: 600; text-decoration: none;">Go to Dashboard</a></div>';
      return;
    }

    // 2. Fetch ONLY the joined activities from activities table
    const { data: activitiesData, error: actError } = await supabaseClient
      .from("activities")
      .select("*")
      .in("id", joinedIds)
      .order("activity_date", { ascending: false });

    if (actError) throw actError;

    allActivities = activitiesData || [];
    renderActivities("all");

    // Setup filter buttons
    document.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        document
          .querySelectorAll(".filter-btn")
          .forEach((b) => b.classList.remove("active"));
        this.classList.add("active");
        renderActivities(this.getAttribute("data-filter") || "all");
      });
    });
  } catch (err) {
    document.getElementById("activitiesList").innerHTML =
      '<div class="empty-box"><span class="ico">⚠️</span><h3>Something went wrong</h3><p>' +
      escapeHtml(err.message || "Unknown error") +
      "</p></div>";
  }
});

function renderActivities(filter) {
  filter = filter || "all";
  const container = document.getElementById("activitiesList");

  const filtered =
    filter === "all"
      ? allActivities
      : allActivities.filter(
          (a) => String(a.status || "").toLowerCase() === filter,
        );

  if (filtered.length === 0) {
    container.innerHTML =
      '<div class="empty-box"><span class="ico">🔍</span><h3>No Activities Found</h3><p>You have no ' +
      filter +
      " activities.</p></div>";
    return;
  }

  container.innerHTML = filtered
    .map((a) => {
      const status = String(a.status || "Upcoming").toLowerCase();
      const statusLabel = escapeHtml(a.status || "Upcoming");
      const date = formatDate(a.activity_date);

      // Kyunke yeh "My Activities" page hai, isliye action button hamesha "Participating" hoga
      const actionHTML = '<span class="btn-joined">✅ Participating</span>';

      return (
        '<div class="activity-card ' +
        escapeHtml(status) +
        '">' +
        '<div class="activity-thumb">🎯</div>' +
        '<div class="activity-info">' +
        '<div class="activity-top">' +
        '<div class="activity-title">' +
        escapeHtml(a.title || "Untitled") +
        "</div>" +
        '<span class="activity-status ' +
        escapeHtml(status) +
        '">' +
        statusLabel +
        "</span>" +
        "</div>" +
        '<div class="activity-meta">' +
        "<span>📅 " +
        escapeHtml(date) +
        "</span>" +
        "<span>📍 " +
        escapeHtml(a.location || "-") +
        "</span>" +
        "<span>👤 " +
        escapeHtml(a.organizer || "-") +
        "</span>" +
        "</div>" +
        '<p class="activity-desc">' +
        escapeHtml(a.description || "") +
        "</p>" +
        '<div class="activity-footer">' +
        '<div class="activity-stats">' +
        '<span class="activity-stat">💰 Rs. ' +
        Number(a.budget || 0).toLocaleString() +
        "</span>" +
        '<span class="activity-stat">👥 ' +
        Number(a.participants || 0) +
        " participants</span>" +
        "</div>" +
        actionHTML +
        "</div></div></div>"
      );
    })
    .join("");
}
