export const config = {
  db: {
    uri: 'mongodb://127.0.0.1:27017/taskly_test',
  },
  logs: {
    toFile: true,
    json: true,
    level: 'info',
  },
};
