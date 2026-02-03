const body = document.body;
const sidebar = document.getElementById("sidebar");
const sidebarToggle = document.getElementById("sidebarToggle");
const mobileMenu = document.getElementById("mobileMenu");
const themeToggle = document.getElementById("themeToggle");
const preloader = document.getElementById("preloader");
const backToTop = document.getElementById("backToTop");
const typingText = document.getElementById("typingText");
const contactForm = document.getElementById("contactForm");
const contactStatus = document.getElementById("contactStatus");

const navLinks = Array.from(document.querySelectorAll(".sidebar__link"));
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

/* Theme Toggle ------------------------------------------------------------ */
const THEME_KEY = "sneha-theme";

const setTheme = (mode) => {
  body.setAttribute("data-theme", mode);
  localStorage.setItem(THEME_KEY, mode);
  const icon = mode === "dark" ? "fa-sun" : "fa-moon";
  themeToggle.innerHTML = `<i class="fas ${icon}"></i>`;
};

const initTheme = () => {
  const storedTheme = localStorage.getItem(THEME_KEY);
  if (storedTheme) {
    setTheme(storedTheme);
    return;
  }
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  setTheme(prefersDark ? "dark" : "light");
};

themeToggle.addEventListener("click", () => {
  const current = body.getAttribute("data-theme") === "dark" ? "dark" : "light";
  setTheme(current === "dark" ? "light" : "dark");
});

initTheme();

/* Preloader --------------------------------------------------------------- */
window.addEventListener("load", () => {
  setTimeout(() => {
    preloader?.classList.add("hidden");
  }, 600);
});

/* Sidebar Toggle --------------------------------------------------------- */
const closeSidebar = () => sidebar.classList.remove("open");

sidebarToggle?.addEventListener("click", () => {
  sidebar.classList.toggle("open");
});

mobileMenu?.addEventListener("click", () => {
  sidebar.classList.toggle("open");
});

navLinks.forEach((link) =>
  link.addEventListener("click", () => {
    if (window.innerWidth <= 768) {
      closeSidebar();
    }
  })
);

/* Smooth Scroll Offset --------------------------------------------------- */
navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");
    const targetEl = document.querySelector(targetId);
    if (!targetEl) return;
    event.preventDefault();
    const yOffset = -64;
    const y = targetEl.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: y, behavior: "smooth" });
  });
});

/* Scroll Spy ------------------------------------------------------------- */
const observerOptions = {
  root: null,
  rootMargin: "-40% 0px -40% 0px",
  threshold: 0,
};

const activeLinkObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    const id = entry.target.getAttribute("id");
    const relatedLink = navLinks.find((link) => link.getAttribute("href") === `#${id}`);
    if (!relatedLink) return;
    if (entry.isIntersecting) {
      navLinks.forEach((link) => link.classList.remove("active"));
      relatedLink.classList.add("active");
    }
  });
}, observerOptions);

sections.forEach((section) => section && activeLinkObserver.observe(section));

/* Scroll Reveal ---------------------------------------------------------- */
const revealElements = Array.from(document.querySelectorAll(".reveal, .section"));

const revealObserver = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        if (entry.target.classList.contains("skill-card")) {
          animateSkillBar(entry.target);
        }
        obs.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.2,
    rootMargin: "0px 0px -50px 0px",
  }
);

revealElements.forEach((el) => revealObserver.observe(el));

const animateSkillBar = (card) => {
  const level = Number(card.dataset.level || 0);
  const barFill = card.querySelector(".skill-bar span");
  requestAnimationFrame(() => {
    barFill.style.width = `${level}%`;
  });
};

document.querySelectorAll(".skill-card").forEach((card) => {
  revealObserver.observe(card);
});

/* Typing Effect ---------------------------------------------------------- */
const typingPhrases = ["Front-End Developer", "UI Engineer", "Creative Coder"];
let typingPhraseIndex = 0;
let typingCharIndex = 0;
let typingBackspace = false;

const typeLoop = () => {
  const currentPhrase = typingPhrases[typingPhraseIndex];
  const currentText = typingText.textContent;

  if (!typingBackspace) {
    typingText.textContent = currentPhrase.slice(0, typingCharIndex + 1);
    typingCharIndex += 1;
    if (typingCharIndex === currentPhrase.length) {
      typingBackspace = true;
      setTimeout(typeLoop, 1600);
      return;
    }
  } else {
    typingText.textContent = currentPhrase.slice(0, typingCharIndex - 1);
    typingCharIndex -= 1;
    if (typingCharIndex === 0) {
      typingBackspace = false;
      typingPhraseIndex = (typingPhraseIndex + 1) % typingPhrases.length;
    }
  }

  const delay = typingBackspace ? 70 : 120;
  setTimeout(typeLoop, delay);
};

if (typingText) {
  typingText.textContent = "";
  typeLoop();
}

/* Back to Top ------------------------------------------------------------ */
window.addEventListener("scroll", () => {
  if (window.scrollY > 420) {
    backToTop.classList.add("visible");
  } else {
    backToTop.classList.remove("visible");
  }
});

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

/* Contact Form ----------------------------------------------------------- */
contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  contactStatus.textContent = "Sending...";

  setTimeout(() => {
    contactStatus.textContent = "Thanks for reaching out! I’ll get back to you soon.";
    contactForm.reset();
  }, 1000);
});

/* Responsive Helpers ----------------------------------------------------- */
window.addEventListener("resize", () => {
  if (window.innerWidth > 768) {
    closeSidebar();
  }
});

const scrollProgress = document.getElementById("scrollProgress");

window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY;
  const docHeight =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;

  const progress = (scrollTop / docHeight) * 100;
  scrollProgress.style.width = `${progress}%`;
});
const hero = document.querySelector(".hero");

window.addEventListener("scroll", () => {
  if (window.innerWidth <= 768) {
    hero.classList.toggle("scrolled", window.scrollY > 10);
  }
});
