
const { Server } = require('socket.io');
const Chat = require('../models/chat');

const initializeSocket = (server) => {
    // console.log("initialized")

    const io = new Server(server, {
        cors:
        {
            origin: "http://localhost:5173",
            credentials: true,
        }
    });



    io.on("connection", (socket) => {
        socket.on("joinChat", ({ userId, targetUserId }) => {

            const roomId = [userId, targetUserId].sort().join("_");
            socket.join(roomId)
            // console.log(roomId)
        });


        socket.on("sendMessage", async ({ firstName, userId, targetUserId, text }) => {


            // save message in the DB.
            try {
                const roomId = [userId, targetUserId].sort().join("_");
                console.log(firstName + " : " + text)

                let chat = await Chat.findOne({
                    participants: { $all: [userId, targetUserId] }
                });

                if (!chat) {
                    chat = new Chat({
                        participants: [userId, targetUserId], message: []
                    })
                }


                chat.messages.push({
                    senderId: userId,
                    text,
                })

                await chat.save();
                io.to(roomId).emit("messageReceived", { firstName, text });
            }
            catch (err) {
                console.log(err.message);
            }


        })
    })
    // console.log("ended")

}

module.exports = initializeSocket;