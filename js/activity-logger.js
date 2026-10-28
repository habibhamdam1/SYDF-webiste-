/* ============================================================
   SYDF — ACTIVITY LOGGER
   Include in any admin page:
     <script src="js/activity-logger.js"></script>
   Then call:
     logActivity({ action, actionLabel, targetType, targetId, targetName, details })
   Or use shortcuts:
     ActivityLog.memberApproved({ id, name })
     ActivityLog.paymentApproved({ id, member_name, tid })
   ============================================================ */

(function () {
  let cachedAdmin = null;

  async function getAdminInfo() {
    if (cachedAdmin) return cachedAdmin;
    if (typeof supabaseClient === "undefined" || !supabaseClient) return null;

    try {
      const {
        data: { session },
      } = await supabaseClient.auth.getSession();
      if (!session || !session.user) return null;

      const { data: member } = await supabaseClient
        .from("members")
        .select("name, role, email")
        .eq("user_id", session.user.id)
        .single();

      cachedAdmin = member || {
        name: session.user.email,
        role: "User",
        email: session.user.email,
      };
      return cachedAdmin;
    } catch (err) {
      console.error("getAdminInfo error:", err);
      return null;
    }
  }

  async function logActivity(opts) {
    if (typeof supabaseClient === "undefined" || !supabaseClient) return;
    if (!opts || !opts.action) {
      console.warn("logActivity: action is required");
      return;
    }

    try {
      const admin = await getAdminInfo();
      if (!admin) return;

      const payload = {
        admin_email: admin.email,
        admin_name: admin.name || admin.email,
        admin_role: admin.role || "User",
        action: opts.action,
        action_label: opts.actionLabel || opts.action,
        target_type: opts.targetType || null,
        target_id: opts.targetId != null ? String(opts.targetId) : null,
        target_name: opts.targetName || null,
        details: opts.details || null,
        user_agent: navigator.userAgent
          ? navigator.userAgent.slice(0, 200)
          : null,
      };

      const { error } = await supabaseClient
        .from("activity_logs")
        .insert([payload]);
      if (error) console.error("logActivity insert error:", error);
    } catch (err) {
      console.error("logActivity error:", err);
    }
  }

  window.logActivity = logActivity;

  window.ActivityLog = {
    // ----- MEMBERS -----
    memberApproved: (m) =>
      logActivity({
        action: "member_approved",
        actionLabel: "Approved member",
        targetType: "member",
        targetId: m.id,
        targetName: m.name,
      }),
    memberRejected: (m, reason) =>
      logActivity({
        action: "member_rejected",
        actionLabel: "Rejected member",
        targetType: "member",
        targetId: m.id,
        targetName: m.name,
        details: { reason },
      }),
    memberSuspended: (m) =>
      logActivity({
        action: "member_suspended",
        actionLabel: "Suspended member",
        targetType: "member",
        targetId: m.id,
        targetName: m.name,
      }),
    memberActivated: (m) =>
      logActivity({
        action: "member_activated",
        actionLabel: "Activated member",
        targetType: "member",
        targetId: m.id,
        targetName: m.name,
      }),
    memberDeleted: (m) =>
      logActivity({
        action: "member_deleted",
        actionLabel: "Deleted member",
        targetType: "member",
        targetId: m.id,
        targetName: m.name,
      }),
    memberRoleChanged: (m, oldRole, newRole) =>
      logActivity({
        action: "member_role_changed",
        actionLabel: "Changed member role",
        targetType: "member",
        targetId: m.id,
        targetName: m.name,
        details: { old_role: oldRole, new_role: newRole },
      }),

    // ----- PAYMENTS -----
    paymentApproved: (p) =>
      logActivity({
        action: "payment_approved",
        actionLabel: "Approved payment",
        targetType: "payment",
        targetId: p.id,
        targetName: p.member_name || p.tid,
      }),
    paymentRejected: (p, reason) =>
      logActivity({
        action: "payment_rejected",
        actionLabel: "Rejected payment",
        targetType: "payment",
        targetId: p.id,
        targetName: p.member_name || p.tid,
        details: { reason },
      }),

    // ----- DISTRICTS -----
    districtCreated: (d) =>
      logActivity({
        action: "district_created",
        actionLabel: "Created district",
        targetType: "district",
        targetId: d.id,
        targetName: d.name,
      }),
    districtDeleted: (d) =>
      logActivity({
        action: "district_deleted",
        actionLabel: "Deleted district",
        targetType: "district",
        targetId: d.id,
        targetName: d.name,
      }),
    tehsilCreated: (t, districtName) =>
      logActivity({
        action: "tehsil_created",
        actionLabel: "Created tehsil",
        targetType: "tehsil",
        targetId: t.id,
        targetName: t.name,
        details: { district: districtName },
      }),
    coordinatorAssigned: (d, memberName) =>
      logActivity({
        action: "coordinator_assigned",
        actionLabel: "Assigned coordinator",
        targetType: "district",
        targetId: d.id,
        targetName: d.name,
        details: { coordinator: memberName },
      }),

    // ----- CONTENT -----
    activityCreated: (a) =>
      logActivity({
        action: "activity_created",
        actionLabel: "Created activity",
        targetType: "activity",
        targetId: a.id,
        targetName: a.title,
      }),
    activityDeleted: (a) =>
      logActivity({
        action: "activity_deleted",
        actionLabel: "Deleted activity",
        targetType: "activity",
        targetId: a.id,
        targetName: a.title,
      }),
    newsCreated: (n) =>
      logActivity({
        action: "news_created",
        actionLabel: "Created news",
        targetType: "news",
        targetId: n.id,
        targetName: n.title,
      }),
    newsDeleted: (n) =>
      logActivity({
        action: "news_deleted",
        actionLabel: "Deleted news",
        targetType: "news",
        targetId: n.id,
        targetName: n.title,
      }),
    documentUploaded: (doc) =>
      logActivity({
        action: "document_uploaded",
        actionLabel: "Uploaded document",
        targetType: "document",
        targetId: doc.id,
        targetName: doc.title,
      }),
    galleryUploaded: (count, album) =>
      logActivity({
        action: "gallery_uploaded",
        actionLabel: `Uploaded ${count} photo(s)`,
        targetType: "gallery",
        targetName: album,
        details: { count, album },
      }),

    // ----- ELECTIONS -----
    electionCreated: (e) =>
      logActivity({
        action: "election_created",
        actionLabel: "Created election",
        targetType: "election",
        targetId: e.id,
        targetName: e.title,
      }),
    nominationApproved: (n) =>
      logActivity({
        action: "nomination_approved",
        actionLabel: "Approved nomination",
        targetType: "election",
        targetId: n.id,
        targetName: n.member_name,
      }),

    // ----- SYSTEM -----
    settingsUpdated: (keys) =>
      logActivity({
        action: "settings_updated",
        actionLabel: "Updated settings",
        targetType: "settings",
        details: { keys },
      }),
    adminAccessChanged: (memberName, role) =>
      logActivity({
        action: "admin_access_changed",
        actionLabel: "Changed admin access",
        targetType: "member",
        targetName: memberName,
        details: { role },
      }),
    emailSent: (to, subject) =>
      logActivity({
        action: "email_sent",
        actionLabel: "Sent email",
        targetType: "email",
        targetName: to,
        details: { subject },
      }),

    // ----- GENERIC (custom) -----
    custom: (opts) => logActivity(opts),
  };
})();
