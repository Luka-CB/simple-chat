const {
  addUser,
  removeUser,
  getUsers,
  getUser,
  addGroup,
  getGroups,
  removeGroup,
  updateUsers,
} = require("./utils");

module.exports = (io) => {
  io.on("connection", (socket) => {
    socket.on("addUser", (userId) => {
      if (userId) {
        addUser(userId, socket.id);
      }
      const users = getUsers();
      io.emit("getUsers", users);
    });

    socket.on("updateWindowState", (userId, chatId = "", groupId = "") => {
      updateUsers(userId, chatId, groupId);
      io.emit("getUsers", getUsers());
    });

    socket.on("sendMessage", (data) => {
      const user = getUser(data.receiverId);
      if (!user) console.log("user is not online");
      io.to(user.socketId).emit("getMessage", data);
    });

    socket.on("sendUnreadMessage", (data) => {
      const user = getUser(data.receiverId);
      if (!user) console.log("user is not online");
      io.to(user.socketId).emit("getUnreadMessage", data);
    });

    socket.on("addGroup", (groupId) => {
      if (groupId) {
        socket.join(groupId);
        addGroup(groupId);
      }
      const groups = getGroups();
      io.emit("getGroups", groups);
    });

    socket.on("sendGroupMessage", (data) => {
      io.to(data.groupId).emit("getGroupMessage", data);
    });

    socket.on("closeChat", (groupId) => {
      const groups = removeGroup(groupId);
      io.emit("getGroups", groups);
    });

    socket.on("disconnect", () => {
      removeUser(socket.id);
      const users = getUsers();
      io.emit("getUsers", users);
    });
  });
};
