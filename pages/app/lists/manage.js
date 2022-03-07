import { useState } from "react";
import AddListForm from "../../../components/forms/AddListForm";
import ManageLprListTable from "../../../components/tables/ManageLprListTable";
import ManageAllListsToolbar from "../../../components/toolbars/ManageAllListsToolbar";

export default function manage() {
    const [addList, setAddList] = useState(false)
    return (
        <div>
            <ManageAllListsToolbar addList={addList} setAddList={setAddList} />
            <div className="mt-4">
               { !addList ?
               ( <ManageLprListTable  />)
                :
               (<AddListForm />)
               }
            </div>
        </div>
    )
}
