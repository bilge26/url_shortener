function isValidUrl(url) {
  try {
    const parsedUrl = new URL(url);
    return ['http:', 'https:'].includes(parsedUrl.protocol);
  } catch (err) {
    return false;
  }
}

module.exports = isValidUrl;
