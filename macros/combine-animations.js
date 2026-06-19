const fs = require("fs");
const path = require("path");

/**
 * Recursively get all JSON files from a directory
 * @param {string} dir - Directory to search
 * @returns {string[]} Array of file paths
 */
function getAllJsonFiles(dir) {
  if (!fs.existsSync(dir)) {
    console.log(`Directory ${dir} not found, skipping animation combination`);
    return [];
  }

  const files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getAllJsonFiles(fullPath));
    } else if (
      entry.isFile() &&
      entry.name.endsWith(".json") &&
      !entry.name.endsWith("animations.json")
    ) {
      files.push(fullPath);
    }
  }

  return files;
}
const PATH_START = "animations";
const PATH_START_BOOST = PATH_START.length + 1;
const SEGMENTS = {
  SYSTEM: 0,
  CATEGORY: 1,
  SPELL_TYPE: 2,
  FEAT_TYPE: 2,
  ATTACK_TYPE: 2,
  FEATURE_CLASS: 2,
  ITEM_TYPE: 2,
};
const CATEGORIES = {
  attacks: "Attacks",
  class_features: "Class Features",
  conditions: "Conditions",
  creature_actions: "Creature Actions",
  feats: "Feats",
  items: "Items",
  spells: "Spells",
};
function getTagsAndCategory({ path, originalTags }) {
  const tags = new Set(originalTags);
  const pathSegments = path
    .slice(path.indexOf(PATH_START) + PATH_START_BOOST)
    .split("\\");
  // System Tag
  const system = pathSegments[SEGMENTS.SYSTEM];
  tags.add(system);

  //Category
  const category = pathSegments[SEGMENTS.CATEGORY];
  tags.add(category);
  const categoryName = CATEGORIES[category];

  switch (category) {
    case "attacks":
      tags.add(pathSegments[SEGMENTS.ATTACK_TYPE]);
      break;
    case "class_features":
      tags.add(pathSegments[SEGMENTS.FEATURE_CLASS]);
      break;
    case "feats":
      tags.add(pathSegments[SEGMENTS.FEAT_TYPE]);
      break;
    case "items":
      tags.add(pathSegments[SEGMENTS.ITEM_TYPE]);
    case "spells":
      tags.add(pathSegments[SEGMENTS.SPELL_TYPE]);
      break;
    default:
      break;
  }

  return { tags: Array.from(tags), category: categoryName };
}

/**
 * Combine multiple animation JSON files into a single structure
 * @param {string} animationsDir - Directory containing animation JSON files
 * @param {string} baseFile - Path to write the combined output (optional)
 * @returns {Object} Combined animations object with {items: [], animations: []}
 */
function combineAnimations(animationsDir = "./animations", baseFile = null) {
  const base = [];

  const jsonFiles = getAllJsonFiles(animationsDir);
  console.log(`Found ${jsonFiles.length} JSON files`);

  for (const filePath of jsonFiles) {
    try {
      const content = fs.readFileSync(filePath, "utf8");
      const data = JSON.parse(content);
      const { tags, category } = getTagsAndCategory({
        path: filePath,
        originalTags: data?.tags ?? [],
      });

      // If the file itself is a animation object (has id, nodes, etc.)
      if (data.nodes && data.tags) {
        base.push(data);
        console.log(`+ ${filePath}`);
      }
    } catch (error) {
      console.error(`Error processing ${filePath}:`, error.message);
    }
  }

  console.log(`\nCombined ${base.length} files`);

  if (baseFile) {
    const baseOutputDir = path.dirname(baseFile);
    if (!fs.existsSync(baseOutputDir)) {
      fs.mkdirSync(baseOutputDir, { recursive: true });
    }

    fs.writeFileSync(baseFile, JSON.stringify(base, null, 4));
    console.log(`Written to ${baseFile}`);
  }

  return base;
}

if (require.main === module) {
  const animationsDir = process.argv[2] || "./animations";
  const baseFile = process.argv[3] || "./animations.json";

  combineAnimations(animationsDir, baseFile);
}

module.exports = { combineAnimations, getAllJsonFiles };
