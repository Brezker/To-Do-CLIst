import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import chalk from "chalk";
import inquirer from "inquirer";

export async function mostrarTareasComoArbolInteractivo() {
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

  while (true) {
    const opciones = [];
    function recorrerArbol(obj, nivel = 0, ruta = []) {
      const bullets = ["•", "◦", "▪", "▫", "‣", "⁃"];
      for (const clave in obj) {
        const indent = "  ".repeat(nivel);
        const bullet = bullets[nivel % bullets.length];
        const label = `${indent}${bullet} ${clave}`;
        const path = [...ruta, clave];
        opciones.push({ name: label, value: path });

        if (typeof obj[clave] === "object" && Object.keys(obj[clave]).length > 0) {
          recorrerArbol(obj[clave], nivel + 1, path);
        }
      }
    }

    recorrerArbol(data.todo || {});
    opciones.push(
      new inquirer.Separator(),
      { name: "➕ Agregar nueva tarea", value: "__agregar__" },
      { name: "❌ Salir", value: null }
    );

    const { seleccion } = await inquirer.prompt([
      {
        type: "list",
        name: "seleccion",
        message: "Selecciona una tarea del árbol:",
        choices: opciones,
        pageSize: 25,
      },
    ]);

    if (seleccion === "__agregar__") {
      // Seleccionar nodo padre
      const { padre } = await inquirer.prompt([
        {
          type: "list",
          name: "padre",
          message: "¿Dónde quieres agregar la nueva tarea?",
          choices: [
            { name: "📁 Nivel raíz", value: [] },
            ...opciones
              .filter((op) => op.value && op.value !== "__agregar__")
              .map((op) => ({ name: op.name, value: op.value })),
          ],
          pageSize: 25,
        },
      ]);

      // Nombre de la nueva tarea
      const { nuevaTarea } = await inquirer.prompt([
        {
          type: "input",
          name: "nuevaTarea",
          message: "Nombre de la nueva tarea:",
          validate: (input) => input.trim() !== "" || "El nombre no puede estar vacío.",
        },
      ]);

      // Insertar en el árbol
      let ref = data.todo;
      for (const key of padre) {
        ref = ref[key];
      }
      ref[nuevaTarea] = {};

      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
      console.log(chalk.green("✅ Tarea agregada correctamente."));
      continue; // volver al árbol
    }


    if (!seleccion) {
      console.log(chalk.blue("¡Hasta luego!"));
      return;
    }

    const tareaSeleccionada = seleccion.join(" > ");
    console.log(chalk.green(`📌 Tarea seleccionada: ${tareaSeleccionada}`));

    const { accion } = await inquirer.prompt([
      {
        type: "list",
        name: "accion",
        message: "¿Qué deseas hacer con esta tarea?",
        choices: [
          "✅ Marcar como completada (eliminar)",
          "✏️ Editar nombre",
          "🔙 Volver al árbol",
        ],
      },
    ]);

    if (accion === "✅ Marcar como completada (eliminar)") {
      eliminarTarea(data.todo, seleccion);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
      console.log(chalk.red("🗑️ Tarea eliminada del árbol."));
    }

    if (accion === "✏️ Editar nombre") {
      const { nuevoNombre } = await inquirer.prompt([
        {
          type: "input",
          name: "nuevoNombre",
          message: "Ingresa el nuevo nombre de la tarea:",
          default: seleccion[seleccion.length - 1],
        },
      ]);
      editarTarea(data.todo, seleccion, nuevoNombre);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
      console.log(chalk.green("✏️ Tarea editada correctamente."));
    }

    // Si elige "Volver al árbol", simplemente se repite el ciclo
  }
}

function eliminarTarea(obj, ruta) {
  for (let i = 0; i < ruta.length - 1; i++) {
    obj = obj[ruta[i]];
  }
  delete obj[ruta[ruta.length - 1]];
}

function editarTarea(obj, ruta, nuevoNombre) {
  for (let i = 0; i < ruta.length - 1; i++) {
    obj = obj[ruta[i]];
  }
  const valor = obj[ruta[ruta.length - 1]];
  delete obj[ruta[ruta.length - 1]];
  obj[nuevoNombre] = valor;
}
