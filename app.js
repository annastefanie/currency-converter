const API = "https://api.frankfurter.dev/v1";

const els = {
  amount: document.getElementById("amount"),
  from: document.getElementById("from"),
  to: document.getElementById("to"),
  swap: document.getElementById("swap"),
  convert: document.getElementById("convert"),
  result: document.getElementById("result"),
  info: document.getElementById("info")
};

async function loadCurrencies() {
  const res = await fetch(`${API}/currencies`);
  if (!res.ok) throw new Error("Falha ao carregar moedas");
  const data = await res.json();
  const codes = Object.keys(data).sort();
  for (const code of codes) {
    els.from.add(new Option(`${code} — ${data[code]}`, code));
    els.to.add(new Option(`${code} — ${data[code]}`, code));
  }
  els.from.value = "USD";
  els.to.value = "BRL";
}

async function convert() {
  const amount = Number(els.amount.value);
  const from = els.from.value;
  const to = els.to.value;
  if (!amount || amount < 0) {
    els.result.textContent = "Informe um valor válido.";
    return;
  }
  if (from === to) {
    els.result.textContent = `${amount.toFixed(2)} ${to}`;
    els.info.textContent = "Mesma moeda.";
    return;
  }
  try {
    const res = await fetch(`${API}/latest?base=${from}&symbols=${to}`);
    if (!res.ok) throw new Error("Erro na consulta");
    const data = await res.json();
    const rate = data.rates[to];
    const converted = (amount * rate).toFixed(2);
    els.result.textContent = `${amount} ${from} = ${converted} ${to}`;
    els.info.textContent = `Taxa: 1 ${from} = ${rate} ${to} • Data: ${data.date}`;
  } catch (err) {
    els.result.textContent = "Não foi possível converter agora.";
    els.info.textContent = String(err);
  }
}

els.swap.addEventListener("click", () => {
  [els.from.value, els.to.value] = [els.to.value, els.from.value];
  convert();
});

els.convert.addEventListener("click", convert);

window.addEventListener("DOMContentLoaded", async () => {
  await loadCurrencies();
  convert();
});
