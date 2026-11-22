const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const backToTop = document.querySelector(".back-to-top");

window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 10);
}, { passive: true });

backToTop.addEventListener("click", (event) => {
  event.preventDefault();
  window.scrollTo({
    top: 0,
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"
  });
});

menuToggle.addEventListener("click", () => {
  const open = menuToggle.classList.toggle("active");
  navLinks.classList.toggle("open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  document.body.style.overflow = open ? "hidden" : "";
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle.classList.remove("active");
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open menu");
    document.body.style.overflow = "";
  });
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

const form = document.querySelector("#contact-form");
const formStatus = form.querySelector(".form-status");

document.querySelectorAll(".project-media").forEach((projectMedia) => {
  const projectIntro = projectMedia.querySelector(".project-intro");
  const projectVideo = projectMedia.querySelector(".project-video");

  projectIntro.addEventListener("click", async () => {
    projectMedia.classList.add("revealed");
    projectIntro.setAttribute("aria-hidden", "true");

    try {
      await projectVideo.play();
    } catch {
      projectVideo.controls = true;
    }
  });
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const submitButton = form.querySelector("button[type='submit']");

  submitButton.disabled = true;
  formStatus.textContent = "Sending...";

  fetch(form.action, {
    method: "POST",
    body: new FormData(form),
    headers: { Accept: "application/json" }
  })
    .then(async (response) => {
      if (!response.ok) {
        throw new Error("Submission failed");
      }

      form.reset();
      formStatus.textContent = "Message sent successfully.";
    })
    .catch(() => {
      formStatus.textContent = "Unable to send the message. Please try again.";
    })
    .finally(() => {
      submitButton.disabled = false;
    });
});
