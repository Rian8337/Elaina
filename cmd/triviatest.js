var fs = require('fs')
const config = require("../config.json");

function shuffle(input) {
    var temp; var rpick;
    for (var i = 0; i < input.length*2; i++) {
        rpick = parseInt(Math.floor(Math.random() * input.length))
        temp = input[rpick];
        input[rpick] = input[i % input.length];
        input[i % input.length] = temp;
    }
}

function categoryRandomSelect() {
    var total = 0;
    for (i in config.question_weight) {
        total += config.question_weight[i];
    }
    var number = Math.floor(Math.random()*total);
    //console.log(number);
    var current = 0;
    for (i in config.question_weight) {
        current += config.question_weight[i];
        if (number < current) return parseInt(i);
    }
    return -1;
}

module.exports.run = (client, message, args) => {
    var submitted_answer = [];
    var start = Date.now();
    //console.log(start);
    client.on("message", (reply) => {
        if (reply.channel == message.channel) submitted_answer.push([reply.author.id, reply.content, (reply.createdTimestamp - start) / 1000]);
    })
    var category = categoryRandomSelect()
    console.log(category)
    var category_name = "";
    var question_dir = "";
    if (!isNaN(parseInt(args[0]))) category = parseInt(args[0]);
    switch (category) {
        case 0: question_dir = 'trivia/animal.txt'; category_name = 'Animals'; break;    
        case 1: question_dir = 'trivia/animemanga.txt'; category_name = 'Entertainment: Japanese Anime & Manga'; break; 
        case 2: question_dir = 'trivia/art.txt'; category_name = 'Art'; break;
        case 3: question_dir = 'trivia/boardgame.txt'; category_name = 'Entertainment: Board Games'; break;
        case 4: question_dir = 'trivia/cartoon.txt'; category_name = 'Entertainment: Cartoon & Animations'; break;  
        case 5: question_dir = 'trivia/book.txt'; category_name = 'Entertainment: Books'; break; 
        case 6: question_dir = 'trivia/celeb.txt'; category_name = 'Celebrities'; break;  
        case 7: question_dir = 'trivia/comic.txt'; category_name = 'Entertainment: Comics'; break;  
        case 8: question_dir = 'trivia/computer.txt'; category_name = 'Science: Computers'; break; 
        case 9: question_dir = 'trivia/film.txt'; category_name = 'Entertainment: Film'; break; 
        case 10: question_dir = 'trivia/gadget.txt'; category_name = 'Science: Gadgets'; break;  
        case 11: question_dir = 'trivia/general.txt'; category_name = 'General Knowledge'; break; 
        case 12: question_dir = 'trivia/geography.txt'; category_name = 'Geography'; break;  
        case 13: question_dir = 'trivia/history.txt'; category_name = 'History'; break;
        case 14: question_dir = 'trivia/math.txt'; category_name = 'Science: Mathematics'; break;  
        case 15: question_dir = 'trivia/music.txt'; category_name = 'Entertainment: Music'; break; 
        case 16: question_dir = 'trivia/myth.txt'; category_name = 'Mythology'; break;  
        case 17: question_dir = 'trivia/science.txt'; category_name = 'Science & Nature'; break;
        case 18: question_dir = 'trivia/sport.txt'; category_name = 'Sports'; break;   
        case 19: question_dir = 'trivia/television.txt'; category_name = 'Entertainment: Television'; break; 
        case 20: question_dir = 'trivia/test.txt'; category_name = 'Test'; break;
        case 21: question_dir = 'trivia/theater.txt'; category_name = 'Entertainment: Musicals & Theatres'; break;  
        case 22: question_dir = 'trivia/vehicle.txt'; category_name = 'Vehicles'; break;  
        case 23: question_dir = 'trivia/videogame.txt'; category_name = 'Entertainment: Video Games'; break; 
        default: message.channel.send("Unknown type"); return;
    }
	fs.readFile(question_dir , 'utf8', (err, data) => {
        var all_question = data.split('\n');
        if (parseInt(args[1])) var pick = all_question[parseInt(args[1]) - 1]
        else var pick = all_question[parseInt(Math.floor(Math.random() * all_question.length))];
        if (pick) var component = pick.split(" | ");
        else return;
        var difficulty = parseInt(component[0]);
        var type = parseInt(component[1]);
        var img_link = component[2];
        var question = component[3];
        if (type === 1) {
            var correct_answer = component[4];
            var correct_index
            var answer = [];
            for (var i = 4; i < component.length; i++) answer.push(component[i]);
            shuffle(answer);
            for (var i = 0; i < answer.length; i++) if (answer[i] == correct_answer) { correct_index = i; break; }
            var answer_string = ""
            for (var i = 0; i < answer.length; i++) answer_string += String.fromCharCode(65+i) + ". " + answer[i] + "\n";
            var embed = {
                "description": difficulty + "★ - " + category_name + " Question" ,
				"color": 8102199,
				"author": {
					"name": "Trivia Question",
					"icon_url": "https://image.frl/p/beyefgeq5m7tobjg.jpg"
				},
				"fields": [
					{
						"name": question,
						"value": answer_string
					}
				]
            }
            if (img_link && img_link != "-") embed["image"]["url"] = img_link;
            message.channel.send({embed});
            embed = {
                "description": "The correct answer is " + String.fromCharCode(65+correct_index) + ". " + correct_answer,
                "color": 8102199
            }
            setTimeout(() => {
                answerCheck(String.fromCharCode(65+correct_index));
                message.channel.send({embed})
            }, 5000 + (difficulty * 2000))
        }

        else if (type === 2) {
            var correct_answer = component[4];
            var embed = {
                "description": difficulty + "★ - " + category_name + " Question" ,
                "color": 8102199,
                "image" : {
                    "url" : ""
                },
				"author": {
					"name": "Trivia Question",
					"icon_url": "https://image.frl/p/beyefgeq5m7tobjg.jpg"
				},
				"fields": [
					{
						"name": question,
						"value": "Please type out your answer (case insensitive)"
					}
				]
            }
            if (img_link && img_link != "-") embed["image"]["url"] = img_link;
            message.channel.send({embed});
            embed = {
                "description": "The correct answer is " + correct_answer,
                "color": 8102199
            }
            setTimeout(() => {
                answerCheck(correct_answer);
                message.channel.send({embed})
            }, 7000 + (difficulty * 3000))
        }

        function answerCheck(answer) {
            var correct_user = [];
            submitted_answer.shift();
            submitted_answer.sort((a, b) => {
                return (a[0] - b[0] == 0)? a[2] - b[2] : a[0] - b[0];
            })
            for (var i = 1; i < submitted_answer.length; i++) {
                if (submitted_answer[i][0] == submitted_answer[i-1][0]) {submitted_answer.splice(i-1, 1); i--;}
            }
            for (var i = 0; i < submitted_answer.length; i++) {
                if (submitted_answer[i][1].toLowerCase() == answer.toLowerCase()) correct_user.push(submitted_answer[i])
            }
            correct_user.sort((a, b) => {
                return a[2] - b[2];
            })
            //console.table(submitted_answer);
            //console.table(correct_user);
            if (!correct_user[0]) {
                var embed = {
                    "description": "Look like no one got that right.",
                    "color": 16773120
                }
                message.channel.send({embed})
            }
            else {
                var output = 'Hey someone got that correctly\n';
                for (i in correct_user) {
                    output += client.users.get(correct_user[i][0]).username + " - " + correct_user[i][2] + "s \n";
                }
                var embed = {
                    "description": output,
                    "color": 8102199
                }
                message.channel.send({embed})
            }
        }
    })
}

module.exports.help = {
	name: "triviatest"
}