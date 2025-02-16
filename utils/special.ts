export default function decodeUrlString(encodedString: string) {
    const urlMappings = {
        '%24': '$',
        '%25': '%',
        '%26': '&',
        '%20': ' ',
        '%21': '!',
        '%22': '"',
        '%27': "'",
        '%28': '(',
        '%29': ')',
        '%2B': '+',
        '%2C': ',',
        '%2F': '/',
        '%3A': ':',
        '%3B': ';',
        '%3D': '=',
        '%3F': '?',
        '%40': '@',
        '%5B': '[',
        '%5D': ']',
    };

    let decodedString = encodedString;
    for (const [encoded, decoded] of Object.entries(urlMappings)) {
        decodedString = decodedString.replace(new RegExp(encoded, 'g'), decoded);
    }

    return decodedString;
}