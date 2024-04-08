import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { BACKEND_URL } from "../../config";
import ImageCropperModal from "../Modals/ImageCropperModal";

import { deleteFile, uploadFile } from "../../utils/mediaHandlers";
import { useDispatch, useSelector } from "react-redux";
import {
  addSinglePhoto,
  deleteSinglePhoto,
  profileComplete,
} from "../../redux/apiCalls/apiCalls";
import { toast } from "react-toastify";


const UploadPhotos = ({
  currentStage,
  setCurrentStage,
  userData,
  setUserData,
}) => {
  const [photos, setPhotos] = useState(Array(6).fill(null));

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPhoto, setCurrentPhoto] = useState(null);

  const [currentImg, setCurrentImg] = useState("");
  const [currentInd, setCurrentInd] = useState("");
  const [photoToDelete, setPhotoToDelete] = useState("");

  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const currentUser = useSelector(
    (state) => state?.user?.currentUser?.data?.user
  );
  const completeUser = useSelector((state) => state?.user?.currentUser);
  const dispatch = useDispatch();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 500); // Adjust the delay time as needed

    return () => clearTimeout(timer);
  }, []); // Run only once on component mount

  const handlePhotoUpload = async (e, index) => {
    const selectedPhoto = e.target.files[0];
    setCurrentPhoto(selectedPhoto);
    setIsModalOpen(true);
    const newPhotos = [...photos];
    if (currentUser?.email && photos[index] == null) {
      await uploadFile(
        e,
        selectedPhoto,
        `profile/${currentUser?.email}`,
        setCurrentImg
      );
      setCurrentInd(index);
      newPhotos[index] = currentImg;
      setPhotos(newPhotos);
    } else return;
  };

  useEffect(() => {
    currentImg != "" &&
      addSinglePhoto(dispatch, currentImg, currentInd, completeUser);
    setCurrentImg("");
  }, [currentImg, dispatch]);

  useEffect(() => {
    const newPhotos = [...photos];
    currentUser?.photosLink.forEach((photo) => {
      newPhotos[photo.index] = photo.photoLink;
      setPhotos(newPhotos);
    });
  }, [currentUser?.photosLink]);

  const handleDeletePhoto = async (e, index) => {
    const newPhotos = [...photos];
    setPhotoToDelete(newPhotos[index]);
    if (currentUser?.email && photos[index] != null) {
      await deleteFile(e, photoToDelete);
      newPhotos[index] = null;
      setPhotos(newPhotos);
    }
  };

  useEffect(() => {
    photoToDelete !== "" &&
      deleteSinglePhoto(dispatch, photoToDelete, completeUser);
  }, [photoToDelete]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    if (photos[0] == null) {
      toast("Add Profile Photo");
      return;
    }
    profileComplete(dispatch, userData, completeUser, navigate);
  };
  useEffect(() => {
    userData;
  }, [userData]);

  return (
    <div
      className={`fixed top-0 right-0 bottom-0 left-0 z-50 bg-pink-100 bg-opacity-50 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      } flex justify-center items-center transition-opacity duration-500`}
    >
      <ImageCropperModal
        isOpen={isModalOpen}
        onRequestClose={() => {
          setIsModalOpen(false);
        }}
        imageSrc={currentPhoto}
        setImageSrc={setCurrentPhoto}
      />
      <div className="max-w-xl w-full p-4 bg-white mt-10 rounded-lg shadow-md">
        <h2 className="text-lg font-bold mb-4">
          Don&apos;t be shy, upload some photos
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {/* Big box */}
          <div className="relative col-span-2 row-span-2 aspect-w-4 aspect-h-5 overflow-hidden rounded-lg">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handlePhotoUpload(e, 0)}
              className="hidden"
              id={`photo-upload-0`}
            />
            <label
              htmlFor={`photo-upload-0`}
              className="flex items-center justify-center w-full h-full border border-dashed cursor-pointer relative"
            >
              {!photos[0] && <span className="text-4xl">+</span>}
              {photos[0] && (
                <>
                  <img
                    src={photos[0]}
                    alt={`Uploaded Photo 1`}
                    className="object-cover w-full h-full rounded-lg"
                  />
                  <button
                    className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full"
                    onClick={(e) => handleDeletePhoto(e, 0)}
                  >
                    X
                  </button>
                </>
              )}
            </label>
          </div>
          {/* Small boxes */}
          {photos.slice(1).map((photo, index) => (
            <div
              key={index + 1}
              className="relative aspect-w-4 aspect-h-5 overflow-hidden rounded-lg"
            >
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handlePhotoUpload(e, index + 1)}
                className="hidden"
                id={`photo-upload-${index + 1}`}
              />
              <label
                htmlFor={`photo-upload-${index + 1}`}
                className="flex items-center justify-center w-full h-full border border-dashed cursor-pointer relative"
              >
                {!photo && <span className="text-4xl">+</span>}
                {photo && (
                  <>
                    <img
                      src={photo}
                      alt={`Uploaded Photo ${index + 2}`}
                      className="object-cover w-full h-full rounded-lg"
                    />
                    <button
                      className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full z-10"
                      onClick={(e) => handleDeletePhoto(e, index + 1)}
                    >
                      X
                    </button>
                  </>
                )}
              </label>
            </div>
          ))}
        </div>
        <button
          onClick={() => setCurrentStage(currentStage - 1)}
          className="flex items-center justify-center bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded mt-2"
        >
          Back
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 ml-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
        <button
          onClick={(e) => handleSubmit(e)}
          className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded mt-4"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default UploadPhotos;
