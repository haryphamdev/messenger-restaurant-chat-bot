import request from "request";

require("dotenv").config();

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

let getFacebookUsername = (sender_psid) => {
    return new Promise((resolve, reject) => {
        // Send the HTTP request to the Messenger Platform
        let uri = `https://graph.facebook.com/${sender_psid}?fields=first_name,last_name,profile_pic&access_token=${PAGE_ACCESS_TOKEN}`;
        request({
            "uri": uri,
            "method": "GET",
        }, (err, res, body) => {
            if (!err) {
                //convert string to json object
                body = JSON.parse(body);
                let username = `${body.last_name} ${body.first_name}`;
                resolve(username);
            } else {
                reject("Unable to send message:" + err);
            }
        });
    });
};

let sendResponseWelcomeNewCustomer = (username, sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response_first = { "text": `Welcome ${username} to HaryPhamDev's Restaurant` };
            let response_second = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "generic",
                        "elements": [
                            {
                                "title": "HaryPhamDev 's restaurant",
                                "subtitle": "My restaurant is legendary, its classic wine collection equally so.",
                                "image_url": "https://bit.ly/imageToSend",
                                "buttons": [
                                    {
                                        "type": "postback",
                                        "title": "SHOW MAIN MENU",
                                        "payload": "MAIN_MENU",
                                    }
                                ],
                            } ]
                    }
                }
            };

            //send a welcome message
            await sendMessage(sender_psid, response_first);

            //send a image with button view main menu
            await sendMessage(sender_psid, response_second);

            resolve("done!")
        } catch (e) {
            reject(e);
        }

    });
};

let sendMainMenu = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "generic",
                        "elements": [
                            {
                                "title": "Our menus",
                                "subtitle": "We are pleased to offer you a wide-range of menu for lunch or dinner.",
                                "image_url": "https://bit.ly/imageMenu",
                                "buttons": [
                                    {
                                        "type": "postback",
                                        "title": "LUNCH MENU",
                                        "payload": "LUNCH_MENU",
                                    },
                                    {
                                        "type": "postback",
                                        "title": "DINNER MENU",
                                        "payload": "DINNER_MENU",
                                    },
                                    {
                                        "type": "postback",
                                        "title": "PUB MENU",
                                        "payload": "PUB_MENU",
                                    }
                                ],
                            },

                            {
                                "title": "Hours",
                                "subtitle": "MON-FRI 10AM - 11PM  | SAT 5PM - 10PM | SUN 5PM - 9PM",
                                "image_url": " https://bit.ly/imageOpening",
                                "buttons": [
                                    {
                                        "type": "postback",
                                        "title": "RESERVE A TABLE",
                                        "payload": "RESERVE_TABLE",
                                    }
                                ],
                            },

                            {
                                "title": "Banquet Rooms",
                                "subtitle": "My restaurant 's accommodates up to 300 seated guests and similar at cocktail receptions",
                                "image_url": " https://bit.ly/imageShowRooms",
                                "buttons": [
                                    {
                                        "type": "postback",
                                        "title": "SHOW ROOMS",
                                        "payload": "SHOW_ROOMS",
                                    }
                                ],
                            }


                        ]
                    }
                }
            };

            //send a welcome message
            await sendMessage(sender_psid, response);
        } catch (e) {
            reject(e);
        }
    });

};

