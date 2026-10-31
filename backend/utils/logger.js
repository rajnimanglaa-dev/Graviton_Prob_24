export const logger = {
  info(event, fields = {}) {
    console.info(JSON.stringify({ level: 'info', event, timestamp: new Date().toISOString(), ...fields }));
  },
  error(event, fields = {}) {
    console.error(JSON.stringify({ level: 'error', event, timestamp: new Date().toISOString(), ...fields }));
  }
};
