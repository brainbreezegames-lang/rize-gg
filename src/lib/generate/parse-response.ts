export function extractCodeFromResponse(raw: string): string {
  let code = raw;

  // Strip markdown code fences
  const fenceMatch = code.match(/```(?:tsx?|jsx?|react)?\s*\n?([\s\S]*?)```/);
  if (fenceMatch) {
    code = fenceMatch[1].trim();
  }

  // Strip import statements (ES modules)
  code = code.replace(/^import\s+.*?[;\n]/gm, "");
  // Strip require statements (CommonJS)
  code = code.replace(/^(?:const|let|var)\s+.*?=\s*require\s*\(.*?\);?\s*$/gm, "");
  code = code.replace(/^require\s*\(.*?\);?\s*$/gm, "");
  // Strip export statements but keep the content
  code = code.replace(/^export\s+default\s+/gm, "");
  code = code.replace(/^export\s+/gm, "");

  code = code.trim();

  // Convert arrow function components to regular functions
  // Matches: const Name = () => { ... } or const Name = () => ( ... )
  const arrowMatch = code.match(/(?:const|let|var)\s+([A-Z]\w*)\s*=\s*\(\s*\)\s*=>\s*/);
  if (arrowMatch) {
    const arrowName = arrowMatch[0];
    const regularName = `function ${arrowMatch[1]}() `;
    code = code.replace(arrowName, regularName);
  }

  // Find the main function — could be GeneratedPage, App, Page, etc.
  const funcNameMatch = code.match(/function\s+([A-Z]\w*)\s*\(/);
  const funcName = funcNameMatch?.[1];

  // Try to extract function directly if not already a function
  if (!code.startsWith("function") && funcName) {
    const funcMatch = code.match(new RegExp(`(function\\s+${funcName}[\\s\\S]*)`));
    if (funcMatch) {
      code = funcMatch[1].trim();
    }
  }

  // If function is NOT called GeneratedPage, rename it so LiveProvider can render it
  if (funcName && funcName !== "GeneratedPage") {
    code = code.replace(
      new RegExp(`\\bfunction\\s+${funcName}\\b`),
      "function GeneratedPage"
    );
    // Also rename any self-references (e.g. recursive renders)
    code = code.replace(
      new RegExp(`<${funcName}(\\s|\\/)`, "g"),
      "<GeneratedPage$1"
    );
  }

  // If no function was found, wrap raw JSX in a GeneratedPage function
  if (!code.match(/function\s+GeneratedPage/)) {
    // Check if there's JSX-like content (starts with < or contains JSX tags)
    const hasJSX = code.match(/^\s*</) || code.match(/<\w+[\s>]/);
    if (hasJSX) {
      code = `function GeneratedPage() {\n  return (\n    ${code}\n  );\n}`;
    }
  }

  // Strip any existing render() calls — the caller will add render()
  code = code.replace(/\n*render\s*\(\s*<\s*\w+\s*\/?\s*>\s*\)\s*;?\s*$/m, "");

  return code.trim();
}
