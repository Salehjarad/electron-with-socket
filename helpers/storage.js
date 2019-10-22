const fs = require("fs");
const path = require("path");

const jsonPath = path.resolve(__dirname, "storage.json");

const toJson = data => {
  return JSON.stringify(data, null, 2);
};

function localStorage() {
  const fileExist = fs.existsSync(jsonPath);
  if (!fileExist) {
    fs.writeFileSync(jsonPath, toJson({ token: "", id: "" }));
  }
  return this;
}

localStorage.prototype.setItem = async (type, item) => {
  try {
    const storage = await fs.createReadStream(jsonPath);
    const storageData = await fs.readFileSync(jsonPath);

    storage.on("open", () => {
      const haveJsonData = fs.readFileSync(jsonPath, "utf8");
      const newData =
        (haveJsonData === "") |
        (haveJsonData === undefined) |
        (haveJsonData === null)
          ? false
          : true;
      if (!newData) {
        return fs.writeFileSync(
          jsonPath,
          toJson({
            token: type === "token" ? item : "",
            id: type === "id" ? item : ""
          })
        );
      }
    });

    const newData = JSON.parse(storageData.toString());
    if (typeof newData[type] !== "undefined" && typeof item !== "undefined") {
      newData[type] = item;
      let newJson = toJson(newData);
      fs.writeFileSync(jsonPath, newJson);
      return;
    }

    const addToData = Object.assign(newData, item);
    fs.writeFileSync(jsonPath, toJson(addToData));
    return;
  } catch (error) {
    return;
  }
};

localStorage.prototype.setMulti = async data => {
  try {
    let newdata = await data;
    await fs.writeFileSync(
      jsonPath,
      toJson({ token: newdata.token, id: newdata.id })
    );
    return;
  } catch (error) {
    console.log(error);
  }
};

localStorage.prototype.getItem = item => {
  const fileExist = fs.existsSync(jsonPath);
  if (!fileExist) {
    fs.writeFileSync(jsonPath, toJson({ token: "", id: "" }));
  }
  const storageData = fs.readFileSync(jsonPath);
  const newData = JSON.parse(storageData.toString());
  return newData[item];
};

module.exports = localStorage;
