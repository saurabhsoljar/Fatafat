import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";

const uploadImage = async (image) => {
  try {
    const formData = new FormData();
    formData.append("image", image);

    const response = await Axios({
      ...SummaryApi.uploadImage,
      data: formData,
      headers: { // important for file uploads.
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data; // Return the data from the response

  } catch (error) {
    if (error.response) {
      // Server responded with an error status code
      console.error("Server error:", error.response.status, error.response.data);
      return { error: `Server error: ${error.response.status}`, details: error.response.data };
    } else if (error.request) {
      // Request was made but no response was received
      console.error("Network error:", error.request);
      return { error: "Network error: No response received." };
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Client-side error:", error.message);
      return { error: `Client-side error: ${error.message}` };
    }
  }
};

export default uploadImage;