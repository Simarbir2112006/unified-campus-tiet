
document.addEventListener("DOMContentLoaded", () => {
  // Mobile navigation
  const menuBtn = document.querySelector(".menu-btn");
  const navLinks = document.querySelector(".nav-links");
  if(menuBtn && navLinks){
    menuBtn.addEventListener("click", () => navLinks.classList.toggle("open"));
  }

  // Highlight current page
  const current = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach(link => {
    const href = link.getAttribute("href");
    if(href === current) link.classList.add("active");
  });

  // Login modal
  const loginButtons = document.querySelectorAll("[data-login]");
  const modal = document.querySelector("#loginModal");
  const closeModal = document.querySelector(".close");
  loginButtons.forEach(btn => btn.addEventListener("click", () => modal?.classList.add("show")));
  closeModal?.addEventListener("click", () => modal.classList.remove("show"));
  modal?.addEventListener("click", e => {
    if(e.target === modal) modal.classList.remove("show");
  });

  // Photo preview
  document.querySelectorAll('input[type="file"][data-preview]').forEach(input => {
    input.addEventListener("change", () => {
      const preview = document.getElementById(input.dataset.preview);
      const file = input.files?.[0];
      if(!preview || !file) return;
      if(!file.type.startsWith("image/")){
        preview.style.display = "none";
        return;
      }
      preview.src = URL.createObjectURL(file);
      preview.style.display = "block";
    });
  });

  // Generic demo form handler
  document.querySelectorAll("form[data-demo-form]").forEach(form => {
    form.addEventListener("submit", e => {
      e.preventDefault();
      const notice = form.querySelector(".notice");
      if(notice){
        notice.textContent = "Submitted successfully! This is a frontend demo, so the information is not sent to a server.";
        notice.style.display = "block";
      }
      form.reset();
      form.querySelectorAll(".preview").forEach(p => p.style.display = "none");
      setTimeout(() => { if(notice) notice.style.display = "none"; }, 6000);
    });
  });

  // Society filtering
  const societySearch = document.querySelector("#societySearch");
  const societyTabs = document.querySelectorAll("[data-society-filter]");
  const societyCards = document.querySelectorAll("[data-society-card]");
  let societyCategory = "all";

  function filterSocieties(){
    const q = (societySearch?.value || "").toLowerCase();
    let visible = 0;
    societyCards.forEach(card => {
      const text = card.textContent.toLowerCase();
      const cat = card.dataset.category;
      const show = (societyCategory === "all" || cat === societyCategory) && text.includes(q);
      card.style.display = show ? "" : "block";
      if(show) visible++;
    });
    const empty = document.querySelector("#societyEmpty");
    if(empty) empty.style.display = visible ? "none" : "block";
  }
  societySearch?.addEventListener("input", filterSocieties);
  societyTabs.forEach(tab => tab.addEventListener("click", () => {
    societyTabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    societyCategory = tab.dataset.societyFilter;
    filterSocieties();
  }));

  // Professor filtering
  const professorSearch = document.querySelector("#professorSearch");
  const professorCards = document.querySelectorAll("[data-professor-card]");
  professorSearch?.addEventListener("input", () => {
    const q = professorSearch.value.toLowerCase();
    let visible = 0;
    professorCards.forEach(card => {
      const show = card.textContent.toLowerCase().includes(q);
      card.style.display = show ? "" : "block";
      if(show) visible++;
    });
    const empty = document.querySelector("#professorEmpty");
    if(empty) empty.style.display = visible ? "none" : "block";
  });

  // Calendar month filter
  const monthButtons = document.querySelectorAll("[data-month]");
  const events = document.querySelectorAll("[data-event-month]");
  monthButtons.forEach(btn => btn.addEventListener("click", () => {
    monthButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const month = btn.dataset.month;
    events.forEach(event => {
      event.style.display = (month === "all" || event.dataset.eventMonth === month) ? "" : "none";
    });
  }));

  // Map location buttons
  const locationButtons = document.querySelectorAll("[data-location]");
  const mapMessage = document.querySelector("#mapMessage");
  locationButtons.forEach(btn => btn.addEventListener("click", () => {
    locationButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    if(mapMessage) mapMessage.textContent = "Selected location: " + btn.dataset.location;
  }));
});
