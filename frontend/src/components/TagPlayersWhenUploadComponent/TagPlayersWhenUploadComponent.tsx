import { IUserData, User } from "@/@types/User";
import { useGetAccountQuery, useMeQuery } from "@/services/accounts.service";
import { Autocomplete, Button, Card, ComboboxData, ComboboxItem, Modal, Select } from "@mantine/core";
import { Form, useForm } from "@mantine/form";
import { useEffect, useMemo } from "react";

type TagPlayersWhenUploadComponentProps = {
   onSubmit: (topPlayer: number, bottomPlayer: number) => void;
   isOpen: boolean;
   setOpenModal: (open: boolean) => void;
}

const TagPlayersWhenUploadComponent = ({ onSubmit,isOpen, setOpenModal }: TagPlayersWhenUploadComponentProps) => {


     const getAccountsSelect = useGetAccountQuery();
     const getMe = useMeQuery();

     const accountsData = useMemo(() => {
        if(!getAccountsSelect.data) return [];
        return getAccountsSelect.data.map((account: IUserData) => ({
           value: `${account.id.toString()}`,
           label: getMe.data?.id.toString() == account.id.toString() ? `${account.username} (Me)` : account.username
        })) as ComboboxData;
     }, [getAccountsSelect.data,getMe.data,isOpen]);


    const form = useForm({
        initialValues: {
            topPlayer: undefined,
            bottomPlayer: undefined,
        },
        validate: {
            topPlayer: (value) => {
                if (!accountsData.some(item => (item as ComboboxItem).value === value)) {
                    return "Top player is required";
                }
                if (value === form.values.bottomPlayer) {
                    return "Top player cannot be the same as bottom player";
                }
                return null;
            },
            bottomPlayer: (value) => {
                if (!accountsData.some(item => (item as ComboboxItem).value === value)) {
                    return "Bottom player is required";
                }
                if (value === form.values.topPlayer) {
                    return "Bottom player cannot be the same as top player";
                }
                return null;
            }
        },
    });
    
    return (
        <Modal title="Tag Players"   opened={isOpen}  onClose={()=>{
            form.reset();
            setOpenModal(false);
        }}>
           <form onSubmit={form.onSubmit((values) =>{
            if(!values.topPlayer || !values.bottomPlayer) return;
             onSubmit(values.topPlayer, values.bottomPlayer)
           })}>
            <Select key={form.key("topPlayer")} {...form.getInputProps("topPlayer")} required  name="topPlayer" label="Top Player" data={accountsData} />
            <Select key={form.key("bottomPlayer")} {...form.getInputProps("bottomPlayer")} required name="bottomPlayer" label="Bottom Player" data={accountsData} />
            <Button type="submit">Tag Players</Button>
           </form>
        </Modal>
    )
}   

export default TagPlayersWhenUploadComponent;

