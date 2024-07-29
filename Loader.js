import React from "react";
// import { Spinner } from "react-bootstrap";
import {
  //   BeatLoader,
  //   CircleLoader,
  //   BounceLoader,
    ClipLoader,
  // FadeLoader,
  //   GridLoader,
  //   HashLoader, 
  //   PropagateLoader,
  //   PulseLoader,
  //   RingLoader,
  //   RiseLoader,
  //   ScaleLoader,
  //   SyncLoader,
  //   RotateLoader,
} from "react-spinners";
function Loader() {
  return (
    <>
      <div className="d-flex justify-content-center align-items-center vh-5">
        <span className="visually-hidden">Loading...</span>

        {/* from react-bootstrap */}
        {/* <Spinner annimation='border' variant='primary' size='lg' />  */}

        {/* from react-spinners */}
        <ClipLoader color="blue" size={50} />

        {/* 
      <p>BeatLoader...<BeatLoader color="#ff0000" size={20} /></p><br />
      <CircleLoader color="#0000ff" size={20} />
      <BounceLoader color="#00ff00" size={20} />
      <RotateLoader color="#ff0000" size={20} />
      <SyncLoader color="#ff0000" size={20} />
      <ScaleLoader color="#ff0000" size={20} />
      <RiseLoader color="#ff0000" size={20} />
      <RingLoader color="#ff0000" size={20} />
      <PulseLoader color="#ff0000" size={20} />
      <PropagateLoader color="#ff0000" size={20} />
      <HashLoader color="#ff0000" size={20} />
      <GridLoader color="#ff0000" size={20} />
      <FadeLoader color="#ff0000" size={20} />
      <ClipLoader color="#ff0000" size={20} /> */}
      </div>
    </>
  );
}

export default Loader;
