const dynamicFields = document.getElementsByClassName("dynamic");

const urlParams = new URLSearchParams(window.location.search);

for (let i = 0; i < dynamicFields.length; i++) {
  const el = dynamicFields[i];
  const query = el.dataset.query;

  el.innerHTML = urlParams.get(query);
}

const popupRoot = document.getElementById("popup-root");
const popupBackdrop = document.getElementById("popup-backdrop");
const selectContact = document.getElementById("select-contact");
const selectContactText = document.getElementById("select-contact-text");

function createPopUpItem(text, onClick) {
  const item = document.createElement("div");
  item.innerHTML = text;
  item.onclick = () => {
    selectContactText.innerHTML = text;
    onClick();
  };
  item.className = "adr-order-popup-content-item";
  return item;
}

const createPopUp = () => {
  const list = document.createElement("div");
  list.className = "adr-order-popup-content";

  targetRect = selectContact.getBoundingClientRect();

  list.style["left"] = `${targetRect.x}px`;
  list.style["top"] = `${targetRect.y + targetRect.height}px`;
  list.style["width"] = `${targetRect.width}px`;

  const onClose = () => {
    popupRoot.style["visibility"] = "hidden";
    popupRoot.removeChild(list);
    popupBackdrop.onclick = null;
  };

  list.appendChild(createPopUpItem("Email", onClose));
  list.appendChild(createPopUpItem("Phone", onClose));

  popupBackdrop.onclick = onClose;

  popupRoot.appendChild(list);

  popupRoot.style["visibility"] = "visible";
};

selectContact.onclick = createPopUp;
