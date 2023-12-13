import useSWR from "swr";
import axios from "axios";

// Function to fetch data with authentication headers using Axios
const fetcherWithAuth = async (url, token) => {
  try {
    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        // Add any other headers you need
      },
    });

    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch data");
  }
};

// SWR hook with authentication headers using Axios
const useSWRWithAuth = (url, token) => {
  const {data, error, mutate} = useSWR([url, token], fetcherWithAuth);

  return {
    data,
    error,
    isLoading: !data && !error,
    mutate,
  };
};

export {useSWRWithAuth};
