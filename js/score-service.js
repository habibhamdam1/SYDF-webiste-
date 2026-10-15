// ==========================================
// SYDF MEMBER ENGAGEMENT SCORE SERVICE
// ==========================================

// ==========================================
// BADGE DEFINITIONS
// ==========================================
const BADGE_DEFINITIONS = {
  "New Member": {
    icon: "🌟",
    color: "#3b82f6",
    description: "Joined SYDF recently",
    criteria: "Less than 3 months",
  },
  Active: {
    icon: "🔥",
    color: "#f59e0b",
    description: "Active member with full payments",
    criteria: "3+ months, 100% payments",
  },
  Gold: {
    icon: "💎",
    color: "#fbbf24",
    description: "Gold member - highly active",
    criteria: "6+ months, 5+ activities",
  },
  Elite: {
    icon: "👑",
    color: "#ec4899",
    description: "Elite member - leadership role",
    criteria: "1+ year, leadership position",
  },
};

// ==========================================
// CALCULATE SCORE FOR A MEMBER
// ==========================================
async function calculateMemberScore(member) {
  if (!member || !member.email) return { score: 0, badges: [], breakdown: {} };

  try {
    // 1. Fetch payments
    const { data: payments } = await supabaseClient
      .from("payments")
      .select("*")
      .eq("member_email", member.email);

    // 2. Fetch activities joined
    const { data: activities } = await supabaseClient
      .from("activity_participants")
      .select("*")
      .eq("member_email", member.email);

    const payList = payments || [];
    const actList = activities || [];

    // ==========================================
    // TENURE (Months since joining)
    // ==========================================
    let monthsSinceJoin = 0;
    if (member.created_at) {
      const joined = new Date(member.created_at);
      const now = new Date();
      monthsSinceJoin = Math.max(
        1,
        Math.floor((now - joined) / (1000 * 60 * 60 * 24 * 30)),
      );
    }

    // ==========================================
    // PAYMENTS SCORE (40 points max)
    // ==========================================
    const paidMonths = payList.filter((p) => p.status === "Paid").length;
    const paymentRatio =
      monthsSinceJoin > 0 ? Math.min(paidMonths / monthsSinceJoin, 1) : 0;
    const paymentScore = Math.round(paymentRatio * 40);

    // ==========================================
    // ACTIVITIES SCORE (30 points max)
    // ==========================================
    const activityCount = actList.length;
    const activityScore = Math.min(activityCount * 6, 30);

    // ==========================================
    // TENURE SCORE (20 points max)
    // ==========================================
    const tenureScore = Math.min(monthsSinceJoin * 2, 20);

    // ==========================================
    // PROFILE COMPLETENESS (10 points max)
    // ==========================================
    const profileFields = [
      "name",
      "father_name",
      "cnic",
      "dob",
      "gender",
      "email",
      "phone",
      "district",
      "tehsil",
      "photo_url",
    ];
    const filledFields = profileFields.filter((f) => member[f]).length;
    const profileScore = Math.round((filledFields / profileFields.length) * 10);

    // ==========================================
    // TOTAL SCORE
    // ==========================================
    const totalScore = Math.min(
      paymentScore + activityScore + tenureScore + profileScore,
      100,
    );

    // ==========================================
    // BADGES
    // ==========================================
    const badges = [];

    if (monthsSinceJoin < 3) {
      badges.push("New Member");
    }

    if (monthsSinceJoin >= 3 && paymentRatio >= 1) {
      badges.push("Active");
    }

    if (monthsSinceJoin >= 6 && activityCount >= 5) {
      badges.push("Gold");
    }

    const leadershipRoles = [
      "President",
      "Chairman & President",
      "Senior Vice President",
      "Vice President",
      "Secretary General",
      "Super Admin",
    ];
    if (monthsSinceJoin >= 12 && leadershipRoles.includes(member.role)) {
      badges.push("Elite");
    }

    // Always have at least one badge
    if (badges.length === 0) badges.push("New Member");

    // ==========================================
    // SAVE TO DATABASE
    // ==========================================
    const badgesStr = "{" + badges.join(",") + "}";

    await supabaseClient
      .from("members")
      .update({
        engagement_score: totalScore,
        badges: badges,
        last_score_update: new Date().toISOString(),
      })
      .eq("email", member.email);

    return {
      score: totalScore,
      badges: badges,
      breakdown: {
        payments: paymentScore,
        activities: activityScore,
        tenure: tenureScore,
        profile: profileScore,
      },
      stats: {
        monthsSinceJoin: monthsSinceJoin,
        paymentsCount: paidMonths,
        activitiesCount: activityCount,
        profilePercent: Math.round((filledFields / profileFields.length) * 100),
      },
    };
  } catch (err) {
    console.error("Score calculation error:", err);
    return { score: 0, badges: ["New Member"], breakdown: {}, stats: {} };
  }
}

// ==========================================
// GET MEMBER OF THE MONTH (Highest Scorer)
// ==========================================
async function getMemberOfTheMonth() {
  try {
    const { data, error } = await supabaseClient
      .from("members")
      .select(
        "name, uid, district, photo_url, role, engagement_score, badges, gender",
      )
      .eq("status", "Active")
      .order("engagement_score", { ascending: false })
      .limit(1)
      .single();

    if (error || !data) return null;

    // Hide female photo
    if (data.gender === "Female") {
      data.photo_url = null;
    }

    return data;
  } catch (err) {
    console.error("Member of month error:", err);
    return null;
  }
}

// ==========================================
// GET LEADERBOARD (Top 10)
// ==========================================
async function getLeaderboard() {
  try {
    const { data, error } = await supabaseClient
      .from("members")
      .select(
        "name, uid, district, photo_url, role, engagement_score, badges, gender",
      )
      .eq("status", "Active")
      .order("engagement_score", { ascending: false })
      .limit(10);

    if (error) throw error;

    return (data || []).map((m) => {
      if (m.gender === "Female") m.photo_url = null;
      return m;
    });
  } catch (err) {
    console.error("Leaderboard error:", err);
    return [];
  }
}

// ==========================================
// GET BADGE INFO
// ==========================================
function getBadgeInfo(badgeName) {
  return (
    BADGE_DEFINITIONS[badgeName] || {
      icon: "🏅",
      color: "#1abc9c",
      description: "Member badge",
      criteria: "",
    }
  );
}

// ==========================================
// EXPOSE FUNCTIONS
// ==========================================
window.calculateMemberScore = calculateMemberScore;
window.getMemberOfTheMonth = getMemberOfTheMonth;
window.getLeaderboard = getLeaderboard;
window.getBadgeInfo = getBadgeInfo;
window.BADGE_DEFINITIONS = BADGE_DEFINITIONS;

console.log("✅ Score Service Loaded");
