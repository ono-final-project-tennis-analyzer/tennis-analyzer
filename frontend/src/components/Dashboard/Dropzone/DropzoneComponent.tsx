import { useState } from "react";
import { useUploadFileMutation } from "@/services/file.service.ts";
import { useNavigate } from "react-router-dom";
import { DropzoneLoadingModal } from "./DropzoneLoadingModal.tsx";
import Dropzone from "@/components/Dropzone";
import TagPlayersWhenUploadComponent from "@/components/TagPlayersWhenUploadComponent/TagPlayersWhenUploadComponent.tsx";

type DropzoneComponentProps = {
  showOnlyDragAndDrop?: boolean;
};

export const DropzoneComponent = (
  {
    // showOnlyDragAndDrop=false
  }: DropzoneComponentProps,
) => {
  const [openModal, setOpenModal] = useState(false);
  const [tagPlayersModal, setTagPlayersModal] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const navigate = useNavigate();
  
  const uploadFile = useUploadFileMutation((data) => {
    setTimeout(() => {
      setOpenModal(false);
      navigate(`/videos?event_id=${data.event_id}`);
    }, 5000);
  });

  const onUpload = (file: File) => {
    setTagPlayersModal(true);
    setFile(file);

  };

  const onSubmit = (topPlayer: number, bottomPlayer: number) => {
    if (!file) return;
    const values = {
      bottom_player_account_id: bottomPlayer,
      top_player_account_id: topPlayer,
      video: file,
    }
    uploadFile.mutate(values);
    setTagPlayersModal(false);
    setOpenModal(true);
  };

  return (
    <>
      <Dropzone onUpload={onUpload} />
      <DropzoneLoadingModal setOpened={setOpenModal} opened={openModal} />
      <TagPlayersWhenUploadComponent isOpen={tagPlayersModal} onSubmit={onSubmit} setOpenModal={setTagPlayersModal} />
    </> 
  );
};
