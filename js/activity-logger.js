/* ============================================================
   SYDF — ACTIVITY LOGGER (AUTO-INTERCEPTOR VERSION)
   Ye har Database Insert, Update, Delete ko automatically pakad kar log karega.
   Aapko admin pages ke buttons mein kuch add nahi karna!
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
    if (typeof supabaseClient === "undefined" || !supabaseClient) return;
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
        user_agent: navigator.userAgent
          ? navigator.userAgent.slice(0, 200)
          : null,
      };

      // Yahan hum "raw" client use karenge taake interceptor isko dobara log na kare
      await window.__rawSupabaseClient.from("activity_logs").insert([payload]);
    } catch (err) {
      console.error("logActivity error:", err);
    }
  }

  window.logActivity = logActivity;

  // ============================================================
  // 🚀 THE MAGIC: SUPABASE INTERCEPTOR (AUTO LOGGER)
  // ============================================================
  window.addEventListener("load", () => {
    // Jab tak Supabase initialize na ho, wait karein
    let attempts = 0;
    const initInterceptor = setInterval(() => {
      if (typeof supabaseClient !== "undefined" && supabaseClient) {
        clearInterval(initInterceptor);

        // Backup original client
        window.__rawSupabaseClient = supabaseClient;

        // Override the .from() method
        const originalFrom = supabaseClient.from.bind(supabaseClient);

        supabaseClient.from = function (tableName) {
          // Agar activity_logs table hai, to intercept NA karein (infinite loop se bachne ke liye)
          if (tableName === "activity_logs") {
            return originalFrom(tableName);
          }

          const builder = originalFrom(tableName);
          let method = null;
          let payload = null;

          // Methods ko pakadne ke liye wrapper
          const interceptMethod = (m) => {
            if (typeof builder[m] === "function") {
              const original = builder[m].bind(builder);
              builder[m] = function (...args) {
                method = m; // 'insert', 'update', 'delete', 'upsert'
                payload = args[0]; // Jo data bheja ja raha hai
                return original(...args);
              };
            }
          };

          ["insert", "update", "delete", "upsert"].forEach(interceptMethod);

          // Promise (then) ko pakadne ke liye
          const originalThen = builder.then.bind(builder);
          builder.then = function (onFulfilled, onRejected) {
            return originalThen(function (response) {
              // Agar query successful hai aur koi modification hui hai
              if (method && !response.error) {
                let action = `${tableName}_${method}`;
                let actionLabel = `${method.toUpperCase()} ${tableName}`;
                let targetName = null;
                let targetId = null;

                // Data se naam nikalne ki koshish karein
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

                // Labels ko sundar banayein (Human Readable)
                const tableMap = {
                  members: "Member",
                  payments: "Payment",
                  districts: "District",
                  tehsils: "Tehsil",
                  news: "News",
                  activities: "Activity",
                  gallery: "Photo",
                  documents: "Document",
                  elections: "Election",
                  proposals: "Proposal",
                };
                const tName = tableMap[tableName] || tableName;

                if (method === "insert") actionLabel = `Created new ${tName}`;
                else if (method === "update") actionLabel = `Updated ${tName}`;
                else if (method === "delete") actionLabel = `Deleted ${tName}`;

                // Special overrides (Agar specific actions hain)
                if (
                  tableName === "members" &&
                  method === "update" &&
                  payload &&
                  payload.is_active === true
                ) {
                  actionLabel = `Approved member`;
                }

                // Log it!
                logActivity({
                  action: action,
                  actionLabel: actionLabel,
                  targetType: tableName,
                  targetId: targetId,
                  targetName: targetName,
                  details: {
                    payload_preview: payload ? Object.keys(payload) : null,
                  },
                });
              }
              if (onFulfilled) return onFulfilled(response);
              return response;
            }, onRejected);
          };

          return builder;
        };
        console.log("✅ Supabase Auto-Logger Interceptor Active!");
      }

      attempts++;
      if (attempts > 50) clearInterval(initInterceptor); // 5 seconds timeout
    }, 100);
  });

  // Purane shortcuts ko bhi rakhein taake manual logging kaam kare
  window.ActivityLog = {
    custom: (opts) => logActivity(opts),
  };
})();
