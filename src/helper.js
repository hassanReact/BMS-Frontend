

export function parseJWT(token) {

  if (!token) {
    return false; // No token provided
  }
  try {
    const [headerB64, payloadB64, signatureB64] = token.split('.');
    const header = JSON.parse(atob(headerB64.replace(/-/g, '+').replace(/_/g, '/')));
    const payload = JSON.parse(atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/')));
    
    // Ensure the payload is a valid JSON
    if (typeof payload !== 'object') {
      throw new Error('Decoded payload is not valid JSON');
    }

    // console.log('Decoded JWT:', { header, payload });
    return payload;
  } catch (error) {
    console.error('Error parsing JWT:', error);
    return false;
  }
}


export function tokenPayload() {
  try {
    // Get the token from localStorage (as a string, not JSON)
    const token = localStorage.getItem('$2b$10$ehdPSDmr6P');
    // console.log('Token from localStorage:', token);

    if (!token) {
      return false;
    }

    // Use parseJWT to decode the token
    return parseJWT(token);
  } catch (error) {
    console.error('Error extracting token payload:', error);
    return false; 
  }
}

