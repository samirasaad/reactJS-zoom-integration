import { ZoomMtg } from "@zoomus/websdk";
import { useEffect } from "react";
import "./Zoom.css";

const crypto = require("crypto"); // crypto comes with Node.js

const generateSignature = (apiKey, apiSecret, meetingNumber, role) => {
  return new Promise((res, err) => {
    // Prevent time sync issue between client signature generation and zoom
    const timestamp = new Date().getTime() - 30000;
    const msg = Buffer.from(apiKey + meetingNumber + timestamp + role).toString(
      "base64"
    );
    const hash = crypto
      .createHmac("sha256", apiSecret)
      .update(msg)
      .digest("base64");
    const signature = Buffer.from(
      `${apiKey}.${meetingNumber}.${timestamp}.${role}.${hash}`
    ).toString("base64");
    res(signature);
  });
};

// var signatureEndpoint = "http://localhost:4000";
var apiKey = "Nx07NGyTSHysw1WqAUTMdQ";
var apiSecret = "Y278SuDoSfCdYPnWcDWmA2cs5jGgH3v9wIEM";
var meetingNumber = "89656471814"; //meeting id
/* role is 0 by default [the last argument in generate signature function]
 0 => participant 
 1 => to start [host] */
//  var role = 0;
var leaveUrl = "http://localhost:3000"; //redirection url
var userName = "React";
var userEmail = "samirasaad577@gmail.com";
var password = "80Fhpp";
var signature = '';
generateSignature(apiKey, apiSecret, meetingNumber, 0).then(res=>signature = res)

const Zoom = () => {
  // pass in your Zoom JWT API Key, Zoom JWT API Secret, Zoom Meeting Number, and 0 to join meeting or webinar or 1 to start meeting
//   console.log(
//     generateSignature(process.env.API_KEY, process.env.API_SECRET, 123456789, 0)
//   );

  const intializeZoomMeeting = () => {
    ZoomMtg.init({
      leaveUrl: leaveUrl,
      isSupportAV: true,
      success: (success) => {
        console.log(success);

        ZoomMtg.join({
          signature: signature,
          meetingNumber: meetingNumber,
          userName: userName,
          apiKey: apiKey,
          userEmail: userEmail,
          passWord: password,
          success: (success) => {
            console.log(success);
        },
        error: (error) => {
            console.log(error);
            if(error.errorCode === 3008){
                console.log('the host didnot started meeting yet')
            }
          },
        });
      },
      error: (error) => {
        console.log(error);
      },
    });
  };
  useEffect(() => {
    displayZoomContainer();
    // prepare needed dependencies
    ZoomMtg.setZoomJSLib("https://source.zoom.us/1.9.5/lib", "/av");
    ZoomMtg.preLoadWasm();
    ZoomMtg.prepareJssdk();
    intializeZoomMeeting();
  }, []);

  const displayZoomContainer = () => {
    document.getElementById("zmmtg-root").style.display = "block";
  };
  return <span>zoom</span>;
};

export default Zoom;