let sendLunchMenu = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "generic",
                        "elements": [

                            {
                                "title": "Appetizers",
                                "image_url": "https://bit.ly/imageAppetizer",
                                "buttons": [
                                    {
                                        "type": "postback",
                                        "title": "SHOW APPETIZERS",
                                        "payload": "SHOW_APPETIZERS",
                                    }
                                ],
                            },

                            {
                                "title": "Entree Salad",
                                "image_url": "https://bit.ly/imageSalad",
                                "buttons": [
                                    {
                                        "type": "postback",
                                        "title": "SHOW ENTREE SALAD",
                                        "payload": "SHOW_ENTREE_SALAD",
                                    }
                                ],
                            },

                            {
                                "title": "Fish and Shell Fish",
                                "image_url": "https://bit.ly/imageFish",
                                "buttons": [
                                    {
                                        "type": "postback",
                                        "title": "SHOW FISH",
                                        "payload": "SHOW_FISH",
                                    }
                                ],
                            },

                            {
                                "title": "Skeens Classics",
                                "subtitle": "and Dry-aged on Premise",
                                "image_url": "https://bit.ly/imageClassics",
                                "buttons": [
                                    {
                                        "type": "postback",
                                        "title": "SHOW CLASSICS",
                                        "payload": "SHOW_CLASSICS",
                                    }
                                ],
                            },

                            {
                                "title": "Go back",
                                "image_url": " https://bit.ly/imageToSend",
                                "buttons": [
                                    {
                                        "type": "postback",
                                        "title": "BACK TO MAIN MENU",
                                        "payload": "BACK_TO_MAIN_MENU",
                                    }
                                ],
                            }
                        ]
                    }
                }
            };

            //send a welcome message
            await sendMessage(sender_psid, response);
        } catch (e) {
            reject(e);
        }
    });
};

let sendDinnerMenu = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "generic",
                        "elements": [
                            {
                                "title": "Appetizers",
                                "image_url": "https://bit.ly/imageMenu",
                                "buttons": [
                                    {
                                        "type": "postback",
                                        "title": "SHOW APPETIZERS",
                                        "payload": "SHOW_APPETIZERS",
                                    }
                                ],
                            },

                            {
                                "title": "Entree Salad",
                                "image_url": " https://bit.ly/imageOpening",
                                "buttons": [
                                    {
                                        "type": "postback",
                                        "title": "SHOW ENTREE SALAD",
                                        "payload": "SHOW_ENTREE_SALAD",
                                    }
                                ],
                            },

                            {
                                "title": "Go back",
                                "image_url": " https://bit.ly/imageToSend",
                                "buttons": [
                                    {
                                        "type": "postback",
                                        "title": "BACK TO MAIN MENU",
                                        "payload": "BACK_TO_MAIN_MENU",
                                    }
                                ],
                            }

                        ]
                    }
                }
            };

            //send a welcome message
            await sendMessage(sender_psid, response);
        } catch (e) {
            reject(e);
        }
    });
};

let sendPubMenu = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "generic",
                        "elements": [
                            {
                                "title": "Appetizers",
                                "image_url": "https://bit.ly/imageMenu",
                                "buttons": [
                                    {
                                        "type": "postback",
                                        "title": "SHOW APPETIZERS",
                                        "payload": "SHOW_APPETIZERS",
                                    }
                                ],
                            },

                            {
                                "title": "Entree Salad",
                                "image_url": " https://bit.ly/imageOpening",
                                "buttons": [
                                    {
                                        "type": "postback",
                                        "title": "SHOW ENTREE SALAD",
                                        "payload": "SHOW_ENTREE_SALAD",
                                    }
                                ],
                            },

                            {
                                "title": "Fish and Shell Fish",
                                "image_url": " https://bit.ly/imageShowRooms",
                                "buttons": [
                                    {
                                        "type": "postback",
                                        "title": "SHOW FISH",
                                        "payload": "SHOW_FISH",
                                    }
                                ],
                            },

                            {
                                "title": "Go back",
                                "image_url": " https://bit.ly/imageToSend",
                                "buttons": [
                                    {
                                        "type": "postback",
                                        "title": "BACK TO MAIN MENU",
                                        "payload": "BACK_TO_MAIN_MENU",
                                    }
                                ],
                            }
                        ]
                    }
                }
            };

            //send a welcome message
            await sendMessage(sender_psid, response);
        } catch (e) {
            reject(e);
        }
    });
};

let sendMessage = (sender_psid, response) => {
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
        console.log(res);
        console.log(body)
        if (!err) {
            console.log('message sent!')
        } else {
            console.error("Unable to send message:" + err);
        }
    });
};

module.exports = {
    getFacebookUsername: getFacebookUsername,
    sendResponseWelcomeNewCustomer: sendResponseWelcomeNewCustomer,
    sendMainMenu: sendMainMenu,
    sendLunchMenu: sendLunchMenu,
    sendDinnerMenu: sendDinnerMenu,
    sendPubMenu: sendPubMenu
};