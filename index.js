/*
 * Copyright (c) 2020 Bowser65
 * Licensed under the Open Software License version 3.0
 */

const { Plugin } = require('powercord/entities');
const { get } = require('powercord/http');

module.exports = class Urban extends Plugin {
  startPlugin () {
    powercord.api.commands.registerCommand({
      command: 'urban',
      description: 'Searches on urban dictionary and send the result, locally or in the chat',
      usage: '{c} <your search> [--send]',
      executor: this.urban.bind(this)
    });
  }

  pluginWillUnload () {
    powercord.api.commands.unregisterCommand('urban');
  }

  async urban (args) {
    let send = false;
    if (args[args.length - 1] === '--send') {
      args.pop();
      send = true;
    }
    const data = await get(`https://api.urbandictionary.com/v0/define?term=${encodeURI(args.join(' '))}`).then(r => r.body);
    if (!data.list || data.list.length === 0) {
      return {
        send: false,
        result: 'Something broke or your query returned nothing'
      };
    }

    return {
      send,
      result: `Urban definition for \`${args.join(' ')}\`:\n\`\`\`\n${data.list[0].definition}\n\`\`\`\nLink: <${data.list[0].permalink}>`
    };
  }
};
