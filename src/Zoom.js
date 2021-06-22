import { ZoomMtg } from "@zoomus/websdk";
import { useEffect } from "react";
import "./Zoom.css";
import "./delete.png";

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
var meetingNumber = "9204513087"; //meeting id || PMI
/* role is 0 by default [the last argument in generate signature function]
 0 => participant 
 1 => to start [host] */
//  var role = 0;
var leaveUrl = "http://localhost:3000"; //redirection url after ending session
var userName = "samiraaaaaaaaaaa";
// var userEmail = "samirasaad577@gmail.com";
var password = "123456";
var signature = "";

generateSignature(apiKey, apiSecret, meetingNumber, 0).then(
  (res) => (signature = res)
);

const Zoom = () => {
  // pass in your Zoom JWT API Key, Zoom JWT API Secret, Zoom Meeting Number, and 0 to join meeting or webinar or 1 to start meeting

  const intializeZoomMeeting = () => {
    ZoomMtg.init({
      leaveUrl: leaveUrl,
      isSupportAV: true,
      /***************************all possible *************************/
      disableCallOut: true,
      disableRecord: true,
      isSupportQA: false,
      isSupportCC: false,
      showPureSharingContent: false,
      screenShare: false,
      disableJoinAudio: false,
      audioPanelAlwaysOpen: false,
      isSupportChat: false,
      videoDrag: false,
      disableInvite: true,
      debug: true, //optional
      showMeetingHeader: false, //option
      isSupportPolling: true, //optional
      isSupportBreakout: true, //optional
      rwcBackup: "", //optional,
      sharingMode: "both", //optional,
      videoHeader: true, //optional,
      isLockBottom: true, // optional,
      isSupportNonverbal: true, // optional,
      isShowJoiningErrorDialog: true, // optional,
      disablePreview: true, // optional
      disableCORP: true, // optional
      inviteUrlFormat: "", // optional
      loginWindow: {
        // optional,
        // width: 400,
        // height: 380,
      },
      meetingInfo: [
        //the info displayed on clicking on the green sign [security icon]
        // "topic",
        // "host",
        // "mn",
        // "pwd",
        // "telPwd",
        // "invite",
        // "participant",
        // "dc",
        // "enctype",
        // "report",
      ],
      disableVoIP: false, // optional
      disableReport: false, // optional
      /********************************************************************/
      success: (success) => {
        console.log(success);
        ZoomMtg.join({
          signature: signature,
          meetingNumber: meetingNumber,
          userName: userName,
          apiKey: apiKey,
          // userEmail: userEmail,
          passWord: password,
          success: (success) => {
            console.log(success);
          },
          error: (error) => {
            console.log(error);
            if (error.errorCode === 3008) {
              console.log("the host didn't started meeting yet");
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
    // prepare needed dependencies [arrangment matters]
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
