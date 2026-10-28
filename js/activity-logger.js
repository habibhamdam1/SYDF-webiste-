// Simple Logger - No Interceptor
async function logActivity(opts) {
  if (typeof supabaseClient === "undefined" || !supabaseClient) return;
  if (!opts || !opts.action) return;
  try {
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (!session || !session.user) return;
    await supabaseClient.from("activity_logs").insert([{
      admin_email: session.user.email, action: opts.action,
      action_label: opts.actionLabel || opts.action, target_type: opts.targetType || null,
      target_id: opts.targetId != null ? String(opts.targetId) : null,
      target_name: opts.targetName || null, details: opts.details || null
    }]);
  } catch (err) { console.log("Log skipped"); }
}
window.logActivity = logActivity;
window.ActivityLog = { custom: (opts) => logActivity(opts) };
