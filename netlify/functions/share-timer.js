
exports.handler = async (event) => {
  const headers = {
    "Content-Type": "application/json",
    "Cache-Control": "no-store"
  };

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed" })
    };
  }

  try {
    const { adjusted_time } = JSON.parse(event.body || "{}");

    if (
      typeof adjusted_time !== "string" ||
      !/^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/.test(adjusted_time)
    ) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Invalid time format" })
      };
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: "Server configuration missing" })
      };
    }

    const response = await fetch(
      `${supabaseUrl}/rest/v1/shared_timer?on_conflict=id`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": supabaseKey,
          "Authorization": `Bearer ${supabaseKey}`,
          "Prefer": "resolution=merge-duplicates,return=minimal"
        },
        body: JSON.stringify({
          id: 1,
          adjusted_time,
          updated_at: new Date().toISOString()
        })
      }
    );

    if (!response.ok) {
      const details = await response.text();
      console.error("Supabase write failed:", response.status, details);

      return {
        statusCode: 502,
        headers,
        body: JSON.stringify({ error: "Could not save shared time" })
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true })
    };
  } catch (error) {
    console.error("Share timer error:", error);

    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: "Invalid request" })
    };
  }
};

