import fs from "fs";

const generateRobotsTxt = () => {
  const robotsTxt =
    process.env.NEXT_PUBLIC_ENVIRONMENT === "prod"
      ? fs.readFileSync("./scripts/robots/robots.txt")
      : fs.readFileSync("./scripts/robots/robots.txt.non-crawlable");

  fs.writeFileSync("public/robots.txt", robotsTxt);

  console.log(
    `Generated a ${
      process.env.NEXT_PUBLIC_ENVIRONMENT === "prod"
        ? "crawlable"
        : "non-crawlable"
    } public/robots.txt`,
  );
};

(() => {
  generateRobotsTxt();
})();
