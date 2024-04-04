import React, { useState, useEffect } from 'react';
import "../styles/Modal.css"
interface ModalProps{
    isVisible:boolean,
    setVisible:Function
}

const Modal:React.FC<ModalProps> = ({isVisible, setVisible}) => {
  
  let modal: HTMLElement | null = null;

  const buttonOnClick = () => {
    setVisible(false);
  };

  const handleClickOutside = (event: any) => {
    if(!modal){
      modal = document.getElementById("modal")
    }
    if(event.target.contains(modal)){
      setVisible(false);
    }
  };
  

  useEffect(() => {
    document.addEventListener("click", handleClickOutside)
  }, [])


    
  return (
    <div id='modal' className={isVisible ? "modal active" : "modal"}>
      <div className="modal-content">
        <h2 className='title'>Wellcome!</h2>
        <p className='paragrapgh'>
          This is my implementation of a recommendation system, using YouTube as a model. This service allows users to upload,
          update, delete, store, search, and watch videos. Additionally, users can like videos and subscribe to channels.
          Each user is assigned a different role, with two roles currently defined: default user and admin. The admin role
          grants access to the admin panel, which is discussed further below.

          When visiting the platform for the first time, there may not be any videos available. Users can either log in with
          the default user credentials, which include admin privileges, and access the admin panel to generate videos and user
          accounts, or they can upload their own videos. However, for testing purposes, it is recommended to use the first
          option (more details in the Admin Panel section below).
        <p className='paragraph'>
          The application primarily consists of three microservices:
        </p>
          <div>1) Youtback Microservice: This handles all HTTP requests and manages entities in the database.</div>
          <div> 2) Media Processor Microservice: Responsible for processing pictures and videos.</div>
          <div>3) Client side service: Allows the user to interact with the application. Written with React.</div>
          <p className='paragraph'>
          These services are connected via Kafka. When a client sends an HTTP request, such as a request to create a video,
          it is directed to the Youtback service. Youtback receives the request, creates an entity in the database, uploads 
          the received video and thumbnail to an object storage service, and sends a message through Kafka to notify the
          Media Processor service of the processing requirements. The Media Processor then downloads the original video and 
          thumbnail from the object storage service, processes them, uploads the results to the object storage service, and sends
          a response message back to Youtback. Once these steps are completed, the request is fulfilled.

          For a clearer understanding, the application architecture is provided below: 
          <p style={{textAlign:"center"}}>
            <img className='info-picture' src='architecture.png'/>
          </p>
          </p>
        </p>
        
        <p className='parahraph'>

        </p>
        <h3 className='title'>Admin panel</h3>
        <p className='paragrapgh'>
          This panel enables users to search for videos or users using multiple criteria such as the number of likes, the
          number of videos, etc. Users can create new users and videos by simply clicking on the corresponding button. The data
          for these entities will be sourced from pre-existing folders containing default videos and pictures. Every media (pictures
          and videos) will be processed, so creating will take some time (max 3 min, depends on server's hardware).
          Videos will be created immediately with a random number of likes from random users, and with a random date within the past 30 days. This setup
          simulates real-world conditions to effectively test the recommendation system.
        </p>
        <h3 className='title'>Video uploading</h3>
        <p className='paragrapgh'>
          To upload a video, click on the corresponding icon in the top right corner of the page (authentication required).
          You can then upload an MP4 file, a thumbnail, set a title, description, and category for the video. Category is a 
          required field for the recommendation system (further details below). After uploading, the video will be converted to 
          M3U8 and TS files to support HLS technology. The thumbnail will be compressed and saved in the object storage service, 
          while metadata will be stored in the database. Once the upload is complete, the video will appear in your channel's 
          videos (top right corner) or can be found by title.
        </p>
        <h3 className='title'>Recommendation system</h3>
        <p className='paragrapgh'>
          To collect data on the types of videos users are interested in, each video contains additional fields in its metadata.
          Each video is assigned a category (e.g., "music"), and when a user watches a video, the system records the number of
          videos watched within that category, referred to as points. For instance, if a user watches 50% of a video, a 
          corresponding number of points will be added. Consequently, the more points a user accumulates in a particular 
          category, the more videos of that category will be recommended. Additionally, the recommendation system considers 
          the languages preferred by the user. This logic mirrors the approach described earlier. If a user watches videos 
          without logging in, recommendations will be based on the languages detected in their browser settings. To optimize 
          performance, the system utilizes a single SQL request for each recommendation request (refer to the Javadoc for more details).
          The most recommended videos will be with the most likes. Also takes in count the date when user liked this videos in order to
          select the fastest growing videos recently. When creating video via admin panel, it will has random amount of likes from random users
          so this will make testing easier.
        </p>
        <button className='ok-button' onClick={buttonOnClick}>OK</button>
      </div>
    </div>
  );
}

export default Modal;