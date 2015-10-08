var net = require('net');

// Create server
var chatServer    = net.createServer();
var port          = 9000;
var defaultNick   = 'testNick';
var lastClientNum = 0;
var clientList    = [];

// Add event listener 'connection' to the server
chatServer.on('connection', function(client) {
        // Send text to client
        client.write('> Welcome ;)\n');

        // Set default nick
        client.nick = getDefaultNick();
        // Add client to chatroom
        clientList.push(client);

        client.on('data', function(data) {
            // Convert buffer/byte array to string
            var clientData = data.toString();

            if (/^\//.test(clientData)) {
                if (/^\/nick/.test(clientData)) {
                    // Get nick from command string
                    nick = clientData.split(' ');
                    clientList[clientList.indexOf(client)].nick = nick[1].trim();
                }
            } else if (clientData.trim() == 'quit') {
                broadcast('>', client.nick + ' quit\n');

                // Close connection
                client.end();
            } else {
                broadcast(client.nick, clientData);
            }
        });
    });

/**
 * Send message to all chatroom's clients
 *
 * @param string sender client's nick
 * @param string data   string to send to clients
 */
var broadcast = function(sender, data) {
    for (var i = 0; i < clientList.length; i++) {
        // write to all clients
        clientList[i].write(sender + ': ' + data);
    }
}

/**
 * Create unique default nick
 *
 * @return string default nick
 */
var getDefaultNick = function() {
    lastClientNum++;

    return defaultNick + lastClientNum;
}

chatServer.listen(port);

