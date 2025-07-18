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

program.action(() => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "choice",
        message: "Choose an option:",
        choices: ["Option 1", "Option 2", "Option 3"],
      },
    ])
    .then((result) => {
    //   if (result.choice === "Option 1") {
    //     inquirer
    //       .prompt([
    //         {
    //           type: "input",
    //           name: "name",
    //           message: "What's your name?",
    //         },
    //       ])
    //       .then((answers) => {
    //         const spinner = ora("Processing...").start();
    //         setTimeout(() => {
    //           spinner.succeed(chalk.green(`Hey there, ${answers.name}!`));
    //         }, 2000);
    //       });
    //   } else {
    //     const spinner = ora(`Doing ${result.choice}...`).start();
    //     setTimeout(() => {
    //       spinner.succeed(chalk.green("Done!"));
    //     }, 3000);
    //   }
        switch (result.choice) {
        case "Option 1":
          inquirer
            .prompt([
              {
                type: "input",
                name: "name",
                message: "What's your name?",
              },
            ])
            .then((answers) => {
              const spinner = ora("Processing...").start();
              setTimeout(() => {
                spinner.succeed(chalk.green(`Hey there, ${answers.name}!`));
              }, 2000);
            });
          break;

        case "Option 2":
          inquirer
            .prompt([
              {
                type: "input",
                name: "lastname",
                message: "What's your last name?",
              },
            ])
            .then((answers) => {
              const spinner = ora("Processing...").start();
              setTimeout(() => {
                spinner.succeed(chalk.hex("#ff69b4")(`Hello, Mr./Ms. ${answers.lastname}!`)); // rosa
              }, 2000);
            });
          break;

        case "Option 3":
        default:
          const spinner = ora(`Doing ${result.choice}...`).start();
          setTimeout(() => {
            spinner.succeed(chalk.blue("Done with Option 3!"));
          }, 3000);
          break;
        }
    });
});

program.parse(process.argv);
