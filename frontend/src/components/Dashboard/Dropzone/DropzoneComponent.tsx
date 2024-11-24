import { useState } from "react";
import { useUploadFileMutation } from "@/services/file.service.ts";
import { useNavigate } from "react-router-dom";
import { DropzoneLoadingModal } from "./DropzoneLoadingModal.tsx";
import Dropzone from "@/components/Dropzone";

type DropzoneComponentProps = {
  showOnlyDragAndDrop?: boolean;
};

export const DropzoneComponent = (
  {
    // showOnlyDragAndDrop=false
  }: DropzoneComponentProps,
) => {
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();
  const uploadFile = useUploadFileMutation((data) => {
    setTimeout(() => {
      setOpenModal(false);
      navigate(`/videos?event_id=${data.event_id}`);
    }, 5000);
  });

  const onUpload = (file: File) => {
    uploadFile.mutate(file);
    setOpenModal(true);
  };

  return (
    <>
      <Dropzone onUpload={onUpload} />
      <DropzoneLoadingModal setOpened={setOpenModal} opened={openModal} />
    </>
  );
};
