import React, { useState, useEffect } from "react";
import { useHttp } from "../hooks/http.hook";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useHistory } from "react-router-dom";

export const CreatePage = () => {
  const history = useHistory();
  const auth = useContext(AuthContext);
  const [link, setLink] = useState("");
  const { request } = useHttp();

  useEffect(() => {
    window.M.updateTextFields();
  }, []);

  const pressHandler = async (event) => {
    if (event.key === "Enter") {
      try {
        const data = await request(
          "/api/link/generate",
          "POST",
          { from: link },
          { Authorization: `Bearer ${auth.token}` }
        );
        console.log("data.link._id: ", data);
        history.push(`/detail/${data.link._id}`);
      } catch (e) {
        // console.log("Error: ", e);
      }
    }
  };

  return (
    <div className="row">
      <div className="col s8 offset-s2" style={{ paddingTop: "2rem" }}>
        <div className="input-field">
          <input
            placeholder="Input a link"
            id="link"
            type="text"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            onKeyPress={pressHandler}
          />
          <label htmlFor="link">Enter a link</label>
        </div>
      </div>
    </div>
  );
};
