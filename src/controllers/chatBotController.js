require("dotenv").config();
import request from "request";
import moment from "moment";
import chatBotService from "../services/chatBotService";

const MY_VERIFY_TOKEN = process.env.MY_VERIFY_TOKEN;
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

let user = {
    name: "",
    phoneNumber: "",
    time: "",
    quantity: "",
    createdAt: ""
};

let postWebhook = (req, res) => {
    // Parse the request body from the POST
    let body = req.body;

    // Check the webhook event is from a Page subscription
    if (body.object === 'page') {

        // Iterate over each entry - there may be multiple if batched
        body.entry.forEach(function(entry) {

            // Gets the body of the webhook event
            let webhook_event = entry.messaging[0];
            console.log(webhook_event);


            // Get the sender PSID
            let sender_psid = webhook_event.sender.id;
            console.log('Sender PSID: ' + sender_psid);

            // Check if the event is a message or postback and
            // pass the event to the appropriate handler function
            if (webhook_event.message) {
                handleMessage(sender_psid, webhook_event.message);
            } else if (webhook_event.postback) {
                handlePostback(sender_psid, webhook_event.postback);
            }

        });

        // Return a '200 OK' response to all events
        res.status(200).send('EVENT_RECEIVED');

    } else {
        // Return a '404 Not Found' if event is not from a page subscription
        res.sendStatus(404);
    }
};

let getWebhook = (req, res) => {
    // Your verify token. Should be a random string.
    let VERIFY_TOKEN = MY_VERIFY_TOKEN;

    // Parse the query params
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    // Checks if a token and mode is in the query string of the request
    if (mode && token) {

        // Checks the mode and token sent is correct
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {

            // Responds with the challenge token from the request
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);

        } else {
            // Responds with '403 Forbidden' if verify tokens do not match
            res.sendStatus(403);
        }
    }
};

// Handles messages events
let handleMessage = async (sender_psid, message) => {
    //checking quick reply
    if (message && message.quick_reply && message.quick_reply.payload) {
        if (message.quick_reply.payload === "SMALL" || message.quick_reply.payload === "MEDIUM" || message.quick_reply.payload === "LARGE") {
            //asking about phone number
            user.quantity = "1-2";
            await chatBotService.sendMessageAskingPhoneNumber(sender_psid);
            return;
        }
        // pay load is a phone number
        if (message.quick_reply.payload !== " ") {
            //done
            user.phoneNumber = message.quick_reply.payload;
            user.createdAt = moment(Date.now()).zone("+07:00").format('MM/DD/YYYY HH:mm A');
            await chatBotService.sendMessageDoneReserveTable(sender_psid);
            await chatBotService.sendNotificationToTelegram(user);
        }
        return;
    }

    //handle text message
    let entity = handleMessageWithEntities(message);

    if (entity.name === "datetime") {
        //handle quick reply message: asking about the party size , how many people
        user.time = moment(entity.value).zone("+07:00").format('MM/DD/YYYY HH:mmA');
        await chatBotService.sendMessageAskingQuality(sender_psid);
    } else if (entity.name === "phone_number") {
        //handle quick reply message: done reserve table
        user.phoneNumber = entity.value;
        await chatBotService.sendMessageDoneReserveTable(sender_psid);
        await chatBotService.sendNotificationToTelegram(user);
    } else {
        //default reply
    }

    //handle attachment message
};

let handleMessageWithEntities = (message) => {
    let entitiesArr = [ "datetime", "phone_number" ];
    let entityChosen = "";
    let data = {}; // data is an object saving value and name of the entity.
    entitiesArr.forEach((name) => {
        let entity = firstEntity(message.nlp, name);
        if (entity && entity.confidence > 0.8) {
            entityChosen = name;
            data.value = entity.value;
        }
    });

    data.name = entityChosen;
    return data;
};

function firstEntity(nlp, name) {
    return nlp && nlp.entities && nlp.entities[name] && nlp.entities[name][0];
}

// Handles messaging_postbacks events
let handlePostback = async (sender_psid, received_postback) => {
    let response;
    // Get the payload for the postback
    let payload = received_postback.payload;
    // Set the response based on the postback payload
    switch (payload) {
        case "GET_STARTED":
            //get facebook username
            let username = await chatBotService.getFacebookUsername(sender_psid);
            user.name = username;
            //send welcome response to users
            await chatBotService.sendResponseWelcomeNewCustomer(username, sender_psid);
            break;
        case "MAIN_MENU":
            //send main menu to users
            await chatBotService.sendMainMenu(sender_psid);
            break;
        case "LUNCH_MENU":
            await chatBotService.sendLunchMenu(sender_psid);
            break;
        case "DINNER_MENU":
            await chatBotService.sendDinnerMenu(sender_psid);
            break;
        case "PUB_MENU":
            await chatBotService.sendPubMenu(sender_psid);
            break;
        case "RESERVE_TABLE":
            await chatBotService.handleReserveTable(sender_psid);
            break;
        case "SHOW_ROOMS":
            break;
        case "SHOW_APPETIZERS":
            await chatBotService.sendAppetizer(sender_psid);
            break;
        case "BACK_TO_MAIN_MENU":
            await chatBotService.goBackToMainMenu(sender_psid);
            break;
        case "BACK_TO_LUNCH_MENU":
            await chatBotService.goBackToLunchMenu(sender_psid);
            break;

        case "yes":
            response = { text: "Thank you!" };
            callSendAPI(sender_psid, response);
            break;
        case "no":
            response = { text: "Please try another image." };
            callSendAPI(sender_psid, response);
            break;
        default:
            console.log("Something wrong with switch case payload");
    }
    // Send the message to acknowledge the postback
    // callSendAPI(sender_psid, response);
};

// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {
    // Construct the message body
    let request_body = {
        "recipient": {
            "id": sender_psid
        },
        "message": response
    };

    // Send the HTTP request to the Messenger Platform
    request({
        "uri": "https://graph.facebook.com/v6.0/me/messages",
        "qs": { "access_token": PAGE_ACCESS_TOKEN },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        if (!err) {
            console.log('message sent!')
        } else {
            console.error("Unable to send message:" + err);
        }
    });
}

module.exports = {
    postWebhook: postWebhook,
    getWebhook: getWebhook
};
