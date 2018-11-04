import axios from "axios";
var querystring = require("querystring");

export default dispatch => {
  return {
    getVasts: async () => {
      try {
        const result = await axios.get("http://localhost:3333/fetch_vasts");

        dispatch({
          type: "GET_VASTS",
          payload: result.data
        });
      } catch (error) {
        dispatch({
          type: "VAST_ERROR",
          payload: "some error"
        });
      }
    },
    getVast: async id => {
      try {
        const result = await axios.get(
          "http://localhost:3333/fetch_vast?id=" + id
        );

        dispatch({
          type: "GET_VAST",
          payload: result.data
        });
      } catch (error) {
        dispatch({
          type: "VAST_ERROR",
          payload: "some error"
        });
      }
    },
    addVast: async data => {
      try {
        const config = {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        };
        const result = await axios.post(
          "http://localhost:3333/create_vast",
          querystring.stringify(data),
          config
        );

        dispatch({
          type: "ADD_VAST",
          payload: result.data
        });

        return result.data;
      } catch (error) {
        dispatch({
          type: "ADD_VAST",
          payload: "add vast error"
        });
      }
    }
  };
};
