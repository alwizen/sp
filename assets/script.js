(function () {
  "use strict";

  var header = document.getElementById("header");
  var toggle = document.querySelector(".nav-toggle");
  var navLinks = document.getElementById("nav-links");
  var year = document.getElementById("year");

  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  function closeNav() {
    if (!header) return;
    header.classList.remove("nav-open");
    if (toggle) {
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Buka menu");
    }
  }

  if (toggle && header) {
    toggle.addEventListener("click", function () {
      var open = header.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Tutup menu" : "Buka menu");
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeNav();
    });

    if (navLinks) {
      navLinks.addEventListener("click", function (event) {
        if (event.target.closest("a")) closeNav();
      });
    }

    document.addEventListener("click", function (event) {
      if (!header.classList.contains("nav-open")) return;
      if (!header.contains(event.target)) closeNav();
    });
  }

  function onScroll() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  }

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  var details = document.querySelectorAll(".faq-list details");
  details.forEach(function (item) {
    item.addEventListener("toggle", function () {
      if (!item.open) return;
      details.forEach(function (other) {
        if (other !== item) other.open = false;
      });
    });
  });

  var revealItems = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && revealItems.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    revealItems.forEach(function (item, index) {
      item.style.transitionDelay = (index % 4) * 70 + "ms";
      observer.observe(item);
    });
  } else {
    revealItems.forEach(function (item) {
      item.classList.add("is-visible");
    });
  }

  var form = document.getElementById("brief-form");
  if (form) {
    var note = form.querySelector(".form-note");
    var phone = "6285701366698";

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var name = form.querySelector("#name");
      var project = form.querySelector("#project");
      var message = form.querySelector("#message");
      var fields = [name, project, message];
      var invalid = null;

      fields.forEach(function (field) {
        if (!field) return;
        field.removeAttribute("aria-invalid");
        if (!field.value.trim()) {
          field.setAttribute("aria-invalid", "true");
          if (!invalid) invalid = field;
        }
      });

      if (invalid) {
        if (note) {
          note.textContent = "Lengkapi nama, jenis proyek, dan cerita singkat dulu ya.";
          note.classList.add("is-error");
        }
        invalid.focus();
        return;
      }

      var text =
        "Halo Solusi Project, saya " + name.value.trim() + ".\n\n" +
        "Jenis proyek: " + project.value + "\n" +
        "Cerita: " + message.value.trim() + "\n\n" +
        "Mohon info langkah selanjutnya. Terima kasih.";

      if (note) {
        note.textContent = "Membuka WhatsApp…";
        note.classList.remove("is-error");
      }

      window.open("https://wa.me/" + phone + "?text=" + encodeURIComponent(text), "_blank", "noopener");
    });

    form.addEventListener("input", function (event) {
      var field = event.target;
      if (field.getAttribute && field.getAttribute("aria-invalid") === "true" && field.value.trim()) {
        field.removeAttribute("aria-invalid");
      }
    });
  }
})();
