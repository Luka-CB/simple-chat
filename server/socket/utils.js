let users = [];
let groups = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUsers = () => {
  return users;
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

const addGroup = (groupId) => {
  !groups.some((group) => group.id === groupId) && groups.push({ id: groupId });
};

const getGroups = () => groups;

const removeGroup = (groupId) => {
  groups = groups.filter((group) => group.id !== groupId);
  return groups;
};

module.exports = {
  addUser,
  removeUser,
  getUsers,
  getUser,
  addGroup,
  getGroups,
  removeGroup,
};
