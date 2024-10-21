export function parseErrorString(errorString) {
  const errorObject = {};

  // Split by comma to get individual error messages
  const errorMessages = errorString.substr(24).split(", ");

  errorMessages.forEach(message => {
    // Split each message into field and error
    const [field, errorMessage] = message.split(": ");

    switch (field) {
      case "username":
        errorObject[field.trim()] = errorMessage
        break;
      case "email":
        errorObject[field.trim()] = errorMessage
        break;
      case "phone":
        errorObject[field.trim()] = errorMessage
        break;
      case "password":
        errorObject[field.trim()] = "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    }
  });

  return errorObject;
}

export const fetcher = (...args) => fetch(...args).then(res => res.json())

export function removeStopWords(text, stopWordsList) {
  const words = text.toLowerCase().split(/\W+/); // Split into words, ignoring punctuation
  const filteredWords = words.filter(word => !stopWordsList.includes(word));
  return filteredWords.join(' ');
}

export const getGoogleImageUrls = async (query, numImages = 3) => {
  const apiKey = process.env.GOOGLE_API_KEY;
  const searchEngineId = process.env.SEARCH_ENGINE_ID;
  const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${query}&searchType=image&num=${numImages}`;

  const response = await fetch(url);
  const data = await response.json();
  if (!data.items) return [];
  return data.items.map(item => item.link);
}

export const extractFileName = urlString => {
  const parsedURL = new URL(urlString);
  return parsedURL.pathname.split('/').pop().split('.').shift();
}