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

  // Try to extract function directly if not already a function
  if (!code.startsWith("function")) {
    const funcMatch = code.match(/(function\s+GeneratedPage[\s\S]*)/);
    if (funcMatch) {
      code = funcMatch[1].trim();
    }
  }

  // Ensure render() call exists for noInline react-live mode
  if (code.includes("function GeneratedPage") && !code.includes("render(")) {
    code += "\n\nrender(<GeneratedPage />);";
  }

  return code;
}
