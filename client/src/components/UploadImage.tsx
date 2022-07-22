import DummyProfilePic from "../assets/images/dummy-profile-pic.png";
import { AiOutlineCloseCircle } from "react-icons/ai";
import React, { useContext, useEffect, useState } from "react";
import { StateContext } from "../context/features/states";
import axios from "axios";
import { UserContext } from "../context/features/users";
import { GroupContext } from "../context/features/group";

interface propsIFace {
  avatar: string | undefined;
  type: string;
  groupId?: string;
  upload_preset: string;
}

const UploadImage: React.FC<propsIFace> = ({
  avatar,
  type,
  upload_preset,
  groupId,
}) => {
  const [image, setImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState("");
  const [url, setUrl] = useState("");
  const [publicId, setPublicId] = useState("");

  const { showUploadImageHandler } = useContext(StateContext);
  const {
    getProfile,
    updateProfileImage,
    updProfImgLoading,
    updProfImgSuccess,
    removeProfileImage,
    removeProfImgLoading,
    removeProfImgSuccess,
  } = useContext(UserContext);
  const {
    getGroup,
    updateGroupImage,
    updGroupImageLoading,
    updGroupImageSuccess,
    removeGroupImage,
    removeGroupImageLoading,
    removeGroupImageSuccess,
  } = useContext(GroupContext);

  useEffect(() => {
    if (image) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(image);
    } else {
      setPreviewImage("");
    }
  }, [image]);

  useEffect(() => {
    if (type === "user") {
      if (url && publicId) {
        updateProfileImage(url, publicId);
      }
    } else {
      if (url && groupId && publicId) {
        updateGroupImage(groupId, url, publicId);
      }
    }
  }, [url, groupId, publicId]);

  useEffect(() => {
    if (updProfImgSuccess) {
      getProfile();
      setImage(null);
      setUrl("");
    }

    if (updGroupImageSuccess) {
      if (groupId) getGroup(groupId);
      setImage(null);
      setUrl("");
    }

    if (removeProfImgSuccess) {
      getProfile();
    }

    if (removeGroupImageSuccess) {
      if (groupId) getGroup(groupId);
    }
  }, [
    updProfImgSuccess,
    updGroupImageSuccess,
    groupId,
    removeProfImgSuccess,
    removeGroupImageSuccess,
  ]);

  const uploadImage = async () => {
    const imageData = new FormData();
    if (image) imageData.append("file", image);
    imageData.append("upload_preset", upload_preset);
    imageData.append("cloud_name", "coolbonn");

    try {
      const { data } = await axios.post(
        "https://api.cloudinary.com/v1_1/coolbonn/image/upload",
        imageData
      );
      setUrl(data.url);
      setPublicId(data.public_id);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className="upload-image-bg"
      onClick={() => {
        showUploadImageHandler(false);
        setPreviewImage("");
        setImage(null);
      }}
    >
      <div
        className="upload-image-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="close-btn"
          onClick={() => {
            showUploadImageHandler(false);
            setPreviewImage("");
            setImage(null);
          }}
        >
          <AiOutlineCloseCircle id="close-icon" />
        </div>
        <div className="preview-image">
          <div className="image">
            {previewImage ? (
              <img src={previewImage} alt="Preview Image" />
            ) : avatar ? (
              <img src={avatar} alt="Avatar" />
            ) : (
              <img src={DummyProfilePic} alt="Dummy Image" />
            )}
          </div>
        </div>
        <div className="upload-image">
          <input
            type="file"
            accept="image/*"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              e.target.files !== null && setImage(e.target.files[0])
            }
          />
        </div>
        <div className="btns">
          <button
            id={!image ? "upload-disabled" : "upload"}
            onClick={uploadImage}
            disabled={!image}
          >
            {updProfImgLoading || updGroupImageLoading
              ? "Uploading..."
              : "Upload Image"}
          </button>
          <button
            id={!avatar || previewImage ? "remove-disabled" : "remove"}
            onClick={() =>
              type === "user"
                ? removeProfileImage()
                : groupId && removeGroupImage(groupId)
            }
            disabled={!avatar || previewImage !== ""}
          >
            {removeProfImgLoading || removeGroupImageLoading
              ? "Removing..."
              : "Remove Image"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadImage;
