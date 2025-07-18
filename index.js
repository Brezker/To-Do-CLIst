#!/usr/bin/env node

import { program } from "commander";
import chalk from "chalk";
import inquirer from "inquirer";
import ora from "ora";
import figlet from "figlet";

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
        choices: ["Option 1", "Option 2", "Option 3"],
      },
    ]);

    switch (choice) {
      case "Option 1":
        const { name } = await inquirer.prompt([
          {
            type: "input",
            name: "name",
            message: "What's your name?",
          },
        ]);
        const spinner1 = ora("Processing...").start();
        setTimeout(() => {
          spinner1.succeed(chalk.green(`Hey there, ${name}!`));
        }, 2000);
        break;

      case "Option 2":
        const { lastname } = await inquirer.prompt([
          {
            type: "input",
            name: "lastname",
            message: "What's your last name?",
          },
        ]);
        const spinner2 = ora("Processing...").start();
        setTimeout(() => {
          spinner2.succeed(chalk.hex("#ff69b4")(`Hello, Mr./Ms. ${lastname}!`));
        }, 2000);
        break;

      case "Option 3":
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
      await new Promise((resolve) => setTimeout(resolve, 2500));
    }

  } while (!exit);
}

program.action(() => {
  mainMenu();
});

program.parse(process.argv);
