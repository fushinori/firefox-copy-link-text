const DOUBLE_TAP_DELAY = 350;
let pending = null;

document.addEventListener(
  "click",
  function (e) {
    const link = e.target.closest("a");
    if (!link) return;

    // Allow modifier-assisted behavior (open in new tab/window, etc.)
    if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.button !== 0) {
      return;
    }

    const href = link.href;
    const openInNewTab = link.target && link.target.toLowerCase() === "_blank";

    if (e.detail === 1) {
      // Potential single-tap: Prevent navigation now and wait for a possible second tap
      e.preventDefault();
      e.stopImmediatePropagation();

      // Clear any previous pending (shouldn't normally exist)
      if (pending) {
        clearTimeout(pending.timer);
        pending = null;
      }

      const timer = setTimeout(() => {
        // No second tap -> perform navigation as a normal single tap
        pending = null;

        if (!href) return;

        if (openInNewTab) {
          // Respect target=_blank
          window.open(href, "_blank");
        } else {
          // Normal navigation
          window.location.href = href;
        }
      }, DOUBLE_TAP_DELAY);

      pending = { timer, link, href, openInNewTab };
      return;
    }

    if (e.detail >= 2) {
      // Second tap happened within DOUBLE_TAP_DELAY -> treat as double-tap
      // Cancel the pending single-tap navigation
      if (pending) {
        clearTimeout(pending.timer);
        pending = null;
      }

      // Prevent any navigation / other handlers
      e.preventDefault();
      e.stopImmediatePropagation();

      // Do the copy
      const text = link.textContent.trim();
      navigator.clipboard.writeText(text).catch(() => {
        showToast("Failed to copy link text.");
      });

      showToast("Successfully copied link text!");
      return;
    }
  },
  true, // capture
);

function showToast(message) {
  const toast = document.createElement("div");
  toast.textContent = message;

  toast.setAttribute("role", "status");
  toast.setAttribute("aria-live", "polite");

  Object.assign(toast.style, {
    position: "fixed",
    bottom: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    background: "rgba(0,0,0,0.85)",
    color: "white",
    padding: "10px 16px",
    borderRadius: "6px",
    fontSize: "14px",
    zIndex: 99999, // high zindex so it will mostly always be on top
    opacity: "0",
    transition: "opacity 0.25s ease",
    pointerEvents: "none",
  });

  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = "1";
  });

  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 300);
  }, 1200);
}
