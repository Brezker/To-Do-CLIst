#!/usr/bin/env node

import { program } from "commander";
import chalk from "chalk";
import inquirer from "inquirer";
import ora from "ora";
import figlet from "figlet";
import { mostrarTareasComoArbolInteractivo } from "./utils/todoist.js";
import { showTree } from "./utils/list.js"

program.version("1.0.0").description("My Node CLI");

console.log(
  chalk.yellow(figlet.textSync("My Node CLI", { horizontalLayout: "full" }))
);

async function mainMenu() {
  let exit = false;

  do {
    const { choice } = await inquirer.prompt([
      {
        type: "list",
        name: "choice",
        message: "Choose an option:",
        choices: ["📂 Gestionar tareas", "📋 Ver lista de tareas", "❌ Salir"],
      },
    ]);

    switch (choice) {
      case "📂 Gestionar tareas":
        const spinner1 = ora("Cargando tareas...").start();
        await new Promise((resolve) => setTimeout(resolve, 800));
        spinner1.succeed("Tareas cargadas");

        try {
          await mostrarTareasComoArbolInteractivo(); // 👈 espera correctamente
        } catch (err) {
          console.error(chalk.red("Error en la navegación:"), err);
        }
        break;

      case "📋 Ver lista de tareas":
        const spinner2 = ora("Cargando lista de tareas...").start();
        await new Promise((resolve) => setTimeout(resolve, 700));
        spinner2.succeed("Tareas cargadas");
        try {
          await showTree(); // 👈 espera correctamente
        } catch (err) {
          console.error(chalk.red("Error en la carga:"), err);
        }
        break;

      case "❌ Salir":
        const { confirmExit } = await inquirer.prompt([
          {
            type: "confirm",
            name: "confirmExit",
            message: "Are you sure you want to exit?",
            default: false,
          },
        ]);

        if (confirmExit) {
          const spinner3 = ora("Exiting...").start();
          setTimeout(() => {
            spinner3.succeed(chalk.blue("Goodbye!"));
          }, 1000);
          exit = true;
        } else {
          console.log(chalk.yellow("Returning to menu..."));
        }
        break;
    }

    if (!exit) {
      await new Promise((resolve) => setTimeout(resolve, 900));
    }

  } while (!exit);
}

program.action(() => {
  mainMenu();
});

program.parse(process.argv);
