const maliciousDomains = ['phishing.com', 'malware.test', 'badlink.org'];

function isValidUrl(url) {
  try {
    const parsedUrl = new URL(url);
    const protocol = parsedUrl.protocol;
    const hostname = parsedUrl.hostname;

    // ❌ Güvenli olmayan protokoller
    if (!['http:', 'https:'].includes(protocol)) return false;

    // ❌ Tehlikeli başlangıçlar (ör: javascript:)
    if (url.trim().toLowerCase().startsWith('javascript:')) return false;
    if (url.trim().toLowerCase().startsWith('data:')) return false;

    // ❌ Blacklist edilmiş domain kontrolü
    if (maliciousDomains.includes(hostname)) return false;

    return true;
  } catch (err) {
    return false;
  }
}

module.exports = isValidUrl;
