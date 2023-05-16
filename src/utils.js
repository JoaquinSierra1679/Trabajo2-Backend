import path from "path";
import { fileURLToPath } from "url";

// Debemos crear nuestra propia variable __dirname a través de este método si usamos ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default __dirname;