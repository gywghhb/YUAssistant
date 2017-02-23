// For more information about this template visit http://aka.ms/azurebots-node-qnamaker

"use strict";
var builder = require("botbuilder");
var botbuilder_azure = require("botbuilder-azure");
var builder_cognitiveservices = require("botbuilder-cognitiveservices");

var useEmulator = (process.env.NODE_ENV == 'development');

var connector = useEmulator ? new builder.ChatConnector() : new botbuilder_azure.BotServiceConnector({
    appId: process.env['MicrosoftAppId'],
    appPassword: process.env['MicrosoftAppPassword'],
    stateEndpoint: process.env['BotStateEndpoint'],
    openIdMetadata: process.env['BotOpenIdMetadata']
});

var bot = new builder.UniversalBot(connector);

// Hardcoded ID and subscriptionKey
var recognizer = new builder_cognitiveservices.QnAMakerRecognizer({
                knowledgeBaseId: '62126a48-8de1-406b-884c-ebcb2b557746', 
    subscriptionKey: '3d8e1d67b62143898a99464928d310e7'});

var basicQnAMakerDialog = new builder_cognitiveservices.QnAMakerDialog({
    recognizers: [recognizer],
                defaultMessage: 'Oops, this question successfully exceeds my intellect. Try to ask something different, like: \n - Where can I find co-op opportunities? \n - What\'s the postal code of York University? \n - What\'s the open hour for Lassonde advisor? etc.',
                qnaThreshold: 0.3}
);




bot.dialog('/', basicQnAMakerDialog);

if (useEmulator) {
    var restify = require('restify');
    var server = restify.createServer();
    server.listen(3978, function() {
        console.log('test bot endpont at http://localhost:3978/api/messages');
    });
    server.post('/api/messages', connector.listen());    
} else {
    module.exports = { default: connector.listen() }
}
