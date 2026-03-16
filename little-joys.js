const SUPABASE_URL = "https://urfozryoqwywjnvbrqmt.supabase.co";
// REPLACE THIS with the 'anon public' key from your Dashboard > Settings > API
// It should start with "eyJ..."
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVyZm96cnlvcXd5d2pudmJycW10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1ODA1OTEsImV4cCI6MjA4OTE1NjU5MX0.JJrAavUWi_WISw58LxGSk6g6sAh_GrVJQ_egPDj1JAw";
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let currentMonthIndex = 0; // 0 = March, 1 = April, etc.

async function loadLittleJoys() {
  const container = document.getElementById("forwardList");
  const forwardCount = document.getElementById("forwardCount");

  if (!container) return;

  // 1. Fetch items ONLY for the selected month
  const { data, error } = await supabaseClient
    .from("little_joys")
    .select("*")
    .eq("month_index", currentMonthIndex) // FILTER by month
    .order("id", { ascending: true });

  if (error) {
    console.error("Load error:", error);
    container.innerHTML = "<div class='forward-empty'>Error loading data.</div>";
    return;
  }

  // 2. Update the count text
  if (forwardCount) {
    forwardCount.textContent = data.length === 1 
      ? "1 little thing" 
      : `${data.length} little things`;
  }

  container.innerHTML = "";

  if (!data || data.length === 0) {
    container.innerHTML = "<div class='forward-empty'>Looking for little joys this month... ✨</div>";
    return;
  }

  // 3. Create the HTML for each item
  data.forEach((joy) => {
    const div = document.createElement("div");
    div.className = "forward-item";
    div.innerHTML = `
      <div class="forward-top">
        <div class="forward-icon">♡</div>
        <div class="forward-tag">coming soon</div>
      </div>
      <div class="forward-text">${joy.title}</div>
    `;
    container.appendChild(div);
  });
}

// --- Main Application Logic ---
document.addEventListener("DOMContentLoaded", () => {
  
  // Load the initial list for March (index 0)
  loadLittleJoys();

  // --- A. Handle Month Switching ---
  const monthButtons = document.querySelectorAll(".month-btn");
  
  monthButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      // 1. Update the visual active state
      monthButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      // 2. Update the index variable
      currentMonthIndex = parseInt(btn.dataset.month);

      // 3. Reload the list for the new month
      loadLittleJoys();
    });
  });

  // --- B. Handle Adding New Items ---
  const addGoalBtn = document.getElementById("addGoalBtn");
  const newGoalInput = document.getElementById("newGoalInput");

  // This ensures we only add the listener ONCE
  if (addGoalBtn) {
    addGoalBtn.addEventListener("click", async () => {
      const text = newGoalInput.value.trim();
      if (!text) return;

      // Insert into Supabase with the current month index
      const { error } = await supabaseClient
        .from("little_joys")
        .insert([{ 
          title: text, 
          month_index: currentMonthIndex 
        }]);

      if (error) {
        console.error("Save Error:", error);
        alert("Could not save. Check console (F12).");
      } else {
        newGoalInput.value = ""; // Clear text
        loadLittleJoys(); // Reload list to show new item
      }
    });

    // Allow pressing "Enter" inside the input box
    newGoalInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault(); // Prevent default form behavior
        addGoalBtn.click();
      }
    });
  }
});