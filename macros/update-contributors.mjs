import * as fs from "fs";

function parseAnimationData(markdownText) {
  const animations = [];
  const lines = markdownText.split("\n");

  const animationRegex = /^- (.+?)\s+[🔊🛠️]/;
  const creatorRegex = /✍🏼 @([^,\s)]+)/;
  const editorRegex = /🛠️ @([^,\s)]+)/;

  for (const line of lines) {
    const animation = line.match(animationRegex);
    if (animation) {
      const creatorVal = line.match(creatorRegex);
      const editorVal = line.match(editorRegex);
      const animationName = animation[1].trim();
      const creator = creatorVal?.[1] ? creatorVal[1].trim() : null;
      const editor = editorVal?.[1] ? editorVal[1].trim() : null;

      animations.push({
        name: animationName,
        creator: creator,
        editor: editor,
      });
    }
  }

  return animations;
}

function getStats(animations) {
  const stats = {
    created: {},
    edited: {},
    animations: {},
  };

  for (const animation of animations) {
    if (animation.creator) {
      stats.created[animation.creator] =
        (stats.created[animation.creator] ?? 0) + 1;
      if (!stats.animations[animation.creator]) {
        stats.animations[animation.creator] = [animation.name];
      } else {
        stats.animations[animation.creator].push(animation.name);
      }
    }

    if (animation.editor) {
      stats.edited[animation.editor] =
        (stats.edited[animation.editor] ?? 0) + 1;
    }
  }

  for (const creator in stats.animations) {
    stats.animations[creator].sort((a, b) => a.localeCompare(b));
  }

  return stats;
}

function makeData(stats) {
  let markdown = "## Animations Created\n\n";
  const creators = Object.entries(stats.created).sort((a, b) => b[1] - a[1]);

  markdown += creators
    .map(([creator, count]) => `- ${creator} - ${count} animations created\n`)
    .join("");

  return markdown;
}

function updateContributors(
  inputPath = "./ANIMATION_LIST.md",
  outputPath = "./CONTRIBUTORS.md",
) {
  try {
    const markdownText = fs.readFileSync(inputPath, "utf8");

    const animations = parseAnimationData(markdownText);
    console.log(`${animations.length} animations`);

    const stats = getStats(animations);
    console.log(`${Object.keys(stats.created).length} creators`);
    console.log(`${Object.keys(stats.edited).length} editors`);

    const contributorsData = makeData(stats);

    fs.writeFileSync(outputPath, contributorsData, "utf8");
    console.log(`Updated ${outputPath}`);

    return contributorsData;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
}

const args = process.argv.slice(2);
const inputFile = args[0] || "./ANIMATION_LIST.md";
const outputFile = args[1] || "./CONTRIBUTORS.md";

console.log(`Updating Contributors`);
updateContributors(inputFile, outputFile);
