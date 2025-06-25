const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const base = chars.length;

// Counter tabanlı Base62 encode
function encodeBase62(num) {
  let str = '';
  while (num > 0) {
    str = chars[num % base] + str;
    num = Math.floor(num / base);
  }
  return str.padStart(6, '0'); // Minimum 6 karakterlik kod
}

module.exports = encodeBase62;
