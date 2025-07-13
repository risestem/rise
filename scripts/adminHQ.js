// Initial curriculum data
let curriculum = {
  sections: [
    {
      id: "coding",
      name: "Coding",
      days: [
        {
          id: "day1",
          title: "Day 1 - Python Intro",
          pdf: "",
          ppt: ""
        }
      ]
    },
    {
      id: "engineering",
      name: "Engineering",
      days: [
        {
          id: "day1",
          title: "Day 1 - Intro to Engineering",
          pdf: "",
          ppt: ""
        }
      ]
    }
  ]
};

const adminDiv = document.getElementById('admin-curriculum');
const addSectionBtn = document.getElementById('add-section-btn');
const downloadJsonBtn = document.getElementById('download-json-btn');
const jsonPreview = document.getElementById('json-preview');

// Helper to generate unique IDs
function uniqueId(prefix) {
  return prefix + Math.random().toString(36).substr(2, 6);
}

// Render admin curriculum editor
function renderCurriculum() {
  adminDiv.innerHTML = '';
  curriculum.sections.forEach((section, sectionIdx) => {
    // Section panel
    const sectionPanel = document.createElement('div');
    sectionPanel.className = `mb-8 border rounded-lg p-6 bg-gray-50 shadow`;

    // Section header (name + rename/delete)
    sectionPanel.innerHTML = `
      <div class="flex flex-col md:flex-row md:items-center justify-between mb-3">
        <div class="flex items-center gap-2">
          <input type="text" value="${section.name}" class="section-name border rounded px-2 py-1 font-bold text-purple-950 text-xl w-48" data-section="${sectionIdx}" />
          <button class="rename-section-btn text-gray-500 hover:text-purple-950" title="Rename Section" data-section="${sectionIdx}">
            <svg width="20" height="20" fill="none" stroke="currentColor"><path d="M4 13V16H7L16 7L13 4L4 13Z" stroke-width="2"/></svg>
          </button>
        </div>
        <button class="delete-section-btn text-red-600 hover:bg-red-100 px-3 py-1 rounded transition" data-section="${sectionIdx}">
          Delete Section
        </button>
      </div>
      <h2 class="text-lg font-semibold mb-4 text-purple-900">${section.name} Curriculum Days</h2>
      <div class="days-list mb-4"></div>
      <button class="add-day-btn bg-purple-950 text-white px-4 py-1 rounded font-bold transition hover:scale-105" data-section="${sectionIdx}">
        Add New Day
      </button>
    `;

    // Days list
    const daysList = sectionPanel.querySelector('.days-list');
    section.days.forEach((day, dayIdx) => {
      const dayDiv = document.createElement('div');
      dayDiv.className = "mb-3 p-4 rounded border bg-white shadow-sm";
      dayDiv.innerHTML = `
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
          <input type="text" value="${day.title}" class="day-title border rounded px-2 py-1 w-full font-medium text-purple-900" data-section="${sectionIdx}" data-day="${dayIdx}" />
          <button class="delete-day-btn text-red-600 hover:bg-red-100 px-3 py-1 rounded transition" data-section="${sectionIdx}" data-day="${dayIdx}">
            Delete Day
          </button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
          <label class="block text-gray-600">PDF Link:
            <input type="text" value="${day.pdf}" class="day-pdf border rounded px-2 py-1 w-full" data-section="${sectionIdx}" data-day="${dayIdx}" />
          </label>
          <label class="block text-gray-600">PPT Link:
            <input type="text" value="${day.ppt}" class="day-ppt border rounded px-2 py-1 w-full" data-section="${sectionIdx}" data-day="${dayIdx}" />
          </label>
        </div>
      `;
      daysList.appendChild(dayDiv);
    });

    adminDiv.appendChild(sectionPanel);
  });

  // Add all event listeners after rendering
  addListeners();
}

// Add listeners for all controls
function addListeners() {
  // Section name input
  document.querySelectorAll('.section-name').forEach(input => {
    input.addEventListener('input', function() {
      const idx = this.dataset.section;
      curriculum.sections[idx].name = this.value;
      // Update section heading
      renderCurriculum();
    });
  });

  // Rename Section (optional: just input field for now)

  // Delete Section
  document.querySelectorAll('.delete-section-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const idx = this.dataset.section;
      if (confirm('Delete this section and all its days?')) {
        curriculum.sections.splice(idx, 1);
        renderCurriculum();
      }
    });
  });

  // Add Day
  document.querySelectorAll('.add-day-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const idx = this.dataset.section;
      curriculum.sections[idx].days.push({
        id: uniqueId('day'),
        title: `Day ${curriculum.sections[idx].days.length + 1}`,
        pdf: "",
        ppt: ""
      });
      renderCurriculum();
    });
  });

  // Day title input
  document.querySelectorAll('.day-title').forEach(input => {
    input.addEventListener('input', function() {
      const sIdx = this.dataset.section;
      const dIdx = this.dataset.day;
      curriculum.sections[sIdx].days[dIdx].title = this.value;
    });
  });

  // Day PDF input
  document.querySelectorAll('.day-pdf').forEach(input => {
    input.addEventListener('input', function() {
      const sIdx = this.dataset.section;
      const dIdx = this.dataset.day;
      curriculum.sections[sIdx].days[dIdx].pdf = this.value;
    });
  });

  // Day PPT input
  document.querySelectorAll('.day-ppt').forEach(input => {
    input.addEventListener('input', function() {
      const sIdx = this.dataset.section;
      const dIdx = this.dataset.day;
      curriculum.sections[sIdx].days[dIdx].ppt = this.value;
    });
  });

  // Delete Day
  document.querySelectorAll('.delete-day-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const sIdx = this.dataset.section;
      const dIdx = this.dataset.day;
      if (confirm('Delete this day?')) {
        curriculum.sections[sIdx].days.splice(dIdx, 1);
        renderCurriculum();
      }
    });
  });
}

// Add Section
addSectionBtn.addEventListener('click', () => {
  const sectionName = prompt('Section name (e.g. Coding, Engineering, Science):');
  if (!sectionName) return;
  curriculum.sections.push({
    id: uniqueId('section'),
    name: sectionName,
    days: []
  });
  renderCurriculum();
});

// Download JSON
downloadJsonBtn.addEventListener('click', () => {
  const jsonStr = JSON.stringify(curriculum, null, 2);
  // Show preview
  jsonPreview.classList.remove('hidden');
  jsonPreview.textContent = jsonStr;

  // Download as file
  const blob = new Blob([jsonStr], {type: "application/json"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "curriculum.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});

// Initial render
renderCurriculum();
