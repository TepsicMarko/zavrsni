const formatCommandLineArguments = (...args) => {
  let commandLineArguments = [];

  for (let i = 0; i < args.length; i++) {
    if (args[i].includes('"')) {
      let commandLineArgument = "";
      for (let j = i; j < args.length; j++) {
        commandLineArgument += " " + args[j];
        if (args[j].includes('"') && j !== i) {
          i = j - 1;
          break;
        }
      }

      commandLineArguments.push(commandLineArgument.replaceAll('"', "").trim());
      i++;
    } else {
      commandLineArguments.push(args[i]);
    }
  }

  return commandLineArguments;
};

export default formatCommandLineArguments;
