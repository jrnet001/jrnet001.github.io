const ENDPOINT = "https://script.google.com/macros/s/AKfycbyOsUhsY9bySFoTKq4ymcVPBwgUNFcz0uX5SCcKxLoCP2nYoolu88_B3-zr9xLg_FXuDA/exec";

const form = document.querySelector("#contact-form");
const success = document.querySelector("#form-success");
const error = document.querySelector("#form-error");
const sendAnother = document.querySelector("#send-another");
const year = document.querySelector("#year");

if (year) year.textContent = String(new Date().getFullYear());

form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const button = form.querySelector('button[type="submit"]');
  const data = new FormData(form);

  if (data.get("website")) {
    form.hidden = true;
    success.hidden = false;
    return;
  }

  button.disabled = true;
  button.textContent = "Sending…";
  error.hidden = true;

  try {
    const body = new URLSearchParams();
    data.forEach((value, key) => body.append(key, String(value)));
    body.set("name", `${String(data.get("first_name") || "").trim()} ${String(data.get("last_name") || "").trim()}`.trim());

    const pageUrl = new URL(window.location.href);
    pageUrl.hash = "";
    body.set("page_url", pageUrl.toString());
    body.set("referrer", document.referrer || "");
    body.set("utm_source", pageUrl.searchParams.get("utm_source") || "");
    body.set("utm_medium", pageUrl.searchParams.get("utm_medium") || "");
    body.set("utm_campaign", pageUrl.searchParams.get("utm_campaign") || "");

    await fetch(ENDPOINT, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body
    });

    form.reset();
    form.hidden = true;
    success.hidden = false;
    window.gtag?.("event", "generate_lead", { form_name: "viomo_contact" });
  } catch {
    error.hidden = false;
  } finally {
    button.disabled = false;
    button.textContent = "Send inquiry ↗";
  }
});

sendAnother?.addEventListener("click", () => {
  success.hidden = true;
  form.hidden = false;
  form.querySelector("input")?.focus();
});
