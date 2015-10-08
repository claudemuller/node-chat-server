var net = require('net');

// Create server
var chatServer    = net.createServer();
    port          = 9000,
    defaultNick   = 'testNick',
    lastClientNum = 0,
    clientList    = [],
    server        = {'nick': '>'},
    helpText      = 'No help at this time\n';

// Add event listener 'connection' to the server
chatServer.on('connection', function(client) {
        // Send text to client
        client.write('> Welcome ;)\n');
        log(client.remoteAddress + '[' + client.remotePort + '] connected');

        // Set default nick
        client.nick = getDefaultNick();
        broadcast(server, client.nick + ' joined\n');

        // Add client to chatroom
        clientList.push(client);

        client.on('data', function(data) {
            // Convert buffer/byte array to string
            var clientData = data.toString();

            log(client.remoteAddress + '[' + client.remotePort + '] -> ' + clientData);

            if (/^\//.test(clientData)) {
                if (/^\/nick/.test(clientData)) {                       // if nick command
                    // Get nick from command string
                    nick = clientData.split(' ');

                    oldNick = client.nick;
                    client.nick = nick[1].trim();

                    broadcast(server, oldNick + ' is now known as ' + client.nick + '\n');
                } else if (/^\/help/.test(clientData)) {                // if help command
                    broadcast(server, helpText);
                } else if (/^\/quit/.test(clientData)) {                // if quit command
                    broadcast(server, client.nick + ' quit\n');

                    // Close connection
                    client.end();
                }
            } else {
                broadcast(client, clientData);
            }
        });
    });

chatServer.listen(port);

/**
 * Send message to all chatroom's clients
 *
 * @param string sender client's nick
 * @param string data   string to send to clients
 */
function broadcast(sender, data) {
    // Write to all clients
    for (var i = 0; i < clientList.length; i++) {
        if (sender !== clientList[i]) {
            // If server
            if (sender.nick === '>') {
                clientList[i].write(sender.nick + ' ' + data);
            } else {
                clientList[i].write(sender.nick + ': ' + data);
            }
        }
    }
}

/**
 * Create unique default nick
 *
 * @return string default nick
 */
function getDefaultNick () {
    lastClientNum++;

    return defaultNick + lastClientNum;
}

/**
 * Log to the server console
 *
 * @param string message the message to log to console
 */
function log(message) {
    console.log(message);
}

