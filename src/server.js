export const getDistance = async (zip_code1, zip_code2) => {
    const apiUrl = `https://www.zipcodeapi.com/rest/DemoOnly005WAiQLaCFldZDxPzzPDPmrhRa0wgn8E6GTSi64QSy8kt8XTqqsSmln/distance.json/${zip_code1}/${zip_code2}/km`;
  
    try {
      // Use fetch to get the data from the API
      const response = await fetch(apiUrl);
  
      // Check if the response is ok (status code 200-299)
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
  
      // Parse the JSON data from the response
      const data = await response.json();
  
      // Return the JSON data
      return data;
    } catch (error) {
      // Handle and log any errors
      console.error('Error fetching distance data:', error);
      return { error: error.message };
    }
};