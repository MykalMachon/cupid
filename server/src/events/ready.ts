import Client from "../utils/discordClient";

const readyEventHandler = (client: Client) => {
  console.log(`Ready! signed in as ${client.user?.username} and online`);

  // registers all the commands
  client.application?.commands.set(client.commands.map(value => value.data))
}

export default readyEventHandler;