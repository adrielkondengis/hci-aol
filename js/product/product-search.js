// constants

const clickLink = "./car-page.html";

// system

const rawData = [
  {
    brand: "BMW",
    model: "M5",
    year: "2023",
  },
  {
    brand: "Toyota",
    model: "Avanza",
    year: "2023",
  },
  {
    brand: "Jeep",
    model: "Wrangler Unlimited",
    year: "2021",
  },
  {
    brand: "Honda",
    model: "Mobilio",
    year: "2022",
  },
  {
    brand: "Honda",
    model: "Brio",
    year: "2019",
  },
  {
    brand: "Hyundai",
    model: "IONIQ 5",
    year: "2022",
  },
];

let data = [];

let list = [];

let inputValue = "";

let usingEmptyElement = false;

const listContainerElement = document.getElementById("adr-product-listing");

const createCarElement = (carInfo) => {
  const container = document.createElement("div");

  container.className = "adr-product-listing-car";

  const image = document.createElement("img");

  image.src = `./assets/images/car/${carInfo.id}.png`;

  container.appendChild(image);

  const name = document.createElement("span");

  name.innerHTML = carInfo["model"];

  container.appendChild(name);

  const info = document.createElement("a");

  info.innerHTML = "Click for details";

  info.href = clickLink;

  container.appendChild(info);

  container.dataset["id"] = carInfo["id"];

  return container;
};

const createEmptyElement = () => {
  const container = document.createElement("div");

  container.id = "adr-product-listing-none";

  const text = document.createElement("span");

  text.innerHTML = "Nothing Found...";

  container.appendChild(text);

  return container;
};

const syncList = () => {
  const childMap = {};

  for (let i = 0; i < listContainerElement.children.length; i++) {
    const child = listContainerElement.children[i];

    if (child.dataset["id"]) {
      childMap[child.dataset["id"]] = child;
    }
  }

  for (let i = 0; i < list.length; i++) {
    const car = list[i];

    if (car["id"] in childMap) {
      listContainerElement.appendChild(childMap[car["id"]]);
      delete childMap[car["id"]];
    } else {
      listContainerElement.appendChild(createCarElement(car));
    }
  }

  Object.values(childMap).forEach((child) =>
    listContainerElement.removeChild(child)
  );

  if (list.length === 0 && !usingEmptyElement) {
    listContainerElement.appendChild(createEmptyElement());
    usingEmptyElement = true;
  } else if (list.length > 0 && usingEmptyElement) {
    listContainerElement.removeChild(
      document.getElementById("adr-product-listing-none")
    );
    usingEmptyElement = false;
  }
};

// search

const levenshteinDistance = (s, t) => {
  if (!s.length) return t.length;
  if (!t.length) return s.length;
  const arr = [];
  for (let i = 0; i <= t.length; i++) {
    arr[i] = [i];
    for (let j = 1; j <= s.length; j++) {
      arr[i][j] =
        i === 0
          ? j
          : Math.min(
              arr[i - 1][j] + 1,
              arr[i][j - 1] + 1,
              arr[i - 1][j - 1] + (s[j - 1] === t[i - 1] ? 0 : 1)
            );
    }
  }
  return arr[t.length][s.length];
};

function getMinDistance(stringArray1, stringArray2) {
  let distance = 1000;

  for (let i = 0; i < stringArray1.length; i++) {
    const searchString1 = stringArray1[i];

    for (let j = 0; j < stringArray2.length; j++) {
      const searchString2 = stringArray2[j];

      const currentDistance = levenshteinDistance(searchString1, searchString2);

      if (currentDistance < distance) distance = currentDistance;
    }
  }

  return distance;
}

const updateList = () => {
  const normalizedInputValues = inputValue.trim().toLowerCase().split(" ");

  let newList = data.map((value) => ({
    ...value,
    distance: getMinDistance(value["searchElements"], normalizedInputValues),
  }));

  newList = newList.filter((value) => value["distance"] <= 4);

  newList = newList.sort((a, b) => a["distance"] - b["distance"]);

  list = newList;

  syncList();
};

// database

function getCarSearchElements(value) {
  return [
    ...value["brand"].toLowerCase().split(" "),
    ...value["model"].toLowerCase().split(" "),
    ...value["year".toLowerCase()].split(" "),
  ];
}

function getCarId(value) {
  const elements = [];
  elements.push(...value["brand"].toLowerCase().split(" "));
  elements.push(...value["model"].toLowerCase().split(" "));
  elements.push(...value["year"].toLowerCase().split(" "));
  return elements.join("-");
}

function parseDatabase(value) {
  const parsedData = [];

  for (let i = 0; i < value.length; i++) {
    const carInfo = value[i];

    parsedData.push({
      ...carInfo,
      id: getCarId(carInfo),
      searchElements: getCarSearchElements(carInfo),
    });
  }

  return parsedData;
}

async function getDatabase() {
  try {
    const response = await fetch("./database/car.json");

    data = parseDatabase(await response.json());
  } catch (error) {
    data = parseDatabase(rawData);
  }

  updateList();
}

getDatabase();

// input

const setInputValue = (value) => {
  inputValue = value;
  updateList();
};

const onInputChange = (value) => {
  setInputValue(value);
};

const inputElement = document.getElementById("adr-product-search-bar-input");

inputElement.addEventListener("input", (ev) => onInputChange(ev.target.value));
