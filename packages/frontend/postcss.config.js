const Color = require("color");
const fs = require("fs");

let colors = {};
const css = fs.readFileSync("./styles/theme.css", "utf-8");

// const unwrapMatched = (matched, unwrapped) => {}

const regex = /--(?<name>.*?):\W{0,1}(?<value>.*?);/g;

// Step 1: Parse CSS variables into an object
function parseVariables(css) {
  const variables = {};
  const matches = css.matchAll(regex);

  for (const match of matches) {
    variables[match.groups.name.trim()] = match.groups.value.trim();
  }

  return variables;
}

// Step 2: Resolve variable references (unwrap them recursively)
function resolveVariable(variableName, variables, resolved = {}) {
  // If it's already resolved, return it
  if (resolved[variableName]) {
    return resolved[variableName];
  }

  let value = variables[variableName];
  if (!value) return value;
  // If the value references another variable, resolve it
  const varReferenceRegex = /var\(--(.*?)\)/;

  // Check if value contains a reference to another variable
  const match = value.match(varReferenceRegex);
  if (match) {
    const referencedVariable = match[1].trim();
    const resolvedValue = resolveVariable(
      referencedVariable,
      variables,
      resolved,
    );
    value = value.replace(varReferenceRegex, resolvedValue); // Replace reference with resolved value
  }

  // Cache the resolved value to avoid reprocessing
  resolved[variableName] = value;

  return value;
}

// Step 3: Resolve all variables and return final resolved object
function resolveAllVariables(variables) {
  const resolved = {};

  for (const variableName of Object.keys(variables)) {
    resolveVariable(variableName, variables, resolved);
  }

  return resolved;
}

// Parse and resolve all variables
const variables = parseVariables(css);
const resolvedVariables = resolveAllVariables(variables);

const getVarColor = (string) => {
  if (!string.includes("var")) return string;
  const matched = /var\(--(?<name>.*?)\)/.exec(string);
  const name = matched.groups.name;
  return resolvedVariables[name];
};

const cssnano = {
  cssnano: {
    preset: "default",
    discardComments: { removeAll: true },
  },
};

module.exports = {
  plugins: {
    "postcss-color-mod-function": {},
    ...(process.env.NODE_ENV === "production" ? cssnano : {}),
    autoprefixer: {},
    "postcss-functions": {
      functions: {
        lighten(color, amount) {
          return Color(getVarColor(color))
            .lighten(parseFloat(amount) / 100)
            .hex();
        },
        darken(color, amount) {
          return Color(getVarColor(color))
            .darken(parseFloat(amount) / 100)
            .hex();
        },
        opacify(color, amount) {
          return Color(getVarColor(color))
            .alpha(parseFloat(amount) / 100)
            .rgb()
            .string();
        },
      },
    },
  },
};
