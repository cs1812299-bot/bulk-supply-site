(function () {
  // ===== Utilities =====
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function setInventoryDate() {
    // You can hardcode a date if you want. Keeping it dynamic looks "alive".
    const d = new Date();
    const formatted = d.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
    const el = $("#inventoryDate");
    if (el) el.textContent = formatted;
  }

  function setYear() {
    const el = $("#year");
    if (el) el.textContent = String(new Date().getFullYear());
  }

  // ===== Simple Router (hash-based) =====
  function showPageFromHash() {
    const hash = (window.location.hash || "#home").replace("#", "");
    const pages = $$("[data-page]");
    let found = false;

    pages.forEach((p) => {
      const isMatch = p.id === hash;
      p.hidden = !isMatch;
      if (isMatch) found = true;
    });

    // If unknown hash, fallback to home
    if (!found) {
      window.location.hash = "#home";
      return;
    }

    // Highlight active nav
    const links = $$("[data-route]");
    links.forEach((a) => {
      const target = (a.getAttribute("href") || "").replace("#", "");
      a.classList.toggle("is-active", target === hash);
    });

    // Close mobile menu on navigation
    closeMenu();

    // Scroll to top when switching "pages"
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  // ===== Mobile nav =====
  const navToggle = $("#navToggle");
  const navMenu = $("#navMenu");

  function openMenu() {
    if (!navMenu || !navToggle) return;
    navMenu.classList.add("is-open");
    navToggle.setAttribute("aria-expanded", "true");
  }
  function closeMenu() {
    if (!navMenu || !navToggle) return;
    navMenu.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  }

  if (navToggle) {
    navToggle.addEventListener("click", () => {
      const isOpen = navMenu && navMenu.classList.contains("is-open");
      isOpen ? closeMenu() : openMenu();
    });
  }

  document.addEventListener("click", (e) => {
    // click outside to close menu
    if (!navMenu || !navToggle) return;
    const clickedInside = navMenu.contains(e.target) || navToggle.contains(e.target);
    if (!clickedInside) closeMenu();
  });

  // ===== Form handling (mailto + copy) =====
  const form = $("#quoteForm");
  const formError = $("#formError");
  const formSuccess = $("#formSuccess");
  const copyBtn = $("#copyBtn");

  function clearMessages() {
    if (formError) formError.textContent = "";
    if (formSuccess) formSuccess.textContent = "";
  }

  function getFormData() {
    if (!form) return null;
    const data = Object.fromEntries(new FormData(form).entries());
    return {
      name: (data.name || "").trim(),
      company: (data.company || "").trim(),
      email: (data.email || "").trim(),
      phone: (data.phone || "").trim(),
      material: (data.material || "").trim(),
      quantity: (data.quantity || "").trim(),
      pickup: (data.pickup || "").trim(),
      delivery: (data.delivery || "").trim(),
      notes: (data.notes || "").trim(),
    };
  }

  function validate(data) {
    const required = ["name", "email", "material", "quantity", "delivery"];
    for (const key of required) {
      if (!data[key]) return `Please fill in the required field: ${key}.`;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return "Please enter a valid email address.";
    return null;
  }

  function buildMessage(data) {
    return [
      "QUOTE REQUEST",
      "---------------------------",
      `Name: ${data.name}`,
      `Company: ${data.company || "-"}`,
      `Email: ${data.email}`,
      `Phone: ${data.phone || "-"}`,
      "",
      `Material: ${data.material}`,
      `Quantity: ${data.quantity}`,
      `Pickup/Origin: ${data.pickup || "-"}`,
      `Delivery: ${data.delivery}`,
      "",
      `Notes: ${data.notes || "-"}`,
      "---------------------------",
      "Sent from website quote form.",
    ].join("\n");
  }

  function openMailClient(data) {
    // Replace this with YOUR receiving email
    const toEmail = "sales@yourdomain.com";
    const subject = encodeURIComponent(`Quote Request — ${data.material} (${data.quantity})`);
    const body = encodeURIComponent(buildMessage(data));
    window.location.href = `mailto:${toEmail}?subject=${subject}&body=${body}`;
  }

  async function copyDetailsToClipboard(data) {
    const text = buildMessage(data);
    try {
      await navigator.clipboard.writeText(text);
      if (formSuccess) formSuccess.textContent = "Copied quote details to clipboard.";
    } catch {
      // Fallback: prompt
      window.prompt("Copy the details below:", text);
    }
  }

  if (copyBtn) {
    copyBtn.addEventListener("click", () => {
      clearMessages();
      const data = getFormData();
      if (!data) return;
      const err = validate(data);
      if (err) {
        if (formError) formError.textContent = err;
        return;
      }
      copyDetailsToClipboard(data);
    });
  }

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      clearMessages();
      const data = getFormData();
      if (!data) return;

      const err = validate(data);
      if (err) {
        if (formError) formError.textContent = err;
        return;
      }

      if (formSuccess) formSuccess.textContent = "Opening your email app to send the request…";
      openMailClient(data);
    });
  }

  // ===== Init =====
  window.addEventListener("hashchange", showPageFromHash);
  document.addEventListener("DOMContentLoaded", () => {
    setInventoryDate();
    setYear();
    showPageFromHash();
  });
})();