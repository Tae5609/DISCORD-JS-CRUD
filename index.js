const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const db = require('quick.db')

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", async message => {
    if (!message.content.startsWith(config.prefix) || message.author.bot) return;

    const args = message.content.slice(config.prefix.length).trim().split(' ');
    const command = args.shift().toLowerCase();

    if (command == 'create') {
        let content = args.join(' ');
        if (!content) return message.channel.send('Please put specific content as arguments.');

        let id = await db.fetch('counter') + 1;
        await db.set('counter', id);
        
        await db.set(`content_${id}`, content)
        return message.channel.send(`Success fully added content.\nid : ${id}\ncontent : ${content}`); // kuy 
    }

    if (command == 'fetch') {
        let to_fetch = await db.get('counter');
        let result = [];
        for (i = 1;i <= to_fetch; i++) {
            let item = db.get(`content_${i}`);
            if (!item) item = 'deleted';
            result.push(`[${i}] => ${item}`);
        }
        return message.channel.send(result.join('\n'));
    }

    if (command == 'delete') {
        let id = args[0];
        if (!id) return message.channel.send('Please specific id of content.');
        await db.delete(`content_${id}`);
        return message.channel.send('Successfully delete content id : ' + id);
    }

    if (command == 'edit') {
        let to_edit = args.join(' ').replace(`${args[0]} `, '');
        let id = args[0];

        if (!id) return message.channel.send('Please specific id of content.')
        if (!to_edit) return message.channel.send('Pleace specific content to edit.')

        await db.set(`content_${id}`, to_edit);
        return message.channel.send('Successfully edit content.')
    }
});

client.login(config.token);
