const glyph = "1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM";

function generateID() {
  let id = "";

  for (let i = 0; i < 12; i++) {
    id += glyph[Math.round(Math.random() * (glyph.length - 1))];
  }

  return id;
}

document.getElementById(
  "transaction-id"
).innerHTML = `Transaction ID: ${generateID()}`;
