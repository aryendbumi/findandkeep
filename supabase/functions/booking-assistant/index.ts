import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const tools = [
  {
    type: "function",
    function: {
      name: "search_available_rooms",
      description:
        "Search for available meeting rooms on a given date and time range. Returns rooms that have no conflicting bookings.",
      parameters: {
        type: "object",
        properties: {
          date: {
            type: "string",
            description: "The date in YYYY-MM-DD format",
          },
          start_time: {
            type: "string",
            description: "Start time in HH:MM 24-hour format",
          },
          end_time: {
            type: "string",
            description: "End time in HH:MM 24-hour format",
          },
          min_capacity: {
            type: "number",
            description: "Minimum room capacity needed",
          },
        },
        required: ["date", "start_time", "end_time"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "create_booking",
      description: "Create a booking for a specific room.",
      parameters: {
        type: "object",
        properties: {
          room_name: { type: "string", description: "Name of the room to book" },
          date: { type: "string", description: "Date in YYYY-MM-DD format" },
          start_time: { type: "string", description: "Start time HH:MM" },
          end_time: { type: "string", description: "End time HH:MM" },
          title: { type: "string", description: "Meeting title/agenda" },
          priority: {
            type: "string",
            enum: ["low", "medium", "high"],
            description: "Priority level",
          },
        },
        required: ["room_name", "date", "start_time", "end_time", "title", "priority"],
        additionalProperties: false,
      },
    },
  },
];

async function handleToolCall(
  fnName: string,
  args: Record<string, unknown>,
  supabase: ReturnType<typeof createClient>,
  userId: string
) {
  if (fnName === "search_available_rooms") {
    const { date, start_time, end_time, min_capacity } = args as {
      date: string;
      start_time: string;
      end_time: string;
      min_capacity?: number;
    };

    const startDt = `${date}T${start_time}:00`;
    const endDt = `${date}T${end_time}:00`;

    // Get all active rooms
    let roomQuery = supabase.from("rooms").select("*").eq("is_active", true);
    if (min_capacity) roomQuery = roomQuery.gte("capacity", min_capacity);
    const { data: rooms, error: roomErr } = await roomQuery;
    if (roomErr) return JSON.stringify({ error: roomErr.message });

    // Get bookings that overlap with the requested time
    const { data: conflicts } = await supabase
      .from("bookings")
      .select("room_id")
      .gte("end_time", startDt)
      .lte("start_time", endDt);

    const conflictIds = new Set((conflicts ?? []).map((c: { room_id: number }) => c.room_id));
    const available = (rooms ?? []).filter((r: { id: number }) => !conflictIds.has(r.id));

    if (available.length === 0) {
      return JSON.stringify({ message: "No available rooms found for the requested time slot." });
    }

    return JSON.stringify({
      available_rooms: available.map((r: { name: string; capacity: number; location: string | null; amenities: string[] | null }) => ({
        name: r.name,
        capacity: r.capacity,
        location: r.location,
        amenities: r.amenities,
      })),
    });
  }

  if (fnName === "create_booking") {
    const { room_name, date, start_time, end_time, title, priority } = args as {
      room_name: string;
      date: string;
      start_time: string;
      end_time: string;
      title: string;
      priority: string;
    };

    const { data: room } = await supabase
      .from("rooms")
      .select("id")
      .eq("name", room_name)
      .maybeSingle();

    if (!room) return JSON.stringify({ error: `Room "${room_name}" not found.` });

    const startDt = new Date(`${date}T${start_time}:00`).toISOString();
    const endDt = new Date(`${date}T${end_time}:00`).toISOString();

    const { error } = await supabase.from("bookings").insert({
      room_id: room.id,
      user_id: userId,
      title,
      start_time: startDt,
      end_time: endDt,
      priority,
    });

    if (error) return JSON.stringify({ error: error.message });
    return JSON.stringify({ success: true, message: `Successfully booked "${room_name}" on ${date} from ${start_time} to ${end_time}.` });
  }

  return JSON.stringify({ error: "Unknown function" });
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_PUBLISHABLE_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const today = new Date().toISOString().split("T")[0];

    const systemPrompt = `You are a helpful meeting room booking assistant for an internal tool called "Find 'N Keep". Today is ${today}.

Your job is to help users find and book available meeting rooms through natural conversation. Guide them step by step:

1. Ask what DATE they need the room (suggest today or upcoming dates)
2. Ask for the TIME RANGE (start and end time)
3. Ask how many ATTENDEES (to filter by capacity)
4. Search for available rooms and present the options clearly
5. Ask which room they'd like to book
6. Ask for the MEETING TITLE/AGENDA
7. Ask for the PRIORITY (low, medium, high)
8. Confirm all details before booking

Important rules:
- Be concise and friendly
- Present room options in a clear list with capacity, location, and amenities
- Always confirm before creating a booking
- If no rooms are available, suggest alternative times
- Use the tools provided to search rooms and create bookings
- Format responses nicely with markdown`;

    let aiMessages = [
      { role: "system", content: systemPrompt },
      ...messages,
    ];

    // Agentic loop: keep calling AI until no more tool calls
    const MAX_ITERATIONS = 5;
    for (let i = 0; i < MAX_ITERATIONS; i++) {
      const aiResponse = await fetch(
        "https://ai.gateway.lovable.dev/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-3-flash-preview",
            messages: aiMessages,
            tools,
            stream: false,
          }),
        }
      );

      if (!aiResponse.ok) {
        const status = aiResponse.status;
        if (status === 429) {
          return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
            status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        if (status === 402) {
          return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits." }), {
            status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        const errText = await aiResponse.text();
        console.error("AI error:", status, errText);
        throw new Error("AI gateway error");
      }

      const data = await aiResponse.json();
      const choice = data.choices[0];

      if (choice.finish_reason === "tool_calls" || choice.message.tool_calls?.length) {
        // Add assistant message with tool calls
        aiMessages.push(choice.message);

        // Execute each tool call
        for (const tc of choice.message.tool_calls) {
          const result = await handleToolCall(
            tc.function.name,
            JSON.parse(tc.function.arguments),
            supabase,
            user.id
          );
          aiMessages.push({
            role: "tool",
            tool_call_id: tc.id,
            content: result,
          });
        }
        // Continue loop to let AI process tool results
        continue;
      }

      // No tool calls — return the final text response
      return new Response(
        JSON.stringify({ content: choice.message.content }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ content: "I had trouble processing your request. Please try again." }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("booking-assistant error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
