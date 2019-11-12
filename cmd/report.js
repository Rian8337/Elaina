var Discord = require("discord.js");
var config = require("../config.json");

module.exports.run = async (client, message, args) => {
    if (message.member.roles.find("name", "Member")) {
        let toreport = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        if (!toreport) return;
        let reason = args.slice(1).join(" ");
        if (!reason) {message.author.lastMessage.delete();
            message.reply("please add a reason.");
            return;
        }
        let channel = message.guild.channels.find(c => c.name === config.report_channel);
        if (!channel) {
            message.reply("please create a report log channel first!");
            return;
        }

        await message.author.lastMessage.delete();

        let reportembed = new Discord.RichEmbed()
            .setDescription(`Report by ${message.author}`)
            .setColor("#527ea3")
            .setTimestamp(new Date())
            .setFooter("React to this message upon completing report based on decision given")
            .addField("Reported user: " + toreport.user.username, "Reported in: " + message.channel)
            .addField("Reason: ", reason);

        channel.send(reportembed);

        let replyembed = new Discord.RichEmbed()
            .setTitle("Report statistics")
            .setColor("#527ea3")
            .setTimestamp(new Date())
            .setFooter("Elaina owo")
            .addField("Reported user: " + toreport.user.username, "Reported in: " + message.channel)
            .addField("Reason: " + reason, "Make sure you have evidence ready!\nAbuse of this command will result in a mute.");

        try {
            await message.author.send(replyembed);
        } catch (e) {}
    } else {
        message.channel.send("You don't have enough permission to use this :3")
    }
};

module.exports.help = {
    name: "report"
};
