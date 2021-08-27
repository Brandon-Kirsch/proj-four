import { getAll } from "../../client";

export const getAllDragons = () => {
    return (dispatch: (arg0: Promise<any>) => void) => {
        dispatch(getAll());
    }
}