const PLACEHOLDER_ID = "kongsro-article-placeholder";

/**
 * @param {() => void} onReveal
 */
export function showArticlePlaceholder(onReveal) {
  if (document.getElementById(PLACEHOLDER_ID)) return;

  const main =
    document.querySelector("main, article, [role='main'], .article-body, .article__body") ||
    document.body;

  const targets = [];
  if (main && main !== document.body) {
    targets.push(main);
  } else {
    document.querySelectorAll("article, .article, [class*='article-body']").forEach((el) => {
      targets.push(el);
    });
  }

  targets.forEach((el) => {
    el.classList.add("kongsro-hidden");
    el.setAttribute("data-kongsro", "article");
  });

  const box = document.createElement("div");
  box.id = PLACEHOLDER_ID;
  box.setAttribute("data-kongsro-ui", "1");
  box.style.cssText =
    "max-width:40rem;margin:2rem auto;padding:1.5rem;font-family:system-ui,sans-serif;border:1px solid #ccc;border-radius:8px;";
  box.innerHTML = `
    <p style="margin:0 0 1rem"><strong>Skjult av Kongsro</strong></p>
    <p style="margin:0 0 1rem;color:#444">Denne artikkelen ser ut til å handle om kongelig mediestorm.</p>
    <button type="button" style="padding:0.5rem 1rem;cursor:pointer">Vis likevel</button>
  `;
  const btn = box.querySelector("button");
  btn?.addEventListener("click", () => {
    targets.forEach((el) => {
      el.classList.remove("kongsro-hidden");
      el.removeAttribute("data-kongsro");
    });
    box.remove();
    onReveal?.();
  });

  const insertAt = document.querySelector("main, [role='main']") || document.body;
  insertAt.prepend(box);
}

/**
 * @returns {{ titleText: string, leadText: string }}
 */
export function articleLooksLikeWave() {
  const title = document.querySelector("h1");
  const titleText = (title?.innerText || document.title || "").trim();
  const lead = document.querySelector(
    "[class*='lead'], [class*='ingress'], [class*='standfirst'], .article-lead, p"
  );
  const leadText = (lead?.innerText || "").trim().slice(0, 400);
  return { titleText, leadText };
}
