document.addEventListener("DOMContentLoaded", () => {
 const notice = document.createElement("div");
notice.className = "item-notice";
notice.innerHTML = `
  <span class="notice-text">
    The item database is incomplete. If you'd like to help add information 
    (price, location, requirements, etc.), DM me on Discord: 
    <em>velau</em>.
  </span>
  <button class="notice-close">&times;</button>
`;

const header = document.querySelector("header");
header?.insertAdjacentElement("afterend", notice);

const closeBtn = notice.querySelector(".notice-close");
closeBtn.addEventListener("click", () => {
  notice.style.display = "none";
});
  fetch("items_prefilled.json")
    .then(r => r.json())
    .then(items => {
      const byId = new Map(items.map(item => [String(item.id), item]));

      document.querySelectorAll(".item-card").forEach(card => {
        const idText = card.querySelector(".item-id")?.textContent ?? "";
        const idMatch = idText.match(/\d+/);
        if (!idMatch) return;

        const id = idMatch[0].replace(/^0+/, ''); // remove leading zeros
        const data = byId.get(id);
        if (!data) return;

        if (card.querySelector(".item-details")) return;

        const details = document.createElement("div");
        details.className = "item-details";

        const addLine = (label, value) => {
          const v = String(value ?? "").trim();
          if (!v) return "";
          return `<div class="item-detail"><strong>${label}:</strong> ${v}</div>`;
        };

        details.innerHTML = `
          ${addLine("Price", data.price)}
          ${addLine("Requirements", data.requirements)}
          ${addLine("Location", data.location)}
        `;

        const btn = document.createElement("button");
        btn.className = "item-toggle";
        btn.textContent = "More info";

        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          const open = card.classList.toggle("expanded");
          btn.textContent = open ? "Hide info" : "More info";
        });

        card.appendChild(btn);
        card.appendChild(details);
      });
    })
    .catch(console.error);
});