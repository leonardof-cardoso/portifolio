let menuIcon = document.querySelector("#menu-icon");
let navbar = document.querySelector(".navbar");

window.addEventListener("load", () => {
    const navigationEntry = performance.getEntriesByType("navigation")[0];

    // On browser refresh, clear any hash so the page opens from the top.
    if (navigationEntry && navigationEntry.type === "reload" && window.location.hash) {
        history.replaceState(null, "", window.location.pathname + window.location.search);
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
});

menuIcon.onclick = () => {
    menuIcon.classList.toggle("bx-x");
    navbar.classList.toggle("active");
}
