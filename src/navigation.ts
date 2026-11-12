const menu = document.querySelector<HTMLDetailsElement>(".mobile-menu");
const summary = menu?.querySelector("summary");

if (menu && summary) {
  menu.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || !menu.open) return;
    event.preventDefault();
    menu.open = false;
    summary.focus();
  });

  menu.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;
    const link = event.target.closest<HTMLAnchorElement>('a[href^="#"]');
    const section = link && document.getElementById(link.hash.slice(1));
    if (!section) return;
    menu.open = false;
    section.focus({ preventScroll: true });
  });

  document.addEventListener("pointerdown", (event) => {
    if (
      menu.open &&
      event.target instanceof Node &&
      !menu.contains(event.target)
    ) {
      if (menu.contains(document.activeElement)) summary.focus();
      menu.open = false;
    }
  });
}
