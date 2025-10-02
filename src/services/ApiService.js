import { BASE_ENDPOINT } from "../constants.js";

export async function fetchPoetData(author, title, setPoetData, setError, setLoading) {
  setLoading(true);
  try {
    const response = await callApi(author, title);
    if (response.data.status === 404) {
      setError("No record found. Please check your spelling or try another author/title.");
      throw new Error(`HTTP error! status: ${response.data.status}`);
    } else if (response.errorOccurred) {
      setError("An error occurred while fetching data. Please try again later.");
      throw new Error(`HTTP error! status: ${response.data.status}`);
    } else {
      setError(null);
    }
    setPoetData(response.data);
    setLoading(false);
  } catch (error) {
    console.error("Error in fetchPoetData:", error);
    if (!error.message.includes("404")) {
      setError("An error occurred while fetching data. Please try again later.");
    }
    setLoading(false);
  }
}

export async function fetchRandomPoem(setPoetData, setError, setLoading) {
  setLoading(true);
  try {
    const response = await callApi();
    if (response.data.status === 404) {
      setError("No record found. Please check your spelling or try another author/title.");
      throw new Error(`HTTP error! status: ${response.data.status}`);
    } else if (response.errorOccurred) {
      setError("An error occurred while fetching data. Please try again later.");
      throw new Error(`HTTP error! status: ${response.data.status}`);
    } else {
      setError(null);
    }
    setPoetData(response.data);
    setLoading(false);
  } catch (error) {
    console.error("Error in fetchRandomPoem:", error);
    if (!error.message.includes("404")) {
      setError("An error occurred while fetching data. Please try again later.");
    }
    setLoading(false);
  }
} 

export async function callApi(author, title) {
  let errorOccurred = false;
  let data = null;

  try {
      let endpoint = BASE_ENDPOINT;

      if (author && title) {
          const encodedAuthor = encodeURIComponent(author);
          const encodedTitle = encodeURIComponent(title);
          endpoint += `/author,title/${encodedAuthor};${encodedTitle}`;
      }
      else if (author) {
          const encodedAuthor = encodeURIComponent(author);
          endpoint += `/author/${encodedAuthor}`;
      }
      else if (title) {
          const encodedTitle = encodeURIComponent(title);
          endpoint += `/title/${encodedTitle}`;
      } else {
          endpoint += "/random";
      }

      const response = await fetch(endpoint);
      if (!response.ok) {
        errorOccurred = true;
        console.error("HTTP error:", response.status, response.statusText);
      }
      data = await response.json();
      if (data.status && data.status === 404) {
        errorOccurred = true;
        console.error("Error: No record found. Please check your spelling or try another author/title.");
      }
  }
  catch (error) {
      console.error("Error making API call:");
      if (error instanceof Error) {
        console.error("Message:", error.message);
      }
      else {
        console.error("Unknown error:", error);
      }
  }

  return {
    errorOccurred,
    error: data && data.status,
    data,
  }
}