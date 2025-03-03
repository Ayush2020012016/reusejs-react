import fs from "node:fs";

const componentsPath = "./components";
const devAppsPath = "./development";
const pathToPackage = "./docs/package.json";

const updatePackageJsonWith = (updatedDependencies) => {
  fs.readFile(pathToPackage, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading package.json:", err);
      return;
    }
    try {
      const packageJson = JSON.parse(data);
      packageJson.dependencies = {
        ...packageJson.dependencies,
        ...updatedDependencies,
      };

      const updatedPackageJson = JSON.stringify(packageJson, null, 2);
      fs.writeFile(pathToPackage, updatedPackageJson + "\n", "utf8", (err) => {
        if (err) {
          console.error("Error writing package.json:", err);
          return;
        }
      });
    } catch (error) {
      console.error("Error parsing package.json:", error);
    }
  });
};

const getDevAppsMergedDependencies = async () => {
  const devappList = fs.readdirSync(devAppsPath);
  const devappPaths = devappList.map(
    (app) => devAppsPath + "/" + app + "/package.json"
  );
  const promises = devappPaths.map((path) => getDependencyObject(path));
  try {
    const dependenciesList = await Promise.all(promises);
    const mergedDependencies = dependenciesList.reduce(
      (merged, dependencies) => ({ ...merged, ...dependencies }),
      {}
    );
    return mergedDependencies;
  } catch (error) {
    console.error("Error fetching dependencies:", error);
  }
};

const getDependencyObject = (path) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, "utf8", (err, data) => {
      if (err) {
        console.error("Error reading package.json:", err);
        reject(err);
        return;
      }
      try {
        const packageJson = JSON.parse(data);
        resolve(packageJson.dependencies);
      } catch (error) {
        console.error("Error parsing package.json:", error);
        reject(error);
      }
    });
  });
};

const getComponentAsDependenciesObject = () => {
  const componnets = fs.readdirSync(componentsPath);
  const packages = {};
  componnets.forEach(
    (comp) => (packages["@locoworks/reusejs-react-" + comp] = "*")
  );
  return packages;
};

const updatePackages = async () => {
  const val = await getDevAppsMergedDependencies();
  const comps = getComponentAsDependenciesObject();
  updatePackageJsonWith({ ...val, ...comps });
};

export default updatePackages;
