/* ============================================================
   SYDF — ACTIVITY LOGGER & SOFT-DELETE INTERCEPTOR
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
      return null;
    }
  }

  async function logActivity(opts) {
    if (typeof window.__rawSupabaseClient === "undefined") return;
    if (!opts || !opts.action) return;
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
      };
      await window.__rawSupabaseClient.from("activity_logs").insert([payload]);
    } catch (err) {
      console.error("logActivity error:", err);
    }
  }

  window.logActivity = logActivity;

  // ============================================================
  // 🚀 THE MAGIC: SUPABASE INTERCEPTOR
  // ============================================================
  window.addEventListener("load", () => {
    let attempts = 0;
    const initInterceptor = setInterval(() => {
      if (typeof supabaseClient !== "undefined" && supabaseClient) {
        clearInterval(initInterceptor);
        window.__rawSupabaseClient = supabaseClient;
        const originalFrom = supabaseClient.from.bind(supabaseClient);

        supabaseClient.from = function (tableName) {
          if (tableName === "activity_logs") return originalFrom(tableName);

          const builder = originalFrom(tableName);
          let method = null;
          let payload = null;

          // 1. SELECT INTERCEPTOR: Auto-hide deleted items
          const originalSelect = builder.select.bind(builder);
          builder.select = function (...args) {
            let query = originalSelect(...args);
            if (!window.__showDeletedItems && !window.__forceDelete) {
              return query.is("deleted_at", null);
            }
            return query;
          };

          // 2. DELETE INTERCEPTOR: Convert to Soft Delete
          const originalDelete = builder.delete.bind(builder);
          builder.delete = function () {
            if (window.__forceDelete) {
              window.__actionOverride = "HARD_DELETE";
              return originalDelete();
            } else {
              window.__actionOverride = "SOFT_DELETE";
              return builder.update({ deleted_at: new Date().toISOString() });
            }
          };

          // 3. LOGGER INTERCEPTOR (Insert, Update, Delete)
          const interceptMethod = (m) => {
            if (typeof builder[m] === "function") {
              const original = builder[m].bind(builder);
              builder[m] = function (...args) {
                method = m;
                payload = args[0];
                return original(...args);
              };
            }
          };
          ["insert", "update", "delete", "upsert"].forEach(interceptMethod);

          const originalThen = builder.then.bind(builder);
          builder.then = function (onFulfilled, onRejected) {
            return originalThen(function (response) {
              if (method && !response.error) {
                let action = `${tableName}_${method}`;
                let actionLabel = `${method.toUpperCase()} ${tableName}`;
                let targetName = null,
                  targetId = null;

                const rowData =
                  response.data && response.data.length > 0
                    ? response.data[0]
                    : payload;
                if (rowData) {
                  if (Array.isArray(rowData) && rowData.length > 0) {
                    targetId = rowData[0]?.id;
                    targetName =
                      rowData[0]?.name ||
                      rowData[0]?.title ||
                      rowData[0]?.member_name;
                  } else if (typeof rowData === "object") {
                    targetId = rowData.id;
                    targetName =
                      rowData.name ||
                      rowData.title ||
                      rowData.member_name ||
                      rowData.email;
                  }
                }

                const tableMap = {
                  members: "Member",
                  payments: "Payment",
                  districts: "District",
                  tehsils: "Tehsil",
                  news: "News",
                  activities: "Activity",
                  gallery: "Photo",
                  documents: "Document",
                };
                const tName = tableMap[tableName] || tableName;

                if (method === "insert") actionLabel = `Created new ${tName}`;
                else if (method === "update") actionLabel = `Updated ${tName}`;
                else if (method === "delete") actionLabel = `Deleted ${tName}`;

                if (window.__actionOverride === "SOFT_DELETE") {
                  action = `${tableName}_soft_delete`;
                  actionLabel = `Moved ${tName} to Recycle Bin`;
                  window.__actionOverride = null;
                } else if (window.__actionOverride === "HARD_DELETE") {
                  action = `${tableName}_hard_delete`;
                  actionLabel = `Permanently deleted ${tName}`;
                  window.__actionOverride = null;
                }

                if (
                  tableName === "members" &&
                  method === "update" &&
                  payload &&
                  payload.is_active === true
                ) {
                  actionLabel = `Approved member`;
                }

                logActivity({
                  action,
                  actionLabel,
                  targetType: tableName,
                  targetId,
                  targetName,
                });
              }
              if (onFulfilled) return onFulfilled(response);
              return response;
            }, onRejected);
          };

          return builder;
        };
        console.log("✅ Auto-Logger & Soft-Delete Interceptor Active!");
      }
      attempts++;
      if (attempts > 50) clearInterval(initInterceptor);
    }, 100);
  });

  window.ActivityLog = {
    custom: (opts) => logActivity(opts),
  };
})();
