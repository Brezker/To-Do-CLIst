// list.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import chalk from "chalk";

export function showTree() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const filePath = path.join(__dirname, "..", "data", "todo.json");

  if (!fs.existsSync(filePath)) {
    console.log(chalk.red("❌ El archivo todo.json no existe."));
    return;
  }

  const contenido = fs.readFileSync(filePath, "utf8");

  if (!contenido.trim()) {
    console.log(chalk.yellow("⚠️ El archivo todo.json está vacío."));
    return;
  }

  const data = JSON.parse(contenido);

  function imprimirArbol(obj, nivel = 0) {
    const bullets = ["•", "◦", "▪", "▫", "‣", "⁃"];
    for (const clave in obj) {
      const indent = "  ".repeat(nivel);
      const bullet = bullets[nivel % bullets.length];
      console.log(chalk.green(`${indent}${bullet} ${clave}`));

      if (typeof obj[clave] === "object" && Object.keys(obj[clave]).length > 0) {
        imprimirArbol(obj[clave], nivel + 1);
      }
    }
  }

  console.log(chalk.blue("\n📋 Lista de tareas:\n"));
  imprimirArbol(data.todo || {});
}
