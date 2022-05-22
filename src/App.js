/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react-hooks/exhaustive-deps */
import "./App.css";
import { useEffect, useState } from "react";
import { Snackbar } from "@mui/material";
import axios from "axios";
import { BACKEND_API_URL } from "./env";

function App() {
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [url, setUrl] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [shortenURL, setShortenURL] = useState("");

  const handleChangeInput = async (e) => {
    setUrl(e.target.value);
    console.log(url);
  };

  const getQRCode = async () => {
    try {
      const base64Url = await axios.post(`${BACKEND_API_URL}/getUrl`, {
        url,
      });
      console.log(base64Url.data.urlQrCode);
      setQrCode(base64Url.data.urlQrCode);
      
    } catch (err) {
      console.log(err);
      setOpen(true);
      setErrorMessage(err.response.data.error.message);
    }
  };

  const shrinkUrl = async() => {
    try {
      const urlShrinkId = await axios.post(`${BACKEND_API_URL}/shortenUrl`, {
        url,
      });
      console.log(urlShrinkId.data.shortenUrl);
      setShortenURL(urlShrinkId.data.shortenUrl);
      
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    // console.log('useEffect', url);
    if (url !== "") getQRCode();
    else {
      setQrCode("");
      setShortenURL("");
    }
  }, [url]);

  return (
    <div className='qr-generator-div'>
      <Snackbar
        message={errorMessage}
        autoHideDuration={4000}
        open={open}
        onClose={() => setOpen(false)}

      />
      <h1>URL QR Code & Shortener</h1>
      <div>
        <input
          className='url-input'
          type='text'
          value={url}
          onChange={handleChangeInput}
          placeholder='Enter URL'
        />
        <button className='qr-button' onClick={shrinkUrl}>
          Shrink
        </button>
      </div>
      <img src={qrCode} />
      <a href={`${BACKEND_API_URL}/${shortenURL}`}>
        {shortenURL ? `${BACKEND_API_URL}/${shortenURL}` : ""}
      </a>
    </div>
  );
}

export default App;
