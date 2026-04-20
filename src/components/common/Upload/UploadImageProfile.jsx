"use client";

import { useState, useEffect } from "react";
import { Image, Upload } from "antd";
import axios from "axios";
import ImgCrop from "antd-img-crop";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { BaseUrlApi } from "../../../lib/api";

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const UploadImageProfile = ({
  name = "users",
  disabled = false,
  imageUrl = "",
  onImageUploaded,
  isUploading,
}) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    if (imageUrl) {
      setFileList([
        {
          uid: "-1",
          name: "image.png",
          status: "done",
          url: imageUrl,
        },
      ]);
    }
  }, [imageUrl]);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const customRequest = async (options) => {
    const { file, onSuccess, onError, onProgress } = options;

    const formData = new FormData();
    formData.append("image", file);

    isUploading(true);

    try {
      const response = await fetch(
        `https://api.imgbb.com/1/upload?expiration=600&key=ac59dff0939d6766a3166085baf1d471`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const result = await response.json();

      const uploadedUrl = result?.data?.url || "";

      if (uploadedUrl && typeof onImageUploaded === "function") {
        onImageUploaded(uploadedUrl);
      }

      toast.success("Upload successful!");
      onSuccess(result, file);
    } catch (error) {
      toast.error("Upload failed.");
      onError?.(error);
    } finally {
      isUploading(false);
    }
  };

  const uploadButton = (
    <button
      style={{ border: 0, background: "none" }}
      type="button"
      className={"flex flex-col items-center justify-center"}
    >
      <Plus />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  return (
    <>
      <ImgCrop rotationSlider>
        <Upload
          customRequest={customRequest}
          listType="picture-circle"
          fileList={fileList}
          onPreview={handlePreview}
          onChange={handleChange}
          maxCount={1}
          disabled={disabled}
          type="image"
        >
          {fileList.length >= 1 ? null : uploadButton}
        </Upload>
      </ImgCrop>
      {previewImage && (
        <Image
          className="z-50"
          wrapperStyle={{ display: "none" }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(""),
          }}
          src={previewImage || "/placeholder.svg"}
        />
      )}
    </>
  );
};

export default UploadImageProfile;
